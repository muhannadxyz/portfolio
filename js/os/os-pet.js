// Pet App - Tamagotchi-style mini companion
const PetApp = (function() {
  const STORAGE_KEY = 'os_pet_state';
  const WIDGET_POS_KEY = 'os_pet_widget_pos';
  const ROAMING_POS_KEY = 'os_pet_roam_pos';

  const DEFAULT_STATE = {
    name: 'Byte',
    ageMinutes: 0,
    hunger: 85,       // 0..100 (100 = full)
    happiness: 85,    // 0..100
    energy: 80,       // 0..100
    cleanliness: 90,  // 0..100
    sleeping: false,
    activity: null,   // { type: 'eat'|'play'|'clean'|'sleep', startedAt:number, until:number } | null
    lastTick: Date.now()
  };

  // Roaming pet state
  let roamX = 100;
  let roamY = 200;
  let roamVX = 2;
  let roamVY = 1;
  let roamFrame = 0;
  let lastRoamTime = 0;
  let roamDragging = false;
  let roamDragMoved = false;
  let roamDragOffsetX = 0;
  let roamDragOffsetY = 0;
  let roamPinned = false;
  const ROAM_SPEED = 1.5; // Faster movement speed
  const SPRITE_SIZE = 84; // Size of the roaming pet sprite (28 cols * 3 scale)

  let widgetEl = null;
  let widgetCtx = null;
  let roamingPetEl = null;
  let roamingCanvas = null;
  let roamingCtx = null;
  let tickerInterval = null;
  let windowRenderHook = null;
  let animRaf = null;
  let liveState = null;

  function clamp01_100(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    try {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...parsed };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getState() {
    if (!liveState) {
      liveState = catchUpState(loadState());
      saveState(liveState);
    }
    return liveState;
  }

  function setState(next) {
    liveState = next;
    saveState(liveState);
    renderWidget(liveState);
    if (typeof windowRenderHook === 'function') windowRenderHook(liveState);
  }

  function computeMood(state) {
    const score = (state.hunger + state.happiness + state.energy + state.cleanliness) / 4;
    if (state.sleeping) return { label: 'Sleeping', mood: 'sleep' };
    if (score >= 85) return { label: 'Vibing', mood: 'happy' };
    if (score >= 70) return { label: 'Chillin', mood: 'ok' };
    if (score >= 50) return { label: 'Meh', mood: 'meh' };
    if (score >= 30) return { label: 'Stressed', mood: 'sad' };
    return { label: 'Crisis', mood: 'panic' };
  }

  function notifyIfNeeded(state) {
    if (!window.NotificationSystem) return;
    const lows = [];
    if (state.hunger <= 25) lows.push('Hungry');
    if (state.happiness <= 25) lows.push('Bored');
    if (state.energy <= 25) lows.push('Tired');
    if (state.cleanliness <= 25) lows.push('Dirty');

    if (lows.length > 0) {
      window.NotificationSystem.warning(
        `${state.name} needs you`,
        `${lows.join(', ')}. Open Pet to help.`,
        3500
      );
    }
  }

  function tick(state, elapsedMs) {
    const minutes = elapsedMs / 60000;
    if (minutes <= 0) return state;

    // Aging
    state.ageMinutes = Math.max(0, (state.ageMinutes || 0) + minutes);

    // Needs decay
    const hungerDecay = state.sleeping ? 1.0 : 2.2;
    const happinessDecay = state.sleeping ? 0.6 : 1.6;
    const cleanlinessDecay = state.sleeping ? 0.5 : 1.1;
    const energyDecay = state.sleeping ? -3.0 : 2.0; // sleeping restores energy

    state.hunger = clamp01_100(state.hunger - hungerDecay * minutes);
    state.happiness = clamp01_100(state.happiness - happinessDecay * minutes);
    state.cleanliness = clamp01_100(state.cleanliness - cleanlinessDecay * minutes);
    state.energy = clamp01_100(state.energy - energyDecay * minutes);

    // Auto-wake if fully rested
    if (state.sleeping && state.energy >= 98) {
      state.sleeping = false;
    }

    return state;
  }

  function catchUpState(state) {
    const now = Date.now();
    const elapsed = Math.max(0, now - (state.lastTick || now));
    const next = tick(state, elapsed);
    next.lastTick = now;
    return next;
  }

  function formatAge(state) {
    const total = Math.floor(state.ageMinutes || 0);
    const h = Math.floor(total / 60);
    const m = total % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  function makeStatBar(label, value, color) {
    return `
      <div style="margin-bottom: 10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div style="color:#ffb6c1; font-size:13px; font-weight:600;">${label}</div>
          <div style="color:#ff69b4; font-size:12px;">${value}%</div>
        </div>
        <div style="height:8px; background: rgba(255,105,180,0.1); border-radius:999px; overflow:hidden; border:1px solid rgba(255,105,180,0.2);">
          <div style="height:100%; width:${value}%; background:${color}; border-radius:999px; transition: width 0.3s ease;"></div>
        </div>
      </div>
    `;
  }

  function dotColor(v) {
    if (v >= 70) return 'rgba(255,105,180,0.95)';  // Hot pink - healthy
    if (v >= 40) return 'rgba(255,182,193,0.85)';  // Light pink - okay
    if (v >= 25) return 'rgba(255,160,122,0.85)';  // Light salmon - warning
    return 'rgba(255,99,71,0.9)';                   // Tomato - critical
  }

  // --- Tamagotchi-style pixel sprite renderer ---
  // Sprite maps are 16x16. Characters:
  // 'X' outline, 'B' body, 'E' eye, 'M' mouth, 'F' food, 'P' pink body, 'W' white highlight
  // New cute pink creature sprite based on user's image
  const SPRITES = {
    idle1: [
      '..XX........XX..',
      '.XPPX......XPPX.',
      'XPPPPX....XPPPPX',
      'XPPPPXX..XXPPPPX',
      '.XPPPPXXXXPPPPX.',
      '..XPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPX',
      'XPPPEWPPPPWEPPPP',
      'XPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPX',
      'XPPPPPMMMMPPPPPX',
      '.XPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPX..',
      '..XPX..XPPX..XPX',
      '..XX....XX....XX'
    ],
    idle2: [
      '..XX........XX..',
      '.XPPX......XPPX.',
      'XPPPPX....XPPPPX',
      'XPPPPXX..XXPPPPX',
      '.XPPPPXXXXPPPPX.',
      '..XPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPX',
      'XPPP..PPPPPP..PX',
      'XPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPX',
      'XPPPPP....PPPPPX',
      '.XPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPX..',
      '...XPX..XPX.....',
      '...XX....XX.....'
    ],
    eat1: [
      '..XX........XX..',
      '.XPPX......XPPX.',
      'XPPPPX....XPPPPX',
      'XPPPPXX..XXPPPPX',
      '.XPPPPXXXXPPPPX.',
      '..XPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPX',
      'XPPPEWPPPPWEPPPP',
      'XPPPPPPPPPPPPPPX',
      'XPPPPPFMFMPPPPPX',
      'XPPPPPFFFFPPPPPX',
      '.XPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPX..',
      '..XPX..XPPX..XPX',
      '..XX....XX....XX'
    ],
    eat2: [
      '..XX........XX..',
      '.XPPX......XPPX.',
      'XPPPPX....XPPPPX',
      'XPPPPXX..XXPPPPX',
      '.XPPPPXXXXPPPPX.',
      '..XPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPX',
      'XPPP..PPPPPP..PX',
      'XPPPPPPPPPPPPPPX',
      'XPPPPPMMMMPPPPPX',
      'XPPPPPFFFPPPPPPX',
      '.XPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPX..',
      '...XPX..XPX.....',
      '...XX....XX.....'
    ],
    sleep1: [
      '..XX........XX..',
      '.XPPX......XPPX.',
      'XPPPPX....XPPPPX',
      'XPPPPXX..XXPPPPX',
      '.XPPPPXXXXPPPPX.',
      '..XPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPX',
      'XPPP--PPPPPP--PX',
      'XPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPX',
      'XPPPPP....PPPPPX',
      '.XPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPX..',
      '..XPX......XPXX.',
      '..XX........XX..'
    ],
    walk1: [
      '..XX........XX..',
      '.XPPX......XPPX.',
      'XPPPPX....XPPPPX',
      'XPPPPXX..XXPPPPX',
      '.XPPPPXXXXPPPPX.',
      '..XPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPX',
      'XPPPEWPPPPWEPPPP',
      'XPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPX',
      'XPPPPPMMMMPPPPPX',
      '.XPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPX..',
      '.XPX......XPPX..',
      '.XX........XX...'
    ],
    walk2: [
      '..XX........XX..',
      '.XPPX......XPPX.',
      'XPPPPX....XPPPPX',
      'XPPPPXX..XXPPPPX',
      '.XPPPPXXXXPPPPX.',
      '..XPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPX',
      'XPPPEWPPPPWEPPPP',
      'XPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPX',
      'XPPPPPMMMMPPPPPX',
      '.XPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPX..',
      '..XPPX......XPX.',
      '...XX........XX.'
    ]
  };

  // Roaming sprite (larger, for desktop walking)
  // Characters: X=outline, P=pink body, E=eye white, W=eye dark, M=mouth, F=food, Z=zzz, S=sparkle, H=heart
  const ROAMING_SPRITES = {
    walk1: [
      '....XXXX............XXXX....',
      '...XPPPPX..........XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPEWPPPPPPPPPPPPPPWEPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPMMMMMMMMPPPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.....XPPPPPPPPPPPPPPPPX.....',
      '....XPPX..........XPPPPX....',
      '...XPPX............XPPX.....',
      '...XX................XX.....'
    ],
    walk2: [
      '....XXXX............XXXX....',
      '...XPPPPX..........XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPEWPPPPPPPPPPPPPPWEPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPMMMMMMMMPPPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.....XPPPPPPPPPPPPPPPPX.....',
      '....XPPPPX..........XPPX....',
      '.....XPPX............XPPX...',
      '.....XX................XX...'
    ],
    idle: [
      '....XXXX............XXXX....',
      '...XPPPPX..........XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPEWPPPPPPPPPPPPPPWEPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPMMMMMMMMPPPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.....XPPPPPPPPPPPPPPPPX.....',
      '....XPPX..........XPPX......',
      '....XX..............XX......',
      '............................'
    ],
    // Eating animation - mouth open with food
    eat1: [
      '....XXXX............XXXX....',
      '...XPPPPX..........XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPEWPPPPPPPPPPPPPPWEPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPFFFFPPPPPPPPPPPPX',
      'XPPPPPPPPMM....MMPPPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.....XPPPPPPPPPPPPPPPPX.....',
      '....XPPX..........XPPX......',
      '....XX..............XX......',
      '............................'
    ],
    eat2: [
      '....XXXX............XXXX....',
      '...XPPPPX..........XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPP--PPPPPPPPPPPPPP--PPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPMMMMMMMMPPPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.....XPPPPPPPPPPPPPPPPX.....',
      '....XPPX..........XPPX......',
      '....XX..............XX......',
      '............................'
    ],
    // Sleeping animation - closed eyes, Zzz
    sleep1: [
      '....XXXX............XXXX....',
      '...XPPPPX..........XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPP--PPPPPPPPPPPPPP--PPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPP......PPPPPPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.....XPPPPPPPPPPPPPPPPX.....',
      '....XPPX..........XPPX......',
      '....XX..............XX..ZZZ.',
      '..........................Z.'
    ],
    sleep2: [
      '....XXXX............XXXX....',
      '...XPPPPX..........XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPP--PPPPPPPPPPPPPP--PPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPP......PPPPPPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.....XPPPPPPPPPPPPPPPPX..ZZ.',
      '....XPPX..........XPPX...Z..',
      '....XX..............XX......',
      '............................'
    ],
    // Playing animation - happy bouncing with sparkles
    play1: [
      '..S.XXXX............XXXX.S..',
      '...XPPPPX..........XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPEWPPPPPPPPPPPPPPWEPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPMMMMMMMMMMMMPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.....XPPPPPPPPPPPPPPPPX.....',
      '...XPPX..........XPPPPX.....',
      '..XPPX............XPPX......',
      '..XX................XX......'
    ],
    play2: [
      '....XXXX............XXXX....',
      '...XPPPPX....S.....XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPEWPPPPPPPPPPPPPPWEPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPMMMMMMMMMMMMPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.....XPPPPPPPPPPPPPPPPX.....',
      '.....XPPPPX..........XPPX...',
      '......XPPX............XPPX..',
      '......XX................XX..'
    ],
    // Cleaning animation - sparkles around
    clean1: [
      '.S..XXXX............XXXX..S.',
      '...XPPPPX..........XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPEWPPPPPPPPPPPPPPWEPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPMMMMMMMMPPPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.S...XPPPPPPPPPPPPPPPPX...S.',
      '....XPPX..........XPPX......',
      '....XX..............XX......',
      '............................'
    ],
    clean2: [
      '....XXXX......S.....XXXX....',
      '...XPPPPX..........XPPPPX...',
      '..XPPPPPPX........XPPPPPPX..',
      '..XPPPPPPXX......XXPPPPPPX..',
      '...XPPPPPPXXXXXXPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPP--PPPPPPPPPPPPPP--PPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPPPPPPPPPPPPPPPPPPPX',
      'XPPPPPPPPMMMMMMMMPPPPPPPPPPX',
      '.XPPPPPPPPPPPPPPPPPPPPPPPPX.',
      '..XPPPPPPPPPPPPPPPPPPPPPPX..',
      '...XPPPPPPPPPPPPPPPPPPPPX...',
      '....XPPPPPPPPPPPPPPPPPPX....',
      '.....XPPPPPPPPPPPPPPPPX.....',
      '....XPPX..........XPPX..S...',
      '....XX..............XX......',
      '.S..........................'
    ]
  };

  // Pink palette for the cute pet
  const PINK_PALETTE = {
    'X': '#2d1b3d',      // Dark purple outline
    'P': '#ff69b4',      // Hot pink body
    'E': '#ffffff',      // Eye white
    'W': '#2d1b3d',      // Eye pupil (same as outline for closed look)
    'M': '#ff1493',      // Deep pink mouth/smile
    'F': '#ffd700',      // Food (golden)
    '-': '#2d1b3d',      // Closed eyes (sleeping)
    'Z': '#87ceeb',      // Zzz (light blue for sleep)
    'S': '#ffff00',      // Sparkle (yellow)
    'H': '#ff69b4',      // Heart (pink)
    '.': null            // Transparent
  };

  function drawTamaBackground(ctx) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    // Pastel checker/diamond vibe
    const colors = ['#ffe4ec', '#ffd6e7', '#ffb6c1', '#ffc0cb'];
    const step = Math.max(6, Math.floor(Math.min(w, h) / 8));
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = ((x / step) + (y / step)) % colors.length;
        ctx.fillStyle = colors[idx];
        ctx.fillRect(x, y, step, step);
      }
    }
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for (let y = -h; y < h * 2; y += step * 2) {
      ctx.fillRect(0, y, w, 2);
    }
  }

  function drawSprite(ctx, sprite, x, y, scale, palette) {
    for (let row = 0; row < sprite.length; row++) {
      const line = sprite[row];
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        const color = palette[ch];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
      }
    }
  }

  function drawRoamingSprite(ctx, sprite, x, y, scale, palette, flipX = false) {
    ctx.save();
    if (flipX) {
      ctx.translate(x + sprite[0].length * scale, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }
    for (let row = 0; row < sprite.length; row++) {
      const line = sprite[row];
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        const color = palette[ch];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
      }
    }
    ctx.restore();
  }

  function loadRoamPos() {
    const raw = localStorage.getItem(ROAMING_POS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function saveRoamPos() {
    localStorage.setItem(
      ROAMING_POS_KEY,
      JSON.stringify({ x: roamX, y: roamY, vx: roamVX, vy: roamVY, pinned: !!roamPinned })
    );
  }

  function getCurrentActivity(state, now) {
    if (!state.activity) return null;
    if (!state.activity.until || now >= state.activity.until) return null;
    return state.activity;
  }

  function syncRoamPinnedFromStorage() {
    const savedPos = loadRoamPos();
    if (savedPos && typeof savedPos.pinned === 'boolean') {
      roamPinned = savedPos.pinned;
    }
  }

  function setRoamPinned(nextPinned) {
    roamPinned = !!nextPinned;
    saveRoamPos();
  }

  function toggleRoamPinned() {
    setRoamPinned(!roamPinned);
    return roamPinned;
  }

  function drawPetScreen(ctx, state, nowMs = Date.now()) {
    if (!ctx) return;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, w, h);

    drawTamaBackground(ctx);

    // Choose sprite frame
    const activity = getCurrentActivity(state, nowMs);
    const isEating = activity && activity.type === 'eat';
    const isSleeping = state.sleeping;
    const frame = Math.floor(nowMs / 220) % 2;
    
    let sprite;
    if (isSleeping) {
      sprite = SPRITES.sleep1;
    } else if (isEating) {
      sprite = frame === 0 ? SPRITES.eat1 : SPRITES.eat2;
    } else {
      sprite = frame === 0 ? SPRITES.idle1 : SPRITES.idle2;
    }

    const scale = Math.max(2, Math.floor(Math.min(w, h) / 24));
    const sx = Math.floor((w - 16 * scale) / 2);
    const sy = Math.floor((h - 16 * scale) / 2);

    // Drop shadow
    ctx.fillStyle = 'rgba(255,105,180,0.25)';
    ctx.beginPath();
    ctx.ellipse(sx + 8 * scale, sy + 17 * scale, 6 * scale, 2 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    drawSprite(ctx, sprite, sx, sy, scale, PINK_PALETTE);
  }

  function createTamagotchiDevice({ width = 220, height = 170, screenW = 96, screenH = 72, forWidget = false } = {}) {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      border-radius: ${forWidget ? '22px' : '26px'};
      background: radial-gradient(circle at 30% 30%, rgba(255,182,193,0.25), transparent 55%), linear-gradient(135deg, rgba(255,105,180,0.15), rgba(25,25,35,0.95));
      border: 1px solid rgba(255,105,180,0.3);
      box-shadow: 0 16px 60px rgba(0,0,0,0.55), 0 0 30px rgba(255,105,180,0.1);
      position: relative;
      overflow: hidden;
    `;

    const top = document.createElement('div');
    top.style.cssText = 'padding: 10px 12px 6px; display:flex; justify-content:space-between; align-items:center;';
    top.innerHTML = `
      <div style="color:#ff69b4; font-weight:900; letter-spacing:0.4px; font-size:${forWidget ? '11px' : '12px'};">TAMAPET</div>
      <div class="pet-device-name" style="color:#ffb6c1; font-weight:800; font-size:${forWidget ? '11px' : '12px'}; max-width:${forWidget ? '100px' : '140px'}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"></div>
    `;

    const screenFrame = document.createElement('div');
    screenFrame.style.cssText = `
      width: ${screenW + 18}px;
      height: ${screenH + 18}px;
      margin: 0 auto;
      border-radius: 14px;
      background: rgba(0,0,0,0.5);
      border: 1px solid rgba(255,105,180,0.25);
      box-shadow: inset 0 0 0 1px rgba(255,105,180,0.1);
      display:flex;
      align-items:center;
      justify-content:center;
    `;

    const canvas = document.createElement('canvas');
    canvas.width = screenW;
    canvas.height = screenH;
    canvas.style.cssText = 'image-rendering: pixelated; width: 100%; height: 100%; border-radius: 10px; background: #1a1a2e;';
    screenFrame.appendChild(canvas);

    const buttons = document.createElement('div');
    buttons.style.cssText = 'position:absolute; left: 0; right: 0; bottom: 12px; display:flex; justify-content:center; gap: 14px;';
    buttons.innerHTML = `
      <div style="width: 14px; height: 14px; border-radius: 999px; background: rgba(255,105,180,0.25); border: 1px solid rgba(255,105,180,0.35);"></div>
      <div style="width: 14px; height: 14px; border-radius: 999px; background: rgba(255,105,180,0.25); border: 1px solid rgba(255,105,180,0.35);"></div>
      <div style="width: 14px; height: 14px; border-radius: 999px; background: rgba(255,105,180,0.25); border: 1px solid rgba(255,105,180,0.35);"></div>
    `;

    wrap.appendChild(top);
    wrap.appendChild(screenFrame);
    wrap.appendChild(buttons);

    return { wrap, canvas, nameEl: top.querySelector('.pet-device-name') };
  }

  function loadWidgetPos() {
    const raw = localStorage.getItem(WIDGET_POS_KEY);
    if (!raw) return null;
    try {
      const p = JSON.parse(raw);
      if (typeof p.x === 'number' && typeof p.y === 'number') return p;
      return null;
    } catch {
      return null;
    }
  }

  function saveWidgetPos(pos) {
    localStorage.setItem(WIDGET_POS_KEY, JSON.stringify(pos));
  }

  function renderWidget(stateArg) {
    if (!widgetEl || !widgetCtx) return;
    const state = stateArg || getState();
    const mood = computeMood(state);
    const nameEl = widgetEl.querySelector('.pet-device-name');
    const moodEl = widgetEl.querySelector('#pet-widget-mood');
    const dH = widgetEl.querySelector('#pet-dot-h');
    const dHp = widgetEl.querySelector('#pet-dot-hp');
    const dE = widgetEl.querySelector('#pet-dot-e');
    const dC = widgetEl.querySelector('#pet-dot-c');

    if (nameEl) nameEl.textContent = state.name || 'Byte';
    if (moodEl) moodEl.textContent = `${mood.label}`;
    if (dH) dH.style.background = dotColor(state.hunger);
    if (dHp) dHp.style.background = dotColor(state.happiness);
    if (dE) dE.style.background = dotColor(state.energy);
    if (dC) dC.style.background = dotColor(state.cleanliness);

    drawPetScreen(widgetCtx, state, Date.now());
  }

  function startTicker() {
    if (tickerInterval) return;
    tickerInterval = setInterval(() => {
      const state = catchUpState(getState());
      setState(state);
      notifyIfNeeded(state);
    }, 30000);
  }

  function stopTicker() {
    if (tickerInterval) {
      clearInterval(tickerInterval);
      tickerInterval = null;
    }
  }

  function startAnimLoop() {
    if (animRaf) return;
    const loop = () => {
      if (!widgetEl && !roamingPetEl) {
        animRaf = null;
        return;
      }
      const now = Date.now();
      const state = getState();

      // Clear activity when it ends
      const act = state.activity;
      if (act && act.until && now >= act.until) {
        state.activity = null;
        setState({ ...state });
      } else {
        // render without saving every frame
        renderWidget(state);
        if (typeof windowRenderHook === 'function') windowRenderHook(state);
      }

      // Update the roaming pet on desktop
      updateRoamingPet(now);

      animRaf = requestAnimationFrame(loop);
    };
    animRaf = requestAnimationFrame(loop);
  }

  function stopAnimLoop() {
    if (animRaf) cancelAnimationFrame(animRaf);
    animRaf = null;
  }

  function createRoamingPet() {
    if (roamingPetEl) return;
    
    const desktop = document.querySelector('#os-overlay .os-desktop') || document.querySelector('.os-desktop');
    if (!desktop) return;

    // Load saved position
    const savedPos = loadRoamPos();
    if (savedPos) {
      roamX = savedPos.x || 100;
      roamY = savedPos.y || 200;
      roamVX = savedPos.vx || 1.5;
      roamVY = savedPos.vy || 0.8;
      if (typeof savedPos.pinned === 'boolean') roamPinned = savedPos.pinned;
    }
    // Ensure pinned is in sync even if only set in storage
    syncRoamPinnedFromStorage();

    // Add shake animation CSS if not already added
    if (!document.getElementById('pet-animations-css')) {
      const style = document.createElement('style');
      style.id = 'pet-animations-css';
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px) rotate(-2deg); }
          40% { transform: translateX(5px) rotate(2deg); }
          60% { transform: translateX(-5px) rotate(-2deg); }
          80% { transform: translateX(5px) rotate(2deg); }
        }
      `;
      document.head.appendChild(style);
    }

    roamingPetEl = document.createElement('div');
    roamingPetEl.id = 'os-roaming-pet';
    roamingPetEl.style.cssText = `
      position: absolute;
      left: ${roamX}px;
      top: ${roamY}px;
      width: 84px;
      height: 72px;
      z-index: 500;
      pointer-events: auto;
      cursor: grab;
      transition: transform 0.1s ease-out;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    `;

    roamingCanvas = document.createElement('canvas');
    roamingCanvas.width = 84;  // 28 cols * 3 scale
    roamingCanvas.height = 72; // 24 rows * 3 scale
    roamingCanvas.style.cssText = 'image-rendering: pixelated; width: 100%; height: 100%;';
    roamingCtx = roamingCanvas.getContext('2d');

    roamingPetEl.appendChild(roamingCanvas);

    // Pin button (toggles roaming)
    const pinBtn = document.createElement('button');
    pinBtn.type = 'button';
    pinBtn.setAttribute('aria-label', 'Pin pet');
    pinBtn.style.cssText = `
      position: absolute;
      top: -10px;
      right: -10px;
      width: 26px;
      height: 26px;
      border-radius: 999px;
      border: 1px solid rgba(255,105,180,0.35);
      background: rgba(0,0,0,0.55);
      color: ${roamPinned ? '#ff69b4' : 'rgba(255,255,255,0.75)'};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,0.35);
      backdrop-filter: blur(8px);
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.15s ease, transform 0.15s ease;
      pointer-events: auto;
    `;
    pinBtn.textContent = '📌';
    roamingPetEl.appendChild(pinBtn);

    desktop.appendChild(roamingPetEl);

    // Show pin button on hover
    roamingPetEl.addEventListener('mouseenter', () => {
      if (!pinBtn) return;
      pinBtn.style.opacity = '1';
      pinBtn.style.transform = 'scale(1)';
    });
    roamingPetEl.addEventListener('mouseleave', () => {
      if (!pinBtn) return;
      pinBtn.style.opacity = '0';
      pinBtn.style.transform = 'scale(0.95)';
    });

    pinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nextPinned = toggleRoamPinned();
      pinBtn.style.color = nextPinned ? '#ff69b4' : 'rgba(255,255,255,0.75)';
      if (window.NotificationSystem) {
        window.NotificationSystem.info(
          nextPinned ? 'Pet pinned' : 'Pet unpinned',
          nextPinned ? 'Roaming paused.' : 'Roaming resumed.',
          1200
        );
      }
    });

    // Drag to reposition (pauses roaming while dragging)
    roamingPetEl.addEventListener('pointerdown', (e) => {
      // Only primary pointer (left mouse / main touch)
      if (typeof e.button === 'number' && e.button !== 0) return;
      if (e.pointerType === 'mouse' && e.ctrlKey) return; // allow ctrl-click context

      // Don't start drag when clicking the pin button
      if (e.target === pinBtn) return;

      e.preventDefault();
      e.stopPropagation();

      roamDragging = true;
      roamDragMoved = false;
      roamingPetEl.dataset.dragging = 'true';
      roamingPetEl.style.cursor = 'grabbing';

      try {
        roamingPetEl.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      const rect = roamingPetEl.getBoundingClientRect();
      roamDragOffsetX = e.clientX - rect.left;
      roamDragOffsetY = e.clientY - rect.top;
    });

    roamingPetEl.addEventListener('pointermove', (e) => {
      if (!roamDragging) return;

      const desktopRect = desktop.getBoundingClientRect();
      const petWidth = 84;
      const petHeight = 72;
      const minX = 10;
      const minY = 40; // below menubar
      const maxX = Math.max(minX, desktopRect.width - petWidth - 10);
      const maxY = Math.max(minY, desktopRect.height - petHeight - 80); // leave room for dock

      const x = Math.max(minX, Math.min(maxX, e.clientX - desktopRect.left - roamDragOffsetX));
      const y = Math.max(minY, Math.min(maxY, e.clientY - desktopRect.top - roamDragOffsetY));

      // mark "moved" if beyond a small threshold
      if (!roamDragMoved) {
        const dx = Math.abs(x - roamX);
        const dy = Math.abs(y - roamY);
        if (dx + dy > 2) roamDragMoved = true;
      }

      roamX = x;
      roamY = y;
      roamingPetEl.style.left = `${roamX}px`;
      roamingPetEl.style.top = `${roamY}px`;
    });

    const endDrag = (e) => {
      if (!roamDragging) return;
      roamDragging = false;
      roamingPetEl.style.cursor = 'grab';

      try {
        roamingPetEl.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      // Persist new position
      saveRoamPos();
      lastRoamTime = Date.now();

      // Prevent click-open if it was a drag
      setTimeout(() => {
        if (roamingPetEl) roamingPetEl.dataset.dragging = 'false';
        roamDragMoved = false;
      }, 0);
    };

    roamingPetEl.addEventListener('pointerup', endDrag);
    roamingPetEl.addEventListener('pointercancel', endDrag);

    // Click to open pet app
    roamingPetEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (roamingPetEl && roamingPetEl.dataset.dragging === 'true') return;
      if (roamDragMoved) return;
      // Little bounce animation
      roamingPetEl.style.transform = 'scale(1.2)';
      setTimeout(() => {
        if (roamingPetEl) roamingPetEl.style.transform = 'scale(1)';
      }, 150);
      open();
    });

    // Double click to feed (only if not busy or sleeping)
    roamingPetEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const state = getState();
      const now = Date.now();
      
      // Check if pet is sleeping or already doing something
      const currentActivity = getCurrentActivity(state, now);
      if (currentActivity || state.sleeping) {
        // Pet is busy or sleeping, show a little shake animation
        roamingPetEl.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
          if (roamingPetEl) roamingPetEl.style.animation = '';
        }, 300);
        return;
      }
      
      state.hunger = clamp01_100(state.hunger + 15);
      state.happiness = clamp01_100(state.happiness + 5);
      state.activity = { type: 'eat', startedAt: now, until: now + 2000 };
      setState({ ...state });
      if (window.SoundManager) {
        window.SoundManager.ensureStarted();
        window.SoundManager.play('pet_action');
      }
    });
  }

  function updateRoamingPet(nowMs) {
    if (!roamingPetEl || !roamingCtx) return;

    const state = getState();
    const desktop = document.querySelector('#os-overlay .os-desktop') || document.querySelector('.os-desktop');
    if (!desktop) return;

    const petWidth = 84;
    const petHeight = 72;
    const desktopRect = desktop.getBoundingClientRect();
    const maxX = desktopRect.width - petWidth - 10;
    const maxY = desktopRect.height - petHeight - 80; // Leave room for dock
    const minY = 40; // Below menubar

    // Don't move if sleeping, pinned, or user is dragging it
    if (!state.sleeping && !roamPinned && !roamDragging) {
      // Update position
      roamX += roamVX * ROAM_SPEED;
      roamY += roamVY * ROAM_SPEED;

      // Bounce off walls
      if (roamX <= 10 || roamX >= maxX) {
        roamVX *= -1;
        roamX = Math.max(10, Math.min(maxX, roamX));
      }
      if (roamY <= minY || roamY >= maxY) {
        roamVY *= -1;
        roamY = Math.max(minY, Math.min(maxY, roamY));
      }

      // Occasionally change direction randomly (more often for visible movement)
      if (Math.random() < 0.01) {
        roamVX = (Math.random() - 0.5) * 4;
        roamVY = (Math.random() - 0.5) * 3;
        // Ensure minimum speed so pet doesn't stop
        if (Math.abs(roamVX) < 0.5) roamVX = roamVX < 0 ? -1 : 1;
        if (Math.abs(roamVY) < 0.3) roamVY = roamVY < 0 ? -0.5 : 0.5;
      }
    }

    // Update element position with activity-specific animations
    let bounceOffset = 0;
    let scaleEffect = 'scale(1)';
    
    const activity = getCurrentActivity(state, nowMs);
    const activityType = activity ? activity.type : null;
    
    if (state.sleeping) {
      // Gentle breathing effect when sleeping
      bounceOffset = Math.sin(nowMs / 500) * 2;
      scaleEffect = `scale(${1 + Math.sin(nowMs / 500) * 0.02})`;
    } else if (activityType === 'eat') {
      // Chomping bounce when eating
      bounceOffset = Math.abs(Math.sin(nowMs / 80)) * 4;
    } else if (activityType === 'play') {
      // Excited jumping when playing
      bounceOffset = Math.abs(Math.sin(nowMs / 60)) * 8;
      scaleEffect = `scale(${1 + Math.abs(Math.sin(nowMs / 120)) * 0.1})`;
    } else if (activityType === 'clean') {
      // Side-to-side wiggle when cleaning
      const wiggle = Math.sin(nowMs / 50) * 3;
      roamingPetEl.style.transform = `translateX(${wiggle}px)`;
    } else {
      // Normal walking bounce
      bounceOffset = Math.sin(nowMs / 100) * 3;
    }
    
    roamingPetEl.style.left = `${roamX}px`;
    roamingPetEl.style.top = `${roamY + bounceOffset}px`;
    if (activityType !== 'clean') {
      roamingPetEl.style.transform = scaleEffect;
    }

    // Draw the sprite
    roamingCtx.clearRect(0, 0, petWidth, petHeight);

    const frame = Math.floor(nowMs / 200) % 2;
    const flipX = roamVX < 0;

    // Choose sprite based on current activity/state
    let sprite;
    if (state.sleeping) {
      // Sleeping animation with Zzz
      sprite = frame === 0 ? ROAMING_SPRITES.sleep1 : ROAMING_SPRITES.sleep2;
    } else if (activityType === 'eat') {
      // Eating animation
      sprite = frame === 0 ? ROAMING_SPRITES.eat1 : ROAMING_SPRITES.eat2;
    } else if (activityType === 'play') {
      // Playing animation with sparkles
      sprite = frame === 0 ? ROAMING_SPRITES.play1 : ROAMING_SPRITES.play2;
    } else if (activityType === 'clean') {
      // Cleaning animation with sparkles
      sprite = frame === 0 ? ROAMING_SPRITES.clean1 : ROAMING_SPRITES.clean2;
    } else {
      // Default walking animation
      sprite = frame === 0 ? ROAMING_SPRITES.walk1 : ROAMING_SPRITES.walk2;
    }

    // Draw with scale 3 (28 cols * 3 = 84px)
    const scale = 3;
    drawRoamingSprite(roamingCtx, sprite, 0, 0, scale, PINK_PALETTE, flipX);

    // Add little shadow under the pet
    roamingCtx.fillStyle = 'rgba(255,105,180,0.2)';
    roamingCtx.beginPath();
    roamingCtx.ellipse(petWidth / 2, petHeight - 2, petWidth / 3, 5, 0, 0, Math.PI * 2);
    roamingCtx.fill();

    // Save position occasionally
    if (!roamDragging && (nowMs - lastRoamTime > 5000)) {
      saveRoamPos();
      lastRoamTime = nowMs;
    }
  }

  function destroyRoamingPet() {
    if (roamingPetEl && roamingPetEl.parentNode) {
      roamingPetEl.parentNode.removeChild(roamingPetEl);
    }
    roamingPetEl = null;
    roamingCanvas = null;
    roamingCtx = null;
  }

  function ensureWidget() {
    if (widgetEl) return;
    const desktop = document.querySelector('#os-overlay .os-desktop') || document.querySelector('.os-desktop');
    if (!desktop) return;

    // Create the roaming pet that walks around the desktop
    createRoamingPet();

    widgetEl = document.createElement('div');
    widgetEl.id = 'os-pet-widget';
    widgetEl.style.cssText = `
      position: fixed;
      left: 20px;
      bottom: 120px;
      z-index: 9999;
      user-select: none;
      cursor: grab;
    `;

    const device = createTamagotchiDevice({ width: 220, height: 170, screenW: 96, screenH: 72, forWidget: true });
    widgetCtx = device.canvas.getContext('2d');

    const footer = document.createElement('div');
    footer.style.cssText = 'margin-top: 10px; display:flex; gap:8px; align-items:center; justify-content:space-between;';
    footer.innerHTML = `
      <div id="pet-widget-mood" style="color:#ff69b4; font-weight:800; font-size:12px;">Pet</div>
      <div style="display:flex; gap:6px;">
        <div id="pet-dot-h" title="Hunger" style="width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,105,180,0.3);"></div>
        <div id="pet-dot-hp" title="Happiness" style="width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,105,180,0.3);"></div>
        <div id="pet-dot-e" title="Energy" style="width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,105,180,0.3);"></div>
        <div id="pet-dot-c" title="Cleanliness" style="width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,105,180,0.3);"></div>
      </div>
    `;

    const chrome = document.createElement('div');
    chrome.style.cssText = 'padding: 10px; border-radius: 18px; background: rgba(0,0,0,0.22); border: 1px solid rgba(255,105,180,0.2); backdrop-filter: blur(10px);';
    chrome.appendChild(device.wrap);
    chrome.appendChild(footer);
    widgetEl.appendChild(chrome);
    document.body.appendChild(widgetEl);

    // Restore saved position
    const pos = loadWidgetPos();
    if (pos) {
      widgetEl.style.left = `${pos.x}px`;
      widgetEl.style.top = `${pos.y}px`;
      widgetEl.style.bottom = 'auto';
    }

    // Click opens full Pet app
    widgetEl.addEventListener('click', () => {
      if (widgetEl && widgetEl.dataset.dragging === 'true') return;
      open();
    });

    // Drag
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const x = Math.max(8, Math.min(window.innerWidth - 240, startLeft + dx));
      const y = Math.max(50, Math.min(window.innerHeight - 220, startTop + dy));
      widgetEl.style.left = `${x}px`;
      widgetEl.style.top = `${y}px`;
      widgetEl.style.bottom = 'auto';
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      widgetEl.style.cursor = 'grab';
      setTimeout(() => { if (widgetEl) widgetEl.dataset.dragging = 'false'; }, 0);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const rect = widgetEl.getBoundingClientRect();
      saveWidgetPos({ x: rect.left, y: rect.top });
    };

    widgetEl.addEventListener('mousedown', (e) => {
      dragging = true;
      widgetEl.dataset.dragging = 'true';
      widgetEl.style.cursor = 'grabbing';
      const rect = widgetEl.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    });

    startTicker();
    renderWidget();
    startAnimLoop();
  }

  function destroyWidget() {
    stopTicker();
    stopAnimLoop();
    if (widgetEl && widgetEl.parentNode) widgetEl.parentNode.removeChild(widgetEl);
    widgetEl = null;
    widgetCtx = null;
    destroyRoamingPet();
  }

  function open() {
    const existing = WindowManager.getWindowByApp('pet');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }

    let state = catchUpState(getState());
    setState(state);

    const container = document.createElement('div');
    container.style.cssText = 'height: 100%; display:flex; flex-direction:column; padding: 18px; background: rgba(13, 13, 13, 0.9); font-family: -apple-system, sans-serif;';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px;';
    header.innerHTML = `
      <div>
        <div style="color:#ff69b4; font-weight:800; font-size:16px; letter-spacing:0.3px;">Pet</div>
        <div style="color:#ffb6c1; font-size:12px;">Age: <span id="pet-age"></span></div>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <input id="pet-name" value="${state.name}" aria-label="Pet name" style="width: 140px; padding: 8px 10px; background: rgba(255,105,180,0.08); border: 1px solid rgba(255,105,180,0.3); border-radius: 8px; color:#ffb6c1; outline:none; font-weight:700; font-size:13px;">
      </div>
    `;

    // Pin toggle (desktop roaming)
    const pinRow = document.createElement('div');
    pinRow.style.cssText = 'margin: 8px 0 12px; display:flex; gap:10px; align-items:center; justify-content:space-between;';
    const pinBtn = document.createElement('button');
    pinBtn.type = 'button';
    pinBtn.className = 'pet-pin-btn';
    pinBtn.style.cssText = 'padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(255,105,180,0.3); background: rgba(255,105,180,0.10); color:#ff69b4; cursor:pointer; font-weight:800; font-size:13px; width: 100%;';
    const renderPinBtn = () => {
      pinBtn.textContent = roamPinned ? '📌 Pinned (roaming paused)' : '📌 Pin pet (pause roaming)';
      pinBtn.style.background = roamPinned ? 'rgba(255,105,180,0.22)' : 'rgba(255,105,180,0.10)';
    };
    renderPinBtn();
    pinBtn.addEventListener('click', () => {
      const nextPinned = toggleRoamPinned();
      renderPinBtn();
      if (window.NotificationSystem) {
        window.NotificationSystem.info(
          nextPinned ? 'Pet pinned' : 'Pet unpinned',
          nextPinned ? 'Roaming paused.' : 'Roaming resumed.',
          1200
        );
      }
    });
    pinRow.appendChild(pinBtn);

    const stage = document.createElement('div');
    stage.style.cssText = 'display:flex; flex-direction: column; align-items:center; justify-content:center; gap: 12px; border-radius: 16px; border: 1px solid rgba(255,105,180,0.2); background: radial-gradient(circle at 30% 30%, rgba(255,105,180,0.1), transparent 55%), rgba(0,0,0,0.35); box-shadow: 0 12px 40px rgba(0,0,0,0.45); padding: 18px; margin-bottom: 14px;';

    const device = createTamagotchiDevice({ width: 320, height: 240, screenW: 160, screenH: 120, forWidget: false });
    device.nameEl.textContent = state.name || 'Byte';
    const stageCtx = device.canvas.getContext('2d');
    stage.appendChild(device.wrap);

    const stageMeta = document.createElement('div');
    stageMeta.style.cssText = 'text-align:center;';
    stageMeta.innerHTML = `
      <div id="pet-mood" style="color:#e6e6e6; font-weight:900;">Chillin</div>
      <div id="pet-sub" style="margin-top:4px; color:#999; font-size:12px;">Take care of me.</div>
    `;
    stage.appendChild(stageMeta);

    const stats = document.createElement('div');
    stats.id = 'pet-stats';
    stats.style.cssText = 'padding: 14px; border-radius: 14px; border: 1px solid rgba(255,105,180,0.2); background: rgba(20,20,20,0.75); margin-bottom: 14px;';

    const actions = document.createElement('div');
    actions.style.cssText = 'display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px;';
    actions.innerHTML = `
      <button data-action="feed" class="pet-btn">🍜 Feed</button>
      <button data-action="play" class="pet-btn">🕹️ Play</button>
      <button data-action="clean" class="pet-btn">🧼 Clean</button>
      <button data-action="sleep" class="pet-btn">🛌 ${state.sleeping ? 'Wake' : 'Sleep'}</button>
    `;

    // Button styling (pink theme)
    actions.querySelectorAll('.pet-btn').forEach(btn => {
      btn.style.cssText = 'padding: 12px 12px; border-radius: 12px; border: 1px solid rgba(255,105,180,0.3); background: rgba(255,105,180,0.12); color:#ff69b4; cursor:pointer; font-weight:800; font-size:13px; transition: all 0.15s;';
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255,105,180,0.25)';
        btn.style.transform = 'translateY(-1px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(255,105,180,0.12)';
        btn.style.transform = 'translateY(0px)';
      });
    });

    container.appendChild(header);
    container.appendChild(pinRow);
    container.appendChild(stage);
    container.appendChild(stats);
    container.appendChild(actions);

    function isBusy() {
      const now = Date.now();
      const activity = getCurrentActivity(state, now);
      // Pet is busy if doing an activity OR if sleeping (can only wake up)
      return activity !== null || state.sleeping;
    }

    function render() {
      const mood = computeMood(state);
      const moodEl = container.querySelector('#pet-mood');
      const sub = container.querySelector('#pet-sub');
      const ageEl = container.querySelector('#pet-age');
      const nameInput = container.querySelector('#pet-name');
      const sleepBtn = container.querySelector('button[data-action="sleep"]');
      const allBtns = container.querySelectorAll('.pet-btn');

      if (ageEl) ageEl.textContent = formatAge(state);
      if (moodEl) moodEl.textContent = mood.label;
      
      // Show what pet is currently doing
      const activity = getCurrentActivity(state, Date.now());
      if (state.sleeping) {
        if (sub) sub.textContent = 'Zzz... (energy restoring)';
      } else if (activity) {
        const activityNames = { eat: 'Eating...', play: 'Playing...', clean: 'Cleaning...' };
        if (sub) sub.textContent = activityNames[activity.type] || 'Busy...';
      } else {
        if (sub) sub.textContent = 'Keep me healthy.';
      }
      
      if (nameInput && typeof nameInput.value === 'string') state.name = nameInput.value.trim() || 'Byte';
      if (sleepBtn) sleepBtn.textContent = `🛌 ${state.sleeping ? 'Wake' : 'Sleep'}`;
      if (device.nameEl) device.nameEl.textContent = state.name || 'Byte';
      drawPetScreen(stageCtx, state, Date.now());

      // Update button states - disable when busy (except sleep/wake)
      const busy = isBusy();
      allBtns.forEach(btn => {
        const action = btn.dataset.action;
        // Sleep/Wake button is always enabled, others disabled when busy
        if (action !== 'sleep' && busy) {
          btn.disabled = true;
          btn.style.opacity = '0.5';
          btn.style.cursor = 'not-allowed';
        } else {
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
        }
      });

      stats.innerHTML = `
        ${makeStatBar('Hunger', state.hunger, 'linear-gradient(90deg, #ff69b4, #ff1493)')}
        ${makeStatBar('Happiness', state.happiness, 'linear-gradient(90deg, #ff85c0, #ff69b4)')}
        ${makeStatBar('Energy', state.energy, 'linear-gradient(90deg, #ffb6c1, #ff69b4)')}
        ${makeStatBar('Cleanliness', state.cleanliness, 'linear-gradient(90deg, #ffc0cb, #ffb6c1)')}
      `;
    }

    function act(type) {
      const now2 = Date.now();
      
      // Check if pet is already doing something (except for sleep toggle)
      if (type !== 'sleep' && isBusy()) {
        // Show notification that pet is busy
        if (window.NotificationSystem) {
          const reason = state.sleeping ? 'Wake them up first!' : 'Wait for the current action to finish.';
          window.NotificationSystem.info(
            `${state.name} is ${state.sleeping ? 'sleeping' : 'busy'}!`,
            reason,
            1500
          );
        }
        return;
      }
      
      const pre = { ...state };
      const elapsed2 = Math.max(0, now2 - (state.lastTick || now2));
      state = tick(state, elapsed2);
      state.lastTick = now2;

      if (type === 'feed') {
        state.hunger = clamp01_100(state.hunger + 25);
        state.happiness = clamp01_100(state.happiness + 6);
        // Trigger eating animation visible on desktop + in this window
        state.activity = { type: 'eat', startedAt: now2, until: now2 + 3000 };
      } else if (type === 'play') {
        state.happiness = clamp01_100(state.happiness + 22);
        state.energy = clamp01_100(state.energy - 10);
        state.hunger = clamp01_100(state.hunger - 8);
        // Trigger playing animation visible on desktop
        state.activity = { type: 'play', startedAt: now2, until: now2 + 3500 };
      } else if (type === 'clean') {
        state.cleanliness = clamp01_100(state.cleanliness + 30);
        state.happiness = clamp01_100(state.happiness + 4);
        // Trigger cleaning animation visible on desktop
        state.activity = { type: 'clean', startedAt: now2, until: now2 + 2500 };
      } else if (type === 'sleep') {
        state.sleeping = !state.sleeping;
        state.activity = null; // Clear any activity when toggling sleep
      }

      setState({ ...state });
      render();

      if (window.SoundManager) {
        window.SoundManager.ensureStarted();
        window.SoundManager.play('pet_action', { throttleMs: 0 });
      }

      // Optional tiny feedback notification for big changes
      if (window.NotificationSystem) {
        const mood = computeMood(state);
        const title = `${state.name} — ${mood.label}`;
        const msg = state.sleeping ? 'Sleep mode toggled.' : 'Updated stats.';
        window.NotificationSystem.info(title, msg, 1500);
      }

      // Notify on low stats, but avoid spamming by only if got worse or still low
      const lowNow = (state.hunger <= 25 || state.happiness <= 25 || state.energy <= 25 || state.cleanliness <= 25);
      const lowBefore = (pre.hunger <= 25 || pre.happiness <= 25 || pre.energy <= 25 || pre.cleanliness <= 25);
      if (lowNow && !lowBefore) notifyIfNeeded(state);
    }

    // Name editing
    const nameInput = header.querySelector('#pet-name');
    nameInput.addEventListener('input', () => {
      state.name = nameInput.value.trim() || 'Byte';
      setState({ ...state });
      render();
    });

    // Actions
    actions.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      act(btn.dataset.action);
    });

    render();

    // Open window
    const win = WindowManager.createWindow('pet', 'Pet', container, {
      width: 420,
      height: 560,
      resizable: false
    });

    // Link render hook so widget ticker can repaint this window too
    windowRenderHook = (newState) => {
      state = { ...newState };
      render();
    };

    // Ensure background ticker is running (so pet continues even if window closes)
    startTicker();

    // Cleanup hook when window is closed
    const oldCleanup = win.cleanup;
    win.cleanup = () => {
      if (typeof oldCleanup === 'function') oldCleanup();
      windowRenderHook = null;
    };
  }

  return { open, ensureWidget, destroyWidget };
})();

window.PetApp = PetApp;



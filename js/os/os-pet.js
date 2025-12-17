// Pet App - Tamagotchi-style mini companion
const PetApp = (function() {
  const STORAGE_KEY = 'os_pet_state';

  const DEFAULT_STATE = {
    name: 'Byte',
    ageMinutes: 0,
    hunger: 85,       // 0..100 (100 = full)
    happiness: 85,    // 0..100
    energy: 80,       // 0..100
    cleanliness: 90,  // 0..100
    sleeping: false,
    lastTick: Date.now()
  };

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

  function computeMood(state) {
    const score = (state.hunger + state.happiness + state.energy + state.cleanliness) / 4;
    if (state.sleeping) return { label: 'Sleeping', face: '😴' };
    if (score >= 85) return { label: 'Vibing', face: '😄' };
    if (score >= 70) return { label: 'Chillin', face: '🙂' };
    if (score >= 50) return { label: 'Meh', face: '😐' };
    if (score >= 30) return { label: 'Stressed', face: '😟' };
    return { label: 'Crisis', face: '😵' };
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
          <div style="color:#e6e6e6; font-size:13px; font-weight:600;">${label}</div>
          <div style="color:#999; font-size:12px;">${value}%</div>
        </div>
        <div style="height:8px; background: rgba(255,255,255,0.08); border-radius:999px; overflow:hidden; border:1px solid rgba(0,255,225,0.12);">
          <div style="height:100%; width:${value}%; background:${color}; border-radius:999px;"></div>
        </div>
      </div>
    `;
  }

  function open() {
    const existing = WindowManager.getWindowByApp('pet');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }

    let state = loadState();

    // Catch up based on lastTick
    const now = Date.now();
    const elapsed = Math.max(0, now - (state.lastTick || now));
    state = tick(state, elapsed);
    state.lastTick = now;
    saveState(state);

    const container = document.createElement('div');
    container.style.cssText = 'height: 100%; display:flex; flex-direction:column; padding: 18px; background: rgba(13, 13, 13, 0.9); font-family: -apple-system, sans-serif;';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px;';
    header.innerHTML = `
      <div>
        <div style="color:#00ffe1; font-weight:800; font-size:16px; letter-spacing:0.3px;">Pet</div>
        <div style="color:#999; font-size:12px;">Age: <span id="pet-age"></span></div>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <input id="pet-name" value="${state.name}" aria-label="Pet name" style="width: 140px; padding: 8px 10px; background: rgba(0,255,225,0.05); border: 1px solid rgba(0,255,225,0.2); border-radius: 8px; color:#e6e6e6; outline:none; font-weight:700; font-size:13px;">
      </div>
    `;

    const stage = document.createElement('div');
    stage.style.cssText = 'display:flex; align-items:center; justify-content:center; border-radius: 16px; border: 1px solid rgba(0,255,225,0.15); background: radial-gradient(circle at 30% 30%, rgba(0,255,225,0.08), transparent 55%), rgba(0,0,0,0.35); box-shadow: 0 12px 40px rgba(0,0,0,0.45); padding: 18px; margin-bottom: 14px;';
    stage.innerHTML = `
      <div style="text-align:center;">
        <div id="pet-face" style="font-size: 64px; line-height: 1;">🙂</div>
        <div id="pet-mood" style="margin-top:10px; color:#e6e6e6; font-weight:700;">Chillin</div>
        <div id="pet-sub" style="margin-top:4px; color:#999; font-size:12px;">Take care of me.</div>
      </div>
    `;

    const stats = document.createElement('div');
    stats.id = 'pet-stats';
    stats.style.cssText = 'padding: 14px; border-radius: 14px; border: 1px solid rgba(0,255,225,0.12); background: rgba(20,20,20,0.75); margin-bottom: 14px;';

    const actions = document.createElement('div');
    actions.style.cssText = 'display:grid; grid-template-columns: repeat(2, 1fr); gap: 10px;';
    actions.innerHTML = `
      <button data-action="feed" class="pet-btn">🍜 Feed</button>
      <button data-action="play" class="pet-btn">🕹️ Play</button>
      <button data-action="clean" class="pet-btn">🧼 Clean</button>
      <button data-action="sleep" class="pet-btn">🛌 ${state.sleeping ? 'Wake' : 'Sleep'}</button>
    `;

    // Button styling (inline, consistent with OS)
    actions.querySelectorAll('.pet-btn').forEach(btn => {
      btn.style.cssText = 'padding: 12px 12px; border-radius: 12px; border: 1px solid rgba(0,255,225,0.2); background: rgba(0,255,225,0.08); color:#00ffe1; cursor:pointer; font-weight:800; font-size:13px; transition: all 0.15s;';
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(0,255,225,0.16)';
        btn.style.transform = 'translateY(-1px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(0,255,225,0.08)';
        btn.style.transform = 'translateY(0px)';
      });
    });

    container.appendChild(header);
    container.appendChild(stage);
    container.appendChild(stats);
    container.appendChild(actions);

    function render() {
      const mood = computeMood(state);
      const face = container.querySelector('#pet-face');
      const moodEl = container.querySelector('#pet-mood');
      const sub = container.querySelector('#pet-sub');
      const ageEl = container.querySelector('#pet-age');
      const nameInput = container.querySelector('#pet-name');
      const sleepBtn = container.querySelector('button[data-action="sleep"]');

      if (ageEl) ageEl.textContent = formatAge(state);
      if (face) face.textContent = mood.face;
      if (moodEl) moodEl.textContent = mood.label;
      if (sub) sub.textContent = state.sleeping ? 'Zzz... (energy restoring)' : 'Keep me healthy.';
      if (nameInput && typeof nameInput.value === 'string') state.name = nameInput.value.trim() || 'Byte';
      if (sleepBtn) sleepBtn.textContent = `🛌 ${state.sleeping ? 'Wake' : 'Sleep'}`;

      stats.innerHTML = `
        ${makeStatBar('Hunger', state.hunger, 'linear-gradient(90deg, #00ffe1, #2a82ff)')}
        ${makeStatBar('Happiness', state.happiness, 'linear-gradient(90deg, #a855f7, #22d3ee)')}
        ${makeStatBar('Energy', state.energy, 'linear-gradient(90deg, #feca57, #ff6b6b)')}
        ${makeStatBar('Cleanliness', state.cleanliness, 'linear-gradient(90deg, #38ef7d, #11998e)')}
      `;
    }

    function act(type) {
      const pre = { ...state };
      const now2 = Date.now();
      const elapsed2 = Math.max(0, now2 - (state.lastTick || now2));
      state = tick(state, elapsed2);
      state.lastTick = now2;

      if (type === 'feed') {
        state.hunger = clamp01_100(state.hunger + 25);
        state.happiness = clamp01_100(state.happiness + 6);
      } else if (type === 'play') {
        state.happiness = clamp01_100(state.happiness + 22);
        state.energy = clamp01_100(state.energy - 10);
        state.hunger = clamp01_100(state.hunger - 8);
      } else if (type === 'clean') {
        state.cleanliness = clamp01_100(state.cleanliness + 30);
        state.happiness = clamp01_100(state.happiness + 4);
      } else if (type === 'sleep') {
        state.sleeping = !state.sleeping;
      }

      saveState(state);
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
      saveState(state);
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

    // Tick every 30s while open
    win.autoSaveInterval = setInterval(() => {
      const now3 = Date.now();
      const elapsed3 = Math.max(0, now3 - (state.lastTick || now3));
      state = tick(state, elapsed3);
      state.lastTick = now3;
      saveState(state);
      render();

      // Notify if low; throttle by checking once per tick
      notifyIfNeeded(state);
    }, 30000);
  }

  return { open };
})();

window.PetApp = PetApp;



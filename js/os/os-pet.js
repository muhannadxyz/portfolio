// Pet App - Tamagotchi-style mini companion
const PetApp = (function() {
  const STORAGE_KEY = 'os_pet_state';
  const WIDGET_POS_KEY = 'os_pet_widget_pos';

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

  let widgetEl = null;
  let widgetCtx = null;
  let tickerInterval = null;
  let windowRenderHook = null;

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
          <div style="color:#e6e6e6; font-size:13px; font-weight:600;">${label}</div>
          <div style="color:#999; font-size:12px;">${value}%</div>
        </div>
        <div style="height:8px; background: rgba(255,255,255,0.08); border-radius:999px; overflow:hidden; border:1px solid rgba(0,255,225,0.12);">
          <div style="height:100%; width:${value}%; background:${color}; border-radius:999px;"></div>
        </div>
      </div>
    `;
  }

  function dotColor(v) {
    if (v >= 70) return 'rgba(56,239,125,0.85)';
    if (v >= 40) return 'rgba(0,255,225,0.75)';
    if (v >= 25) return 'rgba(255,189,46,0.85)';
    return 'rgba(255,95,87,0.85)';
  }

  function drawPetScreen(ctx, state) {
    if (!ctx) return;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, w, h);

    const mood = computeMood(state);
    const accent = (() => {
      switch (mood.mood) {
        case 'happy': return '#38ef7d';
        case 'ok': return '#00ffe1';
        case 'meh': return '#74b9ff';
        case 'sad': return '#ffbd2e';
        case 'panic': return '#ff5f57';
        case 'sleep': return '#a855f7';
        default: return '#00ffe1';
      }
    })();

    // Ground line
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0, h - 10, w, 1);

    // Pixel pet blob
    const px = Math.floor(w / 2);
    const py = Math.floor(h / 2) + 4;
    const bodyW = 22;
    const bodyH = 18;
    const bx = px - Math.floor(bodyW / 2);
    const by = py - Math.floor(bodyH / 2);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(bx + 3, by + bodyH + 4, bodyW - 6, 2);

    // Body
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.fillRect(bx, by, bodyW, bodyH);
    ctx.strokeStyle = `${accent}66`;
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 0.5, by + 0.5, bodyW - 1, bodyH - 1);

    // Eyes
    const eyeY = by + 6;
    const eyeX1 = bx + 6;
    const eyeX2 = bx + bodyW - 9;
    ctx.fillStyle = '#e6e6e6';
    ctx.fillRect(eyeX1, eyeY, 2, 2);
    ctx.fillRect(eyeX2, eyeY, 2, 2);

    // Mouth / expressions
    ctx.fillStyle = accent;
    if (mood.mood === 'sleep') {
      // Zzz
      ctx.fillRect(bx + 2, by - 6, 6, 1);
      ctx.fillRect(bx + 4, by - 4, 4, 1);
      ctx.fillRect(bx + 6, by - 2, 2, 1);
      // sleepy eyes
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(eyeX1, eyeY + 1, 2, 1);
      ctx.fillRect(eyeX2, eyeY + 1, 2, 1);
      // small mouth
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(bx + Math.floor(bodyW / 2) - 2, by + 12, 4, 1);
    } else if (mood.mood === 'happy' || mood.mood === 'ok') {
      ctx.fillRect(bx + Math.floor(bodyW / 2) - 3, by + 12, 6, 1);
      ctx.fillRect(bx + Math.floor(bodyW / 2) - 2, by + 13, 4, 1);
    } else if (mood.mood === 'meh') {
      ctx.fillRect(bx + Math.floor(bodyW / 2) - 3, by + 12, 6, 1);
    } else {
      // sad/panic
      ctx.fillRect(bx + Math.floor(bodyW / 2) - 3, by + 12, 6, 1);
      ctx.fillRect(bx + Math.floor(bodyW / 2) - 2, by + 13, 4, 1);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(bx + 2, by + 2, 3, 1);
    }

    // Status pixel
    ctx.fillStyle = `${accent}cc`;
    ctx.fillRect(w - 4, 2, 2, 2);
  }

  function createTamagotchiDevice({ width = 220, height = 170, screenW = 96, screenH = 72, forWidget = false } = {}) {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      border-radius: ${forWidget ? '22px' : '26px'};
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 55%), rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(0,255,225,0.16);
      box-shadow: 0 16px 60px rgba(0,0,0,0.55);
      position: relative;
      overflow: hidden;
    `;

    const top = document.createElement('div');
    top.style.cssText = 'padding: 10px 12px 6px; display:flex; justify-content:space-between; align-items:center;';
    top.innerHTML = `
      <div style="color:#00ffe1; font-weight:900; letter-spacing:0.4px; font-size:${forWidget ? '11px' : '12px'};">TAMAPET</div>
      <div class="pet-device-name" style="color:#e6e6e6; font-weight:800; font-size:${forWidget ? '11px' : '12px'}; max-width:${forWidget ? '100px' : '140px'}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"></div>
    `;

    const screenFrame = document.createElement('div');
    screenFrame.style.cssText = `
      width: ${screenW + 18}px;
      height: ${screenH + 18}px;
      margin: 0 auto;
      border-radius: 14px;
      background: rgba(0,0,0,0.45);
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: inset 0 0 0 1px rgba(0,255,225,0.08);
      display:flex;
      align-items:center;
      justify-content:center;
    `;

    const canvas = document.createElement('canvas');
    canvas.width = screenW;
    canvas.height = screenH;
    canvas.style.cssText = 'image-rendering: pixelated; width: 100%; height: 100%; border-radius: 10px; background: #05070f;';
    screenFrame.appendChild(canvas);

    const buttons = document.createElement('div');
    buttons.style.cssText = 'position:absolute; left: 0; right: 0; bottom: 12px; display:flex; justify-content:center; gap: 14px;';
    buttons.innerHTML = `
      <div style="width: 14px; height: 14px; border-radius: 999px; background: rgba(255,255,255,0.14); border: 1px solid rgba(0,255,225,0.16);"></div>
      <div style="width: 14px; height: 14px; border-radius: 999px; background: rgba(255,255,255,0.14); border: 1px solid rgba(0,255,225,0.16);"></div>
      <div style="width: 14px; height: 14px; border-radius: 999px; background: rgba(255,255,255,0.14); border: 1px solid rgba(0,255,225,0.16);"></div>
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
    const state = stateArg || catchUpState(loadState());
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

    drawPetScreen(widgetCtx, state);
  }

  function startTicker() {
    if (tickerInterval) return;
    tickerInterval = setInterval(() => {
      const state = catchUpState(loadState());
      saveState(state);
      renderWidget(state);
      if (typeof windowRenderHook === 'function') {
        windowRenderHook(state);
      }
      notifyIfNeeded(state);
    }, 30000);
  }

  function stopTicker() {
    if (tickerInterval) {
      clearInterval(tickerInterval);
      tickerInterval = null;
    }
  }

  function ensureWidget() {
    if (widgetEl) return;
    const desktop = document.querySelector('#os-overlay .os-desktop') || document.querySelector('.os-desktop');
    if (!desktop) return;

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
      <div id="pet-widget-mood" style="color:#e6e6e6; font-weight:800; font-size:12px;">Pet</div>
      <div style="display:flex; gap:6px;">
        <div id="pet-dot-h" title="Hunger" style="width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.12);"></div>
        <div id="pet-dot-hp" title="Happiness" style="width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.12);"></div>
        <div id="pet-dot-e" title="Energy" style="width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.12);"></div>
        <div id="pet-dot-c" title="Cleanliness" style="width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.12);"></div>
      </div>
    `;

    const chrome = document.createElement('div');
    chrome.style.cssText = 'padding: 10px; border-radius: 18px; background: rgba(0,0,0,0.22); border: 1px solid rgba(0,255,225,0.10); backdrop-filter: blur(10px);';
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
  }

  function destroyWidget() {
    stopTicker();
    if (widgetEl && widgetEl.parentNode) widgetEl.parentNode.removeChild(widgetEl);
    widgetEl = null;
    widgetCtx = null;
  }

  function open() {
    const existing = WindowManager.getWindowByApp('pet');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }

    let state = catchUpState(loadState());
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
    stage.style.cssText = 'display:flex; flex-direction: column; align-items:center; justify-content:center; gap: 12px; border-radius: 16px; border: 1px solid rgba(0,255,225,0.15); background: radial-gradient(circle at 30% 30%, rgba(0,255,225,0.08), transparent 55%), rgba(0,0,0,0.35); box-shadow: 0 12px 40px rgba(0,0,0,0.45); padding: 18px; margin-bottom: 14px;';

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
      const moodEl = container.querySelector('#pet-mood');
      const sub = container.querySelector('#pet-sub');
      const ageEl = container.querySelector('#pet-age');
      const nameInput = container.querySelector('#pet-name');
      const sleepBtn = container.querySelector('button[data-action="sleep"]');

      if (ageEl) ageEl.textContent = formatAge(state);
      if (moodEl) moodEl.textContent = mood.label;
      if (sub) sub.textContent = state.sleeping ? 'Zzz... (energy restoring)' : 'Keep me healthy.';
      if (nameInput && typeof nameInput.value === 'string') state.name = nameInput.value.trim() || 'Byte';
      if (sleepBtn) sleepBtn.textContent = `🛌 ${state.sleeping ? 'Wake' : 'Sleep'}`;
      if (device.nameEl) device.nameEl.textContent = state.name || 'Byte';
      drawPetScreen(stageCtx, state);

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



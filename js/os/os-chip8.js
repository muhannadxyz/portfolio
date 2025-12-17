// CHIP-8 Emulator App (lightweight, runs small ROMs)
const Chip8App = (function() {
  // Fontset (0x50..0x9F)
  const FONTSET = new Uint8Array([
    0xF0,0x90,0x90,0x90,0xF0, // 0
    0x20,0x60,0x20,0x20,0x70, // 1
    0xF0,0x10,0xF0,0x80,0xF0, // 2
    0xF0,0x10,0xF0,0x10,0xF0, // 3
    0x90,0x90,0xF0,0x10,0x10, // 4
    0xF0,0x80,0xF0,0x10,0xF0, // 5
    0xF0,0x80,0xF0,0x90,0xF0, // 6
    0xF0,0x10,0x20,0x40,0x40, // 7
    0xF0,0x90,0xF0,0x90,0xF0, // 8
    0xF0,0x90,0xF0,0x10,0xF0, // 9
    0xF0,0x90,0xF0,0x90,0x90, // A
    0xE0,0x90,0xE0,0x90,0xE0, // B
    0xF0,0x80,0x80,0x80,0xF0, // C
    0xE0,0x90,0x90,0x90,0xE0, // D
    0xF0,0x80,0xF0,0x80,0xF0, // E
    0xF0,0x80,0xF0,0x80,0x80  // F
  ]);

  // Built-in tiny ROM: IBM Logo (classic CHIP-8 demo)
  const ROM_IBM_LOGO = new Uint8Array([
    0x00,0xE0,0xA2,0x2A,0x60,0x0C,0x61,0x08,0xD0,0x1F,0x70,0x09,0xA2,0x39,0xD0,0x1F,
    0xA2,0x48,0x70,0x08,0xD0,0x1F,0x70,0x04,0xA2,0x57,0xD0,0x1F,0x70,0x08,0xA2,0x66,
    0xD0,0x1F,0x70,0x08,0xA2,0x75,0xD0,0x1F,0x12,0x00,
    // sprites
    0x3C,0x42,0xA9,0x85,0xA9,0x91,0x42,0x3C, // 0
    0x3C,0x7E,0xDB,0xFF,0xDB,0xE7,0x7E,0x3C, // 1
    0x00,0x18,0x3C,0x7E,0x7E,0x3C,0x18,0x00, // 2
    0x00,0x18,0x3C,0x7E,0x7E,0x18,0x18,0x18, // 3
    0x18,0x18,0x18,0x18,0x7E,0x3C,0x18,0x00  // 4
  ]);

  const KEYMAP = {
    '1': 0x1, '2': 0x2, '3': 0x3, '4': 0xC,
    'q': 0x4, 'w': 0x5, 'e': 0x6, 'r': 0xD,
    'a': 0x7, 's': 0x8, 'd': 0x9, 'f': 0xE,
    'z': 0xA, 'x': 0x0, 'c': 0xB, 'v': 0xF
  };

  class Chip8 {
    constructor() {
      this.memory = new Uint8Array(4096);
      this.V = new Uint8Array(16);
      this.I = 0;
      this.pc = 0x200;
      this.stack = new Uint16Array(16);
      this.sp = 0;
      this.delayTimer = 0;
      this.soundTimer = 0;
      this.gfx = new Uint8Array(64 * 32);
      this.keys = new Uint8Array(16);
      this.drawFlag = false;
      this.waitingKey = null; // { reg: x }
    }

    reset() {
      this.memory.fill(0);
      this.V.fill(0);
      this.I = 0;
      this.pc = 0x200;
      this.stack.fill(0);
      this.sp = 0;
      this.delayTimer = 0;
      this.soundTimer = 0;
      this.gfx.fill(0);
      this.keys.fill(0);
      this.drawFlag = true;
      this.waitingKey = null;

      // load font
      this.memory.set(FONTSET, 0x50);
    }

    loadRom(bytes) {
      this.reset();
      this.memory.set(bytes, 0x200);
    }

    tickTimers() {
      if (this.delayTimer > 0) this.delayTimer--;
      if (this.soundTimer > 0) this.soundTimer--;
    }

    cycle() {
      if (this.waitingKey) return;

      const op = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
      this.pc = (this.pc + 2) & 0xFFFF;

      const nnn = op & 0x0FFF;
      const nn = op & 0x00FF;
      const n = op & 0x000F;
      const x = (op >> 8) & 0x0F;
      const y = (op >> 4) & 0x0F;

      switch (op & 0xF000) {
        case 0x0000:
          if (op === 0x00E0) {
            this.gfx.fill(0);
            this.drawFlag = true;
          } else if (op === 0x00EE) {
            this.sp = Math.max(0, this.sp - 1);
            this.pc = this.stack[this.sp];
          }
          break;
        case 0x1000:
          this.pc = nnn;
          break;
        case 0x2000:
          this.stack[this.sp] = this.pc;
          this.sp = (this.sp + 1) & 0x0F;
          this.pc = nnn;
          break;
        case 0x3000:
          if (this.V[x] === nn) this.pc += 2;
          break;
        case 0x4000:
          if (this.V[x] !== nn) this.pc += 2;
          break;
        case 0x5000:
          if (n === 0 && this.V[x] === this.V[y]) this.pc += 2;
          break;
        case 0x6000:
          this.V[x] = nn;
          break;
        case 0x7000:
          this.V[x] = (this.V[x] + nn) & 0xFF;
          break;
        case 0x8000:
          switch (n) {
            case 0x0: this.V[x] = this.V[y]; break;
            case 0x1: this.V[x] = (this.V[x] | this.V[y]) & 0xFF; break;
            case 0x2: this.V[x] = (this.V[x] & this.V[y]) & 0xFF; break;
            case 0x3: this.V[x] = (this.V[x] ^ this.V[y]) & 0xFF; break;
            case 0x4: {
              const sum = this.V[x] + this.V[y];
              this.V[0xF] = sum > 0xFF ? 1 : 0;
              this.V[x] = sum & 0xFF;
              break;
            }
            case 0x5: {
              this.V[0xF] = this.V[x] >= this.V[y] ? 1 : 0;
              this.V[x] = (this.V[x] - this.V[y]) & 0xFF;
              break;
            }
            case 0x6: {
              this.V[0xF] = this.V[x] & 0x1;
              this.V[x] = (this.V[x] >> 1) & 0xFF;
              break;
            }
            case 0x7: {
              this.V[0xF] = this.V[y] >= this.V[x] ? 1 : 0;
              this.V[x] = (this.V[y] - this.V[x]) & 0xFF;
              break;
            }
            case 0xE: {
              this.V[0xF] = (this.V[x] >> 7) & 0x1;
              this.V[x] = (this.V[x] << 1) & 0xFF;
              break;
            }
          }
          break;
        case 0x9000:
          if (n === 0 && this.V[x] !== this.V[y]) this.pc += 2;
          break;
        case 0xA000:
          this.I = nnn;
          break;
        case 0xB000:
          this.pc = (nnn + this.V[0]) & 0xFFFF;
          break;
        case 0xC000:
          this.V[x] = (Math.floor(Math.random() * 256) & nn) & 0xFF;
          break;
        case 0xD000: {
          const vx = this.V[x] % 64;
          const vy = this.V[y] % 32;
          this.V[0xF] = 0;

          for (let row = 0; row < n; row++) {
            const sprite = this.memory[this.I + row];
            for (let col = 0; col < 8; col++) {
              if ((sprite & (0x80 >> col)) !== 0) {
                const px = (vx + col) % 64;
                const py = (vy + row) % 32;
                const idx = py * 64 + px;
                if (this.gfx[idx] === 1) this.V[0xF] = 1;
                this.gfx[idx] ^= 1;
              }
            }
          }
          this.drawFlag = true;
          break;
        }
        case 0xE000:
          if (nn === 0x9E) {
            if (this.keys[this.V[x]] === 1) this.pc += 2;
          } else if (nn === 0xA1) {
            if (this.keys[this.V[x]] === 0) this.pc += 2;
          }
          break;
        case 0xF000:
          switch (nn) {
            case 0x07:
              this.V[x] = this.delayTimer;
              break;
            case 0x0A:
              this.waitingKey = { reg: x };
              break;
            case 0x15:
              this.delayTimer = this.V[x];
              break;
            case 0x18:
              this.soundTimer = this.V[x];
              break;
            case 0x1E:
              this.I = (this.I + this.V[x]) & 0xFFFF;
              break;
            case 0x29:
              this.I = 0x50 + (this.V[x] * 5);
              break;
            case 0x33: {
              const v = this.V[x];
              this.memory[this.I] = Math.floor(v / 100);
              this.memory[this.I + 1] = Math.floor((v % 100) / 10);
              this.memory[this.I + 2] = v % 10;
              break;
            }
            case 0x55:
              for (let i = 0; i <= x; i++) this.memory[this.I + i] = this.V[i];
              break;
            case 0x65:
              for (let i = 0; i <= x; i++) this.V[i] = this.memory[this.I + i];
              break;
          }
          break;
      }
    }

    onKeyDown(k) {
      this.keys[k] = 1;
      if (this.waitingKey) {
        this.V[this.waitingKey.reg] = k;
        this.waitingKey = null;
      }
    }

    onKeyUp(k) {
      this.keys[k] = 0;
    }
  }

  function open() {
    const existing = WindowManager.getWindowByApp('chip8');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }

    const chip8 = new Chip8();
    chip8.loadRom(ROM_IBM_LOGO);

    let running = false;
    let speedHz = 600; // CPU cycles per second
    let rafId = null;
    let timerInterval = null;
    let lastFrame = 0;
    let cycleBudget = 0;

    const container = document.createElement('div');
    container.style.cssText = 'height:100%; display:flex; flex-direction:column; background: rgba(13,13,13,0.92); font-family: -apple-system, sans-serif;';

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.style.cssText = 'padding: 12px; display:flex; gap:10px; align-items:center; border-bottom: 1px solid rgba(0,255,225,0.1); background: rgba(20,20,20,0.9);';
    toolbar.innerHTML = `
      <button class="c8-btn" data-action="toggle">Start</button>
      <button class="c8-btn" data-action="reset">Reset</button>
      <label style="color:#999; font-size:12px; margin-left:6px;">Speed</label>
      <input id="c8-speed" type="range" min="200" max="1200" value="${speedHz}" style="flex:1;">
      <span id="c8-speed-label" style="color:#00ffe1; font-weight:700; font-size:12px; min-width:72px; text-align:right;">${speedHz}Hz</span>
      <label style="color:#999; font-size:12px; margin-left:10px;">ROM</label>
      <select id="c8-rom" style="padding:8px 10px; background: rgba(0,255,225,0.05); border: 1px solid rgba(0,255,225,0.2); border-radius: 8px; color:#e6e6e6; outline:none; font-size:12px;">
        <option value="ibm">IBM Logo</option>
      </select>
      <input id="c8-file" type="file" accept=\".ch8,.rom,application/octet-stream\" style="display:none;">
      <button class="c8-btn" data-action="upload">Upload</button>
    `;

    const btnStyle = (btn) => {
      btn.style.cssText = 'padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(0,255,225,0.2); background: rgba(0,255,225,0.08); color:#00ffe1; cursor:pointer; font-weight:800; font-size:12px; transition: all 0.15s;';
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(0,255,225,0.16)';
        btn.style.transform = 'translateY(-1px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(0,255,225,0.08)';
        btn.style.transform = 'translateY(0px)';
      });
    };
    toolbar.querySelectorAll('.c8-btn').forEach(btnStyle);

    // Canvas
    const canvasWrap = document.createElement('div');
    canvasWrap.style.cssText = 'flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 12px;';

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    canvas.style.cssText = `
      width: 640px;
      max-width: calc(100% - 24px);
      aspect-ratio: 2 / 1;
      border-radius: 14px;
      background: rgba(0,0,0,0.55);
      border: 1px solid rgba(0,255,225,0.18);
      box-shadow: 0 18px 60px rgba(0,0,0,0.55);
      image-rendering: pixelated;
    `;
    const ctx = canvas.getContext('2d');

    const help = document.createElement('div');
    help.style.cssText = 'margin-top: 12px; color:#999; font-size:12px; text-align:center; line-height:1.6;';
    help.innerHTML = `
      <div style="color:#e6e6e6; font-weight:700; margin-bottom:4px;">Keys</div>
      <div>1 2 3 4</div>
      <div>Q W E R</div>
      <div>A S D F</div>
      <div>Z X C V</div>
    `;

    canvasWrap.appendChild(canvas);
    canvasWrap.appendChild(help);

    container.appendChild(toolbar);
    container.appendChild(canvasWrap);

    function draw() {
      // Background
      ctx.clearRect(0, 0, 64, 32);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 64, 32);

      ctx.fillStyle = '#00ffe1';
      for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 64; x++) {
          if (chip8.gfx[y * 64 + x]) {
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
      chip8.drawFlag = false;
    }

    function setRunning(next) {
      running = next;
      const toggleBtn = toolbar.querySelector('button[data-action="toggle"]');
      if (toggleBtn) toggleBtn.textContent = running ? 'Pause' : 'Start';

      if (window.SoundManager) {
        window.SoundManager.ensureStarted();
        window.SoundManager.play('menu_select', { throttleMs: 0 });
      }

      if (!running) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        if (window.SoundManager) {
          window.SoundManager.setTone('chip8', false);
        }
      } else {
        lastFrame = performance.now();
        cycleBudget = 0;
        rafId = requestAnimationFrame(loop);
      }
    }

    function loop(ts) {
      // Pause if window minimized or not active
      const active = OSState.getActiveWindow();
      const thisWin = OSState.getAllWindows().find(w => w.appName === 'chip8');
      if (!running || (thisWin && thisWin.isMinimized) || (active && active.appName !== 'chip8')) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min(0.05, (ts - lastFrame) / 1000);
      lastFrame = ts;
      cycleBudget += dt * speedHz;

      const cyclesThisFrame = Math.min(200, Math.floor(cycleBudget));
      cycleBudget -= cyclesThisFrame;

      for (let i = 0; i < cyclesThisFrame; i++) {
        chip8.cycle();
      }

      if (chip8.drawFlag) draw();

      // Continuous beep while soundTimer > 0
      if (window.SoundManager) {
        window.SoundManager.setTone('chip8', chip8.soundTimer > 0, { freq: 520, type: 'square', gain: 0.06 });
      }

      rafId = requestAnimationFrame(loop);
    }

    function reset(romBytes) {
      chip8.loadRom(romBytes);
      draw();
      if (window.SoundManager) {
        window.SoundManager.ensureStarted();
        window.SoundManager.play('window_open', { throttleMs: 0 });
      }
    }

    // Timer tick at 60Hz
    timerInterval = setInterval(() => {
      chip8.tickTimers();
    }, 1000 / 60);

    // Input events
    const keyDown = (e) => {
      const k = KEYMAP[(e.key || '').toLowerCase()];
      if (k === undefined) return;
      e.preventDefault();
      chip8.onKeyDown(k);
    };
    const keyUp = (e) => {
      const k = KEYMAP[(e.key || '').toLowerCase()];
      if (k === undefined) return;
      e.preventDefault();
      chip8.onKeyUp(k);
    };
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    // Controls
    const fileInput = toolbar.querySelector('#c8-file');
    const speedInput = toolbar.querySelector('#c8-speed');
    const speedLabel = toolbar.querySelector('#c8-speed-label');
    const romSelect = toolbar.querySelector('#c8-rom');

    speedInput.addEventListener('input', () => {
      speedHz = parseInt(speedInput.value, 10);
      speedLabel.textContent = `${speedHz}Hz`;
    });

    toolbar.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;

      if (action === 'toggle') {
        setRunning(!running);
      } else if (action === 'reset') {
        const currentRom = romSelect.value === 'ibm' ? ROM_IBM_LOGO : ROM_IBM_LOGO;
        reset(currentRom);
      } else if (action === 'upload') {
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      try {
        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        reset(bytes);
        setRunning(false);
        if (window.NotificationSystem) {
          window.NotificationSystem.success('CHIP-8', `Loaded ROM: ${file.name}`, 2200);
        }
      } catch (err) {
        console.error(err);
        if (window.NotificationSystem) {
          window.NotificationSystem.error('CHIP-8', 'Failed to load ROM.', 2500);
        }
      } finally {
        fileInput.value = '';
      }
    });

    // Initial draw
    draw();

    const win = WindowManager.createWindow('chip8', 'CHIP-8', container, {
      width: 820,
      height: 620
    });

    // Cleanup on close (WindowManager clears win.intervals + win.timeouts + win.autoSaveInterval)
    win.intervals = win.intervals || [];
    win.intervals.push(timerInterval);
    win.cleanupEmu = () => {
      try {
        if (rafId) cancelAnimationFrame(rafId);
      } catch (_) {}
      rafId = null;
      running = false;
      if (window.SoundManager) window.SoundManager.setTone('chip8', false);
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('keyup', keyUp);
    };

    // Ensure cleanup happens even if window is closed via WindowManager
    const oldCleanup = win.cleanup;
    win.cleanup = () => {
      if (typeof oldCleanup === 'function') oldCleanup();
      if (typeof win.cleanupEmu === 'function') win.cleanupEmu();
    };
  }

  return { open };
})();

window.Chip8App = Chip8App;



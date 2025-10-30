// Terminal Text Lines
const terminalText = [
  "booting portfolioOS...",
  "loading personality modules...",
  "establishing neural link...",
  "initializing interface...",
  "launching Muhannad Abuzahrieh portfolio..."
];

const line = document.getElementById("terminal-line");
let index = 0;

// Type one line at a time
function typeLine(text, i = 0) {
  if (i < text.length) {
    line.innerHTML += text.charAt(i);
    setTimeout(() => typeLine(text, i + 1), 1); // 1ms delay between characters
  } else {
    line.innerHTML += "<br>"; // Add a new line after each line
    index++;
    if (index < terminalText.length) {
      setTimeout(() => typeLine(terminalText[index]), 25); // 25ms delay between lines
    } else {
      // Done with terminal: show Xbox loading
      showXboxLoading();
    }
  }
}

// Called once terminal finishes
function showXboxLoading() {
  document.getElementById("terminal-intro").style.display = "none";
  document.getElementById("xbox-loading").style.display = "flex";

  //After 1 seconds, show site content
  setTimeout(() => {
    document.getElementById("xbox-loading").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  }, 250);
}

// Allow skipping with Enter key
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    skipIntro();
  }
});

function skipIntro() {
  document.getElementById("terminal-intro").style.display = "none";
  document.getElementById("xbox-loading").style.display = "none";
  document.getElementById("main-content").style.display = "block";
}

// Mouse tracking glow
document.addEventListener('mousemove', e => {
  document.body.style.setProperty('--x', `${e.clientX}px`);
  document.body.style.setProperty('--y', `${e.clientY}px`);
});

// job Description Toggle
function toggleDescription(header) {
  const desc = header.parentElement.querySelector('.job-desc');
  desc.classList.toggle('hidden');
  const arrow = header.querySelector('.arrow');
  arrow.classList.toggle('open');
}

// Theme
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

// Past Work toggle
function togglePastWork() {
  const panel = document.getElementById('past-panel');
  panel.classList.toggle('hidden');
}

// Mini OS interactions: drag, focus, minimize/close/restore
let z = 10;

function makeDraggable(win) {
  if (win.dataset.lock === 'true') { return; }
  const bar = win.querySelector('.titlebar');
  let startX = 0, startY = 0, originLeft = 0, originTop = 0, dragging = false;

  const onDown = (e) => {
    dragging = true;
    win.style.zIndex = (++z).toString();
    startX = e.clientX; startY = e.clientY;
    const rect = win.getBoundingClientRect();
    originLeft = rect.left; originTop = rect.top;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };
  const onMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const desktop = document.getElementById('desktop').getBoundingClientRect();
    const rect = win.getBoundingClientRect();
    let newLeft = originLeft + dx;
    let newTop = originTop + dy;
    // constrain within desktop bounds
    newLeft = Math.max(desktop.left + 4, Math.min(newLeft, desktop.right - rect.width - 4));
    newTop = Math.max(desktop.top + 4, Math.min(newTop, desktop.bottom - 40));
    win.style.left = newLeft + 'px';
    win.style.top = newTop + 'px';
  };
  const onUp = () => {
    dragging = false;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  };
  bar.addEventListener('mousedown', onDown);
  // focus on click
  win.addEventListener('mousedown', () => { win.style.zIndex = (++z).toString(); });
}

function closeWindow(btn) {
  const win = btn.closest('.window');
  win.style.display = 'none';
}

function minimizeWindow(btn) {
  const win = btn.closest('.window');
  win.dataset.min = '1';
  win.style.transform = 'scale(0.98)';
  win.style.opacity = '0';
  setTimeout(() => { win.style.display = 'none'; win.style.transform = ''; win.style.opacity = ''; }, 150);
}

function maximizeWindow(btn) {
  const win = btn.closest('.window');
  const desktop = document.getElementById('desktop');
  const rect = desktop.getBoundingClientRect();
  win.style.left = rect.left + 10 + 'px';
  win.style.top = rect.top + 10 + 'px';
  win.style.width = rect.width - 20 + 'px';
}

function restoreApp(app) {
  const win = document.querySelector(`.window[data-app="${app}"]`);
  if (!win) return;
  win.style.display = 'block';
  win.style.opacity = '1';
  win.style.zIndex = (++z).toString();
}

function minimizeAll() {
  document.querySelectorAll('.desktop .window').forEach((w)=>{ w.style.display='none'; });
}

function showDesktop() {
  minimizeAll();
}

// Terminal demo: type commands with glow
function terminalDemo() {
  const term = document.querySelector('.content.term');
  if (!term) return;
  const log = document.getElementById('term-log');
  if (!log) return;
  const lines = [
    'Type \u2018help\u2019 to discover commands like projects, socials, open <url>.',
  ];
  lines.forEach((l)=>{ const d=document.createElement('div'); d.className='output'; d.textContent=l; log.appendChild(d); });
}

// Init 
window.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  typeLine(terminalText[0]); 
  // Make windows draggable
  document.querySelectorAll('.window').forEach(makeDraggable);
  // Start terminal ambient demo
  setTimeout(terminalDemo, 1500);
});

// Terminal CLI
let currentPath = '~';
function getPrompt() { return `muhannad ${currentPath} %`; }
function updatePrompt() {
  const span = document.querySelector('.term-input-row .prompt');
  if (span) span.textContent = getPrompt();
}

// Simple virtual filesystem for the terminal
const VFS = {
  '/': {
    type: 'dir',
    children: {
      projects: { type: 'dir', children: {
        lucentir: { type: 'link', url: 'https://lucentir.xyz/' },
        shadoconnect: { type: 'link', url: 'https://shadoconnect.com/' },
      } },
      socials: { type: 'dir', children: {
        github: { type: 'link', url: 'https://github.com/muhannadxyz' },
        linkedin: { type: 'link', url: 'https://www.linkedin.com/in/muhannad-abuzahrieh-0b7330265/' },
      } },
    }
  }
};

function cwdNode() {
  if (currentPath === '~') return VFS['/'];
  if (currentPath === '~/projects') return VFS['/'].children.projects;
  if (currentPath === '~/socials') return VFS['/'].children.socials;
  return VFS['/'];
}

function lsCurrent() {
  const node = cwdNode();
  if (node.type !== 'dir') return '';
  const lines = [];
  Object.keys(node.children).forEach((name) => {
    const child = node.children[name];
    if (child.type === 'dir') lines.push(`[dir] ${name}`);
    else if (child.type === 'link') lines.push(`- ${name} -> ${child.url} (tip: open ${name})`);
  });
  return lines.join('\n');
}

const COMMANDS = {
  help: () => (
    `Commands:\n`+
    `- ls: list items\n`+
    `- cd <dir>: change directory (projects, socials, /, ..)\n`+
    `- open <name|url>: open shortcut or URL\n`+
    `- socials, projects: quick jump to those dirs\n`+
    `- tile, desktop`),
  projects: () => { currentPath = '~/projects'; updatePrompt(); return lsCurrent(); },
  socials: () => { currentPath = '~/socials'; updatePrompt(); return lsCurrent(); },
  ls: () => lsCurrent(),
  tile: () => { toggleDashboard(); return 'Windows tiled.'; },
  desktop: () => { showDesktop(); return 'Desktop shown.'; }
};

function runCommand(input) {
  const [cmd, ...rest] = input.trim().split(/\s+/);
  if (!cmd) return '';
  if (cmd === 'cd') {
    const to = (rest[0] || '').toLowerCase();
    if (to === '/' || to === '~' || to === 'home') currentPath = '~';
    else if (to === '..') currentPath = '~';
    else if (to === 'projects') currentPath = '~/projects';
    else if (to === 'socials') currentPath = '~/socials';
    else return `Unknown path: ${to}`;
    updatePrompt();
    return lsCurrent();
  }
  if (cmd === 'open') {
    const raw = rest.join(' ');
    if (raw) {
      const url = resolveShortcut(raw);
      window.open(url, '_blank');
      return `Opening ${url}`;
    }
    return 'Usage: open <url>';
  }
  if (cmd === 'ls') return COMMANDS.ls();
  if (cmd === 'projects') return COMMANDS.projects();
  if (cmd === 'socials') return COMMANDS.socials();
  if (COMMANDS[cmd]) return COMMANDS[cmd]();
  return `Unknown command: ${cmd}. Type 'help'.`;
}

function resolveShortcut(text) {
  const key = text.trim().toLowerCase();
  // Resolve by current directory
  const node = cwdNode();
  if (node && node.children && node.children[key] && node.children[key].type === 'link') {
    return node.children[key].url;
  }
  if (key === 'lucentir') return 'https://lucentir.xyz/';
  if (key === 'shadoconnect' || key === 'shado') return 'https://shadoconnect.com/';
  if (key === 'github' || key === 'gh') return 'https://github.com/muhannadxyz';
  if (key === 'linkedin' || key === 'li') return 'https://www.linkedin.com/in/muhannad-abuzahrieh-0b7330265/';
  if (!/^https?:\/\//i.test(text)) return `https://${text}`;
  return text;
}

function setupTerminalInput() {
  const input = document.getElementById('term-input');
  const log = document.getElementById('term-log');
  if (!input || !log) return;
  updatePrompt();
  const history = []; let hIdx = -1;
  input.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') {
      const text = input.value;
      history.push(text); hIdx = history.length;
      const line = document.createElement('div');
      line.innerHTML = `<span class="prompt">${getPrompt()}</span> ${text}`;
      log.appendChild(line);
      const out = document.createElement('div');
      out.className = 'output';
      out.textContent = runCommand(text);
      log.appendChild(out);
      log.scrollTop = log.scrollHeight;
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      if (hIdx > 0) { hIdx--; input.value = history[hIdx] || ''; setTimeout(()=> input.setSelectionRange(input.value.length, input.value.length), 0); }
    } else if (e.key === 'ArrowDown') {
      if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx] || ''; } else { hIdx = history.length; input.value = ''; }
    }
  });
}

document.addEventListener('DOMContentLoaded', setupTerminalInput);

// --- Files app logic ---
const filesData = {
  name: '/',
  folders: {
    assets: { name: 'assets', folders: {}, files: { 'logo.svg': '<svg>...</svg>' } },
  },
  files: {
    'README.md': '# Muhannad\nThis is a mini OS demo.',
    'projects.json': '{ "projects": ["Lucentir", "ShadoConnect"] }',
    'lucentir.txt': 'Privacy-first. See clearly. Stay private.'
  }
};

let filesPath = [];

function getNode(pathArr) {
  let node = filesData;
  for (const seg of pathArr) node = node.folders[seg];
  return node;
}

function renderFiles() {
  const node = getNode(filesPath);
  const grid = document.getElementById('files-grid');
  const crumbs = document.getElementById('files-crumbs');
  const preview = document.getElementById('files-preview');
  if (!grid) return;
  grid.innerHTML = '';
  // folders
  Object.keys(node.folders).forEach((folder) => {
    const item = document.createElement('div');
    item.className = 'icon';
    item.innerHTML = `<button>🗂️ ${folder}/</button>`;
    item.querySelector('button').onclick = () => { filesPath.push(folder); renderFiles(); };
    grid.appendChild(item);
  });
  // files
  Object.keys(node.files).forEach((file) => {
    const item = document.createElement('div');
    item.className = 'icon';
    item.innerHTML = `<button>📄 ${file}</button>`;
    item.querySelector('button').onclick = () => { preview.textContent = node.files[file]; };
    grid.appendChild(item);
  });
  // crumbs
  crumbs.textContent = '/' + filesPath.join('/');
}

function filesUp() {
  if (filesPath.length) filesPath.pop();
  renderFiles();
}

// --- Browser app logic ---
function setupBrowser() {
  const address = document.querySelector('.browser .address');
  const page = document.querySelector('.browser .page');
  if (!address || !page) return;
  address.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const url = address.value.trim();
      if (url.includes('lucentir.xyz')) {
        page.textContent = 'Lucentir — See clearly. Stay private.';
      } else if (url.includes('shadoconnect')) {
        page.textContent = 'ShadoConnect — Career exploration hub.';
      } else {
        page.textContent = 'Opening in new tab: ' + url;
        window.open(url, '_blank');
      }
    }
  });
}

// Dashboard tiling
let tiled = false;
function toggleDashboard() {
  const wins = Array.from(document.querySelectorAll('.desktop .window'));
  if (!tiled) {
    const desktop = document.getElementById('desktop');
    const rect = desktop.getBoundingClientRect();
    const cols = 2;
    const rows = Math.ceil(wins.length / cols);
    const w = rect.width / cols - 20;
    const h = rect.height / rows - 20;
    wins.forEach((win, i) => {
      const c = i % cols; const r = Math.floor(i / cols);
      win.style.left = 10 + c * (w + 10) + 'px';
      win.style.top = 10 + r * (h + 10) + 'px';
      win.style.width = Math.max(320, w) + 'px';
    });
  }
  tiled = !tiled;
}

// Boot app data once content is visible
document.addEventListener('DOMContentLoaded', () => {
  renderFiles();
  setupBrowser();
});


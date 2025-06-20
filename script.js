
// Terminal Intro Typing Effect
const lines = [
  "Initializing neural interface...",
  "Connecting to mainframe...",
  "Authenticating as Guest...",
  "Loading portfolio modules...",
  "Launching UI system... ✅",
  "",
  "Welcome, Operator."
];

let i = 0;
let j = 0;
let currentLine = "";
const target = document.getElementById("terminal-line");

function typeLine() {
  if (i < lines.length) {
    currentLine = lines[i];
    if (j < currentLine.length) {
      target.textContent += currentLine.charAt(j);
      j++;
      setTimeout(typeLine, 25);
    } else {
      target.textContent += "\n";
      i++;
      j = 0;
      setTimeout(typeLine, 300);
    }
  } else {
    setTimeout(() => {
      document.getElementById("terminal-intro").style.display = "none";
      document.getElementById("main-content").style.display = "block";
    }, 1000);
  }
}

// Cursor glow tracking
document.addEventListener('mousemove', e => {
  document.body.style.setProperty('--x', `${e.clientX}px`);
  document.body.style.setProperty('--y', `${e.clientY}px`);
});

// Toggle job descriptions
function toggleDescription(btn) {
  const desc = btn.nextElementSibling;
  if (desc.classList.contains('hidden')) {
    desc.classList.remove('hidden');
    btn.textContent = 'Hide Details';
  } else {
    desc.classList.add('hidden');
    btn.textContent = 'Show Details';
  }
}

// Theme toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'light') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

// Skip intro with Enter
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    document.getElementById("terminal-intro").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  }
});

// Initialize
window.onload = () => {
  if (target) typeLine();
  document.documentElement.setAttribute('data-theme', 'dark');
};
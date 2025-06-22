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
    setTimeout(() => typeLine(text, i + 1), 40);
  } else {
    line.innerHTML += "<br>";
    index++;
    if (index < terminalText.length) {
      setTimeout(() => typeLine(terminalText[index]), 400);
    } else {
      // ⏭ Done with terminal: show Xbox loading
      showXboxLoading();
    }
  }
}

// Called once terminal finishes
function showXboxLoading() {
  document.getElementById("terminal-intro").style.display = "none";
  document.getElementById("xbox-loading").style.display = "flex";

  //After 3 seconds, show site content
  setTimeout(() => {
    document.getElementById("xbox-loading").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  }, 3000);
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
function toggleDescription(btn) {
  const desc = btn.nextElementSibling;
  desc.classList.toggle('hidden');
  btn.textContent = desc.classList.contains('hidden') ? 'Show Details' : 'Hide Details';
}

// Theme
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  typeLine(terminalText[0]);
});

// Portfolio OS - Core Initialization
(async function() {
  console.log('Portfolio OS initializing...');
  
  // Initialize filesystem
  await FileSystem.init();
  console.log('Filesystem initialized');
  
  // Load portfolio content
  await ContentLoader.load();
  console.log('Content loaded');
  
  // Initialize context menu system
  ContextMenu.init();
  console.log('Context menu initialized');
  
  // Initialize drag-drop system
  DragDrop.init();
  console.log('Drag-drop initialized');
  
  // Start menu bar clock
  MenuBar.start();
  console.log('Menu bar started');
  
  // Setup dock
  Dock.setup();
  console.log('Dock setup complete');
  
  console.log('Portfolio OS ready!');
})();

// Launch OS overlay
function launchOS() {
  const overlay = document.getElementById('os-overlay');
  const preview = document.getElementById('os-preview');
  
  if (!overlay) {
    console.error('OS overlay not found');
    return;
  }
  
  // Hide portfolio content
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.style.display = 'none';
  }
  
  // Hide preview window
  if (preview) {
    preview.style.display = 'none';
  }
  
  // Pause neural network to improve OS performance
  if (window.neuralNet) {
    window.neuralNet.pause();
  }
  
  // Show OS overlay
  overlay.style.display = 'block';
  
  // Auto-open Finder on launch
  setTimeout(() => {
    openApp('finder');
  }, 300);
  
  console.log('OS launched');
}

// Exit OS overlay
function exitOS() {
  const overlay = document.getElementById('os-overlay');
  const preview = document.getElementById('os-preview');
  const mainContent = document.getElementById('main-content');
  
  // Stop music playback before closing
  if (window.MusicApp && typeof window.MusicApp.stop === 'function') {
    window.MusicApp.stop();
  }
  
  // Close all windows
  const windows = OSState.getAllWindows();
  windows.forEach(win => {
    WindowManager.closeWindow(win.id);
  });
  
  // Hide OS overlay
  if (overlay) {
    overlay.style.display = 'none';
  }
  
  // Show portfolio content
  if (mainContent) {
    mainContent.style.display = 'block';
  }
  
  // Show preview window
  if (preview) {
    preview.style.display = 'block';
  }
  
  // Resume neural network animation
  if (window.neuralNet) {
    window.neuralNet.resume();
  }
  
  console.log('OS exited');
}

// Open app from dock
function openApp(appName) {
  console.log(`Opening ${appName}...`);
  
  switch (appName) {
    case 'finder':
      FinderApp.open();
      break;
    case 'terminal':
      TerminalApp.open();
      break;
    case 'textedit':
      TextEditApp.open('Untitled.txt', '');
      break;
    case 'browser':
      BrowserApp.open();
      break;
    case 'about':
      AboutApp.open();
      break;
    case 'settings':
      SettingsApp.open();
      break;
    case 'music':
      MusicApp.open();
      break;
    default:
      console.error(`Unknown app: ${appName}`);
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // ESC to exit OS
  if (e.key === 'Escape') {
    const overlay = document.getElementById('os-overlay');
    if (overlay && overlay.style.display === 'block') {
      exitOS();
    }
  }
  
  // Cmd/Ctrl + W to close active window
  if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
    const activeWindow = OSState.getActiveWindow();
    if (activeWindow) {
      e.preventDefault();
      WindowManager.closeWindow(activeWindow.id);
    }
  }
});

// Make functions globally available
window.launchOS = launchOS;
window.exitOS = exitOS;
window.openApp = openApp;

console.log('OS Core loaded');


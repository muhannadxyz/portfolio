// Portfolio OS - Core Initialization
(async function() {
  console.log('Portfolio OS initializing...');
  
  // Initialize achievement tracking
  if (window.AchievementTracker) {
    window.AchievementTracker.init();
    console.log('Achievement tracking initialized');
  }
  
  // Initialize notification system
  if (window.NotificationSystem) {
    window.NotificationSystem.init();
    console.log('Notification system initialized');
  }
  
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
  
  // Load saved preferences (theme, accent color, wallpaper)
  if (window.SettingsApp && typeof window.SettingsApp.loadPreferences === 'function') {
    window.SettingsApp.loadPreferences();
  }
  
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
  
  // Cleanup achievement tracking
  if (window.AchievementTracker) {
    window.AchievementTracker.cleanup();
  }
  
  console.log('OS exited');
}

// Open app from dock
function openApp(appName) {
  console.log(`Opening ${appName}...`);
  
  // Track achievement
  if (window.AchievementTracker) {
    window.AchievementTracker.trackAppOpened(appName);
  }
  
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
    case 'calculator':
      CalculatorApp.open();
      break;
    case 'weather':
      WeatherApp.open();
      break;
    case 'notes':
      NotesApp.open();
      break;
    case 'search':
      SearchApp.open();
      break;
    case 'launcher':
      LauncherApp.open();
      break;
    default:
      console.error(`Unknown app: ${appName}`);
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('os-overlay');
  if (!overlay || overlay.style.display !== 'block') return;
  
  // ESC to exit OS
  if (e.key === 'Escape') {
      exitOS();
    return;
  }
  
  // Cmd/Ctrl + W to close active window
  if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
    const activeWindow = OSState.getActiveWindow();
    if (activeWindow) {
      e.preventDefault();
      WindowManager.closeWindow(activeWindow.id);
    }
    return;
  }
  
  // Cmd/Ctrl + M to minimize
  if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
    const activeWindow = OSState.getActiveWindow();
    if (activeWindow) {
      e.preventDefault();
      WindowManager.minimizeWindow(activeWindow.id);
    }
    return;
  }
  
  // Cmd/Ctrl + N for new folder (Finder only)
  if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
    const activeWindow = OSState.getActiveWindow();
    if (activeWindow && activeWindow.appName === 'finder') {
      e.preventDefault();
      const container = activeWindow.contentElement.querySelector('.finder-container');
      if (container) {
        const btn = container.querySelector('#new-folder');
        if (btn) btn.click();
      }
    }
    return;
  }
  
  // Cmd/Ctrl + A for select all (Finder only)
  if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
    const activeWindow = OSState.getActiveWindow();
    if (activeWindow && activeWindow.appName === 'finder') {
      e.preventDefault();
      const container = activeWindow.contentElement.querySelector('.finder-container');
      if (container) {
        const files = container.querySelectorAll('.finder-file-item');
        files.forEach(file => {
          file.style.background = 'rgba(0, 255, 225, 0.2)';
        });
      }
    }
    return;
  }
  
  // Cmd/Ctrl + Z for undo
  if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
    if (window.UndoRedoSystem) {
      e.preventDefault();
      window.UndoRedoSystem.undo();
    }
    return;
  }
  
  // Cmd/Ctrl + Shift + Z for redo
  if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
    if (window.UndoRedoSystem) {
      e.preventDefault();
      window.UndoRedoSystem.redo();
    }
    return;
  }
  
  // Cmd/Ctrl + Space for launcher
  if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
    e.preventDefault();
    if (window.LauncherApp) {
      window.LauncherApp.open();
    }
    return;
  }
  
  // Cmd/Ctrl + F for search
  if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
    const activeWindow = OSState.getActiveWindow();
    // Only open search if not in a text input/textarea
    if (!activeWindow || !document.activeElement || 
        (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
      e.preventDefault();
      if (window.SearchApp) {
        window.SearchApp.open();
      }
    }
    return;
  }
  
  // Window snapping shortcuts
  if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowLeft') {
    const activeWindow = OSState.getActiveWindow();
    if (activeWindow && !activeWindow.isMaximized) {
      e.preventDefault();
      const win = activeWindow.element;
      win.style.left = '0px';
      win.style.width = '50%';
      win.style.height = `calc(100vh - 32px)`;
      win.style.top = '32px';
    }
    return;
  }
  
  if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowRight') {
    const activeWindow = OSState.getActiveWindow();
    if (activeWindow && !activeWindow.isMaximized) {
      e.preventDefault();
      const win = activeWindow.element;
      win.style.left = '50%';
      win.style.width = '50%';
      win.style.height = `calc(100vh - 32px)`;
      win.style.top = '32px';
    }
    return;
  }
});

// Make functions globally available
window.launchOS = launchOS;
window.exitOS = exitOS;
window.openApp = openApp;

console.log('OS Core loaded');


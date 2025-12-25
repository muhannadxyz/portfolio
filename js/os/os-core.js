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
  
  // Listen for postMessage to open apps from parent page
  window.addEventListener('message', (event) => {
    // Accept messages from any origin (since it's our own portfolio page)
    if (event.data && event.data.type === 'openApp' && event.data.app) {
      // Small delay to ensure OS is fully initialized
      setTimeout(() => {
        openApp(event.data.app);
      }, 100);
    }
  });
  
  // Check URL hash for app opening (e.g., os.html#openApp=notes)
  if (window.location.hash) {
    const hashMatch = window.location.hash.match(/openApp=(\w+)/);
    if (hashMatch) {
      const appName = hashMatch[1];
      // Wait for OS to be ready, then open the app
      setTimeout(() => {
        if (typeof openApp === 'function') {
          openApp(appName);
        }
      }, 500);
    }
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

  // Unlock audio on user gesture + play launch sound
  if (window.SoundManager) {
    window.SoundManager.ensureStarted();
    window.SoundManager.play('os_launch', { throttleMs: 0 });
  }

  // Show Pet widget on the desktop
  if (window.PetApp && typeof window.PetApp.ensureWidget === 'function') {
    window.PetApp.ensureWidget();
  }
  
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

  // Play exit sound
  if (window.SoundManager) {
    window.SoundManager.play('os_exit', { throttleMs: 0 });
  }
  
  // Close all windows
  const windows = OSState.getAllWindows();
  windows.forEach(win => {
    WindowManager.closeWindow(win.id);
  });

  // Remove desktop widgets
  if (window.PetApp && typeof window.PetApp.destroyWidget === 'function') {
    window.PetApp.destroyWidget();
  }
  
  // Cleanup achievement tracking
  if (window.AchievementTracker) {
    window.AchievementTracker.cleanup();
  }
  
  // If we're on the standalone os.html page, redirect to main page
  if (window.location.pathname.endsWith('os.html') || !mainContent) {
    window.location.href = 'index.html';
    return;
  }
  
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

  // UI sound for app open (safe even if AudioContext isn't unlocked yet)
  if (window.SoundManager) {
    window.SoundManager.play('dock_click', { throttleMs: 80 });
  }
  
  try {
    // Track achievement (never block opening apps)
    if (window.AchievementTracker && typeof window.AchievementTracker.trackAppOpened === 'function') {
      try {
        window.AchievementTracker.trackAppOpened(appName);
      } catch (e) {
        console.warn('AchievementTracker.trackAppOpened failed:', e);
      }
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
      case 'pet':
        if (window.PetApp && typeof window.PetApp.open === 'function') window.PetApp.open();
        else throw new Error('PetApp not available (script failed to load?)');
        break;
      case 'chip8':
        if (window.Chip8App && typeof window.Chip8App.open === 'function') window.Chip8App.open();
        else throw new Error('Chip8App not available (script failed to load?)');
        break;
      case 'search':
        SearchApp.open();
        break;
      case 'launcher':
        LauncherApp.open();
        break;
      default:
        throw new Error(`Unknown app: ${appName}`);
    }
  } catch (err) {
    console.error(`Failed to open app "${appName}":`, err);
    if (window.NotificationSystem && typeof window.NotificationSystem.error === 'function') {
      window.NotificationSystem.error('App Launch Error', `${appName}: ${err && err.message ? err.message : err}`, 4500);
    }
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


// Global OS State Management
const OSState = (function() {
  let state = {
    windows: new Map(), // windowId -> window object
    activeWindowId: null,
    runningApps: new Set(), // app names currently running
    zIndex: 1000,
    currentDirectory: '/Home', // For terminal
    preferences: {
      theme: 'dark',
      wallpaper: 'default',
      dockPosition: 'bottom',
      soundEnabled: true,
      soundVolume: 0.5
    }
  };
  
  // Load preferences from localStorage
  function loadPreferences() {
    const saved = localStorage.getItem('os_preferences');
    if (saved) {
      try {
        state.preferences = { ...state.preferences, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Error loading preferences:', e);
      }
    }
  }
  
  // Save preferences to localStorage
  function savePreferences() {
    localStorage.setItem('os_preferences', JSON.stringify(state.preferences));
  }
  
  // Window management
  function addWindow(windowId, windowObj) {
    state.windows.set(windowId, windowObj);
    state.activeWindowId = windowId;
    return windowObj;
  }
  
  function removeWindow(windowId) {
    state.windows.delete(windowId);
    if (state.activeWindowId === windowId) {
      // Set active window to the last remaining window
      const remaining = Array.from(state.windows.keys());
      state.activeWindowId = remaining[remaining.length - 1] || null;
    }
  }
  
  function getWindow(windowId) {
    return state.windows.get(windowId);
  }
  
  function getAllWindows() {
    return Array.from(state.windows.values());
  }
  
  function setActiveWindow(windowId) {
    if (state.windows.has(windowId)) {
      state.activeWindowId = windowId;
      state.zIndex++;
      return state.zIndex;
    }
    return null;
  }
  
  function getActiveWindow() {
    return state.activeWindowId ? state.windows.get(state.activeWindowId) : null;
  }
  
  function getNextZIndex() {
    return ++state.zIndex;
  }
  
  // App management
  function addRunningApp(appName) {
    state.runningApps.add(appName);
    updateDockIndicators();
  }
  
  function removeRunningApp(appName) {
    state.runningApps.delete(appName);
    updateDockIndicators();
  }
  
  function isAppRunning(appName) {
    return state.runningApps.has(appName);
  }
  
  function updateDockIndicators() {
    document.querySelectorAll('.os-dock-item').forEach(item => {
      const appName = item.dataset.app;
      if (state.runningApps.has(appName)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  // Directory management (for terminal)
  function setCurrentDirectory(path) {
    state.currentDirectory = path;
  }
  
  function getCurrentDirectory() {
    return state.currentDirectory;
  }
  
  // Preferences
  function setPreference(key, value) {
    state.preferences[key] = value;
    savePreferences();
  }
  
  function getPreference(key) {
    return state.preferences[key];
  }
  
  // Debug
  function getState() {
    return {
      windows: Array.from(state.windows.entries()),
      activeWindowId: state.activeWindowId,
      runningApps: Array.from(state.runningApps),
      zIndex: state.zIndex,
      currentDirectory: state.currentDirectory,
      preferences: state.preferences
    };
  }
  
  // Initialize
  loadPreferences();
  
  // Public API
  return {
    addWindow,
    removeWindow,
    getWindow,
    getAllWindows,
    setActiveWindow,
    getActiveWindow,
    getNextZIndex,
    addRunningApp,
    removeRunningApp,
    isAppRunning,
    setCurrentDirectory,
    getCurrentDirectory,
    setPreference,
    getPreference,
    getState
  };
})();

window.OSState = OSState;


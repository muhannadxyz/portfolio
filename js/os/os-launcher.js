// Quick Launcher - Cmd+Space launcher
const LauncherApp = (function() {
  let isOpen = false;
  let currentIndex = -1;
  let filteredApps = [];
  
  const apps = [
    { name: 'Finder', id: 'finder', icon: '📁' },
    { name: 'Terminal', id: 'terminal', icon: '💻' },
    { name: 'TextEdit', id: 'textedit', icon: '📝' },
    { name: 'Browser', id: 'browser', icon: '🌐' },
    { name: 'About Me', id: 'about', icon: '👤' },
    { name: 'Settings', id: 'settings', icon: '⚙️' },
    { name: 'Music', id: 'music', icon: '🎵' },
    { name: 'Calculator', id: 'calculator', icon: '🔢' },
    { name: 'Weather', id: 'weather', icon: '☁️' },
    { name: 'Notes', id: 'notes', icon: '📄' },
    { name: 'Search', id: 'search', icon: '🔍' }
  ];
  
  function filterApps(query) {
    if (!query || query.trim() === '') {
      return apps;
    }
    
    const lowerQuery = query.toLowerCase();
    return apps.filter(app => 
      app.name.toLowerCase().includes(lowerQuery) ||
      app.id.toLowerCase().includes(lowerQuery)
    );
  }
  
  function createLauncherContent() {
    const container = document.createElement('div');
    container.className = 'launcher-container';
    container.style.cssText = 'height: 100%; display: flex; flex-direction: column; font-family: -apple-system, sans-serif; background: rgba(13, 13, 13, 0.95); backdrop-filter: blur(20px);';
    
    // Search input
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = 'padding: 24px; border-bottom: 1px solid rgba(0, 255, 225, 0.1);';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Type to search apps...';
    searchInput.style.cssText = 'width: 100%; padding: 16px 20px; background: rgba(0, 255, 225, 0.05); border: 2px solid rgba(0, 255, 225, 0.2); border-radius: 12px; color: #e6e6e6; font-size: 18px; outline: none; transition: border-color 0.2s;';
    
    searchInput.addEventListener('input', (e) => {
      filteredApps = filterApps(e.target.value);
      currentIndex = -1;
      renderApps(container);
    });
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = Math.min(currentIndex + 1, filteredApps.length - 1);
        renderApps(container);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = Math.max(currentIndex - 1, -1);
        renderApps(container);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIndex >= 0 && currentIndex < filteredApps.length) {
          launchApp(filteredApps[currentIndex].id);
        } else if (filteredApps.length > 0) {
          launchApp(filteredApps[0].id);
        }
      } else if (e.key === 'Escape') {
        closeLauncher();
      }
    });
    
    searchContainer.appendChild(searchInput);
    container.appendChild(searchContainer);
    
    // Apps list
    const appsList = document.createElement('div');
    appsList.className = 'launcher-apps-list';
    appsList.style.cssText = 'flex: 1; overflow-y: auto; padding: 16px;';
    container.appendChild(appsList);
    
    // Initial render
    filteredApps = apps;
    renderApps(container);
    
    // Focus input
    setTimeout(() => searchInput.focus(), 100);
    
    return container;
  }
  
  function renderApps(container) {
    const appsList = container.querySelector('.launcher-apps-list');
    
    if (filteredApps.length === 0) {
      appsList.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
          <div style="font-size: 14px;">No apps found</div>
        </div>
      `;
      return;
    }
    
    appsList.innerHTML = filteredApps.map((app, index) => `
      <div class="launcher-app-item" data-index="${index}" style="
        padding: 16px;
        margin-bottom: 8px;
        background: ${index === currentIndex ? 'rgba(0, 255, 225, 0.15)' : 'rgba(0, 255, 225, 0.05)'};
        border: 1px solid ${index === currentIndex ? 'rgba(0, 255, 225, 0.3)' : 'rgba(0, 255, 225, 0.1)'};
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 16px;
      ">
        <div style="font-size: 32px;">${app.icon}</div>
        <div style="flex: 1;">
          <div style="color: #00ffe1; font-weight: 600; font-size: 16px;">${app.name}</div>
          <div style="color: #999; font-size: 12px;">Press Enter to launch</div>
        </div>
        ${index === currentIndex ? '<div style="color: #00ffe1;">↵</div>' : ''}
      </div>
    `).join('');
    
    // Add click handlers
    appsList.querySelectorAll('.launcher-app-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        launchApp(filteredApps[index].id);
      });
      
      item.addEventListener('mouseenter', () => {
        currentIndex = index;
        renderApps(container);
      });
    });
    
    // Scroll to selected item
    if (currentIndex >= 0) {
      const selectedItem = appsList.querySelector(`[data-index="${currentIndex}"]`);
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }
  
  function launchApp(appId) {
    openApp(appId);
    closeLauncher();
  }
  
  function closeLauncher() {
    const launcherWindow = WindowManager.getWindowByApp('launcher');
    if (launcherWindow) {
      WindowManager.closeWindow(launcherWindow.id);
    }
    isOpen = false;
  }
  
  function open() {
    if (isOpen) {
      const existing = WindowManager.getWindowByApp('launcher');
      if (existing) {
        WindowManager.focusWindow(existing.id);
      }
      return;
    }
    
    isOpen = true;
    currentIndex = -1;
    filteredApps = apps;
    
    const content = createLauncherContent();
    WindowManager.createWindow('launcher', 'Launcher', content, {
      width: 600,
      height: 500
    });
  }
  
  return {
    open,
    close: closeLauncher
  };
})();

window.LauncherApp = LauncherApp;


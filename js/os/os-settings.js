// Settings App
const SettingsApp = (function() {
  
  const wallpapers = [
    { id: 'default', name: 'Default Dark', gradient: 'linear-gradient(135deg, #0d0d0d, #1a1a2e)' },
    { id: 'purple', name: 'Purple Dream', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'cyan', name: 'Cyan Wave', gradient: 'linear-gradient(135deg, #00ffe1 0%, #2a82ff 100%)' },
    { id: 'sunset', name: 'Sunset', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' },
    { id: 'forest', name: 'Forest', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { id: 'midnight', name: 'Midnight', gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' }
  ];
  
  const themes = [
    { id: 'dark', name: 'Dark Mode', primary: '#00ffe1', secondary: '#2a82ff', bg: '#0d0d0d' },
    { id: 'light', name: 'Light Mode', primary: '#667eea', secondary: '#764ba2', bg: '#f5f5f5' }
  ];
  
  function createSettingsContent() {
    const container = document.createElement('div');
    container.className = 'settings-container';
    container.style.cssText = 'display: flex; height: 100%; font-family: -apple-system, sans-serif;';
    
    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'settings-sidebar';
    sidebar.style.cssText = 'width: 180px; background: rgba(20, 20, 20, 0.9); border-right: 1px solid rgba(0, 255, 225, 0.1); padding: 16px 8px; overflow-y: auto;';
    
    const sections = [
      { id: 'appearance', label: 'Appearance', icon: '🎨' },
      { id: 'wallpaper', label: 'Wallpaper', icon: '🖼️' },
      { id: 'sound', label: 'Sound', icon: '🔊' },
      { id: 'system', label: 'System', icon: '⚙️' }
    ];
    
    sections.forEach(section => {
      const item = document.createElement('div');
      item.className = 'settings-nav-item';
      item.dataset.section = section.id;
      item.style.cssText = 'padding: 10px 12px; margin-bottom: 4px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: background 0.2s; color: #e6e6e6;';
      item.innerHTML = `<span style="font-size: 18px;">${section.icon}</span><span>${section.label}</span>`;
      
      item.addEventListener('mouseenter', () => {
        item.style.background = 'rgba(0, 255, 225, 0.1)';
      });
      
      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('active')) {
          item.style.background = '';
        }
      });
      
      item.addEventListener('click', () => {
        showSection(section.id, container);
      });
      
      sidebar.appendChild(item);
    });
    
    // Content area
    const content = document.createElement('div');
    content.className = 'settings-content';
    content.style.cssText = 'flex: 1; padding: 24px; overflow-y: auto; background: rgba(13, 13, 13, 0.8);';
    
    container.appendChild(sidebar);
    container.appendChild(content);
    
    // Show first section
    setTimeout(() => {
      showSection('appearance', container);
    }, 100);
    
    return container;
  }
  
  function showSection(sectionId, container) {
    const content = container.querySelector('.settings-content');
    const navItems = container.querySelectorAll('.settings-nav-item');
    
    // Update nav active state
    navItems.forEach(item => {
      if (item.dataset.section === sectionId) {
        item.classList.add('active');
        item.style.background = 'rgba(0, 255, 225, 0.15)';
      } else {
        item.classList.remove('active');
        item.style.background = '';
      }
    });
    
    // Render section content
    switch (sectionId) {
      case 'appearance':
        renderAppearanceSection(content);
        break;
      case 'wallpaper':
        renderWallpaperSection(content);
        break;
      case 'sound':
        renderSoundSection(content);
        break;
      case 'system':
        renderSystemSection(content);
        break;
    }
  }
  
  function renderAppearanceSection(content) {
    const currentTheme = OSState.getPreference('theme') || 'dark';
    const currentAccent = OSState.getPreference('accentColor') || '#00ffe1';
    
    content.innerHTML = `
      <h2 style="color: #00ffe1; margin-bottom: 24px; font-size: 24px;">Appearance</h2>
      
      <div style="margin-bottom: 32px;">
        <h3 style="color: #e6e6e6; font-size: 16px; margin-bottom: 12px;">Theme</h3>
        <div id="theme-options" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          ${themes.map(theme => `
            <div class="theme-option" data-theme="${theme.id}" style="padding: 16px; border-radius: 8px; border: 2px solid ${currentTheme === theme.id ? '#00ffe1' : 'rgba(0, 255, 225, 0.2)'}; cursor: pointer; transition: all 0.2s; background: ${theme.bg === '#0d0d0d' ? 'rgba(13, 13, 13, 0.5)' : 'rgba(245, 245, 245, 0.1)'};">
              <div style="color: ${theme.bg === '#0d0d0d' ? '#e6e6e6' : '#333'}; font-weight: 600; margin-bottom: 8px;">${theme.name}</div>
              <div style="display: flex; gap: 8px;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background: ${theme.primary};"></div>
                <div style="width: 24px; height: 24px; border-radius: 50%; background: ${theme.secondary};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div>
        <h3 style="color: #e6e6e6; font-size: 16px; margin-bottom: 12px;">Accent Color</h3>
        <div style="display: flex; gap: 12px; align-items: center;">
          <input type="color" id="accent-color-picker" value="${currentAccent}" style="width: 50px; height: 50px; border: 2px solid rgba(0, 255, 225, 0.3); border-radius: 8px; cursor: pointer; background: transparent;">
          <div>
            <div style="color: #e6e6e6; font-size: 14px; margin-bottom: 4px;">Custom Accent</div>
            <div style="color: #999; font-size: 12px;">Click to choose a color</div>
          </div>
        </div>
      </div>
    `;
    
    // Theme selection
    content.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', () => {
        const themeId = option.dataset.theme;
        OSState.setPreference('theme', themeId);
        renderAppearanceSection(content);
        applyTheme(themeId);
      });
      
      option.addEventListener('mouseenter', () => {
        if (option.dataset.theme !== currentTheme) {
          option.style.borderColor = 'rgba(0, 255, 225, 0.5)';
        }
      });
      
      option.addEventListener('mouseleave', () => {
        if (option.dataset.theme !== currentTheme) {
          option.style.borderColor = 'rgba(0, 255, 225, 0.2)';
        }
      });
    });
    
    // Accent color picker
    const colorPicker = content.querySelector('#accent-color-picker');
    colorPicker.addEventListener('change', (e) => {
      const color = e.target.value;
      OSState.setPreference('accentColor', color);
      applyAccentColor(color);
    });
  }
  
  function renderWallpaperSection(content) {
    const currentWallpaper = OSState.getPreference('wallpaper') || 'default';
    
    content.innerHTML = `
      <h2 style="color: #00ffe1; margin-bottom: 24px; font-size: 24px;">Wallpaper</h2>
      
      <div id="wallpaper-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
        ${wallpapers.map(wp => `
          <div class="wallpaper-option" data-wallpaper="${wp.id}" style="position: relative; aspect-ratio: 16/10; border-radius: 12px; background: ${wp.gradient}; cursor: pointer; border: 3px solid ${currentWallpaper === wp.id ? '#00ffe1' : 'transparent'}; transition: all 0.2s; overflow: hidden;">
            ${currentWallpaper === wp.id ? '<div style="position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; background: #00ffe1; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; font-size: 16px;">✓</div>' : ''}
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);">
              <div style="color: #fff; font-weight: 600; font-size: 13px;">${wp.name}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    content.querySelectorAll('.wallpaper-option').forEach(option => {
      option.addEventListener('click', () => {
        const wallpaperId = option.dataset.wallpaper;
        OSState.setPreference('wallpaper', wallpaperId);
        renderWallpaperSection(content);
        applyWallpaper(wallpaperId);
      });
      
      option.addEventListener('mouseenter', () => {
        option.style.transform = 'scale(1.05)';
        option.style.boxShadow = '0 8px 24px rgba(0, 255, 225, 0.3)';
      });
      
      option.addEventListener('mouseleave', () => {
        option.style.transform = 'scale(1)';
        option.style.boxShadow = '';
      });
    });
  }
  
  function renderSoundSection(content) {
    const soundEnabled = OSState.getPreference('soundEnabled') !== false;
    const volume = OSState.getPreference('soundVolume') || 0.5;
    
    content.innerHTML = `
      <h2 style="color: #00ffe1; margin-bottom: 24px; font-size: 24px;">Sound</h2>
      
      <div style="margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: rgba(30, 30, 30, 0.5); border-radius: 8px;">
          <div>
            <div style="color: #e6e6e6; font-weight: 600; margin-bottom: 4px;">Sound Effects</div>
            <div style="color: #999; font-size: 13px;">Play sounds for window actions</div>
          </div>
          <label style="position: relative; width: 50px; height: 28px; cursor: pointer;">
            <input type="checkbox" id="sound-toggle" ${soundEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
            <span style="position: absolute; inset: 0; background: ${soundEnabled ? '#00ffe1' : '#666'}; border-radius: 14px; transition: 0.3s;"></span>
            <span style="position: absolute; left: ${soundEnabled ? '24px' : '4px'}; top: 4px; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: 0.3s;"></span>
          </label>
        </div>
      </div>
      
      <div>
        <h3 style="color: #e6e6e6; font-size: 16px; margin-bottom: 12px;">Volume</h3>
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="font-size: 20px;">🔉</span>
          <input type="range" id="volume-slider" min="0" max="100" value="${volume * 100}" class="music-player-volume" style="flex: 1;">
          <span style="color: #00ffe1; font-weight: 600; min-width: 40px;">${Math.round(volume * 100)}%</span>
        </div>
      </div>
    `;
    
    // Sound toggle
    const soundToggle = content.querySelector('#sound-toggle');
    soundToggle.addEventListener('change', (e) => {
      OSState.setPreference('soundEnabled', e.target.checked);
      renderSoundSection(content);
    });
    
    // Volume slider
    const volumeSlider = content.querySelector('#volume-slider');
    volumeSlider.addEventListener('input', (e) => {
      const vol = e.target.value / 100;
      OSState.setPreference('soundVolume', vol);
      renderSoundSection(content);
    });
  }
  
  function renderSystemSection(content) {
    content.innerHTML = `
      <h2 style="color: #00ffe1; margin-bottom: 24px; font-size: 24px;">System</h2>
      
      <div style="margin-bottom: 24px;">
        <h3 style="color: #e6e6e6; font-size: 16px; margin-bottom: 12px;">Storage</h3>
        <div style="padding: 16px; background: rgba(30, 30, 30, 0.5); border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #999;">Used Space</span>
            <span style="color: #00ffe1; font-weight: 600;" id="storage-used">Calculating...</span>
          </div>
          <div style="height: 8px; background: rgba(0, 0, 0, 0.5); border-radius: 4px; overflow: hidden;">
            <div id="storage-bar" style="height: 100%; background: linear-gradient(90deg, #00ffe1, #2a82ff); width: 0%; transition: width 0.5s;"></div>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 24px;">
        <h3 style="color: #e6e6e6; font-size: 16px; margin-bottom: 12px;">System Info</h3>
        <div style="padding: 16px; background: rgba(30, 30, 30, 0.5); border-radius: 8px; color: #999; font-size: 13px; line-height: 2;">
          <div><strong style="color: #e6e6e6;">OS Version:</strong> Portfolio OS v1.0</div>
          <div><strong style="color: #e6e6e6;">Build:</strong> 2025.01</div>
          <div><strong style="color: #e6e6e6;">Browser:</strong> ${navigator.userAgent.split(' ').pop()}</div>
        </div>
      </div>
      
      <div>
        <h3 style="color: #e6e6e6; font-size: 16px; margin-bottom: 12px;">Maintenance</h3>
        <button id="clear-cache-btn" style="padding: 12px 24px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 8px; color: #00ffe1; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 12px; transition: all 0.2s;">
          Clear Cache
        </button>
        <button id="reset-btn" style="padding: 12px 24px; background: rgba(255, 95, 87, 0.1); border: 1px solid rgba(255, 95, 87, 0.3); border-radius: 8px; color: #ff5f57; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s;">
          Reset Filesystem
        </button>
      </div>
    `;
    
    // Calculate storage
    setTimeout(async () => {
      try {
        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          const usedMB = (estimate.usage / 1024 / 1024).toFixed(2);
          const totalMB = (estimate.quota / 1024 / 1024).toFixed(2);
          const percentage = ((estimate.usage / estimate.quota) * 100).toFixed(1);
          
          const usedEl = content.querySelector('#storage-used');
          const barEl = content.querySelector('#storage-bar');
          
          if (usedEl) usedEl.textContent = `${usedMB} MB / ${totalMB} MB`;
          if (barEl) barEl.style.width = `${percentage}%`;
        }
      } catch (error) {
        console.error('Error calculating storage:', error);
      }
    }, 100);
    
    // Clear cache button
    const clearCacheBtn = content.querySelector('#clear-cache-btn');
    clearCacheBtn.addEventListener('click', async () => {
      clearCacheBtn.textContent = 'Clearing...';
      clearCacheBtn.disabled = true;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearCacheBtn.textContent = 'Cleared!';
      setTimeout(() => {
        clearCacheBtn.textContent = 'Clear Cache';
        clearCacheBtn.disabled = false;
      }, 1500);
    });
    
    clearCacheBtn.addEventListener('mouseenter', () => {
      clearCacheBtn.style.background = 'rgba(0, 255, 225, 0.2)';
    });
    
    clearCacheBtn.addEventListener('mouseleave', () => {
      clearCacheBtn.style.background = 'rgba(0, 255, 225, 0.1)';
    });
    
    // Reset button
    const resetBtn = content.querySelector('#reset-btn');
    resetBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to reset the filesystem? This will delete all custom files and restore defaults.')) {
        resetBtn.textContent = 'Resetting...';
        resetBtn.disabled = true;
        
        await FileSystem.reset();
        await ContentLoader.load();
        
        resetBtn.textContent = 'Reset Complete!';
        setTimeout(() => {
          resetBtn.textContent = 'Reset Filesystem';
          resetBtn.disabled = false;
        }, 1500);
      }
    });
    
    resetBtn.addEventListener('mouseenter', () => {
      resetBtn.style.background = 'rgba(255, 95, 87, 0.2)';
    });
    
    resetBtn.addEventListener('mouseleave', () => {
      resetBtn.style.background = 'rgba(255, 95, 87, 0.1)';
    });
  }
  
  function applyTheme(themeId) {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', themeId);
    
    // Update OS-specific theme variables
    if (themeId === 'light') {
      document.documentElement.style.setProperty('--os-bg-primary', '#f5f5f5');
      document.documentElement.style.setProperty('--os-bg-secondary', '#ffffff');
      document.documentElement.style.setProperty('--os-bg-window', 'rgba(255, 255, 255, 0.98)');
      document.documentElement.style.setProperty('--os-bg-menubar', 'rgba(245, 245, 245, 0.98)');
      document.documentElement.style.setProperty('--os-bg-dock', 'rgba(245, 245, 245, 0.95)');
      document.documentElement.style.setProperty('--os-text-primary', '#333');
      document.documentElement.style.setProperty('--os-text-secondary', '#666');
    } else {
      document.documentElement.style.setProperty('--os-bg-primary', '#0d0d0d');
      document.documentElement.style.setProperty('--os-bg-secondary', '#1a1a2e');
      document.documentElement.style.setProperty('--os-bg-window', 'rgba(20, 20, 20, 0.98)');
      document.documentElement.style.setProperty('--os-bg-menubar', 'rgba(20, 20, 20, 0.98)');
      document.documentElement.style.setProperty('--os-bg-dock', 'rgba(20, 20, 20, 0.95)');
      document.documentElement.style.setProperty('--os-text-primary', '#e6e6e6');
      document.documentElement.style.setProperty('--os-text-secondary', '#999');
    }
    
    // Save preference
    OSState.setPreference('theme', themeId);
  }
  
  function applyAccentColor(color) {
    // Convert hex to RGB for rgba usage
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Apply accent color to CSS variables
    document.documentElement.style.setProperty('--os-accent-color', color);
    document.documentElement.style.setProperty('--os-accent-rgb', `${r}, ${g}, ${b}`);
    
    // Update all accent-related variables
    document.documentElement.style.setProperty('--os-border-color', `rgba(${r}, ${g}, ${b}, 0.2)`);
    document.documentElement.style.setProperty('--os-border-light', `rgba(${r}, ${g}, ${b}, 0.1)`);
    document.documentElement.style.setProperty('--os-border-medium', `rgba(${r}, ${g}, ${b}, 0.3)`);
    document.documentElement.style.setProperty('--os-border-strong', `rgba(${r}, ${g}, ${b}, 0.5)`);
    document.documentElement.style.setProperty('--os-shadow-accent', `rgba(${r}, ${g}, ${b}, 0.2)`);
    document.documentElement.style.setProperty('--os-shadow-accent-strong', `rgba(${r}, ${g}, ${b}, 0.4)`);
    
    // Also update the legacy --a1 variable for compatibility
    document.documentElement.style.setProperty('--a1', color);
    
    // Save preference
    OSState.setPreference('accentColor', color);
  }
  
  function applyWallpaper(wallpaperId) {
    const wallpaper = wallpapers.find(wp => wp.id === wallpaperId);
    if (wallpaper) {
      const desktop = document.querySelector('.os-desktop');
      if (desktop) {
        // Preserve gradient overlays while changing base
        desktop.style.background = wallpaper.gradient;
        desktop.style.backgroundImage = `
          ${wallpaper.gradient},
          radial-gradient(circle at 20% 50%, rgba(var(--os-accent-rgb), 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(42, 130, 255, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%)
        `;
      }
    }
    
    // Save preference
    OSState.setPreference('wallpaper', wallpaperId);
  }
  
  // Load saved preferences on init
  function loadPreferences() {
    const savedTheme = OSState.getPreference('theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    }
    
    const savedAccent = OSState.getPreference('accentColor');
    if (savedAccent) {
      applyAccentColor(savedAccent);
    }
    
    const savedWallpaper = OSState.getPreference('wallpaper');
    if (savedWallpaper) {
      applyWallpaper(savedWallpaper);
    }
  }
  
  function open() {
    const existing = WindowManager.getWindowByApp('settings');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }
    
    // Load preferences when opening
    loadPreferences();
    
    const content = createSettingsContent();
    WindowManager.createWindow('settings', 'Settings', content, {
      width: 750,
      height: 550,
      left: 220,
      top: 130
    });
  }
  
  return {
    open,
    loadPreferences
  };
})();

window.SettingsApp = SettingsApp;


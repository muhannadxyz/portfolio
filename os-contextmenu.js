// Context Menu System
const ContextMenu = (function() {
  let menuEl = null;
  let currentCallback = null;
  
  function init() {
    // Create context menu element
    menuEl = document.createElement('div');
    menuEl.className = 'os-context-menu';
    menuEl.style.cssText = 'position: fixed; display: none; z-index: 10000; min-width: 200px; background: rgba(30, 30, 30, 0.98); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 8px; padding: 4px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);';
    document.body.appendChild(menuEl);
    
    // Global click handler to close menu
    document.addEventListener('click', (e) => {
      if (!menuEl.contains(e.target)) {
        hide();
      }
    });
    
    // Prevent default context menu in OS overlay
    document.addEventListener('contextmenu', (e) => {
      const osOverlay = document.getElementById('os-overlay');
      if (osOverlay && osOverlay.style.display === 'block' && osOverlay.contains(e.target)) {
        e.preventDefault();
      }
    });
  }
  
  function show(x, y, items) {
    if (!menuEl) return;
    
    // Clear previous items
    menuEl.innerHTML = '';
    
    // Add items
    items.forEach(item => {
      if (item.separator) {
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background: rgba(0, 255, 225, 0.2); margin: 4px 8px;';
        menuEl.appendChild(separator);
        return;
      }
      
      const itemEl = document.createElement('div');
      itemEl.className = 'os-context-menu-item';
      itemEl.style.cssText = 'padding: 8px 16px; color: #e6e6e6; cursor: pointer; border-radius: 4px; font-size: 13px; display: flex; justify-content: space-between; align-items: center; transition: background 0.15s;';
      
      if (item.disabled) {
        itemEl.style.opacity = '0.4';
        itemEl.style.cursor = 'not-allowed';
      }
      
      const label = document.createElement('span');
      label.textContent = item.label;
      itemEl.appendChild(label);
      
      if (item.shortcut) {
        const shortcut = document.createElement('span');
        shortcut.textContent = item.shortcut;
        shortcut.style.cssText = 'color: #999; font-size: 11px; margin-left: 24px;';
        itemEl.appendChild(shortcut);
      }
      
      if (!item.disabled) {
        itemEl.addEventListener('mouseenter', () => {
          itemEl.style.background = 'rgba(0, 255, 225, 0.15)';
        });
        
        itemEl.addEventListener('mouseleave', () => {
          itemEl.style.background = '';
        });
        
        itemEl.addEventListener('click', () => {
          if (item.action) {
            item.action();
          }
          hide();
        });
      }
      
      menuEl.appendChild(itemEl);
    });
    
    // Position menu
    menuEl.style.display = 'block';
    menuEl.style.left = `${x}px`;
    menuEl.style.top = `${y}px`;
    
    // Adjust if menu goes off screen
    const rect = menuEl.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menuEl.style.left = `${window.innerWidth - rect.width - 10}px`;
    }
    if (rect.bottom > window.innerHeight) {
      menuEl.style.top = `${window.innerHeight - rect.height - 10}px`;
    }
    
    // Fade in animation
    menuEl.style.opacity = '0';
    menuEl.style.transform = 'scale(0.95)';
    requestAnimationFrame(() => {
      menuEl.style.transition = 'opacity 0.15s, transform 0.15s';
      menuEl.style.opacity = '1';
      menuEl.style.transform = 'scale(1)';
    });
  }
  
  function hide() {
    if (menuEl) {
      menuEl.style.display = 'none';
    }
  }
  
  function isVisible() {
    return menuEl && menuEl.style.display === 'block';
  }
  
  return {
    init,
    show,
    hide,
    isVisible
  };
})();

window.ContextMenu = ContextMenu;


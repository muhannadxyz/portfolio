// Undo/Redo System
const UndoRedoSystem = (function() {
  const history = {
    undo: [],
    redo: []
  };
  const MAX_HISTORY = 50;
  
  function addAction(action) {
    history.undo.push(action);
    if (history.undo.length > MAX_HISTORY) {
      history.undo.shift();
    }
    // Clear redo stack when new action is added
    history.redo = [];
    updateMenuItems();
  }
  
  function undo() {
    if (history.undo.length === 0) return false;
    
    const action = history.undo.pop();
    history.redo.push(action);
    
    // Execute undo
    if (action.undo) {
      action.undo();
    }
    
    updateMenuItems();
    return true;
  }
  
  function redo() {
    if (history.redo.length === 0) return false;
    
    const action = history.redo.pop();
    history.undo.push(action);
    
    // Execute redo
    if (action.redo) {
      action.redo();
    }
    
    updateMenuItems();
    return true;
  }
  
  function canUndo() {
    return history.undo.length > 0;
  }
  
  function canRedo() {
    return history.redo.length > 0;
  }
  
  function updateMenuItems() {
    // This will be called by menu bar to update menu state
    // Menu items are dynamically generated, so this is handled in getEditMenuItems
  }
  
  function clear() {
    history.undo = [];
    history.redo = [];
    updateMenuItems();
  }
  
  return {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
    clear
  };
})();

window.UndoRedoSystem = UndoRedoSystem;

// Menu Bar Management
const MenuBar = (function() {
  let activeMenu = null;
  let menuDropdowns = new Map();
  
  // Update clock
  function updateClock() {
    const clockEl = document.getElementById('os-clock');
    if (!clockEl) return;
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
  }
  
  // Update app name based on active window
  function updateAppName() {
    const appNameEl = document.querySelector('.os-app-name');
    if (!appNameEl) return;
    
    const activeWindow = OSState.getActiveWindow();
    if (activeWindow) {
      const appNames = {
        'finder': 'Finder',
        'terminal': 'Terminal',
        'textedit': 'TextEdit',
        'browser': 'Browser',
        'about': 'About Me',
        'settings': 'Settings',
        'music': 'Music',
        'calculator': 'Calculator',
        'weather': 'Weather',
        'notes': 'Notes',
        'search': 'Search',
        'launcher': 'Launcher',
        'pet': 'Pet',
        'chip8': 'CHIP-8'
      };
      appNameEl.textContent = appNames[activeWindow.appName] || 'Portfolio OS';
    } else {
      appNameEl.textContent = 'Finder';
    }
  }
  
  // Create dropdown menu
  function createDropdown(menuId, items) {
    // Remove existing dropdown if any
    const existing = document.getElementById(`menu-dropdown-${menuId}`);
    if (existing) existing.remove();
    
    const dropdown = document.createElement('div');
    dropdown.id = `menu-dropdown-${menuId}`;
    dropdown.className = 'os-menu-dropdown';
    dropdown.style.cssText = `
      position: fixed;
      background: rgba(30, 30, 30, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 255, 225, 0.2);
      border-radius: 8px;
      padding: 4px 0;
      min-width: 200px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      z-index: 10000;
      font-size: 13px;
      display: none;
    `;
    
    items.forEach(item => {
      if (item.separator) {
        const separator = document.createElement('div');
        separator.style.cssText = 'height: 1px; background: rgba(0, 255, 225, 0.1); margin: 4px 0;';
        dropdown.appendChild(separator);
      } else {
        const menuItem = document.createElement('div');
        menuItem.className = 'os-menu-item-dropdown';
        menuItem.style.cssText = `
          padding: 6px 24px 6px 32px;
          color: ${item.disabled ? '#666' : '#e6e6e6'};
          cursor: ${item.disabled ? 'default' : 'pointer'};
          transition: background 0.15s;
          position: relative;
        `;
        menuItem.textContent = item.label;
        
        if (item.shortcut) {
          const shortcut = document.createElement('span');
          shortcut.textContent = item.shortcut;
          shortcut.style.cssText = 'float: right; color: #666; font-size: 11px;';
          menuItem.appendChild(shortcut);
        }
        
        if (!item.disabled) {
          menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = 'rgba(0, 255, 225, 0.15)';
          });
          
          menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = '';
          });
          
          menuItem.addEventListener('click', () => {
            if (window.SoundManager) {
              window.SoundManager.play('menu_select', { throttleMs: 40 });
            }
            if (item.action) item.action();
            hideAllMenus();
          });
        }
        
        dropdown.appendChild(menuItem);
      }
    });
    
    document.body.appendChild(dropdown);
    menuDropdowns.set(menuId, dropdown);
    return dropdown;
  }
  
  // Show dropdown menu
  function showMenu(menuId, items, menuItemEl) {
    hideAllMenus();
    
    const dropdown = createDropdown(menuId, items);
    activeMenu = menuId;
    if (window.SoundManager) {
      window.SoundManager.play('menu_open', { throttleMs: 50 });
    }
    
    const rect = menuItemEl.getBoundingClientRect();
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.top = `${rect.bottom + 2}px`;
    dropdown.style.display = 'block';
  }
  
  // Hide all menus
  function hideAllMenus() {
    menuDropdowns.forEach(dropdown => {
      dropdown.style.display = 'none';
    });
    activeMenu = null;
  }
  
  // Get menu items based on active app
  function getFileMenuItems() {
    const activeWindow = OSState.getActiveWindow();
    const isFinder = activeWindow && activeWindow.appName === 'finder';
    
    return [
      ...(isFinder ? [
        { label: 'New Folder', action: () => {
          const finderWindow = WindowManager.getWindowByApp('finder');
          if (finderWindow) {
            const container = finderWindow.contentElement.querySelector('.finder-container');
            if (container) {
              const event = new Event('click');
              const btn = container.querySelector('#new-folder');
              if (btn) btn.dispatchEvent(event);
            }
          }
        }, shortcut: '⌘N' },
        { label: 'New File', action: () => {
          const name = prompt('Enter file name:');
          if (name) {
            const finderWindow = WindowManager.getWindowByApp('finder');
            if (finderWindow) {
              const container = finderWindow.contentElement.querySelector('.finder-container');
              if (container) {
                const currentPath = container.dataset.currentPath || '/Home/Documents';
                FileSystem.createFile(name, '', currentPath).then(() => {
                  const event = new Event('refresh');
                  container.dispatchEvent(event);
                });
              }
            }
          }
        } },
        { separator: true },
        { label: 'Open', action: () => {
          const finderWindow = WindowManager.getWindowByApp('finder');
          if (finderWindow) {
            const container = finderWindow.contentElement;
            const selected = container.querySelectorAll('.finder-file-item[style*="rgba(0, 255, 225, 0.2)"]');
            if (selected.length > 0) {
              selected[0].dispatchEvent(new Event('dblclick'));
            }
          }
        }, shortcut: '⌘O' },
        { separator: true }
      ] : []),
      { label: 'Close Window', action: () => {
        const activeWindow = OSState.getActiveWindow();
        if (activeWindow) {
          WindowManager.closeWindow(activeWindow.id);
        }
      }, shortcut: '⌘W' },
      { separator: true },
      { label: 'Exit OS', action: () => {
        exitOS();
      }, shortcut: 'Esc' }
    ];
  }
  
  function getEditMenuItems() {
    const canUndo = UndoRedoSystem.canUndo();
    const canRedo = UndoRedoSystem.canRedo();
    
    return [
      { label: 'Undo', action: () => UndoRedoSystem.undo(), shortcut: '⌘Z', disabled: !canUndo },
      { label: 'Redo', action: () => UndoRedoSystem.redo(), shortcut: '⇧⌘Z', disabled: !canRedo },
      { separator: true },
      { label: 'Cut', action: () => {
        const activeWindow = OSState.getActiveWindow();
        if (activeWindow && activeWindow.appName === 'finder') {
          const container = activeWindow.contentElement.querySelector('.finder-container');
          if (container) {
            const btn = container.querySelector('#move');
            if (btn) btn.click();
          }
        }
      }, shortcut: '⌘X' },
      { label: 'Copy', action: () => {
        const activeWindow = OSState.getActiveWindow();
        if (activeWindow && activeWindow.appName === 'finder') {
          const container = activeWindow.contentElement.querySelector('.finder-container');
          if (container) {
            const btn = container.querySelector('#copy');
            if (btn) btn.click();
          }
        }
      }, shortcut: '⌘C' },
      { label: 'Paste', action: () => {
        const activeWindow = OSState.getActiveWindow();
        if (activeWindow && activeWindow.appName === 'finder') {
          const container = activeWindow.contentElement;
          container.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', metaKey: true, ctrlKey: true }));
        }
      }, shortcut: '⌘V' },
      { separator: true },
      { label: 'Select All', action: () => {
        const activeWindow = OSState.getActiveWindow();
        if (activeWindow && activeWindow.appName === 'finder') {
          const container = activeWindow.contentElement.querySelector('.finder-container');
          if (container) {
            const files = container.querySelectorAll('.finder-file-item');
            files.forEach(file => {
              file.style.background = 'rgba(0, 255, 225, 0.2)';
            });
          }
        }
      }, shortcut: '⌘A' }
    ];
  }
  
  function getViewMenuItems() {
    const activeWindow = OSState.getActiveWindow();
    const isFinder = activeWindow && activeWindow.appName === 'finder';
    
    if (!isFinder) {
      return [{ label: 'No view options', disabled: true }];
    }
    
    return [
      { label: 'Grid View', action: () => {
        const finderWindow = WindowManager.getWindowByApp('finder');
        if (finderWindow) {
          const container = finderWindow.contentElement.querySelector('.finder-container');
          if (container) {
            const btn = container.querySelector('.view-mode-btn[data-mode="grid"]');
            if (btn) btn.click();
          }
        }
      } },
      { label: 'List View', action: () => {
        const finderWindow = WindowManager.getWindowByApp('finder');
        if (finderWindow) {
          const container = finderWindow.contentElement.querySelector('.finder-container');
          if (container) {
            const btn = container.querySelector('.view-mode-btn[data-mode="list"]');
            if (btn) btn.click();
          }
        }
      } }
    ];
  }
  
  function getWindowMenuItems() {
    const windows = OSState.getAllWindows();
    
    const items = [
      { label: 'Minimize', action: () => {
        const activeWindow = OSState.getActiveWindow();
        if (activeWindow) {
          WindowManager.minimizeWindow(activeWindow.id);
        }
      }, shortcut: '⌘M' },
      { label: 'Zoom', action: () => {
        const activeWindow = OSState.getActiveWindow();
        if (activeWindow) {
          WindowManager.toggleMaximize(activeWindow.id);
        }
      } },
      { separator: true }
    ];
    
    if (windows.length > 0) {
      windows.forEach((win, index) => {
        items.push({
          label: `${index + 1}. ${win.title}`,
          action: () => {
            WindowManager.focusWindow(win.id);
          }
        });
      });
      items.push({ separator: true });
    }
    
    items.push({
      label: 'Bring All to Front',
      action: () => {
        windows.forEach(win => {
          WindowManager.focusWindow(win.id);
        });
      }
    });
    
    return items;
  }
  
  // Start clock updates
  function startClock() {
    updateClock();
    // Use setInterval but debounce the actual DOM update
    let lastUpdate = 0;
    setInterval(() => {
      const now = Date.now();
      // Only update if at least 1 second has passed (debounce)
      if (now - lastUpdate >= 1000) {
        updateClock();
        lastUpdate = now;
      }
    }, 1000);
    
    // Update app name when window focus changes (throttled)
    let lastAppNameUpdate = 0;
    setInterval(() => {
      const now = Date.now();
      // Only update if at least 500ms has passed
      if (now - lastAppNameUpdate >= 500) {
        updateAppName();
        lastAppNameUpdate = now;
      }
    }, 500);
    updateAppName();
  }
  
  // Public API
  return {
    start: startClock,
    showMenu,
    hideAllMenus,
    updateAppName
  };
})();

// Menu functions called from HTML
function toggleSystemMenu(e) {
  const menuItem = e.target.closest('.os-menu-item');
  const items = MenuBar.getSystemMenuItems();
  MenuBar.showMenu('system', items, menuItem);
}

function showFileMenu(e) {
  const menuItem = e.target.closest('.os-menu-item');
  const items = MenuBar.getFileMenuItems();
  MenuBar.showMenu('file', items, menuItem);
}

function showEditMenu(e) {
  const menuItem = e.target.closest('.os-menu-item');
  const items = MenuBar.getEditMenuItems();
  MenuBar.showMenu('edit', items, menuItem);
}

function showViewMenu(e) {
  const menuItem = e.target.closest('.os-menu-item');
  const items = MenuBar.getViewMenuItems();
  MenuBar.showMenu('view', items, menuItem);
}

function showWindowMenu(e) {
  const menuItem = e.target.closest('.os-menu-item');
  const items = MenuBar.getWindowMenuItems();
  MenuBar.showMenu('window', items, menuItem);
}

// Close menus when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.os-menu-item') && !e.target.closest('.os-menu-dropdown')) {
    MenuBar.hideAllMenus();
}
});

// Expose menu item getters
MenuBar.getFileMenuItems = function() {
  const activeWindow = OSState.getActiveWindow();
  const isFinder = activeWindow && activeWindow.appName === 'finder';
  
  return [
    ...(isFinder ? [
      { label: 'New Folder', action: () => {
        const finderWindow = WindowManager.getWindowByApp('finder');
        if (finderWindow) {
          const container = finderWindow.contentElement.querySelector('.finder-container');
          if (container) {
            const btn = container.querySelector('#new-folder');
            if (btn) btn.click();
          }
        }
      }, shortcut: '⌘N' },
      { label: 'New File', action: () => {
        const name = prompt('Enter file name:');
        if (name) {
          const finderWindow = WindowManager.getWindowByApp('finder');
          if (finderWindow) {
            const container = finderWindow.contentElement.querySelector('.finder-container');
            if (container) {
              const currentPath = container.dataset.currentPath || '/Home/Documents';
              FileSystem.createFile(name, '', currentPath).then(() => {
                window.location.reload(); // Simple refresh
              });
            }
          }
        }
      } },
      { separator: true },
      { label: 'Open', action: () => {
        const finderWindow = WindowManager.getWindowByApp('finder');
        if (finderWindow) {
          const container = finderWindow.contentElement;
          const selected = container.querySelectorAll('.finder-file-item[style*="rgba(0, 255, 225, 0.2)"]');
          if (selected.length > 0) {
            selected[0].dispatchEvent(new Event('dblclick'));
}
        }
      }, shortcut: '⌘O' },
      { separator: true }
    ] : []),
    { label: 'Close Window', action: () => {
      const activeWindow = OSState.getActiveWindow();
      if (activeWindow) {
        WindowManager.closeWindow(activeWindow.id);
      }
    }, shortcut: '⌘W' },
    { separator: true },
    { label: 'Exit OS', action: () => {
      exitOS();
    }, shortcut: 'Esc' }
  ];
};

MenuBar.getEditMenuItems = function() {
  const canUndo = UndoRedoSystem.canUndo();
  const canRedo = UndoRedoSystem.canRedo();
  
  return [
    { label: 'Undo', action: () => UndoRedoSystem.undo(), shortcut: '⌘Z', disabled: !canUndo },
    { label: 'Redo', action: () => UndoRedoSystem.redo(), shortcut: '⇧⌘Z', disabled: !canRedo },
    { separator: true },
    { label: 'Cut', action: () => {
      const activeWindow = OSState.getActiveWindow();
      if (activeWindow && activeWindow.appName === 'finder') {
        const container = activeWindow.contentElement.querySelector('.finder-container');
        if (container) {
          const btn = container.querySelector('#move');
          if (btn) btn.click();
        }
      }
    }, shortcut: '⌘X' },
    { label: 'Copy', action: () => {
      const activeWindow = OSState.getActiveWindow();
      if (activeWindow && activeWindow.appName === 'finder') {
        const container = activeWindow.contentElement.querySelector('.finder-container');
        if (container) {
          const btn = container.querySelector('#copy');
          if (btn) btn.click();
        }
      }
    }, shortcut: '⌘C' },
    { label: 'Paste', action: () => {
      const activeWindow = OSState.getActiveWindow();
      if (activeWindow && activeWindow.appName === 'finder') {
        const container = activeWindow.contentElement;
        const event = new KeyboardEvent('keydown', { key: 'v', metaKey: true, ctrlKey: true, bubbles: true });
        container.dispatchEvent(event);
      }
    }, shortcut: '⌘V' },
    { separator: true },
    { label: 'Select All', action: () => {
      const activeWindow = OSState.getActiveWindow();
      if (activeWindow && activeWindow.appName === 'finder') {
        const container = activeWindow.contentElement.querySelector('.finder-container');
        if (container) {
          const files = container.querySelectorAll('.finder-file-item');
          files.forEach(file => {
            file.style.background = 'rgba(0, 255, 225, 0.2)';
          });
        }
      }
    }, shortcut: '⌘A' }
  ];
};

MenuBar.getViewMenuItems = function() {
  const activeWindow = OSState.getActiveWindow();
  const isFinder = activeWindow && activeWindow.appName === 'finder';
  
  if (!isFinder) {
    return [{ label: 'No view options', disabled: true }];
  }
  
  return [
    { label: 'Grid View', action: () => {
      const finderWindow = WindowManager.getWindowByApp('finder');
      if (finderWindow) {
        const container = finderWindow.contentElement.querySelector('.finder-container');
        if (container) {
          const btn = container.querySelector('.view-mode-btn[data-mode="grid"]');
          if (btn) btn.click();
        }
      }
    } },
    { label: 'List View', action: () => {
      const finderWindow = WindowManager.getWindowByApp('finder');
      if (finderWindow) {
        const container = finderWindow.contentElement.querySelector('.finder-container');
        if (container) {
          const btn = container.querySelector('.view-mode-btn[data-mode="list"]');
          if (btn) btn.click();
        }
      }
    } }
  ];
};

MenuBar.getWindowMenuItems = function() {
  const windows = OSState.getAllWindows();
  
  const items = [
    { label: 'Minimize', action: () => {
      const activeWindow = OSState.getActiveWindow();
      if (activeWindow) {
        WindowManager.minimizeWindow(activeWindow.id);
      }
    }, shortcut: '⌘M' },
    { label: 'Zoom', action: () => {
      const activeWindow = OSState.getActiveWindow();
      if (activeWindow) {
        WindowManager.toggleMaximize(activeWindow.id);
      }
    } },
    { separator: true }
  ];
  
  if (windows.length > 0) {
    windows.forEach((win, index) => {
      items.push({
        label: `${index + 1}. ${win.title}`,
        action: () => {
          WindowManager.focusWindow(win.id);
        }
      });
    });
    items.push({ separator: true });
  }
  
  items.push({
    label: 'Bring All to Front',
    action: () => {
      windows.forEach(win => {
        WindowManager.focusWindow(win.id);
      });
    }
  });
  
  return items;
};

MenuBar.getSystemMenuItems = function() {
  return [
    { label: 'About Portfolio OS', action: () => {
      AboutApp.open();
    } },
    { separator: true },
    { label: 'System Preferences...', action: () => {
      SettingsApp.open();
    }, shortcut: '⌘,' },
    { separator: true },
    { label: 'Quit Portfolio OS', action: () => {
      exitOS();
    }, shortcut: '⌘Q' }
  ];
};

window.MenuBar = MenuBar;


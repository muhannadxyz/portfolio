// Window Management System
const WindowManager = (function() {
  let dragState = {
    isDragging: false,
    currentWindow: null,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0
  };
  
  let resizeState = {
    isResizing: false,
    currentWindow: null,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0
  };
  
  // Create a new window
  function createWindow(appName, title, content, options = {}) {
    const windowId = `window-${appName}-${Date.now()}`;
    const container = document.getElementById('os-windows-container');
    
    const defaultOptions = {
      width: 800,
      height: 600,
      left: 100,
      top: 100,
      resizable: true,
      minimizable: true,
      maximizable: true
    };
    
    const opts = { ...defaultOptions, ...options };
    
    // Create window element
    const windowEl = document.createElement('div');
    windowEl.className = 'os-window opening';
    windowEl.id = windowId;
    windowEl.style.width = `${opts.width}px`;
    windowEl.style.height = `${opts.height}px`;
    windowEl.style.left = `${opts.left}px`;
    windowEl.style.top = `${opts.top}px`;
    windowEl.style.zIndex = OSState.getNextZIndex();
    
    // Create titlebar
    const titlebar = document.createElement('div');
    titlebar.className = 'os-window-titlebar';
    titlebar.innerHTML = `
      <div class="os-window-controls">
        <button class="os-window-btn close" data-action="close"></button>
        ${opts.minimizable ? '<button class="os-window-btn minimize" data-action="minimize"></button>' : ''}
        ${opts.maximizable ? '<button class="os-window-btn maximize" data-action="maximize"></button>' : ''}
      </div>
      <div class="os-window-title">${title}</div>
    `;
    
    // Create content area
    const contentEl = document.createElement('div');
    contentEl.className = 'os-window-content';
    if (typeof content === 'string') {
      contentEl.innerHTML = content;
    } else {
      contentEl.appendChild(content);
    }
    
    windowEl.appendChild(titlebar);
    windowEl.appendChild(contentEl);
    
    // Add resize handles
    if (opts.resizable) {
      addResizeHandles(windowEl);
    }
    
    // Add to DOM
    container.appendChild(windowEl);
    
    // Setup event listeners
    setupWindowEvents(windowEl, titlebar, appName);
    
    // Store in state
    const windowObj = {
      id: windowId,
      appName,
      title,
      element: windowEl,
      contentElement: contentEl,
      isMaximized: false,
      isMinimized: false,
      originalBounds: { ...opts }
    };
    
    OSState.addWindow(windowId, windowObj);
    OSState.addRunningApp(appName);
    
    // Remove opening class after animation
    setTimeout(() => {
      windowEl.classList.remove('opening');
    }, 300);
    
    return windowObj;
  }
  
  // Add resize handles to window
  function addResizeHandles(windowEl) {
    const handles = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
    handles.forEach(handle => {
      const div = document.createElement('div');
      div.className = `os-window-resize-handle ${handle}`;
      div.dataset.handle = handle;
      windowEl.appendChild(div);
    });
  }
  
  // Setup window event listeners
  function setupWindowEvents(windowEl, titlebar, appName) {
    const windowId = windowEl.id;
    
    // Click to focus
    windowEl.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.os-window-btn')) {
        focusWindow(windowId);
      }
    });
    
    // Titlebar drag
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.os-window-btn')) return;
      startDrag(windowEl, e);
    });
    
    // Window control buttons
    windowEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.os-window-btn');
      if (!btn) return;
      
      const action = btn.dataset.action;
      if (action === 'close') closeWindow(windowId);
      else if (action === 'minimize') minimizeWindow(windowId);
      else if (action === 'maximize') toggleMaximize(windowId);
    });
    
    // Resize handles
    windowEl.querySelectorAll('.os-window-resize-handle').forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        startResize(windowEl, handle.dataset.handle, e);
      });
    });
  }
  
  // Drag functions
  function startDrag(windowEl, e) {
    const windowObj = OSState.getWindow(windowEl.id);
    if (windowObj.isMaximized) return; // Can't drag maximized windows
    
    dragState.isDragging = true;
    dragState.currentWindow = windowEl;
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    dragState.startLeft = parseInt(windowEl.style.left);
    dragState.startTop = parseInt(windowEl.style.top);
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    
    e.preventDefault();
  }
  
  function handleDrag(e) {
    if (!dragState.isDragging) return;
    
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    
    let newLeft = dragState.startLeft + dx;
    let newTop = dragState.startTop + dy;
    
    // Constrain to viewport
    const maxLeft = window.innerWidth - 100;
    const maxTop = window.innerHeight - 100;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(32, Math.min(newTop, maxTop)); // 32px for menubar
    
    dragState.currentWindow.style.left = `${newLeft}px`;
    dragState.currentWindow.style.top = `${newTop}px`;
  }
  
  function stopDrag() {
    dragState.isDragging = false;
    dragState.currentWindow = null;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  }
  
  // Resize functions
  function startResize(windowEl, handle, e) {
    resizeState.isResizing = true;
    resizeState.currentWindow = windowEl;
    resizeState.handle = handle;
    resizeState.startX = e.clientX;
    resizeState.startY = e.clientY;
    resizeState.startWidth = windowEl.offsetWidth;
    resizeState.startHeight = windowEl.offsetHeight;
    resizeState.startLeft = parseInt(windowEl.style.left);
    resizeState.startTop = parseInt(windowEl.style.top);
    
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    
    e.preventDefault();
    e.stopPropagation();
  }
  
  function handleResize(e) {
    if (!resizeState.isResizing) return;
    
    const dx = e.clientX - resizeState.startX;
    const dy = e.clientY - resizeState.startY;
    const win = resizeState.currentWindow;
    const handle = resizeState.handle;
    
    let newWidth = resizeState.startWidth;
    let newHeight = resizeState.startHeight;
    let newLeft = resizeState.startLeft;
    let newTop = resizeState.startTop;
    
    if (handle.includes('right')) {
      newWidth = Math.max(400, resizeState.startWidth + dx);
    }
    if (handle.includes('left')) {
      newWidth = Math.max(400, resizeState.startWidth - dx);
      newLeft = resizeState.startLeft + dx;
    }
    if (handle.includes('bottom')) {
      newHeight = Math.max(300, resizeState.startHeight + dy);
    }
    if (handle.includes('top')) {
      newHeight = Math.max(300, resizeState.startHeight - dy);
      newTop = resizeState.startTop + dy;
    }
    
    win.style.width = `${newWidth}px`;
    win.style.height = `${newHeight}px`;
    win.style.left = `${newLeft}px`;
    win.style.top = `${newTop}px`;
  }
  
  function stopResize() {
    resizeState.isResizing = false;
    resizeState.currentWindow = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  }
  
  // Window actions
  function focusWindow(windowId) {
    const zIndex = OSState.setActiveWindow(windowId);
    const windowObj = OSState.getWindow(windowId);
    if (windowObj && zIndex) {
      windowObj.element.style.zIndex = zIndex;
    }
  }
  
  function closeWindow(windowId) {
    const windowObj = OSState.getWindow(windowId);
    if (!windowObj) return;
    
    // If closing music app, stop playback
    if (windowObj.appName === 'music' && window.MusicApp && typeof window.MusicApp.stop === 'function') {
      window.MusicApp.stop();
    }
    
    windowObj.element.classList.add('closing');
    
    setTimeout(() => {
      windowObj.element.remove();
      OSState.removeWindow(windowId);
      
      // Check if any windows for this app are still open
      const appWindows = OSState.getAllWindows().filter(w => w.appName === windowObj.appName);
      if (appWindows.length === 0) {
        OSState.removeRunningApp(windowObj.appName);
      }
    }, 200);
  }
  
  function minimizeWindow(windowId) {
    const windowObj = OSState.getWindow(windowId);
    if (!windowObj) return;
    
    windowObj.isMinimized = true;
    windowObj.element.style.display = 'none';
  }
  
  function restoreWindow(windowId) {
    const windowObj = OSState.getWindow(windowId);
    if (!windowObj) return;
    
    windowObj.isMinimized = false;
    windowObj.element.style.display = 'flex';
    focusWindow(windowId);
  }
  
  function toggleMaximize(windowId) {
    const windowObj = OSState.getWindow(windowId);
    if (!windowObj) return;
    
    if (windowObj.isMaximized) {
      // Restore
      const bounds = windowObj.originalBounds;
      windowObj.element.style.width = `${bounds.width}px`;
      windowObj.element.style.height = `${bounds.height}px`;
      windowObj.element.style.left = `${bounds.left}px`;
      windowObj.element.style.top = `${bounds.top}px`;
      windowObj.element.classList.remove('maximized');
      windowObj.isMaximized = false;
    } else {
      // Maximize
      windowObj.originalBounds = {
        width: windowObj.element.offsetWidth,
        height: windowObj.element.offsetHeight,
        left: parseInt(windowObj.element.style.left),
        top: parseInt(windowObj.element.style.top)
      };
      windowObj.element.classList.add('maximized');
      windowObj.isMaximized = true;
    }
  }
  
  // Get window by app name
  function getWindowByApp(appName) {
    const windows = OSState.getAllWindows();
    return windows.find(w => w.appName === appName);
  }
  
  // Public API
  return {
    createWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximize,
    focusWindow,
    getWindowByApp
  };
})();

window.WindowManager = WindowManager;


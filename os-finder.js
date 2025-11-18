// Finder App - File Browser (Enhanced)
const FinderApp = (function() {
  let currentPath = '/Home';
  let selectedFiles = new Set();
  let viewMode = 'grid'; // 'grid' or 'list'
  
  function getFileIcon(file) {
    if (file.type === 'folder') return '📁';
    
    const ext = file.name.split('.').pop().toLowerCase();
    const iconMap = {
      'md': '📝',
      'txt': '📄',
      'js': '📜',
      'html': '🌐',
      'css': '🎨',
      'json': '⚙️',
      'py': '🐍',
      'cpp': '⚡',
      'c': '⚡',
      'h': '⚡',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'pdf': '📕',
      'zip': '📦',
      'mp3': '🎵',
      'mp4': '🎬'
    };
    
    return iconMap[ext] || '📄';
  }
  
  function createFinderContent() {
    const container = document.createElement('div');
    container.className = 'finder-container';
    container.style.cssText = 'display: flex; height: 100%; font-family: -apple-system, sans-serif;';
    
    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'finder-sidebar';
    sidebar.style.cssText = 'width: 200px; background: rgba(30, 30, 30, 0.9); border-right: 1px solid rgba(0, 255, 225, 0.1); padding: 12px; overflow-y: auto;';
    sidebar.innerHTML = `
      <div style="font-weight: 600; font-size: 12px; color: #999; margin-bottom: 8px; text-transform: uppercase;">Favorites</div>
      <div class="finder-nav-item" data-path="/Home" style="padding: 6px 12px; border-radius: 6px; cursor: pointer; margin-bottom: 2px; transition: background 0.2s;">🏠 Home</div>
      <div class="finder-nav-item" data-path="/Home/Documents" style="padding: 6px 12px; border-radius: 6px; cursor: pointer; margin-bottom: 2px; transition: background 0.2s;">📄 Documents</div>
      <div class="finder-nav-item" data-path="/Home/Projects" style="padding: 6px 12px; border-radius: 6px; cursor: pointer; margin-bottom: 2px; transition: background 0.2s;">💼 Projects</div>
      <div class="finder-nav-item" data-path="/Home/Pictures" style="padding: 6px 12px; border-radius: 6px; cursor: pointer; margin-bottom: 2px; transition: background 0.2s;">🖼️ Pictures</div>
    `;
    
    // Main content
    const main = document.createElement('div');
    main.className = 'finder-main';
    main.style.cssText = 'flex: 1; display: flex; flex-direction: column; overflow: hidden;';
    
    // Toolbar with breadcrumb and view options
    const toolbar = document.createElement('div');
    toolbar.className = 'finder-toolbar';
    toolbar.style.cssText = 'padding: 12px 16px; background: rgba(20, 20, 20, 0.5); border-bottom: 1px solid rgba(0, 255, 225, 0.1); display: flex; justify-content: space-between; align-items: center;';
    
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'finder-breadcrumb';
    breadcrumb.style.cssText = 'font-size: 13px; color: #999; flex: 1;';
    
    const viewToggle = document.createElement('div');
    viewToggle.style.cssText = 'display: flex; gap: 4px;';
    viewToggle.innerHTML = `
      <button class="view-mode-btn" data-mode="grid" style="padding: 6px 12px; background: rgba(0, 255, 225, 0.15); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 12px;">Grid</button>
      <button class="view-mode-btn" data-mode="list" style="padding: 6px 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 12px;">List</button>
    `;
    
    toolbar.appendChild(breadcrumb);
    toolbar.appendChild(viewToggle);
    
    // File grid
    const fileGrid = document.createElement('div');
    fileGrid.className = 'finder-files';
    fileGrid.style.cssText = 'flex: 1; padding: 16px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; align-content: start;';
    
    main.appendChild(toolbar);
    main.appendChild(fileGrid);
    
    container.appendChild(sidebar);
    container.appendChild(main);
    
    // Setup events
    setTimeout(() => {
      setupFinderEvents(container);
      navigateToPath('/Home', container);
    }, 100);
    
    return container;
  }
  
  function setupFinderEvents(container) {
    // Sidebar navigation
    container.querySelectorAll('.finder-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const path = item.dataset.path;
        navigateToPath(path, container);
      });
      
      item.addEventListener('mouseenter', () => {
        item.style.background = 'rgba(0, 255, 225, 0.1)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.background = '';
      });
      
      // Make sidebar items drop zones
      DragDrop.makeDropZone(item, `finder-sidebar-${item.dataset.path}`, async (data) => {
        if (data.type === 'file') {
          await moveFileToFolder(data.path, item.dataset.path, container);
        }
      });
    });
    
    // View mode toggle
    container.querySelectorAll('.view-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        viewMode = btn.dataset.mode;
        container.querySelectorAll('.view-mode-btn').forEach(b => {
          b.style.background = 'rgba(0, 255, 225, 0.1)';
        });
        btn.style.background = 'rgba(0, 255, 225, 0.15)';
        navigateToPath(currentPath, container);
      });
    });
  }
  
  async function navigateToPath(path, container) {
    currentPath = path;
    selectedFiles.clear();
    const breadcrumb = container.querySelector('.finder-breadcrumb');
    const fileGrid = container.querySelector('.finder-files');
    
    // Update breadcrumb with clickable segments
    const pathParts = path.split('/').filter(p => p);
    let breadcrumbHTML = '<span style="color: #00ffe1; cursor: pointer;" class="breadcrumb-part" data-path="/">📁 Root</span>';
    
    let cumulativePath = '';
    pathParts.forEach((part, index) => {
      cumulativePath += '/' + part;
      breadcrumbHTML += ` <span style="color: #666;">›</span> <span style="color: ${index === pathParts.length - 1 ? '#00ffe1' : '#999'}; cursor: pointer;" class="breadcrumb-part" data-path="${cumulativePath}">${part}</span>`;
    });
    
    breadcrumb.innerHTML = breadcrumbHTML;
    
    // Add breadcrumb click handlers
    breadcrumb.querySelectorAll('.breadcrumb-part').forEach(part => {
      part.addEventListener('click', () => {
        navigateToPath(part.dataset.path, container);
      });
      
      part.addEventListener('mouseenter', () => {
        part.style.textDecoration = 'underline';
      });
      
      part.addEventListener('mouseleave', () => {
        part.style.textDecoration = 'none';
      });
    });
    
    // Load files
    try {
      const files = await FileSystem.listDirectory(path);
      renderFiles(files, fileGrid, container);
    } catch (error) {
      console.error('Error loading directory:', error);
      fileGrid.innerHTML = '<div style="color: #ff5f57; padding: 20px;">Error loading directory</div>';
    }
  }
  
  function renderFiles(files, fileGrid, container) {
    fileGrid.innerHTML = '';
    
    // Update grid style based on view mode
    if (viewMode === 'list') {
      fileGrid.style.display = 'flex';
      fileGrid.style.flexDirection = 'column';
      fileGrid.style.gap = '4px';
    } else {
      fileGrid.style.display = 'grid';
      fileGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
      fileGrid.style.gap = '16px';
    }
    
    if (files.length === 0) {
      fileGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #999; padding: 40px;">This folder is empty</div>';
      return;
    }
    
    // Make file grid a drop zone
    DragDrop.makeDropZone(fileGrid, 'finder-grid', async (data) => {
      if (data.type === 'file') {
        await moveFileToFolder(data.path, currentPath, container);
      }
    });
    
    files.forEach(file => {
      const fileEl = document.createElement('div');
      fileEl.className = 'finder-file-item';
      fileEl.dataset.filePath = file.path;
      
      const icon = getFileIcon(file);
      const name = viewMode === 'list' ? file.name : (file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name);
      
      if (viewMode === 'grid') {
        fileEl.style.cssText = 'display: flex; flex-direction: column; align-items: center; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; position: relative;';
        fileEl.innerHTML = `
          <div style="font-size: 48px; margin-bottom: 8px;">${icon}</div>
          <div style="font-size: 12px; text-align: center; word-break: break-word;">${name}</div>
        `;
      } else {
        fileEl.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: all 0.2s;';
        fileEl.innerHTML = `
          <div style="font-size: 24px;">${icon}</div>
          <div style="flex: 1; font-size: 13px;">${file.name}</div>
          <div style="font-size: 11px; color: #666;">${file.type}</div>
        `;
      }
      
      // Selection styling
      if (selectedFiles.has(file.path)) {
        fileEl.style.background = 'rgba(0, 255, 225, 0.2)';
        fileEl.style.borderColor = '#00ffe1';
      }
      
      // Drag and drop
      DragDrop.makeDraggable(fileEl, {type: 'file', path: file.path, name: file.name}, {
        ghostContent: `${icon} ${file.name}`,
        onDragStart: () => {
          fileEl.style.opacity = '0.5';
        },
        onDragEnd: () => {
          fileEl.style.opacity = '1';
        }
      });
      
      // Make folders drop zones
      if (file.type === 'folder') {
        DragDrop.makeDropZone(fileEl, `finder-folder-${file.path}`, async (data) => {
          if (data.type === 'file' && data.path !== file.path) {
            await moveFileToFolder(data.path, file.path, container);
          }
        });
      }
      
      // Click handler for selection
      fileEl.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey) {
          // Multi-select
          if (selectedFiles.has(file.path)) {
            selectedFiles.delete(file.path);
            fileEl.style.background = '';
          } else {
            selectedFiles.add(file.path);
            fileEl.style.background = 'rgba(0, 255, 225, 0.2)';
          }
        } else {
          // Single select
          selectedFiles.clear();
          container.querySelectorAll('.finder-file-item').forEach(el => {
            el.style.background = '';
          });
          selectedFiles.add(file.path);
          fileEl.style.background = 'rgba(0, 255, 225, 0.2)';
        }
      });
      
      // Hover effect
      fileEl.addEventListener('mouseenter', () => {
        if (!selectedFiles.has(file.path)) {
          fileEl.style.background = 'rgba(0, 255, 225, 0.08)';
        }
      });
      
      fileEl.addEventListener('mouseleave', () => {
        if (!selectedFiles.has(file.path)) {
          fileEl.style.background = '';
        } else {
          fileEl.style.background = 'rgba(0, 255, 225, 0.2)';
        }
      });
      
      // Double click to open
      fileEl.addEventListener('dblclick', () => {
        handleFileOpen(file, container);
      });
      
      // Context menu
      fileEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, file, container);
      });
      
      fileGrid.appendChild(fileEl);
    });
  }
  
  async function handleFileOpen(file, container) {
    if (file.type === 'folder') {
      navigateToPath(file.path, container);
    } else {
      // Open file in TextEdit
      const content = file.content || '';
      TextEditApp.open(file.name, content, file.path);
    }
  }
  
  function showContextMenu(x, y, file, container) {
    const menuItems = [
      {
        label: 'Open',
        action: () => handleFileOpen(file, container)
      },
      {
        label: 'Rename',
        action: () => renameFile(file, container)
      },
      { separator: true },
      {
        label: 'Delete',
        action: async () => {
          if (confirm(`Delete "${file.name}"?`)) {
            await FileSystem.deleteFile(file.path);
            navigateToPath(currentPath, container);
          }
        }
      },
      { separator: true },
      {
        label: 'Get Info',
        action: () => showFileInfo(file)
      }
    ];
    
    ContextMenu.show(x, y, menuItems);
  }
  
  function renameFile(file, container) {
    const newName = prompt('Rename file:', file.name);
    if (newName && newName !== file.name) {
      // Simplified rename - in production would use FileSystem API
      console.log(`Rename ${file.name} to ${newName}`);
      navigateToPath(currentPath, container);
    }
  }
  
  function showFileInfo(file) {
    const size = file.content ? `${file.content.length} bytes` : 'Unknown';
    const info = `
Name: ${file.name}
Type: ${file.type}
Path: ${file.path}
Size: ${size}
    `.trim();
    
    alert(info);
  }
  
  async function moveFileToFolder(filePath, targetFolder, container) {
    console.log(`Moving ${filePath} to ${targetFolder}`);
    // Simplified move - in production would use FileSystem API
    // For now, just refresh the view
    navigateToPath(currentPath, container);
  }
  
  function open() {
    // Check if already open
    const existing = WindowManager.getWindowByApp('finder');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }
    
    const content = createFinderContent();
    WindowManager.createWindow('finder', 'Finder', content, {
      width: 900,
      height: 600,
      left: 150,
      top: 100
    });
  }
  
  return {
    open
  };
})();

window.FinderApp = FinderApp;


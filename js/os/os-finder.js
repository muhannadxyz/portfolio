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
    
    // Toolbar with buttons, breadcrumb and view options
    const toolbar = document.createElement('div');
    toolbar.className = 'finder-toolbar';
    toolbar.style.cssText = 'padding: 12px 16px; background: rgba(20, 20, 20, 0.5); border-bottom: 1px solid rgba(0, 255, 225, 0.1); display: flex; align-items: center; gap: 12px;';
    
    // Toolbar buttons
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'finder-toolbar-buttons';
    buttonGroup.style.cssText = 'display: flex; gap: 6px;';
    
    const buttons = [
      { id: 'new-folder', label: '📁 New Folder', title: 'New Folder (Cmd+N)' },
      { id: 'delete', label: '🗑️ Delete', title: 'Delete (Delete key)' },
      { id: 'copy', label: '📋 Copy', title: 'Copy (Cmd+C)' },
      { id: 'move', label: '✂️ Move', title: 'Move (Cmd+X)' },
      { id: 'rename', label: '✏️ Rename', title: 'Rename' }
    ];
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.id = btn.id;
      button.className = 'finder-toolbar-btn';
      button.textContent = btn.label;
      button.title = btn.title;
      button.style.cssText = 'padding: 6px 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.2); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 12px; transition: all 0.2s;';
      
      button.addEventListener('mouseenter', () => {
        button.style.background = 'rgba(0, 255, 225, 0.2)';
        button.style.borderColor = 'rgba(0, 255, 225, 0.4)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.background = 'rgba(0, 255, 225, 0.1)';
        button.style.borderColor = 'rgba(0, 255, 225, 0.2)';
      });
      
      buttonGroup.appendChild(button);
    });
    
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'finder-breadcrumb';
    breadcrumb.style.cssText = 'font-size: 13px; color: #999; flex: 1;';
    
    const viewToggle = document.createElement('div');
    viewToggle.style.cssText = 'display: flex; gap: 4px;';
    viewToggle.innerHTML = `
      <button class="view-mode-btn" data-mode="grid" style="padding: 6px 12px; background: rgba(0, 255, 225, 0.15); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 12px;">Grid</button>
      <button class="view-mode-btn" data-mode="list" style="padding: 6px 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 12px;">List</button>
    `;
    
    toolbar.appendChild(buttonGroup);
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
    
    // Toolbar button handlers
    const newFolderBtn = container.querySelector('#new-folder');
    const deleteBtn = container.querySelector('#delete');
    const copyBtn = container.querySelector('#copy');
    const moveBtn = container.querySelector('#move');
    const renameBtn = container.querySelector('#rename');
    
    newFolderBtn.addEventListener('click', () => createNewFolder(container));
    deleteBtn.addEventListener('click', () => deleteSelectedFiles(container));
    copyBtn.addEventListener('click', () => copySelectedFiles(container));
    moveBtn.addEventListener('click', () => moveSelectedFiles(container));
    renameBtn.addEventListener('click', () => renameSelectedFile(container));
    
    // Keyboard shortcuts
    container.addEventListener('keydown', (e) => {
      const activeWindow = OSState.getActiveWindow();
      if (!activeWindow || activeWindow.appName !== 'finder') return;
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        createNewFolder(container);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedFiles.size > 0) {
          e.preventDefault();
          deleteSelectedFiles(container);
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        if (selectedFiles.size > 0) {
          e.preventDefault();
          copySelectedFiles(container);
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'x') {
        if (selectedFiles.size > 0) {
          e.preventDefault();
          moveSelectedFiles(container);
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        pasteFiles(container);
      }
    });
  }
  
  async function navigateToPath(path, container) {
    currentPath = path;
    container.dataset.currentPath = path; // Store for menu access
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
            try {
              await FileSystem.deleteFile(file.path);
              navigateToPath(currentPath, container);
            } catch (error) {
              alert(`Error deleting file: ${error.message}`);
            }
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
    try {
      const file = await FileSystem.readFile(filePath);
      if (!file) {
        alert('File not found');
        return;
      }
      
      const newPath = targetFolder === '/' ? `/${file.name}` : `${targetFolder}/${file.name}`;
      await FileSystem.moveFile(filePath, newPath);
      navigateToPath(currentPath, container);
    } catch (error) {
      alert(`Error moving file: ${error.message}`);
    }
  }
  
  // Clipboard for copy/paste operations
  let clipboard = null;
  
  async function createNewFolder(container) {
    const name = prompt('Enter folder name:');
    if (!name || name.trim() === '') return;
    
    try {
      const folderPath = currentPath === '/' ? `/${name.trim()}` : `${currentPath}/${name.trim()}`;
      await FileSystem.createFolder(name.trim(), currentPath);
      
      // Add to undo history
      if (window.UndoRedoSystem) {
        window.UndoRedoSystem.addAction({
          undo: async () => {
            try {
              await FileSystem.deleteFile(folderPath);
              navigateToPath(currentPath, container);
            } catch (e) {
              console.error('Undo failed:', e);
            }
          },
          redo: async () => {
            try {
              await FileSystem.createFolder(name.trim(), currentPath);
              navigateToPath(currentPath, container);
            } catch (e) {
              console.error('Redo failed:', e);
            }
          }
        });
      }
      
      navigateToPath(currentPath, container);
    } catch (error) {
      alert(`Error creating folder: ${error.message}`);
    }
  }
  
  async function deleteSelectedFiles(container) {
    if (selectedFiles.size === 0) {
      alert('No files selected');
      return;
    }
    
    const count = selectedFiles.size;
    if (!confirm(`Delete ${count} item(s)?`)) return;
    
    try {
      const deletedFiles = [];
      for (const filePath of selectedFiles) {
        const file = await FileSystem.readFile(filePath);
        if (file) {
          deletedFiles.push({ path: filePath, file: file });
          await FileSystem.deleteFile(filePath);
        }
      }
      
      // Add to undo history
      if (window.UndoRedoSystem && deletedFiles.length > 0) {
        window.UndoRedoSystem.addAction({
          undo: async () => {
            try {
              for (const item of deletedFiles) {
                if (item.file.type === 'folder') {
                  await FileSystem.createFolder(item.file.name, item.file.parent);
                } else {
                  await FileSystem.createFile(item.file.name, item.file.content, item.file.parent);
                }
              }
              navigateToPath(currentPath, container);
            } catch (e) {
              console.error('Undo failed:', e);
            }
          },
          redo: async () => {
            try {
              for (const item of deletedFiles) {
                await FileSystem.deleteFile(item.path);
              }
              navigateToPath(currentPath, container);
            } catch (e) {
              console.error('Redo failed:', e);
            }
          }
        });
      }
      
      selectedFiles.clear();
      navigateToPath(currentPath, container);
    } catch (error) {
      alert(`Error deleting files: ${error.message}`);
    }
  }
  
  async function copySelectedFiles(container) {
    if (selectedFiles.size === 0) {
      alert('No files selected');
      return;
    }
    
    clipboard = {
      operation: 'copy',
      files: Array.from(selectedFiles)
    };
    
    // Visual feedback
    const copyBtn = container.querySelector('#copy');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1000);
  }
  
  async function moveSelectedFiles(container) {
    if (selectedFiles.size === 0) {
      alert('No files selected');
      return;
    }
    
    clipboard = {
      operation: 'move',
      files: Array.from(selectedFiles)
    };
    
    // Visual feedback
    const moveBtn = container.querySelector('#move');
    const originalText = moveBtn.textContent;
    moveBtn.textContent = '✓ Cut';
    setTimeout(() => {
      moveBtn.textContent = originalText;
    }, 1000);
  }
  
  async function pasteFiles(container) {
    if (!clipboard || clipboard.files.length === 0) {
      return;
    }
    
    try {
      for (const filePath of clipboard.files) {
        const file = await FileSystem.readFile(filePath);
        if (!file) continue;
        
        const newName = file.name;
        const newPath = currentPath === '/' ? `/${newName}` : `${currentPath}/${newName}`;
        
        if (clipboard.operation === 'copy') {
          // Generate unique name if file exists
          let finalPath = newPath;
          let counter = 1;
          while (await FileSystem.readFile(finalPath)) {
            const ext = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : '';
            const baseName = file.name.includes('.') ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name;
            finalPath = currentPath === '/' 
              ? `/${baseName} copy${counter}${ext}`
              : `${currentPath}/${baseName} copy${counter}${ext}`;
            counter++;
          }
          await FileSystem.copyFile(filePath, finalPath);
        } else if (clipboard.operation === 'move') {
          if (filePath !== newPath) {
            await FileSystem.moveFile(filePath, newPath);
          }
        }
      }
      
      clipboard = null;
      selectedFiles.clear();
      navigateToPath(currentPath, container);
    } catch (error) {
      alert(`Error pasting files: ${error.message}`);
    }
  }
  
  async function renameSelectedFile(container) {
    if (selectedFiles.size === 0) {
      alert('No file selected');
      return;
    }
    
    if (selectedFiles.size > 1) {
      alert('Please select only one file to rename');
      return;
    }
    
    const filePath = Array.from(selectedFiles)[0];
    const file = await FileSystem.readFile(filePath);
    if (!file) {
      alert('File not found');
      return;
    }
    
    const oldName = file.name;
    const newName = prompt('Enter new name:', oldName);
    if (!newName || newName.trim() === '' || newName === oldName) return;
    
    try {
      const newPath = file.parent === '/' ? `/${newName.trim()}` : `${file.parent}/${newName.trim()}`;
      await FileSystem.renameFile(filePath, newName.trim());
      
      // Add to undo history
      if (window.UndoRedoSystem) {
        window.UndoRedoSystem.addAction({
          undo: async () => {
            try {
              await FileSystem.renameFile(newPath, oldName);
              navigateToPath(currentPath, container);
            } catch (e) {
              console.error('Undo failed:', e);
            }
          },
          redo: async () => {
            try {
              await FileSystem.renameFile(filePath, newName.trim());
              navigateToPath(currentPath, container);
            } catch (e) {
              console.error('Redo failed:', e);
            }
          }
        });
      }
      
      selectedFiles.clear();
      navigateToPath(currentPath, container);
    } catch (error) {
      alert(`Error renaming file: ${error.message}`);
    }
  }
  
  async function renameFile(file, container) {
    const newName = prompt('Rename file:', file.name);
    if (!newName || newName.trim() === '' || newName === file.name) return;
    
    try {
      await FileSystem.renameFile(file.path, newName.trim());
      navigateToPath(currentPath, container);
    } catch (error) {
      alert(`Error renaming file: ${error.message}`);
    }
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


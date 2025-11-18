// TextEdit App - Enhanced Markdown Editor
const TextEditApp = (function() {
  let openWindows = new Map(); // windowId -> window state
  
  function createTextEditContent(filename = 'Untitled.txt', initialContent = '', filepath = null) {
    const windowId = `textedit-${Date.now()}`;
    
    // Create tab system
    const tabSystem = TabSystem.create({
      onTabSelect: (tabId, tab) => {
        console.log(`Tab selected: ${tabId}`);
      },
      onTabClose: (tabId, tab) => {
        console.log(`Tab closed: ${tabId}`);
      },
      onNewTab: () => {
        openNewTab(tabSystem, windowId);
      },
      showNewButton: true
    });
    
    // Add initial tab
    const tabId = `tab-${Date.now()}`;
    const tabContent = createTabContent(filename, initialContent, filepath, tabSystem, windowId);
    tabSystem.addTab(tabId, filename, tabContent);
    
    // Store window state
    openWindows.set(windowId, {
      tabSystem,
      tabs: new Map([[tabId, { filename, filepath, content: initialContent }]])
    });
    
    return tabSystem.container;
  }
  
  function createTabContent(filename, initialContent, filepath, tabSystem, windowId) {
    const container = document.createElement('div');
    container.style.cssText = 'height: 100%; display: flex; flex-direction: column; background: rgba(13, 13, 13, 0.9);';
    
    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'textedit-toolbar';
    toolbar.style.cssText = 'padding: 8px 16px; background: rgba(30, 30, 30, 0.9); border-bottom: 1px solid rgba(0, 255, 225, 0.1); display: flex; gap: 8px; align-items: center; flex-wrap: wrap;';
    
    // Save button
    const saveBtn = createButton('💾 Save', 'rgba(0, 255, 225, 0.2)');
    
    // Preview toggle
    const previewBtn = createButton('👁 Preview', 'rgba(0, 255, 225, 0.1)');
    
    // Find button
    const findBtn = createButton('🔍 Find', 'rgba(0, 255, 225, 0.1)');
    
    // Font size controls
    const fontSmallerBtn = createButton('A-', 'rgba(0, 255, 225, 0.1)');
    const fontLargerBtn = createButton('A+', 'rgba(0, 255, 225, 0.1)');
    
    // Word count
    const wordCount = document.createElement('span');
    wordCount.style.cssText = 'color: #999; font-size: 12px; margin-left: auto;';
    wordCount.textContent = '0 words';
    
    toolbar.appendChild(saveBtn);
    toolbar.appendChild(previewBtn);
    toolbar.appendChild(findBtn);
    toolbar.appendChild(document.createTextNode('|'));
    toolbar.appendChild(fontSmallerBtn);
    toolbar.appendChild(fontLargerBtn);
    toolbar.appendChild(wordCount);
    
    // Find/Replace panel (initially hidden)
    const findPanel = document.createElement('div');
    findPanel.style.cssText = 'display: none; padding: 12px 16px; background: rgba(20, 20, 20, 0.9); border-bottom: 1px solid rgba(0, 255, 225, 0.1); gap: 8px;';
    findPanel.innerHTML = `
      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <input type="text" placeholder="Find..." class="find-input" style="flex: 1; padding: 6px 12px; background: rgba(13, 13, 13, 0.8); border: 1px solid rgba(0, 255, 225, 0.2); border-radius: 4px; color: #e6e6e6; font-size: 13px; outline: none;">
        <button class="find-next-btn" style="padding: 6px 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 12px;">Next</button>
        <button class="find-close-btn" style="padding: 6px 12px; background: rgba(255, 95, 87, 0.1); border: 1px solid rgba(255, 95, 87, 0.3); border-radius: 4px; color: #ff5f57; cursor: pointer; font-size: 12px;">Close</button>
      </div>
      <div style="display: flex; gap: 8px;">
        <input type="text" placeholder="Replace with..." class="replace-input" style="flex: 1; padding: 6px 12px; background: rgba(13, 13, 13, 0.8); border: 1px solid rgba(0, 255, 225, 0.2); border-radius: 4px; color: #e6e6e6; font-size: 13px; outline: none;">
        <button class="replace-btn" style="padding: 6px 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 12px;">Replace</button>
        <button class="replace-all-btn" style="padding: 6px 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 12px;">Replace All</button>
      </div>
    `;
    
    // Editor/Preview container
    const contentArea = document.createElement('div');
    contentArea.style.cssText = 'flex: 1; display: flex; position: relative; overflow: hidden;';
    
    // Editor
    const editor = document.createElement('textarea');
    editor.className = 'textedit-editor';
    editor.value = initialContent;
    editor.style.cssText = 'width: 100%; height: 100%; padding: 16px; background: rgba(13, 13, 13, 0.8); color: #e6e6e6; border: none; outline: none; font-family: "Courier New", monospace; font-size: 14px; line-height: 1.6; resize: none;';
    
    // Preview
    const preview = document.createElement('div');
    preview.className = 'textedit-preview';
    preview.style.cssText = 'width: 100%; height: 100%; padding: 16px; overflow-y: auto; color: #e6e6e6; font-family: -apple-system, sans-serif; font-size: 14px; line-height: 1.6; display: none;';
    
    contentArea.appendChild(editor);
    contentArea.appendChild(preview);
    
    container.appendChild(toolbar);
    container.appendChild(findPanel);
    container.appendChild(contentArea);
    
    // State
    let isPreview = false;
    let fontSize = 14;
    let autoSaveInterval = null;
    
    // Setup events
    setTimeout(() => {
      setupTextEditEvents(editor, preview, saveBtn, previewBtn, findBtn, fontSmallerBtn, fontLargerBtn, wordCount, findPanel, filepath, tabSystem, () => {
        isPreview = !isPreview;
        return isPreview;
      }, () => fontSize, (newSize) => {
        fontSize = newSize;
        editor.style.fontSize = `${fontSize}px`;
      });
      
      // Auto-save every 30 seconds
      autoSaveInterval = setInterval(() => {
        if (filepath) {
          saveFile(filepath, editor.value, saveBtn);
        }
      }, 30000);
      
      // Update word count on input
      editor.addEventListener('input', () => {
        updateWordCount(editor.value, wordCount);
      });
      
      updateWordCount(initialContent, wordCount);
    }, 100);
    
    return container;
  }
  
  function createButton(text, bgColor) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `padding: 6px 12px; background: ${bgColor}; border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 12px; transition: all 0.2s;`;
    
    btn.addEventListener('mouseenter', () => {
      btn.style.opacity = '0.8';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.opacity = '1';
    });
    
    return btn;
  }
  
  function setupTextEditEvents(editor, preview, saveBtn, previewBtn, findBtn, fontSmallerBtn, fontLargerBtn, wordCount, findPanel, filepath, tabSystem, getIsPreview, getFontSize, setFontSize) {
    // Preview toggle
    previewBtn.addEventListener('click', () => {
      const isPreview = getIsPreview();
      if (isPreview) {
        preview.innerHTML = renderMarkdown(editor.value);
        editor.style.display = 'none';
        preview.style.display = 'block';
        previewBtn.textContent = '✏️ Edit';
      } else {
        editor.style.display = 'block';
        preview.style.display = 'none';
        previewBtn.textContent = '👁 Preview';
      }
    });
    
    // Save
    saveBtn.addEventListener('click', async () => {
      if (filepath) {
        await saveFile(filepath, editor.value, saveBtn);
        
        // Update tab label to remove unsaved indicator
        const activeTabId = tabSystem.getActiveTabId();
        const tab = tabSystem.getTab(activeTabId);
        if (tab && tab.label.endsWith(' *')) {
          tabSystem.updateTabLabel(activeTabId, tab.label.slice(0, -2));
        }
      }
    });
    
    // Mark as unsaved on edit
    editor.addEventListener('input', () => {
      const activeTabId = tabSystem.getActiveTabId();
      const tab = tabSystem.getTab(activeTabId);
      if (tab && !tab.label.endsWith(' *')) {
        tabSystem.updateTabLabel(activeTabId, tab.label + ' *');
      }
    });
    
    // Find/Replace
    findBtn.addEventListener('click', () => {
      if (findPanel.style.display === 'none') {
        findPanel.style.display = 'block';
        findPanel.querySelector('.find-input').focus();
      } else {
        findPanel.style.display = 'none';
      }
    });
    
    findPanel.querySelector('.find-close-btn').addEventListener('click', () => {
      findPanel.style.display = 'none';
    });
    
    findPanel.querySelector('.find-next-btn').addEventListener('click', () => {
      const searchText = findPanel.querySelector('.find-input').value;
      if (searchText) {
        findNext(editor, searchText);
      }
    });
    
    findPanel.querySelector('.replace-btn').addEventListener('click', () => {
      const searchText = findPanel.querySelector('.find-input').value;
      const replaceText = findPanel.querySelector('.replace-input').value;
      if (searchText) {
        replaceNext(editor, searchText, replaceText);
      }
    });
    
    findPanel.querySelector('.replace-all-btn').addEventListener('click', () => {
      const searchText = findPanel.querySelector('.find-input').value;
      const replaceText = findPanel.querySelector('.replace-input').value;
      if (searchText) {
        replaceAll(editor, searchText, replaceText);
      }
    });
    
    // Font size controls
    fontSmallerBtn.addEventListener('click', () => {
      const currentSize = getFontSize();
      if (currentSize > 10) {
        setFontSize(currentSize - 2);
      }
    });
    
    fontLargerBtn.addEventListener('click', () => {
      const currentSize = getFontSize();
      if (currentSize < 24) {
        setFontSize(currentSize + 2);
      }
    });
    
    // Keyboard shortcuts
    editor.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        findBtn.click();
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveBtn.click();
      }
    });
  }
  
  function findNext(editor, searchText) {
    const content = editor.value;
    const start = editor.selectionEnd;
    const index = content.indexOf(searchText, start);
    
    if (index !== -1) {
      editor.focus();
      editor.setSelectionRange(index, index + searchText.length);
    } else {
      // Wrap around
      const wrapIndex = content.indexOf(searchText, 0);
      if (wrapIndex !== -1) {
        editor.focus();
        editor.setSelectionRange(wrapIndex, wrapIndex + searchText.length);
      }
    }
  }
  
  function replaceNext(editor, searchText, replaceText) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = editor.value.substring(start, end);
    
    if (selected === searchText) {
      editor.value = editor.value.substring(0, start) + replaceText + editor.value.substring(end);
      editor.setSelectionRange(start, start + replaceText.length);
    } else {
      findNext(editor, searchText);
    }
  }
  
  function replaceAll(editor, searchText, replaceText) {
    const newContent = editor.value.split(searchText).join(replaceText);
    const count = (editor.value.split(searchText).length - 1);
    editor.value = newContent;
    
    if (count > 0) {
      alert(`Replaced ${count} occurrence(s)`);
    }
  }
  
  function updateWordCount(text, wordCountEl) {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    wordCountEl.textContent = `${words} words, ${chars} chars`;
  }
  
  async function saveFile(filepath, content, saveBtn) {
    try {
      await FileSystem.updateFile(filepath, content);
      saveBtn.textContent = '✓ Saved';
      saveBtn.style.background = 'rgba(40, 202, 66, 0.3)';
      setTimeout(() => {
        saveBtn.textContent = '💾 Save';
        saveBtn.style.background = 'rgba(0, 255, 225, 0.2)';
      }, 1500);
    } catch (error) {
      console.error('Save error:', error);
      saveBtn.textContent = '✗ Error';
      saveBtn.style.background = 'rgba(255, 95, 87, 0.3)';
      setTimeout(() => {
        saveBtn.textContent = '💾 Save';
        saveBtn.style.background = 'rgba(0, 255, 225, 0.2)';
      }, 1500);
    }
  }
  
  function renderMarkdown(text) {
    // Simple markdown rendering (basic support)
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 style="color: #00ffe1; margin: 16px 0 8px;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="color: #00ffe1; margin: 20px 0 10px;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="color: #00ffe1; margin: 24px 0 12px;">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #2a82ff;">$1</a>')
      // Code blocks
      .replace(/```(.*?)```/gs, '<pre style="background: rgba(0,0,0,0.5); padding: 12px; border-radius: 4px; overflow-x: auto;"><code>$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/g, '<code style="background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 3px;">$1</code>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li style="margin-left: 20px;">$1</li>')
      // Line breaks
      .replace(/\n/g, '<br>');
    
    return html;
  }
  
  function openNewTab(tabSystem, windowId) {
    const tabId = `tab-${Date.now()}`;
    const filename = `Untitled-${Date.now()}.txt`;
    const tabContent = createTabContent(filename, '', null, tabSystem, windowId);
    tabSystem.addTab(tabId, filename, tabContent);
    tabSystem.activateTab(tabId);
    
    const windowState = openWindows.get(windowId);
    if (windowState) {
      windowState.tabs.set(tabId, { filename, filepath: null, content: '' });
    }
  }
  
  function open(filename, content = '', filepath = null) {
    // Check if file is already open in existing window
    for (const [windowId, state] of openWindows.entries()) {
      for (const [tabId, tabData] of state.tabs.entries()) {
        if (tabData.filepath === filepath && filepath !== null) {
          // File already open, focus that tab
          const window = WindowManager.getWindowByApp('textedit');
          if (window) {
            WindowManager.focusWindow(window.id);
            state.tabSystem.activateTab(tabId);
            return;
          }
        }
      }
    }
    
    // Open in new window
    const contentEl = createTextEditContent(filename, content, filepath);
    WindowManager.createWindow('textedit', 'TextEdit', contentEl, {
      width: 800,
      height: 600,
      left: 250,
      top: 120
    });
  }
  
  return {
    open
  };
})();

window.TextEditApp = TextEditApp;


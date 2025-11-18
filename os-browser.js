// Browser App - Enhanced with Tabs, Bookmarks, and History
const BrowserApp = (function() {
  let bookmarks = [];
  let history = [];
  
  // Load from localStorage
  function loadData() {
    const savedBookmarks = localStorage.getItem('browser_bookmarks');
    if (savedBookmarks) {
      try {
        bookmarks = JSON.parse(savedBookmarks);
      } catch (e) {
        console.error('Error loading bookmarks:', e);
      }
    }
    
    const savedHistory = localStorage.getItem('browser_history');
    if (savedHistory) {
      try {
        history = JSON.parse(savedHistory);
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }
  
  function saveData() {
    localStorage.setItem('browser_bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('browser_history', JSON.stringify(history.slice(-50))); // Keep last 50
  }
  
  function createBrowserContent() {
    loadData();
    
    const container = document.createElement('div');
    container.className = 'browser-container';
    container.style.cssText = 'height: 100%; display: flex; flex-direction: column;';
    
    // Tab system
    const tabSystem = TabSystem.create({
      onTabSelect: (tabId, tab) => {
        console.log(`Browser tab selected: ${tabId}`);
      },
      onTabClose: (tabId, tab) => {
        console.log(`Browser tab closed: ${tabId}`);
      },
      onNewTab: () => {
        openNewTab(tabSystem);
      },
      showNewButton: true
    });
    
    // Add initial tab
    const tabId = `tab-${Date.now()}`;
    const tabContent = createTabContent(tabSystem, tabId);
    tabSystem.addTab(tabId, 'New Tab', tabContent);
    
    return tabSystem.container;
  }
  
  function createTabContent(tabSystem, tabId) {
    const container = document.createElement('div');
    container.style.cssText = 'height: 100%; display: flex; flex-direction: column;';
    
    // Address bar
    const toolbar = document.createElement('div');
    toolbar.className = 'browser-toolbar';
    toolbar.style.cssText = 'padding: 12px; background: rgba(30, 30, 30, 0.9); border-bottom: 1px solid rgba(0, 255, 225, 0.1); display: flex; gap: 8px; align-items: center;';
    
    const backBtn = createNavButton('←');
    const refreshBtn = createNavButton('↻');
    const homeBtn = createNavButton('🏠');
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL or search...';
    urlInput.value = '';
    urlInput.style.cssText = 'flex: 1; padding: 8px 12px; background: rgba(13, 13, 13, 0.8); border: 1px solid rgba(0, 255, 225, 0.2); border-radius: 4px; color: #e6e6e6; font-size: 13px; outline: none;';
    
    const goBtn = createNavButton('Go');
    const bookmarkBtn = createNavButton('⭐');
    const menuBtn = createNavButton('☰');
    
    toolbar.appendChild(backBtn);
    toolbar.appendChild(refreshBtn);
    toolbar.appendChild(homeBtn);
    toolbar.appendChild(urlInput);
    toolbar.appendChild(goBtn);
    toolbar.appendChild(bookmarkBtn);
    toolbar.appendChild(menuBtn);
    
    // Bookmarks bar
    const bookmarksBar = document.createElement('div');
    bookmarksBar.className = 'browser-bookmarks-bar';
    bookmarksBar.style.cssText = 'padding: 8px 12px; background: rgba(20, 20, 20, 0.8); border-bottom: 1px solid rgba(0, 255, 225, 0.1); display: flex; gap: 8px; overflow-x: auto; flex-wrap: wrap;';
    
    // Content area with default page
    const content = document.createElement('div');
    content.className = 'browser-content';
    content.style.cssText = 'flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(13, 13, 13, 0.9); overflow-y: auto;';
    
    container.appendChild(toolbar);
    container.appendChild(bookmarksBar);
    container.appendChild(content);
    
    // Initialize with home page
    setTimeout(() => {
      showHomePage(content, urlInput, tabSystem, tabId);
      renderBookmarksBar(bookmarksBar, urlInput, content, tabSystem, tabId);
      setupBrowserEvents(toolbar, urlInput, content, bookmarksBar, tabSystem, tabId);
    }, 100);
    
    return container;
  }
  
  function createNavButton(text) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = 'padding: 8px 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 13px; transition: all 0.2s;';
    
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(0, 255, 225, 0.2)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(0, 255, 225, 0.1)';
    });
    
    return btn;
  }
  
  function setupBrowserEvents(toolbar, urlInput, content, bookmarksBar, tabSystem, tabId) {
    const backBtn = toolbar.children[0];
    const refreshBtn = toolbar.children[1];
    const homeBtn = toolbar.children[2];
    const goBtn = toolbar.children[4];
    const bookmarkBtn = toolbar.children[5];
    const menuBtn = toolbar.children[6];
    
    const navigate = (url) => {
      if (!url || url === 'about:blank') {
        showHomePage(content, urlInput, tabSystem, tabId);
        return;
      }
      
      // Add to history
      addToHistory(url);
      
      // Update tab title
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      tabSystem.updateTabLabel(tabId, domain);
      
      // Open external URL in new tab
      window.open(url, '_blank');
      urlInput.value = url;
    };
    
    goBtn.addEventListener('click', () => {
      let url = urlInput.value.trim();
      
      if (!url) return;
      
      // If no protocol, assume https
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // Check if it looks like a domain
        if (url.includes('.') && !url.includes(' ')) {
          url = 'https://' + url;
        } else {
          // Treat as search query
          url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
        }
      }
      
      navigate(url);
    });
    
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        goBtn.click();
      }
    });
    
    backBtn.addEventListener('click', () => {
      showHomePage(content, urlInput, tabSystem, tabId);
      urlInput.value = '';
      tabSystem.updateTabLabel(tabId, 'New Tab');
    });
    
    homeBtn.addEventListener('click', () => {
      showHomePage(content, urlInput, tabSystem, tabId);
      urlInput.value = '';
      tabSystem.updateTabLabel(tabId, 'New Tab');
    });
    
    refreshBtn.addEventListener('click', () => {
      if (urlInput.value && urlInput.value !== 'about:blank') {
        navigate(urlInput.value);
      }
    });
    
    bookmarkBtn.addEventListener('click', () => {
      const url = urlInput.value.trim();
      if (url && url !== 'about:blank') {
        addBookmark(url);
        renderBookmarksBar(bookmarksBar, urlInput, content, tabSystem, tabId);
        bookmarkBtn.textContent = '⭐';
        setTimeout(() => {
          bookmarkBtn.textContent = '⭐';
        }, 1000);
      }
    });
    
    menuBtn.addEventListener('click', () => {
      showMenu(menuBtn, bookmarksBar, urlInput, content, tabSystem, tabId);
    });
  }
  
  function showHomePage(content, urlInput, tabSystem, tabId) {
    content.innerHTML = `
      <div style="text-align: center; padding: 40px; max-width: 600px;">
        <div style="font-size: 64px; margin-bottom: 20px;">🌐</div>
        <h2 style="color: #00ffe1; margin-bottom: 12px;">Browser</h2>
        <p style="color: #999; margin-bottom: 24px;">Quick Links:</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          ${getQuickLinks().map(link => `
            <a href="#" class="browser-link" data-url="${link.url}" style="color: #2a82ff; text-decoration: none; padding: 16px; background: rgba(42, 130, 255, 0.1); border-radius: 8px; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <div style="font-size: 32px;">${link.icon}</div>
              <div style="font-weight: 600;">${link.name}</div>
            </a>
          `).join('')}
        </div>
        
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(0, 255, 225, 0.1);">
          <h3 style="color: #00ffe1; margin-bottom: 16px; font-size: 16px;">Recent History</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${history.slice(-5).reverse().map(item => `
              <a href="#" class="history-link" data-url="${item.url}" style="color: #999; text-decoration: none; padding: 8px 12px; background: rgba(0, 255, 225, 0.05); border-radius: 6px; text-align: left; transition: all 0.2s; font-size: 13px;">
                ${item.url}
              </a>
            `).join('') || '<div style="color: #666; font-size: 13px;">No history yet</div>'}
          </div>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 24px;">Note: External sites open in new tab</p>
      </div>
    `;
    
    // Setup link event handlers
    content.querySelectorAll('.browser-link, .history-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = link.dataset.url;
        urlInput.value = url;
        
        // Navigate
        addToHistory(url);
        const domain = url.replace(/^https?:\/\//, '').split('/')[0];
        tabSystem.updateTabLabel(tabId, domain);
        window.open(url, '_blank');
      });
      
      link.addEventListener('mouseenter', () => {
        link.style.background = 'rgba(42, 130, 255, 0.2)';
        link.style.transform = 'scale(1.05)';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.background = link.classList.contains('browser-link') ? 'rgba(42, 130, 255, 0.1)' : 'rgba(0, 255, 225, 0.05)';
        link.style.transform = 'scale(1)';
      });
    });
  }
  
  function getQuickLinks() {
    return [
      { name: 'GitHub', url: 'https://github.com/muhannadxyz', icon: '💻' },
      { name: 'Lucentir', url: 'https://lucentir.xyz', icon: '🔒' },
      { name: 'ShadoConnect', url: 'https://shadoconnect.com', icon: '🤝' },
      { name: 'Google', url: 'https://www.google.com', icon: '🔍' }
    ];
  }
  
  function renderBookmarksBar(bookmarksBar, urlInput, content, tabSystem, tabId) {
    bookmarksBar.innerHTML = '';
    
    if (bookmarks.length === 0) {
      bookmarksBar.innerHTML = '<span style="color: #666; font-size: 12px;">No bookmarks yet - click ⭐ to bookmark a page</span>';
      return;
    }
    
    bookmarks.forEach((bookmark, index) => {
      const bookmarkEl = document.createElement('div');
      bookmarkEl.style.cssText = 'display: flex; align-items: center; gap: 4px; padding: 4px 12px; background: rgba(0, 255, 225, 0.1); border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s;';
      
      const label = document.createElement('span');
      label.textContent = bookmark.name || bookmark.url;
      label.style.cssText = 'color: #00ffe1; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.style.cssText = 'background: none; border: none; color: #ff5f57; cursor: pointer; font-size: 16px; line-height: 1; padding: 0; margin-left: 4px;';
      
      bookmarkEl.appendChild(label);
      bookmarkEl.appendChild(deleteBtn);
      
      bookmarkEl.addEventListener('mouseenter', () => {
        bookmarkEl.style.background = 'rgba(0, 255, 225, 0.2)';
      });
      
      bookmarkEl.addEventListener('mouseleave', () => {
        bookmarkEl.style.background = 'rgba(0, 255, 225, 0.1)';
      });
      
      bookmarkEl.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          urlInput.value = bookmark.url;
          addToHistory(bookmark.url);
          const domain = bookmark.url.replace(/^https?:\/\//, '').split('/')[0];
          tabSystem.updateTabLabel(tabId, domain);
          window.open(bookmark.url, '_blank');
        }
      });
      
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeBookmark(index);
        renderBookmarksBar(bookmarksBar, urlInput, content, tabSystem, tabId);
      });
      
      bookmarksBar.appendChild(bookmarkEl);
    });
  }
  
  function addBookmark(url) {
    const domain = url.replace(/^https?:\/\//, '').split('/')[0];
    
    // Check if already bookmarked
    if (bookmarks.some(b => b.url === url)) {
      return;
    }
    
    bookmarks.push({
      name: domain,
      url: url,
      timestamp: Date.now()
    });
    
    saveData();
  }
  
  function removeBookmark(index) {
    bookmarks.splice(index, 1);
    saveData();
  }
  
  function addToHistory(url) {
    history.push({
      url,
      timestamp: Date.now()
    });
    
    saveData();
  }
  
  function showMenu(menuBtn, bookmarksBar, urlInput, content, tabSystem, tabId) {
    const menuItems = [
      {
        label: 'Show Bookmarks',
        action: () => {
          alert(`Bookmarks:\n\n${bookmarks.map(b => b.url).join('\n') || 'No bookmarks'}`);
        }
      },
      {
        label: 'View History',
        action: () => {
          showHistoryPage(content, urlInput, tabSystem, tabId);
        }
      },
      { separator: true },
      {
        label: 'Clear History',
        action: () => {
          if (confirm('Clear browsing history?')) {
            history = [];
            saveData();
            alert('History cleared');
          }
        }
      },
      {
        label: 'Clear Bookmarks',
        action: () => {
          if (confirm('Clear all bookmarks?')) {
            bookmarks = [];
            saveData();
            renderBookmarksBar(bookmarksBar, urlInput, content, tabSystem, tabId);
            alert('Bookmarks cleared');
          }
        }
      }
    ];
    
    const rect = menuBtn.getBoundingClientRect();
    ContextMenu.show(rect.left, rect.bottom + 5, menuItems);
  }
  
  function showHistoryPage(content, urlInput, tabSystem, tabId) {
    tabSystem.updateTabLabel(tabId, 'History');
    
    content.innerHTML = `
      <div style="padding: 40px; max-width: 800px; margin: 0 auto; width: 100%;">
        <h2 style="color: #00ffe1; margin-bottom: 24px;">Browsing History</h2>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${history.slice().reverse().map((item, index) => {
            const date = new Date(item.timestamp);
            return `
              <div style="padding: 12px; background: rgba(30, 30, 30, 0.5); border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="color: #00ffe1; font-size: 14px; margin-bottom: 4px;">${item.url}</div>
                  <div style="color: #666; font-size: 11px;">${date.toLocaleString()}</div>
                </div>
                <button class="visit-btn" data-index="${history.length - 1 - index}" style="padding: 6px 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 12px;">Visit</button>
              </div>
            `;
          }).join('') || '<div style="color: #666; text-align: center; padding: 40px;">No history yet</div>'}
        </div>
      </div>
    `;
    
    content.querySelectorAll('.visit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        const url = history[index].url;
        urlInput.value = url;
        window.open(url, '_blank');
      });
    });
  }
  
  function openNewTab(tabSystem) {
    const tabId = `tab-${Date.now()}`;
    const tabContent = createTabContent(tabSystem, tabId);
    tabSystem.addTab(tabId, 'New Tab', tabContent);
    tabSystem.activateTab(tabId);
  }
  
  function open() {
    const existing = WindowManager.getWindowByApp('browser');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }
    
    const content = createBrowserContent();
    WindowManager.createWindow('browser', 'Browser', content, {
      width: 900,
      height: 650,
      left: 180,
      top: 80
    });
  }
  
  return {
    open
  };
})();

window.BrowserApp = BrowserApp;


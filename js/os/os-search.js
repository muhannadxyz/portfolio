// File Search App - Spotlight-like Search
const SearchApp = (function() {
  let searchResults = [];
  let searchTimeout = null;
  
  async function searchFiles(query) {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const lowerQuery = query.toLowerCase().trim();
    const results = [];
    
    try {
      // Search files by name
      const allFiles = await FileSystem.listFiles('/');
      const files = await getAllFilesRecursive('/');
      
      for (const file of files) {
        const nameMatch = file.name.toLowerCase().includes(lowerQuery);
        const pathMatch = file.path.toLowerCase().includes(lowerQuery);
        let contentMatch = false;
        
        // Search content for text files
        if (file.type === 'file' && (file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
          try {
            const content = await FileSystem.readFile(file.path);
            if (content && content.toLowerCase().includes(lowerQuery)) {
              contentMatch = true;
            }
          } catch (e) {
            // Ignore read errors
          }
        }
        
        if (nameMatch || pathMatch || contentMatch) {
          results.push({
            file,
            matchType: nameMatch ? 'name' : (pathMatch ? 'path' : 'content'),
            relevance: nameMatch ? 3 : (pathMatch ? 2 : 1)
          });
        }
      }
      
      // Sort by relevance
      results.sort((a, b) => b.relevance - a.relevance);
      
    } catch (error) {
      console.error('Search error:', error);
    }
    
    return results;
  }
  
  async function getAllFilesRecursive(path) {
    const files = [];
    try {
      const items = await FileSystem.listFiles(path);
      for (const item of items) {
        files.push(item);
        if (item.type === 'folder') {
          const subFiles = await getAllFilesRecursive(item.path);
          files.push(...subFiles);
        }
      }
    } catch (e) {
      // Ignore errors
    }
    return files;
  }
  
  function createSearchContent() {
    const container = document.createElement('div');
    container.className = 'search-container';
    container.style.cssText = 'height: 100%; display: flex; flex-direction: column; font-family: -apple-system, sans-serif;';
    
    // Search bar
    const searchBar = document.createElement('div');
    searchBar.style.cssText = 'padding: 20px; background: rgba(20, 20, 20, 0.9); border-bottom: 1px solid rgba(0, 255, 225, 0.1);';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search files...';
    searchInput.style.cssText = 'width: 100%; padding: 12px 16px; background: rgba(0, 255, 225, 0.05); border: 2px solid rgba(0, 255, 225, 0.2); border-radius: 8px; color: #e6e6e6; font-size: 16px; outline: none; transition: border-color 0.2s;';
    searchInput.addEventListener('focus', () => {
      searchInput.style.borderColor = 'rgba(0, 255, 225, 0.5)';
    });
    searchInput.addEventListener('blur', () => {
      searchInput.style.borderColor = 'rgba(0, 255, 225, 0.2)';
    });
    
    // Search on input
    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value;
      clearTimeout(searchTimeout);
      
      if (query.trim() === '') {
        searchResults = [];
        renderResults(container);
        return;
      }
      
      searchTimeout = setTimeout(async () => {
        searchResults = await searchFiles(query);
        renderResults(container);
      }, 300);
    });
    
    // Handle Enter key to open first result
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchResults.length > 0) {
        openFile(searchResults[0].file);
      }
    });
    
    searchBar.appendChild(searchInput);
    container.appendChild(searchBar);
    
    // Results area
    const resultsArea = document.createElement('div');
    resultsArea.className = 'search-results';
    resultsArea.style.cssText = 'flex: 1; overflow-y: auto; padding: 16px; background: rgba(13, 13, 13, 0.8);';
    container.appendChild(resultsArea);
    
    // Initial empty state
    renderResults(container);
    
    // Focus search input
    setTimeout(() => searchInput.focus(), 100);
    
    return container;
  }
  
  function renderResults(container) {
    const resultsArea = container.querySelector('.search-results');
    
    if (searchResults.length === 0) {
      resultsArea.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #666;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
          <div style="font-size: 16px; margin-bottom: 8px;">Search for files</div>
          <div style="font-size: 13px; color: #555;">Type to search by name, path, or content</div>
        </div>
      `;
      return;
    }
    
    resultsArea.innerHTML = `
      <div style="color: #999; font-size: 13px; margin-bottom: 12px;">
        Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}
      </div>
      ${searchResults.map((result, index) => {
        const file = result.file;
        const icon = file.type === 'folder' ? '📁' : '📄';
        const matchType = result.matchType === 'name' ? 'Name' : (result.matchType === 'path' ? 'Path' : 'Content');
        
        return `
          <div class="search-result-item" data-index="${index}" style="
            padding: 12px 16px;
            margin-bottom: 8px;
            background: rgba(0, 255, 225, 0.05);
            border: 1px solid rgba(0, 255, 225, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 24px;">${icon}</div>
              <div style="flex: 1;">
                <div style="color: #00ffe1; font-weight: 600; font-size: 14px; margin-bottom: 4px;">
                  ${file.name}
                </div>
                <div style="color: #999; font-size: 12px; margin-bottom: 2px;">
                  ${file.path}
                </div>
                <div style="color: #666; font-size: 11px;">
                  Matched in ${matchType}
                </div>
              </div>
              <div style="color: #666; font-size: 12px;">↵</div>
            </div>
          </div>
        `;
      }).join('')}
    `;
    
    // Add click handlers
    resultsArea.querySelectorAll('.search-result-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        openFile(searchResults[index].file);
      });
      
      item.addEventListener('mouseenter', () => {
        item.style.background = 'rgba(0, 255, 225, 0.1)';
        item.style.borderColor = 'rgba(0, 255, 225, 0.3)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.background = 'rgba(0, 255, 225, 0.05)';
        item.style.borderColor = 'rgba(0, 255, 225, 0.1)';
      });
    });
  }
  
  function openFile(file) {
    if (file.type === 'folder') {
      // Open Finder and navigate to folder
      FinderApp.open();
      // Note: Finder navigation would need to be enhanced to support this
    } else {
      // Open in TextEdit
      FileSystem.readFile(file.path).then(content => {
        TextEditApp.open(file.name, content, file.path);
      }).catch(err => {
        console.error('Error opening file:', err);
      });
    }
    
    // Close search window
    const searchWindow = WindowManager.getWindowByApp('search');
    if (searchWindow) {
      WindowManager.closeWindow(searchWindow.id);
    }
  }
  
  function open() {
    const existing = WindowManager.getWindowByApp('search');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }
    
    const content = createSearchContent();
    WindowManager.createWindow('search', 'Search', content, {
      width: 700,
      height: 600
    });
  }
  
  return {
    open
  };
})();

window.SearchApp = SearchApp;


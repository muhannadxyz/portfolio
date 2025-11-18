// Tab System Component
const TabSystem = (function() {
  
  function create(options = {}) {
    const {
      onTabSelect = () => {},
      onTabClose = () => {},
      onNewTab = () => {},
      showNewButton = true
    } = options;
    
    const container = document.createElement('div');
    container.className = 'os-tab-system';
    container.style.cssText = 'display: flex; flex-direction: column; height: 100%;';
    
    // Tab bar
    const tabBar = document.createElement('div');
    tabBar.className = 'os-tab-bar';
    tabBar.style.cssText = 'display: flex; align-items: center; background: rgba(20, 20, 20, 0.8); border-bottom: 1px solid rgba(0, 255, 225, 0.1); overflow-x: auto; overflow-y: hidden; flex-shrink: 0;';
    
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'os-tabs-container';
    tabsContainer.style.cssText = 'display: flex; flex: 1; min-width: 0;';
    
    tabBar.appendChild(tabsContainer);
    
    // New tab button
    if (showNewButton) {
      const newTabBtn = document.createElement('button');
      newTabBtn.className = 'os-new-tab-btn';
      newTabBtn.innerHTML = '+';
      newTabBtn.style.cssText = 'width: 32px; height: 32px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 4px; color: #00ffe1; cursor: pointer; font-size: 18px; margin: 4px 8px; flex-shrink: 0;';
      
      newTabBtn.addEventListener('mouseenter', () => {
        newTabBtn.style.background = 'rgba(0, 255, 225, 0.2)';
      });
      
      newTabBtn.addEventListener('mouseleave', () => {
        newTabBtn.style.background = 'rgba(0, 255, 225, 0.1)';
      });
      
      newTabBtn.addEventListener('click', () => {
        onNewTab();
      });
      
      tabBar.appendChild(newTabBtn);
    }
    
    // Content area
    const contentArea = document.createElement('div');
    contentArea.className = 'os-tab-content-area';
    contentArea.style.cssText = 'flex: 1; position: relative; overflow: hidden;';
    
    container.appendChild(tabBar);
    container.appendChild(contentArea);
    
    // Tab management
    const tabs = [];
    let activeTabId = null;
    
    function addTab(id, label, content) {
      const tab = {
        id,
        label,
        content,
        element: createTabElement(id, label),
        contentElement: content
      };
      
      tabs.push(tab);
      tabsContainer.appendChild(tab.element);
      contentArea.appendChild(content);
      
      // Hide content initially
      content.style.display = 'none';
      
      // Activate first tab
      if (tabs.length === 1) {
        activateTab(id);
      }
      
      return tab;
    }
    
    function createTabElement(id, label) {
      const tabEl = document.createElement('div');
      tabEl.className = 'os-tab';
      tabEl.dataset.tabId = id;
      tabEl.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-right: 1px solid rgba(0, 255, 225, 0.1); cursor: pointer; font-size: 13px; color: #999; transition: all 0.15s; white-space: nowrap; min-width: 120px; max-width: 200px;';
      
      const labelEl = document.createElement('span');
      labelEl.className = 'os-tab-label';
      labelEl.textContent = label;
      labelEl.style.cssText = 'flex: 1; overflow: hidden; text-overflow: ellipsis;';
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'os-tab-close';
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = 'width: 18px; height: 18px; border: none; background: rgba(255, 95, 87, 0.2); color: #ff5f57; border-radius: 3px; cursor: pointer; font-size: 16px; line-height: 1; padding: 0; display: flex; align-items: center; justify-content: center;';
      
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 95, 87, 0.4)';
      });
      
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 95, 87, 0.2)';
      });
      
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(id);
      });
      
      tabEl.addEventListener('click', () => {
        activateTab(id);
      });
      
      tabEl.addEventListener('mouseenter', () => {
        if (activeTabId !== id) {
          tabEl.style.background = 'rgba(0, 255, 225, 0.05)';
        }
      });
      
      tabEl.addEventListener('mouseleave', () => {
        if (activeTabId !== id) {
          tabEl.style.background = '';
        }
      });
      
      tabEl.appendChild(labelEl);
      tabEl.appendChild(closeBtn);
      
      return tabEl;
    }
    
    function activateTab(id) {
      // Deactivate all tabs
      tabs.forEach(tab => {
        tab.element.style.background = '';
        tab.element.style.color = '#999';
        tab.element.style.borderBottom = '';
        tab.contentElement.style.display = 'none';
      });
      
      // Activate selected tab
      const tab = tabs.find(t => t.id === id);
      if (tab) {
        tab.element.style.background = 'rgba(0, 255, 225, 0.1)';
        tab.element.style.color = '#00ffe1';
        tab.element.style.borderBottom = '2px solid #00ffe1';
        tab.contentElement.style.display = 'block';
        activeTabId = id;
        
        onTabSelect(id, tab);
      }
    }
    
    function closeTab(id) {
      const index = tabs.findIndex(t => t.id === id);
      if (index === -1) return;
      
      const tab = tabs[index];
      tab.element.remove();
      tab.contentElement.remove();
      tabs.splice(index, 1);
      
      onTabClose(id, tab);
      
      // Activate another tab if this was active
      if (activeTabId === id && tabs.length > 0) {
        const newIndex = Math.min(index, tabs.length - 1);
        activateTab(tabs[newIndex].id);
      }
    }
    
    function updateTabLabel(id, newLabel) {
      const tab = tabs.find(t => t.id === id);
      if (tab) {
        tab.label = newLabel;
        const labelEl = tab.element.querySelector('.os-tab-label');
        if (labelEl) {
          labelEl.textContent = newLabel;
        }
      }
    }
    
    function getTab(id) {
      return tabs.find(t => t.id === id);
    }
    
    function getAllTabs() {
      return tabs;
    }
    
    function getActiveTabId() {
      return activeTabId;
    }
    
    return {
      container,
      addTab,
      activateTab,
      closeTab,
      updateTabLabel,
      getTab,
      getAllTabs,
      getActiveTabId
    };
  }
  
  return {
    create
  };
})();

window.TabSystem = TabSystem;


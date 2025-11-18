// Menu Bar Management
const MenuBar = (function() {
  
  // Update clock
  function updateClock() {
    const clockEl = document.getElementById('os-clock');
    if (!clockEl) return;
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
  }
  
  // Start clock updates
  function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
  }
  
  // Public API
  return {
    start: startClock
  };
})();

// Menu functions called from HTML
function toggleSystemMenu() {
  // System menu functionality (not implemented in basic version)
  console.log('System menu clicked');
}

function showFileMenu() {
  console.log('File menu clicked');
}

function showEditMenu() {
  console.log('Edit menu clicked');
}

function showViewMenu() {
  console.log('View menu clicked');
}

function showWindowMenu() {
  console.log('Window menu clicked');
}

window.MenuBar = MenuBar;


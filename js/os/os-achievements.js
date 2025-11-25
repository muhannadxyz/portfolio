// Achievement Tracking System
const AchievementTracker = (function() {
  let osStartTime = null;
  let timeInterval = null;
  let uniqueAppsOpened = new Set();
  
  // Initialize achievement tracking
  function init() {
    // Track OS launch time
    osStartTime = Date.now();
    
    // Track time spent in OS (throttled to every 5 seconds for performance)
    timeInterval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - osStartTime) / 1000);
      const currentTime = parseInt(localStorage.getItem('achievement_time_in_os') || '0');
      localStorage.setItem('achievement_time_in_os', (currentTime + 5).toString());
    }, 5000);
    
    // Load unique apps opened
    const savedApps = localStorage.getItem('achievement_unique_apps');
    if (savedApps) {
      try {
        uniqueAppsOpened = new Set(JSON.parse(savedApps));
      } catch (e) {
        console.error('Error loading unique apps:', e);
      }
    }
    
    // Mark OS as launched
    if (!localStorage.getItem('achievement_os_launched')) {
      localStorage.setItem('achievement_os_launched', 'true');
    }
  }
  
  // Track app opened
  function trackAppOpened(appName) {
    uniqueAppsOpened.add(appName);
    localStorage.setItem('achievement_unique_apps', JSON.stringify(Array.from(uniqueAppsOpened)));
    
    const count = uniqueAppsOpened.size;
    localStorage.setItem('achievement_apps_opened', count.toString());
    
    // Check if Explorer achievement unlocked
    if (count >= 5 && !localStorage.getItem('achievement_explorer_unlocked')) {
      localStorage.setItem('achievement_explorer_unlocked', 'true');
      showAchievementNotification('Explorer', 'Opened 5 different apps', '🧭');
    }
  }
  
  // Track file created
  function trackFileCreated() {
    const current = parseInt(localStorage.getItem('achievement_files_created') || '0');
    const newCount = current + 1;
    localStorage.setItem('achievement_files_created', newCount.toString());
    
    // Check if Creator achievement unlocked
    if (newCount >= 10 && !localStorage.getItem('achievement_creator_unlocked')) {
      localStorage.setItem('achievement_creator_unlocked', 'true');
      showAchievementNotification('Creator', 'Created 10 files', '📝');
    }
  }
  
  // Track theme change
  function trackThemeChanged() {
    localStorage.setItem('achievement_theme_changed', 'true');
    
    if (!localStorage.getItem('achievement_customizer_unlocked')) {
      localStorage.setItem('achievement_customizer_unlocked', 'true');
      showAchievementNotification('Customizer', 'Changed OS theme', '🎨');
    }
  }
  
  // Track external link visited
  function trackExternalLink() {
    localStorage.setItem('achievement_links_visited', 'true');
    
    if (!localStorage.getItem('achievement_networker_unlocked')) {
      localStorage.setItem('achievement_networker_unlocked', 'true');
      showAchievementNotification('Networker', 'Visited external links', '🌐');
    }
  }
  
  // Show achievement notification
  function showAchievementNotification(name, description, icon) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 60px;
      right: 20px;
      background: rgba(0, 255, 225, 0.15);
      border: 1px solid rgba(0, 255, 225, 0.3);
      border-radius: 12px;
      padding: 16px 20px;
      z-index: 10000;
      min-width: 280px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      animation: slideInRight 0.3s ease-out;
      backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 32px;">${icon}</div>
        <div style="flex: 1;">
          <div style="color: #00ffe1; font-weight: 600; font-size: 14px; margin-bottom: 4px;">Achievement Unlocked!</div>
          <div style="color: #e6e6e6; font-size: 13px; margin-bottom: 2px;">${name}</div>
          <div style="color: #999; font-size: 11px;">${description}</div>
        </div>
      </div>
    `;
    
    // Add animation style if not exists
    if (!document.getElementById('achievement-notification-style')) {
      const style = document.createElement('style');
      style.id = 'achievement-notification-style';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }
  
  // Cleanup on OS exit
  function cleanup() {
    if (timeInterval) {
      clearInterval(timeInterval);
      timeInterval = null;
    }
  }
  
  return {
    init,
    trackAppOpened,
    trackFileCreated,
    trackThemeChanged,
    trackExternalLink,
    cleanup
  };
})();

window.AchievementTracker = AchievementTracker;


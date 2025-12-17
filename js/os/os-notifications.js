// Notification System
const NotificationSystem = (function() {
  let notifications = [];
  let notificationContainer = null;
  
  function init() {
    // Create notification container
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      top: 60px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(notificationContainer);
  }
  
  function show(title, message, type = 'info', duration = 4000, icon = null) {
    if (!notificationContainer) init();

    // Sound
    if (window.SoundManager) {
      const soundMap = {
        info: 'notify_info',
        success: 'notify_success',
        warning: 'notify_warning',
        error: 'notify_error'
      };
      window.SoundManager.play(soundMap[type] || 'notify_info', { throttleMs: 120 });
    }
    
    const notification = document.createElement('div');
    const notificationId = `notification-${Date.now()}`;
    notification.id = notificationId;
    
    // Default icons
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    
    const notificationIcon = icon || icons[type] || icons.info;
    
    // Colors based on type
    const colors = {
      info: { bg: 'rgba(0, 255, 225, 0.15)', border: 'rgba(0, 255, 225, 0.3)', text: '#00ffe1' },
      success: { bg: 'rgba(40, 202, 66, 0.15)', border: 'rgba(40, 202, 66, 0.3)', text: '#28ca42' },
      warning: { bg: 'rgba(255, 189, 46, 0.15)', border: 'rgba(255, 189, 46, 0.3)', text: '#ffbd2e' },
      error: { bg: 'rgba(255, 95, 87, 0.15)', border: 'rgba(255, 95, 87, 0.3)', text: '#ff5f57' }
    };
    
    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
      min-width: 300px;
      max-width: 400px;
      background: ${color.bg};
      border: 1px solid ${color.border};
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      animation: slideInRight 0.3s ease-out;
      pointer-events: auto;
      cursor: pointer;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="font-size: 24px; flex-shrink: 0;">${notificationIcon}</div>
        <div style="flex: 1;">
          <div style="color: ${color.text}; font-weight: 600; font-size: 14px; margin-bottom: 4px;">
            ${title}
          </div>
          <div style="color: #e6e6e6; font-size: 13px; line-height: 1.4;">
            ${message}
          </div>
        </div>
        <button class="notification-close" style="
          background: transparent;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">×</button>
      </div>
    `;
    
    // Add animation styles if not exists
    if (!document.getElementById('notification-animations-style')) {
      const style = document.createElement('style');
      style.id = 'notification-animations-style';
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
    
    notificationContainer.appendChild(notification);
    notifications.push(notificationId);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeNotification(notificationId);
    });
    
    // Click to dismiss
    notification.addEventListener('click', () => {
      removeNotification(notificationId);
    });
    
    // Auto-remove
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notificationId);
      }, duration);
    }
    
    return notificationId;
  }
  
  function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        const index = notifications.indexOf(id);
        if (index > -1) {
          notifications.splice(index, 1);
        }
      }, 300);
    }
  }
  
  function clearAll() {
    notifications.forEach(id => removeNotification(id));
  }
  
  // Convenience methods
  function info(title, message, duration) {
    return show(title, message, 'info', duration);
  }
  
  function success(title, message, duration) {
    return show(title, message, 'success', duration);
  }
  
  function warning(title, message, duration) {
    return show(title, message, 'warning', duration);
  }
  
  function error(title, message, duration) {
    return show(title, message, 'error', duration);
  }
  
  return {
    init,
    show,
    info,
    success,
    warning,
    error,
    clearAll
  };
})();

window.NotificationSystem = NotificationSystem;


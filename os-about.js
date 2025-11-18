// About Me App - Enhanced with Animations, Timeline, and Achievements
const AboutApp = (function() {
  
  function createAboutContent() {
    const container = document.createElement('div');
    container.className = 'about-container';
    container.style.cssText = 'height: 100%; overflow-y: auto; padding: 32px; font-family: -apple-system, sans-serif;';
    
    // Get achievements
    const achievements = calculateAchievements();
    
    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 32px;">
        <div class="about-avatar" style="width: 120px; height: 120px; margin: 0 auto 20px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 48px; animation: fadeInScale 0.5s ease-out;">
          👨‍💻
        </div>
        <h1 class="about-title" style="color: #00ffe1; margin-bottom: 8px; opacity: 0; animation: fadeInUp 0.5s ease-out 0.2s forwards;">Muhannad Abuzahrieh</h1>
        <p class="about-subtitle" style="color: #999; font-size: 16px; opacity: 0; animation: fadeInUp 0.5s ease-out 0.3s forwards;">Software Engineer</p>
      </div>
      
      <div class="about-section" style="background: rgba(30, 30, 30, 0.5); border-radius: 12px; padding: 24px; margin-bottom: 20px; opacity: 0; animation: fadeInUp 0.5s ease-out 0.4s forwards;">
        <h2 style="color: #00ffe1; font-size: 18px; margin-bottom: 16px;">📋 Overview</h2>
        <p style="color: #e6e6e6; line-height: 1.8; margin-bottom: 12px;">
          Committed to shaping the future of tech. First college graduate in my family.
        </p>
        <p style="color: #e6e6e6; line-height: 1.8;">
          Building privacy-first tools like Lucentir. I enjoy clean design, clear UX, and robust engineering practices.
        </p>
      </div>
      
      <div class="about-section" style="background: rgba(30, 30, 30, 0.5); border-radius: 12px; padding: 24px; margin-bottom: 20px; opacity: 0; animation: fadeInUp 0.5s ease-out 0.5s forwards;">
        <h2 style="color: #00ffe1; font-size: 18px; margin-bottom: 16px;">💻 Tech Stack</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px;">
          ${[
            { name: 'Python', level: 90 },
            { name: 'JavaScript', level: 85 },
            { name: 'PHP', level: 75 },
            { name: 'C/C++', level: 70 },
            { name: 'React', level: 85 },
            { name: 'Node.js', level: 80 },
            { name: 'WordPress', level: 75 },
            { name: 'Tailwind CSS', level: 90 },
            { name: 'Git', level: 85 },
            { name: 'Firebase', level: 80 },
            { name: 'AWS', level: 70 },
            { name: 'Arduino', level: 75 }
          ].map((tech, i) => `
            <div class="tech-item" data-level="${tech.level}" style="padding: 8px 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.2); border-radius: 6px; font-size: 13px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;">
              <div class="tech-progress" style="position: absolute; left: 0; top: 0; bottom: 0; width: 0%; background: rgba(0, 255, 225, 0.15); transition: width 1s ease-out ${0.5 + i * 0.05}s;"></div>
              <span style="position: relative; z-index: 1;">${tech.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="about-section" style="background: rgba(30, 30, 30, 0.5); border-radius: 12px; padding: 24px; margin-bottom: 20px; opacity: 0; animation: fadeInUp 0.5s ease-out 0.6s forwards;">
        <h2 style="color: #00ffe1; font-size: 18px; margin-bottom: 16px;">🏆 Achievements</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          ${achievements.map((achievement, i) => `
            <div class="achievement-badge" style="padding: 16px; background: ${achievement.unlocked ? 'rgba(0, 255, 225, 0.15)' : 'rgba(50, 50, 50, 0.3)'}; border: 1px solid ${achievement.unlocked ? 'rgba(0, 255, 225, 0.3)' : 'rgba(100, 100, 100, 0.3)'}; border-radius: 8px; text-align: center; transition: all 0.3s; cursor: pointer; opacity: ${achievement.unlocked ? 1 : 0.5}; animation: ${achievement.unlocked ? `badgeBounce 0.5s ease-out ${0.7 + i * 0.1}s` : 'none'};">
              <div style="font-size: 32px; margin-bottom: 8px;">${achievement.icon}</div>
              <div style="color: ${achievement.unlocked ? '#00ffe1' : '#666'}; font-weight: 600; font-size: 13px; margin-bottom: 4px;">${achievement.name}</div>
              <div style="color: #999; font-size: 11px;">${achievement.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="about-section" style="background: rgba(30, 30, 30, 0.5); border-radius: 12px; padding: 24px; margin-bottom: 20px; opacity: 0; animation: fadeInUp 0.5s ease-out 0.7s forwards;">
        <h2 style="color: #00ffe1; font-size: 18px; margin-bottom: 20px;">📅 Timeline</h2>
        <div class="timeline">
          ${[
            { year: '2025', title: 'Graduation', desc: 'Bachelor of Science in Computer Science', icon: '🎓', color: '#00ffe1' },
            { year: '2024', title: 'Lucentir Launch', desc: 'Privacy-first URL shortener', icon: '🔒', color: '#667eea' },
            { year: '2023', title: 'ShadoConnect', desc: 'Job shadowing platform for students', icon: '🤝', color: '#2a82ff' },
            { year: '2022', title: 'RentWise', desc: 'AI-powered rental price prediction', icon: '🏠', color: '#764ba2' },
            { year: '2021', title: 'Started at CSU', desc: 'Began computer science journey', icon: '🚀', color: '#00ffe1' }
          ].map((event, i) => `
            <div class="timeline-item" style="display: flex; gap: 20px; margin-bottom: 24px; position: relative; opacity: 0; animation: fadeInLeft 0.5s ease-out ${0.8 + i * 0.1}s forwards;">
              <div style="flex-shrink: 0; width: 80px; text-align: right; color: ${event.color}; font-weight: 700; font-size: 18px;">${event.year}</div>
              <div style="flex-shrink: 0; width: 48px; height: 48px; background: ${event.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 0 20px ${event.color}80; position: relative; z-index: 1;">${event.icon}</div>
              <div style="flex: 1; padding: 8px 0;">
                <div style="color: #00ffe1; font-weight: 600; font-size: 16px; margin-bottom: 4px;">${event.title}</div>
                <div style="color: #999; font-size: 14px; line-height: 1.6;">${event.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="about-section" style="background: rgba(30, 30, 30, 0.5); border-radius: 12px; padding: 24px; margin-bottom: 20px; opacity: 0; animation: fadeInUp 0.5s ease-out 1.3s forwards;">
        <h2 style="color: #00ffe1; font-size: 18px; margin-bottom: 16px;">📊 Portfolio Stats</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div class="stat-counter" data-target="5" style="text-align: center;">
            <div class="stat-value" style="font-size: 32px; font-weight: 700; color: #00ffe1;">0</div>
            <div style="color: #999; font-size: 13px;">Projects</div>
          </div>
          <div class="stat-counter" data-target="12" style="text-align: center;">
            <div class="stat-value" style="font-size: 32px; font-weight: 700; color: #00ffe1;">0</div>
            <div style="color: #999; font-size: 13px;">Technologies</div>
          </div>
          <div class="stat-counter" data-target="2" style="text-align: center;">
            <div class="stat-value" style="font-size: 32px; font-weight: 700; color: #00ffe1;">0</div>
            <div style="color: #999; font-size: 13px;">Years Experience</div>
          </div>
        </div>
      </div>
      
      <div class="about-section" style="background: rgba(30, 30, 30, 0.5); border-radius: 12px; padding: 24px; opacity: 0; animation: fadeInUp 0.5s ease-out 1.4s forwards;">
        <h2 style="color: #00ffe1; font-size: 18px; margin-bottom: 16px;">🔗 Connect</h2>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <a href="https://github.com/muhannadxyz" target="_blank" class="connect-link" style="padding: 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.2); border-radius: 8px; color: #00ffe1; text-decoration: none; display: flex; align-items: center; gap: 12px; transition: all 0.2s;">
            <span style="font-size: 24px;">💻</span>
            <div>
              <div style="font-weight: 600;">GitHub</div>
              <div style="font-size: 12px; color: #999;">@muhannadxyz</div>
            </div>
          </a>
          <a href="contact.html" class="connect-link" style="padding: 12px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.2); border-radius: 8px; color: #00ffe1; text-decoration: none; display: flex; align-items: center; gap: 12px; transition: all 0.2s;">
            <span style="font-size: 24px;">📧</span>
            <div>
              <div style="font-weight: 600;">Contact Form</div>
              <div style="font-size: 12px; color: #999;">Get in touch</div>
            </div>
          </a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(0, 255, 225, 0.1); opacity: 0; animation: fadeIn 0.5s ease-out 1.5s forwards;">
        <div style="color: #999; font-size: 12px; margin-bottom: 8px;">Portfolio OS v1.0</div>
        <div style="color: #666; font-size: 11px;">Built with vanilla JavaScript</div>
        <div style="color: #00ffe1; font-size: 11px; margin-top: 8px;">✨ Available for work</div>
      </div>
    `;
    
    // Add CSS animations
    addAnimationStyles();
    
    // Setup interactive elements
    setTimeout(() => {
      setupInteractiveElements(container);
      animateStats(container);
      animateTechProgress(container);
    }, 100);
    
    return container;
  }
  
  function addAnimationStyles() {
    if (document.getElementById('about-animations-style')) return;
    
    const style = document.createElement('style');
    style.id = 'about-animations-style';
    style.textContent = `
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes badgeBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      .tech-item:hover {
        transform: translateY(-2px);
        background: rgba(0, 255, 225, 0.15) !important;
        box-shadow: 0 4px 12px rgba(0, 255, 225, 0.2);
      }
      
      .achievement-badge:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 8px 24px rgba(0, 255, 225, 0.3);
      }
      
      .connect-link:hover {
        background: rgba(0, 255, 225, 0.2) !important;
        transform: translateX(4px);
      }
      
      .timeline-item::before {
        content: '';
        position: absolute;
        left: 108px;
        top: 48px;
        bottom: -24px;
        width: 2px;
        background: linear-gradient(to bottom, rgba(0, 255, 225, 0.5), rgba(0, 255, 225, 0.1));
      }
      
      .timeline-item:last-child::before {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }
  
  function setupInteractiveElements(container) {
    // Tech stack hover tooltips
    container.querySelectorAll('.tech-item').forEach(item => {
      item.addEventListener('click', () => {
        const level = item.dataset.level;
        const name = item.textContent.trim();
        alert(`${name}: ${level}% proficiency`);
      });
    });
    
    // Achievement tooltips
    container.querySelectorAll('.achievement-badge').forEach(badge => {
      badge.addEventListener('click', () => {
        const name = badge.querySelector('div:nth-child(2)').textContent;
        const desc = badge.querySelector('div:nth-child(3)').textContent;
        alert(`${name}\n\n${desc}`);
      });
    });
  }
  
  function animateStats(container) {
    const counters = container.querySelectorAll('.stat-counter');
    
    counters.forEach((counter, index) => {
      const target = parseInt(counter.dataset.target);
      const valueEl = counter.querySelector('.stat-value');
      let current = 0;
      const increment = target / 50;
      const delay = index * 200;
      
      setTimeout(() => {
        const interval = setInterval(() => {
          current += increment;
          if (current >= target) {
            valueEl.textContent = target;
            clearInterval(interval);
          } else {
            valueEl.textContent = Math.floor(current);
          }
        }, 30);
      }, delay + 1300);
    });
  }
  
  function animateTechProgress(container) {
    setTimeout(() => {
      container.querySelectorAll('.tech-progress').forEach(progress => {
        const level = progress.parentElement.dataset.level;
        progress.style.width = `${level}%`;
      });
    }, 100);
  }
  
  function calculateAchievements() {
    // Get stats from localStorage or defaults
    const filesCreated = parseInt(localStorage.getItem('achievement_files_created') || '0');
    const appsOpened = parseInt(localStorage.getItem('achievement_apps_opened') || '0');
    const timeInOS = parseInt(localStorage.getItem('achievement_time_in_os') || '0'); // in seconds
    
    return [
      {
        name: 'Early Adopter',
        description: 'Launched the OS',
        icon: '🚀',
        unlocked: true
      },
      {
        name: 'Explorer',
        description: 'Opened 5 different apps',
        icon: '🧭',
        unlocked: appsOpened >= 5
      },
      {
        name: 'Creator',
        description: 'Created 10 files',
        icon: '📝',
        unlocked: filesCreated >= 10
      },
      {
        name: 'Power User',
        description: 'Spent 5 minutes in OS',
        icon: '⚡',
        unlocked: timeInOS >= 300
      },
      {
        name: 'Customizer',
        description: 'Changed OS theme',
        icon: '🎨',
        unlocked: localStorage.getItem('achievement_theme_changed') === 'true'
      },
      {
        name: 'Networker',
        description: 'Visited external links',
        icon: '🌐',
        unlocked: localStorage.getItem('achievement_links_visited') === 'true'
      }
    ];
  }
  
  function open() {
    const existing = WindowManager.getWindowByApp('about');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }
    
    const content = createAboutContent();
    WindowManager.createWindow('about', 'About Me', content, {
      width: 600,
      height: 700,
      left: 300,
      top: 80
    });
  }
  
  return {
    open
  };
})();

window.AboutApp = AboutApp;


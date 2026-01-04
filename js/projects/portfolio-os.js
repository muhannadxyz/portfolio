// Portfolio OS Project Data, Template, and Styles

window.PortfolioOSProject = {
  // Project Data
  slug: 'portfolio-os',
  name: 'Portfolio OS',
  title: 'Portfolio OS',
  company: 'Web-based Desktop Environment',
  logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="url(#pos-gradient)"/><rect x="11" y="14" width="26" height="20" rx="3" fill="rgba(5,7,15,0.88)" stroke="rgba(255,255,255,0.18)"/><circle cx="16" cy="18" r="1.6" fill="#ff5f57"/><circle cx="21" cy="18" r="1.6" fill="#ffbd2e"/><circle cx="26" cy="18" r="1.6" fill="#28c840"/><path d="M18 30h12" stroke="rgba(0,255,225,0.9)" stroke-width="2" stroke-linecap="round"/><defs><linearGradient id="pos-gradient" x1="0" y1="0" x2="48" y2="48"><stop stop-color="#00ffe1"/><stop offset="1" stop-color="#ff69b4"/></linearGradient></defs></svg>',
  thumb: 'images/OSPIC.png',
  backgroundImage: 'images/OSPIC.png',
  tagline: 'A playful OS inside my portfolio',
  description: 'Portfolio OS is a fully functional desktop environment that runs entirely in your web browser. It includes a complete window manager where you can open, close, minimize, maximize, drag, and resize windows just like a real operating system. The dock contains applications that can be launched, and there is a settings panel for preferences and a notification system. Canvas-based applications include a Tamagotchi pet that roams around the desktop and a CHIP-8 emulator capable of running retro games. All window positions, preferences, and application state are saved using localStorage, so your setup persists between visits. The system handles window focus, z-index management, and window lifecycle events to create an authentic desktop experience without requiring any server-side components or external dependencies.',
  brandColor: '#00ffe1',
  link: 'os.html',
  railText: 'PORTFOLIO OS • WEB DESKTOP •',
  links: [
    { label: 'Open', url: 'os.html' }
  ],
  stack: [
    'Vanilla JS',
    'HTML',
    'CSS',
    'Canvas',
    'LocalStorage',
    'UX / Micro-interactions'
  ],
  highlights: [
    'Built window manager: focus, z-index, drag/resize, minimize/maximize.',
    'Implemented persistent preferences and app state with localStorage.',
    'Canvas-based apps (pet + emulator) with performance-minded rendering.'
  ],

  // Dev Updates
  updates: [
    {
      version: 'v0.4.0',
      date: '2025-12-17',
      type: 'feature',
      changes: [
        'Added on-desktop Tamagotchi pet widget with roaming + activity animations',
        'Added pin mode + drag-to-place for the desktop pet',
        'Enforced one-action-at-a-time interactions (eat/play/clean/sleep)'
      ]
    },
    {
      version: 'v0.3.0',
      date: '2025-12-16',
      type: 'feature',
      changes: [
        'Shipped CHIP‑8 emulator app window with demo ROM + ROM upload',
        'Added UI sound effects with settings toggle + volume',
        'Improved notifications + app launch error handling'
      ]
    },
    {
      version: 'v0.2.0',
      date: '2025-12-15',
      type: 'enhancement',
      changes: [
        'Dock + window polish (open/close/minimize/maximize sounds)',
        'Persistent preferences via localStorage',
        'Performance improvements for OS interactions'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/portfolio-os.html',

  // CSS Styles Path
  cssPath: 'css/projects/portfolio-os.css',

  // HTML Template Function - loads from external HTML file
  async renderTemplate(devUpdatesHTML) {
    if (!window.ProjectLoader) return this.getFallbackTemplate(devUpdatesHTML);
    
    // Load CSS
    window.ProjectLoader.loadCSS(this.cssPath, this.slug);
    window.ProjectLoader.loadCSS('css/projects/brutal-project.css', 'brutal-project');
    
    // Try to load HTML template first
    if (this.htmlTemplatePath && window.ProjectLoader.loadTemplate) {
      try {
        const templateData = {
          logo: this.logo,
          title: this.title,
          company: this.company,
          tagline: this.tagline,
          description: this.description,
          thumb: this.thumb,
          backgroundImage: this.backgroundImage,
          devUpdatesHTML: devUpdatesHTML || ''
        };
        return await window.ProjectLoader.loadTemplate(this.htmlTemplatePath, templateData);
      } catch (error) {
        console.warn('Failed to load HTML template, using brutal template:', error);
      }
    }
    
    // Fallback to brutal template
    return window.ProjectLoader.renderBrutalProjectTemplate({
      slug: this.slug,
      thumb: this.thumb,
      backgroundImage: this.backgroundImage,
      title: this.title,
      company: this.company,
      logo: this.logo,
      tagline: this.tagline,
      description: this.description,
      link: this.link,
      links: this.links,
      railText: this.railText,
      stack: this.stack,
      highlights: this.highlights,
      updates: this.updates || []
    });
  },

  // Fallback template if HTML file fails to load
  getFallbackTemplate(devUpdatesHTML) {
    const accent = this.brandColor || '#00ffe1';
    return `
      <div class="min-h-screen relative bg-black project-portfolio-os">
        <div class="fixed inset-0 z-0" style="transform-origin: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%;">
          <img src="images/OSPIC.png" alt="${this.title}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; filter: brightness(0.5) saturate(1.2); z-index: 0;">
          <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" style="z-index: 1;"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" style="z-index: 1;"></div>
        </div>

        <button id="close" class="project-close-btn">✕</button>

        <div class="relative z-10 min-h-screen flex items-end pb-20 px-8 md:px-16">
          <div class="max-w-6xl w-full">
            <div class="mb-6 animate-float hero-icon" style="width: 120px; height: 120px; display:flex; align-items:center; justify-content:center;">${this.logo}</div>
            
            <!-- Interactive Sticky Note -->
            <div class="pos-sticky-note" id="pos-sticky-note" onclick="openNotesApp()">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="8" fill="#FF6B35"/>
                <circle cx="24" cy="12" r="3" fill="white"/>
                <path d="M24 12L20 20L24 18L28 20L24 12Z" fill="white"/>
                <rect x="16" y="22" width="16" height="12" rx="1" fill="white" opacity="0.9"/>
                <path d="M18 26h12M18 30h10" stroke="#FF6B35" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <div class="pos-note-hint">Click to open Notes</div>
            </div>
            
            <div class="inline-block mb-6 project-title-glass">
              <h1 class="text-5xl md:text-7xl font-bold text-white mb-2" style="line-height: 1.1;">${this.title}</h1>
              <p class="text-xl md:text-2xl text-gray-300">${this.company}</p>
            </div>
            <p class="text-lg text-gray-300 max-w-2xl">${this.tagline}</p>
            <div style="margin-top: 22px; display:flex; gap: 12px; flex-wrap: wrap;">
              <button class="pos-launch-btn" onclick="window.open('os.html', '_blank')">Launch Portfolio OS →</button>
              <div class="pos-hint">Opens in a new tab for the full experience.</div>
            </div>
          </div>
        </div>

        <div class="relative z-20 bg-black px-6 md:px-12 py-16">
          <div class="visual-separator"></div>
          <div class="max-w-5xl mx-auto space-y-8">
            <div class="project-card">
              <div class="flex items-center gap-3 mb-4">
                <h2 class="text-3xl font-bold text-white">What It Is</h2>
              </div>
              <p class="text-lg text-gray-300 leading-relaxed">${this.description}</p>
              <div class="pos-feature-grid">
                <div class="pos-feature"><div class="pos-pill" style="border-color:${accent}55;color:${accent};">Window Manager</div><div class="pos-sub">Drag, focus, minimize/maximize.</div></div>
                <div class="pos-feature"><div class="pos-pill" style="border-color:${accent}55;color:${accent};">Apps</div><div class="pos-sub">Pet + CHIP‑8 emulator + utilities.</div></div>
                <div class="pos-feature"><div class="pos-pill" style="border-color:${accent}55;color:${accent};">Persistence</div><div class="pos-sub">Preferences + pet state saved.</div></div>
                <div class="pos-feature"><div class="pos-pill" style="border-color:${accent}55;color:${accent};">Polish</div><div class="pos-sub">Sounds + notifications.</div></div>
              </div>
            </div>

            <div class="pos-preview-card">
              <div class="pos-preview-top">
                <div class="pos-dots"><span></span><span></span><span></span></div>
                <div class="pos-preview-title">Portfolio OS</div>
              </div>
              <div class="pos-preview-body">
                <img src="${this.thumb}" alt="${this.title}" class="pos-thumb" />
                <div class="pos-preview-copy">
                  <div class="pos-kicker">Featured apps</div>
                  <div class="pos-lines">
                    <div><span class="pos-bullet">•</span> Tamagotchi pet (desktop roaming + animations)</div>
                    <div><span class="pos-bullet">•</span> CHIP‑8 emulator (demo ROM + upload)</div>
                    <div><span class="pos-bullet">•</span> Settings (sound toggle + volume)</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pos-os-embed-card">
              <div class="pos-os-embed-head">
                <div class="pos-os-embed-title">Live OS (interactive)</div>
                <div class="pos-os-embed-actions">
                  <button class="pos-launch-btn" onclick="window.open('os.html', '_blank')">Open Fullscreen →</button>
                </div>
              </div>
              <div class="pos-os-embed-wrap">
                <iframe class="pos-os-iframe" src="os.html" title="Portfolio OS" loading="lazy" allow="fullscreen" allowfullscreen></iframe>
              </div>
              <div class="pos-os-embed-foot">Try dragging windows, opening apps, and the Pet + CHIP‑8 from the dock.</div>
            </div>

            <div style="height: 120px;"></div>
            <div class="dev-updates-divider"></div>
            <div id="dev-updates-container">${devUpdatesHTML || ''}</div>
            <div style="height: 100px;"></div>


          </div>
        </div>
      </div>
    `;
  }
};

// Function to open Notes app - available globally for onclick handlers
window.openNotesApp = function() {
  // Try to communicate with the iframe first
  const iframe = document.querySelector('.pos-os-iframe');
  if (iframe && iframe.contentWindow) {
    try {
      // Send message to iframe to open Notes app
      iframe.contentWindow.postMessage({ type: 'openApp', app: 'notes' }, '*');
      return;
    } catch (e) {
      console.log('Could not communicate with iframe, opening in new tab');
    }
  }
  
  // Fallback: open OS in new tab with hash to trigger Notes app
  // The OS can listen for hash changes and open the app
  window.open('os.html#openApp=notes', '_blank');
};


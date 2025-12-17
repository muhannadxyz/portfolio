// Portfolio OS Project Data, Template, and Styles

window.PortfolioOSProject = {
  // Project Data
  slug: 'portfolio-os',
  name: 'Portfolio OS',
  title: 'Portfolio OS',
  company: 'Web-based Desktop Environment',
  logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="url(#pos-gradient)"/><rect x="11" y="14" width="26" height="20" rx="3" fill="rgba(5,7,15,0.88)" stroke="rgba(255,255,255,0.18)"/><circle cx="16" cy="18" r="1.6" fill="#ff5f57"/><circle cx="21" cy="18" r="1.6" fill="#ffbd2e"/><circle cx="26" cy="18" r="1.6" fill="#28c840"/><path d="M18 30h12" stroke="rgba(0,255,225,0.9)" stroke-width="2" stroke-linecap="round"/><defs><linearGradient id="pos-gradient" x1="0" y1="0" x2="48" y2="48"><stop stop-color="#00ffe1"/><stop offset="1" stop-color="#ff69b4"/></linearGradient></defs></svg>',
  thumb: 'images/portfolio-os.svg',
  tagline: 'A playful OS inside my portfolio',
  description: 'Built an in-browser “Portfolio OS” with a window manager, dock, settings, notifications, and apps. Focused on product-like UX: persistent state, delightful micro-interactions, and performance-minded canvas rendering.',
  details: 'The challenge was making it feel like a real desktop: window lifecycle + focus, app APIs, persistent preferences, canvas-based apps (a Tamagotchi pet + CHIP‑8 emulator), and subtle sound/notifications—without turning the page into a laggy toy.',
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
    window.ProjectLoader.loadCSS('css/projects/brutal-project.css', 'brutal-project');
    return window.ProjectLoader.renderBrutalProjectTemplate({
      slug: this.slug,
      thumb: this.thumb,
      title: this.title,
      company: this.company,
      logo: this.logo,
      tagline: this.tagline,
      description: this.description,
      details: this.details,
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
        <div class="fixed inset-0 z-0" style="transform-origin: center;">
          <div class="w-full h-full" style="background: radial-gradient(circle at 20% 20%, rgba(0,255,225,0.18), transparent 55%), radial-gradient(circle at 80% 30%, rgba(255,105,180,0.16), transparent 55%), linear-gradient(135deg, rgba(5,7,15,1), rgba(10,10,20,1));"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>

        <button id="close" class="project-close-btn">✕</button>

        <div class="relative z-10 min-h-screen flex items-end pb-20 px-8 md:px-16">
          <div class="max-w-6xl w-full">
            <div class="mb-6 animate-float hero-icon" style="width: 120px; height: 120px; display:flex; align-items:center; justify-content:center;">${this.logo}</div>
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

        <div class="relative z-20 bg-gradient-to-b from-black via-black to-neutral-950 px-6 md:px-12 py-16">
          <div class="visual-separator"></div>
          <div class="max-w-5xl mx-auto space-y-8">
            <div class="project-card">
              <div class="flex items-center gap-3 mb-4">
                <div class="card-icon role-icon">🖥️</div>
                <h2 class="text-3xl font-bold text-white">What it is</h2>
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

            <div class="project-card">
              <div class="flex items-center gap-3 mb-4">
                <div class="card-icon challenge-icon">🧠</div>
                <h3 class="text-3xl font-bold text-white">The Challenge</h3>
              </div>
              <p class="text-lg text-gray-300 leading-relaxed">${this.details}</p>
            </div>

            <div class="project-cta-card">
              <h3 class="text-2xl font-bold text-white mb-6">Try it live</h3>
              <button class="project-cta-button" onclick="window.open('os.html', '_blank')">Launch Portfolio OS →</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};



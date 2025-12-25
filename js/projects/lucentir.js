// Lucentir Project Data, Template, and Styles

window.LucentirProject = {
  // Project Data
  slug: 'lucentir',
  name: 'Lucentir',
  title: 'Lucentir',
  company: 'Privacy & Threat Intelligence',
  logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="url(#lucentir-gradient)"/><path d="M24 12C19 12 16 14 16 14V24C16 29 19.5 33 24 36C28.5 33 32 29 32 24V14C32 14 29 12 24 12Z" fill="white"/><defs><linearGradient id="lucentir-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#10B981"/><stop offset="1" stop-color="#059669"/></linearGradient></defs></svg>',
  thumb: 'images/lucentir.png',
  tagline: 'See clearly. Stay private.',
  description: 'Privacy intelligence platform. Compares VPNs and Ad-Blockers. Scores 256 products across 5 pillars: minimization, control, security, sharing, transparency. Filter by free, open-source, or no telemetry. Side-by-side comparisons. Scoring methodology with cited sources. Transparent evaluation system.',
  brandColor: '#10B981',
  link: 'https://lucentir.xyz/',
  railText: 'LUCENTIR • PRIVACY INTELLIGENCE •',
  links: [
    { label: 'Live', url: 'https://lucentir.xyz/' }
  ],
  stack: [
    'Web App',
    'Scoring Model',
    'Search + Filters',
    'Data Sourcing',
    'UI / UX'
  ],
  highlights: [
    'Built a 5‑pillar scoring model for privacy comparison across vendors.',
    'Shipped side‑by‑side comparison UX with rich filters and sorting.',
    'Designed for transparency: citations and methodology visibility.'
  ],
  
  // Dev Updates
  updates: [
    {
      version: 'v2.3.0',
      date: '2025-12-2',
      type: 'feature',
      changes: [
        'Added real-time privacy score updates',
        'Implemented advanced filtering by privacy pillars',
        'Enhanced comparison view with side-by-side metrics',
        'Added export functionality for comparison reports'
      ]
    },
    {
      version: 'v2.2.1',
      date: '2025-11-20',
      type: 'enhancement',
      changes: [
        'Improved scoring algorithm accuracy',
        'Updated privacy policy data sources',
        'Optimized comparison loading performance',
        'Enhanced mobile responsiveness'
      ]
    },
    {
      version: 'v2.2.0',
      date: '2025-10-10',
      type: 'feature',
      changes: [
        'Launched Ad-Blocker comparison section',
        'Added privacy-first toggle filters',
        'Implemented transparent scoring methodology',
        'Added citation links for all privacy claims'
      ]
    },
    {
      version: 'v2.1.0',
      date: '2025-09-05',
      type: 'major',
      changes: [
        'Complete redesign of comparison interface',
        'Added 10+ VPN provider profiles',
        'Implemented 5-pillar scoring system',
        'Launched public beta version'
      ]
    },
    {
      version: 'v2.0.0',
      date: '2025-08-01',
      type: 'major',
      changes: [
        'Initial release of privacy intelligence platform',
        'VPN comparison with 256 comparison cases',
        'Privacy-first filtering system',
        'Transparent scoring model with cited sources'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/lucentir.html',
  
  // CSS Styles Path
  cssPath: 'css/projects/lucentir.css',
  
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
    return `
      <div class="min-h-screen relative bg-black project-lucentir">
        <div class="fixed inset-0 z-0" style="transform-origin: center;">
          <img src="${this.thumb}" alt="${this.title}" class="w-full h-full object-cover scale-105" style="filter: brightness(0.4) saturate(1.2);">
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        <button id="close" class="project-close-btn">✕</button>
        <div class="relative z-10 min-h-screen flex items-end pb-20 px-8 md:px-16">
          <div class="max-w-6xl w-full">
            <div class="mb-6 animate-float hero-icon" style="width: 120px; height: 120px; display: flex; align-items: center; justify-content: center;">${this.logo}</div>
            <div class="inline-block mb-6 project-title-glass">
              <h1 class="text-5xl md:text-7xl font-bold text-white mb-2" style="line-height: 1.1;">${this.title}</h1>
              <p class="text-xl md:text-2xl text-gray-300">${this.company}</p>
            </div>
          </div>
        </div>
        <div class="relative z-20 bg-gradient-to-b from-black via-black to-neutral-950 px-6 md:px-12 py-16">
          <div class="visual-separator"></div>
          <div class="max-w-5xl mx-auto space-y-8">
            <div class="project-card">
              <div class="flex items-center gap-3 mb-4">
                <h2 class="text-3xl font-bold text-white">What It Is</h2>
              </div>
              <p class="text-lg text-gray-300 leading-relaxed">${this.description}</p>
            </div>
            <div class="project-showcase">
              <img src="${this.thumb}" alt="Project showcase" class="w-full" style="display: block;">
            </div>
            <div style="height: 120px;"></div>
            <div class="dev-updates-divider"></div>
            <div id="dev-updates-container">${devUpdatesHTML || ''}</div>
            <div style="height: 100px;"></div>
            <div class="project-cta-card">
              <h3 class="text-2xl font-bold text-white mb-6">Visit Project</h3>
              <a href="${this.link}" target="_blank" class="project-cta-button">View Live Site →</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};


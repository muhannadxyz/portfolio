// Tonsor Project Data, Template, and Styles

window.TonsorProject = {
  // Project Data
  slug: 'tonsor',
  name: 'Tonsor',
  title: 'Tonsor',
  company: 'Luxury Barbershop + E‑Commerce',
  logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#F7F2E8"/><text x="24" y="30" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#1F2A4A">tän</text><path d="M14 34h20" stroke="#C9B27D" stroke-width="2" stroke-linecap="round"/></svg>',
  thumb: 'images/tonsor.svg',
  tagline: "World's dopest barbershop experience",
  description: 'Designed and built a luxury barbershop + e‑commerce web experience with strong typography, editorial layout, and product/category merchandising. Focused on performance, accessibility, and polished micro‑interactions to match a premium brand.',
  details: 'The challenge was balancing an editorial “luxury” aesthetic with practical e‑commerce UX: fast navigation, clear categories, strong CTAs, and a layout that stays clean across devices while keeping load time and image weight under control.',
  brandColor: '#C9B27D',
  link: 'https://www.thetonsor.com/',
  railText: 'TONSOR • LUXURY E‑COMMERCE •',
  links: [
    { label: 'Live', url: 'https://www.thetonsor.com/' }
  ],
  stack: [
    'Marketing Site',
    'E‑commerce UX',
    'Responsive Layout',
    'Performance',
    'Accessibility'
  ],
  highlights: [
    'Designed an editorial layout with premium typography and merchandising.',
    'Optimized image loading and reduced layout shift across breakpoints.',
    'Improved mobile navigation tap targets and readability.'
  ],

  // Dev Updates
  updates: [
    {
      version: 'v1.2.0',
      date: '2025-12-10',
      type: 'feature',
      changes: [
        'Added new product/category card layout with stronger hover states',
        'Improved mobile navigation spacing and tap targets',
        'Refined hero typography for better readability',
        'Polished micro-interactions and transitions'
      ]
    },
    {
      version: 'v1.1.0',
      date: '2025-11-18',
      type: 'enhancement',
      changes: [
        'Optimized image loading and reduced layout shift',
        'Improved contrast and focus styles for accessibility',
        'Tuned spacing scale across sections for consistency'
      ]
    },
    {
      version: 'v1.0.0',
      date: '2025-10-29',
      type: 'major',
      changes: [
        'Initial release of the Tonsor site experience',
        'Built premium hero + category grid layout',
        'Implemented responsive structure for desktop → mobile'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/tonsor.html',

  // CSS Styles Path
  cssPath: 'css/projects/tonsor.css',

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
    return `
      <div class="min-h-screen relative bg-black project-tonsor">
        <div class="fixed inset-0 z-0" style="transform-origin: center;">
          <img src="${this.thumb}" alt="${this.title}" class="w-full h-full object-cover scale-105" style="filter: brightness(0.55) saturate(1.1);">
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
                <div class="card-icon role-icon">💼</div>
                <h2 class="text-3xl font-bold text-white">My Role</h2>
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
            <div class="project-card">
              <div class="flex items-center gap-3 mb-4">
                <div class="card-icon challenge-icon">🎯</div>
                <h3 class="text-3xl font-bold text-white">The Challenge</h3>
              </div>
              <p class="text-lg text-gray-300 leading-relaxed">${this.details}</p>
            </div>
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



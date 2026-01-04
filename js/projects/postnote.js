// PostNote Project Data, Template, and Styles

window.PostNoteProject = {
  // Project Data
  slug: 'postnote',
  name: 'PostNote',
  title: 'PostNote',
  company: 'Real-Time Anonymous Note Board',
  logo: '<img src="images/postednote.png" alt="PostNote" style="width: 100%; height: 100%; object-fit: contain;">',
  thumb: 'images/postnoteweb.png',
  backgroundImage: 'images/postnoteweb.png',
  tagline: 'Leave your mark on the board',
  description: 'Built a real-time shared anonymous note board with a corkboard UI. Users can post sticky notes (up to 500 characters) that appear instantly for all visitors. Features fully anonymous posting, live status indicators, and a character counter. Designed with a warm, tactile aesthetic that mimics a physical corkboard with pushpins and rotated sticky notes.',
  details: 'The challenge was creating a seamless real-time experience where notes appear instantly across all connected clients without page refreshes, while maintaining anonymity and preventing abuse. Implemented WebSocket connections for live updates, character validation, and a clean UI that balances the playful corkboard aesthetic with functional UX.',
  brandColor: '#FF6B35',
  link: 'https://post-note.vercel.app/',
  railText: 'POSTNOTE • REAL-TIME BOARD •',
  links: [
    { label: 'Live', url: 'https://post-note.vercel.app/' }
  ],
  stack: [
    'Real-Time WebSockets',
    'Anonymous Posting',
    'UI / UX Design',
    'Character Validation',
    'Live Status'
  ],
  highlights: [
    'Built real-time note sharing with WebSocket connections for instant updates.',
    'Designed a corkboard UI with rotated sticky notes and pushpin details.',
    'Implemented anonymous posting with character limits and live status indicators.'
  ],

  // Dev Updates
  updates: [
    {
      version: 'v1.0.0',
      date: '2025-12-17',
      type: 'major',
      changes: [
        'Initial release of PostNote real-time note board',
        'Implemented WebSocket connections for live updates',
        'Built corkboard UI with sticky note styling',
        'Added anonymous posting with 500 character limit',
        'Created live status indicator and note counter'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/postnote.html',

  // CSS Styles Path
  cssPath: 'css/projects/postnote.css',

  // HTML Template Function - loads from external HTML file
  async renderTemplate(devUpdatesHTML) {
    if (!window.ProjectLoader) return this.getFallbackTemplate(devUpdatesHTML);
    window.ProjectLoader.loadCSS('css/projects/brutal-project.css', 'brutal-project');
    return window.ProjectLoader.renderBrutalProjectTemplate({
      slug: this.slug,
      thumb: this.thumb,
      backgroundImage: this.backgroundImage,
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
      <div class="min-h-screen relative bg-black project-postnote">
        <div class="fixed inset-0 z-0" style="transform-origin: center;">
          <img src="${this.backgroundImage || this.thumb}" alt="${this.title}" class="w-full h-full object-cover scale-105" style="filter: brightness(0.55) saturate(1.1);">
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







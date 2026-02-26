// Ghost Job Extension Project Data, Template, and Styles

window.GhostJobExtensionProject = {
  // Project Data
  slug: 'ghost-job-extension',
  name: 'Ghost Job Extension',
  title: 'Ghost Job Extension',
  company: 'Browser Extension',
  logo: 'GJX',
  icon: 'GJX',
  thumb: 'images/ghost-job-checker.png',
  gallery: [
    'images/ghost-job-checker.png',
    'images/ghostchecker.png'
  ],
  tagline: 'Flag suspicious job listings directly in your browser.',
  description: 'Ghost Job Extension is a browser extension built to help job seekers avoid wasting time on stale or suspicious listings while browsing job boards. It scans posting text in-page, highlights ghost-job signals, and gives a clear confidence score with plain-language reasons.',
  overview: 'A browser extension that brings ghost-job detection directly into your job search flow. It analyzes listings in real time and explains risk signals so you can prioritize legitimate opportunities.',
  location: 'Remote',
  date: '2026-02-26',
  role: 'Product + Frontend Development',
  details: 'The extension focuses on fast signal detection and clear explanations: stale-post patterns, vague requirement language, repetitive evergreen recruiting phrasing, and weak hiring-intent indicators. It is designed for low-friction use while browsing listings so users can triage opportunities quickly.',
  brandColor: '#FF6B35',
  link: 'html/projects/ghost-job-extension.html',
  railText: 'GHOST JOB EXTENSION • BROWSER TOOLING •',
  links: [
    { label: 'Project Page', url: 'html/projects/ghost-job-extension.html' }
  ],
  stack: [
    'JavaScript',
    'HTML',
    'CSS',
    'Chrome Extensions API',
    'Heuristic Text Analysis',
    'Risk Scoring'
  ],
  highlights: [
    'Analyzes job listings directly in the browser with no copy/paste workflow.',
    'Surfaces stale, vague, and pipeline-style language with reasoned scoring.',
    'Keeps explanations transparent so users can make faster application decisions.'
  ],
  releases: [],
  tweets: [],

  // Dev Updates
  updates: [
    {
      version: 'v1.0.0',
      date: '2026-02-26',
      type: 'major',
      changes: [
        'Launched first version of Ghost Job Extension',
        'Added in-page listing analysis with risk scoring',
        'Implemented signal categories for stale, vague, and pipeline language',
        'Created dedicated project page with product overview and roadmap'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/ghost-job-extension.html',

  // CSS Styles Path
  cssPath: 'css/projects/ghost-job-extension.css',

  // HTML Template Function - uses brutal project template
  async renderTemplate(devUpdatesHTML) {
    if (!window.ProjectLoader) return this.getFallbackTemplate(devUpdatesHTML);
    window.ProjectLoader.loadCSS('css/projects/brutal-project.css', 'brutal-project');
    return window.ProjectLoader.renderBrutalProjectTemplate({
      slug: this.slug,
      thumb: this.thumb,
      gallery: this.gallery,
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

  // Fallback template if loader fails
  getFallbackTemplate(devUpdatesHTML) {
    return `
      <div class="min-h-screen relative bg-black project-ghost-job-extension">
        <div class="fixed inset-0 z-0" style="transform-origin: center;">
          <img src="${this.thumb}" alt="${this.title}" class="w-full h-full object-cover scale-105" style="filter: brightness(0.55) saturate(1.1);">
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
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
              <h2 class="text-3xl font-bold text-white">What It Is</h2>
              <p class="text-lg text-gray-300 leading-relaxed">${this.description}</p>
            </div>
            <div class="project-card">
              <h3 class="text-3xl font-bold text-white">Why It Matters</h3>
              <p class="text-lg text-gray-300 leading-relaxed">${this.details}</p>
            </div>
            <div class="dev-updates-divider"></div>
            <div id="dev-updates-container">${devUpdatesHTML || ''}</div>
          </div>
        </div>
      </div>
    `;
  }
};

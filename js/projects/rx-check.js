// RxCheck - Drug Interaction Checker Project Data

window.RxCheckProject = {
  slug: 'rx-check',
  name: 'RxCheck',
  title: 'RxCheck',
  company: 'Drug Interaction Checker',
  logo: 'Rx',
  icon: 'Rx',
  thumb: 'images/rx-check.png',
  tagline: 'Type two drugs. Know the risk instantly.',
  description: 'RxCheck is a drug interaction checker that lets you type in two or more medications and instantly see if combining them is dangerous. It pulls real data from the FDA\'s adverse event reporting database (FAERS) — showing how many patients reported problems when taking those drugs together, and what symptoms they experienced. Results are color-coded by severity: high, moderate, and low. A built-in autocomplete powered by the FDA NDC API makes finding the right drug names fast. Search history is saved locally so you can revisit past checks without re-entering anything.',
  overview: 'A drug interaction checker using real FDA FAERS data. Type two or more medications to see reported adverse events, severity ratings, and symptom details. Search history saves locally for quick lookups.',
  location: 'Remote',
  date: '2025-04-01',
  role: 'Full-Stack Development',
  details: 'Built to make real FDA safety data accessible without medical jargon or paywalls. The backend queries the FDA FAERS API and aggregates adverse event reports by drug pair, then classifies severity based on report counts and symptom categories. Drug name autocomplete hits the FDA NDC API so users don\'t have to guess exact spellings. SQLite via better-sqlite3 stores search history on the server, keeping it fast and dependency-light. Deployed on Railway.',
  brandColor: '#EF4444',
  link: 'https://drug-checker.up.railway.app/',
  railText: 'RXCHECK • DRUG INTERACTION CHECKER •',
  links: [
    { label: 'Live', url: 'https://drug-checker.up.railway.app/' }
  ],
  stack: [
    'Node.js',
    'Express',
    'SQLite (better-sqlite3)',
    'Vanilla JavaScript',
    'FDA FAERS API',
    'FDA NDC API',
    'Railway'
  ],
  highlights: [
    'Queries the FDA FAERS adverse event database to surface real patient-reported drug interaction data.',
    'Color-coded severity ratings (high / moderate / low) based on aggregated report counts and symptom categories.',
    'Autocomplete powered by the FDA NDC API and local search history saved via SQLite.'
  ],
  releases: [],
  tweets: [],

  updates: [
    {
      version: 'v1.0.0',
      date: '2025-04-01',
      type: 'major',
      changes: [
        'Initial release of RxCheck',
        'FDA FAERS API integration for real adverse event data',
        'FDA NDC API autocomplete for drug name lookup',
        'Severity classification with color-coded results (high, moderate, low)',
        'SQLite search history for instant re-access to past checks',
        'Deployed on Railway'
      ]
    }
  ],

  htmlTemplatePath: 'html/projects/rx-check.html',
  cssPath: 'css/projects/rx-check.css',

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

  getFallbackTemplate(devUpdatesHTML) {
    return `
      <div class="min-h-screen relative bg-black project-rx-check">
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
                <div class="card-icon role-icon">💊</div>
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

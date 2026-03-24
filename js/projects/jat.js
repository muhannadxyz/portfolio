// JAT - Job Application Tracker Project Data

window.JATProject = {
  slug: 'jat',
  name: 'JAT',
  title: 'JAT',
  company: 'Job Application Tracker',
  logo: 'JAT',
  icon: 'JAT',
  thumb: 'images/JAT.png',
  tagline: 'Track every application. No account. No subscription. Just open the file.',
  description: 'JAT is a free, open-source job application tracker built as a single HTML file. No sign-up, no subscription, no backend — just download and use it. Every other tracker wants you to create an account before you can log a single application. JAT skips all of that. Paste a LinkedIn, Indeed, Greenhouse, or Lever job link and it auto-extracts the company name, role, and date with no copy-pasting required. Track application status across Applied, Interview, Offer, Rejected, and Ghosted. Filter by status, search in real time, and sort by any column. Export your data to CSV whenever you want it back. Everything saves to your browser via localStorage — nothing leaves your device. Built with plain HTML, CSS, and JavaScript. One file. No framework, no backend, no database.',
  overview: 'A free, single-file job application tracker. Paste a job link and it auto-fills the details. Track status, filter, search, sort, and export to CSV. Everything stays in your browser — no account needed.',
  location: 'Remote',
  date: '2025-03-01',
  role: 'Full-Stack Development',
  details: 'Built out of frustration with job trackers that gate a spreadsheet behind a login wall. The goal was zero friction: open the file, start tracking. Auto-extraction from LinkedIn, Indeed, Greenhouse, and Lever URLs removes the tedious copy-paste step. localStorage keeps data persistent across sessions without any server involvement. The entire app ships as one self-contained HTML file anyone can fork on GitHub.',
  brandColor: '#2563EB',
  link: 'https://jatts.vercel.app/',
  railText: 'JAT • JOB APPLICATION TRACKER •',
  links: [
    { label: 'Live', url: 'https://jatts.vercel.app/' }
  ],
  stack: [
    'HTML',
    'CSS',
    'JavaScript',
    'localStorage',
    'URL Parsing',
    'CSV Export',
    'UI / UX Design'
  ],
  highlights: [
    'Auto-extracts company name, role, and date from LinkedIn, Indeed, Greenhouse, and Lever job links.',
    'Full status pipeline: Applied, Interview, Offer, Rejected, Ghosted — with real-time search and filtering.',
    'Zero-dependency single HTML file. Data stays in the browser; export to CSV anytime.'
  ],
  releases: [],
  tweets: [],

  updates: [
    {
      version: 'v1.0.0',
      date: '2025-03-01',
      type: 'major',
      changes: [
        'Initial release of JAT — Job Application Tracker',
        'Auto-extraction of job details from LinkedIn, Indeed, Greenhouse, and Lever URLs',
        'Status tracking: Applied, Interview, Offer, Rejected, Ghosted',
        'Real-time search, column sorting, and status filtering',
        'CSV export for full data portability',
        'localStorage persistence — no account or backend required',
        'Single self-contained HTML file published on GitHub'
      ]
    }
  ],

  htmlTemplatePath: 'html/projects/jat.html',
  cssPath: 'css/projects/jat.css',

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
      <div class="min-h-screen relative bg-black project-jat">
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

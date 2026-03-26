// Ghost Job Checker Project Data (Web App + Chrome Extension)

window.GhostJobCheckerProject = {
  slug: 'ghost-job-checker',
  name: 'Ghost Job Checker',
  title: 'Ghost Job Checker',
  company: 'Web App + Chrome Extension',
  logo: 'GJC',
  icon: 'GJC',
  thumb: 'images/ghostchecker.png',
  tagline: 'Detect fake & phantom job postings before wasting your time',
  description: 'Ghost Job Checker helps job seekers identify fake and phantom job postings — available as both a web app and a free Chrome Extension. The web app accepts a job URL or pasted description and runs it through a multi-factor risk model, returning a 0–100 risk score with a full breakdown: stale reposting patterns, evergreen pipeline language, vague requirement signals, and missing salary data. The Chrome Extension brings the same analysis directly into the browser — install it once and it analyzes job listings automatically on LinkedIn, Indeed, Greenhouse, and Lever as you browse, overlaying the risk score and red flags right on the page with no copy-pasting required. Both tools use heuristic text analysis with confidence scoring, hiring likelihood assessment, and actionable recommendations. No backend, no account, no data leaves your browser.',
  overview: 'A job posting analysis tool available as a web app and a free Chrome Extension. The web app analyzes any job description or URL for fake/phantom signals. The Chrome Extension brings the same analysis directly onto LinkedIn, Indeed, Greenhouse, and Lever pages in real time — no copy-paste needed. Both use a multi-factor risk model (stale, pipeline, vague) to return a 0–100 score with detailed red flag breakdowns.',
  location: 'Remote',
  date: '2025-01-02',
  role: 'Full-Stack Development & Chrome Extension',
  details: 'Built to solve the problem of job seekers wasting time on fake postings that companies keep up to collect resumes or maintain an appearance of growth. The web app was built first — plain HTML, CSS, and JavaScript, no framework. The Chrome Extension came next as the browser-native companion, removing the copy-paste friction by injecting analysis directly into supported job pages. The main technical challenge on the extension was injecting a clean, non-intrusive overlay UI into third-party pages without breaking their layout, while keeping analysis fast enough to feel instant.',
  brandColor: '#FF6B35',
  link: 'https://ghost-job-checker.vercel.app/',
  railText: 'GHOST JOB CHECKER • WEB APP + EXTENSION •',
  links: [
    { label: 'Live', url: 'https://ghost-job-checker.vercel.app/' },
    { label: 'Chrome Web Store', url: 'https://chromewebstore.google.com/detail/ghost-job-checker/illipifdhfeobicoljamgfcoepfpmmpd?authuser=2&hl=en' }
  ],
  stack: [
    'HTML',
    'JavaScript',
    'CSS',
    'Chrome Extensions API',
    'Content Scripts',
    'Risk Scoring Model',
    'Heuristic Detection',
    'UI / UX Design'
  ],
  highlights: [
    'Web app analyzes any job description or URL with a 0–100 risk score and breakdown by stale, pipeline, and vague risk factors.',
    'Chrome Extension injects real-time analysis directly onto LinkedIn, Indeed, Greenhouse, and Lever job pages — no copy-paste needed.',
    'Zero-friction, no-account setup — all analysis runs client-side with no data leaving the browser.'
  ],
  releases: [],
  tweets: [],

  updates: [
    {
      version: 'v1.0.0',
      date: '2025-01-02',
      type: 'major',
      changes: [
        'Initial release of Ghost Job Checker web app',
        'Multi-factor risk analysis: stale, pipeline, and vague detection',
        'URL fetching for LinkedIn and Indeed job postings',
        'Heuristic scoring with confidence levels and red flag breakdowns',
        'Transparent 0–100 risk score with hiring likelihood assessment'
      ]
    },
    {
      version: 'v1.1.0',
      date: '2025-02-01',
      type: 'feature',
      changes: [
        'Launched Ghost Job Checker Chrome Extension on the Web Store',
        'Real-time content script injection on LinkedIn, Indeed, Greenhouse, and Lever',
        'Overlay UI that renders risk score and red flags directly on job pages',
        'Full parity with web app risk model — no backend, no tracking'
      ]
    }
  ],

  htmlTemplatePath: 'html/projects/ghost-job-checker.html',
  cssPath: 'css/projects/ghost-job-checker.css',

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
      <div class="min-h-screen relative bg-black project-ghost-job-checker">
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
                <div class="card-icon role-icon">👻</div>
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
              <h3 class="text-2xl font-bold text-white mb-6">Try It</h3>
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="https://ghost-job-checker.vercel.app/" target="_blank" class="project-cta-button">Web App →</a>
                <a href="https://chromewebstore.google.com/detail/ghost-job-checker/illipifdhfeobicoljamgfcoepfpmmpd?authuser=2&hl=en" target="_blank" class="project-cta-button">Add to Chrome →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

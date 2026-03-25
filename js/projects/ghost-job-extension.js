// Ghost Job Checker Chrome Extension Project Data

window.GhostJobExtensionProject = {
  slug: 'ghost-job-extension',
  name: 'Ghost Job Checker',
  title: 'Ghost Job Checker',
  company: 'Chrome Extension',
  logo: 'GJE',
  icon: 'GJE',
  thumb: 'images/gje.png',
  tagline: 'Spot fake job postings instantly — right in your browser',
  description: 'Ghost Job Checker is a free Chrome Extension that detects fake and phantom job postings as you browse. Install it once and it works silently in the background — no sign-up, no account. When you land on a job listing on LinkedIn, Indeed, Greenhouse, or Lever, the extension analyzes the posting in real time using a multi-factor risk model and flags it with a risk score before you waste time applying. It checks for stale reposting patterns, evergreen pipeline language, vague requirement signals, and missing salary data — the same signals that indicate a company is collecting resumes with no real intent to hire. Results appear as a clean overlay directly on the job page: a 0–100 risk score, a hiring likelihood rating, a breakdown of red flags by category, and actionable recommendations. Built with vanilla JavaScript and the Chrome Extensions API. No backend, no tracking, no data leaves your browser.',
  overview: 'A free Chrome Extension that analyzes job postings in real time on LinkedIn, Indeed, Greenhouse, and Lever. Flags ghost jobs with a 0–100 risk score and detailed breakdown — right on the page, no sign-up required.',
  location: 'Remote',
  date: '2025-02-01',
  role: 'Chrome Extension Development',
  details: 'Built as the browser-native companion to the Ghost Job Checker web app. The extension removes friction — instead of copying a job description and pasting it into a tool, the analysis runs automatically on any supported job page. The challenge was injecting a clean, non-intrusive UI into third-party pages without breaking their layout, and keeping analysis fast enough to feel instant.',
  brandColor: '#FF6B35',
  link: 'https://chromewebstore.google.com/detail/ghost-job-checker/illipifdhfeobicoljamgfcoepfpmmpd?authuser=2&hl=en',
  railText: 'GHOST JOB CHECKER • CHROME EXTENSION •',
  links: [
    { label: 'Chrome Web Store', url: 'https://chromewebstore.google.com/detail/ghost-job-checker/illipifdhfeobicoljamgfcoepfpmmpd?authuser=2&hl=en' }
  ],
  stack: [
    'JavaScript',
    'Chrome Extensions API',
    'HTML',
    'CSS',
    'Content Scripts',
    'Risk Scoring Model',
    'UI / UX Design'
  ],
  highlights: [
    'Analyzes job postings in real time on LinkedIn, Indeed, Greenhouse, and Lever without leaving the page.',
    'Multi-factor risk model detects stale, pipeline, and vague job signals with confidence scoring.',
    'Zero-friction UX — installs once, runs automatically, no account or data collection required.'
  ],
  releases: [],
  tweets: [],

  updates: [
    {
      version: 'v1.0.0',
      date: '2025-02-01',
      type: 'major',
      changes: [
        'Initial release on the Chrome Web Store',
        'Real-time job analysis via content script injection on supported job pages',
        'Multi-factor risk scoring (stale, pipeline, vague) with 0–100 score',
        'Clean overlay UI that doesn\'t interfere with page layout',
        'Support for LinkedIn, Indeed, Greenhouse, and Lever',
        'No backend, no tracking — all analysis runs client-side'
      ]
    }
  ],

  htmlTemplatePath: 'html/projects/ghost-job-extension.html',
  cssPath: 'css/projects/ghost-job-extension.css',

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
      <div class="min-h-screen relative bg-black project-ghost-job-extension">
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
                <div class="card-icon role-icon">🔍</div>
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
              <h3 class="text-2xl font-bold text-white mb-6">Install Extension</h3>
              <a href="${this.link}" target="_blank" class="project-cta-button">Add to Chrome →</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

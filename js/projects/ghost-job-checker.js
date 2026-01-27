// Ghost Job Checker Project Data, Template, and Styles

window.GhostJobCheckerProject = {
  // Project Data
  slug: 'ghost-job-checker',
  name: 'Ghost Job Checker',
  title: 'Ghost Job Checker',
  company: 'Job Posting Analysis Tool',
  logo: 'GJC',
  icon: 'GJC',
  thumb: 'images/ghostchecker.png',
  tagline: 'Detect fake & phantom job postings before wasting your time',
  description: 'Ghost Job Checker is an AI-powered job posting analysis tool built entirely with plain HTML for semantic, accessible markup structure, vanilla JavaScript for client-side logic and API interactions without framework dependencies, and CSS for responsive styling and visual design. The tool addresses a critical problem in modern job searching by helping job seekers identify fake and phantom job postings before investing valuable time and effort in applications. It employs sophisticated text analysis algorithms that examine job descriptions using multiple weighted risk factors including stale risk detection that analyzes reposting patterns, posting age indicators, and applicant count signals to identify positions that have been open for extended periods without actual hiring intent. Pipeline risk assessment identifies evergreen language and talent pool terminology that suggests companies are collecting resumes rather than actively filling positions. Vague risk analysis evaluates text length, requirement specificity, and excessive buzzword usage to detect postings lacking concrete job details. The platform provides a comprehensive, transparent risk score from 0-100 with detailed explanations, hiring likelihood assessment that predicts the probability of actual recruitment activity, and extensive detailed analysis with categorized red flags highlighting concerning patterns and positive signals indicating legitimate opportunities. The system accepts both job URLs for automated content extraction from supported platforms and full job descriptions for manual analysis, with intelligent text parsing that detects common patterns in ghost job postings including unrealistic requirements, missing salary information, excessive buzzwords, and language suggesting continuous hiring rather than specific role fulfillment. Advanced features include confidence scoring based on text quality and signal strength, risk breakdown by category (stale, pipeline, vague), actionable recommendations for job seekers, and detailed evidence citations that explain each risk factor with specific examples from the analyzed text.',
  overview: 'Ghost Job Checker is an AI-powered job posting analysis tool that helps job seekers identify fake and phantom job postings. It uses sophisticated text analysis algorithms with multiple weighted risk factors (stale, pipeline, vague) to provide a transparent risk score from 0-100 with detailed explanations and actionable recommendations.',
  location: 'Remote',
  date: '2025-01-02',
  role: 'Full-Stack Development',
  details: 'Built to solve the problem of job seekers wasting time on fake job postings that companies keep up to collect resumes or maintain an appearance of growth. The tool uses heuristic analysis to detect multiple risk factors and provides transparent scoring with confidence levels. Features include URL fetching for LinkedIn/Indeed posts, manual description input, and detailed breakdowns of why a job might be a ghost posting.',
  brandColor: '#FF6B35',
  link: 'https://ghost-job-checker.vercel.app/',
  railText: 'GHOST JOB CHECKER • JOB ANALYSIS •',
  links: [
    { label: 'Live', url: 'https://ghost-job-checker.vercel.app/' }
  ],
  stack: [
    'HTML',
    'JavaScript',
    'CSS',
    'AI Text Analysis',
    'Risk Scoring Model',
    'URL Fetching',
    'Heuristic Detection',
    'UI / UX Design'
  ],
  highlights: [
    'Built multi-factor risk analysis system detecting stale, pipeline, and vague job patterns.',
    'Implemented intelligent text analysis for ghost job detection with confidence scoring.',
    'Created transparent scoring model with detailed breakdowns and actionable insights.'
  ],
  releases: [],
  tweets: [],

  // Dev Updates
  updates: [
    {
      version: 'v1.0.0',
      date: '2025-01-02',
      type: 'major',
      changes: [
        'Initial release of Ghost Job Checker',
        'Implemented multi-factor risk analysis (stale, pipeline, vague)',
        'Built URL fetching for LinkedIn/Indeed job postings',
        'Created heuristic detection system for ghost job patterns',
        'Added comprehensive scoring with confidence levels',
        'Designed transparent UI with detailed risk breakdowns'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/ghost-job-checker.html',

  // CSS Styles Path
  cssPath: 'css/projects/ghost-job-checker.css',

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

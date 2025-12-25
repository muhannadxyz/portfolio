// ShadoConnect Project Data, Template, and Styles

window.ShadoconnectProject = {
  // Project Data
  slug: 'shadoconnect',
  name: 'ShadoConnect',
  title: 'ShadoConnect',
  company: 'Healthcare & Education Platform',
  logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#6366F1"/><circle cx="16" cy="18" r="4" fill="white"/><path d="M12 28C12 25 14 23 16 23C18 23 20 25 20 28" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="18" r="4" fill="white"/><path d="M28 28C28 25 30 23 32 23C34 23 36 25 36 28" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M20 24H28" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>',
  thumb: 'images/shadoconnect.png',
  tagline: 'Shape your future career with real experience',
  description: 'ShadoConnect is a platform that connects students pursuing healthcare careers with professionals who offer shadowing opportunities, internships, and mentorship. Students create profiles with their interests and goals, and the AI-powered matching system pairs them with healthcare providers based on medical specialty, location, availability, and career alignment. The platform includes real-time scheduling, messaging, and application tracking to streamline the entire process.',
  details: 'Built a two-sided marketplace serving both students seeking clinical experience and healthcare professionals looking to mentor. The matching algorithm considers multiple factors including specialty preferences, geographic proximity, schedule compatibility, and career goals. Implemented calendar integration, automated notifications, and a messaging system for communication. The challenge was creating a system that efficiently matches students with relevant opportunities while maintaining quality and preventing spam.',
  brandColor: '#6366F1',
  link: 'https://shadoconnect.com',
  railText: 'SHADOCONNECT • HEALTHCARE / EDUCATION •',
  links: [
    { label: 'Live', url: 'https://shadoconnect.com' }
  ],
  stack: [
    'Web Platform',
    'Matching',
    'Scheduling',
    'Messaging',
    'Dashboards'
  ],
  highlights: [
    'Built matching logic to connect students with healthcare professionals.',
    'Implemented scheduling + calendar workflows and notifications.',
    'Shipped real-time messaging and application tracking.'
  ],
  
  // Dev Updates
  updates: [
    {
      version: 'v1.5.2',
      date: '2025-11-15',
      type: 'bugfix',
      changes: [
        'Fixed scheduling conflict detection',
        'Resolved notification delivery issues',
        'Fixed profile image upload bug',
        'Corrected timezone handling in calendar'
      ]
    },
    {
      version: 'v1.5.0',
      date: '2025-10-25',
      type: 'feature',
      changes: [
        'Added automated scheduling system',
        'Implemented calendar integration',
        'Added email notification system',
        'Enhanced matching algorithm with ML improvements'
      ]
    },
    {
      version: 'v1.4.0',
      date: '2025-09-15',
      type: 'enhancement',
      changes: [
        'Improved AI matching accuracy by 30%',
        'Redesigned student dashboard',
        'Added application tracking system',
        'Enhanced search and filter capabilities'
      ]
    },
    {
      version: 'v1.3.0',
      date: '2025-08-20',
      type: 'feature',
      changes: [
        'Launched real-time messaging system',
        'Added profile verification badges',
        'Implemented review and rating system',
        'Added shadowing opportunity recommendations'
      ]
    },
    {
      version: 'v1.0.0',
      date: '2025-07-15',
      type: 'major',
      changes: [
        'Initial platform launch',
        'Student and healthcare professional registration',
        'AI-powered matching system',
        'Basic profile management and discovery'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/shadoconnect.html',
  
  // CSS Styles Path
  cssPath: 'css/projects/shadoconnect.css',
  
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
      <div class="min-h-screen relative bg-black project-shadoconnect">
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


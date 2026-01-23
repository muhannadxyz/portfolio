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
  description: 'ShadoConnect is a comprehensive healthcare career development platform built using Lovable frameworks for rapid, component-driven development, React for building interactive, stateful user interfaces with efficient rendering and component reusability, and other modern web development tools including state management libraries, routing solutions, and API integration frameworks. The platform serves as a sophisticated digital bridge connecting ambitious students pursuing healthcare careers with experienced professionals who offer valuable shadowing opportunities, structured internships, and personalized mentorship relationships. Students create detailed, comprehensive profiles showcasing their academic interests, professional goals, career aspirations, relevant coursework, volunteer experiences, and specific areas of medical interest, while healthcare professionals list their medical specialties, clinical availability, mentoring preferences, preferred student backgrounds, and commitment levels. The AI-powered matching system employs advanced algorithms to intelligently pair students with providers based on multiple weighted factors including precise medical specialty alignment, geographic proximity with distance calculations, schedule compatibility analysis, and deep career goal alignment assessment. The platform includes sophisticated real-time scheduling functionality that seamlessly integrates with popular calendar systems like Google Calendar, Outlook, and Apple Calendar, enabling automatic availability synchronization and conflict detection. A comprehensive messaging system facilitates direct, secure communication between students and professionals with support for file attachments, read receipts, and message threading. Advanced application tracking provides detailed status monitoring for shadowing requests with workflow states including pending, under review, accepted, declined, and completed, along with timeline tracking and automated status update notifications. The matching algorithm employs machine learning techniques to continuously improve pairing quality by considering specialty preferences with weighted importance, precise location data with radius-based filtering, availability windows with time zone handling, and career trajectory analysis that predicts long-term compatibility. Automated notification systems keep both students and professionals informed about new matches with personalized recommendations, schedule changes with conflict alerts, application updates with detailed status explanations, and milestone celebrations that encourage continued engagement and relationship building.',
  brandColor: '#6366F1',
  link: 'https://shadoconnect.com',
  railText: 'SHADOCONNECT • HEALTHCARE / EDUCATION •',
  links: [
    { label: 'Live', url: 'https://shadoconnect.com' }
  ],
  stack: [
    'Lovable',
    'React',
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
          <img src="${this.thumb}" alt="${this.title}" class="w-full h-full object-cover scale-105" style="filter: brightness(0.6) saturate(1.2);">
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>
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
        <div class="relative z-20 bg-black px-6 md:px-12 py-16">
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
          </div>
        </div>
      </div>
    `;
  }
};


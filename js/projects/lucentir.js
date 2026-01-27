// Lucentir Project Data, Template, and Styles

window.LucentirProject = {
  // Project Data
  slug: 'lucentir',
  name: 'Lucentir',
  title: 'Lucentir',
  company: 'Privacy & Threat Intelligence',
  logo: '🛡️',
  icon: '🛡️',
  thumb: 'images/lucentir.png',
  tagline: 'See clearly. Stay private.',
  description: 'Lucentir is a comprehensive privacy intelligence platform built with React for building dynamic, component-based user interfaces with efficient state management and interactive features, Next.js for server-side rendering, optimized routing, and performance enhancements including automatic code splitting and image optimization, and deployed on Vercel for global edge network distribution, automatic SSL certificates, and seamless CI/CD integration. The platform serves as an authoritative resource helping users make informed decisions by comparing and choosing privacy-focused services like VPNs, Ad-Blockers, password managers, and other privacy-critical tools. It maintains an extensive database scoring 256 different products across 5 key privacy pillars: data minimization evaluating how little data services collect, user control assessing the level of user agency over personal information, security practices examining encryption standards and security protocols, data sharing analyzing third-party data sharing practices, and transparency measuring how openly companies communicate their privacy practices. Users can apply sophisticated filtering options including free service identification, open-source software filtering, services with no telemetry tracking, jurisdiction-based filtering for data residency preferences, and compliance certification filtering for GDPR, CCPA, and other regulatory standards. The platform includes comprehensive side-by-side comparison tools that allow users to evaluate multiple products simultaneously across all privacy dimensions, detailed scoring methodology that explains how each score is calculated with weighted factors and evaluation criteria, and extensively cited sources for every privacy claim with links to privacy policies, security audits, and third-party verification reports. Each product profile includes exhaustive detailed breakdowns of privacy policies with section-by-section analysis, comprehensive data collection practices documentation with specific data types identified, and thorough security measures examination including encryption protocols, authentication methods, and vulnerability disclosure practices. The scoring system follows industry-standard IR/SOC reporting practices with rigorous evaluation frameworks, provides completely transparent evaluation criteria with publicly accessible methodology documentation, and enables users to make fully informed privacy decisions by understanding exactly how each score is derived. All claims are meticulously backed by cited sources with direct links to original documentation, and the entire methodology is clearly documented for independent verification, allowing privacy researchers, journalists, and users to audit and validate the platform\'s assessments.',
  overview: 'Lucentir is a comprehensive privacy intelligence platform that helps users make informed decisions by comparing privacy-focused services. It scores 256 products across 5 privacy pillars: data minimization, user control, security practices, data sharing, and transparency. Features include side-by-side comparisons, sophisticated filtering, and extensively cited sources.',
  location: 'Remote',
  date: '2025-08-01',
  role: 'Full-Stack Development',
  brandColor: '#10B981',
  link: 'https://lucentir.xyz/',
  railText: 'LUCENTIR • PRIVACY INTELLIGENCE •',
  links: [
    { label: 'Live', url: 'https://lucentir.xyz/' }
  ],
  stack: [
    'React',
    'Next.js',
    'Vercel',
    'Web App',
    'Scoring Model',
    'Search + Filters',
    'Data Sourcing',
    'UI / UX'
  ],
  highlights: [
    'Built a 5‑pillar scoring model for privacy comparison across vendors.',
    'Shipped side‑by‑side comparison UX with rich filters and sorting.',
    'Designed for transparency: citations and methodology visibility.'
  ],
  releases: [],
  tweets: [],
  
  // Dev Updates
  updates: [
    {
      version: 'v2.3.0',
      date: '2025-12-2',
      type: 'feature',
      changes: [
        'Added real-time privacy score updates',
        'Implemented advanced filtering by privacy pillars',
        'Enhanced comparison view with side-by-side metrics',
        'Added export functionality for comparison reports'
      ]
    },
    {
      version: 'v2.2.1',
      date: '2025-11-20',
      type: 'enhancement',
      changes: [
        'Improved scoring algorithm accuracy',
        'Updated privacy policy data sources',
        'Optimized comparison loading performance',
        'Enhanced mobile responsiveness'
      ]
    },
    {
      version: 'v2.2.0',
      date: '2025-10-10',
      type: 'feature',
      changes: [
        'Launched Ad-Blocker comparison section',
        'Added privacy-first toggle filters',
        'Implemented transparent scoring methodology',
        'Added citation links for all privacy claims'
      ]
    },
    {
      version: 'v2.1.0',
      date: '2025-09-05',
      type: 'major',
      changes: [
        'Complete redesign of comparison interface',
        'Added 10+ VPN provider profiles',
        'Implemented 5-pillar scoring system',
        'Launched public beta version'
      ]
    },
    {
      version: 'v2.0.0',
      date: '2025-08-01',
      type: 'major',
      changes: [
        'Initial release of privacy intelligence platform',
        'VPN comparison with 256 comparison cases',
        'Privacy-first filtering system',
        'Transparent scoring model with cited sources'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/lucentir.html',
  
  // CSS Styles Path
  cssPath: 'css/projects/lucentir.css',
  
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
      <div class="min-h-screen relative bg-black project-lucentir">
        <div class="fixed inset-0 z-0" style="transform-origin: center;">
          <img src="${this.thumb}" alt="${this.title}" class="w-full h-full object-cover scale-105" style="filter: brightness(0.4) saturate(1.2);">
          <div class="absolute inset-0 bg-black"></div>
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


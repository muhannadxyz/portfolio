// DriveReady Project Data, Template, and Styles

window.DriveReadyProject = {
  // Project Data
  slug: 'driveready',
  name: 'DriveReady',
  title: 'DriveReady',
  company: 'Driver Test Prep Platform',
  logo: 'DR',
  icon: 'DR',
  thumb: 'images/driveready1.png',
  tagline: 'Pass your driver test with confidence',
  description: 'DriveReady is a community-driven driver test preparation platform that helps users across all 50 U.S. states prepare for both written permit tests and practical road exams. The platform combines real community data with structured study materials to give test-takers the most complete preparation experience available. The BMV/DMV Locator Map shows testing center locations enriched with community-submitted route data and real pass rate statistics — so users know exactly what to expect before they show up. The Route Submission Tool lets people who have already tested share the actual paths they drove, along with driving tips and observations, building a growing knowledge base of real test routes. The Timed Practice Permit Test mirrors the actual exam experience with answer explanations and the ability to save results over time. The Handbook Library provides simplified summaries of state-specific driving rules alongside official state PDFs, covering all 50 states in one place. DriveReady is built around transparency and peer learning — surfacing real pass rates, real routes, and real advice from people who have already gone through the process.',
  overview: 'DriveReady is a community-driven platform for driver test prep. Features include a BMV/DMV locator map with pass rates, community route sharing, timed permit practice tests, and a 50-state handbook library.',
  location: 'Remote',
  date: '2025-10-01',
  role: 'Full-Stack Development',
  brandColor: '#16A34A',
  link: 'https://driveready.up.railway.app/',
  railText: 'DRIVEREADY • DRIVER PREP •',
  links: [
    { label: 'Live', url: 'https://driveready.up.railway.app/' }
  ],
  stack: [
    'Full-Stack Web App',
    'Map Integration',
    'Community Data',
    'Railway',
    'Practice Tests',
    'State Coverage (50)',
  ],
  highlights: [
    'Built BMV/DMV locator map with community-submitted route data and pass rates.',
    'Shipped timed permit practice test with answer explanations and result saving.',
    'Implemented 50-state handbook library with simplified summaries and official PDFs.'
  ],
  releases: [],
  tweets: [],
  gallery: [],

  // Dev Updates
  updates: [
    {
      version: 'v1.0.0',
      date: '2025-10-01',
      type: 'major',
      changes: [
        'Initial platform launch',
        'BMV/DMV locator map with pass rate data',
        'Community route submission tool',
        'Timed permit practice tests',
        '50-state handbook library'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/driveready.html',

  // CSS Styles Path
  cssPath: 'css/projects/driveready.css',

  // HTML Template Function
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
      gallery: this.gallery || [],
      updates: this.updates || []
    });
  },

  getFallbackTemplate(devUpdatesHTML) {
    return `
      <div class="min-h-screen relative bg-black project-driveready">
        <div class="fixed inset-0 z-0" style="transform-origin: center;">
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
          <div class="max-w-5xl mx-auto space-y-8">
            <div class="project-card">
              <h2 class="text-3xl font-bold text-white mb-4">What It Is</h2>
              <p class="text-lg text-gray-300 leading-relaxed">${this.description}</p>
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

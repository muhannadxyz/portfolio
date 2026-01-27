// Tonsor Project Data, Template, and Styles

window.TonsorProject = {
  // Project Data
  slug: 'tonsor',
  name: 'Tonsor',
  title: 'Tonsor',
  company: 'Luxury Barbershop + E‑Commerce',
  logo: 'T',
  icon: 'T',
  thumb: 'images/tonsor.svg',
  tagline: "World's dopest barbershop experience",
  description: 'Tonsor is a luxury barbershop website built as a full-stack web application using Laravel (PHP) for robust server-side logic and API development, Blade templating for dynamic, reusable component-based views, Tailwind CSS for rapid, utility-first styling that ensures consistent design patterns, and Vite for lightning-fast development builds and optimized production asset bundling. The backend and database are powered by WordPress, providing a robust foundation for e-commerce functionality with extensive plugin ecosystem support, secure content management, and reliable data persistence. The site represents a sophisticated fusion of editorial magazine-style design aesthetics with comprehensive e-commerce functionality, creating an immersive digital experience that showcases barbershop services and sells premium grooming products through an elegant, meticulously curated layout that emphasizes strong typography, thoughtful visual hierarchy, and intentional white space. The design philosophy balances a high-end, luxury aesthetic with practical, conversion-optimized shopping functionality, featuring carefully curated product displays with high-resolution imagery, intuitive category navigation with filtering and search capabilities, and smooth, performant animations that enhance the premium brand experience without compromising usability. The layout architecture is optimized for performance with advanced image loading strategies including lazy loading and responsive image sets, minimal layout shift during page load through careful dimension management, and efficient resource prioritization that ensures critical content loads first. The site is fully responsive across all devices from mobile phones to large desktop displays, maintaining the sophisticated editorial aesthetic on smaller screens through adaptive typography scaling, touch-optimized navigation patterns, and mobile-first interaction design while ensuring fast load times, excellent accessibility standards compliance, and seamless cross-device user experience continuity. Product pages feature stunning high-quality imagery with zoom capabilities and multiple angle views, comprehensive detailed descriptions with ingredient lists and usage instructions, clear call-to-action buttons with strategic placement and visual hierarchy, and related product recommendations that guide users through the purchase process without compromising the luxury brand identity or overwhelming users with aggressive sales tactics.',
  overview: 'Tonsor is a luxury barbershop website that combines editorial magazine-style design with comprehensive e-commerce functionality. Built with Laravel, Blade, Tailwind CSS, and WordPress, it features premium typography, optimized image loading, and a fully responsive design that maintains the luxury aesthetic across all devices.',
  location: 'Remote',
  date: '2025-10-29',
  role: 'Full-Stack Development + Design',
  brandColor: '#C9B27D',
  link: 'https://www.thetonsor.com/',
  railText: 'TONSOR • LUXURY E‑COMMERCE •',
  links: [
    { label: 'Live', url: 'https://www.thetonsor.com/' }
  ],
  stack: [
    'Laravel (PHP)',
    'Blade',
    'Tailwind CSS',
    'Vite',
    'WordPress',
    'Full-Stack Web App',
    'Marketing Site',
    'E‑commerce UX',
    'Responsive Layout',
    'Performance',
    'Accessibility'
  ],
  highlights: [
    'Designed an editorial layout with premium typography and merchandising.',
    'Optimized image loading and reduced layout shift across breakpoints.',
    'Improved mobile navigation tap targets and readability.'
  ],
  releases: [],
  tweets: [],

  // Dev Updates
  updates: [
    {
      version: 'v1.2.0',
      date: '2025-12-10',
      type: 'feature',
      changes: [
        'Added new product/category card layout with stronger hover states',
        'Improved mobile navigation spacing and tap targets',
        'Refined hero typography for better readability',
        'Polished micro-interactions and transitions'
      ]
    },
    {
      version: 'v1.1.0',
      date: '2025-11-18',
      type: 'enhancement',
      changes: [
        'Optimized image loading and reduced layout shift',
        'Improved contrast and focus styles for accessibility',
        'Tuned spacing scale across sections for consistency'
      ]
    },
    {
      version: 'v1.0.0',
      date: '2025-10-29',
      type: 'major',
      changes: [
        'Initial release of the Tonsor site experience',
        'Built premium hero + category grid layout',
        'Implemented responsive structure for desktop → mobile'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/tonsor.html',

  // CSS Styles Path
  cssPath: 'css/projects/tonsor.css',

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
      <div class="min-h-screen relative bg-black project-tonsor">
        <div class="fixed inset-0 z-0" style="transform-origin: center;">
          <img src="${this.thumb}" alt="${this.title}" class="w-full h-full object-cover scale-105" style="filter: brightness(0.55) saturate(1.1);">
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



// RentWise Project Data, Template, and Styles

window.RentwiseProject = {
  // Project Data
  slug: 'rentwise',
  name: 'RentWise',
  title: 'Rentwise',
  company: 'Property Management Platform',
  logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#2563EB"/><rect x="18" y="14" width="12" height="20" rx="1" stroke="white" stroke-width="2"/><rect x="22" y="28" width="4" height="6" fill="white"/><rect x="20" y="18" width="2" height="2" fill="white"/><rect x="26" y="18" width="2" height="2" fill="white"/><rect x="20" y="22" width="2" height="2" fill="white"/><rect x="26" y="22" width="2" height="2" fill="white"/></svg>',
  thumb: 'images/rentwise1.jpeg',
  tagline: 'Streamline your rental operations',
  description: 'Rentwise is a comprehensive property management platform that helps landlords and property managers handle all aspects of rental operations in one unified system. The landlord dashboard provides property overview, tenant information management, lease tracking with expiration dates, maintenance request handling, and financial reporting with analytics. Landlords can manage multiple properties, view tenant payment history, track lease terms, and generate reports for accounting purposes. The tenant portal enables online rent payments through secure payment processing, maintenance request submission with photo uploads, document access for leases and receipts, and direct communication with property managers. The platform automates lease renewal reminders, sends payment notifications, routes maintenance requests to appropriate vendors, and provides analytics to help optimize rental operations. Automated workflows handle routine tasks like payment reminders, lease expiration alerts, and maintenance request routing to reduce administrative overhead.',
  brandColor: '#2563EB',
  link: 'https://rentwise.tech/',
  railText: 'RENTWISE • PROPERTY MGMT •',
  links: [
    { label: 'Live', url: 'https://rentwise.tech/' }
  ],
  stack: [
    'Web App',
    'Dashboards',
    'Tenant Portal',
    'Payments',
    'Reporting'
  ],
  highlights: [
    'Built tenant portal for payments + maintenance request tracking.',
    'Shipped landlord dashboard with reporting and property analytics.',
    'Implemented document workflows for leases and operational ops.'
  ],
  gallery: [
    'images/rentwise1.jpeg',
    'images/rentwise2.jpeg',
    'images/rentwise3.jpeg',
    'images/rentwise4.jpeg'
  ],
  
  // Dev Updates
  updates: [
    {
      version: 'v1.8.0',
      date: '2025-12-15',
      type: 'feature',
      changes: [
        'Added financial analytics dashboard',
        'Implemented automated rent collection',
        'Added lease document templates',
        'Launched tenant portal mobile app'
      ]
    },
    {
      version: 'v1.7.1',
      date: '2025-11-12',
      type: 'enhancement',
      changes: [
        'Improved maintenance request workflow',
        'Enhanced document management system',
        'Optimized database queries for faster loading',
        'Added bulk operations for property management'
      ]
    },
    {
      version: 'v1.7.0',
      date: '2025-10-20',
      type: 'feature',
      changes: [
        'Launched tenant portal',
        'Added online rent payment system',
        'Implemented maintenance request tracking',
        'Added document upload and storage'
      ]
    },
    {
      version: 'v1.6.0',
      date: '2025-09-10',
      type: 'enhancement',
      changes: [
        'Redesigned landlord dashboard',
        'Added property analytics and insights',
        'Implemented automated lease renewal reminders',
        'Enhanced communication tools'
      ]
    },
    {
      version: 'v1.0.0',
      date: '2025-08-01',
      type: 'major',
      changes: [
        'Initial platform release',
        'Property and tenant management',
        'Lease tracking system',
        'Basic financial reporting'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/rentwise.html',
  
  // CSS Styles Path
  cssPath: 'css/projects/rentwise.css',
  
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
      gallery: this.gallery || [],
      updates: this.updates || []
    });
  },
  
  // Fallback template if HTML file fails to load
  getFallbackTemplate(devUpdatesHTML) {
    const galleryHTML = this.gallery ? `
      <div class="project-gallery">
        <h3 class="text-2xl font-bold text-white mb-6">Project Gallery</h3>
        <div class="gallery-grid">
          ${this.gallery.map(img => `
            <div class="gallery-item">
              <img src="${img}" alt="Project screenshot" />
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';
    
    return `
      <div class="min-h-screen relative bg-black project-rentwise">
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
            ${galleryHTML}
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


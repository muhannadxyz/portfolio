// RentWise Project Data, Template, and Styles

window.RentwiseProject = {
  // Project Data
  slug: 'rentwise',
  name: 'RentWise',
  title: 'Rentwise',
  company: 'Property Management Platform',
  logo: 'RW',
  icon: 'RW',
  thumb: 'images/rentwise1.jpeg',
  tagline: 'Streamline your rental operations',
  description: 'Rentwise is a comprehensive property management platform built as a full-stack web application using Laravel (PHP), Blade templating, Tailwind CSS, and Vite for fast and responsive development. The backend and database are powered by WordPress, providing a robust foundation for data management with reliable content management capabilities and extensible plugin architecture. The platform represents a complete digital transformation of rental property operations, consolidating multiple tools and processes into a single, intuitive interface that serves both property owners and tenants. The landlord dashboard serves as a command center for property management operations, offering comprehensive property overviews with visual analytics, detailed tenant information management systems, sophisticated lease tracking with automated expiration date monitoring, streamlined maintenance request handling with priority routing, and advanced financial reporting with customizable analytics dashboards. Landlords can efficiently manage portfolios of multiple properties simultaneously, accessing real-time tenant payment history, tracking lease terms and renewals, generating comprehensive reports for accounting and tax purposes, and monitoring property performance metrics. The tenant portal revolutionizes the rental experience by enabling seamless online rent payments through secure, PCI-compliant payment processing systems, intuitive maintenance request submission with photo uploads and detailed descriptions, comprehensive document access for leases, receipts, and important communications, and direct messaging channels with property managers for instant communication. The platform\'s automation engine handles complex workflows including lease renewal reminders sent via email and SMS, automated payment notifications and late fee calculations, intelligent maintenance request routing to appropriate vendors based on issue type and urgency, and comprehensive analytics that help optimize rental operations by identifying trends, predicting maintenance needs, and maximizing property value. Advanced features include automated workflows that handle routine administrative tasks like payment reminders, lease expiration alerts with renewal prompts, maintenance request routing with vendor assignment, and comprehensive reporting that reduces administrative overhead while improving tenant satisfaction and property profitability.',
  overview: 'Rentwise is a comprehensive property management platform that consolidates rental operations into a single interface. Features include landlord dashboards with analytics, tenant portals for payments and maintenance requests, automated workflows, and comprehensive reporting.',
  location: 'Remote',
  date: '2025-08-01',
  role: 'Full-Stack Development',
  brandColor: '#2563EB',
  link: 'https://rentwise.tech/',
  railText: 'RENTWISE • PROPERTY MGMT •',
  links: [
    { label: 'Live', url: 'https://rentwise.tech/' }
  ],
  stack: [
    'Laravel (PHP)',
    'Blade',
    'Tailwind CSS',
    'Vite',
    'WordPress',
    'Full-Stack Web App',
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
  releases: [],
  tweets: [],
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


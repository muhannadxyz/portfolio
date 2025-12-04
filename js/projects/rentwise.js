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
  description: 'Built a comprehensive property management platform designed to streamline rental operations for landlords and property managers. Developed features for tenant management, lease tracking, maintenance request workflows, and financial reporting. Implemented automated rent collection, document management, and communication tools to improve efficiency.',
  details: 'Created an all-in-one solution addressing the complexities of managing rental properties. Built tenant portals for rent payments and maintenance requests, landlord dashboards for property oversight, automated lease renewals, and financial analytics. The platform reduces administrative overhead and improves tenant satisfaction through real-time notifications and seamless communication.',
  brandColor: '#2563EB',
  link: 'https://rentwise.tech/',
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
    // Load CSS
    if (window.ProjectLoader) {
      window.ProjectLoader.loadCSS(this.cssPath, this.slug);
    }
    
    try {
      if (window.ProjectLoader) {
        const data = {
          thumb: this.thumb,
          title: this.title,
          company: this.company,
          logo: this.logo,
          description: this.description,
          details: this.details,
          link: this.link,
          gallery: this.gallery || [],
          devUpdatesHTML: devUpdatesHTML || ''
        };
        return await window.ProjectLoader.loadTemplate(this.htmlTemplatePath, data);
      } else {
        throw new Error('ProjectLoader not available');
      }
    } catch (error) {
      console.error(`Error loading template for ${this.name}:`, error);
      return this.getFallbackTemplate(devUpdatesHTML);
    }
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
            ${galleryHTML}
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


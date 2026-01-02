// Dev Updates Page - Project Versions and Changelogs

// State management
let allUpdates = [];
let filteredUpdates = [];
let currentFilter = { project: 'all', type: 'all', search: '' };

// Get project data from shared module
// Wait for ProjectUpdates to be initialized
let projectsData = [];

function getProjectsData() {
  if (window.ProjectUpdates && window.ProjectUpdates.projectsData && window.ProjectUpdates.projectsData.length > 0) {
    return window.ProjectUpdates.projectsData;
  }
  // Fallback if ProjectUpdates not ready yet
  return [];
}

// Fallback project data (only used if ProjectUpdates fails to load)
const fallbackProjectsData = [
  {
    slug: 'lucentir',
    name: 'Lucentir',
    logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="url(#lucentir-gradient)"/><path d="M24 12C19 12 16 14 16 14V24C16 29 19.5 33 24 36C28.5 33 32 29 32 24V14C32 14 29 12 24 12Z" fill="white"/><defs><linearGradient id="lucentir-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#10B981"/><stop offset="1" stop-color="#059669"/></linearGradient></defs></svg>',
    brandColor: '#10B981',
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
    ]
  },
  {
    slug: 'shadoconnect',
    name: 'ShadoConnect',
    logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#6366F1"/><circle cx="16" cy="18" r="4" fill="white"/><path d="M12 28C12 25 14 23 16 23C18 23 20 25 20 28" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="32" cy="18" r="4" fill="white"/><path d="M28 28C28 25 30 23 32 23C34 23 36 25 36 28" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M20 24H28" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>',
    brandColor: '#6366F1',
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
    ]
  },
  {
    slug: 'rentwise',
    name: 'RentWise',
    logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#2563EB"/><rect x="18" y="14" width="12" height="20" rx="1" stroke="white" stroke-width="2"/><rect x="22" y="28" width="4" height="6" fill="white"/><rect x="20" y="18" width="2" height="2" fill="white"/><rect x="26" y="18" width="2" height="2" fill="white"/><rect x="20" y="22" width="2" height="2" fill="white"/><rect x="26" y="22" width="2" height="2" fill="white"/></svg>',
    brandColor: '#2563EB',
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
    ]
  },
  {
    slug: 'wifi-analyzer',
    name: 'Public Wi-Fi Risk Analyzer',
    logo: '<img src="images/wifi-symbol.webp" alt="Wi-Fi Analyzer" style="width: 100%; height: 100%; object-fit: contain;">',
    brandColor: '#EF4444',
    updates: [
      {
        version: 'v3.2.0',
        date: '2025-10-01',
        type: 'feature',
        changes: [
          'Added network history export to CSV',
          'Implemented risk score visualization charts',
          'Added custom risk threshold settings',
          'Enhanced GUI with dark mode support'
        ]
      },
      {
        version: 'v3.1.1',
        date: '2025-09-15',
        type: 'bugfix',
        changes: [
          'Fixed firewall detection on Linux systems',
          'Resolved DNS resolution timeout issues',
          'Fixed GUI layout on high-DPI displays',
          'Corrected timestamp formatting in logs'
        ]
      },
      {
        version: 'v3.1.0',
        date: '2025-08-25',
        type: 'enhancement',
        changes: [
          'Improved HTTPS check reliability',
          'Enhanced logging system with detailed timestamps',
          'Added network interface selection',
          'Optimized scan performance'
        ]
      },
      {
        version: 'v3.0.0',
        date: '2025-07-15',
        type: 'major',
        changes: [
          'Complete GUI redesign with Tkinter',
          'Added scan history with persistent storage',
          'Implemented risk scoring algorithm',
          'Added cross-platform firewall detection'
        ]
      },
      {
        version: 'v2.0.0',
        date: '2025-06-10',
        type: 'major',
        changes: [
          'Initial release with command-line interface',
          'HTTPS, DNS, VPN, and firewall checks',
          'Basic security analysis',
          'SSID logging functionality'
        ]
      }
    ]
  },
  {
    slug: 'wind-turbine',
    name: 'Wind Turbine Monitoring System',
    logo: '<img src="images/turbine.png" alt="Wind Turbine" style="width: 100%; height: 100%; object-fit: contain;">',
    brandColor: '#059669',
    updates: [
      {
        version: 'v2.5.0',
        date: '2025-05-31',
        type: 'feature',
        changes: [
          'Added web dashboard for remote monitoring',
          'Implemented data visualization with charts',
          'Added email alerts for performance thresholds',
          'Integrated cloud data storage'
        ]
      },
      {
        version: 'v2.4.0',
        date: '2025-05-20',
        type: 'enhancement',
        changes: [
          'Improved sensor calibration accuracy',
          'Enhanced RPM calculation algorithm',
          'Added data export to JSON format',
          'Optimized interrupt handling for better performance'
        ]
      },
      {
        version: 'v2.3.0',
        date: '2025-05-15',
        type: 'feature',
        changes: [
          'Added real-time clock synchronization',
          'Implemented automatic data logging',
          'Added power efficiency calculations',
          'Enhanced serial communication protocol'
        ]
      },
      {
        version: 'v2.0.0',
        date: '2025-05-10',
        type: 'major',
        changes: [
          'Complete system redesign',
          'Added Hall-effect sensor for RPM measurement',
          'Implemented voltage and current sensors',
          'Added RTC integration for timestamping'
        ]
      },
      {
        version: 'v1.0.0',
        date: '2025-05-01',
        type: 'major',
        changes: [
          'Initial prototype release',
          'Basic Arduino-based monitoring',
          'Simple data collection system',
          'Serial output for data logging'
        ]
      }
    ]
  }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for ProjectUpdates to initialize
  setTimeout(() => {
    projectsData = getProjectsData();
    if (projectsData.length === 0) {
      // Use fallback data if ProjectUpdates not available
      projectsData = fallbackProjectsData;
    }
    initializeData();
    setupFilters();
    setupSearch();
    setupScrollToTop();
    renderUpdates();
  }, 100);
});

// Initialize data structure
function initializeData() {
  projectsData.forEach(project => {
    project.updates.forEach(update => {
      allUpdates.push({
        ...update,
        projectSlug: project.slug,
        projectName: project.name,
        projectLogo: project.logo,
        brandColor: project.brandColor
      });
    });
  });
  
  // Sort by date (newest first)
  allUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
  filteredUpdates = [...allUpdates];
  
  // Populate project filter
  const projectFilter = document.getElementById('project-filter');
  projectsData.forEach(project => {
    const option = document.createElement('option');
    option.value = project.slug;
    option.textContent = project.name;
    projectFilter.appendChild(option);
  });
}

// Setup filters
function setupFilters() {
  const projectFilter = document.getElementById('project-filter');
  const typeFilter = document.getElementById('type-filter');
  
  projectFilter.addEventListener('change', (e) => {
    currentFilter.project = e.target.value;
    applyFilters();
  });
  
  typeFilter.addEventListener('change', (e) => {
    currentFilter.type = e.target.value;
    applyFilters();
  });
}

// Setup search
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  let searchTimeout;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentFilter.search = e.target.value.toLowerCase();
      applyFilters();
    }, 300);
  });
}

// Apply filters and search
function applyFilters() {
  filteredUpdates = allUpdates.filter(update => {
    // Project filter
    if (currentFilter.project !== 'all' && update.projectSlug !== currentFilter.project) {
      return false;
    }
    
    // Type filter
    if (currentFilter.type !== 'all' && update.type !== currentFilter.type) {
      return false;
    }
    
    // Search filter
    if (currentFilter.search) {
      const searchTerm = currentFilter.search;
      const searchableText = [
        update.version,
        update.projectName,
        update.date,
        ...update.changes
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
  
  renderUpdates();
}

// Render updates
function renderUpdates() {
  const container = document.getElementById('dev-container');
  container.innerHTML = '';
  
  if (filteredUpdates.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>No updates found matching your filters.</p>
      </div>
    `;
    return;
  }
  
  filteredUpdates.forEach((update, index) => {
    const card = createUpdateCard(update, index);
    container.appendChild(card);
  });
}

// Create update card
function createUpdateCard(update, index) {
  const card = document.createElement('div');
  card.className = 'update-card';
  card.style.animationDelay = `${index * 0.05}s`;
  
  const typeColors = {
    major: '#9333EA',
    feature: '#10B981',
    enhancement: '#3B82F6',
    bugfix: '#EF4444'
  };
  
  const typeLabels = {
    major: 'Major',
    feature: 'Feature',
    enhancement: 'Enhancement',
    bugfix: 'Bug Fix'
  };
  
  const formattedDate = new Date(update.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  card.innerHTML = `
    <div class="update-card-header">
      <div class="update-project-info">
        <div class="project-logo" style="background: ${update.brandColor}20; border-color: ${update.brandColor}40;">
          ${update.projectLogo}
        </div>
        <div class="project-details">
          <h3 class="project-name" style="color: ${update.brandColor};">${update.projectName}</h3>
          <span class="update-date">${formattedDate}</span>
        </div>
      </div>
      <div class="update-badges">
        <span class="version-badge" style="background: ${update.brandColor}20; color: ${update.brandColor}; border-color: ${update.brandColor}40;">
          ${update.version}
        </span>
        <span class="type-badge" style="background: ${typeColors[update.type]}20; color: ${typeColors[update.type]}; border-color: ${typeColors[update.type]}40;">
          ${typeLabels[update.type]}
        </span>
      </div>
    </div>
    <div class="update-card-body">
      <ul class="update-changes">
        ${update.changes.map(change => `
          <li class="change-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink: 0; margin-right: 8px;">
              <path d="M6 8L7.5 9.5L10 7" stroke="${update.brandColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>${change}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
  
  return card;
}

// Setup scroll to top button
function setupScrollToTop() {
  const button = document.getElementById('scroll-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


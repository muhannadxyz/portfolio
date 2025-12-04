// Shared Project Updates Data
// This module provides project update/changelog data for use in project overlays and dev page

const ProjectUpdates = {
  projectsData: [
    {
      slug: 'lucentir',
      name: 'Lucentir',
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
  ],

  // Get updates for a specific project by slug
  getUpdatesBySlug(slug) {
    const project = this.projectsData.find(p => p.slug === slug);
    return project ? project.updates : [];
  },

  // Get project data by slug
  getProjectBySlug(slug) {
    return this.projectsData.find(p => p.slug === slug) || null;
  }
};

// Make it globally available
window.ProjectUpdates = ProjectUpdates;


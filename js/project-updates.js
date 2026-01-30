// Shared Project Updates Data
// Combines all individual project files

const ProjectUpdates = {
  projectsData: [],

  // Initialize - collects all project data from individual files
  init() {
    this.projectsData = [
      window.PortfolioOSProject,
      window.LucentirProject,
      window.TonsorProject,
      window.ShadoconnectProject,
      window.RentwiseProject,
      window.WifiAnalyzerProject,
      window.WindTurbineProject,
      window.PostNoteProject,
      window.GhostJobCheckerProject,
      window.FluxdeskProject,
      window.CreatePeeProject
    ].filter(p => p); // Filter out any undefined projects
    
    // Extract only the data needed for updates (slug, name, brandColor, updates)
    this.projectsData = this.projectsData.map(project => ({
      slug: project.slug,
      name: project.name,
      brandColor: project.brandColor,
      logo: project.logo,
      updates: project.updates || []
    }));
  },

  // Get updates for a specific project by slug
  getUpdatesBySlug(slug) {
    const project = this.projectsData.find(p => p.slug === slug);
    return project ? project.updates : [];
  },

  // Get project data by slug
  getProjectBySlug(slug) {
    return this.projectsData.find(p => p.slug === slug) || null;
  },

  // Get full project object by slug (from individual project files)
  getFullProjectBySlug(slug) {
    const projectMap = {
      'portfolio-os': window.PortfolioOSProject,
      'lucentir': window.LucentirProject,
      'tonsor': window.TonsorProject,
      'shadoconnect': window.ShadoconnectProject,
      'rentwise': window.RentwiseProject,
      'wifi-analyzer': window.WifiAnalyzerProject,
      'wind-turbine': window.WindTurbineProject,
      'postnote': window.PostNoteProject,
      'ghost-job-checker': window.GhostJobCheckerProject,
      'fluxdesk': window.FluxdeskProject,
      'createpee': window.CreatePeeProject
    };
    return projectMap[slug] || null;
  }
};

// Initialize when all scripts are loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ProjectUpdates.init();
    window.ProjectUpdates = ProjectUpdates;
  });
} else {
  // If DOM is already loaded, wait a bit for project scripts to load
  setTimeout(() => {
    ProjectUpdates.init();
    window.ProjectUpdates = ProjectUpdates;
  }, 100);
}

// Make it globally available
window.ProjectUpdates = ProjectUpdates;

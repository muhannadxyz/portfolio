// CreatePee Project Data, Template, and Styles

window.CreatePeeProject = {
  // Project Data
  slug: 'createpee',
  name: 'CreatePee',
  title: 'CreatePee',
  company: 'Web Editing Suite',
  logo: 'CP',
  icon: 'CP',
  thumb: 'images/createepee.png',
  gallery: [
    'images/createepee.png'
  ],
  tagline: 'Edit images, videos, and documents directly in your browser with zero signup.',
  description: 'CreatePee is a comprehensive web-based editing suite built with SvelteKit that lets users edit images, videos, and documents directly in the browser without accounts or paywalls. The image editor is canvas-based using Fabric.js with tools for selection, text, shapes, free drawing, and layer management, plus real-time filters and color controls for stroke, fill, and text. The video editor supports uploads, trimming, merging clips, text overlays, and audio replacement with a custom timeline and MP4 export. The platform is designed for fast, anonymous workflows and a smooth, responsive UI.',
  overview: 'A browser-based editing studio for images and videos with real-time tools, layer management, and export workflows. Built on SvelteKit with Fabric.js for canvas editing and FFmpeg-based server processing for video.',
  location: 'Remote',
  date: '2026-01-30',
  role: 'Full-Stack Development',
  details: 'The challenge was delivering a multi-tool editing experience that feels native in the browser while keeping the workflow anonymous and fast. I balanced Fabric.js canvas performance with a clean layer/toolbar UX, and paired a client-side preview system with server-side FFmpeg processing for reliable video exports.',
  brandColor: '#22c55e',
  link: 'https://github.com/muhannadxyz/Createepee',
  railText: 'CREATEPEE • WEB EDITING • SUITE •',
  links: [
    { label: 'GitHub', url: 'https://github.com/muhannadxyz/Createepee' }
  ],
  stack: [
    'SvelteKit',
    'Svelte',
    'Fabric.js',
    'FFmpeg',
    'fluent-ffmpeg',
    'Node.js',
    'Canvas Editing',
    'API Routes'
  ],
  highlights: [
    'Canvas image editor with selection, text, shapes, free draw, layers, and real-time filters.',
    'Video editor with trimming, clip merges, text overlays, audio replacement, and MP4 export.',
    'Anonymous, no-signup workflow with fast, responsive UI and in-browser previews.'
  ],
  releases: [],
  tweets: [],

  // Dev Updates
  updates: [
    {
      version: 'v1.0.0',
      date: '2026-01-30',
      type: 'major',
      changes: [
        'Image editor with Fabric.js tools, layers, and live filter controls',
        'Video editor timeline with trim, merge, text overlay, and audio replacement',
        'MP4 export pipeline with server-side FFmpeg processing',
        'Anonymous usage with no signup required'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/createpee.html',

  // CSS Styles Path
  cssPath: 'css/projects/createpee.css',

  // HTML Template Function - uses brutal project template
  async renderTemplate(devUpdatesHTML) {
    if (!window.ProjectLoader) return this.getFallbackTemplate(devUpdatesHTML);
    window.ProjectLoader.loadCSS('css/projects/brutal-project.css', 'brutal-project');
    return window.ProjectLoader.renderBrutalProjectTemplate({
      slug: this.slug,
      thumb: this.thumb,
      gallery: this.gallery,
      title: this.title,
      company: this.company,
      logo: this.logo,
      tagline: this.tagline,
      description: this.description,
      details: this.details,
      link: this.link,
      links: this.links,
      railText: this.railText,
      stack: this.stack,
      highlights: this.highlights,
      updates: this.updates || []
    });
  },

  // Fallback template if loader fails
  getFallbackTemplate(devUpdatesHTML) {
    return `
      <div class="min-h-screen relative bg-black project-createpee">
        <div class="fixed inset-0 z-0" style="transform-origin: center;">
          <div class="w-full h-full bg-gradient-to-br from-emerald-950/70 to-black"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
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
                <div class="card-icon role-icon">🧩</div>
                <h2 class="text-3xl font-bold text-white">What It Is</h2>
              </div>
              <p class="text-lg text-gray-300 leading-relaxed">${this.description}</p>
            </div>
            <div class="project-card">
              <div class="flex items-center gap-3 mb-4">
                <div class="card-icon challenge-icon">🎯</div>
                <h3 class="text-3xl font-bold text-white">The Challenge</h3>
              </div>
              <p class="text-lg text-gray-300 leading-relaxed">${this.details}</p>
            </div>
            <div class="dev-updates-divider"></div>
            <div id="dev-updates-container">${devUpdatesHTML || ''}</div>
          </div>
        </div>
      </div>
    `;
  }
};

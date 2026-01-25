// FluxDesk Project Data, Template, and Styles

window.FluxdeskProject = {
  // Project Data
  slug: 'fluxdesk',
  name: 'FluxDesk',
  title: 'FluxDesk',
  company: 'Helpdesk Ticket Management',
  logo: '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #fff; font-family: system-ui, sans-serif;">FD</div>',
  thumb: 'images/fluxdesk1.png',
  gallery: [
    'images/fluxdesk1.png',
    'images/fluxdesk2.png',
    'images/fluxdesk3.png'
  ],
  tagline: 'A polished helpdesk ticket management interface built with Laravel 12, Livewire v3, and Tailwind CSS.',
  description: 'FluxDesk is a helpdesk ticket management interface built with Laravel 12, Livewire v3, and Tailwind CSS. The Ticket Inbox at /tickets offers real-time search by subject or customer via wire:model.live, status and tag filters, and sorting by newest, oldest, or last activity. Ticket cards show subject, customer name, last activity, color-coded status badges (open, pending, solved, closed), priority badges (high, medium, low), assignee badges with shield icons, and tag badges, with skeleton loaders and clear empty states. The Ticket Detail page at /tickets/{id} includes a header with subject, customer info, timestamps, and live-updating badges; a conversation timeline with distinct styling for agents (blue) vs customers (gray), internal notes with dashed borders and yellow styling, avatar initials, and timestamps; a reply form with validation, internal-note checkbox, and loading states; and an action sidebar for status, assignee, and tag management with toast notifications. The app is responsive, accessible (ARIA, semantic HTML, keyboard navigation), and uses Livewire for a reactive UI with loading and error states.',
  details: 'With more time I would integrate Flux UI for consistency, add advanced filtering (date ranges, saved presets) and bulk actions, keyboard shortcuts (e.g. j/k to navigate, r to reply), WebSockets for live updates, a rich text editor and file attachments, ticket history/audit log, advanced search with operators and saved searches, performance and caching improvements, dark mode, mobile/PWA, broader tests, and WCAG 2.1 AA plus i18n.',
  brandColor: '#6366f1',
  link: 'https://github.com/muhannadxyz/fluxdesk',
  railText: 'FLUXDESK • HELPDESK • TICKETS •',
  links: [
    { label: 'GitHub', url: 'https://github.com/muhannadxyz/fluxdesk' }
  ],
  stack: [
    'Laravel 12',
    'Livewire v3',
    'Tailwind CSS',
    'PHP',
    'Blade',
    'Reactive UI',
    'Real-time Search',
    'UI / UX Design'
  ],
  highlights: [
    'Ticket inbox with real-time search, filters, sorting, status/priority/assignee/tag badges, and skeleton loaders.',
    'Ticket detail page with agent vs customer conversation timeline, internal notes, reply form, and action sidebar.',
    'Livewire-powered reactive UI with validation, loading states, toasts, and accessibility (ARIA, keyboard).'
  ],

  // Dev Updates
  updates: [
    {
      version: 'v1.0.0',
      date: '2025-01-23',
      type: 'major',
      changes: [
        'Ticket Inbox: search, status/tag filters, sort by newest/oldest/last activity',
        'Ticket cards with status, priority, assignee, and tag badges',
        'Ticket Detail: conversation timeline, reply form, internal notes, action sidebar',
        'Livewire v3 reactive UI with loading and empty states',
        'Responsive layout and accessibility improvements'
      ]
    }
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/fluxdesk.html',

  // CSS Styles Path
  cssPath: 'css/projects/fluxdesk.css',

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
      <div class="min-h-screen relative bg-black project-fluxdesk">
        <div class="fixed inset-0 z-0" style="transform-origin: center;">
          <div class="w-full h-full bg-gradient-to-br from-indigo-950/80 to-black"></div>
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
                <div class="card-icon role-icon">🎫</div>
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

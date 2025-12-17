// Public Wi-Fi Risk Analyzer Project Data, Template, and Styles

window.WifiAnalyzerProject = {
  // Project Data
  slug: 'wifi-analyzer',
  name: 'Public Wi-Fi Risk Analyzer',
  title: 'Public Wi-Fi Risk Analyzer',
  company: 'Security & Network Tool',
  logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#EF4444"/><path d="M24 18C29 18 33 22 33 27" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M24 22C26.5 22 29 24.5 29 27" stroke="white" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="27" r="2" fill="white"/><path d="M18 32L30 32" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M20 28L28 28" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 2"/></svg>',
  thumb: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=600&fit=crop',
  tagline: 'Assess public Wi-Fi security risks',
  description: 'Developed a Python-based security application with Tkinter GUI to assess the safety of public Wi-Fi networks. Built comprehensive security checks including HTTPS support verification, DNS resolution testing, firewall status detection, and VPN activity monitoring. Implemented real-time connectivity testing and automated logging with timestamps for security audits.',
  details: 'Created a user-friendly desktop tool that helps users make informed decisions about public Wi-Fi security. The application performs multi-layered security assessments including SSL/TLS verification, network interface analysis, cross-platform firewall detection, and connectivity health checks. Features detailed logging and reporting to track network security over time.',
  brandColor: '#EF4444',
  link: 'https://github.com/muhannadxyz/PublicWiFiAnalyzer',
  railText: 'PUBLIC WI‑FI RISK ANALYZER • SECURITY TOOL •',
  links: [
    { label: 'Repo', url: 'https://github.com/muhannadxyz/PublicWiFiAnalyzer' }
  ],
  stack: [
    'Python',
    'Tkinter',
    'Networking',
    'Security Checks',
    'Logging'
  ],
  highlights: [
    'Built multi-signal risk scoring (HTTPS/DNS/VPN/firewall) with audit-style logs.',
    'Designed a desktop GUI with scan history and export workflows.',
    'Made checks cross-platform (Windows/macOS/Linux) where possible.'
  ],
  codeSnippets: [
    {
      title: 'HTTPS Security Check',
      language: 'python',
      code: `def check_https_multiple():
    test_domains = ["https://google.com", "https://example.com", "https://cloudflare.com"]
    successes = 0
    for domain in test_domains:
        try:
            response = requests.get(domain, timeout=5)
            if response.url.startswith("https://"):
                successes += 1
        except:
            continue
    return successes >= 2`
    },
    {
      title: 'Firewall Detection',
      language: 'python',
      code: `def check_firewall():
    system = platform.system()
    try:
        if system == "Windows":
            output = subprocess.getoutput("netsh advfirewall show allprofiles")
            return "ON" in output
        elif system == "Darwin":  # macOS
            output = subprocess.getoutput("/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate")
            return "enabled" in output.lower()
        elif system == "Linux":
            output = subprocess.getoutput("sudo ufw status")
            return "active" in output.lower()
    except:
        pass
    return False`
    }
  ],
  
  // Dev Updates
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
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/wifi-analyzer.html',
  
  // CSS Styles Path
  cssPath: 'css/projects/wifi-analyzer.css',
  
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
      details: this.details,
      link: this.link,
      links: this.links,
      railText: this.railText,
      stack: this.stack,
      highlights: this.highlights,
      codeSnippets: this.codeSnippets || [],
      updates: this.updates || []
    });
  },
  
  // Fallback template if HTML file fails to load
  getFallbackTemplate(devUpdatesHTML) {
    const codeSnippetsHTML = this.codeSnippets ? `
      <div class="flip-card-container" onclick="this.querySelector('.flip-card').classList.toggle('flipped')">
        <div class="flip-card">
          <div class="flip-card-front">
            <div style="border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); position: relative;">
              <img src="${this.thumb}" alt="Project showcase" class="w-full" style="display: block;">
              <div class="flip-hint">Click to see code 💻</div>
            </div>
          </div>
          <div class="flip-card-back">
            <h3 class="text-2xl font-bold text-white mb-4" style="color: #10b981;">💻 Code Implementation</h3>
            <div style="max-height: 500px; overflow-y: auto;">
              ${this.codeSnippets.map(snippet => `
                <div style="margin-bottom: 24px;">
                  <div style="background: rgba(255,255,255,0.05); padding: 12px 20px; border-radius: 12px 12px 0 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span style="color: #10b981; font-weight: 600; font-size: 16px;">${snippet.title}</span>
                      <span style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">${snippet.language}</span>
                    </div>
                  </div>
                  <pre style="margin: 0; padding: 20px; background: rgba(0,0,0,0.5); border-radius: 0 0 12px 12px; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5; color: #e5e7eb;"><code>${snippet.code}</code></pre>
                </div>
              `).join('')}
            </div>
            <div style="margin-top: 20px; text-align: center; color: #9ca3af; font-size: 14px;">Click again to flip back</div>
          </div>
        </div>
      </div>
    ` : `
      <div class="project-showcase">
        <img src="${this.thumb}" alt="Project showcase" class="w-full" style="display: block;">
      </div>
    `;
    
    return `
      <div class="min-h-screen relative bg-black project-wifi-analyzer">
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
            ${codeSnippetsHTML}
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


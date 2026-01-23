// Public Wi-Fi Risk Analyzer Project Data, Template, and Styles

window.WifiAnalyzerProject = {
  // Project Data
  slug: 'wifi-analyzer',
  name: 'Public Wi-Fi Risk Analyzer',
  title: 'Public Wi-Fi Risk Analyzer',
  company: 'Security & Network Tool',
  logo: '<img src="images/wifi-symbol.webp" alt="Wi-Fi Analyzer" style="width: 100%; height: 100%; object-fit: contain;">',
  thumb: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=600&fit=crop',
  tagline: 'Assess public Wi-Fi security risks',
  description: 'Public Wi-Fi Risk Analyzer is a comprehensive desktop application built with Python for robust cross-platform compatibility and extensive library ecosystem, and Python GUI using Tkinter for native-looking interface components, event-driven programming, and platform-consistent user experience. The application addresses a critical security need by helping users assess the security posture of public Wi-Fi networks before connecting, enabling informed decisions about network safety and data protection. It performs extensive, multi-layered security checks including HTTPS encryption verification by systematically testing connections to multiple secure websites with various certificate authorities, DNS resolution reliability testing that evaluates response times, checks for DNS hijacking or poisoning attempts, and verifies DNS-over-HTTPS support, comprehensive system firewall status detection using platform-specific system commands and API calls, and active VPN activity monitoring that detects VPN connections and assesses their effectiveness. The tool provides a sophisticated, weighted risk score based on multiple security factors with detailed explanations of each contributing element, and generates comprehensive, audit-ready logs with precise timestamps, detailed test results, and actionable recommendations for security improvement. The application works seamlessly cross-platform on Windows with native system integration, macOS with proper permission handling, and Linux with distribution-agnostic compatibility, ensuring consistent functionality regardless of operating system. The security assessment methodology includes systematic HTTPS support testing by attempting connections to multiple secure domains with various protocols and cipher suites, comprehensive DNS resolution capability verification that tests multiple DNS servers and evaluates response consistency, thorough system firewall status checking using platform-specific commands that provide accurate detection across different security configurations, and intelligent active VPN connection detection that identifies VPN usage and assesses connection quality. All security checks are meticulously logged with precise timestamps including millisecond accuracy, detailed test parameters, and comprehensive result data, and the application maintains an extensive history of network scans with searchable records, comparison tools, and trend analysis capabilities that enable users to track network security over time. The risk scoring algorithm employs sophisticated weighting of different security factors including encryption strength, DNS reliability, firewall protection level, and VPN effectiveness to provide an accurate, nuanced overall assessment of network safety that helps users make informed security decisions.',
  brandColor: '#EF4444',
  link: 'https://github.com/muhannadxyz/PublicWiFiAnalyzer',
  railText: 'PUBLIC WI‑FI RISK ANALYZER • SECURITY TOOL •',
  links: [
    { label: 'Repo', url: 'https://github.com/muhannadxyz/PublicWiFiAnalyzer' }
  ],
  stack: [
    'Python',
    'Python GUI (Tkinter)',
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
            <div style="border: 1px solid #fff; position: relative;">
              <img src="${this.thumb}" alt="Project showcase" class="w-full" style="display: block;">
              <div class="flip-hint">Click to see code</div>
            </div>
          </div>
          <div class="flip-card-back">
            <h3 class="text-2xl font-bold text-white mb-4" style="color: #10b981;">Code Implementation</h3>
            <div style="max-height: 500px; overflow-y: auto;">
              ${this.codeSnippets.map(snippet => `
                <div style="margin-bottom: 24px;">
                  <div style="background: #000; padding: 12px 20px; border-bottom: 1px solid #fff;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span style="color: #10b981; font-weight: 600; font-size: 16px;">${snippet.title}</span>
                      <span style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">${snippet.language}</span>
                    </div>
                  </div>
                  <pre style="margin: 0; padding: 20px; background: #000; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.5; color: #fff; border-top: 1px solid #fff;"><code>${snippet.code}</code></pre>
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
            ${codeSnippetsHTML}
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


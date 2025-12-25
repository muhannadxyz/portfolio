// Wind Turbine Monitoring System Project Data, Template, and Styles

window.WindTurbineProject = {
  // Project Data
  slug: 'wind-turbine',
  name: 'Wind Turbine Monitoring System',
  title: 'Wind Turbine Monitoring System',
  company: 'IoT & Renewable Energy',
  logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#059669"/><circle cx="24" cy="20" r="3" fill="white"/><path d="M24 20L24 10M24 10L20 14M24 10L28 14" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M24 20L32 26M32 26L28 28M32 26L34 22" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M24 20L16 26M16 26L12 22M16 26L20 28" stroke="white" stroke-width="2" stroke-linecap="round"/><rect x="22" y="20" width="4" height="14" fill="white" rx="1"/></svg>',
  thumb: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&h=600&fit=crop',
  tagline: 'Real-time renewable energy data collection',
  description: 'Wind Turbine Monitoring System is an IoT device that tracks the performance of wind turbines in real-time. It measures rotational speed (RPM) using a Hall-effect sensor, monitors electrical output with voltage and current sensors, and calculates power generation. All data is logged with precise timestamps using a real-time clock. The system provides continuous monitoring to help optimize turbine efficiency and detect performance issues.',
  details: 'Built an embedded monitoring solution using Arduino that collects real-time performance data from wind turbines. The Hall-effect sensor detects magnet rotations to calculate RPM, while analog sensors measure voltage and current to compute power output. Data is timestamped using an RTC module and logged via serial communication for analysis. The challenge was creating accurate measurements using interrupt-driven pulse counting while maintaining reliable sensor readings and efficient data logging.',
  brandColor: '#059669',
  link: 'https://github.com/muhannadxyz/Turbine',
  railText: 'WIND TURBINE MONITORING • IOT SYSTEM •',
  links: [
    { label: 'Repo', url: 'https://github.com/muhannadxyz/Turbine' }
  ],
  stack: [
    'Arduino',
    'Embedded C++',
    'Sensors',
    'Interrupts',
    'Data Logging'
  ],
  highlights: [
    'Implemented RPM measurement via Hall-effect sensor + interrupts.',
    'Computed power metrics from voltage/current sensors with timestamps (RTC).',
    'Built a logging pipeline for analysis and optimization.'
  ],
  codeSnippets: [
    {
      title: 'RPM & Power Monitoring Loop',
      language: 'c++',
      code: `void loop() {
    unsigned long currentTime = millis();
    
    // Calculate RPM every second
    if (currentTime - lastTime >= 1000) {
        int rpm = (pulseCount * 60); // Convert pulses to RPM
        pulseCount = 0;              // Reset counter
        lastTime = currentTime;

        // Read voltage and current sensor values
        voltage = analogRead(VOLTAGE_SENSOR) * (5.0 / 1023.0) * 10;
        current = analogRead(CURRENT_SENSOR) * (5.0 / 1023.0) / 0.185;
        power = voltage * current;

        // Get current time
        DateTime now = rtc.now();
        
        // Log data with timestamp
        Serial.print("Timestamp: ");
        Serial.print(now.year()); Serial.print("-");
        Serial.print(now.month()); Serial.print("-");
        Serial.print(now.day());
        Serial.print(" | RPM: "); Serial.print(rpm);
        Serial.print(" | Voltage: "); Serial.print(voltage);
        Serial.print("V | Current: "); Serial.print(current);
        Serial.print("A | Power: "); Serial.print(power);
        Serial.println("W");
    }
}`
    },
    {
      title: 'Interrupt-Driven Hall Sensor',
      language: 'c++',
      code: `// Interrupt service routine for hall sensor
void countPulse() {
    pulseCount++;  
}

void setup() {
    Serial.begin(9600);
    pinMode(HALL_SENSOR_PIN, INPUT);
    
    // Attach interrupt for accurate pulse counting
    attachInterrupt(digitalPinToInterrupt(HALL_SENSOR_PIN), countPulse, RISING);
    
    // Initialize RTC
    if (!rtc.begin()) {
        Serial.println("Couldn't find RTC");
        while (1);
    }
}`
    }
  ],
  
  // Dev Updates
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
  ],

  // HTML Template Path
  htmlTemplatePath: 'html/projects/wind-turbine.html',
  
  // CSS Styles Path
  cssPath: 'css/projects/wind-turbine.css',
  
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
      <div class="min-h-screen relative bg-black project-wind-turbine">
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


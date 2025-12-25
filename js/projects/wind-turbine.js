// Wind Turbine Monitoring System Project Data, Template, and Styles

window.WindTurbineProject = {
  // Project Data
  slug: 'wind-turbine',
  name: 'Wind Turbine Monitoring System',
  title: 'Wind Turbine Monitoring System',
  company: 'IoT & Renewable Energy',
  logo: '<svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="#000" stroke="#fff" stroke-width="1"/><rect x="20" y="30" width="8" height="14" fill="#fff"/><rect x="21" y="20" width="6" height="10" fill="#fff"/><circle cx="24" cy="20" r="2.5" fill="#000" stroke="#fff" stroke-width="1"/><path d="M24 20L24 10M24 20L32 14M24 20L16 14M24 20L32 26M24 20L16 26" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  thumb: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&h=600&fit=crop',
  tagline: 'Real-time renewable energy data collection',
  description: 'Wind Turbine Monitoring System is an IoT device that tracks the performance of wind turbines in real-time using Arduino and multiple sensors. It measures rotational speed (RPM) using a Hall-effect sensor that detects magnet rotations, monitors electrical output with voltage and current sensors, and automatically calculates power generation. All data is logged with precise timestamps using a real-time clock module, and the system outputs data via serial communication for analysis and optimization. The monitoring system uses interrupt-driven pulse counting for accurate RPM measurement, ensuring that every rotation is captured even during high-speed operation. The Hall-effect sensor triggers interrupts on each magnet pass, allowing precise calculation of rotational speed. Voltage and current sensors provide analog readings that are converted to actual values and used to compute power output. The real-time clock ensures all logged data includes accurate timestamps for performance analysis over time. The system provides continuous monitoring to help optimize turbine efficiency, detect performance issues, and track power generation patterns.',
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
      <div class="min-h-screen relative bg-black project-wind-turbine">
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


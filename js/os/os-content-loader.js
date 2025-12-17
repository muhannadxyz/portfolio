// Pre-populate filesystem with portfolio content
const ContentLoader = (function() {
  
  async function loadPortfolioContent() {
    console.log('Loading portfolio content into filesystem...');
    
    try {
      // Wait for filesystem to be ready
      await FileSystem.init();
      
      // Check if content already loaded
      const isEmpty = await FileSystem.isEmpty();
      if (!isEmpty) {
        console.log('Content already loaded');
        return;
      }
      
      // Create Resume.md
      const resumeContent = `# Muhannad Abuzahrieh
## Software Engineer

### About
Committed to shaping the future of tech. First college graduate in my family.
Building privacy-first tools like Lucentir. I enjoy clean design, clear UX, and robust engineering practices.

### Skills
- **Languages**: Python, JavaScript (ES6+), PHP, Bash, PowerShell, SQL, HTML5/CSS3, C, C++
- **Frameworks**: WordPress Core, Gutenberg (React), Blade (Laravel), Tailwind CSS, Vite, PostCSS
- **Tools**: Git, VS Code, Firebase, AWS (basic), VMware, Neovim/Vim, Composer
- **Concepts**: OOP, REST APIs, Agile, Code Review, Testing, Data Validation, Design Patterns

### Experience

#### Nafsi — Software Engineer (Part-time, Remote)
*May 2025 – Present*
- Built full-stack web applications using Laravel (PHP), Blade, Tailwind CSS, and Vite
- Developed and launched a rental property platform and a barbershop booking & management system (1,000+ monthly users combined)
- Implemented booking flows, property listings, and admin dashboards using Laravel Eloquent ORM and MySQL
- Performed ongoing UI updates, performance tweaks, feature additions, and general maintenance
- Communicated with clients to gather requirements, deliver updates, and keep sites reliable and up to date

#### FOMO Social — Software Developer (Internship, Remote)
*June 2024 – August 2024*
- Developed a university events platform using Next.js, React, and AWS
- Launched features that supported 300+ users in the first week and enabled 150+ events
- Drove product design and user discovery, increasing engagement through partnerships with 20+ student organizations and local businesses
- Built intuitive UI components, layouts, and user flows to improve usability and visual consistency

#### Hubhyve - Software Systems Intern
*June 2023 - August 2023*
- Designed and built core platform logic for managing class sessions
- Developed features to track live session states
- Wrote and tested modular functions

### Education
**Cleveland State University**
Bachelor's of Science in Computer Science
2021 – 2025

### Contact
- GitHub: https://github.com/muhannadxyz
- Portfolio: https://muhannadxyz.github.io/portfolio
`;

      await FileSystem.createFile('Resume.md', resumeContent, '/Home/Documents');
      
      // Create About.txt
      const aboutContent = `About Muhannad Abuzahrieh

I'm a software engineer passionate about building innovative solutions.
Currently focused on Software 2.0 and privacy-first applications.

Available for work and open to new opportunities.

Tech Stack:
- Full-stack web development
- AI/ML integration
- IoT & embedded systems
- Security & privacy tools

Let's build something amazing together!
`;

      await FileSystem.createFile('About.txt', aboutContent, '/Home/Documents');
      
      // Create project files
      const lucentirContent = `# Lucentir - Privacy & Threat Intelligence Platform

## Overview
Built a privacy intelligence platform that scores 256 comparison cases across 5 pillars:
- Minimization
- Control
- Security
- Sharing
- Transparency

## Features
- VPN and Ad-Blocker comparisons (10+ providers each)
- Privacy-first toggles (Free/Open Source/No Telemetry)
- Rich filters and sorting
- Side-by-side comparison
- Transparent scoring model with cited sources
- Methodology aligned to IR/SOC reporting

## Tech Stack
- WordPress Core
- Gutenberg (React)
- Custom PHP backend
- Privacy-focused architecture

## Links
- Website: https://lucentir.xyz
- Focus: Privacy intelligence and comparison
`;

      await FileSystem.createFile('Lucentir.md', lucentirContent, '/Home/Projects');
      
      const shadoconnectContent = `# ShadoConnect - Healthcare & Education Platform

## Overview
AI-powered platform connecting high school and college students with healthcare professionals for shadowing, internships, and job opportunities.

## Key Features
- Intelligent matching algorithms
- Real-time scheduling
- Profile management
- Communication tools
- Application tracking
- Automated scheduling

## Impact
Serves both pre-med students seeking clinical exposure and healthcare facilities looking to mentor the next generation of medical professionals.

## Tech Stack
- Modern web framework
- AI-powered matching
- Real-time database
- Responsive design

## Links
- Website: https://shadoconnect.com
`;

      await FileSystem.createFile('ShadoConnect.md', shadoconnectContent, '/Home/Projects');
      
      const rentwiseContent = `# Rentwise - Smart Rental Platform

## Overview
Intelligent rental property management and search platform designed to connect renters with their ideal homes.

## Features
- Advanced property search
- Smart filtering system
- Real-time availability
- Landlord dashboard
- Tenant screening
- Payment integration

## Technology
- Modern full-stack architecture
- Responsive design
- Database optimization
- Secure payment processing

## Goal
Simplifying the rental process for both property owners and tenants through intuitive design and smart features.
`;

      await FileSystem.createFile('Rentwise.md', rentwiseContent, '/Home/Projects');
      
      const wifiAnalyzerContent = `# Public Wi-Fi Risk Analyzer

## Overview
Python-based security application with Tkinter GUI to assess the safety of public Wi-Fi networks.

## Features
- HTTPS support verification
- DNS resolution testing
- Firewall status detection
- VPN activity monitoring
- Real-time connectivity testing
- Automated logging with timestamps

## Security Checks
- SSL/TLS verification
- Network interface analysis
- Cross-platform firewall detection
- Connectivity health checks

## Tech Stack
- Python
- Tkinter GUI
- Network security libraries
- Cross-platform compatibility

## Use Case
Helps users make informed decisions about public Wi-Fi security with detailed logging and reporting.

## GitHub
https://github.com/muhannadxyz/PublicWiFiAnalyzer
`;

      await FileSystem.createFile('WiFi-Analyzer.md', wifiAnalyzerContent, '/Home/Projects');
      
      const turbineContent = `# Wind Turbine Monitoring System

## Overview
Advanced IoT monitoring system for wind turbines using Arduino and real-time sensors.

## Components
- Hall-effect sensors for RPM measurement
- Voltage and current sensors for power analysis
- RTC integration for precise timestamping
- Comprehensive data logging system

## Features
- Real-time performance metrics tracking
- Rotational speed monitoring
- Electrical output measurement
- Power generation analysis

## Technical Implementation
- Interrupt-driven Hall-effect sensing
- Analog sensor integration
- Automatic power computation
- Real-time clock synchronization
- Efficient pulse counting algorithms
- Serial data logging

## Tech Stack
- Arduino C/C++
- Hall-effect sensors
- Voltage/current sensors
- Real-time clock (RTC)

## Purpose
Embedded systems solution for renewable energy monitoring and optimization.

## GitHub
https://github.com/muhannadxyz/Turbine
`;

      await FileSystem.createFile('Wind-Turbine.md', turbineContent, '/Home/Projects');
      
      // Create README
      const readmeContent = `# Welcome to Muhannad's Portfolio OS

## Navigation
This operating system interface showcases my portfolio in an interactive way.

### Available Apps
- **Finder**: Browse files and folders
- **Terminal**: Unix-like command interface
- **TextEdit**: View and edit markdown files
- **Browser**: Explore external links
- **About Me**: System information and bio

### Folders
- **/Home/Documents**: Resume and personal info
- **/Home/Projects**: Detailed project documentation
- **/Home/Pictures**: Project screenshots (coming soon)

### Tips
- Double-click files in Finder to open them
- Use Terminal commands: ls, cd, cat, open
- Drag windows to reposition them
- Click dock icons to launch apps

### Commands
Try these in Terminal:
- \`ls\` - List files
- \`cd Projects\` - Navigate to Projects folder
- \`cat Lucentir.md\` - Read a file
- \`open Resume.md\` - Open file in TextEdit
- \`help\` - Show all commands

Enjoy exploring!
`;

      await FileSystem.createFile('README.md', readmeContent, '/Home');
      
      console.log('Portfolio content loaded successfully');
      
    } catch (error) {
      console.error('Error loading portfolio content:', error);
    }
  }
  
  return {
    load: loadPortfolioContent
  };
})();

window.ContentLoader = ContentLoader;


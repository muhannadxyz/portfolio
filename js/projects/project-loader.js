// Shared helper function for loading project HTML templates and CSS

window.ProjectLoader = {
  // Load CSS dynamically
  loadCSS(cssPath, projectSlug) {
    const linkId = `css-${projectSlug}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = cssPath;
      document.head.appendChild(link);
    }
  },
  
  // Load and process HTML template
  async loadTemplate(htmlPath, data) {
    try {
      const response = await fetch(htmlPath);
      let html = await response.text();
      
      // Replace template variables
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (typeof value === 'string') {
          html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        } else if (Array.isArray(value)) {
          // Handle arrays (like gallery)
          if (key === 'gallery') {
            const galleryHTML = value && value.length > 0 ? `
              <div class="project-gallery">
                <h3 class="text-2xl font-bold text-white mb-6">Project Gallery</h3>
                <div class="gallery-grid">
                  ${value.map(img => `
                    <div class="gallery-item">
                      <img src="${img}" alt="Project screenshot" />
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : '';
            html = html.replace(/\{\{galleryHTML\}\}/g, galleryHTML);
            // Hide showcase if gallery exists
            if (value && value.length > 0) {
              html = html.replace(/id="showcase-container"/g, 'id="showcase-container" style="display: none;"');
            }
          } else if (key === 'codeSnippets') {
            const codeHTML = value && value.length > 0 ? `
              <div class="flip-card-container" onclick="this.querySelector('.flip-card').classList.toggle('flipped')">
                <div class="flip-card">
                  <div class="flip-card-front">
                    <div style="border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); position: relative;">
                      <img src="${data.thumb}" alt="Project showcase" class="w-full" style="display: block;">
                      <div class="flip-hint">Click to see code 💻</div>
                    </div>
                  </div>
                  <div class="flip-card-back">
                    <h3 class="text-2xl font-bold text-white mb-4" style="color: #10b981;">💻 Code Implementation</h3>
                    <div style="max-height: 500px; overflow-y: auto;">
                      ${value.map(snippet => `
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
                <img src="${data.thumb}" alt="Project showcase" class="w-full" style="display: block;">
              </div>
            `;
            html = html.replace(/\{\{codeSnippetsHTML\}\}/g, codeHTML);
          }
        }
      });
      
      return html;
    } catch (error) {
      console.error(`Error loading template from ${htmlPath}:`, error);
      throw error;
    }
  }
};


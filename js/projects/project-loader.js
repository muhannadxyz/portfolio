// Shared helper function for loading project HTML templates and CSS

window.ProjectLoader = {
  // Basic HTML escape for text content
  escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

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

  renderPills(items) {
    if (!items || items.length === 0) return '';
    return `
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${items.map(x => `<span style="font-size: 0.85rem; color: #333; background: #F5F5F5; padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid #E0E0E0;">${this.escapeHtml(x)}</span>`).join('')}
      </div>
    `;
  },

  renderList(items) {
    if (!items || items.length === 0) return '';
    return `
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${items.map(x => `<li style="font-size: 0.95rem; color: #333; line-height: 1.8; margin-bottom: 0.75rem; padding-left: 1.5rem; position: relative;">
          <span style="position: absolute; left: 0; color: #666;">•</span>
          ${this.escapeHtml(x)}
        </li>`).join('')}
      </ul>
    `;
  },

  renderCodeSnippets(codeSnippets) {
    if (!codeSnippets || codeSnippets.length === 0) return '';
    return `
      <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #F0F0F0;">
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #000; margin: 0 0 1.5rem 0;">Code</h2>
        <div>
          ${codeSnippets.map(snippet => `
            <details style="margin-bottom: 1rem; border: 1px solid #E0E0E0; border-radius: 8px; overflow: hidden;">
              <summary style="font-size: 0.95rem; color: #333; padding: 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: #F9F9F9; font-weight: 600;">
                <span>${this.escapeHtml(snippet.title || 'Snippet')}</span>
                <span style="font-size: 0.8rem; color: #666; font-weight: 400;">${this.escapeHtml(snippet.language || '')}</span>
              </summary>
              <pre style="margin: 0; padding: 1rem; background: #1E1E1E; overflow-x: auto; border-top: 1px solid #E0E0E0;"><code style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.85rem; color: #D4D4D4; line-height: 1.6;">${this.escapeHtml(snippet.code || '')}</code></pre>
            </details>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderGallery(gallery) {
    if (!gallery || gallery.length === 0) return '';
    return `
      <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #F0F0F0;">
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #000; margin: 0 0 1.5rem 0;">Gallery</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          ${gallery.map(src => `
            <a href="${this.escapeHtml(src)}" target="_blank" rel="noreferrer" style="border-radius: 8px; overflow: hidden; display: block; border: 1px solid #E0E0E0; transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
              <img src="${this.escapeHtml(src)}" alt="Project image" loading="lazy" style="width: 100%; height: auto; display: block;"/>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderLinks(links, primaryLink) {
    const normalized = Array.isArray(links) ? links.slice() : [];
    const primary = primaryLink ? String(primaryLink) : '';
    if (primary && normalized.length === 0) {
      const isGitHub = /github\.com/i.test(primary);
      normalized.push({ label: isGitHub ? 'GitHub' : 'Visit Site', url: primary });
    }
    if (normalized.length === 0) return '';
    return normalized.map(l => `
      <a href="${this.escapeHtml(l.url)}" target="${/^https?:\/\//i.test(String(l.url)) ? '_blank' : '_self'}" rel="noreferrer" style="font-size: 0.95rem; color: #0066CC; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; margin-right: 1.5rem; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.7';" onmouseout="this.style.opacity='1';">
        <span style="display: inline-block; width: 16px; height: 16px; background: #0066CC; mask-image: url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\'><path d=\\'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\\'/><polyline points=\\'15 3 21 3 21 9\\'/><line x1=\\'10\\' y1=\\'14\\' x2=\\'21\\' y2=\\'3\\'/></svg>'); -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\'><path d=\\'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\\'/><polyline points=\\'15 3 21 3 21 9\\'/><line x1=\\'10\\' y1=\\'14\\' x2=\\'21\\' y2=\\'3\\'/></svg>');"></span>
        ${this.escapeHtml(l.label || l.url)}
      </a>
    `).join('');
  },

  renderUpdatesMono(updates) {
    if (!updates || updates.length === 0) return '';
    return `
      <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #F0F0F0;">
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #000; margin: 0 0 1.5rem 0;">Releases</h2>
        <div>
          ${updates.map(u => {
            const version = this.escapeHtml(u.version || '');
            const date = this.escapeHtml(u.date || '');
            const type = this.escapeHtml(u.type || '');
            const changes = Array.isArray(u.changes) ? u.changes : [];
            return `
              <div style="margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #E5E5E5; last-child: { border-bottom: none; }">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                  <span style="font-size: 1rem; font-weight: 700; color: #000;">${version}</span>
                  ${type ? `<span style="font-size: 0.75rem; color: #666; background: #F5F5F5; padding: 0.25rem 0.75rem; border-radius: 12px;">${type}</span>` : ''}
                  ${date ? `<span style="font-size: 0.85rem; color: #666;">${date}</span>` : ''}
                </div>
                ${changes.length ? this.renderList(changes) : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // Brutal project overlay template (matches index aesthetic)
  renderBrutalProjectTemplate(data) {
    const title = this.escapeHtml(data.title || '');
    const company = this.escapeHtml(data.company || '');
    const tagline = this.escapeHtml(data.tagline || '');
    const description = this.escapeHtml(data.description || '');
    const details = this.escapeHtml(data.details || '');
    const logo = String(data.logo || '');
    let thumb = data.thumb || '';
    
    // Resolve thumb path to absolute URL if needed
    if (thumb) {
      // Debug: log original thumb value
      console.log('[ProjectLoader] Original thumb:', thumb);
      
      // If it's already an absolute URL (http/https), use as-is
      if (thumb.startsWith('http://') || thumb.startsWith('https://')) {
        // Already absolute, use as-is
      }
      // If it starts with '/', it's already absolute from root
      else if (thumb.startsWith('/')) {
        // Already absolute, use as-is
      }
      // Otherwise, make it absolute from root
      else {
        // Remove leading './' if present
        thumb = thumb.startsWith('./') ? thumb.substring(2) : thumb;
        // Ensure it starts with '/'
        thumb = thumb.startsWith('/') ? thumb : '/' + thumb;
      }
      
      console.log('[ProjectLoader] Resolved thumb:', thumb);
    }
    
    const escapedThumb = this.escapeHtml(thumb);
    const railText = this.escapeHtml(data.railText || `${data.title || ''} • ${data.company || ''}`.trim());

    const highlights = this.renderList(data.highlights);
    const stack = this.renderPills(data.stack);
    const links = this.renderLinks(data.links, data.link);
    const gallery = this.renderGallery(data.gallery);
    const code = this.renderCodeSnippets(data.codeSnippets);
    const devUpdates = data.devUpdatesHTML
      ? `
        <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #F0F0F0;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #000; margin: 0 0 1.5rem 0;">Releases</h2>
          <div style="color: #333; line-height: 1.7;">${data.devUpdatesHTML}</div>
        </div>
      `
      : this.renderUpdatesMono(data.updates);

    const media = (!gallery && escapedThumb) ? `
      <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #F0F0F0;">
        <h2 style="font-size: 1.5rem; font-weight: 700; color: #000; margin: 0 0 1.5rem 0;">Screens</h2>
        <div style="border-radius: 8px; overflow: hidden;">
          <img src="${escapedThumb}" alt="${title}" loading="lazy" style="width: 100%; height: auto; display: block;"/>
        </div>
      </div>
    ` : '';

    const railLine = this.escapeHtml(data.railText || `${data.title || ''} • ${data.company || ''}`.trim());
    const railBlock = Array.from({ length: 120 }).map(() => `<span>${railLine}</span>`).join('');
    const railHTML = `<div class="bp-rail-text"><div class="bp-rail-block">${railBlock}</div><div class="bp-rail-block">${railBlock}</div></div>`;

    // Generate unique ID for this instance to avoid conflicts
    const bgContainerId = `bp-bg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const bgImageId = `bp-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return `
      <div class="bp-root modern-card-style" data-project="${this.escapeHtml(data.slug || '')}" style="background: #FFFFFF; min-height: 100vh; position: relative; padding: 4rem 2rem 6rem; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;">
        <button id="close" style="position: fixed; top: 24px; right: 24px; z-index: 9999; background: transparent; color: #333; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 400; cursor: pointer; border: none; transition: opacity 0.2s ease;" onmouseover="this.style.opacity='0.6';" onmouseout="this.style.opacity='1';">✕</button>
        
        <div style="max-width: 800px; margin: 0 auto;">
          <!-- Logo Section -->
          <div style="display: flex; justify-content: center; margin-bottom: 2rem;">
            <div style="width: 120px; height: 120px; display: flex; align-items: center; justify-content: center;">${logo}</div>
          </div>

          <!-- Title Section -->
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <h1 style="font-size: 3rem; font-weight: 700; color: #000; margin: 0 0 0.5rem 0; line-height: 1.2;">${title}</h1>
            <div style="display: flex; justify-content: center; gap: 2rem; font-size: 0.9rem; color: #666; margin-top: 1rem;">
              <div><span style="font-weight: 600; color: #333;">Type</span> <span style="color: #666;">${company}</span></div>
              ${tagline ? `<div><span style="font-weight: 600; color: #333;">Tagline</span> <span style="color: #666;">${tagline}</span></div>` : ''}
            </div>
          </div>

          <!-- Separator -->
          <div style="height: 1px; background: #E5E5E5; margin: 2rem 0;"></div>

          <!-- Description Card -->
          <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #F0F0F0;">
            <p style="font-size: 1rem; color: #333; line-height: 1.7; margin: 0;">${description}</p>
            ${details ? `<p style="font-size: 1rem; color: #333; line-height: 1.7; margin: 1.5rem 0 0 0;">${details}</p>` : ''}
          </div>

          ${links ? `
          <!-- Links Card -->
          <div style="background: #F5F5F5; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            ${links}
          </div>
          ` : ''}

          ${highlights ? `
          <!-- Highlights Card -->
          <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #F0F0F0;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #000; margin: 0 0 1.5rem 0;">Highlights</h2>
            ${highlights}
          </div>
          ` : ''}

          ${stack ? `
          <!-- Tech Stack Card -->
          <div style="background: #FFFFFF; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #F0F0F0;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: #000; margin: 0 0 1.5rem 0;">Tech Stack</h2>
            ${stack}
          </div>
          ` : ''}

          ${media}
          ${gallery}
          ${code}
          ${devUpdates}
        </div>
      </div>
    `;
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


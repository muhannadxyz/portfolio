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
      <div class="bp-pills">
        ${items.map(x => `<span class="bp-pill">${this.escapeHtml(x)}</span>`).join('')}
      </div>
    `;
  },

  renderList(items) {
    if (!items || items.length === 0) return '';
    return `
      <ul class="bp-list">
        ${items.map(x => `<li>${this.escapeHtml(x)}</li>`).join('')}
      </ul>
    `;
  },

  renderCodeSnippets(codeSnippets) {
    if (!codeSnippets || codeSnippets.length === 0) return '';
    return `
      <div class="bp-panel">
        <div class="bp-panel-title">Code</div>
        <div class="bp-code">
          ${codeSnippets.map(snippet => `
            <details class="bp-code-item">
              <summary>
                <span class="bp-code-title">${this.escapeHtml(snippet.title || 'Snippet')}</span>
                <span class="bp-code-lang">${this.escapeHtml(snippet.language || '')}</span>
              </summary>
              <pre><code>${this.escapeHtml(snippet.code || '')}</code></pre>
            </details>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderGallery(gallery) {
    if (!gallery || gallery.length === 0) return '';
    return `
      <div class="bp-panel">
        <div class="bp-panel-title">Gallery</div>
        <div class="bp-gallery">
          ${gallery.map(src => `
            <a class="bp-gallery-item" href="${this.escapeHtml(src)}" target="_blank" rel="noreferrer">
              <img src="${this.escapeHtml(src)}" alt="Project image" loading="lazy"/>
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
      normalized.push({ label: isGitHub ? 'Repo' : 'Open', url: primary });
    }
    if (normalized.length === 0) return '';
    return `
      <div class="bp-links">
        ${normalized.map(l => `
          <a class="bp-link" href="${this.escapeHtml(l.url)}" target="${/^https?:\/\//i.test(String(l.url)) ? '_blank' : '_self'}" rel="noreferrer">
            ${this.escapeHtml(l.label || 'Link')}
          </a>
        `).join('')}
      </div>
    `;
  },

  renderUpdatesMono(updates) {
    if (!updates || updates.length === 0) return '';
    return `
      <div class="bp-panel">
        <div class="bp-panel-title">Dev Updates</div>
        <div class="bp-updates">
          ${updates.map(u => {
            const version = this.escapeHtml(u.version || '');
            const date = this.escapeHtml(u.date || '');
            const type = this.escapeHtml(u.type || '');
            const changes = Array.isArray(u.changes) ? u.changes : [];
            return `
              <div class="bp-update">
                <div class="bp-update-head">
                  <div class="bp-update-version">${version}</div>
                  <div class="bp-update-meta">
                    ${type ? `<span class="bp-update-type">${type}</span>` : ''}
                    ${date ? `<span class="bp-update-date">${date}</span>` : ''}
                  </div>
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
        <div class="bp-panel">
          <div class="bp-panel-title">Dev Updates</div>
          <div class="bp-dev">${data.devUpdatesHTML}</div>
        </div>
      `
      : this.renderUpdatesMono(data.updates);

    const media = (!gallery && escapedThumb) ? `
      <div class="bp-panel">
        <div class="bp-panel-title">Screens</div>
        <div class="bp-media">
          <img src="${escapedThumb}" alt="${title}" loading="lazy"/>
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
      <div class="bp-root ${escapedThumb ? 'bp-has-bg-image' : ''}" data-project="${this.escapeHtml(data.slug || '')}" ${escapedThumb ? 'style="background: transparent !important;"' : ''}>
        ${escapedThumb ? `
        <div id="${bgContainerId}" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; transform-origin: center; pointer-events: none; overflow: hidden; background: transparent;">
          <img 
            id="${bgImageId}" 
            src="${escapedThumb}" 
            alt="${title}" 
            style="width: 100%; height: 100%; object-fit: cover; transform: scale(1.05); filter: brightness(0.7) saturate(1.2); display: block;"
            onload="const img = this; console.log('[ProjectLoader] BG LOADED', '${escapedThumb}', img.naturalWidth, img.naturalHeight); const root = document.querySelector('.bp-has-bg-image'); if (root) root.style.background = 'transparent';"
            onerror="console.error('[ProjectLoader] BG FAILED', '${escapedThumb}'); const container = document.getElementById('${bgContainerId}'); if (container) { container.innerHTML = '<div class=\\'bp-bg\\'></div>'; }">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 50%, rgba(0,0,0,0.5)); pointer-events: none;"></div>
        </div>
        ` : '<div class="bp-bg"></div>'}
        <div class="bp-scanlines"></div>
        <div class="bp-rail" aria-hidden="true">
          ${railHTML}
        </div>

        <button id="close" class="bp-close" aria-label="Close">✕</button>

        <header class="bp-hero">
          <div class="bp-kicker">[ PROJECT ]</div>
          <div class="bp-hero-row">
            <div class="bp-logo" aria-hidden="true">${logo}</div>
            <div>
              <h1 class="bp-title">${title}</h1>
              <div class="bp-company">${company}</div>
            </div>
          </div>
          ${tagline ? `<div class="bp-tagline">${tagline}</div>` : ''}
          ${links}
        </header>

        <main class="bp-main">
          <div class="bp-panel">
            <div class="bp-panel-title">Overview</div>
            <div class="bp-text">${description}</div>
          </div>

          <div class="bp-panel">
            <div class="bp-panel-title">The Challenge</div>
            <div class="bp-text">${details}</div>
          </div>

          ${highlights ? `
            <div class="bp-panel">
              <div class="bp-panel-title">Highlights</div>
              ${highlights}
            </div>
          ` : ''}

          ${stack ? `
            <div class="bp-panel">
              <div class="bp-panel-title">Tech</div>
              ${stack}
            </div>
          ` : ''}

          ${media}
          ${gallery}
          ${code}
          ${devUpdates}
        </main>
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


// Shared helper function for loading project HTML templates and CSS

// Railway theme tokens (dark)
const RW = {
  bg:       '#0C0D0F',
  surface:  '#141517',
  surface2: '#1C1E21',
  border:   '#2A2D32',
  border2:  '#3A3D42',
  text:     '#E8E9EB',
  text2:    '#9BA1AB',
  text3:    '#5C6370',
  accent:   '#6366F1',
  green:    '#23D18B',
};

window.ProjectLoader = {
  escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

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
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${items.map(x => `<span style="font-size:12px;color:${RW.text2};background:${RW.surface2};padding:4px 12px;border-radius:20px;border:1px solid ${RW.border};font-family:'IBM Plex Mono',monospace;">${this.escapeHtml(x)}</span>`).join('')}
      </div>
    `;
  },

  renderList(items) {
    if (!items || items.length === 0) return '';
    return `
      <ul style="list-style:none;padding:0;margin:0;">
        ${items.map(x => `<li style="font-size:14px;color:${RW.text};line-height:1.8;margin-bottom:8px;padding-left:16px;position:relative;">
          <span style="position:absolute;left:0;color:${RW.text2};">•</span>
          ${this.escapeHtml(x)}
        </li>`).join('')}
      </ul>
    `;
  },

  renderCodeSnippets(codeSnippets) {
    if (!codeSnippets || codeSnippets.length === 0) return '';
    return `
      <div style="background:${RW.surface};border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid ${RW.border};">
        <h2 style="font-size:11px;font-weight:600;color:${RW.text3};letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px 0;">Code</h2>
        <div>
          ${codeSnippets.map(snippet => `
            <details style="margin-bottom:10px;border:1px solid ${RW.border};border-radius:6px;overflow:hidden;">
              <summary style="font-size:13px;color:${RW.text};padding:10px 14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:${RW.surface2};font-weight:500;">
                <span>${this.escapeHtml(snippet.title || 'Snippet')}</span>
                <span style="font-size:11px;color:${RW.text3};font-family:'IBM Plex Mono',monospace;">${this.escapeHtml(snippet.language || '')}</span>
              </summary>
              <pre style="margin:0;padding:14px;background:#0C0D0F;overflow-x:auto;border-top:1px solid ${RW.border};"><code style="font-family:'IBM Plex Mono','Courier New',monospace;font-size:12px;color:#D4D4D4;line-height:1.6;">${this.escapeHtml(snippet.code || '')}</code></pre>
            </details>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderGallery(gallery) {
    if (!gallery || gallery.length === 0) return '';
    return `
      <div style="background:${RW.surface};border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid ${RW.border};">
        <h2 style="font-size:11px;font-weight:600;color:${RW.text3};letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px 0;">Gallery</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
          ${gallery.map(src => `
            <a href="${this.escapeHtml(src)}" target="_blank" rel="noreferrer" style="border-radius:6px;overflow:hidden;display:block;border:1px solid ${RW.border};">
              <img src="${this.escapeHtml(src)}" alt="Project image" loading="lazy" style="width:100%;height:auto;display:block;"/>
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
      <a href="${this.escapeHtml(l.url)}" target="${/^https?:\/\//i.test(String(l.url)) ? '_blank' : '_self'}" rel="noreferrer"
        style="font-size:12px;color:${RW.text2};text-decoration:none;display:inline-flex;align-items:center;gap:6px;margin-right:12px;padding:6px 12px;border:1px solid ${RW.border};border-radius:6px;background:${RW.surface2};font-family:'IBM Plex Mono',monospace;transition:border-color 0.15s,color 0.15s;"
        onmouseover="this.style.borderColor='${RW.border2}';this.style.color='${RW.text}';"
        onmouseout="this.style.borderColor='${RW.border}';this.style.color='${RW.text2}';">
        ${this.escapeHtml(l.label || l.url)} ↗
      </a>
    `).join('');
  },

  renderUpdatesMono(updates) {
    if (!updates || updates.length === 0) return '';
    return `
      <div style="background:${RW.surface};border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid ${RW.border};">
        <h2 style="font-size:11px;font-weight:600;color:${RW.text3};letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px 0;">Releases</h2>
        <div>
          ${updates.map(u => {
            const version = this.escapeHtml(u.version || '');
            const date = this.escapeHtml(u.date || '');
            const type = this.escapeHtml(u.type || '');
            const changes = Array.isArray(u.changes) ? u.changes : [];
            return `
              <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid ${RW.border};">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
                  <span style="font-size:13px;font-weight:600;color:${RW.text};font-family:'IBM Plex Mono',monospace;">${version}</span>
                  ${type ? `<span style="font-size:11px;color:${RW.text3};background:${RW.surface2};padding:2px 8px;border-radius:10px;border:1px solid ${RW.border};">${type}</span>` : ''}
                  ${date ? `<span style="font-size:11px;color:${RW.text3};font-family:'IBM Plex Mono',monospace;">${date}</span>` : ''}
                </div>
                ${changes.length ? this.renderList(changes) : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderBrutalProjectTemplate(data) {
    const title = this.escapeHtml(data.title || '');
    const company = this.escapeHtml(data.company || '');
    const tagline = this.escapeHtml(data.tagline || '');
    const description = this.escapeHtml(data.description || '');
    const details = this.escapeHtml(data.details || '');
    const logo = String(data.logo || '');
    let thumb = data.thumb || '';

    if (thumb) {
      if (thumb.startsWith('http://') || thumb.startsWith('https://')) {
        // already absolute
      } else if (thumb.startsWith('/')) {
        // already absolute
      } else {
        thumb = thumb.startsWith('./') ? thumb.substring(2) : thumb;
        thumb = thumb.startsWith('/') ? thumb : '/' + thumb;
      }
    }

    const escapedThumb = this.escapeHtml(thumb);

    const highlights = this.renderList(data.highlights);
    const stack = this.renderPills(data.stack);
    const links = this.renderLinks(data.links, data.link);
    const gallery = this.renderGallery(data.gallery);
    const code = this.renderCodeSnippets(data.codeSnippets);
    const devUpdates = data.devUpdatesHTML
      ? `
        <div style="background:${RW.surface};border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid ${RW.border};">
          <h2 style="font-size:11px;font-weight:600;color:${RW.text3};letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px 0;">Releases</h2>
          <div style="color:${RW.text2};line-height:1.7;font-size:13px;">${data.devUpdatesHTML}</div>
        </div>
      `
      : this.renderUpdatesMono(data.updates);

    const media = (!gallery && escapedThumb) ? `
      <div style="background:${RW.surface};border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid ${RW.border};">
        <h2 style="font-size:11px;font-weight:600;color:${RW.text3};letter-spacing:0.08em;text-transform:uppercase;margin:0 0 12px 0;">Screens</h2>
        <div style="border-radius:6px;overflow:hidden;border:1px solid ${RW.border};">
          <img src="${escapedThumb}" alt="${title}" loading="lazy" style="width:100%;height:auto;display:block;"/>
        </div>
      </div>
    ` : '';

    return `
      <div data-project="${this.escapeHtml(data.slug || '')}"
        style="background:${RW.bg};min-height:100%;padding:48px 24px 64px;font-family:'Inter',system-ui,sans-serif;color:${RW.text};">

        <div style="max-width:760px;margin:0 auto;">

          <!-- Header -->
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
            ${logo ? `<div style="width:44px;height:44px;border-radius:8px;overflow:hidden;border:1px solid ${RW.border};flex-shrink:0;">${logo}</div>` : ''}
            <div>
              <h1 style="font-size:22px;font-weight:700;color:${RW.text};margin:0 0 2px 0;line-height:1.2;">${title}</h1>
              ${tagline ? `<div style="font-size:13px;color:${RW.text3};font-family:'IBM Plex Mono',monospace;">${tagline}</div>` : ''}
            </div>
          </div>

          <!-- Divider -->
          <div style="height:1px;background:${RW.border};margin-bottom:24px;"></div>

          <!-- Meta row -->
          ${company ? `
          <div style="display:flex;gap:32px;margin-bottom:24px;">
            <div>
              <div style="font-size:10px;font-weight:600;color:${RW.text3};letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;">Type</div>
              <div style="font-size:13px;color:${RW.text2};">${company}</div>
            </div>
          </div>
          ` : ''}

          <!-- Stack pills -->
          ${stack ? `
          <div style="margin-bottom:24px;">
            ${stack}
          </div>
          ` : ''}

          <!-- Divider -->
          <div style="height:1px;background:${RW.border};margin-bottom:24px;"></div>

          <!-- Description -->
          <div style="margin-bottom:16px;">
            <h2 style="font-size:11px;font-weight:600;color:${RW.text3};letter-spacing:0.08em;text-transform:uppercase;margin:0 0 10px 0;">Project Overview</h2>
            <div style="background:${RW.surface};border-radius:8px;padding:16px;border:1px solid ${RW.border};">
              <p style="font-size:14px;color:${RW.text2};line-height:1.7;margin:0;">${description}</p>
              ${details ? `<p style="font-size:14px;color:${RW.text2};line-height:1.7;margin:12px 0 0 0;">${details}</p>` : ''}
            </div>
          </div>

          <!-- Links -->
          ${links ? `<div style="margin-bottom:24px;">${links}</div>` : ''}

          <!-- Highlights -->
          ${highlights ? `
          <div style="background:${RW.surface};border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid ${RW.border};">
            <h2 style="font-size:11px;font-weight:600;color:${RW.text3};letter-spacing:0.08em;text-transform:uppercase;margin:0 0 14px 0;">Highlights</h2>
            ${highlights}
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

  async loadTemplate(htmlPath, data) {
    try {
      const response = await fetch(htmlPath);
      let html = await response.text();
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (typeof value === 'string') {
          html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        } else if (Array.isArray(value)) {
          if (key === 'gallery') {
            const galleryHTML = value && value.length > 0 ? `
              <div class="project-gallery">
                <h3 class="text-2xl font-bold text-white mb-6">Project Gallery</h3>
                <div class="gallery-grid">
                  ${value.map(img => `<div class="gallery-item"><img src="${img}" alt="Project screenshot" /></div>`).join('')}
                </div>
              </div>
            ` : '';
            html = html.replace(/\{\{galleryHTML\}\}/g, galleryHTML);
            if (value && value.length > 0) {
              html = html.replace(/id="showcase-container"/g, 'id="showcase-container" style="display: none;"');
            }
          } else if (key === 'codeSnippets') {
            const codeHTML = value && value.length > 0 ? `
              <div class="project-showcase">
                ${value.map(snippet => `<div style="margin-bottom:24px;"><pre style="background:#0C0D0F;padding:16px;border-radius:8px;overflow-x:auto;"><code style="font-family:'IBM Plex Mono',monospace;font-size:13px;color:#D4D4D4;">${snippet.code}</code></pre></div>`).join('')}
              </div>
            ` : `<div class="project-showcase"><img src="${data.thumb}" alt="Project showcase" style="width:100%;display:block;"></div>`;
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

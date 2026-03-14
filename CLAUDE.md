# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio website featuring an interactive macOS-inspired operating system interface. The site has two main modes:
1. **Standard Portfolio View** (index.html) - Traditional portfolio with brutalist design aesthetic
2. **Portfolio OS Mode** (os.html) - Full-featured desktop OS simulation with windows, apps, and filesystem

## Architecture

### Dual-Mode System

The portfolio operates in two distinct modes that can transition between each other:

- **index.html**: Main landing page with neural network background animation, project cards, and brutalist design
- **os.html**: Standalone OS interface that can also be embedded as an overlay within index.html

The OS can be launched from index.html and returns to the portfolio view when exited.

### OS Architecture (Portfolio OS)

The OS is built as a modular system with clear separation of concerns:

**Core Systems** (load order matters - see os.html:247-273):
1. `os-state.js` - Global state management (OSState singleton)
2. `os-sound.js` - Audio/sound effects system
3. `os-filesystem.js` - Virtual filesystem using IndexedDB
4. `os-content-loader.js` - Pre-populates filesystem with portfolio content
5. `os-window.js` - Window management (WindowManager singleton)
6. `os-core.js` - Main initialization and app launcher

**Infrastructure Modules**:
- `os-contextmenu.js` - Right-click context menus
- `os-dragdrop.js` - Drag-and-drop functionality
- `os-tabs.js` - Tab management for apps
- `os-dock.js` - Dock setup and interactions
- `os-menubar.js` - Top menu bar with clock

**Applications** (js/os/os-*.js):
- finder, terminal, textedit, browser, about, settings, music, calculator, weather, notes, pet, chip8, search, launcher

Each app follows the pattern: `AppName.open()` creates a window via `WindowManager.createWindow()` and registers with `OSState`.

### State Management

`OSState` (os-state.js) is the single source of truth:
- Manages all open windows (Map of windowId -> window object)
- Tracks running apps (Set of app names)
- Manages z-index for window stacking
- Stores user preferences (theme, wallpaper, sound settings)
- Persists preferences to localStorage

`WindowManager` (os-window.js) handles:
- Window lifecycle (create, close, minimize, maximize)
- Window dragging and resizing
- Window snapping to edges
- Event listener cleanup to prevent memory leaks

### Virtual Filesystem

`FileSystem` (os-filesystem.js) provides a complete virtual filesystem:
- Uses IndexedDB for persistent storage
- File hierarchy: `/Home/Documents`, `/Home/Projects`, `/Home/Pictures`
- Pre-populated with resume, project descriptions (markdown format)
- Supports: create, read, update, delete, move, copy, rename, search
- Files are `FileNode` objects with metadata (created, modified, size, type)

`ContentLoader` (os-content-loader.js) initializes the filesystem on first launch with portfolio content.

### Project Pages

Project detail pages use a template system (js/projects/):

**Template Rendering**:
- `ProjectLoader.renderBrutalProjectTemplate(data)` generates clean, card-based project pages
- Each project has dedicated JS file (e.g., `lucentir.js`, `shadoconnect.js`) that defines project data
- CSS files in `css/projects/` for project-specific styles
- Project data structure includes: title, company, tagline, description, highlights, stack, gallery, codeSnippets, updates

Projects are displayed in overlay windows with close button and scroll behavior.

### Event System & Cleanup

Critical pattern to prevent memory leaks:

```javascript
// Window objects store cleanup functions
windowObj.cleanup = eventCleanup; // Function that removes all listeners
windowObj.intervals = []; // Array of setInterval IDs
windowObj.timeouts = []; // Array of setTimeout IDs

// On window close, all resources are cleaned up (os-window.js:326-378)
```

## Development Commands

This is a static site with no build system. Open files directly in browser:

**Testing locally**:
```bash
# Serve with Python
python3 -m http.server 8000

# Or with Node.js
npx http-server -p 8000

# Then visit http://localhost:8000
```

**Files to open**:
- `index.html` - Main portfolio
- `os.html` - Standalone OS mode
- `dev.html` - Development/testing page

## File Structure

```
/
├── index.html              # Main portfolio page
├── os.html                 # Standalone OS interface
├── dev.html                # Development page
├── contact.html            # Contact page
├── css/
│   ├── styles.css          # Main stylesheet (includes OS styles)
│   ├── dev.css             # Dev page styles
│   ├── project-page.css    # Project overlay styles
│   └── projects/           # Per-project CSS
├── js/
│   ├── script.js           # Main portfolio logic (NeuralNetwork class)
│   ├── project-updates.js  # Project update data
│   ├── os/                 # OS system modules
│   │   ├── os-core.js      # Main OS initialization
│   │   ├── os-state.js     # Global state management
│   │   ├── os-window.js    # Window manager
│   │   ├── os-filesystem.js # Virtual filesystem (IndexedDB)
│   │   └── os-*.js         # Individual app implementations
│   └── projects/
│       ├── project-loader.js # Template rendering system
│       └── *.js            # Individual project data files
├── html/projects/          # Project HTML templates (legacy)
└── images/                 # Project images and screenshots
```

## Key Patterns & Conventions

### Adding a New OS App

1. Create `js/os/os-yourapp.js`:
```javascript
const YourApp = (function() {
  function open() {
    const content = `<div class="yourapp-content">...</div>`;
    const win = WindowManager.createWindow('yourapp', 'Your App', content, {
      width: 800,
      height: 600
    });
    // Setup app logic here
  }

  return { open };
})();

window.YourApp = YourApp;
```

2. Add to os.html dock section (around line 60-240)
3. Add case to `openApp()` in os-core.js (around line 202-246)
4. Add script tag to os.html (around line 246-273)

### Adding a New Project

1. Create project data file in `js/projects/your-project.js`:
```javascript
(function() {
  const data = {
    slug: 'your-project',
    title: 'Your Project',
    company: 'Company Name',
    tagline: 'Short description',
    description: 'Longer description...',
    highlights: ['Feature 1', 'Feature 2'],
    stack: ['Tech 1', 'Tech 2'],
    gallery: ['images/project1.png', 'images/project2.png'],
    link: 'https://example.com',
    thumb: 'images/your-project.png'
  };

  const openProject = () => {
    ProjectLoader.loadCSS('css/projects/your-project.css', data.slug);
    const html = ProjectLoader.renderBrutalProjectTemplate(data);
    // Display overlay logic
  };

  window.YourProjectPage = { open: openProject };
})();
```

2. Add to index.html project grid
3. Create optional CSS file in `css/projects/`

### Performance Considerations

**Neural Network Animation** (script.js):
- Runs at 30fps (throttled from 60fps)
- Pauses when page is hidden (Page Visibility API)
- Limited to 20 nodes max and 15 connections
- Updates node positions every 2 frames
- Uses global `window.neuralNet` - can be paused/resumed

**OS Performance**:
- OS pauses neural network when launched (os-core.js:96-98)
- Sound effects are throttled to prevent overlapping plays
- Windows use requestAnimationFrame for smooth animations
- IndexedDB operations are async to prevent blocking

### Sound System

`SoundManager` (os-sound.js) provides:
- Web Audio API for sound effects
- Throttled playback to prevent audio spam
- Sounds: os_launch, os_exit, dock_click, window_open, window_close, window_minimize, window_maximize
- Volume control via OSState preferences

### Keyboard Shortcuts (OS Mode)

Implemented in os-core.js:259-386:
- `Esc` - Exit OS
- `Cmd/Ctrl + W` - Close active window
- `Cmd/Ctrl + M` - Minimize active window
- `Cmd/Ctrl + N` - New folder (Finder only)
- `Cmd/Ctrl + F` - Open search
- `Cmd/Ctrl + Space` - Open launcher
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo
- `Cmd/Ctrl + Arrow` - Snap window to left/right half

## Important Notes

- **No package.json**: This is vanilla HTML/CSS/JS - no build tools or package manager
- **Script load order matters**: See os.html lines 247-273 for correct dependency order
- **IndexedDB**: Filesystem persists between sessions. Clear browser storage to reset
- **Event listeners**: Always clean up listeners when closing windows to prevent memory leaks
- **Sound**: Uses Web Audio API which requires user gesture to unlock (handled in os-core.js)
- **Image paths**: Project images should be absolute from root (e.g., `/images/project.png` not `./images/project.png`)

## Testing & Debugging

Access global objects in browser console:
```javascript
OSState.getState()           // View current OS state
WindowManager                // Window manager API
FileSystem.getAllFiles()     // View filesystem contents
neuralNet.pause()           // Pause neural network animation
neuralNet.resume()          // Resume neural network animation
```

## Browser Compatibility

Requires modern browser with support for:
- ES6+ (arrow functions, template literals, async/await)
- IndexedDB
- Web Audio API
- CSS Grid and Flexbox
- requestAnimationFrame

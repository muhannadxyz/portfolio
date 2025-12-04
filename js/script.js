// Terminal intro removed - content loads immediately
// Keeping code commented for reference

// const terminalText = [
//   "booting portfolioOS...",
//   "loading personality modules...",
//   "establishing neural link...",
//   "initializing interface...",
//   "launching Muhannad Abuzahrieh portfolio..."
// ];

// function typeLine(text, i = 0) {
//   ...
// }

// function showXboxLoading() {
//   ...
// }

// function skipIntro() {
//   ...
// }

// Mouse tracking glow
document.addEventListener('mousemove', e => {
  document.body.style.setProperty('--x', `${e.clientX}px`);
  document.body.style.setProperty('--y', `${e.clientY}px`);
});

// job Description Toggle
function toggleDescription(header) {
  const desc = header.parentElement.querySelector('.job-desc');
  desc.classList.toggle('hidden');
  const arrow = header.querySelector('.arrow');
  arrow.classList.toggle('open');
}

// Theme
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

// Past Work toggle
function togglePastWork() {
  const panel = document.getElementById('past-panel');
  panel.classList.toggle('hidden');
}

// Init 
window.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute('data-theme', 'dark');
});



// ========== NEURAL NETWORK VISUALIZATION ==========
class NeuralNetwork {
  constructor() {
    this.canvas = document.getElementById('neural-network');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.isAnimating = true;
    this.animationId = null;
    this.frameCount = 0;
    this.lastFrameTime = 0;
    this.targetFPS = 30; // Reduced from 60fps
    this.frameInterval = 1000 / this.targetFPS;
    this.isPageVisible = true;
    this.init();
  }

  init() {
    this.resize();
    
    // Debounce resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resize(), 250);
    });
    
    // Page Visibility API - pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
      if (!this.isPageVisible) {
        this.pause();
      } else if (this.isAnimating) {
        this.resume();
      }
    });
    
    // Check if neural network is disabled in settings
    const neuralNetEnabled = localStorage.getItem('neural_network_enabled') !== 'false';
    if (!neuralNetEnabled) {
      this.isAnimating = false;
      return;
    }
    
    // Create network nodes at element positions
    this.createNetwork();
    this.animate();
  }
  
  pause() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  resume() {
    if (!this.isAnimating && this.isPageVisible) {
      this.isAnimating = true;
      this.lastFrameTime = performance.now();
      this.animate();
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createNetwork() {
    // Find interactive elements to connect (limit to fewer elements for performance)
    const elements = document.querySelectorAll('.panel, .window, .hero-title');
    const maxNodes = 20; // Limit nodes for performance
    const limitedElements = Array.from(elements).slice(0, maxNodes);
    
    limitedElements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      this.nodes.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        element: el,
        active: false
      });

      // Create fewer connections for better performance
      if (i > 0 && Math.random() > 0.85 && this.connections.length < 15) {
        const targetIndex = Math.floor(Math.random() * i);
        this.connections.push({
          from: i,
          to: targetIndex,
          strength: Math.random()
        });
      }
    });

    // Track element visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const node = this.nodes.find(n => n.element === entry.target);
        if (node) node.active = entry.isIntersecting;
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  }

  animate() {
    if (!this.isAnimating || !this.isPageVisible) return;
    
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastFrameTime;
    
    // Throttle to target FPS (30fps)
    if (elapsed < this.frameInterval) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }
    
    this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.frameCount++;
    
    // Update node positions less frequently (every 2 frames at 30fps = ~15fps updates)
    if (this.frameCount % 2 === 0) {
    this.nodes.forEach((node, i) => {
      if (node.element) {
          // Cache rect to avoid multiple calls
        const rect = node.element.getBoundingClientRect();
        node.x = rect.left + rect.width / 2;
        node.y = rect.top + rect.height / 2;
      }
    });
    }

    // Draw connections (only active ones) - batch operations
    this.ctx.beginPath();
    this.connections.forEach(conn => {
      const from = this.nodes[conn.from];
      const to = this.nodes[conn.to];
      if (!from || !to || (!from.active && !to.active)) return;

      const opacity = (from.active || to.active) ? 0.3 : 0.05;
      
      this.ctx.moveTo(from.x, from.y);
      this.ctx.lineTo(to.x, to.y);
      this.ctx.strokeStyle = `rgba(42, 130, 255, ${opacity * conn.strength})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });

    // Draw nodes (only active ones) - batch operations
    this.ctx.beginPath();
    this.nodes.forEach(node => {
      if (!node.active) return;
      this.ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
    });
    this.ctx.fillStyle = `rgba(0, 255, 225, 0.5)`;
      this.ctx.fill();

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

// Initialize when main content is visible
let neuralNet;
setTimeout(() => {
  neuralNet = new NeuralNetwork();
  // Make it globally accessible
  window.neuralNet = neuralNet;
}, 500);

// Hamburger Menu Toggle
function toggleMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('dropdown-nav');
  
  if (hamburger && nav) {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
  }
}

// Make Dock Draggable
(function initDraggableDock() {
  const dock = document.querySelector('.dock');
  if (!dock) return;

  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  // Load saved position from localStorage
  const savedPos = localStorage.getItem('dockPosition');
  if (savedPos) {
    const { x, y } = JSON.parse(savedPos);
    dock.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    xOffset = x;
    yOffset = y;
  }

  dock.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  // Touch support for mobile
  dock.addEventListener('touchstart', dragStart);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', dragEnd);

  function dragStart(e) {
    // Don't drag if clicking on a button
    if (e.target.tagName === 'BUTTON') return;
    
    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    isDragging = true;
    dock.classList.add('dragging');
  }

  function drag(e) {
    if (!isDragging) return;

    e.preventDefault();

    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, dock);
  }

  function dragEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    dock.classList.remove('dragging');

    // Save position to localStorage
    localStorage.setItem('dockPosition', JSON.stringify({
      x: xOffset,
      y: yOffset
    }));
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
})();


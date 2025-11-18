// Optical Illusions - Infinity Scroll Implementation

// State management
let currentIndex = 0;
let isLoading = false;
let illusionsPerBatch = 3;
const maxCards = 30; // Maximum cards to keep in DOM for performance

// Illusion templates
const illusions = [
  {
    title: 'Rotating Spiral',
    description: 'Stare at the center while the spiral rotates. Look away to see the after-effect.',
    render: createSpiral
  },
  {
    title: 'Moiré Pattern',
    description: 'Watch as overlapping grids create mesmerizing wave-like patterns.',
    render: createMoire
  },
  {
    title: 'Wave Interference',
    description: 'Concentric circles create hypnotic interference patterns.',
    render: createWaves
  },
  {
    title: 'Psychedelic Checkerboard',
    description: 'A pulsating checkerboard that seems to warp and twist.',
    render: createCheckerboard
  },
  {
    title: 'Spinning Circles',
    description: 'Multiple circles spinning at different speeds create optical chaos.',
    render: createSpinningCircles
  },
  {
    title: 'Color Gradient Depth',
    description: 'Gradients that create an illusion of three-dimensional depth.',
    render: createGradientDepth
  },
  {
    title: '3D Rotating Cube',
    description: 'A wireframe cube rotating in three-dimensional space.',
    render: create3DCube
  },
  {
    title: 'Infinite Tunnel',
    description: 'Zoom into an endless tunnel of expanding shapes.',
    render: createInfiniteTunnel
  },
  {
    title: 'Oscillating Bars',
    description: 'Vertical bars that create a wave-like motion illusion.',
    render: createOscillatingBars
  },
  {
    title: 'Fractal Spiral',
    description: 'A self-similar pattern that draws you into its infinite depths.',
    render: createFractalSpiral
  }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadInitialBatch();
  setupScrollListener();
  setupScrollProgress();
  setupScrollToTop();
});

// Load initial batch of illusions
function loadInitialBatch() {
  // Load multiple batches initially to ensure enough content
  loadMoreIllusions();
  setTimeout(() => loadMoreIllusions(), 900);
}

// Setup infinite scroll listener
function setupScrollListener() {
  let scrollTimeout;
  
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 800; // Trigger earlier
      
      if (scrollPosition >= threshold && !isLoading) {
        loadMoreIllusions();
      }
    }, 100);
  });
  
  // Also check on resize in case content height changes
  window.addEventListener('resize', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 800;
    
    if (scrollPosition >= threshold && !isLoading) {
      loadMoreIllusions();
    }
  });
}

// Load more illusions
function loadMoreIllusions() {
  if (isLoading) return;
  
  isLoading = true;
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.classList.add('visible');
  
  setTimeout(() => {
    const container = document.getElementById('illusions-container');
    
    for (let i = 0; i < illusionsPerBatch; i++) {
      const illusionIndex = currentIndex % illusions.length;
      const illusion = illusions[illusionIndex];
      
      const card = createIllusionCard(illusion, currentIndex);
      container.appendChild(card);
      
      // Trigger animation
      setTimeout(() => {
        card.style.animationDelay = `${i * 0.1}s`;
      }, 50);
      
      currentIndex++;
    }
    
    // Performance optimization: remove cards that are too far up
    cleanupOldCards();
    
    isLoading = false;
    loadingIndicator.classList.remove('visible');
  }, 800);
}

// Create illusion card
function createIllusionCard(illusion, index) {
  const card = document.createElement('div');
  card.className = 'illusion-card';
  card.dataset.index = index;
  
  const header = document.createElement('div');
  header.className = 'illusion-card-header';
  
  const title = document.createElement('h2');
  title.className = 'illusion-card-title';
  // Add counter to show iteration number
  const iteration = Math.floor(index / illusions.length) + 1;
  title.textContent = `${illusion.title} ${iteration > 1 ? '#' + iteration : ''}`;
  
  const description = document.createElement('p');
  description.className = 'illusion-card-description';
  description.textContent = illusion.description;
  
  header.appendChild(title);
  header.appendChild(description);
  
  const canvas = document.createElement('div');
  canvas.className = 'illusion-canvas';
  
  // Render the specific illusion
  illusion.render(canvas);
  
  card.appendChild(header);
  card.appendChild(canvas);
  
  return card;
}

// Cleanup old cards for performance
function cleanupOldCards() {
  const container = document.getElementById('illusions-container');
  const cards = container.querySelectorAll('.illusion-card');
  
  if (cards.length > maxCards) {
    const cardsToRemove = cards.length - maxCards;
    for (let i = 0; i < cardsToRemove; i++) {
      // Only remove cards that are above the viewport
      const cardRect = cards[i].getBoundingClientRect();
      if (cardRect.bottom < -200) { // Card is well above viewport
        cards[i].remove();
      }
    }
  }
  
  // Force a scroll check after cleanup in case we need more content
  setTimeout(() => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 800;
    
    if (scrollPosition >= threshold && !isLoading) {
      loadMoreIllusions();
    }
  }, 100);
}

// Setup scroll progress bar
function setupScrollProgress() {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    const progressBar = document.getElementById('scroll-progress');
    progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
  });
}

// Setup scroll to top button
function setupScrollToTop() {
  const button = document.getElementById('scroll-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============ ILLUSION RENDERERS ============

// 1. Rotating Spiral
function createSpiral(container) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 400 400');
  svg.classList.add('spiral');
  
  const centerX = 200;
  const centerY = 200;
  const rotations = 8;
  const segmentsPerRotation = 30;
  
  for (let i = 0; i < rotations * segmentsPerRotation; i++) {
    const angle = (i / segmentsPerRotation) * Math.PI * 2;
    const radius = (i / (rotations * segmentsPerRotation)) * 150;
    
    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;
    
    const nextAngle = ((i + 1) / segmentsPerRotation) * Math.PI * 2;
    const nextRadius = ((i + 1) / (rotations * segmentsPerRotation)) * 150;
    
    const x2 = centerX + Math.cos(nextAngle) * nextRadius;
    const y2 = centerY + Math.sin(nextAngle) * nextRadius;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', i % 2 === 0 ? '#00ffe1' : '#2a82ff');
    line.setAttribute('stroke-width', '3');
    
    svg.appendChild(line);
  }
  
  const spiralContainer = document.createElement('div');
  spiralContainer.className = 'spiral-container';
  spiralContainer.appendChild(svg);
  
  container.appendChild(spiralContainer);
}

// 2. Moiré Pattern
function createMoire(container) {
  const moireContainer = document.createElement('div');
  moireContainer.className = 'moire-container';
  
  for (let layer = 0; layer < 2; layer++) {
    const canvas = document.createElement('canvas');
    canvas.className = 'moire-layer';
    canvas.width = 800;
    canvas.height = 800;
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = layer === 0 ? 'rgba(0, 255, 225, 0.3)' : 'rgba(42, 130, 255, 0.3)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(400, 400, i * 20, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    moireContainer.appendChild(canvas);
  }
  
  container.appendChild(moireContainer);
}

// 3. Wave Interference
function createWaves(container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth || 400;
  canvas.height = 350;
  
  const ctx = canvas.getContext('2d');
  
  function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const time = Date.now() * 0.001;
    
    for (let x = 0; x < canvas.width; x += 2) {
      for (let y = 0; y < canvas.height; y += 2) {
        const dx1 = x - canvas.width / 3;
        const dy1 = y - canvas.height / 2;
        const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        
        const dx2 = x - (canvas.width * 2) / 3;
        const dy2 = y - canvas.height / 2;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        
        const wave1 = Math.sin(dist1 * 0.05 - time * 2);
        const wave2 = Math.sin(dist2 * 0.05 + time * 2);
        const combined = (wave1 + wave2) / 2;
        
        const hue = (combined + 1) * 180;
        const lightness = (combined + 1) * 50;
        
        ctx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  container.appendChild(canvas);
}

// 4. Psychedelic Checkerboard
function createCheckerboard(container) {
  const checkerboard = document.createElement('div');
  checkerboard.className = 'checkerboard-container';
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.className = 'checkerboard-square';
      
      const isEven = (row + col) % 2 === 0;
      const hue = ((row * 8 + col) * 45) % 360;
      
      square.style.background = isEven 
        ? `hsl(${hue}, 100%, 50%)`
        : `hsl(${(hue + 180) % 360}, 100%, 30%)`;
      
      checkerboard.appendChild(square);
    }
  }
  
  container.appendChild(checkerboard);
}

// 5. Spinning Circles
function createSpinningCircles(container) {
  const circlesContainer = document.createElement('div');
  circlesContainer.className = 'circles-container';
  
  const numCircles = 8;
  
  for (let i = 0; i < numCircles; i++) {
    const circle = document.createElement('div');
    circle.className = 'circle';
    
    const size = 50 + i * 30;
    const speed = 2 + i * 0.5;
    const direction = i % 2 === 0 ? 'normal' : 'reverse';
    const hue = (i * 45) % 360;
    
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.borderColor = `hsl(${hue}, 100%, 50%)`;
    circle.style.animation = `rotate ${speed}s linear infinite ${direction}`;
    
    circlesContainer.appendChild(circle);
  }
  
  container.appendChild(circlesContainer);
}

// 6. Color Gradient Depth
function createGradientDepth(container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth || 400;
  canvas.height = 350;
  
  const ctx = canvas.getContext('2d');
  
  function animate() {
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < 20; i++) {
      const offset = Math.sin(time + i * 0.3) * 20;
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + offset,
        canvas.height / 2 + offset,
        i * 15,
        canvas.width / 2,
        canvas.height / 2,
        (i + 1) * 15
      );
      
      const hue1 = (time * 50 + i * 20) % 360;
      const hue2 = (time * 50 + i * 20 + 60) % 360;
      
      gradient.addColorStop(0, `hsla(${hue1}, 100%, 50%, 0.8)`);
      gradient.addColorStop(1, `hsla(${hue2}, 100%, 30%, 0.4)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  container.appendChild(canvas);
}

// 7. 3D Rotating Cube
function create3DCube(container) {
  const cubeContainer = document.createElement('div');
  cubeContainer.className = 'cube-container';
  
  const cube = document.createElement('div');
  cube.className = 'cube';
  
  const faces = [
    { transform: 'rotateY(0deg) translateZ(100px)' },
    { transform: 'rotateY(90deg) translateZ(100px)' },
    { transform: 'rotateY(180deg) translateZ(100px)' },
    { transform: 'rotateY(-90deg) translateZ(100px)' },
    { transform: 'rotateX(90deg) translateZ(100px)' },
    { transform: 'rotateX(-90deg) translateZ(100px)' }
  ];
  
  faces.forEach((face, index) => {
    const faceDiv = document.createElement('div');
    faceDiv.className = 'cube-face';
    faceDiv.style.transform = face.transform;
    faceDiv.style.background = `hsla(${index * 60}, 100%, 50%, 0.2)`;
    cube.appendChild(faceDiv);
  });
  
  cubeContainer.appendChild(cube);
  container.appendChild(cubeContainer);
}

// 8. Infinite Tunnel
function createInfiniteTunnel(container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth || 400;
  canvas.height = 350;
  
  const ctx = canvas.getContext('2d');
  
  function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const time = Date.now() * 0.001;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 50; i++) {
      const scale = 1 - (i / 50);
      const offset = (time * 50 + i * 10) % 300;
      const size = (300 - offset) * scale;
      
      if (size > 0) {
        const hue = (time * 100 + i * 10) % 360;
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.rect(
          centerX - size / 2,
          centerY - size / 2,
          size,
          size
        );
        ctx.stroke();
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  container.appendChild(canvas);
}

// 9. Oscillating Bars
function createOscillatingBars(container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth || 400;
  canvas.height = 350;
  
  const ctx = canvas.getContext('2d');
  const numBars = 40;
  
  function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const time = Date.now() * 0.001;
    const barWidth = canvas.width / numBars;
    
    for (let i = 0; i < numBars; i++) {
      const phase = (i / numBars) * Math.PI * 2;
      const height = Math.sin(time * 2 + phase) * (canvas.height / 2) + (canvas.height / 2);
      const hue = (i * (360 / numBars) + time * 50) % 360;
      
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 1, height);
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  container.appendChild(canvas);
}

// 10. Fractal Spiral
function createFractalSpiral(container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth || 400;
  canvas.height = 350;
  
  const ctx = canvas.getContext('2d');
  
  function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const time = Date.now() * 0.0005;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.strokeStyle = '#00ffe1';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 1000; i++) {
      const angle = i * 0.1 + time;
      const radius = Math.sqrt(i) * 3;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const hue = (i * 0.5 + time * 100) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(x, y, 2, 2);
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  container.appendChild(canvas);
}


// ==========================================================================
// PORTFOLIO INTERACTIVE SCRIPTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initIntersectionObserver();
  initTiltEffect();
  initRefractiveCards();
  initTextPressure();
  initTableHoverPreview();
});

// 1. Custom Cursor Logic
function initCursor() {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Core dot position is direct and instant
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Follower has smooth interpolation (lag effect)
  function updateFollower() {
    // 0.15 is the easing factor (friction)
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Hover States for Cursor
  const clickables = document.querySelectorAll('a, button, .clickable, .editorial-item');
  clickables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering');
    });
    item.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering');
    });
  });
}



// 3. Scroll Color Interpolation & Active Section Management
function initIntersectionObserver() {
  const container = document.getElementById('scroll-container');
  const sections = document.querySelectorAll('.snap-section');
  if (!container) return;

  const colors = [
    [1, 0, 78],    // Hero bg: #01004e (The exact dark blue from the uploaded image)
    [6, 12, 98],   // About bg: deep navy
    [12, 24, 115], // Services bg: navy blue
    [4, 10, 60]    // Gallery bg: dark navy slate
  ];

  // Set initial active states
  sections[0].classList.add('active-section');

  container.addEventListener('scroll', () => {
    const scrollTop = container.scrollTop;
    const height = window.innerHeight;
    const position = scrollTop / height;
    const index = Math.floor(position);
    const factor = position - index; // 0 to 1 progress within the current snap-section

    // 1. Interpolate Background Color Dynamically (No Lag, Instant feedback)
    if (index >= 0 && index < colors.length - 1) {
      const colorA = colors[index];
      const colorB = colors[index + 1];
      const r = Math.round(colorA[0] + (colorB[0] - colorA[0]) * factor);
      const g = Math.round(colorA[1] + (colorB[1] - colorA[1]) * factor);
      const b = Math.round(colorA[2] + (colorB[2] - colorA[2]) * factor);
      container.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    // 2. Mark active section to optimize calculations (TextPressure)
    const currentActiveIndex = Math.round(position);
    sections.forEach((sec, idx) => {
      if (idx === currentActiveIndex) {
        sec.classList.add('active-section');
      } else {
        sec.classList.remove('active-section');
      }
    });

    // 3. Toggle light pastel theme based on scroll position (when background becomes light pastel)
    if (position >= 1.5) {
      document.body.classList.add('theme-light-pastel');
    } else {
      document.body.classList.remove('theme-light-pastel');
    }
  });
}

// 4. 3D Tilt Effect on Project Cards
function initTiltEffect() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      const mouseX = e.clientX - cardRect.left;
      const mouseY = e.clientY - cardRect.top;
      
      const normX = (mouseX / cardWidth) - 0.5;
      const normY = (mouseY / cardHeight) - 0.5;
      
      card.style.transform = `perspective(1000px) rotateX(${normY * -12}deg) rotateY(${normX * 12}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// 5. Global Scroll Helper
window.scrollToSection = function(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

// 6. Service Cards Interactivity Setup
function initRefractiveCards() {
  const musicCard = document.getElementById('music-card');
  const videoCard = document.getElementById('video-card');

  // Click on cards opens slide drawers detailing works
  if (musicCard) {
    musicCard.addEventListener('click', () => openDrawer('music-drawer'));
  }
  if (videoCard) {
    videoCard.addEventListener('click', () => openDrawer('video-drawer'));
  }
}

// 7. High-Performance Proximity-based Typography (No Layout Reflows / Zero Lag)
let cachedLetterElements = [];

function cacheLetterCoordinates() {
  cachedLetterElements = [];
  const activeSpans = document.querySelectorAll('.active-section .pressure-heading span, #header-logo span');
  activeSpans.forEach(letter => {
    const rect = letter.getBoundingClientRect();
    cachedLetterElements.push({
      el: letter,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
  });
}

function initTextPressure() {
  // Cache initially
  cacheLetterCoordinates();
  
  // Recache positions on window resize or when scroll container settles
  window.addEventListener('resize', cacheLetterCoordinates);
  
  const container = document.getElementById('scroll-container');
  if (container) {
    // Recache coordinates when user scrolls snaps
    let scrollTimeout;
    container.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(cacheLetterCoordinates, 150); // Recache once scrolling stops
    });
  }

  // Calculate distance using simple math without layout reads on mousemove
  window.addEventListener('mousemove', (e) => {
    const mx = e.clientX;
    const my = e.clientY;
    
    cachedLetterElements.forEach(item => {
      const dx = mx - item.x;
      const dy = my - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const maxDist = 220; // Proximity threshold
      const proximity = Math.max(0, Math.min(1, (maxDist - dist) / maxDist));
      
      // Variable font settings mapping: weight wght 200 -> 900
      const wght = 200 + (proximity * 700);
      item.el.style.fontVariationSettings = `'wght' ${wght}`;
    });
  });
}

// 8. Drawer Interactivity Binds
window.openDrawer = function(drawerId) {
  const drawer = document.getElementById(drawerId);
  const container = document.getElementById('scroll-container');
  if (drawer) {
    drawer.classList.add('open');
    if (container) container.style.overflowY = 'hidden'; // Stop snap scroll while viewing details
  }
};

window.closeDrawer = function(drawerId) {
  const drawer = document.getElementById(drawerId);
  const container = document.getElementById('scroll-container');
  if (drawer) {
    drawer.classList.remove('open');
    if (container) container.style.overflowY = 'scroll'; // Re-enable snap scroll
  }
};

// 9. Attachment-style Projects Table Hover Preview
function initTableHoverPreview() {
  const rows = document.querySelectorAll('.project-row');
  const preview = document.getElementById('table-hover-preview');
  const previewImg = document.getElementById('table-preview-img');

  if (!preview || !previewImg) return;

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const imgPath = row.getAttribute('data-preview-img');
      previewImg.src = imgPath;
      preview.classList.add('active');
    });

    row.addEventListener('mousemove', (e) => {
      // Offset preview element slightly to the top-right of cursor
      preview.style.left = `${e.clientX + 20}px`;
      preview.style.top = `${e.clientY - 90}px`;
    });

    row.addEventListener('mouseleave', () => {
      preview.classList.remove('active');
    });
  });
}



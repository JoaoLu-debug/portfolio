// ==========================================================================
// PORTFOLIO INTERACTIVE SCRIPTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHeroPreviewSwitcher();
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

// 2. Hero Editorial Menu Preview Switcher
function initHeroPreviewSwitcher() {
  const items = document.querySelectorAll('.editorial-item');
  const previewImg = document.getElementById('preview-img');
  const previewMeta = document.getElementById('preview-meta');
  const previewTitle = document.getElementById('preview-title');
  const previewDesc = document.getElementById('preview-desc');
  const previewCard = document.getElementById('preview-card');

  if (!previewImg || !previewMeta || !previewTitle || !previewDesc) return;

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      // 1. Remove active class from others
      items.forEach(i => i.classList.remove('active'));
      
      // 2. Set current active
      item.classList.add('active');

      // 3. Extract metadata
      const imgPath = item.getAttribute('data-img');
      const title = item.getAttribute('data-title');
      const meta = item.getAttribute('data-meta');
      const desc = item.getAttribute('data-desc');

      // 4. Smooth Fade-Out / Swap / Fade-In Transition
      // We fade out the image and text opacity, swap values, then fade back in.
      previewImg.style.opacity = '0';
      previewMeta.classList.add('fade-out');
      previewTitle.style.opacity = '0';
      previewDesc.style.opacity = '0';

      setTimeout(() => {
        previewImg.src = imgPath;
        previewMeta.innerText = meta;
        previewTitle.innerText = title;
        previewDesc.innerText = desc;

        previewImg.style.opacity = '1';
        previewMeta.classList.remove('fade-out');
        previewTitle.style.opacity = '1';
        previewDesc.style.opacity = '1';
      }, 300); // Duration corresponds to CSS transitions
    });
  });
}

// 3. Scroll Color Interpolation & Active Section Management
function initIntersectionObserver() {
  const container = document.getElementById('scroll-container');
  const sections = document.querySelectorAll('.snap-section');
  if (!container) return;

  const colors = [
    [247, 247, 247], // Hero bg: #f7f7f7
    [203, 219, 229], // About bg: #cbdbe5
    [185, 203, 214], // Services bg: #b9cbd6
    [13, 15, 18]     // Gallery bg: #0d0f12
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

    // 3. Toggle dark/light theme body classes based on scroll position
    if (position >= 2.5) {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-porcelain');
    } else if (position >= 0.5) {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-porcelain');
    } else {
      document.body.classList.remove('theme-dark', 'theme-porcelain');
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

// 6. Refractive Cards 3D Tilt, Title Parallax & Click Interactivity (phone-ui-cards)
function initRefractiveCards() {
  const musicWrapper = document.getElementById('music-card-wrapper');
  const musicCard = document.getElementById('music-card');
  const videoWrapper = document.getElementById('video-card-wrapper');
  const videoCard = document.getElementById('video-card');

  setupTiltParallax(musicWrapper, musicCard);
  setupTiltParallax(videoWrapper, videoCard);

  // Click on cards opens slide drawers detailing works
  if (musicCard) {
    musicCard.addEventListener('click', () => openDrawer('music-drawer'));
  }
  if (videoCard) {
    videoCard.addEventListener('click', () => openDrawer('video-drawer'));
  }
}

function setupTiltParallax(wrapper, card) {
  if (!wrapper || !card) return;
  const title = card.querySelector('.pressure-heading');

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    
    card.style.transition = 'transform 0.08s cubic-bezier(0.25, 1, 0.5, 1)';
    if (title) title.style.transition = 'transform 0.08s cubic-bezier(0.25, 1, 0.5, 1)';

    card.style.transform = `perspective(1000px) rotateX(${normY * -10}deg) rotateY(${normX * 10}deg) scale3d(1.02, 1.02, 1.02)`;
    if (title) title.style.transform = `translate3d(${normX * -15}px, ${normY * -15}px, 30px)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    if (title) title.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (title) title.style.transform = 'translate3d(0, 0, 0)';
  });
}

// 7. Optimized Proximity-based Font Pressure Typography (TextPressure)
function initTextPressure() {
  let mouseX = 0;
  let mouseY = 0;

  // Track cursor position globally
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Only calculate for spans within active snap-section or the header logo to prevent layout thrashing
    const activeSpans = document.querySelectorAll('.active-section .pressure-heading span, #header-logo span');
    
    activeSpans.forEach(letter => {
      const rect = letter.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const maxDist = 250; // Influence radius in pixels
      const proximity = Math.max(0, Math.min(1, (maxDist - dist) / maxDist));
      
      // Interpolate axis: weight wght 200 -> 900
      const wght = 200 + (proximity * 700);
      letter.style.fontVariationSettings = `'wght' ${wght}`;
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



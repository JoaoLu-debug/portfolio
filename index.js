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

// 3. Intersection Observer for Scroll Snap Sections & Background Change
function initIntersectionObserver() {
  const sections = document.querySelectorAll('.snap-section');
  const container = document.getElementById('scroll-container');
  
  if (!container) return;

  const options = {
    root: container,
    threshold: 0.5 // Trigger when section is at least 50% in view
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionName = entry.target.getAttribute('data-section');
        
        // Reset classes
        container.classList.remove('bg-hero', 'bg-about', 'bg-services', 'bg-gallery');
        document.body.classList.remove('theme-dark', 'theme-porcelain');

        // Apply new background state classes to trigger smooth fade in transitions
        if (sectionName === 'gallery') {
          container.classList.add('bg-gallery');
          document.body.classList.add('theme-dark');
        } else if (sectionName === 'services') {
          container.classList.add('bg-services');
          document.body.classList.add('theme-porcelain');
        } else if (sectionName === 'about') {
          container.classList.add('bg-about');
          document.body.classList.add('theme-porcelain');
        } else {
          container.classList.add('bg-hero');
        }
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
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
      
      // Get mouse position relative to the element (from 0 to cardWidth/cardHeight)
      const mouseX = e.clientX - cardRect.left;
      const mouseY = e.clientY - cardRect.top;
      
      // Convert to normalized coordinates (-0.5 to 0.5)
      const normX = (mouseX / cardWidth) - 0.5;
      const normY = (mouseY / cardHeight) - 0.5;
      
      // Calculate rotation angles (Max 12 degrees)
      const rotateX = -normY * 12;
      const rotateY = normX * 12;
      
      // Apply translation in 3D space
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      // Reset transform smoothly
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

// 6. Refractive Cards 3D Tilt and Title Parallax (phone-ui-cards)
function initRefractiveCards() {
  const musicWrapper = document.getElementById('music-card-wrapper');
  const musicCard = document.getElementById('music-card');
  const videoWrapper = document.getElementById('video-card-wrapper');
  const videoCard = document.getElementById('video-card');

  setupTiltParallax(musicWrapper, musicCard);
  setupTiltParallax(videoWrapper, videoCard);
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

// 7. Proximity-based Font Pressure Typography (TextPressure)
function initTextPressure() {
  const letters = document.querySelectorAll('.pressure-heading span, #header-logo span');
  if (letters.length === 0) return;

  let mouseX = 0;
  let mouseY = 0;

  // Track global cursor coordinates for letter distance calculations
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function loop() {
    letters.forEach(letter => {
      const rect = letter.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      
      const dx = mouseX - center.x;
      const dy = mouseY - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const maxDist = 250; // Influence radius in pixels
      const proximity = Math.max(0, Math.min(1, (maxDist - dist) / maxDist));
      
      // Interpolate axis: weight wght 200 -> 900
      const wght = 200 + (proximity * 700);
      
      letter.style.fontVariationSettings = `'wght' ${wght}`;
    });
    requestAnimationFrame(loop);
  }
  
  loop();
}

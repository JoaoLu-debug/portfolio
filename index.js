// ==========================================================================
// PORTFOLIO INTERACTIVE SCRIPTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHeroPreviewSwitcher();
  initIntersectionObserver();
  initTiltEffect();
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
        container.classList.remove('bg-hero', 'bg-about', 'bg-gallery');
        document.body.classList.remove('theme-dark', 'theme-porcelain');

        // Apply new background state classes to trigger smooth fade in transitions
        if (sectionName === 'gallery') {
          container.classList.add('bg-gallery');
          document.body.classList.add('theme-dark');
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

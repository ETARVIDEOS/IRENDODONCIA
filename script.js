/* ==========================================================================
   Instituto Regional de Endodoncia (IRE) - Interactions & Animation Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTypingEffect();
  initScrollAnimations();
  initActiveNavLinkSpy();
  
  // Initialize Lucide SVG Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

/**
 * Mobile Navigation Toggle
 */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-link');
  const bars = document.querySelectorAll('.hamburger-bar');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains('open');
    
    // Toggle state
    menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', !isOpen);
    
    // Animate hamburger to X
    bars.forEach(bar => bar.classList.toggle('open'));
  });

  // Close menu when clicking nav links
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      bars.forEach(bar => bar.classList.remove('open'));
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      bars.forEach(bar => bar.classList.remove('open'));
    }
  });
}

/**
 * Tagline Typing Effect
 */
function initTypingEffect() {
  const element = document.getElementById('typing-tagline');
  if (!element) return;

  const phrases = [
    "Preservamos dientes.",
    "Recuperamos confianza."
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      // Erase character
      element.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Faster erasing
    } else {
      // Type character
      element.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Natural typing speed
    }

    // Handle phrase transition conditions
    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full word
      typingSpeed = 3000; // Pause for 3s
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Move to next phrase
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Small pause before writing next
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing loop
  setTimeout(type, 1000);
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-up'
  );

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.12, // Trigger when 12% of the element is visible
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Unobserve once animated
        }
      });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    elements.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * Highlight active link in header based on current scroll section
 */
function initActiveNavLinkSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  function spy() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // Offset for sticky header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', spy);
  spy(); // Call once initially
}

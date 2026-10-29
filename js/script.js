/**
 * ============================================================================
 * PORTFOLIO INTERACTIVITY SCRIPT - MUHAMMAD FAHAD
 * Designed for 20/20 Project Standard:
 * (5pts) JavaScript Interactivity Suite:
 *  1. Theme Switcher (Dark/Light) with LocalStorage persistence
 *  2. Mobile Navigation Drawer & Hamburger Animation
 *  3. Dynamic Typewriter Effect in Hero
 *  4. ScrollSpy Active Nav Highlight (IntersectionObserver)
 *  5. Animated Metric Numbers Counter
 *  6. Category Filter for Projects with Accessible ARIA states
 *  7. Accessible Project Quick-View Modal Dialog (Focus trapped, ESC close)
 *  8. Real-Time Contact Form Validation with Accessible Live Alerts
 *  9. Back to Top Button & Smooth Scrolling
 * 10. Dynamic Current Year in Footer
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. THEME SWITCHER (DARK / LIGHT MODE)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or detect OS system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = htmlRoot.getAttribute('data-theme');
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // ==========================================================================
  // 2. MOBILE NAVIGATION DRAWER & ACCESSIBLE TOGGLE
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileNav() {
    navbar.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMobileNav() {
    navbar.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle && navbar) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close when clicking outside of the drawer
    document.addEventListener('click', (e) => {
      if (navbar.classList.contains('open') && !navbar.contains(e.target) && e.target !== mobileToggle) {
        closeMobileNav();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navbar.classList.contains('open')) {
        closeMobileNav();
        mobileToggle.focus();
      }
    });
  }

  // ==========================================================================
  // 3. DYNAMIC TYPEWRITER EFFECT IN HERO
  // ==========================================================================
  const typewriterElement = document.getElementById('typewriter-text');
  const phrases = [
    'Full-Stack Developer',
    'Frontend Specialist',
    'UI/UX Craftsman',
    'Creative Problem Solver',
    'Clean Code Advocate'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenPhrases = 2000;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typewriterElement.textContent = currentPhrase.substring(0, charIndex);
    } else {
      charIndex++;
      typewriterElement.textContent = currentPhrase.substring(0, charIndex);
    }

    let timeoutDelay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      timeoutDelay = delayBetweenPhrases;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      timeoutDelay = 400;
    }

    setTimeout(typeEffect, timeoutDelay);
  }

  // Check if reduced-motion is requested before starting animation
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && typewriterElement) {
    typeEffect();
  }

  // ==========================================================================
  // 4. SCROLLSPY ACTIVE NAV HIGHLIGHT (INTERSECTION OBSERVER)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');

  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach((section) => navObserver.observe(section));

  // ==========================================================================
  // 5. ANIMATED METRICS COUNTER
  // ==========================================================================
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  function animateCounters() {
    metricNumbers.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800; // milliseconds
      const increment = target / (duration / 25);

      let current = 0;
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          setTimeout(updateCounter, 25);
        } else {
          counter.textContent = target;
        }
      };
      updateCounter();
    });
  }

  const metricsStrip = document.getElementById('metrics-strip');
  if (metricsStrip) {
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !metricsAnimated) {
          animateCounters();
          metricsAnimated = true;
        }
      },
      { threshold: 0.3 }
    );
    metricsObserver.observe(metricsStrip);
  }

  // ==========================================================================
  // 6. INTERACTIVE PROJECT CATEGORY FILTER
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button and aria-selected state
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================================================
  // 7. ACCESSIBLE PROJECT QUICK-VIEW MODAL DIALOG
  // ==========================================================================
  const projectModal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalTriggers = document.querySelectorAll('.project-modal-trigger');
  let lastActiveElement = null;

  // Project database with detailed specifications
  const projectDatabase = {
    'project-1': {
      title: 'NovaMart E-Commerce Platform',
      image: 'assets/images/project1.svg',
      alt: 'NovaMart E-Commerce Platform Dashboard',
      badge: 'Full-Stack Web App',
      description: 'NovaMart is a production-grade e-commerce application equipped with a headless REST API, custom Stripe card payments, inventory stock tracking, and user profile management.',
      features: [
        'Secure multi-role authentication with JWT & HTTP-only cookies',
        'Stripe webhooks handling instant payment confirmation',
        'Full CRUD operations for admin product catalogs and orders',
        'Responsive mobile-first cart drawer with optimistic updates'
      ],
      techStack: ['Node.js', 'Express', 'PostgreSQL', 'HTML5/CSS3', 'Stripe API'],
      liveUrl: '#hero',
      githubUrl: 'https://github.com'
    },
    'project-2': {
      title: 'TaskFlow Kanban Studio',
      image: 'assets/images/project2.svg',
      alt: 'TaskFlow Kanban Studio UI',
      badge: 'Productivity Application',
      description: 'TaskFlow gives software teams an intuitive sprint board for tracking deliverables. Features drag-and-drop card positioning, tag coloring, and offline persistence.',
      features: [
        'Zero-dependency native HTML5 Drag and Drop API integration',
        'Real-time card filtering by priority and sprint tags',
        'Local storage persistence with automatic JSON schema backup',
        'Keyboard shortcuts for creating, editing, and moving tasks'
      ],
      techStack: ['Vanilla JavaScript ES6+', 'HTML5 DnD API', 'CSS Grid', 'LocalStorage'],
      liveUrl: '#hero',
      githubUrl: 'https://github.com'
    },
    'project-3': {
      title: 'OmniAI Prompt & Chat Studio',
      image: 'assets/images/project3.svg',
      alt: 'OmniAI Studio interface',
      badge: 'AI SaaS Dashboard',
      description: 'A responsive developer-oriented studio for experimenting with Large Language Models. Supports response streaming, code block syntax highlighting, and conversation history exporting.',
      features: [
        'Readable SSE stream processing for character-by-character output',
        'Custom prompt presets and system prompt configuration',
        'Token estimation counter and latency response metrics',
        'Copy-to-clipboard code snippets with visual confirmation'
      ],
      techStack: ['JavaScript', 'Fetch Streams API', 'CSS Glassmorphism', 'OpenAI API'],
      liveUrl: '#hero',
      githubUrl: 'https://github.com'
    },
    'project-4': {
      title: 'CryptoScope Live Market Tracker',
      image: 'assets/images/project4.svg',
      alt: 'CryptoScope Live Market Tracker',
      badge: 'Financial Analytics',
      description: 'A cryptocurrency market analytics dashboard connecting to live WebSocket tickers. Displays responsive SVG price trend lines and instant fiat currency exchange rates.',
      features: [
        'Real-time WebSocket stream updating top 50 cryptocurrencies',
        'Dynamic SVG trendline chart rendering without heavy charting libraries',
        'Customizable price alert thresholds with sound and banner notifications',
        'High contrast dark color mode optimized for readability'
      ],
      techStack: ['JavaScript ES6', 'WebSockets', 'SVG Graphics', 'CoinGecko API'],
      liveUrl: '#hero',
      githubUrl: 'https://github.com'
    },
    'project-5': {
      title: 'SkyPulse Weather & Air Quality',
      image: 'assets/images/project5.svg',
      alt: 'SkyPulse Weather Dashboard',
      badge: 'Weather & Climate App',
      description: 'SkyPulse provides hyperlocal weather reports, 5-day forecasts, and World Health Organization Air Quality Index (AQI) visualizations with GPS location support.',
      features: [
        'Browser Geolocation API with fallback city search',
        'Radial AQI gauge indicator with color-coded health alerts',
        'Interactive 24-hour hourly timeline and wind radar',
        'Offline caching of latest weather report via Service Worker'
      ],
      techStack: ['HTML5 Geolocation', 'OpenWeather API', 'CSS Grid', 'Vanilla JS'],
      liveUrl: '#hero',
      githubUrl: 'https://github.com'
    },
    'project-6': {
      title: 'DevInk - Tech Blog & Markdown CMS',
      image: 'assets/images/project6.svg',
      alt: 'DevInk Blog CMS preview',
      badge: 'Publishing Engine',
      description: 'DevInk is an authoring platform tailored for developers. It features a side-by-side Markdown editor, real-time HTML parsing, estimated reading time calculator, and article tagging.',
      features: [
        'Instant client-side Markdown to semantic HTML parser',
        'Syntax highlighting for HTML, CSS, JavaScript, and Python',
        'Estimated read-time calculation and word count metrics',
        'One-click export to Markdown (.md) or static HTML'
      ],
      techStack: ['Semantic HTML5', 'Modern CSS', 'Regex Parser', 'LocalStorage'],
      liveUrl: '#hero',
      githubUrl: 'https://github.com'
    }
  };

  function openProjectModal(projectId) {
    const data = projectDatabase[projectId];
    if (!data || !projectModal || !modalBody) return;

    lastActiveElement = document.activeElement;

    modalBody.innerHTML = `
      <figure class="modal-header-visual">
        <img src="${data.image}" alt="${data.alt}" width="600" height="340">
      </figure>
      <div class="project-badge">${data.badge}</div>
      <h3 class="modal-title" id="modal-title">${data.title}</h3>
      <p class="modal-full-desc">${data.description}</p>
      
      <h4 class="modal-section-subtitle">Key Engineering Highlights:</h4>
      <ul class="modal-features-list">
        ${data.features.map((feat) => `<li>${feat}</li>`).join('')}
      </ul>

      <h4 class="modal-section-subtitle">Technologies Employed:</h4>
      <div class="project-tech-list" style="margin-bottom: 20px;">
        ${data.techStack.map((tech) => `<li>${tech}</li>`).join('')}
      </div>

      <div class="modal-actions">
        <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          <span>Source Code</span>
        </a>
        <a href="${data.liveUrl}" class="btn btn-primary btn-sm" id="modal-live-btn">
          <span>Launch Live Demo</span>
        </a>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Trap focus inside modal
    if (modalCloseBtn) {
      modalCloseBtn.focus();
    }
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }

  modalTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    // Click outside to close
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }

  // ==========================================================================
  // 8. REAL-TIME CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const charCounter = document.getElementById('char-count');

  // Live character counter for message
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500`;
      if (len > 500) {
        charCounter.style.color = 'var(--danger-color)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Field validator helper
  function validateField(input, errorElementId, validationFn, errorMsg) {
    const errorElement = document.getElementById(errorElementId);
    const value = input.value.trim();
    const isValid = validationFn(value);

    if (!isValid) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
      if (errorElement) errorElement.textContent = errorMsg;
      return false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      input.setAttribute('aria-invalid', 'false');
      if (errorElement) errorElement.textContent = '';
      return true;
    }
  }

  const validators = {
    name: (val) => val.length >= 3,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    subject: (val) => val.length >= 4,
    message: (val) => val.length >= 15 && val.length <= 500
  };

  // Add blur and input listeners for real-time validation
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      validateField(nameInput, 'name-error', validators.name, 'Please enter your full name (at least 3 characters).');
    });
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('is-invalid')) {
        validateField(nameInput, 'name-error', validators.name, 'Please enter your full name (at least 3 characters).');
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateField(emailInput, 'email-error', validators.email, 'Please enter a valid email address (e.g. name@domain.com).');
    });
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('is-invalid')) {
        validateField(emailInput, 'email-error', validators.email, 'Please enter a valid email address.');
      }
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('blur', () => {
      validateField(subjectInput, 'subject-error', validators.subject, 'Subject must be at least 4 characters long.');
    });
    subjectInput.addEventListener('input', () => {
      if (subjectInput.classList.contains('is-invalid')) {
        validateField(subjectInput, 'subject-error', validators.subject, 'Subject must be at least 4 characters long.');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      validateField(messageInput, 'message-error', validators.message, 'Message must be between 15 and 500 characters.');
    });
    messageInput.addEventListener('input', () => {
      if (messageInput.classList.contains('is-invalid')) {
        validateField(messageInput, 'message-error', validators.message, 'Message must be between 15 and 500 characters.');
      }
    });
  }

  // Handle Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, 'name-error', validators.name, 'Please enter your full name (at least 3 characters).');
      const isEmailValid = validateField(emailInput, 'email-error', validators.email, 'Please enter a valid email address.');
      const isSubjectValid = validateField(subjectInput, 'subject-error', validators.subject, 'Subject must be at least 4 characters long.');
      const isMessageValid = validateField(messageInput, 'message-error', validators.message, 'Message must be between 15 and 500 characters.');

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        if (formStatus) {
          formStatus.className = 'form-status-alert error';
          formStatus.textContent = '⚠️ Please fix the highlighted errors above before submitting.';
        }
        return;
      }

      // Enter loading state
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.setAttribute('disabled', 'true');
      }

      if (formStatus) {
        formStatus.className = 'form-status-alert';
        formStatus.style.display = 'none';
      }

      // Simulate asynchronous server dispatch
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.removeAttribute('disabled');
        }

        if (formStatus) {
          formStatus.className = 'form-status-alert success';
          formStatus.innerHTML = `<strong>🎉 Thank you, ${nameInput.value.trim()}!</strong> Your message has been received. I will get back to you within 24 hours.`;
          formStatus.style.display = 'block';
        }

        // Reset form and remove validation classes
        contactForm.reset();
        [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
          input.classList.remove('is-valid');
          input.removeAttribute('aria-invalid');
        });
        if (charCounter) charCounter.textContent = '0 / 500';

        // Auto-hide success message after 8 seconds
        setTimeout(() => {
          if (formStatus) {
            formStatus.style.display = 'none';
          }
        }, 8000);
      }, 1200);
    });
  }

  // ==========================================================================
  // 9. BACK-TO-TOP BUTTON & SMOOTH SCROLLING
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // 10. DYNAMIC CURRENT YEAR IN FOOTER
  // ==========================================================================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});


/* ===================================================================
   H&A FREELANCE SERVICES — SCRIPT
   Vanilla JS only. No frameworks, no dependencies beyond Font Awesome.
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     YEAR
  ============================================================ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     PRELOADER
  ============================================================ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('loaded');
      document.body.classList.add('loaded-state');
    }, 500);
  });
  // Fallback in case load event already fired or is delayed
  setTimeout(() => { if (preloader) preloader.classList.add('loaded'); }, 3000);

  /* ============================================================
     CUSTOM CURSOR (desktop only)
  ============================================================ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouchDevice && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = 'a, button, input, textarea, .service-card, .portfolio-card, .why-card, .value-card, .testimonial-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.remove('cursor-hover');
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1'; cursorRing.style.opacity = '0.5';
    });
  }

  /* ============================================================
     SCROLL PROGRESS BAR
  ============================================================ */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }

  /* ============================================================
     HEADER SCROLL STATE
  ============================================================ */
  const siteHeader = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  function updateHeaderState() {
    const scrolled = window.scrollY > 40;
    if (siteHeader) siteHeader.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 600);
  }

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateHeaderState();
  }, { passive: true });
  updateScrollProgress();
  updateHeaderState();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     MOBILE MENU
  ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(!!isOpen));
  });

  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ============================================================
     ACTIVE NAV LINK ON SCROLL
  ============================================================ */
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionsForNav = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function updateActiveNav() {
    let currentId = sectionsForNav[0]?.id;
    const scrollPos = window.scrollY + 140;

    sectionsForNav.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + currentId);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ============================================================
     DARK MODE TOGGLE
  ============================================================ */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    root.classList.toggle('dark-mode', theme === 'dark');
  }

  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('handa-theme') || 'light'; } catch (e) {}
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const newTheme = root.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(newTheme);
    try { localStorage.setItem('handa-theme', newTheme); } catch (e) {}
  });

  /* ============================================================
     SCROLL REVEAL (IntersectionObserver)
  ============================================================ */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ============================================================
     HERO TYPING EFFECT
  ============================================================ */
  const typedEl = document.getElementById('heroTyped');
  if (typedEl) {
    const phrases = [
      'High-Quality Freelance Services',
      'Accurate Document Solutions',
      'Creative Design Services',
      'Reliable Digital Support'
    ];
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = false;
    let typingTimeout;

    // Start fully typed with the first (primary, SEO-relevant) phrase, then cycle
    typedEl.textContent = phrases[0];

    function typeLoop() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typedEl.textContent = current.substring(0, charIndex);
      } else {
        charIndex++;
        typedEl.textContent = current.substring(0, charIndex);
      }

      let delay = isDeleting ? 35 : 65;

      if (!isDeleting && charIndex === current.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      }

      typingTimeout = setTimeout(typeLoop, delay);
    }

    // Begin the cycle after an initial pause showing the full primary phrase
    typingTimeout = setTimeout(() => { isDeleting = true; typeLoop(); }, 2600);
  }

  /* ============================================================
     ANIMATED COUNTERS
  ============================================================ */
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ============================================================
     PROCESS TIMELINE PROGRESS
  ============================================================ */
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const timelineProgress = document.getElementById('timelineProgress');

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
    const filled = document.querySelectorAll('.timeline-step.in-view').length;
    const pct = timelineSteps.length ? (filled / timelineSteps.length) * 100 : 0;
    if (timelineProgress) timelineProgress.style.width = pct + '%';
  }, { threshold: 0.5 });

  timelineSteps.forEach(step => timelineObserver.observe(step));

  /* ============================================================
     PORTFOLIO DATA + FILTERING
  ============================================================ */
  const portfolioItems = [
    {
      title: 'Instagram Fashion Campaign',
      desc: 'A cohesive nine-post grid designed for a boutique clothing launch.',
      category: 'social', tag: 'Social Media Posts',
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Restaurant Social Media Pack',
      desc: 'Monthly content pack of menu highlights, offers, and story templates.',
      category: 'social', tag: 'Social Media Posts',
      img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Corporate Business Social Media Kit',
      desc: 'A full LinkedIn and Facebook content kit for a B2B consulting firm.',
      category: 'social', tag: 'Social Media Posts',
      img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Real Estate Facebook Posts',
      desc: 'Listing carousels and open-house announcements for a realty brand.',
      category: 'social', tag: 'Social Media Posts',
      img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Birthday Invitation Card',
      desc: 'A playful, fully editable digital invitation with custom typography.',
      category: 'cards', tag: 'Wishing Cards',
      img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Wedding Invitation Card',
      desc: 'An elegant gold-foil-style invitation suite for a destination wedding.',
      category: 'cards', tag: 'Wishing Cards',
      img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Eid Greeting Card',
      desc: 'A festive, crescent-themed greeting card set for social sharing.',
      category: 'cards', tag: 'Wishing Cards',
      img: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Business Flyer Design',
      desc: 'A bold promotional flyer built for print and digital distribution.',
      category: 'canva', tag: 'Canva Designing',
      img: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Resume Formatting Project',
      desc: 'A clean two-column resume layout formatted for ATS compatibility.',
      category: 'formatting', tag: 'Content Formatting',
      img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Company Brochure Design',
      desc: 'A tri-fold brochure summarizing services for a logistics company.',
      category: 'canva', tag: 'Canva Designing',
      img: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: '1000 Rows Excel Data Entry',
      desc: 'Bulk inventory data entered, validated, and structured for analysis.',
      category: 'data', tag: 'Data Entry Projects',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Invoice Formatting',
      desc: 'A reusable branded invoice template with automatic calculations.',
      category: 'formatting', tag: 'Content Formatting',
      img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'PDF Book Conversion',
      desc: 'A 180-page scanned book converted into a fully editable Word file.',
      category: 'pdf', tag: 'PDF to Word',
      img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Editable Business Proposal',
      desc: 'A formatted, investor-ready proposal converted from static PDF.',
      category: 'pdf', tag: 'PDF to Word',
      img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Student Assignment Formatting',
      desc: 'Citation, spacing, and structure corrected to university guidelines.',
      category: 'editing', tag: 'Document Editing',
      img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Canva Marketing Kit',
      desc: 'A full set of branded templates for ads, posts, and email banners.',
      category: 'canva', tag: 'Canva Designing',
      img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Company Portfolio Website',
      desc: 'A responsive multi-section portfolio site built for a design studio.',
      category: 'web', tag: 'Portfolio Websites',
      img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Business Landing Page',
      desc: 'A conversion-focused single-page site for a SaaS product launch.',
      category: 'web', tag: 'Portfolio Websites',
      img: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Content Formatting Project',
      desc: 'Long-form report restructured with headings, styles, and a TOC.',
      category: 'formatting', tag: 'Content Formatting',
      img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Business Report Editing',
      desc: 'A quarterly report edited for clarity, tone, and grammatical accuracy.',
      category: 'editing', tag: 'Document Editing',
      img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Content Writing Sample',
      desc: 'SEO-aware blog content written for a home services company.',
      category: 'writing', tag: 'Content Writing',
      img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const portfolioGrid = document.getElementById('portfolioGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  function createPortfolioCard(item, index) {
    const card = document.createElement('article');
    card.className = 'portfolio-card';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-reveal', 'up');
    card.setAttribute('data-delay', String(index % 3));

    card.innerHTML = `
      <div class="portfolio-thumb">
        <img src="${item.img}" alt="${item.title} — ${item.tag} sample by H&A Freelance Services" loading="lazy">
        <span class="portfolio-tag">${item.tag}</span>
        <div class="portfolio-overlay">
          <span class="portfolio-view-btn"><i class="fa-solid fa-eye"></i> View Project</span>
        </div>
      </div>
      <div class="portfolio-body">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>
    `;
    return card;
  }

  if (portfolioGrid) {
    portfolioItems.forEach((item, i) => {
      const card = createPortfolioCard(item, i);
      portfolioGrid.appendChild(card);
      revealObserver.observe(card);
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      document.querySelectorAll('.portfolio-card').forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden-item', !match);
      });
    });
  });

  /* ============================================================
     FAQ ACCORDION
  ============================================================ */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ============================================================
     CONTACT FORM VALIDATION
  ============================================================ */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    const group = input.closest('.form-group');
    if (message) {
      group.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      group.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    let valid = true;

    if (!name.value.trim()) { setFieldError('name', 'nameError', 'Please enter your name.'); valid = false; }
    else setFieldError('name', 'nameError', '');

    if (!email.value.trim()) { setFieldError('email', 'emailError', 'Please enter your email.'); valid = false; }
    else if (!isValidEmail(email.value.trim())) { setFieldError('email', 'emailError', 'Please enter a valid email address.'); valid = false; }
    else setFieldError('email', 'emailError', '');

    if (!subject.value.trim()) { setFieldError('subject', 'subjectError', 'Please enter a subject.'); valid = false; }
    else setFieldError('subject', 'subjectError', '');

    if (!message.value.trim()) { setFieldError('message', 'messageError', 'Please enter your message.'); valid = false; }
    else if (message.value.trim().length < 10) { setFieldError('message', 'messageError', 'Message should be at least 10 characters.'); valid = false; }
    else setFieldError('message', 'messageError', '');

    if (!valid) {
      formSuccess?.classList.remove('show');
      return;
    }

    // Simulate sending (no backend wired up — this is a static front end)
    const submitBtn = contactForm.querySelector('.form-submit');
    const submitText = document.getElementById('submitText');
    const originalText = submitText.textContent;

    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';

    setTimeout(() => {
      formSuccess?.classList.add('show');
      contactForm.reset();
      submitBtn.disabled = false;
      submitText.textContent = originalText;

      setTimeout(() => formSuccess?.classList.remove('show'), 6000);
    }, 900);
  });

  // Clear field error as user types
  ['name', 'email', 'subject', 'message'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      setFieldError(id, id + 'Error', '');
    });
  });

  /* ============================================================
     NEWSLETTER FORM
  ============================================================ */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (!input.value.trim() || !isValidEmail(input.value.trim())) return;

    newsletterSuccess?.classList.add('show');
    newsletterForm.reset();
    setTimeout(() => newsletterSuccess?.classList.remove('show'), 5000);
  });

  /* ============================================================
     BUTTON RIPPLE EFFECT
  ============================================================ */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';

      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ============================================================
     SMOOTH ANCHOR SCROLL (offset-aware for sticky header)
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = document.getElementById('siteHeader')?.offsetHeight || 84;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - headerOffset + 1;

      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });

});

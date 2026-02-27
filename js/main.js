/* ========================================
   BARBEARIA ROGER — Main JavaScript
   ======================================== */

(function () {
  'use strict';

  // ===============================
  // 1. Mobile Menu
  // ===============================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===============================
  // 2. Header scroll behavior
  // ===============================
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (header) {
      if (current > 80) {
        header.style.background = 'rgba(11, 13, 16, 0.95)';
      } else {
        header.style.background = 'rgba(11, 13, 16, 0.85)';
      }
    }
    lastScroll = current;
  }, { passive: true });

  // ===============================
  // 3. Active nav link on scroll
  // ===============================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ===============================
  // 4. Scroll reveal (Intersection Observer)
  // ===============================
  const revealElements = document.querySelectorAll(
    '.section__header, ' +
    '.services-grid .card, ' +
    '.gallery-grid .tilt-card, ' +
    '.reviews-grid .card, ' +
    '.protese__content, ' +
    '.protese__image, ' +
    '.reviews-hero, ' +
    '.location__info, ' +
    '.location__map, ' +
    '.contact__buttons, ' +
    '.contact-form'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===============================
  // 5. 3D Tilt Cards (antes/depois)
  //    Instant follow — no transition delay
  // ===============================
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(wrapper => {
    const card = wrapper.querySelector('.ba-card');
    if (!card) return;

    const shine = card.querySelector('.ba-card__shine');
    const maxTilt = 12; // degrees

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalized values (-1 to 1)
      const normalX = (x - centerX) / centerX;
      const normalY = (y - centerY) / centerY;

      // Rotation (inverted for natural tilt)
      const rotateX = -normalY * maxTilt;
      const rotateY = normalX * maxTilt;

      // Apply transform instantly (no transition)
      card.style.transition = 'box-shadow 250ms ease';
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Shine position
      if (shine) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        shine.style.setProperty('--mouse-x', percentX + '%');
        shine.style.setProperty('--mouse-y', percentY + '%');
      }
    });

    wrapper.addEventListener('mouseleave', () => {
      // Smooth return to rest
      card.style.transition = 'transform 400ms ease, box-shadow 250ms ease';
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // ===============================
  // 6. Smooth scroll for anchor links
  // ===============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===============================
  // 7. Contact form (simple handler)
  // ===============================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple WhatsApp redirect with message
      const name = contactForm.querySelector('input[type="text"]').value;
      const phone = contactForm.querySelector('input[type="tel"]').value;
      const subject = contactForm.querySelector('select').value;
      const message = contactForm.querySelector('textarea').value;

      const whatsappMsg = encodeURIComponent(
        `Olá! Me chamo ${name}.\nTelefone: ${phone}\nAssunto: ${subject}\nMensagem: ${message}`
      );

      window.open(`https://wa.me/5500000000000?text=${whatsappMsg}`, '_blank');
    });
  }

})();

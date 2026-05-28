/* ============================================================
   Bella Monroe Bridal — script.js
   Author: Neer Adole (49187227)
   Course: DECO1400 — Introduction to Web Design

   JS Interactions:
   1. Sticky nav with scroll state
   2. Hamburger mobile menu toggle
   3. Testimonials auto-rotating carousel with dot controls
   4. Scroll reveal animation (IntersectionObserver)
   5. Collections filter bar (show/hide gown cards)
   6. Lookbook tab switching + lightbox
   7. FAQ accordion
   8. Multi-step booking form with validation
   9. Contact form validation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Sticky Nav ─────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── 2. Hamburger / Mobile Menu ────────────────────────────── */
  const burger  = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close when a mobile link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── 3. Testimonials Carousel ──────────────────────────────── */
  const testimonials = document.querySelectorAll('.testimonial');
  const dots         = document.querySelectorAll('.testimonials-strip__dots button');

  if (testimonials.length > 0) {
    let current  = 0;
    let autoPlay = null;

    const showTestimonial = (idx) => {
      testimonials.forEach(t => t.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      testimonials[idx].classList.add('active');
      if (dots[idx]) dots[idx].classList.add('active');
      current = idx;
    };

    const next = () => showTestimonial((current + 1) % testimonials.length);
    autoPlay = setInterval(next, 4500);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(autoPlay);
        showTestimonial(i);
        autoPlay = setInterval(next, 4500);
      });
    });

    showTestimonial(0);
  }

  /* ── 4. Scroll Reveal ──────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  /* ── 5. Collections Filter ─────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-bar button');
  const gownCards  = document.querySelectorAll('.gown-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        gownCards.forEach(card => {
          const match = filter === 'all' || card.dataset.type === filter;
          card.style.display = match ? '' : 'none';
          // Small stagger animation on reveal
          if (match) {
            card.style.animation = 'none';
            card.offsetHeight; // reflow
            card.style.animation = 'fade-up 0.4s ease forwards';
          }
        });
      });
    });
  }

  /* ── 6a. Lookbook Tab Switching ────────────────────────────── */
  const tabBtns     = document.querySelectorAll('.tab-bar button');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  }

  /* ── 6b. Lightbox ──────────────────────────────────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxSub   = document.getElementById('lightbox-sub');
  const lightboxEmoji = document.getElementById('lightbox-emoji');

  document.querySelectorAll('.masonry-item').forEach(item => {
    item.addEventListener('click', () => {
      if (lightbox) {
        if (lightboxTitle) lightboxTitle.textContent = item.dataset.title || 'Bridal Gown';
        if (lightboxSub)   lightboxSub.textContent   = item.dataset.sub   || '';
        if (lightboxEmoji) lightboxEmoji.textContent = item.dataset.emoji || '👗';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ── 7. FAQ Accordion ──────────────────────────────────────── */
  document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Open clicked (toggle)
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 8. Multi-step Booking Form ────────────────────────────── */
  const steps     = document.querySelectorAll('.form-step');
  const stepDots  = document.querySelectorAll('.progress-steps .step');
  const nextBtns  = document.querySelectorAll('.btn-next');
  const prevBtns  = document.querySelectorAll('.btn-prev');
  const bookingForm = document.getElementById('booking-form');

  let currentStep = 0;

  const showStep = (idx) => {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
    });
    stepDots.forEach((d, i) => {
      d.classList.remove('active', 'done');
      if (i < idx)  d.classList.add('done');
      if (i === idx) d.classList.add('active');
    });
    currentStep = idx;
  };

  const validateStep = (idx) => {
    const step   = steps[idx];
    if (!step) return true;
    const inputs = step.querySelectorAll('input[required], select[required]');
    let valid    = true;
    inputs.forEach(input => {
      const err = input.parentElement.querySelector('.field-error');
      if (!input.value.trim()) {
        if (err) err.classList.add('visible');
        input.style.borderColor = 'var(--error)';
        valid = false;
      } else {
        if (err) err.classList.remove('visible');
        input.style.borderColor = '';
        // Email validation
        if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          if (err) { err.textContent = 'Please enter a valid email address'; err.classList.add('visible'); }
          input.style.borderColor = 'var(--error)';
          valid = false;
        }
      }
    });
    return valid;
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep) && currentStep < steps.length - 1) {
        showStep(currentStep + 1);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        const success = document.getElementById('booking-success');
        bookingForm.style.display = 'none';
        document.querySelector('.progress-steps').style.display = 'none';
        if (success) success.classList.add('visible');
      }
    });
    showStep(0);
  }

  /* ── 9. Contact Form Validation ────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
        const err = input.parentElement.querySelector('.field-error');
        if (!input.value.trim()) {
          if (err) err.classList.add('visible');
          input.style.borderColor = 'var(--error)';
          valid = false;
        } else {
          if (err) err.classList.remove('visible');
          input.style.borderColor = '';
          if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            if (err) { err.textContent = 'Please enter a valid email address'; err.classList.add('visible'); }
            input.style.borderColor = 'var(--error)';
            valid = false;
          }
        }
      });

      if (valid) {
        const success = document.getElementById('contact-success');
        contactForm.style.display = 'none';
        if (success) success.classList.add('visible');
      }
    });
  }

  /* ── Active nav link ───────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

}); // end DOMContentLoaded

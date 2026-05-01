// ============================================================
// 3D IMMERSIVE PORTFOLIO — CLEAN INTERACTIVE ENGINE
// ============================================================

// EmailJS Init
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init("BW-BZcyECGiOQe0zP");
  }
})();

// ============ PARTICLE BACKGROUND ============
// NOTE: Replaced by Three.js 3D background (threejs-bg.js)
// Keeping function stub to avoid errors if called elsewhere
function initParticles() {
  // No-op: Three.js canvas handles the particle/background layer
}

// ============ 3D TILT ON CARDS ============
function initTilt() {
  if ('ontouchstart' in window) return;
  
  document.querySelectorAll('.project-card, .about-card, .tech-category').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      el.style.transition = 'transform 0.1s ease-out';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

// ============ HERO PARALLAX ============
function initHeroParallax() {
  if ('ontouchstart' in window) return;
  const photo = document.getElementById('photoContainer');
  const hero = document.querySelector('.hero');
  if (!photo || !hero) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    photo.style.transform = `translate(${x * 20}px, ${y * 20}px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    photo.style.transition = 'transform 0.12s ease-out';
  });

  hero.addEventListener('mouseleave', () => {
    photo.style.transform = '';
    photo.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });
}

// ============ SCROLL REVEAL ============
function initReveal() {
  const els = document.querySelectorAll(
    '.about-card, .timeline-item, .tech-category, .project-card, .contact-item, .contact-form, .section-title'
  );

  els.forEach((el, i) => {
    el.setAttribute('data-reveal', '');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ============ HEADER SCROLL STATE ============
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ============ ACTIVE NAV ============
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) {
        current = s.getAttribute('id');
      }
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============ ORBIT RINGS & PARTICLES ============
function initOrbitRings() {
  const container = document.getElementById('photoContainer');
  if (!container) return;

  [340, 360, 380].forEach((size, i) => {
    const ring = document.createElement('div');
    ring.className = 'orbit-ring';
    ring.style.cssText = `
      width: ${size}px; height: ${size}px;
      top: ${(380 - size) / 2}px; left: ${(380 - size) / 2}px;
      animation-duration: ${30 + i * 12}s;
      ${i % 2 ? 'animation-direction: reverse;' : ''}
    `;
    container.appendChild(ring);
  });

  for (let i = 0; i < 4; i++) {
    const p = document.createElement('div');
    p.className = 'moving-particle';
    p.style.cssText = `
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --tx: ${(Math.random() - 0.5) * 180}px;
      --ty: ${(Math.random() - 0.5) * 180}px;
      animation-duration: ${10 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(p);
  }
}

// ============ CONTACT FORM ============
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'SENDING...';
    btn.disabled = true;

    if (typeof emailjs !== 'undefined') {
      const SERVICE_ID  = 'service_il351vr';
      const CONTACT_TPL = 'template_t9o5rdq';   // Contact Us — goes to you
      const REPLY_TPL   = 'template_oyp16d8';   // Auto-Reply — goes to sender

      // Collect form data for auto-reply
      const formData = {
        from_name: form.querySelector('[name="from_name"]').value,
        reply_to:  form.querySelector('[name="reply_to"]').value,
        message:   form.querySelector('[name="message"]').value,
      };

      // Send Contact Us email first, then Auto-Reply
      emailjs.sendForm(SERVICE_ID, CONTACT_TPL, this)
        .then(() => emailjs.send(SERVICE_ID, REPLY_TPL, formData))
        .then(() => {
          btn.textContent = '✓ SENT SUCCESSFULLY';
          btn.style.background = '#059669';
          form.reset();
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.disabled = false;
          }, 3500);
        })
        .catch(() => {
          btn.textContent = '✗ FAILED TO SEND';
          btn.style.background = '#dc2626';
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.disabled = false;
          }, 3500);
        });
    }
  });
}

// ============ MAGNETIC BUTTONS ============
function initMagnetic() {
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.btn, .social-link-hero, .social-link').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      el.style.transition = 'transform 0.1s ease-out';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

// ============ CIRCUIT LINES ============
function initCircuitLines() {
  const container = document.getElementById('circuitLines');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < 10; i++) {
    const line = document.createElement('div');
    line.className = 'circuit-line';
    const h = Math.random() > 0.5;
    Object.assign(line.style, {
      position: 'absolute',
      width: h ? `${60 + Math.random() * 120}px` : '1px',
      height: h ? '1px' : `${60 + Math.random() * 120}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      background: `rgba(124, 92, 252, ${0.08 + Math.random() * 0.1})`,
      animationDelay: `${Math.random() * 4}s`,
    });
    container.appendChild(line);
  }
}

// ============ INIT ALL ============
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCircuitLines();
  initOrbitRings();
  initReveal();
  initHeader();
  initActiveNav();
  initSmoothScroll();
  initContactForm();
  initTilt();
  initHeroParallax();
  initMagnetic();
});
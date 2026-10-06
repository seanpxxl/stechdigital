window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
const safeStorage = {
  get(key) {
    try { return window.localStorage.getItem(key); } catch (error) { return null; }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, value); } catch (error) { /* Keep the site usable when storage is blocked. */ }
  }
};
const analyticsConsent = safeStorage.get('stech-analytics-consent');
window.gtag('consent', 'default', {
  analytics_storage: analyticsConsent === 'accepted' ? 'granted' : 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
let analyticsLoaded = false;
const loadAnalytics = () => {
  if (analyticsLoaded) return;
  analyticsLoaded = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-X0FEV3TYK3';
  document.head.appendChild(script);
  window.gtag('js', new Date());
  window.gtag('config', 'G-X0FEV3TYK3', { anonymize_ip: true });
};
const scheduleAnalytics = () => {
  if ('requestIdleCallback' in window) window.requestIdleCallback(loadAnalytics, { timeout: 2500 });
  else window.setTimeout(loadAnalytics, 1200);
};
if (analyticsConsent === 'accepted') scheduleAnalytics();

const menuButton = document.querySelector('.menu');
const mobileNav = document.querySelector('.mobile-nav');

if (menuButton) menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  if (mobileNav) mobileNav.classList.toggle('open', !open);
});

if (mobileNav) mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
}));

// Keep homepage section navigation useful without exposing hash fragments in
// the public address bar. Direct links with a hash still scroll correctly,
// then settle back to the canonical homepage URL.
const cleanHomepageUrl = () => {
  if (window.location.pathname === '/' && window.location.hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
};

if (window.location.pathname === '/') {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'auto', block: 'start' });
      cleanHomepageUrl();
    });
  });

  if (window.location.hash) {
    window.requestAnimationFrame(() => window.requestAnimationFrame(cleanHomepageUrl));
  }
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const progress = document.querySelector('.page-progress span');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowPowerDevice = (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
const motionEnabled = !reducedMotion;
if (lowPowerDevice) document.documentElement.classList.add('low-power');
if (motionEnabled && !lowPowerDevice && (window.matchMedia('(any-pointer: coarse)').matches || window.innerWidth <= 980)) {
  document.documentElement.classList.add('mobile-motion');
}
let ticking = false;

const updateScrollEffects = () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = available > 0 ? window.scrollY / available : 0;
  if (progress) progress.style.setProperty('transform', `scaleX(${Math.min(1, Math.max(0, ratio))})`);
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });
updateScrollEffects();

if (motionEnabled && window.matchMedia('(pointer: fine)').matches) {
  const stage = document.querySelector('.tilt-stage');
  window.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
  }, { passive: true });

  if (stage) stage.addEventListener('pointermove', (event) => {
    const bounds = stage.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 22;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 18;
    stage.style.setProperty('--tilt-x', `${x}px`);
    stage.style.setProperty('--tilt-y', `${y}px`);
    stage.style.setProperty('--tilt-left-x', `${x * -0.45}px`);
    stage.style.setProperty('--tilt-left-y', `${y * -0.45}px`);
    stage.style.setProperty('--tilt-right-x', `${x * -0.7}px`);
    stage.style.setProperty('--tilt-right-y', `${y * -0.7}px`);
    stage.classList.add('is-active');
  });
  if (stage) stage.addEventListener('pointerleave', () => stage.classList.remove('is-active'));

  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--card-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--card-y', `${event.clientY - bounds.top}px`);
    });
  });
}

const revealElements = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window && motionEnabled) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealElements.forEach((element) => observer.observe(element));
  // Some older Samsung/Chromium builds expose IntersectionObserver but can
  // fail to deliver callbacks after restoring a tab. Never leave content hidden.
  window.setTimeout(() => {
    revealElements.forEach((element) => element.classList.add('visible'));
  }, 1800);
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const proofNumbers = [...document.querySelectorAll('[data-count]')];
const setProofNumber = (element, value) => {
  const pad = Number(element.dataset.pad || 0);
  const suffix = element.dataset.suffix || '';
  element.textContent = String(value).padStart(pad, '0') + suffix;
};
const animateProofNumber = (element) => {
  if (element.dataset.counted === 'true') return;
  element.dataset.counted = 'true';
  const target = Number(element.dataset.count || 0);
  if (!motionEnabled) {
    setProofNumber(element, target);
    return;
  }
  const started = performance.now();
  const duration = 1100;
  const tick = (now) => {
    const progress = Math.min(1, (now - started) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    setProofNumber(element, Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if ('IntersectionObserver' in window && motionEnabled) {
  const proofObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateProofNumber(entry.target);
      proofObserver.unobserve(entry.target);
    });
  }, { threshold: 0.45 });
  proofNumbers.forEach((number) => {
    setProofNumber(number, 0);
    proofObserver.observe(number);
  });
} else {
  proofNumbers.forEach((number) => animateProofNumber(number));
}

const showcaseStage = document.querySelector('.hero-visual');
const showcaseControls = [...document.querySelectorAll('[data-showcase-slide]')];
const showcaseFrames = {
  left: document.querySelector('[data-showcase-frame="left"]'),
  main: document.querySelector('[data-showcase-frame="main"]'),
  right: document.querySelector('[data-showcase-frame="right"]'),
};
const showcaseItems = [
  {
    src: '/assets/aara-grain.webp',
    alt: 'Aara and Grain website interface',
    label: 'Open the Aara and Grain live demo',
    href: 'https://seanpxxl.github.io/aara-and-grain-demo/',
    srcset: '/assets/aara-grain-640.webp 640w, /assets/aara-grain.webp 1000w',
  },
  {
    src: '/assets/nocturne-ink.webp',
    alt: 'Nocturne Ink website concept',
    label: 'Open the Nocturne Ink live demo',
    href: 'https://seanpxxl.github.io/nocturne-ink-demo/',
    srcset: '/assets/nocturne-ink-640.webp 640w, /assets/nocturne-ink.webp 900w',
  },
  {
    src: '/assets/services-showcase.webp',
    alt: 'Premium laptop website interface beside a smartphone video-editing timeline',
    label: 'Stech Digital services showcase',
    href: '',
    srcset: '/assets/services-showcase-640.webp 640w, /assets/services-showcase.webp 1122w',
  },
];

let activeShowcase = 2;
let showcaseTimer;
let showcaseSwitching = false;
let showcaseTouchX = null;

const assignShowcaseItem = (frame, item) => {
  if (!frame) return;
  const image = frame.querySelector('img');
  if (image) {
    image.src = item.src;
    image.srcset = item.srcset || '';
    image.alt = item.alt;
  }
  frame.setAttribute('aria-label', item.label);
  frame.classList.toggle('demo-showcase-link', Boolean(item.href));
  if (item.href) {
    frame.href = item.href;
    frame.target = '_blank';
    frame.rel = 'noopener';
  } else {
    frame.removeAttribute('href');
    frame.removeAttribute('target');
    frame.removeAttribute('rel');
  }
};

const scheduleShowcase = () => {
  window.clearTimeout(showcaseTimer);
  if (!motionEnabled || document.hidden) return;
  showcaseTimer = window.setTimeout(() => setShowcase((activeShowcase + 1) % showcaseItems.length), 5200);
};

const setShowcase = (nextIndex, animate = true) => {
  if (!showcaseStage || showcaseSwitching) return;
  const normalizedIndex = (nextIndex + showcaseItems.length) % showcaseItems.length;
  if (normalizedIndex === activeShowcase) {
    scheduleShowcase();
    return;
  }

  const commit = () => {
    assignShowcaseItem(showcaseFrames.main, showcaseItems[normalizedIndex]);
    assignShowcaseItem(showcaseFrames.left, showcaseItems[(normalizedIndex + 1) % showcaseItems.length]);
    assignShowcaseItem(showcaseFrames.right, showcaseItems[(normalizedIndex + 2) % showcaseItems.length]);
    activeShowcase = normalizedIndex;
    showcaseControls.forEach((control, index) => {
      const selected = index === activeShowcase;
      control.classList.toggle('active', selected);
      if (selected) control.setAttribute('aria-current', 'true');
      else control.removeAttribute('aria-current');
    });
    showcaseStage.classList.remove('is-switching');
    showcaseSwitching = false;
    scheduleShowcase();
  };

  window.clearTimeout(showcaseTimer);
  if (animate && motionEnabled) {
    showcaseSwitching = true;
    showcaseStage.classList.add('is-switching');
    window.setTimeout(commit, 220);
  } else {
    commit();
  }
};

showcaseControls.forEach((control) => {
  control.addEventListener('click', () => setShowcase(Number(control.dataset.showcaseSlide)));
});

if (showcaseStage) showcaseStage.addEventListener('pointerenter', () => window.clearTimeout(showcaseTimer));
if (showcaseStage) showcaseStage.addEventListener('pointerleave', scheduleShowcase);
if (showcaseStage) showcaseStage.addEventListener('focusin', () => window.clearTimeout(showcaseTimer));
if (showcaseStage) showcaseStage.addEventListener('focusout', (event) => {
  if (!showcaseStage.contains(event.relatedTarget)) scheduleShowcase();
});
if (showcaseStage) showcaseStage.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') showcaseTouchX = event.clientX;
}, { passive: true });
if (showcaseStage) showcaseStage.addEventListener('pointerup', (event) => {
  if (showcaseTouchX === null || event.pointerType !== 'touch') return;
  const distance = event.clientX - showcaseTouchX;
  showcaseTouchX = null;
  if (Math.abs(distance) > 42) setShowcase(activeShowcase + (distance < 0 ? 1 : -1));
}, { passive: true });
document.addEventListener('visibilitychange', scheduleShowcase);
scheduleShowcase();

const cookieBanner = document.querySelector('[data-cookie-banner]');
const acceptAnalytics = () => {
  safeStorage.set('stech-analytics-consent', 'accepted');
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    loadAnalytics();
  }
  if (cookieBanner) cookieBanner.setAttribute('hidden', '');
};
const declineAnalytics = () => {
  safeStorage.set('stech-analytics-consent', 'declined');
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
  }
  if (cookieBanner) cookieBanner.setAttribute('hidden', '');
};
if (!safeStorage.get('stech-analytics-consent') && cookieBanner) cookieBanner.removeAttribute('hidden');
const cookieAccept = document.querySelector('[data-cookie-accept]');
const cookieDecline = document.querySelector('[data-cookie-decline]');
const cookieSettings = document.querySelector('[data-cookie-settings]');
if (cookieAccept) cookieAccept.addEventListener('click', acceptAnalytics);
if (cookieDecline) cookieDecline.addEventListener('click', declineAnalytics);
if (cookieSettings) cookieSettings.addEventListener('click', () => {
  if (cookieBanner) cookieBanner.removeAttribute('hidden');
});

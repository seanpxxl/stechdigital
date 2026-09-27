const menuButton = document.querySelector('.menu');
const mobileNav = document.querySelector('.mobile-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileNav?.classList.toggle('open', !open);
});

mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
}));

document.querySelector('#year').textContent = String(new Date().getFullYear());

const progress = document.querySelector('.page-progress span');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let ticking = false;

const updateScrollEffects = () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = available > 0 ? window.scrollY / available : 0;
  progress?.style.setProperty('transform', `scaleX(${Math.min(1, Math.max(0, ratio))})`);
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });
updateScrollEffects();

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const stage = document.querySelector('.tilt-stage');
  window.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
  }, { passive: true });

  stage?.addEventListener('pointermove', (event) => {
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
  stage?.addEventListener('pointerleave', () => stage.classList.remove('is-active'));

  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--card-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--card-y', `${event.clientY - bounds.top}px`);
    });
  });
}

if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
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
    src: 'assets/aara-grain.webp',
    alt: 'Aara and Grain website interface',
    label: 'Open the Aara and Grain live demo',
    href: 'https://seanpxxl.github.io/aara-and-grain-demo/',
  },
  {
    src: 'assets/nocturne-ink.webp',
    alt: 'Nocturne Ink website concept',
    label: 'Open the Nocturne Ink live demo',
    href: 'https://seanpxxl.github.io/nocturne-ink-demo/',
  },
  {
    src: 'assets/services-showcase.webp',
    alt: 'Premium laptop website interface beside a smartphone video-editing timeline',
    label: 'Stech Digital services showcase',
    href: '',
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
  if (reducedMotion || document.hidden) return;
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
  if (animate && !reducedMotion) {
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

showcaseStage?.addEventListener('pointerenter', () => window.clearTimeout(showcaseTimer));
showcaseStage?.addEventListener('pointerleave', scheduleShowcase);
showcaseStage?.addEventListener('focusin', () => window.clearTimeout(showcaseTimer));
showcaseStage?.addEventListener('focusout', (event) => {
  if (!showcaseStage.contains(event.relatedTarget)) scheduleShowcase();
});
showcaseStage?.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') showcaseTouchX = event.clientX;
}, { passive: true });
showcaseStage?.addEventListener('pointerup', (event) => {
  if (showcaseTouchX === null || event.pointerType !== 'touch') return;
  const distance = event.clientX - showcaseTouchX;
  showcaseTouchX = null;
  if (Math.abs(distance) > 42) setShowcase(activeShowcase + (distance < 0 ? 1 : -1));
}, { passive: true });
document.addEventListener('visibilitychange', scheduleShowcase);
scheduleShowcase();

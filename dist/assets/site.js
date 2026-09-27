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

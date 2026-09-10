// Scroll reveal for the struggles lines.
//
// IntersectionObserver rather than a scroll listener, so nothing runs on the
// main thread while scrolling. Each line unobserves once revealed — the effect
// is an arrival, not a toggle, and re-animating on scroll-up looks broken.
(function () {
  'use strict';

  var lines = [].slice.call(document.querySelectorAll('.reveal-line'));
  if (!lines.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // No IO support, or motion is unwanted: show everything immediately. The
  // content must never depend on the animation running.
  if (reduced || !('IntersectionObserver' in window)) {
    lines.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });

  lines.forEach(function (el) { io.observe(el); });
})();

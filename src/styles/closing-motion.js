// Arrival motion for the closing CTA.
//
// IntersectionObserver, not a scroll listener: nothing runs on the main thread
// while scrolling, and each panel unobserves once it has arrived. The effect is
// an arrival, not a toggle — re-running it on scroll-up looks broken.
//
// The panel is fully visible with no class applied; `.is-in` only releases a
// transform the CSS put there. If this script never runs, the CSS guards below
// still show everything, and if IntersectionObserver is missing we add the
// class immediately. A decoration must never be able to hide content.
(function () {
  'use strict';

  var panels = [].slice.call(document.querySelectorAll('.cta-motion'));
  if (!panels.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    panels.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });

  panels.forEach(function (el) { io.observe(el); });
})();

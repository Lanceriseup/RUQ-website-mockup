// Behaviour for the explore pages (Courses, Masterclasses, Events, Coaching,
// Free resource) in every design direction. Loaded only on pages that render
// [data-xp] — see build.mjs.
//
//   [data-xp-rv]       reveal on scroll: gets .is-in once it is on screen
//   [data-xp-draw]     an SVG path that draws itself as the page scrolls past
//                      it (stroke-dashoffset follows scroll progress)
//   [data-xp-waitlist] the masterclass picker: keeps the disabled submit
//                      button's label in step with the chosen class
//
// Everything degrades to "shown, finished": reduced motion, Save-Data, or no
// IntersectionObserver and the content is simply there.
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- reveal
  var items = [].slice.call(document.querySelectorAll('[data-xp-rv]'));
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    doc.classList.add('xp-anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  // ---- scroll-drawn paths
  var paths = [].slice.call(document.querySelectorAll('[data-xp-draw]'));
  if (paths.length) {
    paths.forEach(function (p) {
      var len = p.getTotalLength ? p.getTotalLength() : 0;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reduced ? 0 : len;
      p.__len = len;
    });
    if (!reduced) {
      var ticking = false;
      var draw = function () {
        ticking = false;
        var vh = window.innerHeight;
        paths.forEach(function (p) {
          var box = (p.ownerSVGElement || p).getBoundingClientRect();
          // 0 when the top of the drawing reaches 85% down the viewport,
          // 1 when its bottom reaches 55% — so the line leads the reader.
          var start = vh * 0.85, end = vh * 0.55;
          var t = (start - box.top) / Math.max(1, (box.height + start - end));
          t = Math.max(0, Math.min(1, t));
          p.style.strokeDashoffset = p.__len * (1 - t);
        });
      };
      var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(draw); } };
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
      draw();
    }
  }

  // ---- masterclass picker
  document.querySelectorAll('[data-xp-waitlist]').forEach(function (wl) {
    var label = wl.querySelector('[data-xp-wl-label]');
    if (!label) return;
    wl.addEventListener('change', function (e) {
      var t = e.target;
      if (t && t.dataset && t.dataset.xpWl) label.textContent = t.dataset.xpWl;
    });
  });
})();

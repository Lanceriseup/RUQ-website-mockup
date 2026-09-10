// Rotating headline word.
//
// Every word is stacked in one inline-grid cell, so the widest sets the width
// and the line never reflows mid-swap. Only the visible one is exposed to
// assistive tech and the full sentence is announced once via a visually hidden
// copy, so a screen reader hears one coherent sentence rather than a word
// changing under it every three seconds.
(function () {
  'use strict';

  var INTERVAL = 2600;
  var rotators = [].slice.call(document.querySelectorAll('.hero-rotator'));
  if (!rotators.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  rotators.forEach(function (r) {
    var words = [].slice.call(r.querySelectorAll('.hero-word'));
    var rule = r.querySelector('.hero-underline');
    if (words.length < 2) return;

    // The rotator is decorative motion over text that is already in the DOM;
    // the first word stays readable if nothing animates.
    words.forEach(function (w, i) { w.setAttribute('aria-hidden', i === 0 ? 'false' : 'true'); });

    if (reduced) return;   // hold on the first word, no cycling

    var i = 0;
    var swap = r.dataset.swap || 'rise';
    var timer = null;

    function step() {
      var out = words[i];
      i = (i + 1) % words.length;
      var next = words[i];

      out.classList.remove('is-on');
      out.classList.add('is-out');
      out.setAttribute('aria-hidden', 'true');

      next.classList.remove('is-out');
      next.classList.add('is-on');
      next.setAttribute('aria-hidden', 'false');

      window.setTimeout(function () { out.classList.remove('is-out'); }, 600);

      if (rule) {
        // Re-run the underline sweep in step with the word.
        rule.style.transform = 'scaleX(0)';
        window.setTimeout(function () { rule.style.transform = 'scaleX(1)'; }, 90);
      }
    }

    r.dataset.mode = swap;
    if (rule) rule.style.transform = 'scaleX(1)';

    function start() { if (!timer) timer = window.setInterval(step, INTERVAL); }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }

    // Pause when the hero is off-screen or the tab is hidden — no point
    // animating something nobody is looking at.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }, { threshold: 0 }).observe(r);
    } else {
      start();
    }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
  });
})();

// Behaviour for the coaching directions (src/partials/coaching-options.mjs).
//
//   [data-co-pick]   opens dialog.co-dlg with the intro-call form, its
//                    "Preferred Coach" pre-filled with the button's name (the
//                    form reads ?<fieldKey>=<option label>); the frame loads
//                    only now. stay.js sizes it.
//   [data-co-spot]   A: the filmstrip's tabs switch the coach on the stage;
//                    it moves on by itself until the visitor picks one
//   [data-co-match]  B: choosing a line brings that coach forward
//   [data-co-rv]     C, D: reveal on scroll (.is-in)
//   [data-co-card-flip]  D: tilts toward the cursor
//   [data-co-open]   D: opens that coach's dialog.co-cdlg; her video's
//                    iframe gets its src then and loses it on close, which
//                    stops playback
//
// Without JS every coach and her words show; the dialog does not open.
(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- the intro-call dialog
  var dlg = document.querySelector('dialog.co-dlg');
  var frame = dlg && dlg.querySelector('iframe[data-sc-src]');
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-co-pick]');
    if (b && dlg && dlg.showModal) {
      var inside = b.closest('dialog.co-cdlg');
      if (inside) inside.close();
      var name = b.dataset.coPick;
      // the side panel (co-form-side): her portrait and name, or the four
      // coaches' first portrait and no name from the closing's button
      var img = dlg.querySelector('[data-co-side-img]');
      if (img) {
        dlg.classList.toggle('has-coach', !!name);
        if (b.dataset.coPhoto) img.src = b.dataset.coPhoto;
        dlg.querySelector('[data-co-side-name]').textContent = name;
        dlg.querySelector('[data-co-side-role]').textContent = b.dataset.coRole || '';
      }
      var src = frame.dataset.scSrc + (name ? '&' + frame.dataset.coField + '=' + encodeURIComponent(name) : '');
      if (frame.getAttribute('src') !== src) {
        frame.setAttribute('src', src);
        // a fresh form: drop the thank-you size stay.js set after a submit
        delete frame.dataset.scDone;
        frame.style.height = '';
      }
      dlg.showModal();
      return;
    }
    if (dlg && (e.target === dlg || (e.target.closest && e.target.closest('[data-co-close]')))) dlg.close();
  });

  // ---- reveal
  var rv = [].slice.call(document.querySelectorAll('[data-co-rv]'));
  if (rv.length && 'IntersectionObserver' in window && !reduced) {
    document.documentElement.classList.add('co-anim');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  }

  // ---- A: spotlight
  var spot = document.querySelector('[data-co-spot]');
  if (spot) {
    var tabs = [].slice.call(spot.querySelectorAll('[data-co-tab]'));
    var slides = [].slice.call(spot.querySelectorAll('[data-co-slide]'));
    var cur = 0, timer = null;
    var show = function (i) {
      cur = i;
      tabs.forEach(function (t, k) { t.classList.toggle('is-on', k === i); t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      slides.forEach(function (s, k) {
        s.classList.toggle('is-on', k === i);
      });
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; spot.classList.add('is-held'); } };
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { stop(); show(k); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault(); stop();
        var n = (k + d + tabs.length) % tabs.length;
        show(n); tabs[n].focus();
      });
    });
    spot.addEventListener('pointerdown', stop);
    spot.addEventListener('focusin', stop);
    if (!reduced) timer = setInterval(function () { show((cur + 1) % tabs.length); }, 7000);
  }

  // ---- B: match
  var match = document.querySelector('[data-co-match]');
  if (match) {
    var opts = [].slice.call(match.querySelectorAll('[data-co-opt]'));
    var fan = match.querySelector('[data-co-fan]');
    opts.forEach(function (o) {
      o.addEventListener('click', function () {
        var on = o.getAttribute('aria-pressed') !== 'true';
        opts.forEach(function (x) { x.setAttribute('aria-pressed', x === o && on ? 'true' : 'false'); });
        fan.classList.toggle('is-picked', on);
        [].forEach.call(fan.querySelectorAll('[data-co-card]'), function (c) {
          c.classList.toggle('is-on', on && c.dataset.coCard === o.dataset.coOpt);
        });
        // the fan is hidden on a phone; there the line goes to her card
        if (!fan.offsetParent) {
          var card = document.getElementById('co-' + o.dataset.coOpt);
          if (card) card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---- D: tilt, and each coach's pop-up
  [].forEach.call(document.querySelectorAll('dialog.co-cdlg'), function (d) {
    var f = d.querySelector('iframe[data-co-video]');
    d.addEventListener('close', function () { f.removeAttribute('src'); d.classList.remove('is-playing'); });
    d.addEventListener('click', function (e) {
      if (e.target === d || (e.target.closest && e.target.closest('[data-co-close]'))) d.close();
    });
  });
  document.addEventListener('click', function (e) {
    var o = e.target.closest && e.target.closest('[data-co-open]');
    if (!o) return;
    var d = document.getElementById(o.dataset.coOpen);
    if (!d || !d.showModal) return;
    // from one coach's pop-up straight to another's ("Meet the others")
    var from = o.closest('dialog.co-cdlg');
    if (from) from.close();
    var f = d.querySelector('iframe[data-co-video]');
    f.setAttribute('src', f.dataset.coVideo);
    f.addEventListener('load', function () { d.classList.add('is-playing'); }, { once: true });
    d.showModal();
  });
  [].forEach.call(document.querySelectorAll('[data-co-card-flip]'), function (card) {
    if (!reduced && window.matchMedia('(hover: hover)').matches) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--rx', ((e.clientY - r.top) / r.height - 0.5) * -10 + 'deg');
        card.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 12 + 'deg');
      });
      card.addEventListener('pointerleave', function () { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    }
  });
})();

// Behaviour for the "Stay connected" options (src/partials/stay-options.mjs).
//
//   iframe[data-sc-form]  the MultiplyOS form. It posts
//                         { type: 'mos-form-height', height } as it grows, so
//                         the frame takes its height and never scrolls
//   [data-sc-pop]         F: slides in once the Freedom wall is behind the
//                         visitor; [data-sc-open] opens it to the form (which
//                         loads only then); [data-sc-dismiss] puts it away for
//                         the rest of the visit
(function () {
  'use strict';
  // The height it posts is the frame document's scrollHeight, which is never
  // less than the frame itself, and it can keep growing. So a frame with
  // data-sc-fixed keeps the height it was given and ignores it (the client's
  // ask, 2026-11-04). One without (the coaching form) starts shorter than the
  // form (stay.css) and grows to fit.
  // After a submit, a frame with data-sc-next sends the whole page there. One
  // without stays and shows the form's own thank-you, a short card at the top
  // of a frame still the form's height; so the frame is cut to the card
  // (THANKS) and stops taking heights, which arrive stale and would stretch
  // it again. Setting a new src (coaching.js, another coach) undoes that.
  var THANKS = 252;
  var frames = [].slice.call(document.querySelectorAll('iframe[data-sc-form]'));
  if (frames.length) {
    window.addEventListener('message', function (e) {
      var d = e.data || {};
      frames.forEach(function (f) {
        if (e.source !== f.contentWindow || e.origin !== f.dataset.scOrigin) return;
        if (d.type === 'mos-form-height' && d.height > 0 && !f.hasAttribute('data-sc-fixed') && !f.dataset.scDone) f.style.height = Math.ceil(d.height) + 'px';
        if (d.type === 'mos-form-submitted') {
          if (f.dataset.scNext) window.location.href = f.dataset.scNext;
          else { f.dataset.scDone = '1'; f.style.height = THANKS + 'px'; }
        }
      });
    });
  }

  // The animated "Stay close" looks in the Freedom note (noteStay's WOW
  // looks): play once, when the form is well in view. The plane's flight is
  // SMIL, so it is started here too. With reduced motion the CSS shows each
  // look finished and the plane stays put.
  var anims = [].slice.call(document.querySelectorAll('[data-sc-anim]'));
  if (anims.length) {
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var play = function (el) {
      el.classList.add('is-on');
      if (still) return;
      [].forEach.call(el.querySelectorAll('animateMotion'), function (a) { try { a.beginElement(); } catch (e) {} });
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.45 });
      anims.forEach(function (el) { io.observe(el); });
    } else anims.forEach(play);
  }

  var pop = document.querySelector('[data-sc-pop]');
  if (!pop) return;
  var KEY = 'sc-dismissed';
  try { if (sessionStorage.getItem(KEY) === '1') return; } catch (e) {}

  var after = document.getElementById('freedom');
  var shown = false;
  function check() {
    if (shown) return;
    var past = after ? after.getBoundingClientRect().bottom < innerHeight * 0.5 : scrollY > innerHeight;
    if (!past) return;
    shown = true;
    removeEventListener('scroll', check);
    pop.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { pop.classList.add('is-in'); }); });
  }
  addEventListener('scroll', check, { passive: true });
  addEventListener('load', check);
  check();

  var open = pop.querySelector('[data-sc-open]');
  var box = pop.querySelector('.sc-f-form');
  open.addEventListener('click', function () {
    var f = box.querySelector('iframe[data-sc-src]');
    if (f && !f.getAttribute('src')) f.setAttribute('src', f.dataset.scSrc);
    box.hidden = false;
    pop.classList.add('is-open');
    open.setAttribute('aria-expanded', 'true');
  });
  pop.querySelector('[data-sc-dismiss]').addEventListener('click', function () {
    pop.classList.remove('is-in');
    setTimeout(function () { pop.hidden = true; }, 450);
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  });
})();

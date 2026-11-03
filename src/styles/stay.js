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
  // form (stay.css) and grows to fit, and after a submit, when the thank-you
  // is shorter than the form, it is cut back so it can shrink to fit again.
  // After a submit, a frame with data-sc-next sends the whole page there.
  var frames = [].slice.call(document.querySelectorAll('iframe[data-sc-form]'));
  if (frames.length) {
    window.addEventListener('message', function (e) {
      var d = e.data || {};
      frames.forEach(function (f) {
        if (e.source !== f.contentWindow || e.origin !== f.dataset.scOrigin) return;
        if (d.type === 'mos-form-height' && d.height > 0 && !f.hasAttribute('data-sc-fixed')) f.style.height = Math.ceil(d.height) + 'px';
        if (d.type === 'mos-form-submitted') {
          if (f.dataset.scNext) window.location.href = f.dataset.scNext;
          else if (!f.hasAttribute('data-sc-fixed')) f.style.height = '160px';
        }
      });
    });
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

// Behaviour for the policy pages (src/partials/legal-options.mjs).
//
//   .lg-top          Back to top, shown once the reader is a screen down
//   [data-lg-toc]    the contents list: the section in view is marked; on a
//                    phone the list starts closed and closes after a jump
//   [data-lg-all]    Open all / Close all for the fold-out sections
//   a link to #id inside a closed fold-out section opens it first
(function () {
  'use strict';
  var top = document.querySelector('.lg-top');
  if (top) {
    var onScroll = function () { top.classList.toggle('is-on', scrollY > innerHeight * 0.9); };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  var toc = document.querySelector('[data-lg-toc]');
  if (toc) {
    var narrow = matchMedia('(max-width: 1023px)');
    if (narrow.matches) toc.open = false;
    // On desktop the list is always open: its summary is a label, not a toggle.
    toc.querySelector('summary').addEventListener('click', function (e) { if (!narrow.matches) e.preventDefault(); });
    var links = [].slice.call(toc.querySelectorAll('a'));
    links.forEach(function (a) { a.addEventListener('click', function () { if (narrow.matches) toc.open = false; }); });
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var heads = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var mark = function () {
      var cur = heads[0];
      heads.forEach(function (h) { if (h.getBoundingClientRect().top < 160) cur = h; });
      links.forEach(function (a) { a.classList.toggle('is-on', cur && byId[cur.id] === a); });
      var on = cur && byId[cur.id], list = toc.querySelector('ol');
      if (on && !narrow.matches) {
        var r = on.offsetTop - list.clientHeight / 2;
        if (Math.abs(list.scrollTop - r) > list.clientHeight / 3) list.scrollTop = r;
      }
    };
    var tick = false;
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; mark(); }); } }, { passive: true });
    mark();
  }

  var folds = [].slice.call(document.querySelectorAll('.lg-fd'));
  var all = document.querySelector('[data-lg-all]');
  if (all) {
    var sync = function () {
      var open = folds.every(function (d) { return d.open; });
      all.textContent = open ? 'Close all' : 'Open all';
      all.setAttribute('aria-pressed', open ? 'true' : 'false');
    };
    all.addEventListener('click', function () {
      var open = !folds.every(function (d) { return d.open; });
      folds.forEach(function (d) { d.open = open; });
      sync();
    });
    folds.forEach(function (d) { d.addEventListener('toggle', sync); });
  }
  // #sms and the like: open the section holding the target, then go to it.
  var reveal = function () {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (!el) return;
    var d = el.closest('details');
    if (d && !d.open) { d.open = true; requestAnimationFrame(function () { el.scrollIntoView(); }); }
  };
  addEventListener('hashchange', reveal); reveal();
})();

// Announcement banner (src/partials/announce.mjs).
//
// 1. Keeps the over-hero header clear of the bar: writes the bar's height to
//    --ann-h, which announce.css uses as the absolute header's top. Measured,
//    not hard-coded, because the bar's height changes at the phone breakpoint
//    and with font loading.
// 2. Drives the live countdown in the `countdown` style. Ticks once a second,
//    writes only text, and hides the counter once the event has started.
(function () {
  'use strict';
  var bar = document.getElementById('announce');
  if (!bar) return;

  var root = document.documentElement;
  function measure() { root.style.setProperty('--ann-h', bar.offsetHeight + 'px'); }
  measure();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(bar);
  else window.addEventListener('resize', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  var cd = bar.querySelector('[data-ann-cd]');
  if (!cd) return;
  var target = Date.parse(cd.getAttribute('data-ann-cd'));
  if (isNaN(target)) return;
  var out = {};
  ['d', 'h', 'm', 's'].forEach(function (u) { out[u] = cd.querySelector('[data-u="' + u + '"]'); });
  var counter = cd.querySelector('.ann-cd');
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  var timer;
  function tick() {
    var left = Math.floor((target - Date.now()) / 1000);
    if (left <= 0) { if (counter) counter.style.display = 'none'; clearInterval(timer); measure(); return; }
    out.d.textContent = Math.floor(left / 86400);
    out.h.textContent = pad(Math.floor(left % 86400 / 3600));
    out.m.textContent = pad(Math.floor(left % 3600 / 60));
    out.s.textContent = pad(left % 60);
  }
  tick();
  timer = setInterval(tick, 1000);
})();

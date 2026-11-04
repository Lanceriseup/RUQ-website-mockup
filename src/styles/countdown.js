// Live countdowns to the next events.
//
// Every [data-countdown] on the page counts to its own date (the checkout
// has one per date since 2026-11-05, each shown with its date; until then
// only the first on a page ran). Ticks once a second, writes only text, and
// stops a counter once its date has passed rather than counting up into
// negatives — an event page showing "-42 days" is worse than showing nothing.
(function () {
  'use strict';

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  var counters = [].slice.call(document.querySelectorAll('[data-countdown]')).map(function (root) {
    var target = Date.parse(root.dataset.countdown);
    if (isNaN(target)) return null;
    return {
      root: root,
      target: target,
      done: false,
      out: {
        days: root.querySelector('.cd-days'),
        hours: root.querySelector('.cd-hours'),
        minutes: root.querySelector('.cd-minutes'),
        seconds: root.querySelector('.cd-seconds'),
      },
    };
  }).filter(Boolean);
  if (!counters.length) return;

  var timer = null;

  function tickOne(c) {
    if (c.done) return;
    var left = c.target - Date.now();
    if (left <= 0) {
      // Past the start: hide the counter rather than run negative.
      c.root.querySelectorAll('[data-countdown-box], .cd-days, .cd-hours, .cd-minutes, .cd-seconds')
        .forEach(function (el) { el.textContent = '00'; });
      var wrap = c.root.querySelector('.cd-days');
      if (wrap && wrap.closest('div').parentElement) {
        wrap.closest('div').parentElement.style.display = 'none';
      }
      c.done = true;
      return;
    }
    var s = Math.floor(left / 1000);
    if (c.out.days) c.out.days.textContent = String(Math.floor(s / 86400));
    if (c.out.hours) c.out.hours.textContent = pad(Math.floor(s / 3600) % 24);
    if (c.out.minutes) c.out.minutes.textContent = pad(Math.floor(s / 60) % 60);
    if (c.out.seconds) c.out.seconds.textContent = pad(s % 60);
  }

  function tick() {
    counters.forEach(tickOne);
    if (counters.every(function (c) { return c.done; }) && timer) { clearInterval(timer); timer = null; }
  }

  tick();
  timer = setInterval(tick, 1000);

  // Stop while the tab is hidden; resync on return so it never drifts.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (timer) { clearInterval(timer); timer = null; }
    } else if (!timer && !counters.every(function (c) { return c.done; })) {
      tick();
      timer = setInterval(tick, 1000);
    }
  });
})();

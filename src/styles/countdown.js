// Live countdown to the next event.
//
// Ticks once a second, writes only text, and stops itself once the date has
// passed rather than counting up into negatives — an event page showing
// "-42 days" is worse than showing nothing.
(function () {
  'use strict';

  var root = document.querySelector('[data-countdown]');
  if (!root) return;

  var target = Date.parse(root.dataset.countdown);
  if (isNaN(target)) return;

  var out = {
    days: root.querySelector('.cd-days'),
    hours: root.querySelector('.cd-hours'),
    minutes: root.querySelector('.cd-minutes'),
    seconds: root.querySelector('.cd-seconds'),
  };

  var timer = null;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var left = target - Date.now();

    if (left <= 0) {
      // Past the start: hide the counter rather than run negative.
      root.querySelectorAll('[data-countdown-box], .cd-days, .cd-hours, .cd-minutes, .cd-seconds')
        .forEach(function (el) { el.textContent = '00'; });
      var wrap = root.querySelector('.cd-days');
      if (wrap && wrap.closest('div').parentElement) {
        wrap.closest('div').parentElement.style.display = 'none';
      }
      if (timer) { clearInterval(timer); timer = null; }
      return;
    }

    var s = Math.floor(left / 1000);
    if (out.days) out.days.textContent = String(Math.floor(s / 86400));
    if (out.hours) out.hours.textContent = pad(Math.floor(s / 3600) % 24);
    if (out.minutes) out.minutes.textContent = pad(Math.floor(s / 60) % 60);
    if (out.seconds) out.seconds.textContent = pad(s % 60);
  }

  tick();
  timer = setInterval(tick, 1000);

  // Stop while the tab is hidden; resync on return so it never drifts.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (timer) { clearInterval(timer); timer = null; }
    } else if (!timer) {
      tick();
      timer = setInterval(tick, 1000);
    }
  });
})();

// Behaviour for the Events page directions (src/partials/events-options.mjs).
//
//   [data-ev-rv]     reveal on scroll (.is-in), gated by html.ev-anim
//   [data-ev-trail]  A: draws a winding path through each stop's crown and
//                    inks it to the scroll position; the stop nearest the
//                    middle of the screen lights up (.is-lit)
//   [data-ev-steps]  C: the rail's step for the panel in view is .is-on and
//                    the rail's line fills to it
//   [data-ev-open]   D: opens that card's dialog; [data-ev-close] and a click
//                    on the backdrop close it
//
// Without JS every program shows, and the rail and map are plain links.
(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- reveal
  var rv = [].slice.call(document.querySelectorAll('[data-ev-rv]'));
  if (rv.length && 'IntersectionObserver' in window && !reduced) {
    document.documentElement.classList.add('ev-anim');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  }

  // ---- A: the trail
  //   The ink runs to the point on the path level with 60% of the screen
  //   height, so its head is always in the same place on screen. That point
  //   comes from a table of the path's lengths against the lowest y reached
  //   so far, so a path that loops back up (ev-mk-loop) still inks forward.
  //   Stop markers follow the .ev's ev-mk-* class: loop ties a loop in the
  //   ribbon at each stop, label prints each stop's number on the ribbon
  //   (shown once inked); the rest are CSS. [data-ev-rider] rides that head;
  //   stops whose crown the ink has reached are .is-passed; the stop nearest
  //   mid-screen is .is-lit and named in [data-ev-count]; --ev-p (0–1) on
  //   .ev is how far down the trail the visitor is, and --ev-y on each stop
  //   its offset from mid-screen (-1 above to 1 below), for parallax.
  var trail = document.querySelector('[data-ev-trail]');
  if (trail) {
    var root = trail.closest('.ev') || document.documentElement;
    var svg = trail.querySelector('svg');
    var paths = [].slice.call(svg.querySelectorAll('path'));
    var ink = svg.querySelector('.ev-trail-ink');
    var inked = [].slice.call(svg.querySelectorAll('.ev-trail-ink, .ev-trail-sheen'));
    var rider = trail.querySelector('[data-ev-rider]');
    var count = trail.querySelector('[data-ev-count]');
    var stops = [].slice.call(trail.querySelectorAll('[data-ev-stop]'));
    var nodes = [];
    var len = 0;
    var table = [];
    var mk = (root.className.match(/\bev-mk-(\w+)/) || [])[1] || '';
    var labels = [];
    var at = function (y) {
      var lo = 0, hi = table.length - 1;
      if (!table.length || y >= table[hi][1]) return len;
      while (hi - lo > 1) {
        var m = (lo + hi) >> 1;
        if (table[m][1] < y) lo = m; else hi = m;
      }
      var a = table[lo], b = table[hi], f = b[1] > a[1] ? (y - a[1]) / (b[1] - a[1]) : 0;
      return a[0] + (b[0] - a[0]) * Math.max(0, Math.min(1, f));
    };
    var lengthAtY = function (y) {
      for (var k = 0; k < table.length; k++) if (table[k][2] >= y - 0.5) return table[k][0];
      return len;
    };
    var build = function () {
      var t = trail.getBoundingClientRect();
      var pts = stops.map(function (s) {
        var n = s.querySelector('[data-ev-node]').getBoundingClientRect();
        return [n.left + n.width / 2 - t.left, n.top + n.height / 2 - t.top];
      });
      if (!pts.length) return;
      var wide = innerWidth >= 1024;
      // a loop: down, out to one side, up over the top and back down
      // through the stop, leaving it a little lower and heading down
      var r = wide ? 30 : 15;
      var loop = function (q, side) {
        // on a phone the ribbon runs down the left edge, so it loops inward
        if (!wide) side = 1;
        var x = q[0], y = q[1], k = side * r;
        return ' C' + x + ' ' + (y + r * 1.2) + ',' + (x + k * 2) + ' ' + (y + r * 1.2) + ',' + (x + k * 2) + ' ' + y +
          ' C' + (x + k * 2) + ' ' + (y - r * 1.4) + ',' + (x - k * 0.4) + ' ' + (y - r * 1.4) + ',' + (x - k * 0.2) + ' ' + y +
          ' C' + x + ' ' + (y + r * 0.8) + ',' + x + ' ' + (y + r * 1.4) + ',' + x + ' ' + (y + r * 2);
      };
      var d = 'M' + pts[0][0] + ' 0 L' + pts[0][0] + ' ' + pts[0][1];
      var cur = pts[0];
      if (mk === 'loop') { d += loop(pts[0], 1); cur = [pts[0][0], pts[0][1] + r * 2]; }
      for (var i = 1; i < pts.length; i++) {
        var a = cur, b = pts[i], my = (a[1] + b[1]) / 2;
        // on wide screens the path sways between stops, but only within the
        // gap between the two columns, so it never crosses the copy
        var sw = wide ? (i % 2 ? 1 : -1) * 46 : 0;
        d += ' C' + (a[0] + sw) + ' ' + my + ',' + (b[0] + sw) + ' ' + my + ',' + b[0] + ' ' + b[1];
        cur = b;
        if (mk === 'loop') { d += loop(b, i % 2 ? -1 : 1); cur = [b[0], b[1] + r * 2]; }
      }
      d += ' L' + cur[0] + ' ' + t.height;
      paths.forEach(function (p) { p.setAttribute('d', d); });
      len = ink.getTotalLength();
      inked.forEach(function (p) { p.style.strokeDasharray = len + ' ' + len; });
      // [length, lowest y so far, y] every ~4px along the path
      table = [];
      var lowest = -1e9, steps = Math.max(200, Math.ceil(len / 4));
      for (var j = 0; j <= steps; j++) {
        var l = len * j / steps, py = ink.getPointAtLength(l).y;
        lowest = Math.max(lowest, py);
        table.push([l, lowest, py]);
      }
      nodes = pts.map(function (q) { return lengthAtY(q[1]); });
      if (mk === 'label') {
        ink.id = ink.id || 'ev-ink-path';
        labels.forEach(function (x) { x.remove(); });
        labels = nodes.map(function (l, i) {
          var tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          tx.setAttribute('class', 'ev-trail-num');
          tx.setAttribute('dy', '.36em');
          var tp = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
          tp.setAttribute('href', '#' + ink.id);
          tp.setAttribute('startOffset', l);
          tp.textContent = String(i + 1).padStart(2, '0') + ' · ' + stops[i].dataset.evName.toUpperCase();
          tx.appendChild(tp);
          svg.appendChild(tx);
          return tx;
        });
      }
      draw();
    };
    var lastLit = null;
    var draw = function () {
      var t = trail.getBoundingClientRect();
      var y = innerHeight * 0.6 - t.top;
      var L = reduced ? len : (y <= 0 ? 0 : y >= t.height ? len : at(y));
      inked.forEach(function (p) { p.style.strokeDashoffset = len - L; });
      if (rider) {
        var pt = ink.getPointAtLength(Math.max(L, 0.01));
        var pb = ink.getPointAtLength(Math.max(L - 6, 0));
        rider.style.transform = 'translate(' + pt.x + 'px,' + pt.y + 'px)';
        // the ribbon's heading at its end, in degrees (90 = straight down),
        // for riders that turn with it (ev-rd-bow)
        if (pt.y - pb.y || pt.x - pb.x) rider.style.setProperty('--a', (Math.atan2(pt.y - pb.y, pt.x - pb.x) * 180 / Math.PI).toFixed(1) + 'deg');
        rider.classList.toggle('is-on', L > 1 && L < len - 1);
      }
      root.style.setProperty('--ev-p', Math.min(1, Math.max(0, y / t.height)).toFixed(4));
      var mid = innerHeight / 2, best = null, bd = 1e9;
      stops.forEach(function (s, i) {
        var r = s.getBoundingClientRect(), c = r.top + r.height / 2, dd = Math.abs(c - mid);
        if (dd < bd) { bd = dd; best = s; }
        var passed = L >= nodes[i] - 2;
        s.classList.toggle('is-passed', passed);
        if (labels[i]) labels[i].classList.toggle('is-on', passed);
        s.style.setProperty('--ev-y', Math.max(-1, Math.min(1, (c - mid) / innerHeight)).toFixed(3));
      });
      if (best !== lastLit) {
        lastLit = best;
        stops.forEach(function (s) { s.classList.toggle('is-lit', s === best); });
        if (count && best) {
          count.querySelector('b').textContent = String(stops.indexOf(best) + 1).padStart(2, '0');
          count.querySelector('em').textContent = best.dataset.evName;
        }
      }
      if (count) count.classList.toggle('is-on', t.top < innerHeight * 0.4 && t.bottom > innerHeight * 0.6);
    };
    addEventListener('scroll', draw, { passive: true });
    addEventListener('resize', build);
    addEventListener('load', build);
    if (window.ResizeObserver) new ResizeObserver(build).observe(trail);
    build();
  }

  // ---- C: steps rail
  var steps = document.querySelector('[data-ev-steps]');
  if (steps) {
    var links = [].slice.call(steps.querySelectorAll('[data-ev-link]'));
    var panels = [].slice.call(steps.querySelectorAll('[data-ev-panel]'));
    var fill = steps.querySelector('[data-ev-fill]');
    var on = function () {
      var mid = innerHeight * 0.45, cur = panels[0];
      panels.forEach(function (p) { if (p.getBoundingClientRect().top < mid) cur = p; });
      links.forEach(function (a) {
        var is = a.dataset.evLink === cur.id;
        a.classList.toggle('is-on', is);
        if (is && innerWidth < 1024 && a.scrollIntoView && a.parentNode.parentNode.scrollWidth > a.parentNode.parentNode.clientWidth) {
          var ol = a.parentNode.parentNode;
          ol.scrollTo({ left: a.offsetLeft - ol.clientWidth / 2 + a.offsetWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
        }
      });
      if (fill) fill.style.setProperty('--p', (panels.indexOf(cur) + 1) / panels.length);
    };
    var last = '';
    addEventListener('scroll', function () {
      var k = String(Math.round(scrollY / 40));
      if (k !== last) { last = k; on(); }
    }, { passive: true });
    on();
  }

  // ---- D: card dialogs
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-ev-open]');
    if (b) {
      var d = document.getElementById(b.dataset.evOpen);
      if (d && d.showModal) d.showModal();
      return;
    }
    var dlg = e.target.closest && e.target.closest('dialog.ev-dlg');
    // a film in the dialog plays in the site lightbox (app.js), which sits
    // below a modal dialog, so the dialog steps aside for it
    if (dlg && (e.target === dlg || e.target.closest('[data-ev-close]') || e.target.closest('.video-facade'))) dlg.close();
  });
})();

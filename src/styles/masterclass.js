// Behaviour for the Masterclasses page directions
// (src/partials/masterclass-options.mjs). explore.js still handles reveals,
// drawn swashes and the waitlist button label.
//
//   [data-mc-pick]   "Join the waitlist" on a class: ticks that class in the
//                    waitlist picker before the link scrolls down to it, or
//                    opens dialog.mc-dlg when the form lives in one
//   [data-mc-doors]  A — the door you point at, focus or tap opens wide
//   [data-mc-stack]  C — each stuck card sinks back as the next covers it
//   [data-mc-sel]    D — tabs; cycles on its own until the visitor touches it
//   [data-mc-gw]     E — pins the wall and turns scroll into a sideways walk
//   [data-mc-ix]     G — the row's photograph follows the cursor
//   [data-mc-story]  H — the arch cross-fades to the class mid-screen
//   (F, the deck, reuses [data-mc-stack])
//
// Without JS: every class is shown, the links still reach the form.
(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- pick a class on the way to the form; where the form lives in a
  // dialog (the deck with a closing section), open it
  var dlg = document.querySelector('dialog.mc-dlg');
  // the live MultiplyOS form, when the dialog embeds it
  var frame = dlg && dlg.querySelector('iframe[data-mc-form]');
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-mc-pick]');
    if (!a) return;
    var radio = document.querySelector('[data-xp-waitlist] input[type="radio"][value="' + a.dataset.mcPick + '"]');
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (frame) {
      // the form pre-fills a choice from ?<fieldKey>=<option label>; a new
      // class reloads it, the same class keeps whatever was typed
      var src = frame.dataset.mcForm + '&' + frame.dataset.mcField + '=' + encodeURIComponent(a.dataset.mcClass || '');
      if (frame.getAttribute('src') !== src) {
        frame.setAttribute('src', src);
        frame.style.height = ''; // back to the form's height, from a thank-you
      }
    }
    if (dlg && dlg.showModal) {
      e.preventDefault();
      dlg.showModal();
    }
  });
  if (dlg) {
    dlg.addEventListener('click', function (e) {
      // the close button, or a click on the backdrop (the dialog box itself)
      if (e.target === dlg || (e.target.closest && e.target.closest('[data-mc-close]'))) dlg.close();
    });
  }
  // The frame has a fixed height (masterclass.css) and is not resized from
  // the form's 'mos-form-height' messages, which can keep growing; after a
  // submit the visitor stays here and sees the form's own thank-you (the
  // client's ask, 2026-11-04). That card is short and sits at the top of the
  // frame, so the frame is cut to it and the dialog centres it.
  if (frame) {
    window.addEventListener('message', function (e) {
      if (e.origin !== frame.dataset.mcOrigin || e.source !== frame.contentWindow) return;
      if ((e.data || {}).type === 'mos-form-submitted') frame.style.height = '252px';
    });
  }

  // ---- A: doors
  document.querySelectorAll('[data-mc-doors]').forEach(function (row) {
    var doors = [].slice.call(row.querySelectorAll('[data-mc-door]'));
    var open = function (d) {
      if (d.classList.contains('is-open')) return;
      doors.forEach(function (x) { x.classList.toggle('is-open', x === d); });
    };
    doors.forEach(function (d) {
      d.addEventListener('mouseenter', function () { open(d); });
      d.addEventListener('focusin', function () { open(d); });
      d.addEventListener('click', function () { open(d); });
    });
  });

  // ---- C: stack
  var stack = document.querySelector('[data-mc-stack]');
  if (stack && !reduced) {
    var cards = [].slice.call(stack.querySelectorAll('[data-mc-card]'));
    var ticking = false;
    var update = function () {
      ticking = false;
      for (var i = 0; i < cards.length - 1; i++) {
        var cur = cards[i].getBoundingClientRect();
        var next = cards[i + 1].getBoundingClientRect();
        // 0 while the next card is a full card-height away, 1 once it has
        // slid all the way over this one.
        var cover = 1 - (next.top - cur.top) / Math.max(1, cur.height);
        cover = Math.max(0, Math.min(1, cover));
        cards[i].firstElementChild.style.setProperty('--cover', cover.toFixed(3));
      }
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
  }

  // ---- D: select
  document.querySelectorAll('[data-mc-sel]').forEach(function (sel) {
    var tabs = [].slice.call(sel.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var DWELL = 7000, timer = null, current = 0;

    var show = function (i, focus) {
      current = i;
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        panels[k].classList.toggle('is-active', on);
        if (on) { panels[k].removeAttribute('inert'); panels[k].removeAttribute('aria-hidden'); }
        else { panels[k].setAttribute('inert', ''); panels[k].setAttribute('aria-hidden', 'true'); }
      });
      if (focus) tabs[i].focus();
      // keep the chosen pill in view on phones without moving the page
      var row = tabs[i].parentElement;
      if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' });
    };

    var stop = function () {
      if (timer) clearInterval(timer);
      timer = null;
      sel.classList.remove('is-auto');
    };

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { stop(); show(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length, to = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') to = (i + 1) % n;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') to = (i - 1 + n) % n;
        else if (k === 'Home') to = 0;
        else if (k === 'End') to = n - 1;
        if (to === null) return;
        e.preventDefault(); stop(); show(to, true);
      });
    });
    sel.addEventListener('focusin', stop);
    sel.querySelector('.mc-stage').addEventListener('pointerdown', stop);

    // Cycle only while on screen, and never with reduced motion.
    if (!reduced && 'IntersectionObserver' in window) {
      sel.style.setProperty('--mc-dwell', DWELL + 'ms');
      var started = false;
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !started) {
            started = true;
            sel.classList.add('is-auto');
            timer = setInterval(function () {
              show((current + 1) % tabs.length);
              // restart the progress bar on the newly chosen tab
              var bar = tabs[current].querySelector('.mc-tab-bar i');
              if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
            }, DWELL);
          } else if (!e.isIntersecting && timer) stop();
        });
      }, { threshold: 0.3 }).observe(sel);
    }
  });

  // ---- E: gallery — pin the wall and walk it sideways (desktop only)
  var gw = document.querySelector('[data-mc-gw]');
  if (gw && !reduced) {
    var mq = window.matchMedia('(min-width: 960px)');
    var track = gw.querySelector('.mc-gw-track');
    var bar = gw.querySelector('.mc-gw-bar i');
    var shots = [].slice.call(gw.querySelectorAll('.mc-gw-photo img'));
    var dist = 0, gTick = false;
    var walk = function () {
      gTick = false;
      if (!gw.classList.contains('is-pinned')) return;
      var p = Math.max(0, Math.min(1, -gw.getBoundingClientRect().top / Math.max(1, dist)));
      track.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
      if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      // each photograph drifts a little against the walk
      shots.forEach(function (img) {
        var b = img.parentElement.getBoundingClientRect();
        var off = (b.left + b.width / 2 - innerWidth / 2) / innerWidth;
        img.style.setProperty('--px', (off * -40).toFixed(1) + 'px');
      });
    };
    var measure = function () {
      if (!mq.matches) {
        gw.classList.remove('is-pinned');
        gw.style.height = ''; track.style.transform = '';
        return;
      }
      gw.classList.add('is-pinned');
      track.style.transform = '';
      dist = Math.max(0, track.scrollWidth - innerWidth);
      gw.style.height = (innerHeight + dist) + 'px';
      walk();
    };
    addEventListener('scroll', function () { if (!gTick) { gTick = true; requestAnimationFrame(walk); } }, { passive: true });
    addEventListener('resize', measure);
    addEventListener('load', measure);
    measure();
  }

  // ---- G: index — the photograph follows the cursor over the names
  var ix = document.querySelector('[data-mc-ix]');
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 960px)');
  if (ix && fine && fine.matches) {
    var float = ix.querySelector('.mc-ix-float');
    var pics = [].slice.call(float.querySelectorAll('img'));
    var tx = 0, ty = 0, x = 0, y = 0, vx = 0, running = false;
    var follow = function () {
      var dx = tx - x;
      x += dx * 0.14; y += (ty - y) * 0.14;
      vx = vx * 0.8 + dx * 0.02;
      var rot = reduced ? 0 : Math.max(-8, Math.min(8, vx));
      float.style.transform = 'translate3d(' + (x - 125).toFixed(1) + 'px,' + (y - 160).toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg)';
      if (running) requestAnimationFrame(follow);
    };
    ix.querySelectorAll('.mc-ix-row').forEach(function (row) {
      var sum = row.querySelector('summary');
      sum.addEventListener('mouseenter', function (e) {
        if (!running) { x = tx = e.clientX; y = ty = e.clientY; running = true; requestAnimationFrame(follow); }
        pics.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('src') === row.dataset.photo); });
        float.classList.add('is-on');
      });
      sum.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
      sum.addEventListener('mouseleave', function () { float.classList.remove('is-on'); running = false; });
    });
  }

  // ---- H: story — the arch follows whichever class is mid-screen
  var st = document.querySelector('[data-mc-story]');
  if (st && 'IntersectionObserver' in window) {
    var steps = [].slice.call(st.querySelectorAll('[data-mc-step]'));
    var frames = [].slice.call(st.querySelectorAll('.mc-st-frame img'));
    var dots = [].slice.call(st.querySelectorAll('.mc-st-dots li'));
    var on = function (i) {
      [steps, frames, dots].forEach(function (set) {
        set.forEach(function (el, k) { el.classList.toggle('is-on', k === i); });
      });
    };
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) on(steps.indexOf(e.target)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { sio.observe(s); });
  }
})();

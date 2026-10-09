// Mobile nav + click-to-load video facades.
// Third-party players load only on user intent, so no Wistia/YouTube cookies or
// megabytes on first paint.
(function () {
  'use strict';

  // Mobile drawer (nav variants A, B, C).
  document.querySelectorAll('.nav-toggle').forEach(function (toggle) {
    var menu = document.getElementById(toggle.dataset.target);
    if (!menu) return;
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });
  });

  // Header submenus (nav-sub.mjs). Click toggles; on pointer devices hover
  // opens too, with a short close delay so the pointer can cross the gap to
  // the panel. Escape and a click outside close it. Opening one closes any
  // other, so the header and the capsule never both hold an open panel.
  (function navSub() {
    var subs = [].slice.call(document.querySelectorAll('[data-nav-sub]'));
    if (!subs.length) return;
    var hover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    function set(sub, open) {
      sub.toggleAttribute('data-open', open);
      sub.querySelector('[data-nav-sub-toggle]').setAttribute('aria-expanded', String(open));
    }
    function closeAll(except) { subs.forEach(function (s) { if (s !== except) set(s, false); }); }
    subs.forEach(function (sub) {
      var btn = sub.querySelector('[data-nav-sub-toggle]');
      var timer;
      btn.addEventListener('click', function () {
        var open = !sub.hasAttribute('data-open');
        closeAll(sub); set(sub, open);
      });
      if (hover) {
        sub.addEventListener('mouseenter', function () { clearTimeout(timer); closeAll(sub); set(sub, true); });
        sub.addEventListener('mouseleave', function () { timer = setTimeout(function () { set(sub, false); }, 220); });
      }
      sub.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sub.hasAttribute('data-open')) { set(sub, false); btn.focus(); }
      });
      sub.addEventListener('focusout', function (e) {
        if (!sub.contains(e.relatedTarget)) set(sub, false);
      });
    });
    document.addEventListener('click', function (e) {
      subs.forEach(function (s) { if (!s.contains(e.target)) set(s, false); });
    });
  })();

  // Phone drawer accordions (drawerSub in nav-sub.mjs).
  document.querySelectorAll('[data-nav-acc-toggle]').forEach(function (btn) {
    var list = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      list.hidden = open;
    });
  });

  // Scroll-morph header — only used by the variant F review page, kept so the
  // /nav-hero.html comparison stays honest. Harmless on the live site, where
  // no #morphNav exists.
  (function morphNav() {
    var nav = document.getElementById('morphNav');
    if (!nav || !('IntersectionObserver' in window)) return;
    var sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:80px;width:1px;pointer-events:none';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  })();

  // Freedom section arrival: one class starts the rise, the highlights and the
  // wave line (see .fr in tailwind.css). Without IntersectionObserver it is
  // shown at once — the copy must never depend on the animation running.
  (function freedom() {
    var s = document.querySelector('[data-fr]');
    if (!s) return;
    if (!('IntersectionObserver' in window)) { s.classList.add('is-in'); return; }
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      s.classList.add('is-in');
      io.disconnect();
    }, { threshold: 0.25 });
    io.observe(s);
  })();

  // Testimonials — centre stage. See the note at the top of
  // testimonials.mjs for why this one section plays video unprompted.
  //
  // Every 300ms the playing cards are re-checked; how they are chosen is set
  // by data-cs-mode (see below). A card's <video> is created the first time
  // it is picked and reused after that; losing the stage pauses it.
  // Only cards carrying data-preview take part. The comparison pages set
  // data-tp on the section to run their own version, so this steps aside.
  (function centreStage() {
    var sec = document.querySelector('[data-centre-stage]');
    if (!sec || sec.hasAttribute('data-tp')) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduced || saveData || !('IntersectionObserver' in window)) return;

    var rails = [].slice.call(sec.querySelectorAll('.rail'));
    var current = rails.map(function () { return null; });
    var visible = false;
    var timer = null;

    function video(card) {
      var v = card.querySelector('.cs-video');
      if (v) return v;
      var box = card.querySelector('span.relative.block') || card;
      v = document.createElement('video');
      v.className = 'cs-video';
      v.muted = true; v.playsInline = true; v.preload = 'none';
      v.setAttribute('aria-hidden', 'true');
      v.src = card.getAttribute('data-preview');
      // Loop a 6-second window from a quarter of the way in.
      var start = Math.floor((+card.getAttribute('data-seconds') || 30) * 0.25);
      v.addEventListener('loadedmetadata', function () { v.currentTime = start; });
      v.addEventListener('timeupdate', function () { if (v.currentTime > start + 6 || v.currentTime < start - 0.5) v.currentTime = start; });
      v.addEventListener('playing', function () { v.classList.add('is-on'); });
      box.appendChild(v);
      var tag = document.createElement('span');
      tag.className = 'cs-tag'; tag.setAttribute('aria-hidden', 'true');
      tag.innerHTML = '<i></i>Playing';
      card.appendChild(tag);
      return v;
    }

    function set(card, on) {
      if (!card) return;
      card.classList.toggle('is-playing', on);
      var v = video(card);
      if (on) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else { v.pause(); v.classList.remove('is-on'); }
    }

    // data-cs-mode on the section picks how the playing cards are chosen:
    //   centre    (default) the card nearest the middle of each rail
    //   shuffle   a random on-screen card in each rail, held HOLD ms, the two
    //             rails switching half a hold apart so something always changes
    //   anywhere  two random on-screen cards from either rail, switched together
    // A random pick that drifts towards the edge fades hands off early.
    var mode = sec.getAttribute('data-cs-mode') || 'centre';
    var HOLD = 7000;
    var due = [0, 0];
    var started = 0;
    // The last few women shown, so the same face doesn't come straight back.
    var recent = [];

    // A card keeps playing until it reaches the edge, but new picks come from
    // the middle stretch, so each has room to drift for its whole hold.
    function onScreen(c, inset) {
      var b = c.getBoundingClientRect(), w = window.innerWidth;
      return b.left > w * inset && b.right < w * (1 - inset);
    }
    function pool(i) {
      var cards = [].slice.call((i == null ? sec : rails[i]).querySelectorAll('.video-facade[data-preview]'));
      var busy = current.filter(Boolean).map(function (c) { return c.getAttribute('data-id'); });
      cards = cards.filter(function (c) { return busy.indexOf(c.getAttribute('data-id')) < 0; });
      var fresh = cards.filter(function (c) { return recent.indexOf(c.getAttribute('data-id')) < 0; });
      var zones = [[fresh, 0.14], [cards, 0.14], [fresh, 0.04], [cards, 0.04]];
      for (var z = 0; z < zones.length; z++) {
        var hit = zones[z][0].filter(function (c) { return onScreen(c, zones[z][1]); });
        if (hit.length) return hit;
      }
      return [];
    }
    function pick(list, avoid) {
      // Keep two picks apart, so they never sit side by side or stacked.
      var ok = list.filter(function (c) {
        return !avoid || Math.abs(c.getBoundingClientRect().left - avoid.getBoundingClientRect().left) > c.offsetWidth * 1.5;
      });
      list = ok.length ? ok : list;
      var c = list.length ? list[Math.floor(Math.random() * list.length)] : null;
      if (c) { recent.push(c.getAttribute('data-id')); if (recent.length > 4) recent.shift(); }
      return c;
    }
    function swap(slot, card) {
      set(current[slot], false);
      current[slot] = card;
      set(card, true);
      if (card) { card.style.setProperty('--cs-hold', HOLD + 'ms'); }
    }

    function tick() {
      if (mode === 'centre') {
        var mid = window.innerWidth / 2;
        rails.forEach(function (rail, i) {
          var best = null, gap = Infinity;
          rail.querySelectorAll('.video-facade[data-preview]').forEach(function (c) {
            var b = c.getBoundingClientRect();
            var d = Math.abs(b.left + b.width / 2 - mid);
            if (d < gap) { gap = d; best = c; }
          });
          if (best !== current[i]) { set(current[i], false); set(best, true); current[i] = best; }
        });
        return;
      }
      var t = Date.now() - started;
      if (mode === 'shuffle') {
        rails.forEach(function (_, i) {
          var c = current[i];
          if (t >= due[i] || (c && !onScreen(c, 0.01))) {
            var other = current[1 - i];
            current[i] = null;
            set(c, false);
            swap(i, pick(pool(i), other));
            // Both rows start together; the second's first turn is half a
            // hold, which puts the two half a beat apart from then on.
            due[i] = t + (t < 1000 && i === 1 ? HOLD / 2 : HOLD);
          }
        });
        return;
      }
      // anywhere
      var gone = current.some(function (c) { return !c || !onScreen(c, 0.01); });
      if (t >= due[0] || gone) {
        var old = current.slice();
        current = [null, null];
        old.forEach(function (c) { set(c, false); });
        var first = pick(pool());
        current[0] = first; set(first, true);
        if (first) first.style.setProperty('--cs-hold', HOLD + 'ms');
        var second = pick(pool(), first);
        current[1] = second; set(second, true);
        if (second) second.style.setProperty('--cs-hold', HOLD + 'ms');
        due[0] = t + HOLD;
      }
    }

    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !timer) {
        started = Date.now();
        due = [0, 0];
        tick(); timer = setInterval(tick, 300);
      }
      if (!visible && timer) {
        clearInterval(timer); timer = null;
        current.forEach(function (c) { set(c, false); });
        current = rails.map(function () { return null; });
      }
    }, { threshold: 0.15 }).observe(sec);
  })();

  // About event lights: span the layer from just above #whofor to the closing
  // CTA, in the journey panel's coordinates. Re-measured as images and fonts
  // settle and on resize, since both change those positions.
  (function aboutLights() {
    var L = document.querySelector('[data-al]');
    if (!L) return;
    var host = L.offsetParent || L.parentNode;
    function place() {
      var w = document.getElementById('whofor');
      var c = document.getElementById('closing-about');
      if (!w || !c) return;
      var h = host.getBoundingClientRect().top;
      var top = w.getBoundingClientRect().top - h - 80;
      var bottom = c.getBoundingClientRect().top - h + 40;
      L.style.top = top + 'px';
      L.style.height = Math.max(0, bottom - top) + 'px';
    }
    place();
    window.addEventListener('load', place);
    window.addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  })();

  // "Who is it for?" (about page). See whofor.mjs.
  //   - the promo plays muted only while on screen (it is preload="none", so
  //     nothing loads until then); reduced motion / Save-Data never autoplay
  //   - "Tap for sound" unmutes and restarts it with controls
  //   - .is-watching while it plays with sound; on pause or at the end,
  //     .is-back for the length of the return animation
  (function whoFor() {
    var s = document.querySelector('[data-wh]');
    if (!s) return;
    var box = s.querySelector('[data-wh-video]');
    var v = box && box.querySelector('video');
    var btn = box && box.querySelector('.wh-snd');
    if (!v || !btn) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    var back = null;

    function watching(on) {
      if (on === s.classList.contains('is-watching')) return;
      s.classList.toggle('is-watching', on);
      clearTimeout(back);
      if (on) { s.classList.remove('is-back'); return; }
      s.classList.add('is-back');
      back = setTimeout(function () { s.classList.remove('is-back'); }, 850);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) s.classList.add('is-in');
      }, { threshold: 0.25 }).observe(s);
      if (!reduced && !saveData) {
        new IntersectionObserver(function (entries) {
          if (!v.muted) return;   // once she is watching with sound, leave it to her
          if (entries[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else v.pause();
        }, { threshold: 0.2 }).observe(box);
      }
    } else {
      s.classList.add('is-in');
    }

    // The button, or a click anywhere on the video, starts it with sound.
    // After that the native controls own the clicks (play / pause).
    function withSound() {
      if (box.classList.contains('is-on')) return;
      v.muted = false; v.loop = false; v.controls = true;
      try { v.currentTime = 0; } catch (e) {}
      box.classList.add('is-on');
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      watching(true);
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); withSound(); });
    box.addEventListener('click', withSound);
    v.addEventListener('play', function () { if (!v.muted) watching(true); });
    v.addEventListener('pause', function () { if (!v.muted) watching(false); });
    v.addEventListener('ended', function () { watching(false); });
  })();

  // Founder feature (about page): the signature writes itself in on arrival.
  (function founder() {
    var s = document.querySelector('[data-jl]');
    if (!s) return;
    if (!('IntersectionObserver' in window)) { s.classList.add('is-in'); return; }
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      s.classList.add('is-in');
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(s);
  })();

  // No Longer Bound banner: break the chains once, on arrival. Without
  // IntersectionObserver it is shown complete straight away.
  (function nlbBanner() {
    var s = document.querySelector('[data-nl]');
    if (!s) return;
    if (!('IntersectionObserver' in window)) { s.classList.add('is-in'); return; }
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      s.classList.add('is-in');
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(s);
  })();

  // Statement of Faith: "Read our full statement of faith".
  //
  // The region is collapsed by CSS (a 0fr grid row) and carries `inert` in the
  // markup, so while closed it is skipped by keyboard and assistive tech but
  // stays in the DOM for search and print. Opening removes inert and lets the
  // row grow to its natural height. If this never runs the button simply does
  // nothing — the mission above it is complete on its own.
  (function faithStatement() {
    document.querySelectorAll('[data-fs-acc]').forEach(function (acc) {
      var btn = acc.querySelector('.fs-btn');
      var region = acc.querySelector('.fs-region');
      if (!btn || !region) return;
      // data-settled lifts the region's clip so the page's shadow is not cut
      // off square — but only once the row has finished growing, because the
      // clip is what hides the page while it opens. Set on transitionend,
      // with a timer as the fallback for when no transition runs (reduced
      // motion) or the event is missed.
      var settle = null;
      function settled() { clearTimeout(settle); if (acc.hasAttribute('data-open')) acc.setAttribute('data-settled', ''); }
      region.addEventListener('transitionend', function (e) { if (e.target === region) settled(); });

      btn.addEventListener('click', function () {
        var open = !acc.hasAttribute('data-open');
        // Re-clip before closing, so the page folds away inside the region.
        acc.removeAttribute('data-settled');
        acc.toggleAttribute('data-open', open);
        btn.setAttribute('aria-expanded', String(open));
        if (open) {
          region.removeAttribute('inert');
          clearTimeout(settle);
          settle = setTimeout(settled, 900);
        } else {
          region.setAttribute('inert', '');
        }
      });
    });
  })();

  // "Read the full statement" on the creed.
  //
  // Phone-only in effect: the button is sm:hidden and the list is
  // `hidden sm:block`, so from sm up the creed is open whether or not this
  // runs. The control can never be the only route to the content on a viewport
  // where the control is not rendered.
  //
  // See the DISCLOSURE note at the top of faith.mjs before changing this —
  // hiding the creed was a decision taken deliberately, and only for phones.
  (function faithBeliefs() {
    var btn = document.getElementById('faith-beliefs-more');
    var list = document.getElementById('faith-beliefs');
    if (!btn || !list) return;
    var label = btn.querySelector('[data-faith-label]');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      list.classList.toggle('hidden', open);
      if (label) label.textContent = open ? 'Read the full statement' : 'Show less';
    });
  })();

  // Scrolled-state capsule.
  //
  // The tall editorial header just scrolls away on its own. The capsule is a
  // separate, permanently-fixed element parked off-screen; crossing the
  // threshold slides it in. Only transform and opacity animate, so this runs
  // on the compositor and never triggers layout — which is what the previous
  // absolute-to-fixed version could not do smoothly.
  (function navCapsule() {
    var cap = document.getElementById('nav-capsule');
    if (!cap) return;

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var supportsBlur = window.CSS && CSS.supports &&
      (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)'));

    // Every glass surface, not just the first child: below sm the capsule holds
    // a second pill and the menu panel it opens, and a panel that did not get
    // the blur would sit at .65 over live page content with 12px type on it.
    var glass = cap.querySelectorAll('[data-glass]');
    for (var i = 0; i < glass.length; i++) {
      if (supportsBlur) {
        glass[i].style.backdropFilter = 'blur(24px) saturate(1.6)';
        glass[i].style.webkitBackdropFilter = 'blur(24px) saturate(1.6)';
      } else {
        glass[i].style.background = 'rgba(22,22,22,.92)';
      }
    }

    cap.style.transform = 'translateY(-160%)';
    cap.style.opacity = '0';
    cap.style.willChange = 'transform, opacity';
    if (!reduced) cap.style.transition = 'transform .42s cubic-bezier(.22,1,.36,1), opacity .28s ease';

    var THRESHOLD = 220;
    var shown = false;
    var ticking = false;

    var toggle = document.getElementById('nav-capsule-toggle');
    var menu = document.getElementById('nav-capsule-menu');

    function closeMenu() {
      if (!toggle || !menu) return;
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    }

    function show(on) {
      if (on === shown) return;
      shown = on;
      cap.style.transform = on ? 'translateY(0)' : 'translateY(-160%)';
      cap.style.opacity = on ? '1' : '0';
      cap.setAttribute('aria-hidden', on ? 'false' : 'true');
      // Parked off-screen the capsule is invisible but its links and the burger
      // were still focusable, which is how a keyboard user ends up tabbing into
      // a menu they cannot see. `inert` is what aria-hidden alone never did.
      if ('inert' in cap) cap.inert = !on;
      // A menu left open as the bar leaves would be open when it comes back.
      if (!on) closeMenu();
    }

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        menu.hidden = open;
      });
      // Tapping the page behind should dismiss it, the way any menu does.
      document.addEventListener('click', function (e) {
        if (menu.hidden || cap.contains(e.target)) return;
        closeMenu();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); }
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        show((window.scrollY || window.pageYOffset) > THRESHOLD);
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  // Cinematic overlay (variant I) and full-screen overlay (variant D) share
  // this: Escape closes, focus moves in and back, page behind cannot scroll.
  ['navI', 'navD'].forEach(function (prefix) {
    var open = document.getElementById(prefix + '-open');
    var close = document.getElementById(prefix + '-close');
    var panel = document.getElementById(prefix + '-panel');
    if (!open || !close || !panel) return;
    function setOpen(state) {
      panel.hidden = !state;
      open.setAttribute('aria-expanded', String(state));
      document.documentElement.style.overflow = state ? 'hidden' : '';
      (state ? close : open).focus();
    }
    open.addEventListener('click', function () { setOpen(true); });
    close.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) setOpen(false);
    });
  });

  // Hero background video.
  // Held back behind data-src so it costs nothing for people who should not get
  // it. They keep the poster frame, which is a still from the same footage.
  //
  // The file is 11 MB. It is decoration — a muted, looping b-roll montage at
  // 50% opacity behind the headline — so it is never worth 11 MB of someone's
  // mobile data, and on a phone-sized viewport the detail in it cannot be seen
  // anyway. Four gates, cheapest check first:
  //
  //   reduced motion   the montage is constant movement
  //   Save-Data        the visitor has asked for exactly this
  //   slow connection  2g/3g would still be loading it after the scroll
  //   narrow viewport  a phone, where it costs the most and shows the least
  (function heroVideo() {
    var v = document.getElementById('hero-video');
    if (!v || !v.dataset.src) return;

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var conn = navigator.connection || {};
    var saveData = conn.saveData;
    var slow = /(^|-)2g$|^3g$/.test(conn.effectiveType || '');
    // Matches the lg breakpoint the layout already uses. Checked once on load
    // and not re-checked on resize: starting an 11 MB download because someone
    // turned their phone sideways is the behaviour this is here to prevent.
    var narrow = window.innerWidth < 1024;
    if (reduced || saveData || slow || narrow) return;

    v.preload = 'auto';
    v.src = v.dataset.src;
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stands in */ });
  })();

  function iframeFor(provider, id, title, hash) {
    var el = document.createElement('iframe');
    el.title = title;
    el.width = '100%';
    el.height = '100%';
    el.loading = 'lazy';
    el.allow = 'autoplay; fullscreen; picture-in-picture';
    el.allowFullscreen = true;
    el.className = 'absolute inset-0 h-full w-full';
    if (provider === 'wistia') {
      el.src = 'https://fast.wistia.net/embed/iframe/' + id + '?autoPlay=true';
    } else if (provider === 'youtube') {
      // nocookie host: no tracking cookie until playback.
      el.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    } else if (provider === 'vimeo') {
      // These are UNLISTED videos: without the h= token the player returns 403.
      el.src = 'https://player.vimeo.com/video/' + id +
        (hash ? '?h=' + encodeURIComponent(hash) + '&autoplay=1' : '?autoplay=1');
    }
    return el;
  }

  // Video lightbox.
  //
  // Opt-in: a facade carrying data-lightbox opens here, anything else still
  // swaps itself for an inline player. The testimonial rails need it because
  // the cards are 230px portraits — playing a talking head at that size is
  // pointless — and because a card that swapped to a player in place would
  // then drift off the edge of the screen while it played.
  //
  // Built once, lazily, and reused. The iframe is torn down on close so the
  // video actually stops; leaving it in the DOM keeps audio running.
  var lb = null;

  function buildLightbox() {
    var root = document.createElement('div');
    root.className = 'fixed inset-0 z-[120]';
    root.style.display = 'none';
    root.innerHTML =
      '<div data-lb-backdrop class="absolute inset-0 bg-ink/85 backdrop-blur-sm"></div>' +
      '<div data-lb-dialog role="dialog" aria-modal="true" tabindex="-1"' +
      '     class="absolute inset-0 flex items-center justify-center p-4 sm:p-8">' +
      '  <div class="relative w-full max-w-5xl">' +
      '    <button type="button" data-lb-close' +
      '            class="absolute -top-11 right-0 flex h-9 items-center gap-2 rounded-full bg-white/10 px-4' +
      '                   font-body text-xs font-semibold uppercase tracking-[0.2em] text-white' +
      '                   ring-1 ring-white/25 transition hover:bg-white/20' +
      '                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">' +
      '      Close' +
      '      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '    </button>' +
      '    <div data-lb-stage class="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/15 shadow-[0_50px_120px_-40px_rgba(0,0,0,.9)]"></div>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(root);

    lb = {
      root: root,
      dialog: root.querySelector('[data-lb-dialog]'),
      stage: root.querySelector('[data-lb-stage]'),
      close: root.querySelector('[data-lb-close]'),
      opener: null,
    };

    root.querySelector('[data-lb-backdrop]').addEventListener('click', closeLightbox);
    lb.close.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (root.style.display === 'none') return;
      if (e.key === 'Escape') { closeLightbox(); return; }
      // Only two things in here are focusable — the close button and the
      // player — and the player is a cross-origin iframe we cannot enumerate.
      // Holding focus on the close button is the honest version of a trap:
      // Tab never escapes to the page behind.
      if (e.key === 'Tab') { e.preventDefault(); lb.close.focus(); }
    });

    return lb;
  }

  function openLightbox(btn) {
    var box = lb || buildLightbox();
    box.opener = btn;
    box.dialog.setAttribute('aria-label', btn.dataset.title || 'Video');
    box.stage.innerHTML = '';
    box.stage.appendChild(iframeFor(btn.dataset.provider, btn.dataset.id, btn.dataset.title, btn.dataset.hash));

    // Compensate for the scrollbar before hiding it, or the page jumps sideways
    // as the modal opens.
    var gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = gap > 0 ? gap + 'px' : '';
    document.body.style.overflow = 'hidden';

    box.root.style.display = '';
    box.close.focus();
  }

  function closeLightbox() {
    if (!lb || lb.root.style.display === 'none') return;
    lb.root.style.display = 'none';
    lb.stage.innerHTML = '';           // tears the iframe down, which stops the audio
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (lb.opener && document.contains(lb.opener)) lb.opener.focus();
    lb.opener = null;
  }

  document.querySelectorAll('.video-facade').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.hasAttribute('data-lightbox')) { openLightbox(btn); return; }

      var stage = btn.closest('[data-vsl-stage]');
      var wrap = document.createElement('div');
      // Inside a stage the frame is the stage, so the player fills it rather
      // than setting its own aspect ratio — otherwise the two fight and the
      // frame cannot open.
      wrap.className = stage ? 'vsl-player absolute inset-0' : 'relative aspect-video w-full';
      wrap.appendChild(iframeFor(btn.dataset.provider, btn.dataset.id, btn.dataset.title, btn.dataset.hash));

      if (!stage) { btn.replaceWith(wrap); return; }

      // Cross-fade rather than swap. Replacing the button outright removes the
      // poster in the same frame the iframe appears, so an empty player shows
      // through while it loads and the frame is still opening — which is the
      // jump, not the easing. The player goes in UNDERNEATH and the poster
      // fades off the top of it.
      btn.parentNode.insertBefore(wrap, btn);
      btn.classList.add('is-fading');
      btn.setAttribute('aria-hidden', 'true');
      btn.tabIndex = -1;

      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.setTimeout(function () { btn.remove(); }, reduced ? 0 : 900);

      // One frame later, so the browser has a start state to transition from.
      // Setting the class in the same tick applies the end state immediately
      // and nothing animates.
      requestAnimationFrame(function () { stage.classList.add('is-playing'); });
    });
  });
})();

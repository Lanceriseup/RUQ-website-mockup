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

    var bar = cap.firstElementChild;
    if (supportsBlur && bar) {
      bar.style.backdropFilter = 'blur(24px) saturate(1.6)';
      bar.style.webkitBackdropFilter = 'blur(24px) saturate(1.6)';
    } else if (bar) {
      bar.style.background = 'rgba(22,22,22,.92)';
    }

    cap.style.transform = 'translateY(-160%)';
    cap.style.opacity = '0';
    cap.style.willChange = 'transform, opacity';
    if (!reduced) cap.style.transition = 'transform .42s cubic-bezier(.22,1,.36,1), opacity .28s ease';

    var THRESHOLD = 220;
    var shown = false;
    var ticking = false;

    function show(on) {
      if (on === shown) return;
      shown = on;
      cap.style.transform = on ? 'translateY(0)' : 'translateY(-160%)';
      cap.style.opacity = on ? '1' : '0';
      cap.setAttribute('aria-hidden', on ? 'false' : 'true');
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
  // it: reduced-motion users, and anyone on a metered/Save-Data connection.
  // They keep the poster frame, which carries the same image.
  (function heroVideo() {
    var v = document.getElementById('hero-video');
    if (!v || !v.dataset.src) return;

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduced || saveData) return;

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

  document.querySelectorAll('.video-facade').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = document.createElement('div');
      wrap.className = 'relative aspect-video w-full';
      wrap.appendChild(iframeFor(btn.dataset.provider, btn.dataset.id, btn.dataset.title, btn.dataset.hash));
      btn.replaceWith(wrap);
    });
  });
})();

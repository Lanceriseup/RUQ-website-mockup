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

  // Header collapse: past the hero the editorial header detaches into a
  // floating frosted capsule.
  //
  // Two cases to keep straight. On the homepage the header is absolutely
  // positioned over the video, so detaching costs nothing. On interior pages
  // it sits in normal flow, so going fixed would yank the content up by its
  // full height — a spacer takes its place for exactly as long as it floats.
  (function capsuleNav() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;

    var overHero = nav.dataset.overHero === '1';
    var panel = document.getElementById('site-nav-panel');
    var logo = document.getElementById('site-nav-logo');
    var rule = document.getElementById('site-nav-rule');
    var ctaRow = document.getElementById('site-nav-cta-row');
    var scrim = document.getElementById('site-nav-scrim');
    var burger = document.getElementById('site-nav-burger');
    var drawer = document.getElementById('navMain');
    var links = [].slice.call(nav.querySelectorAll('nav a'));

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var supportsBlur = window.CSS && CSS.supports &&
      (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)'));

    var THRESHOLD = 140;
    var ticking = false;
    var collapsed = false;
    var spacer = null;

    if (!reduced) {
      [nav, panel, logo, ctaRow, scrim].forEach(function (el) {
        if (el) el.style.transition = 'all .34s cubic-bezier(.4,0,.2,1)';
      });
    }

    function blur(px) {
      var v = px ? 'blur(' + px + 'px) saturate(1.6)' : '';
      nav.style.backdropFilter = v;
      nav.style.webkitBackdropFilter = v;
    }

    function setCollapsed(on) {
      if (on === collapsed) return;
      collapsed = on;

      if (on) {
        // Hold the layout open before detaching, interior pages only.
        if (!overHero) {
          spacer = document.createElement('div');
          spacer.style.height = nav.offsetHeight + 'px';
          nav.parentNode.insertBefore(spacer, nav);
        }
        nav.classList.remove('absolute', 'relative', 'border-b', 'border-ink-line', 'bg-white');
        nav.classList.add('fixed', 'inset-x-0', 'top-0');

        // Smoked glass: dark enough that the white type carries over both the
        // video above and the white content below, so nothing has to recolour.
        nav.style.background = supportsBlur ? 'rgba(22,22,22,.5)' : 'rgba(22,22,22,.88)';
        blur(supportsBlur ? 24 : 0);
        nav.style.margin = '12px auto';
        nav.style.width = 'calc(100% - 32px)';
        nav.style.maxWidth = '1100px';
        nav.style.borderRadius = '9999px';
        nav.style.border = '1px solid rgba(255,255,255,.22)';
        nav.style.boxShadow = '0 20px 45px -20px rgba(0,0,0,.65)';

        panel.style.paddingTop = '6px';
        panel.style.paddingBottom = '6px';
        // filter:none overrides the brightness-0 class interior pages carry,
        // so the wordmark returns to white against the smoked glass.
        if (logo) { logo.style.height = '36px'; logo.style.filter = 'none'; }
        if (ctaRow) ctaRow.style.display = 'none';
        if (rule) rule.style.display = 'none';
        if (scrim) scrim.style.opacity = '0';
        if (burger) burger.style.color = '#fff';
        links.forEach(function (a) { a.style.color = '#fff'; });
        if (drawer) { drawer.style.borderRadius = '1.5rem'; drawer.style.marginTop = '8px'; }
      } else {
        if (spacer) { spacer.remove(); spacer = null; }
        nav.classList.remove('fixed', 'inset-x-0', 'top-0');
        nav.classList.add(overHero ? 'absolute' : 'relative');
        if (overHero) nav.classList.add('inset-x-0', 'top-0');
        else nav.classList.add('border-b', 'border-ink-line', 'bg-white');

        ['margin', 'width', 'maxWidth', 'borderRadius', 'border', 'boxShadow', 'background']
          .forEach(function (p) { nav.style[p] = ''; });
        blur(0);

        panel.style.paddingTop = '';
        panel.style.paddingBottom = '';
        if (logo) { logo.style.height = ''; logo.style.filter = ''; }
        if (ctaRow) ctaRow.style.display = '';
        if (rule) rule.style.display = '';
        if (scrim) scrim.style.opacity = '';
        if (burger) burger.style.color = '';
        links.forEach(function (a) { a.style.color = ''; });
        if (drawer) { drawer.style.borderRadius = ''; drawer.style.marginTop = ''; }
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        setCollapsed((window.scrollY || window.pageYOffset) > THRESHOLD);
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

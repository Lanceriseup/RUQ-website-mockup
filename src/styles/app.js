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

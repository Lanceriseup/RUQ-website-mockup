// Frosted collapse behaviours. One engine, six modes via data-mode on #gnav.
//
// backdrop-filter is set on the header, and the header must stay partially
// transparent for it to sample anything. Safari still needs the -webkit-
// prefix, so both are written.
(function () {
  'use strict';

  var nav = document.getElementById('gnav');
  if (!nav) return;

  var mode = nav.dataset.mode;
  var tint = nav.dataset.tint;
  var panel = document.getElementById('gnav-panel');
  var logo = document.getElementById('gnav-logo');
  var rule = document.getElementById('gnav-rule');
  var ctaRow = document.getElementById('gnav-cta-row');
  var cta = document.getElementById('gnav-cta');
  var scrim = document.getElementById('gnav-scrim');
  var links = [].slice.call(document.querySelectorAll('.nav-link'));

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THRESHOLD = 120;
  var ticking = false;

  // Feature-detect: without backdrop-filter the glass would render as a flat
  // wash, so those browsers get a more opaque fallback instead.
  var supportsBlur = CSS && CSS.supports &&
    (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)'));

  if (!reduced) {
    [nav, panel, logo, ctaRow, scrim, rule].forEach(function (el) {
      if (el) el.style.transition = 'all .34s cubic-bezier(.4,0,.2,1)';
    });
  }

  function blur(px) {
    var v = px > 0 ? 'blur(' + px + 'px) saturate(1.6)' : '';
    nav.style.backdropFilter = v;
    nav.style.webkitBackdropFilter = v;
  }

  // Type colour is a function of the tint, not the scroll position: light
  // glass needs ink, dark glass keeps white.
  function typeOnGlass(on) {
    var toInk = on && tint === 'light';
    links.forEach(function (a) {
      a.style.color = toInk ? '#1c1c1c' : '';
      a.style.textShadow = on ? 'none' : '';
    });
    if (cta) {
      cta.style.color = toInk ? '#1c1c1c' : '';
      cta.style.textShadow = on ? 'none' : '';
    }
    if (logo) logo.style.filter = toInk ? 'brightness(0)' : '';
  }

  function baseCollapse(on) {
    nav.classList.toggle('fixed', on);
    nav.classList.toggle('absolute', !on);
    panel.style.paddingTop = on ? '8px' : '';
    if (logo) logo.style.height = on ? '36px' : '';
    if (ctaRow) ctaRow.style.display = on ? 'none' : '';
    if (rule) rule.style.marginTop = on ? '0' : '';
    if (scrim) scrim.style.opacity = on ? '0' : '';
    typeOnGlass(on);
  }

  function reset() {
    nav.style.background = '';
    nav.style.boxShadow = '';
    nav.style.borderBottom = '';
    nav.style.margin = '';
    nav.style.borderRadius = '';
    nav.style.width = '';
    nav.style.maxWidth = '';
    blur(0);
  }

  var LIGHT = function (a) { return 'rgba(255,255,255,' + a + ')'; };
  var DARK = function (a) { return 'rgba(22,22,22,' + a + ')'; };

  var handlers = {
    lightFrost: function (y) {
      var on = y > THRESHOLD;
      baseCollapse(on);
      if (!on) return reset();
      nav.style.background = LIGHT(supportsBlur ? 0.65 : 0.94);
      blur(supportsBlur ? 20 : 0);
      nav.style.boxShadow = '0 8px 32px -16px rgba(0,0,0,.3)';
      nav.style.borderBottom = '1px solid rgba(255,255,255,.5)';
    },

    darkFrost: function (y) {
      var on = y > THRESHOLD;
      baseCollapse(on);
      if (!on) return reset();
      nav.style.background = DARK(supportsBlur ? 0.55 : 0.9);
      blur(supportsBlur ? 22 : 0);
      nav.style.boxShadow = '0 8px 32px -16px rgba(0,0,0,.5)';
      nav.style.borderBottom = '1px solid rgba(255,255,255,.12)';
    },

    capsule: function (y) {
      var on = y > THRESHOLD;
      baseCollapse(on);
      if (!on) return reset();
      // Pulls in from the edges and rounds off into a floating pill.
      nav.style.background = DARK(supportsBlur ? 0.5 : 0.88);
      blur(supportsBlur ? 24 : 0);
      nav.style.margin = '12px auto';
      nav.style.width = 'calc(100% - 32px)';
      nav.style.maxWidth = '1100px';
      nav.style.borderRadius = '9999px';
      nav.style.border = '1px solid rgba(255,255,255,.22)';
      nav.style.boxShadow = '0 20px 45px -20px rgba(0,0,0,.65)';
    },

    cyanEdge: function (y) {
      var on = y > THRESHOLD;
      baseCollapse(on);
      if (!on) { reset(); if (rule) rule.style.boxShadow = ''; return; }
      nav.style.background = LIGHT(supportsBlur ? 0.7 : 0.95);
      blur(supportsBlur ? 18 : 0);
      nav.style.borderBottom = '2px solid #00b9c6';
      nav.style.boxShadow = '0 6px 22px -10px rgba(0,185,198,.55)';
    },

    progressiveFrost: function (y) {
      // Continuous: blur radius and tint track scroll across a 260px travel.
      var t = Math.max(0, Math.min(1, y / 260));
      var on = t > 0.02;
      nav.classList.toggle('fixed', on);
      nav.classList.toggle('absolute', !on);
      panel.style.paddingTop = (28 - 20 * t).toFixed(0) + 'px';
      if (logo) logo.style.height = (88 - 52 * t).toFixed(0) + 'px';
      if (scrim) scrim.style.opacity = String(1 - t);
      if (ctaRow) { ctaRow.style.opacity = String(1 - Math.min(1, t * 2)); ctaRow.style.height = t > 0.5 ? '0px' : ''; ctaRow.style.overflow = 'hidden'; }
      nav.style.background = LIGHT((supportsBlur ? 0.7 : 0.95) * t);
      blur(supportsBlur ? Math.round(t * 22) : 0);
      nav.style.boxShadow = t > 0.4 ? '0 8px 32px -16px rgba(0,0,0,' + (t * 0.3).toFixed(2) + ')' : '';
      var mix = Math.round(255 - 227 * t);
      links.forEach(function (a) {
        a.style.color = 'rgb(' + mix + ',' + mix + ',' + mix + ')';
        a.style.textShadow = t > 0.6 ? 'none' : '';
      });
      if (logo) logo.style.filter = 'brightness(' + (1 - t) + ')';
    },

    brandFrost: function (y) {
      var on = y > THRESHOLD;
      baseCollapse(on);
      if (!on) return reset();
      // Faint magenta wash instead of neutral white.
      nav.style.background = supportsBlur
        ? 'linear-gradient(rgba(253,234,245,.72),rgba(255,255,255,.66))'
        : 'rgba(253,234,245,.96)';
      blur(supportsBlur ? 20 : 0);
      nav.style.boxShadow = '0 8px 32px -16px rgba(232,32,143,.35)';
      nav.style.borderBottom = '1px solid rgba(232,32,143,.25)';
    },
  };

  var run = handlers[mode] || handlers.lightFrost;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      run(window.scrollY || window.pageYOffset);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Scroll behaviours for the header. One engine, six modes, selected by
// data-mode on #snav.
//
// Everything reads scroll position inside a rAF tick and writes only transform,
// opacity, background and a couple of sizes — no layout-triggering properties
// in the scroll path.
(function () {
  'use strict';

  var nav = document.getElementById('snav');
  if (!nav) return;

  var mode = nav.dataset.mode;
  var inner = document.getElementById('snav-inner');
  var logo = document.getElementById('snav-logo');
  var ctaRow = document.getElementById('snav-cta-row');
  var cta = document.getElementById('snav-cta');
  var scrim = document.getElementById('snav-scrim');
  var ruleWrap = document.getElementById('snav-rule-wrap');
  var progress = document.getElementById('snav-progress');
  var menuBtn = document.getElementById('snav-menu');
  var links = [].slice.call(document.querySelectorAll('.nav-link'));

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THRESHOLD = 120;          // px before the collapsed state engages
  var lastY = 0;
  var ticking = false;
  var maxScroll = 0;

  function measure() {
    var doc = document.documentElement;
    maxScroll = doc.scrollHeight - doc.clientHeight;
  }
  measure();
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure);

  // Transitions are opt-in so the resting state paints without animating in.
  if (!reduced) {
    [nav, inner, logo, ctaRow, scrim].forEach(function (el) {
      if (el) el.style.transition = 'all .32s cubic-bezier(.4,0,.2,1)';
    });
  }

  function pin() {
    nav.classList.remove('absolute');
    nav.classList.add('fixed');
  }
  function unpin() {
    nav.classList.remove('fixed');
    nav.classList.add('absolute');
  }

  // Shared collapsed look: white bar, small dark logo, single row.
  function collapse(on) {
    if (on) {
      pin();
      nav.style.background = '#fff';
      nav.style.boxShadow = '0 8px 24px -12px rgba(0,0,0,.35)';
      inner.style.paddingTop = '8px';
      logo.style.height = '36px';
      logo.style.filter = 'brightness(0)';
      if (scrim) scrim.style.opacity = '0';
      ctaRow.style.display = 'none';
      ruleWrap.style.marginTop = '0';
      links.forEach(function (a) {
        a.style.color = '#1c1c1c';
        a.style.textShadow = 'none';
      });
      if (cta) { cta.style.color = '#1c1c1c'; cta.style.textShadow = 'none'; }
    } else {
      unpin();
      nav.style.background = '';
      nav.style.boxShadow = '';
      inner.style.paddingTop = '';
      logo.style.height = '';
      logo.style.filter = '';
      if (scrim) scrim.style.opacity = '';
      ctaRow.style.display = '';
      ruleWrap.style.marginTop = '';
      links.forEach(function (a) { a.style.color = ''; a.style.textShadow = ''; });
      if (cta) { cta.style.color = ''; cta.style.textShadow = ''; }
    }
  }

  var handlers = {
    condense: function (y) { collapse(y > THRESHOLD); },

    hideReveal: function (y) {
      if (y <= THRESHOLD) { collapse(false); nav.style.transform = ''; return; }
      collapse(true);
      var goingDown = y > lastY;
      // Only hide once clear of the hero, so it never flickers at the top.
      nav.style.transform = goingDown && y > THRESHOLD * 2 ? 'translateY(-100%)' : 'translateY(0)';
    },

    fadeThrough: function (y) {
      var past = y > THRESHOLD;
      if (past) {
        collapse(true);
        inner.style.opacity = '1';
      } else {
        collapse(false);
        inner.style.opacity = '1';
      }
      // Cross-dissolve the whole inner block through the threshold.
      var t = Math.min(1, Math.abs(y - THRESHOLD) / 60);
      inner.style.opacity = String(0.35 + 0.65 * t);
    },

    progressive: function (y) {
      // No threshold: interpolate everything against a 260px travel.
      var t = Math.max(0, Math.min(1, y / 260));
      if (t > 0.02) pin(); else unpin();
      nav.style.background = 'rgba(255,255,255,' + (t * 0.97).toFixed(3) + ')';
      nav.style.backdropFilter = t > 0.05 ? 'blur(' + (t * 12).toFixed(1) + 'px)' : '';
      nav.style.boxShadow = t > 0.5 ? '0 8px 24px -12px rgba(0,0,0,' + (t * 0.35).toFixed(2) + ')' : '';
      inner.style.paddingTop = (28 - 20 * t).toFixed(0) + 'px';
      logo.style.height = (88 - 52 * t).toFixed(0) + 'px';
      logo.style.filter = 'brightness(' + (1 - t) + ')';
      if (scrim) scrim.style.opacity = String(1 - t);
      ctaRow.style.opacity = String(1 - Math.min(1, t * 2));
      ctaRow.style.height = t > 0.5 ? '0px' : '';
      ctaRow.style.overflow = 'hidden';
      var mix = Math.round(255 - 227 * t);
      links.forEach(function (a) {
        a.style.color = 'rgb(' + mix + ',' + mix + ',' + mix + ')';
        a.style.textShadow = t > 0.6 ? 'none' : '';
      });
    },

    minimal: function (y) {
      var past = y > THRESHOLD;
      collapse(past);
      links.forEach(function (a) { a.style.display = past ? 'none' : ''; });
      if (menuBtn) {
        menuBtn.style.display = past ? 'flex' : 'none';
        menuBtn.style.color = past ? '#1c1c1c' : '#fff';
      }
      if (past) { ctaRow.style.display = 'none'; }
    },

    progressRule: function (y) {
      collapse(y > THRESHOLD);
      if (!progress) return;
      progress.hidden = false;
      // maxScroll is cached, not measured here: reading scrollHeight after
      // collapse() has written styles would force a synchronous layout on
      // every frame. Recomputed on resize instead.
      progress.style.width = maxScroll > 0 ? ((y / maxScroll) * 100).toFixed(2) + '%' : '0%';
      // Swap the fading gradient for a plain track so the fill reads clearly.
      ruleWrap.style.background = y > THRESHOLD ? 'rgba(0,185,198,.18)' : '';
    },
  };

  var run = handlers[mode] || handlers.condense;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      run(y);
      lastY = y;
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

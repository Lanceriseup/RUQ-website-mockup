// Coach bios: opens the hidden block inside a card as a dialog.
//
// One modal, built once and reused. The effect is whatever class the page
// carries (bio-fx-lift, bio-fx-scale, ...); this file only knows about open,
// close, and the one effect that needs measuring.
//
// `flip` never opens the dialog at all — it toggles a class on the card and
// the CSS turns it over. It is handled first and returns early.
(function () {
  'use strict';

  var triggers = [].slice.call(document.querySelectorAll('[data-bio-open]'));
  if (!triggers.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.querySelector('.bio-fx');
  var isFlip = page && page.classList.contains('bio-fx-flip');

  // ---------------------------------------------------------------- flip
  if (isFlip) {
    triggers.forEach(function (btn) {
      var card = btn.closest('[data-bio-card]');
      btn.addEventListener('click', function () {
        var open = card.classList.toggle('is-flipped');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        // The back of the card is hidden from assistive tech while it is
        // facing away — a rotated element is still in the accessibility tree.
        var back = card.querySelector('[data-bio-back]');
        if (back) back.hidden = !open;
      });
    });
    return;
  }

  // --------------------------------------------------------------- modal
  var dlg = null;

  // A fixed-size panel with a way through a long bio, chosen by the page's
  // data-bio-scroll (options at /bio-scroll-options.html). Without it the
  // panel grows to fit the bio, as it always has.
  //   fade   the text fades out under a "Keep reading" pill that scrolls it
  //   rail   a reading-progress rail and a round arrow that scrolls it
  //   pages  no scrolling: the bio is laid out in pages with ‹ 1 / 3 › controls
  var mode = page && page.getAttribute('data-bio-scroll');
  var CHEVRON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var CONTROLS = {
    fade: '<button type="button" data-bio-more class="bio-sx-more"><span data-bio-more-label>Keep reading</span>' + CHEVRON + '</button>',
    rail: '<div class="bio-sx-rail" aria-hidden="true"><span class="bio-sx-fill"></span></div>' +
          '<button type="button" data-bio-more class="bio-sx-arrow" aria-label="Keep reading">' + CHEVRON + '</button>',
    pages: '<div class="bio-sx-pager">' +
           '<button type="button" data-bio-prev class="bio-sx-pg" aria-label="Previous page"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>' +
           '<span data-bio-count class="bio-sx-count" aria-live="polite"></span>' +
           '<button type="button" data-bio-next class="bio-sx-pg" aria-label="Next page"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>' +
           '</div>',
  };
  if (!CONTROLS[mode]) mode = null;
  var GAP = 40;   // between pages, in the pages mode

  function build() {
    var root = document.createElement('div');
    root.className = 'bio-modal';
    root.style.display = 'none';
    root.innerHTML =
      '<div data-bio-backdrop class="bio-modal-backdrop"></div>' +
      '<div data-bio-panel role="dialog" aria-modal="true" aria-labelledby="bio-modal-name" tabindex="-1" class="bio-modal-panel">' +
      '  <button type="button" data-bio-close class="bio-modal-close" aria-label="Close">' +
      '    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '  </button>' +
      '  <div class="bio-modal-media"><img data-bio-img alt=""></div>' +
      '  <div class="bio-modal-text">' +
      '    <div data-bio-body class="bio-modal-body">' +
      '      <p data-bio-role class="bio-modal-role"></p>' +
      '      <h2 id="bio-modal-name" data-bio-name class="bio-modal-name"></h2>' +
      '      <div data-bio-prose class="bio-modal-prose"></div>' +
      '    </div>' +
      (mode ? '    <div class="bio-sx-ctl">' + CONTROLS[mode] + '</div>' : '') +
      '  </div>' +
      '</div>' +
      '<div data-bio-ghost class="bio-modal-ghost" aria-hidden="true"></div>';
    if (mode) root.setAttribute('data-scroll', mode);
    document.body.appendChild(root);

    dlg = {
      root: root,
      panel: root.querySelector('[data-bio-panel]'),
      img: root.querySelector('[data-bio-img]'),
      name: root.querySelector('[data-bio-name]'),
      role: root.querySelector('[data-bio-role]'),
      prose: root.querySelector('[data-bio-prose]'),
      close: root.querySelector('[data-bio-close]'),
      ghost: root.querySelector('[data-bio-ghost]'),
      body: root.querySelector('[data-bio-body]'),
      opener: null,
    };

    root.querySelector('[data-bio-backdrop]').addEventListener('click', close);
    dlg.close.addEventListener('click', close);
    if (mode) wireScroll(dlg);

    document.addEventListener('keydown', function (e) {
      if (root.style.display === 'none') return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      // Keep Tab inside the panel. Querying on every press rather than caching:
      // the panel's contents are replaced on each open.
      var f = [].slice.call(dlg.panel.querySelectorAll(
        'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
      ));
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    return dlg;
  }

  function open(btn) {
    var d = dlg || build();
    var card = btn.closest('[data-bio-card]');
    var src = card.querySelector('[data-bio-content]');
    var img = card.querySelector('img');

    d.opener = btn;
    d.img.src = img.getAttribute('src');
    d.img.alt = '';
    d.name.textContent = card.getAttribute('data-bio-name') || '';
    d.role.textContent = card.getAttribute('data-bio-role') || '';
    d.prose.innerHTML = '';
    if (src) {
      // Clone, do not move: the original has to stay in the page so the bio is
      // still in the document when the modal is closed.
      [].slice.call(src.children).forEach(function (n) { d.prose.appendChild(n.cloneNode(true)); });
    }

    // Scrollbar width first, or the page shifts sideways as it locks.
    var gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = gap > 0 ? gap + 'px' : '';
    document.body.style.overflow = 'hidden';

    d.root.style.display = '';

    // `lift` is the only effect that needs to know where the card was. The
    // ghost is positioned over the card, then transitioned to the panel's
    // position — measured, because the grid position depends on the viewport.
    if (!reduced && document.querySelector('.bio-fx-lift')) {
      var r = card.getBoundingClientRect();
      var plate = card.querySelector('.polaroid-plate') || card;
      d.ghost.innerHTML = '<img src="' + img.getAttribute('src') + '" alt="">';
      d.ghost.style.cssText =
        'display:block;top:' + r.top + 'px;left:' + r.left + 'px;width:' + r.width + 'px;height:' + plate.getBoundingClientRect().height + 'px';
      requestAnimationFrame(function () {
        var t = d.root.querySelector('.bio-modal-media').getBoundingClientRect();
        d.ghost.style.transition = 'top .5s cubic-bezier(.22,1,.36,1),left .5s cubic-bezier(.22,1,.36,1),width .5s cubic-bezier(.22,1,.36,1),height .5s cubic-bezier(.22,1,.36,1),opacity .2s ease .35s';
        d.ghost.style.top = t.top + 'px';
        d.ghost.style.left = t.left + 'px';
        d.ghost.style.width = t.width + 'px';
        d.ghost.style.height = t.height + 'px';
        d.ghost.style.opacity = '0';
      });
      window.setTimeout(function () { d.ghost.style.display = 'none'; d.ghost.style.cssText = ''; }, 700);
    }

    requestAnimationFrame(function () { d.root.classList.add('is-open'); });
    if (mode) {
      d.body.scrollTop = 0;
      d.prose.scrollLeft = 0;
      requestAnimationFrame(function () { syncScroll(d); });
    }
    d.close.focus();
  }

  // ------------------------------------------------------- scroll / pages
  var smooth = reduced ? 'auto' : 'smooth';

  function pageGeom(d) {
    var w = d.prose.clientWidth;
    // column-width is a minimum, so with the gap this gives exactly one
    // column per visible width; the rest of the bio flows to the right.
    d.prose.style.columnWidth = w + 'px';
    d.prose.style.columnGap = GAP + 'px';
    var step = w + GAP;
    var total = Math.max(1, Math.round((d.prose.scrollWidth + GAP) / step));
    var cur = Math.min(total - 1, Math.round(d.prose.scrollLeft / step));
    return { step: step, total: total, cur: cur };
  }

  function syncScroll(d) {
    var r = d.root;
    if (mode === 'pages') {
      var g = pageGeom(d);
      r.classList.toggle('sx-over', g.total > 1);
      r.querySelector('[data-bio-count]').textContent = (g.cur + 1) + ' / ' + g.total;
      r.querySelector('[data-bio-prev]').disabled = g.cur === 0;
      r.querySelector('[data-bio-next]').disabled = g.cur === g.total - 1;
      return;
    }
    var b = d.body, max = b.scrollHeight - b.clientHeight;
    var over = max > 4, end = !over || b.scrollTop >= max - 4;
    r.classList.toggle('sx-over', over);
    r.classList.toggle('sx-end', end);
    r.style.setProperty('--sx-p', over ? (b.scrollTop / max).toFixed(3) : '1');
    var more = r.querySelector('[data-bio-more]');
    var label = end ? 'Back to top' : 'Keep reading';
    var span = more.querySelector('[data-bio-more-label]');
    if (span) span.textContent = label; else more.setAttribute('aria-label', label);
  }

  function wireScroll(d) {
    var r = d.root;
    if (mode === 'pages') {
      var go = function (by) {
        var g = pageGeom(d);
        var to = Math.max(0, Math.min(g.total - 1, g.cur + by));
        d.prose.scrollTo({ left: to * g.step, behavior: smooth });
      };
      r.querySelector('[data-bio-prev]').addEventListener('click', function () { go(-1); });
      r.querySelector('[data-bio-next]').addEventListener('click', function () { go(1); });
      d.prose.addEventListener('scroll', function () { syncScroll(d); });
      // Arrow keys turn pages; a horizontal swipe does too on touch.
      document.addEventListener('keydown', function (e) {
        if (r.style.display === 'none') return;
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      });
      var x0 = null, y0 = null;
      d.prose.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
      d.prose.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        x0 = null;
      }, { passive: true });
    } else {
      d.body.setAttribute('tabindex', '0');   // arrow keys and page down scroll it
      d.body.addEventListener('scroll', function () { syncScroll(d); }, { passive: true });
      r.querySelector('[data-bio-more]').addEventListener('click', function () {
        var b = d.body;
        if (r.classList.contains('sx-end')) b.scrollTo({ top: 0, behavior: smooth });
        else b.scrollBy({ top: Math.round(b.clientHeight * 0.7), behavior: smooth });
      });
    }
    window.addEventListener('resize', function () {
      if (r.style.display === 'none') return;
      if (mode === 'pages') d.prose.scrollLeft = 0;
      syncScroll(d);
    });
  }

  function close() {
    if (!dlg || dlg.root.style.display === 'none') return;
    dlg.root.classList.remove('is-open');

    var done = function () {
      dlg.root.style.display = 'none';
      dlg.prose.innerHTML = '';
      dlg.img.removeAttribute('src');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (dlg.opener && document.contains(dlg.opener)) dlg.opener.focus();
      dlg.opener = null;
    };

    if (reduced) done();
    else window.setTimeout(done, 260);
  }

  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () { open(btn); });
  });
})();

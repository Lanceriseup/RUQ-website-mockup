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
      '  <div class="bio-modal-body">' +
      '    <p data-bio-role class="bio-modal-role"></p>' +
      '    <h2 id="bio-modal-name" data-bio-name class="bio-modal-name"></h2>' +
      '    <div data-bio-prose class="bio-modal-prose"></div>' +
      '  </div>' +
      '</div>' +
      '<div data-bio-ghost class="bio-modal-ghost" aria-hidden="true"></div>';
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
      opener: null,
    };

    root.querySelector('[data-bio-backdrop]').addEventListener('click', close);
    dlg.close.addEventListener('click', close);

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
    d.close.focus();
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

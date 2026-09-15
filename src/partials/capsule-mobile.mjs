// Mobile treatments for the scrolled-state capsule.
//
// Brief: on a phone the scrolled bar carries the wordmark and a burger. No
// links, no CTA. That settles the content question the previous round was
// arguing about, and turns this into a question about form — shape, ground,
// alignment and how the thing arrives.
//
// For reference, the shipped capsule (capsule.mjs) holds four links plus
// Register. At 12px semibold, 0.2em tracking, px-4 either side that measures
// 576px against the 358px a 390px phone has after gutters, so it runs 218px
// off the right edge and takes the CTA with it. Every option below fits by
// construction: two elements, both of which have a fixed size.
//
// All of it is BELOW-SM ONLY. In production the shipped pill takes
// `hidden sm:flex` and the mobile element `sm:hidden`, so the two never render
// at the same width and nothing above 640px moves.
//
// The non-obvious constraint: the burger in the tall header opens #navMain,
// a child of that header. By the time the capsule exists the header has
// scrolled away, so the capsule's burger cannot reuse it — every option here
// carries its own panel inside the fixed element.
import { esc } from './layout.mjs';

// Dark frosted glass. The .65 fill is inherited from capsule.mjs for a
// measured reason: the bar is fixed over a page that is mostly white, and at
// .55 it composited to #7f7f7f where 12px semibold measured 4.01:1, under the
// 4.5:1 small text needs. .65 gives 5.61:1 over white and is still 18.4:1 over
// a dark section.
const GLASS = 'background:rgba(22,22,22,.65);backdrop-filter:blur(24px) saturate(1.6);-webkit-backdrop-filter:blur(24px) saturate(1.6)';
const RING = 'border border-white/20 shadow-[0_20px_45px_-20px_rgba(0,0,0,.65)]';

export const SCROLLED_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline, for reference: four links and Register in one row, sized for a 1152px column and rendered at 390px. 576px of pill in 358px of space.',
    kind: 'current',
  },

  chips: {
    label: 'A — Two floating chips',
    note: 'No bar at all. The wordmark sits in its own frosted chip at the left, the burger in a matching circle at the right, and the space between them stays empty so the page keeps showing through. The lightest possible answer — it reads as two controls resting on the page rather than a band laid across it. Best over photography, which most of this site is.',
    kind: 'chips',
  },

  pill: {
    label: 'B — One floating pill',
    note: 'Both elements in a single pill that hugs its own content and centres. Keeps the desktop capsule\'s silhouette, so the scrolled state stays recognisably the same component at both widths — just with less in it. The most conservative option here.',
    kind: 'pill',
  },

  bar: {
    label: 'C — Full-width glass bar',
    note: 'Edge to edge, wordmark left, burger right, with the cyan hairline along the bottom. This is the new compact header\'s exact geometry, so scrolling reads as the header shrinking in place rather than as a pill arriving from somewhere else. The most "app" of the six, and the most predictable.',
    kind: 'bar',
    cyanEdge: true,
  },

  barCentered: {
    label: 'D — Full-width, wordmark centred',
    note: 'C, but with the 44px spacer trick from the header so the wordmark sits dead centre with the burger on the right. If you picked D2 upstairs, this is the option that keeps that decision true all the way down the page — the mark never moves sideways as you scroll.',
    kind: 'bar',
    centered: true,
    cyanEdge: true,
  },

  card: {
    label: 'E — Inset floating card',
    note: 'A full-width bar pulled in from the edges and given corners, so it floats over the page instead of clamping to it. Softer than C and more substantial than the chips — the shadow does the separating rather than a hairline. Suits the editorial tone of the rest of the site.',
    kind: 'card',
  },

  progress: {
    label: 'F — Bar with reading progress',
    note: 'C plus a cyan line along the bottom that fills as you move down the page — the hairline stops being decoration and starts reporting something. Costs nothing in height, since the rule was already there, and gives the long pages a sense of distance. The one option that adds a mechanism rather than just a shape.',
    kind: 'bar',
    progress: true,
  },
};

const mark = (site, h = 'h-8') => `<a href="/index.html"
      class="flex shrink-0 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      <span class="sr-only">${esc(site.brand.name)} — home</span>
      <img src="${esc(site.assets.logoWhite)}" alt="" width="240" height="88" aria-hidden="true"
           class="${h} w-auto object-contain" loading="lazy" decoding="async">
    </a>`;

const burger = (id, extra = '') => `<button type="button" data-panel="${esc(id)}"
      class="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${extra}"
      aria-expanded="false" aria-controls="${esc(id)}">
      <span class="sr-only">Toggle menu</span>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>`;

// The panel the burger opens. Belongs to the fixed element, not the header.
// Register lives down here now that the bar itself does not carry it — the
// menu is the one place it can go without costing height at rest.
const panel = (site, current, id, align) => `
  <div id="${esc(id)}" hidden
       class="pointer-events-auto mt-2 w-56 overflow-hidden rounded-2xl ${RING} ${align}"
       style="${GLASS}">
    <ul class="p-2">
      ${site.nav.map(n => `<li><a href="${esc(n.href)}"
        class="flex min-h-11 items-center rounded-xl px-4 font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:bg-white/10 hover:text-white ${current === n.href ? 'bg-white/15 text-white' : ''} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}
      <li class="px-2 pb-1 pt-2">
        <a href="${esc(site.nextEvent.ctaUrl)}"
           class="flex min-h-11 items-center justify-center rounded-full bg-cyan px-4 font-body text-[12px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
           ${esc(site.nextEvent.ctaText)}</a>
      </li>
    </ul>
  </div>`;

// The cyan rule along the bottom of a bar. As a border it costs 1px; as a
// progress track it costs the same 1px and reports scroll depth.
const cyanRule = (m) => m.progress
  ? `<div class="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
       <div data-progress class="h-full origin-left bg-cyan" style="transform:scaleX(0)"></div>
     </div>`
  : m.cyanEdge
    ? `<div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent"></div>`
    : '';

export const renderScrolled = (site, modeKey, current = '/index.html') => {
  const m = SCROLLED_MODES[modeKey];
  const id = 'sc-' + modeKey;
  const panelId = id + '-panel';

  // Baseline renders the shipped markup so the comparison is against the real
  // thing rather than a reconstruction of it.
  if (m.kind === 'current') {
    return `
<div id="${id}" data-from="top" aria-hidden="true"
     class="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3">
  <nav class="pointer-events-auto flex items-center gap-1 rounded-full ${RING} px-3 py-1.5" style="${GLASS}" aria-label="Primary, condensed">
    ${site.nav.map(n => `<a href="${esc(n.href)}"
      class="flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85">${esc(n.label)}</a>`).join('')}
    <a href="${esc(site.nextEvent.ctaUrl)}"
       class="ml-1 flex min-h-11 shrink-0 items-center rounded-full bg-cyan px-5 font-body text-[12px] font-bold uppercase tracking-[0.2em] text-ink">${esc(site.nextEvent.ctaText)}</a>
  </nav>
</div>`;
  }

  // A — two independent chips, nothing between them.
  if (m.kind === 'chips') {
    return `
<div id="${id}" data-from="top" aria-hidden="true"
     class="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col px-4 pt-3">
  <div class="flex items-center justify-between">
    <div class="pointer-events-auto flex h-11 items-center rounded-full ${RING} px-4" style="${GLASS}">
      ${mark(site, 'h-7')}
    </div>
    <div class="pointer-events-auto rounded-full ${RING}" style="${GLASS}">
      ${burger(panelId)}
    </div>
  </div>
  ${panel(site, current, panelId, 'self-end')}
</div>`;
  }

  // B — one pill, hugging its content, centred.
  if (m.kind === 'pill') {
    return `
<div id="${id}" data-from="top" aria-hidden="true"
     class="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-3">
  <nav class="pointer-events-auto flex items-center gap-3 rounded-full ${RING} py-1.5 pl-5 pr-2" style="${GLASS}" aria-label="Primary, condensed">
    ${mark(site)}
    ${burger(panelId)}
  </nav>
  ${panel(site, current, panelId, '')}
</div>`;
  }

  // C / D / F — full-width bar. E — the same bar, inset and rounded.
  const inset = m.kind === 'card';
  return `
<div id="${id}" data-from="top" aria-hidden="true"
     class="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col ${inset ? 'px-3 pt-3' : ''}">
  <nav class="pointer-events-auto relative flex items-center ${m.centered ? 'justify-between' : 'justify-between'} overflow-hidden ${inset ? `rounded-2xl ${RING}` : 'border-b border-white/15'} px-4 py-2"
       style="${GLASS}" aria-label="Primary, condensed">
    ${m.centered ? `<!-- Counterweight: equal mass to the burger opposite, which
         is what puts the wordmark on the centre axis. Same device as the
         header upstairs, for the same reason. -->
    <div class="h-11 w-11 shrink-0" aria-hidden="true"></div>` : ''}
    ${mark(site)}
    ${burger(panelId)}
    ${cyanRule(m)}
  </nav>
  ${panel(site, current, panelId, 'self-end mr-3')}
</div>`;
};

// Drives every variant: parks it off-screen, slides it in past the threshold,
// wires each burger to its own panel, and drives the progress rule where there
// is one. Transform and opacity only, so it stays on the compositor — the same
// contract the shipped capsule works to.
export const SCROLLED_JS = `
(function () {
  var caps = document.querySelectorAll('[id^="sc-"][data-from]');
  if (!caps.length) return;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THRESHOLD = 220;

  // Same fallback the shipped capsule carries. The glass is a .65 fill that
  // only reaches its contrast figures once the blur is actually compositing;
  // where backdrop-filter is unsupported the page shows straight through it
  // and 12px type lands on whatever is behind. Opaque is the honest answer
  // there, not a thinner blur.
  var blurs = window.CSS && CSS.supports &&
    (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)'));
  if (!blurs) {
    document.querySelectorAll('[id^="sc-"] nav, [id^="sc-"][data-from] > div, [id$="-panel"]').forEach(function (el) {
      if (el.style.background) el.style.background = 'rgba(22,22,22,.92)';
    });
  }

  function closePanels(root) {
    root.querySelectorAll('[data-panel]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      var p = document.getElementById(b.dataset.panel);
      if (p) p.hidden = true;
    });
  }

  caps.forEach(function (cap) {
    var off = 'translateY(-160%)';
    cap.style.transform = off;
    cap.style.opacity = '0';
    cap.style.willChange = 'transform, opacity';
    if (!reduced) cap.style.transition = 'transform .42s cubic-bezier(.22,1,.36,1), opacity .28s ease';

    var progress = cap.querySelector('[data-progress]');
    var shown = false, ticking = false;

    function show(on) {
      if (on === shown) return;
      shown = on;
      cap.style.transform = on ? 'translateY(0)' : off;
      cap.style.opacity = on ? '1' : '0';
      cap.setAttribute('aria-hidden', on ? 'false' : 'true');
      // A panel left open as the bar leaves would be open when it returns.
      if (!on) closePanels(cap);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || window.pageYOffset;
        show(y > THRESHOLD);
        if (progress) {
          var doc = document.documentElement;
          var max = doc.scrollHeight - doc.clientHeight;
          progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
        }
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  });

  document.querySelectorAll('[data-panel]').forEach(function (btn) {
    var p = document.getElementById(btn.dataset.panel);
    if (!p) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      p.hidden = open;
    });
  });
})();
`;

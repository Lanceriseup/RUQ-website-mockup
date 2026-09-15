// Compact mobile treatments for the "Common struggles" list.
//
// The section is a magazine spread on desktop: heading and six numbered
// problems in the left column, a 4:5 photographic plate in the right. Below lg
// the plate is `hidden`, so a phone gets the heading and the list alone — and
// the list was spaced to balance a photograph that is no longer there.
//
// Measured at 390px it runs about 700px:
//
//   pt-14                 56
//   script heading        72   4.5rem Julietta
//   mt-3 + sans          ~70   text-2xl uppercase, two lines
//   border + pb-4         21
//   mt-8                  32
//   six items            508   ~58px each at text-lg/relaxed, space-y-8 between
//   ─────────────────────────
//                       ~759
//
// Two thirds of that is the list, and most of the list is the 32px gaps
// between items rather than the sentences themselves. The items are short —
// one line of speech each — so they do not need to be held apart like
// paragraphs.
//
// Copy is verbatim client text and is not touched by any option here. The
// levers are spacing, the number's relationship to its sentence, and whether
// all six are on screen at once.
//
// Everything is MOBILE ONLY. Each option pairs its classes with lg: values
// that restore the shipped spread, so the desktop magazine layout cannot move.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';

const swash = (colour) => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

// The shipped heading, with the script size and the sans step as parameters.
// scriptSize is the one number that moves: 4.5rem is a desktop measurement
// that was never re-judged at 390px, where it eats a fifth of the section.
const heading = (scriptSize, sansClass) => `
<h2 class="leading-none">
  <span class="relative inline-block">
    <span class="script block" style="color:${MAGENTA};font-size:${scriptSize};line-height:.9">Common struggles</span>
    ${swash(MAGENTA)}
  </span>
  <span class="mt-3 block">
    <span class="block font-display ${sansClass} font-bold uppercase tracking-[0.06em] text-ink">women in marriage have</span>
  </span>
</h2>`;

export const STRUGGLES_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline: 4.5rem script, 18px items, 32px between them. Spaced to balance the photographic plate that sits beside it on desktop and is hidden on a phone.',
  },

  tighten: {
    label: 'A — Tighten, change nothing else',
    note: 'Same structure, re-judged at phone size. Script 4.5rem→3.25rem, sans 24px→20px, items 18px→16px, and the gap between them 32px→16px. The items are single sentences, not paragraphs, so they never needed paragraph spacing. No design decision to sign off — it is the same section with numbers chosen for the width it is actually rendered at.',
    tightHeading: true,
    list: 'stack',
  },

  inline: {
    label: 'B — Numbers inline (same height as A)',
    note: 'The number stops being a column and becomes the first thing in the sentence, so the second line starts at the left margin instead of under a 24px indent. Measured at 390px it comes out identical to A: the extra width recovers characters but not whole lines, because the items that wrap still wrap. So this is a look, not a saving — the hanging indent is a magazine device that needs width to read as a numbered column, and at 390px it was only ever an indent. Pick it over A if you prefer the text flush left.',
    tightHeading: true,
    list: 'inline',
  },

  rows: {
    label: 'C — Hairline rows (taller than A)',
    note: 'Gaps become rules — the same device the "healing and renewal" list below already uses, so both halves of the spread speak one language on mobile as they do on desktop. Be clear about the trade though: measured at 637px it is 71px TALLER than A, because every row needs padding above and below its rule and that costs more than the gaps it replaces. Choose it for structure and scannability, not for compactness.',
    tightHeading: true,
    list: 'rows',
  },

  grid: {
    label: 'D — Two-up grid',
    note: 'Six items as two columns of three at 14px. The most compact arrangement that still shows everything, and the numbers become useful rather than decorative because the reading order needs them. The risk is real: 14px is at the floor for body copy, and two narrow columns of speech can read as fragments rather than sentences.',
    tightHeading: true,
    list: 'grid',
  },

  reveal: {
    label: 'E — Three, then reveal',
    note: 'The first three are visible, the rest behind a "Show all six" button. By far the shortest at rest, and the first three carry the argument on their own. The cost is the honest one for progressive disclosure: most people will not tap, so items 4 to 6 effectively stop existing on mobile — and item 6 is the one about the bedroom, which is the most specific thing the section says.',
    tightHeading: true,
    list: 'reveal',
  },
};

export const renderStruggles = (c, modeKey) => {
  const m = STRUGGLES_MODES[modeKey];
  const items = c.home.painPoints.items;
  const num = (i) => String(i + 1).padStart(2, '0');

  const head = m.tightHeading
    ? heading('3.25rem', 'text-xl lg:text-[2.1rem]')
    : heading('4.5rem', 'text-2xl lg:text-[2.1rem]');

  let list;
  if (m.list === 'inline') {
    list = `<ul class="mt-6 space-y-4 lg:mt-12 lg:space-y-8">
      ${items.map((t, i) => `<li class="font-body text-base leading-relaxed text-ink lg:text-lg">
        <span aria-hidden="true" class="mr-2 font-display text-sm font-bold tabular-nums lg:mr-6 lg:text-xl" style="color:rgba(232,32,143,.55)">${num(i)}</span>${esc(t)}</li>`).join('')}
    </ul>`;
  } else if (m.list === 'rows') {
    list = `<ul class="mt-6 divide-y divide-ink/10 border-y border-ink/10 lg:mt-12 lg:divide-y-0 lg:border-0">
      ${items.map((t, i) => `<li class="flex gap-4 py-3 lg:gap-6 lg:py-0 lg:pt-8">
        <span aria-hidden="true" class="shrink-0 font-display text-sm font-bold leading-relaxed tabular-nums lg:text-xl lg:leading-none" style="color:rgba(232,32,143,.5)">${num(i)}</span>
        <p class="font-body text-base leading-relaxed text-ink lg:text-lg">${esc(t)}</p></li>`).join('')}
    </ul>`;
  } else if (m.list === 'grid') {
    list = `<ul class="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 lg:mt-12 lg:grid-cols-1 lg:gap-8">
      ${items.map((t, i) => `<li class="lg:flex lg:gap-6">
        <span aria-hidden="true" class="block font-display text-sm font-bold tabular-nums lg:shrink-0 lg:text-xl lg:leading-none" style="color:rgba(232,32,143,.5)">${num(i)}</span>
        <p class="mt-1 font-body text-sm leading-snug text-ink lg:mt-0 lg:text-lg lg:leading-relaxed">${esc(t)}</p></li>`).join('')}
    </ul>`;
  } else if (m.list === 'reveal') {
    // The first three are always in the DOM and always visible. The rest are
    // hidden with `hidden`, not removed, so they are still in the page for
    // search engines and for anyone printing it — and they are unconditionally
    // visible from lg up, where there is room for all six.
    list = `<ul class="mt-6 space-y-4 lg:mt-12 lg:space-y-8">
      ${items.map((t, i) => `<li class="${i > 2 ? 'hidden [&.is-open]:flex lg:flex' : 'flex'} gap-4 lg:gap-6" ${i > 2 ? 'data-extra' : ''}>
        <span aria-hidden="true" class="shrink-0 font-display text-sm font-bold leading-relaxed tabular-nums lg:text-xl lg:leading-none" style="color:rgba(232,32,143,.5)">${num(i)}</span>
        <p class="font-body text-base leading-relaxed text-ink lg:text-lg">${esc(t)}</p></li>`).join('')}
    </ul>
    <button type="button" data-reveal aria-expanded="false"
            class="mt-4 inline-flex min-h-11 items-center gap-2 font-body text-[12px] font-bold uppercase tracking-[0.2em] text-magenta-text lg:hidden">
      Show all six
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>`;
  } else {
    // current and A share the shipped structure; only the numbers differ.
    const gap = m.tightHeading ? 'mt-6 space-y-4' : 'mt-8 space-y-8';
    const size = m.tightHeading ? 'text-base' : 'text-lg';
    const numSize = m.tightHeading ? 'text-sm' : 'text-xl';
    list = `<ul class="${gap} lg:mt-12 lg:space-y-8">
      ${items.map((t, i) => `<li class="flex gap-4 lg:gap-6">
        <span aria-hidden="true" class="shrink-0 font-display ${numSize} font-bold leading-relaxed tabular-nums lg:text-xl lg:leading-none" style="color:rgba(232,32,143,.4)">${num(i)}</span>
        <p class="font-body ${size} leading-relaxed text-ink lg:text-lg">${esc(t)}</p></li>`).join('')}
    </ul>`;
  }

  return `
<div class="relative" style="background:linear-gradient(180deg,#ffffff,#FDF6F1 55%,#ffffff)">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,rgba(232,32,143,.12),transparent 68%)"></div>
  </div>
  <section id="struggles" class="relative mx-auto max-w-content px-6 ${m.tightHeading ? 'pt-10' : 'pt-14'} pb-8 lg:pt-24 lg:pb-12">
    <div class="border-b border-ink/10 pb-4">${head}</div>
    ${list}
  </section>
</div>`;
};

// ── Heading treatments ───────────────────────────────────────────────────────
//
// Round two. The list is settled — option A — so these vary only the heading
// above it, against two requirements:
//
//   1. "Common struggles" must never wrap. At the shipped 4.5rem it takes two
//      lines at 390px, which is what made the section look broken. A fixed
//      3.25rem happens to fit a 390px phone, but "happens to fit" is not the
//      same as cannot wrap — a 360px phone, or a longer heading later, breaks
//      it again. The options below that solve it properly use
//      `white-space:nowrap` with a vw-based clamp, so the type scales to
//      whatever width there is and one line is structural rather than lucky.
//
//   2. The sans line under it may want centring.
//
// The list stays left-aligned in every option. Six sentences centred would be
// ragged on both edges and much harder to read — centring is for the heading,
// not the argument.
const listA = (items, num) => `<ul class="mt-6 space-y-4 lg:mt-12 lg:space-y-8">
      ${items.map((t, i) => `<li class="flex gap-4 lg:gap-6">
        <span aria-hidden="true" class="shrink-0 font-display text-sm font-bold leading-relaxed tabular-nums lg:text-xl lg:leading-none" style="color:rgba(232,32,143,.4)">${num(i)}</span>
        <p class="font-body text-base leading-relaxed text-ink lg:text-lg">${esc(t)}</p></li>`).join('')}
    </ul>`;

// Fluid and unwrappable.
//
// The vw figure is derived, not guessed. This script renders at roughly 5.5px
// of width per 1px of font-size, and a phone has (viewport - 48px of gutters)
// to play with. Solving for about 9% clearance lands on 14.5vw:
//
//   360px phone   52.2px type → 287px wide in 312px available   25px spare
//   390px phone   56.6px type → 311px wide in 342px available   31px spare
//   430px phone   62.4px type → 343px wide in 382px available   39px spare
//
// The 4.5rem ceiling is the shipped desktop size, reached around 553px, so the
// spread above sm is untouched. The 2.25rem floor only engages below a 248px
// viewport, which no phone is. Combined with white-space:nowrap, two lines is
// not a thing that can happen at any width.
//
// An earlier pass used 13vw and rendered *smaller* than the fixed 3.25rem on a
// 390px phone, which defeated the point — hence deriving it rather than
// picking a round number.
const FLUID = 'clamp(2.25rem,14.5vw,4.5rem)';

export const HEADING_MODES = {
  left: {
    label: 'A — Left, fixed 3.25rem',
    note: 'What you approved with the list. Both lines left-aligned, script at a fixed 3.25rem. It fits one line at 390px — but only because 3.25rem happens to be small enough. On a 360px phone it is close, and any longer heading would wrap again.',
    scriptSize: '3.25rem',
    nowrap: false,
    align: 'left',
  },

  centered: {
    label: 'B — Centred, fixed 3.25rem',
    note: 'The same numbers, both lines centred over the left-aligned list. The simplest read of what you asked for. Carries the same fragility as A: one line is a coincidence of this heading at this width, not a guarantee.',
    scriptSize: '3.25rem',
    nowrap: false,
    align: 'center',
  },

  fluid: {
    label: 'C — Centred, fluid and unwrappable',
    note: 'Centred, and the script is set to scale with the viewport with wrapping switched off — so it is mathematically incapable of breaking onto two lines, and it renders larger than A on every phone because the ratio is derived from the type rather than picked — see the widths reported under each frame. This is the option that actually satisfies "must be one line" rather than happening to satisfy it.',
    scriptSize: FLUID,
    nowrap: true,
    align: 'center',
  },

  fluidEyebrow: {
    label: 'D — Centred, fluid script, sans as an eyebrow',
    note: 'C, with the second line demoted: smaller, wider-tracked, softer ink — the eyebrow device used everywhere else on this site. The script becomes unambiguously the heading and "women in marriage have" becomes the qualifier it grammatically is. The most composed of the five, and the shortest.',
    scriptSize: FLUID,
    nowrap: true,
    align: 'center',
    eyebrow: true,
  },

  fluidRule: {
    label: 'E — Centred, fluid script, short centred rule',
    note: 'C, with the full-width hairline under the heading replaced by a short rule centred beneath it. The full-width border reads as a divider between heading and list; a short centred one reads as part of the heading. Costs nothing in height — it is the same 1px in a different place.',
    scriptSize: FLUID,
    nowrap: true,
    align: 'center',
    shortRule: true,
  },
};

export const renderStrugglesHeading = (c, modeKey) => {
  const m = HEADING_MODES[modeKey];
  const items = c.home.painPoints.items;
  const num = (i) => String(i + 1).padStart(2, '0');

  // nowrap has to sit on the span that carries the font-size, and the swash is
  // absolutely positioned inside that same inline-block so it tracks the
  // script's width whatever the clamp resolves to.
  const script = `<span class="relative inline-block">
      <span class="script block" style="color:${MAGENTA};font-size:${m.scriptSize};line-height:.9${m.nowrap ? ';white-space:nowrap' : ''}">Common struggles</span>
      ${swash(MAGENTA)}
    </span>`;

  // mt-5, not mt-3, and only in eyebrow mode. The swash is drawn 0.28em tall
  // hanging below the script's baseline — about 16px under a 56px script — so
  // a 12px gap puts the stroke straight through a line of 11px type. The
  // larger sans line in the other options sits low enough to clear it on its
  // own; this one does not.
  const sans = m.eyebrow
    ? `<span class="mt-5 block font-display text-[11px] font-bold uppercase tracking-[0.3em] text-ink-soft lg:mt-3 lg:text-[2.1rem] lg:tracking-[0.06em] lg:text-ink">women in marriage have</span>`
    : `<span class="mt-3 block font-display text-xl font-bold uppercase tracking-[0.06em] text-ink lg:text-[2.1rem]">women in marriage have</span>`;

  const rule = m.shortRule
    ? `<div class="mx-auto mt-4 h-px w-24 bg-ink/20 lg:mx-0 lg:w-full"></div>`
    : '';

  return `
<div class="relative" style="background:linear-gradient(180deg,#ffffff,#FDF6F1 55%,#ffffff)">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,rgba(232,32,143,.12),transparent 68%)"></div>
  </div>
  <section id="struggles" class="relative mx-auto max-w-content px-6 pt-10 pb-8 lg:pt-24 lg:pb-12">
    <div class="${m.shortRule ? '' : 'border-b border-ink/10 pb-4'} ${m.align === 'center' ? 'text-center lg:text-left' : ''}">
      <h2 class="leading-none">${script}${sans}</h2>
      ${rule}
    </div>
    ${listA(items, num)}
  </section>
</div>`;
};

export const STRUGGLES_JS = `
(function () {
  document.querySelectorAll('[data-reveal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      var list = btn.previousElementSibling;
      list.querySelectorAll('[data-extra]').forEach(function (li) {
        li.classList.toggle('is-open', !open);
      });
      btn.firstChild.textContent = open ? 'Show all six ' : 'Show fewer ';
    });
  });
})();
`;

// Compact mobile treatments for the Statement of Faith creed.
//
// The section is a printed document rather than a web component: Cormorant
// throughout, drop cap, hanging numerals, hairline rules, on a parchment plate
// over a darkened photograph. Two columns from sm; one below it.
//
// On a 390px phone the plate's inner column is only 278px (390 - 48 page
// gutters - 64 plate padding), and everything in it was sized for a 4xl
// column. The creed is seven beliefs plus a 382-character intro, so this is
// the longest single block on the home page.
//
// ── One thing that is NOT on the table ───────────────────────────────────────
// faith.mjs documents a deliberate decision: "Nothing is hidden behind a
// disclosure. On the live site these seven points sit inside a collapsed
// accordion and then a scroll box, which makes the most load-bearing content
// on the page for this audience the hardest to reach."
//
// Option E does exactly that, and is included only so the comparison is
// complete — it reverses a decision someone already made for a stated reason.
// Everything else here gets the height down without touching reachability.
//
// All options are MOBILE ONLY, paired with sm: values restoring the shipped
// plate.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const FAITH_PHOTO = '/assets/photos/faith-bg.jpg';
const FAITH_SCRIM = 'rgba(28,28,28,.78)';

export const FAITH_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline. 64px of section padding, a 32px plate, a 3.5rem drop cap, and seven beliefs at 1.08rem with 20px between them — all sized for the two-column desktop plate.',
    sectionPad: 'py-16', platePad: 'p-8', intro: 'text-[1.2rem] leading-[1.5]',
    dropCap: true, belief: 'text-[1.08rem] leading-[1.45]', beliefGap: 'mb-5', rule: 'my-7',
  },

  tighten: {
    label: 'A — Tighten, nothing structural',
    note: 'Every number re-judged for a 278px column: section padding 64→40px, plate 32→24px, intro 1.2→1.05rem, beliefs 1.08→1rem with the leading closed a notch, and the gaps between them 20→12px. Layout, column count, drop cap and copy all untouched. The safest option and still the largest single saving, because this section is long enough that small per-item changes compound across seven items.',
    sectionPad: 'py-10 sm:py-28', platePad: 'p-6 sm:p-10', intro: 'text-[1.05rem] leading-[1.45] sm:text-[1.2rem] sm:leading-[1.5]',
    dropCap: true, belief: 'text-[1rem] leading-[1.4] sm:text-[1.08rem] sm:leading-[1.45]', beliefGap: 'mb-3 sm:mb-5', rule: 'my-5 sm:my-7',
  },

  noCap: {
    label: 'B — A, without the drop cap on phones',
    note: 'A, and the drop cap goes below sm. It is the right device in a wide column, but at 278px a 3.5rem letter floats beside the first three lines and leaves them about 30 characters each — so the opening of the creed is its most awkwardly set passage, exactly where it should read best. It returns at sm where there is room for it.',
    sectionPad: 'py-10 sm:py-28', platePad: 'p-6 sm:p-10', intro: 'text-[1.05rem] leading-[1.45] sm:text-[1.2rem] sm:leading-[1.5]',
    dropCap: 'sm', belief: 'text-[1rem] leading-[1.4] sm:text-[1.08rem] sm:leading-[1.45]', beliefGap: 'mb-3 sm:mb-5', rule: 'my-5 sm:my-7',
  },

  rows: {
    label: 'C — B, with the beliefs as hanging rows',
    note: 'B, and the seven beliefs get a proper hanging indent: the numeral sits in its own narrow column and the text aligns under itself rather than wrapping back beneath the number. In a 278px column that is the difference between a numbered list and a paragraph with a number in front of it. Costs a few pixels of indent and buys scannability across seven items.',
    sectionPad: 'py-10 sm:py-28', platePad: 'p-6 sm:p-10', intro: 'text-[1.05rem] leading-[1.45] sm:text-[1.2rem] sm:leading-[1.5]',
    dropCap: 'sm', belief: 'text-[1rem] leading-[1.4] sm:text-[1.08rem] sm:leading-[1.45]', beliefGap: 'mb-3 sm:mb-5', rule: 'my-5 sm:my-7',
    hanging: true,
  },

  clampIntro: {
    label: 'D — C, with the intro clamped',
    note: 'C, and the 382-character intro clamps to three lines behind a control — the same treatment just shipped on the mission statement above, so the two behave consistently rather than one collapsing and the other not. The seven beliefs stay fully visible, which is the part faith.mjs argues must never be hidden. A middle position: the prose folds, the creed does not.',
    sectionPad: 'py-10 sm:py-28', platePad: 'p-6 sm:p-10', intro: 'text-[1.05rem] leading-[1.45] sm:text-[1.2rem] sm:leading-[1.5]',
    dropCap: 'sm', belief: 'text-[1rem] leading-[1.4] sm:text-[1.08rem] sm:leading-[1.45]', beliefGap: 'mb-3 sm:mb-5', rule: 'my-5 sm:my-7',
    hanging: true, clampIntro: true,
  },

  collapse: {
    label: 'E — C, with the seven beliefs collapsed',
    note: 'INCLUDED FOR COMPARISON, NOT RECOMMENDED. C, with the creed itself behind "Read the full statement". By far the shortest, and it reverses a documented decision: faith.mjs records that the live site buried these seven points in an accordion inside a scroll box, and that this build deliberately un-buried them because they are the most load-bearing content on the page for this audience. Look at it, then decide whether the pixels are worth that.',
    sectionPad: 'py-10 sm:py-28', platePad: 'p-6 sm:p-10', intro: 'text-[1.05rem] leading-[1.45] sm:text-[1.2rem] sm:leading-[1.5]',
    dropCap: 'sm', belief: 'text-[1rem] leading-[1.4] sm:text-[1.08rem] sm:leading-[1.45]', beliefGap: 'mb-3 sm:mb-5', rule: 'my-5 sm:my-7',
    hanging: true, collapse: true,
  },
};

export const renderFaith = (c, modeKey) => {
  const m = FAITH_MODES[modeKey];

  // The drop cap is a first-letter rule, so switching it off below sm means
  // only applying the classes from sm up.
  const capClasses = m.dropCap === true
    ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[3.5rem] first-letter:font-semibold first-letter:leading-[.8] first-letter:text-magenta'
    : m.dropCap === 'sm'
      ? 'sm:first-letter:float-left sm:first-letter:mr-3 sm:first-letter:mt-1 sm:first-letter:text-[3.5rem] sm:first-letter:font-semibold sm:first-letter:leading-[.8] sm:first-letter:text-magenta'
      : '';

  const intro = `<p id="faith-intro" class="mt-6 ${m.intro} text-ink ${capClasses} ${m.clampIntro ? 'line-clamp-3 sm:line-clamp-none' : ''}">${esc(c.home.faith.intro)}</p>
    ${m.clampIntro ? `<button type="button" data-faith-more aria-expanded="false" aria-controls="faith-intro"
      class="mt-2 inline-flex min-h-11 items-center gap-1 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-magenta-text sm:hidden">
      <span data-label>Read more</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>` : ''}`;

  const item = (b, i) => m.hanging
    ? `<li class="${m.beliefGap} flex break-inside-avoid gap-3 ${m.belief} text-ink">
        <span aria-hidden="true" class="shrink-0 font-body text-sm font-semibold leading-[1.7]" style="color:${MAGENTA}">${String(i + 1).padStart(2, '0')}</span>
        <span>${esc(b)}</span>
      </li>`
    : `<li class="${m.beliefGap} break-inside-avoid ${m.belief} text-ink">
        <span aria-hidden="true" class="mr-2 align-baseline font-body text-sm font-semibold" style="color:${MAGENTA}">${String(i + 1).padStart(2, '0')}</span>${esc(b)}
      </li>`;

  const list = `<ol id="faith-list" class="columns-1 gap-10 sm:columns-2 ${m.collapse ? 'hidden sm:block' : ''}">
      ${c.home.faith.beliefs.map(item).join('')}
    </ol>
    ${m.collapse ? `<button type="button" data-faith-list aria-expanded="false" aria-controls="faith-list"
      class="inline-flex min-h-11 items-center gap-1 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-magenta-text sm:hidden">
      <span data-label>Read the full statement</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>` : ''}`;

  return `
<section id="faith" class="relative">
  <div aria-hidden="true" class="absolute inset-0 overflow-hidden">
    <img src="${FAITH_PHOTO}" alt="" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover grayscale contrast-125 brightness-90">
    <div class="absolute inset-0" style="background:${FAITH_SCRIM}"></div>
  </div>

  <div class="relative ${m.sectionPad}">
    <div class="mx-auto max-w-4xl px-6">
      <div class="${m.platePad} shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)]"
           style="background:#F6F1E8;font-family:'Cormorant Garamond',serif">
        <p class="text-center font-body text-[11px] uppercase tracking-[0.4em] text-ink-soft">${esc(c.home.faith.title)}</p>
        <div aria-hidden="true" class="mx-auto mt-5 h-px w-24" style="background:${MAGENTA}"></div>
        ${intro}
        <div aria-hidden="true" class="${m.rule} h-px w-full" style="background:rgba(28,28,28,.18)"></div>
        ${list}
      </div>
    </div>
  </div>
</section>`;
};

export const FAITH_JS = `
(function () {
  function wire(btnSel, targetId, cls, openText, shutText) {
    var btn = document.querySelector(btnSel);
    var el = document.getElementById(targetId);
    if (!btn || !el) return;
    var label = btn.querySelector('[data-label]');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      el.classList.toggle(cls, open);
      if (label) label.textContent = open ? openText : shutText;
    });
  }
  wire('[data-faith-more]', 'faith-intro', 'line-clamp-3', 'Read more', 'Show less');
  wire('[data-faith-list]', 'faith-list', 'hidden', 'Read the full statement', 'Show less');
})();
`;

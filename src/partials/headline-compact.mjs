// Compact mobile treatments for the homepage headline.
//
// The headline is one sentence broken into three pieces: "Become the" set
// small and letter-spaced, the rotating word oversized and gradient-filled,
// then "woman that God has designed you to be." in the same small sans. On
// desktop that stack is the page's whole opening statement and earns its size.
//
// On a 390px phone it measures roughly 150px:
//
//   BECOME THE          22   text-base, leading-snug
//   mt-3                12
//   rotating word       44   clamp() bottoms out at 2.75rem here
//   mt-7                28
//   closing sentence    44   two lines at 0.2em tracking
//   ───────────────────────
//                      150
//
// Two thirds of that is the two sans lines and the gaps between them, not the
// word everyone is looking at. So the levers, in the order they are worth
// pulling:
//
//   gaps       mt-3 and mt-7 are 40px of the 150, and were set by eye at
//              desktop size where the word is 96px, not 44px
//   tracking   0.2em on a 38-character sentence is what forces two lines
//   scale      the sans lines at 16px, and the word's 2.75rem floor
//
// Every option is MOBILE ONLY — each class below is paired with an sm: value
// that restores exactly what ships today, so the desktop hero cannot move.
import { esc } from './layout.mjs';

// What ships: shared by both sans lines so they cannot drift apart.
const SANS_SHIPPED =
  'block font-display text-base font-bold uppercase leading-snug tracking-[0.2em] text-white sm:text-2xl';

export const HEADLINE_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline. 16px sans lines at 0.2em, a 44px word, and 12px / 28px gaps around it.',
    sans: SANS_SHIPPED,
    gapWord: 'mt-3',
    gapAfter: 'mt-7',
    wordSize: 'clamp(2.75rem,9vw,6rem)',
  },

  gaps: {
    label: 'A — Close the gaps only',
    note: 'Nothing resized. The two gaps come from 12px and 28px to 8px and 12px, because they were judged against a 96px word and are holding a 44px one apart. The cheapest 20px on the page, and the sentence reads tighter as one thought rather than three stacked lines.',
    sans: SANS_SHIPPED,
    gapWord: 'mt-2 sm:mt-3',
    gapAfter: 'mt-3 sm:mt-7',
    wordSize: 'clamp(2.75rem,9vw,6rem)',
  },

  tracking: {
    label: 'B — Tighter letter-spacing (no height gain)',
    note: 'A, plus 0.2em down to 0.12em. Measured at 390px this comes out at exactly the same height as A, and here is why: the closing sentence is 38 characters, and getting it onto one line needs about 11px type — below that the tracking is irrelevant. Two lines is the floor at any readable size. So this buys texture, not height: the sentence reads tighter and less straggly for the same 131px. Worth it only if you prefer the look, and it spends some of the wide tracking that is a brand signature.',
    sans: 'block font-display text-base font-bold uppercase leading-snug tracking-[0.12em] text-white sm:text-2xl sm:tracking-[0.2em]',
    gapWord: 'mt-2 sm:mt-3',
    gapAfter: 'mt-3 sm:mt-7',
    wordSize: 'clamp(2.75rem,9vw,6rem)',
  },

  sans: {
    label: 'C — Smaller sans, same word',
    note: 'The two sans lines drop 16px to 14px and the gaps close, while the rotating word keeps its full 44px. The contrast between the small type and the big word gets stronger, which is the effect the design was after in the first place — this is the option that makes the word more dominant, not less.',
    sans: 'block font-display text-sm font-bold uppercase leading-snug tracking-[0.15em] text-white sm:text-2xl sm:tracking-[0.2em]',
    gapWord: 'mt-2 sm:mt-3',
    gapAfter: 'mt-3 sm:mt-7',
    wordSize: 'clamp(2.75rem,9vw,6rem)',
  },

  all: {
    label: 'D — Scale everything down',
    note: 'C, and the word\'s floor comes down from 2.75rem to 2.25rem as well, so the whole block shrinks in proportion rather than changing its internal relationships. The most conservative-looking result: it reads exactly like the desktop hero, just smaller. Also the option that gives up the most presence.',
    sans: 'block font-display text-sm font-bold uppercase leading-snug tracking-[0.15em] text-white sm:text-2xl sm:tracking-[0.2em]',
    gapWord: 'mt-2 sm:mt-3',
    gapAfter: 'mt-3 sm:mt-7',
    wordSize: 'clamp(2.25rem,9vw,6rem)',
  },

  eyebrow: {
    label: 'E — "Become the" as an eyebrow',
    note: 'Structural rather than dimensional. "Become the" stops pretending to be half of a headline and becomes an 11px cyan eyebrow — the same device the dates line and every section label on this site already use. The word then opens the headline properly, and the closing sentence carries it. The most compact and the most deliberate; also the one that changes the design rather than tuning it.',
    eyebrowLine: true,
    sans: 'block font-display text-sm font-bold uppercase leading-snug tracking-[0.15em] text-white sm:text-2xl sm:tracking-[0.2em]',
    gapWord: 'mt-2 sm:mt-3',
    gapAfter: 'mt-3 sm:mt-7',
    wordSize: 'clamp(2.75rem,9vw,6rem)',
  },
};

// Renders the headline block for one mode. The rotator markup, the .sheen
// fill and the screen-reader sentence are all exactly as hero.mjs builds them,
// so what is being compared is spacing and scale and nothing else.
export const renderHeadline = (c, modeKey) => {
  const m = HEADLINE_MODES[modeKey];

  const words = c.home.hero.rotatingWords.map((w, i) =>
    `<span class="hero-word sheen ${i === 0 ? 'is-on' : ''} font-display font-extrabold uppercase"
       style="grid-area:1/1;font-size:${m.wordSize};line-height:1;letter-spacing:-.01em">${esc(w)}</span>`
  ).join('');

  // E demotes the opening line to the site's standard eyebrow: 11px, cyan,
  // 0.3em. It stays inside the h1 because it is still the first half of the
  // sentence — it is being restyled, not removed.
  const before = m.eyebrowLine
    ? `<span class="block font-body text-[11px] font-bold uppercase tracking-[0.3em] text-cyan sm:font-display sm:text-2xl sm:font-bold sm:tracking-[0.2em] sm:text-white">${esc(c.home.hero.headingBefore)}</span>`
    : `<span class="${m.sans}">${esc(c.home.hero.headingBefore)}</span>`;

  return `
    <h1 class="text-white">
      ${before}
      <span class="${m.gapWord} block">
        <span class="hero-rotator relative inline-grid" data-swap="fade">${words}</span>
      </span>
      <span class="${m.gapAfter} ${m.sans}">${esc(c.home.hero.headingAfter)}</span>
    </h1>
    <p class="sr-only">${esc(c.home.hero.headingBefore)} ${esc(c.home.hero.rotatingWords.join(', '))} ${esc(c.home.hero.headingAfter)}</p>`;
};

// Treatments for the journey heading: "The journey doesn't end after the first
// event…"
//
// No option changes a word. What changes is how it is set.
//
// The problem with the current one is that all of it is magenta. #e8208f on
// white measures 4.17:1 — fine for a 30px bold heading, which is large text at
// 3:1 — but a whole two-line sentence in it is loud, and it flattens the
// sentence: "doesn't end" is the idea, and right now it carries no more weight
// than "after the". Four of the six below put most of the line in ink and
// spend the colour on the phrase that matters.
//
// The split is always the same and always on the natural clause boundary:
//
//   The journey doesn't end   |   after the first event…
//
// so nothing has to be reworded to make a treatment fit.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const JOURNEY_HEADINGS = {
  current: {
    label: 'Current — all magenta',
    note: 'What is there now, for comparison. Two lines of solid brand magenta. Legible, but the whole sentence shouts equally and the idea inside it does not stand out.',
  },
  accent: {
    label: 'Accent — ink, with the idea in magenta',
    note: 'The line in ink with only "doesn’t end" in brand magenta. The smallest change of the six and the one that most improves it: the sentence stops shouting and the phrase that carries the meaning is the thing you see. Also the most readable, since ink on white is 17.04:1 against magenta’s 4.17:1.',
  },
  script: {
    label: 'Script — the second clause in the brush face',
    note: 'First clause in uppercase Montserrat, second in Julietta Messie with the drawn swash beneath — the construction used on the homepage and the team page. The softer, ongoing half of the sentence gets the softer face, which is the right way round.',
  },
  sheen: {
    label: 'Duotone — "doesn’t end" in the brand gradient',
    note: 'Ink line with the key phrase filled by the magenta-to-cyan gradient that runs on the hero’s rotating word. Ties this section to the top of the site, and is the only option that puts both brand colours in the heading.',
  },
  stacked: {
    label: 'Stacked — three levels, the idea largest',
    note: '"The journey" as a small letter-spaced line, "doesn’t end" at display size beneath it, then the rest in sans. Gives the heading a shape rather than two equal lines, and makes the idea unmissable. The tallest of the six.',
  },
  underline: {
    label: 'Underline — the swash under the key phrase',
    note: 'Ink line with the drawn brush swash running under "doesn’t end". Uses the site’s own mark rather than a border, and adds emphasis without adding a second colour to the sentence.',
  },
};

const HEAD = 'The journey doesn’t end';
const TAIL = 'after the first event…';
const KEY = 'doesn’t end';

const swash = (colour, cls = '') => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full ${cls}" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

// Splits the first clause around the key phrase so it can be marked up. If the
// copy is ever edited so the phrase no longer appears, the line renders plain
// rather than breaking.
const markKey = (wrap) => {
  const i = HEAD.indexOf(KEY);
  if (i < 0) return esc(HEAD);
  return esc(HEAD.slice(0, i)) + wrap(esc(KEY)) + esc(HEAD.slice(i + KEY.length));
};

const BASE = 'font-display text-3xl font-bold leading-tight sm:text-[2.5rem]';

export const renderJourneyHeading = (key) => {
  if (key === 'accent') {
    return `
<h2 class="${BASE} text-ink">
  ${markKey(k => `<span style="color:${MAGENTA}">${k}</span>`)} ${esc(TAIL)}
</h2>`;
  }

  if (key === 'script') {
    return `
<h2 class="leading-none">
  <span class="block font-display text-2xl font-bold uppercase tracking-[0.08em] text-ink sm:text-[2rem]">${esc(HEAD)}</span>
  <span class="relative mt-3 inline-block">
    <span class="script block" style="color:${MAGENTA};font-size:clamp(2.2rem,5.4vw,3.4rem);line-height:.95">${esc(TAIL)}</span>
    ${swash(CYAN)}
  </span>
</h2>`;
  }

  if (key === 'sheen') {
    return `
<h2 class="${BASE} text-ink">
  ${markKey(k => `<span class="sheen">${k}</span>`)} ${esc(TAIL)}
</h2>`;
  }

  if (key === 'stacked') {
    return `
<h2 class="leading-none">
  <span class="block font-body text-[13px] font-bold uppercase tracking-[0.4em] text-ink-soft">The journey</span>
  <span class="mt-4 block font-display font-extrabold uppercase"
        style="font-size:clamp(2.4rem,6.4vw,4.2rem);letter-spacing:-.015em;color:${MAGENTA}">${esc(KEY)}</span>
  <span class="mt-4 block font-display text-xl font-bold text-ink sm:text-[1.7rem]">${esc(TAIL)}</span>
</h2>`;
  }

  if (key === 'underline') {
    return `
<h2 class="${BASE} text-ink">
  ${markKey(k => `<span class="relative inline-block">${k}${swash(MAGENTA)}</span>`)} ${esc(TAIL)}
</h2>`;
  }

  // current — the whole sentence in magenta
  return `
<h2 class="${BASE}" style="color:${MAGENTA}">${esc(HEAD)} ${esc(TAIL)}</h2>`;
};

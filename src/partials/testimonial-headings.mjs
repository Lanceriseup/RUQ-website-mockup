// Centred treatments for the testimonial heading.
//
// The copy is the client's, verbatim from the live page: "What Women Have
// Experienced at Rise Up Queens". Every option below sets the same words —
// only the emphasis and the arrangement move.
//
// The lead line underneath ("10 testimonies from the 2025 events…") is gone,
// so the heading now carries the section on its own and has to hold more
// weight than it did left-aligned with support beneath it.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const TESTIMONIAL_HEADINGS = {
  inline: {
    label: 'Inline script — the current treatment, centred',
    note: 'What is there now with the alignment changed and nothing else. The script word sits in the line of the sentence. Safest, and the smallest departure.',
  },
  stacked: {
    label: 'Stacked — the script word on its own line, large',
    note: 'The script word breaks onto its own line at nearly double the size with the drawn swash under it. Gives the heading three levels instead of two and makes the script the thing you see first.',
  },
  eyebrow: {
    label: 'Eyebrow — a small label above the heading',
    note: 'A letter-spaced line above sets the heading up and restores some of what the deleted lead sentence was doing, without a full paragraph. The only option that adds words, so it needs signing off.',
  },
  framed: {
    label: 'Framed — short brand rules either side',
    note: 'Short gradient rules flank the heading, the same device as the breakthrough CTA above. Quietest of the six and it ties this section to the one two above it.',
  },
  duotone: {
    label: 'Duotone — the key word in the brand gradient',
    note: 'No script at all: "experienced" carries the magenta-to-cyan fill used on the hero rotator. Bookends the page — the same device opens it and marks this section.',
  },
  oversized: {
    label: 'Oversized — display scale, script tucked under',
    note: 'The sentence set large and tight in Montserrat with the script word dropped beneath it as a caption. Most editorial of the six; reads as a title page rather than a section heading.',
  },
};

// Client copy split for emphasis. Nothing is reworded — join the three parts
// back together and you have the live heading.
const LEAD = 'What women have';
const KEY = 'experienced';
const TAIL = 'at Rise Up Queens';

const swash = (colour) => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

export const renderTestimonialHeading = (key) => {
  if (key === 'stacked') {
    return `
<h2 class="text-center font-display text-3xl font-bold leading-tight text-ink sm:text-[2.6rem]">
  ${esc(LEAD)}
  <span class="relative mx-auto mt-2 block w-fit">
    <span class="script block" style="color:${MAGENTA};font-size:2.1em;line-height:.85">${esc(KEY)}</span>
    ${swash(CYAN)}
  </span>
  <span class="mt-4 block">${esc(TAIL)}</span>
</h2>`;
  }

  if (key === 'eyebrow') {
    return `
<div class="text-center">
  <p class="font-body text-[11px] font-bold uppercase tracking-[0.4em]" style="color:${MAGENTA}">Ten women, one weekend</p>
  <h2 class="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-ink sm:text-[2.6rem]">
    ${esc(LEAD)} <span class="script align-baseline" style="color:${MAGENTA};font-size:1.35em;line-height:.8">${esc(KEY)}</span><br>${esc(TAIL)}
  </h2>
  <p class="mt-3 font-body text-[11px] uppercase tracking-[0.2em] text-ink-soft">Eyebrow is placeholder copy — needs writing</p>
</div>`;
  }

  if (key === 'framed') {
    return `
<div class="flex items-center justify-center gap-5">
  <span aria-hidden="true" class="hidden h-0.5 w-16 shrink-0 rounded-full sm:block"
        style="background:linear-gradient(to right,transparent,${MAGENTA})"></span>
  <h2 class="max-w-3xl text-center font-display text-3xl font-bold leading-tight text-ink sm:text-[2.4rem]">
    ${esc(LEAD)} <span class="script align-baseline" style="color:${MAGENTA};font-size:1.35em;line-height:.8">${esc(KEY)}</span><br>${esc(TAIL)}
  </h2>
  <span aria-hidden="true" class="hidden h-0.5 w-16 shrink-0 rounded-full sm:block"
        style="background:linear-gradient(to left,transparent,${CYAN})"></span>
</div>`;
  }

  if (key === 'duotone') {
    return `
<h2 class="mx-auto max-w-4xl text-center font-display font-extrabold leading-[1.08] text-ink"
    style="font-size:clamp(2rem,4.6vw,3.1rem)">
  ${esc(LEAD)} <span class="sheen">${esc(KEY)}</span><br>${esc(TAIL)}
</h2>`;
  }

  if (key === 'oversized') {
    return `
<div class="text-center">
  <h2 class="mx-auto max-w-4xl font-display font-extrabold uppercase text-ink"
      style="font-size:clamp(1.9rem,4.4vw,3rem);line-height:.98;letter-spacing:-.015em">
    ${esc(LEAD)} ${esc(KEY)}<br>${esc(TAIL)}
  </h2>
  <span class="script mt-3 block" style="color:${MAGENTA};font-size:2.2rem;line-height:.9">${esc(KEY)}</span>
</div>`;
  }

  // inline
  return `
<h2 class="mx-auto max-w-3xl text-center font-display text-3xl font-bold leading-tight text-ink sm:text-[2.6rem]">
  ${esc(LEAD)} <span class="script align-baseline" style="color:${MAGENTA};font-size:1.35em;line-height:.8">${esc(KEY)}</span><br>${esc(TAIL)}
</h2>`;
};

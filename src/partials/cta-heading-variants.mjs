// Treatments for the CTA heading, "It's time for your breakthrough".
//
// Right now it is bold Montserrat in ink — the same recipe as every other
// heading on the page, so nothing marks it as the one that precedes the only
// form on the homepage.
//
// The paragraph beneath is now serif at full ink, which raises the bar: the
// heading has to out-rank a body block that is no longer grey.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const CTA_HEADINGS = {
  script: {
    label: 'Script accent — "It’s time" in the brush face',
    note: 'The opening words take Julietta Messie with the drawn swash beneath, exactly as the section headings above do. Ties the CTA into the page’s established voice rather than inventing a new one.',
  },
  duotone: {
    label: 'Duotone — "breakthrough" filled with the brand gradient',
    note: 'The last word carries the magenta-to-cyan gradient used on the hero’s rotating word. Bookends the page: the same device opens it and closes the ask.',
  },
  oversized: {
    label: 'Oversized — display scale, tight, nothing else changed',
    note: 'Same typeface, pushed to clamp() display size with tightened tracking and leading. The bluntest fix and the one least likely to date.',
  },
  eyebrow: {
    label: 'Eyebrow — a small label above the heading',
    note: 'A letter-spaced line above sets up the heading and gives the block two levels. Also the only option that adds a line of copy, so it needs wording.',
  },
  outlined: {
    label: 'Outlined echo — a ghost copy offset behind',
    note: 'An outlined duplicate sits offset behind the solid heading, the same device as the outline hero option. Graphic depth with no colour added.',
  },
  ruleFramed: {
    label: 'Framed — short gradient rules either side',
    note: 'Short brand rules flank the heading on one line. Quietest of the six, and it reads as a section marker rather than a louder headline.',
  },
};

const swash = (colour) => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

export const renderCtaHeading = (c, key) => {
  const full = c.home.cta.heading;           // It’s time for your breakthrough
  const head = 'It’s time';
  const tail = 'for your breakthrough';

  if (key === 'script') {
    return `
<h2 class="leading-none">
  <span class="relative inline-block">
    <span class="script block" style="color:${MAGENTA};font-size:3.75rem;line-height:.9">${esc(head)}</span>
    ${swash(MAGENTA)}
  </span>
  <span class="mt-3 block font-display text-2xl font-bold uppercase tracking-[0.06em] text-ink sm:text-[2.1rem]">${esc(tail)}</span>
</h2>`;
  }

  if (key === 'duotone') {
    return `
<h2 class="font-display font-extrabold leading-[1.05] text-ink" style="font-size:clamp(2.25rem,5vw,3.5rem)">
  It&rsquo;s time for your <span class="sheen">breakthrough</span>
</h2>`;
  }

  if (key === 'oversized') {
    return `
<h2 class="mx-auto max-w-4xl font-display font-extrabold uppercase text-ink"
    style="font-size:clamp(2.5rem,6vw,4.5rem);line-height:.95;letter-spacing:-.02em">${esc(full)}</h2>`;
  }

  if (key === 'eyebrow') {
    return `
<div>
  <p class="font-body text-[11px] font-bold uppercase tracking-[0.35em]" style="color:${MAGENTA}">One step from here</p>
  <h2 class="mt-4 font-display text-3xl font-bold text-ink sm:text-[2.75rem]">${esc(full)}</h2>
  <p class="mt-3 font-body text-[11px] uppercase tracking-[0.2em] text-ink-soft">Eyebrow is placeholder copy — needs writing</p>
</div>`;
  }

  if (key === 'outlined') {
    return `
<h2 class="relative inline-block font-display font-extrabold leading-[1.05] text-ink"
    style="font-size:clamp(2.25rem,5.5vw,3.75rem)">
  <span aria-hidden="true" class="absolute left-1.5 top-1.5 -z-10 text-transparent"
        style="-webkit-text-stroke:2px rgba(232,32,143,.45)">${esc(full)}</span>
  ${esc(full)}
</h2>`;
  }

  // ruleFramed
  return `
<div class="flex items-center justify-center gap-5">
  <span aria-hidden="true" class="hidden h-0.5 w-16 rounded-full sm:block"
        style="background:linear-gradient(to right,transparent,${MAGENTA})"></span>
  <h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">${esc(full)}</h2>
  <span aria-hidden="true" class="hidden h-0.5 w-16 rounded-full sm:block"
        style="background:linear-gradient(to left,transparent,${CYAN})"></span>
</div>`;
};

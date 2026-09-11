// Centred wording options for the testimonial heading.
//
// The style is settled: the same construction as "Common struggles / WOMEN IN
// MARRIAGE HAVE" two sections above — script line in magenta with the drawn
// swash beneath it, then the rest in uppercase Montserrat. Only the words
// change between the options below.
//
// COPY WARNING. The live heading is "What Women Have Experienced at Rise Up
// Queens". Only the first option keeps it; the other five are wording I have
// written, and every one of them is marked on the options page. Client copy is
// the client's to change.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';

export const TESTIMONIAL_HEADINGS = {
  verbatim: {
    script: 'What women have',
    sans: 'experienced at Rise Up Queens',
    label: 'The live wording, re-split',
    note: 'The client’s own sentence, unchanged, broken across the two faces. The only option that invents nothing. The uppercase line is long, which makes it the least punchy of the six but the easiest to sign off.',
    clientCopy: true,
  },
  mirror: {
    script: 'Real change',
    sans: 'women in marriage found',
    label: 'Mirrors the struggles heading above',
    note: 'Deliberately built to answer “Common struggles / WOMEN IN MARRIAGE HAVE” — same grammar, same rhythm, same length, past tense instead of present. Read the page top to bottom and the two headings become a question and its answer. Strongest of the six as a piece of page structure.',
  },
  ownWords: {
    script: 'In their own',
    sans: 'words',
    label: 'Shortest — one word underneath',
    note: 'The most compact pairing possible, which lets the script run large without the line below fighting it. Says nothing about what happened, so it leans entirely on the faces in the rails to carry the meaning.',
  },
  afterward: {
    script: 'Life after',
    sans: 'Rise Up Queens',
    label: 'Keeps the brand name in the heading',
    note: 'Names the event, which the verbatim option also does but in half the words. “After” does the work: it implies a before without spelling one out.',
  },
  saidYes: {
    script: 'What happened',
    sans: 'when they said yes',
    label: 'Frames it as a decision, not an event',
    note: 'The only option that points at the reader rather than the women on screen — “yes” is the thing the CTA above just asked for. Most persuasive, and the furthest from the client’s wording.',
  },
  hearIt: {
    script: 'Hear it from',
    sans: 'the women who came',
    label: 'Plainest — an instruction',
    note: 'Tells you what to do rather than describing anything. Warm and unfussy; the one that would survive a client who dislikes anything that sounds like marketing.',
  },
};

// Lifted from spread.mjs so the two headings are the same object, not two
// things that resemble each other.
const swash = (colour) => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

export const renderTestimonialHeading = (key) => {
  const o = TESTIMONIAL_HEADINGS[key] ?? TESTIMONIAL_HEADINGS.verbatim;

  // clamp() rather than the fixed 4.5rem the struggles heading uses. That one
  // sits in a half-width column; this is centred across the full container, so
  // a long script line at a fixed size would run off a phone. The upper bound
  // is 4.5rem, so at desktop the two are identical.
  return `
<h2 class="text-center leading-none">
  <span class="relative inline-block">
    <span class="script block" style="color:${MAGENTA};font-size:clamp(2.5rem,7vw,4.5rem);line-height:.9">${esc(o.script)}</span>
    ${swash(MAGENTA)}
  </span>
  <span class="mt-3 block font-display text-2xl font-bold uppercase tracking-[0.06em] text-ink sm:text-[2.1rem]">${esc(o.sans)}</span>
</h2>`;
};

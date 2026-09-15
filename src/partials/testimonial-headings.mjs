// Centred wording options for the testimonial heading.
//
// The style is settled: the same construction as "Common struggles / WOMEN IN
// MARRIAGE HAVE" two sections above — script line in magenta with the drawn
// swash beneath it, then the rest in uppercase Montserrat. Only the words
// change between the options below.
//
// COPY WARNING. The live heading is "What Women Have Experienced at Rise Up
// Queens". Only `verbatim` keeps it; the other five are wording I have
// written, and every one of them is marked on the options page.
//
// The homepage currently ships `mirror`, which is NOT the client's wording.
// That was chosen deliberately — see the note in pages.mjs — but it has to be
// signed off before it goes anywhere near production. Passing 'verbatim' in
// pages.mjs puts their sentence back and changes nothing else.
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
  //
  // 11vw and nowrap, matching the struggles and renewal headings: at the old
  // 7vw floor of 2.5rem the script could still wrap, and a wrapped script line
  // is what made those two look broken on a phone. With wrapping off it cannot
  // happen at any width, and the vw figure carries the size instead of a floor.
  // The 4.5rem ceiling is unchanged, so desktop renders exactly as before.
  //
  // The sans line drops to the 11px letter-spaced eyebrow below sm — the same
  // demotion chosen for the other two headings, so all three read as one system
  // on a phone rather than one of them shouting.
  return `
<h2 class="text-center leading-none">
  <span class="relative inline-block">
    <span class="script block" style="color:${MAGENTA};font-size:clamp(2.25rem,11vw,4.5rem);line-height:.9;white-space:nowrap">${esc(o.script)}</span>
    ${swash(MAGENTA)}
  </span>
  <span class="mt-4 block font-display text-[11px] font-bold uppercase tracking-[0.3em] text-ink-soft sm:mt-3 sm:text-[2.1rem] sm:tracking-[0.06em] sm:text-ink">${esc(o.sans)}</span>
</h2>`;
};

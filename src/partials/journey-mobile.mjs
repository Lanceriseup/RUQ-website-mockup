// Compact mobile treatments for the About page's journey section.
//
// The shipped treatment is "overlap": each step is a tall 3:4 photograph with
// a white card laid across its lower edge carrying the title and copy. On
// desktop the three sit in a row with the middle one dropped, so the stagger
// stops them reading as a table.
//
// Measured at 390px the block is 2310px — three cards at 342x557. The photo is
// the whole of it: 3:4 across a 342px column is 456px, and the card only
// claws 48px of that back by overlapping.
//
// The thing worth noticing is that the overlap device needs a tall photograph
// to overlap. On desktop the card sits across the bottom third of a portrait
// in a narrow column and reads as a caption plate laid on a print. At full
// phone width the photograph is nearly a screen tall on its own, and the card
// reads less as an overlap than as the next block starting slightly early.
//
// So the options split two ways: keep the device and shrink the photograph
// (A-C), or accept it does not earn its height on a phone and lay the step out
// as a row (D).
//
// All options are MOBILE ONLY; the staggered three-up desktop row is untouched.
import { esc } from './layout.mjs';

export const JOURNEY_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline: a 3:4 photograph at full column width — 456px — with the white card overlapping its lower edge by 48px. Three of those makes 2310px.',
    pad: 'py-14', gapTop: 'mt-10', gapY: 'gap-y-10', aspect: 'aspect-[3/4]',
    cardPad: 'p-6', cardInset: 'mx-4 -mt-12', layout: 'overlap',
  },

  tighten: {
    label: 'A — Tighten, keep the device',
    note: 'Section padding 56→40px, the gap under the heading 40→24px, between steps 40→28px, and the white card 24→20px. The photograph is untouched, so the overlap reads exactly as it does now. The smallest change, and it barely dents the total because the photograph is the problem.',
    pad: 'py-10 sm:py-24', gapTop: 'mt-6 sm:mt-16', gapY: 'gap-y-7 sm:gap-y-16', aspect: 'aspect-[3/4]',
    cardPad: 'p-5 sm:p-6', cardInset: 'mx-4 -mt-12', layout: 'overlap',
  },

  landscape: {
    label: 'B — A, photographs at 4:3',
    note: 'A, and the crop turns landscape below sm: 456px of photograph becomes 256px. This is the same argument as the plates on the homepage — 3:4 is a portrait ratio that earns its height in a narrow desktop column, and on a phone the column is the whole screen. The overlap still has plenty to sit on. Halves the block for one class change.',
    pad: 'py-10 sm:py-24', gapTop: 'mt-6 sm:mt-16', gapY: 'gap-y-7 sm:gap-y-16', aspect: 'aspect-[4/3] sm:aspect-[3/4]',
    cardPad: 'p-5 sm:p-6', cardInset: 'mx-4 -mt-12', layout: 'overlap',
  },

  banner: {
    label: 'C — A, photographs at 16:9',
    note: 'A, cropped harder still — 192px of photograph. The shortest option that keeps the overlap. The risk is that below about 200px a photograph with a white card across its bottom third has very little photograph left showing, and the device starts to look like a mistake rather than a choice. Worth looking at next to B before deciding.',
    pad: 'py-10 sm:py-24', gapTop: 'mt-6 sm:mt-16', gapY: 'gap-y-7 sm:gap-y-16', aspect: 'aspect-video sm:aspect-[3/4]',
    cardPad: 'p-5 sm:p-6', cardInset: 'mx-4 -mt-12', layout: 'overlap',
  },

  row: {
    label: 'D — Rows on phones, not cards',
    note: 'Below sm each step becomes a row: a square photograph at 96px on the left, title and copy on the right, separated by a hairline. The overlap device is dropped rather than shrunk, on the grounds that it needs a tall photograph to overlap and a phone cannot afford one. By far the most compact, and it turns three big cards into something you can take in at a glance. The cost is that the photographs stop being the point.',
    pad: 'py-10 sm:py-24', gapTop: 'mt-6 sm:mt-16', gapY: 'gap-y-7 sm:gap-y-16', aspect: 'aspect-[3/4]',
    cardPad: 'p-5 sm:p-6', cardInset: 'mx-4 -mt-12', layout: 'row',
  },
};

const img = (card, cls) => `
<img src="${esc(card.photo)}" alt="${esc(card.alt || '')}" loading="lazy" decoding="async" class="${cls}">`;

export const renderJourneyCards = (c, modeKey) => {
  const m = JOURNEY_MODES[modeKey];
  const cards = c.about.journey.cards;

  const overlapCard = (card, i) => `
  <article class="${i === 1 ? 'md:mt-14' : ''}">
    <div class="relative">
      <div class="overflow-hidden rounded-[1.5rem]">
        ${img(card, `${m.aspect} w-full object-cover`)}
      </div>
      <div class="relative ${m.cardInset} rounded-xl bg-white ${m.cardPad} shadow-[0_24px_50px_-28px_rgba(28,28,28,.5)] ring-1 ring-ink/[.07]">
        <h3 class="font-display text-base font-bold leading-tight text-ink sm:text-lg">${esc(card.title)}</h3>
        <p class="mt-2 font-body text-[14px] leading-relaxed text-ink-soft sm:mt-2.5">${esc(card.body)}</p>
      </div>
    </div>
  </article>`;

  // D keeps the shipped cards in the DOM for sm and up and renders rows below
  // it, so the desktop stagger is untouched by construction.
  const rowItem = (card) => `
  <li class="flex items-start gap-4 border-b border-ink/10 pb-5 last:border-0 last:pb-0">
    <img src="${esc(card.photo)}" alt="${esc(card.alt || '')}" loading="lazy" decoding="async"
         class="h-24 w-24 shrink-0 rounded-xl object-cover">
    <div class="min-w-0">
      <h3 class="font-display text-base font-bold leading-tight text-ink">${esc(card.title)}</h3>
      <p class="mt-1.5 font-body text-[13px] leading-relaxed text-ink-soft">${esc(card.body)}</p>
    </div>
  </li>`;

  const body = m.layout === 'row'
    ? `<ul class="${m.gapTop} space-y-5 sm:hidden">${cards.map(rowItem).join('')}</ul>
       <div class="${m.gapTop} hidden gap-x-8 ${m.gapY} sm:grid md:grid-cols-3">${cards.map(overlapCard).join('')}</div>`
    : `<div class="${m.gapTop} grid gap-x-8 ${m.gapY} md:grid-cols-3">${cards.map(overlapCard).join('')}</div>`;

  return `
<div id="journey" class="relative bg-white">
  <div class="mx-auto max-w-content px-6 ${m.pad}">
    <p class="text-center font-body text-[11px] font-bold uppercase tracking-[0.3em] text-ink-soft">The journey</p>
    <h2 class="mt-2 text-center font-display text-2xl font-extrabold text-magenta sm:text-4xl">Doesn't end</h2>
    <p class="mt-1 text-center font-display text-base font-bold text-ink sm:text-xl">after the first event&hellip;</p>
    ${body}
  </div>
</div>`;
};

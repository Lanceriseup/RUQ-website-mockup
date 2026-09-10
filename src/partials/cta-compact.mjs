// Compact dates + Register treatments, action first.
//
// The previous set were all panels and cards, which ate vertical space and
// pushed the fold down. These invert the order the brief asked for — Register
// on top, dates underneath as supporting detail — and every one is under
// roughly 130px tall, against 200–320px for the card treatments.
//
// The trade being made: dates read as a caption to the action rather than as
// the reason for it. That suits a page where the video has already done the
// selling by this point.
import { esc } from './layout.mjs';

export const COMPACTS = {
  caption: {
    label: 'Caption — button, then one quiet line',
    height: '~104px',
    note: 'The plainest version. Button, then date, location and the second date on a single small line. Nothing competes with the button.',
  },
  chips: {
    label: 'Chips — button, then both dates as small pills',
    height: '~118px',
    note: 'Each date becomes a bordered chip, October carrying the LIMITED SPOTS badge. Reads as selectable even though it is not, which draws the eye down.',
  },
  divided: {
    label: 'Divided — button, then dates split by a hairline',
    height: '~112px',
    note: 'Dates sit either side of a thin vertical rule with the location beneath. Symmetrical and calm; the rule does the organising rather than boxes.',
  },
  badged: {
    label: 'Badged — scarcity above the button, dates below',
    height: '~126px',
    note: 'LIMITED SPOTS floats above the button as its own line, so the urgency lands before the click rather than after. Dates follow as fine print.',
  },
  underline: {
    label: 'Underlined — button, then dates on a cyan rule',
    height: '~110px',
    note: 'A single cyan hairline under the date line ties it back to the nav divider and the VSL frame. The most consistent with the rest of the page.',
  },
  stacked: {
    label: 'Stacked — button, primary date large, second small',
    height: '~130px',
    note: 'The only one that keeps the October date at a readable display size. Tallest of the six, still half the height of the card options.',
  },
};

const btn = (site) => `
<a href="${esc(site.nextEvent.ctaUrl)}"
   class="group inline-flex min-h-11 items-center gap-3 rounded-full bg-magenta px-9 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_16px_36px_-16px_rgba(232,32,143,.9)] transition hover:bg-magenta-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta">
   ${esc(site.nextEvent.ctaText)}
   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
        class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</a>`;

const pill = (t) => `<span class="inline-flex items-center rounded-full bg-cyan px-2.5 py-0.5 font-body text-[9px] font-bold uppercase tracking-[0.18em] text-ink">${esc(t)}</span>`;

export const renderCompact = (site, c, key) => {
  const [a, b] = site.nextEvent.upcoming;

  if (key === 'chips') {
    return `
<div class="flex flex-col items-center gap-4">
  ${btn(site)}
  <div class="flex flex-wrap items-center justify-center gap-2">
    <span class="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 font-body text-xs text-white">
      <strong class="font-semibold">${esc(a.dates)}</strong>
      <span class="text-white/45">${esc(a.location)}</span>
      ${a.note ? pill(a.note) : ''}
    </span>
    <span class="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 font-body text-xs text-white/65">
      <span>${esc(b.dates)}</span>
    </span>
  </div>
</div>`;
  }

  if (key === 'divided') {
    return `
<div class="flex flex-col items-center gap-4">
  ${btn(site)}
  <div class="flex items-stretch gap-5 text-center">
    <div>
      <p class="font-display text-sm font-bold text-white">${esc(a.dates)}</p>
      <p class="mt-0.5 font-body text-[11px] uppercase tracking-[0.15em] text-white/50">${esc(a.location)}</p>
    </div>
    <div aria-hidden="true" class="w-px bg-white/20"></div>
    <div>
      <p class="font-display text-sm font-bold text-white/70">${esc(b.dates)}</p>
      <p class="mt-0.5 font-body text-[11px] uppercase tracking-[0.15em] text-white/40">${esc(b.location)}</p>
    </div>
  </div>
</div>`;
  }

  if (key === 'badged') {
    return `
<div class="flex flex-col items-center gap-3">
  ${a.note ? pill(a.note) : ''}
  ${btn(site)}
  <p class="font-body text-xs text-white/60">
    <span class="text-white/85">${esc(a.dates)}</span> &middot; ${esc(a.location)}
    <span class="mx-2 text-white/25">|</span> ${esc(b.dates)}
  </p>
</div>`;
  }

  if (key === 'underline') {
    return `
<div class="flex flex-col items-center gap-4">
  ${btn(site)}
  <div class="inline-block border-b-2 border-cyan pb-2">
    <p class="font-body text-xs uppercase tracking-[0.18em] text-white">
      ${esc(a.dates)} <span class="text-white/45">&middot;</span> ${esc(a.location)}
      <span class="ml-2 text-white/55">&amp; ${esc(b.dates)}</span>
    </p>
  </div>
</div>`;
  }

  if (key === 'stacked') {
    return `
<div class="flex flex-col items-center gap-3">
  ${btn(site)}
  <div class="text-center">
    <p class="font-display text-xl font-bold text-white">
      ${esc(a.dates)} ${a.note ? `<span class="align-middle">${pill(a.note)}</span>` : ''}
    </p>
    <p class="mt-1 font-body text-xs text-white/55">${esc(a.location)} &nbsp;&middot;&nbsp; next after that, ${esc(b.dates)}</p>
  </div>
</div>`;
  }

  // caption
  return `
<div class="flex flex-col items-center gap-4">
  ${btn(site)}
  <p class="font-body text-xs text-white/60">
    <span class="font-semibold text-white/85">${esc(a.dates)}</span>, ${esc(a.location)}
    &nbsp;&middot;&nbsp; ${esc(b.dates)}
  </p>
</div>`;
};

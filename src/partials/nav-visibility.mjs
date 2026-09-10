// Link-legibility treatments for design G's hero mode.
//
// The problem: 11px uppercase at 0.25em tracking in white/75 over moving
// footage is the weakest element on the page. Video luminance shifts frame to
// frame, so a value that reads fine on a dark shot disappears on a bright one.
//
// Two families of fix, and they combine:
//   TYPE   — make the glyphs themselves stronger (weight, size, opacity)
//   GROUND — control what is behind them (scrim, shadow, panel)
// Ground fixes are more reliable, because they stop depending on the footage.
import { esc } from './layout.mjs';

export const VISIBILITY = {
  current: {
    label: 'Current — white/75, no ground treatment',
    note: 'Baseline. Legible on dark frames, fades on bright ones.',
    link: 'text-white/75 hover:text-white',
    nav: '', scrim: '', wrap: '',
  },
  solid: {
    label: 'Full-opacity white + semibold',
    note: 'Cheapest fix. Type only — still at the mercy of a bright frame.',
    link: 'text-white font-semibold hover:text-cyan',
    nav: '', scrim: '', wrap: '',
  },
  larger: {
    label: 'Larger type — 13px, tighter tracking',
    note: 'Drops tracking to 0.18em so the extra size does not overrun the logo.',
    link: 'text-white !text-[13px] !tracking-[0.18em] font-semibold hover:text-cyan',
    nav: '', scrim: '', wrap: '',
  },
  shadow: {
    label: 'Text shadow — legible on any frame',
    note: 'A soft dark shadow behind the glyphs. Invisible as an effect, but the type never drops out.',
    link: 'text-white font-semibold hover:text-cyan [text-shadow:0_1px_12px_rgba(0,0,0,.85),0_1px_3px_rgba(0,0,0,.9)]',
    nav: '', scrim: '', wrap: '',
  },
  scrim: {
    label: 'Gradient scrim behind the whole header',
    note: 'A dark band fading down from the top edge. Guarantees contrast without a hard bar.',
    link: 'text-white font-semibold hover:text-cyan',
    nav: '', wrap: '',
    scrim: `<div class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-ink/85 via-ink/45 to-transparent"></div>`,
  },
  underline: {
    label: 'Persistent cyan hairline under each link',
    note: 'Adds a second cue besides colour, so the links read as links, not captions.',
    link: 'text-white font-semibold hover:text-cyan border-b border-cyan/50 hover:border-cyan',
    nav: '', scrim: '', wrap: '',
  },
  panel: {
    label: 'Frosted panel behind the link rows',
    note: 'Borrows E\'s glass. Strongest separation, but adds a visible object to a design built on restraint.',
    link: 'text-white font-semibold hover:text-cyan',
    nav: 'rounded-full bg-white/10 px-4 py-1 backdrop-blur-md', scrim: '', wrap: '',
  },
  combined: {
    label: 'Recommended — scrim + full white + semibold + shadow',
    note: 'Belt and braces: the scrim handles bright frames, the shadow handles the scrim\'s soft edge.',
    link: 'text-white font-semibold hover:text-cyan [text-shadow:0_1px_10px_rgba(0,0,0,.7)]',
    nav: '', wrap: '',
    scrim: `<div class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-ink/80 via-ink/40 to-transparent"></div>`,
  },
};

export const renderNavVis = (site, key) => {
  const v = VISIBILITY[key];
  const half = Math.ceil(site.nav.length / 2);
  const linkCls = `flex min-h-11 items-center px-3 font-body text-[11px] uppercase tracking-[0.25em] transition
      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${v.link}`;
  const link = (n) => `<a href="${esc(n.href)}" class="${linkCls}">${esc(n.label)}</a>`;
  const grp = `hidden flex-1 justify-evenly md:flex ${v.nav}`;

  return `
${v.scrim}
<header class="absolute inset-x-0 top-0 z-40">
  <div class="mx-auto max-w-content px-4 pt-7">
    <nav class="flex items-center justify-between gap-4" aria-label="Primary">
      <div class="${grp}">${site.nav.slice(0, half).map(link).join('')}</div>
      <a href="/index.html" class="shrink-0">
        <img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="240" height="88"
             class="h-20 w-auto object-contain sm:h-[5.5rem]" loading="eager" decoding="async">
      </a>
      <div class="${grp}">${site.nav.slice(half).map(link).join('')}</div>
    </nav>
    <div class="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
    <div class="mt-5 pb-5 text-center">
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="inline-flex min-h-11 items-center border-b-2 border-cyan pb-1 font-body text-xs font-bold uppercase tracking-[0.3em] text-white">
         ${esc(site.nextEvent.ctaText)}</a>
    </div>
  </div>
</header>`;
};

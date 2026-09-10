// Parameterised build of design G, so logo size, link grouping and the divider
// can be compared independently. Whatever combination is chosen gets folded
// back into nav.mjs and this file goes away.
import { esc } from './layout.mjs';

/* ── Logo sizes. Base is the shipped h-12/h-14 (48/56px). ───────────────── */
export const LOGOS = {
  base:    { cls: 'h-12 sm:h-14',            label: 'Current — 56px' },
  plus30:  { cls: 'h-16 sm:h-[4.5rem]',      label: '+30% — 72px' },
  plus60:  { cls: 'h-20 sm:h-[5.5rem]',      label: '+60% — 88px' },
  plus100: { cls: 'h-24 sm:h-28',            label: '+100% — 112px' },
};

/* ── Link grouping. Controls how near the links sit to the wordmark. ─────
   Each returns [outer wrapper class, left group class, right group class]. */
export const SPACINGS = {
  edge:     { label: 'Current — pushed to the outer edges',
              wrap: 'justify-between', left: 'flex-1 justify-start', right: 'flex-1 justify-end' },
  balanced: { label: 'Balanced — centred within each half',
              wrap: 'justify-between', left: 'flex-1 justify-center', right: 'flex-1 justify-center' },
  close:    { label: 'Close — links pulled in toward the logo',
              wrap: 'justify-between', left: 'flex-1 justify-end pr-4', right: 'flex-1 justify-start pl-4' },
  hug:      { label: 'Hug — one tight centred cluster, no stretch',
              wrap: 'justify-center gap-2', left: '', right: '' },
};

/* ── Divider treatments for the rule under the nav. ──────────────────────── */
export const DIVIDERS = {
  gradientCyan: {
    label: 'Current — cyan, fading out at both ends',
    html: `<div class="h-px w-full bg-gradient-to-r from-transparent via-cyan to-transparent"></div>`,
  },
  solidHairline: {
    label: 'Solid hairline — full width, quiet',
    html: `<div class="h-px w-full bg-cyan/40"></div>`,
  },
  shortCentred: {
    label: 'Short centred rule — 96px, deliberate',
    html: `<div class="mx-auto h-0.5 w-24 bg-cyan"></div>`,
  },
  duotone: {
    label: 'Duotone — magenta into cyan',
    html: `<div class="h-px w-full bg-gradient-to-r from-magenta via-cyan to-magenta opacity-80"></div>`,
  },
  centreOut: {
    label: 'Centre-out — brightest under the wordmark',
    html: `<div class="h-px w-full" style="background:linear-gradient(90deg,transparent,#00b9c6 35%,#00b9c6 65%,transparent)"></div>`,
  },
  diamond: {
    label: 'Rule with centre diamond',
    html: `<div class="relative flex items-center">
      <div class="h-px flex-1 bg-gradient-to-r from-transparent to-cyan"></div>
      <div class="mx-3 h-2 w-2 rotate-45 bg-cyan"></div>
      <div class="h-px flex-1 bg-gradient-to-l from-transparent to-cyan"></div>
    </div>`,
  },
  doubleRule: {
    label: 'Double hairline — editorial',
    html: `<div class="space-y-1">
      <div class="h-px w-full bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
      <div class="mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-cyan/50 to-transparent"></div>
    </div>`,
  },
  dotted: {
    label: 'Dotted — softer, less structural',
    html: `<div class="h-px w-full" style="background-image:radial-gradient(circle,#00b9c6 1px,transparent 1px);background-size:6px 1px"></div>`,
  },
  thickFade: {
    label: 'Weighted bar — 3px, fading',
    html: `<div class="h-[3px] w-full rounded-full bg-gradient-to-r from-transparent via-cyan to-transparent"></div>`,
  },
  none: {
    label: 'No divider — let the spacing do the work',
    html: `<div class="h-px w-full"></div>`,
  },
};

export const renderNav = (site, opts = {}) => {
  const onHero = opts.overHero !== false;
  const logo = LOGOS[opts.logo || 'plus30'];
  const sp = SPACINGS[opts.spacing || 'close'];
  const div = DIVIDERS[opts.divider || 'gradientCyan'];

  const linkCls = `flex min-h-11 items-center px-3 font-body text-[11px] uppercase tracking-[0.25em] transition
    ${onHero ? 'text-white/75 hover:text-white' : 'text-ink-soft hover:text-magenta-text'}
    focus-visible:outline-2 focus-visible:outline-offset-2 ${onHero ? 'focus-visible:outline-white' : 'focus-visible:outline-magenta'}`;

  const link = (n) => `<a href="${esc(n.href)}" class="${linkCls}">${esc(n.label)}</a>`;
  const half = Math.ceil(site.nav.length / 2);

  return `
<header class="${onHero ? 'absolute inset-x-0 top-0' : 'relative bg-white'} z-40">
  <div class="mx-auto max-w-content px-4 pt-7">
    <nav class="flex items-center ${sp.wrap} gap-4" aria-label="Primary">
      <div class="hidden ${sp.left} md:flex">${site.nav.slice(0, half).map(link).join('')}</div>
      <a href="/index.html" class="shrink-0">
        <img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="200" height="64"
             class="${logo.cls} w-auto object-contain ${onHero ? '' : 'brightness-0'}" loading="eager" decoding="async">
      </a>
      <div class="hidden ${sp.right} md:flex">${site.nav.slice(half).map(link).join('')}</div>
    </nav>
    <div class="mt-6">${div.html}</div>
    <div class="mt-5 pb-5 text-center">
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="inline-flex min-h-11 items-center border-b-2 border-cyan pb-1 font-body text-xs font-bold uppercase tracking-[0.3em] ${onHero ? 'text-white' : 'text-ink'}">
         ${esc(site.nextEvent.ctaText)}</a>
    </div>
  </div>
</header>`;
};

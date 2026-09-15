// Compact mobile header options.
//
// The shipped header (nav.mjs, design G) is built around a centred 80px
// wordmark with a cyan hairline below it. On a desktop that reads as an
// editorial masthead. On a 390px phone it costs ~153px before any content:
//
//     pt-7   28   top padding
//     logo   80   h-20 stacked lockup (crown over wordmark)
//     mt-6   24   gap to the hairline
//     rule    1
//     mb-5   20
//     ────────────
//            153   — roughly a fifth of a phone viewport, spent on a logo
//
// Every option below changes MOBILE ONLY. The md: breakpoint classes are left
// at the shipped values, so whichever one is picked drops into nav.mjs without
// touching the desktop masthead at all.
//
// Three axes are being traded against each other:
//
//   size       how much of the 80px wordmark survives
//   geometry   centred masthead vs. left-aligned app bar
//   rule       the cyan hairline costs 45px in margins, not 1px
//
import { esc } from './layout.mjs';

export const COMPACT_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline, for reference. Centred 80px lockup, hairline with 24px above and 20px below.',
    pad: 'pt-7',
    logo: 'h-20',
    lift: '-translate-y-2',
    layout: 'center',
    rule: 'gradient',
    ruleGap: 'mt-6 mb-5',
    sticky: false,
    heroPad: 'pt-44',
  },

  trim: {
    label: 'A — Trim in place',
    note: 'Identical design, smaller numbers. Logo 80→48px, padding 28→16px, hairline margins 24/20→12/12. The optical -8px lift is dropped because it only mattered at the large size. Nothing about the composition changes, so it needs no design sign-off — it is the same header, quieter.',
    pad: 'pt-4',
    logo: 'h-12',
    lift: '',
    layout: 'center',
    rule: 'gradient',
    ruleGap: 'mt-3 mb-3',
    sticky: false,
    heroPad: 'pt-28',
  },

  noRule: {
    label: 'B — Keep the logo, drop the hairline',
    note: 'For if the wordmark is the part worth protecting. The logo only comes down to 56px, but the hairline and its 44px of margin go entirely — over the video hero the footage already separates header from content, so the rule was decoration there. Roughly the same saving as A, spent differently.',
    pad: 'pt-4',
    logo: 'h-14',
    lift: '',
    layout: 'center',
    rule: 'none',
    ruleGap: 'mb-3',
    sticky: false,
    heroPad: 'pt-28',
  },

  leftLockup: {
    label: 'C — Left-aligned app bar',
    note: 'Worth knowing before you compare: the shipped header is only centred on desktop. On mobile the two link groups are hidden, so justify-between already pins the logo left — which is why A and C look so alike. What C actually changes is the hairline, which hugs the bottom of the row instead of floating 24px under it, and the logo drops to 44px to match the burger. Treat it as "A, tightened", not as a new geometry.',
    pad: 'pt-4',
    logo: 'h-11',
    lift: '',
    layout: 'left',
    rule: 'gradient',
    ruleGap: 'mt-3',
    sticky: false,
    heroPad: 'pt-24',
  },

  centeredMini: {
    label: 'D — Burger left, logo centred',
    note: 'The only option that genuinely changes the mobile geometry: the burger moves left and an equal-width spacer goes right, so the wordmark sits dead centre — which is what the desktop masthead does and what mobile currently only pretends to do. Same height as C.',
    pad: 'pt-4',
    logo: 'h-11',
    lift: '',
    layout: 'centerBurgerLeft',
    rule: 'gradient',
    ruleGap: 'mt-3',
    sticky: false,
    heroPad: 'pt-24',
  },

  centeredRight: {
    label: 'D2 — Logo centred, burger right',
    note: 'D with the burger back on the right, where it already is today and where a right-handed thumb reaches. The 44px spacer simply moves to the left edge instead — the wordmark still lands dead centre, because what centres it is having equal weight on both sides, not which side the button is on. Same height as D; the only thing that changes is which hand it favours.',
    pad: 'pt-4',
    logo: 'h-11',
    lift: '',
    layout: 'centerBurgerRight',
    rule: 'gradient',
    ruleGap: 'mt-3',
    sticky: false,
    heroPad: 'pt-24',
  },

  bar: {
    label: 'E — Slim bar, cyan edge',
    note: 'The most compact of the set. A 56px row: 36px logo left, burger right, and the cyan hairline demoted to the bar’s own bottom edge so it costs 1px rather than 45px. Under a third of what ships today.',
    pad: 'pt-0',
    logo: 'h-9',
    lift: '',
    layout: 'leftBar',
    rule: 'edge',
    ruleGap: '',
    sticky: false,
    heroPad: 'pt-20',
  },

  stickySlim: {
    label: 'F — Slim bar, pinned',
    note: 'E’s geometry, but fixed to the top on a smoked-glass ground, so navigation is reachable anywhere on the page rather than only at the very top. The trade is honest: it is the shortest header here, and the only one that never gives its pixels back.',
    pad: 'pt-0',
    logo: 'h-9',
    lift: '',
    layout: 'leftBar',
    rule: 'edge',
    ruleGap: '',
    sticky: true,
    heroPad: 'pt-20',
  },
};

// Renders the production header with one mobile treatment applied. `overHero`
// mirrors nav.mjs's mode of the same name — white type on the dark video.
export const renderCompactNav = (site, modeKey, opts = {}) => {
  const m = COMPACT_MODES[modeKey];
  const onHero = opts.overHero !== false;

  const linkBase =
    'flex min-h-11 items-center px-3 font-body text-[12px] uppercase tracking-[0.25em] transition focus-visible:outline-2 focus-visible:outline-offset-2';
  const linkTone = onHero
    ? 'text-white font-semibold hover:text-cyan focus-visible:outline-white [text-shadow:0_1px_10px_rgba(0,0,0,.7)]'
    : 'text-ink-soft hover:text-magenta-text focus-visible:outline-magenta';
  const link = (n) => `<a href="${esc(n.href)}" class="${linkBase} ${linkTone}">${esc(n.label)}</a>`;
  const half = Math.ceil(site.nav.length / 2);
  const group = 'flex-1 justify-evenly';

  // The md: half of every class below is the shipped desktop value, so only
  // the phone rendering differs between modes.
  const logo = `<img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}"
      width="240" height="88" loading="eager" decoding="async"
      class="${m.logo} w-auto ${m.lift} object-contain md:h-[5.5rem] md:-translate-y-2 ${onHero ? '' : 'brightness-0'}">`;

  const burger = `<button type="button" class="nav-toggle grid h-11 w-11 place-items-center rounded-lg md:hidden ${onHero ? 'text-white' : 'text-ink'}"
          data-target="navMain" aria-expanded="false" aria-controls="navMain">
    <span class="sr-only">Toggle menu</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
  </button>`;

  const desktopLinks = (slice) => `<div class="hidden ${group} md:flex">${slice.map(link).join('')}</div>`;

  // Three mobile geometries. All of them keep the desktop link groups in the
  // DOM so md: still renders the untouched masthead.
  let row;
  if (m.layout === 'center') {
    row = `${desktopLinks(site.nav.slice(0, half))}
      <a href="/index.html" class="shrink-0">${logo}</a>
      ${desktopLinks(site.nav.slice(half))}
      ${burger}`;
  } else if (m.layout === 'centerBurgerLeft') {
    // The right-hand spacer matches the burger's 44px so the wordmark lands
    // on the centre axis rather than 22px left of it.
    row = `<div class="md:hidden">${burger}</div>
      ${desktopLinks(site.nav.slice(0, half))}
      <a href="/index.html" class="shrink-0">${logo}</a>
      ${desktopLinks(site.nav.slice(half))}
      <div class="h-11 w-11 shrink-0 md:hidden" aria-hidden="true"></div>`;
  } else if (m.layout === 'centerBurgerRight') {
    // Mirror of the above. The spacer leads so the burger can keep the right
    // edge it already owns; equal weight either side is what centres the
    // wordmark, so the button's side is a free choice.
    row = `<div class="h-11 w-11 shrink-0 md:hidden" aria-hidden="true"></div>
      ${desktopLinks(site.nav.slice(0, half))}
      <a href="/index.html" class="shrink-0">${logo}</a>
      ${desktopLinks(site.nav.slice(half))}
      ${burger}`;
  } else {
    // left / leftBar — logo hard left on mobile, put back on the centre axis
    // at md via flex order.
    row = `<a href="/index.html" class="shrink-0 md:order-2">${logo}</a>
      <div class="hidden ${group} md:order-1 md:flex">${site.nav.slice(0, half).map(link).join('')}</div>
      <div class="hidden ${group} md:order-3 md:flex">${site.nav.slice(half).map(link).join('')}</div>
      ${burger}`;
  }

  const ruleEl = m.rule === 'gradient'
    ? `<div class="${m.ruleGap} h-px w-full bg-gradient-to-r from-transparent via-cyan to-transparent md:mt-6 md:mb-5"></div>`
    : m.rule === 'edge'
      ? ''   // painted as the header's own bottom border instead
      : `<div class="${m.ruleGap} md:mt-6 md:mb-5 md:h-px md:w-full md:bg-gradient-to-r md:from-transparent md:via-cyan md:to-transparent"></div>`;

  // E/F hang the cyan rule on the header edge, so it costs 1px of layout
  // rather than a margin above and below it.
  const edge = m.rule === 'edge' ? 'border-b border-cyan/70 md:border-0' : '';
  const position = m.sticky
    ? 'fixed inset-x-0 top-0 bg-ink/80 backdrop-blur md:bg-transparent md:backdrop-blur-0'
    : onHero ? 'absolute inset-x-0 top-0' : 'relative border-b border-ink-line bg-white';

  // The scrim is hero-only and otherwise unchanged, except that the short bars
  // do not need 288px of gradient — it is scaled to the header above it.
  const scrim = onHero && !m.sticky
    ? `<div class="pointer-events-none absolute inset-x-0 top-0 ${m.layout === 'leftBar' ? 'h-40' : 'h-56'} bg-gradient-to-b from-ink/80 via-ink/40 to-transparent md:h-72"></div>`
    : '';

  const rowHeight = m.layout === 'leftBar' ? 'h-14 md:h-auto' : '';

  return `
<header id="site-nav" data-mode="${esc(modeKey)}" class="${position} ${edge} z-40">
  ${scrim}
  <div class="relative mx-auto max-w-content px-4 ${m.pad} md:pt-7">
    <nav class="flex items-center justify-between gap-4 ${rowHeight}" aria-label="Primary">
      ${row}
    </nav>
    ${ruleEl}
  </div>

  <ul id="navMain" hidden class="md:hidden ${onHero ? 'bg-ink/95 backdrop-blur' : 'border-t border-ink-line bg-white'} px-6 py-4">
    ${site.nav.map(n => `<li><a href="${esc(n.href)}"
      class="flex min-h-11 items-center font-body text-[12px] uppercase tracking-[0.25em] ${onHero ? 'text-white' : 'text-ink'}">${esc(n.label)}</a></li>`).join('')}
  </ul>
</header>`;
};

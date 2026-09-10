// Frosted / glassmorphic takes on the collapse behaviour.
//
// The wrinkle specific to this page: what sits behind the header changes as
// you scroll. At the top it is dark video; past the hero it is white page
// content. A glass panel samples whatever is behind it, so the tint decides
// which of those two it can survive:
//
//   LIGHT frost  — white wash + blur. Reads light over both, so the type has
//                  to flip to ink on collapse.
//   DARK frost   — ink wash + blur. Reads dark over both, so white type
//                  carries straight through and the hero mood is kept.
//
// Both are legitimate; they just commit differently.
import { esc } from './layout.mjs';

export const GLASS_MODES = {
  lightFrost: {
    label: 'Light frost — white glass, ink type',
    note: 'White wash at 65% with a 20px blur. The familiar frosted-glass bar. Type flips to ink on collapse, so it stops depending on the footage entirely.',
    tint: 'light',
  },
  darkFrost: {
    label: 'Dark frost — smoked glass, white type throughout',
    note: 'Ink wash at 55%. Type never changes colour, so the hero\'s mood carries down the page. Sits darker over white content, which reads deliberate rather than accidental.',
    tint: 'dark',
  },
  capsule: {
    label: 'Floating capsule — detaches into a frosted pill',
    note: 'Rather than spanning full width, the collapsed bar pulls in and rounds off into a floating pill inset from the edges. The most obviously "designed" collapse.',
    tint: 'dark',
  },
  cyanEdge: {
    label: 'Light frost + glowing cyan edge',
    note: 'Light glass with the hairline kept as a lit cyan bottom edge and a soft glow beneath. Keeps G\'s signature element doing visible work in the collapsed state.',
    tint: 'light',
  },
  progressiveFrost: {
    label: 'Progressive frost — blur ramps with scroll',
    note: 'No snap. Blur radius and tint opacity interpolate continuously with scroll position, so the glass appears to thicken as you move. Most physical of the six.',
    tint: 'light',
  },
  brandFrost: {
    label: 'Brand-tinted frost — faint magenta wash',
    note: 'Light glass carrying a faint magenta tint rather than neutral white, so the collapsed bar still reads as brand rather than chrome. Subtle at rest, obvious beside the others.',
    tint: 'light',
  },
};

export const renderGlassNav = (site, mode) => {
  const half = Math.ceil(site.nav.length / 2);
  const link = (n) => `<a href="${esc(n.href)}"
      class="nav-link flex min-h-11 items-center px-3 font-body text-[12px] font-semibold uppercase tracking-[0.25em] text-white transition hover:text-cyan [text-shadow:0_1px_10px_rgba(0,0,0,.7)]">${esc(n.label)}</a>`;

  return `
<header id="gnav" data-mode="${esc(mode)}" data-tint="${esc(GLASS_MODES[mode].tint)}" class="absolute inset-x-0 top-0 z-40">
  <div id="gnav-scrim" class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-ink/80 via-ink/40 to-transparent"></div>
  <div id="gnav-panel" class="relative mx-auto max-w-content px-4 pt-7">
    <nav id="gnav-nav" class="flex items-center justify-between gap-4" aria-label="Primary">
      <div class="hidden flex-1 justify-evenly md:flex">${site.nav.slice(0, half).map(link).join('')}</div>
      <a href="/index.html" class="shrink-0">
        <img id="gnav-logo" src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="240" height="88"
             class="h-20 w-auto object-contain sm:h-[5.5rem]" loading="eager" decoding="async">
      </a>
      <div class="hidden flex-1 justify-evenly md:flex">${site.nav.slice(half).map(link).join('')}</div>
    </nav>

    <div id="gnav-rule" class="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan to-transparent"></div>

    <div id="gnav-cta-row" class="mt-5 pb-5 text-center">
      <a href="${esc(site.nextEvent.ctaUrl)}" id="gnav-cta"
         class="inline-flex min-h-11 items-center border-b-2 border-cyan pb-1 font-body text-xs font-bold uppercase tracking-[0.3em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,.7)]">
         ${esc(site.nextEvent.ctaText)}</a>
    </div>
  </div>
</header>`;
};

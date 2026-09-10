// Scroll behaviours for design G's header.
//
// The constraint: G at rest is 225px tall — an 88px wordmark, the cyan
// hairline, and a CTA on its own line. Pinning that as-is would eat a third
// of a laptop viewport. So every option below is really an answer to "what
// does G collapse into?", not just "does it stick?".
//
// All six respect prefers-reduced-motion: the end states still apply, but
// without transitions.
import { esc } from './layout.mjs';

export const SCROLL_MODES = {
  condense: {
    label: 'Condense — collapses into a compact bar',
    note: 'Wordmark scales 88px to 36px, the stacked rows fold into one line, and the cyan hairline becomes the bar\'s bottom border. Nothing is lost, it just gets smaller.',
    keeps: 'Everything — links, logo, CTA',
  },
  hideReveal: {
    label: 'Hide / reveal — away on scroll down, back on scroll up',
    note: 'Scrolls off naturally, then a compact bar drops back the moment you scroll up. Gives content the whole screen while keeping nav one gesture away.',
    keeps: 'Everything, on demand',
  },
  fadeThrough: {
    label: 'Fade-through — two distinct states, cross-dissolved',
    note: 'The tall editorial header fades out; a separate compact bar fades in. Reads as two designed states rather than one squashed one.',
    keeps: 'Logo, links, CTA — re-laid out',
  },
  progressive: {
    label: 'Progressive — tied continuously to scroll position',
    note: 'No threshold. Background opacity, blur and logo scale interpolate with how far you have scrolled, so it feels physically linked to the gesture.',
    keeps: 'Everything, continuously',
  },
  minimal: {
    label: 'Minimal — collapses to logo + menu only',
    note: 'The most aggressive collapse. Links fold into a Menu control, leaving a very slim bar. Maximum reading room.',
    keeps: 'Logo, CTA, Menu button',
  },
  progressRule: {
    label: 'Progress rule — the cyan hairline becomes a scroll indicator',
    note: 'Condenses like the first option, but the divider does double duty: it fills left-to-right as you read. Uses G\'s own signature element rather than adding a new one.',
    keeps: 'Everything + reading progress',
  },
};

export const renderScrollNav = (site, mode) => {
  const half = Math.ceil(site.nav.length / 2);
  const link = (n) => `<a href="${esc(n.href)}"
      class="nav-link flex min-h-11 items-center px-3 font-body text-[12px] uppercase tracking-[0.25em] font-semibold text-white transition hover:text-cyan [text-shadow:0_1px_10px_rgba(0,0,0,.7)]">${esc(n.label)}</a>`;

  return `
<header id="snav" data-mode="${esc(mode)}" class="absolute inset-x-0 top-0 z-40">
  <div id="snav-scrim" class="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-ink/80 via-ink/40 to-transparent"></div>
  <div id="snav-inner" class="relative mx-auto max-w-content px-4 pt-7">
    <nav id="snav-nav" class="flex items-center justify-between gap-4" aria-label="Primary">
      <div class="hidden flex-1 justify-evenly md:flex">${site.nav.slice(0, half).map(link).join('')}</div>
      <a href="/index.html" class="shrink-0">
        <img id="snav-logo" src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="240" height="88"
             class="h-20 w-auto object-contain sm:h-[5.5rem]" loading="eager" decoding="async">
      </a>
      <div class="hidden flex-1 justify-evenly md:flex">${site.nav.slice(half).map(link).join('')}</div>
      <button type="button" id="snav-menu" class="hidden h-11 items-center gap-2 px-3 font-body text-[12px] font-semibold uppercase tracking-[0.25em] text-white">
        Menu
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </nav>

    <div id="snav-rule-wrap" class="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan to-transparent">
      <div id="snav-progress" class="h-full w-0 bg-cyan" hidden></div>
    </div>

    <div id="snav-cta-row" class="mt-5 pb-5 text-center">
      <a href="${esc(site.nextEvent.ctaUrl)}" id="snav-cta"
         class="inline-flex min-h-11 items-center border-b-2 border-cyan pb-1 font-body text-xs font-bold uppercase tracking-[0.3em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,.7)]">
         ${esc(site.nextEvent.ctaText)}</a>
    </div>
  </div>
</header>`;
};

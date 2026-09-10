// Production header — design G, "editorial hairline".
//
// Centred oversized wordmark, links split either side as small uppercase type
// with wide letter-spacing, and a single cyan hairline beneath. No filled
// buttons in the bar itself; the CTA is a link with a rule under it.
//
// Two modes, because the design has to survive both contexts:
//
//   overHero  — absolutely positioned on top of the dark video hero, white
//               type, transparent ground. Used on the homepage.
//   standard  — a normal white bar with ink type for the eight interior
//               pages, which have light backgrounds and would render white
//               text invisible. Structure, spacing and the cyan hairline are
//               identical, so the two read as the same component.
//
// Type scale is deliberately small (11px) — at 0.25em tracking, uppercase,
// it stays legible while keeping the wordmark dominant. Touch targets are
// still 44px via min-h-11 despite the small glyphs.
import { esc } from './layout.mjs';

export const header = (site, current, opts = {}) => {
  const onHero = Boolean(opts.overHero);

  const linkBase =
    'flex min-h-11 items-center px-3 font-body text-[11px] uppercase tracking-[0.25em] transition focus-visible:outline-2 focus-visible:outline-offset-2';
  const linkTone = onHero
    ? 'text-white/75 hover:text-white focus-visible:outline-white'
    : 'text-ink-soft hover:text-magenta-text focus-visible:outline-magenta';
  const linkActive = onHero ? 'text-white' : 'text-magenta-text';

  const link = (n) => `<a href="${esc(n.href)}"
      class="${linkBase} ${linkTone} ${current === n.href ? linkActive : ''}"
      ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a>`;

  const half = Math.ceil(site.nav.length / 2);

  // The wordmark ships as a white PNG. On light ground `brightness-0` renders
  // it solid black rather than shipping a second asset.
  const logo = `<img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}"
      width="180" height="58" loading="eager" decoding="async"
      class="h-12 w-auto object-contain sm:h-14 ${onHero ? '' : 'brightness-0'}">`;

  const burgerTone = onHero ? 'text-white' : 'text-ink';

  return `
<header class="${onHero ? 'absolute inset-x-0 top-0' : 'relative border-b border-ink-line bg-white'} z-40">
  <div class="mx-auto max-w-content px-4 ${onHero ? 'pt-7' : 'pt-5'}">
    <nav class="flex items-center justify-between gap-4" aria-label="Primary">
      <div class="hidden flex-1 justify-start md:flex">${site.nav.slice(0, half).map(link).join('')}</div>
      <a href="/index.html" class="shrink-0">${logo}</a>
      <div class="hidden flex-1 justify-end md:flex">${site.nav.slice(half).map(link).join('')}</div>
      <button type="button" class="nav-toggle grid h-11 w-11 place-items-center rounded-lg md:hidden ${burgerTone}"
              data-target="navMain" aria-expanded="false" aria-controls="navMain">
        <span class="sr-only">Toggle menu</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </nav>

    <div class="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan to-transparent"></div>

    <div class="mt-5 pb-5 text-center">
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="inline-flex min-h-11 items-center border-b-2 border-cyan pb-1 font-body text-xs font-bold uppercase tracking-[0.3em] transition
                ${onHero ? 'text-white hover:border-white focus-visible:outline-white' : 'text-ink hover:border-magenta focus-visible:outline-magenta'}
                focus-visible:outline-2 focus-visible:outline-offset-4">
         ${esc(site.nextEvent.ctaText)}</a>
    </div>
  </div>

  <ul id="navMain" hidden
      class="md:hidden ${onHero ? 'bg-ink/95 backdrop-blur' : 'border-t border-ink-line bg-white'} px-6 py-4">
    ${site.nav.map(n => `<li><a href="${esc(n.href)}"
      class="flex min-h-11 items-center font-body text-[11px] uppercase tracking-[0.25em] ${onHero ? 'text-white' : 'text-ink'}">${esc(n.label)}</a></li>`).join('')}
    <li class="pt-3"><a href="${esc(site.nextEvent.ctaUrl)}"
      class="inline-flex min-h-11 items-center border-b-2 border-cyan pb-1 font-body text-xs font-bold uppercase tracking-[0.3em] ${onHero ? 'text-white' : 'text-ink'}">
      ${esc(site.nextEvent.ctaText)}</a></li>
  </ul>
</header>`;
};

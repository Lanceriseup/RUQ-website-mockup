// Hero-overlay nav designs (E–I). Unlike A–D these sit ON the video rather
// than above it, so each one has to solve legibility over moving footage.
//
// Deliberately five different answers to that problem — scrim, blur, solid
// block, hairline, and full-bleed overlay — so elements can be mixed.
//
// Shared: 44px targets, visible focus, aria-current, Escape-closes on overlays.
import { esc } from './layout.mjs';

const L = (site, cls) =>
  `<img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="160" height="52"
        class="${cls} object-contain" loading="eager" decoding="async">`;

const links = (site, current, cls, activeCls = '') =>
  site.nav.map(n => `<a href="${esc(n.href)}"
    class="${cls} ${current === n.href ? activeCls : ''}"
    ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a>`).join('');

const burger = (target, colour = 'text-white') => `
<button type="button" class="nav-toggle grid h-11 w-11 place-items-center rounded-lg ${colour} md:hidden"
        data-target="${target}" aria-expanded="false" aria-controls="${target}">
  <span class="sr-only">Toggle menu</span>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
</button>`;

const drawer = (id, site) => `
<ul id="${id}" hidden class="md:hidden absolute inset-x-0 top-full bg-ink/95 px-6 py-4 backdrop-blur">
  ${site.nav.map(n => `<li><a href="${esc(n.href)}" class="flex min-h-11 items-center font-body text-white">${esc(n.label)}</a></li>`).join('')}
  <li class="pt-2"><a href="${esc(site.nextEvent.ctaUrl)}" class="flex min-h-11 items-center justify-center rounded-full bg-magenta px-6 font-semibold text-white">${esc(site.nextEvent.ctaText)}</a></li>
</ul>`;

/* ── E. Glass capsule ───────────────────────────────────────────────────
   A detached pill floating over the footage, frosted with backdrop-blur.
   The blur is what sells it: the video stays visible but diffused, so the
   nav reads as a physical object on top rather than a bar bolted to the
   edge. Inset from all sides — the video breathes around it. */
export const variantE = (site, current) => `
<header class="pointer-events-none absolute inset-x-0 top-0 z-40 px-4 pt-4 sm:pt-6">
  <nav class="pointer-events-auto relative mx-auto flex max-w-5xl items-center gap-4 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 shadow-2xl backdrop-blur-xl sm:px-6"
       aria-label="Primary">
    <a href="/index.html" class="shrink-0">${L(site, 'h-9 w-auto sm:h-10')}</a>
    <div class="ml-auto hidden items-center gap-1 md:flex">
      ${links(site, current,
        'flex min-h-11 items-center rounded-full px-4 font-body text-sm text-white/90 transition hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        'bg-white/25 font-semibold text-white')}
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="ml-2 flex min-h-11 items-center rounded-full bg-magenta px-6 font-body text-sm font-bold text-white shadow-lg transition hover:bg-magenta-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
         ${esc(site.nextEvent.ctaText)}</a>
    </div>
    <div class="ml-auto md:hidden">${burger('navE')}</div>
    ${drawer('navE', site)}
  </nav>
</header>`;

/* ── F. Scroll-morph ────────────────────────────────────────────────────
   Invisible over the hero — just a white logo and links on the footage —
   then condenses into a solid white bar the moment you scroll past it.
   The wow is the transition, not the resting state. Logo shrinks, links
   flip to ink, a shadow appears. Costs nothing at rest, so the hero is
   completely unobstructed. */
export const variantF = (site, current) => `
<header id="morphNav" class="fixed inset-x-0 top-0 z-40 transition-all duration-300
        [&.is-stuck]:bg-white [&.is-stuck]:shadow-lg">
  <nav class="mx-auto flex max-w-content items-center gap-6 px-4 py-5 transition-all duration-300 [#morphNav.is-stuck_&]:py-2.5" aria-label="Primary">
    <a href="/index.html" class="shrink-0">
      ${L(site, 'h-11 w-auto transition-all duration-300 [#morphNav.is-stuck_&]:h-8 [#morphNav.is-stuck_&]:brightness-0')}
    </a>
    <div class="ml-auto hidden items-center gap-2 md:flex">
      ${links(site, current,
        'group relative flex min-h-11 items-center px-2 font-body text-sm font-semibold text-white transition [#morphNav.is-stuck_&]:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta',
        '')}
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="ml-3 flex min-h-11 items-center rounded-full border-2 border-white px-6 font-body text-sm font-bold text-white transition hover:bg-white hover:text-ink
                [#morphNav.is-stuck_&]:border-magenta [#morphNav.is-stuck_&]:bg-magenta [#morphNav.is-stuck_&]:text-white [#morphNav.is-stuck_&]:hover:bg-magenta-deep">
         ${esc(site.nextEvent.ctaText)}</a>
    </div>
    <div class="ml-auto md:hidden [#morphNav.is-stuck_&]:text-ink">${burger('navF')}</div>
    ${drawer('navF', site)}
  </nav>
</header>`;

/* ── G. Editorial hairline ──────────────────────────────────────────────
   Fashion-magazine restraint. Oversized centred wordmark, tiny uppercase
   links with wide letter-spacing, a single cyan hairline underneath.
   No buttons, no fills — the CTA is a link with a rule under it. Reads as
   expensive precisely because it does almost nothing. Needs a dark or
   busy-free top edge on the video to hold up. */
export const variantG = (site, current) => {
  const half = Math.ceil(site.nav.length / 2);
  const cls = 'flex min-h-11 items-center px-3 font-body text-[11px] uppercase tracking-[0.25em] text-white/80 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
  const one = (n) => `<a href="${esc(n.href)}" class="${cls} ${current === n.href ? 'text-white' : ''}"
      ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a>`;
  return `
<header class="absolute inset-x-0 top-0 z-40">
  <div class="mx-auto max-w-content px-4 pt-7">
    <nav class="flex items-center justify-between gap-4" aria-label="Primary">
      <div class="hidden flex-1 justify-start md:flex">${site.nav.slice(0, half).map(one).join('')}</div>
      <a href="/index.html" class="shrink-0">${L(site, 'h-12 w-auto sm:h-14')}</a>
      <div class="hidden flex-1 justify-end md:flex">${site.nav.slice(half).map(one).join('')}</div>
      <div class="md:hidden">${burger('navG')}</div>
    </nav>
    <div class="mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
    <div class="mt-5 text-center">
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="inline-flex min-h-11 items-center border-b-2 border-cyan pb-1 font-body text-xs font-bold uppercase tracking-[0.3em] text-white transition hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
         ${esc(site.nextEvent.ctaText)}</a>
    </div>
  </div>
  <div class="relative">${drawer('navG', site)}</div>
</header>`;
};

/* ── H. Magenta block, asymmetric ───────────────────────────────────────
   A solid brand-colour slab bleeds off the left edge and carries the logo;
   links float free on the video to the right. The hard colour edge against
   moving footage is the effect — it looks designed rather than defaulted,
   and it solves legibility for the logo without dimming the whole video.
   Boldest of the five, and the most obviously "not WordPress". */
export const variantH = (site, current) => `
<header class="absolute inset-x-0 top-0 z-40">
  <nav class="flex items-stretch" aria-label="Primary">
    <div class="flex items-center rounded-br-[2.5rem] bg-magenta py-5 pl-4 pr-8 shadow-2xl sm:pl-8 sm:pr-12">
      <a href="/index.html">${L(site, 'h-10 w-auto sm:h-12')}</a>
    </div>
    <div class="ml-auto hidden items-center gap-1 px-6 md:flex">
      ${links(site, current,
        'relative flex min-h-11 items-center px-4 font-body text-sm font-semibold text-white after:absolute after:bottom-2 after:left-4 after:right-4 after:h-0.5 after:origin-left after:scale-x-0 after:bg-cyan after:transition-transform hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        'after:scale-x-100')}
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="ml-3 flex min-h-11 items-center bg-cyan px-7 font-body text-sm font-bold uppercase tracking-wider text-ink transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
         ${esc(site.nextEvent.ctaText)}</a>
    </div>
    <div class="ml-auto flex items-center px-4 md:hidden">${burger('navH')}</div>
  </nav>
  <div class="relative">${drawer('navH', site)}</div>
</header>`;

/* ── I. Cinematic overlay ───────────────────────────────────────────────
   Almost nothing at rest: logo, and a Menu control. Opening it does not
   cover the video with white — it dims the footage and lays huge display
   type over it, so the hero keeps playing behind the menu. The most
   dramatic of the five and the best fit for a video-led page, at the cost
   of one click to reach anything. */
export const variantI = (site, current) => `
<header class="absolute inset-x-0 top-0 z-40">
  <nav class="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-6" aria-label="Primary">
    <a href="/index.html" class="shrink-0">${L(site, 'h-11 w-auto')}</a>
    <button type="button" id="navI-open" aria-expanded="false" aria-controls="navI-panel"
      class="group flex min-h-11 items-center gap-3 font-body text-xs font-bold uppercase tracking-[0.3em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
      Menu
      <span aria-hidden="true" class="flex flex-col gap-1.5">
        <span class="block h-0.5 w-8 bg-white transition-all group-hover:w-5 group-hover:bg-cyan"></span>
        <span class="block h-0.5 w-5 bg-white transition-all group-hover:w-8 group-hover:bg-magenta"></span>
      </span>
    </button>
  </nav>

  <div id="navI-panel" hidden class="fixed inset-0 z-50 bg-ink/85 backdrop-blur-md">
    <div class="mx-auto flex max-w-content items-center justify-between px-4 py-6">
      <a href="/index.html">${L(site, 'h-11 w-auto')}</a>
      <button type="button" id="navI-close"
        class="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        <span class="sr-only">Close menu</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <ul class="mx-auto max-w-content px-4 pt-8 sm:pt-16">
      ${site.nav.map((n, i) => `<li>
        <a href="${esc(n.href)}"
           class="group flex items-baseline gap-6 py-3 font-display text-4xl font-bold text-white transition hover:text-cyan sm:text-6xl
                  ${current === n.href ? 'text-cyan' : ''} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
           ${current === n.href ? 'aria-current="page"' : ''}>
          <span class="font-body text-xs tabular-nums text-magenta">0${i + 1}</span>
          <span class="transition-transform group-hover:translate-x-3">${esc(n.label)}</span>
        </a></li>`).join('')}
    </ul>
    <div class="mx-auto max-w-content px-4 pt-10">
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="inline-flex min-h-11 items-center rounded-full bg-magenta px-10 py-4 font-body font-bold text-white transition hover:bg-magenta-deep">
         ${esc(site.nextEvent.ctaText)} &middot; ${esc(site.nextEvent.dates)}</a>
    </div>
  </div>
</header>`;

export const HERO_VARIANTS = { E: variantE, F: variantF, G: variantG, H: variantH, I: variantI };
export const HERO_LABELS = {
  E: 'Glass capsule — frosted pill floating on the video',
  F: 'Scroll-morph — invisible on the hero, solid bar on scroll',
  G: 'Editorial hairline — centred wordmark, cyan rule, no buttons',
  H: 'Magenta block — asymmetric colour slab, cyan underlines',
  I: 'Cinematic overlay — menu dims the video, keeps it playing',
};

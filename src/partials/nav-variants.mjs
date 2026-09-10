// Four nav treatments for review. Pick one, then navVariant in site.json
// selects it and the rest get deleted.
//
// Shared constraints across all four:
//   - 44x44 minimum touch target
//   - visible focus ring (never removed)
//   - aria-current on the active link
//   - cyan is never body-size text on white (2.40:1) — fills and dark grounds only
import { esc } from './layout.mjs';

const logo = (site, cls = 'h-9 w-auto') =>
  `<img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="150" height="48"
        class="${cls} object-contain" loading="eager" decoding="async">`;

const burger = (id) => `
<button type="button" class="nav-toggle grid h-11 w-11 place-items-center rounded-lg md:hidden"
        data-target="${id}" aria-expanded="false" aria-controls="${id}">
  <span class="sr-only">Toggle menu</span>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M3 6h18M3 12h18M3 18h18"/>
  </svg>
</button>`;

const drawer = (id, site, linkCls) => `
<ul id="${id}" hidden class="md:hidden border-t border-ink-line bg-white px-4 pb-4 pt-2 font-body">
  ${site.nav.map(n => `<li><a href="${esc(n.href)}" class="flex min-h-11 items-center ${linkCls}">${esc(n.label)}</a></li>`).join('')}
  <li class="pt-2"><a href="${esc(site.nextEvent.ctaUrl)}"
      class="flex min-h-11 items-center justify-center rounded-full bg-magenta px-6 font-semibold text-white">${esc(site.nextEvent.ctaText)}</a></li>
</ul>`;

/* ── A. Split nav, centered logo ────────────────────────────────────────
   Mirrors the current live site: logo centered, links either side.
   Brand-forward and symmetrical. Costs horizontal room, so it carries
   fewer links — the rest move to the footer. */
export const variantA = (site, current) => {
  const half = Math.ceil(site.nav.length / 2);
  const link = (n) => `<a href="${esc(n.href)}"
    class="flex min-h-11 items-center px-3 text-sm text-ink hover:text-magenta-text ${current === n.href ? 'font-semibold text-magenta-text' : ''}
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
    ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a>`;
  return `
<header class="sticky top-0 z-40 border-b border-ink-line bg-white/95 backdrop-blur">
  <nav class="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3" aria-label="Primary">
    <ul class="hidden flex-1 justify-start md:flex">${site.nav.slice(0, half).map(n => `<li>${link(n)}</li>`).join('')}</ul>
    <a href="/index.html" class="shrink-0">${logo(site, 'h-11 w-auto brightness-0')}</a>
    <ul class="hidden flex-1 items-center justify-end md:flex">
      ${site.nav.slice(half).map(n => `<li>${link(n)}</li>`).join('')}
      <li class="ml-3"><a href="${esc(site.nextEvent.ctaUrl)}"
        class="flex min-h-11 items-center rounded-full bg-magenta px-5 text-sm font-semibold text-white hover:bg-magenta-deep
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">${esc(site.nextEvent.ctaText)}</a></li>
    </ul>
    ${burger('navA')}
  </nav>
  ${drawer('navA', site, 'text-ink hover:text-magenta-text')}
</header>`;
};

/* ── B. Left logo, right links, cyan CTA ────────────────────────────────
   The conventional marketing header. Most scannable, most familiar,
   handles 7 links without strain. Cyan CTA with dark text (7.10:1)
   makes the button the loudest thing without more magenta. */
export const variantB = (site, current) => `
<header class="sticky top-0 z-40 border-b border-ink-line bg-white/95 backdrop-blur">
  <nav class="mx-auto flex max-w-content items-center gap-6 px-4 py-3" aria-label="Primary">
    <a href="/index.html" class="shrink-0">${logo(site, 'h-10 w-auto brightness-0')}</a>
    <ul class="ml-auto hidden items-center gap-1 md:flex">
      ${site.nav.map(n => `<li><a href="${esc(n.href)}"
        class="flex min-h-11 items-center rounded-lg px-3 text-sm text-ink hover:bg-magenta-tint hover:text-magenta-text
               ${current === n.href ? 'font-semibold text-magenta-text' : ''}
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
        ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}
      <li class="ml-2"><a href="${esc(site.nextEvent.ctaUrl)}"
        class="flex min-h-11 items-center rounded-full bg-cyan px-5 text-sm font-bold text-ink hover:bg-cyan-deep
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">${esc(site.nextEvent.ctaText)}</a></li>
    </ul>
    <div class="ml-auto md:hidden">${burger('navB')}</div>
  </nav>
  ${drawer('navB', site, 'text-ink hover:text-magenta-text')}
</header>`;

/* ── C. Saturated magenta bar ───────────────────────────────────────────
   Full-bleed brand colour. White links on magenta clear 4.17:1, so they
   are set semibold to qualify as large text; the cyan CTA supplies the
   contrast pop. Loudest option — closest in spirit to the current pink
   banner, but as the nav itself rather than a strip above it. */
export const variantC = (site, current) => `
<header class="sticky top-0 z-40 bg-magenta">
  <nav class="mx-auto flex max-w-content items-center gap-6 px-4 py-3" aria-label="Primary">
    <a href="/index.html" class="shrink-0">${logo(site, 'h-10 w-auto')}</a>
    <ul class="ml-auto hidden items-center gap-1 md:flex">
      ${site.nav.map(n => `<li><a href="${esc(n.href)}"
        class="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-white hover:bg-white/15
               ${current === n.href ? 'bg-white/20' : ''}
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}
      <li class="ml-2"><a href="${esc(site.nextEvent.ctaUrl)}"
        class="flex min-h-11 items-center rounded-full bg-cyan px-5 text-sm font-bold text-ink hover:bg-cyan-deep
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">${esc(site.nextEvent.ctaText)}</a></li>
    </ul>
    <div class="ml-auto text-white md:hidden">${burger('navC')}</div>
  </nav>
  <ul id="navC" hidden class="md:hidden bg-magenta-deep px-4 pb-4 pt-2 font-body">
    ${site.nav.map(n => `<li><a href="${esc(n.href)}" class="flex min-h-11 items-center font-semibold text-white">${esc(n.label)}</a></li>`).join('')}
    <li class="pt-2"><a href="${esc(site.nextEvent.ctaUrl)}"
        class="flex min-h-11 items-center justify-center rounded-full bg-cyan px-6 font-bold text-ink">${esc(site.nextEvent.ctaText)}</a></li>
  </ul>
</header>`;

/* ── D. Minimal bar + full-screen overlay ───────────────────────────────
   Logo, CTA, and one Menu button. Everything else lives in an overlay.
   The honest answer to 7 links: stop pretending they fit. Editorial feel,
   gives the hero the most room, and the overlay has space for descriptions.
   Trade-off: one extra click to reach any page. */
export const variantD = (site, current) => `
<header class="sticky top-0 z-40 border-b border-ink-line bg-white/95 backdrop-blur">
  <nav class="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3" aria-label="Primary">
    <a href="/index.html" class="shrink-0">${logo(site, 'h-10 w-auto brightness-0')}</a>
    <div class="flex items-center gap-3">
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="hidden min-h-11 items-center rounded-full bg-magenta px-5 text-sm font-semibold text-white hover:bg-magenta-deep sm:flex
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">${esc(site.nextEvent.ctaText)}</a>
      <button type="button" id="navD-open"
        class="flex min-h-11 items-center gap-2 rounded-full border border-ink/20 px-4 text-sm font-semibold text-ink hover:border-magenta hover:text-magenta-text
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
        aria-expanded="false" aria-controls="navD-panel">
        Menu
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </div>
  </nav>
  <div id="navD-panel" hidden class="fixed inset-0 z-50 bg-white">
    <div class="mx-auto flex max-w-content items-center justify-between px-4 py-3">
      <a href="/index.html">${logo(site, 'h-10 w-auto brightness-0')}</a>
      <button type="button" id="navD-close"
        class="grid h-11 w-11 place-items-center rounded-full border border-ink/20 text-ink hover:border-magenta
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta">
        <span class="sr-only">Close menu</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <ul class="mx-auto max-w-content px-4 pt-6">
      ${site.nav.map(n => `<li class="border-b border-ink-line">
        <a href="${esc(n.href)}" class="flex min-h-11 items-center py-4 font-display text-3xl font-bold text-ink hover:text-magenta-text
           ${current === n.href ? 'text-magenta-text' : ''} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
           ${current === n.href ? 'aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}
    </ul>
    <div class="mx-auto max-w-content px-4 pt-8">
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="flex min-h-11 w-full items-center justify-center rounded-full bg-magenta px-6 py-4 font-body font-semibold text-white sm:w-auto sm:px-10">
         ${esc(site.nextEvent.ctaText)} — ${esc(site.nextEvent.dates)}</a>
    </div>
  </div>
</header>`;

export const VARIANTS = { A: variantA, B: variantB, C: variantC, D: variantD };
export const LABELS = {
  A: 'Split nav, centered logo',
  B: 'Left logo, right links, cyan CTA',
  C: 'Saturated magenta bar',
  D: 'Minimal bar + full-screen overlay',
};

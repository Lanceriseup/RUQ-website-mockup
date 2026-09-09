// Shared layout + components. Everything visual is a function of data — no copy hard-coded here.
export const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

export const announcementBar = (site) => `
<div class="bg-ink text-cream text-center text-sm px-4 py-2.5">
  <span class="font-body">Next LIVE Event: <strong class="font-semibold">${esc(site.nextEvent.dates)}</strong> in ${esc(site.nextEvent.location)}</span>
  <a href="${esc(site.nextEvent.ctaUrl)}" class="ml-2 underline underline-offset-4 hover:text-blush focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush">${esc(site.nextEvent.ctaText)} &rarr;</a>
</div>`;

export const header = (site, current) => `
<header class="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-ink/10">
  ${announcementBar(site)}
  <nav class="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3" aria-label="Primary">
    <a href="/index.html" class="flex items-center gap-2 shrink-0">
      <img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="150" height="48"
           class="h-10 w-auto object-contain invert brightness-0" loading="eager" decoding="async">
      <span class="sr-only">${esc(site.brand.name)}</span>
    </a>
    <button type="button" id="nav-toggle" aria-expanded="false" aria-controls="nav-menu"
            class="md:hidden rounded p-2 text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-rose">
      <span class="sr-only">Toggle menu</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M3 6h18M3 12h18M3 18h18"/>
      </svg>
    </button>
    <ul id="nav-menu" class="hidden md:flex items-center gap-6 font-body text-sm">
      ${site.nav.map(n => `<li><a href="${esc(n.href)}"
        class="text-ink hover:text-rose ${current===n.href?'font-semibold text-rose':''} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
        ${current===n.href?'aria-current="page"':''}>${esc(n.label)}</a></li>`).join('\n      ')}
      <li><a href="${esc(site.nextEvent.ctaUrl)}"
        class="rounded-full bg-rose px-5 py-2 font-semibold text-white hover:bg-rose-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">${esc(site.nextEvent.ctaText)}</a></li>
    </ul>
  </nav>
  <ul id="nav-menu-mobile" hidden class="md:hidden border-t border-ink/10 bg-cream px-4 pb-4 pt-2 font-body">
    ${site.nav.map(n => `<li><a href="${esc(n.href)}" class="block py-2 text-ink hover:text-rose">${esc(n.label)}</a></li>`).join('\n    ')}
    <li class="pt-2"><a href="${esc(site.nextEvent.ctaUrl)}" class="block rounded-full bg-rose px-5 py-2.5 text-center font-semibold text-white">${esc(site.nextEvent.ctaText)}</a></li>
  </ul>
</header>`;

export const footer = (site) => `
<footer class="mt-24 bg-ink text-cream">
  <div class="mx-auto grid max-w-content gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
    <div class="sm:col-span-2">
      <img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="180" height="56" class="h-12 w-auto object-contain" loading="lazy" decoding="async">
      <p class="mt-4 max-w-sm font-body text-sm text-cream/70">${esc(site.brand.tagline)}</p>
    </div>
    <div>
      <h2 class="font-display text-sm font-semibold uppercase tracking-wider">Explore</h2>
      <ul class="mt-4 space-y-2 font-body text-sm text-cream/70">
        ${site.nav.map(n=>`<li><a href="${esc(n.href)}" class="hover:text-white">${esc(n.label)}</a></li>`).join('\n        ')}
      </ul>
    </div>
    <div>
      <h2 class="font-display text-sm font-semibold uppercase tracking-wider">Find Us On Socials</h2>
      <ul class="mt-4 space-y-2 font-body text-sm text-cream/70">
        <li><a href="${esc(site.social.instagram)}" class="hover:text-white" rel="noopener">Instagram</a></li>
        <li><a href="${esc(site.social.facebook)}" class="hover:text-white" rel="noopener">Facebook</a></li>
        <li class="pt-2"><a href="${esc(site.brand.parent.url)}" class="hover:text-white" rel="noopener">Explore the movement for men &rarr;</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-cream/15 px-4 py-6 text-center font-body text-xs text-cream/50">${esc(site.brand.copyright)}</div>
</footer>`;

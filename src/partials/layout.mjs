// Shared layout + components. Everything visual is a function of data — no copy hard-coded here.
export const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// The announcement banner was removed at the client's request.
// Its content (next event dates + Register CTA) now lives only in the nav CTA
// and on the events page, so nothing was lost — see git history to restore it.

// Live header is design G — see nav.mjs. The A–D and E–I exploration sets are
// still in nav-variants.mjs / nav-hero-variants.mjs and are rendered only on
// the /nav-options.html and /nav-hero.html review pages.
export { header } from './nav.mjs';

export const footer = (site) => `
<!-- No top margin. The footer used to carry mt-24, which put 96px of the
     body's own background between the page and the footer. On a white page
     that was invisible; on the dark team page it read as a white band across
     the foot of the site.

     Spacing below content belongs to the page, not to the footer: every
     section already ends on its own padding (py-24 on the shared section
     component, py-16 on the closing CTA), so nothing needed the margin. -->
<footer class="bg-ink text-white">
  <div class="mx-auto grid max-w-content gap-10 px-4 py-9 sm:py-14 sm:grid-cols-2 lg:grid-cols-4">
    <div class="sm:col-span-2">
      <img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="180" height="56" class="h-12 w-auto object-contain" loading="lazy" decoding="async">
      <p class="mt-4 max-w-sm font-body text-sm text-white/70">${esc(site.brand.tagline)}</p>
    </div>
    <div>
      <h2 class="font-display text-sm font-semibold uppercase tracking-wider">Explore</h2>
      <!-- footerNav, not nav: the header carries four links, so the footer is
           what keeps Events, Masterclasses, Coaching and Free resource reachable. -->
      <ul class="mt-4 space-y-2 font-body text-sm text-white/70">
        ${(site.footerNav || site.nav).map(n=>`<li><a href="${esc(n.href)}" class="hover:text-white">${esc(n.label)}</a></li>`).join('\n        ')}
      </ul>
    </div>
    <div>
      <h2 class="font-display text-sm font-semibold uppercase tracking-wider">Find Us On Socials</h2>
      <ul class="mt-4 space-y-2 font-body text-sm text-white/70">
        <li><a href="${esc(site.social.instagram)}" class="hover:text-white" rel="noopener">Instagram</a></li>
        <li><a href="${esc(site.social.facebook)}" class="hover:text-white" rel="noopener">Facebook</a></li>
        <li class="pt-2"><a href="${esc(site.brand.parent.url)}" class="hover:text-white" rel="noopener">Explore the movement for men &rarr;</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-white/15 px-4 py-6 text-center font-body text-xs text-white/50">${esc(site.brand.copyright)}</div>
</footer>`;

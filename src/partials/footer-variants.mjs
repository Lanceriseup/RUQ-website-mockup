// Footer options. Brief: simple and minimalistic, but still good.
//
// One constraint shapes all of them. The header carries four links, so the
// footer is the only route to Events, Masterclasses, 1-on-1 Coaching and Free
// resource. A footer that "simplifies" by dropping links orphans four pages,
// so every option below keeps all eight — minimal here means fewer rows and
// less furniture, not fewer destinations.
//
// The page now ends on the closing ticket, which is a loud, lit, animated ask.
// That is the real argument for a quiet footer: anything with weight down here
// competes with it. Each option says what it does about that.
import { esc } from './layout.mjs';

// None of these carries a top margin. A margin on the footer shows the body
// background between the page and the footer — invisible while every page was
// white, a white band across the foot of the dark team page. Spacing below
// content belongs to the page.

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const FOOTER_OPTIONS = {
  current: {
    label: 'Current — four columns',
    note: 'What is there now: logo and tagline, an Explore column, a socials column, copyright bar. Shown for comparison. It is the tallest thing on the page after the hero and it arrives straight after the closing ask.',
  },
  oneLine: {
    label: 'One line — everything on a single row',
    note: 'Logo left, all eight links inline in the middle, social icons right, copyright on a hairline beneath. The smallest footer that still reaches every page. Wraps to a stack below lg rather than shrinking the type.',
  },
  centred: {
    label: 'Centred — logo, links, icons, stacked and symmetrical',
    note: 'Four centred rows with generous spacing. Reads as a full stop rather than a navigation area. The most formal of the options and the one that suits the creed section further up the page.',
  },
  light: {
    label: 'Light — the same structure, on white',
    note: 'Minimal by being quiet rather than by removing anything. The page stays white to the very bottom, so the closing ticket is the only dark thing below the creed band and keeps all the weight.',
  },
  rule: {
    label: 'Rule — no logo, one line of small caps',
    note: 'Just a hairline, the links as letter-spaced small caps, copyright at the right. The most minimal option by a distance. Drops the logo, which some clients will not accept at the foot of their own site.',
  },
  corner: {
    label: 'Corner — big mark, links tucked right',
    note: 'An oversized logo bottom-left against a two-column link list on the right. Asymmetric and the most designed of the six; still only two rows tall.',
  },
};

// ------------------------------------------------------------------ parts

const icon = {
  instagram: '<path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.9-11.1a1.55 1.55 0 1 1-1.55-1.55A1.55 1.55 0 0 1 18.9 5.2Z"/>',
  facebook: '<path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z"/>',
};

const social = (site, cls) => `
<a href="${esc(site.social.instagram)}" rel="noopener" aria-label="Instagram" class="${cls}">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${icon.instagram}</svg>
</a>
<a href="${esc(site.social.facebook)}" rel="noopener" aria-label="Facebook" class="${cls}">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${icon.facebook}</svg>
</a>`;

const links = (site, cls, wrapper) => {
  const list = site.footerNav || site.nav;
  return `<${wrapper}>${list.map(n => `<a href="${esc(n.href)}" class="${cls}">${esc(n.label)}</a>`).join('')}</${wrapper}>`;
};

const parentLink = (site, cls) =>
  `<a href="${esc(site.brand.parent.url)}" rel="noopener" class="${cls}">${esc(site.brand.parent.name)} &rarr;</a>`;

// ---------------------------------------------------------------- options

const RENDER = {
  current: (site) => `
<footer class="bg-ink text-white">
  <div class="mx-auto grid max-w-content gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
    <div class="sm:col-span-2">
      <img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="180" height="56" class="h-12 w-auto object-contain" loading="lazy" decoding="async">
      <p class="mt-4 max-w-sm font-body text-sm text-white/70">${esc(site.brand.tagline)}</p>
    </div>
    <div>
      <h2 class="font-display text-sm font-semibold uppercase tracking-wider">Explore</h2>
      <ul class="mt-4 space-y-2 font-body text-sm text-white/70">
        ${(site.footerNav || site.nav).map(n => `<li><a href="${esc(n.href)}" class="hover:text-white">${esc(n.label)}</a></li>`).join('')}
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
</footer>`,

  oneLine: (site) => `
<footer class="bg-ink text-white">
  <!-- Three items on one row at lg, stacked and centred below it. Stacking
       rather than shrinking: eight links squeezed onto one line on a tablet
       would set at a size nobody can tap accurately. -->
  <div class="mx-auto flex max-w-content flex-col items-center gap-7 px-4 py-9 lg:flex-row lg:justify-between lg:gap-10">
    <img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="140" height="44" class="h-9 w-auto shrink-0 object-contain" loading="lazy" decoding="async">
    ${links(site, 'font-body text-[13px] text-white/70 transition hover:text-white', 'nav class="flex flex-wrap justify-center gap-x-6 gap-y-3"')}
    <div class="flex shrink-0 items-center gap-4">
      ${social(site, 'text-white/60 transition hover:text-white')}
    </div>
  </div>
  <div class="border-t border-white/10">
    <div class="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-4 py-4 font-body text-[11px] text-white/40 sm:flex-row">
      <span>${esc(site.brand.copyright)}</span>
      ${parentLink(site, 'transition hover:text-white/70')}
    </div>
  </div>
</footer>`,

  centred: (site) => `
<footer class="bg-ink text-white">
  <div class="mx-auto flex max-w-content flex-col items-center px-4 py-14 text-center">
    <img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="180" height="56" class="h-11 w-auto object-contain" loading="lazy" decoding="async">
    <span aria-hidden="true" class="mt-7 block h-px w-20" style="background:linear-gradient(to right,transparent,${MAGENTA},transparent)"></span>
    ${links(site, 'font-body text-[13px] text-white/70 transition hover:text-white', 'nav class="mt-7 flex max-w-2xl flex-wrap justify-center gap-x-7 gap-y-3"')}
    <div class="mt-8 flex items-center gap-5">
      ${social(site, 'text-white/60 transition hover:text-white')}
    </div>
    <p class="mt-9 font-body text-[11px] text-white/40">${esc(site.brand.copyright)}</p>
    <p class="mt-1 font-body text-[11px] text-white/40">${parentLink(site, 'transition hover:text-white/70')}</p>
  </div>
</footer>`,

  light: (site) => `
<footer class="border-t border-ink/10 bg-white text-ink">
  <div class="mx-auto flex max-w-content flex-col items-center gap-7 px-4 py-10 lg:flex-row lg:justify-between lg:gap-10">
    <!-- The white mark, inverted to black.
         There is no dark logo in the asset set. logo-ruq.png sounds like one
         and is not — it is a pink plaid texture, so pointing at it here would
         have put a pink rectangle where the logo goes. The mark is pure white
         artwork on transparency, so invert() turns it cleanly black and
         nothing else in the file is affected.
         This is a stopgap. Ask the client for the dark logo file. -->
    <img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="140" height="44"
         class="h-9 w-auto shrink-0 object-contain invert" loading="lazy" decoding="async">
    ${links(site, 'font-body text-[13px] text-ink-soft transition hover:text-ink', 'nav class="flex flex-wrap justify-center gap-x-6 gap-y-3"')}
    <div class="flex shrink-0 items-center gap-4">
      ${social(site, 'text-ink-soft transition hover:text-magenta-text')}
    </div>
  </div>
  <div class="border-t border-ink/10">
    <div class="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-4 py-4 font-body text-[11px] text-ink-soft sm:flex-row">
      <span>${esc(site.brand.copyright)}</span>
      ${parentLink(site, 'transition hover:text-magenta-text')}
    </div>
  </div>
</footer>`,

  rule: (site) => `
<footer class="border-t border-ink/10 bg-white text-ink">
  <div class="mx-auto flex max-w-content flex-col gap-6 px-4 py-8 lg:flex-row lg:items-center lg:justify-between">
    ${links(site, 'font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft transition hover:text-ink', 'nav class="flex flex-wrap gap-x-6 gap-y-3"')}
    <div class="flex items-center gap-5">
      ${social(site, 'text-ink-soft transition hover:text-magenta-text')}
      <span class="font-body text-[11px] text-ink-soft/70">${esc(site.brand.copyright)}</span>
    </div>
  </div>
</footer>`,

  corner: (site) => `
<footer class="bg-ink text-white">
  <div class="mx-auto flex max-w-content flex-col gap-10 px-4 py-12 md:flex-row md:items-end md:justify-between">
    <div>
      <img src="${esc(site.assets.logoWhite)}" alt="${esc(site.brand.name)}" width="240" height="74" class="h-16 w-auto object-contain" loading="lazy" decoding="async">
      <p class="mt-5 font-body text-[11px] text-white/40">${esc(site.brand.copyright)}</p>
    </div>
    <div class="md:text-right">
      ${links(site, 'font-body text-[13px] text-white/70 transition hover:text-white', 'nav class="grid grid-cols-2 gap-x-10 gap-y-2.5"')}
      <div class="mt-6 flex items-center gap-4 md:justify-end">
        ${social(site, 'text-white/60 transition hover:text-white')}
        <span aria-hidden="true" class="h-4 w-px bg-white/20"></span>
        ${parentLink(site, 'font-body text-[12px] text-white/50 transition hover:text-white')}
      </div>
    </div>
  </div>
</footer>`,
};

export const renderFooter = (site, key) => (RENDER[key] ?? RENDER.current)(site);

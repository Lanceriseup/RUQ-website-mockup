// Hero options: rotating-word headline, VSL, dates, CTA.
//
// Four layouts, and each pairs with a different script face and a different
// word-swap animation so the pieces can be judged separately. The script face
// is the one to look at hardest — it has to sit beside Montserrat at display
// size without looking like a different brand.
//
// The rotating word is wrapped in a fixed-width inline-grid so the line does
// not reflow as "passionate" becomes "joyful". Without that the whole headline
// jitters on every swap, which is the usual way this effect goes wrong.
import { esc } from './layout.mjs';

export const SCRIPTS = {
  greatVibes: { css: "'Great Vibes', cursive", label: 'Great Vibes' },
  allura: { css: "'Allura', cursive", label: 'Allura' },
  parisienne: { css: "'Parisienne', cursive", label: 'Parisienne' },
  dancing: { css: "'Dancing Script', cursive", label: 'Dancing Script' },
};

export const HEROES = {
  centered: {
    label: 'Centred stack — headline, VSL, then dates and CTA',
    script: 'greatVibes',
    swap: 'rise',
    note: 'The straightforward reading order, given room. Word rises into place behind a mask and the cyan rule sweeps out under it. VSL sits in a frosted frame with a soft brand glow.',
  },
  split: {
    label: 'Split — headline and CTA left, VSL right',
    script: 'allura',
    swap: 'wipe',
    note: 'Asymmetric, and the video gets real size rather than being an afterthought. Word wipes through a clipping mask. Strongest on desktop, stacks on mobile.',
  },
  overlap: {
    label: 'Overlap — VSL card rides up into the headline block',
    script: 'parisienne',
    swap: 'flip',
    note: 'The video card overlaps the headline section and the dates bar floats beneath it. Layered depth rather than stacked bands. Word flips on the X axis.',
  },
  cinematic: {
    label: 'Cinematic — headline on the video, VSL floating below',
    script: 'dancing',
    swap: 'fade',
    note: 'Keeps the b-roll hero and hangs the VSL card half over its bottom edge. Most dramatic; the CTA sits on white beneath so it never competes with the footage.',
  },
};

const rotator = (words, scriptCss, swap, size) => {
  // inline-grid with every word stacked in the same cell: the widest word sets
  // the width once, so nothing shifts when the visible one changes.
  const items = words.map((w, i) => `<span class="hero-word ${i === 0 ? 'is-on' : ''}"
      style="grid-area:1/1;font-family:${scriptCss};">${esc(w)}</span>`).join('');
  return `<span class="hero-rotator relative inline-grid ${size}" data-swap="${esc(swap)}">
    ${items}
    <span class="hero-underline pointer-events-none absolute -bottom-1 left-0 h-[3px] w-full bg-cyan"></span>
  </span>`;
};

const vsl = (c, extra = '') => `
<figure class="group relative overflow-hidden rounded-2xl ring-1 ring-white/20 shadow-[0_30px_80px_-30px_rgba(0,0,0,.7)] ${extra}">
  <button type="button" class="video-facade relative block aspect-video w-full"
          data-provider="wistia" data-id="${esc(c.home.vsl.wistiaId)}" data-title="${esc(c.home.vsl.title)}">
    <img src="${esc(c.home.vsl.poster)}" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async">
    <span class="absolute inset-0 bg-ink/25 transition group-hover:bg-ink/10"></span>
    <span class="sr-only">Play the video</span>
    <span aria-hidden="true" class="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-magenta shadow-2xl transition group-hover:scale-110">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
    </span>
  </button>
</figure>`;

const dates = (site, tone) => `
<div class="${tone === 'dark' ? 'text-white' : 'text-ink'}">
  <p class="font-body text-sm font-semibold uppercase tracking-[0.2em] text-magenta">${esc(site.nextEvent.upcoming.length ? 'Next 3-Day Transformational Event' : '')}</p>
  ${site.nextEvent.upcoming.map(e => `<p class="mt-1 font-display text-2xl font-bold sm:text-[28px]">${esc(e.dates)}</p>`).join('')}
</div>`;

const ctaBtn = (site) => `
<a href="${esc(site.nextEvent.ctaUrl)}"
   class="group inline-flex min-h-11 items-center gap-3 rounded-full bg-magenta px-10 py-5 font-body text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_-18px_rgba(232,32,143,.9)] transition hover:bg-magenta-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta">
   ${esc(site.nextEvent.ctaText)}
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</a>`;

export const renderHero = (site, c, key) => {
  const h = HEROES[key];
  const s = SCRIPTS[h.script].css;
  const head = (size, cls = '') => `
    <h1 class="font-display font-bold leading-[1.08] text-white ${size} ${cls}">
      ${esc(c.home.hero.headingBefore)}
      ${rotator(c.home.hero.rotatingWords, s, h.swap, 'align-baseline')}
      <br class="hidden sm:block">${esc(c.home.hero.headingAfter)}
    </h1>`;

  if (key === 'split') {
    return `
<section class="relative overflow-hidden bg-ink">
  <img src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-25">
  <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40"></div>
  <div class="relative mx-auto grid max-w-content items-center gap-12 px-4 pb-20 pt-64 lg:grid-cols-2">
    <div>
      ${head('text-4xl sm:text-5xl')}
      <div class="mt-10">${dates(site, 'dark')}</div>
      <div class="mt-8">${ctaBtn(site)}</div>
    </div>
    <div>${vsl(c)}</div>
  </div>
</section>`;
  }

  if (key === 'overlap') {
    return `
<section class="relative bg-ink pb-0">
  <img src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" class="absolute inset-0 h-[70%] w-full object-cover opacity-30">
  <div class="absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-ink/80 to-ink/40"></div>
  <div class="relative mx-auto max-w-4xl px-4 pt-64 text-center">
    ${head('text-4xl sm:text-6xl')}
  </div>
  <div class="relative mx-auto mt-14 max-w-3xl px-4">${vsl(c)}</div>
  <div class="relative -mt-16 bg-white pt-24">
    <div class="mx-auto flex max-w-content flex-col items-center gap-8 px-4 pb-16 text-center sm:flex-row sm:justify-between sm:text-left">
      ${dates(site, 'light')}
      ${ctaBtn(site)}
    </div>
  </div>
</section>`;
  }

  if (key === 'cinematic') {
    return `
<section class="relative bg-ink">
  <div class="relative min-h-[720px] overflow-hidden">
    <video class="absolute inset-0 h-full w-full object-cover opacity-55" poster="${esc(site.assets.heroVideo.poster)}"
           src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
    <div class="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/90"></div>
    <div class="relative mx-auto max-w-4xl px-4 pt-64 text-center">
      ${head('text-4xl sm:text-6xl')}
    </div>
    <div class="relative mx-auto mt-16 max-w-3xl px-4 pb-24">${vsl(c, 'backdrop-blur-sm')}</div>
  </div>
  <div class="bg-white">
    <div class="mx-auto flex max-w-content flex-col items-center gap-8 px-4 py-14 text-center sm:flex-row sm:justify-between sm:text-left">
      ${dates(site, 'light')}
      ${ctaBtn(site)}
    </div>
  </div>
</section>`;
  }

  // centered
  return `
<section class="relative overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-35" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/50 to-ink/85"></div>
  <div class="relative mx-auto max-w-4xl px-4 pb-24 pt-64 text-center">
    ${head('text-4xl sm:text-6xl')}
    <div class="mx-auto mt-14 max-w-3xl">${vsl(c)}</div>
    <div class="mt-14 flex flex-col items-center gap-8">
      ${dates(site, 'dark')}
      ${ctaBtn(site)}
    </div>
  </div>
</section>`;
};

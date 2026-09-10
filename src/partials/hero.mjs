// Homepage hero: rotating headline, VSL, event dates, Register CTA.
//
// Centred layout with Dancing Script for the rotating word.
//
// The three words share one inline-grid cell, so the widest ("passionate")
// sets the width once and the sentence does not reflow as it cycles. The cyan
// rule under the word re-sweeps in step with each swap.
//
// The header no longer carries a Register link — this button is the page's
// single primary action until the hero scrolls away and the capsule takes over.
import { esc } from './layout.mjs';

const SCRIPT = "'Dancing Script', cursive";

export const hero = (site, c) => {
  const words = c.home.hero.rotatingWords.map((w, i) =>
    `<span class="hero-word ${i === 0 ? 'is-on' : ''}" style="grid-area:1/1;font-family:${SCRIPT};">${esc(w)}</span>`
  ).join('');

  return `
<section class="relative overflow-hidden bg-ink">
  <video id="hero-video" class="absolute inset-0 h-full w-full object-cover opacity-35"
         poster="${esc(site.assets.heroVideo.poster)}"
         autoplay muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"
         data-src="${esc(site.assets.heroVideo.src)}"></video>
  <div class="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/50 to-ink/85"></div>

  <!-- pt clears the overlaid header: 161px now the Register row is gone. -->
  <div class="relative mx-auto max-w-4xl px-4 pb-24 pt-48 text-center sm:pt-52">

    <h1 class="font-display text-4xl font-bold leading-[1.08] text-white sm:text-6xl">
      ${esc(c.home.hero.headingBefore)}
      <span class="hero-rotator relative inline-grid align-baseline" data-swap="rise">
        ${words}
        <span class="hero-underline pointer-events-none absolute -bottom-1 left-0 h-[3px] w-full bg-cyan"></span>
      </span>
      <br class="hidden sm:block">${esc(c.home.hero.headingAfter)}
    </h1>
    <!-- The rotator swaps text under assistive tech, so the sentence is also
         announced once, statically, for screen readers. -->
    <p class="sr-only">${esc(c.home.hero.headingBefore)} ${esc(c.home.hero.rotatingWords.join(', '))} ${esc(c.home.hero.headingAfter)}</p>

    <div class="mx-auto mt-14 max-w-3xl">
      <figure class="group relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,.7)] ring-1 ring-white/20">
        <button type="button" class="video-facade relative block aspect-video w-full"
                data-provider="wistia" data-id="${esc(c.home.vsl.wistiaId)}" data-title="${esc(c.home.vsl.title)}">
          <img src="${esc(c.home.vsl.poster)}" alt="" aria-hidden="true"
               class="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async">
          <span class="absolute inset-0 bg-ink/25 transition group-hover:bg-ink/10"></span>
          <span class="sr-only">Play: ${esc(c.home.vsl.title)}</span>
          <span aria-hidden="true" class="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-magenta shadow-2xl transition group-hover:scale-110">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </button>
      </figure>
    </div>

    <div class="mt-14 flex flex-col items-center gap-8">
      <div class="text-white">
        <p class="font-body text-sm font-semibold uppercase tracking-[0.2em] text-magenta">${esc(c.home.hero.eyebrow)}</p>
        ${site.nextEvent.upcoming.map(e =>
          `<p class="mt-1 font-display text-2xl font-bold sm:text-[28px]">${esc(e.dates)}</p>`).join('')}
      </div>

      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="group inline-flex min-h-11 items-center gap-3 rounded-full bg-magenta px-10 py-5 font-body text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_-18px_rgba(232,32,143,.9)] transition hover:bg-magenta-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta">
         ${esc(site.nextEvent.ctaText)}
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
              class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>
  </div>
</section>`;
};

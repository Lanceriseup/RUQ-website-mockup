// Homepage hero: rotating headline, VSL, event dates, Register CTA.
//
// Stacked layout: small letter-spaced sans above, the rotating word oversized
// beneath it, then the rest of the sentence in sans. The word is heavy
// Montserrat filled with a magenta-to-cyan gradient — see .sheen.
//
// The three words share one inline-grid cell, so the widest ("passionate")
// sets the width once and the sentence does not reflow as it cycles.
//
// The header no longer carries a Register link — this button is the page's
// single primary action until the hero scrolls away and the capsule takes over.
import { esc } from './layout.mjs';

// Both sans lines of the headline — the one above the rotating word and the
// one below — share this. They are two halves of a single sentence, so they
// need identical size, weight, colour and tracking; defining it once stops
// them drifting apart again.
const SANS_LINE =
  'block font-display text-base font-bold uppercase leading-snug tracking-[0.2em] text-white sm:text-2xl';

export const hero = (site, c) => {
  const [first, second] = site.nextEvent.upcoming;

  // Duotone: the word is transparent and filled by a magenta-to-cyan gradient,
  // with a second, wider highlight gradient travelling across it. See .sheen
  // in tailwind.css — it also carries the no-background-clip fallback and is
  // held still under prefers-reduced-motion.
  //
  // clamp() rather than breakpoints: the word has to scale smoothly because
  // "passionate" is nearly twice the width of "joyful", and a step change at a
  // breakpoint would be visible mid-rotation.
  const words = c.home.hero.rotatingWords.map((w, i) =>
    `<span class="hero-word sheen ${i === 0 ? 'is-on' : ''} font-display font-extrabold uppercase"
       style="grid-area:1/1;font-size:clamp(2.75rem,9vw,6rem);line-height:1;letter-spacing:-.01em">${esc(w)}</span>`
  ).join('');

  return `
<section class="relative overflow-hidden bg-ink">
  <video id="hero-video" class="absolute inset-0 h-full w-full object-cover opacity-25"
         poster="${esc(site.assets.heroVideo.poster)}"
         autoplay muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"
         data-src="${esc(site.assets.heroVideo.src)}"></video>
  <!-- Dimmer surround so the VSL is the brightest thing in the section. This
       also does half the work of making the teal read: a glow is only as
       visible as the dark it sits against, so raising the bloom and dimming
       the ground pull in the same direction. -->
  <div class="absolute inset-0 bg-gradient-to-b from-ink/86 via-ink/72 to-ink/90"></div>

  <!-- pt clears the overlaid header: 161px now the Register row is gone. -->
  <div class="relative mx-auto max-w-4xl px-4 pb-24 pt-48 text-center sm:pt-52">

    <h1 class="text-white">
      <span class="${SANS_LINE}">${esc(c.home.hero.headingBefore)}</span>

      <span class="mt-3 block">
        <span class="hero-rotator relative inline-grid" data-swap="fade">${words}</span>
      </span>

      <span class="mt-7 ${SANS_LINE}">${esc(c.home.hero.headingAfter)}</span>
    </h1>
    <!-- The rotator swaps text under assistive tech, so the sentence is also
         announced once, statically, for screen readers. -->
    <p class="sr-only">${esc(c.home.hero.headingBefore)} ${esc(c.home.hero.rotatingWords.join(', '))} ${esc(c.home.hero.headingAfter)}</p>

    <!-- VSL: cinema letterbox with a cyan spotlight.
         Plays muted and looping on load; clicking unmutes and restarts. See
         vsl.js — the Wistia player is mounted into the div below. -->
    <div class="relative mx-auto mt-16 max-w-4xl" data-vsl-id="${esc(c.home.vsl.wistiaId)}">

      <!-- Cyan bloom. Deliberately restrained: wider and more diffuse than a
           tight halo, at low alpha, so it reads as the frame sitting in light
           rather than as a glow effect applied to it. Scales and fades rather
           than animating blur, so it composites. -->
      <div aria-hidden="true" class="vsl-bloom pointer-events-none absolute -inset-x-28 -inset-y-20 -z-10 blur-3xl"
           style="background:radial-gradient(50% 50% at 50% 50%,rgba(0,185,198,.3),transparent 74%)"></div>

      <div class="relative overflow-hidden ring-1 ring-cyan/40 shadow-[0_0_100px_-20px_rgba(0,185,198,.48),0_40px_90px_-45px_rgba(0,0,0,.85)]"
           style="aspect-ratio:2.39/1">
        <div class="absolute inset-0 [&>div]:h-full [&>div]:w-full">
          <div class="wistia_embed wistia_async_${esc(c.home.vsl.wistiaId)} videoFoam=true h-full w-full">&nbsp;</div>
        </div>

        <!-- Vignette, over the player but not catching clicks. -->
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 z-10"
             style="box-shadow:inset 0 0 140px 40px rgba(0,0,0,.72)"></div>

        <button type="button" class="vsl-sound absolute bottom-4 right-4 z-20 flex min-h-11 items-center gap-2 rounded-full bg-ink/70 px-4 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan">
          <svg class="vsl-icon-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6"/></svg>
          <svg class="vsl-icon-on hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>
          <span class="vsl-label">Tap for sound</span>
        </button>
      </div>
    </div>

    <!-- Marquee: one glass strip carrying the eyebrow, next date, location,
         the LIMITED SPOTS badge and the action. Keeps the hero short, and
         surfaces the location and badge that site.json already held but the
         page never showed. -->
    <div class="mx-auto mt-12 max-w-4xl">
      <div class="flex flex-col items-center gap-5 rounded-3xl px-6 py-5 ring-1 ring-white/20 sm:flex-row sm:justify-between sm:rounded-full sm:px-8"
           style="background:rgba(255,255,255,.08);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)">
        <div class="text-center sm:text-left">
          <p class="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-magenta">${esc(c.home.hero.eyebrow)}</p>
          <p class="mt-1 font-display text-lg font-bold text-white sm:text-xl">
            ${esc(first.dates)} <span class="text-white/45">&middot;</span> ${esc(first.location)}
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-4">
          ${first.note ? `<span class="inline-flex items-center rounded-full bg-cyan px-3 py-1 font-body text-[10px] font-bold uppercase tracking-[0.18em] text-ink">${esc(first.note)}</span>` : ''}
          <a href="${esc(site.nextEvent.ctaUrl)}"
             class="group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-magenta px-7 py-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_14px_30px_-14px_rgba(232,32,143,.9)] transition hover:bg-magenta-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta">
             ${esc(site.nextEvent.ctaText)}
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
                  class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
      <p class="mt-4 font-body text-sm text-white/55">Also scheduled &middot; ${esc(second.dates)}</p>
    </div>
  </div>
</section>`;
};

// About page hero.
//
// The homepage hero's treatment, on the photograph the live about page uses.
// Deliberately the same recipe rather than a lookalike:
//
//   image at 50% over bg-ink   the same as the homepage video
//   radial vignette            same stops
//   text band                  same stops
//   .sheen rotating word       same class, same clamp, same grid cell
//   pt-48 / sm:pt-52           same header clearance
//
// That chain is not decoration, it is what makes the headline legible. The
// magenta stop of the duotone is the binding constraint: over a near-white
// area of this photograph it measures 1.02:1 under a single 55% scrim and
// never clears 3:1 at any single-layer opacity — it only comes back as the
// ground approaches solid ink. Stacked as above it lands at 3.21:1 against a
// 245-grey worst case, which is the same margin the homepage runs on.
//
// The photograph is Queens-Waving-Photo-2-scaled.jpg, which is the background
// the live about page sets on its hero section. Already local.
//
// No VSL and no dates block. The live about hero is a headline and a button,
// and a second video on this page would compete with the homepage's.
import { esc } from './layout.mjs';

// Same definition as the homepage's SANS_LINE. The two heroes have to match,
// and the only way to be sure is to set them from the same numbers.
const SANS_LINE =
  'block font-display text-base font-bold uppercase leading-snug tracking-[0.2em] text-white sm:text-2xl';

export const aboutHero = (site, c) => {
  const h = c.about.hero;

  // clamp() rather than breakpoints: "reclaim" is half again the width of
  // "rise", so a step change at a breakpoint would be visible mid-rotation.
  const words = h.rotatingWords.map((w, i) =>
    `<span class="hero-word sheen ${i === 0 ? 'is-on' : ''} font-display font-extrabold uppercase"
       style="grid-area:1/1;font-size:clamp(2.75rem,9vw,6rem);line-height:1;letter-spacing:-.01em">${esc(w)}</span>`
  ).join('');

  return `
<section class="relative overflow-hidden bg-ink">

  <img src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" loading="eager" decoding="async"
       class="absolute inset-0 h-full w-full object-cover opacity-50">

  <!-- Vignette: dark at the edges, the photograph brightest through the
       middle. Same stops as the homepage. -->
  <div aria-hidden="true" class="absolute inset-0"
       style="background:radial-gradient(78% 62% at 50% 46%,rgba(28,28,28,.45),rgba(28,28,28,.9) 100%)"></div>

  <!-- Text band. A vignette alone leaves the centre bright, which is where the
       headline sits. This darkens the top and bottom and stays clear through
       the middle, where the faces are. -->
  <div aria-hidden="true" class="absolute inset-0"
       style="background:linear-gradient(to bottom,rgba(28,28,28,.68) 0%,rgba(28,28,28,0) 34%,rgba(28,28,28,0) 62%,rgba(28,28,28,.58) 100%)"></div>

  <!-- pt clears the overlaid header: 161px from sm. -->
  <div class="relative mx-auto max-w-4xl px-4 pb-28 pt-48 text-center sm:pt-52">

    <h1 class="text-white">
      <span class="${SANS_LINE}">${esc(h.headingBefore)}</span>
      <span class="mt-3 block">
        <span class="hero-rotator relative inline-grid" data-swap="fade">${words}</span>
      </span>
    </h1>

    <!-- The rotator swaps text under assistive tech, so the sentence is also
         announced once, statically. -->
    <p class="sr-only">${esc(h.sub)}</p>

    <div class="mt-12">
      <a href="${esc(site.nextEvent.ctaUrl)}" rel="noopener"
         class="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-9 py-4 font-body
                text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,.7)]
                transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta"
         style="background:#e8208f">
        ${esc(site.nextEvent.ctaText)}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
             class="transition group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>
  </div>
</section>`;
};

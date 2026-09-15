// About page hero — the homepage hero, on the about page's own photograph
// and its own video.
//
// Same structure and the same numbers, not a lookalike:
//
//   image at 50% over bg-ink   the homepage runs its video at the same opacity
//   radial vignette            same stops
//   text band                  same stops
//   .sheen rotating word       same class, same clamp, same grid cell
//   VSL below the headline     same 2.39:1 crop, same cyan bloom
//
// The video opens with "unfold" at the "glide" timing: the 2.39:1 frame grows
// to 16:9 over 1.8s, giving back the quarter of the picture the crop hides,
// and the poster cross-fades off the player rather than being swapped out.
// See vsl-open.mjs.
//   divided dates + CTA        same block
//   pt-24 / sm:pt-52           same header clearance (73px phone bar, 161px from sm)
//
// That chain is not decoration, it is what makes the headline legible. The
// duotone's magenta stop is the binding constraint: over a near-white area of
// this photograph it measures 1.02:1 under a single 55% scrim and never clears
// 3:1 at any single-layer opacity — it only recovers as the ground approaches
// solid ink. Layered as above it lands at 3.21:1 against a 245-grey worst case.
//
// The video is the What-is-RUQ interview the live about page embeds. It used
// to sit in the "Who is it for?" section below; it is in the hero now, so that
// section is copy only until its content is decided.
//
// The photograph is Queens-Waving-Photo-2, which is the background the live
// about page sets on its hero section. Already local.
//
// Two things this now duplicates from the homepage, deliberately but worth
// knowing: the event dates appear on both pages, and so does the Register CTA.
import { esc } from './layout.mjs';
import { vslStage } from './vsl-open.mjs';

// Same definition as the homepage's SANS_LINE. The two heroes have to match,
// and the only way to be sure is to set them from the same numbers.
const SANS_LINE =
  'block font-display text-base font-bold uppercase leading-snug tracking-[0.2em] text-white sm:text-2xl';

export const aboutHero = (site, c, vslFx = 'unfold', vslFeel = 'glide') => {
  const h = c.about.hero;
  const [first, second] = site.nextEvent.upcoming;

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
       the middle, where the video is. -->
  <div aria-hidden="true" class="absolute inset-0"
       style="background:linear-gradient(to bottom,rgba(28,28,28,.68) 0%,rgba(28,28,28,0) 34%,rgba(28,28,28,0) 62%,rgba(28,28,28,.58) 100%)"></div>

  <!-- pt clears the overlaid header: 161px from sm. -->
  <div class="relative mx-auto max-w-4xl px-4 pb-12 sm:pb-28 pt-24 text-center sm:pt-52">

    <h1 class="vsl-dimmable text-white">
      <span class="${SANS_LINE}">${esc(h.headingBefore)}</span>
      <span class="mt-2 block sm:mt-3">
        <span class="hero-rotator relative inline-grid" data-swap="fade">${words}</span>
      </span>
    </h1>

    <!-- The rotator swaps text under assistive tech, so the sentence is also
         announced once, statically. -->
    <p class="sr-only">${esc(h.sub)}</p>

    <!-- The interview, framed exactly as the homepage frames its VSL.
         Click-to-load rather than the homepage's autoplaying Wistia embed:
         this one is a 30-minute conversation, not a 2-minute promo, and
         nothing should start playing it on arrival. -->
    <div class="vsl-shell relative mx-auto mt-6 sm:mt-16 max-w-4xl">

      <!-- Cyan bloom. Wide and diffuse at low alpha, so it reads as the frame
           sitting in light rather than a glow applied to it. Scales and fades
           rather than animating blur, so it composites. -->
      <div aria-hidden="true" class="vsl-bloom pointer-events-none absolute -inset-x-28 -inset-y-20 -z-10 blur-3xl"
           style="background:radial-gradient(50% 50% at 50% 50%,rgba(0,185,198,.3),transparent 74%)"></div>

      <div class="overflow-hidden ring-1 ring-cyan/40 shadow-[0_0_100px_-20px_rgba(0,185,198,.48),0_40px_90px_-45px_rgba(0,0,0,.85)]">
        ${vslStage(vslFx, `
        <button type="button"
                class="video-facade group absolute inset-0 block h-full w-full"
                data-provider="wistia" data-id="${esc(c.about.whoForVideo)}" data-title="What is Rise Up Queens?">
          <span class="sr-only">Play: What is Rise Up Queens?</span>
          <img src="/assets/posters/${esc(c.about.whoForVideo)}.jpg" alt="" aria-hidden="true" loading="eager" decoding="async"
               class="absolute inset-0 h-full w-full object-cover">
          <span aria-hidden="true" class="pointer-events-none absolute inset-0" style="box-shadow:inset 0 0 140px 40px rgba(0,0,0,.72)"></span>
          <span class="absolute inset-0 flex items-center justify-center">
            <span class="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-[0_14px_40px_-10px_rgba(0,0,0,.7)] transition group-hover:scale-110">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#e8208f"><path d="M8 5v14l11-7z"/></svg>
            </span>
          </span>
        </button>`, vslFeel)}
      </div>
    </div>

    <!-- Divided: action first, then the two dates either side of a hairline.
         Same block as the homepage. -->
    <div class="vsl-dimmable mt-5 sm:mt-12 flex flex-col items-center gap-4 sm:gap-5">
      <a href="${esc(site.nextEvent.ctaUrl)}" rel="noopener"
         class="group inline-flex min-h-11 items-center gap-3 rounded-full bg-magenta px-9 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_16px_36px_-16px_rgba(232,32,143,.9)] transition hover:bg-magenta-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta">
         ${esc(site.nextEvent.ctaText)}
         <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
              class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>

      <div class="flex items-stretch gap-5 text-center">
        <div>
          <p class="font-display text-sm font-bold text-white">${esc(first.dates)}</p>
          <p class="mt-0.5 font-body text-[11px] uppercase tracking-[0.15em] text-white/50">${esc(first.location)}</p>
        </div>
        <div aria-hidden="true" class="w-px bg-white/20"></div>
        <div>
          <p class="font-display text-sm font-bold text-white/70">${esc(second.dates)}</p>
          <p class="mt-0.5 font-body text-[11px] uppercase tracking-[0.15em] text-white/40">${esc(second.location)}</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
};

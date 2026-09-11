// Replacing the arch on the creed band with a gradient join.
//
// The arch put a hard dark curve straight against white, and the testimonial
// section's own brand wash then read as a separate stripe underneath it rather
// than as a continuation. These five all dissolve the edge instead of shaping
// it.
//
// Both edges are treated the same in every option. The band's top meets the
// white CTA and its bottom meets the white testimonial section, so a fade at
// one end and an arch at the other would read as a mistake.
//
// The plate is imported from faith.mjs rather than copied, so the creed has
// exactly one definition.
import { faithPlate, FAITH_PHOTO, FAITH_IMG_FILTER, FAITH_SCRIM } from './faith.mjs';

const WHITE = '#ffffff';

export const FAITH_EDGE_OPTIONS = {
  arch: {
    label: 'Arch — what is there now',
    note: 'The shaped dome, shown for comparison. The hard curve against white is what the fades below are replacing.',
  },
  fade: {
    label: 'Fade — a short dissolve at both edges',
    note: 'White fades into the dark over 6rem at the top and bottom. The most direct reading of the brief: no shape at all, just an edge that stops being an edge. Keeps the band clearly a band.',
  },
  longFade: {
    label: 'Long fade — the dark reads as a cloud, not a band',
    note: 'Same idea over 16rem instead of 6. The dark is only ever fully dense behind the plate and thins away from it in both directions, so the section stops having a top and a bottom at all. Softest of the five.',
  },
  brandFade: {
    label: 'Brand fade — the dark blushes into the section below',
    note: 'Rather than fading to plain white, the bottom passes through the same magenta wash the testimonial section already carries, and the top through cyan. Directly fixes what the screenshot shows: the wash stops being a separate stripe and becomes the far end of one continuous gradient.',
  },
  curvedFade: {
    label: 'Curved fade — the dome survives, the hard line does not',
    note: 'Keeps the curve, but paints it as a soft radial sweep instead of clipping the band. You still read an arch; there is no crisp boundary anywhere. The closest of the five to what is there now.',
  },
  veil: {
    label: 'Veil — the photograph itself dissolves',
    note: 'No white painted over the top. The image and its scrim are masked out towards both edges, so the band genuinely thins to nothing instead of being covered up. The only one that would still work if the sections around it ever stopped being white.',
  },
};

// Each option returns { clipStyle, maskStyle, overlays, padY }.
//
// The distinction that matters: overlays paint white ON TOP of the dark, mask
// removes the dark. Painting is simpler and composites fine, but it only works
// against a known background colour. Masking works over anything.
const edgeFor = (key) => {
  const paint = (topH, bottomH, topStops, bottomStops) => ({
    clipStyle: '', maskStyle: '',
    overlays: `
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 ${topH}"
       style="background:linear-gradient(to bottom,${topStops})"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 ${bottomH}"
       style="background:linear-gradient(to top,${bottomStops})"></div>`,
  });

  if (key === 'fade') return {
    ...paint('h-24', 'h-24', `${WHITE},rgba(255,255,255,0)`, `${WHITE},rgba(255,255,255,0)`),
    padY: 'py-20',
  };

  if (key === 'longFade') return {
    // Eased rather than linear: a straight ramp over this distance leaves a
    // visible grey plateau in the middle of the fade.
    ...paint('h-64', 'h-64',
      `${WHITE} 0%,rgba(255,255,255,.85) 25%,rgba(255,255,255,.5) 55%,rgba(255,255,255,0) 100%`,
      `${WHITE} 0%,rgba(255,255,255,.85) 25%,rgba(255,255,255,.5) 55%,rgba(255,255,255,0) 100%`),
    padY: 'py-28',
  };

  if (key === 'brandFade') return {
    ...paint('h-40', 'h-40',
      `${WHITE} 0%,rgba(229,248,250,.92) 28%,rgba(0,185,198,.16) 62%,rgba(0,185,198,0) 100%`,
      `${WHITE} 0%,rgba(253,234,245,.92) 28%,rgba(232,32,143,.16) 62%,rgba(232,32,143,0) 100%`),
    padY: 'py-24',
  };

  if (key === 'curvedFade') return {
    clipStyle: '', maskStyle: '', padY: 'py-24',
    // Radial rather than linear, so the white sweeps in deeper at the corners
    // than at the centre — which is the arch, drawn in gradient.
    overlays: `
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-48"
       style="background:radial-gradient(130% 100% at 50% 100%,rgba(255,255,255,0) 55%,rgba(255,255,255,.75) 80%,${WHITE} 100%)"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-48"
       style="background:radial-gradient(130% 100% at 50% 0%,rgba(255,255,255,0) 55%,rgba(255,255,255,.75) 80%,${WHITE} 100%)"></div>`,
  };

  if (key === 'veil') return {
    clipStyle: '', overlays: '', padY: 'py-24',
    // -webkit- first for Safari before 15.4, which needs the prefix and
    // ignores the unprefixed property entirely.
    maskStyle: '-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 16%,#000 84%,transparent 100%);'
             + 'mask-image:linear-gradient(to bottom,transparent 0%,#000 16%,#000 84%,transparent 100%)',
  };

  // arch — the current treatment
  return {
    clipStyle: 'border-radius:50% 50% 50% 50%/5rem 5rem 5rem 5rem',
    maskStyle: '', overlays: '', padY: 'py-20',
  };
};

export const renderFaithEdge = (site, c, key) => {
  const e = edgeFor(key);
  const style = ['isolation:isolate', e.clipStyle, e.maskStyle].filter(Boolean).join(';');

  return `
<section class="relative">

  <!-- Decoration only. Clipping and masking stay off the <section> itself:
       overflow-hidden on an ancestor silently kills position: sticky. -->
  <div aria-hidden="true" class="absolute inset-0 overflow-hidden" style="${style}">
    <img src="${FAITH_PHOTO}" alt="" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover ${FAITH_IMG_FILTER}">
    <div class="absolute inset-0" style="background:${FAITH_SCRIM}"></div>
  </div>
${e.overlays}
  <!-- Content is painted after the overlays, so the plate stays crisp no
       matter how far into the section a fade reaches. -->
  <div class="relative ${e.padY}">
    <div class="mx-auto max-w-4xl px-6">
      ${faithPlate(c)}
    </div>
  </div>
</section>`;
};

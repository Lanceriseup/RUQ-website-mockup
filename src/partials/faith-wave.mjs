// Wave joins for the creed band, in the manner of the reference: a soft crest
// at each edge with a lighter band showing behind it.
//
// Same rules as the fade options next door — both edges get the same
// treatment, the plate is imported rather than copied, and the shapes are cut
// in the neighbours' colour so they dissolve into them.
//
// The tinted back wave takes cyan at the top and magenta at the bottom,
// matching what the sections either side already carry: the CTA above ends on
// a cyan rule, the testimonial section below opens with a magenta wash. A
// single neutral tint at both ends would read as a third colour arriving from
// nowhere.
import { faithPlate, FAITH_PHOTO, FAITH_IMG_FILTER, FAITH_SCRIM } from './faith.mjs';

const WHITE = '#ffffff';
const MAGENTA_BAND = '#f7e4f0';   // deeper than magenta-tint so it reads against white
const CYAN_BAND = '#e2f4f6';

export const FAITH_WAVE_OPTIONS = {
  soft: {
    label: 'Soft — one long low crest',
    note: 'A single wave of just over one period across the width, shallow enough that it reads as a drift rather than a shape. The quietest of the six and the one that dates the slowest.',
  },
  layered: {
    label: 'Layered — a tinted band behind a white crest',
    note: 'Two waves at each edge: a brand-tinted one set back and phase-shifted, with the white crest in front of it. This is the construction in your reference — the tint is what makes it read as depth rather than as a cut.',
  },
  deep: {
    label: 'Deep — a bold single sweep',
    note: 'Same single wave, roughly two and a half times the amplitude. The crest travels far enough into the band to feel deliberate. Loudest of the six; needs the extra padding it gets so the plate stays clear of it.',
  },
  tilted: {
    label: 'Tilted — asymmetric, the crest off to one side',
    note: 'Three quarters of a period instead of a full one, so the edge rises across the page rather than returning to where it started. Gives the band direction; the top and bottom lean the same way, which keeps it from looking like an error.',
  },
  ripple: {
    label: 'Ripple — three bands, magenta through cyan',
    note: 'Three waves stacked at each edge, each phase-shifted and more transparent than the last, going white at the front. The most decorative option and the only one that uses both brand hues at the same edge.',
  },
  waveFade: {
    label: 'Wave + fade — a crest with no hard line',
    note: 'The wave shape, then a gradient over it so the boundary itself is soft. Combines this set with the fade set: you read a wave, but there is no crisp edge anywhere on it.',
  },
};

// ------------------------------------------------------------------ paths

// Plotted rather than hand-written. A wave as a literal path string cannot be
// adjusted — changing the amplitude means rewriting every coordinate — and
// these need to be tuned against each other.
//
// 120 segments across 1440 is 12px apart before preserveAspectRatio stretches
// them, which is well under the point where the polyline reads as faceted.
const VIEW_W = 1440;

const wavePath = ({ h, amp, periods, phase = 0, mid = 0.55 }) => {
  const N = 120;
  const pts = [];
  for (let i = N; i >= 0; i--) {
    const x = (VIEW_W * i) / N;
    const y = h * mid + amp * Math.sin((i / N) * Math.PI * 2 * periods + phase);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M0,0 H${VIEW_W} L${pts.join(' L')} Z`;
};

// One <svg> per edge carrying every layer, so the layers cannot drift apart
// and the whole edge is a single element to position.
const edgeSvg = (h, layers, flip) => `
<svg aria-hidden="true" viewBox="0 0 ${VIEW_W} ${h}" preserveAspectRatio="none"
     class="pointer-events-none absolute inset-x-0 ${flip ? 'bottom-0' : 'top-0'} w-full"
     style="height:${h}px;display:block${flip ? ';transform:scaleY(-1)' : ''}">
  ${layers.map(l => `<path d="${wavePath({ h, ...l })}" fill="${l.fill}"${l.opacity ? ` opacity="${l.opacity}"` : ''}/>`).join('\n  ')}
</svg>`;

// ---------------------------------------------------------------- options

const waveFor = (key) => {
  if (key === 'soft') return {
    padY: 'py-20', h: 80,
    top: [{ amp: 14, periods: 1.1, fill: WHITE }],
    bottom: [{ amp: 14, periods: 1.1, phase: Math.PI, fill: WHITE }],
  };

  if (key === 'layered') return {
    padY: 'py-28', h: 104,
    // The back band sits lower and out of phase, so it shows through where
    // the white crest pulls away. Same phase for both and it would never
    // appear at all.
    top: [
      { amp: 18, periods: 1.1, phase: 0.9, mid: 0.72, fill: CYAN_BAND },
      { amp: 18, periods: 1.1, mid: 0.5, fill: WHITE },
    ],
    bottom: [
      { amp: 18, periods: 1.1, phase: Math.PI + 0.9, mid: 0.72, fill: MAGENTA_BAND },
      { amp: 18, periods: 1.1, phase: Math.PI, mid: 0.5, fill: WHITE },
    ],
  };

  if (key === 'deep') return {
    padY: 'py-32', h: 140,
    top: [{ amp: 36, periods: 1, mid: 0.52, fill: WHITE }],
    bottom: [{ amp: 36, periods: 1, phase: Math.PI, mid: 0.52, fill: WHITE }],
  };

  if (key === 'tilted') return {
    padY: 'py-28', h: 120,
    // Three quarters of a period does not return to its starting height, so
    // the edge arrives at the right side higher than it left the left side.
    top: [{ amp: 26, periods: 0.75, phase: -0.6, mid: 0.55, fill: WHITE }],
    bottom: [{ amp: 26, periods: 0.75, phase: -0.6, mid: 0.55, fill: WHITE }],
  };

  if (key === 'ripple') return {
    padY: 'py-32', h: 130,
    top: [
      { amp: 20, periods: 1.2, phase: 1.8, mid: 0.74, fill: '#00b9c6', opacity: 0.16 },
      { amp: 20, periods: 1.2, phase: 0.9, mid: 0.60, fill: '#e8208f', opacity: 0.14 },
      { amp: 20, periods: 1.2, mid: 0.44, fill: WHITE },
    ],
    bottom: [
      { amp: 20, periods: 1.2, phase: Math.PI + 1.8, mid: 0.74, fill: '#e8208f', opacity: 0.16 },
      { amp: 20, periods: 1.2, phase: Math.PI + 0.9, mid: 0.60, fill: '#00b9c6', opacity: 0.14 },
      { amp: 20, periods: 1.2, phase: Math.PI, mid: 0.44, fill: WHITE },
    ],
  };

  // waveFade
  return {
    padY: 'py-24', h: 120,
    top: [{ amp: 20, periods: 1.1, mid: 0.42, fill: WHITE }],
    bottom: [{ amp: 20, periods: 1.1, phase: Math.PI, mid: 0.42, fill: WHITE }],
    // Sits over the wave, not under it, so the crest itself is what softens.
    softener: true,
  };
};

export const renderFaithWave = (site, c, key) => {
  const w = waveFor(key);

  const softener = w.softener ? `
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-48"
       style="background:linear-gradient(to bottom,rgba(255,255,255,.92),rgba(255,255,255,0))"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-48"
       style="background:linear-gradient(to top,rgba(255,255,255,.92),rgba(255,255,255,0))"></div>` : '';

  return `
<section class="relative">

  <!-- Decoration only: clipping stays off the <section> itself, because
       overflow-hidden on an ancestor silently kills position: sticky. -->
  <div aria-hidden="true" class="absolute inset-0 overflow-hidden">
    <img src="${FAITH_PHOTO}" alt="" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover ${FAITH_IMG_FILTER}">
    <div class="absolute inset-0" style="background:${FAITH_SCRIM}"></div>
  </div>

  ${edgeSvg(w.h, w.top, false)}
  ${edgeSvg(w.h, w.bottom, true)}
  ${softener}

  <!-- Content paints after the waves, so the plate stays clear of them no
       matter how far a crest reaches into the band. -->
  <div class="relative ${w.padY}">
    <div class="mx-auto max-w-4xl px-6">
      ${faithPlate(c)}
    </div>
  </div>
</section>`;
};

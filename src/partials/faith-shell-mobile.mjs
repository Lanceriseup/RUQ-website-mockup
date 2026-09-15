// How the creed's parchment plate meets its wave-edged background on a phone.
//
// ── The defect ───────────────────────────────────────────────────────────────
// The section's top and bottom edges are 110px SVG waves, absolutely
// positioned. faith.mjs states the constraint plainly:
//
//   "the deepest point of the tinted band [is] 0.60 * 110 + 19 = 103px,
//    which py-28 clears by 27px"
//
// The mobile compaction set that padding to py-10 — 40px — so 63px of the wave
// now runs behind the plate at each edge. The plate paints on top, so nothing
// is obscured, but the wave has nowhere to be seen: the band is swallowed, the
// dark photograph barely registers, and the plate reads as jammed into the
// section rather than laid on it. That is what the screenshot shows.
//
// Two ways out, and they are genuinely different:
//
//   give the wave room     restore the padding. Correct, and expensive: 224px
//                          of vertical space on a phone for decoration.
//
//   make the wave smaller  110px is a figure chosen against a 1440px-wide
//                          desktop section. Scaled to a phone the same wave is
//                          proportionally almost three times as tall. Scaling
//                          it needs far less clearance.
//
// And one question the defect exposes but does not answer: at 390px the plate
// leaves 24px of background either side, which is too little to read as a
// frame and too much to read as full bleed. That is worth settling now.
//
// All options are MOBILE ONLY; the desktop section is untouched.
import { esc } from './layout.mjs';
import { wavePath, WAVE_VIEW_W, faithPlate, FAITH_PHOTO, FAITH_SCRIM, FAITH_IMG_FILTER } from './faith.mjs';

const WHITE = '#ffffff';
const CYAN_BAND = '#e2f4f6';
const MAGENTA_BAND = '#f7e4f0';

// The shipped desktop wave.
const BIG = { H: 110, AMP: 19, PERIODS: 1.1, PHASE: 0.95, MID_WHITE: 0.30, MID_BAND: 0.60 };

// Phone wave. Height and amplitude scale together — dropping the height alone
// would leave the same 19px swing inside a 60px edge, which reads as a much
// rougher wave rather than a smaller one. Periods come down too: 1.1 cycles
// across 1440px is a long, slow curve, and the same 1.1 across 390px is a
// visibly busier one.
const SMALL = { H: 60, AMP: 10, PERIODS: 0.8, PHASE: 0.95, MID_WHITE: 0.30, MID_BAND: 0.60 };

// Deepest point of the tinted band = MID_BAND * H + AMP. That is the number
// the section padding has to clear.
const deepest = (w) => Math.round(w.MID_BAND * w.H + w.AMP);

const layersFor = (w, flip) => flip
  ? [
      { amp: w.AMP, periods: w.PERIODS, phase: Math.PI + w.PHASE, mid: w.MID_BAND, fill: MAGENTA_BAND },
      { amp: w.AMP, periods: w.PERIODS, phase: Math.PI, mid: w.MID_WHITE, fill: WHITE },
    ]
  : [
      { amp: w.AMP, periods: w.PERIODS, phase: w.PHASE, mid: w.MID_BAND, fill: CYAN_BAND },
      { amp: w.AMP, periods: w.PERIODS, mid: w.MID_WHITE, fill: WHITE },
    ];

const edge = (w, flip, cls) => `
<svg aria-hidden="true" viewBox="0 0 ${WAVE_VIEW_W} ${w.H}" preserveAspectRatio="none"
     class="pointer-events-none absolute inset-x-0 ${flip ? 'bottom-0' : 'top-0'} w-full ${cls}"
     style="height:${w.H}px;display:block${flip ? ';transform:scaleY(-1)' : ''}">
  ${layersFor(w, flip).map(l => `<path d="${wavePath({ h: w.H, ...l })}" fill="${l.fill}"${l.opacity ? ` opacity="${l.opacity}"` : ''}/>`).join('\n  ')}
</svg>`;

export const SHELL_MODES = {
  current: {
    label: 'Current — the defect',
    note: `The state in your screenshot. 110px waves against 40px of padding, so ${deepest(BIG) - 40}px of wave runs behind the plate at each edge and the band never gets to be seen.`,
    wave: 'big', pad: 'py-10', gutter: 'px-6', round: false,
  },

  clearance: {
    label: 'A — Give the wave its room back',
    note: `Restores the padding the wave was always documented as needing: ${deepest(BIG)}px of band, cleared by 112px. Nothing else changes, and it is unarguably correct. It also costs 144px of vertical space back on a phone — which is most of what the compaction won — for an edge treatment nobody scrolled here to see.`,
    wave: 'big', pad: 'py-28', gutter: 'px-6', round: false,
  },

  scaled: {
    label: 'B — Scale the wave to the phone',
    note: `The wave is 110px because the desktop section is 1440px wide. At 390px the same edge is proportionally almost three times as tall, which is why it stopped fitting. Scaled to 60px — with the amplitude and period scaled with it, or it reads as a rougher wave rather than a smaller one — the band's deepest point is ${deepest(SMALL)}px and py-14 clears it by 10px. Fixed, and the section stays short.`,
    wave: 'small', pad: 'py-14', gutter: 'px-6', round: false,
  },

  bleed: {
    label: 'C — B, plate full-bleed',
    note: 'B, and the plate runs edge to edge below sm. The 24px of background either side is currently too narrow to read as a frame and too wide to read as deliberate — this settles it the other way. The parchment becomes the section, the photograph shows only in the wave bands above and below, and the creed gets 48px more width to set in, which at 278px is a real gain.',
    wave: 'small', pad: 'py-14', gutter: 'px-0', round: false,
  },

  framed: {
    label: 'D — B, plate inset and rounded',
    note: 'B, and the plate is pulled in further with rounded corners, so the darkened photograph reads as a deliberate frame rather than a sliver. This is the only option that makes the background do visible work on a phone — everywhere else it is nearly invisible. Costs width in an already narrow column, which is the argument against it.',
    wave: 'small', pad: 'py-14', gutter: 'px-8', round: true,
  },

  noWave: {
    label: 'E — No wave on phones',
    note: 'Straight edges below sm, plate full-bleed, photograph still behind it. The waves are a desktop flourish that a phone renders as a thin ripple at the very top and bottom of a long dark band — arguably not worth any padding at all. The shortest and simplest, and the one that gives up a piece of the design language the rest of the page uses.',
    wave: 'none', pad: 'py-8', gutter: 'px-0', round: false,
  },
};

export const renderShell = (c, modeKey) => {
  const m = SHELL_MODES[modeKey];

  // Below sm each option renders its own edge; from sm up the shipped 110px
  // wave always returns, so the desktop section cannot move.
  const edges = m.wave === 'big'
    ? edge(BIG, false, '') + edge(BIG, true, '')
    : m.wave === 'small'
      ? edge(SMALL, false, 'sm:hidden') + edge(SMALL, true, 'sm:hidden') +
        edge(BIG, false, 'hidden sm:block') + edge(BIG, true, 'hidden sm:block')
      : edge(BIG, false, 'hidden sm:block') + edge(BIG, true, 'hidden sm:block');

  const plate = faithPlate(c);
  const plateWrapped = m.round
    ? `<div class="overflow-hidden rounded-2xl sm:rounded-none">${plate}</div>`
    : plate;

  return `
<section id="faith-shell" class="relative">
  <div aria-hidden="true" class="absolute inset-0 overflow-hidden">
    <img src="${FAITH_PHOTO}" alt="" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover ${FAITH_IMG_FILTER}">
    <div class="absolute inset-0" style="background:${FAITH_SCRIM}"></div>
  </div>
  ${edges}
  <div class="relative ${m.pad} sm:py-28">
    <div class="mx-auto max-w-4xl ${m.gutter} sm:px-6">
      ${plateWrapped}
    </div>
  </div>
</section>`;
};

export const SHELL_FACTS = { deepestBig: deepest(BIG), deepestSmall: deepest(SMALL) };

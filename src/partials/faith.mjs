// Mission + Statement of Faith. Manuscript treatment.
//
// The creed is set as a printed document rather than a web component: serif
// throughout, drop cap, two columns, hanging numerals, hairline rules, on a
// parchment plate. A creed set in a UI sans reads as terms and conditions.
//
// DISCLOSURE — read this before changing it back.
//
// This build originally showed all seven beliefs at every width, on purpose:
// the live site buries them in a collapsed accordion inside a scroll box,
// which makes the most load-bearing content on the page for this audience the
// hardest to reach.
//
// That still holds from sm up, where the creed is fully open with no control
// at all. BELOW sm it is now collapsed behind a "Read the full statement"
// button — the client chose this from the /faith-mobile.html comparison, after
// the trade-off above was put to them explicitly. It is a decision, not an
// oversight, and the two differences from the live site's version matter:
//
//   - it applies to phones only, not to every width
//   - one tap, not an accordion inside a scroll box
//
// The markup is unconditional: the <ol> and all seven beliefs are always in
// the DOM and the accessibility tree, hidden with a class. Search engines,
// screen readers on desktop, and print all get the full creed. If the JS never
// runs, `hidden sm:block` still means every viewport at or above sm shows
// everything — the control can never be the only way to reach the content on a
// viewport where the control is not rendered.
//
// Height comes from the "tightened" pass: section padding, plate padding, type
// size and leading each one step down from where they started. Below sm there
// is a second pass — see the notes inline. Layout, column count and copy are
// untouched at every width.
//
// Background is the photograph the live site uses behind this section: a cross
// hung with prayer notes, women seated around it. Treatment is "stone": all
// colour stripped, contrast pushed, then darkened. The live site runs the same
// image through brightness(190%) saturate(0%), which blows it out to
// near-white; this goes the other way and keeps it as a dark ground, so the
// parchment is the only warm thing on screen.
//
// Edges are the layered wave: a brand-tinted band set back and out of phase,
// with a white crest in front of it. See WAVE below for why the numbers are
// what they are.
//
// The plate and the wave generator are exported because faith-wave.mjs and
// faith-edge.mjs render the same content in different shells. One definition,
// so a change to the creed cannot land in only half the places it appears.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
export const FAITH_PHOTO = '/assets/photos/faith-bg.jpg';
export const FAITH_IMG_FILTER = 'grayscale contrast-125 brightness-90';
export const FAITH_SCRIM = 'rgba(28,28,28,.78)';

// ------------------------------------------------------------------ waves

// Plotted rather than written out. A wave as a literal path string cannot be
// tuned — changing the amplitude means rewriting every coordinate.
//
// 120 segments across 1440 is 12px apart before preserveAspectRatio stretches
// them, well under the point where the polyline reads as faceted.
export const WAVE_VIEW_W = 1440;

export const wavePath = ({ h, amp, periods, phase = 0, mid = 0.55 }) => {
  const N = 120;
  const pts = [];
  for (let i = N; i >= 0; i--) {
    const x = (WAVE_VIEW_W * i) / N;
    const y = h * mid + amp * Math.sin((i / N) * Math.PI * 2 * periods + phase);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M0,0 H${WAVE_VIEW_W} L${pts.join(' L')} Z`;
};

// One <svg> per edge carrying every layer, so the layers cannot drift apart
// and the whole edge is a single element to position.
export const waveEdge = (h, layers, flip) => `
<svg aria-hidden="true" viewBox="0 0 ${WAVE_VIEW_W} ${h}" preserveAspectRatio="none"
     class="pointer-events-none absolute inset-x-0 ${flip ? 'bottom-0' : 'top-0'} w-full"
     style="height:${h}px;display:block${flip ? ';transform:scaleY(-1)' : ''}">
  ${layers.map(l => `<path d="${wavePath({ h, ...l })}" fill="${l.fill}"${l.opacity ? ` opacity="${l.opacity}"` : ''}/>`).join('\n  ')}
</svg>`;

// The tinted band takes cyan at the top and magenta at the bottom, matching
// what the neighbours already carry: the CTA above ends on a cyan rule, the
// testimonial section below opens on a magenta wash. One neutral tint at both
// ends would read as a third colour arriving from nowhere.
const WHITE = '#ffffff';
const CYAN_BAND = '#e2f4f6';
const MAGENTA_BAND = '#f7e4f0';

// H is the edge height; MID_WHITE and MID_BAND are fractions of it.
//
// Band thickness is (MID_BAND - MID_WHITE) * H = 33px on average, up from 23
// in the first pass. The two waves share an amplitude but are PHASE apart, so
// the thickness breathes by 2*AMP*sin(PHASE/2) = 17px either side of that,
// giving 16px at its thinnest and 50px at its widest. That variation is what
// makes it read as a ribbon rather than a stroke — and it is also why the gap
// has to stay wider than the swing: at 17px or less the white crest would
// cross the tinted one and swallow it in places.
//
// MID_WHITE sits high in the edge (0.30, about 33px down) rather than centred.
// That holds the deepest point of the tinted band at 0.60 * 110 + 19 = 103px,
// which py-28 clears by 27px. Centring both would push the same band thickness
// another step of padding into the page, and this section was compacted on
// purpose.
const WAVE = { H: 110, AMP: 19, PERIODS: 1.1, PHASE: 0.95, MID_WHITE: 0.30, MID_BAND: 0.60 };

const topLayers = [
  { amp: WAVE.AMP, periods: WAVE.PERIODS, phase: WAVE.PHASE, mid: WAVE.MID_BAND, fill: CYAN_BAND },
  { amp: WAVE.AMP, periods: WAVE.PERIODS, mid: WAVE.MID_WHITE, fill: WHITE },
];
const bottomLayers = [
  { amp: WAVE.AMP, periods: WAVE.PERIODS, phase: Math.PI + WAVE.PHASE, mid: WAVE.MID_BAND, fill: MAGENTA_BAND },
  { amp: WAVE.AMP, periods: WAVE.PERIODS, phase: Math.PI, mid: WAVE.MID_WHITE, fill: WHITE },
];

// ------------------------------------------------------------------ plate

export const faithPlate = (c) => `
<!-- Parchment plate. Cormorant throughout; Lato only for the small caps label
     and the numerals, where a serif would read as decoration.

     Phone sizing is a separate pass throughout, because the inner column here
     is only 278px at 390px wide — 48px of page gutter and 64px of plate
     padding come off first — and every value below was chosen for the 4xl
     two-column plate. -->
<div class="p-6 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-10"
     style="background:#F6F1E8;font-family:'Cormorant Garamond',serif">

  <p class="text-center font-body text-[11px] uppercase tracking-[0.4em] text-ink-soft">${esc(c.home.faith.title)}</p>
  <div aria-hidden="true" class="mx-auto mt-5 h-px w-24" style="background:${MAGENTA}"></div>

  <!-- Drop cap scaled with the body: at 3.5rem it still spans about three
       lines of 1.2rem/1.5 text, which is what makes it read as a drop cap
       rather than a large first letter.

       sm and up only. In a 278px column a 3.5rem letter floats beside the
       first two lines and leaves them about 25 characters each, so the opening
       of the creed becomes its most awkwardly set passage — the opposite of
       what a drop cap is for. -->
  <p class="mt-6 text-[1.05rem] leading-[1.45] text-ink
            sm:text-[1.2rem] sm:leading-[1.5]
            sm:first-letter:float-left sm:first-letter:mr-3 sm:first-letter:mt-1
            sm:first-letter:text-[3.5rem] sm:first-letter:font-semibold sm:first-letter:leading-[.8]
            sm:first-letter:text-magenta">${esc(c.home.faith.intro)}</p>

  <div aria-hidden="true" class="my-5 h-px w-full sm:my-7" style="background:rgba(28,28,28,.18)"></div>

  <!-- break-inside-avoid stops a belief splitting across the column gap.

       Hanging indent: the numeral sits in its own column and the text aligns
       under itself instead of wrapping back beneath the number. At 278px that
       is what separates a numbered list from paragraphs with numbers in front
       of them.

       hidden sm:block — see the DISCLOSURE note at the top of this file. The
       beliefs are always in the DOM; this hides them on phones only, and the
       button below is sm:hidden so the two can never disagree. -->
  <ol id="faith-beliefs" class="hidden columns-1 gap-10 sm:block sm:columns-2">
    ${c.home.faith.beliefs.map((b, i) => `
    <li class="mb-3 flex break-inside-avoid gap-3 text-[1rem] leading-[1.4] text-ink sm:mb-5 sm:text-[1.08rem] sm:leading-[1.45]">
      <span aria-hidden="true" class="shrink-0 font-body text-sm font-semibold leading-[1.7]" style="color:${MAGENTA}">${String(i + 1).padStart(2, '0')}</span>
      <span>${esc(b)}</span>
    </li>`).join('')}
  </ol>

  <button type="button" id="faith-beliefs-more" aria-expanded="false" aria-controls="faith-beliefs"
          class="inline-flex min-h-11 items-center gap-1 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-magenta-text sm:hidden">
    <span data-faith-label>Read the full statement</span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
  </button>
</div>`;

// ---------------------------------------------------------------- section

export const faithSection = (site, c) => `
<section class="relative">

  <!-- Decoration only: clipping stays off the <section> itself, because
       overflow-hidden on an ancestor silently kills position: sticky and the
       content column may want it later. -->
  <div aria-hidden="true" class="absolute inset-0 overflow-hidden">
    <img src="${FAITH_PHOTO}" alt="" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover ${FAITH_IMG_FILTER}">
    <div class="absolute inset-0" style="background:${FAITH_SCRIM}"></div>
  </div>

  ${waveEdge(WAVE.H, topLayers, false)}
  ${waveEdge(WAVE.H, bottomLayers, true)}

  <!-- Content paints after the waves, so the plate stays clear of the crests.

       py-28 at EVERY width, with no mobile override — that is not an oversight,
       it is the constraint. The tinted band's deepest point is
       MID_BAND * H + AMP = 0.60 * 110 + 19 = 103px, and py-28 is 112px, so
       this is the smallest padding that lets the band be seen at all.

       Anything smaller hides the wave behind the plate. This shipped as py-16
       (64px), which already buried 39px of it; the mobile compaction pass took
       it to py-10 (40px) and buried 63px, which is when it became obvious.
       Both were wrong for the same reason.

       So: if this section needs to be shorter on a phone, the wave has to get
       smaller — H, AMP and PERIODS scale together, and the clearance follows
       from the formula above. Do not reach for the padding. There is a costed
       comparison of that alternative at /faith-shell.html. -->
  <div class="relative py-28">
    <div class="mx-auto max-w-4xl px-6">
      ${faithPlate(c)}
    </div>
  </div>
</section>`;

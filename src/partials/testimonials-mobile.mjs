// Compact mobile treatments for the testimonial rails.
//
// Two rails of 230px portrait cards drifting in opposite directions. Measured
// at 390px the section runs about 830px:
//
//   pt-10              40
//   heading           ~105   script at clamp floor 2.5rem + 24px sans
//   mt-8               32
//   two rails         595    2 x 287px cards (4:5 at 230px) + 20px between
//   pb-16              64
//   ──────────────────────
//                     836
//
// ── The payload, which is the bigger finding ────────────────────────────────
// The rail duplicates each set until it clears MIN_SET_W = 2600px, so the loop
// has track to run into. That figure is a desktop measurement — it exists so a
// 2560px monitor never sees a gap. It is applied at build time, to one static
// HTML file, for every viewport.
//
// The result: 3 repeats x 5 videos x 2 sets x 2 rails = 60 card buttons and 60
// poster images, each set 3750px wide, shipped to a 390px phone that can show
// about one and a half cards at a time. The loop needs the track to be twice
// the viewport; on a phone one repeat already gives 1250px, which is more than
// three times what is needed.
//
// Options C and D address that. It cannot be fixed by changing MIN_SET_W —
// desktop genuinely needs 2600px — so the extra repeats are wrapped and
// dropped below sm with `hidden sm:contents`, which keeps both sets exactly
// equal (the -50% loop depends on that) while removing the nodes from phones.
//
// Everything is MOBILE ONLY; the desktop section is untouched.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const GROUND = 'linear-gradient(180deg,#ffffff 0%,#FDF6F1 46%,#ffffff 100%)';
const MIN_SET_W = 2600;

const poster = (id) => `/assets/posters/${id}.jpg`;
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const swash = `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${MAGENTA}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

const card = (v, dupe, w, aspect) => `
<button type="button"${dupe ? ' aria-hidden="true" tabindex="-1"' : ''} data-lightbox
        class="video-facade group relative mr-3 block ${w} shrink-0 overflow-hidden rounded-2xl ring-1 ring-ink/10 shadow-[0_18px_40px_-24px_rgba(0,0,0,.6)] sm:mr-5"
        data-provider="wistia" data-id="${esc(v.id)}" data-title="${esc(v.title)}">
  <span class="sr-only">Play ${esc(v.title)}</span>
  <span class="relative block ${aspect} w-full">
    <img src="${poster(v.id)}" alt="" aria-hidden="true" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover">
    <span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.6),transparent 50%)"></span>
    <span aria-hidden="true" class="absolute inset-0 flex items-center justify-center">
      <span class="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-[0_10px_30px_-8px_rgba(0,0,0,.6)] sm:h-14 sm:w-14">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="${MAGENTA}"><path d="M8 5v14l11-7z"/></svg>
      </span>
    </span>
    ${v.seconds ? `<span aria-hidden="true" class="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 font-body text-[10px] font-semibold tabular-nums text-white backdrop-blur-sm">${fmt(v.seconds)}</span>` : ''}
  </span>
</button>`;

export const TEST_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline: two rails of 230px cards at 4:5, 60 card nodes and 60 poster images in the page, and the full-size heading.',
    cardW: 'w-[230px]', aspect: 'aspect-[4/5]', rails: 2, trim: false, heading: 'full', pad: 'pb-16 pt-10',
  },

  tighten: {
    label: 'A — Smaller cards, tighter frame',
    note: 'Cards 230→170px below sm, so the rails come down from 287px tall each to 212px, plus a compacted heading and tighter section padding. Two rails and both directions kept. Nothing structural — and at 170px a portrait card is still large enough to read a face, which is the only thing these posters have to do before someone taps.',
    cardW: 'w-[170px] sm:w-[230px]', aspect: 'aspect-[4/5]', rails: 2, trim: false, heading: 'compact', pad: 'pb-10 pt-8 sm:pb-28 sm:pt-16',
  },

  oneRail: {
    label: 'B — A, one rail on phones',
    note: 'A, with the second rail hidden below sm. Halves the rail block outright and removes what two counter-drifting rails do on a small screen that they do not do on a wide one: fill most of the viewport with opposing motion. One rail reads as a considered detail; two read as busy. The trade is real and worth stating — a phone sees the first five testimonials rather than all ten. Rendering a separate ten-video mobile rail instead would put both versions in the HTML, which measured at 100 card nodes against 60, so that is not the way to get all ten.',
    cardW: 'w-[170px] sm:w-[230px]', aspect: 'aspect-[4/5]', rails: 1, trim: false, heading: 'compact', pad: 'pb-10 pt-8 sm:pb-28 sm:pt-16',
  },

  trimmed: {
    label: 'C — B, and stop shipping 60 cards to a phone',
    note: 'B, plus the duplicate sets past the first are dropped below sm. The loop needs a track twice the viewport width; one repeat gives 1250px against a 390px phone, which is already more than three times enough. Both sets stay exactly equal so the -50% wrap is still seamless. This is the option that makes the section genuinely lighter rather than just shorter.',
    cardW: 'w-[170px] sm:w-[230px]', aspect: 'aspect-[4/5]', rails: 1, trim: true, heading: 'compact', pad: 'pb-10 pt-8 sm:pb-28 sm:pt-16',
  },

  grid: {
    label: 'D — Static grid on phones, no motion',
    note: 'Below sm the rails become a plain two-column grid of four posters with the rest reachable on the events page. No animation, no duplicates, four images instead of sixty. The most compact and by far the lightest — and the one that gives up the device the section is built on. Worth seeing before dismissing: a moving rail on a phone is also a thing people scroll past rather than watch.',
    cardW: '', aspect: 'aspect-[4/5]', rails: 0, trim: true, heading: 'compact', pad: 'pb-10 pt-8 sm:pb-28 sm:pt-16',
  },
};

const heading = (mode) => mode === 'compact'
  ? `<h2 class="text-center leading-none">
      <span class="relative inline-block">
        <span class="script block" style="color:${MAGENTA};font-size:clamp(2.25rem,11vw,4.5rem);line-height:.9;white-space:nowrap">Real change</span>
        ${swash}
      </span>
      <span class="mt-4 block font-display text-[11px] font-bold uppercase tracking-[0.3em] text-ink-soft sm:mt-3 sm:text-[2.1rem] sm:tracking-[0.06em] sm:text-ink">women in marriage found</span>
    </h2>`
  : `<h2 class="text-center leading-none">
      <span class="relative inline-block">
        <span class="script block" style="color:${MAGENTA};font-size:clamp(2.5rem,7vw,4.5rem);line-height:.9">Real change</span>
        ${swash}
      </span>
      <span class="mt-3 block font-display text-2xl font-bold uppercase tracking-[0.06em] text-ink sm:text-[2.1rem]">women in marriage found</span>
    </h2>`;

// Each repeat past the first is wrapped so it can be dropped below sm.
// display:contents rather than block — the cards must stay direct flex
// children of the track or the widths and the wrap stop working.
const railFor = (items, dir, seconds, m) => {
  const CARD_W = (m.cardW.includes('170') ? 170 : 230) + 20;
  const repeats = Math.max(1, Math.ceil(MIN_SET_W / (items.length * CARD_W)));
  const set = (firstPass) => Array.from({ length: repeats }, (_, r) => {
    const cards = items.map(v => card(v, !(firstPass && r === 0), m.cardW, m.aspect)).join('');
    return r === 0 || !m.trim ? cards : `<span class="hidden sm:contents">${cards}</span>`;
  }).join('');

  return `
<div class="rail relative overflow-hidden">
  <div class="rail-track flex w-max" style="animation-name:rail-${dir};animation-duration:${seconds}s">
    ${set(true)}${set(false)}
  </div>
</div>`;
};

export const renderTestimonials = (vids, modeKey) => {
  const m = TEST_MODES[modeKey];
  const list = vids.wistia.filter(v => v.page === 'home' && /Testimonial/i.test(v.title));
  const half = Math.ceil(list.length / 2);

  let body;
  if (m.rails === 0) {
    body = `
    <div class="relative mx-auto mt-6 max-w-content px-4 sm:hidden">
      <div class="grid grid-cols-2 gap-3">
        ${list.slice(0, 4).map(v => card(v, false, 'w-full', m.aspect).replace('mr-3 ', '').replace('sm:mr-5', '')).join('')}
      </div>
      <p class="mt-4 text-center font-body text-[11px] font-bold uppercase tracking-[0.2em] text-magenta-text">Ten more on the events page</p>
    </div>
    <div class="relative mt-8 hidden space-y-5 sm:mt-12 sm:block">
      ${railFor(list.slice(0, half), 'left', 130, m)}
      ${railFor(list.slice(half), 'right', 150, m)}
    </div>`;
  } else if (m.rails === 1) {
    // Hide the SECOND rail below sm rather than rendering a separate mobile
    // rail. A phone-specific rail would mean both versions in the HTML — an
    // earlier pass at this shipped 100 card nodes instead of 60, which is the
    // opposite of the point. The trade is stated in the note: a phone sees the
    // first five testimonials rather than all ten.
    body = `
    <div class="relative mt-6 space-y-3 sm:mt-12 sm:space-y-5">
      ${railFor(list.slice(0, half), 'left', 130, m)}
      <div class="hidden sm:block">${railFor(list.slice(half), 'right', 150, m)}</div>
    </div>`;
  } else {
    body = `
    <div class="relative mt-6 space-y-3 sm:mt-12 sm:space-y-5">
      ${railFor(list.slice(0, half), 'left', 130, m)}
      ${railFor(list.slice(half), 'right', 150, m)}
    </div>`;
  }

  return `
<section id="testimonials" class="relative overflow-hidden ${m.pad}" style="background:${GROUND}">
  <div class="relative mx-auto max-w-content px-4">
    ${heading(m.heading)}
  </div>
  ${body}
</section>`;
};

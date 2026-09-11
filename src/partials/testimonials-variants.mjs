// Design options for the testimonial section.
//
// Two things had to be settled before any of this was drawable:
//
// 1. POSTER FRAMES. The facades were blank dark rectangles. Wistia's oEmbed
//    endpoint hands back a poster for every video, so scripts/fetch-posters.mjs
//    now pulls all fifteen into src/assets/posters/. Every option below is
//    built on real frames.
//
// 2. WHAT SITS ABOVE. The creed band is now dark, arched at the bottom. Its
//    dome shows the page behind it through the two bottom corners — white
//    today. Any option here that keeps the dark ground therefore needs the
//    page behind the creed band darkened too, or two white crescents appear
//    between the bands. Those options carry needsDarkAbove.
//
// NAMES AND QUOTES ARE MISSING. The video titles are "RUQ 2025 Testimonial 1"
// through 15 — useless as captions. The women are identifiable in the frames
// and wearing name badges, but reading a badge off a video still is not a
// source I will caption a real person from. Any option that shows a name or a
// pull quote uses visibly marked placeholder text; the client has to supply
// first names and one line each.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
const TINT = '#fdeaf5';      // magenta-tint — the founder section below
const DARK = '#141414';

const poster = (id) => `/assets/posters/${id}.jpg`;
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// Client copy, verbatim from the live page.
const HEADING = 'What Women Have Experienced at Rise Up Queens';

export const TESTIMONIAL_OPTIONS = {
  stage: {
    label: 'Stage — the dark carries through, one film at a time',
    flow: 'Keeps the creed band’s dark ground instead of cutting to white, so the arch reads as the dark narrowing rather than ending. Fades to the pink of the founder section at the bottom.',
    note: 'One large player centre stage under a soft brand bloom, with the rest as a filmstrip beneath it that scroll-snaps. Cinema rather than gallery. The only option where the testimonies feel like an event you are sitting in.',
    needsDarkAbove: true,
  },
  marquee: {
    label: 'Marquee — two rails drifting in opposite directions',
    flow: 'Returns to white, with a soft brand wash across the top that fills the curve the dome leaves behind.',
    note: 'Portrait crops on two continuously moving rails, upper drifting left, lower drifting right, both pausing when you point at them. The motion is the wow factor and it never stops, so the section is alive before anyone clicks. Honours prefers-reduced-motion.',
  },
  mosaic: {
    label: 'Mosaic — an asymmetric editorial grid',
    flow: 'White, with the heading block set against the dome so the curve becomes part of the composition rather than a seam.',
    note: 'One large tile carries the compilation, the rest fall into deliberately uneven spans. Tiles sit muted and lift to full colour as you move across them. Reads as a magazine spread of stills, not a row of video boxes.',
  },
  coverflow: {
    label: 'Coverflow — a carousel, done properly',
    flow: 'White, with a thin brand rail directly under the dome acting as the join.',
    note: 'The live site already has a carousel; this is what it should look like. Centre card at full size, its neighbours scaled back and dimmed either side, a progress rail instead of a row of dots. Closest to what is there now, which makes it the easiest to sign off.',
  },
  wall: {
    label: 'Wall — testimony stacked like a noticeboard',
    flow: 'White, and the top row is staggered so nothing lines up hard against the curve.',
    note: 'A masonry wall of frames at mixed heights with typographic quote cards dropped in among them. The volume is the point: it looks like many women, not six. Needs one line of copy per quote card.',
  },
  theatre: {
    label: 'Theatre — a player that stays put, an index beside it',
    flow: 'The dark continues down the left half only, so the band above resolves into the player panel and the right half opens to white.',
    note: 'Large player pinned on the left while a numbered index of every testimony scrolls past on the right. Click any line and the player swaps. The only option that makes all ten watchable without scrolling back, and the most product-like of the six.',
    needsDarkAbove: true,
  },
};

// ---------------------------------------------------------------- helpers

const homeTestimonials = (vids) =>
  vids.wistia.filter(v => v.page === 'home' && /Testimonial/i.test(v.title));

// Every option renders play affordances through these two, so a change to the
// hit target or the focus ring lands everywhere at once.
const playGlyph = (size = 'h-16 w-16', fill = MAGENTA) => `
<span aria-hidden="true" class="flex ${size} items-center justify-center rounded-full bg-white/95 shadow-[0_10px_30px_-8px_rgba(0,0,0,.6)] transition group-hover:scale-110">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="${fill}"><path d="M8 5v14l11-7z"/></svg>
</span>`;

const facade = (v, inner, cls = '') => `
<button type="button" class="video-facade group relative block w-full overflow-hidden ${cls}"
        data-provider="wistia" data-id="${esc(v.id)}" data-title="${esc(v.title)}">
  <span class="sr-only">Play ${esc(v.title)}</span>
  ${inner}
</button>`;

const img = (v, cls) => `
<img src="${poster(v.id)}" alt="" aria-hidden="true" loading="lazy" decoding="async"
     class="${cls}">`;

const duration = (v) => v.seconds
  ? `<span class="rounded-full bg-black/60 px-2 py-0.5 font-body text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">${fmt(v.seconds)}</span>`
  : '';

// Placeholder marker. Deliberately ugly so it cannot ship by accident.
const PLACEHOLDER = `<span class="ml-2 rounded bg-amber-300 px-1.5 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide text-black">placeholder copy</span>`;

// ----------------------------------------------------------------- stage

const stage = (vids) => {
  const list = homeTestimonials(vids);
  const [featured, ...rest] = list;

  return `
<section class="relative" style="background:${DARK}">

  <div class="relative mx-auto max-w-content px-4 pb-24 pt-20">
    <p class="text-center font-body text-[11px] font-bold uppercase tracking-[0.4em]" style="color:${CYAN}">In their own words</p>
    <h2 class="mx-auto mt-4 max-w-3xl text-center font-display text-3xl font-bold leading-tight text-white sm:text-[2.6rem]">${esc(HEADING)}</h2>

    <!-- Bloom sits behind the player only, not the whole section: a wash
         across the full width would grey the dark ground and lose the stage. -->
    <div class="relative mx-auto mt-12 max-w-4xl">
      <div aria-hidden="true" class="pointer-events-none absolute -inset-x-16 -inset-y-12 blur-3xl"
           style="background:radial-gradient(60% 60% at 30% 40%,rgba(232,32,143,.30),transparent 70%),radial-gradient(60% 60% at 72% 62%,rgba(0,185,198,.30),transparent 70%)"></div>
      ${facade(featured, `
      <span class="relative block aspect-video w-full">
        ${img(featured, 'absolute inset-0 h-full w-full object-cover')}
        <span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.55),transparent 55%)"></span>
        <span class="absolute inset-0 flex items-center justify-center">${playGlyph('h-20 w-20')}</span>
      </span>`, 'relative rounded-2xl ring-1 ring-white/15 shadow-[0_50px_120px_-40px_rgba(0,0,0,.9)]')}
    </div>

    <!-- Filmstrip. scroll-snap rather than a carousel: no JS, no state, and a
         trackpad or a thumb already knows how to drive it. -->
    <div class="mt-10">
      <div class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
           style="scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.25) transparent">
        ${rest.map(v => facade(v, `
        <span class="relative block aspect-video w-full">
          ${img(v, 'absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-100')}
          <span class="absolute inset-0 flex items-center justify-center">${playGlyph('h-10 w-10')}</span>
          <span class="absolute bottom-2 right-2">${duration(v)}</span>
        </span>`, 'w-[260px] shrink-0 snap-start rounded-xl ring-1 ring-white/12')).join('')}
      </div>
    </div>
  </div>

  <!-- Resolves into the pink of the founder section rather than stopping dead
       on it, which is the same join the top of this section now avoids. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-28"
       style="background:linear-gradient(to top,${TINT},rgba(253,234,245,0))"></div>
</section>`;
};

// --------------------------------------------------------------- marquee

const marquee = (vids) => {
  const list = homeTestimonials(vids);
  const half = Math.ceil(list.length / 2);
  const rails = [list.slice(0, half), list.slice(half)];

  // mr-5 on each card rather than gap-5 on the track. With a track gap, N
  // cards duplicated gives 2N-1 gaps, so -50% of the track lands half a gap
  // short of one full set and the loop visibly jumps 10px every cycle.
  // Carrying the spacing on the card makes each set exactly half the track.
  const card = (v, dupe = false) => facade(v, `
    <span class="relative block aspect-[4/5] w-full">
      ${img(v, 'absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105')}
      <span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.6),transparent 50%)"></span>
      <span class="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">${playGlyph('h-14 w-14')}</span>
      <span class="absolute bottom-3 left-3">${duration(v)}</span>
    </span>`, 'mr-5 w-[230px] shrink-0 rounded-2xl ring-1 ring-ink/10 shadow-[0_18px_40px_-24px_rgba(0,0,0,.6)]')
    // The second set exists only so the loop has something to run into. It is
    // the same ten videos, so it is hidden from assistive tech and taken out
    // of the tab order instead of being announced and tabbed through twice.
    .replace('<button type="button"', dupe ? '<button type="button" aria-hidden="true" tabindex="-1"' : '<button type="button"');

  const rail = (items, dir, seconds) => `
  <div class="ruq-rail group/rail relative overflow-hidden">
    <div class="ruq-track flex w-max" style="animation:ruq-${dir} ${seconds}s linear infinite">
      ${items.map(v => card(v)).join('')}${items.map(v => card(v, true)).join('')}
    </div>
  </div>`;

  return `
<section class="relative overflow-hidden bg-white pb-20 pt-16">

  <style>
    @keyframes ruq-left  { from { transform: translate3d(0,0,0); }    to { transform: translate3d(-50%,0,0); } }
    @keyframes ruq-right { from { transform: translate3d(-50%,0,0); } to { transform: translate3d(0,0,0); } }
    .ruq-rail:hover .ruq-track, .ruq-rail:focus-within .ruq-track { animation-play-state: paused; }
    @media (prefers-reduced-motion: reduce) {
      .ruq-track { animation: none !important; }
      .ruq-rail  { overflow-x: auto; }
    }
  </style>

  <!-- Fills the space the dome above leaves open, so the curve lands in a wash
       rather than on bare white. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-48"
       style="background:radial-gradient(70% 100% at 50% 0%,rgba(232,32,143,.14),transparent 70%),radial-gradient(50% 80% at 85% 0%,rgba(0,185,198,.14),transparent 70%)"></div>

  <div class="relative mx-auto max-w-content px-4">
    <h2 class="max-w-3xl font-display text-3xl font-bold leading-tight text-ink sm:text-[2.6rem]">
      What women have <span class="script align-baseline" style="color:${MAGENTA};font-size:1.35em;line-height:.8">experienced</span><br>at Rise Up Queens
    </h2>
    <p class="mt-4 font-body text-ink-soft">Ten testimonies from the 2025 events. Point at a rail to hold it still.</p>
  </div>

  <div class="relative mt-12 space-y-5">
    ${rail(rails[0], 'left', 64)}
    ${rail(rails[1], 'right', 72)}
  </div>

  <!-- Rails run edge to edge; without these they appear to stop mid-air at the
       viewport boundary. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-0 w-24" style="background:linear-gradient(to right,#fff,rgba(255,255,255,0))"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-0 w-24" style="background:linear-gradient(to left,#fff,rgba(255,255,255,0))"></div>
</section>`;
};

// ---------------------------------------------------------------- mosaic

const mosaic = (vids) => {
  const list = homeTestimonials(vids);
  const [hero, ...rest] = list;

  // Spans chosen so no two adjacent tiles share a shape. A uniform grid is the
  // thing this option exists to avoid.
  const spans = [
    'sm:col-span-6 lg:col-span-4', 'sm:col-span-6 lg:col-span-4',
    'sm:col-span-6 lg:col-span-5', 'sm:col-span-6 lg:col-span-3',
    'sm:col-span-4 lg:col-span-4', 'sm:col-span-4 lg:col-span-4',
    'sm:col-span-4 lg:col-span-4', 'sm:col-span-6 lg:col-span-5',
    'sm:col-span-6 lg:col-span-7',
  ];

  const tile = (v, span, ratio) => `
  <div class="col-span-12 ${span}">
    ${facade(v, `
    <span class="relative block ${ratio} w-full">
      ${img(v, 'absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]')}
      <span aria-hidden="true" class="absolute inset-0 bg-ink/35 transition group-hover:bg-ink/10"></span>
      <span class="absolute inset-0 flex items-center justify-center">${playGlyph('h-12 w-12')}</span>
      <span class="absolute bottom-3 right-3">${duration(v)}</span>
    </span>`, 'rounded-2xl ring-1 ring-ink/10')}
  </div>`;

  return `
<section class="relative bg-white pb-24 pt-16">
  <div class="mx-auto max-w-content px-4">

    <div class="flex flex-wrap items-end justify-between gap-6">
      <h2 class="max-w-2xl font-display text-3xl font-bold leading-tight text-ink sm:text-[2.6rem]">${esc(HEADING)}</h2>
      <div class="flex items-center gap-3">
        <span aria-hidden="true" class="h-0.5 w-14 rounded-full" style="background:linear-gradient(to right,transparent,${MAGENTA})"></span>
        <span class="font-body text-[11px] font-bold uppercase tracking-[0.35em] text-ink-soft">2025 events</span>
        <span aria-hidden="true" class="h-0.5 w-14 rounded-full" style="background:linear-gradient(to left,transparent,${CYAN})"></span>
      </div>
    </div>

    <div class="mt-10 grid grid-cols-12 gap-4">
      <!-- The compilation leads: it is the longest and the only one that is
           not a single voice, so it earns the largest tile. -->
      <div class="col-span-12 lg:col-span-7">
        ${facade(hero, `
        <span class="relative block aspect-[16/10] w-full">
          ${img(hero, 'absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]')}
          <span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.6),transparent 55%)"></span>
          <span class="absolute inset-0 flex items-center justify-center">${playGlyph('h-20 w-20')}</span>
          <span class="absolute bottom-4 left-5 right-5 flex items-baseline justify-between gap-3">
            <span class="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">The compilation</span>
            ${duration(hero)}
          </span>
        </span>`, 'rounded-2xl ring-1 ring-ink/10')}
      </div>
      <div class="col-span-12 grid grid-cols-12 gap-4 lg:col-span-5">
        ${rest.slice(0, 2).map((v, i) => tile(v, 'col-span-6 lg:col-span-12', i === 0 ? 'aspect-[16/9]' : 'aspect-[16/9]')).join('')}
      </div>
      ${rest.slice(2).map((v, i) => tile(v, spans[i % spans.length], i % 3 === 1 ? 'aspect-[4/3]' : 'aspect-[16/10]')).join('')}
    </div>
  </div>
</section>`;
};

// ------------------------------------------------------------- coverflow

const coverflow = (vids) => {
  const list = homeTestimonials(vids);

  return `
<section class="relative overflow-hidden bg-white pb-20 pt-14">

  <!-- The join: a single brand rail directly under the dome. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 mx-auto h-0.5 w-48 rounded-full"
       style="background:linear-gradient(to right,transparent,${MAGENTA},${CYAN},transparent)"></div>

  <style>
    .cf-track { scroll-snap-type: x mandatory; scrollbar-width: none; }
    .cf-track::-webkit-scrollbar { display: none; }
    .cf-item { scroll-snap-align: center; transition: transform .45s ease, opacity .45s ease, filter .45s ease; }
    .cf-item:not(.is-active) { transform: scale(.82); opacity: .45; filter: saturate(.6); }
    @media (prefers-reduced-motion: reduce) { .cf-item { transition: none; } }
  </style>

  <div class="mx-auto max-w-content px-4 text-center">
    <h2 class="mx-auto max-w-3xl font-display text-3xl font-bold leading-tight text-ink sm:text-[2.6rem]">${esc(HEADING)}</h2>
  </div>

  <div class="relative mt-10">
    <div class="cf-track flex items-center gap-6 overflow-x-auto px-[calc(50%-300px)] py-6">
      ${list.map((v, i) => `
      <div class="cf-item w-[600px] max-w-[82vw] shrink-0${i === 0 ? ' is-active' : ''}" data-cf>
        ${facade(v, `
        <span class="relative block aspect-video w-full">
          ${img(v, 'absolute inset-0 h-full w-full object-cover')}
          <span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.45),transparent 60%)"></span>
          <span class="absolute inset-0 flex items-center justify-center">${playGlyph('h-16 w-16')}</span>
          <span class="absolute bottom-3 right-3">${duration(v)}</span>
        </span>`, 'rounded-2xl ring-1 ring-ink/10 shadow-[0_30px_70px_-30px_rgba(0,0,0,.55)]')}
      </div>`).join('')}
    </div>

    <button type="button" data-cf-prev aria-label="Previous testimony"
            class="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 ring-1 ring-ink/15 backdrop-blur transition hover:ring-magenta sm:flex">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="2" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
    </button>
    <button type="button" data-cf-next aria-label="Next testimony"
            class="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 ring-1 ring-ink/15 backdrop-blur transition hover:ring-magenta sm:flex">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
    </button>
  </div>

  <!-- A rail rather than dots: ten dots is a row of specks that says nothing
       about how far through you are. -->
  <div class="mx-auto mt-6 h-1 w-56 overflow-hidden rounded-full bg-ink/10">
    <div data-cf-bar class="h-full w-1/6 rounded-full transition-[width,margin] duration-300"
         style="background:linear-gradient(to right,${MAGENTA},${CYAN})"></div>
  </div>

  <script>
  (function () {
    var track = document.currentScript.closest('section').querySelector('.cf-track');
    var items = [].slice.call(track.querySelectorAll('[data-cf]'));
    var bar = document.currentScript.closest('section').querySelector('[data-cf-bar]');
    if (!track || !items.length) return;

    // IntersectionObserver against the track, not a scroll listener: the
    // active card is whichever is nearest the centre, and the observer
    // already reports that without running on every frame.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.intersectionRatio > 0.75) {
          items.forEach(function (n) { n.classList.remove('is-active'); });
          e.target.classList.add('is-active');
          var i = items.indexOf(e.target);
          bar.style.width = (100 / items.length) + '%';
          bar.style.marginLeft = (i * 100 / items.length) + '%';
        }
      });
    }, { root: track, threshold: [0.76] });
    items.forEach(function (n) { io.observe(n); });

    var step = function (d) {
      var i = items.findIndex(function (n) { return n.classList.contains('is-active'); });
      var next = items[Math.min(items.length - 1, Math.max(0, i + d))];
      if (next) next.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };
    var sec = document.currentScript.closest('section');
    sec.querySelector('[data-cf-prev]').addEventListener('click', function () { step(-1); });
    sec.querySelector('[data-cf-next]').addEventListener('click', function () { step(1); });
  })();
  </script>
</section>`;
};

// ------------------------------------------------------------------ wall

const wall = (vids) => {
  const list = homeTestimonials(vids);

  const quote = (text, bg, fg) => `
  <figure class="mb-4 break-inside-avoid rounded-2xl p-7" style="background:${bg};color:${fg}">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="opacity-40"><path d="M7 7h5v5H9.5A2.5 2.5 0 0 0 7 14.5V17H4v-5a5 5 0 0 1 3-4.6V7Zm9 0h5v5h-2.5a2.5 2.5 0 0 0-2.5 2.5V17h-3v-5a5 5 0 0 1 3-4.6V7Z"/></svg>
    <blockquote class="mt-3 font-display text-xl font-semibold leading-snug">${esc(text)}</blockquote>
    <figcaption class="mt-4 font-body text-xs uppercase tracking-[0.2em] opacity-70">First name, city ${PLACEHOLDER}</figcaption>
  </figure>`;

  const tile = (v) => `
  <div class="mb-4 break-inside-avoid">
    ${facade(v, `
    <span class="relative block aspect-video w-full">
      ${img(v, 'absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]')}
      <span aria-hidden="true" class="absolute inset-0 bg-ink/25 transition group-hover:bg-ink/5"></span>
      <span class="absolute inset-0 flex items-center justify-center">${playGlyph('h-12 w-12')}</span>
      <span class="absolute bottom-3 right-3">${duration(v)}</span>
    </span>`, 'rounded-2xl ring-1 ring-ink/10')}
  </div>`;

  // Quotes are dropped at fixed positions so the wall does not run as three
  // unbroken columns of stills.
  const QUOTES = [
    ['I walked in carrying things I had never said out loud, and I did not walk out with them.', TINT, '#1c1c1c'],
    ['I stopped apologising for who God made me.', MAGENTA, '#ffffff'],
    ['I came for a weekend. I left with sisters.', '#e5f8fa', '#1c1c1c'],
  ];

  const items = [];
  list.forEach((v, i) => {
    items.push(tile(v));
    if (i === 1) items.push(quote(...QUOTES[0]));
    if (i === 4) items.push(quote(...QUOTES[1]));
    if (i === 7) items.push(quote(...QUOTES[2]));
  });

  return `
<section class="relative bg-white pb-24 pt-16">
  <div class="mx-auto max-w-content px-4">

    <div class="max-w-3xl">
      <p class="font-body text-[11px] font-bold uppercase tracking-[0.4em]" style="color:${MAGENTA}">Ten voices</p>
      <h2 class="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-[2.6rem]">${esc(HEADING)}</h2>
    </div>

    <div class="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 font-body text-xs text-ink">
      The three quote cards are written by me as stand-ins. Real lines have to come from the client — or the cards come out.
    </div>

    <!-- CSS columns, not a grid: the tiles are different heights and a grid
         would leave gaps under the short ones. -->
    <div class="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
      ${items.join('')}
    </div>
  </div>
</section>`;
};

// --------------------------------------------------------------- theatre

const theatre = (vids) => {
  const list = homeTestimonials(vids);
  const first = list[0];

  return `
<section class="relative bg-white">

  <!-- The dark runs down the left half only, so the band above resolves into
       the player panel instead of stopping across the full width. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 lg:block" style="background:${DARK}"></div>

  <div class="relative mx-auto grid max-w-content gap-0 px-0 lg:grid-cols-[7fr_5fr]">

    <div class="px-4 py-16 lg:px-10" style="background:${DARK}">
      <!-- sticky, and nothing above it may clip: an overflow-hidden ancestor
           silently turns this back into a static block. -->
      <div class="lg:sticky lg:top-24">
        <p class="font-body text-[11px] font-bold uppercase tracking-[0.4em]" style="color:${CYAN}">Now playing</p>
        <div class="mt-5 overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)]">
          <div data-th-stage>
            ${facade(first, `
            <span class="relative block aspect-video w-full">
              ${img(first, 'absolute inset-0 h-full w-full object-cover')}
              <span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.5),transparent 60%)"></span>
              <span class="absolute inset-0 flex items-center justify-center">${playGlyph('h-20 w-20')}</span>
            </span>`)}
          </div>
        </div>
        <p data-th-title class="mt-4 font-display text-lg font-semibold text-white">${esc(first.title)}</p>
      </div>
    </div>

    <div class="px-4 py-16 lg:px-10">
      <h2 class="font-display text-3xl font-bold leading-tight text-ink sm:text-[2.4rem]">${esc(HEADING)}</h2>
      <p class="mt-4 font-body text-ink-soft">Ten testimonies from the 2025 events. Pick any one.</p>

      <ol class="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        ${list.map((v, i) => `
        <li>
          <button type="button" data-th-pick data-id="${esc(v.id)}" data-title="${esc(v.title)}" data-poster="${poster(v.id)}"
                  class="group flex w-full items-center gap-4 py-4 text-left transition hover:bg-ink/[.03]">
            <span aria-hidden="true" class="w-7 shrink-0 font-body text-sm font-bold tabular-nums" style="color:${MAGENTA}">${String(i + 1).padStart(2, '0')}</span>
            <span class="relative h-12 w-20 shrink-0 overflow-hidden rounded-md ring-1 ring-ink/10">
              ${img(v, 'absolute inset-0 h-full w-full object-cover')}
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate font-body text-sm font-semibold text-ink">A testimony from 2025 ${PLACEHOLDER}</span>
              <span class="block font-body text-xs text-ink-soft">${v.seconds ? fmt(v.seconds) : ''}</span>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
                 class="shrink-0 text-ink-soft transition group-hover:translate-x-1 group-hover:text-magenta"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </li>`).join('')}
      </ol>
    </div>
  </div>

  <script>
  (function () {
    var sec = document.currentScript.closest('section');
    var st = sec.querySelector('[data-th-stage]');
    var tl = sec.querySelector('[data-th-title]');
    sec.querySelectorAll('[data-th-pick]').forEach(function (b) {
      b.addEventListener('click', function () {
        // Rebuild the facade rather than swapping an iframe src: the visitor
        // has not asked for a third-party player yet, and picking a different
        // testimony is not that request.
        st.innerHTML = '<button type="button" class="video-facade group relative block w-full overflow-hidden"'
          + ' data-provider="wistia" data-id="' + b.dataset.id + '" data-title="' + b.dataset.title + '">'
          + '<span class="sr-only">Play ' + b.dataset.title + '</span>'
          + '<span class="relative block aspect-video w-full">'
          + '<img src="' + b.dataset.poster + '" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover">'
          + '<span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.5),transparent 60%)"></span>'
          + '<span class="absolute inset-0 flex items-center justify-center">'
          + '<span class="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-110">'
          + '<svg width="24" height="24" viewBox="0 0 24 24" fill="${MAGENTA}"><path d="M8 5v14l11-7z"/></svg>'
          + '</span></span></span></button>';
        tl.textContent = b.dataset.title;
      });
    });
  })();
  </script>
</section>`;
};

// ----------------------------------------------------------------- render

const RENDER = { stage, marquee, mosaic, coverflow, wall, theatre };

export const renderTestimonials = (site, c, vids, key) => (RENDER[key] ?? stage)(vids);

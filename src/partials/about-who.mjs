// About, second section: "Who is it for?" with the What-is-RUQ interview.
//
// Six ways to lay it out. All six share the same shell, which is the one the
// homepage uses under its hero:
//
//   - arched top, rounded-t-[2.5rem], lifted over the hero with -mt-16
//   - the drag-handle pill centred on the top edge
//   - the spread's warm ground and its two blurred brand orbs
//
// so the about page reads as the same site rather than a page that happens to
// share a palette. What differs between the options is where the video sits
// against that arch, and how far it is allowed to break out of it.
//
// One trap shapes half of them. The homepage wrapper carries overflow-hidden
// to clip the arch, and anything overlapping the arch gets clipped with it.
// Options that break the video out of the panel therefore move the clipping
// onto a decoration-only layer and leave the content unclipped — the same
// thing that had to be done for the orbs and for position: sticky elsewhere.
//
// Copy is verbatim from riseupqueens.com/about/, including "Rise up Queens"
// with a lowercase u, which is theirs and is probably a typo.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
const GROUND = 'linear-gradient(180deg,#ffffff,#FDF6F1 55%,#ffffff)';

export const ABOUT_WHO_OPTIONS = {
  copyOnly: {
    label: 'Copy only — what ships now',
    note: 'The video has moved into the hero, so this is the paragraph in the arch and nothing else. A holding state until its content is decided, not a design decision. The five below are the layouts explored while the video was here, and any of them works again the moment something goes back beside the copy.',
  },

  split: {
    label: 'Split — copy left, video right',
    note: 'The live arrangement, rebuilt inside the arch. Two equal columns, video in a plate with the brand offset block behind it. The safest option and the one the client will recognise immediately.',
  },
  breakout: {
    label: 'Breakout — the video overlaps the arch',
    note: 'The video plate sits proud of the rounded top edge, overlapping the hero above it exactly as the struggles plates overlap their boundary on the homepage. The only option where the arch and the content are doing something together rather than one sitting inside the other.',
  },
  bleed: {
    label: 'Bleed — the video runs off the right edge',
    note: 'Copy stays in the container, the video runs past the right edge of the page and is cut by the viewport. Editorial and wide; makes a 30-minute interview feel like the main event rather than an illustration.',
  },
  cinema: {
    label: 'Cinema — centred, the homepage VSL treatment',
    note: 'Heading and copy centred above, the video below at full container width with the cyan bloom and letterbox framing from the homepage VSL. Ties the two videos on the site together, and gives the longest read the most room.',
  },
  overlay: {
    label: 'Overlay — the copy on a card over the video',
    note: 'The video runs wide and a floating card of copy overlaps its left edge. The most designed of the six. Needs the copy to stay short, which here it does.',
  },
  stack: {
    label: 'Stack — video first, copy beneath',
    note: 'Video across the top of the panel, heading and copy under it in two columns. Puts the interview first, which is arguably right on a page whose job is explaining what this is. Shortest of the six.',
  },
};

// --------------------------------------------------------------- pieces

const poster = (id) => `/assets/posters/${id}.jpg`;

// Click-to-load. No third-party player until the visitor asks for one — the
// same contract as every other video on the site.
const facade = (id, title, cls, ratio = 'aspect-video') => `
<button type="button" class="video-facade group relative block w-full overflow-hidden ${cls}"
        data-provider="wistia" data-id="${esc(id)}" data-title="${esc(title)}">
  <span class="sr-only">Play ${esc(title)}</span>
  <span class="relative block ${ratio} w-full">
    <img src="${poster(id)}" alt="" aria-hidden="true" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover">
    <span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.45),transparent 55%)"></span>
    <span class="absolute inset-0 flex items-center justify-center">
      <span class="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-[0_12px_34px_-10px_rgba(0,0,0,.6)] transition group-hover:scale-110">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="${MAGENTA}"><path d="M8 5v14l11-7z"/></svg>
      </span>
    </span>
  </span>
</button>`;

// The plate: image with an offset brand block behind it, as spread.mjs uses.
const plate = (inner, colour = MAGENTA) => `
<div class="relative">
  <div aria-hidden="true" class="absolute -bottom-4 -right-4 h-full w-full rounded-[1.75rem]"
       style="background:${colour}1f"></div>
  ${inner}
</div>`;

const copy = (c, align = 'left') => `
<div class="${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}">
  <h2 class="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">${esc(c.about.heading)}</h2>
  <p class="mt-5 font-body text-lg leading-relaxed text-ink-soft">${esc(c.about.lead)}</p>
</div>`;

const orbs = `
<div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
  <div class="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full blur-3xl"
       style="background:radial-gradient(circle,rgba(232,32,143,.12),transparent 68%)"></div>
  <div class="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl"
       style="background:radial-gradient(circle,rgba(0,185,198,.10),transparent 68%)"></div>
</div>`;

// The arch. `clipped` false moves overflow-hidden off the wrapper and onto a
// decoration layer, so content can sit proud of the rounded edge.
const arch = (inner, clipped = true) => clipped ? `
<div class="relative z-10 -mt-16 overflow-hidden rounded-t-[2.5rem] shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)]
            before:absolute before:left-1/2 before:top-4 before:z-20 before:h-1.5 before:w-16
            before:-translate-x-1/2 before:rounded-full before:bg-ink/15"
     style="background:${GROUND}">
  ${orbs}
  <div class="relative">${inner}</div>
</div>` : `
<!-- Unclipped. The arch and the ground are painted by the layer below, which
     is the only thing carrying overflow-hidden; the content sits above it and
     can overlap the rounded edge without being cut. -->
<div class="relative z-10 -mt-16">
  <div aria-hidden="true" class="absolute inset-0 overflow-hidden rounded-t-[2.5rem] shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)]"
       style="background:${GROUND}">
    ${orbs}
  </div>
  <span aria-hidden="true" class="absolute left-1/2 top-4 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-ink/15"></span>
  <div class="relative">${inner}</div>
</div>`;

// --------------------------------------------------------------- options

const RENDER = {
  // What ships today. The video moved up into the hero, so this is the copy in
  // the arch with nothing beside it — a holding state, not a design decision.
  // Centred rather than left-aligned, because a single column of text pinned
  // to the left of an empty panel reads as something having gone missing.
  copyOnly: (site, c) => arch(`
    <div class="mx-auto max-w-content px-6 py-24">
      ${copy(c, 'center')}
    </div>`),


  split: (site, c) => arch(`
    <div class="mx-auto grid max-w-content items-center gap-12 px-6 py-24 lg:grid-cols-2">
      ${copy(c)}
      ${plate(facade(c.about.whoForVideo, 'What is Rise Up Queens?',
        'rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]'))}
    </div>`),

  breakout: (site, c) => arch(`
    <div class="mx-auto grid max-w-content items-center gap-12 px-6 pb-24 lg:grid-cols-2">
      <div class="pt-24">${copy(c)}</div>
      <!-- -mt-24 lifts the plate over the arch. It only survives because the
           wrapper is not the thing clipping. -->
      <div class="-mt-24 lg:-mt-28">
        ${plate(facade(c.about.whoForVideo, 'What is Rise Up Queens?',
          'rounded-[1.75rem] ring-1 ring-white/60 shadow-[0_40px_80px_-30px_rgba(28,28,28,.6)]'))}
      </div>
    </div>`, false),

  bleed: (site, c) => arch(`
    <div class="grid items-center gap-12 py-24 lg:grid-cols-[1fr_1.15fr]">
      <div class="mx-auto w-full max-w-content px-6 lg:mx-0 lg:ml-auto lg:max-w-none lg:pl-[max(1.5rem,calc((100vw-72rem)/2))] lg:pr-0">
        ${copy(c)}
      </div>
      <!-- Runs past the right edge and is cut by the viewport, not by a
           container: rounded on the left only, square where it leaves. -->
      <div class="px-6 lg:px-0">
        ${facade(c.about.whoForVideo, 'What is Rise Up Queens?',
          'rounded-[1.75rem] lg:rounded-r-none shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]')}
      </div>
    </div>`),

  cinema: (site, c) => arch(`
    <div class="mx-auto max-w-content px-6 py-24">
      ${copy(c, 'center')}
      <div class="relative mx-auto mt-14 max-w-4xl">
        <div aria-hidden="true" class="vsl-bloom pointer-events-none absolute -inset-x-24 -inset-y-16 -z-10 blur-3xl"
             style="background:radial-gradient(50% 50% at 50% 50%,rgba(0,185,198,.28),transparent 74%)"></div>
        ${facade(c.about.whoForVideo, 'What is Rise Up Queens?',
          'ring-1 ring-cyan/40 shadow-[0_0_90px_-20px_rgba(0,185,198,.42),0_40px_90px_-45px_rgba(28,28,28,.5)]',
          '[aspect-ratio:2.39/1]')}
      </div>
    </div>`),

  overlay: (site, c) => arch(`
    <div class="mx-auto max-w-content px-6 py-24">
      <div class="relative">
        <div class="lg:ml-[26%]">
          ${facade(c.about.whoForVideo, 'What is Rise Up Queens?',
            'rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]')}
        </div>
        <!-- Static below lg: a card overlapping a video is unreadable once the
             two are the same width. -->
        <div class="mt-6 rounded-2xl bg-white/95 p-8 shadow-[0_30px_70px_-30px_rgba(28,28,28,.5)] ring-1 ring-ink/10
                    backdrop-blur lg:absolute lg:left-0 lg:top-1/2 lg:mt-0 lg:w-[46%] lg:-translate-y-1/2 lg:p-10">
          ${copy(c)}
        </div>
      </div>
    </div>`),

  stack: (site, c) => arch(`
    <div class="mx-auto max-w-content px-6 py-20">
      ${plate(facade(c.about.whoForVideo, 'What is Rise Up Queens?',
        'rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]'), CYAN)}
      <div class="mt-14 grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-start">
        <h2 class="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">${esc(c.about.heading)}</h2>
        <p class="font-body text-lg leading-relaxed text-ink-soft">${esc(c.about.lead)}</p>
      </div>
    </div>`),
};

export const renderAboutWho = (site, c, key) => (RENDER[key] ?? RENDER.split)(site, c);

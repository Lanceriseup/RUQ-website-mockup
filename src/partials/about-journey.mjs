// About, second section: "The journey doesn't end after the first event…"
//
// Replaces "Who is it for?". Six treatments, all light — the live version is
// white type on black marble, and inverting it is the point of the exercise.
//
// Heading, two lead paragraphs and three cards, all verbatim and with their
// mixed apostrophes intact. The closing line that follows the cards on the
// live page is no longer rendered — removed on request; it is still in
// content.json.
//
// All six share the arch shell the homepage uses under its hero, so the page
// reads as the same site: rounded-t-[2.5rem], -mt-16 over the hero, the
// drag-handle pill, and the spread's warm ground with its two brand orbs.
//
// The photographs are the constraint worth naming. The live page runs them in
// greyscale on black, where a mono treatment reads as deliberate. On a light
// ground mono reads as missing colour instead, so most options below let them
// keep it — the ones that do desaturate say why.
import { esc } from './layout.mjs';
import { renderJourneyHeading } from './journey-headings.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
const GROUND = 'linear-gradient(180deg,#ffffff,#FDF6F1 55%,#ffffff)';

export const JOURNEY_OPTIONS = {
  plates: {
    label: 'Plates — photographs on offset brand blocks',
    note: 'The three images as plates with a magenta or cyan block sitting proud behind each, the same device the homepage spread uses for its photography. Full colour, generous space, copy beneath. The most consistent with the rest of the site.',
  },
  cardsLift: {
    label: 'Cards — white cards that lift off the ground',
    note: 'Each becomes a white card with the photograph filling its top, rising on a deeper shadow as you point at it. The most familiar shape of the six and the easiest to extend if a fourth thing is ever added.',
  },
  numbered: {
    label: 'Numbered — one, two, three',
    note: 'Large brand numerals set beside each photograph, so the three read as a sequence rather than a menu. The only option that says these happen in an order, which is what "the journey continues" actually means.',
  },
  overlap: {
    label: 'Overlap — copy on a card across the photograph',
    note: 'Each photograph runs tall with a white card overlapping its lower edge, carrying the title and the copy. Most designed of the six; the staggered heights stop three equal columns reading as a table.',
  },
  duotone: {
    label: 'Duotone — the photographs in brand colour',
    note: 'The images take a magenta-to-cyan duotone rather than the live page’s greyscale, so they are still unified but the treatment reads as chosen rather than as colour having gone missing. Clears to full colour under the pointer.',
  },
  timeline: {
    label: 'Timeline — a rule running through all three',
    note: 'A hairline runs across the section with each step hung off it, photograph above and copy below. Reads as a path rather than three boxes. Costs the least height of the six and the most explanation if the order ever changes.',
  },
};

// ------------------------------------------------------------------ parts

// Masked top and bottom. The wrapper clips at the section edges, and the
// cyan orb sits at bottom-0 still painting colour when it gets there — which
// rendered as a straight line across the page. Fading the layer out before
// either edge leaves the clip nothing to cut.
//
// Same fix as the testimonial rails. -webkit- first for Safari before 15.4.
const orbs = `
<div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden"
     style="-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 7%,#000 93%,transparent 100%);
            mask-image:linear-gradient(to bottom,transparent 0%,#000 7%,#000 93%,transparent 100%)">
  <div class="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full blur-3xl"
       style="background:radial-gradient(circle,rgba(232,32,143,.12),transparent 68%)"></div>
  <div class="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl"
       style="background:radial-gradient(circle,rgba(0,185,198,.10),transparent 68%)"></div>
</div>`;

// The wrapper does NOT clip. Only the decoration layer does.
//
// overflow-hidden on the wrapper is what the arch originally used to round its
// own top corners, and it clips everything else with them — including the
// closing ticket's rimGlow, whose halo reaches about 63px below the panel
// against 64px of padding. That produced a straight line across the page at
// the foot of the section.
//
// Painting the ground and the orbs on an absolutely positioned layer keeps the
// rounded top and the orb clipping, while letting content and its shadows
// spill past the bottom edge and fade onto the page below.
const arch = (inner) => `
<div class="relative z-10 -mt-16">
  <div aria-hidden="true"
       class="absolute inset-0 overflow-hidden rounded-t-[2.5rem] shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)]"
       style="background:${GROUND}">
    ${orbs}
  </div>
  <span aria-hidden="true" class="absolute left-1/2 top-4 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-ink/15"></span>
  <div class="relative">${inner}</div>
</div>`;

// The heading treatment is a second lever — see journey-headings.mjs.
const head = (c, headingKey) => `
<div class="mx-auto max-w-3xl text-center">
  ${renderJourneyHeading(headingKey)}
  ${c.about.journey.lead.map(p => `<p class="mt-5 font-body text-lg leading-relaxed text-ink-soft">${esc(p)}</p>`).join('')}
</div>`;

// The third card carries a link inside its sentence. Matched on the phrase so
// that if the copy is ever edited it simply renders unlinked rather than
// breaking.
const bodyHtml = (card) => {
  const t = esc(card.body);
  if (!card.linkText) return t;
  const phrase = esc(card.linkText);
  const i = t.indexOf(phrase);
  if (i < 0) return t;
  return t.slice(0, i) +
    `<a href="${esc(card.linkUrl)}" rel="noopener" class="font-semibold underline decoration-2 underline-offset-4 transition hover:opacity-70" style="color:#00838d">${phrase}</a>` +
    t.slice(i + phrase.length);
};

// Removed on request. journey.close is still in content.json — it is their
// copy, taken off their live page, and dropping it from the data would lose
// it. Nothing renders it.
const closeLine = () => '';

const img = (card, cls) => `
<img src="${esc(card.photo)}" alt="" aria-hidden="true" width="900" height="700" loading="lazy" decoding="async" class="${cls}">`;

// ---------------------------------------------------------------- options

const RENDER = {
  plates: (site, c, headingKey, extra) => arch(`
    <div class="mx-auto max-w-content px-6 py-24">
      ${head(c, headingKey)}
      <div class="mt-16 grid gap-10 md:grid-cols-3">
        ${c.about.journey.cards.map((card, i) => `
        <article>
          <div class="relative">
            <div aria-hidden="true" class="absolute -bottom-3 -right-3 h-full w-full rounded-[1.5rem]"
                 style="background:${i === 1 ? CYAN : MAGENTA}1f"></div>
            <div class="relative overflow-hidden rounded-[1.5rem]">
              ${img(card, 'aspect-[4/3] w-full object-cover')}
            </div>
          </div>
          <h3 class="mt-7 font-display text-xl font-bold text-ink">${esc(card.title)}</h3>
          <p class="mt-3 font-body text-[15px] leading-relaxed text-ink-soft">${bodyHtml(card)}</p>
        </article>`).join('')}
      </div>
      ${closeLine(c)}
    </div>
    ${extra}`),

  cardsLift: (site, c, headingKey, extra) => arch(`
    <div class="mx-auto max-w-content px-6 py-24">
      ${head(c, headingKey)}
      <div class="mt-16 grid gap-7 md:grid-cols-3">
        ${c.about.journey.cards.map(card => `
        <article class="group overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-30px_rgba(28,28,28,.45)] ring-1 ring-ink/[.07]
                        transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_36px_70px_-30px_rgba(28,28,28,.5)]">
          <div class="overflow-hidden">
            ${img(card, 'aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]')}
          </div>
          <div class="p-7">
            <h3 class="font-display text-xl font-bold text-ink">${esc(card.title)}</h3>
            <p class="mt-3 font-body text-[15px] leading-relaxed text-ink-soft">${bodyHtml(card)}</p>
          </div>
        </article>`).join('')}
      </div>
      ${closeLine(c)}
    </div>
    ${extra}`),

  numbered: (site, c, headingKey, extra) => arch(`
    <div class="mx-auto max-w-content px-6 py-24">
      ${head(c, headingKey)}
      <div class="mt-16 grid gap-12 md:grid-cols-3">
        ${c.about.journey.cards.map((card, i) => `
        <article>
          <div class="flex items-start gap-5">
            <span aria-hidden="true" class="font-display text-5xl font-extrabold leading-none tabular-nums"
                  style="color:${MAGENTA}33">${String(i + 1).padStart(2, '0')}</span>
            <div class="min-w-0 flex-1 overflow-hidden rounded-xl">
              ${img(card, 'aspect-square w-full object-cover')}
            </div>
          </div>
          <h3 class="mt-6 font-display text-xl font-bold text-ink">${esc(card.title)}</h3>
          <p class="mt-3 font-body text-[15px] leading-relaxed text-ink-soft">${bodyHtml(card)}</p>
        </article>`).join('')}
      </div>
      ${closeLine(c)}
    </div>
    ${extra}`),

  overlap: (site, c, headingKey, extra) => arch(`
    <div class="mx-auto max-w-content px-6 py-24">
      ${head(c, headingKey)}
      <!-- Staggered: the middle column drops, so three equal columns stop
           reading as a table. Removed below md, where the offset would just
           look like uneven spacing. -->
      <div class="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-3">
        ${c.about.journey.cards.map((card, i) => `
        <article class="${i === 1 ? 'md:mt-14' : ''}">
          <div class="relative">
            <div class="overflow-hidden rounded-[1.5rem]">
              ${img(card, 'aspect-[3/4] w-full object-cover')}
            </div>
            <div class="relative mx-4 -mt-12 rounded-xl bg-white p-6 shadow-[0_24px_50px_-28px_rgba(28,28,28,.5)] ring-1 ring-ink/[.07]">
              <h3 class="font-display text-lg font-bold leading-tight text-ink">${esc(card.title)}</h3>
              <p class="mt-2.5 font-body text-[14px] leading-relaxed text-ink-soft">${bodyHtml(card)}</p>
            </div>
          </div>
        </article>`).join('')}
      </div>
      ${closeLine(c)}
    </div>
    ${extra}`),

  duotone: (site, c, headingKey, extra) => arch(`
    <div class="mx-auto max-w-content px-6 py-24">
      ${head(c, headingKey)}
      <div class="mt-16 grid gap-8 md:grid-cols-3">
        ${c.about.journey.cards.map(card => `
        <article class="group">
          <div class="relative overflow-hidden rounded-2xl" style="isolation:isolate">
            ${img(card, 'aspect-[4/3] w-full object-cover grayscale transition duration-500 group-hover:grayscale-0')}
            <!-- The tint lifts on hover with the greyscale, so the picture
                 arrives in full colour rather than in colour under a wash. -->
            <div aria-hidden="true" class="absolute inset-0 transition duration-500 group-hover:opacity-0"
                 style="background:linear-gradient(135deg,${MAGENTA},${CYAN});mix-blend-mode:color"></div>
          </div>
          <h3 class="mt-6 font-display text-xl font-bold text-ink">${esc(card.title)}</h3>
          <p class="mt-3 font-body text-[15px] leading-relaxed text-ink-soft">${bodyHtml(card)}</p>
        </article>`).join('')}
      </div>
      ${closeLine(c)}
    </div>
    ${extra}`),

  timeline: (site, c, headingKey, extra) => arch(`
    <div class="mx-auto max-w-content px-6 py-24">
      ${head(c, headingKey)}
      <div class="relative mt-16">
        <!-- The rule sits behind the markers and stops short of both ends, so
             it reads as a path between three points rather than a border. -->
        <div aria-hidden="true" class="absolute left-[16%] right-[16%] top-[calc(11rem+0.5rem)] hidden h-px md:block"
             style="background:linear-gradient(to right,transparent,rgba(232,32,143,.45),rgba(0,185,198,.45),transparent)"></div>
        <div class="grid gap-12 md:grid-cols-3">
          ${c.about.journey.cards.map((card, i) => `
          <article class="text-center">
            <div class="mx-auto h-44 w-44 overflow-hidden rounded-full ring-4 ring-white shadow-[0_20px_45px_-25px_rgba(28,28,28,.5)]">
              ${img(card, 'h-full w-full object-cover')}
            </div>
            <span aria-hidden="true" class="relative z-10 mx-auto mt-4 block h-4 w-4 rounded-full ring-4 ring-white"
                  style="background:${i === 1 ? CYAN : MAGENTA}"></span>
            <h3 class="mt-5 font-display text-xl font-bold text-ink">${esc(card.title)}</h3>
            <p class="mx-auto mt-3 max-w-xs font-body text-[15px] leading-relaxed text-ink-soft">${bodyHtml(card)}</p>
          </article>`).join('')}
        </div>
      </div>
      ${closeLine(c)}
    </div>
    ${extra}`),
};

// The extra slot renders INSIDE the arch, beneath the cards. Anything passed
// there sits on the journey’s own ground instead of opening a new section
// with a new background, which is what produced the visible seam.
export const renderJourney = (site, c, key, headingKey = 'current', extra = '') =>
  (RENDER[key] ?? RENDER.plates)(site, c, headingKey, extra);

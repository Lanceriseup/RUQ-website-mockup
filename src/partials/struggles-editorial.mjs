// Variants of the editorial struggles layout, on white.
//
// The layout is fixed — numbered lines in a wide column, sticky photograph in
// a narrow one. What changes is what surrounds it, because on pure white a
// two-column layout with nothing else in the frame reads as unfinished.
//
// The brand pattern asset was considered and rejected: it is a dark plaid
// built for dark grounds and turns to mud on white. These use light-ground
// devices instead — soft blooms, line geometry, layered imagery and real copy.
import { esc } from './layout.mjs';

export const EDITORIALS = {
  orbs: {
    label: 'Soft blooms — brand colour bleeding in from the edges',
    note: 'Large blurred magenta and cyan blooms sit off the edges at low opacity. Adds warmth and depth to white without putting anything literal in the frame. The quietest way to stop it looking bare.',
  },
  arcs: {
    label: 'Arcs — thin concentric lines the photo breaks through',
    note: 'Large hairline circles behind the image, which overlaps and interrupts them. Geometric and confident; the overlap is what makes it feel composed rather than decorated.',
  },
  duo: {
    label: 'Layered photographs — a second image offset behind',
    note: 'A smaller candid sits behind and below the main shot with a caption chip. Two images do more than one: it reads as coverage of an event rather than a single stock-looking picture.',
  },
  quote: {
    label: 'Pull quote — the client\'s own line floating over the image',
    note: 'A white card overlapping the photograph carrying "This is not surface-level empowerment." — real copy from their about page, not invented. Breaks the column edge and gives the eye a second place to land.',
  },
  frame: {
    label: 'Print frame — corner marks and hairline rules',
    note: 'Thin rules and registration-style corner marks bound the section like a printed page. The most editorial, and it adds structure without adding colour.',
  },
  dots: {
    label: 'Dot field — fine texture behind the numerals',
    note: 'A precise dot grid sits behind the numbered column with a gradient rule under the heading. Adds surface without decoration; closest to a technical or fashion editorial.',
  },
};

const NUMERAL = 'shrink-0 font-display text-2xl font-bold leading-none tabular-nums';
const NUM_COLOR = 'color:rgba(232,32,143,.35)';

const listCol = (c) => `
<div>
  <h2 class="font-display text-3xl font-bold leading-tight text-ink sm:text-[2.75rem]">${esc(c.home.painPoints.heading)}</h2>
  <ul class="mt-12 space-y-9">
    ${c.home.painPoints.items.map((t, i) => `
    <li class="flex gap-6">
      <span aria-hidden="true" class="${NUMERAL}" style="${NUM_COLOR}">${String(i + 1).padStart(2, '0')}</span>
      <p class="font-body text-lg leading-relaxed text-ink">${esc(t)}</p>
    </li>`).join('')}
  </ul>
</div>`;

const photo = (extra = '') => `
<img src="/assets/photos/gallery-1-2.jpg" alt="Women together at a Rise Up Queens event"
     width="1080" height="1080" loading="lazy" decoding="async"
     class="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)] ${extra}">`;

// overflow-hidden is on the decoration wrapper, never on the section itself:
// an overflow-hidden ancestor becomes a scroll container and position:sticky
// silently stops working, which would break the sticky photograph.
const shell = (inner, deco = '') => `
<section class="relative bg-white py-24">
  ${deco ? `<div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">${deco}</div>` : ''}
  <div class="relative mx-auto max-w-content px-6">
    <div class="grid gap-14 lg:grid-cols-[7fr_5fr]">
      ${inner}
    </div>
  </div>
</section>`;

export const renderEditorial = (site, c, key) => {
  if (key === 'orbs') {
    const deco = `
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full blur-3xl"
           style="background:radial-gradient(circle,rgba(232,32,143,.16),transparent 68%)"></div>
      <div class="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl"
           style="background:radial-gradient(circle,rgba(0,185,198,.14),transparent 68%)"></div>
    </div>`;
    return shell(`${listCol(c)}<div class="relative hidden lg:block"><div class="sticky top-24">${photo()}</div></div>`, deco);
  }

  if (key === 'arcs') {
    const deco = `
    <svg aria-hidden="true" class="pointer-events-none absolute -right-40 top-1/2 hidden -translate-y-1/2 lg:block"
         width="760" height="760" viewBox="0 0 760 760" fill="none">
      ${[380, 300, 220, 140].map((r, i) =>
        `<circle cx="380" cy="380" r="${r}" stroke="${i % 2 ? 'rgba(0,185,198,.30)' : 'rgba(232,32,143,.22)'}" stroke-width="1"/>`).join('')}
    </svg>`;
    return shell(`${listCol(c)}<div class="relative hidden lg:block"><div class="sticky top-24">${photo()}</div></div>`, deco);
  }

  if (key === 'duo') {
    return shell(`
    ${listCol(c)}
    <div class="relative hidden lg:block">
      <div class="sticky top-24">
        ${photo()}
        <!-- Second image offset below-left, deliberately smaller and tucked
             under the first so the pair reads as coverage, not a collage. -->
        <img src="/assets/photos/gallery-1-1.jpg" alt="Two women in conversation at the event"
             width="1080" height="1080" loading="lazy" decoding="async"
             class="absolute -bottom-14 -left-16 aspect-square w-40 rounded-2xl border-4 border-white object-cover shadow-[0_20px_40px_-20px_rgba(28,28,28,.5)]">
        <span class="absolute -bottom-14 right-0 rounded-full bg-ink px-4 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.18em] text-white">Dallas, TX</span>
      </div>
    </div>`);
  }

  if (key === 'quote') {
    return shell(`
    ${listCol(c)}
    <div class="relative hidden lg:block">
      <div class="sticky top-24">
        ${photo()}
        <figure class="absolute -bottom-10 -left-20 max-w-[17rem] rounded-2xl bg-white p-6 shadow-[0_2px_4px_rgba(28,28,28,.05),0_28px_56px_-28px_rgba(28,28,28,.45)]">
          <span aria-hidden="true" class="block h-0.5 w-8 rounded-full bg-gradient-to-r from-magenta to-cyan"></span>
          <blockquote class="mt-4 font-display text-lg font-semibold leading-snug text-ink">${esc(c.about.pullquotes[0])}</blockquote>
          <figcaption class="mt-3 font-body text-[11px] uppercase tracking-[0.18em] text-ink-soft">Rise Up Queens</figcaption>
        </figure>
      </div>
    </div>`);
  }

  if (key === 'frame') {
    const corner = (pos, path) =>
      `<svg aria-hidden="true" class="pointer-events-none absolute ${pos} hidden lg:block" width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="rgba(232,32,143,.45)" stroke-width="1.5"><path d="${path}"/></svg>`;
    const deco = `
    <div aria-hidden="true" class="pointer-events-none absolute inset-x-8 inset-y-10 hidden border-y border-ink/10 lg:block"></div>
    ${corner('left-6 top-8', 'M0 12V0h12')}
    ${corner('right-6 top-8', 'M34 12V0H22')}
    ${corner('bottom-8 left-6', 'M0 22v12h12')}
    ${corner('bottom-8 right-6', 'M34 22v12H22')}`;
    return shell(`${listCol(c)}<div class="relative hidden lg:block"><div class="sticky top-24">${photo()}</div></div>`, deco);
  }

  // dots
  const deco = `
  <div aria-hidden="true" class="pointer-events-none absolute left-0 top-24 hidden h-[30rem] w-1/2 lg:block"
       style="background-image:radial-gradient(rgba(28,28,28,.13) 1px,transparent 1px);background-size:18px 18px;
              -webkit-mask-image:linear-gradient(120deg,#000,transparent 72%);mask-image:linear-gradient(120deg,#000,transparent 72%)"></div>`;
  return shell(`
  <div>
    <h2 class="font-display text-3xl font-bold leading-tight text-ink sm:text-[2.75rem]">${esc(c.home.painPoints.heading)}</h2>
    <span aria-hidden="true" class="mt-6 block h-1 w-24 rounded-full bg-gradient-to-r from-magenta to-cyan"></span>
    <ul class="mt-10 space-y-9">
      ${c.home.painPoints.items.map((t, i) => `
      <li class="flex gap-6">
        <span aria-hidden="true" class="${NUMERAL}" style="${NUM_COLOR}">${String(i + 1).padStart(2, '0')}</span>
        <p class="font-body text-lg leading-relaxed text-ink">${esc(t)}</p>
      </li>`).join('')}
    </ul>
  </div>
  <div class="relative hidden lg:block"><div class="sticky top-24">${photo()}</div></div>`, deco);
};

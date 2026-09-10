// Options for the struggles plate: align it with its heading and make it
// bigger, without losing the magazine feel.
//
// The problem is structural, not a matter of margins. Right now the heading
// is a full-width band ABOVE the grid, so the photo column can only ever start
// below it. Nudging the photo up with a negative margin — which is what I
// tried last time — just drags it over the heading and looks broken.
//
// Each option below solves it by changing where the heading lives relative to
// the grid, so the plate can begin at the same line the heading does.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const PLATE_OPTS = {
  aligned: {
    label: 'Aligned — heading moves into the column, plate starts level',
    note: 'The heading drops inside the left column, so both columns begin on the same line and the plate top is exactly level with the script. Bigger too: the column goes 5fr to 6fr. Cleanest structural fix.',
  },
  tall: {
    label: 'Tall column — the plate runs the whole section',
    note: 'The plate spans from the heading line to below the last struggle, at 3:4. It becomes the dominant object on the page rather than an illustration beside a list. Biggest of the four.',
  },
  bleed: {
    label: 'Bleed — the plate starts above the heading and runs off the right edge',
    note: 'The plate begins higher than the heading and extends past the container into the right margin. The most magazine of the four; the crop off the page edge is the whole point.',
  },
  symmetric: {
    label: 'Symmetric pair — both plates identical, each level with its heading',
    note: 'Both photographs become the same size and each sits level with its own heading, one right and one left. Reads as a true two-page spread; the most composed and the most restrained.',
  },
};

const swash = (colour) => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

const dualHeading = (scriptText, sansText, colour, sansTone, scriptFirst, size) => {
  const script = `<span class="relative inline-block">
      <span class="script block" style="color:${colour};font-size:${size};line-height:.9">${esc(scriptText)}</span>
      ${swash(colour)}</span>`;
  const sans = `<span class="block font-display text-2xl font-bold uppercase tracking-[0.06em] ${sansTone} sm:text-[2.1rem]">${esc(sansText)}</span>`;
  return `<h2 class="leading-none">${scriptFirst
    ? script + `<span class="mt-3 block">${sans}</span>`
    : sans + `<span class="mt-1 block">${script}</span>`}</h2>`;
};

const plate = (src, alt, aspect, objectPos = '', extra = '') => `
<div class="relative ${extra}">
  <div aria-hidden="true" class="absolute -bottom-4 -right-4 h-full w-full rounded-[1.75rem]"
       style="background:linear-gradient(135deg,${MAGENTA},${CYAN});opacity:.16"></div>
  <img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"
       class="relative ${aspect} w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]"
       ${objectPos ? `style="object-position:${objectPos}"` : ''}>
</div>`;

const struggleList = (c) => `
<ul class="space-y-8">
  ${c.home.painPoints.items.map((t, i) => `
  <li class="flex gap-6">
    <span aria-hidden="true" class="shrink-0 font-display text-xl font-bold leading-none tabular-nums"
          style="color:rgba(232,32,143,.4)">${String(i + 1).padStart(2, '0')}</span>
    <p class="font-body text-lg leading-relaxed text-ink">${esc(t)}</p>
  </li>`).join('')}
</ul>`;

const answerList = (c) => `
<div class="mt-10 divide-y divide-ink/10 border-y border-ink/10">
  ${c.home.renewal.items.map(it => `
  <div class="py-7">
    <h3 class="font-display text-xl font-bold text-ink">${esc(it.title)}</h3>
    <p class="mt-2 max-w-xl font-body leading-relaxed text-ink-soft">${esc(it.body)}</p>
  </div>`).join('')}
</div>`;

const GROUND = 'background:linear-gradient(180deg,#ffffff,#FDF6F1 55%,#ffffff)';
const orbs = `
<div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
  <div class="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(232,32,143,.12),transparent 68%)"></div>
  <div class="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(0,185,198,.10),transparent 68%)"></div>
</div>`;

// The renewal half is unchanged in every option except `symmetric`.
const renewalHalf = (c, aspect = 'aspect-[4/5]', grid = 'lg:grid-cols-[6fr_6fr]') => `
<section class="relative mx-auto max-w-content px-6 pb-24">
  <div class="grid items-start gap-14 ${grid}">
    <div class="-mt-20 lg:-mt-32">
      ${plate(c.home.renewal.photo, c.home.renewal.photoAlt, aspect, 'center 32%')}
    </div>
    <div class="pt-6">
      ${dualHeading('healing and renewal', 'Join us to experience', CYAN, 'text-ink-soft', false, '3.75rem')}
      ${answerList(c)}
    </div>
  </div>
</section>`;

export const renderPlateOpt = (site, c, key) => {
  const heading = dualHeading('Common struggles', 'women in marriage have', MAGENTA, 'text-ink', true, '4.5rem');

  if (key === 'aligned') {
    return `
<div class="relative" style="${GROUND}">${orbs}
  <section class="relative mx-auto max-w-content px-6 pb-10 pt-24">
    <!-- Heading now lives INSIDE the left column, so both columns start on the
         same line and the plate is level with the script. -->
    <div class="grid gap-14 lg:grid-cols-[6fr_6fr]">
      <div>
        <div class="border-b border-ink/10 pb-4">${heading}</div>
        <div class="mt-12">${struggleList(c)}</div>
      </div>
      <div class="relative z-10 hidden lg:block">
        ${plate('/assets/photos/gallery-1-2.png', 'Women together at a Rise Up Queens event', 'aspect-[4/5]')}
      </div>
    </div>
  </section>
  ${renewalHalf(c)}
</div>`;
  }

  if (key === 'tall') {
    return `
<div class="relative" style="${GROUND}">${orbs}
  <section class="relative mx-auto max-w-content px-6 pb-10 pt-24">
    <div class="grid gap-14 lg:grid-cols-[6fr_6fr]">
      <div>
        <div class="border-b border-ink/10 pb-4">${heading}</div>
        <div class="mt-12">${struggleList(c)}</div>
      </div>
      <!-- 3:4 rather than 4:5, so the plate runs the full height of the column. -->
      <div class="relative z-10 hidden lg:block">
        ${plate('/assets/photos/gallery-1-2.png', 'Women together at a Rise Up Queens event', 'aspect-[3/4]')}
      </div>
    </div>
  </section>
  ${renewalHalf(c)}
</div>`;
  }

  if (key === 'bleed') {
    return `
<div class="relative overflow-hidden" style="${GROUND}">${orbs}
  <section class="relative mx-auto max-w-content px-6 pb-10 pt-24">
    <div class="grid gap-14 lg:grid-cols-[6fr_6fr]">
      <div>
        <div class="border-b border-ink/10 pb-4">${heading}</div>
        <div class="mt-12">${struggleList(c)}</div>
      </div>
      <!-- Starts above the heading line and runs past the container edge. -->
      <div class="relative z-10 hidden lg:block lg:-mt-14 lg:-mr-24">
        ${plate('/assets/photos/gallery-1-2.png', 'Women together at a Rise Up Queens event', 'aspect-[4/5]')}
      </div>
    </div>
  </section>
  ${renewalHalf(c)}
</div>`;
  }

  // symmetric — both plates the same, each level with its own heading
  return `
<div class="relative" style="${GROUND}">${orbs}
  <section class="relative mx-auto max-w-content px-6 pb-12 pt-24">
    <div class="grid gap-14 lg:grid-cols-[6fr_6fr]">
      <div>
        <div class="border-b border-ink/10 pb-4">${heading}</div>
        <div class="mt-12">${struggleList(c)}</div>
      </div>
      <div class="relative z-10 hidden lg:block">
        ${plate('/assets/photos/gallery-1-2.png', 'Women together at a Rise Up Queens event', 'aspect-[4/5]')}
      </div>
    </div>
  </section>

  <section class="relative mx-auto max-w-content px-6 pb-24">
    <div class="grid gap-14 lg:grid-cols-[6fr_6fr]">
      <div class="-mt-20 lg:-mt-24">
        ${plate(c.home.renewal.photo, c.home.renewal.photoAlt, 'aspect-[4/5]', 'center 32%')}
      </div>
      <div>
        ${dualHeading('healing and renewal', 'Join us to experience', CYAN, 'text-ink-soft', false, '3.75rem')}
        ${answerList(c)}
      </div>
    </div>
  </section>
</div>`;
};

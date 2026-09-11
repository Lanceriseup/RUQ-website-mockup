// Struggles + renewal, as one magazine spread. Production.
//
// Both sections are one argument — six problems, then three answers — so they
// share a ground and the photographic plates overlap the boundary between
// them.
//
// Chosen treatments:
//   plates — a flat brand-colour block offset behind each photograph
//   answers — titled blocks separated by hairline rules
//
// Both photographs run at 4:5 so the pair matches. The group shot is natively
// 16:9 and is cropped to portrait via object-cover with the focal point held
// slightly high, since the faces sit in the upper two thirds of that frame.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

const swash = (colour) => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

// Their own sentence split across the two faces. Nothing is invented.
const dualHeading = (scriptText, sansText, colour, sansTone, scriptFirst, size) => {
  const script = `<span class="relative inline-block">
      <span class="script block" style="color:${colour};font-size:${size};line-height:.9">${esc(scriptText)}</span>
      ${swash(colour)}</span>`;
  const sans = `<span class="block font-display text-2xl font-bold uppercase tracking-[0.06em] ${sansTone} sm:text-[2.1rem]">${esc(sansText)}</span>`;
  return `<h2 class="leading-none">${scriptFirst
    ? script + `<span class="mt-3 block">${sans}</span>`
    : sans + `<span class="mt-1 block">${script}</span>`}</h2>`;
};

// Offset colour block behind the image. The block is a sibling rather than a
// border so it can sit proud of the corner without affecting the image box.
const plate = (src, alt, objectPos = '') => `
<div class="relative">
  <div aria-hidden="true" class="absolute -bottom-4 -right-4 h-full w-full rounded-[1.75rem]"
       style="background:linear-gradient(135deg,${MAGENTA},${CYAN});opacity:.16"></div>
  <img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"
       class="relative aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]"
       ${objectPos ? `style="object-position:${objectPos}"` : ''}>
</div>`;

export const spread = (site, c) => `
<div class="relative" style="background:linear-gradient(180deg,#ffffff,#FDF6F1 55%,#ffffff)">

  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,rgba(232,32,143,.12),transparent 68%)"></div>
    <div class="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,rgba(0,185,198,.10),transparent 68%)"></div>
  </div>

  <!-- The problems. The heading sits INSIDE the left column, not as a
       full-width band above the grid — that is what lets the plate start on
       the same line as the script rather than below the whole heading. -->
  <section class="relative mx-auto max-w-content px-6 pb-8 sm:pb-12 pt-14 sm:pt-24">
    <div class="grid gap-14 lg:grid-cols-[6fr_6fr]">
      <div>
        <div class="border-b border-ink/10 pb-4">
          ${dualHeading('Common struggles', 'women in marriage have', MAGENTA, 'text-ink', true, '4.5rem')}
        </div>
        <ul class="mt-8 sm:mt-12 space-y-8">
          ${c.home.painPoints.items.map((t, i) => `
          <li class="flex gap-6">
            <span aria-hidden="true" class="shrink-0 font-display text-xl font-bold leading-none tabular-nums"
                  style="color:rgba(232,32,143,.4)">${String(i + 1).padStart(2, '0')}</span>
            <p class="font-body text-lg leading-relaxed text-ink">${esc(t)}</p>
          </li>`).join('')}
        </ul>
      </div>
      <div class="relative z-10 hidden lg:block">
        ${plate('/assets/photos/gallery-1-2.jpg', 'Women together at a Rise Up Queens event')}
      </div>
    </div>
  </section>

  <!-- The answers, mirrored: plate left, heading and list right. Both plates
       are the same 6fr column at 4:5, and each sits level with its own
       heading, so the two read as facing pages. The lift keeps the magazine
       overlap across the section boundary. -->
  <section class="relative mx-auto max-w-content px-6 pb-14 sm:pb-24">
    <div class="grid gap-14 lg:grid-cols-[6fr_6fr]">
      <div class="-mt-20 lg:-mt-24">
        ${plate(c.home.renewal.photo, c.home.renewal.photoAlt, 'center 32%')}
      </div>
      <div>
        ${dualHeading('healing and renewal', 'Join us to experience', CYAN, 'text-ink-soft', false, '3.75rem')}
        <div class="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          ${c.home.renewal.items.map(it => `
          <div class="py-7">
            <h3 class="font-display text-xl font-bold text-ink">${esc(it.title)}</h3>
            <p class="mt-2 max-w-xl font-body leading-relaxed text-ink-soft">${esc(it.body)}</p>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>
</div>`;

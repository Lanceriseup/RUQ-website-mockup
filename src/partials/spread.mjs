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
// Both photographs run at 4:5 from lg so the pair matches across the spread.
// Below lg they are 3:2 and stacked — see the notes at each plate. The group
// shot is natively 16:9 and is cropped via object-cover with the focal point
// held slightly high, since the faces sit in the upper two thirds.
//
// EDITING NOTE: everything from `export const spread` down is one template
// literal, so a backtick anywhere inside it — including inside an HTML comment
// — ends the string and breaks the build with a confusing error pointing at
// the next word. Quote class names with "double quotes" in comments here, not
// `backticks`. This has cost four builds already.
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
//
// `opts` is used only by the struggles heading, which is compacted for phones.
// The renewal heading below passes nothing and renders exactly as it always
// has, at both breakpoints.
//
//   fluid    replaces the fixed size with a viewport-derived clamp and turns
//            wrapping off, so the script physically cannot break onto two
//            lines. At 4.5rem "Common struggles" needs two lines under about
//            500px, which is what made the section look broken on a phone.
//
//            The clamp restores the shipped size on its own: 14.5vw passes
//            4.5rem at roughly 553px and is capped there, so no breakpoint is
//            needed and every width at or above that renders identically to
//            before. The vw figure is derived, not picked — this script runs
//            about 5.5px of width per 1px of font-size, and the heading has
//            (viewport - 48px of gutters) to fill, which leaves ~9% clearance:
//
//              360px phone   52px type → 287px wide in 312px   25px spare
//              390px phone   57px type → 311px wide in 342px   31px spare
//              430px phone   62px type → 343px wide in 382px   39px spare
//
//   eyebrow  demotes the sans line below sm to the 11px letter-spaced label
//            used everywhere else on this site, so the script alone reads as
//            the heading. mt-5 rather than mt-3: the swash is drawn 0.28em
//            tall hanging below the script's baseline — about 16px under a
//            57px script — and a 12px gap puts that stroke straight through a
//            line of 11px type.
const dualHeading = (scriptText, sansText, colour, sansTone, scriptFirst, size, opts = {}) => {
  // The clamp's ceiling is always the shipped size, so every width at or above
  // the point the vw figure reaches it renders exactly as before — which is
  // why neither heading needs a breakpoint for its script.
  //
  // vw differs per heading because the strings differ: "Common struggles" is
  // 16 characters and takes 14.5vw, "healing and renewal" is 19 and needs
  // 12vw to fit the same space.
  const scriptSize = opts.fluid ? `clamp(${opts.min},${opts.vw},${size})` : size;
  const nowrap = opts.fluid ? ';white-space:nowrap' : '';
  const script = `<span class="relative inline-block">
      <span class="script block" style="color:${colour};font-size:${scriptSize};line-height:.9${nowrap}">${esc(scriptText)}</span>
      ${swash(colour)}</span>`;
  const sans = opts.eyebrow
    ? `<span class="block font-display text-[11px] font-bold uppercase tracking-[0.3em] text-ink-soft sm:text-[2.1rem] sm:tracking-[0.06em] sm:${sansTone}">${esc(sansText)}</span>`
    : `<span class="block font-display text-2xl font-bold uppercase tracking-[0.06em] ${sansTone} sm:text-[2.1rem]">${esc(sansText)}</span>`;
  // Two different gaps because the two headings stack in opposite orders.
  //
  // scriptFirst (struggles): the sans sits BELOW the script, so it has to
  // clear the swash — drawn 0.28em tall hanging under the baseline, about
  // 16px beneath a 57px script. 12px would put that stroke through 11px type.
  //
  // sans first (renewal): the script sits below the sans, so what has to
  // clear is the script's own ascenders reaching up. mt-1 works at 24px,
  // where the sans line is tall enough to stand off them on its own; at 11px
  // the "h" and "l" of "healing" crowd into it.
  const gapBelowScript = opts.eyebrow ? 'mt-5 sm:mt-3' : 'mt-3';
  const gapBelowSans = opts.eyebrow ? 'mt-3 sm:mt-1' : 'mt-1';
  return `<h2 class="leading-none">${scriptFirst
    ? script + `<span class="${gapBelowScript} block">${sans}</span>`
    : sans + `<span class="${gapBelowSans} block">${script}</span>`}</h2>`;
};

// Offset colour block behind the image. The block is a sibling rather than a
// border so it can sit proud of the corner without affecting the image box.
//
// `aspect` defaults to the shipped 4:5. The renewal plate overrides it below
// lg — see the note at that call site.
const plate = (src, alt, objectPos = '', aspect = 'aspect-[4/5]') => `
<div class="relative">
  <div aria-hidden="true" class="absolute -bottom-4 -right-4 h-full w-full rounded-[1.75rem]"
       style="background:linear-gradient(135deg,${MAGENTA},${CYAN});opacity:.16"></div>
  <img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"
       class="relative ${aspect} w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]"
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
  <!-- Compacted for phones: measured at 390px this section went from 854px to
       561px. The list was spaced to balance the 4:5 plate in the right column,
       and that plate is hidden below lg — so on a phone the spacing was
       holding nothing apart. The items are single sentences, not paragraphs.

       Heading is centred below sm only; the list stays left-aligned at every
       width, because six centred sentences would be ragged on both edges. -->
  <section class="relative mx-auto max-w-content px-6 pb-8 sm:pb-12 pt-10 sm:pt-24">
    <!-- Three grid children, same device as the renewal section below: below lg
         "order" puts them in reading order — heading, photograph, list — and
         from lg the explicit col-start/row-start rebuilds the shipped spread,
         with the plate in column two spanning both rows.

         Both halves of the spread now place their photograph directly under
         their own heading on a phone, which is the arrangement each has on
         desktop too, read left to right instead of top to bottom.

         Row gap is zeroed at lg and the list carries its own lg:mt-12, because
         the grid gap would otherwise land between heading and list where the
         shipped spacing is 48px. Column gap is untouched. -->
    <div class="grid gap-y-6 sm:gap-y-10 lg:grid-cols-[6fr_6fr] lg:gap-x-14 lg:gap-y-0">
      <div class="order-1 lg:order-none lg:col-start-1 lg:row-start-1">
        <div class="border-b border-ink/10 pb-4 text-center sm:text-left">
          ${dualHeading('Common struggles', 'women in marriage have', MAGENTA, 'text-ink', true, '4.5rem', { fluid: true, eyebrow: true, min: '2.25rem', vw: '14.5vw' })}
        </div>
      </div>

      <!-- Shown on phones now, not "hidden lg:block". Before this a phone saw
           the renewal photograph and never saw this one at all.

           3:2 below lg for the same reason as the other plate — 4:5 is a
           portrait ratio chosen so the two match each other across the spread,
           and on a phone they are never side by side. -->
      <div class="relative z-10 order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
        ${plate('/assets/photos/gallery-1-2.jpg', 'Women together at a Rise Up Queens event', '', 'aspect-[3/2] lg:aspect-[4/5]')}
      </div>

      <div class="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-12">
        <ul class="space-y-4 sm:space-y-8">
          ${c.home.painPoints.items.map((t, i) => `
          <li class="flex gap-4 sm:gap-6">
            <span aria-hidden="true" class="shrink-0 font-display text-sm sm:text-xl font-bold leading-relaxed sm:leading-none tabular-nums"
                  style="color:rgba(232,32,143,.4)">${String(i + 1).padStart(2, '0')}</span>
            <p class="font-body text-base sm:text-lg leading-relaxed text-ink">${esc(t)}</p>
          </li>`).join('')}
        </ul>
      </div>
    </div>
  </section>

  <!-- The answers, mirrored: plate left, heading and list right. Both plates
       are the same 6fr column at 4:5, and each sits level with its own
       heading, so the two read as facing pages. The lift keeps the magazine
       overlap across the section boundary. -->
  <!-- Three grid children rather than two, so the photograph can sit between
       the heading and the list on a phone while staying in the left-hand
       column on desktop.

       Below lg the grid is one column and "order" puts them in reading order:
       heading, photograph, list. From lg the explicit col-start/row-start
       placement rebuilds the shipped spread exactly — plate in column one
       spanning both rows, heading and list stacked in column two.

       gap-y is zeroed at lg and the list keeps its own mt-10, because the
       56px row gap would otherwise land between heading and list where today
       there is 40px. Column gap is untouched. -->
  <section class="relative mx-auto max-w-content px-6 pb-14 sm:pb-24">
    <div class="grid gap-8 sm:gap-14 lg:grid-cols-[6fr_6fr] lg:gap-x-14 lg:gap-y-0">
      <!-- The lift is lg-only, and that is a fix rather than a preference.
           It used to read "-mt-20 lg:-mt-24", with no breakpoint on the first
           value, so it applied at every width. Up here that is the magazine
           device working as intended: the plate is in the right-hand column
           and crosses the section boundary BESIDE the struggles list. Below lg
           the grid is a single column, so the identical lift dragged the
           photograph up ON TOP of that list and covered 48px of item 06.

           The crop is landscape below lg. 4:5 is a portrait ratio chosen so
           the two plates match each other across the spread — a relationship
           that only exists while they are side by side, which on a phone they
           never are. At 4:5 this rendered 428px tall, most of a phone screen
           for one photograph; at 3:2 it is 228px. The source is natively 16:9,
           so a landscape crop also discards less of the original frame than
           the portrait one does. object-position holds the focal point high,
           because the faces sit in the upper two thirds. -->
      <div class="order-2 lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:-mt-24">
        ${plate(c.home.renewal.photo, c.home.renewal.photoAlt, 'center 32%', 'aspect-[3/2] lg:aspect-[4/5]')}
      </div>
      <!-- Centred below sm, matching the struggles heading opposite it. The
           items below stay left-aligned: centring a heading is one thing,
           centring three body paragraphs would leave both edges ragged. -->
      <div class="order-1 lg:order-none lg:col-start-2 lg:row-start-1 text-center sm:text-left">
        ${dualHeading('healing and renewal', 'Join us to experience', CYAN, 'text-ink-soft', false, '3.75rem', { fluid: true, eyebrow: true, min: '1.75rem', vw: '12vw' })}
      </div>
      <div class="order-3 lg:order-none lg:col-start-2 lg:row-start-2 lg:mt-10">
        <!-- py-7 is 28px above AND below each of three blocks: 168px of this
             section was padding around three short paragraphs, sized for a
             column standing beside a 655px portrait plate that below lg is
             not there. 16px on phones; the shipped value returns at sm.
             Bodies drop to 14px against their 20px titles so the titles carry
             the scanning — every word of the copy is kept. -->
        <div class="divide-y divide-ink/10 border-y border-ink/10">
          ${c.home.renewal.items.map(it => `
          <div class="py-4 sm:py-7">
            <h3 class="font-display text-lg sm:text-xl font-bold text-ink">${esc(it.title)}</h3>
            <p class="mt-1 sm:mt-2 max-w-xl font-body text-sm sm:text-base leading-relaxed text-ink-soft">${esc(it.body)}</p>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>
</div>`;

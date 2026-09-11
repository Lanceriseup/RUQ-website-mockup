// Mission + Statement of Faith. Manuscript treatment.
//
// The creed is set as a printed document rather than a web component: serif
// throughout, drop cap, two columns, hanging numerals, hairline rules, on a
// parchment plate. A creed set in a UI sans reads as terms and conditions.
//
// Nothing is hidden behind a disclosure. On the live site these seven points
// sit inside a collapsed accordion and then a scroll box, which makes the most
// load-bearing content on the page for this audience the hardest to reach.
//
// Compacted via the "tightened" option: section padding, plate padding, type
// size and leading each come down one step and nothing else moves. The layout,
// the column count and the copy are untouched — all seven beliefs and the full
// intro are still here, they simply occupy less height.
//
// Background is the photograph the live site uses behind this section: a cross
// hung with prayer notes, women seated around it. Far more apt for a statement
// of faith than anything in the general event library.
//
// The live site renders it through filter: brightness(190%) saturate(0%),
// which is what drains it to near-grey. That is not reproduced here — the ink
// scrim below provides the contrast the parchment plate needs while leaving
// the photograph legible as an image.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const PHOTO = '/assets/photos/faith-bg.png';

export const faithSection = (site, c) => `
<section class="relative overflow-hidden py-16">

  <img src="${PHOTO}" alt="" aria-hidden="true" loading="lazy" decoding="async"
       class="absolute inset-0 h-full w-full object-cover">
  <div aria-hidden="true" class="absolute inset-0 bg-ink/80"></div>

  <div class="relative mx-auto max-w-4xl px-6">

    <!-- The mission statement now opens the CTA above, where it sets up the
         ask. It sat awkwardly here with nothing to attach to. -->

    <!-- Parchment plate. Cormorant throughout; Lato only for the small caps
         label and the numerals, where a serif would read as decoration. -->
    <div class="p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-10"
         style="background:#F6F1E8;font-family:'Cormorant Garamond',serif">

      <p class="text-center font-body text-[11px] uppercase tracking-[0.4em] text-ink-soft">${esc(c.home.faith.title)}</p>
      <div aria-hidden="true" class="mx-auto mt-5 h-px w-24" style="background:${MAGENTA}"></div>

      <!-- Drop cap scaled with the body: at 3.5rem it still spans roughly
           three lines of 1.2rem/1.5 text, which is what makes it read as a
           drop cap rather than a large first letter. -->
      <p class="mt-6 text-[1.2rem] leading-[1.5] text-ink
                first-letter:float-left first-letter:mr-3 first-letter:mt-1
                first-letter:text-[3.5rem] first-letter:font-semibold first-letter:leading-[.8]
                first-letter:text-magenta">${esc(c.home.faith.intro)}</p>

      <div aria-hidden="true" class="my-7 h-px w-full" style="background:rgba(28,28,28,.18)"></div>

      <!-- break-inside-avoid stops a belief splitting across the column gap. -->
      <ol class="columns-1 gap-10 sm:columns-2">
        ${c.home.faith.beliefs.map((b, i) => `
        <li class="mb-5 break-inside-avoid text-[1.08rem] leading-[1.45] text-ink">
          <span aria-hidden="true" class="mr-2 align-baseline font-body text-sm font-semibold" style="color:${MAGENTA}">${String(i + 1).padStart(2, '0')}</span>${esc(b)}
        </li>`).join('')}
      </ol>
    </div>
  </div>
</section>`;

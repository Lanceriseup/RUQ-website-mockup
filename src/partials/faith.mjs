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
// Background is the writing photograph — the act of writing echoes the
// manuscript idea, and it reads as texture rather than portraiture once it is
// behind the ink scrim.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const PHOTO = '/assets/photos/gallery-2-2.png';

export const faithSection = (site, c) => `
<section class="relative overflow-hidden py-24">

  <img src="${PHOTO}" alt="" aria-hidden="true" loading="lazy" decoding="async"
       class="absolute inset-0 h-full w-full object-cover">
  <div aria-hidden="true" class="absolute inset-0 bg-ink/80"></div>

  <div class="relative mx-auto max-w-4xl px-6">

    <p class="mx-auto max-w-3xl text-center font-body text-lg leading-relaxed text-white/85">
      ${esc(c.home.faith.mission)}
    </p>

    <!-- Parchment plate. Cormorant throughout; Lato only for the small caps
         label and the numerals, where a serif would read as decoration. -->
    <div class="mt-14 p-10 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-14"
         style="background:#F6F1E8;font-family:'Cormorant Garamond',serif">

      <p class="text-center font-body text-[11px] uppercase tracking-[0.4em] text-ink-soft">${esc(c.home.faith.title)}</p>
      <div aria-hidden="true" class="mx-auto mt-5 h-px w-24" style="background:${MAGENTA}"></div>

      <p class="mt-8 text-[1.35rem] leading-[1.7] text-ink
                first-letter:float-left first-letter:mr-3 first-letter:mt-1
                first-letter:text-[4.5rem] first-letter:font-semibold first-letter:leading-[.8]
                first-letter:text-magenta">${esc(c.home.faith.intro)}</p>

      <div aria-hidden="true" class="my-10 h-px w-full" style="background:rgba(28,28,28,.18)"></div>

      <!-- break-inside-avoid stops a belief splitting across the column gap. -->
      <ol class="columns-1 gap-12 sm:columns-2">
        ${c.home.faith.beliefs.map((b, i) => `
        <li class="mb-7 break-inside-avoid text-[1.2rem] leading-[1.6] text-ink">
          <span aria-hidden="true" class="mr-2 align-baseline font-body text-sm font-semibold" style="color:${MAGENTA}">${String(i + 1).padStart(2, '0')}</span>${esc(b)}
        </li>`).join('')}
      </ol>
    </div>
  </div>
</section>`;

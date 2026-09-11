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
// Height comes from the "tightened" pass: section padding, plate padding, type
// size and leading each one step down from where they started. Layout, column
// count and copy are untouched.
//
// Background is the photograph the live site uses behind this section: a cross
// hung with prayer notes, women seated around it. Far more apt for a statement
// of faith than anything in the general event library.
//
// Treatment is "stone": all colour stripped, contrast pushed, then darkened.
// The live site runs the same image through brightness(190%) saturate(0%),
// which blows it out to near-white; this goes the other way and keeps it as a
// dark ground, so the parchment is the only warm thing on screen.
//
// The plate is exported on its own because the edge treatments in
// faith-edge.mjs wrap the same content in a different shell. One copy, so a
// change to the creed cannot land in only half the places it renders.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
export const FAITH_PHOTO = '/assets/photos/faith-bg.png';

// Stone: colour stripped, contrast pushed, brightness pulled back, under an
// ink scrim. Shared with the edge options so the two cannot drift apart.
export const FAITH_IMG_FILTER = 'grayscale contrast-125 brightness-90';
export const FAITH_SCRIM = 'rgba(28,28,28,.78)';

export const faithPlate = (c) => `
<!-- Parchment plate. Cormorant throughout; Lato only for the small caps label
     and the numerals, where a serif would read as decoration. -->
<div class="p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-10"
     style="background:#F6F1E8;font-family:'Cormorant Garamond',serif">

  <p class="text-center font-body text-[11px] uppercase tracking-[0.4em] text-ink-soft">${esc(c.home.faith.title)}</p>
  <div aria-hidden="true" class="mx-auto mt-5 h-px w-24" style="background:${MAGENTA}"></div>

  <!-- Drop cap scaled with the body: at 3.5rem it still spans about three
       lines of 1.2rem/1.5 text, which is what makes it read as a drop cap
       rather than a large first letter. -->
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
</div>`;

export const faithSection = (site, c) => `
<section class="relative">

  <!-- Decoration only: clipping stays off the <section> itself, because
       overflow-hidden on an ancestor silently kills position: sticky and the
       content column may want it later.

       Elliptical radii — 50% of the width horizontally against 5rem
       vertically — are what make a wide shallow dome instead of a rounded
       rectangle. The curve is flat at the centre of each edge and drops 5rem
       at the far corners, so the corners are where clearance is needed.
       py-20 below is set for that: at the tightest case (a ~900px viewport,
       where the plate almost fills the container) the curve has eaten about
       54px by the time it reaches the plate's corner, leaving ~26px of
       margin. It costs 16px against the tightened py-16. -->
  <div aria-hidden="true" class="absolute inset-0 overflow-hidden"
       style="border-radius:50% 50% 50% 50%/5rem 5rem 5rem 5rem">
    <img src="${FAITH_PHOTO}" alt="" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover ${FAITH_IMG_FILTER}">
    <div class="absolute inset-0" style="background:${FAITH_SCRIM}"></div>
  </div>

  <div class="relative py-20">
    <div class="mx-auto max-w-4xl px-6">
      ${faithPlate(c)}
    </div>
  </div>
</section>`;

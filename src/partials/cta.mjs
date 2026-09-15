// Breakthrough CTA. Bookend layout: centred heading with the two fields and
// the button spread across a single wide row beneath it.
//
// No container and no photography — a gradient hairline along the top edge is
// the only chrome. The row collapses to a stack below `sm`, where three
// side-by-side controls would each be too narrow to use.
//
// The inputs stay `disabled`. The form is wired to nothing: the live one posts
// to a Brizy handler, the Jotform routes were reported broken, and the plan
// was MOS into Ontraport. A disabled field cannot swallow a real signup.
// Remove the attribute only once an endpoint exists.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

// Phrases lifted straight out of the sentence — nothing is reworded. If the
// copy is ever edited and a phrase no longer matches, it simply renders
// unhighlighted rather than breaking.
const HIGHLIGHTS = [
  'the unshakable truth of the Gospel',
  'true freedom',
  'strength, identity, and purpose',
];

// #dc1e88, not the brand #e8208f. At 16px bold these are body text, not large
// text — large needs 18.66px bold or 24px — so they must clear 4.5:1. Brand
// magenta measures 4.17:1 on white and would fail; the darker variant is
// 4.58:1 and is indistinguishable at this size.
const HIGHLIGHT_COLOUR = '#dc1e88';

// font-bold, not font-semibold: only 400 and 700 of Lato are loaded, so 600
// would be synthesised — a faked weight that smears the strokes.
const missionHtml = (c) => {
  let out = esc(c.home.faith.mission);
  for (const phrase of HIGHLIGHTS) {
    const e = esc(phrase);
    out = out.split(e).join(
      `<strong class="font-bold" style="color:${HIGHLIGHT_COLOUR}">${e}</strong>`
    );
  }
  return out;
};

export const ctaSection = (site, c) => `
<section class="relative overflow-hidden bg-white py-8 sm:py-20">

  <!-- The only chrome: a brand hairline across the top edge, which also
       separates this from the section above without a hard border.
       Magenta throughout rather than fading through cyan — a single colour
       reads as one deliberate rule; the two-colour version looked like a
       gradient artefact at 1px. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-px"
       style="background:linear-gradient(to right,transparent,${MAGENTA} 30%,${MAGENTA} 70%,transparent)"></div>

  <div class="relative mx-auto max-w-content px-6 text-center">

    <!-- Framed heading. The rules are hidden below sm: at narrow widths the
         heading wraps to two lines and flanking rules would squeeze it into a
         column rather than marking it. -->
    <div class="flex items-center justify-center gap-5">
      <span aria-hidden="true" class="hidden h-0.5 w-16 rounded-full sm:block"
            style="background:linear-gradient(to right,transparent,${MAGENTA})"></span>
      <h2 class="font-display text-2xl font-bold text-ink sm:text-4xl">${esc(c.home.cta.heading)}</h2>
      <span aria-hidden="true" class="hidden h-0.5 w-16 rounded-full sm:block"
            style="background:linear-gradient(to left,transparent,${CYAN})"></span>
    </div>

    <!-- The mission statement reads as a lead-in here, where it sets up the
         ask. Under the creed below it had nothing to attach to.
         Typography matches the struggles list — font-body, leading-relaxed,
         text-ink — so the two read as the same voice rather than near-misses
         of each other. On desktop that is 18px in both.

         Below sm, three changes, all measured at 390px:

           16px   not a compromise on the match: the struggles list is itself
                  16px on phones now, so 18px here matched nothing. It also
                  fixes the measure — 18px set about 42 characters a line
                  against a 45-75 comfortable range, so 16px moves toward it.

           left   centred is right for two or three lines. This is nine, and
                  centred nine-line copy starts every line in a different
                  place with both edges ragged.

           clamp  the statement runs 391 characters, about 290px of a phone
                  screen, and it sits between the heading and the only
                  conversion point on the page after the hero. Clamped to
                  three lines the form starts at 266px instead of 477px.

         line-clamp is a VISUAL truncation: the full text stays in the DOM and
         in the accessibility tree, so screen readers, search engines and print
         all get the whole statement. The button toggles the class; it does not
         swap any text in or out. Unclamped from sm up, where it always fitted. -->
    <p id="cta-mission" class="mx-auto mt-4 max-w-6xl text-left font-body text-base leading-relaxed text-ink line-clamp-3 sm:mt-6 sm:text-center sm:text-lg sm:line-clamp-none">${missionHtml(c)}</p>

    <button type="button" id="cta-mission-more" aria-expanded="false" aria-controls="cta-mission"
            class="mt-2 inline-flex min-h-11 items-center gap-1 font-body text-[12px] font-bold uppercase tracking-[0.2em] text-magenta-text sm:hidden">
      <span data-more-label>Read more</span>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>

    <form action="#" method="post" novalidate class="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
      ${c.home.cta.fields.map(f => `
      <div class="flex-1">
        <label for="cta-${esc(f.name)}" class="sr-only">${esc(f.label)}</label>
        <input id="cta-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}"
               placeholder="${esc(f.label)}" disabled
               class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 sm:py-3.5 font-body text-ink
                      placeholder:text-ink-soft/60 focus:border-magenta disabled:cursor-not-allowed">
      </div>`).join('')}

      <button type="submit" disabled
              class="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-8 py-3 sm:py-3.5 font-body text-sm font-bold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed sm:w-auto"
              style="background:${MAGENTA}">
        ${esc(c.home.cta.button)}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </form>
  </div>
</section>`;

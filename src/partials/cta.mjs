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

// #dc1e88, not the brand #e8208f. At 17.6px semibold these are body text, not
// large text — large needs 18.66px bold or 24px — so they must clear 4.5:1.
// Brand magenta measures 4.17:1 on white and would fail; the darker variant
// is 4.57:1 and is indistinguishable at this size.
const HIGHLIGHT_COLOUR = '#dc1e88';

const missionHtml = (c) => {
  let out = esc(c.home.faith.mission);
  for (const phrase of HIGHLIGHTS) {
    const e = esc(phrase);
    out = out.split(e).join(
      `<strong class="font-semibold" style="color:${HIGHLIGHT_COLOUR}">${e}</strong>`
    );
  }
  return out;
};

export const ctaSection = (site, c) => `
<section class="relative overflow-hidden bg-white py-20">

  <!-- The only chrome: a brand hairline across the top edge, which also
       separates this from the section above without a hard border. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-px"
       style="background:linear-gradient(to right,transparent,${MAGENTA},${CYAN},transparent)"></div>

  <div class="relative mx-auto max-w-content px-6 text-center">

    <!-- Framed heading. The rules are hidden below sm: at narrow widths the
         heading wraps to two lines and flanking rules would squeeze it into a
         column rather than marking it. -->
    <div class="flex items-center justify-center gap-5">
      <span aria-hidden="true" class="hidden h-0.5 w-16 rounded-full sm:block"
            style="background:linear-gradient(to right,transparent,${MAGENTA})"></span>
      <h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">${esc(c.home.cta.heading)}</h2>
      <span aria-hidden="true" class="hidden h-0.5 w-16 rounded-full sm:block"
            style="background:linear-gradient(to left,transparent,${CYAN})"></span>
    </div>

    <!-- The mission statement reads as a lead-in here, where it sets up the
         ask. Under the creed below it had nothing to attach to.
         Set in Cormorant, which also links it to the creed section below.
         1.21rem across the full container measure: the size went up 10% so the
         measure widened with it, or the text spills to a fourth line.
         Colour is full ink rather than ink-soft — Cormorant has thin stems and
         reads noticeably lighter than a sans at the same value. Hierarchy
         against the heading comes from weight, size and face, not from
         greying the body down.
         Highlights stay in Cormorant at 600 rather than switching to the
         sans, which would fracture the line mid-sentence. -->
    <p class="mx-auto mt-6 max-w-6xl text-[1.21rem] leading-[1.7] text-ink"
       style="font-family:'Cormorant Garamond',serif">${missionHtml(c)}</p>

    <form action="#" method="post" novalidate class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
      ${c.home.cta.fields.map(f => `
      <div class="flex-1">
        <label for="cta-${esc(f.name)}" class="sr-only">${esc(f.label)}</label>
        <input id="cta-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}"
               placeholder="${esc(f.label)}" disabled
               class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 font-body text-ink
                      placeholder:text-ink-soft/60 focus:border-magenta disabled:cursor-not-allowed">
      </div>`).join('')}

      <button type="submit" disabled
              class="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-body text-sm font-bold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed sm:w-auto"
              style="background:${MAGENTA}">
        ${esc(c.home.cta.button)}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </form>
  </div>
</section>`;

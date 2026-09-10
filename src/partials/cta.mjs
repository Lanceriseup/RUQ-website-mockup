// Breakthrough CTA. Editorial treatment: script heading on the left, ruled
// fields on the right, no card and no box.
//
// The mission statement is deliberately not rendered here. It remains in
// content.json (home.cta.mission) because it is the client's copy and belongs
// on the site somewhere — About is the obvious home — but under a signup form
// it competed with the one thing this section is for.
//
// The fields are inert and say so. The live form posts to a Brizy handler,
// Jayden reported the Jotform routes broke, and the plan was MOS into
// Ontraport. A form that looks live but silently discards a signup would lose
// real leads, so it stays visibly a placeholder until that is decided.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';

export const ctaSection = (site, c) => `
<section class="relative overflow-hidden bg-white py-24">

  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="absolute -right-32 top-0 h-[30rem] w-[30rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,rgba(232,32,143,.14),transparent 68%)"></div>
    <div class="absolute -left-24 bottom-0 h-[24rem] w-[24rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,rgba(0,185,198,.10),transparent 68%)"></div>
  </div>

  <div class="relative mx-auto grid max-w-content items-center gap-14 px-6 lg:grid-cols-[6fr_5fr]">

    <div>
      <!-- Their sentence split across the two faces, matching the spread above. -->
      <h2 class="leading-none">
        <span class="relative inline-block">
          <span class="script block" style="color:${MAGENTA};font-size:4rem;line-height:.9">It&rsquo;s time</span>
          <svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
               preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
            <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${MAGENTA}" stroke-width="3"
                  stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
          </svg>
        </span>
        <span class="mt-3 block font-display text-2xl font-bold uppercase tracking-[0.06em] text-ink sm:text-[2.1rem]">for your breakthrough</span>
      </h2>
      <span aria-hidden="true" class="mt-8 block h-0.5 w-24 rounded-full bg-gradient-to-r from-magenta to-cyan"></span>
    </div>

    <form action="#" method="post" novalidate class="space-y-5" aria-describedby="cta-note">
      ${c.home.cta.fields.map(f => `
      <div>
        <label for="cta-${esc(f.name)}" class="sr-only">${esc(f.label)}</label>
        <input id="cta-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}"
               placeholder="${esc(f.label)}" disabled
               class="w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 font-body text-lg text-ink outline-none
                      placeholder:text-ink-soft/60 focus:border-magenta disabled:cursor-not-allowed">
      </div>`).join('')}

      <button type="submit" disabled
              class="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl bg-magenta px-6 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white opacity-80 disabled:cursor-not-allowed">
        ${esc(c.home.cta.button)}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>

      <p id="cta-note" class="text-center font-body text-[11px] uppercase tracking-[0.15em] text-ink-soft">Mockup only — not connected</p>
    </form>

  </div>
</section>`;

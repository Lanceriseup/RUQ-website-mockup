// Breakthrough CTA. Aurora ground: four large brand blobs drifting behind a
// frosted card, on deep ink.
//
// No photography, deliberately. The photo version carried a face and a hand,
// both of which pulled the eye away from the two fields that are the whole
// point of the section. A generated ground cannot compete with the form.
//
// Motion is transform and opacity only and stops entirely under
// prefers-reduced-motion — see .cta-blob in tailwind.css. The blur is set
// once and never animated; animating a blur radius re-rasterises the layer
// every frame.
//
// The inputs stay `disabled`. The form is wired to nothing: the live one
// posts to a Brizy handler, the Jotform routes were reported broken, and the
// plan was MOS into Ontraport. A disabled field cannot swallow a real signup.
// Remove the attribute only once an endpoint exists.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';

export const ctaSection = (site, c) => `
<section class="relative overflow-hidden bg-ink py-28">

  <div aria-hidden="true" class="pointer-events-none absolute inset-0">
    <div class="cta-blob cta-blob-1 absolute h-[36rem] w-[36rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,#e8208faa,transparent 66%)"></div>
    <div class="cta-blob cta-blob-2 absolute h-[32rem] w-[32rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,#00b9c699,transparent 66%)"></div>
    <div class="cta-blob cta-blob-3 absolute h-[28rem] w-[28rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,#f0569f88,transparent 68%)"></div>
    <div class="cta-blob cta-blob-4 absolute h-[24rem] w-[24rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,#00b9c677,transparent 70%)"></div>
  </div>

  <div class="relative mx-auto max-w-xl px-6">
    <div class="rounded-[2rem] p-9 ring-1 ring-white/25 shadow-[0_40px_90px_-40px_rgba(0,0,0,.85)]"
         style="background:rgba(255,255,255,.12);backdrop-filter:blur(26px) saturate(1.4);-webkit-backdrop-filter:blur(26px) saturate(1.4)">

      <h2 class="text-center font-display text-3xl font-bold leading-tight text-white sm:text-[2.5rem]">
        ${esc(c.home.cta.heading)}
      </h2>

      <form action="#" method="post" novalidate class="mt-8 space-y-4">
        ${c.home.cta.fields.map(f => `
        <div>
          <label for="cta-${esc(f.name)}" class="sr-only">${esc(f.label)}</label>
          <input id="cta-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}"
                 placeholder="${esc(f.label)}" disabled
                 class="w-full rounded-xl border border-white/25 bg-white/92 px-4 py-3.5 font-body text-ink
                        placeholder:text-ink-soft/70 disabled:cursor-not-allowed">
        </div>`).join('')}

        <button type="submit" disabled
                class="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl px-6 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed"
                style="background:${MAGENTA}">
          ${esc(c.home.cta.button)}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </form>
    </div>
  </div>
</section>`;

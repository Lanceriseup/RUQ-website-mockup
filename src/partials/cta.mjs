// Breakthrough CTA. Glass treatment: full-colour photography with a frosted
// card over it — the same material as the nav capsule and the VSL frame, so
// the page closes with the language it opened with.
//
// The mission statement is deliberately not rendered. It stays in
// content.json (home.cta.mission) because it is the client's copy and belongs
// on the site — About is the obvious home — but under a signup form it
// competed with the one thing this section is for.
//
// The fields remain `disabled` even though the visible "mockup" note has been
// removed at the client's request. That is the safeguard that matters: the
// form is not wired to anything, and a disabled field cannot swallow a real
// signup. The live form posts to a Brizy handler, the Jotform routes were
// reported broken, and the plan was MOS into Ontraport — until that is
// decided, nothing here should accept input. Remove `disabled` only when the
// endpoint exists.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';

export const ctaSection = (site, c) => `
<section class="relative overflow-hidden py-24">

  <!-- Photograph stays in full colour rather than desaturated; the glass and
       the scrim do the legibility work instead of draining the image. -->
  <img src="/assets/photos/gallery-2-2.png" alt="" aria-hidden="true" loading="lazy" decoding="async"
       class="absolute inset-0 h-full w-full object-cover">
  <div aria-hidden="true" class="absolute inset-0 bg-ink/45"></div>

  <div class="relative mx-auto max-w-xl px-6">
    <div class="rounded-[2rem] p-9 ring-1 ring-white/30 shadow-[0_40px_90px_-40px_rgba(0,0,0,.8)]"
         style="background:rgba(255,255,255,.14);backdrop-filter:blur(26px) saturate(1.4);-webkit-backdrop-filter:blur(26px) saturate(1.4)">

      <h2 class="text-center font-display text-3xl font-bold leading-tight text-white sm:text-[2.5rem]">
        ${esc(c.home.cta.heading)}
      </h2>

      <form action="#" method="post" novalidate class="mt-8 space-y-4">
        ${c.home.cta.fields.map(f => `
        <div>
          <label for="cta-${esc(f.name)}" class="sr-only">${esc(f.label)}</label>
          <input id="cta-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}"
                 placeholder="${esc(f.label)}" disabled
                 class="w-full rounded-xl border border-white/25 bg-white/90 px-4 py-3.5 font-body text-ink
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

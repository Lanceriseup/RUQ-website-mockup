// Breakthrough CTA — "spotlight", from /breakthrough-options.html (option E),
// made wider and more compact.
//
// The hero in miniature: a dark rounded panel with the event photograph faint
// behind it, the heading's last word in the hero's gradient sheen, and the
// hero's own labelled dates and Register button (eventDates is the shared
// block). It replaced an info form that was wired to nothing.
//
// Compact by laying out in a row rather than a stack:
//   xl and up   heading | dates | button, one line across a wide panel
//   lg–xl       heading above, dates and button side by side beneath
//   below lg    stacked and centred
// A single row needs the width: at 1024px heading + dates + button come to
// about 1050px against 896px of panel, so it waits for xl.
//
// Light: a pink rim that fades up and down every 4 seconds — the closing
// ticket's motion in pink only (from /cta-glow-options.html, option B). It is
// .cta-panel in tailwind.css; it replaced a cyan halo.
//
// The panel is wider than the 72rem content column (84rem) so it reads as a
// band across the page rather than another box within it.
//
// Phone gutters are 12px + 16px rather than the usual 16px + 24px: the two
// labelled dates need about 320px side by side, and at 390px the usual
// gutters leave 310px, which wrapped both dates onto two lines. Below 380px
// they tighten again (8px + 12px) to hold the 320px the dates need.
import { esc } from './layout.mjs';
import { eventDates } from './hero.mjs';

const ARROW = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

// "It’s time for your breakthrough" → the last word in the sheen. Or, given
// a phrase, that phrase wherever it falls ("Your turning point starts here").
const heading = (text, phrase) => {
  const h = esc(text);
  if (phrase && h.includes(esc(phrase))) return h.replace(esc(phrase), `<span class="sheen">${esc(phrase)}</span>`);
  const i = h.lastIndexOf(' ');
  return i < 0 ? h : `${h.slice(0, i)} <span class="sheen">${h.slice(i + 1)}</span>`;
};

// The dark event panel, shared by the breakthrough CTA and the closing CTA at
// the foot of the page so the two are always the same object.
//   id      section id
//   title   heading text; `phrase` picks the words in the sheen
//   body    optional sub-line under the heading
//   pad     section padding — the breakthrough needs extra below for its
//           glow inside the clipped spread; elsewhere a symmetric pad is fine
export const eventPanel = (site, { id, title, phrase, body, pad }) => `
<section id="${esc(id)}" class="relative px-3 max-[379px]:px-2 sm:px-4 ${pad}">
  <div class="cta-panel relative mx-auto max-w-[84rem] overflow-hidden rounded-[2rem] bg-ink px-4 py-10 max-[379px]:px-3 sm:px-12 xl:py-9">
    <img src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover opacity-30">
    <!-- Darkest at the edges, so the copy at either end of the row stays on
         near-solid ink while the photograph shows through the middle. -->
    <div aria-hidden="true" class="absolute inset-0"
         style="background:radial-gradient(70% 90% at 50% 50%,rgba(28,28,28,.35),rgba(28,28,28,.92))"></div>

    <div class="relative flex flex-col items-center gap-6 text-center xl:flex-row xl:justify-between xl:gap-10 xl:text-left">
      <div class="${body ? 'xl:max-w-[26rem]' : 'xl:max-w-[21rem]'}">
        <h2 class="font-display text-[1.75rem] font-bold leading-tight text-white sm:text-4xl">${heading(title, phrase)}</h2>
        ${body ? `<p class="mt-3 font-body text-sm leading-relaxed text-white/70 sm:text-base">${esc(body)}</p>` : ''}
      </div>

      <div class="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
        ${eventDates(site)}
        <a href="${esc(site.nextEvent.ctaUrl)}" rel="noopener"
           class="group inline-flex min-h-11 shrink-0 items-center gap-3 rounded-full bg-magenta px-9 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_16px_36px_-16px_rgba(232,32,143,.9)] transition hover:bg-magenta-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta">
          ${esc(site.nextEvent.ctaText)}
          ${ARROW}
        </a>
      </div>
    </div>
  </div>
</section>`;

// No background of its own: this sits inside the spread (see spread.mjs
// "tail") and shows the spread's gradient through. The bottom padding is
// larger than the top because the panel's pink pulse reaches about 70px past
// its edge, and the overlapping panel this lives in clips at its own bottom —
// 80px lets the light fade out before that edge rather than stop on it.
export const ctaSection = (site, c) =>
  eventPanel(site, { id: 'breakthrough', title: c.home.cta.heading, pad: 'pb-20 pt-6 sm:pt-10' });

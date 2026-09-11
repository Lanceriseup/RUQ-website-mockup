// Testimonials. Two rails of portrait frames drifting in opposite directions.
//
// The section it follows is the creed band: dark, arched along the bottom.
// This returns to white, and the brand wash across the top fills the space the
// dome leaves open so the curve lands in colour rather than on bare white.
//
// Poster frames come from Wistia's oEmbed endpoint via scripts/fetch-posters.mjs
// and are served locally. Nothing here loads a third-party player until the
// visitor clicks — see videoFacade in components.mjs for the same contract.
//
// Motion rules, all handled in tailwind.css under .rail-*:
//   - transform only, so the rails composite instead of re-laying-out
//   - pointer or keyboard focus anywhere in a rail pauses it
//   - prefers-reduced-motion stops both rails and turns them into ordinary
//     horizontally scrollable strips, which is still fully usable
//
// CAPTIONS ARE MISSING. The video titles are "RUQ 2025 Testimonial 1" through
// 15. The women are identifiable in the frames and wearing name badges, but a
// badge read off a video still is not a source to caption a real person from,
// so the cards carry a duration and nothing else. First names have to come
// from the client.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';

const poster = (id) => `/assets/posters/${id}.jpg`;
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// Client copy, verbatim from the live page.
const HEADING_LEAD = 'What women have';
const HEADING_SCRIPT = 'experienced';
const HEADING_TAIL = 'at Rise Up Queens';

const card = (v, dupe = false) => `
<button type="button"${dupe ? ' aria-hidden="true" tabindex="-1"' : ''}
        class="video-facade group relative mr-5 block w-[230px] shrink-0 overflow-hidden rounded-2xl
               ring-1 ring-ink/10 shadow-[0_18px_40px_-24px_rgba(0,0,0,.6)]
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
        data-provider="wistia" data-id="${esc(v.id)}" data-title="${esc(v.title)}">
  <span class="sr-only">Play ${esc(v.title)}</span>
  <span class="relative block aspect-[4/5] w-full">
    <img src="${poster(v.id)}" alt="" aria-hidden="true" loading="lazy" decoding="async"
         class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105">
    <span aria-hidden="true" class="absolute inset-0"
          style="background:linear-gradient(to top,rgba(0,0,0,.6),transparent 50%)"></span>
    <span aria-hidden="true" class="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
      <span class="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-[0_10px_30px_-8px_rgba(0,0,0,.6)] transition group-hover:scale-110">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="${MAGENTA}"><path d="M8 5v14l11-7z"/></svg>
      </span>
    </span>
    ${v.seconds ? `
    <span aria-hidden="true" class="absolute bottom-3 left-3 rounded-full bg-black/60 px-2 py-0.5 font-body text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">${fmt(v.seconds)}</span>` : ''}
  </span>
</button>`;

const CARD_W = 230 + 20;   // w-[230px] + mr-5 (1.25rem)

// A track of two sets translated -50% only works while one set is at least as
// wide as the viewport. Five cards is 1250px, so on anything wider the rail
// would run out and leave dead space. Each set is repeated until it clears
// MIN_SET_W; 2400 plus the 96px edge fades covers every common desktop width
// including 2560, where the shortfall falls under the mask.
const MIN_SET_W = 2400;

// The spacing lives on the card (mr-5), never as a gap on the track. N cards
// duplicated leaves 2N-1 gaps, so translating -50% lands half a gap short of
// one full set and the loop jumps 20px every cycle. On the card, each set is
// exactly half the track and the wrap is invisible.
//
// The second set exists only so the loop has something to run into. Both it
// and every repeat beyond the first are the same videos, so they are hidden
// from assistive tech and taken out of the tab order — one pass through the
// ten is all a keyboard or screen reader should meet.
const rail = (items, dir, seconds) => {
  const repeats = Math.max(1, Math.ceil(MIN_SET_W / (items.length * CARD_W)));
  const set = (firstPass) => Array.from({ length: repeats }, (_, r) =>
    items.map(v => card(v, !(firstPass && r === 0))).join('')).join('');

  return `
<div class="rail relative overflow-hidden">
  <div class="rail-track flex w-max" style="animation-name:rail-${dir};animation-duration:${seconds}s">
    ${set(true)}${set(false)}
  </div>
</div>`;
};

export const testimonialsSection = (site, c, vids) => {
  const list = vids.wistia.filter(v => v.page === 'home' && /Testimonial/i.test(v.title));
  const half = Math.ceil(list.length / 2);

  return `
<section class="relative overflow-hidden bg-white pb-20 pt-16">

  <!-- Fills the curve the creed band's arch leaves open above, so the dome
       lands in a wash rather than on bare white. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-48"
       style="background:radial-gradient(70% 100% at 50% 0%,rgba(232,32,143,.14),transparent 70%),radial-gradient(50% 80% at 85% 0%,rgba(0,185,198,.14),transparent 70%)"></div>

  <div class="relative mx-auto max-w-content px-4">
    <h2 class="max-w-3xl font-display text-3xl font-bold leading-tight text-ink sm:text-[2.6rem]">
      ${esc(HEADING_LEAD)}
      <span class="script align-baseline" style="color:${MAGENTA};font-size:1.35em;line-height:.8">${esc(HEADING_SCRIPT)}</span><br>
      ${esc(HEADING_TAIL)}
    </h2>
    <p class="mt-4 font-body text-ink-soft">${list.length} testimonies from the 2025 events. Point at a rail to hold it still.</p>
  </div>

  <div class="relative mt-12 space-y-5">
    ${rail(list.slice(0, half), 'left', 64)}
    ${rail(list.slice(half), 'right', 72)}
  </div>

  <!-- The rails run past the viewport on both sides; without these they appear
       to stop mid-air at the edge. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-0 w-24" style="background:linear-gradient(to right,#fff,rgba(255,255,255,0))"></div>
  <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-0 w-24" style="background:linear-gradient(to left,#fff,rgba(255,255,255,0))"></div>
</section>`;
};

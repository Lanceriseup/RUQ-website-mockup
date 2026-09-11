// Testimonials. Two rails of portrait frames drifting in opposite directions.
//
// No wash across the top any more. That existed to fill the curve the creed
// band's arch left open; the layered wave now resolves its own join, so the
// wash was a second gradient competing with it a few pixels below.
//
// Poster frames come from Wistia's oEmbed endpoint via scripts/fetch-posters.mjs
// and are served locally. Nothing here loads a third-party player until the
// visitor clicks, and then it opens in the lightbox in app.js rather than
// inline: these cards are 230px portraits, so playing a talking head at that
// size would be pointless, and a card that became a player in place would then
// drift off the edge of the screen while it played.
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
import { renderTestimonialHeading } from './testimonial-headings.mjs';

const MAGENTA = '#e8208f';

const poster = (id) => `/assets/posters/${id}.jpg`;
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;


const card = (v, dupe = false) => `
<button type="button"${dupe ? ' aria-hidden="true" tabindex="-1"' : ''}
        data-lightbox
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

// The section ground. White at both ends so the creed band's wave dissolves
// into the top and the closing CTA's white meets the bottom; warm through the
// middle, which is the same blush the struggles spread runs.
const GROUND = 'linear-gradient(180deg,#ffffff 0%,#FDF6F1 46%,#ffffff 100%)';

// The rails run past the viewport on both sides; without these they appear to
// stop mid-air at the edge.
//
// The fade carries the section's own ground and is masked out sideways, rather
// than being a gradient to a flat colour. A flat white fade was right only
// while the section was white — against the warm middle of GROUND it would
// show as two pale columns down the sides. Masking the real ground means the
// fade matches at every height by construction.
//
// The ramp is front-loaded rather than linear: solid for the first 10% and
// most of the way gone by 45%. A straight ramp put half-strength ground over
// 48px of card, which is what read as a heavy white wash. It can afford to be
// this light because MIN_SET_W below guarantees there is never a gap in the
// track for it to hide — the only things it has to cover are the abrupt card
// edge and the orb clip at exactly x=0, and both sit in the solid part.
//
// -webkit- first: Safari before 15.4 needs the prefix and ignores the
// unprefixed property outright.
const edgeFade = (side) => {
  const dir = side === 'left' ? 'right' : 'left';
  const ramp = `linear-gradient(to ${dir},#000 0%,#000 10%,rgba(0,0,0,.28) 45%,transparent 100%)`;
  return `
<div aria-hidden="true" class="pointer-events-none absolute inset-y-0 ${side}-0 w-24"
     style="background:${GROUND};
            -webkit-mask-image:${ramp};
            mask-image:${ramp}"></div>`;
};

const CARD_W = 230 + 20;   // w-[230px] + mr-5 (1.25rem)

// A track of two sets translated -50% only works while one set is at least as
// wide as the viewport. Five cards is 1250px, so on anything wider the rail
// would run out and leave dead space. Each set is repeated until it clears
// MIN_SET_W.
//
// 2600, not the 2400 it was. The old figure leaned on the edge fades to cover
// the last ~100px at a 2560px viewport, and those fades are now far lighter —
// a gap would show straight through them. Covering the widest common desktop
// outright is the honest fix; leaning on a mask to hide a layout gap was
// always a bit of a cheat.
const MIN_SET_W = 2600;

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

// headingKey selects a treatment from testimonial-headings.mjs. Kept as a
// parameter so the options page and the live page render the same section
// rather than two lookalikes.
export const testimonialsSection = (site, c, vids, headingKey = 'verbatim') => {
  const list = vids.wistia.filter(v => v.page === 'home' && /Testimonial/i.test(v.title));
  const half = Math.ceil(list.length / 2);

  return `
<section class="relative overflow-hidden pb-28 pt-16" style="background:${GROUND}">

  <!-- Ambient brand light, the same device the struggles spread uses: a warm
       vertical ground with two heavily blurred orbs off the edges.

       Placement is not copied from the spread, because this section has far
       less ground to show it on. The two rails are ~595px of opaque poster
       cards running full bleed, leaving only the band above them and the
       bottom padding. Sitting the orbs where the spread sits them puts both
       bright centres behind the cards: the magenta still reads, because its
       upper falloff spills into the band above, but the cyan showed nothing
       at all — only its weakest lower edge, at 10% alpha, over ground that
       has already returned to white.

       So each centre is placed in ground that is actually visible: magenta
       just above the rails, cyan in the bottom pad.

       That alone is not enough, and cannot be. The wrapper is clipped at the
       section edges, and a clip only shows as a straight line if the gradient
       is still painting colour when it gets there. These orbs paint out to
       roughly 380px from their centres — 0.48 of the box for a farthest-corner
       radial, plus about 128px that blur-3xl drags past it — while their
       centres have to sit inside the 222px band above the rails or the 112px
       pad below. There is no size that satisfies both, so geometry cannot fix
       it.

       Hence the mask: the wrapper fades to nothing before it reaches either
       edge, so the clip has nothing left to cut. Ramps are placed clear of
       both centres — 9% is 84px against a magenta centre at 160px, 94% is
       873px against a cyan centre at 849px — so neither orb is dimmed by it.

       Vertical only. The left and right clips fall under the edge fades,
       which paint opaque ground at exactly x=0 and x=100%.

       -webkit- first: Safari before 15.4 needs the prefix and ignores the
       unprefixed property outright. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden"
       style="-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 9%,#000 94%,transparent 100%);
              mask-image:linear-gradient(to bottom,transparent 0%,#000 9%,#000 94%,transparent 100%)">
    <div class="absolute -left-24 -top-28 h-[34rem] w-[34rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,rgba(232,32,143,.12),transparent 68%)"></div>
    <!-- 16% rather than the spread's 10%. Cyan is the weaker hue against a
         warm ground, and this one sits at the bottom where the ground is back
         to white with nothing to lift it. -->
    <div class="absolute -right-16 -bottom-40 h-[30rem] w-[30rem] rounded-full blur-3xl"
         style="background:radial-gradient(circle,rgba(0,185,198,.16),transparent 68%)"></div>
  </div>

  <div class="relative mx-auto max-w-content px-4">
    ${renderTestimonialHeading(headingKey)}
  </div>

  <div class="relative mt-12 space-y-5">
    ${rail(list.slice(0, half), 'left', 130)}
    ${rail(list.slice(half), 'right', 150)}
  </div>

  ${edgeFade('left')}
  ${edgeFade('right')}
</section>`;
};

// Mobile treatments for the renewal photographic plate.
//
// Two separate problems, and it matters which is which.
//
// 1. THE OVERLAP IS A BUG. The plate's wrapper carries `-mt-20 lg:-mt-24`,
//    and the negative margin has no breakpoint on it — it applies at every
//    width. On desktop that is the point: the two sections are a magazine
//    spread, the plate sits in the right-hand column, and lifting it 96px
//    makes it cross the boundary between the sections while sitting beside
//    the struggles list, not on top of it.
//
//    Below lg there is no second column. The grid collapses to one, so the
//    same lift pulls the photograph straight up over the end of the list —
//    which is why item 06 is behind it. Compacting the list made this worse
//    by removing the padding that used to absorb some of the lift, but it did
//    not cause it: the overlap was always there, just lower down the item.
//
// 2. THE PLATE IS TALL. At 4:5 across a 390px phone it renders about 428px —
//    a full screen of one photograph. That is a judgement call, not a bug,
//    and it is what the options below are actually for.
//
// Option A fixes only the bug, so you can see how much of the problem is the
// overlap and how much is the size, before deciding to crop anything.
//
// All of it is BELOW-LG ONLY. The lg: values restore the shipped spread
// exactly, so the desktop magazine layout and its overlap are untouched.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const PLATE_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline, reproducing the bug. The plate is lifted 80px into the section above it at every width, and at 4:5 it is about 428px tall on a phone. Item 06 sits underneath it.',
    lift: '-mt-20 lg:-mt-24',
    aspect: 'aspect-[4/5]',
    width: '',
  },

  fix: {
    label: 'A — Fix the overlap, change nothing else',
    note: 'The negative margin becomes lg-only, so the photograph stops covering item 06 and the magazine overlap survives untouched on desktop where it belongs. The plate is still 4:5 and still about 428px tall — this option deliberately changes nothing else, so you can judge the size on its own once it is no longer sitting on the list.',
    lift: 'lg:-mt-24',
    aspect: 'aspect-[4/5]',
    width: '',
  },

  landscape: {
    label: 'B — 3:2 landscape',
    note: 'A, plus the crop turns landscape below lg: about 228px instead of 428px, a little over half. 4:5 is a portrait ratio chosen so the two plates match each other across the spread — a relationship that only exists when they are side by side, which on a phone they never are. The group shot is natively 16:9, so a landscape crop is also closer to how it was taken.',
    lift: 'lg:-mt-24',
    aspect: 'aspect-[3/2] lg:aspect-[4/5]',
    width: '',
  },

  banner: {
    label: 'C — 16:9 banner',
    note: 'The shortest crop that still shows the room: about 192px. This is the photograph\'s native ratio, so nothing is being cut that the camera did not already frame. The risk is that a wide, short band reads as a divider between sections rather than as a photograph worth looking at — and this one has about forty faces in it, which get small.',
    lift: 'lg:-mt-24',
    aspect: 'aspect-video lg:aspect-[4/5]',
    width: '',
  },

  inset: {
    label: 'D — 4:5, inset to 72%',
    note: 'Keeps the portrait crop and every face in it, and buys the height back by making the plate narrower instead — about 299px, centred, with the offset colour block still showing at the corner. The one option that compacts without cropping. It also makes the plate read as a deliberate object on the page rather than as a full-bleed band.',
    lift: 'lg:-mt-24',
    aspect: 'aspect-[4/5]',
    width: 'mx-auto w-[72%] lg:w-full',
  },

  hidden: {
    label: 'E — Hide it on mobile',
    note: 'The struggles plate above is already `hidden lg:block` — this option treats the renewal plate the same way, and the two halves become consistent. Cheapest possible answer and it removes 428px outright. But the page then carries no photograph at all between the hero and the testimonials, and this is an event people are deciding whether to attend: the room, and who is in it, is the argument.',
    lift: 'lg:-mt-24',
    aspect: 'aspect-[4/5]',
    width: 'hidden lg:block',
  },
};

// The shipped plate: an offset gradient block behind a rounded photograph. The
// block is a sibling rather than a border so it can sit proud of the corner
// without affecting the image box.
export const renderPlate = (c, modeKey) => {
  const m = PLATE_MODES[modeKey];
  return `
<section class="relative mx-auto max-w-content px-6 pb-14 lg:pb-24">
  <div class="grid gap-14 lg:grid-cols-[6fr_6fr]">
    <div class="${m.lift} ${m.width}">
      <div class="relative">
        <div aria-hidden="true" class="absolute -bottom-4 -right-4 h-full w-full rounded-[1.75rem]"
             style="background:linear-gradient(135deg,${MAGENTA},${CYAN});opacity:.16"></div>
        <img src="${esc(c.home.renewal.photo)}" alt="${esc(c.home.renewal.photoAlt)}" loading="lazy" decoding="async"
             class="relative ${m.aspect} w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]"
             style="object-position:center 32%">
      </div>
    </div>
    <div>
      <h2 class="leading-none">
        <span class="block font-display text-2xl font-bold uppercase tracking-[0.06em] text-ink-soft sm:text-[2.1rem]">Join us to experience</span>
        <span class="mt-1 block"><span class="relative inline-block">
          <span class="script block" style="color:${CYAN};font-size:3.75rem;line-height:.9">healing and renewal</span>
        </span></span>
      </h2>
      <div class="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        ${c.home.renewal.items.slice(0, 1).map(it => `
        <div class="py-7">
          <h3 class="font-display text-xl font-bold text-ink">${esc(it.title)}</h3>
          <p class="mt-2 max-w-xl font-body leading-relaxed text-ink-soft">${esc(it.body)}</p>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>`;
};

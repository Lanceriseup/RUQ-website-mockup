// Meet the Team — cards on a black-to-white ground.
//
// The gradient is the thing that shapes every other decision here. A page that
// starts black and ends white passes through mid-grey, and mid-grey is hostile
// to both white and dark text. So nothing that has to stay readable sits
// directly on the ground:
//
//   - the page heading is in the black band at the top, where white is safe
//   - every card is an opaque dark tile, so its text is white on #171717
//     regardless of how light the page is behind it
//   - the group labels sit on their own dark chip for the same reason
//   - the hairline beside each label is mid-grey, which reads against black
//     and white alike
//
// The ramp is short on purpose: solid black to 28%, fully white by 66%. A
// linear black-to-white over the whole page would leave most of it grey, and
// grey is the one value the brand palette has nothing to say against.
//
// TEN OF TWELVE PEOPLE HAVE NO BIO — only Jessica and Molly have one. That is
// why these cards carry a name and a role and nothing else: ten cards with an
// empty paragraph under them would look broken rather than sparse.
//
// The header must render in over-hero mode on this page. Its standard mode is
// white with a bottom border, which against the black top would be a white
// band across the top of the page. See pages.mjs.
import { esc } from './layout.mjs';

const CYAN = '#00b9c6';

// Black at the top, white by two thirds down, and white the rest of the way so
// the footer joins cleanly whichever footer is chosen.
const GROUND = 'linear-gradient(180deg,#101010 0%,#101010 28%,#ffffff 66%,#ffffff 100%)';

const GROUPS = [
  ['Founder', 'Founder'],
  ['Coach', 'Coaches'],
  ['Team', 'The team'],
];

// The chip is what makes this survive the gradient. Cyan on the dark chip is
// 7.68:1; the same cyan straight onto the ground would be unreadable by the
// time the page reaches white.
const groupRule = (label) => `
<div class="flex items-center gap-4">
  <span class="shrink-0 rounded-full px-3.5 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.32em]"
        style="background:#1c1c1c;color:${CYAN}">${esc(label)}</span>
  <span aria-hidden="true" class="h-px flex-1" style="background:linear-gradient(to right,rgba(140,140,140,.45),transparent)"></span>
</div>`;

const card = (m) => `
<article class="group overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_24px_50px_-30px_rgba(0,0,0,.7)] transition"
         style="background:#171717">
  <div class="overflow-hidden">
    <img src="${esc(m.photo)}" alt="${esc(m.name)}" width="600" height="800" loading="lazy" decoding="async"
         class="aspect-[3/4] w-full bg-white/5 object-cover object-top transition duration-500 group-hover:scale-[1.04]">
  </div>
  <div class="p-4">
    <h3 class="font-display text-base font-semibold leading-tight text-white">${esc(m.name)}</h3>
    <!-- white/55, not the /40 this started at. At 11px uppercase this is
         small text and needs 4.5:1 on the #171717 card; /40 measures 3.84:1
         and /45 still only 4.48:1. /55 is 6.14:1. -->
    <p class="mt-1 font-body text-[11px] uppercase tracking-[0.2em] text-white/55">${esc(m.role || '')}</p>
  </div>
</article>`;

// The header is absolutely positioned in over-hero mode, so it takes no space
// in flow and the page has to leave room for it. Its height is pt-7 (28px) plus
// the logo (h-20 = 80px, h-[5.5rem] = 88px from sm) plus the rule block
// (mt-6 + 1px + mb-5 = 45px): 153px on mobile, 161px from sm.
//
// pt-44 / sm:pt-48 clears that by 23px and 31px. Without it the heading renders
// underneath the logo, which is exactly what happened the first time.
export const teamPage = (site, c) => `
<div class="relative" style="background:${GROUND}">
  <div class="mx-auto max-w-content px-4 pb-16 pt-44 sm:pt-48">

    <!-- Heading stays inside the solid black band at the top: white type is
         only safe above the 28% stop. -->
    <div class="max-w-2xl">
      <h1 class="font-display text-3xl font-bold leading-tight text-white sm:text-[2.6rem]">${esc(c.team.heading)}</h1>
      <p class="mt-4 font-body text-lg text-white/60">${esc(c.team.lead)}</p>
    </div>

    ${GROUPS.map(([role, label]) => `
    <div class="mt-14">
      ${groupRule(label)}
      <div class="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        ${c.team.members.filter(m => m.role === role).map(card).join('')}
      </div>
    </div>`).join('')}
  </div>
</div>`;

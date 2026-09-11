// Meet the Team — collage portraits, split into Coaches and Leadership.
//
// Headings are the script treatment: the qualifier in uppercase, the group it
// names in the brush face beneath. No sub-headline — c.team.lead still exists
// in the data because pages.mjs uses it as the meta description, but it is no
// longer rendered.
//
// "RUQ Coaches" and "Leadership Team" are edits to the client's own headings
// ("Rise Up Queens Coaches" and "Leadership"); both originals are kept in
// content.json.
//
// The split is the live site's own. Six coaches, each with a biography behind
// a disclosure; six leadership, who have no biography at all. That is not a
// gap to be filled later — the live page does not have one for them either —
// so leadership is built differently rather than given an empty drawer.
//
//   coaches      portrait, name, role, and a "Read bio" disclosure
//   leadership   portrait, name, role, and nothing to open
//
// Roles and bios are verbatim from riseupqueens.com/team/ — see content.json.
// Everything here previously ran on two bios and three generic role buckets;
// the real page has twelve real titles and six real biographies.
//
// Bios open in a dialog rather than a disclosure — see bio-effects.mjs for the
// treatments. The trade that made is worth naming: a <details> opened with the
// script blocked and was keyboard-operable for nothing. A dialog has to earn
// all of that back in bio-modal.js, and the bio itself is kept in the page as
// real markup so it is still in the document if the script never runs.
//
// The header renders over this page with no scrim, so the page has to leave
// room for it: 153px tall on mobile, 161px from sm. See pages.mjs.
import { esc } from './layout.mjs';
import { renderTeamHeading } from './team-headings.mjs';
import { effectClass, BIO_EFFECTS } from './bio-effects.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
// Plum, from the ground options: black at the top so the nav sits on black,
// sinking into deep brand magenta. Both ends are dark, so it never passes
// through the mid-grey that would make white type on it unreadable.
const GROUND = 'linear-gradient(180deg,#0b0b0b 0%,#130c11 45%,#220d19 100%)';

// Spotlight, from the ground options, laid over the plum rather than instead
// of it: plum is the colour of the page, this is where the light falls on it.
// A wide pool behind the header and the page heading, gone by 72% down, so the
// top reads as a lit stage and the grids below sit in shadow.
//
// White at 14% over a near-black ground lifts it to about #232323 at the
// brightest point — enough to see, nowhere near enough to threaten white type.
const SPOTLIGHT = 'radial-gradient(120% 55% at 50% 0%,rgba(255,255,255,.14),rgba(255,255,255,.04) 40%,transparent 72%)';

// Fixed tilts, not Math.random: a random angle changes on every build, which
// turns every rebuild into a diff and makes the page impossible to review.
const TILT = [-3, 2, -1.5, 3, -2.5, 1.5, -2, 2.5, -1, 3.5, -3.5, 1];

const photo = (m) => `
<img src="${esc(m.photo)}" alt="${esc(m.name)}" width="600" height="800" loading="lazy" decoding="async"
     class="aspect-[3/4] w-full object-cover object-top">`;

// The polaroid plate. White frame, deep shadow, tilted — and straightened by
// the CSS in tailwind.css when pointed at or focused within.
const plate = (m, i) => `
<div class="polaroid-plate overflow-hidden rounded-sm bg-white p-2 pb-3 shadow-[0_24px_50px_-20px_rgba(0,0,0,.85)]">
  ${photo(m)}
</div>`;

const coach = (m, i, effect) => {
  const bioHtml = (m.bio || [])
    .map(p => `<p>${esc(p)}</p>`).join('');

  // flip needs the plate and the bio as two faces of one rotating box; every
  // other effect leaves the plate alone and opens a dialog.
  const face = effect === 'flip'
    ? `<div class="bio-flip-inner">
         <div class="bio-flip-face">${plate(m, i)}</div>
         <div class="bio-flip-back bio-flip-face" data-bio-back hidden>
           <p class="font-body text-[10px] font-bold uppercase tracking-[0.25em]" style="color:${MAGENTA}">${esc(m.role)}</p>
           <h3 class="mt-1 font-display text-base font-semibold text-white">${esc(m.name)}</h3>
           <div class="bio-modal-prose">${bioHtml}</div>
         </div>
       </div>`
    : plate(m, i);

  return `
<figure class="polaroid group mx-auto w-full max-w-[18rem]" style="--tilt:${TILT[i % TILT.length]}deg"
        data-bio-card data-bio-name="${esc(m.name)}" data-bio-role="${esc(m.role)}">
  ${face}
  <figcaption class="mt-3">
    <p class="text-center font-display text-base font-semibold leading-tight text-white">${esc(m.name)}</p>
    <p class="mt-0.5 text-center font-body text-[10px] font-bold uppercase tracking-[0.25em]" style="color:${MAGENTA}">${esc(m.role)}</p>

    ${m.bio ? `
    <div class="mt-3 flex justify-center">
      <button type="button" data-bio-open aria-expanded="false"
              class="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-[10px] font-bold uppercase
                     tracking-[0.2em] text-white/70 ring-1 ring-white/20 transition hover:text-white hover:ring-white/40
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta">
        Read bio
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </div>

    <!-- The bio lives here, in the page, whether the dialog ever opens or not.
         The dialog clones it. Hidden rather than absent so it is still in the
         document for search and for anything reading the markup. -->
    ${effect === 'flip' ? '' : `<div data-bio-content hidden>${bioHtml}</div>`}` : ''}
  </figcaption>
</figure>`;
};

// No disclosure. Leadership have no biography on the live site either, so an
// empty drawer would advertise a gap that is not there.
const leader = (m, i) => `
<figure class="polaroid group mx-auto w-full max-w-[18rem]" style="--tilt:${TILT[(i + 5) % TILT.length]}deg">
  ${plate(m, i)}
  <figcaption class="mt-3 text-center">
    <p class="font-display text-base font-semibold leading-tight text-white">${esc(m.name)}</p>
    <p class="mt-0.5 font-body text-[10px] font-bold uppercase tracking-[0.25em]" style="color:${CYAN}">${esc(m.role)}</p>
  </figcaption>
</figure>`;

export const teamPage = (site, c, headingKey = 'script', effect = 'scale') => {
  const coaches = c.team.members.filter(m => m.group === 'coach');
  const leaders = c.team.members.filter(m => m.group === 'leadership');

  return `
<div class="relative ${effectClass(effect)}" style="background:${GROUND}">

  <!-- Decoration only, and unclipped: the pool fades to transparent well
       before the foot of the page, so there is no edge for anything to cut. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:${SPOTLIGHT}"></div>

  <div class="relative mx-auto max-w-content px-4 pb-20 pt-44 sm:pt-48">

    ${renderTeamHeading(headingKey, c.team.heading, { tag: 'h1', count: coaches.length })}

    <!-- Explicit 3-up, not flex-wrap. Six people fall into 3x2 at lg either
         way, but wrapping decides that from the container width and silently
         becomes 4-up or 2-up when anything around it changes.

         items-start, not stretch: an open bio makes one figure much taller
         than its neighbours, and a stretched row would drag the others with it. -->
    <div class="mt-16 grid items-start gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      ${coaches.map((m, i) => coach(m, i, effect)).join('')}
    </div>

    <div class="mt-24">
      ${renderTeamHeading(headingKey, c.team.groups.find(g => g.key === 'leadership').heading, { tag: 'h2', colour: CYAN, count: leaders.length })}
      <!-- Same grid as the coaches above: six people, 3x2, same plate size.
           They differ in what they carry, not in how big they are. -->
      <div class="mt-12 grid items-start gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        ${leaders.map(leader).join('')}
      </div>
    </div>
  </div>
</div>`;
};

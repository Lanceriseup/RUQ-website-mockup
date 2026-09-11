// Meet the Team — collage portraits, split into Coaches and Leadership.
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
// The disclosure is <details>/<summary>, not a JS accordion. It opens with the
// script blocked, it is keyboard-operable for free, and Ctrl+F finds text
// inside a closed one in browsers that support hidden=until-found.
//
// The header renders over this page with no scrim, so the page has to leave
// room for it: 153px tall on mobile, 161px from sm. See pages.mjs.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
const GROUND = '#0d0d0d';

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

const coach = (m, i) => `
<figure class="polaroid group w-[16rem] sm:w-[17rem]" style="--tilt:${TILT[i % TILT.length]}deg">
  ${plate(m, i)}
  <figcaption class="mt-3">
    <p class="text-center font-display text-base font-semibold leading-tight text-white">${esc(m.name)}</p>
    <p class="mt-0.5 text-center font-body text-[10px] font-bold uppercase tracking-[0.25em]" style="color:${MAGENTA}">${esc(m.role)}</p>

    ${m.bio ? `
    <details class="group/d mt-3">
      <summary class="flex cursor-pointer list-none items-center justify-center gap-1.5 rounded-full px-3 py-1.5
                      font-body text-[10px] font-bold uppercase tracking-[0.2em] text-white/70
                      ring-1 ring-white/20 transition hover:text-white hover:ring-white/40
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta">
        <span class="group-open/d:hidden">Read bio</span>
        <span class="hidden group-open/d:inline">Close</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
             class="transition group-open/d:rotate-180"><path d="M6 9l6 6 6-6"/></svg>
      </summary>
      <!-- The plate above is tilted; this is not. A rotated column of body
           copy is unreadable, and un-rotating it inside the tilted parent
           would need a counter-transform that fights the hover. -->
      <div class="mt-3 rounded-xl p-4 text-left ring-1 ring-white/10" style="background:#171717">
        ${m.bio.map(p => `<p class="font-body text-[13px] leading-relaxed text-white/75 [&+p]:mt-3">${esc(p)}</p>`).join('')}
      </div>
    </details>` : ''}
  </figcaption>
</figure>`;

// No disclosure. Leadership have no biography on the live site either, so an
// empty drawer would advertise a gap that is not there.
const leader = (m, i) => `
<figure class="polaroid group w-[11rem] sm:w-[12rem]" style="--tilt:${TILT[(i + 5) % TILT.length]}deg">
  ${plate(m, i)}
  <figcaption class="mt-3 text-center">
    <p class="font-display text-sm font-semibold leading-tight text-white">${esc(m.name)}</p>
    <p class="mt-0.5 font-body text-[9px] font-bold uppercase tracking-[0.22em]" style="color:${CYAN}">${esc(m.role)}</p>
  </figcaption>
</figure>`;

const sectionHead = (heading, sub) => `
<div class="text-center">
  <h2 class="font-display text-2xl font-bold text-white sm:text-[2rem]">${esc(heading)}</h2>
  ${sub ? `<p class="mx-auto mt-3 max-w-xl font-body text-sm text-white/50">${esc(sub)}</p>` : ''}
  <span aria-hidden="true" class="mx-auto mt-6 block h-px w-24" style="background:linear-gradient(to right,transparent,${MAGENTA},transparent)"></span>
</div>`;

export const teamPage = (site, c) => {
  const coaches = c.team.members.filter(m => m.group === 'coach');
  const leaders = c.team.members.filter(m => m.group === 'leadership');

  return `
<div class="relative" style="background:${GROUND}">
  <div class="mx-auto max-w-content px-4 pb-20 pt-44 sm:pt-48">

    <div class="mx-auto max-w-2xl text-center">
      <h1 class="font-display text-3xl font-bold leading-tight text-white sm:text-[2.7rem]">${esc(c.team.heading)}</h1>
      <p class="mt-4 font-body text-lg text-white/60">${esc(c.team.lead)}</p>
    </div>

    <!-- items-start, not items-center: an open bio makes one figure much taller
         than its neighbours, and centred items would shunt the whole row. -->
    <div class="mt-16 flex flex-wrap items-start justify-center gap-x-8 gap-y-14">
      ${coaches.map(coach).join('')}
    </div>

    <div class="mt-24">
      ${sectionHead(c.team.groups.find(g => g.key === 'leadership').heading)}
      <div class="mt-12 flex flex-wrap items-start justify-center gap-x-8 gap-y-12">
        ${leaders.map(leader).join('')}
      </div>
    </div>
  </div>
</div>`;
};

// Compact mobile treatments for the Meet the Team page.
//
// Measured at 390px the page is 6806px — about ten phone screens — for twelve
// people. The grid is `sm:grid-cols-2 lg:grid-cols-3`, so below sm it is ONE
// column of 288px polaroid plates at 3:4, each card 471px tall including its
// caption. Twelve of those plus two headings is the whole page.
//
// The single biggest lever is the column count. There is no reason a 390px
// phone has to show one 288px card per row: two 170px cards fit comfortably
// side by side, a face is still perfectly readable at that size, and it halves
// the number of rows outright.
//
// The second lever is that the two groups are not the same thing:
//
//   coaches      portrait, name, role, and a bio behind a "Read bio" button
//   leadership   portrait, name, role, and nothing to open
//
// They are currently built at identical size. Six cards of equal weight for
// people with no biography is a lot of page for a roster, and options B and C
// treat leadership as what it is.
//
// All options are MOBILE ONLY — every class is paired with an sm: value
// restoring the shipped grid, so the two- and three-up desktop layouts cannot
// move.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
export const GROUND = 'linear-gradient(180deg,#0b0b0b 0%,#130c11 45%,#220d19 100%)';
const SPOTLIGHT = 'radial-gradient(120% 55% at 50% 0%,rgba(255,255,255,.14),rgba(255,255,255,.04) 40%,transparent 72%)';
const TILT = [-3, 2, -1.5, 3, -2.5, 1.5, -2, 2.5, -1, 3.5, -3.5, 1];

export const TEAM_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline: one column below sm, 288px plates at 3:4, each card 471px tall. Twelve of them makes 6806px.',
    cols: 'sm:grid-cols-2 lg:grid-cols-3', cardMax: 'max-w-[18rem]',
    gapX: 'gap-x-8', gapY: 'gap-y-9 sm:gap-y-14', leadership: 'cards', tilt: true,
  },

  twoUp: {
    label: 'A — Two-up on phones',
    note: 'The grid becomes two columns below sm instead of one, with the horizontal gap tightened to suit. Cards land at about 165px wide — still a clearly readable face, and a polaroid at that size reads as a contact sheet, which is arguably more appropriate for twelve people than twelve large single portraits. Halves the rows for both groups and changes nothing else.',
    cols: 'grid-cols-2 lg:grid-cols-3', cardMax: 'max-w-[18rem]',
    gapX: 'gap-x-3 sm:gap-x-8', gapY: 'gap-y-6 sm:gap-y-14', leadership: 'cards', tilt: true,
  },

  roster: {
    label: 'B — A, leadership as a roster',
    note: 'A for the coaches, who carry biographies and earn their plates. Leadership becomes a roster below sm: a small square portrait beside the name and role, one person per row. Six rows of 64px instead of six plates of 428px. They keep their faces and their titles — what they give up is equal billing with people who have a biography to open.',
    cols: 'grid-cols-2 lg:grid-cols-3', cardMax: 'max-w-[18rem]',
    gapX: 'gap-x-3 sm:gap-x-8', gapY: 'gap-y-6 sm:gap-y-14', leadership: 'roster', tilt: true,
  },

  textList: {
    label: 'C — A, leadership as names only',
    note: 'A, with leadership reduced below sm to a two-column list of names and titles — no portraits at all. The shortest by a distance. Be clear about what it costs: these are the people who run the events, and a name in a list is a credit rather than an introduction. Worth it only if the page is judged to be about the coaches, with leadership present for completeness.',
    cols: 'grid-cols-2 lg:grid-cols-3', cardMax: 'max-w-[18rem]',
    gapX: 'gap-x-3 sm:gap-x-8', gapY: 'gap-y-6 sm:gap-y-14', leadership: 'names', tilt: true,
  },

  noTilt: {
    label: 'D — A, without the tilt on phones',
    note: 'A, with the polaroid tilt switched off below sm. Worth seeing side by side with A: at 288px a 3-degree rotation reads as a photograph dropped on a table, but at 165px in a two-up grid the same angle eats into the gap between neighbours and the two cards start to look misaligned rather than scattered. No height difference — this is purely whether the device survives the smaller size.',
    cols: 'grid-cols-2 lg:grid-cols-3', cardMax: 'max-w-[18rem]',
    gapX: 'gap-x-3 sm:gap-x-8', gapY: 'gap-y-6 sm:gap-y-14', leadership: 'cards', tilt: false,
  },
};

const photo = (m) => `
<img src="${esc(m.photo)}" alt="${esc(m.name)}" width="600" height="800" loading="lazy" decoding="async"
     class="aspect-[3/4] w-full object-cover object-top">`;

const plate = (m) => `
<div class="polaroid-plate overflow-hidden rounded-sm bg-white p-1.5 pb-2 shadow-[0_24px_50px_-20px_rgba(0,0,0,.85)] sm:p-2 sm:pb-3">
  ${photo(m)}
</div>`;

const figure = (m, i, m2, colour, withBio) => `
<figure class="polaroid group mx-auto w-full ${m2.cardMax}" style="--tilt:${m2.tilt ? TILT[i % TILT.length] : 0}deg">
  ${plate(m)}
  <figcaption class="mt-2 sm:mt-3">
    <p class="text-center font-display text-[13px] font-semibold leading-tight text-white sm:text-base">${esc(m.name)}</p>
    <p class="mt-0.5 text-center font-body text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px] sm:tracking-[0.25em]" style="color:${colour}">${esc(m.role)}</p>
    ${withBio ? `
    <button type="button" class="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full px-2 py-1 font-body text-[9px] font-bold uppercase tracking-[0.15em] text-white/70 ring-1 ring-white/20 sm:mt-3 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.2em]">
      Read bio
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </button>` : ''}
  </figcaption>
</figure>`;

// Leadership, compacted. Both alternatives are below-sm only and sit beside a
// `hidden sm:grid` copy of the real cards, so from sm up the page is identical.
const rosterRow = (m) => `
<li class="flex items-center gap-3 border-b border-white/10 py-2.5">
  <img src="${esc(m.photo)}" alt="" aria-hidden="true" width="600" height="800" loading="lazy" decoding="async"
       class="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/20" style="object-position:50% 18%">
  <span class="min-w-0">
    <span class="block font-display text-[13px] font-semibold leading-tight text-white">${esc(m.name)}</span>
    <span class="block font-body text-[9px] font-bold uppercase tracking-[0.2em]" style="color:${CYAN}">${esc(m.role)}</span>
  </span>
</li>`;

const nameRow = (m) => `
<li class="border-b border-white/10 py-2">
  <span class="block font-display text-[13px] font-semibold leading-tight text-white">${esc(m.name)}</span>
  <span class="block font-body text-[9px] font-bold uppercase tracking-[0.2em]" style="color:${CYAN}">${esc(m.role)}</span>
</li>`;

const heading = (text, colour, tag = 'h2') => `
<${tag} class="text-center leading-none">
  <span class="script block" style="color:${colour};font-size:clamp(2rem,10vw,3.5rem);line-height:.95;white-space:nowrap">${esc(text)}</span>
</${tag}>`;

export const renderTeam = (c, modeKey) => {
  const m = TEAM_MODES[modeKey];
  const coaches = c.team.members.filter(x => x.group === 'coach');
  const leaders = c.team.members.filter(x => x.group === 'leadership');

  const leadershipBlock = m.leadership === 'cards'
    ? `<div class="mt-6 grid items-start ${m.gapX} ${m.gapY} ${m.cols} sm:mt-12">
         ${leaders.map((x, i) => figure(x, i + 5, m, CYAN, false)).join('')}
       </div>`
    : `<ul class="mt-5 sm:hidden ${m.leadership === 'names' ? 'grid grid-cols-2 gap-x-4' : ''}">
         ${leaders.map(m.leadership === 'roster' ? rosterRow : nameRow).join('')}
       </ul>
       <div class="mt-6 hidden items-start ${m.gapX} ${m.gapY} ${m.cols} sm:mt-12 sm:grid">
         ${leaders.map((x, i) => figure(x, i + 5, m, CYAN, false)).join('')}
       </div>`;

  return `
<div id="team" class="relative" style="background:${GROUND}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:${SPOTLIGHT}"></div>
  <div class="relative mx-auto max-w-content px-4 pb-10 pt-8 sm:pb-20 sm:pt-16">
    ${heading('RUQ Coaches', MAGENTA, 'h1')}
    <div class="mt-6 grid items-start ${m.gapX} ${m.gapY} ${m.cols} sm:mt-16">
      ${coaches.map((x, i) => figure(x, i, m, MAGENTA, true)).join('')}
    </div>
    <div class="mt-10 sm:mt-24">
      ${heading('Leadership Team', CYAN)}
      ${leadershipBlock}
    </div>
  </div>
</div>`;
};

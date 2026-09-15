// Meet the Team — fresh layouts and fresh grounds, as two levers.
//
// The brief on the ground is "black at the top, so the nav sits on black".
// Every ground below does that. Five of the six also STAY dark, which is what
// makes the layouts free: white type is safe anywhere on the page, so a layout
// can put a name straight onto the ground instead of onto a tile.
//
// The exception is `fadeWhite`, the one shipped now. It is kept for
// comparison only, and it does not work with ANY of these six: every one of
// them sets a name or a caption directly on the ground — in a heading, a
// figcaption or a list row — and all of those go unreadable as the page
// passes through grey. Pairing it with a new layout would need the tile-and-
// chip discipline the shipped cards layout uses.
//
// Content facts that still hold and still shape things:
//   - ten of twelve people have no bio
//   - roles are three buckets: Founder, Coach, Team
//   - the page heading says "Coaches" while half the list is not
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

// ---------------------------------------------------------------- grounds

export const TEAM_GROUNDS = {
  fadeWhite: {
    label: 'Black to white — what is there now',
    note: 'Kept for comparison. The only ground here that goes light, and therefore the only one that limits which layouts work: anything setting type straight onto it disappears as the page passes through grey.',
    endsLight: true,
    style: 'background:linear-gradient(180deg,#101010 0%,#101010 28%,#ffffff 66%,#ffffff 100%)',
  },
  solid: {
    label: 'Solid — near-black the whole way down',
    note: 'One colour, no event. The nav sits on black, the portraits sit on black, and nothing competes with twelve faces. The quietest option and the hardest to get wrong.',
    style: 'background:#0d0d0d',
  },
  charcoal: {
    label: 'Charcoal — black easing into warm grey',
    note: 'Black at the top settling into a warm charcoal by the foot of the page. Stays dark throughout, so it never hits the muddy mid-grey the white fade passes through, but the page is not flat either.',
    style: 'background:linear-gradient(180deg,#0b0b0b 0%,#141312 45%,#1d1a18 100%)',
  },
  orbs: {
    label: 'Orbs — black with brand light bleeding in',
    note: 'Solid black with two large blurred brand fields, magenta high on the left and cyan low on the right. The only ground that puts brand colour on the page without tinting the photographs.',
    style: 'background:#0b0b0b',
    decoration: `
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden"
         style="-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 10%,#000 90%,transparent 100%);
                mask-image:linear-gradient(to bottom,transparent 0%,#000 10%,#000 90%,transparent 100%)">
      <div class="absolute -left-32 top-[18%] h-[40rem] w-[40rem] rounded-full blur-3xl"
           style="background:radial-gradient(circle,rgba(232,32,143,.20),transparent 68%)"></div>
      <div class="absolute -right-24 bottom-[8%] h-[34rem] w-[34rem] rounded-full blur-3xl"
           style="background:radial-gradient(circle,rgba(0,185,198,.18),transparent 68%)"></div>
    </div>`,
  },
  spotlight: {
    label: 'Spotlight — lit at the top, falling away',
    note: 'A wide pool of light behind the heading that falls off down the page, so the top reads as a stage and the grid below sits in shadow. Gives the page a direction without changing colour.',
    style: 'background:#0a0a0a',
    decoration: `
    <div aria-hidden="true" class="pointer-events-none absolute inset-0"
         style="background:radial-gradient(120% 55% at 50% 0%,rgba(255,255,255,.14),rgba(255,255,255,.04) 40%,transparent 72%)"></div>`,
  },
  plum: {
    label: 'Plum — black sinking into deep brand magenta',
    note: 'Black at the top going to a very dark plum at the foot. Brand-coloured rather than neutral, and because both ends are dark it never passes through grey. Warmest of the six against these amber-lit portraits.',
    style: 'background:linear-gradient(180deg,#0b0b0b 0%,#130c11 45%,#220d19 100%)',
  },
};

// ---------------------------------------------------------------- layouts

export const TEAM_LAYOUTS = {
  index: {
    label: 'Index — names at display size, portrait on hover',
    note: 'Twelve names set large, one per line, with the portrait appearing beside them as you move down the list. Photography becomes the reward rather than the content. The most striking of the six and the best answer to ten missing bios, because it never implies anything is supposed to be there.',
  },
  bands: {
    label: 'Bands — full-width rows, alternating',
    note: 'One row per person running the full width: a wide crop of the portrait on one side, the name at display size on the other, sides swapping down the page. Magazine rather than directory. Costs the most height by a distance.',
  },
  filmstrip: {
    label: 'Filmstrip — a scrolling rail per group',
    note: 'Each group becomes a horizontal rail you push sideways, rather than a grid that wraps. Keeps the whole page short whatever the headcount, and makes the three groups read as three separate things.',
  },
  collage: {
    label: 'Collage — portraits pinned at angles',
    note: 'Loosely scattered and slightly rotated, straightening as you point at them. The least corporate option by some way and the one that best matches an event whose photographs are all balloons and crowns.',
  },
  numbered: {
    label: 'Numbered — a directory with oversized numerals',
    note: 'Every person gets an index number set larger than their name, with a small portrait alongside. Typographic and orderly; reads as a masthead. Works in two columns, so it stays compact.',
  },
  stage: {
    label: 'Stage — one large portrait, thumbnails beneath',
    note: 'One person shown big with their name and role, and the rest as a thumbnail rail you click through. The only option that gives any individual real presence, and the only one needing JavaScript.',
  },
};

// ------------------------------------------------------------------ parts

const GROUPS = [['Founder', 'Founder'], ['Coach', 'Coaches'], ['Team', 'The team']];
const byRole = (c, role) => c.team.members.filter(m => m.role === role);

const img = (m, cls) => `
<img src="${esc(m.photo)}" alt="${esc(m.name)}" width="600" height="800" loading="lazy" decoding="async" class="${cls}">`;

const groupLabel = (label) => `
<div class="flex items-center gap-4">
  <span class="shrink-0 font-body text-[11px] font-bold uppercase tracking-[0.4em]" style="color:${CYAN}">${esc(label)}</span>
  <span aria-hidden="true" class="h-px flex-1" style="background:linear-gradient(to right,rgba(255,255,255,.2),transparent)"></span>
</div>`;

// Header clearance. In over-hero mode the header is absolutely positioned and
// takes no space: 73px tall on mobile, 161px from sm. pt-24/sm:pt-48 clears it.
const HEAD_PAD = 'pb-16 pt-24 sm:pt-48';

const pageHead = (c, align = 'left') => `
<div class="${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}">
  <h1 class="font-display text-3xl font-bold leading-tight text-white sm:text-[2.7rem]">${esc(c.team.heading)}</h1>
  <p class="mt-4 font-body text-lg text-white/60">${esc(c.team.lead)}</p>
</div>`;

// ---------------------------------------------------------------- renders

const LAYOUTS = {
  index: (site, c) => `
<div class="mx-auto max-w-content px-4 ${HEAD_PAD}">
  ${pageHead(c)}
  ${GROUPS.map(([role, label]) => `
  <div class="mt-14">
    ${groupLabel(label)}
    <ul class="mt-2">
      ${byRole(c, role).map(m => `
      <li class="group relative border-b border-white/10">
        <div class="flex items-center gap-5 py-5">
          <!-- Small portrait always present. The large reveal below is
               hover-only, and on a touch screen hover never happens — without
               this, a phone would see no photographs at all. -->
          <span class="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15 lg:hidden">
            ${img(m, 'h-full w-full object-cover object-top')}
          </span>
          <span class="min-w-0 flex-1 font-display text-2xl font-bold leading-tight text-white transition group-hover:opacity-60 sm:text-[2.4rem] lg:text-[3rem]">${esc(m.name)}</span>
          <span class="shrink-0 font-body text-[11px] uppercase tracking-[0.25em] text-white/40">${esc(m.role || '')}</span>
        </div>
        <span aria-hidden="true"
              class="pointer-events-none absolute right-[18%] top-1/2 hidden h-56 w-44 -translate-y-1/2 rotate-2 overflow-hidden rounded-xl opacity-0 shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)] transition duration-300 group-hover:opacity-100 lg:block">
          ${img(m, 'h-full w-full object-cover object-top')}
        </span>
      </li>`).join('')}
    </ul>
  </div>`).join('')}
</div>`,

  bands: (site, c) => `
<div class="${HEAD_PAD}">
  <div class="mx-auto max-w-content px-4">${pageHead(c)}</div>
  <div class="mt-14">
    ${c.team.members.map((m, i) => `
    <article class="group border-t border-white/10">
      <div class="mx-auto flex max-w-content flex-col items-center gap-6 px-4 py-6 sm:flex-row ${i % 2 ? 'sm:flex-row-reverse' : ''}">
        <div class="w-full overflow-hidden rounded-xl sm:w-64 lg:w-80">
          ${img(m, 'aspect-[16/9] w-full object-cover object-top transition duration-500 group-hover:scale-105 sm:aspect-[4/3]')}
        </div>
        <div class="min-w-0 flex-1 ${i % 2 ? 'sm:text-right' : ''}">
          <h3 class="font-display text-2xl font-bold leading-tight text-white sm:text-[2.2rem]">${esc(m.name)}</h3>
          <p class="mt-2 font-body text-[11px] uppercase tracking-[0.3em]" style="color:${CYAN}">${esc(m.role || '')}</p>
          ${m.bio ? `<p class="mt-3 max-w-lg font-body text-sm leading-relaxed text-white/60 ${i % 2 ? 'sm:ml-auto' : ''}">${esc(m.bio)}</p>` : ''}
        </div>
      </div>
    </article>`).join('')}
    <div class="border-t border-white/10"></div>
  </div>
</div>`,

  filmstrip: (site, c) => `
<div class="${HEAD_PAD}">
  <div class="mx-auto max-w-content px-4">${pageHead(c)}</div>
  ${GROUPS.map(([role, label]) => `
  <div class="mt-12">
    <div class="mx-auto max-w-content px-4">${groupLabel(label)}</div>
    <!-- scroll-snap, not a carousel: no JS, no state, and a trackpad or a
         thumb already knows how to drive it. -->
    <div class="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
         style="scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.25) transparent">
      ${byRole(c, role).map(m => `
      <figure class="w-52 shrink-0 snap-start sm:w-60">
        <div class="overflow-hidden rounded-xl ring-1 ring-white/10">
          ${img(m, 'aspect-[3/4] w-full object-cover object-top')}
        </div>
        <figcaption class="mt-3">
          <p class="font-display text-base font-semibold leading-tight text-white">${esc(m.name)}</p>
          <p class="mt-1 font-body text-[10px] uppercase tracking-[0.25em] text-white/50">${esc(m.role || '')}</p>
        </figcaption>
      </figure>`).join('')}
    </div>
  </div>`).join('')}
</div>`,

  collage: (site, c) => {
    // Fixed rotations, not random: a random tilt changes on every build, which
    // turns every rebuild into a diff and makes the page impossible to review.
    const tilt = [-3, 2, -1.5, 3, -2.5, 1.5, -2, 2.5, -1, 3.5, -3.5, 1];
    return `
<div class="mx-auto max-w-content px-4 ${HEAD_PAD}">
  ${pageHead(c, 'center')}
  <div class="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-12">
    ${c.team.members.map((m, i) => `
    <figure class="group w-40 transition duration-500 sm:w-48" style="transform:rotate(${tilt[i % tilt.length]}deg)"
            onmouseover="this.style.transform='rotate(0deg)'" onmouseout="this.style.transform='rotate(${tilt[i % tilt.length]}deg)'">
      <div class="overflow-hidden rounded-sm bg-white p-2 pb-8 shadow-[0_24px_50px_-20px_rgba(0,0,0,.85)]">
        ${img(m, 'aspect-[3/4] w-full object-cover object-top')}
      </div>
      <figcaption class="mt-3 text-center">
        <p class="font-display text-sm font-semibold leading-tight text-white">${esc(m.name)}</p>
        <p class="mt-0.5 font-body text-[10px] uppercase tracking-[0.2em] text-white/50">${esc(m.role || '')}</p>
      </figcaption>
    </figure>`).join('')}
  </div>
</div>`;
  },

  numbered: (site, c) => `
<div class="mx-auto max-w-5xl px-4 ${HEAD_PAD}">
  ${pageHead(c)}
  <div class="mt-14 grid gap-x-12 gap-y-2 sm:grid-cols-2">
    ${c.team.members.map((m, i) => `
    <div class="group flex items-center gap-4 border-b border-white/10 py-4">
      <span aria-hidden="true" class="w-12 shrink-0 font-display text-3xl font-extrabold leading-none tabular-nums text-white/15 transition group-hover:text-white/35">${String(i + 1).padStart(2, '0')}</span>
      <span class="h-14 w-11 shrink-0 overflow-hidden rounded ring-1 ring-white/10">
        ${img(m, 'h-full w-full object-cover object-top')}
      </span>
      <span class="min-w-0 flex-1">
        <span class="block truncate font-display text-base font-semibold text-white">${esc(m.name)}</span>
        <span class="block font-body text-[10px] uppercase tracking-[0.25em] text-white/50">${esc(m.role || '')}</span>
      </span>
    </div>`).join('')}
  </div>
</div>`,

  stage: (site, c) => {
    const first = c.team.members[0];
    return `
<div class="mx-auto max-w-content px-4 ${HEAD_PAD}" data-stage>
  ${pageHead(c)}
  <div class="mt-14 grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-center">
    <div class="overflow-hidden rounded-2xl ring-1 ring-white/10">
      <img data-stage-img src="${esc(first.photo)}" alt="${esc(first.name)}" width="600" height="800"
           loading="eager" decoding="async" class="aspect-[3/4] w-full object-cover object-top">
    </div>
    <div>
      <p data-stage-role class="font-body text-[11px] font-bold uppercase tracking-[0.4em]" style="color:${MAGENTA}">${esc(first.role || '')}</p>
      <h2 data-stage-name class="mt-4 font-display text-3xl font-bold text-white sm:text-5xl">${esc(first.name)}</h2>
      <p data-stage-bio class="mt-5 max-w-xl font-body text-lg leading-relaxed text-white/70">${esc(first.bio || '')}</p>
    </div>
  </div>

  <div class="mt-10 flex flex-wrap gap-3">
    ${c.team.members.map((m, i) => `
    <button type="button" data-stage-pick
            data-photo="${esc(m.photo)}" data-name="${esc(m.name)}" data-role="${esc(m.role || '')}" data-bio="${esc(m.bio || '')}"
            aria-label="Show ${esc(m.name)}"
            class="h-16 w-12 overflow-hidden rounded ring-1 ring-white/15 transition hover:ring-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta${i === 0 ? ' ring-2' : ''}"
            style="${i === 0 ? '--tw-ring-color:' + MAGENTA : ''}">
      ${img(m, 'h-full w-full object-cover object-top')}
    </button>`).join('')}
  </div>

  <script>
  (function () {
    var root = document.currentScript.closest('[data-stage]');
    var img = root.querySelector('[data-stage-img]');
    var name = root.querySelector('[data-stage-name]');
    var role = root.querySelector('[data-stage-role]');
    var bio = root.querySelector('[data-stage-bio]');
    var picks = [].slice.call(root.querySelectorAll('[data-stage-pick]'));
    picks.forEach(function (b) {
      b.addEventListener('click', function () {
        img.src = b.dataset.photo;
        img.alt = b.dataset.name;
        name.textContent = b.dataset.name;
        role.textContent = b.dataset.role;
        // Ten of twelve have no bio. Empty rather than a placeholder, so the
        // gap is obvious to whoever has to fill it in.
        bio.textContent = b.dataset.bio;
        picks.forEach(function (o) { o.classList.remove('ring-2'); o.style.removeProperty('--tw-ring-color'); });
        b.classList.add('ring-2');
        b.style.setProperty('--tw-ring-color', '${MAGENTA}');
      });
    });
  })();
  </script>
</div>`;
  },
};

export const renderTeamIdea = (site, c, layoutKey = 'index', groundKey = 'solid') => {
  const g = TEAM_GROUNDS[groundKey] ?? TEAM_GROUNDS.solid;
  const l = LAYOUTS[layoutKey] ?? LAYOUTS.index;
  return `
<div class="relative min-h-screen" style="${g.style}">
  ${g.decoration ?? ''}
  <div class="relative">${l(site, c)}</div>
</div>`;
};

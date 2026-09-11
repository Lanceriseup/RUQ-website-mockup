// Meet the Team — dark-themed page options.
//
// Three things about the content shape every option here:
//
// 1. TEN OF TWELVE HAVE NO BIO. Only Jessica and Molly have one. Any layout
//    built around biography would be ten empty cards, so most options below
//    use name and role only, and the one that does show bios shows them for
//    the two people who have them and says so.
//
// 2. ROLES ARE THREE BUCKETS. Founder (1), Coach (5), Team (6) — nothing more
//    granular exists. That is enough to group by and not enough to caption
//    individually.
//
// 3. THE HEADING DOES NOT MATCH THE LIST. content.json calls this page "Rise
//    Up Queens Coaches", but half the people on it are Team rather than
//    coaches, and two are men. Options that group by role make that visible
//    rather than papering over it; the heading itself is client copy and is
//    left alone.
//
// The photographs are already dark — warm amber light on a near-black ground —
// which is why a dark page works here at all. What varies between options is
// how much they are unified: left alone they are warm against a brand palette
// that is magenta and cyan, so several options treat them.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
const DARK = '#101010';

export const TEAM_OPTIONS = {
  wall: {
    label: 'Wall — edge-to-edge mosaic, no gaps',
    note: 'Twelve portraits butted together with no gutters, names overlaid along the bottom of each. Desaturated by default and clearing to full colour under the pointer, which unifies twelve photographs of varying warmth into one surface. The boldest option and the one that reads as a group rather than a list of individuals.',
  },
  feature: {
    label: 'Feature — the founder large, then the groups',
    note: 'Jessica gets a half-page portrait with her bio beside it, then Coaches five-up and Team six-up beneath, each behind a small-caps rule. The only option that uses the two bios that exist. Most conventional, and the easiest to extend when the other ten arrive.',
  },
  roster: {
    label: 'Roster — a typographic index',
    note: 'Rows rather than cards: a small round portrait, the name set large, the role at the right, a hairline between. Photography is incidental. By far the best option while ten bios are missing, because it never leaves a space where a bio should be.',
  },
  cards: {
    label: 'Cards — dark tiles with a rim light',
    note: 'Rounded portrait tiles on a near-black ground, name and role beneath, a brand rim lighting up under the pointer. The safest of the six and the closest to what the page is now, just inverted and tightened.',
  },
  stagger: {
    label: 'Stagger — an offset grid with ambient light',
    note: 'The same tiles with every second column pushed down, over two large blurred brand orbs. The offset stops twelve portraits reading as a spreadsheet. Most designed of the six.',
  },
  circles: {
    label: 'Circles — round portraits, generous space',
    note: 'Large circular crops in a loose grid, names centred beneath. Softer and warmer than any rectangular option, and the one that reads least like a corporate team page. Costs the most vertical space.',
  },
};

// ------------------------------------------------------------------ parts

const GROUPS = [
  ['Founder', 'Founder'],
  ['Coach', 'Coaches'],
  ['Team', 'The team'],
];

const byRole = (c, role) => c.team.members.filter(m => m.role === role);

const photo = (m, cls, extra = '') => `
<img src="${esc(m.photo)}" alt="${esc(m.name)}" width="600" height="800" loading="lazy" decoding="async"
     class="${cls}" ${extra}>`;

const groupRule = (label) => `
<div class="flex items-center gap-4">
  <span class="shrink-0 font-body text-[11px] font-bold uppercase tracking-[0.4em]" style="color:${CYAN}">${esc(label)}</span>
  <span aria-hidden="true" class="h-px flex-1" style="background:linear-gradient(to right,rgba(255,255,255,.18),transparent)"></span>
</div>`;

// Page head, shared. The heading and lead are client copy, unchanged.
const head = (c, align = 'left') => `
<div class="${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}">
  <h1 class="font-display text-3xl font-bold leading-tight text-white sm:text-[2.6rem]">${esc(c.team.heading)}</h1>
  <p class="mt-4 font-body text-lg text-white/60">${esc(c.team.lead)}</p>
</div>`;

const shell = (inner, extra = '') => `
<div class="relative min-h-screen" style="background:${DARK}">
  ${extra}
  <div class="relative">${inner}</div>
</div>`;

// ---------------------------------------------------------------- options

const RENDER = {
  wall: (site, c) => shell(`
    <div class="mx-auto max-w-content px-4 pb-14 pt-16">${head(c)}</div>
    <!-- No gutters and no container: the grid runs the full width so the
         portraits read as one surface rather than twelve objects. -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      ${c.team.members.map(m => `
      <figure class="group relative overflow-hidden">
        ${photo(m, 'aspect-[3/4] w-full bg-white/5 object-cover object-top saturate-[.35] brightness-90 transition duration-500 group-hover:scale-[1.03] group-hover:saturate-100 group-hover:brightness-100')}
        <span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.15) 45%,transparent 70%)"></span>
        <figcaption class="absolute inset-x-0 bottom-0 p-4">
          <p class="font-display text-base font-bold leading-tight text-white">${esc(m.name)}</p>
          <p class="mt-0.5 font-body text-[11px] uppercase tracking-[0.25em]" style="color:${CYAN}">${esc(m.role || '')}</p>
        </figcaption>
      </figure>`).join('')}
    </div>
    <div class="h-16"></div>`),

  feature: (site, c) => {
    const founder = byRole(c, 'Founder')[0];
    const tile = (m, cols) => `
    <article class="${cols}">
      <div class="overflow-hidden rounded-xl ring-1 ring-white/10">
        ${photo(m, 'aspect-[3/4] w-full bg-white/5 object-cover object-top')}
      </div>
      <h3 class="mt-3 font-display text-base font-semibold text-white">${esc(m.name)}</h3>
      <p class="font-body text-[11px] uppercase tracking-[0.2em] text-white/45">${esc(m.role || '')}</p>
      ${m.bio ? `<p class="mt-2 font-body text-sm leading-relaxed text-white/60">${esc(m.bio)}</p>` : ''}
    </article>`;

    return shell(`
    <div class="mx-auto max-w-content px-4 py-16">
      ${head(c)}

      <div class="mt-14 grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-center">
        <div class="overflow-hidden rounded-2xl ring-1 ring-white/10">
          ${photo(founder, 'aspect-[3/4] w-full bg-white/5 object-cover object-top')}
        </div>
        <div>
          <p class="font-body text-[11px] font-bold uppercase tracking-[0.4em]" style="color:${MAGENTA}">${esc(founder.role)}</p>
          <h2 class="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">${esc(founder.name)}</h2>
          ${founder.bio ? `<p class="mt-5 max-w-xl font-body text-lg leading-relaxed text-white/70">${esc(founder.bio)}</p>` : ''}
        </div>
      </div>

      ${GROUPS.slice(1).map(([role, label]) => `
      <div class="mt-16">
        ${groupRule(label)}
        <div class="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          ${byRole(c, role).map(m => tile(m, '')).join('')}
        </div>
      </div>`).join('')}
    </div>`);
  },

  roster: (site, c) => shell(`
    <div class="mx-auto max-w-4xl px-4 py-16">
      ${head(c)}
      ${GROUPS.map(([role, label]) => `
      <div class="mt-14">
        ${groupRule(label)}
        <ul class="mt-4 divide-y divide-white/10 border-b border-white/10">
          ${byRole(c, role).map(m => `
          <li class="group flex items-center gap-5 py-4">
            <span class="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
              ${photo(m, 'h-full w-full object-cover object-top saturate-[.4] transition duration-500 group-hover:saturate-100')}
            </span>
            <span class="min-w-0 flex-1 font-display text-xl font-semibold text-white sm:text-2xl">${esc(m.name)}</span>
            <span class="shrink-0 font-body text-[11px] uppercase tracking-[0.25em] text-white/40">${esc(m.role || '')}</span>
          </li>`).join('')}
        </ul>
      </div>`).join('')}
    </div>`),

  cards: (site, c) => shell(`
    <div class="mx-auto max-w-content px-4 py-16">
      ${head(c)}
      ${GROUPS.map(([role, label]) => `
      <div class="mt-14">
        ${groupRule(label)}
        <div class="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          ${byRole(c, role).map(m => `
          <article class="group overflow-hidden rounded-2xl bg-white/[.04] ring-1 ring-white/10 transition hover:ring-2"
                   style="--tw-ring-color:rgba(255,255,255,.10)">
            <div class="overflow-hidden">
              ${photo(m, 'aspect-[3/4] w-full bg-white/5 object-cover object-top transition duration-500 group-hover:scale-[1.04]')}
            </div>
            <div class="p-4">
              <h3 class="font-display text-base font-semibold leading-tight text-white">${esc(m.name)}</h3>
              <p class="mt-1 font-body text-[11px] uppercase tracking-[0.2em] text-white/40">${esc(m.role || '')}</p>
            </div>
          </article>`).join('')}
        </div>
      </div>`).join('')}
    </div>`),

  stagger: (site, c) => shell(`
    <div class="mx-auto max-w-content px-4 py-16">
      ${head(c, 'center')}
      <!-- Every second tile drops 3rem at lg. Below that the offset is removed
           rather than halved: on two columns it would read as a mistake. -->
      <div class="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
        ${c.team.members.map((m, i) => `
        <article class="group ${i % 2 ? 'lg:mt-12' : ''}">
          <div class="overflow-hidden rounded-2xl ring-1 ring-white/10">
            ${photo(m, 'aspect-[3/4] w-full bg-white/5 object-cover object-top transition duration-500 group-hover:scale-[1.04]')}
          </div>
          <h3 class="mt-3 font-display text-base font-semibold text-white">${esc(m.name)}</h3>
          <p class="font-body text-[11px] uppercase tracking-[0.2em]" style="color:${CYAN}">${esc(m.role || '')}</p>
        </article>`).join('')}
      </div>
    </div>`, `
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden"
         style="-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 8%,#000 92%,transparent 100%);
                mask-image:linear-gradient(to bottom,transparent 0%,#000 8%,#000 92%,transparent 100%)">
      <div class="absolute -left-24 top-40 h-[34rem] w-[34rem] rounded-full blur-3xl"
           style="background:radial-gradient(circle,rgba(232,32,143,.18),transparent 68%)"></div>
      <div class="absolute -right-20 bottom-24 h-[30rem] w-[30rem] rounded-full blur-3xl"
           style="background:radial-gradient(circle,rgba(0,185,198,.16),transparent 68%)"></div>
    </div>`),

  circles: (site, c) => shell(`
    <div class="mx-auto max-w-content px-4 py-16">
      ${head(c, 'center')}
      ${GROUPS.map(([role, label]) => `
      <div class="mt-16">
        <p class="text-center font-body text-[11px] font-bold uppercase tracking-[0.4em]" style="color:${CYAN}">${esc(label)}</p>
        <div class="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-12">
          ${byRole(c, role).map(m => `
          <figure class="group w-36 text-center sm:w-44">
            <div class="mx-auto aspect-square w-full overflow-hidden rounded-full ring-1 ring-white/15 transition group-hover:ring-2"
                 style="--tw-ring-color:rgba(232,32,143,.55)">
              ${photo(m, 'h-full w-full object-cover object-top transition duration-500 group-hover:scale-105')}
            </div>
            <figcaption class="mt-4">
              <p class="font-display text-base font-semibold leading-tight text-white">${esc(m.name)}</p>
              <p class="mt-1 font-body text-[10px] uppercase tracking-[0.25em] text-white/40">${esc(m.role || '')}</p>
            </figcaption>
          </figure>`).join('')}
        </div>
      </div>`).join('')}
    </div>`),
};

export const renderTeam = (site, c, key) => (RENDER[key] ?? RENDER.cards)(site, c);

// Contact — six layouts on the team page's ground.
//
// The ground is the team page's, byte for byte: plum with the spotlight laid
// over it. Both are imported from team.mjs rather than copied, so if that page
// is ever re-toned this one follows instead of drifting away from it.
//
// The content is the live contact page's, and it is very little: a heading, a
// line of lead, four form fields, a social row, two YouTube videos and a block
// pointing husbands at Rise Up Kings. Six layouts out of that means six real
// decisions about what leads the page — not six arrangements of the same
// centred stack. So:
//
//   split      the form leads, everything else supports it from the left
//   stacked    nothing leads; one centred column, read top to bottom
//   plate      the form leads by being the only lit object on a dark page
//   console    the form and the videos are peers, side by side
//   theatre    the videos lead; the form is the quiet thing underneath
//   ticket     the whole page is one object, echoing the closing CTA
//
// THE FORM IS INERT IN ALL SIX. Every field carries `disabled` and the submit
// button with it. That is deliberate and it is not a placeholder oversight: a
// form that looks live and posts nowhere silently eats real enquiries, and
// this mockup has no endpoint. The live one posts to a Brizy handler, the
// Jotform routes were reported broken, and the plan of record was MOS into
// Ontraport. Until one of those is wired, disabled is the honest state.
//
// Labels, field order (Name, Phone, Email, Message), the button word
// "Submit", and the two headings are verbatim from riseupqueens.com/contact/.
import { esc } from './layout.mjs';
import { GROUND, SPOTLIGHT } from './team.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const CONTACT_LAYOUTS = {
  split: {
    label: 'Split — the form on the right, everything else holding the left',
    note: 'Heading, lead, socials and the Rise Up Kings block run down a narrow left column; the form sits opposite on a raised glass panel and is plainly the point of the page. The videos run full width beneath as a two-up band. The most conventional of the six and the safest — it is what a visitor who came here to send a message expects to find.',
  },
  stacked: {
    label: 'Stacked — one centred column, read straight down',
    note: 'Nothing competes. Heading, form, socials, videos, partner block, in that order, all centred on one axis. It is the calmest layout here and the only one that reads identically on a phone and a desktop, because there is no second column to collapse. The trade is height: it is the tallest of the six.',
  },
  plate: {
    label: 'Plate — the form as the one lit object on a dark page',
    note: 'The form is lifted onto a white plate, so the page flips from dark to light exactly where you are asked to type. Nothing else on the page is white, which makes the plate the first thing the eye lands on without a single arrow or accent. It also solves a real problem — dark form fields read as disabled whether they are or not, and on white they do not.',
  },
  console: {
    label: 'Console — form and videos as equal halves',
    note: 'An asymmetric grid: the form on the left, the two videos stacked on the right at the same height, socials as a rail between them and the partner block as a full-width bar underneath. The densest option — everything is above the fold on a laptop, nothing is buried. Reads as a contact desk rather than a page.',
  },
  theatre: {
    label: 'Theatre — the videos lead, the form follows',
    note: 'The two videos open the page at full size directly under the heading, and the form sits below in a narrow centred column. Argues that a visitor who is not yet sure should meet Jessica before being handed a form. The one option that puts a face first, and the one to pick if this page is reached from an ad rather than from the nav.',
  },
  ticket: {
    label: 'Ticket — the whole page as one floating panel',
    note: 'Echoes the closing CTA from the homepage: everything sits inside a single wide panel floating on the plum, divided by a perforated rule into a body that holds the form and a stub that holds the socials and Rise Up Kings. The most designed of the six, and the one that ties this page hardest to the rest of the site.',
  },
};

// -------------------------------------------------------------------- bits

const SOCIAL_ICONS = {
  instagram: '<path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4 1 .4.4.7.8 1 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.3.6-.6 1-1 1.4-.4.4-.8.7-1.4 1-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.3-1-.6-1.4-1-.4-.4-.7-.8-1-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.3-.6.6-1 1-1.4.4-.4.8-.7 1.4-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.3.84-.4.4-.64.8-.84 1.3-.16.4-.35 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 12s0 2.1.06 3.3c.05 1.1.24 1.7.4 2.1.2.5.44.9.84 1.3.4.4.8.64 1.3.84.4.16 1 .35 2.1.4 1.2.06 1.6.06 4.7.06s3.5 0 4.7-.06c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.3-.84.4-.4.64-.8.84-1.3.16-.4.35-1 .4-2.1.06-1.2.06-1.6.06-3.3s0-2.1-.06-3.3c-.05-1.1-.24-1.7-.4-2.1-.2-.5-.44-.9-.84-1.3-.4-.4-.8-.64-1.3-.84-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 8.08a3.18 3.18 0 100-6.36 3.18 3.18 0 000 6.36zm6.24-8.28a1.14 1.14 0 11-2.29 0 1.14 1.14 0 012.29 0z"/>',
  facebook: '<path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z"/>',
  youtube: '<path d="M21.58 7.19a2.5 2.5 0 00-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.5 2.5 0 00-1.77 1.77A26 26 0 002 12a26 26 0 00.42 4.81 2.5 2.5 0 001.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 001.77-1.77A26 26 0 0022 12a26 26 0 00-.42-4.81zM10 15.02V8.98L15.2 12 10 15.02z"/>',
};

const SOCIALS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
];

// The social row. `tone` is which ground it sits on, because the same chip
// cannot work on both the plum and the white plate.
const socials = (site, tone = 'dark', align = 'start') => {
  const dark = tone === 'dark';
  const chip = dark
    ? 'bg-white/[.06] text-white ring-1 ring-white/15 hover:bg-white/[.14] hover:ring-white/30'
    : 'bg-ink/[.04] text-ink ring-1 ring-ink/10 hover:bg-ink/[.08] hover:ring-ink/25';
  return `
<div class="${align === 'center' ? 'text-center' : ''}">
  <h2 class="font-display text-xs font-bold uppercase tracking-[.22em] ${dark ? 'text-white/55' : 'text-ink-soft'}">Find Us On Socials</h2>
  <ul class="mt-4 flex ${align === 'center' ? 'justify-center' : ''} gap-3">
    ${SOCIALS.filter(s => site.social[s.key]).map(s => `
    <li>
      <a href="${esc(site.social[s.key])}" target="_blank" rel="noopener"
         class="flex h-12 w-12 items-center justify-center rounded-full transition ${chip}
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta">
        <span class="sr-only">${esc(s.label)}</span>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${SOCIAL_ICONS[s.key]}</svg>
      </a>
    </li>`).join('')}
  </ul>
</div>`;
};

// One form field. Every one of these is disabled — see the header comment.
const field = (f, tone, idPrefix) => {
  const dark = tone === 'dark';
  const id = `${idPrefix}-${f.name}`;
  const box = dark
    ? 'border-white/15 bg-white/[.05] text-white placeholder:text-white/30 disabled:text-white/45'
    : 'border-ink/20 bg-white text-ink placeholder:text-ink/35 disabled:bg-ink/[.03] disabled:text-ink-soft';
  const label = dark ? 'text-white/85' : 'text-ink';
  const common = `mt-2 w-full rounded-xl border px-4 py-3 font-body text-[15px] transition ${box}
                  focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/40`;
  return `
<div>
  <label for="${id}" class="block font-display text-xs font-bold uppercase tracking-[.16em] ${label}">${esc(f.label)}</label>
  ${f.type === 'textarea'
    ? `<textarea id="${id}" name="${esc(f.name)}" rows="5" disabled class="${common} resize-y"></textarea>`
    : `<input id="${id}" name="${esc(f.name)}" type="${esc(f.type)}" disabled
              autocomplete="${f.name === 'name' ? 'name' : f.name === 'email' ? 'email' : f.name === 'phone' ? 'tel' : 'off'}"
              class="${common}">`}
</div>`;
};

// The note sits inside the form and is referenced by aria-describedby, so a
// screen reader is told the form is dead before it reaches the first field
// rather than after it has been filled in.
const formNote = (tone, id) => {
  const dark = tone === 'dark';
  return `
<p id="${id}" class="rounded-xl px-4 py-3 font-body text-[13px] leading-relaxed
                     ${dark ? 'bg-white/[.05] text-white/60 ring-1 ring-white/10' : 'bg-magenta-tint text-ink-soft'}">
  <strong class="${dark ? 'text-white/85' : 'text-ink'}">Mockup — the form is not connected.</strong>
  Fields stay disabled until there is somewhere for a message to go, so nothing can be typed and lost.
</p>`;
};

// `columns` puts Name and Phone side by side; the two long fields stay full
// width in every layout because a cramped Message box invites a short one.
const form = (c, tone = 'dark', idPrefix = 'c', columns = false) => {
  const noteId = `${idPrefix}-note`;
  const [name, phone, email, message] = c.contact.fields;
  return `
<form action="#" method="post" novalidate aria-describedby="${noteId}" class="space-y-5">
  ${formNote(tone, noteId)}
  ${columns
    ? `<div class="grid gap-5 sm:grid-cols-2">${field(name, tone, idPrefix)}${field(phone, tone, idPrefix)}</div>
       ${field(email, tone, idPrefix)}`
    : `${field(name, tone, idPrefix)}${field(phone, tone, idPrefix)}${field(email, tone, idPrefix)}`}
  ${field(message, tone, idPrefix)}
  <button type="submit" disabled
          class="w-full cursor-not-allowed rounded-full bg-magenta px-8 py-3.5 font-display text-sm font-bold uppercase
                 tracking-[.14em] text-white opacity-60 shadow-[0_16px_34px_-16px_rgba(232,32,143,.9)]">
    ${esc(c.contact.submit)}
  </button>
</form>`;
};

// YouTube facade. The poster is a local file from scripts/fetch-posters.mjs,
// not a hotlink to i.ytimg.com — nothing loads from Google until the visitor
// clicks, and then it opens in the lightbox in app.js on the nocookie domain.
const VIDEO_TITLES = {
  MsKV8OsY2pg: 'The Most Effective Way to Communicate in Your Marriage',
  jO_JIAVVRdE: 'How to Get Addicted to Intimacy with Your Spouse Again',
};

const video = (id, vids) => {
  const v = vids.youtube.find(x => x.id === id) || { id, title: VIDEO_TITLES[id] || 'Watch' };
  const short = VIDEO_TITLES[id] || v.title.replace(/\s*\|\s*Jessica Lewis\s*$/, '');
  return `
<figure class="group">
  <button type="button" data-lightbox data-provider="youtube" data-id="${esc(v.id)}" data-title="${esc(v.title)}"
          class="video-facade relative block w-full overflow-hidden rounded-2xl ring-1 ring-white/15
                 shadow-[0_26px_60px_-28px_rgba(0,0,0,.95)]
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta">
    <span class="sr-only">Play ${esc(v.title)}</span>
    <span class="relative block aspect-video w-full">
      <img src="/assets/posters/yt-${esc(v.id)}.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async"
           class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105">
      <span aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,.55),transparent 55%)"></span>
      <span aria-hidden="true" class="absolute inset-0 flex items-center justify-center">
        <span class="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-[0_12px_34px_-8px_rgba(0,0,0,.7)] transition group-hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${MAGENTA}" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        </span>
      </span>
    </span>
  </button>
  <figcaption class="mt-3 font-body text-sm leading-snug text-white/65">${esc(short)}</figcaption>
</figure>`;
};

// Rise Up Kings. `shape` is how much room the layout can give it.
const partner = (c, shape = 'card') => {
  const p = c.contact.partner;
  const link = `
<a href="${esc(p.url)}" target="_blank" rel="noopener"
   class="inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-xs font-bold uppercase tracking-[.14em]
          text-white ring-1 transition hover:bg-white/10
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
   style="border-color:${CYAN};--tw-ring-color:${CYAN}">
  ${esc(p.cta)}
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</a>`;

  if (shape === 'bar') return `
<div class="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-white/[.04] p-6 ring-1 ring-white/10 sm:p-8">
  <div>
    <h2 class="font-display text-xl font-bold text-white sm:text-2xl">${esc(p.heading)}</h2>
    <p class="mt-1 font-body text-white/60">${esc(p.body)}</p>
  </div>
  ${link}
</div>`;

  if (shape === 'inline') return `
<div>
  <h2 class="font-display text-lg font-bold text-white">${esc(p.heading)}</h2>
  <p class="mt-1 font-body text-sm text-white/60">${esc(p.body)}</p>
  <div class="mt-4">${link}</div>
</div>`;

  return `
<div class="rounded-2xl bg-white/[.04] p-7 ring-1 ring-white/10">
  <span aria-hidden="true" class="block h-1 w-12 rounded-full" style="background:${CYAN}"></span>
  <h2 class="mt-5 font-display text-xl font-bold text-white">${esc(p.heading)}</h2>
  <p class="mt-2 font-body text-white/60">${esc(p.body)}</p>
  <div class="mt-5">${link}</div>
</div>`;
};

const heading = (c, align = 'left', size = 'big') => `
<div class="${align === 'center' ? 'text-center' : ''}">
  <h1 class="font-display font-extrabold leading-[.95] text-white ${size === 'big' ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl'}">
    ${esc(c.contact.heading)}
  </h1>
  <span aria-hidden="true" class="mt-6 block h-1 w-20 rounded-full ${align === 'center' ? 'mx-auto' : ''}"
        style="background:linear-gradient(to right,${MAGENTA},${CYAN})"></span>
  <p class="mt-6 ${align === 'center' ? 'mx-auto ' : ''}max-w-xl font-body text-lg leading-relaxed text-white/70">${esc(c.contact.lead)}</p>
</div>`;

// The raised panel the form sits on in most layouts. A flat tint would vanish
// against the plum, so it carries a hairline and a shadow as well.
const glass = (inner, pad = 'p-7 sm:p-9') => `
<div class="rounded-3xl bg-white/[.05] ${pad} ring-1 ring-white/10 shadow-[0_40px_90px_-50px_rgba(0,0,0,1)] backdrop-blur-sm">
  ${inner}
</div>`;

// ----------------------------------------------------------------- layouts

const RENDER = {
  split: (site, c, vids) => `
<div class="relative mx-auto max-w-content px-4 pb-24 pt-44 sm:pt-48">
  <div class="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
    <div>
      ${heading(c)}
      <div class="mt-12">${socials(site)}</div>
      <div class="mt-12">${partner(c, 'inline')}</div>
    </div>
    <div>${glass(form(c, 'dark', 'sp', true))}</div>
  </div>

  <div class="mt-20">
    <h2 class="font-display text-xs font-bold uppercase tracking-[.22em] text-white/55">Watch</h2>
    <div class="mt-6 grid gap-8 sm:grid-cols-2">
      ${c.contact.videos.map(id => video(id, vids)).join('')}
    </div>
  </div>
</div>`,

  stacked: (site, c, vids) => `
<div class="relative mx-auto max-w-3xl px-4 pb-24 pt-44 sm:pt-48">
  ${heading(c, 'center')}
  <div class="mt-14">${glass(form(c, 'dark', 'st', true))}</div>
  <div class="mt-16">${socials(site, 'dark', 'center')}</div>

  <div class="mt-16 grid gap-8 sm:grid-cols-2">
    ${c.contact.videos.map(id => video(id, vids)).join('')}
  </div>

  <div class="mt-16">${partner(c, 'bar')}</div>
</div>`,

  plate: (site, c, vids) => `
<div class="relative mx-auto max-w-content px-4 pb-24 pt-44 sm:pt-48">
  ${heading(c, 'center')}

  <!-- The one white object on the page. Its own light tone means every control
       inside it has to flip too — see the tone argument threaded through
       field(), formNote() and socials(). -->
  <div class="mx-auto mt-14 max-w-2xl rounded-[2rem] bg-white p-8 shadow-[0_50px_110px_-45px_rgba(0,0,0,1)] sm:p-11">
    <h2 class="font-display text-2xl font-bold text-ink">Send us a message</h2>
    <p class="mt-2 font-body text-ink-soft">Our team reads every one.</p>
    <div class="mt-8">${form(c, 'light', 'pl', true)}</div>
    <div class="mt-10 border-t border-ink/10 pt-8">${socials(site, 'light')}</div>
  </div>

  <div class="mx-auto mt-20 grid max-w-4xl gap-8 sm:grid-cols-2">
    ${c.contact.videos.map(id => video(id, vids)).join('')}
  </div>

  <div class="mx-auto mt-16 max-w-4xl">${partner(c, 'bar')}</div>
</div>`,

  console: (site, c, vids) => `
<div class="relative mx-auto max-w-content px-4 pb-24 pt-44 sm:pt-48">
  ${heading(c)}

  <div class="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
    <div>${glass(form(c, 'dark', 'co', true))}</div>

    <!-- The videos stack rather than sit side by side, so the right column
         finishes at about the height of the form instead of far short of it. -->
    <div class="flex flex-col gap-8">
      ${c.contact.videos.map(id => video(id, vids)).join('')}
      <div class="mt-auto pt-2">${socials(site)}</div>
    </div>
  </div>

  <div class="mt-16">${partner(c, 'bar')}</div>
</div>`,

  theatre: (site, c, vids) => `
<div class="relative mx-auto max-w-content px-4 pb-24 pt-44 sm:pt-48">
  ${heading(c, 'center')}

  <div class="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
    ${c.contact.videos.map(id => video(id, vids)).join('')}
  </div>

  <div class="mx-auto mt-20 max-w-2xl">
    <h2 class="text-center font-display text-3xl font-bold text-white">Send us a message</h2>
    <div class="mt-8">${glass(form(c, 'dark', 'th', true))}</div>
  </div>

  <div class="mt-16 grid items-center gap-10 lg:grid-cols-[4fr_8fr]">
    ${socials(site)}
    ${partner(c, 'bar')}
  </div>
</div>`,

  ticket: (site, c, vids) => `
<div class="relative mx-auto max-w-5xl px-4 pb-24 pt-40 sm:pt-44">

  <!-- One panel, divided by a perforated rule — the same dashed border the
       closing CTA's stub uses, and for the same reason: circular notches at
       the ends would have to be painted in the page's own plum, and the plum
       is a gradient whose value at that height depends on how tall the page
       ends up. A rule is exact at any height. -->
  <div class="relative overflow-hidden rounded-[2rem] bg-white/[.055] ring-1 ring-white/[.12]
              shadow-[0_60px_120px_-55px_rgba(0,0,0,1)] backdrop-blur-sm">

    <div class="px-7 pb-12 pt-12 sm:px-12">
      ${heading(c, 'center', 'small')}
      <div class="mx-auto mt-10 max-w-xl">${form(c, 'dark', 'tk', true)}</div>

      <div class="mt-14 grid gap-8 sm:grid-cols-2">
        ${c.contact.videos.map(id => video(id, vids)).join('')}
      </div>
    </div>

    <div class="mx-7 grid items-center gap-8 border-t-2 border-dashed border-white/15 py-12 sm:mx-12 sm:grid-cols-2">
      ${socials(site)}
      ${partner(c, 'inline')}
    </div>
  </div>
</div>`,
};

// The page wrapper: the team page's ground, and the same room left at the top
// for the header, which renders over this page with no scrim.
export const renderContact = (site, c, vids, key = 'split') => `
<div class="relative" style="background:${GROUND}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:${SPOTLIGHT}"></div>
  ${(RENDER[key] ?? RENDER.split)(site, c, vids)}
</div>`;

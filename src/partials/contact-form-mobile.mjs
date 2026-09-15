// Variants of option B for the contact page: the form itself made compact,
// and the tail reordered to form -> Rise Up Kings -> socials -> videos.
//
// B settled the big question — the form moves directly under the heading below
// lg, so it starts at 293px instead of 652px. What it did not do is make the
// form any smaller. At 390px it is 514px, and that height is not in the inputs:
//
//   label + mt-2   24px   x4 fields   = 96px
//   inputs         46px   x3          = 138px
//   textarea       5 rows             = ~130px
//   gaps           space-y-5 x5       = 100px
//   submit                            = 50px
//
// So almost 200px is labels and gaps around 4 inputs, and another 130 is a
// message box sized for a desktop column. Each variant below takes one of
// those, in order of how safe it is.
//
// All of it is MOBILE ONLY; the desktop form and the two-column page layout
// are untouched. The form stays inert throughout — it posts nowhere, and a
// disabled field cannot swallow a real enquiry.
import { esc } from './layout.mjs';
import { socials, partner, video, heading, watchLabel } from './contact-parts.mjs';
import { renderPanel } from './contact.mjs';

const MAGENTA = '#e8208f';
export const GROUND = 'linear-gradient(180deg,#0b0b0b 0%,#130c11 45%,#220d19 100%)';
const SPOTLIGHT = 'radial-gradient(120% 55% at 50% 0%,rgba(255,255,255,.14),rgba(255,255,255,.04) 40%,transparent 72%)';

export const FORM_MODES = {
  b0: {
    label: 'B — as approved',
    note: 'Option B with the tail reordered as you asked: form, then Rise Up Kings, then socials, then the videos. The form itself is untouched — this is the comparison point for the three below.',
    pair: false, labels: 'above', rows: 5, space: 'space-y-5',
  },

  b1: {
    label: 'B1 — Name and Phone side by side',
    note: 'The first row pairs up below sm as well as at sm. Name and Phone are both short entries and neither needs a full 342px line. One field\'s worth of height — about 70px — for no change in what is asked or how it is labelled. The safest of the three by a distance.',
    pair: true, labels: 'above', rows: 5, space: 'space-y-5',
  },

  b2: {
    label: 'B2 — B1 + labels inside the fields',
    note: 'B1, and below sm each label becomes the field\'s placeholder instead of a line of type above it. That is 24px x4 = about 96px, the single biggest saving available in the form. The real label is kept as sr-only markup, so screen readers and autofill still get it. Read the caveat opposite before choosing this.',
    pair: true, labels: 'inside', rows: 5, space: 'space-y-5',
  },

  b3: {
    label: 'B3 — B2 + a shorter message box',
    note: 'B2, with the message box at 3 rows below sm instead of 5, and the gaps between fields at 16px rather than 20px. A 5-row box was chosen so a cramped field would not invite a short message — at 3 rows it is still visibly a paragraph box, and it grows as you type on every phone browser. Shortest of the four.',
    pair: true, labels: 'inside', rows: 3, space: 'space-y-4 sm:space-y-5',
  },
};

const FIELD = 'w-full rounded-xl border border-white/15 bg-white/[.05] px-4 py-3 font-body text-[15px] text-white placeholder:text-white/30 transition focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/40 disabled:cursor-not-allowed';
const LABEL = 'font-display text-xs font-bold uppercase tracking-[.16em] text-white/85';

// `labels: 'inside'` keeps a real <label>, hidden visually, and puts the same
// word in the placeholder. That preserves the accessible name and autofill
// behaviour — but a placeholder is not a label: it disappears the moment
// someone types, so anyone interrupted mid-form loses the only visible cue
// about what the field wanted. Above sm the visible label always returns.
const field = (f, m) => {
  const id = `cf-${f.name}`;
  const rows = f.type === 'textarea' ? (m.rows === 3 ? 'rows="3" sm:rows="5"' : 'rows="5"') : '';
  const control = f.type === 'textarea'
    ? `<textarea id="${id}" name="${esc(f.name)}" rows="${m.rows}" disabled placeholder="${m.labels === 'inside' ? esc(f.label) : ''}" class="${FIELD} resize-y ${m.rows === 3 ? 'sm:min-h-[8.5rem]' : ''}"></textarea>`
    : `<input id="${id}" name="${esc(f.name)}" type="${esc(f.type)}" disabled placeholder="${m.labels === 'inside' ? esc(f.label) : ''}"
         autocomplete="${f.name === 'name' ? 'name' : f.name === 'email' ? 'email' : f.name === 'phone' ? 'tel' : 'off'}" class="${FIELD}">`;

  const labelEl = m.labels === 'inside'
    ? `<label for="${id}" class="sr-only sm:not-sr-only sm:mb-2 sm:block ${LABEL}">${esc(f.label)}</label>`
    : `<label for="${id}" class="mb-2 block ${LABEL}">${esc(f.label)}</label>`;

  return `<div>${labelEl}${control}</div>`;
};

const buildForm = (c, m) => {
  const [name, phone, email, message] = c.contact.fields;
  return `
<form action="#" method="post" novalidate class="${m.space}">
  <div class="grid gap-4 ${m.pair ? 'grid-cols-2' : ''} sm:grid-cols-2 sm:gap-5">
    ${field(name, m)}${field(phone, m)}
  </div>
  ${field(email, m)}
  ${field(message, m)}
  <button type="submit" disabled
          class="w-full cursor-not-allowed rounded-full px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[.14em] text-white shadow-[0_16px_34px_-16px_rgba(232,32,143,.9)]"
          style="background:${MAGENTA}">${esc(c.contact.submit)}</button>
</form>`;
};

export const renderContactForm = (site, c, vids, modeKey) => {
  const m = FORM_MODES[modeKey];

  const headBlock = `<div class="[&_h1]:text-3xl [&_p]:text-base sm:[&_h1]:text-4xl sm:[&_p]:text-lg">${heading(c, { rule: 'hair' })}</div>`;
  const formBlock = renderPanel('current', buildForm(c, m));

  // Tail order below lg: Rise Up Kings, then socials, then the videos.
  // On desktop the left column keeps heading -> socials -> Rise Up Kings, with
  // the partner block still taking mt-auto so both columns end level.
  return `
<div id="contact" class="relative" style="background:${GROUND}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:${SPOTLIGHT}"></div>
  <div class="relative mx-auto max-w-content px-4 pb-10 pt-24 sm:pb-24 sm:pt-48">

    <div class="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
      <div class="order-1 lg:order-none lg:col-start-1 lg:row-start-1">${headBlock}</div>
      <div class="order-2 lg:order-none lg:col-start-2 lg:row-span-3 lg:row-start-1">${formBlock}</div>
      <!-- Rise Up Kings before socials below lg; the reverse at lg, where the
           partner block is what pushes down to meet the foot of the form. -->
      <div class="order-3 lg:order-none lg:col-start-1 lg:row-start-3 lg:mt-auto lg:pt-12">${partner(site, c, 'watermark')}</div>
      <div class="order-4 mt-2 lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-8">${socials(site, { style: 'tile' })}</div>
    </div>

    <div class="mt-10 sm:mt-20">
      ${watchLabel}
      <div class="mt-4 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-8">
        ${c.contact.videos.map(id => video(id, vids)).join('')}
      </div>
    </div>
  </div>
</div>`;
};

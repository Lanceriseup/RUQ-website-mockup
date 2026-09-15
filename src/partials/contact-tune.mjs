// Two separate decisions for the contact page, kept apart so they can be
// answered independently.
//
//   FORM     B1 got it to 422px. Where the rest of the height is, and what
//            each further cut costs.
//   SOCIALS  bigger and centred, four ways.
//
// Both are MOBILE ONLY; the desktop form and the left-column socials are
// untouched. The form stays inert throughout.
import { esc } from './layout.mjs';
// Imported, not copied: the first version of this file hand-rolled the icon
// list and silently omitted YouTube — the one platform the notes below argue
// about, because that channel is branded 'Talk Marriage To Me'.
import { SOCIAL_KEYS, SOCIAL_ICONS } from './contact-parts.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

// ------------------------------------------------------------------- form
//
// B1 measures 422px. The remaining budget:
//
//   labels + mb-2   24px x4        = 96px
//   inputs          46px x3        = 138px
//   textarea        5 rows         = ~110px
//   gaps            space-y-5 x3   = 60px
//   submit          py-3.5         = 50px
//
// The inputs themselves are 138px of it. Everything else is packaging, and
// each option below takes one layer of packaging in order of how little it
// costs to lose.
export const FORM_TUNE = {
  f0: {
    label: 'B1 — where we are',
    note: 'The current state: Name and Phone paired, labels above each field, a 5-row message box, 20px between fields. 422px.',
    rows: 5, space: 'space-y-5', labels: 'above', pad: 'py-3', submit: 'py-3.5',
  },

  f1: {
    label: 'F1 — shorter message box, tighter gaps',
    note: 'The message box drops from 5 rows to 3 and the gaps between fields from 20px to 12px. Nothing changes about how the form is labelled or what it asks. A 3-row box still reads as a paragraph field and grows as you type on every phone browser, so the only thing lost is empty space someone was going to scroll past.',
    rows: 3, space: 'space-y-3', labels: 'above', pad: 'py-3', submit: 'py-3.5',
  },

  f2: {
    label: 'F2 — F1 + labels inside the fields',
    note: 'F1, and each label becomes the field\'s placeholder below sm. 96px — the single biggest remaining saving. The real label stays as sr-only markup so screen readers and autofill are unaffected, and the visible label returns at sm. But a placeholder is not a label: it vanishes the moment someone types, and "Phone" beside "Name" is exactly the pair people look back at when they are unsure. A real trade, not a free win.',
    rows: 3, space: 'space-y-3', labels: 'inside', pad: 'py-3', submit: 'py-3.5',
  },

  f3: {
    label: 'F3 — F2 + shorter controls',
    note: 'F2 with the field padding at 10px instead of 12px and the submit at 12px instead of 14px. This is the floor: at py-2.5 an input is 42px tall, and 44px is the smallest comfortable touch target. Going further would start making the form harder to use rather than shorter, so this is where I would stop regardless of what the number says.',
    rows: 3, space: 'space-y-3', labels: 'inside', pad: 'py-2.5', submit: 'py-3',
  },
};

const FIELD = 'w-full rounded-xl border border-white/15 bg-white/[.05] px-4 font-body text-[15px] text-white placeholder:text-white/30 transition focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/40 disabled:cursor-not-allowed';
const LABEL = 'font-display text-xs font-bold uppercase tracking-[.16em] text-white/85';

const field = (f, m) => {
  const id = `cq-${f.name}`;
  const ph = m.labels === 'inside' ? esc(f.label) : '';
  const control = f.type === 'textarea'
    ? `<textarea id="${id}" name="${esc(f.name)}" rows="${m.rows}" disabled placeholder="${ph}" class="${FIELD} ${m.pad} resize-y"></textarea>`
    : `<input id="${id}" name="${esc(f.name)}" type="${esc(f.type)}" disabled placeholder="${ph}"
         autocomplete="${f.name === 'name' ? 'name' : f.name === 'email' ? 'email' : f.name === 'phone' ? 'tel' : 'off'}" class="${FIELD} ${m.pad}">`;
  const labelEl = m.labels === 'inside'
    ? `<label for="${id}" class="sr-only sm:not-sr-only sm:mb-2 sm:block ${LABEL}">${esc(f.label)}</label>`
    : `<label for="${id}" class="mb-2 block ${LABEL}">${esc(f.label)}</label>`;
  return `<div>${labelEl}${control}</div>`;
};

export const renderFormTune = (c, key) => {
  const m = FORM_TUNE[key];
  const [name, phone, email, message] = c.contact.fields;
  return `
<div id="formwrap" class="rounded-3xl bg-white/[.05] p-5 ring-1 ring-white/10 shadow-[0_40px_90px_-50px_rgba(0,0,0,1)] backdrop-blur-sm sm:p-9">
  <form action="#" method="post" novalidate class="${m.space}">
    <div class="grid grid-cols-2 gap-3 sm:gap-5">${field(name, m)}${field(phone, m)}</div>
    ${field(email, m)}
    ${field(message, m)}
    <button type="submit" disabled
            class="w-full cursor-not-allowed rounded-full px-8 ${m.submit} font-display text-sm font-bold uppercase tracking-[.14em] text-white shadow-[0_16px_34px_-16px_rgba(232,32,143,.9)]"
            style="background:${MAGENTA}">${esc(c.contact.submit)}</button>
  </form>
</div>`;
};

// ---------------------------------------------------------------- socials
//
// All four are centred below sm and bigger than the 48px tiles on the page
// now. They differ in what "bigger" is spent on.

export const SOCIAL_TUNE = {
  s0: {
    label: 'Current — 48px tiles, left-aligned',
    note: 'What is on the page now: three 48px rounded squares against the left edge of the column.',
    size: 'h-12 w-12', icon: 20, radius: 'rounded-lg', gap: 'gap-3', align: 'left', named: false, fill: 'plain',
  },
  s1: {
    label: 'S1 — Centred, 64px',
    note: 'The same tiles, centred and a third larger. The smallest change that answers both asks. 64px is a generous tap target and the row still reads as three quiet outbound links rather than as buttons competing with Submit.',
    size: 'h-16 w-16', icon: 26, radius: 'rounded-xl', gap: 'gap-4', align: 'center', named: false, fill: 'plain',
  },
  s2: {
    label: 'S2 — Centred, 72px, named',
    note: 'Larger still, with the platform name under each icon. The names earn their place here for one specific reason: the YouTube channel is branded "Talk Marriage To Me", not Rise Up Queens, so a bare play glyph tells you the wrong thing about where you are going.',
    size: 'h-[72px] w-[72px]', icon: 30, radius: 'rounded-2xl', gap: 'gap-5', align: 'center', named: true, fill: 'plain',
  },
  s3: {
    label: 'S3 — Centred, 72px, brand-filled',
    note: 'S2\'s size with the magenta-to-cyan sweep filling each tile and the glyph knocked out in white. The loudest option, and the only one that puts brand colour in this part of the page. It will pull the eye — which is the point if the socials are meant to be found, or the problem if the form is meant to win.',
    size: 'h-[72px] w-[72px]', icon: 30, radius: 'rounded-2xl', gap: 'gap-5', align: 'center', named: true, fill: 'brand',
  },
  s4: {
    label: 'S4 — Centred, full-width rows',
    note: 'Not bigger icons but bigger targets: each social becomes a full-width row with the glyph and the name, hairlines between. The largest tap areas of the four and the clearest about destinations, at the cost of being a list rather than a row — it takes about 170px instead of 100px.',
    size: '', icon: 24, radius: '', gap: '', align: 'center', named: true, fill: 'rows',
  },
};

export const renderSocialTune = (site, key) => {
  const m = SOCIAL_TUNE[key];
  const items = SOCIAL_KEYS.filter(s => site.social[s.key]);
  const title = `<h2 class="font-display text-xs font-bold uppercase tracking-[.22em] text-white/55">Find Us On Socials</h2>`;
  const icon = (s) => `<svg width="${m.icon}" height="${m.icon}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${SOCIAL_ICONS[s.key]}</svg>`;

  if (m.fill === 'rows') return `
<div id="soc" class="text-center sm:text-left">
  ${title}
  <ul class="mt-4 divide-y divide-white/10 border-y border-white/10">
    ${items.map(s => `
    <li>
      <a href="${esc(site.social[s.key])}" target="_blank" rel="noopener"
         class="flex min-h-[3.25rem] items-center justify-center gap-3 font-body text-[15px] text-white/80 transition hover:text-white sm:justify-start">
        ${icon(s)}<span>${esc(s.label)}</span>
      </a>
    </li>`).join('')}
  </ul>
</div>`;

  const tile = (s) => `
  <li>
    <a href="${esc(site.social[s.key])}" target="_blank" rel="noopener" class="group flex flex-col items-center gap-2">
      <span class="flex ${m.size} items-center justify-center ${m.radius} transition ${m.fill === 'brand' ? 'text-white' : 'bg-white/[.05] text-white/80 ring-1 ring-white/15 group-hover:bg-white/10 group-hover:text-white'}"
            ${m.fill === 'brand' ? `style="background:linear-gradient(140deg,${MAGENTA},${CYAN})"` : ''}>
        <span class="sr-only">${esc(s.label)}</span>${icon(s)}
      </span>
      ${m.named ? `<span class="font-body text-[11px] font-semibold uppercase tracking-[.12em] text-white/55">${esc(s.label)}</span>` : ''}
    </a>
  </li>`;

  return `
<div id="soc" class="${m.align === 'center' ? 'text-center sm:text-left' : ''}">
  ${title}
  <ul class="mt-4 flex ${m.gap} ${m.align === 'center' ? 'justify-center sm:justify-start' : ''}">${items.map(tile).join('')}</ul>
</div>`;
};

// Closing CTA, wide format.
//
// The reference is a low, wide panel: copy on the left, button on the right,
// ambient glow bleeding out from under it, subtle texture on the face. Every
// layout here holds that proportion — full container width, short, horizontal,
// button on its own to the right — and differs only in what the panel is made
// of.
//
// Two independent levers, so any layout takes any wording:
//   LAYOUT  what the panel is made of
//   COPY    what it says
//
// Only the `verbatim` wording is the client's. The rest are mine, written for
// this format: the live body line is 83 characters, which sets as three lines
// in a column this shallow and pushes the panel taller than the reference.
// Every alternative is marked on the options page.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
const PHOTO = '/assets/photos/queens-waving.jpg';

export const CLOSING_LAYOUTS = {
  paperGlow: {
    label: 'Paper — the reference, in brand colour',
    note: 'Warm off-white panel, dot grid on the face, a magenta glow bleeding out below it onto the page. The closest reading of what you sent. Quietest of the six and the only one where the button is the sole piece of colour.',
  },
  duskGlow: {
    label: 'Dusk — the same panel, inverted',
    note: 'Near-black panel with the same dot grid and the same glow underneath. The final ask goes dark while the page stays white, which is the only place on the page that happens.',
  },
  gradientEdge: {
    label: 'Edge — a brand bar down the left side',
    note: 'White panel, thick magenta-to-cyan bar along its left edge, faint dot grid. The bar does the work a coloured background would, at a fraction of the weight. Lightest option.',
  },
  photoSliver: {
    label: 'Sliver — a narrow photograph down one side',
    note: 'A slim band of the event photo on the left of the panel, fading into the copy. Puts faces beside the final ask without giving up the wide, shallow proportion.',
  },
  ticketBar: {
    label: 'Ticket — a date stub on the right of the button',
    note: 'A perforated rule splits the dates off as a stub. Same idea as the tall ticket but laid flat, so it keeps the wide format. Shows event dates, which are still unconfirmed.',
  },
  duotoneBand: {
    label: 'Duotone — the panel filled with the brand gradient',
    note: 'Magenta to cyan across the whole panel, white text, white button. Loudest of the six and the most literal use of the palette. No texture — the gradient is already doing enough.',
  },
};

export const CLOSING_COPY = {
  verbatim: {
    label: 'The live wording',
    heading: 'What if this is your turning point?',
    accent: '',
    body: 'We’ve helped thousands of women reclaim their voice, freedom, and joy. You\'re next.',
    button: 'Register Now',
    clientCopy: true,
    note: 'Their sentence exactly as it appears on the live site. The body runs long for a panel this shallow, which is the one argument against it here.',
  },
  startsHere: {
    label: 'Your turning point starts here',
    heading: 'Your turning point starts here',
    // Highlighted inside the line rather than appended at the end. The
    // emphasis belongs on their phrase, not on the words that frame it.
    highlight: 'turning point',
    accent: '',
    // The client's own line, kept as the sub-headline. It is 83 characters,
    // which is long for a panel this shallow — see the note on the panel
    // height below.
    body: 'We’ve helped thousands of women reclaim their voice, freedom, and joy. You\'re next.',
    button: 'Register Now',
    partialClientCopy: true,
    note: 'Turns their question into a statement, with their own phrase carrying the emphasis, and keeps their sentence underneath as the sub-headline. The heading is mine; the line below it is theirs word for word.',
  },
  nowYours: {
    label: 'You have read their stories. Now write yours.',
    heading: 'You’ve read their stories.',
    accent: 'Now write yours.',
    body: 'Thousands of women have reclaimed their voice, freedom and joy.',
    button: 'Register Now',
    note: 'The only wording that refers to the section directly above it — ten testimonies, then this. Strongest as page structure, and the accent line carries the whole ask.',
  },
  seatWaiting: {
    label: 'Your seat is waiting',
    heading: 'Your seat',
    accent: 'is waiting',
    body: 'Join thousands of women who reclaimed their voice, freedom and joy.',
    button: 'Save my seat',
    note: 'The most direct, and the only one whose button label changes with it. Implies scarcity without claiming a number nobody has verified.',
  },
  comeSee: {
    label: 'Come and see what changes',
    heading: 'Come and see',
    accent: 'what changes',
    body: 'Three days in Dallas with women who have been where you are.',
    button: 'Register Now',
    note: 'Invitation rather than pitch — the warmest of the five. Names the city, so it needs the location confirmed along with the dates.',
  },
};

// ---------------------------------------------------------------- pieces

const DOTS = (alpha) =>
  `background-image:radial-gradient(${alpha} 1px,transparent 1px);background-size:18px 18px`;

const button = (site, copy, tone) => {
  const tones = {
    magenta: `background:${MAGENTA};color:#fff`,
    white: 'background:#fff;color:#1c1c1c',
    ink: 'background:#141414;color:#fff',
  };
  return `
<a href="${esc(site.nextEvent.ctaUrl)}" rel="noopener"
   class="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-8 py-3.5
          font-body text-sm font-bold uppercase tracking-[0.14em] shadow-[0_14px_30px_-14px_rgba(0,0,0,.55)]
          transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 ${tone === 'white' ? 'focus-visible:outline-white' : 'focus-visible:outline-magenta'}"
   style="${tones[tone]}">
  ${esc(copy.button)}
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
       class="transition group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</a>`;
};

// Two ways to emphasise, because the wordings need different things:
//
//   accent     a trailing phrase, appended after the heading
//   highlight  a phrase inside the heading, coloured where it sits
//
// The highlight is escaped and split on the escaped text, not matched against
// the raw string, so a phrase containing a character esc() rewrites still
// lines up. If it ever fails to match, the heading simply renders plain rather
// than breaking.
//
// Colour is applied to the heading only. At 24px rising to 30.4px bold this is
// large text and clears 3:1 on every panel here — the tightest is magenta on
// the paper panel at 3.78:1. The same colours would fail at body size, which
// is why the sub-headline never takes them.
const headingHtml = (copy, accentColour) => {
  const head = esc(copy.heading);
  const tail = copy.accent ? ` <span style="color:${accentColour}">${esc(copy.accent)}</span>` : '';
  if (!copy.highlight) return head + tail;

  const hl = esc(copy.highlight);
  const i = head.indexOf(hl);
  if (i < 0) return head + tail;
  return head.slice(0, i)
    + `<span style="color:${accentColour}">${hl}</span>`
    + head.slice(i + hl.length) + tail;
};

const copyBlock = (copy, headTone, bodyTone, accentColour) => `
<div class="min-w-0">
  <h2 class="font-display text-2xl font-bold leading-tight ${headTone} sm:text-[1.9rem]">
    ${headingHtml(copy, accentColour)}
  </h2>
  <p class="mt-2.5 max-w-xl font-body text-[15px] leading-relaxed ${bodyTone}">${esc(copy.body)}</p>
</div>`;

// The shared frame. Every layout is this: a full-width container, a panel
// inside it, and a glow underneath that is wider than the panel so it reads as
// light thrown onto the page rather than a shadow.
const frame = (inner, glow) => `
<section class="relative bg-white py-16">
  <div class="relative mx-auto max-w-content px-4">
    ${glow ? `<div aria-hidden="true" class="pointer-events-none absolute inset-x-8 bottom-2 top-8 rounded-[2rem] blur-2xl" style="background:${glow}"></div>` : ''}
    <div class="relative">${inner}</div>
  </div>
</section>`;

// Copy left, button right, stacking below sm where a button beside a paragraph
// would leave neither enough room.
const row = (left, right) => `
<div class="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
  ${left}
  ${right}
</div>`;

// ---------------------------------------------------------------- layouts

const LAYOUTS = {
  paperGlow: (site, c, copy) => frame(`
    <div class="rounded-[1.75rem] px-8 py-10 ring-1 ring-ink/[.07] shadow-[0_30px_70px_-40px_rgba(0,0,0,.35)] sm:px-12"
         style="background:#F7F3EF">
      <div style="${DOTS('rgba(28,28,28,.09)')}">
        ${row(copyBlock(copy, 'text-ink', 'text-ink-soft', MAGENTA), button(site, copy, 'magenta'))}
      </div>
    </div>`,
    `radial-gradient(60% 100% at 50% 100%,rgba(232,32,143,.30),transparent 70%)`),

  duskGlow: (site, c, copy) => frame(`
    <div class="rounded-[1.75rem] px-8 py-10 shadow-[0_40px_90px_-45px_rgba(0,0,0,.7)] sm:px-12"
         style="background:#141414">
      <div style="${DOTS('rgba(255,255,255,.10)')}">
        ${row(copyBlock(copy, 'text-white', 'text-white/70', CYAN), button(site, copy, 'magenta'))}
      </div>
    </div>`,
    `radial-gradient(60% 100% at 50% 100%,rgba(232,32,143,.34),transparent 70%)`),

  gradientEdge: (site, c, copy) => frame(`
    <div class="overflow-hidden rounded-[1.75rem] ring-1 ring-ink/[.08] shadow-[0_30px_70px_-40px_rgba(0,0,0,.3)]"
         style="background:#fff">
      <div class="flex">
        <span aria-hidden="true" class="w-2 shrink-0" style="background:linear-gradient(to bottom,${MAGENTA},${CYAN})"></span>
        <div class="min-w-0 flex-1 px-8 py-10 sm:px-12" style="${DOTS('rgba(28,28,28,.07)')}">
          ${row(copyBlock(copy, 'text-ink', 'text-ink-soft', MAGENTA), button(site, copy, 'magenta'))}
        </div>
      </div>
    </div>`,
    `radial-gradient(55% 100% at 50% 100%,rgba(0,185,198,.24),transparent 70%)`),

  photoSliver: (site, c, copy) => frame(`
    <div class="relative overflow-hidden rounded-[1.75rem] shadow-[0_40px_90px_-45px_rgba(0,0,0,.6)]"
         style="background:#141414">
      <!-- The band is 30% wide and the copy column starts at 36%, so the two
           never overlap. Running the copy over the photo would mean white text
           on an image scrimmed to 45% at its left edge, which no amount of
           gradient makes reliably legible against a bright frame.

           Hidden below sm: at phone width a 30% sliver is ~110px of unreadable
           photograph and the copy would have nowhere to go. -->
      <div aria-hidden="true" class="absolute inset-y-0 left-0 hidden w-[30%] sm:block">
        <img src="${PHOTO}" alt="" loading="lazy" decoding="async" class="h-full w-full object-cover">
        <div class="absolute inset-0" style="background:linear-gradient(to right,rgba(20,20,20,.35),rgba(20,20,20,1) 96%)"></div>
      </div>
      <div class="relative px-8 py-10 sm:pl-[36%] sm:pr-12">
        ${row(copyBlock(copy, 'text-white', 'text-white/70', CYAN), button(site, copy, 'magenta'))}
      </div>
    </div>`,
    `radial-gradient(60% 100% at 50% 100%,rgba(232,32,143,.28),transparent 70%)`),

  ticketBar: (site, c, copy) => frame(`
    <div class="relative flex flex-col gap-8 rounded-[1.75rem] px-8 py-10 shadow-[0_40px_90px_-45px_rgba(0,0,0,.6)] md:flex-row md:items-center md:gap-10 sm:px-12"
         style="background:#141414">
      <div class="min-w-0 flex-1" style="${DOTS('rgba(255,255,255,.09)')}">
        ${copyBlock(copy, 'text-white', 'text-white/70', CYAN)}
      </div>
      ${button(site, copy, 'magenta')}
      <!-- Perforation runs vertically on desktop and horizontally when the
           panel stacks, because a torn edge only reads along the split. -->
      <div class="shrink-0 border-t-2 border-dashed pt-6 text-center md:border-l-2 md:border-t-0 md:pl-10 md:pt-0 md:text-left"
           style="border-color:rgba(255,255,255,.28)">
        <p class="font-body text-[10px] font-bold uppercase tracking-[0.35em]" style="color:${CYAN}">Next live event</p>
        <p class="mt-2 font-display text-base font-bold leading-tight text-white">${esc(site.nextEvent.dates)}</p>
        <p class="font-body text-sm text-white/65">${esc(site.nextEvent.location)}</p>
        <p class="mt-2 font-body text-[9px] uppercase tracking-[0.2em] text-amber-300">Dates unconfirmed</p>
      </div>
    </div>`,
    `radial-gradient(60% 100% at 50% 100%,rgba(232,32,143,.30),transparent 70%)`),

  duotoneBand: (site, c, copy) => frame(`
    <div class="rounded-[1.75rem] px-8 py-10 shadow-[0_40px_90px_-45px_rgba(232,32,143,.45)] sm:px-12"
         style="background:linear-gradient(115deg,${MAGENTA},#c31c8f 45%,${CYAN})">
      ${row(copyBlock(copy, 'text-white', 'text-white/85', '#ffffff'), button(site, copy, 'white'))}
    </div>`,
    `radial-gradient(60% 100% at 50% 100%,rgba(0,185,198,.30),transparent 70%)`),
};

export const renderClosingWide = (site, c, layoutKey, copyKey = 'verbatim') =>
  (LAYOUTS[layoutKey] ?? LAYOUTS.paperGlow)(site, c, CLOSING_COPY[copyKey] ?? CLOSING_COPY.verbatim);

// Each layout is previewed with a different wording so the gallery shows both
// levers at once. They are independent — any pairing works.
export const LAYOUT_COPY_PAIRING = {
  paperGlow: 'verbatim',
  duskGlow: 'startsHere',
  gradientEdge: 'nowYours',
  photoSliver: 'seatWaiting',
  ticketBar: 'comeSee',
  duotoneBand: 'nowYours',
};

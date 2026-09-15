// Compact mobile treatments for the closing CTA ticket.
//
// On desktop the panel is a single row: copy on the left, the Register button,
// then a dated stub separated by a vertical dashed rule — a ticket with a
// tear-off. Below md it becomes a column, and the tear-off rule turns
// horizontal.
//
// That column is where the height goes. Three blocks with gap-8 between them,
// the stub adding its own pt-6 under a dashed border, and a button that sits
// inline at its natural width rather than filling the row it now owns.
//
// Everything here is MOBILE ONLY, paired with sm:/md: values restoring the
// shipped ticket. The desktop row is untouched in all four.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const CLOSING_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline: panel padding py-8, gap-8 between the three blocks, a 1.6rem heading, a button at its natural width, and the stub under a dashed rule with its own 24px of padding.',
    pad: 'px-5 py-8', gap: 'gap-8', head: 'text-[1.6rem]', body: 'text-[16px] mt-2.5',
    btn: 'min-h-[3.25rem] px-8 py-4 text-[14px]', fullBtn: false, stub: 'stacked', order: 'btnFirst',
  },

  tighten: {
    label: 'A — Tighten the panel',
    note: 'Padding 32→24px, the gaps between the three blocks 32→20px, heading 1.6→1.45rem and the body 16→15px. Nothing moves or changes shape — this is the same ticket with the air taken out of a column that was spaced for a row.',
    pad: 'px-5 py-6 sm:py-8', gap: 'gap-5 md:gap-9', head: 'text-[1.45rem] sm:text-[1.6rem]', body: 'text-[15px] mt-2 sm:text-[16px] sm:mt-2.5',
    btn: 'min-h-[3.25rem] px-8 py-4 text-[14px]', fullBtn: false, stub: 'stacked', order: 'btnFirst',
  },

  fullBtn: {
    label: 'B — Button full width (already is)',
    note: 'I added this expecting the button to be sitting at its natural width in the middle of the column. It is not. Measured at 390px it renders 318px wide in both A and B — identical — because the panel is a flex COLUMN below md, and flex items stretch on the cross axis by default. It was already full width without anyone asking it to be. Kept here so the comparison is honest: w-full changes nothing, and there is no tap-target gain to be had.',
    pad: 'px-5 py-6 sm:py-8', gap: 'gap-5 md:gap-9', head: 'text-[1.45rem] sm:text-[1.6rem]', body: 'text-[15px] mt-2 sm:text-[16px] sm:mt-2.5',
    btn: 'min-h-[3.25rem] px-8 py-4 text-[14px]', fullBtn: true, stub: 'stacked', order: 'btnFirst',
  },

  inlineStub: {
    label: 'C — B, stub condensed to one line',
    note: 'B, and below md the tear-off stops being a four-line block. The label, date, location and note collapse into one centred line — "Next live event · October 15-17, 2026 · Dallas, TX" — keeping every word and the dashed rule that makes it read as a ticket stub, while giving back about 60px. The stacked version returns at md where it sits beside the button as a real tear-off.',
    pad: 'px-5 py-6 sm:py-8', gap: 'gap-5 md:gap-9', head: 'text-[1.45rem] sm:text-[1.6rem]', body: 'text-[15px] mt-2 sm:text-[16px] sm:mt-2.5',
    btn: 'min-h-[3.25rem] px-8 py-4 text-[14px]', fullBtn: true, stub: 'inline', order: 'btnFirst',
  },

  stubFirst: {
    label: 'D — C, with the button last',
    note: 'C, and the order below md becomes copy, stub, button — so the date is read on the way to the ask rather than after it, and the button is the last thing before the footer, nearest the thumb. The tear-off rule moves above the stub to match. Same height as C; the difference is entirely what the column argues in what order.',
    pad: 'px-5 py-6 sm:py-8', gap: 'gap-5 md:gap-9', head: 'text-[1.45rem] sm:text-[1.6rem]', body: 'text-[15px] mt-2 sm:text-[16px] sm:mt-2.5',
    btn: 'min-h-[3.25rem] px-8 py-4 text-[14px]', fullBtn: true, stub: 'inline', order: 'stubFirst',
  },
};

const noteEl = (site, inline) => {
  const n = site.nextEvent.upcoming[0].note;
  if (!n) return '';
  return inline
    ? `<span class="font-bold" style="color:#f0569f"> &middot; ${esc(n)}</span>`
    : `<p class="mt-2 font-body text-[10px] font-bold uppercase tracking-[0.2em]" style="color:#f0569f">${esc(n)}</p>`;
};

// Two renderings of the same four facts. The inline one is below md only; the
// stacked one returns at md, where the stub sits beside the button under a
// vertical dashed rule and genuinely reads as a tear-off.
const stub = (site, m) => {
  const stacked = `
  <div class="cta-stub shrink-0 border-t-2 border-dashed pt-6 text-center md:border-t-0 md:border-l-2 md:pl-10 md:pt-0 md:text-left ${m.stub === 'inline' ? 'hidden md:block' : ''} ${m.order === 'stubFirst' ? 'md:order-none' : ''}"
       style="border-color:rgba(255,255,255,.28)">
    <p class="font-body text-[10px] font-bold uppercase tracking-[0.35em]" style="color:${CYAN}">Next live event</p>
    <p class="mt-2 font-display text-[17px] font-bold leading-tight text-white">${esc(site.nextEvent.dates)}</p>
    <p class="font-body text-[15px] text-white/65">${esc(site.nextEvent.location)}</p>
    ${noteEl(site, false)}
  </div>`;

  const inline = m.stub === 'inline' ? `
  <div class="cta-stub border-t-2 border-dashed pt-4 text-center md:hidden"
       style="border-color:rgba(255,255,255,.28)">
    <p class="font-body text-[11px] leading-relaxed text-white/70">
      <span class="font-bold uppercase tracking-[0.2em]" style="color:${CYAN}">Next live event</span>
      <span class="text-white/40"> &middot; </span>
      <span class="font-display font-bold text-white">${esc(site.nextEvent.dates)}</span>
      <span class="text-white/40"> &middot; </span>${esc(site.nextEvent.location)}${noteEl(site, true)}
    </p>
  </div>` : '';

  return inline + stacked;
};

export const renderClosing = (site, c, modeKey) => {
  const m = CLOSING_MODES[modeKey];
  const dots = 'background-image:radial-gradient(rgba(255,255,255,.10) 1px,transparent 1px);background-size:18px 18px';
  const heading = 'Your turning point starts here';
  const hl = 'starts here';
  const i = heading.indexOf(hl);
  const headHtml = heading.slice(0, i) + `<span style="color:${CYAN}">${hl}</span>` + heading.slice(i + hl.length);

  const button = `
  <a href="${esc(site.nextEvent.ctaUrl)}" rel="noopener"
     class="cta-btn group inline-flex ${m.btn} shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-body font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_-14px_rgba(0,0,0,.55)] transition hover:brightness-110 ${m.fullBtn ? 'w-full md:w-auto' : ''} ${m.order === 'stubFirst' ? 'order-last md:order-none' : ''}"
     style="background:${MAGENTA}">
    Register Now
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" class="cta-arrow transition group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </a>`;

  return `
<section id="closing" class="relative bg-white py-8 sm:py-16 ctk ctk-rimGlow">
  <div class="relative mx-auto max-w-content px-4">
    <div aria-hidden="true" class="cta-glow pointer-events-none absolute inset-x-8 bottom-2 top-8 rounded-[1.75rem] blur-2xl"
         style="background:radial-gradient(60% 100% at 50% 100%,rgba(232,32,143,.30),transparent 70%)"></div>
    <div class="cta-shell relative rounded-[1.75rem]">
      <div aria-hidden="true" class="cta-beam pointer-events-none absolute -inset-[2px] overflow-hidden rounded-[1.75rem]"></div>
      <div class="cta-panel relative flex flex-col ${m.gap} rounded-[1.75rem] ${m.pad} sm:px-12 md:flex-row md:items-center"
           style="background:#141414">
        <div class="cta-dots min-w-0 flex-1" style="${dots}">
          <div class="cta-copy min-w-0">
            <h2 class="font-display ${m.head} font-bold leading-tight text-white sm:text-[2rem]">${headHtml}</h2>
            <p class="${m.body} max-w-xl font-body leading-relaxed text-white/70">${esc(c.home.closing.body)}</p>
          </div>
        </div>
        ${button}
        ${stub(site, m)}
      </div>
    </div>
  </div>
</section>`;
};

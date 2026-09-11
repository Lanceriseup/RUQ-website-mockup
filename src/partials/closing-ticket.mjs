// The closing CTA, ticket layout — the one that was chosen.
//
// This now owns its markup rather than calling into closing-wide.mjs. That
// file is the layout gallery and still holds all six panels for reference, but
// the shipped section needs levers the gallery does not have, and threading a
// third one through six layouts to serve one of them is worse than a copy.
//
// Two levers:
//   SIZE    proportion — container width and internal scale, independently
//   MOTION  a continuous loop; all of them run forever by design
//
// Every motion is transform, opacity or background-position only, so the panel
// composites rather than re-laying-out, and every one is switched off under
// prefers-reduced-motion. The panel has to be complete and legible with no
// motion at all.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

// ----------------------------------------------------------------- sizes

// Two axes, varied independently: how wide the panel is, and how big the
// things inside it are. A panel can be narrow and bold, or wide and quiet.
export const CLOSING_SIZES = {
  compact: {
    label: 'Compact — before the 15% bump',
    note: 'Where it was two changes ago. Lowest and lightest; the button carries the section rather than the type. Use this if the panel should read as a footer strip that happens to float.',
    wrap: 'max-w-content', pad: 'px-7 py-9 sm:px-10', radius: 'rounded-[1.5rem]',
    head: 'text-[1.45rem] sm:text-[1.8rem]', body: 'text-[15px] mt-2.5',
    btn: 'min-h-12 px-8 py-3.5 text-[13px]', stubDate: 'text-base', stubPad: 'md:pl-9', gap: 'md:gap-9',
  },
  current: {
    label: 'Current — the 15% version',
    note: 'What is live now, shown for comparison. Everything went up together, which is why it reads as the same panel enlarged rather than a different proportion.',
    wrap: 'max-w-content', pad: 'px-9 py-12 sm:px-14', radius: 'rounded-[2rem]',
    head: 'text-[1.7rem] sm:text-[2.2rem]', body: 'text-[17px] mt-3',
    btn: 'min-h-14 px-9 py-4 text-[15px]', stubDate: 'text-lg', stubPad: 'md:pl-12', gap: 'md:gap-10',
  },
  narrow: {
    label: 'Narrow — a tighter container, same type',
    note: 'The panel pulls in to 64rem while everything inside stays put, so the copy, button and stub sit closer together. Denser and more deliberate; the most premium-looking of the six and the one that least resembles a banner.',
    wrap: 'max-w-5xl', pad: 'px-9 py-12 sm:px-12', radius: 'rounded-[2rem]',
    head: 'text-[1.7rem] sm:text-[2.05rem]', body: 'text-[16px] mt-3',
    btn: 'min-h-14 px-8 py-4 text-[14px]', stubDate: 'text-base', stubPad: 'md:pl-10', gap: 'md:gap-8',
  },
  roomy: {
    label: 'Roomy — same type, far more air',
    note: 'Type identical to current, vertical padding up by half again. Nothing gets louder; the panel just stops feeling packed. The cheapest way to make it look considered.',
    wrap: 'max-w-content', pad: 'px-10 py-16 sm:px-16', radius: 'rounded-[2rem]',
    head: 'text-[1.7rem] sm:text-[2.2rem]', body: 'text-[17px] mt-3',
    btn: 'min-h-14 px-9 py-4 text-[15px]', stubDate: 'text-lg', stubPad: 'md:pl-14', gap: 'md:gap-12',
  },
  bold: {
    label: 'Bold — big heading, restrained padding',
    note: 'The heading jumps to 2.6rem while the padding barely moves, so the panel stays low but the sentence lands hard. Puts the weight on the words rather than on the box.',
    wrap: 'max-w-content', pad: 'px-9 py-11 sm:px-14', radius: 'rounded-[2rem]',
    head: 'text-[1.9rem] sm:text-[2.6rem]', body: 'text-[17px] mt-3',
    btn: 'min-h-14 px-9 py-4 text-[15px]', stubDate: 'text-lg', stubPad: 'md:pl-12', gap: 'md:gap-10',
  },
  grand: {
    label: 'Grand — everything up another step',
    note: 'Biggest type and the most padding. Stops being a strip and becomes a closing statement in its own right. Loudest of the six, and the only one that will noticeably lengthen the page.',
    wrap: 'max-w-content', pad: 'px-10 py-16 sm:px-16', radius: 'rounded-[2.25rem]',
    head: 'text-[2.05rem] sm:text-[2.9rem]', body: 'text-[19px] mt-4',
    btn: 'min-h-16 px-11 py-5 text-[16px]', stubDate: 'text-xl', stubPad: 'md:pl-14', gap: 'md:gap-12',
  },
};

// ---------------------------------------------------------------- motion

export const CLOSING_MOTIONS = {
  none: {
    label: 'None',
    note: 'Static, for comparison.',
  },
  beam: {
    label: 'Beam — a light runs around the panel edge',
    note: 'A bright arc travels the border on a 5-second loop, magenta into cyan. The most eye-catching thing here that does not touch the content — nothing inside the panel moves, so nothing gets harder to read.',
  },
  glowCycle: {
    label: 'Glow cycle — the light beneath changes colour',
    note: 'The glow under the panel drifts side to side and cross-fades magenta to cyan and back over 10 seconds. Affects only the page behind the panel, so it is the calmest of the loops while still clearly alive.',
  },
  arrowRun: {
    label: 'Arrow run — the button keeps pointing',
    note: 'The arrow slides out and returns every 1.6 seconds. The only loop aimed at the click itself rather than the panel, and the one most likely to actually move the number.',
  },
  gridDrift: {
    label: 'Grid drift — the dot texture keeps moving',
    note: 'The dot grid on the panel face travels diagonally, forever and very slowly. Reads as a surface in motion rather than an animation playing. Subtlest of the loops.',
  },
  wordSheen: {
    label: 'Word sheen — light travels through the headline',
    note: 'The highlighted phrase carries a moving gradient, the same device as the hero rotator. Pulls the eye to the sentence instead of the frame, and ties the closing ask back to the top of the page.',
  },
  countdown: {
    label: 'Countdown — the stub counts down, live',
    note: 'The date stub becomes a running clock to the event, ticking every second. By far the strongest attention device here and the only one carrying real information — but it is the one that makes the unconfirmed date load-bearing, and it stops itself once the date passes.',
    needsDate: true,
  },
};

export const motionClass = (key) => (key && key !== 'none') ? `ctk ctk-${key}` : 'ctk';

// ---------------------------------------------------------------- render

const countdownStub = (site) => `
<div class="cta-stub cd-root shrink-0 border-t-2 border-dashed pt-6 text-center md:border-t-0 md:border-l-2 md:pt-0 md:text-left"
     data-countdown="${esc(site.nextEvent.upcoming[0].startsAt)}"
     style="border-color:rgba(255,255,255,.28)">
  <p class="font-body text-[10px] font-bold uppercase tracking-[0.35em]" style="color:${CYAN}">Doors open in</p>
  <div class="mt-2 flex justify-center gap-3 md:justify-start">
    ${[['cd-days', 'days'], ['cd-hours', 'hrs'], ['cd-minutes', 'min'], ['cd-seconds', 'sec']].map(([cls, label]) => `
    <div>
      <span class="${cls} block font-display text-xl font-bold tabular-nums leading-none text-white">--</span>
      <span class="mt-1 block font-body text-[9px] uppercase tracking-[0.2em] text-white/50">${label}</span>
    </div>`).join('')}
  </div>
  <p class="mt-3 font-body text-[9px] uppercase tracking-[0.2em] text-amber-300">Date unconfirmed</p>
</div>`;

const dateStub = (site, size) => `
<div class="cta-stub shrink-0 border-t-2 border-dashed pt-6 text-center md:border-t-0 md:border-l-2 ${size.stubPad} md:pt-0 md:text-left"
     style="border-color:rgba(255,255,255,.28)">
  <p class="font-body text-[10px] font-bold uppercase tracking-[0.35em]" style="color:${CYAN}">Next live event</p>
  <p class="mt-2 font-display ${size.stubDate} font-bold leading-tight text-white">${esc(site.nextEvent.dates)}</p>
  <p class="font-body text-[15px] text-white/65">${esc(site.nextEvent.location)}</p>
  <p class="mt-2 font-body text-[9px] uppercase tracking-[0.2em] text-amber-300">Dates unconfirmed</p>
</div>`;

// The highlighted phrase takes a gradient fill under wordSheen and a flat
// colour otherwise. `.sheen` already carries an @supports guard, so a browser
// without background-clip:text still gets visible text rather than nothing.
const headingHtml = (copy, motionKey) => {
  const head = esc(copy.heading);
  const hl = esc(copy.highlight ?? '');
  const i = hl ? head.indexOf(hl) : -1;
  if (i < 0) return head;
  const mark = motionKey === 'wordSheen'
    ? `<span class="sheen">${hl}</span>`
    : `<span style="color:${CYAN}">${hl}</span>`;
  return head.slice(0, i) + mark + head.slice(i + hl.length);
};

export const closingTicket = (site, c, copy, sizeKey = 'current', motionKey = 'none') => {
  const size = CLOSING_SIZES[sizeKey] ?? CLOSING_SIZES.current;
  const dots = 'background-image:radial-gradient(rgba(255,255,255,.10) 1px,transparent 1px);background-size:18px 18px';

  return `
<section class="relative bg-white py-16 ${motionClass(motionKey)}">
  <div class="relative mx-auto ${size.wrap} px-4">

    <!-- Glow. Inset differently from the panel so it is wider than the thing
         casting it — light thrown on the page, not a drop shadow. -->
    <div aria-hidden="true" class="cta-glow pointer-events-none absolute inset-x-8 bottom-2 top-8 ${size.radius} blur-2xl"
         style="background:radial-gradient(60% 100% at 50% 100%,rgba(232,32,143,.30),transparent 70%)"></div>
    <div aria-hidden="true" class="cta-glow-alt pointer-events-none absolute inset-x-8 bottom-2 top-8 ${size.radius} opacity-0 blur-2xl"
         style="background:radial-gradient(60% 100% at 50% 100%,rgba(0,185,198,.34),transparent 70%)"></div>

    <div class="cta-shell relative ${size.radius}">
      <!-- Beam layer. Deliberately 2px LARGER than the panel on every side:
           the panel is an opaque sibling painted after this, so at inset-0 it
           would cover the beam edge to edge and nothing would show. The 2px
           it sticks out by is the entire effect. -->
      <div aria-hidden="true" class="cta-beam pointer-events-none absolute -inset-[2px] overflow-hidden ${size.radius}"></div>

      <div class="cta-panel relative flex flex-col gap-8 ${size.radius} ${size.pad} ${size.gap} shadow-[0_40px_90px_-45px_rgba(0,0,0,.6)] md:flex-row md:items-center"
           style="background:#141414">

        <div class="cta-dots min-w-0 flex-1" style="${dots}">
          <div class="cta-copy min-w-0">
            <h2 class="font-display ${size.head} font-bold leading-tight text-white">${headingHtml(copy, motionKey)}</h2>
            <p class="${size.body} max-w-xl font-body leading-relaxed text-white/70">${esc(copy.body)}</p>
          </div>
        </div>

        <a href="${esc(site.nextEvent.ctaUrl)}" rel="noopener"
           class="cta-btn group inline-flex ${size.btn} shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl
                  font-body font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_-14px_rgba(0,0,0,.55)]
                  transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta"
           style="background:${MAGENTA}">
          ${esc(copy.button)}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
               class="cta-arrow transition group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>

        ${motionKey === 'countdown' ? countdownStub(site) : dateStub(site, size)}
      </div>
    </div>
  </div>
</section>`;
};

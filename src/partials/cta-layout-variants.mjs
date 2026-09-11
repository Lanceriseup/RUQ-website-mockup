// CTA layouts that share almost nothing with each other.
//
// The earlier sets all put a centred card on a ground and varied the ground.
// These vary the STRUCTURE: where the heading sits relative to the fields,
// whether there is a container at all, whether the section is one row or two
// columns, and how wide it runs. Each also takes a different ground, so
// features can be lifted independently — the layout of one with the ground of
// another is a valid answer.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const CTA_LAYOUTS = {
  band: {
    label: 'Band — one horizontal row, no container',
    structure: 'heading · fields · button, all on one line',
    note: 'The whole thing collapses to a single strip: heading left, both fields and the button inline to the right. No card, no box. Shortest section on the page and the fastest to act on.',
  },
  billboard: {
    label: 'Billboard — enormous heading, form small beneath',
    structure: 'giant type stacked over a narrow form',
    note: 'The heading runs at display scale across the full width with the form reduced to a modest block under it. The words do the selling and the form is just the mechanism.',
  },
  sidecar: {
    label: 'Sidecar — form pinned as a tall panel on the right',
    structure: 'full-bleed split, solid panel one side',
    note: 'A solid brand panel runs the full height of the section on the right with the form in it, heading in the open space left. Asymmetric and architectural rather than centred.',
  },
  overlap: {
    label: 'Overlap — heading behind, form card breaking across it',
    structure: 'layered, card offset over oversized type',
    note: 'Oversized ghost type sits behind and the form card overlaps it off-centre. The most layered; depth comes from the collision rather than from shadow.',
  },
  bookend: {
    label: 'Bookend — heading top, fields as a wide row beneath',
    structure: 'centred heading, fields side by side full width',
    note: 'Heading centred at the top, then the two fields and the button spread across one wide row. Reads as a footer-style capture bar — quiet, wide, and it takes very little height.',
  },
  ticketStub: {
    label: 'Ticket — punched pass, heading on the stub',
    structure: 'two-part card with a perforated divide',
    note: 'The card is split by a dashed perforation with the heading on one half and the fields on the other. Ties back to the event; the only option with a metaphor in it.',
  },
};

const field = (f, cls) => `
<div class="flex-1">
  <label for="cl-${esc(f.name)}" class="sr-only">${esc(f.label)}</label>
  <input id="cl-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}"
         placeholder="${esc(f.label)}" disabled class="${cls} disabled:cursor-not-allowed">
</div>`;

const btn = (c, cls, style = '') => `
<button type="submit" disabled class="${cls} disabled:cursor-not-allowed" ${style ? `style="${style}"` : ''}>
  ${esc(c.home.cta.button)}
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</button>`;

const PILL = 'w-full rounded-full border border-white/25 bg-white/92 px-5 py-3.5 font-body text-ink placeholder:text-ink-soft/70';
const SQUARE = 'w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 font-body text-ink placeholder:text-ink-soft/60';
const RULED = 'w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 font-body text-lg text-white outline-none placeholder:text-white/50';

export const renderCtaLayout = (site, c, key) => {
  const F = c.home.cta.fields;

  /* ── BAND — one row, no container, deep gradient ground ───────────── */
  if (key === 'band') {
    return `
<section class="relative overflow-hidden py-14" style="background:linear-gradient(100deg,#1c1c1c,#3a1030 45%,#0d3f45)">
  <div class="relative mx-auto flex max-w-content flex-col gap-6 px-6 lg:flex-row lg:items-center">
    <h2 class="shrink-0 font-display text-2xl font-bold leading-tight text-white lg:max-w-xs lg:text-[1.75rem]">
      ${esc(c.home.cta.heading)}
    </h2>
    <form action="#" method="post" novalidate class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
      ${F.map(f => field(f, PILL)).join('')}
      ${btn(c, 'flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 font-body text-xs font-bold uppercase tracking-[0.2em] text-white', `background:${MAGENTA}`)}
    </form>
  </div>
</section>`;
  }

  /* ── BILLBOARD — giant type, small form, flat magenta ─────────────── */
  if (key === 'billboard') {
    return `
<section class="relative overflow-hidden py-28" style="background:${MAGENTA}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 opacity-25"
       style="background-image:radial-gradient(rgba(255,255,255,.5) 1px,transparent 1px);background-size:22px 22px"></div>
  <div class="relative mx-auto max-w-content px-6 text-center">
    <h2 class="mx-auto max-w-4xl font-display font-extrabold uppercase leading-[.95] text-white"
        style="font-size:clamp(2.5rem,7vw,5.5rem);letter-spacing:-.02em">${esc(c.home.cta.heading)}</h2>
    <form action="#" method="post" novalidate class="mx-auto mt-12 max-w-md space-y-3">
      ${F.map(f => field(f, SQUARE)).join('')}
      ${btn(c, 'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white')}
    </form>
  </div>
</section>`;
  }

  /* ── SIDECAR — full-bleed split, solid panel right ────────────────── */
  if (key === 'sidecar') {
    return `
<section class="relative bg-ink">
  <div class="grid lg:grid-cols-[7fr_5fr]">
    <div class="relative flex items-center overflow-hidden px-6 py-24 lg:px-14">
      <div aria-hidden="true" class="pointer-events-none absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full blur-3xl"
           style="background:radial-gradient(circle,rgba(232,32,143,.35),transparent 68%)"></div>
      <h2 class="relative font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl">${esc(c.home.cta.heading)}</h2>
    </div>
    <div class="flex items-center px-6 py-16 lg:px-12" style="background:linear-gradient(160deg,${CYAN},#048b96)">
      <form action="#" method="post" novalidate class="w-full space-y-5">
        ${F.map(f => field(f, 'w-full rounded-xl border-0 bg-white/95 px-4 py-3.5 font-body text-ink placeholder:text-ink-soft/70')).join('')}
        ${btn(c, 'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white')}
      </form>
    </div>
  </div>
</section>`;
  }

  /* ── OVERLAP — ghost type behind, card breaking across it ─────────── */
  if (key === 'overlap') {
    return `
<section class="relative overflow-hidden py-28" style="background:#101014">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0"
       style="background:radial-gradient(60% 50% at 70% 40%,rgba(0,185,198,.20),transparent 70%),radial-gradient(50% 50% at 20% 70%,rgba(232,32,143,.22),transparent 70%)"></div>
  <div class="relative mx-auto max-w-content px-6">
    <h2 aria-hidden="true" class="select-none font-display font-extrabold uppercase leading-[.85] text-transparent"
        style="font-size:clamp(3rem,10vw,8rem);-webkit-text-stroke:1.5px rgba(255,255,255,.22)">${esc(c.home.cta.heading)}</h2>
    <div class="relative -mt-16 ml-auto max-w-md rounded-2xl p-8 ring-1 ring-white/20 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] lg:-mt-24 lg:mr-10"
         style="background:rgba(255,255,255,.10);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)">
      <h3 class="sr-only">${esc(c.home.cta.heading)}</h3>
      <form action="#" method="post" novalidate class="space-y-4">
        ${F.map(f => field(f, PILL)).join('')}
        ${btn(c, 'flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white', `background:${MAGENTA}`)}
      </form>
    </div>
  </div>
</section>`;
  }

  /* ── BOOKEND — centred heading, wide field row, light ground ──────── */
  if (key === 'bookend') {
    return `
<section class="relative overflow-hidden bg-white py-20">
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-px"
       style="background:linear-gradient(to right,transparent,${MAGENTA},${CYAN},transparent)"></div>
  <div class="relative mx-auto max-w-content px-6 text-center">
    <h2 class="font-display text-3xl font-bold text-ink sm:text-4xl">${esc(c.home.cta.heading)}</h2>
    <form action="#" method="post" novalidate class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
      ${F.map(f => field(f, SQUARE)).join('')}
      ${btn(c, 'flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-body text-sm font-bold uppercase tracking-[0.2em] text-white sm:w-auto', `background:${MAGENTA}`)}
    </form>
  </div>
</section>`;
  }

  /* ── TICKET — perforated two-part card ────────────────────────────── */
  return `
<section class="relative overflow-hidden py-24" style="background:linear-gradient(150deg,#1c1c1c,#2b1224 55%,#08343a)">
  <div class="relative mx-auto max-w-3xl px-6">
    <div class="overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)]">
      <div class="grid md:grid-cols-[5fr_6fr]">
        <div class="relative flex items-center p-9" style="background:linear-gradient(160deg,${MAGENTA},#b81870)">
          <h2 class="font-display text-3xl font-bold leading-tight text-white">${esc(c.home.cta.heading)}</h2>
          <span aria-hidden="true" class="absolute -right-4 -top-4 hidden h-8 w-8 rounded-full md:block" style="background:#1c1c1c"></span>
          <span aria-hidden="true" class="absolute -bottom-4 -right-4 hidden h-8 w-8 rounded-full md:block" style="background:#2b1224"></span>
        </div>
        <div class="bg-white p-9 md:border-l md:border-dashed md:border-ink/25">
          <form action="#" method="post" novalidate class="space-y-4">
            ${F.map(f => field(f, SQUARE)).join('')}
            ${btn(c, 'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white')}
          </form>
        </div>
      </div>
    </div>
  </div>
</section>`;
};

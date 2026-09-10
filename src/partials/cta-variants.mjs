// Dates + Register treatments for the bottom of the hero.
//
// The current version shows only the two date strings and a button, and throws
// away two fields already sitting in site.json: the location, and the
// "LIMITED SPOTS" note on the October event. Every option below uses them —
// scarcity and place are the two things that actually move an event booking.
import { esc } from './layout.mjs';

export const CTAS = {
  ticket: {
    label: 'Ticket stub — perforated pass with a tear-off action',
    note: 'The dates sit on a ticket with a punched edge and a dashed tear line, with Register as the stub. Thematically right for an event, and the one nobody else on the page has seen before.',
  },
  cards: {
    label: 'Date cards — two frosted panels, the near one lit',
    note: 'Each date gets a card carrying its location and badge. October is raised and ringed in cyan; May sits back. Matches the nav capsule and the VSL frame, so the page reads as one system.',
  },
  countdown: {
    label: 'Live countdown — days, hours, minutes to the doors opening',
    note: 'A real ticking countdown to 15 October. The strongest urgency device available and the biggest wow, but it commits you to the date being right.',
  },
  editorial: {
    label: 'Editorial rows — hairline-separated, each date its own action',
    note: 'Dates as a refined list: date, location and badge across a row with its own Register link. Quietest option, and the only one where each event is separately bookable.',
  },
  marquee: {
    label: 'Marquee bar — one glass strip, dates left, action right',
    note: 'Everything on a single horizontal glass bar. Compact, so the hero stays short and the page moves on quickly.',
  },
  spotlightCard: {
    label: 'Single focus — October only, May as a footnote',
    note: 'Commits to one event: October large with its badge and location, May reduced to a line beneath. The clearest hierarchy, because two equally-weighted dates make people defer the decision.',
  },
};

const btn = (site, size = 'lg') => `
<a href="${esc(site.nextEvent.ctaUrl)}"
   class="group inline-flex min-h-11 items-center gap-3 rounded-full bg-magenta font-body font-bold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_-18px_rgba(232,32,143,.9)] transition hover:bg-magenta-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta ${size === 'lg' ? 'px-10 py-5 text-sm' : 'px-7 py-3 text-xs'}">
   ${esc(site.nextEvent.ctaText)}
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
        class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</a>`;

const badge = (note) => note
  ? `<span class="inline-flex items-center rounded-full bg-cyan px-3 py-1 font-body text-[10px] font-bold uppercase tracking-[0.18em] text-ink">${esc(note)}</span>`
  : '';

const eyebrow = (c) => `<p class="font-body text-sm font-semibold uppercase tracking-[0.2em] text-magenta">${esc(c.home.hero.eyebrow)}</p>`;

export const renderCta = (site, c, key) => {
  const [first, second] = site.nextEvent.upcoming;

  if (key === 'ticket') {
    return `
<div class="mx-auto max-w-2xl">
  <div class="relative overflow-hidden rounded-2xl text-left shadow-[0_30px_70px_-30px_rgba(0,0,0,.9)]"
       style="background:rgba(255,255,255,.08);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.22)">
    <div class="grid sm:grid-cols-[1fr_auto]">
      <div class="p-7">
        ${eyebrow(c)}
        <p class="mt-3 font-display text-3xl font-bold text-white">${esc(first.dates)}</p>
        <p class="mt-1 font-body text-sm text-white/70">${esc(first.location)}</p>
        <div class="mt-4">${badge(first.note)}</div>
        <p class="mt-5 border-t border-white/15 pt-4 font-body text-sm text-white/60">
          Next after that &middot; <span class="text-white/85">${esc(second.dates)}</span></p>
      </div>
      <!-- Punched edge + tear line: the two half-circles bite out of the card,
           and the dashed rule reads as a perforation rather than a divider. -->
      <div class="relative flex items-center justify-center border-white/20 p-7 sm:border-l sm:border-dashed"
           style="background:rgba(255,255,255,.05)">
        <span aria-hidden="true" class="absolute -top-3 left-1/2 hidden h-6 w-6 -translate-x-1/2 rounded-full bg-ink sm:block"></span>
        <span aria-hidden="true" class="absolute -bottom-3 left-1/2 hidden h-6 w-6 -translate-x-1/2 rounded-full bg-ink sm:block"></span>
        ${btn(site, 'sm')}
      </div>
    </div>
  </div>
</div>`;
  }

  if (key === 'cards') {
    return `
<div class="mx-auto max-w-3xl">
  ${eyebrow(c)}
  <div class="mt-6 grid gap-4 sm:grid-cols-2">
    <div class="rounded-2xl p-6 text-left ring-1 ring-cyan/50 shadow-[0_0_60px_-24px_rgba(0,185,198,.7)]"
         style="background:rgba(255,255,255,.10);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)">
      <div>${badge(first.note)}</div>
      <p class="mt-3 font-display text-2xl font-bold text-white">${esc(first.dates)}</p>
      <p class="mt-1 font-body text-sm text-white/70">${esc(first.location)}</p>
    </div>
    <div class="rounded-2xl p-6 text-left ring-1 ring-white/15"
         style="background:rgba(255,255,255,.05)">
      <p class="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">Also scheduled</p>
      <p class="mt-3 font-display text-2xl font-bold text-white/85">${esc(second.dates)}</p>
      <p class="mt-1 font-body text-sm text-white/60">${esc(second.location)}</p>
    </div>
  </div>
  <div class="mt-8">${btn(site)}</div>
</div>`;
  }

  if (key === 'countdown') {
    return `
<div class="mx-auto max-w-3xl" data-countdown="${esc(first.startsAt)}">
  ${eyebrow(c)}
  <p class="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">${esc(first.dates)} &middot; ${esc(first.location)}</p>
  <div class="mt-7 flex justify-center gap-3 sm:gap-5">
    ${['days', 'hours', 'minutes', 'seconds'].map(u => `
    <div class="min-w-[76px] rounded-2xl px-4 py-4 ring-1 ring-white/20 sm:min-w-[96px]"
         style="background:rgba(255,255,255,.08);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)">
      <p class="cd-${u} font-display text-3xl font-extrabold tabular-nums text-white sm:text-4xl">--</p>
      <p class="mt-1 font-body text-[10px] uppercase tracking-[0.2em] text-cyan">${u}</p>
    </div>`).join('')}
  </div>
  <div class="mt-8 flex flex-col items-center gap-3">
    ${btn(site)}
    ${badge(first.note)}
  </div>
</div>`;
  }

  if (key === 'editorial') {
    return `
<div class="mx-auto max-w-3xl text-left">
  ${eyebrow(c)}
  <ul class="mt-5 divide-y divide-white/15 border-y border-white/15">
    ${site.nextEvent.upcoming.map(e => `
    <li class="flex flex-wrap items-center justify-between gap-4 py-5">
      <div>
        <p class="font-display text-2xl font-bold text-white">${esc(e.dates)}</p>
        <p class="mt-1 font-body text-sm text-white/60">${esc(e.location)}</p>
      </div>
      ${e.note ? badge(e.note) : '<span></span>'}
      <a href="${esc(site.nextEvent.ctaUrl)}"
         class="inline-flex min-h-11 items-center border-b-2 border-cyan pb-1 font-body text-xs font-bold uppercase tracking-[0.25em] text-white transition hover:border-white">
         ${esc(site.nextEvent.ctaText)}</a>
    </li>`).join('')}
  </ul>
</div>`;
  }

  if (key === 'marquee') {
    return `
<div class="mx-auto max-w-4xl">
  <div class="flex flex-col items-center gap-5 rounded-full px-8 py-5 ring-1 ring-white/20 sm:flex-row sm:justify-between"
       style="background:rgba(255,255,255,.08);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)">
    <div class="text-center sm:text-left">
      <p class="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-magenta">${esc(c.home.hero.eyebrow)}</p>
      <p class="mt-1 font-display text-lg font-bold text-white sm:text-xl">
        ${esc(first.dates)} <span class="text-white/45">&middot;</span> ${esc(first.location)}
      </p>
    </div>
    <div class="flex items-center gap-4">${badge(first.note)}${btn(site, 'sm')}</div>
  </div>
  <p class="mt-4 font-body text-sm text-white/55">Also scheduled &middot; ${esc(second.dates)}</p>
</div>`;
  }

  // spotlightCard
  return `
<div class="mx-auto max-w-2xl">
  <div class="rounded-3xl p-9 ring-1 ring-cyan/40 shadow-[0_0_90px_-30px_rgba(0,185,198,.8)]"
       style="background:rgba(255,255,255,.09);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)">
    ${eyebrow(c)}
    <p class="mt-4 font-display text-4xl font-extrabold leading-none text-white sm:text-5xl">${esc(first.dates)}</p>
    <p class="mt-3 font-body text-base text-white/75">${esc(first.location)}</p>
    <div class="mt-5">${badge(first.note)}</div>
    <div class="mt-8">${btn(site)}</div>
  </div>
  <p class="mt-5 font-body text-sm text-white/50">Can't make October? The next is ${esc(second.dates)}.</p>
</div>`;
};

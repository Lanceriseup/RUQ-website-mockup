// CTA section treatments.
//
// The live version is a plain white card on a desaturated photo — it reads as
// a form that happened to land there rather than a moment the page has been
// building toward. This is the last thing before the footer and the only place
// on the page that captures anything, so it should be the loudest.
//
// Every option keeps the fields inert and says so. The live form posts to a
// Brizy handler; Jayden reported the Jotform routes broke and the plan was MOS
// into Ontraport, so nothing here should be wired without that decision.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const CTA_SECTIONS = {
  spotlight: {
    label: 'Spotlight — dark, lit, the card glowing out of it',
    note: 'Full-bleed dark with the event photography behind and a cyan bloom lighting the card. Bookends the hero, so the page opens and closes in the same register. Loudest of the six.',
  },
  gradient: {
    label: 'Gradient block — full magenta-to-cyan, white card on top',
    note: 'The whole band becomes brand colour with the form floating white on it. Impossible to scroll past, and the only place on the page where both brand colours run at full strength.',
  },
  split: {
    label: 'Split — photography one side, form the other',
    note: 'A full-height photograph beside the form rather than behind it, so neither fights the other. The mission text sits under the form as supporting copy. Most readable.',
  },
  glass: {
    label: 'Glass — frosted card over full-colour photography',
    note: 'The photograph stays in full colour, not desaturated, with the form on frosted glass over it. Same material as the nav capsule and the VSL frame, so the page closes with the language it opened with.',
  },
  editorial: {
    label: 'Editorial — script heading, hairlines, understated',
    note: 'The breakthrough line set in the brush script with the form beneath as ruled fields, no box at all. The quietest, and it matches the spread above rather than shouting over it.',
  },
  ticket: {
    label: 'Ticket — the form as a pass, mission on the stub',
    note: 'The card is punched and perforated like an event pass, with the mission statement on the tear-off half. Ties back to the event, and it is the one nobody expects.',
  },
};

// Inert fields, consistently marked. A form that looks live but is not is
// worse than one that is obviously a placeholder.
const form = (c, opts = {}) => {
  const { onDark = false, buttonBg = MAGENTA, buttonText = '#fff', flat = false } = opts;
  const label = onDark ? 'text-white/70' : 'text-ink-soft';
  const field = flat
    ? `w-full border-0 border-b bg-transparent px-0 py-3 font-body text-lg outline-none ${onDark ? 'border-white/30 text-white placeholder:text-white/40' : 'border-ink/20 text-ink placeholder:text-ink-soft/60'}`
    : `w-full rounded-xl border bg-white px-4 py-3.5 font-body ${onDark ? 'border-white/20' : 'border-ink/15'} text-ink placeholder:text-ink-soft/60`;

  return `
<form action="#" method="post" novalidate class="space-y-4" aria-describedby="cta-note">
  ${c.home.cta.fields.map(f => `
  <div>
    <label for="cta-${esc(f.name)}" class="sr-only">${esc(f.label)}</label>
    <input id="cta-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}" placeholder="${esc(f.label)}"
           disabled class="${field} disabled:cursor-not-allowed disabled:opacity-70">
  </div>`).join('')}
  <button type="submit" disabled
          class="group flex w-full min-h-11 items-center justify-center gap-3 rounded-xl px-6 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] opacity-80 disabled:cursor-not-allowed"
          style="background:${buttonBg};color:${buttonText}">
    ${esc(c.home.cta.button)}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </button>
  <p id="cta-note" class="text-center font-body text-[11px] uppercase tracking-[0.15em] ${label}">Mockup only — not connected</p>
</form>`;
};

const heading = (c, cls) => `<h2 class="font-display text-3xl font-bold leading-tight ${cls} sm:text-[2.5rem]">${esc(c.home.cta.heading)}</h2>`;
const mission = (c, cls) => `<p class="font-body leading-relaxed ${cls}">${esc(c.home.cta.mission)}</p>`;
const photo = (cls, filter = '') =>
  `<img src="/assets/photos/gallery-2-2.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" class="${cls}" ${filter ? `style="filter:${filter}"` : ''}>`;

export const renderCtaSection = (site, c, key) => {
  if (key === 'spotlight') {
    return `
<section class="relative overflow-hidden bg-ink py-24">
  ${photo('absolute inset-0 h-full w-full object-cover opacity-25', 'grayscale(.4)')}
  <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink/90"></div>
  <div aria-hidden="true" class="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
       style="background:radial-gradient(circle,rgba(0,185,198,.32),transparent 68%)"></div>
  <div class="relative mx-auto max-w-2xl px-6 text-center">
    ${heading(c, 'text-white')}
    <div class="mt-10 rounded-3xl p-8 ring-1 ring-white/20 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)]"
         style="background:rgba(255,255,255,.08);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)">
      ${form(c, { onDark: true, buttonBg: CYAN, buttonText: '#1c1c1c' })}
    </div>
    <div class="mt-12">${mission(c, 'text-white/70')}</div>
  </div>
</section>`;
  }

  if (key === 'gradient') {
    return `
<section class="relative overflow-hidden py-24" style="background:linear-gradient(135deg,${MAGENTA},#f0569f 45%,${CYAN})">
  <div class="relative mx-auto max-w-2xl px-6 text-center">
    ${heading(c, 'text-white')}
    <div class="mt-10 rounded-3xl bg-white p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,.55)]">
      ${form(c, { buttonBg: MAGENTA })}
    </div>
    <div class="mt-12">${mission(c, 'text-white/85')}</div>
  </div>
</section>`;
  }

  if (key === 'split') {
    return `
<section class="bg-ink">
  <div class="grid lg:grid-cols-2">
    <div class="relative min-h-[420px] lg:min-h-full">
      ${photo('absolute inset-0 h-full w-full object-cover')}
    </div>
    <div class="px-6 py-20 lg:px-14">
      ${heading(c, 'text-white')}
      <div class="mt-8 max-w-md">${form(c, { onDark: true, buttonBg: CYAN, buttonText: '#1c1c1c' })}</div>
      <div class="mt-10 max-w-md">${mission(c, 'text-white/65 text-sm')}</div>
    </div>
  </div>
</section>`;
  }

  if (key === 'glass') {
    return `
<section class="relative overflow-hidden py-24">
  ${photo('absolute inset-0 h-full w-full object-cover')}
  <div aria-hidden="true" class="absolute inset-0 bg-ink/45"></div>
  <div class="relative mx-auto max-w-xl px-6">
    <div class="rounded-[2rem] p-9 ring-1 ring-white/30 shadow-[0_40px_90px_-40px_rgba(0,0,0,.8)]"
         style="background:rgba(255,255,255,.14);backdrop-filter:blur(26px) saturate(1.4);-webkit-backdrop-filter:blur(26px) saturate(1.4)">
      ${heading(c, 'text-center text-white')}
      <div class="mt-8">${form(c, { onDark: true, buttonBg: MAGENTA })}</div>
    </div>
    <div class="mt-10 text-center">${mission(c, 'text-white/80 text-sm')}</div>
  </div>
</section>`;
  }

  if (key === 'editorial') {
    return `
<section class="relative overflow-hidden bg-white py-24">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="absolute -right-32 top-0 h-[30rem] w-[30rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(232,32,143,.14),transparent 68%)"></div>
  </div>
  <div class="relative mx-auto grid max-w-content gap-14 px-6 lg:grid-cols-[6fr_6fr]">
    <div>
      <span class="script block" style="color:${MAGENTA};font-size:4rem;line-height:.9">It&rsquo;s time</span>
      <span class="mt-2 block font-display text-2xl font-bold uppercase tracking-[0.06em] text-ink sm:text-[2.1rem]">for your breakthrough</span>
      <div class="mt-10 max-w-md">${mission(c, 'text-ink-soft')}</div>
    </div>
    <div class="lg:pt-6">${form(c, { flat: true, buttonBg: MAGENTA })}</div>
  </div>
</section>`;
  }

  // ticket
  return `
<section class="relative overflow-hidden bg-ink py-24">
  ${photo('absolute inset-0 h-full w-full object-cover opacity-20', 'grayscale(.5)')}
  <div aria-hidden="true" class="absolute inset-0 bg-ink/70"></div>
  <div class="relative mx-auto max-w-4xl px-6">
    <div class="overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)]">
      <div class="grid md:grid-cols-[7fr_5fr]">
        <div class="bg-white p-9">
          ${heading(c, 'text-ink')}
          <div class="mt-8">${form(c, { buttonBg: MAGENTA })}</div>
        </div>
        <!-- Perforated stub: dashed edge plus the two punched half-circles. -->
        <div class="relative border-white/0 bg-white p-9 md:border-l md:border-dashed md:border-ink/25"
             style="background:linear-gradient(180deg,#FDEFF7,#ffffff)">
          <span aria-hidden="true" class="absolute -top-4 left-0 hidden h-8 w-8 -translate-x-1/2 rounded-full bg-ink md:block"></span>
          <span aria-hidden="true" class="absolute -bottom-4 left-0 hidden h-8 w-8 -translate-x-1/2 rounded-full bg-ink md:block"></span>
          <p class="font-body text-[10px] uppercase tracking-[0.25em] text-magenta-text">Our mission</p>
          <div class="mt-4">${mission(c, 'text-ink-soft text-sm')}</div>
        </div>
      </div>
    </div>
  </div>
</section>`;
};

// Compact mobile treatments for the About hero — and a fix for the defect
// underneath it.
//
// ── The defect ───────────────────────────────────────────────────────────────
// The hero ends with pb-16 on phones (64px) and pb-28 from sm (112px). The
// journey section that follows is lifted over it by -mt-16 — a flat -64px at
// every width, which is what makes the rounded white panel overlap the hero.
//
// Those two numbers are the same below sm. 64px of padding minus a 64px lift
// is ZERO clearance: the panel's top edge lands exactly on the bottom of the
// dates block, and its rounded corner crops "DALLAS, TX". From sm there is
// 112 - 64 = 48px and it looks deliberate, which is why this only shows on a
// phone.
//
// So the fix is not "add more padding" — it is that the lift is a fixed pixel
// value competing with a responsive one. Either the padding has to clear the
// lift at every width, or the lift has to scale with the padding. B onward
// scale the lift, because that also lets the hero get shorter rather than
// taller.
//
// ── The compaction ───────────────────────────────────────────────────────────
// Measured at 390px the hero is 593px. Its internal gaps are desktop values:
// mt-10 to the video, mt-8 to the action block, gap-5 inside it.
//
// All options are MOBILE ONLY; the desktop hero and its overlap are untouched.
import { esc } from './layout.mjs';

const SANS_LINE = 'block font-display text-base font-bold uppercase leading-snug tracking-[0.2em] text-white sm:text-2xl';

export const ABOUT_MODES = {
  current: {
    label: 'Current — the defect',
    note: 'The state in your screenshot: pb-16 against a -64px lift, so the dates have zero clearance and the panel crops the location line.',
    pad: 'pb-16 pt-24', gapWord: 'mt-3', gapVsl: 'mt-10', gapAction: 'mt-8', gapInner: 'gap-5',
    lift: '-mt-16', dates: 'both',
  },

  clearance: {
    label: 'A — Fix the clearance only',
    note: 'The lift becomes -mt-6 below sm (24px) against the same pb-16, so the dates get 40px of clear space before the panel starts and the overlap still reads as an overlap. Nothing else changes — the hero stays exactly as tall as it is. Take this if the hero length is fine and only the collision is wrong.',
    pad: 'pb-16 pt-24', gapWord: 'mt-3', gapVsl: 'mt-10', gapAction: 'mt-8', gapInner: 'gap-5',
    lift: '-mt-6 sm:-mt-16', dates: 'both',
  },

  compact: {
    label: 'B — A, plus tighten the hero',
    note: 'A, and the hero\'s internal gaps are re-judged for a phone: 40px to the video becomes 24px, 32px to the action block becomes 20px, and the gap between button and dates 20px becomes 16px. These were all set against a 4xl column with a much larger headline above them. Shorter hero, same components, same order.',
    pad: 'pb-12 pt-24', gapWord: 'mt-2 sm:mt-3', gapVsl: 'mt-6 sm:mt-16', gapAction: 'mt-5 sm:mt-12', gapInner: 'gap-4 sm:gap-5',
    lift: '-mt-6 sm:-mt-16', dates: 'both',
  },

  oneLine: {
    label: 'C — B, dates on one line',
    note: 'B, and below sm the two events stop being two stacked two-line blocks either side of a rule. Each becomes a single line — "Oct 15-17, 2026 · Dallas, TX" — one above the other. Same two events, same words, about 30px less, and the dates read as a list rather than as a table with a divider in it.',
    pad: 'pb-12 pt-24', gapWord: 'mt-2 sm:mt-3', gapVsl: 'mt-6 sm:mt-16', gapAction: 'mt-5 sm:mt-12', gapInner: 'gap-4 sm:gap-5',
    lift: '-mt-6 sm:-mt-16', dates: 'lines',
  },

  nextOnly: {
    label: 'D — B, next event only',
    note: 'B, with the second date hidden below sm — the phone shows October 15-17 and nothing else. The shortest, and the only option here that removes information: May 2027 is fourteen months out and is on the events page, so the argument is that a phone hero should carry the next thing to book rather than the calendar. It stays in the markup and returns at sm.',
    pad: 'pb-12 pt-24', gapWord: 'mt-2 sm:mt-3', gapVsl: 'mt-6 sm:mt-16', gapAction: 'mt-5 sm:mt-12', gapInner: 'gap-4 sm:gap-5',
    lift: '-mt-6 sm:-mt-16', dates: 'next',
  },
};

const datesBlock = (site, m) => {
  const [first, second] = site.nextEvent.upcoming;

  if (m.dates === 'lines') {
    return `
    <div class="flex flex-col items-center gap-1 sm:hidden">
      <p class="font-body text-[12px] text-white"><span class="font-display font-bold">${esc(first.dates)}</span><span class="text-white/40"> &middot; </span><span class="uppercase tracking-[0.12em] text-white/60">${esc(first.location)}</span></p>
      <p class="font-body text-[12px] text-white/70"><span class="font-display font-bold">${esc(second.dates)}</span><span class="text-white/30"> &middot; </span><span class="uppercase tracking-[0.12em] text-white/45">${esc(second.location)}</span></p>
    </div>
    ${stacked(first, second, 'hidden sm:flex')}`;
  }

  if (m.dates === 'next') {
    return `
    <div class="sm:hidden">
      <p class="font-display text-sm font-bold text-white">${esc(first.dates)}</p>
      <p class="mt-0.5 font-body text-[11px] uppercase tracking-[0.15em] text-white/50">${esc(first.location)}</p>
    </div>
    ${stacked(first, second, 'hidden sm:flex')}`;
  }

  return stacked(first, second, 'flex');
};

const stacked = (first, second, show) => `
  <div class="${show} items-stretch gap-5 text-center">
    <div>
      <p class="font-display text-sm font-bold text-white">${esc(first.dates)}</p>
      <p class="mt-0.5 font-body text-[11px] uppercase tracking-[0.15em] text-white/50">${esc(first.location)}</p>
    </div>
    <div aria-hidden="true" class="w-px bg-white/20"></div>
    <div>
      <p class="font-display text-sm font-bold text-white/70">${esc(second.dates)}</p>
      <p class="mt-0.5 font-body text-[11px] uppercase tracking-[0.15em] text-white/40">${esc(second.location)}</p>
    </div>
  </div>`;

export const renderAboutHero = (site, c, modeKey) => {
  const m = ABOUT_MODES[modeKey];
  const h = c.about.hero || c.home.hero;
  const words = (h.rotatingWords || ['RISE']).map((w, i) =>
    `<span class="hero-word sheen ${i === 0 ? 'is-on' : ''} font-display font-extrabold uppercase"
       style="grid-area:1/1;font-size:clamp(2.75rem,9vw,6rem);line-height:1;letter-spacing:-.01em">${esc(w)}</span>`).join('');

  return `
<section id="about-hero" class="relative overflow-hidden bg-ink">
  <img src="${esc(c.about.heroPhoto || '/assets/photos/event-8.jpg')}" alt="" aria-hidden="true" loading="eager" decoding="async"
       class="absolute inset-0 h-full w-full object-cover opacity-50">
  <div aria-hidden="true" class="absolute inset-0" style="background:radial-gradient(78% 62% at 50% 46%,rgba(28,28,28,.45),rgba(28,28,28,.9) 100%)"></div>
  <div aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(to bottom,rgba(28,28,28,.68) 0%,rgba(28,28,28,0) 34%,rgba(28,28,28,0) 62%,rgba(28,28,28,.58) 100%)"></div>

  <div class="relative mx-auto max-w-4xl px-4 ${m.pad} text-center sm:pb-28 sm:pt-52">
    <h1 class="text-white">
      <span class="${SANS_LINE}">${esc(h.headingBefore || 'A movement for women who are ready to')}</span>
      <span class="${m.gapWord} block">
        <span class="hero-rotator relative inline-grid" data-swap="fade">${words}</span>
      </span>
    </h1>

    <div class="relative mx-auto ${m.gapVsl} max-w-4xl">
      <div class="overflow-hidden ring-1 ring-cyan/40 shadow-[0_0_100px_-20px_rgba(0,185,198,.48)]">
        <div class="relative aspect-video w-full bg-ink/80">
          <span class="absolute inset-0 flex items-center justify-center">
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 sm:h-20 sm:w-20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#e8208f"><path d="M8 5v14l11-7z"/></svg>
            </span>
          </span>
        </div>
      </div>
    </div>

    <div id="about-action" class="${m.gapAction} flex flex-col items-center ${m.gapInner}">
      <a href="${esc(site.nextEvent.ctaUrl)}" rel="noopener"
         class="group inline-flex min-h-11 items-center gap-3 rounded-full bg-magenta px-9 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_16px_36px_-16px_rgba(232,32,143,.9)]">
        ${esc(site.nextEvent.ctaText)}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
      ${datesBlock(site, m)}
    </div>
  </div>
</section>

<!-- The journey panel that lifts over the hero. The lift is the whole subject:
     it is what has to clear the dates block above it. -->
<div id="about-next" class="relative z-10 ${m.lift} overflow-hidden rounded-t-[2.5rem] bg-white shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)]
            before:absolute before:left-1/2 before:top-4 before:z-20 before:h-1.5 before:w-16 before:-translate-x-1/2 before:rounded-full before:bg-ink/15">
  <div class="px-6 pb-10 pt-12 text-center">
    <p class="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-ink-soft">The journey</p>
    <h2 class="mt-2 font-display text-3xl font-extrabold text-magenta">Doesn't end</h2>
    <p class="mt-2 font-display text-lg font-bold text-ink">after the first event</p>
  </div>
</div>`;
};

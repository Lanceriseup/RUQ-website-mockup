// Design options for the closing CTA — the last thing on the page before the
// footer, and the final ask.
//
// The live version is a full-bleed black strip: heading, one line, a teal
// button. The brief is a floating container instead, so every option here is
// a card inset from the page with ground visible all the way around it. What
// differs between them is what the card is made of and what the ground does.
//
// Copy is the client's, verbatim from the live homepage. The mixed apostrophes
// in the body line are theirs and are preserved — see content.json.
//
// The button is a real link to the registration funnel, not a disabled
// control: unlike the breakthrough form further up the page there is no field
// to mis-handle, so there is nothing to protect against.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
const TINT = '#fdeaf5';
const PHOTO = '/assets/photos/queens-waving.jpg';

export const CLOSING_OPTIONS = {
  spotlight: {
    label: 'Spotlight — a dark slab under a brand light',
    note: 'The card is near-black and the brand glow sits behind it, spilling past its edges onto the page. Nothing on the card competes with the button. Closest in spirit to the live strip, but lifted off the page and lit.',
  },
  aurora: {
    label: 'Aurora — the drifting field, contained',
    note: 'The same four-blob field the breakthrough CTA uses, but clipped inside the card so it reads as something happening within the panel rather than behind the whole page. Ties the two asks together without repeating a layout.',
  },
  glassPhoto: {
    label: 'Glass on photography — a frosted panel over the room',
    note: 'A photographic band runs the width of the section and a frosted panel floats on it. The only option that puts faces behind the final ask, which is the argument the whole page has been making.',
  },
  split: {
    label: 'Split — photograph one side, the ask on the other',
    note: 'The card is divided down the middle: image left, copy and button right. Asymmetric, and the most magazine-like of the six. Reads as a closing spread rather than a banner.',
  },
  ticket: {
    label: 'Ticket — the card as an event pass',
    note: 'Notched sides, a perforated rule, the dates on a stub and the ask on the body. The most literal option and the most memorable: it makes the click feel like collecting something. Shows event dates, which are still unconfirmed.',
  },
  halo: {
    label: 'Halo — a white card ringed in brand light',
    note: 'A clean white card with a thick gradient ring and a slow conic glow turning behind it. The lightest of the six and the only one that keeps the page white to the very end.',
  },
};

// ---------------------------------------------------------------- pieces

const cta = (site, c, tone = 'solid') => {
  const base = 'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-9 py-4 font-body text-sm font-bold uppercase tracking-[0.18em] transition focus-visible:outline-2 focus-visible:outline-offset-4';
  const styles = {
    solid: `background:${MAGENTA};color:#fff`,
    white: 'background:#fff;color:#1c1c1c',
  };
  return `
<a href="${esc(site.nextEvent.ctaUrl)}" rel="noopener"
   class="${base} ${tone === 'white' ? 'focus-visible:outline-white hover:opacity-90' : 'focus-visible:outline-magenta hover:brightness-110'}"
   style="${styles[tone]}">
  ${esc(c.home.closing.button)}
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
       class="transition group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</a>`;
};

// The last three words are the whole point of the sentence, so they are split
// out and set apart rather than left to run on. Matched against the copy, so
// if the client rewrites the line it simply renders unemphasised.
const body = (c, cls, emphasisCls) => {
  const full = c.home.closing.body;
  const em = c.home.closing.emphasis;
  const i = full.lastIndexOf(em);
  if (i < 0) return `<p class="${cls}">${esc(full)}</p>`;
  return `<p class="${cls}">${esc(full.slice(0, i))}<span class="${emphasisCls}">${esc(em)}</span></p>`;
};

const heading = (c, cls) => `<h2 class="${cls}">${esc(c.home.closing.heading)}</h2>`;

// ---------------------------------------------------------------- options

const spotlight = (site, c) => `
<section class="relative overflow-hidden bg-white py-24">
  <!-- The glow is on the section, not the card, so it spills past the card's
       edges. Contained inside it the card would just look like it had a
       gradient background. -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-0"
       style="background:radial-gradient(46% 58% at 50% 50%,rgba(232,32,143,.34),transparent 70%),radial-gradient(38% 50% at 72% 62%,rgba(0,185,198,.28),transparent 72%)"></div>

  <div class="relative mx-auto max-w-4xl px-6">
    <div class="rounded-[2rem] px-8 py-16 text-center shadow-[0_60px_120px_-40px_rgba(0,0,0,.6)] sm:px-16"
         style="background:#141414">
      ${heading(c, 'mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-[2.6rem]')}
      ${body(c, 'mx-auto mt-5 max-w-xl font-body text-lg leading-relaxed text-white/75', 'font-bold text-white')}
      <div class="mt-9">${cta(site, c)}</div>
    </div>
  </div>
</section>`;

const aurora = (site, c) => `
<section class="relative bg-white py-24">
  <div class="mx-auto max-w-4xl px-6">
    <!-- overflow-hidden belongs here, on the card, because the card is the
         thing clipping the field. -->
    <div class="relative overflow-hidden rounded-[2rem] px-8 py-16 text-center shadow-[0_60px_120px_-40px_rgba(0,0,0,.55)] sm:px-16"
         style="background:#141414">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0">
        <div class="cta-blob cta-blob-1 absolute h-[30rem] w-[30rem] rounded-full blur-3xl" style="background:radial-gradient(circle,${MAGENTA}aa,transparent 66%)"></div>
        <div class="cta-blob cta-blob-2 absolute h-[26rem] w-[26rem] rounded-full blur-3xl" style="background:radial-gradient(circle,${CYAN}99,transparent 66%)"></div>
        <div class="cta-blob cta-blob-3 absolute h-[22rem] w-[22rem] rounded-full blur-3xl" style="background:radial-gradient(circle,#f0569f88,transparent 68%)"></div>
        <div class="cta-blob cta-blob-4 absolute h-[20rem] w-[20rem] rounded-full blur-3xl" style="background:radial-gradient(circle,${CYAN}77,transparent 70%)"></div>
      </div>
      <div class="relative">
        ${heading(c, 'mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-[2.6rem]')}
        ${body(c, 'mx-auto mt-5 max-w-xl font-body text-lg leading-relaxed text-white/80', 'font-bold text-white')}
        <div class="mt-9">${cta(site, c, 'white')}</div>
      </div>
    </div>
  </div>
</section>`;

const glassPhoto = (site, c) => `
<section class="relative overflow-hidden py-20">
  <img src="${PHOTO}" alt="" aria-hidden="true" loading="lazy" decoding="async"
       class="absolute inset-0 h-full w-full object-cover">
  <!-- The scrim is what makes white text legal here. Without it the panel
       would be floating over whatever the photograph happens to be doing. -->
  <div aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(120deg,rgba(20,20,20,.86),rgba(20,20,20,.62))"></div>

  <div class="relative mx-auto max-w-3xl px-6">
    <div class="rounded-[2rem] border border-white/25 px-8 py-14 text-center shadow-[0_50px_110px_-40px_rgba(0,0,0,.8)] backdrop-blur-xl sm:px-14"
         style="background:rgba(255,255,255,.10)">
      ${heading(c, 'mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-[2.5rem]')}
      ${body(c, 'mx-auto mt-5 max-w-xl font-body text-lg leading-relaxed text-white/85', 'font-bold text-white')}
      <div class="mt-9">${cta(site, c)}</div>
    </div>
  </div>
</section>`;

const split = (site, c) => `
<section class="relative bg-white py-24">
  <div class="mx-auto max-w-5xl px-6">
    <div class="grid overflow-hidden rounded-[2rem] shadow-[0_60px_120px_-40px_rgba(0,0,0,.5)] md:grid-cols-[5fr_7fr]"
         style="background:#141414">
      <!-- min-h so the image column still has height before the grid resolves
           on a short viewport; without it the photo collapses to nothing. -->
      <div class="relative min-h-[15rem]">
        <img src="${PHOTO}" alt="" aria-hidden="true" loading="lazy" decoding="async"
             class="absolute inset-0 h-full w-full object-cover">
        <div aria-hidden="true" class="absolute inset-0"
             style="background:linear-gradient(to right,rgba(20,20,20,0) 40%,rgba(20,20,20,.85) 100%)"></div>
      </div>
      <div class="px-8 py-14 sm:px-12">
        <span aria-hidden="true" class="block h-1 w-16 rounded-full" style="background:linear-gradient(to right,${MAGENTA},${CYAN})"></span>
        ${heading(c, 'mt-6 max-w-md font-display text-3xl font-bold leading-tight text-white sm:text-[2.4rem]')}
        ${body(c, 'mt-5 max-w-md font-body text-lg leading-relaxed text-white/75', 'font-bold text-white')}
        <div class="mt-9">${cta(site, c)}</div>
      </div>
    </div>
  </div>
</section>`;

const ticket = (site, c) => {
  const GROUND = TINT;
  // The notches are circles painted in the ground colour, sitting on the card
  // edge. They only read as cut-outs while they match what is behind the card,
  // so GROUND has to stay in step with the section background.
  const notch = (side) => `
  <span aria-hidden="true" class="absolute top-1/2 hidden h-9 w-9 -translate-y-1/2 rounded-full md:block ${side === 'left' ? '-left-[1.125rem]' : '-right-[1.125rem]'}"
        style="background:${GROUND}"></span>`;

  return `
<section class="relative py-24" style="background:${GROUND}">
  <div class="mx-auto max-w-4xl px-6">
    <div class="relative grid overflow-visible rounded-[1.75rem] shadow-[0_50px_110px_-40px_rgba(0,0,0,.45)] md:grid-cols-[4fr_7fr]"
         style="background:#141414">
      ${notch('left')}${notch('right')}

      <!-- Stub. Dashed rule on the inner edge only, which is where a real
           ticket tears. -->
      <div class="flex flex-col justify-center gap-1 rounded-t-[1.75rem] px-8 py-10 text-center md:rounded-l-[1.75rem] md:rounded-tr-none md:border-r-2 md:border-dashed md:text-left"
           style="border-color:rgba(255,255,255,.28)">
        <p class="font-body text-[10px] font-bold uppercase tracking-[0.4em]" style="color:${CYAN}">Next live event</p>
        <p class="mt-3 font-display text-xl font-bold leading-tight text-white">${esc(site.nextEvent.dates)}</p>
        <p class="font-body text-sm text-white/70">${esc(site.nextEvent.location)}</p>
        <p class="mt-4 font-body text-[10px] uppercase tracking-[0.2em] text-amber-300">Dates unconfirmed — see site.json</p>
      </div>

      <div class="px-8 py-12 text-center md:px-12 md:text-left">
        ${heading(c, 'max-w-md font-display text-3xl font-bold leading-tight text-white sm:text-[2.3rem]')}
        ${body(c, 'mt-4 max-w-md font-body text-base leading-relaxed text-white/75', 'font-bold text-white')}
        <div class="mt-8">${cta(site, c)}</div>
      </div>
    </div>
  </div>
</section>`;
};

const halo = (site, c) => `
<section class="relative overflow-hidden bg-white py-24">
  <div class="relative mx-auto max-w-3xl px-6">

    <!-- Conic glow behind the card. -z-10 rather than a lower sibling so the
         card's own white background is what hides its centre. -->
    <div aria-hidden="true" class="cta-rays pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 opacity-40 blur-2xl"
         style="background:conic-gradient(from 0deg,${MAGENTA}00,${MAGENTA}88 10%,${MAGENTA}00 20%,${CYAN}00 30%,${CYAN}88 40%,${CYAN}00 50%,${MAGENTA}00 60%,${MAGENTA}77 70%,${MAGENTA}00 80%,${CYAN}00 90%,${CYAN}66 100%)"></div>

    <!-- The ring is a padded gradient wrapper, not a border: a border cannot
         carry a gradient without border-image, which does not round. -->
    <div class="rounded-[2.25rem] p-[3px] shadow-[0_50px_110px_-40px_rgba(0,0,0,.35)]"
         style="background:linear-gradient(135deg,${MAGENTA},${CYAN})">
      <div class="rounded-[2.1rem] bg-white px-8 py-14 text-center sm:px-14">
        ${heading(c, 'mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-ink sm:text-[2.5rem]')}
        ${body(c, 'mx-auto mt-5 max-w-xl font-body text-lg leading-relaxed text-ink-soft', 'font-bold text-ink')}
        <div class="mt-9">${cta(site, c)}</div>
      </div>
    </div>
  </div>
</section>`;

const RENDER = { spotlight, aurora, glassPhoto, split, ticket, halo };

export const renderClosing = (site, c, key) => (RENDER[key] ?? spotlight)(site, c);

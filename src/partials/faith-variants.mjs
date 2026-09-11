// Mission + Statement of Faith.
//
// The live version buries a seven-point doctrinal statement inside a collapsed
// accordion on a washed-out photo. Two problems with that. The photo is
// desaturated to near-grey, so it adds nothing but noise. And the beliefs are
// the most load-bearing content on the page for this audience — a Christian
// women's movement — yet they are the hardest thing to reach.
//
// Every option below keeps a photographic ground (as asked) but treats the
// photo as an image rather than a texture, and gives the seven points a real
// layout instead of a scroll box.
//
// The disclosure is a native <details>/<summary> where one is used: it works
// with no JavaScript, is keyboard-operable and screen-reader-announced for
// free, and cannot end up in a broken half-open state.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const FAITH = {
  creed: {
    label: 'Creed — the seven beliefs laid out, nothing hidden',
    note: 'No accordion at all. The mission sits over the photograph, then the seven points run as a numbered creed on a solid panel below. Longest, and the only one that treats the beliefs as something to be read rather than stored.',
  },
  parallax: {
    label: 'Fixed photograph — content scrolls over a held image',
    note: 'The photo is fixed while the mission and the disclosure move over it. Cheap, striking, and it makes a static image feel like depth. Falls back to a normal background where fixed attachment is unsupported.',
  },
  duotoneSplit: {
    label: 'Duotone split — photo one half, beliefs the other',
    note: 'A full-height duotone photograph beside a dark panel holding the statement. The photo is recoloured into the brand rather than drained to grey, so it belongs to the page.',
  },
  cardsOverPhoto: {
    label: 'Belief cards over a full-bleed photograph',
    note: 'Each of the seven becomes a small frosted card in a grid over the photo. Turns a wall of doctrine into something scannable; the most contemporary of the five.',
  },
  quietDisclosure: {
    label: 'Quiet — mission on the photo, statement in a clean disclosure',
    note: 'Closest to the current structure but properly built: full-colour photo, mission over it, and a native details element beneath that opens in place with the seven points set as a readable list.',
  },
};

const PHOTO = '/assets/photos/gallery-2-1.jpg';
const ALT = 'Women at a Rise Up Queens event';

const mission = (c, cls) => `<p class="mx-auto max-w-3xl text-center font-body text-lg leading-relaxed ${cls}">${esc(c.home.faith.mission)}</p>`;

const beliefList = (c, opts = {}) => `
<ol class="space-y-5">
  ${c.home.faith.beliefs.map((b, i) => `
  <li class="flex gap-5">
    <span aria-hidden="true" class="shrink-0 font-display text-sm font-bold leading-6 tabular-nums"
          style="color:${opts.numeral || MAGENTA}">${String(i + 1).padStart(2, '0')}</span>
    <p class="font-body leading-relaxed ${opts.tone || 'text-ink-soft'}">${esc(b)}</p>
  </li>`).join('')}
</ol>`;

// Native disclosure — no JS, keyboard and screen-reader support for free.
const disclosure = (c, summaryCls, panelCls, listOpts) => `
<details class="group ${panelCls}">
  <summary class="flex cursor-pointer list-none items-center justify-center gap-3 px-6 py-5 font-display text-lg font-bold marker:content-none"
           style="color:${MAGENTA}">
    ${esc(c.home.faith.label)}
    <svg class="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
  </summary>
  <div class="${summaryCls}">
    <h3 class="font-display text-sm font-bold uppercase tracking-[0.15em] text-ink">${esc(c.home.faith.title)}</h3>
    <p class="mt-4 font-body leading-relaxed text-ink-soft">${esc(c.home.faith.intro)}</p>
    <div class="mt-8">${beliefList(c, listOpts)}</div>
  </div>
</details>`;

export const renderFaith = (site, c, key) => {
  if (key === 'creed') {
    return `
<section>
  <div class="relative overflow-hidden py-24">
    <img src="${PHOTO}" alt="${ALT}" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover">
    <div aria-hidden="true" class="absolute inset-0 bg-ink/65"></div>
    <div class="relative mx-auto max-w-content px-6">${mission(c, 'text-white')}</div>
  </div>
  <div class="bg-ink py-20">
    <div class="mx-auto max-w-3xl px-6">
      <h3 class="text-center font-display text-sm font-bold uppercase tracking-[0.2em]" style="color:${CYAN}">${esc(c.home.faith.title)}</h3>
      <p class="mt-6 font-body leading-relaxed text-white/70">${esc(c.home.faith.intro)}</p>
      <div class="mt-10">${beliefList(c, { numeral: CYAN, tone: 'text-white/85' })}</div>
    </div>
  </div>
</section>`;
  }

  if (key === 'parallax') {
    return `
<section class="relative">
  <!-- background-attachment:fixed rather than a transform: no scroll handler,
       and it degrades to a normal background where unsupported. -->
  <div class="relative py-28"
       style="background-image:linear-gradient(rgba(28,28,28,.72),rgba(28,28,28,.82)),url('${PHOTO}');background-size:cover;background-position:center;background-attachment:fixed">
    <div class="mx-auto max-w-content px-6">
      ${mission(c, 'text-white')}
      <div class="mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,.8)]">
        ${disclosure(c, 'border-t border-ink/10 px-8 py-8', 'bg-white', {})}
      </div>
    </div>
  </div>
</section>`;
  }

  if (key === 'duotoneSplit') {
    return `
<section class="bg-ink">
  <div class="grid lg:grid-cols-[5fr_7fr]">
    <div class="relative min-h-[420px] lg:min-h-full">
      <img src="${PHOTO}" alt="${ALT}" loading="lazy" decoding="async"
           class="absolute inset-0 h-full w-full object-cover" style="filter:grayscale(1) contrast(1.1)">
      <div aria-hidden="true" class="absolute inset-0" style="background:${MAGENTA};mix-blend-mode:multiply"></div>
      <div aria-hidden="true" class="absolute inset-0" style="background:${CYAN};mix-blend-mode:screen;opacity:.35"></div>
    </div>
    <div class="px-6 py-20 lg:px-14">
      ${mission(c, 'text-white/85 !mx-0 !text-left')}
      <div class="mt-10 border-t border-white/15 pt-10">
        <h3 class="font-display text-sm font-bold uppercase tracking-[0.2em]" style="color:${CYAN}">${esc(c.home.faith.title)}</h3>
        <p class="mt-5 font-body leading-relaxed text-white/65">${esc(c.home.faith.intro)}</p>
        <div class="mt-8">${beliefList(c, { numeral: CYAN, tone: 'text-white/85' })}</div>
      </div>
    </div>
  </div>
</section>`;
  }

  if (key === 'cardsOverPhoto') {
    return `
<section class="relative overflow-hidden py-24">
  <img src="${PHOTO}" alt="${ALT}" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover">
  <div aria-hidden="true" class="absolute inset-0 bg-ink/72"></div>
  <div class="relative mx-auto max-w-content px-6">
    ${mission(c, 'text-white')}
    <h3 class="mt-14 text-center font-display text-sm font-bold uppercase tracking-[0.2em]" style="color:${CYAN}">${esc(c.home.faith.title)}</h3>
    <p class="mx-auto mt-5 max-w-2xl text-center font-body leading-relaxed text-white/70">${esc(c.home.faith.intro)}</p>
    <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      ${c.home.faith.beliefs.map((b, i) => `
      <div class="rounded-2xl p-6 ring-1 ring-white/20"
           style="background:rgba(255,255,255,.10);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)">
        <span aria-hidden="true" class="block font-display text-xs font-bold tabular-nums" style="color:${CYAN}">${String(i + 1).padStart(2, '0')}</span>
        <p class="mt-3 font-body text-sm leading-relaxed text-white/90">${esc(b)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;
  }

  // quietDisclosure
  return `
<section class="relative overflow-hidden py-24">
  <img src="${PHOTO}" alt="${ALT}" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover">
  <div aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(180deg,rgba(28,28,28,.78),rgba(28,28,28,.62))"></div>
  <div class="relative mx-auto max-w-3xl px-6">
    ${mission(c, 'text-white')}
    <div class="mt-12 overflow-hidden rounded-2xl ring-1 ring-white/25"
         style="background:rgba(255,255,255,.94)">
      ${disclosure(c, 'border-t border-ink/10 px-8 py-8', '', {})}
    </div>
  </div>
</section>`;
};

// Treatments for the "Common struggles" section.
//
// The content is six sentences that are uncomfortable to read about yourself.
// That shapes the design more than any style preference: a checklist with tick
// marks — which is what the live site uses — reads as *achievements*, which is
// exactly wrong. These are not things to tick off. Every option below avoids
// that, and several deliberately slow the reading down.
//
// "Women-themed" here means warmth, softness and generous space rather than
// pink and flourishes; the audience is adult women being spoken to seriously
// about their marriages.
import { esc } from './layout.mjs';

export const STRUGGLES = {
  quotes: {
    label: 'Quiet quotes — each line set as its own confession',
    note: 'Large, generously spaced serif lines with a thin magenta mark to the left of each. Reads like something admitted rather than a list of symptoms. The most emotionally honest option.',
  },
  cards: {
    label: 'Soft cards — warm tinted panels in a loose grid',
    note: 'Rounded panels on alternating blush and cyan tints with plenty of internal space. Approachable and easy to scan; the least confronting.',
  },
  editorial: {
    label: 'Editorial spread — numbered, hairline-separated',
    note: 'Each struggle numbered in the corner with a hairline between. Magazine layout — treats the reader as an adult rather than decorating the problem.',
  },
  mirror: {
    label: 'Mirror — the struggle, and what it becomes',
    note: 'Two columns: the struggle on the left in muted type, what it could become on the right in brand colour. Turns a list of problems into a promise. Needs the right-hand copy written.',
  },
  overlay: {
    label: 'Over imagery — set on a soft photographic ground',
    note: 'The lines sit over a lightened photograph from the event with a warm wash. Puts real women behind words about women, which no amount of iconography achieves.',
  },
  weight: {
    label: 'The weight — lines stacked heavily, then released',
    note: 'The struggles pile up tight and dense, then break into open space with the transition line. The layout performs the feeling the copy describes. Boldest, and the most memorable.',
  },
};

const heading = (c, tone = 'ink') => `
<h2 class="mx-auto max-w-2xl text-center font-display text-3xl font-bold leading-tight ${tone === 'ink' ? 'text-ink' : 'text-white'} sm:text-4xl">
  ${esc(c.home.painPoints.heading)}
</h2>`;

export const renderStruggles = (site, c, key) => {
  const items = c.home.painPoints.items;

  if (key === 'quotes') {
    return `
<div class="mx-auto max-w-3xl px-6">
  ${heading(c)}
  <div class="mt-14 space-y-10">
    ${items.map(t => `
    <p class="relative pl-7 font-display text-xl font-medium leading-relaxed text-ink sm:text-2xl">
      <span aria-hidden="true" class="absolute left-0 top-2 h-[calc(100%-1rem)] w-0.5 rounded bg-magenta/45"></span>
      ${esc(t)}
    </p>`).join('')}
  </div>
</div>`;
  }

  if (key === 'cards') {
    const tints = ['bg-magenta-tint', 'bg-cyan-tint'];
    return `
<div class="mx-auto max-w-content px-6">
  ${heading(c)}
  <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    ${items.map((t, i) => `
    <div class="rounded-3xl ${tints[i % 2]} p-7">
      <p class="font-body text-base leading-relaxed text-ink">${esc(t)}</p>
    </div>`).join('')}
  </div>
</div>`;
  }

  if (key === 'editorial') {
    return `
<div class="mx-auto max-w-3xl px-6">
  ${heading(c)}
  <ul class="mt-12 divide-y divide-ink-line border-y border-ink-line">
    ${items.map((t, i) => `
    <li class="flex gap-6 py-6">
      <span aria-hidden="true" class="shrink-0 font-display text-sm font-bold tabular-nums text-magenta">${String(i + 1).padStart(2, '0')}</span>
      <p class="font-body text-lg leading-relaxed text-ink">${esc(t)}</p>
    </li>`).join('')}
  </ul>
</div>`;
  }

  if (key === 'mirror') {
    // Right-hand copy is placeholder and needs writing — flagged on the page.
    const becomes = [
      'Safe enough to be known.',
      'Carried, not carrying it alone.',
      'Close again, on purpose.',
      'Playful without permission.',
      'Held, and able to let go.',
      'Wanted, and wanting.',
    ];
    return `
<div class="mx-auto max-w-4xl px-6">
  ${heading(c)}
  <ul class="mt-12 divide-y divide-ink-line border-y border-ink-line">
    ${items.map((t, i) => `
    <li class="grid gap-2 py-6 sm:grid-cols-2 sm:gap-10">
      <p class="font-body text-base leading-relaxed text-ink-soft">${esc(t)}</p>
      <p class="font-display text-lg font-semibold leading-relaxed text-magenta-text">${esc(becomes[i] || '')}</p>
    </li>`).join('')}
  </ul>
  <p class="mt-6 text-center font-body text-xs uppercase tracking-[0.2em] text-ink-soft">Right column is placeholder copy — needs writing</p>
</div>`;
  }

  if (key === 'overlay') {
    return `
<div class="relative overflow-hidden rounded-[2rem]">
  <img src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover">
  <div class="absolute inset-0" style="background:linear-gradient(180deg,rgba(253,234,245,.94),rgba(255,255,255,.97))"></div>
  <div class="relative mx-auto max-w-3xl px-8 py-16">
    ${heading(c)}
    <div class="mt-10 space-y-5">
      ${items.map(t => `
      <p class="rounded-2xl bg-white/70 px-6 py-4 font-body text-base leading-relaxed text-ink shadow-sm backdrop-blur-sm">${esc(t)}</p>`).join('')}
    </div>
  </div>
</div>`;
  }

  // weight
  return `
<div class="mx-auto max-w-3xl px-6 text-center">
  ${heading(c)}
  <!-- Tight leading and falling opacity: the lines stack up and press down. -->
  <div class="mt-12 space-y-1">
    ${items.map((t, i) => `
    <p class="font-display font-semibold leading-[1.15] text-ink sm:text-xl"
       style="opacity:${(1 - i * 0.1).toFixed(2)}">${esc(t)}</p>`).join('')}
  </div>
  <div class="mt-16">
    <p class="font-display text-2xl font-bold text-magenta-text sm:text-3xl">You were not built to carry this.</p>
    <p class="mt-3 font-body text-ink-soft">Placeholder release line — needs writing.</p>
  </div>
</div>`;
};

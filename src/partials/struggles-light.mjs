// Light treatments for the struggles section.
//
// Premium on a light ground comes from different things than on a dark one:
// warm off-white rather than pure #fff, layered soft shadows, hairlines,
// generous space, asymmetry, and real photography at a decent size. Pure white
// with black text is what reads as cheap, not lightness itself.
//
// Photography here is the genuine event coverage — group shots and candid
// moments — not the coach headshot the previous portrait option wrongly used.
import { esc } from './layout.mjs';

// Warm off-white. #fff next to the dark hero looks like an unstyled default.
const PAPER = '#FBF7F4';

export const LIGHT = {
  warmPaper: {
    label: 'Warm paper — off-white ground, large type, fine rules',
    photo: 'none',
    note: 'No imagery at all. Warm paper tone, generous leading, a hairline between each line and one magenta mark. Quiet luxury; it works because it is not pure white.',
  },
  photoSplit: {
    label: 'Split — candid event photograph beside the lines',
    photo: 'gallery-1-1',
    note: 'Two women mid-conversation at the event, at full height beside the copy. Real, unstyled, and it says more about the audience than any icon set.',
  },
  elevated: {
    label: 'Elevated cards — white on blush, layered shadow',
    photo: 'none',
    note: 'White cards floating on a blush ground with two-stage shadows and a gradient hairline on each. Material and tactile rather than flat panels.',
  },
  editorial: {
    label: 'Editorial — asymmetric, numbered, one anchor image',
    photo: 'gallery-1-2',
    note: 'Magazine layout: lines set in a narrow column against big numerals, with one photograph anchoring the corner. The most designed, and the most restrained.',
  },
  softMesh: {
    label: 'Soft mesh — pale brand blooms under frosted cards',
    photo: 'none',
    note: 'The mesh idea in daylight: blush and cyan blooms at low opacity with light frosted cards over them. Keeps the material language of the nav and VSL without going dark.',
  },
  bandPhoto: {
    label: 'Photo band — full-width image, lines beneath on paper',
    photo: 'queens-waving',
    note: 'The full group shot runs edge to edge above the lines. Puts the whole room of women in front of the reader before the copy asks them anything.',
  },
};

const head = (c, cls = 'text-ink') => `
<h2 class="font-display text-3xl font-bold leading-tight ${cls} sm:text-[2.75rem]">${esc(c.home.painPoints.heading)}</h2>`;

const grain = `
<div aria-hidden="true" class="pointer-events-none absolute inset-0 opacity-[.35]"
     style="background-image:url(&quot;data:image/svg+xml;utf8,&lt;svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'&gt;&lt;filter id='g'&gt;&lt;feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/&gt;&lt;/filter&gt;&lt;rect width='160' height='160' filter='url(%23g)' opacity='.35'/&gt;&lt;/svg&gt;&quot;)"></div>`;

export const renderLight = (site, c, key) => {
  const items = c.home.painPoints.items;

  if (key === 'warmPaper') {
    return `
<div class="relative overflow-hidden py-24" style="background:${PAPER}">
  ${grain}
  <div class="relative mx-auto max-w-3xl px-6">
    <span aria-hidden="true" class="block h-1 w-12 rounded-full bg-magenta"></span>
    <div class="mt-6">${head(c)}</div>
    <ul class="mt-14 divide-y" style="border-color:rgba(28,28,28,.10)">
      ${items.map(t => `
      <li class="py-7"><p class="font-display text-xl font-medium leading-relaxed text-ink sm:text-2xl">${esc(t)}</p></li>`).join('')}
    </ul>
  </div>
</div>`;
  }

  if (key === 'photoSplit') {
    return `
<div style="background:${PAPER}">
  <div class="grid lg:grid-cols-[5fr_6fr]">
    <div class="relative min-h-[380px] lg:min-h-full">
      <img src="/assets/photos/gallery-1-1.jpg" alt="Two women in conversation at a Rise Up Queens event"
           class="absolute inset-0 h-full w-full object-cover">
    </div>
    <div class="px-6 py-20 lg:px-16">
      ${head(c)}
      <ul class="mt-10 space-y-7">
        ${items.map(t => `
        <li class="flex gap-4">
          <span aria-hidden="true" class="mt-3 h-px w-6 shrink-0 bg-magenta"></span>
          <p class="font-body text-lg leading-relaxed text-ink">${esc(t)}</p>
        </li>`).join('')}
      </ul>
    </div>
  </div>
</div>`;
  }

  if (key === 'elevated') {
    return `
<div class="py-24" style="background:linear-gradient(180deg,#FDEFF7,${PAPER} 70%)">
  <div class="mx-auto max-w-content px-6">
    <div class="text-center">${head(c)}</div>
    <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      ${items.map(t => `
      <div class="rounded-3xl bg-white p-8 shadow-[0_2px_4px_rgba(28,28,28,.04),0_24px_48px_-24px_rgba(28,28,28,.28)]">
        <span aria-hidden="true" class="block h-0.5 w-9 rounded-full bg-gradient-to-r from-magenta to-cyan"></span>
        <p class="mt-6 font-body text-base leading-relaxed text-ink">${esc(t)}</p>
      </div>`).join('')}
    </div>
  </div>
</div>`;
  }

  if (key === 'editorial') {
    return `
<div class="py-24" style="background:${PAPER}">
  <div class="mx-auto max-w-content px-6">
    <div class="grid gap-14 lg:grid-cols-[7fr_5fr]">
      <div>
        ${head(c)}
        <ul class="mt-12 space-y-9">
          ${items.map((t, i) => `
          <li class="flex gap-6">
            <span aria-hidden="true" class="shrink-0 font-display text-2xl font-bold leading-none tabular-nums" style="color:rgba(232,32,143,.35)">${String(i + 1).padStart(2, '0')}</span>
            <p class="font-body text-lg leading-relaxed text-ink">${esc(t)}</p>
          </li>`).join('')}
        </ul>
      </div>
      <div class="relative hidden lg:block">
        <img src="/assets/photos/gallery-1-2.jpg" alt="Women together at a Rise Up Queens event"
             class="sticky top-24 aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]">
      </div>
    </div>
  </div>
</div>`;
  }

  if (key === 'softMesh') {
    return `
<div class="relative overflow-hidden py-24" style="background:${PAPER}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0">
    <div class="absolute -left-32 top-0 h-[32rem] w-[32rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(232,32,143,.22),transparent 65%)"></div>
    <div class="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(0,185,198,.20),transparent 65%)"></div>
  </div>
  <div class="relative mx-auto max-w-content px-6">
    <div class="text-center">${head(c)}</div>
    <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      ${items.map(t => `
      <div class="rounded-3xl p-7 ring-1 ring-white/70"
           style="background:rgba(255,255,255,.62);backdrop-filter:blur(18px) saturate(1.3);-webkit-backdrop-filter:blur(18px) saturate(1.3)">
        <p class="font-body text-base leading-relaxed text-ink">${esc(t)}</p>
      </div>`).join('')}
    </div>
  </div>
</div>`;
  }

  // bandPhoto
  return `
<div style="background:${PAPER}">
  <div class="relative h-[300px] w-full overflow-hidden sm:h-[380px]">
    <img src="/assets/photos/queens-waving.jpg"
         alt="The room at a Rise Up Queens event" class="h-full w-full object-cover">
    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-32" style="background:linear-gradient(to bottom,transparent,${PAPER})"></div>
  </div>
  <div class="mx-auto max-w-3xl px-6 pb-24">
    <div class="text-center">${head(c)}</div>
    <ul class="mt-12 space-y-6">
      ${items.map(t => `
      <li class="rounded-2xl bg-white px-7 py-5 shadow-[0_1px_2px_rgba(28,28,28,.04),0_18px_36px_-24px_rgba(28,28,28,.3)]">
        <p class="font-body text-base leading-relaxed text-ink">${esc(t)}</p>
      </li>`).join('')}
    </ul>
  </div>
</div>`;
};

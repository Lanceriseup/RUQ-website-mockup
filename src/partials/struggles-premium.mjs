// Second pass at the struggles section.
//
// The first set were all typographic treatments on flat white, which is why
// none of them felt premium — the hero is dark, lit and cinematic, and then
// the page fell off a cliff into black-on-white text. Premium here is not a
// nicer font: it is depth, material, real photography and pacing.
//
// So these do the things the first set did not: carry the dark through,
// use the client's own event photography, add controlled motion, and give
// the type room to be large.
import { esc } from './layout.mjs';

export const PREMIUM = {
  darkLuxe: {
    label: 'Dark continuation — the hero mood carries on',
    note: 'Keeps the section dark with a soft magenta-to-cyan mesh glowing behind large light type. The single biggest change available: the page stops falling off a cliff into white after the hero.',
    dark: true,
  },
  meshGlass: {
    label: 'Frosted cards on a colour mesh',
    note: 'Blurred brand-coloured blooms behind frosted glass panels. The same material as the nav capsule and the VSL frame, so the page finally reads as one designed system rather than sections.',
    dark: true,
  },
  portrait: {
    label: 'Portrait — real photography carrying the column',
    note: 'A full-height duotone photograph of the event beside the lines. Puts actual women next to words about women, which no amount of type styling achieves.',
    dark: true,
  },
  reveal: {
    label: 'Cinematic reveal — lines arrive as you scroll',
    note: 'Each line masks up into place as it enters the viewport, one at a time. The pacing does the work: you read them one by one instead of scanning a list. Most memorable.',
    dark: true,
  },
  ghost: {
    label: 'Ghost numerals — oversized figures behind each line',
    note: 'Enormous outlined numbers sit behind the text. Editorial, confident, and it gives a plain list real scale without any imagery.',
    dark: false,
  },
  stack: {
    label: 'Deep stack — offset cards with real elevation',
    note: 'Cards stepped and rotated slightly with genuine shadow depth, on a warm tinted ground. Tactile rather than flat; the only light option here that still feels material.',
    dark: false,
  },
};

const mesh = (opacity = '.5') => `
<div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden" style="opacity:${opacity}">
  <div class="absolute -left-40 top-0 h-[38rem] w-[38rem] rounded-full blur-3xl"
       style="background:radial-gradient(circle,rgba(232,32,143,.55),transparent 65%)"></div>
  <div class="absolute -right-32 bottom-0 h-[34rem] w-[34rem] rounded-full blur-3xl"
       style="background:radial-gradient(circle,rgba(0,185,198,.5),transparent 65%)"></div>
  <div class="absolute left-1/3 top-1/3 h-[26rem] w-[26rem] rounded-full blur-3xl"
       style="background:radial-gradient(circle,rgba(232,32,143,.25),transparent 70%)"></div>
</div>`;

const head = (c, tone) => `
<h2 class="mx-auto max-w-2xl text-center font-display text-3xl font-bold leading-tight sm:text-5xl ${tone}">
  ${esc(c.home.painPoints.heading)}
</h2>`;

export const renderPremium = (site, c, key) => {
  const items = c.home.painPoints.items;

  if (key === 'darkLuxe') {
    return `
<div class="relative overflow-hidden bg-ink py-24">
  ${mesh('.55')}
  <div class="relative mx-auto max-w-3xl px-6">
    ${head(c, 'text-white')}
    <div class="mt-16 space-y-8">
      ${items.map(t => `
      <p class="border-l-2 border-cyan/50 pl-6 font-display text-xl font-medium leading-relaxed text-white/90 sm:text-2xl">${esc(t)}</p>`).join('')}
    </div>
  </div>
</div>`;
  }

  if (key === 'meshGlass') {
    return `
<div class="relative overflow-hidden bg-ink py-24">
  ${mesh('.7')}
  <div class="relative mx-auto max-w-content px-6">
    ${head(c, 'text-white')}
    <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      ${items.map(t => `
      <div class="rounded-3xl p-7 ring-1 ring-white/20"
           style="background:rgba(255,255,255,.09);backdrop-filter:blur(22px) saturate(1.4);-webkit-backdrop-filter:blur(22px) saturate(1.4)">
        <p class="font-body text-base leading-relaxed text-white/90">${esc(t)}</p>
      </div>`).join('')}
    </div>
  </div>
</div>`;
  }

  if (key === 'portrait') {
    return `
<div class="relative overflow-hidden bg-ink">
  <div class="grid lg:grid-cols-2">
    <div class="relative min-h-[420px] lg:min-h-full">
      <img src="/assets/photos/event-8.png" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover"
           style="filter:grayscale(1) contrast(1.1)">
      <!-- Duotone over the photograph so it belongs to the palette rather than
           sitting next to it. -->
      <div class="absolute inset-0" style="background:#e8208f;mix-blend-mode:multiply"></div>
      <div class="absolute inset-0" style="background:#00b9c6;mix-blend-mode:screen;opacity:.35"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-transparent to-ink lg:to-ink"></div>
    </div>
    <div class="px-6 py-20 lg:px-14">
      <h2 class="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">${esc(c.home.painPoints.heading)}</h2>
      <ul class="mt-10 space-y-6">
        ${items.map(t => `
        <li class="flex gap-4">
          <span aria-hidden="true" class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"></span>
          <p class="font-body text-lg leading-relaxed text-white/85">${esc(t)}</p>
        </li>`).join('')}
      </ul>
    </div>
  </div>
</div>`;
  }

  if (key === 'reveal') {
    return `
<div class="relative overflow-hidden bg-ink py-24">
  ${mesh('.4')}
  <div class="relative mx-auto max-w-3xl px-6">
    ${head(c, 'text-white')}
    <div class="mt-16 space-y-12">
      ${items.map((t, i) => `
      <p class="reveal-line font-display text-2xl font-semibold leading-snug text-white sm:text-3xl"
         style="transition-delay:${i * 60}ms">${esc(t)}</p>`).join('')}
    </div>
  </div>
</div>`;
  }

  if (key === 'ghost') {
    return `
<div class="bg-white py-24">
  <div class="mx-auto max-w-3xl px-6">
    ${head(c, 'text-ink')}
    <div class="mt-16 space-y-10">
      ${items.map((t, i) => `
      <div class="relative pl-20 sm:pl-28">
        <span aria-hidden="true"
              class="absolute -top-4 left-0 select-none font-display font-extrabold leading-none text-transparent"
              style="font-size:5.5rem;-webkit-text-stroke:2px rgba(232,32,143,.22)">${i + 1}</span>
        <p class="relative font-display text-xl font-semibold leading-relaxed text-ink sm:text-2xl">${esc(t)}</p>
      </div>`).join('')}
    </div>
  </div>
</div>`;
  }

  // stack
  const rot = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1'];
  return `
<div class="py-24" style="background:linear-gradient(180deg,#fdeaf5,#ffffff 60%)">
  <div class="mx-auto max-w-content px-6">
    ${head(c, 'text-ink')}
    <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      ${items.map((t, i) => `
      <div class="${rot[i]} rounded-3xl bg-white p-7 shadow-[0_24px_50px_-24px_rgba(28,28,28,.35)] ring-1 ring-ink/5 transition-transform duration-300 hover:rotate-0 hover:shadow-[0_30px_60px_-24px_rgba(232,32,143,.35)]">
        <span aria-hidden="true" class="block h-1 w-10 rounded-full bg-gradient-to-r from-magenta to-cyan"></span>
        <p class="mt-5 font-body text-base leading-relaxed text-ink">${esc(t)}</p>
      </div>`).join('')}
    </div>
  </div>
</div>`;
};

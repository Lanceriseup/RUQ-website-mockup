// Refinements to the magazine spread: photo containers and the renewal list.
//
// Two things were generic. The plates were rounded rectangles with a white
// ring — the default treatment for any image anywhere. And the three renewal
// items were rendered as a flat list when they are actually a PROGRESSION:
// rediscover identity, then reignite intimacy, then live in freedom. Nothing
// in the layout said that.
//
// Each option below changes both together, because a container style and a
// list style have to belong to the same idea.
import { esc } from './layout.mjs';

export const REFINES = {
  arch: {
    label: 'Arch plates — cathedral tops, journey list',
    note: 'Photographs arched at the top and squared at the base, and the three answers strung on a vertical line as a journey. The arch is the one shape that means something for a faith brand, and the line finally says these three are a sequence.',
  },
  matted: {
    label: 'Matted prints — gallery framing, titled blocks',
    note: 'Each photograph is inset inside a white mount with a hairline, the way a print is framed. The answers become titled blocks separated by rules — quiet, expensive, and it lets the titles breathe.',
  },
  plate: {
    label: 'Offset plates — colour block behind, ghost numerals',
    note: 'A flat brand-colour plate sits offset behind each photograph, and the answers carry oversized outlined numerals. The most graphic and the most editorial of the five.',
  },
  gradient: {
    label: 'Gradient edge — brand-lit frames, ruled cards',
    note: 'A magenta-to-cyan gradient border wraps each image, and the answers become cards each topped by a slice of the same gradient. The most obviously branded.',
  },
  stepped: {
    label: 'Stepped plates — staggered depth, indented steps',
    note: 'Two overlapping images per section at different depths, with the three answers indented progressively so the list physically steps forward. Movement without motion.',
  },
};

/* ── Photo container treatments ─────────────────────────────────────────── */
const plate = (key, src, alt, aspect, extra = '') => {
  const img = (cls) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" class="${cls}">`;

  if (key === 'arch') {
    return `<div class="relative ${extra}">
      ${img(`${aspect} w-full rounded-t-full rounded-b-3xl object-cover shadow-[0_36px_70px_-30px_rgba(28,28,28,.5)]`)}
    </div>`;
  }

  if (key === 'matted') {
    return `<figure class="relative rounded-[1.75rem] bg-white p-3 shadow-[0_2px_4px_rgba(28,28,28,.05),0_36px_70px_-32px_rgba(28,28,28,.5)] ${extra}">
      <div class="rounded-[1.25rem] p-px" style="background:rgba(28,28,28,.10)">
        ${img(`${aspect} w-full rounded-[1.2rem] object-cover`)}
      </div>
    </figure>`;
  }

  if (key === 'plate') {
    return `<div class="relative ${extra}">
      <div aria-hidden="true" class="absolute -bottom-4 -right-4 h-full w-full rounded-[1.75rem]"
           style="background:linear-gradient(135deg,#e8208f,#00b9c6);opacity:.16"></div>
      ${img(`relative ${aspect} w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]`)}
    </div>`;
  }

  if (key === 'gradient') {
    return `<div class="relative rounded-[1.9rem] p-[3px] shadow-[0_36px_70px_-30px_rgba(28,28,28,.5)] ${extra}"
                 style="background:linear-gradient(140deg,#e8208f,#f0569f 45%,#00b9c6)">
      ${img(`${aspect} w-full rounded-[1.65rem] object-cover`)}
    </div>`;
  }

  // stepped — a second, smaller plate behind and offset
  return `<div class="relative ${extra}">
    <img src="${esc(src)}" alt="" aria-hidden="true" loading="lazy" decoding="async"
         class="absolute -left-6 -top-6 hidden h-full w-full rounded-[1.75rem] object-cover opacity-30 lg:block">
    ${img(`relative ${aspect} w-full rounded-[1.75rem] object-cover shadow-[0_36px_70px_-30px_rgba(28,28,28,.5)] ring-4 ring-white`)}
  </div>`;
};

/* ── Renewal list treatments ────────────────────────────────────────────── */
const answers = (key, c) => {
  const items = c.home.renewal.items;

  if (key === 'arch') {
    // Journey: a line down the left with a node per step.
    return `
    <ol class="relative mt-10 space-y-10 pl-10">
      <span aria-hidden="true" class="absolute bottom-3 left-[7px] top-3 w-px"
            style="background:linear-gradient(to bottom,rgba(232,32,143,.5),rgba(0,185,198,.55))"></span>
      ${items.map((it, i) => `
      <li class="relative">
        <span aria-hidden="true" class="absolute -left-10 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-white ring-2"
              style="--tw-ring-color:${i === items.length - 1 ? '#00b9c6' : '#e8208f'}">
          <span class="h-1.5 w-1.5 rounded-full" style="background:${i === items.length - 1 ? '#00b9c6' : '#e8208f'}"></span>
        </span>
        <h3 class="font-display text-xl font-bold text-ink">${esc(it.title)}</h3>
        <p class="mt-2 font-body leading-relaxed text-ink-soft">${esc(it.body)}</p>
      </li>`).join('')}
    </ol>`;
  }

  if (key === 'matted') {
    return `
    <div class="mt-10 divide-y divide-ink/10 border-y border-ink/10">
      ${items.map(it => `
      <div class="py-7">
        <h3 class="font-display text-xl font-bold text-ink">${esc(it.title)}</h3>
        <p class="mt-2 max-w-xl font-body leading-relaxed text-ink-soft">${esc(it.body)}</p>
      </div>`).join('')}
    </div>`;
  }

  if (key === 'plate') {
    return `
    <div class="mt-10 space-y-9">
      ${items.map((it, i) => `
      <div class="relative pl-20">
        <span aria-hidden="true" class="absolute -top-3 left-0 select-none font-display font-extrabold leading-none text-transparent"
              style="font-size:4.25rem;-webkit-text-stroke:2px rgba(0,185,198,.35)">${i + 1}</span>
        <h3 class="font-display text-xl font-bold text-ink">${esc(it.title)}</h3>
        <p class="mt-2 font-body leading-relaxed text-ink-soft">${esc(it.body)}</p>
      </div>`).join('')}
    </div>`;
  }

  if (key === 'gradient') {
    return `
    <div class="mt-10 space-y-5">
      ${items.map(it => `
      <div class="overflow-hidden rounded-2xl bg-white shadow-[0_2px_4px_rgba(28,28,28,.04),0_20px_44px_-26px_rgba(28,28,28,.35)]">
        <span aria-hidden="true" class="block h-1 w-full" style="background:linear-gradient(90deg,#e8208f,#00b9c6)"></span>
        <div class="p-6">
          <h3 class="font-display text-lg font-bold text-ink">${esc(it.title)}</h3>
          <p class="mt-2 font-body leading-relaxed text-ink-soft">${esc(it.body)}</p>
        </div>
      </div>`).join('')}
    </div>`;
  }

  // stepped — each item indents further than the last
  return `
  <div class="mt-10 space-y-8">
    ${items.map((it, i) => `
    <div style="padding-left:${i * 2.25}rem">
      <span aria-hidden="true" class="block h-0.5 rounded-full" style="width:${2.5 + i * 1.5}rem;background:linear-gradient(90deg,#e8208f,#00b9c6)"></span>
      <h3 class="mt-4 font-display text-xl font-bold text-ink">${esc(it.title)}</h3>
      <p class="mt-2 max-w-lg font-body leading-relaxed text-ink-soft">${esc(it.body)}</p>
    </div>`).join('')}
  </div>`;
};

/* ── The spread, with both treatments applied ───────────────────────────── */
const SWASH = (colour) => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

const dualHeading = (scriptText, sansText, colour, sansTone, scriptFirst, size) => {
  const script = `<span class="relative inline-block">
      <span class="script block" style="color:${colour};font-size:${size};line-height:.9">${esc(scriptText)}</span>
      ${SWASH(colour)}</span>`;
  const sans = `<span class="block font-display text-2xl font-bold uppercase tracking-[0.06em] ${sansTone} sm:text-[2.1rem]">${esc(sansText)}</span>`;
  return `<h2 class="leading-none">${scriptFirst ? script + `<span class="mt-3 block">${sans}</span>` : sans + `<span class="mt-1 block">${script}</span>`}</h2>`;
};

export const renderRefine = (site, c, key) => `
<div class="relative" style="background:linear-gradient(180deg,#ffffff,#FDF6F1 55%,#ffffff)">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(232,32,143,.12),transparent 68%)"></div>
    <div class="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(0,185,198,.10),transparent 68%)"></div>
  </div>

  <section class="relative mx-auto max-w-content px-6 pb-10 pt-24">
    <div class="border-b border-ink/10 pb-4">
      ${dualHeading('Common struggles', 'women in marriage have', '#e8208f', 'text-ink', true, '4.5rem')}
    </div>
    <div class="mt-12 grid gap-14 lg:grid-cols-[7fr_5fr]">
      <div>
        <ul class="space-y-8">
          ${c.home.painPoints.items.map((t, i) => `
          <li class="flex gap-6">
            <span aria-hidden="true" class="shrink-0 font-display text-xl font-bold leading-none tabular-nums" style="color:rgba(232,32,143,.4)">${String(i + 1).padStart(2, '0')}</span>
            <p class="font-body text-lg leading-relaxed text-ink">${esc(t)}</p>
          </li>`).join('')}
        </ul>
      </div>
      <div class="relative hidden lg:block">
        ${plate(key, '/assets/photos/gallery-1-2.png', 'Women together at a Rise Up Queens event', 'aspect-[4/5]', 'z-10')}
      </div>
    </div>
  </section>

  <section class="relative mx-auto max-w-content px-6 pb-24">
    <div class="grid items-start gap-14 lg:grid-cols-[6fr_6fr]">
      <div class="-mt-20 lg:-mt-32">
        ${plate(key, c.home.renewal.photo, c.home.renewal.photoAlt, 'aspect-[4/3]')}
      </div>
      <div class="pt-6">
        ${dualHeading('healing and renewal', 'Join us to experience', '#00b9c6', 'text-ink-soft', false, '3.75rem')}
        ${answers(key, c)}
      </div>
    </div>
  </section>
</div>`;

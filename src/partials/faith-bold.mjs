// Statement of Faith — second attempt.
//
// The first set failed because three of five were the live layout rebuilt:
// photo ground, centred mission, disclosure underneath. Changing the tint of a
// background is not a redesign.
//
// These start from a different question: what does a *creed* look like? It is
// one of the oldest pieces of designed text there is — carved, illuminated,
// set in glass, inscribed on walls. None of that looks like a web accordion,
// and all of it suits a Christian women's movement better than a scroll box.
//
// Each option below takes a different historical form and builds it properly.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';
const PHOTO = '/assets/photos/gallery-2-1.png';
const ALT = 'Women at a Rise Up Queens event';

export const FAITH_BOLD = {
  stainedGlass: {
    label: 'Stained glass — the photograph seen through lit panels',
    note: 'Seven arched panels in brand colour, the photograph showing through each, with a belief in every one. A church window is the one design language this content actually comes from, and nothing else on the web looks like it.',
  },
  manuscript: {
    label: 'Manuscript — set as a printed creed, not a web page',
    note: 'Serif type on a parchment plate over a dark photograph: drop cap, two columns, hanging numerals, hairline rules. Treats the statement as a document with authority rather than an FAQ entry.',
  },
  inscription: {
    label: 'Inscription — light type carved into a monolith',
    note: 'One tall dark slab overlapping a full-bleed photograph, the beliefs inscribed in wide-tracked capitals. Architectural and severe; the most confident way to present doctrine.',
  },
  procession: {
    label: 'Procession — photo held, beliefs moving past it',
    note: 'The photograph pins to one side while the seven beliefs travel past with an oversized numeral marking each. The only option where the reader takes them one at a time rather than meeting a wall.',
  },
  colonnade: {
    label: 'Colonnade — a row of arches you scroll along',
    note: 'The beliefs sit in a horizontal run of arched cards you scroll sideways through, photograph behind. Unexpected on a page of vertical sections, and it makes seven items feel like few.',
  },
};

const mission = (c, cls) => `<p class="mx-auto max-w-3xl text-center font-body text-lg leading-relaxed ${cls}">${esc(c.home.faith.mission)}</p>`;

export const renderFaithBold = (site, c, key) => {
  const B = c.home.faith.beliefs;

  /* ── STAINED GLASS ─────────────────────────────────────────────────── */
  if (key === 'stainedGlass') {
    const tints = [
      'rgba(232,32,143,.62)', 'rgba(0,185,198,.55)', 'rgba(232,32,143,.45)',
      'rgba(255,255,255,.20)', 'rgba(0,185,198,.62)', 'rgba(232,32,143,.55)',
      'rgba(0,185,198,.45)',
    ];
    return `
<section class="relative overflow-hidden bg-ink py-24">
  <div class="relative mx-auto max-w-content px-6">
    ${mission(c, 'text-white')}
    <h3 class="mt-14 text-center font-display text-sm font-bold uppercase tracking-[0.25em]" style="color:${CYAN}">${esc(c.home.faith.title)}</h3>

    <!-- Each panel is its own window: the photograph runs behind all of them
         at a shared position, so they read as one image seen through glass
         rather than seven copies of a picture. -->
    <div class="mt-12 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
      ${B.map((b, i) => `
      <div class="relative overflow-hidden" style="border-radius:9999px 9999px 12px 12px;min-height:22rem">
        <img src="${PHOTO}" alt="" aria-hidden="true" loading="lazy" decoding="async"
             class="absolute inset-0 h-full w-full object-cover" style="object-position:${20 + i * 10}% center">
        <div aria-hidden="true" class="absolute inset-0" style="background:${tints[i]};mix-blend-mode:multiply"></div>
        <div aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(180deg,transparent 30%,rgba(12,12,14,.85))"></div>
        <div class="absolute inset-x-0 bottom-0 p-5">
          <span aria-hidden="true" class="block font-display text-xs font-bold tabular-nums text-white/60">${String(i + 1).padStart(2, '0')}</span>
          <p class="mt-2 font-body text-sm leading-relaxed text-white">${esc(b)}</p>
        </div>
      </div>`).join('')}
      <div class="relative hidden items-center justify-center rounded-xl lg:flex" style="background:linear-gradient(160deg,${MAGENTA},${CYAN})">
        <p class="px-6 text-center font-body text-sm leading-relaxed text-white">${esc(c.home.faith.intro)}</p>
      </div>
    </div>
  </div>
</section>`;
  }

  /* ── MANUSCRIPT ────────────────────────────────────────────────────── */
  if (key === 'manuscript') {
    return `
<section class="relative overflow-hidden py-24">
  <img src="${PHOTO}" alt="${ALT}" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover">
  <div aria-hidden="true" class="absolute inset-0 bg-ink/80"></div>
  <div class="relative mx-auto max-w-4xl px-6">
    ${mission(c, 'text-white/85')}

    <!-- Parchment plate. Serif throughout, because a creed set in a UI sans
         reads as terms and conditions. -->
    <div class="mt-14 p-10 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-14"
         style="background:#F6F1E8;font-family:'Cormorant Garamond',serif">
      <p class="text-center text-[11px] uppercase tracking-[0.4em] text-ink-soft" style="font-family:Lato,sans-serif">${esc(c.home.faith.title)}</p>
      <div aria-hidden="true" class="mx-auto mt-5 h-px w-24" style="background:${MAGENTA}"></div>

      <p class="mt-8 text-[1.35rem] leading-[1.7] text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[4.5rem] first-letter:font-semibold first-letter:leading-[.8]"
         style="--tw-first-letter-color:${MAGENTA}">${esc(c.home.faith.intro)}</p>

      <div aria-hidden="true" class="my-10 h-px w-full" style="background:rgba(28,28,28,.18)"></div>

      <ol class="columns-1 gap-12 sm:columns-2">
        ${B.map((b, i) => `
        <li class="mb-7 break-inside-avoid text-[1.2rem] leading-[1.6] text-ink">
          <span aria-hidden="true" class="mr-2 align-baseline text-sm font-semibold" style="font-family:Lato,sans-serif;color:${MAGENTA}">${String(i + 1).padStart(2, '0')}</span>${esc(b)}
        </li>`).join('')}
      </ol>
    </div>
  </div>
</section>`;
  }

  /* ── INSCRIPTION ───────────────────────────────────────────────────── */
  if (key === 'inscription') {
    return `
<section class="relative">
  <div class="relative h-[420px] overflow-hidden">
    <img src="${PHOTO}" alt="${ALT}" loading="lazy" decoding="async" class="h-full w-full object-cover">
    <div aria-hidden="true" class="absolute inset-0 bg-ink/55"></div>
    <div class="absolute inset-0 flex items-center px-6">
      <div class="mx-auto max-w-content">${mission(c, 'text-white')}</div>
    </div>
  </div>

  <!-- The slab rises out of the photograph and carries the whole creed. -->
  <div class="relative z-10 -mt-28 px-6 pb-24">
    <div class="mx-auto max-w-3xl px-8 py-16 shadow-[0_50px_100px_-40px_rgba(0,0,0,.9)] sm:px-14"
         style="background:#101014">
      <p class="text-center font-body text-[10px] uppercase tracking-[0.45em]" style="color:${CYAN}">${esc(c.home.faith.title)}</p>
      <p class="mt-10 text-center font-body leading-relaxed text-white/55">${esc(c.home.faith.intro)}</p>
      <ol class="mt-14 space-y-10">
        ${B.map((b, i) => `
        <li class="border-t pt-8" style="border-color:rgba(255,255,255,.12)">
          <span aria-hidden="true" class="block font-display text-[10px] font-bold tabular-nums tracking-[0.3em]" style="color:${MAGENTA}">${String(i + 1).padStart(2, '0')}</span>
          <p class="mt-4 font-display text-lg font-semibold uppercase leading-[1.5] tracking-[0.08em] text-white sm:text-xl">${esc(b)}</p>
        </li>`).join('')}
      </ol>
    </div>
  </div>
</section>`;
  }

  /* ── PROCESSION ────────────────────────────────────────────────────── */
  if (key === 'procession') {
    return `
<section class="bg-ink">
  <div class="mx-auto max-w-content px-6 py-20">
    ${mission(c, 'text-white')}
  </div>
  <div class="mx-auto grid max-w-content gap-14 px-6 pb-24 lg:grid-cols-[5fr_7fr]">
    <!-- Sticky holds the photograph while the beliefs travel past it. No
         overflow-hidden on any ancestor here, or sticky silently dies. -->
    <div class="hidden lg:block">
      <div class="sticky top-24">
        <img src="${PHOTO}" alt="${ALT}" loading="lazy" decoding="async"
             class="aspect-[3/4] w-full rounded-[2rem] object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,.85)]">
        <p class="mt-6 font-body text-[10px] uppercase tracking-[0.35em]" style="color:${CYAN}">${esc(c.home.faith.title)}</p>
      </div>
    </div>
    <ol class="space-y-16">
      <li><p class="font-body leading-relaxed text-white/60">${esc(c.home.faith.intro)}</p></li>
      ${B.map((b, i) => `
      <li class="flex gap-8">
        <span aria-hidden="true" class="shrink-0 font-display font-extrabold leading-[.8] text-transparent"
              style="font-size:3.5rem;-webkit-text-stroke:1.5px ${i % 2 ? CYAN : MAGENTA}">${String(i + 1).padStart(2, '0')}</span>
        <p class="pt-2 font-display text-xl font-semibold leading-snug text-white sm:text-2xl">${esc(b)}</p>
      </li>`).join('')}
    </ol>
  </div>
</section>`;
  }

  /* ── COLONNADE ─────────────────────────────────────────────────────── */
  return `
<section class="relative overflow-hidden bg-ink py-24">
  <img src="${PHOTO}" alt="" aria-hidden="true" loading="lazy" decoding="async"
       class="absolute inset-0 h-full w-full object-cover opacity-30">
  <div aria-hidden="true" class="absolute inset-0" style="background:linear-gradient(180deg,rgba(16,16,20,.9),rgba(16,16,20,.7))"></div>

  <div class="relative">
    <div class="mx-auto max-w-content px-6">
      ${mission(c, 'text-white')}
      <p class="mt-12 text-center font-body text-[10px] uppercase tracking-[0.4em]" style="color:${CYAN}">${esc(c.home.faith.title)}</p>
      <p class="mx-auto mt-5 max-w-2xl text-center font-body leading-relaxed text-white/60">${esc(c.home.faith.intro)}</p>
    </div>

    <!-- Horizontal run of arches. scroll-snap so each arch settles rather
         than drifting, and the track is keyboard-scrollable. -->
    <div class="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6"
         tabindex="0" role="region" aria-label="${esc(c.home.faith.title)}"
         style="scrollbar-width:thin">
      ${B.map((b, i) => `
      <article class="w-[19rem] shrink-0 snap-center overflow-hidden ring-1 ring-white/15"
               style="border-radius:9999px 9999px 16px 16px;background:rgba(255,255,255,.07);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)">
        <div class="flex h-full flex-col px-7 pb-8 pt-14">
          <span aria-hidden="true" class="text-center font-display text-xs font-bold tabular-nums tracking-[0.3em]"
                style="color:${i % 2 ? CYAN : MAGENTA}">${String(i + 1).padStart(2, '0')}</span>
          <p class="mt-6 text-center font-body leading-relaxed text-white/90">${esc(b)}</p>
        </div>
      </article>`).join('')}
    </div>
    <p class="mx-auto mt-2 max-w-content px-6 font-body text-[11px] uppercase tracking-[0.2em] text-white/35">Scroll &rarr;</p>
  </div>
</section>`;
};

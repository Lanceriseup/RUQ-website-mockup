// Compact mobile treatments for the "Join us to experience healing and
// renewal" section.
//
// Everything below assumes the layout as it now ships: heading, then the group
// photograph at 3:2, then the three items. Only the heading and the items are
// in question — the photograph was just settled.
//
// Measured at 390px the section runs about 900px, and the parts are lopsided:
//
//   heading        ~200   sans line at 24px + script at 3.75rem over two lines
//   photo           228   3:2
//   three items    ~390   py-7 (28px top and bottom) around each, plus rules
//   ──────────────────────
//                  ~820  + section padding
//
// Two things stand out once it is measured rather than eyeballed.
//
// The heading is the same construction as "Common struggles" but has NOT had
// the same fix applied: "healing and renewal" is a longer string at 3.75rem,
// so it wraps to two lines on a phone. The struggles heading got a derived,
// unwrappable clamp; this one is still the raw desktop number. Anything that
// leaves it at a fixed size is only ever one copy change from breaking.
//
// The items carry py-7 — 28px above AND below each of three blocks, so 168px
// of the section is padding around 3 short paragraphs, sized for a column
// sitting beside a 655px-tall portrait plate that below lg is not there.
//
// All options are MOBILE ONLY, paired with lg: values restoring the shipped
// spread.
import { esc } from './layout.mjs';

const CYAN = '#00b9c6';

const swash = (colour) => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

// Derived the same way as the struggles heading: this script runs about 5.5px
// of width per 1px of font-size. "healing and renewal" is 19 characters
// against "Common struggles" at 16, so it needs a smaller vw figure to fit the
// same space — 12vw rather than 14.5vw, which still caps at the shipped
// 3.75rem from about 500px up.
const FLUID = 'clamp(1.75rem,12vw,3.75rem)';

export const RENEWAL_MODES = {
  current: {
    label: 'Current — what ships today',
    note: 'The baseline, with the new photo order. Script at a fixed 3.75rem wrapping to two lines, sans at 24px, and three items each carrying 28px of padding above and below.',
    scriptSize: '3.75rem',
    nowrap: false,
    itemPad: 'py-7',
    sans: 'text-2xl',
  },

  tighten: {
    label: 'A — Tighten the items only',
    note: 'The heading is left exactly as it is; only the items close up, from 28px of padding above and below to 16px. The smallest possible change, and it still takes roughly 70px out. Use this if the heading wrapping to two lines does not bother you — it is the one thing here that needs no judgement at all.',
    scriptSize: '3.75rem',
    nowrap: false,
    itemPad: 'py-4 lg:py-7',
    sans: 'text-2xl',
  },

  fluid: {
    label: 'B — Fix the heading the same way as "Common struggles"',
    note: 'A, plus the same treatment the struggles heading already got: the script scales with the viewport and cannot wrap, so "healing and renewal" stops breaking across two lines. The two headings then behave identically instead of one being fixed and one not — which also means the next copy change cannot quietly break this one.',
    scriptSize: FLUID,
    nowrap: true,
    itemPad: 'py-4 lg:py-7',
    sans: 'text-2xl',
  },

  eyebrow: {
    label: 'C — B, with "Join us to experience" as an eyebrow',
    note: 'B, and the sans line above the script becomes the 11px letter-spaced label — exactly what was chosen for the struggles heading, so both halves of the spread read as one system on a phone. The script becomes the heading and the sans becomes the lead-in it grammatically is.',
    scriptSize: FLUID,
    nowrap: true,
    itemPad: 'py-4 lg:py-7',
    sans: 'eyebrow',
  },

  titlesOnly: {
    label: 'D — C, with the item bodies condensed',
    note: 'C, and the three bodies drop to 14px against their 20px titles, widening the gap between the two so the titles carry the scanning and the bodies support them. The shortest option that keeps every word of the client\'s copy. Beyond this the only remaining lever is cutting the bodies, which is a copy decision rather than a layout one.',
    scriptSize: FLUID,
    nowrap: true,
    itemPad: 'py-4 lg:py-7',
    sans: 'eyebrow',
    smallBody: true,
  },
};

export const renderRenewal = (c, modeKey) => {
  const m = RENEWAL_MODES[modeKey];

  const script = `<span class="relative inline-block">
      <span class="script block" style="color:${CYAN};font-size:${m.scriptSize};line-height:.9${m.nowrap ? ';white-space:nowrap' : ''}">healing and renewal</span>
      ${swash(CYAN)}
    </span>`;

  const sans = m.sans === 'eyebrow'
    ? `<span class="block font-display text-[11px] font-bold uppercase tracking-[0.3em] text-ink-soft lg:text-[2.1rem] lg:tracking-[0.06em]">Join us to experience</span>`
    : `<span class="block font-display text-2xl font-bold uppercase tracking-[0.06em] text-ink-soft lg:text-[2.1rem]">Join us to experience</span>`;

  return `
<div class="relative" style="background:linear-gradient(180deg,#FDF6F1,#ffffff)">
  <section id="renewal" class="relative mx-auto max-w-content px-6 pb-14 pt-8 lg:pb-24">
    <div class="grid gap-8 lg:grid-cols-[6fr_6fr] lg:gap-x-14 lg:gap-y-0">
      <div class="order-2 lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <div class="relative">
          <div aria-hidden="true" class="absolute -bottom-4 -right-4 h-full w-full rounded-[1.75rem]"
               style="background:linear-gradient(135deg,#e8208f,${CYAN});opacity:.16"></div>
          <img src="${esc(c.home.renewal.photo)}" alt="${esc(c.home.renewal.photoAlt)}" loading="lazy" decoding="async"
               class="relative aspect-[3/2] lg:aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]"
               style="object-position:center 32%">
        </div>
      </div>

      <!-- mt-1 is the shipped gap and it works at 24px, where the sans line is
           tall enough to stand off the script's ascenders on its own. At 11px
           it is not: the "h" and "l" of "healing" reach up into the eyebrow
           and the two read as one crowded block. mt-3 below lg in that mode
           only; the shipped 4px returns at lg. -->
      <div class="order-1 lg:order-none lg:col-start-2 lg:row-start-1">
        <h2 class="leading-none">${sans}<span class="${m.sans === 'eyebrow' ? 'mt-3 lg:mt-1' : 'mt-1'} block">${script}</span></h2>
      </div>

      <div class="order-3 lg:order-none lg:col-start-2 lg:row-start-2 lg:mt-10">
        <div class="divide-y divide-ink/10 border-y border-ink/10">
          ${c.home.renewal.items.map(it => `
          <div class="${m.itemPad}">
            <h3 class="font-display text-lg lg:text-xl font-bold text-ink">${esc(it.title)}</h3>
            <p class="mt-1 lg:mt-2 max-w-xl font-body ${m.smallBody ? 'text-sm' : 'text-base'} lg:text-base leading-relaxed text-ink-soft">${esc(it.body)}</p>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>
</div>`;
};

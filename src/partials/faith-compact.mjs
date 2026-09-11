// Compacting the Statement of Faith section.
//
// The design stays: parchment plate, Cormorant, drop cap, hanging numerals,
// hairline rules, the cross photograph behind. Only the height changes.
//
// There are four separate levers and each option pulls a different one, so
// they can be combined:
//   1. section and plate padding
//   2. type size and leading
//   3. column count — three columns is much shorter than two
//   4. layout — moving the intro beside the beliefs instead of above them
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const PHOTO = '/assets/photos/faith-bg.jpg';

export const FAITH_COMPACT = {
  tightened: {
    label: 'Tightened — same layout, everything dialled down',
    lever: 'padding + leading',
    note: 'Section padding, plate padding, type size and leading all come down a step. Nothing moves; it just takes less room. The safest option and the least visible change.',
  },
  threeCol: {
    label: 'Three columns — the beliefs run shorter',
    lever: 'column count',
    note: 'Seven beliefs across three columns instead of two. Roughly a third off the list height on its own, and it makes the plate landscape rather than portrait.',
  },
  sideIntro: {
    label: 'Intro beside the beliefs, not above them',
    lever: 'layout',
    note: 'The intro paragraph moves into a narrow left column with the beliefs to its right. Removes an entire stacked block and uses the plate’s width properly.',
  },
  leanIntro: {
    label: 'Lead line only — the intro trimmed to its first sentence',
    lever: 'content',
    note: 'Keeps only "Rise Up Queens is a movement founded on the Christian faith." and drops the rest of the intro. The beliefs are the substance; the intro mostly restates the mission above. Shortest of the five.',
  },
  bandPlate: {
    label: 'Wide band — shallow plate running the full width',
    lever: 'plate proportion',
    note: 'The plate widens to the full container and shortens, with the intro across the top and the beliefs in three columns beneath. Reads as a band rather than a document.',
  },
};

const numeral = (i) => `<span aria-hidden="true" class="mr-2 align-baseline font-body text-sm font-semibold" style="color:${MAGENTA}">${String(i + 1).padStart(2, '0')}</span>`;

const shell = (inner, sectionPad = 'py-24', maxW = 'max-w-4xl') => `
<section class="relative overflow-hidden ${sectionPad}">
  <img src="${PHOTO}" alt="" aria-hidden="true" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover">
  <div aria-hidden="true" class="absolute inset-0 bg-ink/80"></div>
  <div class="relative mx-auto ${maxW} px-6">${inner}</div>
</section>`;

const label = (c) => `
<p class="text-center font-body text-[11px] uppercase tracking-[0.4em] text-ink-soft">${esc(c.home.faith.title)}</p>
<div aria-hidden="true" class="mx-auto mt-5 h-px w-24" style="background:${MAGENTA}"></div>`;

export const renderFaithCompact = (site, c, key) => {
  const B = c.home.faith.beliefs;
  const PLATE = `background:#F6F1E8;font-family:'Cormorant Garamond',serif`;

  if (key === 'tightened') {
    return shell(`
      <div class="p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-10" style="${PLATE}">
        ${label(c)}
        <p class="mt-6 text-[1.2rem] leading-[1.5] text-ink
                  first-letter:float-left first-letter:mr-3 first-letter:mt-1
                  first-letter:text-[3.5rem] first-letter:font-semibold first-letter:leading-[.8]
                  first-letter:text-magenta">${esc(c.home.faith.intro)}</p>
        <div aria-hidden="true" class="my-7 h-px w-full" style="background:rgba(28,28,28,.18)"></div>
        <ol class="columns-1 gap-10 sm:columns-2">
          ${B.map((b, i) => `<li class="mb-5 break-inside-avoid text-[1.08rem] leading-[1.45] text-ink">${numeral(i)}${esc(b)}</li>`).join('')}
        </ol>
      </div>`, 'py-16');
  }

  if (key === 'threeCol') {
    return shell(`
      <div class="p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-12" style="${PLATE}">
        ${label(c)}
        <p class="mt-6 text-center text-[1.15rem] leading-[1.55] text-ink">${esc(c.home.faith.intro)}</p>
        <div aria-hidden="true" class="my-8 h-px w-full" style="background:rgba(28,28,28,.18)"></div>
        <ol class="columns-1 gap-9 sm:columns-2 lg:columns-3">
          ${B.map((b, i) => `<li class="mb-5 break-inside-avoid text-[1.02rem] leading-[1.45] text-ink">${numeral(i)}${esc(b)}</li>`).join('')}
        </ol>
      </div>`, 'py-16', 'max-w-6xl');
  }

  if (key === 'sideIntro') {
    return shell(`
      <div class="p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-12" style="${PLATE}">
        ${label(c)}
        <div class="mt-8 grid gap-10 lg:grid-cols-[4fr_7fr]">
          <div class="lg:border-r lg:pr-10" style="border-color:rgba(28,28,28,.18)">
            <p class="text-[1.2rem] leading-[1.55] text-ink
                      first-letter:float-left first-letter:mr-2 first-letter:mt-1
                      first-letter:text-[3.25rem] first-letter:font-semibold first-letter:leading-[.8]
                      first-letter:text-magenta">${esc(c.home.faith.intro)}</p>
          </div>
          <ol class="columns-1 gap-9 sm:columns-2">
            ${B.map((b, i) => `<li class="mb-5 break-inside-avoid text-[1.02rem] leading-[1.45] text-ink">${numeral(i)}${esc(b)}</li>`).join('')}
          </ol>
        </div>
      </div>`, 'py-16', 'max-w-6xl');
  }

  if (key === 'leanIntro') {
    const firstSentence = c.home.faith.intro.split(/(?<=\.)\s+/)[0];
    return shell(`
      <div class="p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-12" style="${PLATE}">
        ${label(c)}
        <p class="mx-auto mt-6 max-w-2xl text-center text-[1.25rem] leading-[1.5] text-ink">${esc(firstSentence)}</p>
        <div aria-hidden="true" class="my-8 h-px w-full" style="background:rgba(28,28,28,.18)"></div>
        <ol class="columns-1 gap-9 sm:columns-2 lg:columns-3">
          ${B.map((b, i) => `<li class="mb-5 break-inside-avoid text-[1.02rem] leading-[1.45] text-ink">${numeral(i)}${esc(b)}</li>`).join('')}
        </ol>
        <p class="mt-8 text-center font-body text-[10px] uppercase tracking-[0.2em] text-ink-soft">Rest of the intro dropped — client copy, so their call</p>
      </div>`, 'py-16', 'max-w-6xl');
  }

  // bandPlate
  return shell(`
    <div class="px-8 py-9 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:px-14 sm:py-11" style="${PLATE}">
      <div class="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-baseline sm:justify-between" style="border-color:rgba(28,28,28,.18)">
        <p class="shrink-0 font-body text-[11px] uppercase tracking-[0.4em] text-ink-soft">${esc(c.home.faith.title)}</p>
        <p class="max-w-3xl text-[1.05rem] leading-[1.5] text-ink">${esc(c.home.faith.intro)}</p>
      </div>
      <ol class="mt-8 columns-1 gap-9 sm:columns-2 lg:columns-3">
        ${B.map((b, i) => `<li class="mb-5 break-inside-avoid text-[1.02rem] leading-[1.45] text-ink">${numeral(i)}${esc(b)}</li>`).join('')}
      </ol>
    </div>`, 'py-14', 'max-w-6xl');
};

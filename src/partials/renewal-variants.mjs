// "Join us to experience healing and renewal" — the section after the
// struggles list.
//
// The design question here is not really what this section looks like on its
// own; it is how it follows the one above. The struggles section names six
// problems with the list on the LEFT and the photograph on the RIGHT. This
// section is the answer to them. So the options below are mostly different
// answers to "how do these two read as a pair".
//
// The obvious move — and the reason mirror is first — is to flip the axis:
// problem left, answer right. The eye crosses the page and the change of
// direction does the work of a transition without needing a device.
import { esc } from './layout.mjs';

export const RENEWALS = {
  mirror: {
    label: 'Mirror — photo left, answers right',
    note: 'The exact inverse of the struggles layout. Problem on the left with its photo right; answer on the right with its photo left. The eye crosses the page and the pair reads as one argument. Smoothest, and the least work.',
  },
  bridge: {
    label: 'Bridge — a turning line between the two',
    note: 'A short centred line sits between the sections marking the turn from problem to answer, with a hairline running down into it. Explicit rather than implied — useful if the pairing needs to be unmistakable.',
  },
  darkTurn: {
    label: 'Dark turn — the answer arrives lit',
    note: 'This section inverts to dark with the photograph glowing out of it. The struggles are stated in daylight and the answer is cinematic, which also ties back to the hero. Strongest contrast of the six.',
  },
  overlap: {
    label: 'Overlap — the photo stitches the sections together',
    note: 'The group shot lifts up out of this section into the one above, physically overlapping the boundary. Removes the seam entirely; the two read as a single spread.',
  },
  band: {
    label: 'Full band — photo edge to edge, answers beneath',
    note: 'The group shot runs the full width as a band, with the three answers in a row under it. Gives the photograph real scale — it is a room of a hundred women and the cropped version wastes that.',
  },
  numbered: {
    label: 'Paired numbering — cyan answers to magenta problems',
    note: 'The three answers take numerals like the struggles above, but in cyan rather than magenta. The colour switch is the whole signal: same system, opposite side of it.',
  },
};

const heading = (c, tone = 'text-ink') => `
<h2 class="font-display text-3xl font-bold leading-tight ${tone} sm:text-[2.75rem]">${esc(c.home.renewal.heading)}</h2>`;

const photo = (c, cls = '') => `
<img src="${esc(c.home.renewal.photo)}" alt="${esc(c.home.renewal.photoAlt)}"
     width="2560" height="1440" loading="lazy" decoding="async"
     class="${cls}">`;

// Bold lead-in then body, as the live site sets it.
const list = (c, opts = {}) => `
<ul class="space-y-8">
  ${c.home.renewal.items.map((it, i) => `
  <li class="flex gap-5">
    ${opts.numbered
      ? `<span aria-hidden="true" class="shrink-0 font-display text-2xl font-bold leading-none tabular-nums" style="color:rgba(0,185,198,.55)">${String(i + 1).padStart(2, '0')}</span>`
      : `<span aria-hidden="true" class="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-cyan"></span>`}
    <p class="font-body text-lg leading-relaxed ${opts.tone || 'text-ink'}">
      <strong class="font-display font-bold ${opts.strong || 'text-ink'}">${esc(it.title)}</strong>
      <span class="${opts.body || 'text-ink-soft'}"> ${esc(it.body)}</span>
    </p>
  </li>`).join('')}
</ul>`;

export const renderRenewal = (site, c, key) => {
  if (key === 'mirror') {
    return `
<section class="bg-white py-24">
  <div class="mx-auto max-w-content px-6">
    <div class="grid items-center gap-14 lg:grid-cols-[5fr_7fr]">
      <div>${photo(c, 'aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]')}</div>
      <div>
        ${heading(c)}
        <div class="mt-10">${list(c)}</div>
      </div>
    </div>
  </div>
</section>`;
  }

  if (key === 'bridge') {
    return `
<section class="bg-white pb-24 pt-10">
  <div class="mx-auto max-w-content px-6">
    <div class="flex flex-col items-center text-center">
      <span aria-hidden="true" class="h-16 w-px bg-gradient-to-b from-transparent to-magenta"></span>
      <p class="mt-6 font-body text-xs uppercase tracking-[0.3em] text-magenta">It does not have to stay this way</p>
      <div class="mt-6">${heading(c)}</div>
    </div>
    <div class="mt-14 grid items-center gap-14 lg:grid-cols-[5fr_7fr]">
      <div>${photo(c, 'aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]')}</div>
      <div>${list(c)}</div>
    </div>
    <p class="mt-8 text-center font-body text-[11px] uppercase tracking-[0.2em] text-ink-soft">Turning line is placeholder copy — needs writing</p>
  </div>
</section>`;
  }

  if (key === 'darkTurn') {
    return `
<section class="relative bg-ink py-24">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="absolute -left-32 top-0 h-[32rem] w-[32rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(0,185,198,.22),transparent 68%)"></div>
    <div class="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(232,32,143,.20),transparent 68%)"></div>
  </div>
  <div class="relative mx-auto max-w-content px-6">
    <div class="grid items-center gap-14 lg:grid-cols-[5fr_7fr]">
      <div>${photo(c, 'aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] ring-1 ring-white/15')}</div>
      <div>
        ${heading(c, 'text-white')}
        <div class="mt-10">${list(c, { tone: 'text-white/85', strong: 'text-white', body: 'text-white/70' })}</div>
      </div>
    </div>
  </div>
</section>`;
  }

  if (key === 'overlap') {
    return `
<section class="relative bg-white pb-24">
  <div class="mx-auto max-w-content px-6">
    <!-- The photo lifts up out of this section into the one above. -->
    <div class="grid items-end gap-14 lg:grid-cols-[5fr_7fr]">
      <div class="-mt-28 lg:-mt-40">
        ${photo(c, 'aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[0_40px_80px_-30px_rgba(28,28,28,.55)] ring-8 ring-white')}
      </div>
      <div class="pb-4">
        ${heading(c)}
        <div class="mt-10">${list(c)}</div>
      </div>
    </div>
  </div>
</section>`;
  }

  if (key === 'band') {
    return `
<section class="bg-white pb-24">
  <div class="relative h-[340px] w-full overflow-hidden sm:h-[460px]">
    ${photo(c, 'h-full w-full object-cover')}
  </div>
  <div class="mx-auto max-w-content px-6">
    <div class="mt-14 text-center">${heading(c)}</div>
    <div class="mt-12 grid gap-10 sm:grid-cols-3">
      ${c.home.renewal.items.map(it => `
      <div>
        <span aria-hidden="true" class="block h-0.5 w-10 rounded-full bg-gradient-to-r from-magenta to-cyan"></span>
        <h3 class="mt-5 font-display text-lg font-bold text-ink">${esc(it.title)}</h3>
        <p class="mt-3 font-body leading-relaxed text-ink-soft">${esc(it.body)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;
  }

  // numbered
  return `
<section class="bg-white py-24">
  <div class="mx-auto max-w-content px-6">
    <div class="grid gap-14 lg:grid-cols-[5fr_7fr]">
      <div>${photo(c, 'sticky top-24 aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]')}</div>
      <div>
        ${heading(c)}
        <div class="mt-12">${list(c, { numbered: true })}</div>
      </div>
    </div>
  </div>
</section>`;
};

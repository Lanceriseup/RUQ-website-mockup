// The struggles and renewal sections designed as ONE spread.
//
// Treating them separately is why they kept coming out basic. They are a
// single argument — six problems, then three answers — and the design should
// carry that. So each option below renders BOTH, and the pairing is the idea.
//
// Typography follows the NLB pattern the client liked: a short evocative
// phrase in Julietta Messie, the rest in bold Montserrat, with a drawn swash
// under the script. No copy is invented — each heading is their own sentence
// split across the two faces:
//
//   "Common struggles"  (script)  /  "women in marriage have"     (sans)
//   "Join us to experience" (sans) / "healing and renewal"        (script)
//
// which also gives the two sections opposite rhythms: script-then-sans, then
// sans-then-script.
import { esc } from './layout.mjs';

export const SPREADS = {
  chapters: {
    label: 'Chapters — script headings, mirrored columns, soft light',
    note: 'Each section is a chapter with a script heading and a drawn swash. Struggles run list-left with magenta numerals; renewal flips to photo-left with cyan ones. The most straightforwardly premium reading of the pair.',
  },
  diptych: {
    label: 'Diptych — the problem in daylight, the answer lit',
    note: 'Struggles on warm white, renewal on deep ink with the photograph glowing out of it. The turn from problem to answer is carried by the light itself. Most dramatic, and it echoes the hero.',
  },
  magazine: {
    label: 'Magazine spread — one continuous ground, overlapping plates',
    note: 'Both sections share a single ground with the photographs overlapping the boundary between them, hairline rules and oversized script. Reads as two facing pages rather than two web sections.',
  },
  gold: {
    label: 'Gold script — the NLB palette applied directly',
    note: 'The same layout as chapters but the script is set in NLB\'s gold #b7873e rather than brand magenta. Worth seeing side by side: gold is what made the reference feel expensive, and it is not currently in the RUQ palette.',
  },
};

const SWASH = (colour, w = 300) => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 ${w} 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

// script line + sans line, in either order
const dualHeading = (scriptText, sansText, opts) => {
  const { colour, sansTone, scriptFirst = true, size = '4.5rem' } = opts;
  const script = `
    <span class="relative inline-block">
      <span class="script block" style="color:${colour};font-size:${size};line-height:.9">${esc(scriptText)}</span>
      ${SWASH(colour)}
    </span>`;
  const sans = `<span class="block font-display text-2xl font-bold uppercase tracking-[0.06em] ${sansTone} sm:text-[2.1rem]">${esc(sansText)}</span>`;
  return `<h2 class="leading-none">${scriptFirst ? script + `<span class="mt-3 block">${sans}</span>` : sans + `<span class="mt-1 block">${script}</span>`}</h2>`;
};

const struggleList = (c, numeralColour, tone = 'text-ink') => `
<ul class="space-y-8">
  ${c.home.painPoints.items.map((t, i) => `
  <li class="flex gap-6">
    <span aria-hidden="true" class="shrink-0 font-display text-xl font-bold leading-none tabular-nums" style="color:${numeralColour}">${String(i + 1).padStart(2, '0')}</span>
    <p class="font-body text-lg leading-relaxed ${tone}">${esc(t)}</p>
  </li>`).join('')}
</ul>`;

const renewalList = (c, opts = {}) => `
<ul class="space-y-8">
  ${c.home.renewal.items.map((it, i) => `
  <li class="flex gap-6">
    <span aria-hidden="true" class="shrink-0 font-display text-xl font-bold leading-none tabular-nums" style="color:${opts.numeral || 'rgba(0,185,198,.6)'}">${String(i + 1).padStart(2, '0')}</span>
    <p class="font-body text-lg leading-relaxed ${opts.tone || 'text-ink'}">
      <strong class="font-display font-bold ${opts.strong || 'text-ink'}">${esc(it.title)}</strong>
      <span class="${opts.body || 'text-ink-soft'}"> ${esc(it.body)}</span>
    </p>
  </li>`).join('')}
</ul>`;

const img = (src, alt, cls) =>
  `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" class="${cls}">`;

const orbs = (a = '.16', b = '.14') => `
<div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
  <div class="absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(232,32,143,${a}),transparent 68%)"></div>
  <div class="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(0,185,198,${b}),transparent 68%)"></div>
</div>`;

export const renderSpread = (site, c, key) => {
  const MAGENTA = '#e8208f';
  const GOLD = '#b7873e';
  const CYAN = '#00b9c6';
  const scriptColour = key === 'gold' ? GOLD : MAGENTA;
  const answerColour = key === 'gold' ? GOLD : CYAN;

  if (key === 'diptych') {
    return `
<section class="relative bg-white py-24">
  ${orbs()}
  <div class="relative mx-auto max-w-content px-6">
    <div class="grid gap-14 lg:grid-cols-[7fr_5fr]">
      <div>
        ${dualHeading('Common struggles', 'women in marriage have', { colour: MAGENTA, sansTone: 'text-ink' })}
        <div class="mt-12">${struggleList(c, 'rgba(232,32,143,.4)')}</div>
      </div>
      <div class="relative hidden lg:block">
        ${img('/assets/photos/gallery-1-2.jpg', '', 'sticky top-24 aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]')}
      </div>
    </div>
  </div>
</section>

<section class="relative overflow-hidden bg-ink py-24">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0">
    <div class="absolute -left-24 top-0 h-[32rem] w-[32rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(0,185,198,.24),transparent 68%)"></div>
    <div class="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(232,32,143,.20),transparent 68%)"></div>
  </div>
  <div class="relative mx-auto max-w-content px-6">
    <div class="grid items-center gap-14 lg:grid-cols-[5fr_7fr]">
      <div>${img(c.home.renewal.photo, c.home.renewal.photoAlt, 'aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,.85)] ring-1 ring-white/15')}</div>
      <div>
        ${dualHeading('healing and renewal', 'Join us to experience', { colour: CYAN, sansTone: 'text-white/70', scriptFirst: false })}
        <div class="mt-10">${renewalList(c, { tone: 'text-white/85', strong: 'text-white', body: 'text-white/70', numeral: 'rgba(0,185,198,.7)' })}</div>
      </div>
    </div>
  </div>
</section>`;
  }

  if (key === 'magazine') {
    return `
<div class="relative" style="background:linear-gradient(180deg,#ffffff,#FDF6F1 55%,#ffffff)">
  ${orbs('.12', '.10')}
  <section class="relative mx-auto max-w-content px-6 pb-10 pt-24">
    <div class="border-b border-ink/10 pb-4">
      ${dualHeading('Common struggles', 'women in marriage have', { colour: MAGENTA, sansTone: 'text-ink' })}
    </div>
    <div class="mt-12 grid gap-14 lg:grid-cols-[7fr_5fr]">
      <div>${struggleList(c, 'rgba(232,32,143,.4)')}</div>
      <div class="relative hidden lg:block">
        <!-- Plate hangs below its column and overlaps the section boundary. -->
        ${img('/assets/photos/gallery-1-2.jpg', '', 'relative z-10 aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_36px_70px_-30px_rgba(28,28,28,.5)] ring-8 ring-white')}
      </div>
    </div>
  </section>

  <section class="relative mx-auto max-w-content px-6 pb-24">
    <div class="grid items-start gap-14 lg:grid-cols-[6fr_6fr]">
      <div class="-mt-20 lg:-mt-32">
        ${img(c.home.renewal.photo, c.home.renewal.photoAlt, 'aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[0_36px_70px_-30px_rgba(28,28,28,.5)] ring-8 ring-white')}
      </div>
      <div class="pt-6">
        ${dualHeading('healing and renewal', 'Join us to experience', { colour: answerColour, sansTone: 'text-ink-soft', scriptFirst: false, size: '3.75rem' })}
        <div class="mt-10">${renewalList(c)}</div>
      </div>
    </div>
  </section>
</div>`;
  }

  // chapters + gold share a layout; only the script colour differs
  return `
<section class="relative bg-white py-24">
  ${orbs()}
  <div class="relative mx-auto max-w-content px-6">
    <div class="grid gap-14 lg:grid-cols-[7fr_5fr]">
      <div>
        ${dualHeading('Common struggles', 'women in marriage have', { colour: scriptColour, sansTone: 'text-ink' })}
        <div class="mt-12">${struggleList(c, key === 'gold' ? 'rgba(183,135,62,.55)' : 'rgba(232,32,143,.4)')}</div>
      </div>
      <div class="relative hidden lg:block">
        ${img('/assets/photos/gallery-1-2.jpg', '', 'sticky top-24 aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]')}
      </div>
    </div>
  </div>
</section>

<section class="relative bg-white pb-28">
  <div class="relative mx-auto max-w-content px-6">
    <div class="grid items-center gap-14 lg:grid-cols-[5fr_7fr]">
      <div>${img(c.home.renewal.photo, c.home.renewal.photoAlt, 'aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]')}</div>
      <div>
        ${dualHeading('healing and renewal', 'Join us to experience', { colour: answerColour, sansTone: 'text-ink-soft', scriptFirst: false, size: '3.75rem' })}
        <div class="mt-10">${renewalList(c, { numeral: key === 'gold' ? 'rgba(183,135,62,.55)' : 'rgba(0,185,198,.6)' })}</div>
      </div>
    </div>
  </div>
</section>`;
};

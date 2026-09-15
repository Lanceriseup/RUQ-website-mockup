// Builds /nav-compact.html — the mobile header, compacted six ways.
//
// Each option is rendered in a real 390px-wide frame over the real hero video,
// with the real headline below it, because the whole point of the exercise is
// how much of the first screen the header is taking from the content. A
// side-by-side of cropped screenshots would hide exactly that.
//
// Each frame measures its own header at runtime and prints the number, so the
// comparison is measured rather than asserted.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCompactNav, COMPACT_MODES } from '../src/partials/nav-compact.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

// One phone frame: header over the hero, then the real headline and CTA, so
// the saving shows up as content moving UP rather than as a smaller logo.
const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(COMPACT_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-ink">
<section class="relative min-h-[520px] overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-60" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/70"></div>
  ${renderCompactNav(site, key)}

  <!-- Hero content, identical in all seven frames except for its top clearance.
       That clearance is the real deliverable: the header sits ON the hero
       (position:absolute), so the hero carries pt-44 = 176px to clear today's
       153px bar. Shrinking the header without bringing that number down saves
       nothing you can see — so each mode ships its own heroPad, kept at the
       same ~23px of breathing room below the bar. -->
  <div id="hero-content" class="relative px-5 ${COMPACT_MODES[key].heroPad} pb-10 text-center">
    <p class="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-cyan">${esc(site.nextEvent.dates)} &middot; ${esc(site.nextEvent.location)}</p>
    <h1 class="mt-3 font-display text-[26px] font-extrabold leading-[1.1] text-white">Step Into The Woman<br>God Created You To Be</h1>
    <p class="mt-3 font-body text-sm leading-relaxed text-white/80">Three days that reset how you see yourself, your purpose and your worth.</p>
    <a href="${esc(site.nextEvent.ctaUrl)}" class="mt-5 inline-flex min-h-11 items-center rounded-full bg-magenta px-7 font-body text-xs font-bold uppercase tracking-[0.2em] text-white">${esc(site.nextEvent.ctaText)}</a>
  </div>
</section>

<!-- Measures the header it just rendered and reports it to the review page. -->
<script>
(function () {
  function report() {
    var h = document.getElementById('site-nav');
    var c = document.getElementById('hero-content');
    if (!h || !c) return;
    // Two numbers worth knowing: the bar itself, and where the first word of
    // content actually lands — the second is what a visitor experiences.
    var navPx = Math.round(h.getBoundingClientRect().height);
    var firstPx = Math.round(c.firstElementChild.getBoundingClientRect().top);
    try { parent.postMessage({ navHeight: navPx, firstContent: firstPx, mode: ${JSON.stringify(key)} }, '*'); } catch (e) {}
  }
  addEventListener('load', report);
  addEventListener('resize', report);
  report();
})();
</script>
</body></html>`;

const KEYS = Object.keys(COMPACT_MODES);

const card = (key) => {
  const m = COMPACT_MODES[key];
  const isBase = key === 'current';
  return `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${isBase ? 'bg-ink-soft' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h2 class="font-display text-base font-bold">${esc(m.label)}</h2>
      <span class="ml-auto font-body text-xs font-bold tabular-nums text-ink-soft" data-h="${esc(key)}">measuring…</span>
    </div>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(m.note)}</p>
    <!-- Pinned to 390px, not w-full: a preview that resizes with the reviewer's
         browser is not a phone preview. This is an iPhone 14/15 logical width,
         so what you see is what the phone renders. -->
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/navc-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[520px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-ink"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Compact mobile header — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Compact mobile header</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">The shipped header spends about <strong>153px</strong> of a 390px phone on the
     wordmark and its hairline before any content starts. Six ways to get that back, each shown at true phone width over
     the real hero, with identical content underneath — so what you are comparing is how high the headline sits.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Every option is <strong>mobile-only</strong>. The desktop masthead is
     untouched in all six. Heights are measured live in each frame, not quoted.</p>

  <div class="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${KEYS.map(card).join('')}
  </div>
</div>

<!-- Collects the measured header height from each frame and fills in its badge,
     plus the saving against the current header. -->
<script>
(function () {
  // Frames load lazily and in no fixed order, so a report that arrives before
  // the baseline is parked and repainted once 'current' lands.
  var base = null, pending = {};

  function paint(mode, d) {
    var el = document.querySelector('[data-h="' + mode + '"]');
    if (!el) return;
    var txt = d.navHeight + 'px bar · content at ' + d.firstContent + 'px';
    if (mode === 'current') { el.textContent = txt + ' (baseline)'; return; }
    if (base == null) { pending[mode] = d; el.textContent = txt; return; }
    var cut = Math.round((1 - d.firstContent / base) * 100);
    el.textContent = txt + (cut > 0 ? ' · ' + cut + '% higher' : '');
  }

  addEventListener('message', function (e) {
    var d = e.data;
    if (!d || typeof d.navHeight !== 'number' || !d.mode) return;
    if (d.mode === 'current') {
      base = d.firstContent;
      for (var k in pending) paint(k, pending[k]);
      pending = {};
    }
    paint(d.mode, d);
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'nav-compact.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `navc-${key}.html`), frame(key));
console.log(`built nav-compact.html + ${KEYS.length} frames`);

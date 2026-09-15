// Builds /testimonials-mobile.html — the testimonial rails, four ways.
// Frames report section height and, just as importantly, how many card nodes
// and poster images are actually rendered at phone width.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTestimonials, TEST_MODES } from '../src/partials/testimonials-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const vids = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(TEST_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
${renderTestimonials(vids, key)}
<script src="/app.js" defer></script>
<script>
addEventListener('load', function () {
  var s = document.getElementById('testimonials');
  // Count only what the browser actually lays out at this width.
  var cards = [].slice.call(s.querySelectorAll('.video-facade')).filter(function (b) { return b.offsetParent !== null; });
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(s.getBoundingClientRect().height),
      cards: cards.length,
      total: s.querySelectorAll('.video-facade').length,
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(TEST_MODES);

const card = (key) => {
  const m = TEST_MODES[key];
  const isBase = key === 'current';
  return `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${isBase ? 'bg-ink-soft' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h2 class="font-display text-base font-bold">${esc(m.label)}</h2>
    </div>
    <p class="mt-1 font-body text-xs font-bold tabular-nums text-ink-soft" data-h="${esc(key)}">measuring…</p>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(m.note)}</p>
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/tmb-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[700px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Testimonials — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Testimonials — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Two rails of 230px portrait cards drifting in opposite directions. At 390px the
     section runs about <strong>836px</strong>, and the two rails are 595px of that.</p>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>The payload is the bigger
     finding.</strong> The rail duplicates each set until it clears MIN_SET_W = 2600px, so the loop has track to run into.
     That is a desktop measurement — it exists so a 2560px monitor never sees a gap — and it is applied at build time, to
     one static HTML file, for every viewport. The result: <strong>60 card buttons and 60 poster images</strong> shipped to
     a 390px phone that shows about one and a half cards at a time, with each set 3750px wide. The loop only needs twice
     the viewport; one repeat already gives 1250px.</p>
  <p class="mt-3 max-w-3xl text-ink-soft">C fixes that without touching desktop: the repeats past the first are wrapped and
     dropped below sm with <code>hidden sm:contents</code>, which keeps both sets exactly equal so the &minus;50% wrap stays
     seamless. Each frame reports how many cards the browser actually lays out at phone width.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">All four are mobile-only; the desktop section is untouched.</p>

  <div class="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${KEYS.map(card).join('')}
  </div>
</div>

<script>
(function () {
  var base = null, pending = {};
  function paint(mode, d) {
    var el = document.querySelector('[data-h="' + mode + '"]');
    if (!el) return;
    var cards = ' · ' + d.cards + ' cards rendered';
    if (mode === 'current') { el.textContent = d.h + 'px (baseline)' + cards; return; }
    if (base == null) { pending[mode] = d; el.textContent = d.h + 'px' + cards; return; }
    var cut = Math.round((1 - d.h / base) * 100);
    el.textContent = d.h + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : '') + cards;
  }
  addEventListener('message', function (e) {
    var d = e.data;
    if (!d || !d.mode || typeof d.h !== 'number') return;
    if (d.mode === 'current') { base = d.h; for (var k in pending) paint(k, pending[k]); pending = {}; }
    paint(d.mode, d);
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'testimonials-mobile.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `tmb-${key}.html`), frame(key));
console.log(`built testimonials-mobile.html + ${KEYS.length} frames`);

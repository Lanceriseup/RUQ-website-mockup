// Builds /faith-mobile.html — the Statement of Faith creed, five ways for
// mobile. Frames render the real section at 390px on its real ground and
// report the section height.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderFaith, FAITH_MODES, FAITH_JS } from '../src/partials/faith-compact-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(FAITH_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
${renderFaith(content, key)}
<script>${FAITH_JS}</script>
<script>
addEventListener('load', function () {
  var s = document.getElementById('faith');
  try { parent.postMessage({ mode: ${JSON.stringify(key)}, h: Math.round(s.getBoundingClientRect().height) }, '*'); } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(FAITH_MODES);

const card = (key) => {
  const m = FAITH_MODES[key];
  const isBase = key === 'current';
  const warn = key === 'collapse';
  return `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${isBase ? 'bg-ink-soft' : warn ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h2 class="font-display text-base font-bold">${esc(m.label)}</h2>
    </div>
    <p class="mt-1 font-body text-xs font-bold tabular-nums text-ink-soft" data-h="${esc(key)}">measuring…</p>
    <p class="mt-2 text-sm leading-relaxed ${warn ? 'rounded-lg bg-ink/5 p-3 text-ink' : 'text-ink-soft'}">${esc(m.note)}</p>
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/fmc-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[820px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Statement of Faith — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Statement of Faith — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">The longest single block on the home page: a 382-character intro plus seven
     beliefs, set as a printed document. On a 390px phone the plate's inner column is only <strong>278px</strong> — page
     gutters take 48px and the plate's own padding another 64px — and everything in it was sized for the two-column
     desktop plate.</p>
  <p class="mt-4 max-w-3xl rounded-xl bg-ink/5 px-4 py-3 text-sm text-ink"><strong>One constraint worth stating up front.</strong>
     faith.mjs records a deliberate decision: the live site buried these seven points in a collapsed accordion inside a
     scroll box, and this build un-buried them because they are the most load-bearing content on the page for this
     audience. Option E puts them back behind a disclosure. It is included so the comparison is complete, not because I
     recommend it — A to D get the height down without touching reachability.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">All five are mobile-only; the desktop plate is untouched. Copy is
     verbatim throughout.</p>

  <div class="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${KEYS.map(card).join('')}
  </div>
</div>

<script>
(function () {
  var base = null, pending = {};
  function paint(mode, px) {
    var el = document.querySelector('[data-h="' + mode + '"]');
    if (!el) return;
    if (mode === 'current') { el.textContent = px + 'px (baseline)'; return; }
    if (base == null) { pending[mode] = px; el.textContent = px + 'px'; return; }
    var cut = Math.round((1 - px / base) * 100);
    el.textContent = px + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : '');
  }
  addEventListener('message', function (e) {
    var d = e.data;
    if (!d || !d.mode || typeof d.h !== 'number') return;
    if (d.mode === 'current') { base = d.h; for (var k in pending) paint(k, pending[k]); pending = {}; }
    paint(d.mode, d.h);
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'faith-mobile.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `fmc-${key}.html`), frame(key));
console.log(`built faith-mobile.html + ${KEYS.length} frames`);

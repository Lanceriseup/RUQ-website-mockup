// Builds /team-mobile.html — the Meet the Team page, four ways for mobile.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTeam, TEAM_MODES } from '../src/partials/team-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(TEAM_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body style="background:#0b0b0b">
${renderTeam(content, key)}
<script>
addEventListener('load', function () {
  var s = document.getElementById('team');
  var figs = [].slice.call(s.querySelectorAll('figure.polaroid')).filter(function (f) { return f.offsetParent !== null; });
  var first = figs[0].getBoundingClientRect();
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(s.getBoundingClientRect().height),
      cards: figs.length,
      cardW: Math.round(first.width),
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(TEAM_MODES);

const card = (key) => {
  const m = TEAM_MODES[key];
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
      <iframe src="/tmp-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[760px] w-[390px] max-w-full rounded-[1.25rem] border-0"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meet the Team — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Meet the Team — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">The page measures <strong>6806px</strong> at 390px — about ten phone screens for
     twelve people. The grid is <code>sm:grid-cols-2 lg:grid-cols-3</code>, so below sm it is <strong>one</strong> column of
     288px polaroid plates at 3:4, each card 471px tall including its caption.</p>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>Two levers.</strong> The column
     count is the big one — two 165px cards fit comfortably at 390px and a face is still perfectly readable, which halves
     the rows outright. The second is that the two groups are not the same thing: coaches have a biography behind a "Read
     bio" button; leadership have none, on the live site either. They are currently built at identical size, so six cards
     of equal weight are spent on what is really a roster.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Each frame reports the block height, the number of cards actually laid
     out, and the card width. All four are mobile-only; the two- and three-up desktop grids are untouched.</p>

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
    var extra = ' · ' + d.cards + ' cards at ' + d.cardW + 'px';
    if (mode === 'current') { el.textContent = d.h + 'px (baseline)' + extra; return; }
    if (base == null) { pending[mode] = d; el.textContent = d.h + 'px' + extra; return; }
    var cut = Math.round((1 - d.h / base) * 100);
    el.textContent = d.h + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : '') + extra;
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

fs.writeFileSync(path.join(dist, 'team-mobile.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `tmp-${key}.html`), frame(key));
console.log(`built team-mobile.html + ${KEYS.length} frames`);

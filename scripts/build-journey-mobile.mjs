// Builds /journey-mobile.html — the About journey section, four ways.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderJourneyCards, JOURNEY_MODES } from '../src/partials/journey-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(JOURNEY_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
${renderJourneyCards(content, key)}
<div class="border-t border-ink/10 bg-white px-6 py-6"><p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-cyan-text">Next section starts here</p></div>
<script>
addEventListener('load', function () {
  var s = document.getElementById('journey');
  var items = [].slice.call(s.querySelectorAll('article, li')).filter(function (n) { return n.offsetParent !== null; });
  var r = items[0].getBoundingClientRect();
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(s.getBoundingClientRect().height),
      itemH: Math.round(r.height),
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(JOURNEY_MODES);

const card = (key) => {
  const m = JOURNEY_MODES[key];
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
      <iframe src="/jny-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[760px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About journey — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">About journey — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Three steps, each a tall 3:4 photograph with a white card laid across its lower
     edge. At 390px the block is <strong>2310px</strong> — three cards at 342&times;557 — and the photograph is nearly all
     of it: 3:4 across a 342px column is 456px, and the card only claws 48px back by overlapping.</p>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>The overlap device needs a tall
     photograph to overlap.</strong> On desktop the card sits across the bottom third of a portrait in a narrow column and
     reads as a caption plate laid on a print. At full phone width the photograph is nearly a screen tall on its own, and
     the card reads less as an overlap than as the next block starting early. So the options split two ways: keep the
     device and shrink the photograph (A&ndash;C), or accept it does not earn its height on a phone and lay the step out as
     a row (D).</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">All four are mobile-only; the staggered three-up desktop row is untouched,
     and the client's copy is verbatim throughout.</p>

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
    var extra = ' · each step ' + d.itemH + 'px';
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

fs.writeFileSync(path.join(dist, 'journey-mobile.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `jny-${key}.html`), frame(key));
console.log(`built journey-mobile.html + ${KEYS.length} frames`);

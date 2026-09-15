// Builds /plate-compact.html — the renewal photographic plate, five ways.
//
// Each frame shows the tail of the struggles list (items 05 and 06) directly
// above the plate, because the reported problem is the plate sitting on top of
// item 06. A frame that showed the photograph alone would hide the actual
// defect.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPlate, PLATE_MODES } from '../src/partials/plate-compact.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

// The last two struggles items, at the shipped compact settings, so the
// overlap is visible exactly as it is on the live page.
const listTail = content.home.painPoints.items.slice(4).map((t, i) => `
  <li class="flex gap-4">
    <span aria-hidden="true" class="shrink-0 font-display text-sm font-bold leading-relaxed tabular-nums" style="color:rgba(232,32,143,.4)">${String(i + 5).padStart(2, '0')}</span>
    <p class="font-body text-base leading-relaxed text-ink">${esc(t)}</p>
  </li>`).join('');

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(PLATE_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
<div class="relative" style="background:linear-gradient(180deg,#ffffff,#FDF6F1 55%,#ffffff)">
  <section class="relative mx-auto max-w-content px-6 pt-8 pb-8">
    <ul class="space-y-4">${listTail}</ul>
  </section>
  ${renderPlate(content, key)}
</div>
<script>
addEventListener('load', function () {
  var img = document.querySelector('img');
  var six = document.querySelectorAll('li')[1];
  var r6 = six.getBoundingClientRect();
  var payload = { mode: ${JSON.stringify(key)}, overlap: 0, h: 0 };
  if (img && img.offsetParent !== null) {
    var ri = img.getBoundingClientRect();
    payload.h = Math.round(ri.height);
    // Positive means the photograph's top edge is above item 06's bottom edge,
    // i.e. it is covering it.
    payload.overlap = Math.max(0, Math.round(r6.bottom - ri.top));
  }
  try { parent.postMessage(payload, '*'); } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(PLATE_MODES);

const card = (key) => {
  const m = PLATE_MODES[key];
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
      <iframe src="/plc-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[620px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Renewal plate — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Renewal photo — mobile</h1>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>The overlap is a bug, and it is
     separate from the size.</strong> The plate's wrapper carries <code>-mt-20 lg:-mt-24</code> — the negative margin has no
     breakpoint, so it applies at every width. On desktop that lift is the magazine device: the plate is in the right-hand
     column and crosses the section boundary <em>beside</em> the list. Below lg the grid is a single column, so the same
     lift drags the photograph up <em>on top of</em> the list. Compacting the list made it more obvious by removing padding
     that was absorbing part of the lift, but the overlap was always there.</p>
  <p class="mt-3 max-w-3xl text-ink-soft">Option A fixes only that, and changes nothing else — worth looking at first, to
     judge whether the 4:5 plate is actually too big once it is no longer sitting on item 06. B to E then crop or narrow it.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Each frame shows items 05 and 06 above the plate and reports how many
     pixels of item 06 are covered, plus the plate's rendered height. All five are below-lg only — the desktop spread and
     its overlap are untouched.</p>

  <div class="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${KEYS.map(card).join('')}
  </div>
</div>

<script>
addEventListener('message', function (e) {
  var d = e.data;
  if (!d || !d.mode) return;
  var el = document.querySelector('[data-h="' + d.mode + '"]');
  if (!el) return;
  el.textContent = (d.h ? 'plate ' + d.h + 'px tall · ' : 'plate hidden · ') +
    (d.overlap > 0 ? d.overlap + 'px of item 06 covered' : 'no overlap');
  el.className = 'mt-1 font-body text-xs font-bold tabular-nums ' + (d.overlap > 0 ? 'text-magenta-text' : 'text-ink-soft');
});
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'plate-compact.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `plc-${key}.html`), frame(key));
console.log(`built plate-compact.html + ${KEYS.length} frames`);

// Builds /struggles-heading.html — round two on the "Common struggles" section.
//
// The list is settled (option A) and identical in every frame, so the only
// variable is the heading: whether it is centred, and how it is kept to one
// line. Frames render at 390px and also report the script's own measured width
// against the space available, which is what decides whether a fixed size is
// safe or merely lucky.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderStrugglesHeading, HEADING_MODES } from '../src/partials/struggles-compact.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(HEADING_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
${renderStrugglesHeading(content, key)}
<div class="border-t border-ink/10 bg-white px-6 py-8">
  <p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-cyan-text">Next section starts here</p>
</div>
<script>
addEventListener('load', function () {
  var s = document.getElementById('struggles');
  var script = s.querySelector('.script');
  var r = script.getBoundingClientRect();
  // Two lines means the rendered height clears roughly 1.6 line boxes.
  var lines = Math.round(r.height / (parseFloat(getComputedStyle(script).fontSize) * 0.9));
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(s.getBoundingClientRect().height),
      scriptW: Math.round(r.width),
      avail: Math.round(s.clientWidth - 48),
      lines: lines,
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(HEADING_MODES);

const card = (key) => {
  const m = HEADING_MODES[key];
  return `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h2 class="font-display text-base font-bold">${esc(m.label)}</h2>
    </div>
    <p class="mt-1 font-body text-xs font-bold tabular-nums text-ink-soft" data-h="${esc(key)}">measuring…</p>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(m.note)}</p>
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/sth-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[640px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Struggles heading — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">"Common struggles" — heading treatments</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">List option A is locked and identical in all five, so the only thing changing is
     the heading above it. Two requirements are in play: the script must sit on one line, and the sans line under it may
     want centring.</p>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>Fixed vs. unwrappable:</strong>
     A and B keep the fixed 3.25rem, which fits one line at 390px by arithmetic rather than by rule — a 360px phone leaves
     almost nothing spare. C, D and E set the script to scale with the viewport with wrapping switched off, so it cannot
     break onto two lines at any width, and it renders larger on most phones because it uses whatever room there is. Each
     frame reports its own script width against the space available, so you can see the margin.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">The six items stay left-aligned everywhere. Centring the heading is one
     thing; centring six sentences would leave both edges ragged and cost real legibility.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">All five are <strong>mobile-only</strong> — the desktop spread keeps its
     4.5rem left-aligned heading in every case.</p>

  <div class="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${KEYS.map(card).join('')}
  </div>
</div>

<script>
addEventListener('message', function (e) {
  var d = e.data;
  if (!d || !d.mode || typeof d.h !== 'number') return;
  var el = document.querySelector('[data-h="' + d.mode + '"]');
  if (!el) return;
  var spare = d.avail - d.scriptW;
  el.textContent = 'section ' + d.h + 'px · script ' + d.scriptW + 'px in ' + d.avail + 'px (' +
    (spare >= 0 ? spare + 'px spare' : Math.abs(spare) + 'px over') + ') · ' + d.lines + ' line' + (d.lines === 1 ? '' : 's');
  el.className = 'mt-1 font-body text-xs font-bold tabular-nums ' + (d.lines > 1 ? 'text-magenta-text' : 'text-ink-soft');
});
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'struggles-heading.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `sth-${key}.html`), frame(key));
console.log(`built struggles-heading.html + ${KEYS.length} frames`);

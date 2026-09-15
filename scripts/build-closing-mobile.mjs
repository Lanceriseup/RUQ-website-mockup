// Builds /closing-mobile.html — the closing CTA ticket, four ways for mobile.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderClosing, CLOSING_MODES } from '../src/partials/closing-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(CLOSING_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
${renderClosing(site, content, key)}
<div class="bg-ink px-6 py-6"><p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-white/50">Footer starts here</p></div>
<script>
addEventListener('load', function () {
  var s = document.getElementById('closing');
  var btn = s.querySelector('.cta-btn');
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(s.getBoundingClientRect().height),
      btnW: Math.round(btn.getBoundingClientRect().width),
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(CLOSING_MODES);

const card = (key) => {
  const m = CLOSING_MODES[key];
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
      <iframe src="/clm-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[560px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Closing CTA — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Closing CTA — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">On desktop this is one row: copy, the Register button, then a dated stub behind a
     vertical dashed rule — a ticket with a tear-off. Below md it becomes a column and the rule turns horizontal, which is
     where the height goes: three blocks with 32px between them, a stub adding its own 24px under the rule, and a button
     sitting at its natural width in a column it now owns.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Each frame reports the section height and the button's rendered width.
     All four are mobile-only; the desktop row is untouched, and the copy is verbatim in every one.</p>

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
    var b = ' · button ' + d.btnW + 'px wide';
    if (mode === 'current') { el.textContent = d.h + 'px (baseline)' + b; return; }
    if (base == null) { pending[mode] = d; el.textContent = d.h + 'px' + b; return; }
    var cut = Math.round((1 - d.h / base) * 100);
    el.textContent = d.h + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : '') + b;
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

fs.writeFileSync(path.join(dist, 'closing-mobile.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `clm-${key}.html`), frame(key));
console.log(`built closing-mobile.html + ${KEYS.length} frames`);

// Builds /struggles-compact.html — the "Common struggles" list, compacted five
// ways for mobile.
//
// Frames are the real section on its real ground at 390px, and they are tall
// enough to show all six items plus where the next section starts, because the
// whole question is how much of the phone this list occupies.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderStruggles, STRUGGLES_MODES, STRUGGLES_JS } from '../src/partials/struggles-compact.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(STRUGGLES_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
${renderStruggles(content, key)}

<!-- The section that follows, so the saving reads as the next thing arriving
     sooner rather than as white space appearing. -->
<div class="border-t border-ink/10 bg-white px-6 py-8">
  <p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-cyan-text">Next section starts here</p>
</div>

<script>${STRUGGLES_JS}</script>
<script>
addEventListener('load', function () {
  var s = document.getElementById('struggles');
  try { parent.postMessage({ mode: ${JSON.stringify(key)}, h: Math.round(s.getBoundingClientRect().height) }, '*'); } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(STRUGGLES_MODES);

const card = (key) => {
  const m = STRUGGLES_MODES[key];
  const isBase = key === 'current';
  return `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${isBase ? 'bg-ink-soft' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h2 class="font-display text-base font-bold">${esc(m.label)}</h2>
      <span class="ml-auto font-body text-xs font-bold tabular-nums text-ink-soft" data-h="${esc(key)}">measuring…</span>
    </div>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(m.note)}</p>
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/stc-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[720px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Compact struggles — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Compact "Common struggles" — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">On desktop this is one half of a magazine spread: heading and six problems on the
     left, a 4:5 photograph on the right. Below lg the photograph is hidden — but the list keeps the spacing that was
     balancing it, so a phone gets roughly <strong>760px</strong> of heading and six short sentences.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Most of that is the 32px gaps between items, not the sentences. They are
     single lines of speech, not paragraphs, so they were never holding paragraphs apart.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Every option is <strong>mobile-only</strong>, paired with lg: values that
     restore the shipped spread. The client's copy is verbatim in all five — nothing is shortened or reworded.</p>

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
    if (!d || typeof d.h !== 'number' || !d.mode) return;
    if (d.mode === 'current') { base = d.h; for (var k in pending) paint(k, pending[k]); pending = {}; }
    paint(d.mode, d.h);
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'struggles-compact.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `stc-${key}.html`), frame(key));
console.log(`built struggles-compact.html + ${KEYS.length} frames`);

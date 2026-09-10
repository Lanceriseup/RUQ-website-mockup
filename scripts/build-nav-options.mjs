// Builds /nav-options.html — the four header designs on one page for comparison.
// Each is rendered live in an iframe at its real width, so what you see is the
// actual component, not a picture of it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VARIANTS, LABELS } from '../src/partials/nav-variants.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const NOTES = {
  A: ['Symmetrical and brand-forward — the logo is the hero.',
      'Closest to the current live site\'s centered-logo layout.',
      'Eats horizontal room: 7 links is the practical ceiling.'],
  B: ['The conventional marketing header. Most scannable.',
      'Cyan CTA carries dark text at 7.10:1 — the safest loud button in this palette.',
      'Handles all 7 links without strain. Lowest-risk choice.'],
  C: ['Loudest. The nav itself becomes the brand block.',
      'Closest in spirit to the pink banner you just removed.',
      'White-on-magenta is 4.17:1, so links must stay semibold to qualify as large text.'],
  D: ['Logo, CTA, one Menu button. Everything else in a full-screen overlay.',
      'The honest answer to 7 links: stop pretending they fit in a bar.',
      'Gives the hero the most room. Costs one click to reach any page.'],
};

const frame = (key) => {
  const html = VARIANTS[key](site, '/index.html');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0;background:#fff}</style></head>
<body>${html}<div style="height:220px"></div><script src="/app.js" defer></script></body></html>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nav options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Nav options</h1>
  <p class="mt-2 max-w-2xl text-ink-soft">Four header treatments in the new palette. Each frame below is the real
     component — resize the window or use the width buttons to check mobile. Pick one and I'll wire it in and delete the rest.</p>

  <div class="mt-4 flex flex-wrap gap-4 rounded-xl bg-magenta-tint p-4 text-sm">
    <span class="font-semibold">Palette:</span>
    <span class="flex items-center gap-2"><span class="inline-block h-4 w-4 rounded" style="background:#e8208f"></span>#e8208f</span>
    <span class="flex items-center gap-2"><span class="inline-block h-4 w-4 rounded" style="background:#00b9c6"></span>#00b9c6</span>
    <span class="flex items-center gap-2"><span class="inline-block h-4 w-4 rounded border border-ink/20" style="background:#fff"></span>#ffffff</span>
  </div>

  ${Object.keys(VARIANTS).map(k => `
  <section class="mt-12">
    <div class="flex flex-wrap items-baseline justify-between gap-3">
      <h2 class="font-display text-xl font-bold">
        <span class="mr-2 inline-grid h-8 w-8 place-items-center rounded-full bg-magenta text-sm text-white">${k}</span>
        ${esc(LABELS[k])}
      </h2>
      <div class="flex gap-2 text-xs">
        ${[['Desktop', '100%'], ['Tablet', '768px'], ['Mobile', '390px']].map(([lbl, w]) =>
          `<button type="button" data-w="${w}" data-frame="f${k}"
             class="wbtn min-h-11 rounded-full border border-ink/20 px-4 font-semibold hover:border-magenta hover:text-magenta-text">${lbl}</button>`).join('')}
      </div>
    </div>
    <ul class="mt-3 space-y-1 text-sm text-ink-soft">
      ${NOTES[k].map(n => `<li>• ${esc(n)}</li>`).join('')}
    </ul>
    <div class="mt-4 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe id="f${k}" src="/nav-${k}.html" title="Nav option ${k}" loading="lazy"
              class="block h-[300px] w-full border-0 bg-white"></iframe>
    </div>
  </section>`).join('')}
</div>
<script>
document.querySelectorAll('.wbtn').forEach(function (b) {
  b.addEventListener('click', function () {
    var f = document.getElementById(b.dataset.frame);
    f.style.width = b.dataset.w;
    f.style.margin = b.dataset.w === '100%' ? '0' : '0 auto';
  });
});
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'nav-options.html'), page);
for (const k of Object.keys(VARIANTS)) {
  fs.writeFileSync(path.join(dist, `nav-${k}.html`), frame(k));
}
console.log('built nav-options.html + ' + Object.keys(VARIANTS).length + ' frames');

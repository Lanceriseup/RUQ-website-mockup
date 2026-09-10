// Builds /hero-styles.html — six distinct hero directions, each full-width on
// the real video so proportions and contrast read true.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STYLES, renderHeroStyle } from '../src/partials/hero-styles.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Lato:wght@300;400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Italiana&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-ink">
<section class="relative flex min-h-[560px] items-center overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-40" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/40 to-ink/80"></div>
  <div class="relative mx-auto w-full max-w-content px-6 py-16">
    ${renderHeroStyle(site, content, key)}
  </div>
</section>
<script src="/hero-rotate.js" defer></script>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hero styles — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Hero styles</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Six different <em>directions</em>, not variations on one — different type systems,
     different techniques. Four drop the script entirely. Watch each for a few seconds; the word still rotates in all of them.</p>
  <div class="mt-4 rounded-xl bg-ink/5 p-4 text-sm">
    The script route has been tried twice now. Half of these deliberately do not use one — a brush face is only one way to
    signal premium, and on a page that already has strong photography it is not obviously the best one.
  </div>

  ${Object.entries(STYLES).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/style-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <dl class="mt-2 flex flex-wrap gap-x-8 gap-y-1 text-xs text-ink-soft">
      <div><dt class="inline font-semibold text-magenta-text">Type:</dt> <dd class="inline">${esc(v.fonts)}</dd></div>
      <div><dt class="inline font-semibold text-magenta-text">Technique:</dt> <dd class="inline">${esc(v.tech)}</dd></div>
    </dl>
    <p class="mt-2 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/style-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[560px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'hero-styles.html'), page);
for (const k of Object.keys(STYLES)) fs.writeFileSync(path.join(dist, `style-${k}.html`), frame(k));
console.log(`built hero-styles.html + ${Object.keys(STYLES).length} frames`);

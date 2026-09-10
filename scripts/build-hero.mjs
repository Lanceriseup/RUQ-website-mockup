// Builds /hero-options.html — four hero treatments, each full-page with the
// real nav on top so proportions read true.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEROES, SCRIPTS, renderHero } from '../src/partials/hero-variants.mjs';
import { header, esc } from '../src/partials/layout.mjs';
import { capsule } from '../src/partials/capsule.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

fs.copyFileSync(path.join(ROOT, 'src/styles/hero-rotate.js'), path.join(dist, 'hero-rotate.js'));

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Great+Vibes&family=Allura&family=Parisienne&family=Dancing+Script:wght@600;700&display=swap';

const full = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${header(site, '/index.html', { overHero: true })}
${capsule(site, '/index.html')}
${renderHero(site, content, key)}
<section class="mx-auto max-w-content px-4 py-16">
  <p class="font-body text-ink-soft">Scroll region — the capsule appears here.</p>
  <div class="h-[400px]"></div>
</section>
<script src="/app.js" defer></script>
<script src="/hero-rotate.js" defer></script>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hero options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Hero options</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Each has the rotating headline, the VSL, the dates and the Register CTA — arranged
     differently, with a different script face and a different word-swap animation so you can pick the pieces separately.
     <strong>Watch the headline for a few seconds</strong> in each.</p>

  <div class="mt-4 grid gap-3 sm:grid-cols-2">
    <div class="rounded-xl bg-magenta-tint p-4 text-sm">
      <strong>The word never shifts the line.</strong> All three words share one grid cell, so the widest sets the width once.
      Without that the sentence jitters on every swap — the usual way this effect goes wrong.
    </div>
    <div class="rounded-xl bg-cyan-tint p-4 text-sm">
      <strong>Script faces are swappable.</strong> Each option shows a different one below; they are not tied to the layout.
      ${Object.values(SCRIPTS).map(s => `<span class="mr-3 whitespace-nowrap" style="font-family:${s.css};font-size:1.4em">${esc(s.label)}</span>`).join('')}
    </div>
  </div>

  ${Object.entries(HEROES).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <span class="rounded-full bg-ink/5 px-3 py-1 text-xs">script: <span style="font-family:${SCRIPTS[v.script].css};font-size:1.3em">${esc(SCRIPTS[v.script].label)}</span></span>
      <span class="rounded-full bg-ink/5 px-3 py-1 text-xs">swap: ${esc(v.swap)}</span>
      <a href="/hero-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open full ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/hero-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[780px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'hero-options.html'), page);
for (const k of Object.keys(HEROES)) fs.writeFileSync(path.join(dist, `hero-${k}.html`), full(k));
console.log(`built hero-options.html + ${Object.keys(HEROES).length} frames`);

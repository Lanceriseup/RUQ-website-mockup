// Builds /cta-bg-options.html — six CTA backgrounds made from CSS and SVG,
// no photography.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CTA_BGS, renderCtaBg } from '../src/partials/cta-bg-variants.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
<section class="px-6 py-10" style="background:linear-gradient(180deg,#FDF6F1,#ffffff)">
  <div class="mx-auto max-w-content"><p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft">end of the spread above</p></div>
</section>
${renderCtaBg(site, content, key)}
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CTA backgrounds — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">CTA backgrounds — no photography</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Why a generated ground beats the photo here.</strong> The photo version had a face and a hand in it, and both pull the
    eye away from the two fields that are the entire point of the section. A made background cannot compete with the form.
  </div>

  <div class="mt-3 rounded-xl bg-cyan-tint p-5 text-sm">
    <strong>On the moving ones.</strong> Everything animates on transform and opacity only, and all of it stops under
    prefers-reduced-motion. Blur is set once and never animated — animating a blur radius re-rasterises the layer every frame and
    is the usual cause of a janky hero. <code class="rounded bg-white/60 px-1">mesh</code> and
    <code class="rounded bg-white/60 px-1">arcs</code> have no motion at all and are the cheapest to render.
  </div>

  ${Object.entries(CTA_BGS).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/ctabg-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/ctabg-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[700px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'cta-bg-options.html'), page);
for (const k of Object.keys(CTA_BGS)) fs.writeFileSync(path.join(dist, `ctabg-${k}.html`), frame(k));
console.log(`built cta-bg-options.html + ${Object.keys(CTA_BGS).length} frames`);

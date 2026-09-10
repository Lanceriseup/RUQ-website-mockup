// Builds /plate-options.html — four ways to align the struggles plate with its
// heading and make it bigger, keeping the magazine layout.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLATE_OPTS, renderPlateOpt } from '../src/partials/struggles-plate-options.mjs';
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
<section class="relative h-[120px] overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-50" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0" style="background:radial-gradient(78% 62% at 50% 46%,rgba(28,28,28,.45),rgba(28,28,28,.9) 100%)"></div>
</section>
<div class="relative z-10 -mt-16 overflow-hidden rounded-t-[2.5rem] shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)]
            before:absolute before:left-1/2 before:top-4 before:z-20 before:h-1.5 before:w-16 before:-translate-x-1/2 before:rounded-full before:bg-ink/15">
  ${renderPlateOpt(site, content, key)}
</div>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Struggles plate — alignment options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Struggles plate — alignment and size</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Why the last attempt made it worse.</strong> The heading is a full-width band <em>above</em> the grid, so the photo
    column can only ever start below it. I nudged the plate with a negative margin, which just dragged it over the heading.
    <span class="mt-2 block">All four options fix it structurally instead — by changing where the heading sits relative to the
    grid, so the plate can genuinely begin on the same line the heading does. Every one is also bigger: the column goes 5fr to 6fr.</span>
  </div>

  ${Object.entries(PLATE_OPTS).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/plateopt-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/plateopt-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[900px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'plate-options.html'), page);
for (const k of Object.keys(PLATE_OPTS)) fs.writeFileSync(path.join(dist, `plateopt-${k}.html`), frame(k));
console.log(`built plate-options.html + ${Object.keys(PLATE_OPTS).length} frames`);

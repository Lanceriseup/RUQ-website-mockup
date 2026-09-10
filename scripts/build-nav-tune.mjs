// Builds /nav-tune.html — three independent comparisons for design G:
// logo size, link grouping, and divider treatment. Each row is the real nav
// over the real video, so spacing reads true.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderNav, LOGOS, SPACINGS, DIVIDERS } from '../src/partials/nav-tune.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

// Short hero so many frames fit on one screen.
const strip = (opts) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-ink">
<section class="relative h-[300px] overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-50" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink/30"></div>
  ${renderNav(site, opts)}
</section>
</body></html>`;

const files = [];
const frame = (name, opts) => { files.push([name, strip(opts)]); return `/tune-${name}.html`; };

const row = (title, note, items) => `
<section class="mt-12">
  <h2 class="font-display text-xl font-bold">${esc(title)}</h2>
  <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(note)}</p>
  <div class="mt-5 space-y-6">
    ${items.map(it => `
    <div>
      <div class="flex flex-wrap items-baseline gap-3">
        <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(it.key)}</span>
        <span class="font-body text-sm font-semibold">${esc(it.label)}</span>
      </div>
      <div class="mt-2 overflow-hidden rounded-xl ring-1 ring-ink-line">
        <iframe src="${it.src}" title="${esc(it.label)}" loading="lazy" class="block h-[300px] w-full border-0"></iframe>
      </div>
    </div>`).join('')}
  </div>
</section>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nav tuning — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Nav tuning — design G</h1>
  <p class="mt-2 max-w-3xl text-ink-soft">Three axes, varied one at a time so each reads clearly. Everything else is held
     constant at the current shipped values. Pick one from each row — e.g. "plus30 + close + diamond" — and I'll fold it in.</p>

  ${row('1. Logo size', 'Link grouping held at "close" so the size difference is what you notice. +30% is what you asked for; the others bracket it.',
    Object.entries(LOGOS).map(([k, v]) => ({ key: k, label: v.label, src: frame('logo-' + k, { logo: k, spacing: 'close', divider: 'gradientCyan' }) })))}

  ${row('2. Link grouping', 'Logo held at +30%. This is how near the four links sit to the wordmark.',
    Object.entries(SPACINGS).map(([k, v]) => ({ key: k, label: v.label, src: frame('sp-' + k, { logo: 'plus30', spacing: k, divider: 'gradientCyan' }) })))}

  ${row('3. Divider', 'Logo +30%, grouping "close". Ten treatments for the rule under the nav.',
    Object.entries(DIVIDERS).map(([k, v]) => ({ key: k, label: v.label, src: frame('div-' + k, { logo: 'plus30', spacing: 'close', divider: k }) })))}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'nav-tune.html'), page);
for (const [name, html] of files) fs.writeFileSync(path.join(dist, `tune-${name}.html`), html);
console.log(`built nav-tune.html + ${files.length} frames`);

// Builds /about-who.html — six ways to lay out the "Who is it for?" section.
//
// Each frame renders the real about hero above it. The arch lifts over
// whatever precedes it with -mt-16, and two of the six deliberately overlap
// that boundary — neither can be judged without the hero underneath.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ABOUT_WHO_OPTIONS, renderAboutWho } from '../src/partials/about-who.mjs';
import { aboutHero } from '../src/partials/about-hero.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(ABOUT_WHO_OPTIONS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${header(site, '/about.html', { overHero: true })}
${aboutHero(site, content)}
${renderAboutWho(site, content, key)}
<section class="bg-white py-20"><div class="mx-auto max-w-content px-6">
  <p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft/50">↓ rest of the about page continues</p>
</div></section>
${footer(site)}
<script src="/app.js" defer></script>
<script src="/hero-rotate.js" defer></script>
<script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
</body></html>`;

for (const k of Object.keys(ABOUT_WHO_OPTIONS)) {
  fs.writeFileSync(path.join(dist, `aw-${k}.html`), wrap(k));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About — Who is it for — options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">About — “Who is it for?”</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>All six share the homepage's shell.</strong> Arched top at rounded-t-[2.5rem], lifted over the hero with
    -mt-16, the drag-handle pill on the top edge, and the spread's warm ground with its two blurred brand orbs — the same
    values, not lookalikes. What differs is where the video sits against that arch and how far it breaks out of it.
    <br><br>
    <strong>Each frame includes the real hero above.</strong> The arch overlaps whatever precedes it, and two options
    deliberately overlap that boundary, so neither can be judged on its own.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>The copy here was wrong in our data and is now corrected from source.</strong> content.json ended the paragraph
    “…within her family and beyond”; the live page says “…within her family and community”. The heading was
    “About Rise Up Queens”; the live page says “Who is it for?”.
    <br><br>
    <strong>“Rise up Queens” with a lowercase u</strong> is how that paragraph reads on their site, against “Rise Up Queens”
    everywhere else. Preserved verbatim rather than tidied, but it looks like a typo worth raising with them.
  </div>

  ${Object.entries(ABOUT_WHO_OPTIONS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'split' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/aw-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/aw-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[1100px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'about-who.html'), page);
console.log(`built about-who.html + ${Object.keys(ABOUT_WHO_OPTIONS).length} frames`);

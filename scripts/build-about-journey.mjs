// Builds /about-journey.html — six light treatments for the journey section.
//
// Each frame renders the real about hero above it. The arch lifts over
// whatever precedes it with -mt-16, so the join is part of what is being
// judged, and the hero is now dark — which is the whole reason these are
// light.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JOURNEY_OPTIONS, renderJourney } from '../src/partials/about-journey.mjs';
import { aboutHero } from '../src/partials/about-hero.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(JOURNEY_OPTIONS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${header(site, '/about.html', { overHero: true })}
${aboutHero(site, content)}
${renderJourney(site, content, key)}
<section class="bg-white py-20"><div class="mx-auto max-w-content px-6">
  <p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft/50">↓ rest of the about page continues</p>
</div></section>
${footer(site)}
<script src="/app.js" defer></script>
<script src="/hero-rotate.js" defer></script>
<script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
</body></html>`;

for (const k of Object.keys(JOURNEY_OPTIONS)) {
  fs.writeFileSync(path.join(dist, `aj-${k}.html`), wrap(k));
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
  <h1 class="font-display text-3xl font-bold">About — the journey section</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>All six are light.</strong> The live version is white type on black marble; inverting it is the point. Each
    keeps the homepage's arch shell — rounded-t-[2.5rem], -mt-16 over the hero, the drag-handle pill, and the spread's
    warm ground with its two brand orbs — so the page still reads as the same site.
    <br><br>
    <strong>Every frame shows the real hero above it</strong>, because the arch lifts over whatever precedes it and the
    hero is dark. The join is part of what is being judged.
    <br><br>
    <strong>Everything they have is here</strong> — heading, both lead paragraphs, all three cards, the in-sentence link
    on the third, and the closing line that follows the cards on the live page.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>The photographs are the real constraint.</strong> The live page runs them greyscale on black, where mono reads
    as deliberate. On a light ground mono reads as colour having gone missing instead — so five of these keep them in
    full colour. <span class="font-semibold">duotone</span> is the one that does treat them, in brand colour rather than
    grey, and clears to full colour under the pointer.
    <br><br>
    <strong>The third image was not in our asset sweep.</strong> 3-2.png is now in fetch-assets.mjs and downloaded, so a
    fresh clone gets all three.
    <br><br>
    <strong>"Who is it for?" is gone from the page.</strong> Its copy stays in content.json — about.lead is still the
    page's meta description — but nothing renders it now.
  </div>

  ${Object.entries(JOURNEY_OPTIONS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'split' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/aj-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/aj-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[1100px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'about-journey.html'), page);
console.log(`built about-journey.html + ${Object.keys(JOURNEY_OPTIONS).length} frames`);

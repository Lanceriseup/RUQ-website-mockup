// Builds /faith-edge.html — replacing the creed band's arch with a fade.
//
// Every frame renders the white CTA above and the real testimonial marquee
// below. The complaint was specifically about how the band meets the section
// under it, and that section has its own brand wash across the top — which is
// half of what looked wrong. Judging these without it would miss the point.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAITH_EDGE_OPTIONS, renderFaithEdge } from '../src/partials/faith-edge.mjs';
import { testimonialsSection } from '../src/partials/testimonials.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const videos = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

// Stand-in for the breakthrough CTA above: white, centred, ends on a button.
const ABOVE = `
<section class="bg-white pb-16 pt-10 text-center">
  <p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft/50">↑ white CTA section above</p>
  <div class="mx-auto mt-6 h-11 w-52 rounded-xl" style="background:#e8208f"></div>
</section>`;

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(FAITH_EDGE_OPTIONS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${ABOVE}
${renderFaithEdge(site, content, key)}
${testimonialsSection(site, content, videos)}
<script src="/app.js" defer></script>
</body></html>`;

for (const k of Object.keys(FAITH_EDGE_OPTIONS)) {
  fs.writeFileSync(path.join(dist, `fe-${k}.html`), wrap(k));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Creed band — edge options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Creed band — losing the arch</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Every frame shows the real testimonial section below</strong>, because the problem is the join — and that section
    carries its own brand wash across the top, which is half of what made the arch look wrong: a hard dark curve, then a
    gap, then a separate-looking pink stripe.
    <br><br>
    <strong>Both edges get the same treatment in all five.</strong> The band's top meets the white CTA and its bottom meets
    the white testimonial section; a fade at one end and an arch at the other would read as a mistake. The arch is first
    for comparison.
  </div>

  ${Object.entries(FAITH_EDGE_OPTIONS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'arch' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/fe-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/fe-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[1500px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'faith-edge.html'), page);
console.log(`built faith-edge.html + ${Object.keys(FAITH_EDGE_OPTIONS).length} frames`);

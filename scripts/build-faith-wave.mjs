// Builds /faith-wave.html — wave joins for the creed band.
//
// Same framing as build-faith-edge.mjs: every frame renders the white CTA
// above and the real testimonial marquee below, because the thing being
// judged is the join, and the section underneath carries its own brand wash
// that any edge treatment has to sit against.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAITH_WAVE_OPTIONS, renderFaithWave } from '../src/partials/faith-wave.mjs';
import { testimonialsSection } from '../src/partials/testimonials.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const videos = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const ABOVE = `
<section class="bg-white pb-16 pt-10 text-center">
  <p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft/50">↑ white CTA section above</p>
  <div class="mx-auto mt-6 h-11 w-52 rounded-xl" style="background:#e8208f"></div>
</section>`;

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(FAITH_WAVE_OPTIONS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${ABOVE}
${renderFaithWave(site, content, key)}
${testimonialsSection(site, content, videos)}
<script src="/app.js" defer></script>
</body></html>`;

for (const k of Object.keys(FAITH_WAVE_OPTIONS)) {
  fs.writeFileSync(path.join(dist, `fw-${k}.html`), wrap(k));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Creed band — wave joins — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Creed band — wave joins</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Every frame shows the real testimonial section below</strong>, because the join is the thing being judged and
    that section carries its own brand wash across the top.
    <br><br>
    <strong>The tinted back band takes cyan at the top and magenta at the bottom</strong>, matching what the sections either
    side already carry — the CTA above ends on a cyan rule, the testimonial section below opens on a magenta wash. One
    neutral tint at both ends would read as a third colour arriving from nowhere.
    <br><br>
    Waves and fades combine: <span class="font-semibold">wave + fade</span> below is one of each. If you want a different
    pairing than the one shown, say which.
  </div>

  ${Object.entries(FAITH_WAVE_OPTIONS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/fw-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/fw-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[1500px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'faith-wave.html'), page);
console.log(`built faith-wave.html + ${Object.keys(FAITH_WAVE_OPTIONS).length} frames`);

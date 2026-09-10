// Builds /cta-compact.html — the compact, action-first set, with the marquee
// now shipped on the homepage shown alongside for height comparison.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPACTS, renderCompact } from '../src/partials/cta-compact.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

// Short frames — the whole point is that these are small.
const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-ink">
<section class="relative flex min-h-[240px] items-center overflow-hidden bg-ink px-4 py-10">
  <video class="absolute inset-0 h-full w-full object-cover opacity-25" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0 bg-gradient-to-b from-ink/86 to-ink/90"></div>
  <div class="relative w-full">${renderCompact(site, content, key)}</div>
</section>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Compact CTA options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Compact CTA options</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Register first, dates underneath as supporting detail — all six well under half the
     height of the card treatments. Marquee is already live on the homepage; these are the alternatives.</p>

  <div class="mt-4 rounded-xl bg-cyan-tint p-4 text-sm">
    <strong>What the order change costs.</strong> With the button on top, the dates read as a caption to the action rather than
    the reason for it. That is the right trade here — by this point the video has done the selling — but it does mean the
    LIMITED SPOTS badge lands <em>after</em> the click decision in most of these. <code class="rounded bg-white/60 px-1">badged</code>
    is the one that puts it before.
  </div>

  ${Object.entries(COMPACTS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs tabular-nums">${esc(v.height)}</span>
      <a href="/compact-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/compact-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[240px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'cta-compact.html'), page);
for (const k of Object.keys(COMPACTS)) fs.writeFileSync(path.join(dist, `compact-${k}.html`), frame(k));
console.log(`built cta-compact.html + ${Object.keys(COMPACTS).length} frames`);

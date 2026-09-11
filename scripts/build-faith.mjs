// Builds /faith-options.html — five treatments for the mission + Statement of
// Faith section, all on a photographic ground.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAITH, renderFaith } from '../src/partials/faith-variants.mjs';
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
<section class="bg-white px-6 py-10">
  <div class="mx-auto max-w-content text-center"><p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft">end of the CTA above</p></div>
</section>
${renderFaith(site, content, key)}
<section class="bg-ink px-6 py-8">
  <div class="mx-auto max-w-content"><p class="font-body text-[11px] uppercase tracking-[0.3em] text-white/30">footer starts here</p></div>
</section>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Statement of Faith — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Mission &amp; Statement of Faith</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Two problems with the current version.</strong> The photo is desaturated to near-grey, so it adds noise rather than
    meaning. And a seven-point doctrinal statement — the most load-bearing content on the page for a Christian women's movement —
    is the hardest thing on it to reach, hidden behind a collapsed accordion and then a scroll box.
    <span class="mt-2 block">All five keep a photographic ground as asked, but treat the photo as an image rather than a texture.</span>
  </div>

  <div class="mt-3 rounded-xl bg-cyan-tint p-5 text-sm">
    <strong>The disclosures use a native <code class="rounded bg-white/60 px-1">&lt;details&gt;</code>.</strong> It works with no
    JavaScript, is keyboard-operable and screen-reader-announced for free, and cannot end up stuck half-open.
  </div>

  ${Object.entries(FAITH).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/faith-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/faith-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[820px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'faith-options.html'), page);
for (const k of Object.keys(FAITH)) fs.writeFileSync(path.join(dist, `faith-${k}.html`), frame(k));
console.log(`built faith-options.html + ${Object.keys(FAITH).length} frames`);

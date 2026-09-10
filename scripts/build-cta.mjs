// Builds /cta-options.html — six dates + Register treatments, each on the
// real hero background at the position they'd actually occupy.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CTAS, renderCta } from '../src/partials/cta-variants.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

fs.copyFileSync(path.join(ROOT, 'src/styles/countdown.js'), path.join(dist, 'countdown.js'));

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-ink">
<section class="relative flex min-h-[420px] items-center overflow-hidden bg-ink px-4 py-14">
  <video class="absolute inset-0 h-full w-full object-cover opacity-25" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0 bg-gradient-to-b from-ink/86 via-ink/72 to-ink/90"></div>
  <div class="relative w-full text-center">${renderCta(site, content, key)}</div>
</section>
<script src="/countdown.js" defer></script>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dates &amp; CTA options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Dates &amp; Register options</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Six treatments for the block under the video, each on the real hero background.</p>

  <div class="mt-4 rounded-xl bg-magenta-tint p-4 text-sm">
    <strong>All six use two fields the current version throws away.</strong> <code class="rounded bg-white/60 px-1">site.json</code>
    already carries <em>Dallas, TX</em> and a <em>LIMITED SPOTS</em> note on the October event, and neither appears on the page
    today. Scarcity and place are the two things that actually move an event booking, so every option below shows them.
  </div>

  ${Object.entries(CTAS).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/cta-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/cta-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[420px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'cta-options.html'), page);
for (const k of Object.keys(CTAS)) fs.writeFileSync(path.join(dist, `cta-${k}.html`), frame(k));
console.log(`built cta-options.html + ${Object.keys(CTAS).length} frames`);

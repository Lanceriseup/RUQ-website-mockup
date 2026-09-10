// Builds /nav-visibility.html — eight legibility treatments for G's hero links.
// Each frame seeks the video to a BRIGHT moment, because that is where the
// current treatment fails; judging these on a dark frame proves nothing.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VISIBILITY, renderNavVis } from '../src/partials/nav-visibility.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const strip = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-ink">
<section class="relative h-[340px] overflow-hidden bg-ink">
  <video id="v" class="absolute inset-0 h-full w-full object-cover" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  ${renderNavVis(site, key)}
</section>
<script>
// No opacity dimming here on purpose: this is the worst case, full-brightness
// footage. If a treatment holds up on this, it holds up anywhere.
var v = document.getElementById('v');
v.addEventListener('loadedmetadata', function () { v.currentTime = 6; });
</script>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nav visibility — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Making the nav links more visible</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Logo is at +60% and links are evenly distributed, as chosen. These frames run the
     video at <strong>full brightness with no dimming overlay</strong> — the worst case. The current treatment is the first one;
     compare how it holds up against the rest.</p>
  <div class="mt-4 rounded-xl bg-cyan-tint p-4 text-sm">
    <strong>Type fixes vs ground fixes.</strong> Making the glyphs bolder or bigger helps, but still depends on what the video
    is doing behind them. A scrim or shadow changes the <em>ground</em>, so legibility stops being luck. The strongest options combine both.
  </div>

  ${Object.entries(VISIBILITY).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/vis-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[340px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'nav-visibility.html'), page);
for (const k of Object.keys(VISIBILITY)) fs.writeFileSync(path.join(dist, `vis-${k}.html`), strip(k));
console.log(`built nav-visibility.html + ${Object.keys(VISIBILITY).length} frames`);

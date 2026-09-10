// Builds /vsl-options.html — six VSL frames, all sharing the autoplay-muted /
// click-to-unmute mechanic, each on the real hero background.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VSLS, renderVsl } from '../src/partials/vsl-variants.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

fs.copyFileSync(path.join(ROOT, 'src/styles/vsl.js'), path.join(dist, 'vsl.js'));

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0;overflow-x:hidden}</style>
<script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
</head>
<body class="bg-ink">
<section class="relative flex min-h-[520px] items-center overflow-hidden bg-ink px-4 py-14">
  <video class="absolute inset-0 h-full w-full object-cover opacity-25" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0 ${key === 'spotlight' ? 'bg-ink/90' : 'bg-ink/70'}"></div>
  <div class="relative w-full" data-vsl-id="${esc(content.home.vsl.wistiaId)}">
    ${renderVsl(site, content, key)}
  </div>
</section>
<script src="/vsl.js" defer></script>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>VSL options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">VSL options</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">All six play <strong>immediately, muted and looping</strong>. Click the video or the
     sound badge and it unmutes and restarts from the top. Give each frame a second to load Wistia.</p>

  <div class="mt-4 rounded-xl bg-cyan-tint p-4 text-sm">
    <strong>Why muted first.</strong> Every browser blocks autoplay with sound — there is no way around it, and asking would
    get the whole video blocked instead. So it runs as a silent loop and the click is what turns sound on. Unmuting goes
    through Wistia's API rather than reloading the player, so it does not stutter, and Wistia still records the view.
  </div>

  ${Object.entries(VSLS).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/vsl-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/vsl-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[520px] w-full border-0"
              allow="autoplay; fullscreen"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'vsl-options.html'), page);
for (const k of Object.keys(VSLS)) fs.writeFileSync(path.join(dist, `vsl-${k}.html`), frame(k));
console.log(`built vsl-options.html + ${Object.keys(VSLS).length} frames`);

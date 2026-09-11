// Builds /closing-motion.html — motion options for the closing CTA.
//
// Each frame renders the shipped layout and wording, so the only variable is
// the motion. The frames are lazy iframes, which is what makes the arrival
// options judgeable at all: each one only starts when you scroll it into view,
// exactly as it will on the page.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLOSING_MOTION, needsObserver } from '../src/partials/closing-motion.mjs';
import { renderClosingWide } from '../src/partials/closing-wide.mjs';
import { LAYOUT, WORDING } from '../src/partials/closing.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

// Enough white above to push the panel below the fold inside its own iframe,
// so an arrival option actually has to be scrolled to.
const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(CLOSING_MOTION[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
<div class="flex h-[46vh] items-end justify-center bg-white pb-6">
  <p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft/40">scroll down ↓</p>
</div>
${renderClosingWide(site, content, LAYOUT, WORDING, key)}
<div class="h-[30vh] bg-white"></div>
<script src="/closing-motion.js" defer></script>
</body></html>`;

for (const k of Object.keys(CLOSING_MOTION)) {
  fs.writeFileSync(path.join(dist, `clm-${k}.html`), wrap(k));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Closing CTA — motion — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Closing CTA — motion options</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Already applied:</strong> the panel is 15% bigger (type, padding, button and radius all stepped up together),
    and the marquee's white edge wash above is toned well down.
    <br><br>
    <strong>Two kinds of motion here, and the difference matters more than the look.</strong>
    <span class="font-semibold">Arrival</span> fires once when the panel scrolls into view and then stops — it costs nothing
    afterwards and cannot turn into wallpaper. <span class="font-semibold">Ambient</span> runs forever: it keeps the panel
    alive in peripheral vision, but this is the last thing on the page and a loop down there competes with the button
    rather than pointing at it.
    <br><br>
    Each frame is scrolled from the top so the arrival options actually have to be reached — scroll inside a frame to
    replay one. Every option is transform and opacity only, and every one is switched off wholesale under
    <span class="font-semibold">prefers-reduced-motion</span>: the panel has to be complete and legible with no motion at
    all, because for some visitors that is what ships.
  </div>

  ${Object.entries(CLOSING_MOTION).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'none' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <span class="rounded-full ${v.kind === 'ambient' ? 'bg-amber-100 border border-amber-400' : 'bg-ink/5'} px-3 py-1 font-body text-xs font-semibold">${esc(v.kind)}</span>
      ${needsObserver(k) ? '<span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs">needs closing-motion.js</span>' : ''}
      <a href="/clm-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/clm-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[560px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'closing-motion.html'), page);
console.log(`built closing-motion.html + ${Object.keys(CLOSING_MOTION).length} frames`);

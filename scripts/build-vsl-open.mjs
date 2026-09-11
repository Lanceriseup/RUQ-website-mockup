// Builds /vsl-open.html — six ways the about hero's video can start.
//
// These only exist once the play button is pressed, so the gallery links out
// as well as embedding. Reloading a frame resets it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VSL_OPEN, UNFOLD_FEEL } from '../src/partials/vsl-open.mjs';
import { aboutHero } from '../src/partials/about-hero.mjs';
import { header, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (key, feel) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(VSL_OPEN[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${header(site, '/about.html', { overHero: true })}
${aboutHero(site, content, key, feel)}
<script src="/app.js" defer></script>
<script src="/hero-rotate.js" defer></script>
</body></html>`;

for (const k of Object.keys(VSL_OPEN)) {
  fs.writeFileSync(path.join(dist, `vo-${k}.html`), wrap(k, 'gentle'));
}
// Unfold is chosen; these are its timings, all on the same effect.
for (const f of Object.keys(UNFOLD_FEEL)) {
  fs.writeFileSync(path.join(dist, `vf-${f}.html`), wrap('unfold', f));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About hero video — opening effects — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">About hero — how the video starts</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Press play inside a frame to see one.</strong> Nothing happens until the video starts, and reloading the frame
    resets it. <span class="font-semibold">Open ↗</span> gives a full window, which matters for
    <span class="font-semibold">widen</span> and <span class="font-semibold">dim</span>.
    <br><br>
    <strong>There is something real to open into.</strong> The frame is cropped to 2.39:1 over a 16:9 source, so 25.6% of
    the picture is outside it. That is what <span class="font-semibold">unfold</span> gives back, and it is the only
    option whose end state is a different shape from its start.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>The frame opens by its padding, not its aspect-ratio.</strong> Percentage padding animates in every browser;
    aspect-ratio only interpolates in Chrome 117+, Safari 17.4+ and Firefox 126+, so for a lot of people it would snap
    rather than open. 41.84% is 1/2.39 and 56.25% is 9/16.
    <br><br>
    <strong>The poster now cross-fades onto the player rather than being swapped out.</strong> Replacing it outright
    removed the picture in the same frame the iframe appeared, so an empty player showed through while it loaded and the
    frame was still opening. That was the jump — not the easing. The player is inserted underneath and the poster fades
    off the top of it over 0.8s.
    <br><br>
    <strong>All of it is off under prefers-reduced-motion</strong> — the stage jumps straight to its playing state. The
    point is to see the video, not the entrance.
  </div>

  <h2 class="mt-10 font-display text-2xl font-bold">How fast unfold opens</h2>
  <p class="mt-1 max-w-3xl text-sm text-ink-soft">All the same effect — only the duration and the easing curve change.
     <span class="font-semibold">gentle</span> is what ships.</p>
  ${Object.entries(UNFOLD_FEEL).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'gentle' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/vf-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/vf-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[840px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}

  <h2 class="mt-16 font-display text-2xl font-bold">The other effects</h2>
  <p class="mt-1 max-w-3xl text-sm text-ink-soft">All shown at the <span class="font-semibold">gentle</span> timing.</p>
  ${Object.entries(VSL_OPEN).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'none' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/vo-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/vo-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[840px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'vsl-open.html'), page);
console.log(`built vsl-open.html + ${Object.keys(VSL_OPEN).length + Object.keys(UNFOLD_FEEL).length} frames`);

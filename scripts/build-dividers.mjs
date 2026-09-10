// Builds /divider-options.html — nine hero-to-section transitions, each shown
// with real content either side so the seam is judged in context.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIVIDERS, renderDivider, nextSectionClass } from '../src/partials/dividers.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';
const [a, b] = site.nextEvent.upcoming;

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">

<section class="relative overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-50" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0" style="background:radial-gradient(78% 62% at 50% 46%,rgba(28,28,28,.45),rgba(28,28,28,.9) 100%)"></div>
  <div class="absolute inset-0" style="background:linear-gradient(to bottom,rgba(28,28,28,.68) 0%,rgba(28,28,28,0) 34%,rgba(28,28,28,0) 62%,rgba(28,28,28,.58) 100%)"></div>

  <div class="relative mx-auto max-w-4xl px-6 pb-32 pt-16 text-center">
    <p class="font-display text-sm font-bold uppercase tracking-[0.2em] text-white sm:text-xl">${esc(content.home.hero.headingBefore)}</p>
    <p class="sheen mt-2 font-display font-extrabold uppercase" style="font-size:clamp(2rem,6vw,3.5rem);line-height:1">passionate</p>
    <p class="mt-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-white sm:text-xl">${esc(content.home.hero.headingAfter)}</p>
    <div class="mt-8 flex flex-col items-center gap-4">
      <span class="inline-flex items-center gap-3 rounded-full bg-magenta px-8 py-3.5 font-body text-xs font-bold uppercase tracking-[0.2em] text-white">Register Now</span>
      <div class="flex items-stretch gap-5 text-center">
        <div><p class="font-display text-sm font-bold text-white">${esc(a.dates)}</p></div>
        <div class="w-px bg-white/20"></div>
        <div><p class="font-display text-sm font-bold text-white/70">${esc(b.dates)}</p></div>
      </div>
    </div>
  </div>

  ${renderDivider(key)}
</section>

<section class="bg-white ${nextSectionClass(key)}">
  <div class="mx-auto max-w-content px-6 py-16">
    <h2 class="text-center font-display text-2xl font-bold text-ink">${esc(content.home.painPoints.heading)}</h2>
    <div class="mt-8 grid gap-4 sm:grid-cols-2">
      ${content.home.painPoints.items.slice(0, 4).map(t =>
        `<p class="rounded-xl bg-white p-5 font-body text-sm text-ink-soft ring-1 ring-ink-line">${esc(t)}</p>`).join('')}
    </div>
  </div>
</section>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Section dividers — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Hero to section transitions</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Nine treatments for the seam where the dark hero meets the white section, each with
     real content either side. <strong>Scroll each frame down</strong> to see the join.</p>

  <div class="mt-4 rounded-xl bg-cyan-tint p-4 text-sm">
    Shapes are SVG with <code class="rounded bg-white/60 px-1">preserveAspectRatio="none"</code> so they stretch to any width
    without the curve distorting, and all are <code class="rounded bg-white/60 px-1">aria-hidden</code> — a divider is decoration,
    not content, and should not be announced.
  </div>

  ${Object.entries(DIVIDERS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/divider-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/divider-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[560px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'divider-options.html'), page);
for (const k of Object.keys(DIVIDERS)) fs.writeFileSync(path.join(dist, `divider-${k}.html`), frame(k));
console.log(`built divider-options.html + ${Object.keys(DIVIDERS).length} frames`);

// Builds /bg-filters.html — eight background treatments, each carrying the
// real headline and date block so legibility can be judged, not just looks.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FILTERS, renderFilter } from '../src/partials/bg-filters.mjs';
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
<body class="bg-ink">
<section class="relative flex min-h-[420px] items-center overflow-hidden bg-ink">
  ${renderFilter(site, key)}
  <div class="relative mx-auto w-full max-w-4xl px-6 py-12 text-center">
    <p class="block font-display text-sm font-bold uppercase tracking-[0.2em] text-white sm:text-xl">${esc(content.home.hero.headingBefore)}</p>
    <p class="mt-2 font-display font-extrabold uppercase sheen" style="font-size:clamp(2rem,7vw,4rem);line-height:1">passionate</p>
    <p class="mt-3 block font-display text-sm font-bold uppercase leading-snug tracking-[0.2em] text-white sm:text-xl">${esc(content.home.hero.headingAfter)}</p>
    <div class="mt-8 flex flex-col items-center gap-4">
      <span class="inline-flex items-center gap-3 rounded-full bg-magenta px-8 py-3.5 font-body text-xs font-bold uppercase tracking-[0.2em] text-white">Register Now</span>
      <div class="flex items-stretch gap-5 text-center">
        <div><p class="font-display text-sm font-bold text-white">${esc(a.dates)}</p>
             <p class="mt-0.5 font-body text-[11px] uppercase tracking-[0.15em] text-white/50">${esc(a.location)}</p></div>
        <div class="w-px bg-white/20"></div>
        <div><p class="font-display text-sm font-bold text-white/70">${esc(b.dates)}</p>
             <p class="mt-0.5 font-body text-[11px] uppercase tracking-[0.15em] text-white/40">${esc(b.location)}</p></div>
      </div>
    </div>
  </div>
</section>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Background filters — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Hero background filters</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Eight different approaches — not eight dim levels. Each carries the real headline and
     date block, because the only thing that matters is whether the type still reads over moving footage.</p>

  <div class="mt-4 rounded-xl bg-magenta-tint p-4 text-sm">
    <strong>The trade in every one is the same.</strong> More of the footage surviving means less contrast for the text. The
    treatments that keep the most video — vignette, soft focus, crushed — do it by putting the darkness where the words are
    rather than everywhere, which is why they feel less flat than the current even wash.
  </div>

  ${Object.entries(FILTERS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs">GPU: ${esc(v.cost)}</span>
      <a href="/bg-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.trade)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/bg-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[420px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'bg-filters.html'), page);
for (const k of Object.keys(FILTERS)) fs.writeFileSync(path.join(dist, `bg-${k}.html`), frame(k));
console.log(`built bg-filters.html + ${Object.keys(FILTERS).length} frames`);

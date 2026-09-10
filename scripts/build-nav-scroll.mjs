// Builds /nav-scroll.html — six scroll behaviours, each in a scrollable frame
// with real page content below the hero so the transition can actually be felt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCROLL_MODES, renderScrollNav } from '../src/partials/nav-scroll.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

fs.copyFileSync(path.join(ROOT, 'src/styles/scroll-nav.js'), path.join(dist, 'scroll-nav.js'));

const demo = (mode) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
<section class="relative min-h-[520px] overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-60" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  ${renderScrollNav(site, mode)}
  <div class="relative mx-auto max-w-content px-4 pb-24 pt-64">
    <h1 class="max-w-2xl font-display text-4xl font-bold leading-[1.05] text-white">${esc(content.home.hero.heading)}</h1>
    <p class="mt-4 max-w-lg font-body text-white/80">${esc(content.home.hero.sub)}</p>
  </div>
</section>
<section class="mx-auto max-w-content px-4 py-16">
  <h2 class="font-display text-2xl font-bold">${esc(content.home.painPoints.heading)}</h2>
  <div class="mt-8 grid gap-6 sm:grid-cols-2">
    ${content.home.painPoints.items.concat(content.home.painPoints.items).map(t =>
      `<p class="rounded-xl bg-white p-6 font-body text-ink-soft ring-1 ring-ink-line">${esc(t)}</p>`).join('')}
  </div>
  <p class="mt-16 font-body text-ink-soft">${esc(content.home.founder.body)}</p>
  <div class="h-[600px]"></div>
</section>
<script src="/scroll-nav.js" defer></script>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nav scroll behaviour — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Nav scroll behaviour</h1>
  <p class="mt-3 max-w-3xl text-ink-soft"><strong>Scroll inside each frame</strong> to see the behaviour — they all look identical at rest.
     Each frame has real content below the hero.</p>
  <div class="mt-4 rounded-xl bg-cyan-tint p-4 text-sm">
     <strong>The constraint:</strong> G is 225px tall at rest — an 88px wordmark, the hairline, and a CTA on its own line.
     Pinning that unchanged would eat a third of a laptop screen, so each option is really an answer to
     <em>what does G collapse into</em>, not just whether it sticks.
  </div>

  ${Object.entries(SCROLL_MODES).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <span class="rounded-full bg-ink/5 px-3 py-1 text-xs">Keeps: ${esc(v.keeps)}</span>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/scroll-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[460px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'nav-scroll.html'), page);
for (const k of Object.keys(SCROLL_MODES)) fs.writeFileSync(path.join(dist, `scroll-${k}.html`), demo(k));
console.log(`built nav-scroll.html + ${Object.keys(SCROLL_MODES).length} frames`);

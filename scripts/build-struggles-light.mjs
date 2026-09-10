// Builds /struggles-light.html — the light set, each under a slice of the real
// hero so the dark-to-light transition is visible.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LIGHT, renderLight } from '../src/partials/struggles-light.mjs';
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
<body>
<section class="relative h-[200px] overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-50" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0" style="background:radial-gradient(78% 62% at 50% 46%,rgba(28,28,28,.45),rgba(28,28,28,.9) 100%)"></div>
  <div class="relative flex h-full items-end justify-center pb-6">
    <span class="font-body text-[11px] uppercase tracking-[0.3em] text-white/40">end of hero</span>
  </div>
</section>
${renderLight(site, content, key)}
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Struggles — light set — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Common struggles — light set</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-4 text-sm">
    <strong>The ground is warm off-white (#FBF7F4), not #fff.</strong> Pure white with black text next to a dark cinematic hero is
    what reads as unstyled — lightness itself is not the problem. Premium here comes from the warm tone, layered shadows,
    hairlines, generous space, asymmetry, and photography at a real size.
  </div>

  <div class="mt-3 rounded-xl bg-cyan-tint p-4 text-sm">
    <strong>On the photograph in the last set.</strong> It came from riseupqueens.com — I downloaded it when localising the media
    — but it is a <em>coach's headshot</em> used on the masterclasses page, not event coverage. Using an identifiable coach as a
    backdrop for "common struggles" implied she was one of the women described. These options use the genuine event photography
    instead: group shots and candid moments.
  </div>

  ${Object.entries(LIGHT).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs">photo: ${esc(v.photo)}</span>
      <a href="/light-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/light-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[720px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'struggles-light.html'), page);
for (const k of Object.keys(LIGHT)) fs.writeFileSync(path.join(dist, `light-${k}.html`), frame(k));
console.log(`built struggles-light.html + ${Object.keys(LIGHT).length} frames`);

// Builds /struggles-premium.html — the second, richer set, each shown directly
// beneath a slice of the real hero so the transition out of it is visible.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PREMIUM, renderPremium } from '../src/partials/struggles-premium.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

fs.copyFileSync(path.join(ROOT, 'src/styles/reveal.js'), path.join(dist, 'reveal.js'));

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

// A slice of the real hero above each one — the whole point is how the section
// follows on from it.
const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
<section class="relative h-[220px] overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-50" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0" style="background:radial-gradient(78% 62% at 50% 46%,rgba(28,28,28,.45),rgba(28,28,28,.9) 100%)"></div>
  <div class="relative flex h-full items-end justify-center pb-8">
    <span class="font-body text-[11px] uppercase tracking-[0.3em] text-white/40">end of hero</span>
  </div>
</section>
${renderPremium(site, content, key)}
<script src="/reveal.js" defer></script>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Struggles — premium set — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Common struggles — second set</h1>

  <div class="mt-4 rounded-xl bg-ink p-5 text-sm text-white/80">
    <strong class="text-white">Why the first set fell flat.</strong> They were six typographic treatments on flat white. The hero
    is dark, lit and cinematic — then the page fell off a cliff into black-on-white text, and no choice of font was going to fix
    that. Premium is not a nicer typeface; it is depth, material, real photography and pacing.
    <span class="mt-2 block">Four of these carry the dark through. Each frame below sits under a slice of the real hero, because
    how the section <em>follows on</em> matters more than how it looks alone.</span>
  </div>

  ${Object.entries(PREMIUM).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <span class="rounded-full px-3 py-1 font-body text-xs ${v.dark ? 'bg-ink text-white' : 'bg-ink/5 text-ink'}">${v.dark ? 'dark' : 'light'}</span>
      <a href="/premium-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/premium-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[760px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'struggles-premium.html'), page);
for (const k of Object.keys(PREMIUM)) fs.writeFileSync(path.join(dist, `premium-${k}.html`), frame(k));
console.log(`built struggles-premium.html + ${Object.keys(PREMIUM).length} frames`);

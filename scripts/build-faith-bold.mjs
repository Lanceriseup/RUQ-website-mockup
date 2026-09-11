// Builds /faith-bold.html — Statement of Faith, second attempt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAITH_BOLD, renderFaithBold } from '../src/partials/faith-bold.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
<section class="bg-white px-6 py-10">
  <div class="mx-auto max-w-content text-center"><p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft">end of the CTA above</p></div>
</section>
${renderFaithBold(site, content, key)}
<section class="bg-ink px-6 py-8">
  <div class="mx-auto max-w-content"><p class="font-body text-[11px] uppercase tracking-[0.3em] text-white/30">footer starts here</p></div>
</section>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Statement of Faith — second set — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Statement of Faith — second set</h1>

  <div class="mt-4 rounded-xl bg-ink p-5 text-sm text-white/80">
    <strong class="text-white">Why the first set was basic.</strong> Three of the five were the live layout rebuilt — photo
    ground, centred mission, disclosure underneath. Changing the tint of a background is not a redesign.
    <span class="mt-2 block">These start from a different question: <em>what does a creed look like?</em> It is one of the oldest
    pieces of designed text there is — carved, illuminated, set in glass, inscribed on walls. None of that looks like a web
    accordion, and all of it suits this content better than a scroll box does.</span>
  </div>

  ${Object.entries(FAITH_BOLD).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/faithb-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/faithb-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[860px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'faith-bold.html'), page);
for (const k of Object.keys(FAITH_BOLD)) fs.writeFileSync(path.join(dist, `faithb-${k}.html`), frame(k));
console.log(`built faith-bold.html + ${Object.keys(FAITH_BOLD).length} frames`);

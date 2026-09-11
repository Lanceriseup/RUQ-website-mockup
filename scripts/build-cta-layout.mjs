// Builds /cta-layout-options.html — six structurally different CTA layouts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CTA_LAYOUTS, renderCtaLayout } from '../src/partials/cta-layout-variants.mjs';
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
<body class="bg-white">
<section class="px-6 py-8" style="background:linear-gradient(180deg,#FDF6F1,#ffffff)">
  <div class="mx-auto max-w-content"><p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft">end of the spread above</p></div>
</section>
${renderCtaLayout(site, content, key)}
<section class="bg-ink px-6 py-8">
  <div class="mx-auto max-w-content"><p class="font-body text-[11px] uppercase tracking-[0.3em] text-white/30">footer starts here</p></div>
</section>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CTA layouts — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">CTA layouts — structurally different</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Aurora is now live on the homepage. These are alternatives that change the
     <strong>structure</strong>, not the ground: where the heading sits relative to the fields, whether there is a container at
     all, one row or two columns, and how much height the section takes.</p>

  <div class="mt-4 rounded-xl bg-cyan-tint p-5 text-sm">
    <strong>Each takes a different ground too</strong>, so features can be lifted independently — the layout of one with the
    background of another is a perfectly good answer. Section heights vary a lot here: the band is roughly a third of the
    billboard, which matters for how quickly the page reaches its footer.
  </div>

  ${Object.entries(CTA_LAYOUTS).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs">${esc(v.structure)}</span>
      <a href="/ctalay-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/ctalay-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[640px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'cta-layout-options.html'), page);
for (const k of Object.keys(CTA_LAYOUTS)) fs.writeFileSync(path.join(dist, `ctalay-${k}.html`), frame(k));
console.log(`built cta-layout-options.html + ${Object.keys(CTA_LAYOUTS).length} frames`);

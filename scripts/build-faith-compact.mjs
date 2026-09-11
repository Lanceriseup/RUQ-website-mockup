// Builds /faith-compact.html — five ways to shorten the Statement of Faith
// section without changing its design.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAITH_COMPACT, renderFaithCompact } from '../src/partials/faith-compact.mjs';
import { faithSection } from '../src/partials/faith.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (body) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">${body}</body></html>`;

fs.writeFileSync(path.join(dist, 'faithc-current.html'), wrap(faithSection(site, content)));
for (const k of Object.keys(FAITH_COMPACT)) {
  fs.writeFileSync(path.join(dist, `faithc-${k}.html`), wrap(renderFaithCompact(site, content, k)));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Statement of Faith — compact — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Statement of Faith — compacting</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">The design is unchanged throughout: parchment plate, Cormorant, drop cap, hanging
     numerals, the cross photograph behind. Only the height moves.</p>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Four separate levers, one per option, so they combine.</strong> Padding and leading; type size; column count — three
    columns is much shorter than two; and layout, moving the intro beside the beliefs rather than above them. The current version
    is shown first for comparison.
  </div>

  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-ink px-3 py-1 font-body text-xs font-bold text-white">current</span>
      <span class="font-display text-lg font-bold">What is live now</span>
      <a href="/faithc-current.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/faithc-current.html" title="Current" loading="lazy" class="block h-[760px] w-full border-0"></iframe>
    </div>
  </section>

  ${Object.entries(FAITH_COMPACT).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs">lever: ${esc(v.lever)}</span>
      <a href="/faithc-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/faithc-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[760px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'faith-compact.html'), page);
console.log(`built faith-compact.html + ${Object.keys(FAITH_COMPACT).length + 1} frames`);

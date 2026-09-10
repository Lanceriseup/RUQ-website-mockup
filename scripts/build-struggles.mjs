// Builds /struggles-options.html — six treatments for the struggles section.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STRUGGLES, renderStruggles } from '../src/partials/struggles-variants.mjs';
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
<section class="py-16">${renderStruggles(site, content, key)}</section>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Struggles section — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Common struggles — section options</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-4 text-sm">
    <strong>Copy corrected first.</strong> The live site's heading is <em>“Common struggles women in marriage have:”</em> and an
    earlier extraction had paraphrased items 5 and 6. All six lines are now verbatim from riseupqueens.com.
  </div>

  <div class="mt-3 rounded-xl bg-cyan-tint p-4 text-sm">
    <strong>Why none of these use tick marks.</strong> The live version puts a check beside each line, and a check reads as
    something achieved. These are six uncomfortable things to recognise about your own marriage — ticking them off is the wrong
    gesture entirely. Several options below deliberately slow the reading down instead.
  </div>

  ${Object.entries(STRUGGLES).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/struggles-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/struggles-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[640px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'struggles-options.html'), page);
for (const k of Object.keys(STRUGGLES)) fs.writeFileSync(path.join(dist, `struggles-${k}.html`), frame(k));
console.log(`built struggles-options.html + ${Object.keys(STRUGGLES).length} frames`);

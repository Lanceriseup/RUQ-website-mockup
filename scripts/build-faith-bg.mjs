// Builds /faith-bg.html — background filters and edge treatments for the
// Statement of Faith band, as two independent galleries.
//
// Every frame is padded with white above and below. The edge treatments only
// make sense against the sections they actually meet, and on this page those
// are both white; judging a torn edge on a bare viewport would be meaningless.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAITH_FILTERS, FAITH_EDGES, renderFaithBg } from '../src/partials/faith-bg.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

// Stand-ins for the real neighbours: the breakthrough CTA above, the video
// section below. Both are white, both end in a centred block, so a short
// centred line is enough to read the join.
const NEIGHBOUR = (label) => `
<div class="bg-white py-14 text-center">
  <p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft/50">${esc(label)}</p>
</div>`;

const wrap = (body) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">${NEIGHBOUR('↑ white CTA section above')}${body}${NEIGHBOUR('↓ white video section below')}</body></html>`;

// Filters are shown on the straight edge and edges on the flat scrim, so each
// gallery isolates one lever.
for (const k of Object.keys(FAITH_FILTERS)) {
  fs.writeFileSync(path.join(dist, `faithbg-f-${k}.html`), wrap(renderFaithBg(site, content, k, 'straight')));
}
for (const k of Object.keys(FAITH_EDGES)) {
  fs.writeFileSync(path.join(dist, `faithbg-e-${k}.html`), wrap(renderFaithBg(site, content, 'flat', k)));
}

const gallery = (prefix, set, kind) => Object.entries(set).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'flat' || k === 'straight' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/${prefix}${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/${prefix}${k}.html" title="${esc(kind)}: ${esc(v.label)}" loading="lazy" class="block h-[1000px] w-full border-0"></iframe>
    </div>
  </section>`).join('');

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Statement of Faith — background &amp; edges — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Statement of Faith — background &amp; edges</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Two independent levers — pick one from each.</strong> Any filter works with any edge.
    Below, the filters are all shown on the current straight edge, and the edges are all shown on the current flat
    scrim, so each gallery changes one thing only. Every frame is padded with white above and below, because both
    neighbouring sections on the homepage are white and that is what the edges have to dissolve into.
    Nothing inside the parchment plate changes in any of these.
  </div>

  <h2 class="mt-10 font-display text-2xl font-bold">Lever 1 — the filter on the photograph</h2>
  ${gallery('faithbg-f-', FAITH_FILTERS, 'filter')}

  <h2 class="mt-16 font-display text-2xl font-bold">Lever 2 — the top and bottom edge</h2>
  ${gallery('faithbg-e-', FAITH_EDGES, 'edge')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'faith-bg.html'), page);
const n = Object.keys(FAITH_FILTERS).length + Object.keys(FAITH_EDGES).length;
console.log(`built faith-bg.html + ${n} frames`);

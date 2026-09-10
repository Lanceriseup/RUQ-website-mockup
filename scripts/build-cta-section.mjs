// Builds /cta-section-options.html — six CTA treatments, each shown under a
// slice of the spread above so the transition into it is visible.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CTA_SECTIONS, renderCtaSection } from '../src/partials/cta-section-variants.mjs';
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
<section class="px-6 py-14" style="background:linear-gradient(180deg,#FDF6F1,#ffffff)">
  <div class="mx-auto max-w-content">
    <p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft">end of the spread above</p>
  </div>
</section>
${renderCtaSection(site, content, key)}
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CTA section — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">CTA section options</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Why the current one falls flat.</strong> A plain white card on a desaturated photo reads as a form that happened to
    land there rather than the moment the page has been building toward. This is the last thing before the footer and the only
    place on the page that captures anything — it should be the loudest thing on it, not the quietest.
  </div>

  <div class="mt-3 rounded-xl bg-cyan-tint p-5 text-sm">
    <strong>Every option keeps the fields inert and says so on the page.</strong> The live form posts to a Brizy handler; Jayden
    reported the Jotform routes broke and the plan was MOS forms into Ontraport. Nothing here should be wired until that is decided
    — a form that looks live but silently discards a signup is worse than an obvious placeholder.
  </div>

  ${Object.entries(CTA_SECTIONS).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/ctasec-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/ctasec-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[780px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'cta-section-options.html'), page);
for (const k of Object.keys(CTA_SECTIONS)) fs.writeFileSync(path.join(dist, `ctasec-${k}.html`), frame(k));
console.log(`built cta-section-options.html + ${Object.keys(CTA_SECTIONS).length} frames`);

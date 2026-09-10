// Builds /headline-options.html — premium headline treatments, each shown on
// the dark hero and again on white, since the script colour behaves very
// differently on the two.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEADLINES, renderHeadline } from '../src/partials/headline-variants.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTFACE = `<style>
@font-face{font-family:'Julietta Messie';src:url('/assets/fonts/julietta-messie.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
</style>`;

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css">${FONTFACE}<style>body{margin:0}</style></head>
<body>
<section class="relative overflow-hidden bg-ink px-4 py-20">
  <img src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover opacity-30">
  <div class="absolute inset-0 bg-ink/60"></div>
  <div class="relative mx-auto max-w-4xl">${renderHeadline(content, key, true)}</div>
</section>
<section class="bg-white px-4 py-20">
  <div class="mx-auto max-w-4xl">${renderHeadline(content, key, false)}</div>
</section>
<script src="/hero-rotate.js" defer></script>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Headline options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Great+Vibes&display=swap">
<link rel="stylesheet" href="/styles.css">${FONTFACE}
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Headline options</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Now using <strong>Julietta Messie</strong> — the brush script from the NLB project,
     copied from <code class="rounded bg-ink/5 px-1">RUQ&nbsp;-&nbsp;NLB/public/fonts</code>. Each is shown on the dark hero
     and again on white, because the script colour behaves very differently on the two.</p>

  <div class="mt-5 grid gap-4 md:grid-cols-2">
    <div class="rounded-xl bg-ink p-5 text-white">
      <p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-white/50">Before — Great Vibes</p>
      <p class="mt-3 font-display text-3xl font-bold">Become the
        <span style="font-family:'Great Vibes',cursive;font-size:1.5em;line-height:1">passionate</span></p>
    </div>
    <div class="rounded-xl bg-ink p-5 text-white">
      <p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-white/50">After — Julietta Messie</p>
      <p class="mt-3 font-display text-3xl font-bold">Become the
        <span style="font-family:'Julietta Messie',cursive;font-size:1.35em;line-height:.8;color:#b7873e">passionate</span></p>
    </div>
  </div>

  <div class="mt-5 rounded-xl bg-magenta-tint p-4 text-sm">
    <strong>What made it look cheap.</strong> Four things, and the font was only one:
    Great Vibes is thin copperplate calligraphy where NLB uses a confident brush;
    NLB sets line-height 0.8 so the script tucks into the sans instead of floating;
    NLB's colour is a rich gold rather than plain white; and a mechanical 3px bar under a
    hand-drawn script is the giveaway — these use a drawn swash with uneven ends.
  </div>

  ${Object.entries(HEADLINES).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/headline-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/headline-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[560px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'headline-options.html'), page);
for (const k of Object.keys(HEADLINES)) fs.writeFileSync(path.join(dist, `headline-${k}.html`), frame(k));
console.log(`built headline-options.html + ${Object.keys(HEADLINES).length} frames`);

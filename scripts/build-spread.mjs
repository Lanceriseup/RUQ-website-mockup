// Builds /spread-options.html — the struggles and renewal sections designed as
// one spread, with the NLB script face.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SPREADS, renderSpread } from '../src/partials/spread-variants.mjs';
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
<section class="relative h-[140px] overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-50" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0" style="background:radial-gradient(78% 62% at 50% 46%,rgba(28,28,28,.45),rgba(28,28,28,.9) 100%)"></div>
</section>
<div class="relative z-10 -mt-16 rounded-t-[2.5rem] bg-white shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)]
            before:absolute before:left-1/2 before:top-4 before:h-1.5 before:w-16 before:-translate-x-1/2 before:rounded-full before:bg-ink/15">
  ${renderSpread(site, content, key)}
</div>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Struggles + renewal spread — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">The two sections, designed as one spread</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Why the earlier options stayed basic.</strong> They designed the two sections separately. They are one argument — six
    problems, then three answers — and nothing carried that. Every option below renders <em>both</em>, and the pairing is the idea.
  </div>

  <div class="mt-3 rounded-xl bg-cyan-tint p-5 text-sm">
    <strong>The script is Julietta Messie</strong> — the exact face from NLB, self-hosted from the same file, at weight 400 with
    font-synthesis disabled so it can never render fake-bold. Following NLB's pattern, each heading is split across two faces, and
    <em>no copy is invented</em> — these are the client's own sentences divided:
    <span class="mt-2 block">“<span class="script" style="color:#e8208f;font-size:1.5em">Common struggles</span>” + <strong>women in marriage have</strong></span>
    <span class="mt-1 block"><strong>Join us to experience</strong> + “<span class="script" style="color:#00b9c6;font-size:1.5em">healing and renewal</span>”</span>
    <span class="mt-2 block">Script-then-sans in one, sans-then-script in the other, so the two sections have opposite rhythms.</span>
  </div>

  ${Object.entries(SPREADS).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/spread-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/spread-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[900px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'spread-options.html'), page);
for (const k of Object.keys(SPREADS)) fs.writeFileSync(path.join(dist, `spread-${k}.html`), frame(k));
console.log(`built spread-options.html + ${Object.keys(SPREADS).length} frames`);

// Builds /renewal-options.html — six treatments for the renewal section, each
// shown UNDER the real struggles section, because the whole question is how
// the two read as a pair.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RENEWALS, renderRenewal } from '../src/partials/renewal-variants.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

// The real struggles section, so the pairing can be judged.
const strugglesAbove = `
<section class="relative bg-white pb-16 pt-20">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full blur-3xl" style="background:radial-gradient(circle,rgba(232,32,143,.16),transparent 68%)"></div>
  </div>
  <div class="relative mx-auto max-w-content px-6">
    <div class="grid gap-14 lg:grid-cols-[7fr_5fr]">
      <div>
        <h2 class="font-display text-3xl font-bold leading-tight text-ink sm:text-[2.75rem]">${esc(content.home.painPoints.heading)}</h2>
        <ul class="mt-10 space-y-7">
          ${content.home.painPoints.items.slice(0, 4).map((t, i) => `
          <li class="flex gap-6">
            <span aria-hidden="true" class="shrink-0 font-display text-2xl font-bold leading-none tabular-nums" style="color:rgba(232,32,143,.35)">${String(i + 1).padStart(2, '0')}</span>
            <p class="font-body text-lg leading-relaxed text-ink">${esc(t)}</p>
          </li>`).join('')}
        </ul>
      </div>
      <div class="relative hidden lg:block">
        <img src="/assets/photos/gallery-1-2.png" alt="" aria-hidden="true"
             class="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(28,28,28,.45)]">
      </div>
    </div>
  </div>
</section>`;

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${strugglesAbove}
${renderRenewal(site, content, key)}
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Renewal section — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Healing and renewal — section options</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Each is shown <strong>under the real struggles section</strong>, because the question is
     not what this looks like alone — it is how the two read as a pair.</p>

  <div class="mt-4 rounded-xl bg-cyan-tint p-4 text-sm">
    <strong>The pairing is the design.</strong> The section above names six problems with its list on the LEFT and its photo on the
    RIGHT. This one is the answer to them. Flipping the axis — photo left, answers right — makes the eye cross the page, and that
    change of direction does the work of a transition without needing a device. Everything else here is a variation on that idea.
  </div>

  ${Object.entries(RENEWALS).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/renewal-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/renewal-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[860px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'renewal-options.html'), page);
for (const k of Object.keys(RENEWALS)) fs.writeFileSync(path.join(dist, `renewal-${k}.html`), frame(k));
console.log(`built renewal-options.html + ${Object.keys(RENEWALS).length} frames`);

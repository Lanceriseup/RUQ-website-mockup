// Builds /cta-heading-options.html — treatments for the CTA heading, shown on
// the real section with the real mission paragraph beneath.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CTA_HEADINGS, renderCtaHeading } from '../src/partials/cta-heading-variants.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const HIGHLIGHTS = ['the unshakable truth of the Gospel', 'true freedom', 'strength, identity, and purpose'];
const missionHtml = () => {
  let out = esc(content.home.faith.mission);
  for (const p of HIGHLIGHTS) {
    const e = esc(p);
    out = out.split(e).join(`<strong class="font-semibold" style="color:#dc1e88">${e}</strong>`);
  }
  return out;
};

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
<section class="relative overflow-hidden bg-white py-20">
  <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-px"
       style="background:linear-gradient(to right,transparent,#e8208f,#00b9c6,transparent)"></div>
  <div class="relative mx-auto max-w-content px-6 text-center">
    ${renderCtaHeading(content, key)}
    <p class="mx-auto mt-6 max-w-6xl text-[1.21rem] leading-[1.7] text-ink"
       style="font-family:'Cormorant Garamond',serif">${missionHtml()}</p>
    <form action="#" method="post" novalidate class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
      ${content.home.cta.fields.map(f => `
      <div class="flex-1">
        <label for="hh-${esc(f.name)}" class="sr-only">${esc(f.label)}</label>
        <input id="hh-${esc(f.name)}" name="${esc(f.name)}" type="${esc(f.type)}" placeholder="${esc(f.label)}" disabled
               class="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 font-body text-ink placeholder:text-ink-soft/60 disabled:cursor-not-allowed">
      </div>`).join('')}
      <button type="submit" disabled
              class="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-body text-sm font-bold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed sm:w-auto"
              style="background:#e8208f">${esc(content.home.cta.button)}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </form>
  </div>
</section>
</body></html>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CTA heading — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">CTA heading — treatments</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Each is shown on the real section with the real mission paragraph beneath, since the
     heading now has to out-rank a serif body block set at full ink rather than grey.</p>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    The heading is currently bold Montserrat in ink — the same recipe as every other heading on the page. Nothing marks it as the
    one that precedes the only form on the homepage.
  </div>

  ${Object.entries(CTA_HEADINGS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/ctahead-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/ctahead-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[520px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'cta-heading-options.html'), page);
for (const k of Object.keys(CTA_HEADINGS)) fs.writeFileSync(path.join(dist, `ctahead-${k}.html`), frame(k));
console.log(`built cta-heading-options.html + ${Object.keys(CTA_HEADINGS).length} frames`);

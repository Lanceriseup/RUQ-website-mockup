// Builds /testimonials.html — six designs for the testimonial section.
//
// Each frame renders the real creed band above it and a stand-in for the
// founder section below. The brief was "flow smoothly from the previous
// section", and the previous section is now a dark band with an arched bottom
// edge — judging any of these on a blank page would say nothing about whether
// the join works.
//
// Options flagged needsDarkAbove get a dark backdrop behind the creed band.
// The arch clips that band, so its two bottom corners show whatever is behind
// it; leave that white under a dark option and two white crescents appear in
// the seam.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TESTIMONIAL_OPTIONS, renderTestimonials } from '../src/partials/testimonials.mjs';
import { faithSection } from '../src/partials/faith.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const videos = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

// Stand-in for the founder section that follows on the homepage: pink ground,
// left-aligned heading. Enough to judge the bottom join.
const FOUNDER = `
<section class="bg-magenta-tint py-16">
  <div class="mx-auto max-w-content px-4">
    <p class="font-body text-[11px] uppercase tracking-[0.3em] text-ink-soft/60">↓ founder section below (bg-magenta-tint)</p>
  </div>
</section>`;

const wrap = (key, body) => {
  const o = TESTIMONIAL_OPTIONS[key];
  const above = o.needsDarkAbove
    ? `<div style="background:#141414">${faithSection(site, content)}</div>`
    : faithSection(site, content);

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(o.label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${above}
${body}
${FOUNDER}
<script src="/app.js" defer></script>
</body></html>`;
};

for (const k of Object.keys(TESTIMONIAL_OPTIONS)) {
  fs.writeFileSync(path.join(dist, `tst-${k}.html`), wrap(k, renderTestimonials(site, content, videos, k)));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Testimonial section — options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Testimonial section — six options</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Every frame shows the creed band above and the founder section below</strong>, because the brief was that this
    has to flow out of what precedes it — and what precedes it is now a dark band with an arched bottom edge.
    Two options keep the dark running through; the other four return to white and handle the curve differently.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>Poster frames are now real.</strong> The facades were blank dark rectangles — Wistia hands back a poster for every
    video, so all fifteen are downloaded locally and every option is built on actual stills.
    <br><br>
    <strong>Names and quotes are missing.</strong> The video titles are literally “RUQ 2025 Testimonial 1” through 15, which
    is useless as a caption. The women are wearing name badges in the frames, but a badge read off a video still is not a
    source I will caption a real person from. Anywhere a name or a quote appears below it is marked as placeholder —
    the client needs to supply a first name and one line per video.
  </div>

  ${Object.entries(TESTIMONIAL_OPTIONS).map(([k, v]) => `
  <section class="mt-10">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      ${v.needsDarkAbove ? '<span class="rounded-full bg-ink px-3 py-1 font-body text-xs text-white">keeps the dark</span>' : ''}
      <a href="/tst-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-2 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <p class="mt-1 max-w-3xl text-sm"><span class="font-semibold">Flow:</span> <span class="text-ink-soft">${esc(v.flow)}</span></p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/tst-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[1400px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'testimonials.html'), page);
console.log(`built testimonials.html + ${Object.keys(TESTIMONIAL_OPTIONS).length} frames`);

// Builds /testimonial-heading.html — six centred wordings for the
// testimonial heading.
//
// Each frame renders the real section, not a heading on its own: the lead
// sentence underneath is gone, so the heading now has to hold the top of a
// section that is otherwise all photography, and it can only be judged with
// the rails under it. The creed band above is included for the same reason —
// the heading sits directly beneath its wave.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TESTIMONIAL_HEADINGS } from '../src/partials/testimonial-headings.mjs';
import { testimonialsSection } from '../src/partials/testimonials.mjs';
import { faithSection } from '../src/partials/faith.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const videos = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(TESTIMONIAL_HEADINGS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${faithSection(site, content)}
${testimonialsSection(site, content, videos, key)}
<script src="/app.js" defer></script>
</body></html>`;

for (const k of Object.keys(TESTIMONIAL_HEADINGS)) {
  fs.writeFileSync(path.join(dist, `th-${k}.html`), wrap(k));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Testimonial heading — options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Testimonial heading — six centred options</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Already applied in every frame:</strong> the top wash is gone (the creed band's wave resolves that join on its
    own now, so the wash was a second gradient competing with it), the lead sentence is gone, the rails run at roughly half
    the speed, and clicking any card opens the video in a lightbox.
    <br><br>
    <strong>The style is fixed</strong> — the same construction as “Common struggles / WOMEN IN MARRIAGE HAVE” two sections
    above: script line with the drawn swash, uppercase Montserrat beneath. Only the words change between these six.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>Five of these six replace client copy.</strong> The live heading is “What Women Have Experienced at Rise Up
    Queens”. The first option keeps it word for word and only re-splits it across the two faces; the rest are wording I
    have written and are labelled below. Rewriting a client's heading is their call, not mine — treat the five as
    suggestions to take to them.
  </div>

  ${Object.entries(TESTIMONIAL_HEADINGS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${v.clientCopy ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      ${v.clientCopy
        ? '<span class="rounded-full bg-ink px-3 py-1 font-body text-xs text-white">client copy, unchanged</span>'
        : '<span class="rounded-full border border-amber-400 bg-amber-100 px-3 py-1 font-body text-xs font-semibold">my wording</span>'}
      <a href="/th-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-2 font-body text-sm"><span class="text-ink-soft">reads:</span>
       <span class="font-semibold">${esc(v.script)}</span> / <span class="font-semibold uppercase">${esc(v.sans)}</span></p>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/th-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[1500px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'testimonial-heading.html'), page);
console.log(`built testimonial-heading.html + ${Object.keys(TESTIMONIAL_HEADINGS).length} frames`);

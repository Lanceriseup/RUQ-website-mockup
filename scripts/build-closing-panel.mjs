// Builds /closing-panel.html — size and motion for the closing CTA.
//
// Two galleries, because there are two levers and mixing them makes both
// unjudgeable. Sizes are all shown static; motions are all shown at the
// current size. Any size takes any motion.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLOSING_SIZES, CLOSING_MOTIONS, closingTicket } from '../src/partials/closing-ticket.mjs';
import { CLOSING_COPY } from '../src/partials/closing-wide.mjs';
import { WORDING, SIZE } from '../src/partials/closing.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const copy = CLOSING_COPY[WORDING];

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (title, body, needsCountdown) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${body}
${needsCountdown ? '<script src="/countdown.js" defer></script>' : ''}
</body></html>`;

for (const [k, v] of Object.entries(CLOSING_SIZES)) {
  fs.writeFileSync(path.join(dist, `cls-${k}.html`),
    wrap(v.label, closingTicket(site, content, copy, k, 'none'), false));
}
for (const [k, v] of Object.entries(CLOSING_MOTIONS)) {
  fs.writeFileSync(path.join(dist, `clmo-${k}.html`),
    wrap(v.label, closingTicket(site, content, copy, SIZE, k), k === 'countdown'));
}

const gallery = (prefix, set, badge) => Object.entries(set).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'current' || k === 'none' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      ${badge ? badge(k, v) : ''}
      <a href="/${prefix}${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/${prefix}${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[520px] w-full border-0"></iframe>
    </div>
  </section>`).join('');

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Closing CTA — size &amp; motion — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Closing CTA — size &amp; motion</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Two levers, and any size takes any motion.</strong> The sizes below are all shown static and the motions are all
    shown at the current size, so each gallery changes one thing.
    <br><br>
    <strong>Sizes vary on two axes, not one.</strong> How wide the panel is and how big the things inside it are move
    independently — which is why <span class="font-semibold">narrow</span> and <span class="font-semibold">bold</span> are
    different ideas rather than two points on a slider. If the problem with the current one is that it looks stretched
    rather than small, narrow is the one to look at.
    <br><br>
    <strong>Every motion here loops.</strong> The previous set was mostly arrivals that fired once; these all run
    continuously. All are transform, opacity or background-position only, so they stay on the compositor, and all are
    switched off under prefers-reduced-motion.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>The countdown makes the unconfirmed date load-bearing.</strong> It runs off nextEvent.upcoming[0].startsAt,
    which is flagged for verification in site.json — the live banner says October 9–11 while that says October 15–17,
    2026. It also stops itself once the date passes rather than counting up into negatives. Strongest attention device
    here by some distance, but it needs the date pinned down first.
  </div>

  <h2 class="mt-10 font-display text-2xl font-bold">Lever 1 — size</h2>
  ${gallery('cls-', CLOSING_SIZES, (k, v) =>
    `<span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs">${esc(v.wrap.replace('max-w-', 'width '))} · ${esc(v.head.split(' ').pop().replace(/sm:text-\[|\]/g, ''))} heading</span>`)}

  <h2 class="mt-16 font-display text-2xl font-bold">Lever 2 — motion, all looping</h2>
  <p class="mt-1 max-w-3xl text-sm text-ink-soft">All shown at the <span class="font-semibold">${esc(SIZE)}</span> size.</p>
  ${gallery('clmo-', CLOSING_MOTIONS, (k, v) =>
    v.needsDate ? '<span class="rounded-full border border-amber-400 bg-amber-100 px-3 py-1 font-body text-xs font-semibold">needs the date confirmed</span>' : '')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'closing-panel.html'), page);
console.log(`built closing-panel.html + ${Object.keys(CLOSING_SIZES).length + Object.keys(CLOSING_MOTIONS).length} frames`);

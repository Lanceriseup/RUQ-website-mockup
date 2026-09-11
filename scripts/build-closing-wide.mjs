// Builds /closing-wide.html — wide floating panels for the closing CTA, plus a
// second gallery for the wording on its own.
//
// Two galleries because there are two levers. Showing six layouts each with a
// different wording makes it impossible to tell whether you are reacting to
// the panel or the sentence, so the second gallery holds the layout still and
// changes only the words.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLOSING_LAYOUTS, CLOSING_COPY, LAYOUT_COPY_PAIRING, renderClosingWide } from '../src/partials/closing-wide.mjs';
import { footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const ABOVE = `
<section class="bg-magenta-tint py-14">
  <div class="mx-auto max-w-content px-4">
    <h2 class="font-display text-2xl font-bold text-ink">Meet the Founder</h2>
    <p class="mt-3 font-body text-sm text-ink-soft">↑ founder section above (bg-magenta-tint)</p>
  </div>
</section>`;

const wrap = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${ABOVE}
${body}
${footer(site)}
</body></html>`;

// Layout frames, each with its paired wording.
for (const [k, v] of Object.entries(CLOSING_LAYOUTS)) {
  fs.writeFileSync(path.join(dist, `clw-${k}.html`),
    wrap(v.label, renderClosingWide(site, content, k, LAYOUT_COPY_PAIRING[k])));
}

// Wording frames, all on the same layout so only the words differ.
const COPY_ON = 'paperGlow';
for (const k of Object.keys(CLOSING_COPY)) {
  fs.writeFileSync(path.join(dist, `clc-${k}.html`),
    wrap(CLOSING_COPY[k].label, renderClosingWide(site, content, COPY_ON, k)));
}

const gallery = (prefix, set, height, extra) => Object.entries(set).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${v.clientCopy ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      ${extra ? extra(k, v) : ''}
      <a href="/${prefix}${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/${prefix}${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[${height}px] w-full border-0"></iframe>
    </div>
  </section>`).join('');

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Closing CTA — wide — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Closing CTA — wide floating panel</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Two levers, so any panel takes any wording.</strong> Below, the six layouts are each shown with a different
    wording so you can see both at once; underneath that, the same layout is shown with each wording in turn so the words
    can be judged on their own. Say one from each.
    <br><br>
    Every layout holds the proportion from your reference: full container width, short, copy left, button on its own to
    the right, and a glow bleeding out from under the panel onto the page — wider than the panel, so it reads as light
    thrown on the page rather than a drop shadow.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>Four of the five wordings are mine.</strong> Only <span class="font-semibold">verbatim</span> is the client's.
    Their body line is 83 characters, which sets as three lines in a panel this shallow and pushes it taller than the
    reference — that is the reason for the alternatives, and it is still their call.
    <br><br>
    <strong>ticketBar shows event dates and comeSee names the city.</strong> Both are unconfirmed: the live banner says
    October 9–11 in Dallas, site.json carries October 15–17, 2026 flagged for verification.
  </div>

  <h2 class="mt-10 font-display text-2xl font-bold">Lever 1 — the panel</h2>
  ${gallery('clw-', CLOSING_LAYOUTS, 620, (k) =>
    `<span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs">wording: ${esc(LAYOUT_COPY_PAIRING[k])}</span>`)}

  <h2 class="mt-16 font-display text-2xl font-bold">Lever 2 — the wording</h2>
  <p class="mt-1 max-w-3xl text-sm text-ink-soft">All on the <span class="font-semibold">${esc(COPY_ON)}</span> panel, so only the words change.</p>
  ${gallery('clc-', CLOSING_COPY, 600, (k, v) => `
    <span class="rounded-full ${v.clientCopy ? 'bg-ink text-white' : 'border border-amber-400 bg-amber-100'} px-3 py-1 font-body text-xs font-semibold">${v.clientCopy ? 'client copy' : 'my wording'}</span>
    <span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs">button: ${esc(v.button)}</span>`)}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'closing-wide.html'), page);
console.log(`built closing-wide.html + ${Object.keys(CLOSING_LAYOUTS).length + Object.keys(CLOSING_COPY).length} frames`);

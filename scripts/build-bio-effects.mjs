// Builds /bio-effects.html — six ways to open a coach's bio.
//
// Each frame is the real page. An entrance animation cannot be judged from a
// still, so these have to be opened: the gallery links out as well as
// embedding, because a modal inside a 900px iframe is not the same experience
// as one filling a window.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BIO_EFFECTS } from '../src/partials/bio-effects.mjs';
import { teamPage } from '../src/partials/team.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(BIO_EFFECTS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body style="background:#0b0b0b">
${header(site, '/team.html', { overHero: true, scrim: false })}
${teamPage(site, content, 'script', key)}
${footer(site)}
<script src="/app.js" defer></script>
<script src="/bio-modal.js" defer></script>
</body></html>`;

for (const k of Object.keys(BIO_EFFECTS)) {
  fs.writeFileSync(path.join(dist, `bio-${k}.html`), wrap(k));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Coach bios — opening effects — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Coach bios — six ways to open one</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>These have to be opened to be judged.</strong> Click “Read bio” inside a frame, or use
    <span class="font-semibold">Open ↗</span> — a modal inside a 900px iframe is not the same as one filling a window,
    and three of the six are specifically about where the panel comes from.
    <br><br>
    <strong>Five are modals; <span class="font-semibold">flip</span> is not.</strong> It turns the polaroid over in place,
    which is the only option that keeps the bio attached to the person instead of moving it to the middle of the screen.
    It is in the set because it is the most on-theme thing a polaroid can do, not because it fits the word “popup”.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>What the drawer got for free and a dialog has to earn back.</strong> A &lt;details&gt; opened with JavaScript
    blocked and was keyboard-operable for nothing. Every option here adds: Escape and backdrop to close, focus held inside
    the panel while it is open, focus returned to the card afterwards, the page locked without jumping sideways, and the
    panel announced as a dialog labelled by the person's name. All of it is switched down under prefers-reduced-motion.
    <br><br>
    The bio itself stays in the page as real markup and the dialog clones it, so with the script blocked the button is
    inert but the words are still in the document.
    <br><br>
    <strong>Two bios run past 1,290 characters</strong> (Jessica and Becky). <span class="font-semibold">slideOver</span>
    and <span class="font-semibold">sheet</span> hold those without an inner scrollbar; <span class="font-semibold">flip</span>
    has the least room of the six and will scroll inside the card.
  </div>

  ${Object.entries(BIO_EFFECTS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      ${v.inPlace ? '<span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs">not a modal</span>' : ''}
      <a href="/bio-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/bio-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[900px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'bio-effects.html'), page);
console.log(`built bio-effects.html + ${Object.keys(BIO_EFFECTS).length} frames`);

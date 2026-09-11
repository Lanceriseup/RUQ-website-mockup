// Builds /about-faqs.html — six treatments for the FAQ section.
//
// Each frame renders the real section on the real page ground, because seven
// questions read very differently under a long page than on their own.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAQ_OPTIONS, renderFaqs } from '../src/partials/faq-variants.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(FAQ_OPTIONS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${header(site, '/about.html', {})}
<section class="bg-white">${renderFaqs(content, key)}</section>
${footer(site)}
<script src="/app.js" defer></script>
</body></html>`;

for (const k of Object.keys(FAQ_OPTIONS)) {
  fs.writeFileSync(path.join(dist, `faq-${k}.html`), wrap(k));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FAQs — options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">FAQs — six treatments</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>The answers are short, and that decides the set.</strong> All seven are under 170 characters and two are under 60 —
    one of them is "Dallas, TX". A disclosure exists to hide length, and there is very little length here to hide — so three of these show
    everything at once, and the three that still disclose say what they buy with it.
    <br><br>
    <strong>Where a disclosure is used it is native &lt;details&gt;</strong>, never a JS accordion: it opens with the
    script blocked, is keyboard-operable for nothing, and find-in-page can reach inside a closed one where the browser
    supports it.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>The questions in our data were not the client's.</strong> content.json carried four — "Who is Rise Up Queens
    for?", "What happens at the 3-day event?" and two more — written during the first extraction pass. The live page has
    seven different ones. All seven are now verbatim from source; the old four are kept in content.json under
    _faqsWere in case any wording is wanted.
    <br><br>
    <strong>Two answers carry markup</strong> — an italic "you" in the first and a mailto in the last. Both are matched on
    their text rather than hard-coded, so editing that copy renders it plainly instead of breaking. Every option preserves
    both.
    <br><br>
    <strong>The two pullquotes are gone</strong> from the page. Their copy stays in content.json as about.pullquotes.
  </div>

  ${Object.entries(FAQ_OPTIONS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'current' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/faq-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/faq-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[900px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'about-faqs.html'), page);
console.log(`built about-faqs.html + ${Object.keys(FAQ_OPTIONS).length} frames`);

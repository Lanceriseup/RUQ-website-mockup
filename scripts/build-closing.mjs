// Builds /closing.html — six designs for the closing CTA.
//
// Each frame renders the founder section stand-in above and the real footer
// below. This is the last thing before the footer, and a floating card is
// judged by the ground it floats on and what it butts up against — a card on a
// blank page tells you nothing about either.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLOSING_OPTIONS, renderClosing } from '../src/partials/closing-variants.mjs';
import { footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

// The founder section as it actually renders on the homepage: pink ground,
// heading, ghost button.
const ABOVE = `
<section class="bg-magenta-tint py-16">
  <div class="mx-auto max-w-content px-4">
    <h2 class="font-display text-3xl font-bold text-ink">Meet the Founder</h2>
    <p class="mt-4 max-w-3xl font-body text-ink-soft">↑ founder section above (bg-magenta-tint)</p>
  </div>
</section>`;

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(CLOSING_OPTIONS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${ABOVE}
${renderClosing(site, content, key)}
${footer(site)}
</body></html>`;

for (const k of Object.keys(CLOSING_OPTIONS)) {
  fs.writeFileSync(path.join(dist, `cl-${k}.html`), wrap(k));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Closing CTA — options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Closing CTA — six floating options</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>All six are floating cards, none is a strip.</strong> What changes is what the card is made of and what the ground
    behind it does. Every frame shows the founder section above and the real footer below, because a floating card is judged
    by the ground it sits on and what it butts up against.
    <br><br>
    <strong>This section is not on the mockup yet.</strong> It exists on the live homepage, last before the footer, and the
    copy below is theirs word for word — including the mixed apostrophes in the body line, which are in their source and
    have been left alone.
    <br><br>
    <strong>The button is a live link</strong> to ${esc(site.nextEvent.ctaUrl)}, not a disabled control. Unlike the
    breakthrough form up the page there is no field here to mis-handle, so there is nothing to protect against.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>The ticket option shows event dates, and those are still unconfirmed.</strong> The live site contradicts itself —
    its own banner says October 9–11 in Dallas while site.json carries October 15–17, 2026 flagged for verification. The
    card says so on its face. Pick it only if someone is going to confirm the dates.
  </div>

  ${Object.entries(CLOSING_OPTIONS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/cl-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/cl-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[1100px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'closing.html'), page);
console.log(`built closing.html + ${Object.keys(CLOSING_OPTIONS).length} frames`);

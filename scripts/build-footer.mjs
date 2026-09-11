// Builds /footer.html — six footers.
//
// Each frame renders the real closing CTA above it. The footer's whole job now
// is to not compete with that, and a footer shown on its own gives no way to
// judge whether it does.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FOOTER_OPTIONS, renderFooter } from '../src/partials/footer-variants.mjs';
import { closingSection } from '../src/partials/closing.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(FOOTER_OPTIONS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-white">
${closingSection(site, content)}
${renderFooter(site, key)}
</body></html>`;

for (const k of Object.keys(FOOTER_OPTIONS)) {
  fs.writeFileSync(path.join(dist, `ft-${k}.html`), wrap(k));
}

const linkCount = (site.footerNav || site.nav).length;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Footer — options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Footer — six minimal options</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Every frame shows the real closing CTA above it.</strong> The page now ends on a lit, animated ask, and the
    footer's whole job is to not compete with it — which cannot be judged from a footer on its own.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>Minimal here means fewer rows, not fewer links.</strong> The header carries four links, so the footer is the
    only route to Events, Masterclasses, 1-on-1 Coaching and Free resource. All six options below keep every one of the
    ${linkCount} — dropping any would orphan a page that nothing else links to.
    <br><br>
    <strong>rule</strong> drops the logo. Some clients will not accept their mark missing from the foot of their own site, so
    check before choosing it.
    <br><br>
    <strong>light needs a dark logo file from the client.</strong> There is not one in the asset set — logo-ruq.png sounds
    like one and is a pink plaid texture. The white mark is inverted to black as a stopgap, which works because it is pure
    white artwork on transparency, but the real file should be requested.
  </div>

  ${Object.entries(FOOTER_OPTIONS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'current' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/ft-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/ft-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[640px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'footer.html'), page);
console.log(`built footer.html + ${Object.keys(FOOTER_OPTIONS).length} frames`);

// Builds /contact-styles.html — three separate option sets for the contact
// page, plus a full-page frame of whatever the page currently ships.
//
// Tiles rather than iframes. Eighteen options across three questions is too
// many pages to load, and two of the three questions are about small objects
// that are easier to judge lined up next to each other than one per screenful.
// Each tile carries the real plum ground so nothing is being judged against a
// background it will never sit on.
//
// The panel set does get full pages as well, because a form panel's weight
// against the rest of the page is exactly what is being chosen there.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  HEADING_RULES, PARTNER_SHAPES, PANEL_STYLES, renderPanel, renderContactPage,
} from '../src/partials/contact.mjs';
import { heading, partner, form } from '../src/partials/contact-parts.mjs';
import { GROUND, SPOTLIGHT } from '../src/partials/team.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const vids = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

// ------------------------------------------------------- full pages (panels)

const fullPage = (panel) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(PANEL_STYLES[panel].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-[#0b0b0b]">
${header(site, '/contact.html', { overHero: true, scrim: false })}
${renderContactPage(site, c, vids, { rule: 'none', partnerShape: 'above', panel })}
${footer(site)}
<script src="/app.js" defer></script>
</body></html>`;

for (const k of Object.keys(PANEL_STYLES)) {
  fs.writeFileSync(path.join(dist, `contact-panel-${k}.html`), fullPage(k));
}

// -------------------------------------------------------------------- tiles

// Each tile paints the page ground plus the spotlight, so a tile is a crop of
// the real page rather than a swatch that happens to be dark.
const tile = (inner, pad = 'p-8') => `
<div class="relative overflow-hidden rounded-xl" style="background:${GROUND}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:${SPOTLIGHT}"></div>
  <div class="relative ${pad}">${inner}</div>
</div>`;

const optionBlock = (key, meta, inner, cols = 'lg:grid-cols-[7fr_5fr]') => `
<section class="mt-7 grid gap-5 ${cols} items-start">
  ${tile(inner)}
  <div>
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${/^(gradient|beside|current)$/.test(key) ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(key)}</span>
      <span class="font-display text-base font-bold">${esc(meta.label)}</span>
    </div>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(meta.note)}</p>
  </div>
</section>`;

const setIntro = (n, title, body) => `
<div class="mt-14 border-t-2 border-ink pt-6">
  <h2 class="font-display text-2xl font-bold">${n}. ${esc(title)}</h2>
  <p class="mt-2 max-w-3xl text-ink-soft">${body}</p>
</div>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact — options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Contact — three open questions</h1>
  <p class="mt-2 max-w-3xl text-ink-soft">The layout and the form panel are back to what was approved, with the mockup
    note gone. These are three separate choices rather than one set of six, so they can be mixed — pick a rule, a
    Rise&nbsp;Up&nbsp;Kings block and a panel independently.</p>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Every tile below is a crop of the real page</strong>, painted on the same plum gradient and spotlight, so
    nothing is being judged against a background it will never sit on.
  </div>

  ${setIntro(1, 'Under the word "Contact"',
    'The magenta-to-cyan bar is out. The question is whether anything replaces it, and if so whether it is a brand mark, a piece of structure, or something measured by the type itself.')}
  ${Object.entries(HEADING_RULES).map(([k, v]) =>
    optionBlock(k, v, heading(c, { rule: k }))).join('')}

  ${setIntro(2, 'The Rise Up Kings block',
    'The first attempt stood a portrait shield next to a two-line text block half its height, so the two lined up at neither the top nor the bottom. Each of these either gives the crest a band of its own, brings it down to text scale, or stops treating it as a sibling of the text.')}
  ${Object.entries(PARTNER_SHAPES).map(([k, v]) =>
    optionBlock(k, v, `<div class="max-w-sm">${partner(site, c, k)}</div>`)).join('')}

  ${setIntro(3, 'The form panel',
    'The panel’s character stays — soft glass on the plum — because that is the part that was approved. These push how far it is finished. Each one also has a full page behind it, since a panel’s weight against the rest of the page is the thing actually being chosen.')}
  ${Object.entries(PANEL_STYLES).map(([k, v]) => `
  <section class="mt-7 grid items-start gap-5 lg:grid-cols-[7fr_5fr]">
    ${tile(renderPanel(k, form(c, { idPrefix: 'p' + k })), 'p-8')}
    <div>
      <div class="flex flex-wrap items-baseline gap-3">
        <span class="rounded-full ${k === 'current' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
        <span class="font-display text-base font-bold">${esc(v.label)}</span>
        <a href="/contact-panel-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Full page ↗</a>
      </div>
      <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(v.note)}</p>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'contact-styles.html'), page);
console.log(`built contact-styles.html — ${Object.keys(HEADING_RULES).length} rules, ${Object.keys(PARTNER_SHAPES).length} RUK blocks, ${Object.keys(PANEL_STYLES).length} panels + full pages`);

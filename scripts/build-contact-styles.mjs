// Builds /contact-styles.html — the contact page's remaining open choice.
//
// The heading rule (hairline), the Rise Up Kings block (watermark) and the
// form panel (the approved glass) are decided, so their option sets are gone
// from here; git holds them if any needs reopening. What is left is the social
// row.
//
// Two views of each: a tile cropped out of the real page, for comparing all
// seven at once, and a full page, because the social row now sits in a column
// whose last child is pinned to the foot of the form panel — and how a given
// treatment affects the space above that pin only shows at full height.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOCIAL_STYLES, renderContactPage } from '../src/partials/contact.mjs';
import { socials } from '../src/partials/contact-parts.mjs';
import { GROUND, SPOTLIGHT } from '../src/partials/team.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const vids = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

// Everything except the social row is the shipped combination, so each frame
// differs from /contact.html in exactly one thing.
const fullPage = (social) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(SOCIAL_STYLES[social].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-[#0b0b0b]">
${header(site, '/contact.html', { overHero: true, scrim: false })}
${renderContactPage(site, c, vids, { rule: 'hair', partnerShape: 'watermark', panel: 'current', social })}
${footer(site)}
<script src="/app.js" defer></script>
</body></html>`;

for (const k of Object.keys(SOCIAL_STYLES)) {
  fs.writeFileSync(path.join(dist, `contact-social-${k}.html`), fullPage(k));
}

const tile = (inner) => `
<div class="relative overflow-hidden rounded-xl" style="background:${GROUND}">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="background:${SPOTLIGHT}"></div>
  <div class="relative p-8">${inner}</div>
</div>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact — social row — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Contact — the social row</h1>
  <p class="mt-2 max-w-3xl text-ink-soft">Seven treatments, including the chips that are there now. Every full page
    below is the shipped page with this one thing changed, so nothing else is moving underneath the comparison.</p>

  <div class="mt-4 rounded-xl bg-cyan-tint p-5 text-sm">
    <strong>Rise Up Kings is now bottom-aligned with the form.</strong> The left column is a flex column whose last
    child is pushed to the foot, and grid rows already stretch to the taller of the two — so the block's bottom edge
    meets the form panel's, with no height measured anywhere and nothing to re-tune when the form changes. It applies
    from the <code>lg</code> breakpoint up; below that the grid is a single column and there is nothing to align to.
    <br><br>
    That is why the social row's height now matters: the space it leaves is the gap between it and the pinned block,
    and <code>labelled</code> in particular closes a lot of it.
  </div>

  ${Object.entries(SOCIAL_STYLES).map(([k, v]) => `
  <section class="mt-7 grid items-start gap-5 lg:grid-cols-[6fr_6fr]">
    ${tile(socials(site, { style: k }))}
    <div>
      <div class="flex flex-wrap items-baseline gap-3">
        <span class="rounded-full ${k === 'chip' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
        <span class="font-display text-base font-bold">${esc(v.label)}</span>
        <a href="/contact-social-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Full page ↗</a>
      </div>
      <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(v.note)}</p>
    </div>
  </section>`).join('')}

  <p class="mt-10 text-sm text-ink-soft">The heading rule, Rise Up Kings block and form panel option sets have been
    removed now that each is decided — hairline, watermark, and the approved glass. They are in git if one needs
    reopening.</p>
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'contact-styles.html'), page);
console.log(`built contact-styles.html + ${Object.keys(SOCIAL_STYLES).length} full pages`);

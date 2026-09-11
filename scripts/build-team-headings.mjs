// Builds /team-headings.html — treatments for the two team page headings.
//
// Each frame renders the real page, because both headings have to be judged
// together: the fault with the current build is not either heading on its own,
// it is that they are not treated as peers.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEAM_HEADINGS } from '../src/partials/team-headings.mjs';
import { teamPage } from '../src/partials/team.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(TEAM_HEADINGS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body style="background:#0b0b0b">
${header(site, '/team.html', { overHero: true, scrim: false })}
${teamPage(site, content, key)}
${footer(site)}
<script src="/app.js" defer></script>
</body></html>`;

for (const k of Object.keys(TEAM_HEADINGS)) {
  fs.writeFileSync(path.join(dist, `th2-${k}.html`), wrap(k));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Team headings — options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Team headings — six treatments</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Already applied:</strong> the spotlight from the ground options is now on the page, laid over the plum rather
    than replacing it — plum is the colour of the page, the spotlight is where the light falls on it.
    <br><br>
    <strong>Each frame is the real page, both headings at once.</strong> The fault with the current build is not either
    heading on its own: it is that they are not peers. “${esc(content.team.heading)}” is a left-aligned h1 at display size
    with a lead paragraph, while “Leadership” is a small centred h2 — two groups of six people set as though one matters
    more. Every option below treats them the same way.
    <br><br>
    <strong>No option changes a word.</strong> Both headings are client copy and stay exactly as they are.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>One asymmetry cannot be designed away.</strong> The first heading is four words and splits naturally across two
    faces; the second is a single word. It only shows in <span class="font-semibold">script</span>, where “Leadership” goes
    entirely into the brush face with nothing underneath while the first heading gets both. Padding it out would mean
    inventing a lead-in, which is the client's call and not mine.
  </div>

  ${Object.entries(TEAM_HEADINGS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'current' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/th2-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/th2-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[900px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'team-headings.html'), page);
console.log(`built team-headings.html + ${Object.keys(TEAM_HEADINGS).length} frames`);

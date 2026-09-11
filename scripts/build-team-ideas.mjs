// Builds /team-ideas.html — fresh layouts and fresh grounds for the team page,
// as two galleries.
//
// Layouts are all shown on the `solid` ground and grounds are all shown on the
// `index` layout, so each gallery changes one thing. Any layout takes any
// ground EXCEPT fadeWhite, which goes light. All six set a name or a caption
// directly on the ground, so none of them survives it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEAM_LAYOUTS, TEAM_GROUNDS, renderTeamIdea } from '../src/partials/team-ideas.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const LAYOUT_ON = 'solid';
const GROUND_ON = 'index';

// The header renders over the page with no scrim, exactly as the team page
// ships — the scrim would lay 80% ink over the first 288px of every frame.
const wrap = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body style="background:#0d0d0d">
${header(site, '/team.html', { overHero: true, scrim: false })}
${body}
${footer(site)}
<script src="/app.js" defer></script>
</body></html>`;

for (const [k, v] of Object.entries(TEAM_LAYOUTS)) {
  fs.writeFileSync(path.join(dist, `ti-l-${k}.html`), wrap(v.label, renderTeamIdea(site, content, k, LAYOUT_ON)));
}
for (const [k, v] of Object.entries(TEAM_GROUNDS)) {
  fs.writeFileSync(path.join(dist, `ti-g-${k}.html`), wrap(v.label, renderTeamIdea(site, content, GROUND_ON, k)));
}

const gallery = (prefix, set, badge) => Object.entries(set).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${k === 'fadeWhite' ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      ${badge ? badge(k, v) : ''}
      <a href="/${prefix}${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/${prefix}${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[920px] w-full border-0"></iframe>
    </div>
  </section>`).join('');

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meet the Team — layouts &amp; grounds — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Meet the Team — new layouts, new grounds</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Two levers.</strong> Any of the five dark grounds works with any of the six layouts. Layouts are all shown on <span class="font-semibold">solid</span>
    and grounds are all shown on <span class="font-semibold">index</span>, so each gallery changes one thing.
    <br><br>
    <strong>Every ground is black at the top</strong>, so the nav sits on black in all six. Five of them also stay dark all
    the way down — which is what frees the layouts up, because white type is then safe anywhere on the page and a name can
    sit straight on the ground instead of on a tile.
    <br><br>
    These are all new. None of the six layouts is a grid of cards, which is what is there now.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>fadeWhite does not work with any of these six.</strong> It is the ground shipped today, kept here only for
    comparison, and the only one that goes light. Every new layout sets a name or a caption straight onto the ground — in a
    heading, a figcaption or a list row — and all of them go unreadable as the page passes through grey. Any of the five
    dark grounds is fine with any of the six layouts.
    <br><br>
    <strong>Ten of twelve people still have no bio.</strong> Only <span class="font-semibold">bands</span> and
    <span class="font-semibold">stage</span> have a place to put one, and both leave it empty rather than filling it with
    a placeholder — so the gap stays visible to whoever has to close it.
  </div>

  <h2 class="mt-10 font-display text-2xl font-bold">Lever 1 — layout</h2>
  <p class="mt-1 text-sm text-ink-soft">All on the <span class="font-semibold">${esc(LAYOUT_ON)}</span> ground.</p>
  ${gallery('ti-l-', TEAM_LAYOUTS)}

  <h2 class="mt-16 font-display text-2xl font-bold">Lever 2 — ground</h2>
  <p class="mt-1 text-sm text-ink-soft">All on the <span class="font-semibold">${esc(GROUND_ON)}</span> layout.</p>
  ${gallery('ti-g-', TEAM_GROUNDS, (k, v) =>
    v.endsLight ? '<span class="rounded-full border border-amber-400 bg-amber-100 px-3 py-1 font-body text-xs font-semibold">goes light — limits layout</span>' : '<span class="rounded-full bg-ink/5 px-3 py-1 font-body text-xs">stays dark</span>')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'team-ideas.html'), page);
console.log(`built team-ideas.html + ${Object.keys(TEAM_LAYOUTS).length + Object.keys(TEAM_GROUNDS).length} frames`);

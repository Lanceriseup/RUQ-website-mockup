// Builds /team-options.html — dark treatments for the Meet the Team page.
//
// Each frame renders the real header in overHero mode and the chosen footer
// beneath. A whole-page design cannot be judged without the chrome it sits
// between, and the header is the specific problem here: on every page but the
// homepage it renders white with a bottom border, which against a dark page
// would be a hard white band across the top. Shipping any of these means
// letting the team page render its header over the hero, which today only the
// homepage does.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEAM_OPTIONS, renderTeam } from '../src/partials/team-variants.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(TEAM_OPTIONS[key].label)}</title>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body style="background:#101010">
${header(site, '/team.html', { overHero: true })}
${renderTeam(site, content, key)}
${footer(site)}
<script src="/app.js" defer></script>
</body></html>`;

for (const k of Object.keys(TEAM_OPTIONS)) {
  fs.writeFileSync(path.join(dist, `tm-${k}.html`), wrap(k));
}

const m = content.team.members;
const noBio = m.filter(x => !x.bio).length;
const roles = [...new Set(m.map(x => x.role))];

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meet the Team — options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Meet the Team — six dark treatments</h1>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Each frame is the whole page</strong> — real header on top, real footer beneath — because a page design cannot
    be judged without the chrome it sits between.
    <br><br>
    <strong>The header is the catch.</strong> On every page except the homepage it renders white with a bottom border,
    which against a dark page would be a hard white band across the top. These frames show it in over-hero mode, which
    today only the homepage uses. Shipping any of these means letting the team page do the same — a one-line change, but
    it has to be made deliberately.
    <br><br>
    The photographs help: they are already shot dark, warm amber light on near-black. What varies is how far each option
    goes to unify twelve of them against a magenta-and-cyan palette.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>${noBio} of ${m.length} people have no bio.</strong> Only Jessica and Molly have one, so any layout built around
    biography would be ${noBio} empty cards. Most options below use name and role only; <span class="font-semibold">feature</span>
    is the one that shows bios, and it shows them for the two who have them.
    <br><br>
    <strong>Roles are only ${roles.map(r => '“' + esc(r) + '”').join(', ')}</strong> — enough to group by, not enough to caption
    anyone individually.
    <br><br>
    <strong>The page heading does not match the list.</strong> content.json calls it “${esc(content.team.heading)}”, but half
    the people on it are Team rather than coaches and two are men. The options that group by role make that visible instead
    of papering over it. The heading is client copy, so I have left it alone — it probably needs changing.
  </div>

  ${Object.entries(TEAM_OPTIONS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/tm-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/tm-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[900px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'team-options.html'), page);
console.log(`built team-options.html + ${Object.keys(TEAM_OPTIONS).length} frames`);

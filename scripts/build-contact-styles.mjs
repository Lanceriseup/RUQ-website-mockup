// Builds /contact-styles.html — six treatments of the chosen split layout.
//
// Whole pages, not sections: the header renders over this ground with no
// scrim, so a treatment that leaves the wrong room at the top only shows that
// way, and the team page proved that is a real failure mode rather than a
// theoretical one.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTACT_STYLES, renderContactPage } from '../src/partials/contact.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const vids = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(CONTACT_STYLES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-[#0b0b0b]">
${header(site, '/contact.html', { overHero: true, scrim: false })}
${renderContactPage(site, content, vids, key)}
${footer(site)}
<script src="/app.js" defer></script>
</body></html>`;

for (const k of Object.keys(CONTACT_STYLES)) {
  fs.writeFileSync(path.join(dist, `contact-fx-${k}.html`), wrap(k));
}

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact — treatments — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Contact — six treatments of the split layout</h1>
  <p class="mt-2 max-w-3xl text-ink-soft">Same skeleton in all six, because that part is settled: heading, socials and
    Rise Up Kings down the left, the form opposite, the two videos in a band underneath. What changes is how the form is
    dressed — it is the largest object on the page, so almost all of the page's character comes from it.</p>

  <div class="mt-4 rounded-xl bg-magenta-tint p-5 text-sm">
    <strong>Both changes are in all six.</strong> The mockup note above the first field is gone, and the Rise Up Kings
    crest now sits in the partner block — it was already in the asset set as <code>assets.logoParent</code> and had
    never been rendered anywhere on the site. It is gold <code>#c09761</code> on a transparent background, so it drops
    straight onto the plum, and the rule under the block is sampled from the crest itself rather than guessed.
  </div>

  <div class="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>What removing the note costs.</strong> The fields are still <code>disabled</code> — there is still no
    endpoint — but now nothing on the page says so, and disabled styling has been made to look identical to enabled so
    the form does not read as broken. The effect is that someone clicking into a field will find they cannot type, with
    no explanation. That is fine while this is a mockup on localhost and it is <em>not</em> fine on a URL the client
    visits unattended. Switching the form on is dropping the <code>disabled</code> attributes in
    <code>contact-parts.mjs</code> and giving the form a real <code>action</code>.
  </div>

  ${Object.entries(CONTACT_STYLES).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/contact-fx-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/contact-fx-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[1050px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'contact-styles.html'), page);
console.log(`built contact-styles.html + ${Object.keys(CONTACT_STYLES).length} frames`);

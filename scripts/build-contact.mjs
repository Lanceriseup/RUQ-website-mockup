// Builds /contact-options.html — six layouts for the contact page.
//
// Each frame is a whole page, not a section: the header renders over this
// ground with no scrim, exactly as it does on the team page, and a layout
// that leaves the wrong amount of room at the top only shows that way.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTACT_LAYOUTS, renderContact } from '../src/partials/contact-layouts.mjs';
import { header, footer, esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const vids = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

// overHero with no scrim, matching pages.mjs for the team page. The scrim lays
// 80% ink over the first 288px, which on an already-dark page only greys the
// heading out.
const wrap = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(CONTACT_LAYOUTS[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css"><style>body{margin:0}</style></head>
<body class="bg-[#0b0b0b]">
${header(site, '/contact.html', { overHero: true, scrim: false })}
${renderContact(site, content, vids, key)}
${footer(site)}
<script src="/app.js" defer></script>
</body></html>`;

for (const k of Object.keys(CONTACT_LAYOUTS)) {
  fs.writeFileSync(path.join(dist, `contact-${k}.html`), wrap(k));
}

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
  <h1 class="font-display text-3xl font-bold">Contact — six layouts</h1>
  <p class="mt-2 max-w-3xl text-ink-soft">Same ground as Meet the Team — the plum gradient with the spotlight over it,
    imported from that page rather than copied, so the two can never drift apart. Same content as the live contact page
    in all six: heading and lead, the four fields in their order, <em>Submit</em>, Find Us On Socials, the two videos,
    and the Rise Up Kings block.</p>

  <div class="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm">
    <strong>The form is disabled in every option, on purpose.</strong> There is no endpoint: the live page posts to a
    Brizy handler, the Jotform routes were reported broken, and the plan of record was MOS into Ontraport. A form that
    looks live and posts nowhere swallows real enquiries silently, so until one of those is wired the fields stay
    disabled and say so. Wiring it is a one-line change to the <code>action</code> plus dropping the
    <code>disabled</code> attributes.
    <br><br>
    <strong>The social row links three accounts</strong>, as the live page does — Instagram, Facebook, and YouTube. The
    YouTube one is <code>@talkmarriagetome</code>, which is Jessica's own channel rather than a Rise Up Queens one.
    That is what the live contact page links, so it is what these do, but it is worth confirming before the footer
    picks it up too.
  </div>

  <div class="mt-3 rounded-xl bg-cyan-tint p-5 text-sm">
    <strong>The two videos are real.</strong> Their poster frames are downloaded to
    <code>/assets/posters/</code> by <code>npm run posters</code>, so nothing is requested from Google until a visitor
    clicks — and then it opens in the existing lightbox on the nocookie domain, the same one the testimonial rails use.
  </div>

  ${Object.entries(CONTACT_LAYOUTS).map(([k, v]) => `
  <section class="mt-8">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full bg-magenta px-3 py-1 font-body text-xs font-bold text-white">${esc(k)}</span>
      <span class="font-display text-lg font-bold">${esc(v.label)}</span>
      <a href="/contact-${k}.html" target="_blank" rel="noopener" class="rounded-full bg-ink px-4 py-1 text-xs font-semibold text-white">Open ↗</a>
    </div>
    <p class="mt-1 max-w-3xl text-sm text-ink-soft">${esc(v.note)}</p>
    <div class="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-line">
      <iframe src="/contact-${k}.html" title="${esc(v.label)}" loading="lazy" class="block h-[1100px] w-full border-0"></iframe>
    </div>
  </section>`).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'contact-options.html'), page);
console.log(`built contact-options.html + ${Object.keys(CONTACT_LAYOUTS).length} frames`);

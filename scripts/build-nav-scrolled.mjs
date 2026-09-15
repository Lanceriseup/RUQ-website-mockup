// Builds /nav-scrolled.html — the scrolled-state capsule, fixed six ways for
// mobile.
//
// These frames are SCROLLABLE and must be: the capsule only exists past 220px,
// so a static preview of it would be a preview of the one state that is not in
// question. Each frame is a real page — the live compact header, a hero, and
// enough content to scroll — so you scroll inside the phone and watch the
// thing arrive.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderScrolled, SCROLLED_MODES, SCROLLED_JS } from '../src/partials/capsule-mobile.mjs';
import { header } from '../src/partials/nav.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

// Repeated three times in the frame so the page is long enough for option F's
// progress rule to report something other than "nearly done".
// Filler that reads like the real page rather than lorem, so the capsule is
// judged against the contrast it will actually sit over — including the white
// sections, which is where the pill's fill had to go to .65.
const body = `
<section class="bg-white px-5 py-10">
  <h2 class="font-display text-2xl font-bold text-ink">What The Three Days Look Like</h2>
  <p class="mt-3 font-body text-sm leading-relaxed text-ink-soft">Every session is built to move you somewhere, not just to
     inform you. You arrive carrying something; you leave having put it down.</p>
  <p class="mt-3 font-body text-sm leading-relaxed text-ink-soft">The room is small on purpose. You will be known by name
     before the first morning is over, and that is the point — this is not a conference you watch.</p>
</section>
<section class="bg-ink px-5 py-10">
  <h2 class="font-display text-2xl font-bold text-white">Who It Is For</h2>
  <p class="mt-3 font-body text-sm leading-relaxed text-white/70">Women who are done managing the gap between who they are
     and who they know they were made to be.</p>
</section>
<section class="bg-white px-5 py-10">
  <h2 class="font-display text-2xl font-bold text-ink">Why It Works</h2>
  <p class="mt-3 font-body text-sm leading-relaxed text-ink-soft">Because it is not information. It is a room, a week, and a
     set of people who will not let you leave the way you came in.</p>
  <p class="mt-3 font-body text-sm leading-relaxed text-ink-soft">Scroll back up to send the bar away again.</p>
</section>`;

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(SCROLLED_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-ink">
${renderScrolled(site, key)}
<section class="relative overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-60" poster="${esc(site.assets.heroVideo.poster)}"
         src="${esc(site.assets.heroVideo.src)}" autoplay muted loop playsinline aria-hidden="true" tabindex="-1"></video>
  <div class="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/70"></div>
  ${header(site, '/index.html', { overHero: true })}
  <div class="relative px-5 pt-24 pb-10 text-center">
    <p class="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-cyan">${esc(site.nextEvent.dates)} &middot; ${esc(site.nextEvent.location)}</p>
    <h1 class="mt-3 font-display text-[26px] font-extrabold leading-[1.1] text-white">Step Into The Woman<br>God Created You To Be</h1>
    <a href="${esc(site.nextEvent.ctaUrl)}" class="mt-5 inline-flex min-h-11 items-center rounded-full bg-magenta px-7 font-body text-xs font-bold uppercase tracking-[0.2em] text-white">${esc(site.nextEvent.ctaText)}</a>
  </div>
</section>
${body.repeat(3)}
<script src="/app.js" defer></script>
<script>${SCROLLED_JS}</script>
</body></html>`;

const KEYS = Object.keys(SCROLLED_MODES);

// Measured in Chrome at a 390px viewport, where the capsule has 358px of
// width to work in after its px-4 gutters. Recorded rather than computed
// because the whole problem is a number nobody checked.
const MEASURED = {};

const card = (key) => {
  const m = SCROLLED_MODES[key];
  const isBase = key === 'current';
  return `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${isBase ? 'bg-ink-soft' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h2 class="font-display text-base font-bold">${esc(m.label)}</h2>
      <span class="ml-auto font-body text-xs font-semibold tabular-nums ${isBase ? 'text-magenta-text' : 'text-ink-soft'}"></span>
    </div>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(m.note)}</p>
    <!-- Pinned to 390px. Scroll inside it — the capsule does not exist until
         220px down, which is the whole subject of this page. -->
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/navs-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[560px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-ink"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Scrolled nav on mobile — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Scrolled nav — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">On a phone the scrolled bar carries the <strong>wordmark and a burger</strong> — no links, no CTA.
     That is settled, so these six differ only in form: shape, ground, alignment and how the thing arrives. All of them fit
     by construction, because two fixed-size elements cannot overflow the way the shipped 576px pill does.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft"><strong>Scroll inside a frame</strong> to bring its bar in — nothing
     appears until 220px down. Every option is below-sm only; the desktop capsule is untouched in all six.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Each carries its own panel, and Register moved into it. The panel has to
     live here because the header drawer is a child of the header, which has scrolled away by the time the bar exists.</p>

  <div class="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${KEYS.map(card).join('')}
  </div>
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'nav-scrolled.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `navs-${key}.html`), frame(key));
console.log(`built nav-scrolled.html + ${KEYS.length} frames`);

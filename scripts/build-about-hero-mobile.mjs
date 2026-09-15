// Builds /about-hero-mobile.html — the About hero, four ways, plus the fix for
// the overlap defect underneath it. Frames report hero height and, critically,
// the clearance between the dates block and the panel that lifts over it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAboutHero, ABOUT_MODES } from '../src/partials/about-hero-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(ABOUT_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-ink">
${renderAboutHero(site, content, key)}
<script src="/hero-rotate.js" defer></script>
<script>
addEventListener('load', function () {
  var hero = document.getElementById('about-hero');
  var action = document.getElementById('about-action');
  var next = document.getElementById('about-next');
  var ar = action.getBoundingClientRect(), nr = next.getBoundingClientRect();
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(hero.getBoundingClientRect().height),
      clear: Math.round(nr.top - ar.bottom),
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(ABOUT_MODES);

const card = (key) => {
  const m = ABOUT_MODES[key];
  const isBase = key === 'current';
  return `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${isBase ? 'bg-ink' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h2 class="font-display text-base font-bold">${esc(m.label)}</h2>
    </div>
    <p class="mt-1 font-body text-xs font-bold tabular-nums text-ink-soft" data-h="${esc(key)}">measuring…</p>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(m.note)}</p>
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/abh-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[720px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-ink"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About hero — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">About hero — mobile</h1>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>You spotted a real collision, and
     the cause is arithmetic.</strong> The hero ends with <code>pb-16</code> on phones — 64px — and the journey panel that
     follows is lifted over it by <code>-mt-16</code>, a flat &minus;64px at <em>every</em> width. Those cancel exactly:
     <strong>zero clearance</strong>, so the panel's rounded corner lands on the dates block and crops "DALLAS, TX". From
     sm the padding is 112px against the same 64px lift, leaving 48px — which is why it only goes wrong on a phone.</p>
  <p class="mt-3 max-w-3xl text-ink-soft">So the fix is not "add padding". The lift is a fixed pixel value competing with a
     responsive one. A adds clearance by scaling the <em>lift</em>; B onward do the same and then compact the hero, which
     is the direction that makes it shorter rather than taller.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Each frame reports the hero height and the measured clearance between the
     dates block and the panel. All four are mobile-only; the desktop hero and its overlap are untouched.</p>

  <div class="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${KEYS.map(card).join('')}
  </div>
</div>

<script>
(function () {
  var base = null, pending = {};
  function paint(mode, d) {
    var el = document.querySelector('[data-h="' + mode + '"]');
    if (!el) return;
    var cl = ' · clearance ' + d.clear + 'px';
    if (mode === 'current') { el.textContent = 'hero ' + d.h + 'px (baseline)' + cl; }
    else if (base == null) { pending[mode] = d; el.textContent = 'hero ' + d.h + 'px' + cl; }
    else {
      var cut = Math.round((1 - d.h / base) * 100);
      el.textContent = 'hero ' + d.h + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : '') + cl;
    }
    el.className = 'mt-1 font-body text-xs font-bold tabular-nums ' + (d.clear < 12 ? 'text-magenta-text' : 'text-ink-soft');
  }
  addEventListener('message', function (e) {
    var d = e.data;
    if (!d || !d.mode || typeof d.h !== 'number') return;
    if (d.mode === 'current') { base = d.h; for (var k in pending) paint(k, pending[k]); pending = {}; }
    paint(d.mode, d);
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'about-hero-mobile.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `abh-${key}.html`), frame(key));
console.log(`built about-hero-mobile.html + ${KEYS.length} frames`);

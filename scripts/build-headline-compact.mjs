// Builds /headline-compact.html — the homepage headline, compacted five ways
// for mobile.
//
// Each frame is the real hero: the same video, the same vignette and text
// band, the live compact header, the real rotator (so the word is cycling
// while you compare), and the top edge of the VSL frame underneath. That last
// part matters — the headline's height is only interesting because of what it
// pushes down, so every frame shows where the video starts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHeadline, HEADLINE_MODES } from '../src/partials/headline-compact.mjs';
import { header } from '../src/partials/nav.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(HEADLINE_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-ink">
<section class="relative overflow-hidden bg-ink">
  <video class="absolute inset-0 h-full w-full object-cover opacity-50" poster="${esc(site.assets.heroVideo.poster)}"
         autoplay muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
  <!-- The two grounds from hero.mjs, unchanged: the vignette, then the band
       that darkens only where the words are. The headline's magenta stop
       measures 1.99:1 without them. -->
  <div class="absolute inset-0" style="background:radial-gradient(78% 62% at 50% 46%,rgba(28,28,28,.45),rgba(28,28,28,.9) 100%)"></div>
  <div class="absolute inset-0" style="background:linear-gradient(to bottom,rgba(28,28,28,.68) 0%,rgba(28,28,28,0) 34%,rgba(28,28,28,0) 62%,rgba(28,28,28,.58) 100%)"></div>
  ${header(site, '/index.html', { overHero: true })}

  <div class="relative mx-auto max-w-4xl px-4 pb-10 pt-24 text-center">
    <div id="headline">${renderHeadline(content, key)}</div>

    <!-- Stand-in for the VSL. Present so the saving is visible as the video
         moving up, which is the only reason the headline's height matters. -->
    <div class="relative mx-auto mt-10 max-w-4xl">
      <div class="aspect-video w-full rounded-xl bg-ink/70 ring-1 ring-cyan/40"></div>
    </div>
  </div>
</section>

<script src="/hero-rotate.js" defer></script>
<script>
addEventListener('load', function () {
  var h = document.getElementById('headline').firstElementChild;
  var r = h.getBoundingClientRect();
  try { parent.postMessage({ mode: ${JSON.stringify(key)}, h: Math.round(r.height) }, '*'); } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(HEADLINE_MODES);

const card = (key) => {
  const m = HEADLINE_MODES[key];
  const isBase = key === 'current';
  return `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${isBase ? 'bg-ink-soft' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h2 class="font-display text-base font-bold">${esc(m.label)}</h2>
      <span class="ml-auto font-body text-xs font-bold tabular-nums text-ink-soft" data-h="${esc(key)}">measuring…</span>
    </div>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(m.note)}</p>
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/hlc-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[560px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-ink"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Compact headline — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Compact headline — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">The headline block measures about <strong>150px</strong> on a 390px phone, and
     two thirds of that is the two small sans lines and the gaps around them — not the rotating word everyone is actually
     looking at. Five ways to bring it down, shown over the real hero with the word cycling.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Every option is <strong>mobile-only</strong>; each class is paired with an
     sm: value that restores today's desktop hero exactly. Heights are measured live in each frame.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">The grey box under each headline stands in for the VSL — the headline's
     height only matters because of what it pushes down, so watch where that box starts.</p>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>One thing worth knowing before you pick:</strong>
     the closing sentence needs two lines at every size tested. Fitting "woman that God has designed you to be." on one line at
     390px would take roughly 11px type, so no amount of letter-spacing gets there — which is why option B measures identical to A.
     The only route to one line is shorter copy, and that is a decision for you rather than a CSS change.</p>

  <div class="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${KEYS.map(card).join('')}
  </div>
</div>

<script>
(function () {
  var base = null, pending = {};
  function paint(mode, px) {
    var el = document.querySelector('[data-h="' + mode + '"]');
    if (!el) return;
    if (mode === 'current') { el.textContent = px + 'px (baseline)'; return; }
    if (base == null) { pending[mode] = px; el.textContent = px + 'px'; return; }
    var cut = Math.round((1 - px / base) * 100);
    el.textContent = px + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : '');
  }
  addEventListener('message', function (e) {
    var d = e.data;
    if (!d || typeof d.h !== 'number' || !d.mode) return;
    if (d.mode === 'current') {
      base = d.h;
      for (var k in pending) paint(k, pending[k]);
      pending = {};
    }
    paint(d.mode, d.h);
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'headline-compact.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `hlc-${key}.html`), frame(key));
console.log(`built headline-compact.html + ${KEYS.length} frames`);

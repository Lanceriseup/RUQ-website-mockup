// Builds /contact-mobile.html — the contact page, four ways for mobile.
// Reports page height and, just as importantly, how far down the form starts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderContactMobile, CONTACT_MODES } from '../src/partials/contact-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const vids = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(CONTACT_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body style="background:#0b0b0b">
${renderContactMobile(site, content, vids, key)}
<script src="/app.js" defer></script>
<script>
addEventListener('load', function () {
  var s = document.getElementById('contact');
  var form = s.querySelector('form');
  var sr = s.getBoundingClientRect(), fr = form.getBoundingClientRect();
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(sr.height),
      formTop: Math.round(fr.top - sr.top),
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(CONTACT_MODES);

const card = (key) => {
  const m = CONTACT_MODES[key];
  const isBase = key === 'current';
  return `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${isBase ? 'bg-ink-soft' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h2 class="font-display text-base font-bold">${esc(m.label)}</h2>
    </div>
    <p class="mt-1 font-body text-xs font-bold tabular-nums text-ink-soft" data-h="${esc(key)}">measuring…</p>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(m.note)}</p>
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/ctm2-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[780px] w-[390px] max-w-full rounded-[1.25rem] border-0"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Contact — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Desktop is a two-column grid — heading, socials and the Rise Up Kings block on
     the left; the form on the right, both columns ending on the same line. Below lg that grid collapses to one column and
     becomes a reading order. The page measures <strong>2465px</strong> at 390px.</p>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>The order is the real finding.</strong>
     Collapsed, the page reads heading &rarr; socials &rarr; Rise Up Kings &rarr; <em>form</em> &rarr; videos, so a phone
     visitor scrolls past three blocks to reach the only thing on the page that does anything. On desktop the form sits
     level with the heading and needs no scrolling at all. Each frame reports how far down the form starts.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">All four are mobile-only. The two-column desktop layout — including the
     baseline alignment between the columns — is untouched, and the form stays inert in every one.</p>

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
    var f = ' · form at ' + d.formTop + 'px';
    if (mode === 'current') { el.textContent = d.h + 'px (baseline)' + f; return; }
    if (base == null) { pending[mode] = d; el.textContent = d.h + 'px' + f; return; }
    var cut = Math.round((1 - d.h / base) * 100);
    el.textContent = d.h + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : '') + f;
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

fs.writeFileSync(path.join(dist, 'contact-mobile.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `ctm2-${key}.html`), frame(key));
console.log(`built contact-mobile.html + ${KEYS.length} frames`);

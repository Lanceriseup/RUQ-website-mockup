// Builds /cta-mobile.html — the breakthrough CTA, four ways for mobile.
//
// Frames render the real section at 390px and report two numbers: the section
// height, and where the top of the form lands. The second matters as much as
// the first — the form is the only conversion point on the page after the
// hero, and today it sits about 380px below the section's top edge.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCta, CTA_MODES, CTA_JS } from '../src/partials/cta-compact-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(CTA_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
${renderCta(content, key)}
<div class="border-t border-ink/10 bg-white px-6 py-6">
  <p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-cyan-text">Next section starts here</p>
</div>
<script>${CTA_JS}</script>
<script>
addEventListener('load', function () {
  var s = document.getElementById('cta');
  var form = s.querySelector('form');
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(s.getBoundingClientRect().height),
      formTop: Math.round(form.getBoundingClientRect().top - s.getBoundingClientRect().top),
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(CTA_MODES);

const card = (key) => {
  const m = CTA_MODES[key];
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
      <iframe src="/ctm-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[760px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Breakthrough CTA — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">"It's time for your breakthrough" — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">The section runs about <strong>710px</strong> on a 390px phone, and the mission
     paragraph is 40% of it on its own — 391 characters set centred at 18px, which comes to roughly ten lines.</p>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>Two things worth knowing.</strong>
     The 18px was chosen so this paragraph matched the struggles list exactly — but that list is now 16px on phones, so the
     match it was protecting no longer exists below sm. And at 390px, 18px sets only about 42 characters a line; comfortable
     reading is 45&ndash;75, so dropping to 16px moves the measure <em>toward</em> the range rather than away from it. It
     reads better and is shorter.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Each frame reports the section height and <strong>where the form starts</strong>
     — the form is the only conversion point on the page after the hero, and today 380px of heading and prose sit above it.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Copy is verbatim and every word is kept in all four, including D where it
     is behind a control rather than cut. Inputs stay disabled — the form posts nowhere yet. Desktop is untouched throughout.</p>

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
    var form = ' · form at ' + d.formTop + 'px';
    if (mode === 'current') { el.textContent = d.h + 'px (baseline)' + form; return; }
    if (base == null) { pending[mode] = d; el.textContent = d.h + 'px' + form; return; }
    var cut = Math.round((1 - d.h / base) * 100);
    el.textContent = d.h + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : '') + form;
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

fs.writeFileSync(path.join(dist, 'cta-mobile.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `ctm-${key}.html`), frame(key));
console.log(`built cta-mobile.html + ${KEYS.length} frames`);

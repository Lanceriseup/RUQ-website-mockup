// Builds /renewal-compact.html — the "Join us to experience" section, four
// ways for mobile. Frames render the section as it now ships (heading, 3:2
// photograph, three items) at 390px, and report the section height plus
// whether the script heading is wrapping.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderRenewal, RENEWAL_MODES } from '../src/partials/renewal-compact.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(RENEWAL_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
${renderRenewal(content, key)}
<div class="border-t border-ink/10 bg-white px-6 py-8">
  <p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-cyan-text">Next section starts here</p>
</div>
<script>
addEventListener('load', function () {
  var s = document.getElementById('renewal');
  var sc = s.querySelector('.script');
  var r = sc.getBoundingClientRect();
  var lines = Math.round(r.height / (parseFloat(getComputedStyle(sc).fontSize) * 0.9));
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(s.getBoundingClientRect().height),
      lines: lines,
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(RENEWAL_MODES);

const card = (key) => {
  const m = RENEWAL_MODES[key];
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
      <iframe src="/rnc-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[700px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Join us section — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">"Join us to experience" — mobile</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">Shown with the photo order you just approved: heading, group shot at 3:2, then the
     three items. The photograph is settled, so only the heading and the items are in question here.</p>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>Two things the measurements
     surfaced.</strong> First, this heading never got the fix "Common struggles" did — "healing and renewal" is a longer
     string at a fixed 3.75rem, so it still wraps to two lines on a phone, and it will keep doing so until it is made
     unwrappable. Second, the three items carry 28px of padding above <em>and</em> below each block: 168px of the section
     is space around three short paragraphs, sized for a column that sat beside a 655px portrait plate which below lg is
     no longer there.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Each frame reports its height and how many lines the script is taking.
     All four are mobile-only; the desktop spread is untouched. Client copy is verbatim throughout.</p>

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
    var wrap = d.lines > 1 ? ' · heading on ' + d.lines + ' lines' : ' · heading on 1 line';
    if (mode === 'current') { el.textContent = d.h + 'px (baseline)' + wrap; }
    else if (base == null) { pending[mode] = d; el.textContent = d.h + 'px' + wrap; }
    else {
      var cut = Math.round((1 - d.h / base) * 100);
      el.textContent = d.h + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : '') + wrap;
    }
    el.className = 'mt-1 font-body text-xs font-bold tabular-nums ' + (d.lines > 1 ? 'text-magenta-text' : 'text-ink-soft');
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

fs.writeFileSync(path.join(dist, 'renewal-compact.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `rnc-${key}.html`), frame(key));
console.log(`built renewal-compact.html + ${KEYS.length} frames`);

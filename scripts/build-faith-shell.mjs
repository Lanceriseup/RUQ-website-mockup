// Builds /faith-shell.html — how the creed plate meets its wave-edged
// background on a phone. Frames report the section height and, crucially, how
// much wave is hidden behind the plate.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderShell, SHELL_MODES, SHELL_FACTS } from '../src/partials/faith-shell-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Cormorant+Garamond:wght@400;500;600&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(SHELL_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
<div class="bg-white px-6 py-6"><p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-cyan-text">Section above</p></div>
${renderShell(content, key)}
<div class="bg-white px-6 py-6"><p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-magenta-text">Section below</p></div>
<script>
(function () {
  var btn = document.getElementById('faith-beliefs-more');
  var list = document.getElementById('faith-beliefs');
  if (btn && list) {
    var label = btn.querySelector('[data-faith-label]');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      list.classList.toggle('hidden', open);
      if (label) label.textContent = open ? 'Read the full statement' : 'Show less';
    });
  }
})();
addEventListener('load', function () {
  var s = document.getElementById('faith-shell');
  var plate = s.querySelector('div[style*="F6F1E8"]');
  var svg = s.querySelector('svg:not(.hidden)');
  var sr = s.getBoundingClientRect(), pr = plate.getBoundingClientRect();
  var deepest = svg ? (svg.getBoundingClientRect().height * 0.60 + (svg.getBoundingClientRect().height > 80 ? 19 : 10)) : 0;
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(sr.height),
      padTop: Math.round(pr.top - sr.top),
      overlap: Math.max(0, Math.round(deepest - (pr.top - sr.top))),
      plateW: Math.round(pr.width),
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(SHELL_MODES);

const card = (key) => {
  const m = SHELL_MODES[key];
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
      <iframe src="/fsh-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[720px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Creed plate and background — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Creed plate against its background — mobile</h1>
  <p class="mt-4 max-w-3xl rounded-xl bg-ink/5 px-4 py-3 text-sm text-ink"><strong>This is a defect I introduced, and it is
     worth naming.</strong> The section's edges are 110px SVG waves, and faith.mjs states the constraint outright: the
     tinted band reaches <strong>${SHELL_FACTS.deepestBig}px</strong> and "py-28 clears it by 27px". When I compacted the
     section I set that padding to 40px without honouring it, so <strong>63px of wave now runs behind the plate</strong> at
     each edge. Nothing is obscured — the plate paints on top — but the band never gets to be seen, the photograph barely
     registers, and the plate reads as jammed into the section rather than laid on it.</p>
  <p class="mt-3 max-w-3xl text-ink-soft">A fixes it by giving the padding back. B fixes it by questioning the 110px
     instead: that figure was chosen against a 1440px desktop section, and at 390px the same edge is proportionally almost
     three times as tall. Scaled to 60px its band reaches only ${SHELL_FACTS.deepestSmall}px, so py-14 clears it and the
     section stays short.</p>
  <p class="mt-3 max-w-3xl text-ink-soft">C, D and E also settle a question the defect exposed: the plate currently leaves
     24px of background either side, which is too narrow to read as a frame and too wide to read as deliberate.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Each frame reports the section height, the padding above the plate, and
     how much wave is hidden behind it. All five are mobile-only; the desktop section is untouched.</p>

  <div class="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${KEYS.map(card).join('')}
  </div>
</div>

<script>
addEventListener('message', function (e) {
  var d = e.data;
  if (!d || !d.mode || typeof d.h !== 'number') return;
  var el = document.querySelector('[data-h="' + d.mode + '"]');
  if (!el) return;
  el.textContent = 'section ' + d.h + 'px · plate top ' + d.padTop + 'px · plate ' + d.plateW + 'px wide · ' +
    (d.overlap > 0 ? d.overlap + 'px of wave hidden' : 'wave fully visible');
  el.className = 'mt-1 font-body text-xs font-bold tabular-nums ' + (d.overlap > 0 ? 'text-magenta-text' : 'text-ink-soft');
});
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'faith-shell.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `fsh-${key}.html`), frame(key));
console.log(`built faith-shell.html + ${KEYS.length} frames`);

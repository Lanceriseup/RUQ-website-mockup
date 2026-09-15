// Builds /contact-form.html — variants of option B with the form compacted
// and the tail reordered. Reports form height and where it starts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderContactForm, FORM_MODES } from '../src/partials/contact-form-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const vids = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(FORM_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body style="background:#0b0b0b">
${renderContactForm(site, content, vids, key)}
<script src="/app.js" defer></script>
<script>
addEventListener('load', function () {
  var s = document.getElementById('contact');
  var f = s.querySelector('form');
  var sr = s.getBoundingClientRect(), fr = f.getBoundingClientRect();
  try {
    parent.postMessage({
      mode: ${JSON.stringify(key)},
      h: Math.round(sr.height),
      formH: Math.round(fr.height),
      formTop: Math.round(fr.top - sr.top),
    }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(FORM_MODES);

const card = (key) => {
  const m = FORM_MODES[key];
  const isBase = key === 'b0';
  return `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${isBase ? 'bg-ink-soft' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h2 class="font-display text-base font-bold">${esc(m.label)}</h2>
    </div>
    <p class="mt-1 font-body text-xs font-bold tabular-nums text-ink-soft" data-h="${esc(key)}">measuring…</p>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(m.note)}</p>
    ${key === 'b2' || key === 'b3' ? `
    <p class="mt-2 rounded-lg bg-ink/5 p-3 text-[13px] leading-relaxed text-ink"><strong>Caveat:</strong> a placeholder is
       not a label. It disappears the moment someone types, so anyone interrupted mid-form loses the only visible cue about
       what the field wanted — and "Phone" beside "Name" is exactly the pair people come back to unsure about. The real
       label is kept as sr-only markup so screen readers and autofill are unaffected, and the visible label returns at sm.
       Worth 96px, but it is a trade, not a free win.</p>` : ''}
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/ctf-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[780px] w-[390px] max-w-full rounded-[1.25rem] border-0"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact form — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Contact form — compact variants of B</h1>
  <p class="mt-3 max-w-3xl text-ink-soft">All four carry the tail order you asked for: <strong>form &rarr; Rise Up Kings
     &rarr; socials &rarr; videos</strong>. What changes between them is the form.</p>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>Where the form's 514px actually
     goes.</strong> Not the inputs: labels and their margins are 24px &times; 4 = <strong>96px</strong>, the gaps between
     fields are 20px &times; 5 = <strong>100px</strong>, and the message box is 5 rows = <strong>~130px</strong>. That is
     over 300px of the 514 spent on spacing and a textarea sized for a desktop column, around four inputs totalling 138px.
     Each variant takes one of those, in order of how safe it is.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">Mobile-only throughout; the desktop form and the two-column page layout
     are untouched, and the form stays inert in every one.</p>

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
    var t = 'form ' + d.formH + 'px · starts at ' + d.formTop + 'px · page block ' + d.h + 'px';
    if (mode === 'b0') { el.textContent = t + ' (baseline)'; return; }
    if (base == null) { pending[mode] = d; el.textContent = t; return; }
    var cut = Math.round((1 - d.formH / base) * 100);
    el.textContent = t + (cut > 0 ? ' · form ' + cut + '% shorter' : '');
  }
  addEventListener('message', function (e) {
    var d = e.data;
    if (!d || !d.mode || typeof d.h !== 'number') return;
    if (d.mode === 'b0') { base = d.formH; for (var k in pending) paint(k, pending[k]); pending = {}; }
    paint(d.mode, d);
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'contact-form.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `ctf-${key}.html`), frame(key));
console.log(`built contact-form.html + ${KEYS.length} frames`);

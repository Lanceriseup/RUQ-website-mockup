// Builds /contact-tune.html — two independent decisions on one page:
// the form's remaining height, and the socials block.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderFormTune, FORM_TUNE, renderSocialTune, SOCIAL_TUNE } from '../src/partials/contact-tune.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';
const GROUND = 'linear-gradient(180deg,#0b0b0b 0%,#130c11 45%,#220d19 100%)';

const shell = (key, inner, id) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}"><link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body style="background:${GROUND}">
<div class="px-4 py-6">${inner}</div>
<script>
addEventListener('load', function () {
  var el = document.getElementById(${JSON.stringify(id)});
  try { parent.postMessage({ mode: ${JSON.stringify(key)}, h: Math.round(el.getBoundingClientRect().height) }, '*'); } catch (e) {}
});
</script></body></html>`;

for (const k of Object.keys(FORM_TUNE)) fs.writeFileSync(path.join(dist, `cqf-${k}.html`), shell(k, renderFormTune(content, k), 'formwrap'));
for (const k of Object.keys(SOCIAL_TUNE)) fs.writeFileSync(path.join(dist, `cqs-${k}.html`), shell(k, renderSocialTune(site, k), 'soc'));

const card = (k, m, prefix, h) => `
  <article class="flex flex-col">
    <div class="flex flex-wrap items-baseline gap-3">
      <span class="rounded-full ${/^(f0|s0)$/.test(k) ? 'bg-ink-soft' : 'bg-magenta'} px-3 py-1 font-body text-xs font-bold text-white">${esc(m.label.split(' ')[0])}</span>
      <h3 class="font-display text-base font-bold">${esc(m.label)}</h3>
    </div>
    <p class="mt-1 font-body text-xs font-bold tabular-nums text-ink-soft" data-h="${esc(k)}">measuring…</p>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">${esc(m.note)}</p>
    <div class="mt-3 mx-auto w-[406px] max-w-full overflow-hidden rounded-[1.75rem] bg-ink p-2 ring-1 ring-ink-line">
      <iframe src="/${prefix}-${esc(k)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[${h}px] w-[390px] max-w-full rounded-[1.25rem] border-0"></iframe>
    </div>
  </article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact tuning — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}"><link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">Contact — form size and socials</h1>
  <p class="mt-2 text-ink-soft">The heading and lead are already centred on the live page. Two decisions left, kept apart.</p>

  <h2 class="mt-10 font-display text-2xl font-bold">1. The form</h2>
  <p class="mt-3 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>B1 is 422px. Where the rest of it
     is:</strong> labels and their margins 24px &times; 4 = <strong>96px</strong>, the three inputs <strong>138px</strong>,
     the message box <strong>~110px</strong>, gaps <strong>60px</strong>, submit <strong>50px</strong>. Only 138px is the
     inputs themselves — everything else is packaging, and each option takes one layer of it.</p>

  <div class="mt-6 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${Object.entries(FORM_TUNE).map(([k, m]) => card(k, m, 'cqf', 520)).join('')}
  </div>

  <h2 class="mt-16 font-display text-2xl font-bold">2. The socials</h2>
  <p class="mt-3 max-w-3xl text-ink-soft">All four are centred below sm and larger than the 48px tiles on the page now.
     They differ in what the extra size is spent on.</p>

  <div class="mt-6 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
    ${Object.entries(SOCIAL_TUNE).map(([k, m]) => card(k, m, 'cqs', 260)).join('')}
  </div>
</div>

<script>
(function () {
  var base = {};
  addEventListener('message', function (e) {
    var d = e.data; if (!d || !d.mode || typeof d.h !== 'number') return;
    var el = document.querySelector('[data-h="' + d.mode + '"]');
    if (!el) return;
    var group = d.mode[0];
    if (d.mode === 'f0' || d.mode === 's0') { base[group] = d.h; el.textContent = d.h + 'px (baseline)'; return; }
    var b = base[group];
    if (!b) { el.textContent = d.h + 'px'; return; }
    var cut = Math.round((1 - d.h / b) * 100);
    el.textContent = d.h + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : cut < 0 ? ' — ' + Math.abs(cut) + '% taller' : '');
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'contact-tune.html'), page);
console.log(`built contact-tune.html + ${Object.keys(FORM_TUNE).length + Object.keys(SOCIAL_TUNE).length} frames`);

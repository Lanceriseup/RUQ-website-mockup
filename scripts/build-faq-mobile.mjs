// Builds /faq-mobile.html — the About FAQs, four ways for mobile.
// Reports section height and how many questions wrap to two lines, which is
// the number the question type is actually chosen against.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderFaqMobile, FAQ_MODES } from '../src/partials/faq-mobile.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');

const FONTS = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap';

const frame = (key) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(FAQ_MODES[key].label)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
<style>body{margin:0}</style></head>
<body class="bg-white">
${renderFaqMobile(content, key)}
<div class="border-t border-ink/10 bg-white px-6 py-6"><p class="font-body text-xs font-bold uppercase tracking-[0.2em] text-cyan-text">Next section starts here</p></div>
<script>
addEventListener('load', function () {
  var s = document.getElementById('faqs');
  // Count questions taking more than one line: compare rendered height to a
  // single line box for that font-size.
  var qs = [].slice.call(s.querySelectorAll('summary, h3')).filter(function (q) { return q.offsetParent !== null; });
  var wrapped = 0;
  qs.forEach(function (q) {
    var fs = parseFloat(getComputedStyle(q).fontSize);
    if (q.getBoundingClientRect().height > fs * 1.6) wrapped++;
  });
  try {
    parent.postMessage({ mode: ${JSON.stringify(key)}, h: Math.round(s.getBoundingClientRect().height), wrapped: wrapped, total: qs.length }, '*');
  } catch (e) {}
});
</script>
</body></html>`;

const KEYS = Object.keys(FAQ_MODES);

const card = (key) => {
  const m = FAQ_MODES[key];
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
      <iframe src="/faqm-${esc(key)}.html" title="${esc(m.label)}" loading="lazy"
              class="block h-[760px] w-[390px] max-w-full rounded-[1.25rem] border-0 bg-white"></iframe>
    </div>
  </article>`;
};

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FAQs — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-white font-body text-ink">
<div class="mx-auto max-w-content px-4 py-10">
  <h1 class="font-display text-3xl font-bold">FAQs — mobile</h1>
  <p class="mt-4 max-w-3xl rounded-xl bg-magenta-tint px-4 py-3 text-sm text-ink"><strong>The file that builds this section
     already argues with itself.</strong> faq-variants.mjs describes its own "open" option as: <em>"All seven answers are
     under 170 characters, so hiding them buys almost no height and costs a click each."</em> That matters here, because it
     means the disclosure is not really a compaction device on this content — the longest answer is 165 characters, two are
     under 60, and the height it saves is bought with seven taps.</p>
  <p class="mt-3 max-w-3xl text-ink-soft">So A and B keep the disclosure and make the closed list genuinely tight; C and D
     spend some of that height on not making people tap. The lever that matters most is the question type: at 18px in a
     342px column <strong>four of the seven questions wrap to two lines</strong>; at 16px only one does, and each avoided
     wrap is 24px across seven rows. Each frame reports its own wrap count.</p>
  <p class="mt-2 max-w-3xl text-sm text-ink-soft">All four are mobile-only; the desktop list is untouched and the copy is
     verbatim throughout.</p>

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
    var w = ' · ' + d.wrapped + ' of ' + d.total + ' questions wrap';
    if (mode === 'current') { el.textContent = d.h + 'px (baseline)' + w; return; }
    if (base == null) { pending[mode] = d; el.textContent = d.h + 'px' + w; return; }
    var cut = Math.round((1 - d.h / base) * 100);
    el.textContent = d.h + 'px' + (cut > 0 ? ' — ' + cut + '% shorter' : ' — ' + Math.abs(cut) + '% taller') + w;
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

fs.writeFileSync(path.join(dist, 'faq-mobile.html'), page);
for (const key of KEYS) fs.writeFileSync(path.join(dist, `faqm-${key}.html`), frame(key));
console.log(`built faq-mobile.html + ${KEYS.length} frames`);

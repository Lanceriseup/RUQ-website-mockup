// Builds /faith-layout-options.html — layouts for the Statement of Faith's
// mission, after the paragraph under the lead sentence was found too narrow
// ("compacted in the middle") at 38rem.
//
// Each option is the real homepage with a small CSS override on the shipped
// section; nothing else changes. Desktop is where they differ — below 760px
// every option stacks the same way. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!home.includes('data-fs')) throw new Error('build-faith-layout: the faith section was not found in dist/index.html');

const lg = (css) => `@media (min-width:760px){${css}}`;

const OPTIONS = {
  now: {
    label: 'Now',
    note: 'For reference — the paragraph held to 38rem, so it sits in a narrow column under a wider lead sentence.',
    css: '',
  },
  wide: {
    label: 'A — Same width as the lead',
    note: 'The paragraph opens out to the full width of the lead sentence above it and steps up a touch in size, so the two lines of copy share one edge and the block reads as a single, even shape. The simplest fix.',
    pick: true,
    css: lg('#faith .fs-lead{max-width:50rem}#faith .fs-rest{max-width:50rem;font-size:18px}'),
  },
  justify: {
    label: 'B — Squared block',
    note: 'The paragraph is set wide and justified, so every line runs the full width and only the last line centres. A short teal rule separates it from the lead. Formal, like a printed statement.',
    css: lg(`#faith .fs-rest{position:relative;max-width:50rem;margin-top:30px;padding-top:26px;font-size:17.5px;text-align:justify;text-align-last:center;hyphens:none}
      #faith .fs-rest::before{content:"";position:absolute;left:50%;top:0;width:56px;height:2px;border-radius:2px;transform:translateX(-50%);background:linear-gradient(90deg,#00b9c6,#7cd6dc)}`),
  },
  columns: {
    label: 'C — Two columns',
    note: 'The paragraph splits into two left-aligned columns beneath the lead, divided by a fine teal line — the layout of a magazine page. Uses the width without making any line too long to read.',
    css: lg(`#faith .fs-rest{max-width:54rem;margin-top:26px;columns:2;column-gap:56px;column-rule:1px solid rgba(0,185,198,.35);text-align:left;font-size:17px}`),
  },
  split: {
    label: 'D — Lead beside the paragraph',
    note: 'The heading stays centred above; beneath it the lead sentence sits on the left in large serif, and the paragraph on the right, separated by a teal line. The widest of the four, and the most editorial.',
    css: `@media (min-width:960px){
      #faith .fs-in{max-width:72rem;display:grid;grid-template-columns:1fr 1fr;column-gap:56px;align-items:center}
      #faith .fs-script,#faith .fs-title,#faith .fs-acc{grid-column:1/-1}
      #faith .fs-lead{margin:40px 0 0;max-width:none;text-align:right}
      #faith .fs-rest{margin:40px 0 0;max-width:none;padding-left:40px;border-left:2px solid rgba(0,185,198,.45);text-align:left;font-size:17.5px}
      #faith .fs-acc{margin-top:44px}}`,
  },
};

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `fl-${k}.html`), home
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${o.css}</style></head>`)
    .replace('</body>', `<script>addEventListener('load',function(){var s=document.getElementById('faith');if(s)scrollTo(0,s.getBoundingClientRect().top+scrollY+40);});</script></body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : k === 'now' ? ' now' : ''}">${o.pick ? 'Recommended' : k === 'now' ? 'Current' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/fl-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="720"><iframe src="/fl-${k}.html" title="${esc(o.label)}" loading="lazy" width="1440" height="720"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="760"><iframe src="/fl-${k}.html" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="760"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Statement of Faith layout — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:820px; margin:10px 0 0; }
.opt { margin-top:52px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:820px; font-size:15px; }
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; }
.links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.now { background:var(--soft); } .tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 280px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:280px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Statement of Faith — mission layout</h1>
  <p class="lead">Already applied in every option, including “Now”: “the” is no longer coloured — the highlight starts at
     “unshakable” — and the highlights are teal instead of pink. These differ only in how the paragraph under the lead
     sentence is laid out.</p>
  ${Object.entries(OPTIONS).map(([k, o]) => card(k, o)).join('')}
</div>
<script>
(function () {
  var screens = [].slice.call(document.querySelectorAll('.screen'));
  function fit() {
    screens.forEach(function (s) {
      var w = +s.dataset.w, h = +s.dataset.h, k = s.clientWidth / w;
      s.style.height = Math.round(h * k) + 'px';
      s.querySelector('iframe').style.transform = 'scale(' + k + ')';
    });
  }
  addEventListener('resize', fit); fit();
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'faith-layout-options.html'), page);
console.log('built dist/faith-layout-options.html + ' + Object.keys(OPTIONS).length + ' frames');

// Builds /struggles-gap-options.html — ways to close the gap between the
// Common Struggles heading and item 01 on desktop.
//
// Where the gap comes from: from lg the struggles grid has the heading in row
// one, the list in row two, and the photograph spanning both. The photograph
// is a fixed 4:5, taller than heading and list together, and a grid shares a
// spanning item's surplus height across every auto row it crosses — so row
// one grows taller than the heading and pushes the list down.
//
// Desktop only: below lg the grid is one column, nothing spans, and there is
// no gap. Each option is the real homepage with a small override. Must run
// after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!home.includes('id="struggles"')) throw new Error('build-struggles-gap: #struggles not found in dist/index.html');

// Row two takes the surplus instead of sharing it, so the heading row is only
// as tall as the heading.
const ROWS = '#struggles .st-grid{grid-template-rows:auto 1fr}';
const lg = (css) => `@media (min-width:1024px){${css}}`;
// The renewal photograph below is lifted 6rem (lg:-mt-24) into this section,
// into the space the list used to leave empty. Options that carry the list
// lower must clear that lift, or the photograph lands on items 05–06.
const CLEAR = '#struggles{padding-bottom:calc(3rem + 6rem)}';

const OPTIONS = {
  now: {
    label: 'Before',
    note: 'For reference — the photograph’s extra height is shared between the heading row and the list row, so item 01 starts well below the heading.',
    // B ships, so the original shared-surplus rows are put back here.
    css: lg('#struggles .st-grid{grid-template-rows:auto auto}'),
  },
  fit: {
    label: 'A — Photo fits the words',
    note: 'The photograph takes exactly the height of the heading and the list together instead of a fixed shape, so its top lines up with the heading and its bottom with item 06. No empty space anywhere; the crop simply gets a little squarer.',
    pick: true,
    css: lg(`${ROWS}
      #struggles .st-plate>div{height:100%}
      #struggles .st-plate img{position:absolute;inset:0;height:100%;aspect-ratio:auto}${CLEAR}`),
  },
  start: {
    label: 'B — List follows the heading',
    note: 'The list starts straight after the heading with the normal 48px between them. The photograph keeps its full portrait shape, and the space it leaves below item 06 is where the Join Us photograph already rises into — the overlap the spread was designed around. The smallest change.',
    css: lg(ROWS),
  },
  even: {
    label: 'C — Even rhythm',
    note: 'Item 01 starts after the heading, and the six items spread out evenly so the last one lands level with the bottom of the photograph. The space is still there, but shared between the items so it reads as breathing room.',
    css: lg(`${ROWS}
      #struggles .st-list{display:flex;flex-direction:column}
      #struggles .st-list ul{flex:1;display:flex;flex-direction:column;justify-content:space-between}
      #struggles .st-list ul>li{margin-top:0!important}${CLEAR}`),
  },
  centre: {
    label: 'D — Centred list',
    note: 'The list sits in the middle of the space beside the photograph, so the gap is split evenly above and below it.',
    css: lg(`${ROWS}#struggles .st-list{align-self:center;margin-top:0}${CLEAR}`),
  },
};

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `sg-${k}.html`), home
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${o.css}</style></head>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : k === 'now' ? ' now' : ''}">${k === 'start' ? 'Live' : o.pick ? 'Recommended' : k === 'now' ? 'Before' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/sg-${k}.html#struggles" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/sg-${k}.html#struggles" title="${esc(o.label)} at 1440" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure><div class="screen" data-w="1100" data-h="800"><iframe src="/sg-${k}.html#struggles" title="${esc(o.label)} at 1100" loading="lazy" width="1100" height="800"></iframe></div><figcaption>Laptop · 1100 × 800</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Common Struggles gap — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1360px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:860px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:860px; font-size:15px; }
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; }
.links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.now { background:var(--soft); } .tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1.3fr 1fr; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Common Struggles — closing the gap</h1>
  <p class="lead">The gap happens because the photograph beside the list is taller than the heading and the list together,
     and the extra height gets shared out — including above item 01. Four ways to deal with it, each in the real homepage
     with the new embrace photograph. Desktop only: on phones the photo sits between heading and list, so there is no gap.</p>
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

fs.writeFileSync(path.join(dist, 'struggles-gap-options.html'), page);
console.log('built dist/struggles-gap-options.html + ' + Object.keys(OPTIONS).length + ' frames');

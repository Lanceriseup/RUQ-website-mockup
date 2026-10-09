// Builds /plate-size-options.html — sizing options for the two photographs in
// the Common Struggles / Healing and Renewal spread on the homepage, which the
// client felt were too big.
//
// Each option renders the spread (src/partials/spread.mjs) with different
// plate sizing and swaps it into the built homepage as /platesize-<key>.html.
// Desktop only: below lg both plates are already a compact 3:2 and are not
// changed by any option.
//
// The class strings below are written out in full on purpose: Tailwind scans
// this file, and a class assembled at runtime would never be generated.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { spread } from '../src/partials/spread.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');

// Sizes are each photo at a 1440px-wide window.
const OPTIONS = {
  now: {
    label: 'Before, for comparison',
    size: '524 × 655 px',
    note: 'The spread before the change: each photo fills half the width at a tall 4:5 portrait crop, and the renewal photo lifts up beside the end of the struggles list.',
    o: { stCols: 'lg:grid-cols-[6fr_6fr]', rnCols: 'lg:grid-cols-[6fr_6fr]', lift: 'xl:-mt-24' },
  },
  square: {
    label: 'A — Square',
    size: '524 × 524 px · 20% shorter',
    note: 'Same width, cropped square instead of tall. The layout and the half-and-half balance stay exactly as they are; the photos just stop running so far down the page.',
    o: { aspect: 'lg:aspect-square', lift: '' },
  },
  narrow: {
    label: 'B — Narrower column',
    size: '437 × 546 px · 17% smaller each way',
    note: 'Keeps the portrait shape but gives the text more of the width (7 to 5), so each photo is narrower and shorter and the lists and headings get more room.',
    o: { stCols: 'lg:grid-cols-[7fr_5fr]', rnCols: 'lg:grid-cols-[5fr_7fr]', lift: '' },
    pick: true,
    chosen: true,
  },
  landscape: {
    label: 'C — Landscape',
    size: '524 × 393 px · 40% shorter',
    note: 'Same width at a 4:3 landscape crop. The biggest cut in height while keeping the photos wide; more of each photo’s scene shows, and the text column sets the height of the section instead.',
    o: { aspect: 'lg:aspect-[4/3]', lift: '' },
  },
  compact: {
    label: 'D — Compact square',
    size: '437 × 437 px · a third smaller each way',
    note: 'The narrower column and the square crop together: the smallest option, where the photos become accents beside the text rather than the main event.',
    o: { stCols: 'lg:grid-cols-[7fr_5fr]', rnCols: 'lg:grid-cols-[5fr_7fr]', aspect: 'lg:aspect-square', lift: '' },
  },
};

// The two sections of the spread: struggles, then renewal.
const sectionsRe = /<section id="struggles"[\s\S]*?<\/section>[\s\S]*?<\/section>/;
const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!sectionsRe.test(base)) throw new Error('build-plate-size-options: spread not found in dist/index.html');

for (const [k, opt] of Object.entries(OPTIONS)) {
  const html = spread(site, c, '', opt.o).match(sectionsRe)[0];
  fs.writeFileSync(path.join(dist, `platesize-${k}.html`), base
    .replace(sectionsRe, () => html)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Photo size — ${esc(opt.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : k === 'now' ? ' now' : ''}">${o.chosen ? 'Chosen' : k === 'now' ? 'Before' : 'Option'}</span>
  <h2>${esc(o.label)} <small>${esc(o.size)}</small></h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/platesize-${k}.html#struggles" target="_blank" rel="noopener">Open on the homepage ↗</a></p>
  <figure><div class="screen" data-w="1440" data-h="1560"><iframe src="/platesize-${k}.html#struggles" title="${esc(o.label)}" loading="lazy" width="1440" height="1560"></iframe></div><figcaption>Desktop · 1440 wide · scrolls</figcaption></figure>
</article>`;

fs.writeFileSync(path.join(dist, 'plate-size-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Spread photo sizes — options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1100px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:860px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.opt h2 small { font:700 13px Montserrat, sans-serif; color:var(--magenta); margin-left:8px; letter-spacing:.02em; }
.note { color:var(--soft); margin:4px 0 0; max-width:860px; font-size:15px; }
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; } .links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.tag.now { background:#777; }
figure { margin:14px 0 0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#fff; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Common Struggles / Healing and Renewal — photo sizes</h1>
  <p class="lead">Four smaller sizes for the two photographs in this spread, with today’s for comparison at the top.
     Sizes are each photo on a 1440px-wide screen. These change desktop and tablet only: on phones both photos are
     already a compact landscape crop and stay as they are. In today’s design the renewal photo lifts up beside the
     end of the struggles list; with shorter photos there is no longer room for that, so the options drop the lift.
     The live site has not changed yet.</p>
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
</body></html>`);
console.log('built dist/plate-size-options.html + frames for all options');

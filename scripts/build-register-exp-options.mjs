// Builds /register-exp-options.html: "What you'll experience" moved up on the
// checkout page, above the What's included, Attendance and Hotel & travel
// blurbs (the client's ask, 2026-11-05), in four designs. Frames are the
// built /register.html with <main> swapped, /rge-<key>.html. Markup
// register() in src/partials/register/split.mjs (its `exp`); styles at the
// end of src/styles/explore/reg-split.css.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { register } from '../src/partials/register/split.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');

const OPTIONS = {
  last: { label: 'Before', note: '“What you’ll experience” at the bottom, after every detail card, as it was.' },
  up: { chosen: true, label: 'X1 — Moved up', note: 'The same card, moved up under Location, with a soft pink edge so it reads as the highlight. The three blurbs follow as they are. The simplest change.' },
  open: { label: 'X2 — On the photograph', note: 'Moved up and out of its card: “What you’ll experience” in large white script with a pink glow, straight on the photo, the three promises numbered 01 to 03 in a pink-to-teal gradient with fine lines between. It stands apart from the practical cards below, so it reads as the reason to come.' },
  pillars: { label: 'X3 — Three tiles', note: 'Moved up as three glass tiles side by side, each with a pink-to-teal numbered circle, its promise and its line, under the script heading. Quick to scan. On a phone the tiles stack.' },
  know: { label: 'X4 — Moved up, details gathered', note: 'The card moved up with its pink edge, and the three practical blurbs gathered under it into one quieter “Good to know” card, as rows with small icons. The page gets shorter, and the experience clearly leads.' },
};

const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const base = fs.readFileSync(path.join(dist, 'register.html'), 'utf8');
if (!mainRe.test(base)) throw new Error('build-register-exp-options: main not found in dist/register.html');
for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `rge-${k}.html`), base
    .replace(mainRe, () => `<main id="main">${register(site, c, { exp: k })}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Checkout — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${k === 'last' ? ' now' : ''}">${k === 'last' ? 'Before' : o.chosen ? 'Chosen' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/rge-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1500"><iframe src="/rge-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1500"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/rge-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'register-exp-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Checkout — What you’ll experience — options — ${esc(site.brand.name)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:860px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:860px; font-size:15px; }
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; } .links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.now { background:#777; }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 280px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:280px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#fff; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Checkout — “What you’ll experience” moved up</h1>
  <p class="lead">“What you’ll experience” moved above the What’s included, Attendance and Hotel &amp; travel blurbs,
     in four designs, with today’s for comparison. Location stays with the date at the top. Every option has the
     page in Lato and a countdown for each date (pick the September date to see its own). Each preview is the real
     checkout page; scroll inside it.</p>
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
console.log('built dist/register-exp-options.html + frames rge-*.html');

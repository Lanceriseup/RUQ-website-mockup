// Builds /register-type-options.html: the checkout page's title, "3-Day
// Full Intensive Event", in the site's own type instead of Cormorant
// Garamond, which the client called "a random font" (2026-11-05). Frames are
// the built /register.html with a class on .rg-spl, /rgt-<key>.html. Styles
// at the end of src/styles/explore/reg-split.css.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');

const OPTIONS = {
  now: { label: 'As it is now', note: 'Cormorant Garamond, the serif the client flagged, for comparison. It also sets the step headings, prices and countdown.' },
  caps: { label: 'T1 — Bold capitals', note: 'Heavy Lato capitals, spaced out: the same voice as “UNAPOLOGETIC. FREE. FEMININE.” on the homepage and the titles of the policy pages. Strong, and clearly part of the site.' },
  bold: { label: 'T2 — Bold', note: 'Heavy Lato as written, large and tight, like “Is Your Husband Interested?” on the Contact page. The most direct.' },
  pair: { label: 'T3 — Bold and light', note: '“3-Day” in heavy Lato, then “Full Intensive Event” in light Lato. The contrast gives it an elegant, editorial feel while staying in the site’s font.' },
  all: { chosen: true, label: 'T4 — The whole page in Lato', note: 'T1’s title, and every other Cormorant and Montserrat piece on the checkout too (step headings, the price, the total, the countdown, the labels), so nothing on the page is off-brand. The script stays. Recommended: the client is likely to notice the other serif pieces next.' },
};

// register.html is in T4 since it was chosen; the frames start from the page
// without it, so "As it is now" still shows the serif for comparison.
const base = fs.readFileSync(path.join(dist, 'register.html'), 'utf8').replace('<section class="rg-spl rgs-t-all', '<section class="rg-spl');
if (!/<section class="rg-spl[ "]/.test(base)) throw new Error('build-register-type-options: .rg-spl not found in dist/register.html');
const title = esc(c.register.title);
if (!base.includes(`class="rgs-h1">${title}</h1>`)) throw new Error('build-register-type-options: title not found');
for (const [k, o] of Object.entries(OPTIONS)) {
  let html = base.replace(/<title>[\s\S]*?<\/title>/, `<title>Checkout title — ${esc(o.label)} — ${esc(site.brand.name)}</title>`);
  if (k !== 'now') html = html.replace('<section class="rg-spl', `<section class="rg-spl rgs-t-${k}`);
  if (k === 'pair') html = html.replace(`class="rgs-h1">${title}</h1>`, () => {
    const [a, ...b] = c.register.title.split(' ');
    return `class="rgs-h1"><span class="rgs-h1a">${esc(a)}</span> ${esc(b.join(' '))}</h1>`;
  });
  fs.writeFileSync(path.join(dist, `rgt-${k}.html`), html);
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${k === 'now' ? ' now' : ''}">${k === 'now' ? 'Before' : o.chosen ? 'Chosen' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/rgt-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="960"><iframe src="/rgt-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="960"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/rgt-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'register-type-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Checkout title font — options — ${esc(site.brand.name)}</title>
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
  <h1>Checkout — the “3-Day Full Intensive Event” title</h1>
  <p class="lead">The title is set in Cormorant Garamond, a serif from an early direction that is not the site’s font.
     Four ways to set it in the site’s own type, Lato (with the Julietta Messie script kept where it is), with today’s
     for comparison. T1 to T3 change only the title; T4 changes every off-brand piece on the page. Each preview is
     the real checkout page; scroll inside it.</p>
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
console.log('built dist/register-type-options.html + frames rgt-*.html');

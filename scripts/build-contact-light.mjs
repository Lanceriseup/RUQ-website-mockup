// Builds /contact-light-options.html — four light designs for the Contact page,
// each with "Contact" in the brush script used by "Common struggles".
//
// Each frame is the real contact page with its header switched to the clear
// (ink) mode and <main> swapped for one variant from contact-light.mjs.
// Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { header } from '../src/partials/nav.mjs';
import { contactLight } from '../src/partials/contact-light.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const vids = read('src/data/videos.json');
const dist = path.join(ROOT, 'dist');
const page = fs.readFileSync(path.join(dist, 'contact.html'), 'utf8');

const headerRe = /<header id="site-nav"[\s\S]*?<\/header>/;
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
if (!headerRe.test(page) || !mainRe.test(page)) throw new Error('build-contact-light: header or main not found in dist/contact.html');

const OPTIONS = {
  sky: {
    label: 'L1 — Sky',
    note: 'The layout your client already approved, turned light: the same soft sky as Meet the Team running up behind the nav, “Contact” in the pink brush script with its swash, and the form on a bright white card with blush-tinted fields. Rise Up Kings becomes a warm cream card with the crest as a faint watermark. The safest step, and it makes the two light pages feel like a pair.',
    pick: true,
  },
  arch: {
    label: 'L2 — Arched portrait',
    note: 'A warm blush ground with soft pink and teal glows, and an arched photograph of two women in conversation under the heading — “our team is here to help” shown rather than said. The Rise Up Kings card is pinned over the photo’s corner, and the form card has a fine pink-to-teal edge along its top.',
  },
  split: {
    label: 'L3 — One card, photo and form',
    note: 'A large centred “Contact” over the sky, then a single white card that holds the photograph on the left and the form on the right, with the socials sitting on a pink wash at the foot of the photo. Rise Up Kings runs as one slim row beneath. The most composed and magazine-like.',
  },
  letter: {
    label: 'L4 — Letter',
    note: 'The contact block becomes a sheet of cream stationery with a stitched pink edge, a crown postage stamp and postmark in the corner, and the fields drawn as ruled lines to write on — the message box is lined paper. The most personal and the most unexpected: it feels like writing to someone, not filling in a form.',
  },
};

for (const k of Object.keys(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `cl-${k}.html`), page
    .replace(headerRe, header(site, '/contact.html', { clear: true }))
    .replace(mainRe, `<main id="main">${contactLight(site, c, vids, k)}</main>`)
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"></head>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/cl-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1500"><iframe src="/cl-${k}.html" title="${esc(o.label)}" loading="lazy" width="1440" height="1500"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/cl-${k}.html" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'contact-light-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact — light — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:840px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:840px; font-size:15px; }
.links { margin:8px 0 0; font:700 13px Montserrat, sans-serif; } .links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
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
  <h1>Contact page — light</h1>
  <p class="lead">Four light designs for the Contact page. In all of them “Contact” is set in the same brush script as
     “Common struggles”, with its hand-drawn swash, and the nav keeps its font, weight and style — only its colour
     changes. All the copy, the form, the socials, Rise Up Kings and the two videos are unchanged.</p>
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
console.log('built dist/contact-light-options.html + ' + Object.keys(OPTIONS).length + ' frames');

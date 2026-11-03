// Builds /about-stay-options.html: the About page's closing "Join us at
// Freedom" panel with the Stay Connected form in place of its two buttons,
// four ways (asked for 2026-11-03), plus one frame per option,
// /asc-<key>.html, which is the real About page with the option swapped in
// for the panel. Markup src/partials/about-stay-options.mjs; styles
// src/styles/stay.css (.ak-*); frame sizing src/styles/stay.js.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { aboutStayOption } from '../src/partials/about-stay-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(ROOT, 'src/styles/stay.css'), path.join(dist, 'stay.css'));
fs.copyFileSync(path.join(ROOT, 'src/styles/stay.js'), path.join(dist, 'stay.js'));

const OPTIONS = {
  split: {
    label: 'K1 — Two halves',
    note: 'The panel grows into two halves, like the homepage’s breakthrough panel: “Ready to take the first step?” in the pink script, JOIN US AT FREEDOM with Freedom in the pink-to-teal sheen, the line, and both event dates on the left; the form on the right. Same dark ground, event photograph and pink glow as now. The most consistent with the homepage.',
  },
  rise: {
    label: 'K2 — Rising out of the band',
    note: 'The slim one-row band you have now stays as it is (script and heading, then the line behind a hairline), and the form stands up out of it on the right, taller than the band above and below, like a card propped against it. Keeps the band’s compact look; the form is the one thing that breaks out of it. On a phone the band sits behind the words and the top of the form.',
  },
  centre: {
    label: 'K3 — Centred',
    note: 'Everything on one centre line in a narrower dark panel: the script, the heading, the line, a short pink-to-teal rule, then the form. Calm and symmetrical; reads like the end of a letter. The tallest of the four, but the simplest.',
  },
  light: {
    label: 'K4 — Light',
    note: 'The panel turns light: soft blush glass with a pink and teal glow in opposite corners, a taped polaroid of the women at Freedom on the left, the words in ink in the middle (the script in pink), and the form on the right. Sits more gently on the light journey ground above it than the dark panel does. On a phone the polaroid is left out.',
  },
};

const SECTION = /<section id="closing-about"[\s\S]*?<\/section>/;
const base = fs.readFileSync(path.join(dist, 'about.html'), 'utf8');
if (!SECTION.test(base)) throw new Error('build-about-stay-options: <section id="closing-about"> not found in dist/about.html');

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `asc-${k}.html`), base
    // The live page already links stay.css and stay.js (K2 went live on
    // 2026-11-03), so each frame only swaps the panel.
    .replace(SECTION, () => aboutStayOption(site, c, k))
    // The page's own jump to #anchor does not survive its load, so the frame
    // repeats it once loaded (as in build-stay-options.mjs).
    .replace('</body>', `<script>addEventListener('load', function () { var t = location.hash && document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView({ block: 'center', behavior: 'instant' }); }, 300); });</script>
</body>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>About closing — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => {
  const src = `/asc-${k}.html#closing-about`;
  return `
<article class="opt">
  <span class="tag">Option</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="${src}" target="_blank" rel="noopener">Open at the panel ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="${src}" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="${src}" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;
};

fs.writeFileSync(path.join(dist, 'about-stay-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About — Join us at Freedom, with the form — ${esc(site.brand.name)}</title>
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
  <h1>About — “Join us at Freedom”, with the form</h1>
  <p class="lead">The closing panel on About Rise Up Queens, with Register for Freedom and Explore Courses taken out and
     the live MultiplyOS “Stay Connected” form in their place. Four designs; every one keeps the panel’s words. The
     previews use the real form, so <b>anything submitted here is a real sign-up.</b> Each opens at the panel; scroll
     inside it, or open it full size.</p>
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

console.log('built dist/about-stay-options.html + frames asc-*.html');

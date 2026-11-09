// Builds /word-blue-options.html: the hero's rotating word (PASSIONATE,
// JOYFUL, …) in blue treatments (the client's ask, 2026-11-10: "blue, same as
// the banner"). Frames are the built homepage with one <style> added,
// /wb-<key>.html, so every option is the real hero, sweep and rotation
// included. The shipped rule is .hero-rotator > .hero-word.sheen in
// src/styles/tailwind.css.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(ROOT, 'dist');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const S = '.hero-rotator > .hero-word.sheen';
const SWEEP = 'linear-gradient(100deg, transparent 40%, rgba(255,255,255,.85) 50%, transparent 60%)';
const word = (grad, extra = '') => `${S}{background-image:${SWEEP},${grad} !important;${extra}}`;

const OPTIONS = {
  now: {
    label: 'Now — Banner teal',
    note: 'What is on the page now: the brushed-metal teal of the banner, bright teal at the ends with its pale highlight through the middle.',
    css: '',
  },
  chrome: {
    label: 'B1 — Teal chrome',
    note: 'The banner’s metal made into lettering: ice-white on top, a sharp horizon at the middle, deep teal below and a pale rim of light at the foot, like polished chrome reflecting a teal sky. The closest match to the banner’s finish, and the most striking.',
    css: word('linear-gradient(180deg,#f4feff 0%,#c4f5f9 44%,#00b9c6 51%,#078692 76%,#5fe3ec 100%)', 'filter:drop-shadow(0 2px 0 rgba(0,40,46,.55)) drop-shadow(0 10px 30px rgba(0,185,198,.35))'),
  },
  neon: {
    label: 'B2 — Neon teal',
    note: 'One bright teal, lit: the letters glow like a neon tube, with a soft halo into the dark around them. Simple, bold and very readable; the sweep still passes across each word.',
    css: word('linear-gradient(#45e3ec,#45e3ec)', 'filter:drop-shadow(0 0 10px rgba(0,185,198,.85)) drop-shadow(0 0 34px rgba(0,185,198,.5))'),
  },
  ocean: {
    label: 'B3 — Ocean',
    note: 'Teal into sky blue into royal blue, left to right: the cooler, bluer end of the brand, like the ocean variant of the banner. Reads as “blue” more than teal.',
    css: word('linear-gradient(92deg,#00c8d4 0%,#2fa8f0 50%,#6a86ff 100%)'),
  },
  glacier: {
    label: 'B4 — Glacier',
    note: 'Pale ice blue into teal into a deeper blue: lighter and airier than the others, with the brightest letters first so the word reads instantly.',
    css: word('linear-gradient(92deg,#c9f8ff 0%,#6fdcf2 35%,#00b9c6 65%,#2a8ee0 100%)'),
  },
  flow: {
    label: 'B5 — Flowing water',
    note: 'Teal, pale aqua and blue moving slowly through the letters, all the time, like light on water. The only option that moves between words as well as on arrival; replaces the one-off sweep.',
    css: `${S}{background-image:linear-gradient(90deg,#00b9c6 0%,#8ff0f6 17%,#3c97e6 33%,#00b9c6 50%,#8ff0f6 67%,#3c97e6 83%,#00b9c6 100%) !important;background-size:200% 100% !important;animation:wb-flow 7s linear infinite !important}
@keyframes wb-flow{from{background-position:0% 0}to{background-position:100% 0}}
@media (prefers-reduced-motion:reduce){${S}{animation:none !important}}`,
  },
};

const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!base.includes('hero-rotator')) throw new Error('build-word-blue-options: hero rotator not found in dist/index.html');
for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `wb-${k}.html`), base
    .replace('</head>', `<style>${o.css}</style>\n</head>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Hero word — ${esc(o.label)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${k === 'now' ? ' now' : ''}">${k === 'now' ? 'Now' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/wb-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="760"><iframe src="/wb-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="760"></iframe></div><figcaption>Desktop · the words rotate</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="640"><iframe src="/wb-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="640"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'word-blue-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Hero word in blue — options</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; }
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
.screen { position:relative; overflow:hidden; border-radius:14px; background:#1c1c1c; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>The hero word, in blue</h1>
  <p class="lead">The big rotating word under “Become the”, in five blue treatments, with what is on the page now
     first. Each preview is the real homepage hero, so the words rotate and catch the sweep of light as they arrive;
     watch a few go by. The banner at the top of each preview is the teal it is matched against.</p>
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
console.log('built dist/word-blue-options.html + frames wb-*.html');

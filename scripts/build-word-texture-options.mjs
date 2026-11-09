// Builds /word-texture-options.html: the hero's rotating word in today's
// banner teal, with a texture on it (Lance's ask, 2026-11-10: the colour is
// fine, but it wants some texture). Frames are the built homepage with one
// <style> added, /wt-<key>.html. The shipped rule is
// .hero-rotator > .hero-word.sheen in src/styles/tailwind.css.
//
// Each option is three background layers: the sweep of light, the texture,
// and the teal. The arrival animation is redefined here for three layers,
// because the shipped one lists two and the lists would otherwise cycle.
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
const TEAL = 'linear-gradient(92deg, #0aa5b1 0%, #00b9c6 30%, #86eff5 55%, #00b9c6 78%, #0a9aa6 100%)';
const svg = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
// A tile rendered through an SVG filter; `body` is the filter primitives.
const filt = (body, w, h = w) => svg(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><filter id='n' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>${body}</filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`);
const turb = (freq, oct = 2, type = 'fractalNoise') => `<feTurbulence type='${type}' baseFrequency='${freq}' numOctaves='${oct}' stitchTiles='stitch'/>`;
const noise = (freq, matrix, size) => filt(`${turb(freq)}<feColorMatrix values='${matrix}'/>`, size);
// Hammered: noise lit from the top left; one tile of the highlights (white)
// and one of the shading (dark teal), so the teal shows through between.
const LIT = `${turb('.11', 3)}<feDiffuseLighting surfaceScale='4' lighting-color='#fff' result='l'><feDistantLight azimuth='225' elevation='38'/></feDiffuseLighting>`;

// layers: the texture's background layers (one or more); sizes: one size per
// texture layer.
const tex = (layers, sizes, extra = '') => {
  const n = layers.length;
  const pos = (sweep) => [sweep, ...Array(n + 1).fill('0 0')].join(',');
  return `${S}{background-image:${SWEEP},${layers.join(',')},${TEAL} !important;background-size:250% 100%,${sizes.join(',')},100% 100% !important;background-position:${pos('100% 0')} !important;${extra}}
${S}.is-on{animation:wt-arrive 1.3s cubic-bezier(.45,0,.25,1) .2s both !important}
@keyframes wt-arrive{from{background-position:${pos('100% 0')}}to{background-position:${pos('0% 0')}}}
@media (prefers-reduced-motion:reduce){${S}.is-on{animation:none !important}}`;
};

const OPTIONS = {
  now: {
    label: 'Now — smooth teal',
    note: 'What is on the page now: the banner teal, smooth, with no texture.',
    css: '',
  },
  brushed: {
    label: 'T1 — Brushed metal',
    note: 'The banner’s own texture: fine vertical brushing across the letters, light catching every few lines, with a thin dark edge underneath so the word sits slightly raised. Word and banner then read as the same piece of teal metal.',
    // noise stretched tall: streaks of uneven length and brightness, as on
    // real brushed aluminium, light and dark around the teal
    css: tex([filt(`${turb('.9 .012', 2)}<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.6 0 0 0 -.82'/>`, 240, 240),
              filt(`${turb('.7 .01', 2)}<feColorMatrix values='0 0 0 0 0  0 0 0 0 .2  0 0 0 0 .23  -1.4 0 0 0 .62'/>`, 200, 200)], ['240px 240px', '200px 200px'],
      'filter:drop-shadow(0 2px 0 rgba(0,40,46,.6))'),
  },
  glitter: {
    label: 'T2 — Glitter',
    note: 'Fine white sparkle scattered through the teal, like glitter set in the letters. Festive and feminine, and it shines brightest as the sweep passes. Fits the crowns and the celebration of the event.',
    // two sparse sizes of sparkle: fine dust, and fewer larger glints
    css: tex([noise('.95', '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 22 -14.6', 160),
              noise('.45', '0 0 0 0 1  0 0 0 0 .97  0 0 0 0 1  0 0 0 26 -18.4', 220)], ['160px 160px', '220px 220px'],
      'filter:drop-shadow(0 0 14px rgba(0,185,198,.35))'),
  },
  grain: {
    label: 'T3 — Soft grain',
    note: 'A fine, even film grain over the teal: a matte, printed, editorial finish rather than a shiny one. The subtlest of the five; up close it feels crafted, from across the room it is the same teal.',
    // grey grain, light and dark in equal measure, so the teal is not dulled
    css: tex([noise('.8', '1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 .2', 140)], ['140px 140px']),
  },
  foil: {
    label: 'T4 — Foil stamp',
    note: 'Fine diagonal light-and-shadow lines, as on a foil-stamped invitation or a holographic card. Light runs across the strokes at an angle, so the word looks pressed in metallic foil.',
    // fine, close diagonal grain, then broad soft bands of light across it
    css: tex(['repeating-linear-gradient(115deg, rgba(255,255,255,.14) 0 1px, transparent 1px 2px, rgba(0,60,70,.12) 2px 3px, transparent 3px 4px)',
              'repeating-linear-gradient(115deg, transparent 0, rgba(255,255,255,.32) 9%, transparent 18%, rgba(0,60,70,.18) 27%, transparent 36%)'], ['100% 100%', '100% 100%'],
      'filter:drop-shadow(0 1px 0 rgba(0,40,46,.5))'),
  },
  hammered: {
    label: 'T5 — Hammered metal',
    note: 'Small soft dimples of light and shadow all over the letters, like hand-hammered metal or a beaten-silver ring. Rich and tactile, more jewellery than machine.',
    css: tex([filt(`${LIT}<feColorMatrix in='l' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.5 0 0 0 -1.05'/>`, 260),
              filt(`${LIT}<feColorMatrix in='l' values='0 0 0 0 0  0 0 0 0 .18  0 0 0 0 .21  -1.4 0 0 0 .78'/>`, 260)], ['260px 260px', '260px 260px'],
      'filter:drop-shadow(0 2px 0 rgba(0,40,46,.55))'),
  },
};

const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!base.includes('hero-rotator')) throw new Error('build-word-texture-options: hero rotator not found in dist/index.html');
for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `wt-${k}.html`), base
    .replace('</head>', `<style>${o.css}</style>\n</head>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Hero word — ${esc(o.label)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${k === 'now' ? ' now' : ''}">${k === 'now' ? 'Now' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/wt-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="760"><iframe src="/wt-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="760"></iframe></div><figcaption>Desktop · the words rotate</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="640"><iframe src="/wt-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="640"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'word-texture-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Hero word with texture — options</title>
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
  <h1>The hero word, with texture</h1>
  <p class="lead">The big rotating word under “Become the”, in today’s teal with five different textures, and today’s
     smooth version first. Each preview is the real homepage hero, so the words rotate and catch the sweep of light
     as they arrive. The previews are scaled down, so open a full page to see the texture at its real size.</p>
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
console.log('built dist/word-texture-options.html + frames wt-*.html');

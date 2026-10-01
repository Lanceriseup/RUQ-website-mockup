// Builds /about-zoom-options.html — how far to zoom the group photograph
// behind the about hero. At its natural crop the video covers the middle of
// the group and the women either side read as small figures; zooming brings
// the faces either side of the video up to a readable size.
//
// Each option is the real about page with an override on the hero image.
// Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
// The shipped hero is a pre-zoomed crop, so the options are judged on the
// full frame (about-hero-full.jpg) with the zoom applied in CSS, as they were
// when chosen.
const about = fs.readFileSync(path.join(dist, 'about.html'), 'utf8')
  .replace('/assets/photos/about-hero-group.jpg', '/assets/photos/about-hero-full.jpg');
if (!about.includes('about-hero-full')) throw new Error('build-about-zoom: about hero image not found');

const IMG = 'img[src*="about-hero-full"]';
const OPTIONS = {
  now: { label: 'Before', note: 'For reference — the whole photograph, so the women either side of the video are small.', css: '' },
  close: {
    label: 'A — Closer',
    note: 'Zoomed about 1.35×, centred on the group. The wall above mostly drops out and the women either side become a full crowd of faces rather than small figures.',
    css: `${IMG}{transform:scale(1.35);transform-origin:50% 64%}`,
  },
  front: {
    label: 'B — Front rows',
    note: 'Zoomed about 1.7× onto the front of the group, so the faces either side of the video are large and clearly smiling. The wall and backdrop disappear entirely — it reads as being among them.',
    pick: true,
    css: `${IMG}{transform:scale(1.7);transform-origin:50% 72%}`,
  },
  drift: {
    label: 'C — Closer, slowly drifting',
    note: 'The A zoom, with the photograph easing slowly across and in over 30 seconds and back, so the crowd feels alive behind the video. Holds still for anyone with reduced motion turned on.',
    css: `${IMG}{transform-origin:50% 66%;animation:az-drift 30s ease-in-out infinite alternate}
      @keyframes az-drift{from{transform:scale(1.35) translateX(-2%)}to{transform:scale(1.5) translateX(2%)}}
      @media (prefers-reduced-motion:reduce){${IMG}{animation:none;transform:scale(1.4)}}`,
  },
  bright: {
    label: 'D — Front rows, brighter',
    note: 'B’s zoom with the photograph a little brighter (60% instead of 50%), so the women are clearly visible. The text bands at the top and bottom still keep the headline and dates readable.',
    css: `${IMG}{transform:scale(1.7);transform-origin:50% 72%;opacity:.6!important}`,
  },
};

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `az-${k}.html`), about
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${o.css}</style></head>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : k === 'now' ? ' now' : ''}">${k === 'front' ? 'Live' : o.pick ? 'Recommended' : k === 'now' ? 'Before' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/az-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1696" data-h="1120"><iframe src="/az-${k}.html" title="${esc(o.label)}" loading="lazy" width="1696" height="1120"></iframe></div><figcaption>Desktop · 1696 wide (your screen)</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/az-${k}.html" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About hero zoom — ${esc(site.brand.name)}</title>
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
@media (min-width:1100px) { .pair { grid-template-columns:1fr 260px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:260px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>About hero — zooming the group photo</h1>
  <p class="lead">At its natural size the video covers the middle of the group and the women either side look small.
     Each option zooms the photograph by a different amount. Desktop previews are at your screen width.</p>
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

fs.writeFileSync(path.join(dist, 'about-zoom-options.html'), page);
console.log('built dist/about-zoom-options.html + ' + Object.keys(OPTIONS).length + ' frames');

// Builds /wave-options.html — treatments for the wave that ends the Freedom
// section and hands over to Common Struggles.
//
// Why the shipped line fell short: it was drawn with a dash sized by
// pathLength="1", but the SVG stretches non-uniformly (preserveAspectRatio
// none) and the stroke is non-scaling, and Chrome measures the dash in a
// different space from the path, so the dash ends before the right edge on
// wide screens. Every option here reveals with clip-path on the element
// instead — the shape is always the full width; only how much of it shows
// changes.
//
// Each option is the real homepage with the wave swapped. Must run after
// scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
// The shipped wave is two SVGs (the fill, then the ribbon); both are swapped.
const WAVE = /<svg class="fr-wave"[\s\S]*?<\/svg>\s*<svg class="fr-wave fr-ribbon"[\s\S]*?<\/svg>/;
if (!WAVE.test(home)) throw new Error('build-wave: the Freedom wave was not found in dist/index.html');

// The crest shared by every option — the same curve the section ships with.
const CREST = 'M0 72 C 260 18, 520 18, 760 58 C 1000 98, 1200 112, 1440 46';
const FILL = `${CREST} L1440 120 L0 120 Z`;
const GRAD = (id) => `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#e8208f"/><stop offset=".5" stop-color="#f0569f"/><stop offset="1" stop-color="#00b9c6"/></linearGradient></defs>`;
const svg = (cls, inner) => `<svg class="wv ${cls}" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">${inner}</svg>`;

const WAVES = {
  line: {
    label: 'A — Fine line, fixed',
    note: 'What you have, working: the same thin pink-to-teal line, now reaching both edges at every screen width, still drawing itself in from left to right.',
    html: svg('wv-fill', `<path d="${FILL}" fill="#fff"/>`) +
          svg('wv-draw', `${GRAD('wa')}<path d="${CREST}" fill="none" stroke="url(#wa)" stroke-width="2" vector-effect="non-scaling-stroke"/>`),
  },
  ribbon: {
    label: 'B — Brush ribbon',
    note: 'The line becomes a brush stroke: hairline-thin at both edges, swelling to its full weight across the middle, filled pink to teal. It paints on from left to right, matching the brush highlights above it.',
    pick: true,
    html: svg('wv-fill', `<path d="${FILL}" fill="#fff"/>`) +
          svg('wv-draw', `${GRAD('wb')}<path d="M0 72 C 260 11, 520 9, 760 50 C 1000 91, 1200 105, 1440 46 C 1200 119, 1000 106, 760 66 C 520 27, 260 25, 0 72 Z" fill="url(#wb)"/>`),
  },
  double: {
    label: 'C — Two threads',
    note: 'A pink thread and a teal thread on slightly different curves, drawing in from opposite sides and crossing in the middle. Echoes the two brush strokes in the section.',
    html: svg('wv-fill', `<path d="${FILL}" fill="#fff"/>`) +
          svg('wv-draw wv-l', `<path d="M0 60 C 300 8, 560 12, 800 50 C 1040 88, 1240 100, 1440 34" fill="none" stroke="#e8208f" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`) +
          svg('wv-draw wv-r', `<path d="${CREST}" fill="none" stroke="#00b9c6" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`),
  },
  tides: {
    label: 'D — Tides',
    note: 'Three layered waves — a blush, a soft teal and the white — each drifting slowly on its own rhythm, so the edge gently moves like water. No line; the depth is the effect.',
    html: svg('wv-tides', `
      <path class="t1" d="M-80 40 C 260 0, 520 0, 760 30 C 1000 66, 1200 86, 1520 18 L1520 120 L-80 120 Z" fill="rgba(0,185,198,.2)"/>
      <path class="t2" d="M-80 60 C 260 12, 520 12, 760 48 C 1000 86, 1200 102, 1520 36 L1520 120 L-80 120 Z" fill="rgba(247,191,210,.85)"/>
      <path class="t3" d="M-80 82 C 260 30, 520 30, 760 66 C 1000 104, 1200 118, 1520 56 L1520 120 L-80 120 Z" fill="#fff"/>`),
  },
  light: {
    label: 'E — Travelling light',
    note: 'The fine line is always there, full width, and every few seconds a bright pink glow runs along it from left to right. Quiet, but it keeps the section alive while someone reads.',
    html: svg('wv-fill', `<path d="${FILL}" fill="#fff"/>`) +
          svg('wv-base', `${GRAD('we')}<path d="${CREST}" fill="none" stroke="url(#we)" stroke-width="1.6" vector-effect="non-scaling-stroke" opacity=".55"/>`) +
          svg('wv-glow', `<path d="${CREST}" fill="none" stroke="#ff4fa8" stroke-width="3.5" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`),
  },
};

const CSS = `
.wv{position:absolute;left:0;right:0;bottom:-1px;z-index:2;display:block;width:100%;height:clamp(40px,6vw,90px);pointer-events:none}
/* reveal by clipping the element, not by dashing the path */
.wv-draw{clip-path:inset(-20% 100% -20% 0);transition:clip-path 1.8s cubic-bezier(.65,0,.35,1) .5s}
.fr.is-in .wv-draw{clip-path:inset(-20% 0 -20% 0)}
.wv-r{clip-path:inset(-20% 0 -20% 100%)}
.fr.is-in .wv-r{clip-path:inset(-20% 0 -20% 0)}

.wv-tides path{transform-box:fill-box}
.wv-tides .t1{animation:wv-sway 11s ease-in-out infinite}
.wv-tides .t2{animation:wv-sway 8s ease-in-out infinite reverse}
.wv-tides .t3{animation:wv-sway 14s ease-in-out infinite}
@keyframes wv-sway{0%,100%{transform:translateX(0)}50%{transform:translateX(-56px)}}

/* the glow is a short, blurred window onto a white line, swept along it */
.wv-glow{filter:drop-shadow(0 0 4px rgba(255,79,168,.9)) drop-shadow(0 0 12px rgba(232,32,143,.6));
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 4%,#000 8%,transparent 12%);mask-image:linear-gradient(90deg,transparent 0,#000 4%,#000 8%,transparent 12%);
  -webkit-mask-size:300% 100%;mask-size:300% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
  -webkit-mask-position:100% 0;mask-position:100% 0;opacity:0}
.fr.is-in .wv-glow{opacity:1;animation:wv-run 6s cubic-bezier(.45,0,.25,1) 1s infinite}
@keyframes wv-run{0%{-webkit-mask-position:100% 0;mask-position:100% 0}55%,100%{-webkit-mask-position:-50% 0;mask-position:-50% 0}}

@media (prefers-reduced-motion:reduce){
  .wv-draw,.wv-r{clip-path:none!important;transition:none!important}
  .wv-tides path{animation:none!important}.wv-glow{display:none}
}`;

// Scroll the wave to the middle of the frame when opened with #wave.
const TO_WAVE = `<script>
addEventListener('load',function(){if(location.hash!=='#wave')return;var s=document.getElementById('freedom');if(!s)return;
var r=s.getBoundingClientRect();scrollTo(0,scrollY+r.bottom-innerHeight*.6);});
</script>`;

for (const [k, w] of Object.entries(WAVES)) {
  fs.writeFileSync(path.join(dist, `wv-${k}.html`), home
    .replace(WAVE, w.html)
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
    .replace('</body>', `${TO_WAVE}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" data-replay="${k}">↻ Replay</button> · <a href="/wv-${k}.html#wave" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe data-k="${k}" src="/wv-${k}.html#wave" title="${esc(o.label)}" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe data-k="${k}" src="/wv-${k}.html#wave" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wave options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:820px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:820px; font-size:15px; }
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; }
.links a, .links button { color:var(--magenta); background:none; border:0; padding:0; font:inherit; cursor:pointer; }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 320px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:320px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:26px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>The wave under Freedom</h1>
  <p class="lead">The line was stopping short of the right edge on wide screens — a browser quirk in how the drawing
     animation measured it. Every option below is drawn a different way and always runs the full width. Each preview is
     the real homepage, scrolled so the wave sits mid-frame. <strong>Replay</strong> re-runs the entrance.</p>
  ${Object.entries(WAVES).map(([k, o]) => card(k, o)).join('')}
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
  document.querySelectorAll('[data-replay]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('iframe[data-k="' + b.dataset.replay + '"]').forEach(function (f) {
        f.src = '/wv-' + b.dataset.replay + '.html?r=' + Date.now() + '#wave';
      });
    });
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'wave-options.html'), page);
console.log('built dist/wave-options.html + ' + Object.keys(WAVES).length + ' frames');

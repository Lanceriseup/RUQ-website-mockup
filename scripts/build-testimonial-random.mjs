// Builds /testimonial-random-options.html — ways for two random testimonials
// to play at a time in the "Real change" rails, switching to others, instead
// of only the card passing the centre.
//
// Each option is the production section and the production script: app.js
// reads data-cs-mode off the section (centre | shuffle | anywhere), and a
// look is a few lines of CSS on top. Shipping one is setting the attribute in
// testimonials.mjs and moving its CSS into tailwind.css.
// Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!home.includes('data-centre-stage')) throw new Error('build-testimonial-random: data-centre-stage not found in dist/index.html');

// A gentle countdown along the bottom of each playing card, filling over the
// time it holds the stage.
const BAR = `
[data-centre-stage] .video-facade.is-playing::after{content:"";position:absolute;left:0;right:0;bottom:0;z-index:3;height:3px;
  background:linear-gradient(90deg,#e8208f,#f0569f,#00b9c6);transform-origin:left;animation:cs-hold var(--cs-hold,7s) linear forwards}
@keyframes cs-hold{from{transform:scaleX(0)}to{transform:scaleX(1)}}`;

// Everything not playing steps back, so the two live cards are the light.
const SPOT = `
[data-centre-stage] .video-facade{transition:transform .6s cubic-bezier(.22,1,.36,1),box-shadow .6s ease,filter .8s ease}
[data-centre-stage] .video-facade:not(.is-playing){filter:saturate(.5) brightness(.8)}
[data-centre-stage] .video-facade:not(.is-playing):hover{filter:none}`;

// Inside the gallery frames, hold the view on the section: lazy images above
// it change the page height after the #hash jump has already happened.
const FOCUS = `<script>if(window!==top){var go=function(){var t=document.getElementById('testimonials');if(t)t.scrollIntoView({block:'center'})};addEventListener('load',go);setTimeout(go,1500);setTimeout(go,4000);}</script>`;

const OPTIONS = {
  shuffle: {
    label: 'R1 — Shuffle',
    note: 'One random woman in each row plays at a time, anywhere on screen, not just in the middle. Each plays for about 7 seconds, then hands over to another random card in her row. The two rows switch half a beat apart, so there is always something changing but never both at once. Same pink ring, lift and “Playing” tag as now.',
    pick: true, mode: 'shuffle', css: '',
  },
  anywhere: {
    label: 'R2 — Random pair',
    note: 'Two random cards from either row — sometimes both on top, sometimes one in each — play together, then both switch to a new pair every 7 seconds. Never side by side or directly above each other. The most unpredictable of the four.',
    mode: 'anywhere', css: '',
  },
  spotlight: {
    label: 'R3 — Spotlight shuffle',
    note: 'The R1 shuffle, but every card that is not playing softly dims and loses some colour, so the two live videos are the light in the room. Hovering a dimmed card brings it straight back. The most dramatic.',
    mode: 'shuffle', css: SPOT,
  },
  countdown: {
    label: 'R4 — Shuffle with countdown',
    note: 'The R1 shuffle, with a thin pink-to-teal line filling along the bottom of each playing card while it holds the stage, so the switch to the next woman feels intended rather than random.',
    mode: 'shuffle', css: BAR,
  },
};

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `tr-${k}.html`), home
    .replace('data-centre-stage', `data-centre-stage data-cs-mode="${o.mode}"`)
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${o.css}</style></head>`)
    .replace('</body>', `${FOCUS}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/tr-${k}.html#testimonials" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/tr-${k}.html#testimonials" title="${esc(o.label)}" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/tr-${k}.html#testimonials" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'testimonial-random-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Testimonials — random play — ${esc(site.brand.name)}</title>
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
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Testimonials — two random videos playing</h1>
  <p class="lead">Instead of only the card passing the centre, two random testimonials play at a time and switch to
     others every few seconds while the rows keep drifting. Videos are silent; tapping any card still opens the full
     video with sound. Give each preview a few seconds to load the clips.</p>
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
console.log('built dist/testimonial-random-options.html + ' + Object.keys(OPTIONS).length + ' frames');

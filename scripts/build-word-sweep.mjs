// Builds /word-sweep-options.html — ways to make the light sweep through every
// rotating hero word the same way.
//
// The live hero's sheen runs on its own 5.5s loop while the words swap every
// 2.6s, so the light lands on each word at a different moment (and sometimes
// not at all). Every option here instead fires the sweep from the swap itself,
// so passionate, connected and joyful each get the identical pass.
//
// Self-contained CSS and JS: nothing here depends on a Tailwind rebuild.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const hero = content.home.hero;

const OPTIONS = {
  now: { label: 'Now — live site', note: 'For reference. The sheen loops every 5.5s regardless of the word, so each word catches the light at a different point — watch “connected” versus “joyful”.' },
  a:   { label: 'A — Sweep on arrival', note: 'Same cross-fade as today, then one pass of light left to right as each word settles. The smallest change from what is live.' },
  b:   { label: 'B — Light wipe', note: 'A beam of light travels across and the new word is revealed in its wake as the old one is carried off. The light is the transition itself.', pick: true },
  c:   { label: 'C — Rise into light', note: 'The old word lifts out, the new one rises in from below, and the sweep crosses it the moment it lands.' },
  d:   { label: 'D — Bloom', note: 'Each word arrives as a soft burst of light that focuses into the gradient, then the sweep follows. The warmest and most dramatic.' },
};

// How long each mode keeps the outgoing word visible, in ms at normal speed.
const OUT_MS = { now: 450, a: 450, b: 1150, c: 650, d: 600 };

const words = (mode) => hero.rotatingWords.map((w, i) =>
  `<span class="w${i === 0 ? ' is-on' : ''}">${esc(w)}</span>`).join('');

const card = (k, m) => `
<article class="card">
  <header class="card-head">
    <span class="tag${m.pick ? ' tag-pick' : k === 'now' ? ' tag-now' : ''}">${m.pick ? 'Recommended' : k === 'now' ? 'Current' : 'Option'}</span>
    <h2>${esc(m.label)}</h2>
    <p>${esc(m.note)}</p>
  </header>
  <div class="stage" style="background-image:url('${esc(site.assets.heroVideo.poster)}')">
    <div class="shade"></div>
    <h3 class="headline">
      <span class="sans">${esc(hero.headingBefore)}</span>
      <span class="rot-line"><span class="rot" data-mode="${k}" data-out="${OUT_MS[k]}">${words(k)}${k === 'b' ? '<span class="beam" aria-hidden="true"></span>' : ''}</span></span>
      <span class="sans sans-after">${esc(hero.headingAfter)}</span>
    </h3>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Word sweep options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --k: 1; --ink: #1c1c1c; --soft: #5b5b5b; --magenta: #e8208f; --cyan: #00b9c6; }
* { box-sizing: border-box; }
body { margin: 0; background: #fff; color: var(--ink); font: 16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width: 1100px; margin: 0 auto; padding: 40px 16px 80px; }
h1 { font: 700 30px/1.2 Montserrat, sans-serif; margin: 0; }
.lead { color: var(--soft); max-width: 760px; margin: 10px 0 0; }
.controls { position: sticky; top: 0; z-index: 5; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
  margin: 20px -16px 0; padding: 12px 16px; background: rgba(255,255,255,.92); backdrop-filter: blur(8px); border-bottom: 1px solid #eee; }
.controls span { font: 700 11px Montserrat, sans-serif; letter-spacing: .15em; text-transform: uppercase; color: var(--soft); margin-right: 4px; }
.controls button { font: 700 12px Montserrat, sans-serif; letter-spacing: .1em; text-transform: uppercase; border: 1px solid #ddd;
  background: #fff; color: var(--ink); border-radius: 999px; padding: 10px 16px; cursor: pointer; min-height: 44px; }
.controls button[aria-pressed="true"] { background: var(--ink); color: #fff; border-color: var(--ink); }
.card { margin-top: 48px; }
.card-head h2 { font: 700 20px/1.3 Montserrat, sans-serif; margin: 8px 0 0; }
.card-head p { color: var(--soft); margin: 4px 0 0; max-width: 760px; font-size: 15px; }
.tag { display: inline-block; font: 700 11px Montserrat, sans-serif; letter-spacing: .12em; text-transform: uppercase;
  color: #fff; background: var(--magenta); border-radius: 999px; padding: 4px 12px; }
.tag-now { background: var(--soft); }
.tag-pick { background: linear-gradient(92deg, var(--magenta), var(--cyan)); }
.stage { position: relative; overflow: hidden; margin-top: 14px; border-radius: 20px; background: var(--ink) center/cover;
  padding: 64px 16px; text-align: center; }
.shade { position: absolute; inset: 0; background: rgba(28,28,28,.72); }
.headline { position: relative; margin: 0; color: #fff; font-weight: 700; }
.sans { display: block; font: 700 clamp(1rem, 2.4vw, 1.5rem)/1.375 Montserrat, sans-serif; letter-spacing: .2em; text-transform: uppercase; }
.sans-after { margin-top: clamp(12px, 2.5vw, 28px); }
.rot-line { display: block; margin-top: clamp(8px, 1.2vw, 12px); }

/* ---- Shared word styling: identical to the live hero ---------------- */
.rot { position: relative; display: inline-grid; }
.w {
  grid-area: 1 / 1; white-space: nowrap; padding-right: .06em;
  font: 800 clamp(2.75rem, 9vw, 6rem)/1 Montserrat, sans-serif; letter-spacing: -.01em; text-transform: uppercase;
  opacity: 0; visibility: hidden;
  /* Highlight band (40–60% of a 250%-wide layer) parked just off the left
     edge at 100%, just off the right at 0%. */
  background-image:
    linear-gradient(100deg, transparent 40%, rgba(255,255,255,.85) 50%, transparent 60%),
    linear-gradient(92deg, #e8208f 0%, #f0569f 35%, #00b9c6 100%);
  background-size: 250% 100%, 100% 100%;
  background-position: 100% 0, 0 0;
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.w.is-on, .w.is-out { visibility: visible; }
.w.is-on { opacity: 1; }
/* A word returning to rest must not animate on its way back — it would slide
   or fade visibly through the stage. */
.w:not(.is-on):not(.is-out) { transition: none !important; animation: none !important; }

@keyframes sweep { from { background-position: 100% 0, 0 0; } to { background-position: 0% 0, 0 0; } }

/* ---- Now: the live behaviour — sheen on its own clock --------------- */
[data-mode="now"] .w { transition: opacity calc(.42s * var(--k)) ease; animation: sheen-free calc(5.5s * var(--k)) ease-in-out infinite; }
[data-mode="now"] .w.is-out { opacity: 0; }
[data-mode="now"] .w:not(.is-on):not(.is-out) { animation: sheen-free calc(5.5s * var(--k)) ease-in-out infinite !important; }
@keyframes sheen-free { 0%, 55% { background-position: 100% 0, 0 0; } 100% { background-position: 0% 0, 0 0; } }

/* ---- A: cross-fade, then one sweep per word ------------------------- */
[data-mode="a"] .w { transition: opacity calc(.45s * var(--k)) ease; }
[data-mode="a"] .w.is-on { animation: sweep calc(1.3s * var(--k)) cubic-bezier(.45,0,.25,1) calc(.2s * var(--k)) both; }
[data-mode="a"] .w.is-out { opacity: 0; }

/* ---- B: light wipe ---------------------------------------------------
   Beam, reveal mask and highlight band share one duration and easing and
   are all two-keyframe, so they stay locked together. The line travels from
   -25% to 125% of the word box:
     beam   translateX(-75%) → 75%  (line at the beam's centre)
     mask   300% wide, edge at 50%  → position 87.5% → 12.5%
     band   250% wide               → position 100%  → 0%            */
[data-mode="b"] { --d: calc(1.1s * var(--k)); --e: cubic-bezier(.55,.05,.35,1); }
[data-mode="b"] .w {
  -webkit-mask-size: 300% 100%; mask-size: 300% 100%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
}
[data-mode="b"] .w.is-on {
  -webkit-mask-image: linear-gradient(90deg, #000 47%, transparent 53%); mask-image: linear-gradient(90deg, #000 47%, transparent 53%);
  animation: b-mask var(--d) var(--e) both, sweep var(--d) var(--e) both;
}
[data-mode="b"] .w.is-out {
  opacity: 1;
  -webkit-mask-image: linear-gradient(90deg, transparent 47%, #000 53%); mask-image: linear-gradient(90deg, transparent 47%, #000 53%);
  animation: b-mask var(--d) var(--e) both;
}
@keyframes b-mask { from { -webkit-mask-position: 87.5% 0; mask-position: 87.5% 0; } to { -webkit-mask-position: 12.5% 0; mask-position: 12.5% 0; } }
.beam {
  position: absolute; top: -18%; bottom: -18%; left: 0; width: 100%; pointer-events: none; opacity: 0;
  background:
    linear-gradient(90deg, transparent 49.2%, rgba(255,255,255,.95) 50%, transparent 50.8%),
    linear-gradient(90deg, transparent 44%, rgba(255,255,255,.22) 50%, transparent 56%),
    linear-gradient(90deg, transparent 38%, rgba(0,185,198,.16) 50%, transparent 62%);
  mix-blend-mode: screen;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
  transform: translateX(-75%);
}
.beam.go { animation: b-beam var(--d) var(--e) both, b-beam-fade var(--d) linear both; }
@keyframes b-beam { from { transform: translateX(-75%); } to { transform: translateX(75%); } }
@keyframes b-beam-fade { 0% { opacity: 0; } 14%, 86% { opacity: 1; } 100% { opacity: 0; } }

/* ---- C: rise into light --------------------------------------------- */
[data-mode="c"] { overflow: hidden; padding: .06em 0; }
[data-mode="c"] .w { transform: translateY(105%); }
[data-mode="c"] .w.is-on {
  transform: none;
  transition: transform calc(.65s * var(--k)) cubic-bezier(.22,1,.36,1), opacity calc(.3s * var(--k)) ease;
  animation: sweep calc(1.2s * var(--k)) cubic-bezier(.45,0,.25,1) calc(.4s * var(--k)) both;
}
[data-mode="c"] .w.is-out { opacity: 1; transform: translateY(-105%); transition: transform calc(.6s * var(--k)) cubic-bezier(.64,0,.78,0); }

/* ---- D: bloom -------------------------------------------------------
   Every keyframe carries the same filter list so it interpolates smoothly. */
[data-mode="d"] .w.is-on {
  animation: d-bloom calc(.9s * var(--k)) cubic-bezier(.22,1,.36,1) both,
             sweep calc(1.2s * var(--k)) cubic-bezier(.45,0,.25,1) calc(.35s * var(--k)) both;
}
[data-mode="d"] .w.is-out { animation: d-fade calc(.5s * var(--k)) ease both; }
@keyframes d-bloom {
  0%   { opacity: 0; transform: scale(1.06); filter: blur(14px) brightness(2.4) drop-shadow(0 0 0 rgba(255,255,255,0)); }
  45%  { opacity: 1; transform: scale(1);    filter: blur(0)    brightness(1.5) drop-shadow(0 0 22px rgba(255,255,255,.5)); }
  100% { opacity: 1; transform: scale(1);    filter: blur(0)    brightness(1)   drop-shadow(0 0 0 rgba(255,255,255,0)); }
}
@keyframes d-fade {
  from { opacity: 1; transform: scale(1);   filter: blur(0)   brightness(1)   drop-shadow(0 0 0 rgba(255,255,255,0)); }
  to   { opacity: 0; transform: scale(.97); filter: blur(8px) brightness(1.3) drop-shadow(0 0 0 rgba(255,255,255,0)); }
}
</style>
</head>
<body>
<div class="wrap">
  <h1>Rotating word — the same light on every word</h1>
  <p class="lead">Today the light sweep and the word swap run on separate timers, so “passionate”, “connected” and
     “joyful” each catch it at a different moment. In A–D the sweep is triggered by the swap, so every word gets the
     identical pass. Same font, size, gradient and 2.6s rhythm as the live hero.</p>

  <div class="controls">
    <span>Speed</span>
    <button type="button" data-k="1" aria-pressed="true">Normal</button>
    <button type="button" data-k="3" aria-pressed="false">Slow motion ×3</button>
  </div>

  ${Object.entries(OPTIONS).map(([k, m]) => card(k, m)).join('')}
</div>

<script>
(function () {
  var INTERVAL = 2600, k = 1;
  var rots = [].slice.call(document.querySelectorAll('.rot'));
  var timers = [];

  function fireBeam(r) {
    var b = r.querySelector('.beam');
    if (!b) return;
    b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
  }

  function run(r) {
    var words = [].slice.call(r.querySelectorAll('.w')), i = 0;
    var outMs = Number(r.dataset.out);
    fireBeam(r);
    function step() {
      var out = words[i];
      i = (i + 1) % words.length;
      var next = words[i];
      out.classList.remove('is-on'); out.classList.add('is-out');
      next.classList.remove('is-out'); next.classList.add('is-on');
      fireBeam(r);
      setTimeout(function () { out.classList.remove('is-out'); }, outMs * k + 30);
      timers.push(setTimeout(step, INTERVAL * k));
    }
    timers.push(setTimeout(step, INTERVAL * k));
  }

  // Restart every card together so they can be compared side by side.
  function restart() {
    timers.forEach(clearTimeout); timers = [];
    rots.forEach(function (r) {
      var words = r.querySelectorAll('.w');
      words.forEach(function (w, j) { w.classList.remove('is-out'); w.classList.toggle('is-on', j === 0); });
      // Re-trigger the first word's entrance animation.
      words[0].classList.remove('is-on'); void words[0].offsetWidth; words[0].classList.add('is-on');
    });
    rots.forEach(run);
  }

  document.querySelectorAll('[data-k]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      k = Number(btn.dataset.k);
      document.documentElement.style.setProperty('--k', k);
      document.querySelectorAll('[data-k]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      restart();
    });
  });

  restart();
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'word-sweep-options.html'), page);
console.log('built dist/word-sweep-options.html');

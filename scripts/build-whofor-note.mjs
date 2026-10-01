// Builds /whofor-note-options.html — how the "Who is it for?" note leaves
// (and comes back) in round three's B3, "Prints and a note", when the promo
// plays with sound.
//
// Each option is B3 (dist/w3-prints.html) with one keyframe animation for the
// note. The same keyframes run forwards on play and in reverse on pause, so
// the note always returns the way it left. Two names per animation because a
// browser will not restart an animation whose name has not changed — "-out"
// and "-back" are identical bodies. Must run after build-whofor3.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const base = fs.readFileSync(path.join(dist, 'w3-prints.html'), 'utf8');

const OPTIONS = {
  lift: {
    label: 'N1 — Lift away',
    note: 'What B3 does now: the note lifts off the corner, turns and floats up to the right as it fades. Quick and clean.',
    ms: [800, 700],
    frames: `0%{transform:rotate(3deg);opacity:1}100%{transform:translate(40px,-70px) rotate(16deg);opacity:0}`,
  },
  peel: {
    label: 'N2 — Peel off',
    note: 'The note peels away from its tape like real paper: the bottom edge curls up towards you, then it flips up and out of sight. The most tactile.',
    pick: true,
    ms: [900, 800],
    origin: '50% 0',
    frames: `0%{transform:perspective(900px) rotate(3deg) rotateX(0);opacity:1}
      45%{transform:perspective(900px) rotate(3deg) rotateX(-38deg) translateY(-6px);opacity:1}
      100%{transform:perspective(900px) rotate(6deg) rotateX(-92deg) translateY(-30px);opacity:0}`,
  },
  swing: {
    label: 'N3 — Swing and drop',
    note: 'The tape lets go on one side: the note swings on its last corner, sways once, and drops out of the frame. Playful, a little theatrical.',
    ms: [1000, 800],
    origin: '18% 0',
    frames: `0%{transform:rotate(3deg);opacity:1}
      30%{transform:rotate(-14deg);opacity:1}
      55%{transform:rotate(7deg);opacity:1}
      100%{transform:translateY(160px) rotate(28deg);opacity:0}`,
  },
  breeze: {
    label: 'N4 — Caught by a breeze',
    note: 'The note flutters away to the right in a soft zig-zag, as if a breeze took it, and drifts out of view. Light and graceful.',
    ms: [1200, 900],
    frames: `0%{transform:rotate(3deg);opacity:1}
      25%{transform:translate(24px,-22px) rotate(-7deg);opacity:1}
      50%{transform:translate(90px,8px) rotate(11deg);opacity:.9}
      75%{transform:translate(170px,-14px) rotate(-5deg);opacity:.5}
      100%{transform:translate(260px,30px) rotate(20deg);opacity:0}`,
  },
  tuck: {
    label: 'N5 — Tuck behind',
    note: 'The note folds back on itself and slides in behind the video’s corner, as if being tucked under the print. The calmest — it goes somewhere rather than away.',
    ms: [900, 800],
    origin: '0 0',
    frames: `0%{transform:perspective(900px) rotate(3deg) rotateY(0) translate(0,0) scale(1);opacity:1}
      50%{transform:perspective(900px) rotate(0) rotateY(-55deg) translate(-20px,-20px) scale(.85);opacity:1}
      100%{transform:perspective(900px) rotate(0) rotateY(-80deg) translate(-60px,-50px) scale(.6);opacity:0}`,
  },
};

const css = (k, o) => `
@keyframes nt-${k}-out{${o.frames}}
@keyframes nt-${k}-back{${o.frames}}
.w3-copy.note{${o.origin ? `transform-origin:${o.origin};` : ''}transition:none!important}
.w3.is-watching .w3-copy.note{animation:nt-${k}-out ${o.ms[0]}ms cubic-bezier(.45,0,.2,1) forwards;pointer-events:none}
.w3.is-back .w3-copy.note{animation:nt-${k}-back ${o.ms[1]}ms cubic-bezier(.22,1,.36,1) reverse both}
@media (prefers-reduced-motion:reduce){.w3.is-watching .w3-copy.note{animation:none;opacity:0}.w3.is-back .w3-copy.note{animation:none}}`;

// is-back is set for the length of the return animation whenever the page's
// own script removes is-watching (on pause or at the end).
const backJs = (ms) => `<script>
(function(){var s=document.getElementById('whofor');if(!s)return;var was=false,t=null;
// Only touch is-back when it actually changes: classList.remove rewrites the
// class attribute even when the class is absent, which re-fires this observer
// and loops until the renderer dies.
new MutationObserver(function(){var now=s.classList.contains('is-watching');
  if(now===was)return;was=now;
  if(!now){s.classList.add('is-back');clearTimeout(t);t=setTimeout(function(){s.classList.remove('is-back');},${ms});}
  else if(s.classList.contains('is-back')){clearTimeout(t);s.classList.remove('is-back');}}).observe(s,{attributes:true,attributeFilter:['class']});
// demo toggle from the options page: simulate play / pause without sound
addEventListener('message',function(e){if(e.data!=='nt-toggle')return;s.classList.toggle('is-watching');});})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `nt-${k}.html`), base
    .replace('</head>', `<style>${css(k, o)}</style></head>`)
    .replace('</body>', `${backJs(o.ms[1])}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" class="tog" data-toggle="${k}">▶ Play / ❚❚ pause (demo)</button> · <a href="/nt-${k}.html#whofor" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="860"><iframe data-k="${k}" src="/nt-${k}.html#whofor" title="${esc(o.label)}" loading="lazy" width="1440" height="860" allow="autoplay"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="760"><iframe data-k="${k}" src="/nt-${k}.html#whofor" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="760" allow="autoplay"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>B3 note animation — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:840px; margin:10px 0 0; }
.opt { margin-top:52px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:840px; font-size:15px; }
.links { margin:8px 0 0; font:700 13px Montserrat, sans-serif; color:var(--soft); }
.links a { color:var(--magenta); }
.tog { font:700 12px Montserrat, sans-serif; letter-spacing:.06em; color:#fff; background:var(--magenta); border:0; border-radius:999px; padding:10px 16px; min-height:40px; cursor:pointer; }
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
  <h1>B3 — how the note leaves when she plays</h1>
  <p class="lead">Five ways the “Who is it for?” note gets out of the way when the promo plays with sound — each comes back
     the same way it left when you pause. Use <strong>Play / pause (demo)</strong> to watch it without sound, or press
     <em>Tap for sound</em> inside a preview for the real thing.</p>
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
  document.querySelectorAll('[data-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('iframe[data-k="' + b.dataset.toggle + '"]').forEach(function (f) {
        try { f.contentWindow.postMessage('nt-toggle', '*'); } catch (e) {}
      });
    });
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'whofor-note-options.html'), page);
console.log('built dist/whofor-note-options.html + ' + Object.keys(OPTIONS).length + ' frames');

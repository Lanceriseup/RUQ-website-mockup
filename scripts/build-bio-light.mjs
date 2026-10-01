// Builds /bio-light-options.html — light designs for the team bio popup.
//
// The dialog itself is unchanged: bio-modal.js builds the same markup and the
// "lift" entrance still flies the polaroid from the card into the panel's
// photo slot. Each option is a CSS skin over that markup, injected into the
// real team page, so what you click in a preview is the production dialog.
// Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const team = fs.readFileSync(path.join(dist, 'team.html'), 'utf8');

// Shared light basics every skin starts from.
const BASE = `
.bio-modal-panel{outline:0}
.bio-modal-name{color:#1c1c1c}
.bio-modal-prose p{color:#3a3a3a;font-size:15px;line-height:1.75}
.bio-modal-close{color:#1c1c1c;background:#fff;outline:1px solid rgba(28,28,28,.12);box-shadow:0 8px 20px -10px rgba(0,0,0,.35)}
.bio-modal-close:hover{background:#fdeaf3}
@media (max-width:767px){.bio-modal-media{height:auto}.bio-modal-media img{height:min(46vh,360px)}}
.bio-modal-body::-webkit-scrollbar{width:8px}.bio-modal-body::-webkit-scrollbar-thumb{background:rgba(232,32,143,.25);border-radius:8px}`;

const OPTIONS = {
  cream: {
    label: 'P1 — Cream editorial',
    note: 'A warm ivory panel over a soft blush haze instead of a dark backdrop. Her name set large in serif, the role as a small pink pill, the bio in comfortable dark-grey type, and a fine pink-to-teal line under the name. Calm and readable — the closest to a printed profile.',
    pick: true,
    css: `${BASE}
.bio-modal-backdrop{background:rgba(253,236,243,.72);backdrop-filter:blur(10px)}
.bio-modal-panel{background:#fffdf9;border-radius:28px;box-shadow:0 60px 120px -50px rgba(232,32,143,.55),0 24px 50px -30px rgba(28,28,28,.35)}
.bio-modal-body{padding:2.6rem 2.6rem 2.4rem}
.bio-modal-role{display:inline-block;padding:6px 12px;border-radius:999px;background:#fdeaf3;color:#dc1e88}
.bio-modal-name{margin-top:1rem;font:600 clamp(30px,3vw,40px)/1.05 'Cormorant Garamond',Georgia,serif}
.bio-modal-name::after{content:"";display:block;width:64px;height:2px;margin-top:16px;border-radius:2px;background:linear-gradient(90deg,#e8208f,#00b9c6)}`,
  },
  sky: {
    label: 'P2 — Sky glass',
    note: 'A frosted glass panel floating over the page, with the same brand sky as the team page washing through the backdrop and a soft pink-to-teal edge glowing round it. Her name in the brush script. The airiest, and it ties the popup to the page behind it.',
    css: `${BASE}
.bio-modal-backdrop{background:linear-gradient(160deg,rgba(167,223,228,.55),rgba(255,255,255,.55) 50%,rgba(247,199,220,.55));backdrop-filter:blur(14px)}
.bio-modal-panel{background:rgba(255,255,255,.82);backdrop-filter:blur(18px);border-radius:30px;box-shadow:0 0 0 1.5px rgba(255,255,255,.9),0 0 0 3px rgba(232,32,143,.18),0 60px 120px -50px rgba(0,131,141,.55)}
.bio-modal-media{padding:14px}
.bio-modal-media img{border-radius:20px}
.bio-modal-role{color:#00838d}
.bio-modal-name{margin-top:.4rem;font:400 clamp(40px,4vw,54px)/1 'Julietta Messie',cursive;color:#e8208f}`,
  },
  polaroid: {
    label: 'P3 — Polaroid letter',
    note: 'The card she was opened from carries straight through: her photo stays a white-framed, slightly tilted polaroid inside the panel, beside a cream “letter” with her name, role and story. The most continuous with the cards on the page.',
    css: `${BASE}
.bio-modal-backdrop{background:rgba(250,244,238,.78);backdrop-filter:blur(8px)}
.bio-modal-panel{background:linear-gradient(180deg,#fffdf9,#fbf4ee);border-radius:24px;box-shadow:0 50px 100px -50px rgba(28,28,28,.55)}
.bio-modal-media{padding:28px 10px 28px 28px;background:transparent}
.bio-modal-media img{padding:10px 10px 14px;background:#fff;border-radius:4px;transform:rotate(-2.5deg);box-shadow:0 26px 50px -24px rgba(28,28,28,.6)}
@media (max-width:767px){.bio-modal-media{padding:24px 24px 0}.bio-modal-media img{height:min(40vh,320px)}}
.bio-modal-role{color:#dc1e88}
.bio-modal-name{font:700 clamp(26px,2.6vw,34px)/1.1 Montserrat,sans-serif}
.bio-modal-name::after{content:"";display:block;width:48px;height:2px;margin-top:14px;background:#e8208f}`,
  },
  wash: {
    label: 'P4 — Colour wash',
    note: 'A crisp white panel with the photo set on a soft teal-to-blush wash that bleeds into the text side, a large faint pink quotation mark behind her story, and the role and name on a gradient accent bar. The most colourful of the four, still light throughout.',
    css: `${BASE}
.bio-modal-backdrop{background:rgba(28,28,28,.28);backdrop-filter:blur(8px)}
.bio-modal-panel{background:#fff;border-radius:26px;box-shadow:0 60px 120px -50px rgba(28,28,28,.6)}
.bio-modal-media{position:relative;background:linear-gradient(160deg,#a7dfe4,#dfd3e6 55%,#f7c7dc)}
.bio-modal-media img{mix-blend-mode:normal;-webkit-mask-image:linear-gradient(to right,#000 80%,transparent);mask-image:linear-gradient(to right,#000 80%,transparent)}
@media (max-width:767px){.bio-modal-media img{-webkit-mask-image:linear-gradient(#000 80%,transparent);mask-image:linear-gradient(#000 80%,transparent)}}
.bio-modal-body{position:relative;padding:2.6rem 2.4rem}
.bio-modal-body::before{content:"“";position:absolute;right:28px;bottom:-60px;font:700 180px/1 'Cormorant Garamond',Georgia,serif;color:#e8208f;opacity:.1;pointer-events:none}
.bio-modal-role{display:inline-block;padding:6px 14px;border-radius:999px;color:#fff;background:linear-gradient(92deg,#e8208f,#00b9c6)}
.bio-modal-name{margin-top:.9rem;font:800 clamp(26px,2.6vw,34px)/1.1 Montserrat,sans-serif;text-transform:uppercase;letter-spacing:-.005em}`,
  },
};

const OPEN = `<script>addEventListener('message',function(e){if(e.data!=='bl-open')return;var b=document.querySelector('[data-bio-open]');if(b){b.scrollIntoView({block:'center'});setTimeout(function(){b.click()},350);}});</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `bl-${k}.html`), team
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${o.css}</style></head>`)
    .replace('</body>', `${OPEN}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" class="tog" data-open="${k}">Open a bio</button> · <a href="/bl-${k}.html" target="_blank" rel="noopener">Open full page ↗</a> — or press any “Read bio” inside the preview</p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe data-k="${k}" src="/bl-${k}.html" title="${esc(o.label)}" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe data-k="${k}" src="/bl-${k}.html" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bio popup — light — ${esc(site.brand.name)}</title>
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
  <h1>Team bio popup — light</h1>
  <p class="lead">Four light designs for the popup that opens from “Read bio”. The lift animation — the polaroid flying from
     the card into the popup — is exactly as it is now; only the popup’s look changes. Press <strong>Open a bio</strong> to
     open Jessica Lewis’s bio in both previews, or click any card inside a preview.</p>
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
  document.querySelectorAll('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('iframe[data-k="' + b.dataset.open + '"]').forEach(function (f) {
        try { f.contentWindow.postMessage('bl-open', '*'); } catch (e) {}
      });
    });
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'bio-light-options.html'), page);
console.log('built dist/bio-light-options.html + ' + Object.keys(OPTIONS).length + ' frames');

// Builds /about-bg-options.html — backgrounds for the band of the about page
// that runs from "Who is it for?" through "The journey doesn't end…", so the
// two sections stop reading as plain blush.
//
// One layer spans both sections (from the top of #whofor to the top of the
// closing CTA), sitting on the journey panel's ground and under its content,
// and fades in and out at its ends so it never starts or stops on a line.
// Preview only: the layer is placed by script here; the chosen one becomes
// markup in about-journey.mjs. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
// The shipped lights are removed first, so each preview shows only its option.
const about = fs.readFileSync(path.join(dist, 'about.html'), 'utf8')
  .replace(/<div class="al" data-al[\s\S]*?<\/div>/, '');
const ARCH = about.indexOf('<div class="relative z-10 -mt-6 sm:-mt-16">');
// Options go where the drag handle was; it was removed 2026-10-10 and left a
// comment in its place, which marks the same spot.
const handle = about.indexOf('<!-- The drag-handle pill was removed', ARCH);
if (ARCH < 0 || handle < 0) throw new Error('build-about-bg: journey panel not found');

// Deterministic scatter, so every build draws the same field.
let seed = 7;
const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

const PINK = '/assets/brand/stroke-hook-lightpink.svg';
const TEAL = '/assets/brand/stroke-hook-teal.svg';

const OPTIONS = {
  aurora: {
    label: 'C1 — Aurora',
    note: 'Four huge, soft clouds of brand light — pink, teal, blush and a touch of gold — drifting very slowly behind both sections, like northern lights. Never the same frame twice; nothing sharp, so it never competes with the video or the cards.',
    pick: true,
    html: () => `<div class="bg-layer bg-aurora">${['a1', 'a2', 'a3', 'a4'].map(c => `<i class="${c}"></i>`).join('')}</div>`,
  },
  bokeh: {
    label: 'C2 — Event lights',
    note: 'Soft out-of-focus circles of pink, teal and warm gold light floating slowly upward, like stage lights and balloons through a camera at the event itself. Festive and warm, and it ties the photographs to the page around them.',
    html: () => {
      const cols = ['232,32,143', '0,185,198', '228,190,120', '240,86,159'];
      let s = '';
      for (let i = 0; i < 26; i++) {
        const size = Math.round(24 + rnd() * 130), x = (rnd() * 100).toFixed(1), y = (rnd() * 100).toFixed(1);
        const c = cols[i % cols.length], a = (0.16 + rnd() * 0.22).toFixed(2), d = (14 + rnd() * 16).toFixed(1), dl = (-rnd() * 20).toFixed(1);
        s += `<i style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;background:radial-gradient(circle,rgba(${c},${a}) 0%,rgba(${c},${(a * .5).toFixed(2)}) 45%,transparent 70%);animation-duration:${d}s;animation-delay:${dl}s"></i>`;
      }
      return `<div class="bg-layer bg-bokeh">${s}</div>`;
    },
  },
  ribbons: {
    label: 'C3 — Flowing ribbons',
    note: 'Fine pink-to-teal lines flow across the whole band in long curves, like silk ribbons, threading “Who is it for?” and the journey together into one story. They drift slowly as you scroll. Elegant and quiet.',
    html: () => `<div class="bg-layer bg-ribbons" data-par>
      <svg viewBox="0 0 1440 2000" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="rbx" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#e8208f"/><stop offset=".55" stop-color="#f0569f"/><stop offset="1" stop-color="#00b9c6"/></linearGradient></defs>
        ${[
          'M-40 180 C 320 60, 620 420, 980 300 S 1380 120, 1500 260',
          'M-40 260 C 360 160, 640 520, 1000 400 S 1400 220, 1500 360',
          'M-40 980 C 300 860, 700 1180, 1040 1040 S 1360 880, 1500 1000',
          'M-40 1060 C 280 960, 720 1300, 1060 1140 S 1380 980, 1500 1100',
          'M-40 1700 C 340 1560, 660 1900, 1020 1760 S 1380 1600, 1500 1720',
        ].map((d, i) => `<path class="r${i}" d="${d}" fill="none" stroke="url(#rbx)" stroke-width="${i % 2 ? 1.5 : 2.5}" vector-effect="non-scaling-stroke"/>`).join('')}
      </svg></div>`,
  },
  brush: {
    label: 'C4 — Brush gallery',
    note: 'The brand’s own pink and teal brush strokes, set large and scattered across the band at soft strength, each drifting at its own speed as you scroll so the page has depth. Ties back to the strokes in the Freedom section on the homepage.',
    html: () => `<div class="bg-layer bg-brush" data-par>
      <img class="b1" src="${PINK}" alt=""><img class="b2" src="${TEAL}" alt=""><img class="b3" src="${PINK}" alt=""><img class="b4" src="${TEAL}" alt=""><img class="b5" src="${PINK}" alt="">
    </div>`,
  },
  crown: {
    label: 'C5 — Royal pattern',
    note: 'A delicate pattern of the Rise Up Queens crown repeated across the band in the faintest pink, fading out towards the edges, with a soft blush glow behind it — like a luxury wallpaper or the lining of a jewellery box.',
    html: () => `<div class="bg-layer bg-crown"><i></i></div>`,
  },
};

const CSS = `
.bg-layer{position:absolute;left:0;right:0;top:0;height:0;pointer-events:none;overflow:hidden;
  -webkit-mask-image:linear-gradient(transparent,#000 9%,#000 91%,transparent);mask-image:linear-gradient(transparent,#000 9%,#000 91%,transparent)}
.bg-layer i{position:absolute;display:block}

/* aurora */
.bg-aurora i{border-radius:50%;filter:blur(70px);will-change:transform}
.bg-aurora .a1{left:-12%;top:4%;width:62vw;height:62vw;max-width:900px;max-height:900px;background:radial-gradient(circle,rgba(232,32,143,.46),transparent 65%);animation:au1 26s ease-in-out infinite alternate}
.bg-aurora .a2{right:-14%;top:22%;width:58vw;height:58vw;max-width:860px;max-height:860px;background:radial-gradient(circle,rgba(0,185,198,.42),transparent 65%);animation:au2 31s ease-in-out infinite alternate}
.bg-aurora .a3{left:12%;top:52%;width:64vw;height:64vw;max-width:920px;max-height:920px;background:radial-gradient(circle,rgba(240,86,159,.34),transparent 65%);animation:au3 29s ease-in-out infinite alternate}
.bg-aurora .a4{right:4%;top:72%;width:46vw;height:46vw;max-width:700px;max-height:700px;background:radial-gradient(circle,rgba(228,190,120,.38),transparent 65%);animation:au1 34s ease-in-out infinite alternate-reverse}
@keyframes au1{from{transform:translate(0,0) scale(1)}to{transform:translate(12vw,6%) scale(1.15)}}
@keyframes au2{from{transform:translate(0,0) scale(1.1)}to{transform:translate(-14vw,-5%) scale(.95)}}
@keyframes au3{from{transform:translate(0,0) scale(1)}to{transform:translate(8vw,-8%) scale(1.2)}}

/* bokeh */
.bg-bokeh i{border-radius:50%;filter:blur(2px);animation:bk-float linear infinite}
@keyframes bk-float{0%{transform:translate(0,40px);opacity:0}15%{opacity:1}50%{transform:translate(18px,-60px)}85%{opacity:1}100%{transform:translate(-10px,-160px);opacity:0}}

/* ribbons */
.bg-ribbons svg{position:absolute;inset:0;width:100%;height:100%;translate:0 calc(var(--p,0) * 60px)}
.bg-ribbons path{opacity:.7;stroke-dasharray:6 0;animation:rb-flow 18s ease-in-out infinite alternate}
.bg-ribbons .r1,.bg-ribbons .r3{opacity:.45;animation-duration:23s}
@keyframes rb-flow{from{transform:translateX(-30px)}to{transform:translateX(30px)}}

/* brush */
.bg-brush img{position:absolute;height:auto;translate:0 calc(var(--p,0) * var(--d,80px))}
.bg-brush .b1{left:-8%;top:3%;width:clamp(260px,32vw,520px);opacity:.55;rotate:-12deg;--d:120px}
.bg-brush .b2{right:-10%;top:20%;width:clamp(240px,28vw,460px);opacity:.22;rotate:168deg;--d:-90px}
.bg-brush .b3{right:-6%;top:46%;width:clamp(220px,26vw,420px);opacity:.4;rotate:20deg;--d:140px}
.bg-brush .b4{left:-10%;top:62%;width:clamp(260px,30vw,500px);opacity:.2;rotate:190deg;--d:-110px}
.bg-brush .b5{left:30%;top:84%;width:clamp(200px,22vw,360px);opacity:.3;rotate:-6deg;--d:70px}

/* crown pattern */
.bg-crown i{inset:0;background:radial-gradient(60% 40% at 50% 30%,rgba(248,200,224,.75),transparent 70%),radial-gradient(60% 40% at 50% 75%,rgba(190,236,240,.7),transparent 70%)}
.bg-crown::after{content:"";position:absolute;inset:0;background:url(/assets/brand/crown-magenta.png) 0 0/58px auto repeat;opacity:.14;
  -webkit-mask-image:radial-gradient(70% 60% at 50% 50%,#000 30%,transparent 80%);mask-image:radial-gradient(70% 60% at 50% 50%,#000 30%,transparent 80%)}

@media (prefers-reduced-motion:reduce){.bg-layer *{animation:none!important}.bg-ribbons svg,.bg-brush img{translate:none!important}}`;

// Place the layer from the top of #whofor to the top of the closing CTA, in
// the panel's coordinates, and feed a scroll position to the drifting ones.
const JS = `<script>
(function(){var arch=document.querySelector('.bg-layer')&&document.querySelector('.bg-layer').parentNode,L=document.querySelector('.bg-layer');if(!L)return;
function place(){var a=arch.getBoundingClientRect(),w=document.getElementById('whofor'),c=document.getElementById('closing-about');if(!w||!c)return;
  var top=w.getBoundingClientRect().top-a.top-80,bot=c.getBoundingClientRect().top-a.top+40;L.style.top=top+'px';L.style.height=(bot-top)+'px';}
var raf=0;function par(){raf=0;var r=L.getBoundingClientRect(),vh=innerHeight;var p=((r.top+r.height/2)-vh/2)/(r.height/2+vh/2);L.style.setProperty('--p',Math.max(-1,Math.min(1,p)).toFixed(3));}
addEventListener('load',place);addEventListener('resize',place);setTimeout(place,300);setTimeout(place,1500);
if(L.hasAttribute('data-par')){addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(par);},{passive:true});par();}
addEventListener('load',function(){var w=document.getElementById('whofor');if(location.hash==='#band'&&w)scrollTo(0,w.getBoundingClientRect().top+scrollY-40);});
})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `ab-${k}.html`),
    (about.slice(0, handle) + o.html() + about.slice(handle))
      .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
      .replace('</body>', `${JS}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/ab-${k}.html#band" target="_blank" rel="noopener">Open full page ↗</a> — scroll through both sections to see it move</p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1600"><iframe src="/ab-${k}.html#band" title="${esc(o.label)}" loading="lazy" width="1440" height="1600" allow="autoplay"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="1400"><iframe src="/ab-${k}.html#band" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="1400" allow="autoplay"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About background options — ${esc(site.brand.name)}</title>
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
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; color:var(--soft); }
.links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
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
  <h1>About page — background for “Who is it for?” and the journey</h1>
  <p class="lead">One background runs behind both sections, so they read as one band rather than two plain blocks. It fades
     in above “Who is it for?” and out before the closing CTA. Each preview is the real about page with the new journey
     photographs, opened at the band — tall frames, so you can see both sections at once.</p>
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

fs.writeFileSync(path.join(dist, 'about-bg-options.html'), page);
console.log('built dist/about-bg-options.html + ' + Object.keys(OPTIONS).length + ' frames');

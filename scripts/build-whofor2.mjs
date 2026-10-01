// Builds /whofor2-options.html — second round on "Who is it for?", all built
// on round one's option A ("Main stage") with the statement moved to the TOP.
//
// Kept from A in every one: the muted promo with "Tap for sound" (unmutes and
// restarts it), the frosted "Who is it for?" card, and the gradient light
// sweeping across "It's Spirit-led transformation." What changes is how the
// video arrives and how the card meets it.
//
// Each option is the real about page with the section inserted after
// #founder. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const about = fs.readFileSync(path.join(dist, 'about.html'), 'utf8')
  .replace(/<section id="whofor"[\s\S]*?<\/section>/, '');
const F = about.indexOf('<section id="founder"');
if (F < 0) throw new Error('build-whofor2: #founder not found in dist/about.html');
const after = about.indexOf('</section>', F) + '</section>'.length;

const w = content.about.whoFor;
const [s1, s2] = w.statement;
const SND = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6"/></svg>';

// Non-breaking hyphens, so "surface-level" and "Spirit-led" never split across lines.
const nb = (t) => esc(t).replace(/-/g, '‑');
const head = (cls = '') => `<h2 class="w2-st ${cls}"><span>${nb(s1)}</span> <span class="b">${nb(s2)}</span></h2>`;
const video = (cls = '') => `
  <div class="w2-video ${cls}" data-w2-live>
    <video muted loop playsinline autoplay preload="metadata" poster="${esc(w.poster)}" aria-label="${esc(w.videoTitle)}"><source src="${esc(w.video)}" type="video/mp4"></video>
    <button type="button" class="w2-snd">${SND}<span>Tap for sound</span></button>
  </div>`;
const card = (cls = '') => `<div class="w2-card ${cls}"><p class="w2-script">${esc(w.heading)}</p><p class="w2-p">${esc(w.body)}</p></div>`;

const OPTIONS = {
  stage: {
    label: 'A1 — Main stage, headline first',
    note: 'Round one’s A, reordered: the statement opens the section, the light sweeps across “It’s Spirit-led transformation”, then the promo plays in its wide glowing frame with the frosted “Who is it for?” card overlapping its lower-left corner. The closest to what you liked.',
    pick: true,
    html: `
<section id="whofor" class="w2 w2-a" data-w2>
  <div class="w2-in">
    ${head()}
    <div class="w2-stage">${video('glow')}${card('left')}</div>
  </div>
</section>`,
  },
  curtain: {
    label: 'A2 — Curtain rise',
    note: 'The statement, then the frame opens like a stage curtain: it starts as a thin glowing slit and unfolds to full height as the section scrolls in, with the promo already playing inside. The card then glides in from the right and settles over the corner.',
    html: `
<section id="whofor" class="w2 w2-b" data-w2>
  <div class="w2-in">
    ${head()}
    <div class="w2-stage">${video('glow curtain')}${card('right slide')}</div>
  </div>
</section>`,
  },
  tilt: {
    label: 'A3 — Into view',
    note: 'The video starts tilted back in 3D, like a screen lying in the distance, and straightens to face you as you scroll down to it, its glow brightening as it does. The card floats in front and drifts at a slightly different speed, so the two separate in depth.',
    html: `
<section id="whofor" class="w2 w2-c" data-w2 data-w2-tilt>
  <div class="w2-in">
    ${head()}
    <div class="w2-stage persp">${video('glow tilt')}${card('right float')}</div>
  </div>
</section>`,
  },
  halo: {
    label: 'A4 — Halo frame',
    note: 'A beam of pink and teal light runs continuously around the video’s edge, and a soft halo breathes behind it. The statement above, the card set beside the video rather than over it, so nothing covers the picture. Quietly animated the whole time it is on screen.',
    html: `
<section id="whofor" class="w2 w2-d" data-w2>
  <div class="w2-in">
    ${head()}
    <div class="w2-row">
      <div class="w2-halo"><span class="glow" aria-hidden="true"></span><div class="ring"><span class="beam" aria-hidden="true"></span>${video('inset')}</div></div>
      ${card('side')}
    </div>
  </div>
</section>`,
  },
};

const CSS = `
.w2{position:relative;overflow:hidden;color:#1c1c1c;text-align:center;padding:clamp(56px,7vw,104px) 0 clamp(64px,8vw,120px)}
.w2 *{box-sizing:border-box}.w2 p{margin:0}
.w2-in{position:relative;z-index:2;max-width:72rem;margin:0 auto;padding:0 20px}
.w2-st{margin:0 auto;max-width:68rem;font:800 clamp(24px,3.1vw,44px)/1.12 Montserrat,sans-serif;letter-spacing:-.01em;text-transform:uppercase}
.w2-st span{display:block}
.w2-st .b{margin-top:4px;background-image:linear-gradient(100deg,transparent 40%,rgba(255,255,255,.9) 50%,transparent 60%),linear-gradient(92deg,#e8208f,#f0569f 40%,#00b9c6);
  background-size:250% 100%,100% 100%;background-position:100% 0,0 0;-webkit-background-clip:text;background-clip:text;color:transparent}
.w2.is-in .w2-st .b{animation:w2-sweep 1.8s cubic-bezier(.45,0,.25,1) .4s both}
@keyframes w2-sweep{from{background-position:100% 0,0 0}to{background-position:0% 0,0 0}}
.w2-stage{position:relative;max-width:62rem;margin:clamp(36px,5vw,60px) auto 0}

.w2-video{position:relative;overflow:hidden;aspect-ratio:16/9;border-radius:20px;background:#1c1c1c}
.w2-video video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.w2-video.glow{box-shadow:0 0 0 1px rgba(0,185,198,.45),0 0 100px -20px rgba(0,185,198,.5),0 40px 90px -40px rgba(232,32,143,.6)}
.w2-snd{position:absolute;right:14px;bottom:14px;z-index:2;display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 16px;border:0;border-radius:999px;cursor:pointer;
  background:rgba(28,28,28,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font:700 11px/1 Lato,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#fff;transition:opacity .3s,background .2s}
.w2-snd:hover{background:#e8208f}
.w2-video.is-on .w2-snd{opacity:0;pointer-events:none}

.w2-card{position:relative;z-index:3;text-align:left;padding:26px 28px;border-radius:24px;background:rgba(255,255,255,.84);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
  box-shadow:inset 0 0 0 1px rgba(232,32,143,.25),0 30px 60px -30px rgba(28,28,28,.4);max-width:26rem}
.w2-script{font:400 clamp(40px,3.6vw,52px)/1 'Julietta Messie',cursive;color:#e8208f}
.w2-p{margin-top:12px!important;font:400 clamp(15.5px,1.2vw,17px)/1.7 Lato,sans-serif;color:#3a3a3a}
/* phones: the card follows the video with a short overlap */
.w2-card.left,.w2-card.right{margin:-24px 12px 0 auto}
@media (min-width:900px){
  .w2-card.left{position:absolute;left:-44px;bottom:-56px;margin:0}
  .w2-card.right{position:absolute;right:-44px;bottom:-56px;margin:0}
  .w2-a,.w2-b,.w2-c{padding-bottom:calc(clamp(64px,8vw,120px) + 56px)}
}

/* A2 — curtain */
.w2-video.curtain{clip-path:inset(48% 0 48% 0 round 20px);transition:clip-path 1.6s cubic-bezier(.65,0,.35,1) .5s}
.w2.is-in .w2-video.curtain{clip-path:inset(0 0 0 0 round 20px)}
.w2-card.slide{opacity:0;translate:60px 0;transition:opacity .9s ease 1.8s,translate .9s cubic-bezier(.22,1,.36,1) 1.8s}
.w2.is-in .w2-card.slide{opacity:1;translate:0 0}

/* A3 — into view (scroll-linked; --t runs 1 → 0 as the stage reaches the middle of the screen) */
.w2-stage.persp{perspective:1400px}
.w2-video.tilt{transform-origin:50% 100%;transform:rotateX(calc(var(--t,0) * 26deg)) scale(calc(1 - var(--t,0) * .08));
  box-shadow:0 0 0 1px rgba(0,185,198,.45),0 0 calc(40px + (1 - var(--t,0)) * 80px) -20px rgba(0,185,198,.55),0 40px 90px -40px rgba(232,32,143,.6)}
.w2-card.float{translate:0 calc(var(--t,0) * 90px)}

/* A4 — halo */
.w2-row{display:grid;gap:28px;align-items:center;margin-top:clamp(36px,5vw,60px)}
@media (min-width:900px){.w2-row{grid-template-columns:1.6fr 1fr;gap:44px}}
/* glow outside, beam clipped inside the ring: the ring is the 3px border the beam shows through */
.w2-halo{position:relative}
.w2-halo .glow{position:absolute;inset:-30px;border-radius:50px;background:radial-gradient(60% 60% at 50% 50%,rgba(232,32,143,.28),rgba(0,185,198,.18) 60%,transparent 75%);filter:blur(30px);animation:w2-breathe 5s ease-in-out infinite}
@keyframes w2-breathe{0%,100%{opacity:.55}50%{opacity:1}}
.w2-halo .ring{position:relative;padding:3px;border-radius:23px;overflow:hidden;isolation:isolate;background:rgba(28,28,28,.08)}
.w2-halo .beam{position:absolute;left:50%;top:50%;width:200%;aspect-ratio:1;z-index:-1;translate:-50% -50%;
  background:conic-gradient(from 0deg,transparent 0 60%,#e8208f 72%,#fff 76%,#00b9c6 82%,transparent 92%);animation:w2-spin 6s linear infinite}
@keyframes w2-spin{to{rotate:360deg}}
.w2-halo .w2-video{border-radius:20px}
.w2-card.side{max-width:none;background:#fff}

/* card steps aside while the video plays with sound: drifts down, fades, softens */
.w2-card{transition:opacity .6s ease,transform .7s cubic-bezier(.22,1,.36,1),filter .6s ease}
.w2.is-watching .w2-card{opacity:0;transform:translateY(28px) scale(.96);filter:blur(6px);pointer-events:none}

@media (prefers-reduced-motion:reduce){.w2 *{animation:none!important;transition:none!important}.w2-video.curtain{clip-path:none}.w2-card.slide{opacity:1;translate:none}
  .w2-video.tilt{transform:none}.w2-card.float{translate:none}}`;

const JS = `<script>
(function(){
var s=document.querySelector('[data-w2]');if(!s)return;
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){s.classList.add('is-in');io.disconnect();}},{threshold:.25});io.observe(s);}else s.classList.add('is-in');
s.querySelectorAll('video[autoplay]').forEach(function(v){
  if(reduced){v.removeAttribute('autoplay');v.pause();return;}
  new IntersectionObserver(function(e){if(e[0].isIntersecting)v.play().catch(function(){});else if(v.muted)v.pause();},{threshold:.2}).observe(v);});
s.querySelectorAll('[data-w2-live]').forEach(function(box){var v=box.querySelector('video'),b=box.querySelector('.w2-snd');
  b.addEventListener('click',function(){v.muted=false;v.loop=false;v.currentTime=0;v.controls=true;v.play();box.classList.add('is-on');s.classList.add('is-watching');});
  // The card steps aside while she is being watched with sound, and comes back on pause or at the end.
  v.addEventListener('play',function(){if(!v.muted)s.classList.add('is-watching');});
  v.addEventListener('pause',function(){if(!v.muted)s.classList.remove('is-watching');});
  v.addEventListener('ended',function(){s.classList.remove('is-watching');});});
if(s.hasAttribute('data-w2-tilt')&&!reduced){var st=s.querySelector('.w2-stage'),raf=0;
  function upd(){raf=0;var r=st.getBoundingClientRect(),vh=innerHeight;var p=(r.top+r.height/2-vh/2)/(vh*.6);s.style.setProperty('--t',Math.max(0,Math.min(1,p)).toFixed(3));}
  addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(upd);},{passive:true});addEventListener('resize',upd);upd();}
addEventListener('load',function(){if(location.hash==='#whofor')scrollTo(0,s.getBoundingClientRect().top+scrollY-30);});
})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `w2-${k}.html`),
    (about.slice(0, after) + o.html + about.slice(after))
      .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
      .replace('</body>', `${JS}</body>`));
}

const cardHtml = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" data-replay="${k}">↻ Replay</button> · <a href="/w2-${k}.html#whofor" target="_blank" rel="noopener">Open full page ↗</a> — scroll inside the full page to see A3 move</p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe data-k="${k}" src="/w2-${k}.html#whofor" title="${esc(o.label)}" loading="lazy" width="1440" height="900" allow="autoplay"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe data-k="${k}" src="/w2-${k}.html#whofor" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844" allow="autoplay"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Who is it for? — round two — ${esc(site.brand.name)}</title>
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
.links a, .links button { color:var(--magenta); background:none; border:0; padding:0; font:inherit; cursor:pointer; }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 300px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:300px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Who is it for? — round two, headline first</h1>
  <p class="lead">Every option keeps what you liked about A — the muted promo with “Tap for sound”, the frosted card, the
     light sweeping across “Spirit-led transformation” — with the statement now opening the section. They differ in how the
     video arrives. <strong>Replay</strong> re-runs an entrance; A3 is driven by scrolling, so open it full page to feel it.</p>
  ${Object.entries(OPTIONS).map(([k, o]) => cardHtml(k, o)).join('')}
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
        f.src = '/w2-' + b.dataset.replay + '.html?r=' + Date.now() + '#whofor';
      });
    });
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'whofor2-options.html'), page);
console.log('built dist/whofor2-options.html + ' + Object.keys(OPTIONS).length + ' frames');

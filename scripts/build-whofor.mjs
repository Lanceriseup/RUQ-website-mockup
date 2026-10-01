// Builds /whofor-options.html — "Who is it for?" on the about page, below the
// Jessica Lewis feature, built around the RUQ promo video
// (src/assets/video/ruq-promo.mp4, 1280×720, 66s).
//
// Copy is content.json about.whoFor, from the client's mockup. The poster is
// a frame at 0:12 captured in Chrome (no ffmpeg on this machine).
//
// Every option keeps the video silent until asked: either a muted preview
// with "Tap for sound" (which unmutes and restarts it), or a poster with a
// play button. Each preview is the real about page with the section inserted
// after #founder. Must run after scripts/build.mjs.
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
if (F < 0) throw new Error('build-whofor: #founder not found in dist/about.html');
const after = about.indexOf('</section>', F) + '</section>'.length;

const w = content.about.whoFor;
const [s1, s2] = w.statement;
const SND = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6"/></svg>';
const PLAY = '<svg width="26" height="26" viewBox="0 0 24 24" fill="#e8208f" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

// A muted, looping preview that a tap unmutes and restarts.
const live = (cls = '') => `
  <div class="wf-video ${cls}" data-wf-live>
    <video muted loop playsinline autoplay preload="metadata" poster="${esc(w.poster)}" aria-label="${esc(w.videoTitle)}"><source src="${esc(w.video)}" type="video/mp4"></video>
    <button type="button" class="wf-snd">${SND}<span>Tap for sound</span></button>
  </div>`;
// A poster with a play button; the video loads only on click.
const facade = (cls = '') => `
  <div class="wf-video ${cls}" data-wf-click>
    <img src="${esc(w.poster)}" alt="" aria-hidden="true">
    <button type="button" class="wf-play" aria-label="Play ${esc(w.videoTitle)}"><span>${PLAY}</span></button>
  </div>`;

const statement = (cls = '') => `<p class="wf-st ${cls}"><span>${esc(s1)}</span> <span class="b">${esc(s2)}</span></p>`;

const OPTIONS = {
  stage: {
    label: 'A — Main stage',
    note: 'The promo plays muted in a wide cinematic frame with a soft teal-and-pink glow, like the homepage video. A frosted glass card holding “Who is it for?” and the copy overlaps its lower corner. Beneath it the statement is set big, with “Spirit-led transformation.” in the brand gradient and a light sweeping across it.',
    pick: true,
    html: `
<section id="whofor" class="wf wf-a" data-wf>
  <div class="wf-in">
    <div class="wf-stage">
      ${live()}
      <div class="wf-card"><p class="wf-script">${esc(w.heading)}</p><p class="wf-p">${esc(w.body)}</p></div>
    </div>
    ${statement('grad')}
  </div>
</section>`,
  },
  backdrop: {
    label: 'B — Living backdrop',
    note: 'The promo plays muted across the full width of the section as a dark, moving backdrop. On top: “Who is it for?” in pink script, the copy, and the statement large in white, with a “Watch the video” button that brings it up with sound. The most immersive; soft curves at the top and bottom, no straight edges.',
    html: `
<section id="whofor" class="wf wf-b" data-wf>
  <div class="wf-bgv" aria-hidden="true"><video muted loop playsinline autoplay preload="metadata" poster="${esc(w.poster)}"><source src="${esc(w.video)}" type="video/mp4"></video></div>
  <svg class="wf-wave t" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 H1440 V46 C1200 104, 980 100, 740 64 C500 28, 260 26, 0 74 Z" fill="#FDF8F4"/></svg>
  <svg class="wf-wave b" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120 H1440 V60 C1180 10, 960 14, 720 52 C480 90, 240 96, 0 48 Z" fill="#FDF8F4"/></svg>
  <div class="wf-in">
    <p class="wf-script">${esc(w.heading)}</p>
    <p class="wf-p">${esc(w.body)}</p>
    ${statement('light')}
    <button type="button" class="wf-watch" data-wf-open>${PLAY}<span>Watch the video</span></button>
  </div>
  <div class="wf-modal" hidden><div class="wf-modal-in"><button type="button" class="wf-x" aria-label="Close">×</button><video controls playsinline preload="none" poster="${esc(w.poster)}"><source src="${esc(w.video)}" type="video/mp4"></video></div></div>
</section>`,
  },
  split: {
    label: 'C — Editorial split',
    note: 'Light and composed, matching the Jessica section above: the video on the left in a rounded frame with a pink-to-teal plate behind it and a big pink play button; on the right “Who is it for?” as a script heading, the copy, and the statement with a pink brush stroke under “Spirit-led”.',
    html: `
<section id="whofor" class="wf wf-c" data-wf>
  <div class="wf-grid">
    <div class="wf-plate"><span aria-hidden="true"></span>${facade()}</div>
    <div class="wf-copy">
      <p class="wf-script">${esc(w.heading)}</p>
      <p class="wf-p">${esc(w.body)}</p>
      ${statement('brush')}
    </div>
  </div>
</section>`,
  },
  statement: {
    label: 'D — Statement first',
    note: 'Leads with the line: “surface-level empowerment” is struck through by a pink line as it scrolls in, and “Spirit-led transformation” lands in gradient beneath. Then the video and the “Who is it for?” card sit side by side. Says it the way she would say it on stage.',
    html: `
<section id="whofor" class="wf wf-d" data-wf>
  <div class="wf-in">
    <p class="wf-st strike"><span>This is not <s>surface-level empowerment.</s></span> <span class="b">${esc(s2)}</span></p>
    <div class="wf-row">
      ${live('soft')}
      <div class="wf-card plain"><p class="wf-script">${esc(w.heading)}</p><p class="wf-p">${esc(w.body)}</p></div>
    </div>
  </div>
</section>`,
  },
};

const CSS = `
.wf{position:relative;overflow:hidden;color:#1c1c1c;text-align:center}
.wf *{box-sizing:border-box}.wf p{margin:0}
.wf-in{position:relative;z-index:2;max-width:72rem;margin:0 auto;padding:0 20px}
.wf-script{font:400 clamp(44px,4.6vw,64px)/1 'Julietta Messie',cursive;color:#e8208f}
.wf-p{margin-top:14px!important;font:400 clamp(16px,1.3vw,18px)/1.7 Lato,sans-serif;color:#3a3a3a}
.wf-st{margin-top:clamp(40px,5vw,64px)!important;font:800 clamp(24px,3.2vw,44px)/1.15 Montserrat,sans-serif;letter-spacing:-.01em;text-transform:uppercase;color:#1c1c1c}
.wf-st span{display:block}
.wf-video{position:relative;overflow:hidden;aspect-ratio:16/9;border-radius:24px;background:#1c1c1c}
.wf-video video,.wf-video img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.wf-snd{position:absolute;right:14px;bottom:14px;z-index:2;display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 16px;border:0;border-radius:999px;cursor:pointer;
  background:rgba(28,28,28,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font:700 11px/1 Lato,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#fff;transition:opacity .3s,background .2s}
.wf-snd:hover{background:#e8208f}
.wf-video.is-on .wf-snd{opacity:0;pointer-events:none}
.wf-play{position:absolute;inset:0;z-index:2;display:grid;place-items:center;width:100%;border:0;background:linear-gradient(to top,rgba(0,0,0,.35),transparent 50%);cursor:pointer}
.wf-play span{display:grid;place-items:center;width:84px;height:84px;border-radius:50%;background:#fff;box-shadow:0 0 0 10px rgba(255,255,255,.25),0 18px 40px -12px rgba(0,0,0,.6);transition:transform .3s}
.wf-play:hover span{transform:scale(1.08)}

/* A — main stage */
.wf-a{padding:clamp(48px,6vw,88px) 0 clamp(64px,7vw,104px)}
.wf-stage{position:relative;max-width:62rem;margin:0 auto}
.wf-a .wf-video{border-radius:20px;box-shadow:0 0 0 1px rgba(0,185,198,.45),0 0 100px -20px rgba(0,185,198,.5),0 40px 90px -40px rgba(232,32,143,.6)}
.wf-card{position:relative;z-index:3;text-align:left;padding:26px 28px;border-radius:24px;background:rgba(255,255,255,.82);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
  box-shadow:inset 0 0 0 1px rgba(232,32,143,.25),0 30px 60px -30px rgba(28,28,28,.4)}
.wf-a .wf-card{margin:-24px 12px 0 auto;max-width:26rem}  /* phones: only a short overlap, so the video stays in view */
@media (min-width:900px){.wf-a .wf-card{position:absolute;right:-40px;bottom:-56px;margin:0}}
.wf-a .wf-script{font-size:clamp(40px,3.6vw,52px)}
.wf-st.grad .b{background-image:linear-gradient(100deg,transparent 40%,rgba(255,255,255,.85) 50%,transparent 60%),linear-gradient(92deg,#e8208f,#f0569f 40%,#00b9c6);
  background-size:250% 100%,100% 100%;background-position:100% 0,0 0;-webkit-background-clip:text;background-clip:text;color:transparent}
.wf.is-in .wf-st.grad .b{animation:wf-sweep 1.8s cubic-bezier(.45,0,.25,1) .5s both}
@keyframes wf-sweep{from{background-position:100% 0,0 0}to{background-position:0% 0,0 0}}
@media (min-width:900px){.wf-a .wf-st{margin-top:96px!important}}

/* B — living backdrop */
.wf-b{padding:calc(clamp(40px,6vw,90px) + clamp(72px,9vw,128px)) 0;color:#fff;background:#1c1c1c}
.wf-bgv{position:absolute;inset:0}
.wf-bgv video{width:100%;height:100%;object-fit:cover;opacity:.42}
.wf-bgv::after{content:"";position:absolute;inset:0;background:radial-gradient(60% 70% at 50% 50%,rgba(28,28,28,.35),rgba(28,28,28,.9))}
.wf-wave{position:absolute;left:0;right:0;z-index:1;width:100%;height:clamp(40px,6vw,90px);pointer-events:none}.wf-wave.t{top:-1px}.wf-wave.b{bottom:-1px}
.wf-b .wf-in{max-width:52rem}
.wf-b .wf-p{color:rgba(255,255,255,.82)}
.wf-st.light{color:#fff}.wf-st.light .b{color:#f7a8cc}
.wf-watch{display:inline-flex;align-items:center;gap:12px;min-height:48px;margin-top:34px;padding:12px 26px 12px 14px;border:0;border-radius:999px;background:#fff;cursor:pointer;
  font:700 13px/1 Lato,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#1c1c1c;box-shadow:0 18px 40px -16px rgba(232,32,143,.8)}
.wf-watch svg{width:20px;height:20px}
.wf-modal{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:20px;background:rgba(10,10,10,.86)}
.wf-modal[hidden]{display:none}
.wf-modal-in{position:relative;width:min(1100px,100%)}
.wf-modal video{display:block;width:100%;border-radius:16px}
.wf-x{position:absolute;top:-46px;right:0;width:40px;height:40px;border:0;border-radius:50%;background:#fff;font:400 26px/1 sans-serif;cursor:pointer}

/* C — editorial split */
.wf-c{padding:clamp(56px,7vw,104px) 24px}
.wf-grid{max-width:70rem;margin:0 auto;display:grid;gap:44px;align-items:center}
@media (min-width:900px){.wf-grid{grid-template-columns:1.15fr 1fr;gap:72px;text-align:left}}
.wf-plate{position:relative}
.wf-plate>span{position:absolute;inset:0;transform:translate(18px,18px);border-radius:28px;background:linear-gradient(135deg,#e8208f,#00b9c6);opacity:.18}
.wf-c .wf-video{border-radius:28px;box-shadow:0 30px 60px -30px rgba(28,28,28,.5)}
.wf-st.brush{font-size:clamp(22px,2.4vw,32px)}
.wf-st.brush .b{padding-bottom:10px;background:url(/assets/brand/stroke-hook-lightpink.svg) 0 100%/80% auto no-repeat}
@media (max-width:899px){.wf-st.brush .b{background-position:50% 100%}}

/* D — statement first */
.wf-d{padding:clamp(56px,7vw,104px) 0}
.wf-st.strike{margin-top:0!important;font-size:clamp(26px,3.6vw,50px)}
/* struck through per line: a background line, cloned onto every line box */
.wf-st.strike s{text-decoration:none;color:#8a8a8a;-webkit-box-decoration-break:clone;box-decoration-break:clone;
  background:linear-gradient(#e8208f,#e8208f) 0 56%/0% .11em no-repeat;transition:background-size .9s cubic-bezier(.65,0,.35,1) .3s}
.wf.is-in .wf-st.strike s{background-size:100% .11em}
.wf-st.strike .b{margin-top:6px;background:linear-gradient(92deg,#e8208f,#f0569f 40%,#00b9c6);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:0;transform:translateY(12px);transition:opacity .8s ease 1.1s,transform .8s cubic-bezier(.22,1,.36,1) 1.1s}
.wf.is-in .wf-st.strike .b{opacity:1;transform:none}
.wf-row{display:grid;gap:24px;margin-top:clamp(36px,5vw,56px);align-items:center}
@media (min-width:900px){.wf-row{grid-template-columns:1.4fr 1fr;gap:36px}}
.wf-video.soft{box-shadow:0 30px 60px -30px rgba(28,28,28,.5)}
.wf-card.plain{background:#fff}

@media (prefers-reduced-motion:reduce){.wf *{animation:none!important;transition:none!important}.wf-st.strike .b{opacity:1;transform:none}.wf-st.strike s{background-size:100% .11em}}`;

const JS = `<script>
(function(){
var s=document.querySelector('[data-wf]');if(!s)return;
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
// arrival
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){s.classList.add('is-in');io.disconnect();}},{threshold:.3});io.observe(s);}else s.classList.add('is-in');
// muted previews: play only on screen; never under reduced motion
s.querySelectorAll('video[autoplay]').forEach(function(v){
  if(reduced){v.removeAttribute('autoplay');v.pause();return;}
  new IntersectionObserver(function(e){if(e[0].isIntersecting)v.play().catch(function(){});else if(v.muted)v.pause();},{threshold:.2}).observe(v);});
// tap for sound
s.querySelectorAll('[data-wf-live]').forEach(function(box){var v=box.querySelector('video'),b=box.querySelector('.wf-snd');
  function on(){v.muted=false;v.loop=false;v.currentTime=0;v.controls=true;v.play();box.classList.add('is-on');}
  b.addEventListener('click',on);});
// poster + play: swap in the video on click
s.querySelectorAll('[data-wf-click]').forEach(function(box){var b=box.querySelector('.wf-play');
  b.addEventListener('click',function(){var v=document.createElement('video');v.src=${JSON.stringify(w.video)};v.controls=true;v.playsInline=true;v.autoplay=true;
    box.innerHTML='';box.appendChild(v);v.play().catch(function(){});});});
// backdrop: open with sound in a lightbox
var open=s.querySelector('[data-wf-open]'),m=s.querySelector('.wf-modal');
if(open&&m){var mv=m.querySelector('video');
  open.addEventListener('click',function(){m.hidden=false;mv.currentTime=0;mv.play().catch(function(){});m.querySelector('.wf-x').focus();});
  function close(){mv.pause();m.hidden=true;open.focus();}
  m.querySelector('.wf-x').addEventListener('click',close);m.addEventListener('click',function(e){if(e.target===m)close();});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&!m.hidden)close();});}
addEventListener('load',function(){if(location.hash==='#whofor')scrollTo(0,s.getBoundingClientRect().top+scrollY-30);});
})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `wf-${k}.html`),
    (about.slice(0, after) + o.html + about.slice(after))
      .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
      .replace('</body>', `${JS}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/wf-${k}.html#whofor" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/wf-${k}.html#whofor" title="${esc(o.label)}" loading="lazy" width="1440" height="900" allow="autoplay"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/wf-${k}.html#whofor" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844" allow="autoplay"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Who is it for? — ${esc(site.brand.name)}</title>
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
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; }
.links a { color:var(--magenta); }
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
  <h1>About page — “Who is it for?”</h1>
  <p class="lead">Four treatments built around the RUQ promo, each in the real about page directly below the Jessica Lewis
     feature. The video never plays with sound on its own: it is either a muted preview with “Tap for sound”, or a still
     frame with a play button.</p>
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

fs.writeFileSync(path.join(dist, 'whofor-options.html'), page);
console.log('built dist/whofor-options.html + ' + Object.keys(OPTIONS).length + ' frames');

// Builds /whofor3-options.html — third round on "Who is it for?".
//
// Fixed across every option, from round two's A1: the statement opens the
// section, the promo plays muted with "Tap for sound", and the "Who is it
// for?" copy steps aside — animated — while the video plays with sound, and
// returns on pause or at the end. What changes is the whole design.
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
if (F < 0) throw new Error('build-whofor3: #founder not found in dist/about.html');
const after = about.indexOf('</section>', F) + '</section>'.length;

const w = content.about.whoFor;
const [s1, s2] = w.statement;
const nb = (t) => esc(t).replace(/-/g, '‑');
const SND = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6"/></svg>';

const head = (cls = '') => `<h2 class="w3-st ${cls}"><span>${nb(s1)}</span> <span class="b">${nb(s2)}</span></h2>`;
const video = (cls = '') => `
  <div class="w3-video ${cls}" data-w3-live>
    <video muted loop playsinline autoplay preload="metadata" poster="${esc(w.poster)}" aria-label="${esc(w.videoTitle)}"><source src="${esc(w.video)}" type="video/mp4"></video>
    <button type="button" class="w3-snd">${SND}<span>Tap for sound</span></button>
  </div>`;
const copy = (cls = '') => `<div class="w3-copy ${cls}"><p class="w3-script">${esc(w.heading)}</p><p class="w3-p">${esc(w.body)}</p></div>`;

const OPTIONS = {
  theatre: {
    label: 'B1 — Theatre mode',
    note: 'The video and the “Who is it for?” copy sit side by side. Tap for sound and the copy slides away to the right as the video widens to fill the whole row — like a streaming player going into theatre mode. Pause or let it finish and the copy slides back.',
    pick: true,
    html: `
<section id="whofor" class="w3 w3-a" data-w3>
  <div class="w3-in">
    ${head()}
    <div class="w3-theatre">${video('glow')}${copy('aside')}</div>
  </div>
</section>`,
  },
  lower: {
    label: 'B2 — Lower third',
    note: 'A dark cinema panel, matching the event CTAs: the statement in white with the gradient line, the promo filling the panel, and “Who is it for?” laid over its bottom like a TV lower-third caption on a soft gradient. When it plays with sound the caption wipes away to the left.',
    html: `
<section id="whofor" class="w3 w3-b" data-w3>
  <div class="w3-panel">
    ${head('light')}
    <div class="w3-screen">${video()}${copy('caption')}</div>
  </div>
</section>`,
  },
  prints: {
    label: 'B3 — Prints and a note',
    note: 'The promo as the main print, with two real event photographs fanned behind it like a stack of prints on a table, and “Who is it for?” written on a soft pink note pinned to the corner. Playing with sound, the note lifts off and the prints slide back behind the video.',
    html: `
<section id="whofor" class="w3 w3-c" data-w3>
  <div class="w3-in">
    ${head()}
    <div class="w3-prints">
      <img class="pr p1" src="/assets/photos/queens-waving-booth.jpg" alt="" aria-hidden="true">
      <img class="pr p2" src="/assets/photos/deeper-embrace.jpg" alt="" aria-hidden="true">
      ${video('print')}
      ${copy('note')}
    </div>
  </div>
</section>`,
  },
  lights: {
    label: 'B4 — Lights down',
    note: 'Light and open, with the copy as a glass card above the video’s corner. Tap for sound and the lights go down: the section darkens around the video, its glow brightens, and the card dissolves — like a cinema dimming for the film. Pause and the lights come back up.',
    html: `
<section id="whofor" class="w3 w3-d" data-w3>
  <span class="w3-dim" aria-hidden="true"></span>
  <div class="w3-in">
    ${head()}
    <div class="w3-stage">${video('glow')}${copy('glass')}</div>
  </div>
</section>`,
  },
};

const CSS = `
.w3{position:relative;overflow:hidden;color:#1c1c1c;text-align:center;padding:clamp(56px,7vw,104px) 0 clamp(64px,8vw,112px)}
.w3 *{box-sizing:border-box}.w3 p{margin:0}
.w3-in{position:relative;z-index:2;max-width:72rem;margin:0 auto;padding:0 20px}
.w3-st{margin:0 auto;max-width:68rem;font:800 clamp(24px,3.1vw,44px)/1.12 Montserrat,sans-serif;letter-spacing:-.01em;text-transform:uppercase}
.w3-st span{display:block}
.w3-st .b{margin-top:4px;background-image:linear-gradient(100deg,transparent 40%,rgba(255,255,255,.9) 50%,transparent 60%),linear-gradient(92deg,#e8208f,#f0569f 40%,#00b9c6);
  background-size:250% 100%,100% 100%;background-position:100% 0,0 0;-webkit-background-clip:text;background-clip:text;color:transparent}
.w3.is-in .w3-st .b{animation:w3-sweep 1.8s cubic-bezier(.45,0,.25,1) .4s both}
@keyframes w3-sweep{from{background-position:100% 0,0 0}to{background-position:0% 0,0 0}}
.w3-st.light{color:#fff}

.w3-video{position:relative;overflow:hidden;aspect-ratio:16/9;border-radius:20px;background:#1c1c1c}
.w3-video video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.w3-video.glow{box-shadow:0 0 0 1px rgba(0,185,198,.45),0 0 100px -20px rgba(0,185,198,.5),0 40px 90px -40px rgba(232,32,143,.6);transition:box-shadow .8s ease}
.w3-snd{position:absolute;right:14px;bottom:14px;z-index:4;display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 16px;border:0;border-radius:999px;cursor:pointer;
  background:rgba(28,28,28,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font:700 11px/1 Lato,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#fff;transition:opacity .3s,background .2s}
.w3-snd:hover{background:#e8208f}
.w3-video.is-on .w3-snd{opacity:0;pointer-events:none}

.w3-copy{text-align:left}
.w3-script{font:400 clamp(40px,3.6vw,54px)/1 'Julietta Messie',cursive;color:#e8208f}
.w3-p{margin-top:12px!important;font:400 clamp(15.5px,1.2vw,17px)/1.7 Lato,sans-serif;color:#3a3a3a}

/* B1 — theatre mode */
.w3-theatre{display:grid;gap:28px;margin-top:clamp(36px,5vw,60px);align-items:center}
@media (min-width:900px){
  .w3-theatre{display:flex;gap:0}
  .w3-theatre .w3-video{flex:0 0 62%;transition:flex-basis .9s cubic-bezier(.65,0,.35,1),box-shadow .8s ease}
  .w3-copy.aside{flex:1;padding-left:48px;transition:opacity .5s ease,transform .8s cubic-bezier(.65,0,.35,1),filter .5s ease;min-width:0}
  .w3.is-watching .w3-theatre .w3-video{flex-basis:100%}
  .w3.is-watching .w3-copy.aside{opacity:0;transform:translateX(60px);filter:blur(6px);pointer-events:none;flex:0 0 0;padding:0;overflow:hidden}
}
@media (max-width:899px){.w3-copy.aside{text-align:center;transition:opacity .5s,transform .7s cubic-bezier(.22,1,.36,1)}.w3.is-watching .w3-copy.aside{opacity:0;transform:translateY(20px)}}

/* B2 — lower third */
.w3-b{padding:clamp(40px,5vw,72px) 16px}
.w3-panel{position:relative;max-width:76rem;margin:0 auto;padding:clamp(40px,5vw,64px) clamp(16px,4vw,48px) clamp(16px,3vw,40px);border-radius:2.5rem;background:#1c1c1c;
  box-shadow:0 0 90px -30px rgba(0,185,198,.4),0 40px 80px -40px rgba(0,0,0,.7)}
.w3-panel::before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(60% 50% at 20% 0%,rgba(232,32,143,.18),transparent 70%),radial-gradient(50% 50% at 90% 100%,rgba(0,185,198,.14),transparent 70%);pointer-events:none}
.w3-screen{position:relative;margin-top:clamp(28px,4vw,44px)}
.w3-screen .w3-video{border-radius:22px}
.w3-copy.caption{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:clamp(60px,8vw,110px) clamp(20px,4vw,44px) clamp(20px,3vw,32px);border-radius:0 0 22px 22px;
  background:linear-gradient(to top,rgba(20,20,20,.92),rgba(20,20,20,.6) 55%,transparent);clip-path:inset(0 0 0 0);transition:clip-path .9s cubic-bezier(.65,0,.35,1),opacity .6s}
.w3-copy.caption .w3-p{max-width:34rem;color:rgba(255,255,255,.85)}
.w3-copy.caption .w3-script{color:#f7a8cc}
.w3.is-watching .w3-copy.caption{clip-path:inset(0 100% 0 0);opacity:0}
.w3-b .w3-snd{bottom:auto;top:14px}
@media (max-width:699px){.w3-copy.caption{position:relative;border-radius:0 0 18px 18px;margin-top:-1px;padding:20px;background:#141414}.w3-b .w3-snd{top:auto;bottom:14px}}

/* B3 — prints and a note */
.w3-prints{position:relative;max-width:56rem;margin:clamp(48px,6vw,80px) auto 0;aspect-ratio:16/9}
.w3-prints .pr{position:absolute;width:62%;aspect-ratio:4/3;object-fit:cover;border:8px solid #fff;border-radius:6px;box-shadow:0 26px 50px -24px rgba(28,28,28,.5);
  transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .6s}
.w3-prints .p1{left:-4%;top:-10%;transform:rotate(-8deg)}
.w3-prints .p2{right:-4%;top:-6%;transform:rotate(7deg)}
.w3-video.print{position:absolute;inset:0;border:8px solid #fff;border-radius:8px;box-shadow:0 40px 80px -36px rgba(28,28,28,.6)}
.w3-copy.note{position:absolute;right:-3%;bottom:-14%;z-index:5;width:min(300px,62%);padding:22px 22px 24px;background:#fde6ef;border-radius:4px;transform:rotate(3deg);
  box-shadow:0 22px 40px -20px rgba(232,32,143,.55);transition:transform .8s cubic-bezier(.22,1,.36,1),opacity .6s ease}
.w3-copy.note::before{content:"";position:absolute;left:50%;top:-12px;width:70px;height:24px;transform:translateX(-50%) rotate(-2deg);background:rgba(0,185,198,.35)}
.w3-copy.note .w3-script{font-size:clamp(34px,3vw,44px)}
.w3-copy.note .w3-p{font-size:14.5px;color:#4a3a40}
.w3.is-watching .w3-copy.note{transform:translate(40px,-60px) rotate(14deg);opacity:0;pointer-events:none}
.w3.is-watching .w3-prints .p1{transform:translate(12%,12%) rotate(-2deg);opacity:0}
.w3.is-watching .w3-prints .p2{transform:translate(-12%,12%) rotate(2deg);opacity:0}
@media (max-width:699px){.w3-prints{aspect-ratio:auto}.w3-prints .pr{display:none}.w3-video.print{position:relative}
  .w3-copy.note{position:relative;right:auto;bottom:auto;width:auto;margin:-18px 16px 0;transform:rotate(1.5deg)}}

/* B4 — lights down */
.w3-dim{position:absolute;inset:0;z-index:1;background:radial-gradient(70% 60% at 50% 60%,rgba(18,18,18,.82),rgba(18,18,18,.96));opacity:0;transition:opacity 1.1s ease;pointer-events:none;
  -webkit-mask-image:linear-gradient(transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(transparent,#000 12%,#000 88%,transparent)}
.w3-d.is-watching .w3-dim{opacity:1}
.w3-d .w3-st{transition:color 1s ease}
.w3-d.is-watching .w3-st{color:#fff}
.w3-stage{position:relative;max-width:62rem;margin:clamp(56px,6vw,80px) auto 0}
.w3-d.is-watching .w3-video.glow{box-shadow:0 0 0 1px rgba(0,185,198,.6),0 0 160px 0 rgba(0,185,198,.55),0 0 260px 20px rgba(232,32,143,.35)}
.w3-copy.glass{position:relative;z-index:3;margin:-24px 12px 0 auto;max-width:26rem;padding:24px 26px;border-radius:24px;background:rgba(255,255,255,.84);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
  box-shadow:inset 0 0 0 1px rgba(232,32,143,.25),0 30px 60px -30px rgba(28,28,28,.4);transition:opacity .8s ease,transform .9s cubic-bezier(.22,1,.36,1),filter .8s ease}
@media (min-width:900px){.w3-copy.glass{position:absolute;left:-44px;top:-46px;margin:0}}
.w3-d.is-watching .w3-copy.glass{opacity:0;transform:scale(.92);filter:blur(10px);pointer-events:none}

@media (prefers-reduced-motion:reduce){.w3 *{animation:none!important;transition:none!important}}`;

const JS = `<script>
(function(){
var s=document.querySelector('[data-w3]');if(!s)return;
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){s.classList.add('is-in');io.disconnect();}},{threshold:.25});io.observe(s);}else s.classList.add('is-in');
s.querySelectorAll('video[autoplay]').forEach(function(v){
  if(reduced){v.removeAttribute('autoplay');v.pause();return;}
  new IntersectionObserver(function(e){if(e[0].isIntersecting)v.play().catch(function(){});else if(v.muted)v.pause();},{threshold:.2}).observe(v);});
s.querySelectorAll('[data-w3-live]').forEach(function(box){var v=box.querySelector('video'),b=box.querySelector('.w3-snd');
  b.addEventListener('click',function(){v.muted=false;v.loop=false;v.currentTime=0;v.controls=true;v.play();box.classList.add('is-on');s.classList.add('is-watching');});
  v.addEventListener('play',function(){if(!v.muted)s.classList.add('is-watching');});
  v.addEventListener('pause',function(){if(!v.muted)s.classList.remove('is-watching');});
  v.addEventListener('ended',function(){s.classList.remove('is-watching');});});
addEventListener('load',function(){if(location.hash==='#whofor')scrollTo(0,s.getBoundingClientRect().top+scrollY-30);});
})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `w3-${k}.html`),
    (about.slice(0, after) + o.html + about.slice(after))
      .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
      .replace('</body>', `${JS}</body>`));
}

const cardHtml = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/w3-${k}.html#whofor" target="_blank" rel="noopener">Open full page ↗</a> — press <em>Tap for sound</em> to see the copy step aside</p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/w3-${k}.html#whofor" title="${esc(o.label)}" loading="lazy" width="1440" height="900" allow="autoplay"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/w3-${k}.html#whofor" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844" allow="autoplay"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Who is it for? — round three — ${esc(site.brand.name)}</title>
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
  <h1>Who is it for? — round three</h1>
  <p class="lead">New designs, each with the statement on top and the promo playing muted. In every one the “Who is it
     for?” copy steps aside with its own animation when you press <strong>Tap for sound</strong>, and comes back when you
     pause. Try it inside any preview.</p>
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
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'whofor3-options.html'), page);
console.log('built dist/whofor3-options.html + ' + Object.keys(OPTIONS).length + ' frames');

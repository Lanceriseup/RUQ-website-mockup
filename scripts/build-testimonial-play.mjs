// Builds /testimonial-play-options.html — ways to have one or two of the
// testimonial videos playing on their own in the "Real change" section.
//
// Every option plays MUTED and only while on screen: browsers refuse
// autoplay with sound, and a video nobody can see is bandwidth for nothing.
// Tapping a playing video opens the existing lightbox with sound.
//
// PREVIEW SOURCES. These frames stream Wistia's own smallest MP4 rendition
// (400px wide) and loop a 6-second window from a quarter of the way in, so
// what you see is what a short preview clip would look like. For the live
// site those should be real clips — a few seconds, silent, ~300 KB each —
// cut once and served locally; streaming the full rendition just to show six
// seconds of it is fine for judging the look and wrong for production.
//
// The Wistia lookups are cached in src/data/video-previews.json so the build
// only touches the network when a video is added. Must run after
// scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const vids = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/videos.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!home.includes('id="testimonials"')) throw new Error('build-testimonial-play: #testimonials not found in dist/index.html');

const list = vids.wistia.filter(v => v.page === 'home' && /Testimonial/i.test(v.title));

// --- Wistia MP4 lookup, cached --------------------------------------------
const CACHE = path.join(ROOT, 'src/data/video-previews.json');
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {
  _note: 'Smallest Wistia MP4 rendition per testimonial, looked up from fast.wistia.com/embed/medias/<id>.json. Used only by /testimonial-play-options.html to preview autoplay; production should serve short local clips instead.',
  media: {},
};
for (const v of list) {
  if (cache.media[v.id]) continue;
  const r = await fetch(`https://fast.wistia.com/embed/medias/${v.id}.json`);
  if (!r.ok) { console.warn(`  no media JSON for ${v.id}`); continue; }
  const j = await r.json();
  const mp4 = (j.media?.assets || []).filter(a => /mp4_video$|^iphone_video$/.test(a.type)).sort((a, b) => a.width - b.width)[0];
  if (mp4) cache.media[v.id] = { url: mp4.url.replace(/\.bin$/, '.mp4'), width: mp4.width, height: mp4.height, bytes: mp4.size };
}
fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2) + '\n');
const SRC = Object.fromEntries(Object.entries(cache.media).map(([id, m]) => [id, m.url]));
const SECONDS = Object.fromEntries(list.map(v => [v.id, v.seconds || 30]));

const COMP = list.filter(v => /Compilation/i.test(v.title));
const FEATURED = COMP.length >= 2 ? COMP.slice(0, 2) : list.slice(0, 2);

const OPTIONS = {
  live: {
    label: 'A — Two live tiles',
    note: 'One card in each row plays on its own, silently, while the rows keep drifting. The playing cards get a pink ring and a small pulsing “Playing” tag so they read as live rather than as a glitch. Everything else stays exactly as your client likes it.',
    mode: 'live',
  },
  centre: {
    label: 'B — Centre stage',
    note: 'Whichever card is passing the middle of the screen in each row plays, and hands off to the next one as the rows drift — so there are always exactly two playing, and it is always a different woman. The playing card lifts slightly. The most alive.',
    pick: true,
    mode: 'centre',
  },
  pair: {
    label: 'C — Featured pair',
    note: 'Two larger widescreen videos above the rows — the two testimonial compilations — playing side by side with a “Tap for sound” badge. The rows of single testimonials drift beneath them, unchanged.',
    mode: 'pair',
  },
  spotlight: {
    label: 'D — Spotlight',
    note: 'One big widescreen video in the middle, framed like the homepage video with its teal-and-pink light, playing silently with “Tap to hear her story”. The rows follow beneath. The calmest — one moving thing, and it is unmistakably the thing to watch.',
    mode: 'spotlight',
  },
};

const CSS = `
.tp-v{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s ease;pointer-events:none}
.tp-v.on{opacity:1}
.tp-tag{position:absolute;top:10px;left:10px;z-index:2;display:inline-flex;align-items:center;gap:6px;padding:4px 10px 4px 8px;border-radius:999px;
  background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);font:700 10px/1 Lato,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#fff;opacity:0;transition:opacity .4s}
.tp-tag i{width:7px;height:7px;border-radius:50%;background:#f0569f;box-shadow:0 0 0 0 rgba(240,86,159,.7);animation:tp-pulse 1.6s ease-out infinite}
@keyframes tp-pulse{0%{box-shadow:0 0 0 0 rgba(240,86,159,.7)}100%{box-shadow:0 0 0 9px rgba(240,86,159,0)}}
.is-playing .tp-tag{opacity:1}
.video-facade.is-playing{box-shadow:0 0 0 3px #f0569f,0 24px 50px -20px rgba(232,32,143,.7)!important}
/* B: the centre card lifts */
[data-tp="centre"] .video-facade{transition:transform .6s cubic-bezier(.22,1,.36,1),box-shadow .6s}
[data-tp="centre"] .video-facade.is-playing{transform:scale(1.06);z-index:2}
[data-tp="centre"] .rail{overflow:visible}
[data-tp="centre"] .rail-track{padding:14px 0}
/* C/D featured block */
.tp-feat{position:relative;z-index:1;max-width:72rem;margin:28px auto 6px;padding:0 16px;display:grid;gap:20px}
@media (min-width:768px){.tp-feat.two{grid-template-columns:1fr 1fr;gap:28px}}
.tp-feat.one{max-width:52rem}
.tp-box{position:relative;display:block;width:100%;aspect-ratio:16/9;overflow:hidden;border:0;padding:0;border-radius:24px;background:#1c1c1c;cursor:pointer;
  box-shadow:0 30px 60px -30px rgba(28,28,28,.5)}
.tp-feat.one .tp-box{border-radius:18px;box-shadow:0 0 0 1px rgba(0,185,198,.45),0 0 90px -20px rgba(0,185,198,.5),0 30px 70px -30px rgba(232,32,143,.55)}
.tp-box img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tp-box::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.45),transparent 45%);pointer-events:none}
.tp-snd{position:absolute;right:14px;bottom:14px;z-index:2;display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 16px;border-radius:999px;background:rgba(28,28,28,.72);
  -webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);font:700 11px/1 Lato,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#fff}
.tp-box:hover .tp-snd{background:#e8208f}
@media (prefers-reduced-motion:reduce){.tp-tag i{animation:none}}`;

// One script for all four; the mode is set on <section data-tp>. Plays only
// while a video is on screen, loops a 6-second window, and hands a tap on a
// featured video to the matching rail card so the existing lightbox opens it
// with sound.
const JS = (mode) => `<script>
(function(){
var SRC=${JSON.stringify(SRC)}, DUR=${JSON.stringify(SECONDS)}, FEAT=${JSON.stringify(FEATURED.map(v => v.id))};
var sec=document.getElementById('testimonials'); if(!sec) return; sec.dataset.tp=${JSON.stringify(mode)};
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function clip(v,id){var start=Math.floor((DUR[id]||30)*.25);
  v.addEventListener('loadedmetadata',function(){v.currentTime=start;});
  v.addEventListener('timeupdate',function(){if(v.currentTime>start+6||v.currentTime<start-.5)v.currentTime=start;});}
function attach(host,id){if(!SRC[id]||host.querySelector('video'))return host.querySelector('video');
  var v=document.createElement('video');v.className='tp-v';v.muted=true;v.playsInline=true;v.preload='none';v.setAttribute('aria-hidden','true');
  v.src=SRC[id];clip(v,id);v.addEventListener('playing',function(){v.classList.add('on');});host.appendChild(v);return v;}
function play(card,on){var box=card.querySelector('span.relative.block')||card;var v=attach(box,card.dataset.id);if(!v)return;
  card.classList.toggle('is-playing',on);if(on){v.play().catch(function(){});}else{v.pause();v.classList.remove('on');}}
function tag(card){if(card.querySelector('.tp-tag'))return;var t=document.createElement('span');t.className='tp-tag';t.setAttribute('aria-hidden','true');t.innerHTML='<i></i>Playing';card.appendChild(t);}
if(reduced) return;
var rails=[].slice.call(sec.querySelectorAll('.rail'));

if(${JSON.stringify(mode)}==='live'){
  rails.forEach(function(r,ri){var cards=[].slice.call(r.querySelectorAll('.video-facade'));var id=cards[ri?2:1]&&cards[ri?2:1].dataset.id;
    var mine=cards.filter(function(c){return c.dataset.id===id;});mine.forEach(tag);
    var io=new IntersectionObserver(function(es){es.forEach(function(e){play(e.target,e.isIntersecting);});},{threshold:.4});
    mine.forEach(function(c){io.observe(c);});});
}
if(${JSON.stringify(mode)}==='centre'){
  var visible=false;new IntersectionObserver(function(es){visible=es[0].isIntersecting;},{threshold:0}).observe(sec);
  rails.forEach(function(r){[].slice.call(r.querySelectorAll('.video-facade')).forEach(tag);});
  var cur=[null,null];
  setInterval(function(){if(!visible){cur.forEach(function(c){if(c)play(c,false);});cur=[null,null];return;}
    var mid=innerWidth/2;rails.forEach(function(r,ri){var best=null,bd=1e9;
      [].slice.call(r.querySelectorAll('.video-facade')).forEach(function(c){var b=c.getBoundingClientRect();var d=Math.abs(b.left+b.width/2-mid);if(d<bd){bd=d;best=c;}});
      if(best!==cur[ri]){if(cur[ri])play(cur[ri],false);if(best)play(best,true);cur[ri]=best;}});},300);
}
if(${JSON.stringify(mode)}==='pair'||${JSON.stringify(mode)}==='spotlight'){
  var ids=${JSON.stringify(mode)}==='pair'?FEAT:[FEAT[0]];
  var wrap=document.createElement('div');wrap.className='tp-feat '+(ids.length>1?'two':'one');
  ids.forEach(function(id){var b=document.createElement('button');b.type='button';b.className='tp-box';
    b.innerHTML='<img src="/assets/posters/'+id+'.jpg" alt="" aria-hidden="true"><span class="tp-snd">'+(ids.length>1?'Tap for sound':'Tap to hear her story')+'</span>';
    b.setAttribute('aria-label','Play testimonial with sound');
    b.addEventListener('click',function(){var c=sec.querySelector('.video-facade[data-id="'+id+'"]:not([aria-hidden])')||sec.querySelector('.video-facade[data-id="'+id+'"]');if(c)c.click();});
    wrap.appendChild(b);var v=attach(b,id);
    new IntersectionObserver(function(es){if(es[0].isIntersecting)v.play().catch(function(){});else v.pause();},{threshold:.3}).observe(b);});
  var rows=sec.querySelector('.rail').parentNode;rows.parentNode.insertBefore(wrap,rows);
}
})();
addEventListener('load',function(){var s=document.getElementById('testimonials');if(s&&location.hash==='#testimonials')scrollTo(0,s.getBoundingClientRect().top+scrollY-20);});
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `tp-${k}.html`), home
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
    .replace('</body>', `${JS(o.mode)}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/tp-${k}.html#testimonials" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/tp-${k}.html#testimonials" title="${esc(o.label)}" loading="lazy" width="1440" height="900" allow="autoplay"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/tp-${k}.html#testimonials" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844" allow="autoplay"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Testimonial autoplay options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:860px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:860px; font-size:15px; }
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
  <h1>Real change — one or two videos playing</h1>
  <p class="lead">Every option plays silently and only while it is on screen — browsers block autoplay with sound — and a
     tap opens the full video with sound in the existing lightbox. These previews stream Wistia’s smallest version and loop
     six seconds of it; for the live site those would be cut into small local clips. Give each preview a moment to start.</p>
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

fs.writeFileSync(path.join(dist, 'testimonial-play-options.html'), page);
console.log('built dist/testimonial-play-options.html + ' + Object.keys(OPTIONS).length + ' frames · ' + Object.keys(SRC).length + ' preview sources');

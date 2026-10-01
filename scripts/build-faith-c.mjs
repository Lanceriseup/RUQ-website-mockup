// Builds /faith-c-options.html — a second round on the Statement of Faith,
// all built on option C ("Seven pillars") from /faith-new-options.html: the
// blush ground that fades in and out of the white around it, the pink script
// and bold heading, the mission with a pink highlighter, and the pill toggle.
//
// What changes is how the full statement is revealed and set. Copy exactly as
// content.json home.faith; the creed is always in the DOM. Must run after
// scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const FAITH = /<section id="faith"[\s\S]*?<\/section>/;
if (!FAITH.test(home)) throw new Error('build-faith-c: #faith not found in dist/index.html');

const f = content.home.faith;
const TEAL = '/assets/brand/stroke-hook-teal.svg';
const PINK = '/assets/brand/stroke-hook-lightpink.svg';
const MARKS = ['the unshakable truth of the Gospel', 'true freedom', 'strength, identity, and purpose'];
const mission = () => MARKS.reduce((t, m) => t.split(esc(m)).join(`<mark>${esc(m)}</mark>`), esc(f.mission));
const num = (i) => String(i + 1).padStart(2, '0');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const CHEV = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const ARR = (d) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="${d}"/></svg>`;

const heads = `<p class="fn-script">${esc(f.script)}</p><h2 class="fn-h">${esc(f.heading)}</h2>`;
const strokes = `<div class="fn-strokes" aria-hidden="true"><img class="s1" src="${PINK}" alt=""><img class="s2" src="${TEAL}" alt=""></div>`;

const accordion = (body, extra = '') => `
  <div class="fn-acc ${extra}" data-acc>
    <button type="button" class="fn-acc-btn" aria-expanded="false" aria-controls="fn-creed">
      <span>${esc(f.toggle)}</span><i class="fn-chev">${CHEV}</i>
    </button>
    <div class="fn-region" id="fn-creed" role="region" aria-label="${esc(f.title)}" inert>
      <div class="fn-region-in">${body}</div>
    </div>
  </div>`;

// The swash under the Freedom section, reused as the spine of option H.
const RIBBON = `<svg class="rb-svg" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
  <defs><linearGradient id="rbg" x1="0" x2="1"><stop offset="0" stop-color="#e8208f"/><stop offset=".5" stop-color="#f0569f"/><stop offset="1" stop-color="#00b9c6"/></linearGradient></defs>
  <path d="M0 72 C 260 11, 520 9, 760 50 C 1000 91, 1200 105, 1440 46 C 1200 119, 1000 106, 760 66 C 520 27, 260 25, 0 72 Z" fill="url(#rbg)"/></svg>`;

const OPTIONS = {
  scripture: {
    label: 'E — The open page',
    note: 'The mission is set large in an elegant serif, like the opening of a book. Opening the statement turns down a white page beneath it: the introduction, then the seven beliefs in two columns with pink Roman numerals and hairline rules between them. The calmest and most literary.',
    pick: true,
    html: `
<section id="faith" class="fn fn-c fn-e">${strokes}
  <div class="fn-in">${heads}
    <p class="fn-mission serif">${mission()}</p>
    ${accordion(`<div class="pg">
      <p class="fn-sub">${esc(f.title)}</p>
      <p class="fn-intro">${esc(f.intro)}</p>
      <ol class="rom">${f.beliefs.map((b, i) => `<li style="--i:${i}"><span class="n">${ROMAN[i]}</span><span>${esc(b)}</span></li>`).join('')}</ol>
    </div>`)}
  </div>
</section>`,
  },
  deck: {
    label: 'F — Swipe deck',
    note: 'The seven beliefs open as a row of cards you swipe or click through, one confident statement at a time, with arrows and a progress line that fills as you go. The most interactive — it turns reading the creed into something you do.',
    html: `
<section id="faith" class="fn fn-c fn-f">${strokes}
  <div class="fn-in">${heads}
    <p class="fn-mission">${mission()}</p>
    ${accordion(`
      <p class="fn-intro">${esc(f.intro)}</p>
      <div class="dk" data-deck>
        <ol class="dk-track" tabindex="0" aria-label="${esc(f.title)}">${f.beliefs.map((b, i) => `<li style="--i:${i}"><span class="n">${num(i)}</span><span class="of">of ${num(f.beliefs.length - 1)}</span><p>${esc(b)}</p></li>`).join('')}</ol>
        <div class="dk-ctl">
          <button type="button" class="dk-b" data-dir="-1" aria-label="Previous belief">${ARR('M15 6l-6 6 6 6')}</button>
          <span class="dk-bar"><i></i></span>
          <button type="button" class="dk-b" data-dir="1" aria-label="Next belief">${ARR('M9 6l6 6-6 6')}</button>
        </div>
      </div>`)}
  </div>
</section>`,
  },
  worship: {
    label: 'G — Worship split',
    note: 'Two columns: the heading, mission and toggle on the left; a photograph of raised hands in worship on a brand plate on the right. Opening the statement spreads the seven belief cards across the full width beneath both.',
    html: `
<section id="faith" class="fn fn-c fn-g">${strokes}
  <div class="fn-in wide">
    <div class="gs">
      <div class="gs-copy">${heads}<p class="fn-mission">${mission()}</p></div>
      <div class="gs-photo"><span aria-hidden="true"></span><img src="/assets/photos/close-hands.jpg" alt="Hands raised in worship" loading="lazy" decoding="async"></div>
    </div>
    ${accordion(`<p class="fn-intro">${esc(f.intro)}</p>
      <ol class="cards">${f.beliefs.map((b, i) => `<li style="--i:${i}"><span class="n">${num(i)}</span><span>${esc(b)}</span></li>`).join('')}</ol>`, 'left')}
  </div>
</section>`,
  },
  ribbon: {
    label: 'H — Along the ribbon',
    note: 'The brand’s brush ribbon — the one that closes the Freedom section — runs across the full width, and the seven beliefs sit along it, alternating above and below like stops on a journey. On a phone the ribbon turns into a vertical line down the left.',
    html: `
<section id="faith" class="fn fn-c fn-rib">${strokes}
  <div class="fn-in wide">${heads}
    <p class="fn-mission">${mission()}</p>
    ${accordion(`<p class="fn-intro">${esc(f.intro)}</p>
      <div class="rb">${RIBBON}
        <ol class="rb-list">${f.beliefs.map((b, i) => `<li class="${i % 2 ? 'dn' : 'up'}" style="--i:${i};--c:${i + 1}"><span class="n">${num(i)}</span><span>${esc(b)}</span></li>`).join('')}</ol>
      </div>`)}
  </div>
</section>`,
  },
};

const CSS = `
.fn{position:relative;overflow:hidden;text-align:center;color:#1c1c1c}
.fn *{box-sizing:border-box}.fn p{margin:0}
.fn-c{padding:clamp(72px,9vw,128px) 0;background:linear-gradient(180deg,#fff 0%,#fdf0f4 22%,#fcf7f3 78%,#fff 100%)}
.fn-in{position:relative;z-index:3;max-width:52rem;margin:0 auto;padding:0 20px}
.fn-in.wide{max-width:74rem}
.fn-strokes{position:absolute;inset:0;z-index:1;pointer-events:none}
.fn-strokes img{position:absolute;width:clamp(220px,26vw,420px);height:auto}
.fn-c .s1{top:4%;right:-7%;opacity:.8}.fn-c .s2{bottom:4%;left:-7%;opacity:.3;transform:rotate(180deg)}
.fn-script{font:400 clamp(40px,4.4vw,60px)/1 'Julietta Messie',cursive;color:#e8208f}
.fn-h{margin:6px 0 0;font:800 clamp(24px,2.8vw,36px)/1.15 Montserrat,sans-serif;letter-spacing:.02em;text-transform:uppercase}
.fn-mission{max-width:42rem;margin:22px auto 0!important;font:400 clamp(16px,1.35vw,18.5px)/1.75 Lato,sans-serif;color:#2b2b2b}
.fn-mission mark{color:#1c1c1c;font-weight:700;background:linear-gradient(transparent 62%,rgba(247,191,210,.9) 62%)}
.fn-intro{max-width:44rem;margin:30px auto 0!important;font:400 16px/1.75 Lato,sans-serif;color:#3a3a3a}

.fn-acc{margin-top:34px}
.fn-acc-btn{display:inline-flex;align-items:center;gap:16px;min-height:52px;padding:12px 14px 12px 26px;border:0;border-radius:999px;background:#fff;cursor:pointer;
  font:700 13px/1.3 Montserrat,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#1c1c1c;text-align:left;
  box-shadow:inset 0 0 0 1.5px rgba(232,32,143,.4),0 16px 36px -22px rgba(232,32,143,.8)}
.fn-chev{display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:50%;background:#e8208f;color:#fff;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.fn-acc[data-open] .fn-chev{transform:rotate(180deg)}
.fn-region{display:grid;grid-template-rows:0fr;transition:grid-template-rows .8s cubic-bezier(.22,1,.36,1)}
.fn-acc[data-open] .fn-region{grid-template-rows:1fr}
.fn-region-in{min-height:0;overflow:hidden;padding:0 4px}
.fn-region-in>*:last-child{margin-bottom:12px}
/* items rise in one after another once open */
.fn [style*="--i"]{opacity:0;transform:translateY(12px);transition:opacity .55s ease,transform .55s cubic-bezier(.22,1,.36,1);transition-delay:calc(.3s + var(--i)*.07s)}
.fn-acc[data-open] [style*="--i"]{opacity:1;transform:none}
.fn-sub{font:700 11px/1.4 Lato,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#6b6b6b}

/* E — the open page */
.fn-e .fn-mission.serif{max-width:46rem;font:500 clamp(20px,2.1vw,27px)/1.5 'Cormorant Garamond',Georgia,serif;color:#1c1c1c}
.fn-e .fn-mission.serif mark{font-weight:600}
.fn-e .pg{max-width:52rem;margin:28px auto 6px;padding:clamp(28px,4vw,52px) clamp(20px,4vw,56px);border-radius:22px;background:#fff;text-align:left;
  box-shadow:0 1px 0 rgba(28,28,28,.04),0 40px 80px -50px rgba(232,32,143,.55),0 20px 40px -30px rgba(0,0,0,.18)}
.fn-e .fn-sub{text-align:center}
.fn-e .pg .fn-intro{margin-top:16px!important;text-align:center;font:400 clamp(17px,1.5vw,19px)/1.6 'Cormorant Garamond',Georgia,serif;color:#2b2b2b}
.rom{list-style:none;margin:26px 0 0;padding:0;column-gap:44px;border-top:1px solid rgba(28,28,28,.1)}
@media (min-width:760px){.rom{columns:2}}
.rom li{display:flex;gap:16px;padding:14px 0;border-bottom:1px solid rgba(28,28,28,.08);break-inside:avoid;font:400 clamp(16px,1.4vw,18px)/1.45 'Cormorant Garamond',Georgia,serif;color:#1c1c1c}
.rom .n{flex:none;width:2.1em;font:600 1.15em/1.2 'Cormorant Garamond',Georgia,serif;color:#e8208f}

/* F — swipe deck */
.dk{position:relative;margin-top:28px}
.dk-track{display:flex;gap:18px;list-style:none;margin:0 -20px;padding:10px 20px 26px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;outline:none;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 20px,#000 calc(100% - 20px),transparent);mask-image:linear-gradient(90deg,transparent,#000 20px,#000 calc(100% - 20px),transparent)}
.dk-track::-webkit-scrollbar{display:none}
.dk-track li{flex:none;width:min(320px,78vw);scroll-snap-align:center;display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:26px 24px 28px;border-radius:24px;text-align:left;
  background:#fff;box-shadow:inset 0 0 0 1px rgba(28,28,28,.07),0 26px 50px -34px rgba(232,32,143,.6)}
.dk-track li:nth-child(odd){background:linear-gradient(160deg,#fff 0%,#fff 60%,#fdeaf3 100%)}
.dk-track li:nth-child(even){background:linear-gradient(160deg,#fff 0%,#fff 60%,#e6f7f8 100%)}
.dk-track .n{font:800 46px/1 Montserrat,sans-serif;background:linear-gradient(150deg,#e8208f,#00b9c6);-webkit-background-clip:text;background-clip:text;color:transparent}
.dk-track .of{font:700 10px/1 Lato,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#8a8a8a}
.dk-track p{margin-top:14px!important;font:400 16px/1.6 Lato,sans-serif;color:#2b2b2b}
.dk-ctl{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:6px}
.dk-b{display:grid;place-items:center;width:44px;height:44px;border:0;border-radius:50%;background:#fff;color:#dc1e88;cursor:pointer;box-shadow:inset 0 0 0 1.5px rgba(232,32,143,.4)}
.dk-b:hover{background:#e8208f;color:#fff}
.dk-bar{position:relative;width:min(240px,40vw);height:3px;border-radius:3px;background:rgba(28,28,28,.1);overflow:hidden}
.dk-bar i{position:absolute;inset:0;width:var(--p,14%);border-radius:3px;background:linear-gradient(90deg,#e8208f,#00b9c6);transition:width .3s}

/* G — worship split */
.gs{display:grid;gap:40px;align-items:center}
@media (min-width:960px){.gs{grid-template-columns:1.05fr 1fr;gap:64px;text-align:left}.fn-g .fn-mission{margin-left:0!important}.fn-g .fn-acc.left{text-align:left}}
.gs-photo{position:relative}
.gs-photo span{position:absolute;right:-16px;bottom:-16px;width:100%;height:100%;border-radius:28px;background:linear-gradient(135deg,#e8208f,#00b9c6);opacity:.16}
.gs-photo img{position:relative;display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:28px;box-shadow:0 30px 60px -30px rgba(28,28,28,.45)}
.fn-g .fn-intro{text-align:center;max-width:46rem}
.cards{list-style:none;margin:28px 0 0;padding:0;display:flex;flex-wrap:wrap;justify-content:center;gap:16px;text-align:left}
.cards li{width:100%;display:flex;flex-direction:column;gap:8px;padding:22px 20px;border-radius:20px;background:#fff;font:400 15.5px/1.6 Lato,sans-serif;color:#2b2b2b;
  box-shadow:inset 0 0 0 1px rgba(28,28,28,.07),0 24px 44px -32px rgba(232,32,143,.55)}
@media (min-width:700px){.cards li{width:calc(50% - 8px)}}
@media (min-width:1024px){.cards li{width:calc(25% - 12px)}}
.cards .n{font:800 34px/1 Montserrat,sans-serif;background:linear-gradient(150deg,#e8208f,#00b9c6);-webkit-background-clip:text;background-clip:text;color:transparent}

/* H — along the ribbon */
.rb{position:relative;margin-top:34px}
.rb-list{list-style:none;margin:0;padding:0}
.rb-list li{position:relative;display:flex;gap:12px;text-align:left;font:400 15px/1.55 Lato,sans-serif;color:#2b2b2b}
.rb-list .n{flex:none;display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:#fff;font:800 13px/1 Montserrat,sans-serif;color:#dc1e88;
  box-shadow:inset 0 0 0 2px #f0569f,0 8px 18px -8px rgba(232,32,143,.8)}
.rb-list li:nth-child(n+5) .n{color:#00838d;box-shadow:inset 0 0 0 2px #00b9c6,0 8px 18px -8px rgba(0,185,198,.8)}
.rb-svg{display:none}
/* phone and tablet: a vertical spine */
@media (max-width:1023px){
  .rb-list{position:relative;padding-left:4px}
  .rb-list::before{content:"";position:absolute;left:22px;top:10px;bottom:10px;width:3px;border-radius:3px;background:linear-gradient(#e8208f,#00b9c6)}
  .rb-list li{padding:10px 0}.rb-list li>span:last-child{padding-top:8px}
}
/* desktop: ribbon across, beliefs alternating above and below */
@media (min-width:1024px){
  .rb-svg{display:block;position:absolute;left:-4%;right:-4%;top:50%;width:108%;height:90px;transform:translateY(-50%);z-index:0}
  .rb-list{position:relative;z-index:1;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:auto 96px auto;column-gap:14px}
  .rb-list li{grid-column:var(--c)/span 2;flex-direction:column;align-items:center;text-align:center;padding:0 6px}
  .rb-list li.up{grid-row:1;justify-content:flex-start;flex-direction:column-reverse}  /* column-reverse: start is the bottom, so every number sits on the ribbon */
  .rb-list li.dn{grid-row:3}
  .rb-list li.up .n{margin-top:12px}.rb-list li.dn .n{margin-bottom:12px}
}

@media (prefers-reduced-motion:reduce){.fn-region,.fn-chev,.fn [style*="--i"]{transition:none}.fn [style*="--i"]{opacity:1;transform:none}}`;

const JS = `<script>
(function(){
document.querySelectorAll('[data-acc]').forEach(function(a){var b=a.querySelector('.fn-acc-btn'),r=a.querySelector('.fn-region');
 b.addEventListener('click',function(){var open=!a.hasAttribute('data-open');a.toggleAttribute('data-open',open);b.setAttribute('aria-expanded',String(open));
 if(open)r.removeAttribute('inert');else r.setAttribute('inert','');});});
document.querySelectorAll('[data-deck]').forEach(function(d){var t=d.querySelector('.dk-track'),bar=d.querySelector('.dk-bar i');
 function upd(){var max=t.scrollWidth-t.clientWidth;var p=max>0?t.scrollLeft/max:1;bar.style.setProperty('--p',Math.max(14,p*100)+'%');}
 d.querySelectorAll('.dk-b').forEach(function(b){b.addEventListener('click',function(){var li=t.querySelector('li');t.scrollBy({left:(+b.dataset.dir)*(li.offsetWidth+18),behavior:'smooth'});});});
 t.addEventListener('scroll',upd,{passive:true});t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();d.querySelector('.dk-b[data-dir="'+(e.key==='ArrowRight'?1:-1)+'"]').click();}});upd();});
addEventListener('load',function(){var s=document.getElementById('faith');if(s&&location.hash==='#faith')scrollTo(0,s.getBoundingClientRect().top+scrollY-30);});
})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `fc-${k}.html`), home
    .replace(FAITH, o.html)
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
    .replace('</body>', `${JS}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" data-toggle="${k}">Open / close the full statement</button> · <a href="/fc-${k}.html#faith" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe data-k="${k}" src="/fc-${k}.html#faith" title="${esc(o.label)}" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe data-k="${k}" src="/fc-${k}.html#faith" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Statement of Faith — round two — ${esc(site.brand.name)}</title>
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
  <h1>Statement of Faith — round two, built on C</h1>
  <p class="lead">Everything you liked about C stays: the blush ground that fades in from white, the pink script, the
     mission with its pink highlighter, and the pill button. What changes is how the full statement opens. Use
     <strong>Open / close the full statement</strong> on each to see it in both frames.</p>
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
        try { f.contentDocument.querySelector('.fn-acc-btn').click(); } catch (e) {}
      });
    });
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'faith-c-options.html'), page);
console.log('built dist/faith-c-options.html + ' + Object.keys(OPTIONS).length + ' frames');

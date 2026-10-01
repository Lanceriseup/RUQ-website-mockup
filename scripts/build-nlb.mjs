// Builds /nlb-options.html — a No Longer Bound section below the video
// testimonials, in four treatments.
//
// Everything is in NLB's own palette (gold, cream, sage, from the RUQ - NLB
// project's tailwind config) so the course reads as its own thing while it
// sits on a Rise Up Queens page. Copy is content.json home.nlb, from the
// client's mockup. The link is a placeholder until it is supplied.
//
// The mark is split into four layers (ring + leaf, left chain, right chain,
// fragments) in src/assets/nlb/mark-*.png, so option A can break the chains.
//
// Each option is the real homepage with the section inserted after the
// testimonials. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
// The shipped banner is removed first, so each preview shows only its option.
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
  .replace(/<section id="nlb"[\s\S]*?<\/section>/, '');

const T = home.indexOf('<section id="testimonials"');
if (T < 0) throw new Error('build-nlb: #testimonials not found in dist/index.html');
const after = home.indexOf('</section>', T) + '</section>'.length;

const n = content.home.nlb;
const A = '/assets/nlb/';
const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const btn = (cls = '') => `<a href="${esc(n.url)}" class="nb-btn ${cls}">${esc(n.cta)}${ARROW}</a>`;
const eyebrow = `<p class="nb-eye">${esc(n.eyebrow)}</p>`;
const words = `<p class="nb-script">${esc(n.script)}</p><h2 class="nb-h">${esc(n.headline)}</h2>`;
const mark = (cls = '') => `
  <div class="nb-mark ${cls}" role="img" aria-label="No Longer Bound">
    <img class="m-ring" src="${A}mark-ring.png" alt="">
    <img class="m-left" src="${A}mark-left.png" alt="">
    <img class="m-right" src="${A}mark-right.png" alt="">
    <img class="m-bits" src="${A}mark-bits.png" alt="">
  </div>`;

const OPTIONS = {
  unbound: {
    label: 'A — Unbound',
    note: 'The No Longer Bound mark, large and centred on warm cream. As the section scrolls into view the two chains slide apart and their broken links scatter, the gold ring glows, then “Find Freedom” writes itself in gold. The brand promise, acted out.',
    pick: true,
    html: `
<section class="nb nb-a" data-nb>
  <span class="nb-glow" aria-hidden="true"></span>
  <div class="nb-in">
    ${eyebrow}
    ${mark('big')}
    ${words}
    <p class="nb-q">${esc(n.question)}</p>
    ${btn()}
  </div>
</section>`,
  },
  arch: {
    label: 'B — The arch',
    note: 'Editorial two-column layout: the embrace photograph in a tall arched frame traced in fine gold, with a sprig of sage drifting off its edge. Opposite, the logo, the gold script, the headline, the question and the button. Soft, warm and personal.',
    html: `
<section class="nb nb-b" data-nb>
  <div class="nb-grid">
    <figure class="nb-arch"><span class="ln" aria-hidden="true"></span><img src="${A}nlb-photo-embrace.jpg" alt="Two women embracing at a No Longer Bound session" loading="lazy" decoding="async"></figure>
    <div class="nb-copy">
      ${eyebrow}
      <img class="nb-logo" src="${A}nlb-mark.png" alt="No Longer Bound" width="900" height="522">
      ${words}
      <span class="nb-rule" aria-hidden="true"></span>
      <p class="nb-q">${esc(n.question)}</p>
      ${btn()}
    </div>
  </div>
</section>`,
  },
  gilded: {
    label: 'C — Gilded',
    note: 'Dark and luxurious: deep charcoal with the speaker photograph faint behind it, warm gold light, and “Find Freedom” in gold foil with a glint of light running across it. The headline in cream, a gold-outline button. Feels like an invitation to something premium.',
    html: `
<section class="nb nb-c" data-nb>
  <div class="nb-bg" aria-hidden="true"><img src="${A}nlb-photo-speaker.jpg" alt=""></div>
  <svg class="nb-wave t" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 H1440 V46 C1200 104, 980 100, 740 64 C500 28, 260 26, 0 74 Z" fill="#fff"/></svg>
  <svg class="nb-wave b" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120 H1440 V60 C1180 10, 960 14, 720 52 C480 90, 240 96, 0 48 Z" fill="#fff"/></svg>
  <div class="nb-in">
    ${eyebrow}
    <img class="nb-logo light" src="${A}nlb-mark.png" alt="No Longer Bound" width="900" height="522">
    ${words}
    <p class="nb-q">${esc(n.question)}</p>
    ${btn('ghost')}
  </div>
</section>`,
  },
  stories: {
    label: 'D — Living proof',
    note: 'A wide band: three photographs of women at No Longer Bound — laughing, greeting, embracing — fanned like prints, with a cream card overlapping them that carries the logo, script, headline, question and button. Says “this is real, and it is for women like you”.',
    html: `
<section class="nb nb-d" data-nb>
  <div class="nb-wrap">
    <div class="nb-fan" aria-hidden="true">
      <img class="p1" src="${A}nlb-photo-laugh.jpg" alt="">
      <img class="p2" src="${A}nlb-photo-embrace.jpg" alt="">
      <img class="p3" src="${A}nlb-photo-greet.jpg" alt="">
    </div>
    <div class="nb-card">
      ${eyebrow}
      <img class="nb-logo" src="${A}nlb-mark.png" alt="No Longer Bound" width="900" height="522">
      ${words}
      <p class="nb-q">${esc(n.question)}</p>
      ${btn()}
    </div>
  </div>
</section>`,
  },
};

const CSS = `
.nb{position:relative;overflow:hidden;color:#201F1E;text-align:center;--gold:#B7873E;--gold-d:#8F6A2E;--gold-l:#E4CFA0;--cream:#FAF7F1;--cream-d:#F1E8D9;--sage:#7FA076}
.nb *{box-sizing:border-box}.nb p{margin:0}
.nb-in{position:relative;z-index:2;max-width:46rem;margin:0 auto;padding:0 20px;display:flex;flex-direction:column;align-items:center}
.nb-eye{font:700 11px/1.5 Lato,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:#8A8578}
.nb-script{margin-top:6px!important;font:400 clamp(58px,7vw,104px)/1 'Julietta Messie',cursive;color:var(--gold)}
.nb-h{margin:2px 0 0;font:800 clamp(22px,2.6vw,34px)/1.15 Montserrat,sans-serif;letter-spacing:.01em;text-transform:uppercase;color:#201F1E}
.nb-q{max-width:34rem;margin:20px auto 0!important;font:400 clamp(16px,1.35vw,18.5px)/1.7 Lato,sans-serif;color:#54514A}
.nb-btn{display:inline-flex;align-items:center;gap:12px;min-height:48px;margin-top:28px;padding:15px 30px;border-radius:999px;background:var(--gold-d);color:#fff;
  font:700 13px/1 Lato,sans-serif;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;box-shadow:0 16px 34px -16px rgba(143,106,46,.9);transition:background .2s,transform .2s}
.nb-btn:hover{background:#6f5122;transform:translateY(-1px)}.nb-btn svg{transition:transform .2s}.nb-btn:hover svg{transform:translateX(4px)}
.nb-btn.ghost{background:transparent;color:var(--gold-l);box-shadow:inset 0 0 0 1.5px var(--gold)}.nb-btn.ghost:hover{background:rgba(183,135,62,.15)}
.nb-logo{display:block;width:clamp(150px,15vw,210px);height:auto;margin:18px auto 0}
.nb-rule{display:block;width:60px;height:1px;margin:24px auto 0;background:var(--gold)}

/* A — unbound */
.nb-a{padding:clamp(80px,10vw,140px) 0;background:radial-gradient(60% 60% at 50% 38%,#fff 0%,var(--cream) 55%,var(--cream-d) 100%);
  -webkit-mask-image:linear-gradient(transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(transparent,#000 10%,#000 90%,transparent)}
.nb-glow{position:absolute;left:50%;top:30%;width:560px;height:560px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(228,207,160,.55),transparent 65%);opacity:0;transition:opacity 1.6s ease .6s}
.nb-a.is-in .nb-glow{opacity:1}
.nb-mark{position:relative;width:clamp(260px,32vw,440px);aspect-ratio:900/522;margin-top:14px}
.nb-mark img{position:absolute;inset:0;width:100%;height:100%;transition:transform 1.4s cubic-bezier(.22,1,.36,1),opacity 1.2s ease,filter 1.4s ease}
.nb-a .m-left{transform:translateX(9%)}.nb-a .m-right{transform:translateX(-9%)}.nb-a .m-bits{opacity:0;transform:scale(.6)}
.nb-a.is-in .m-left{transform:translateX(-6%) rotate(-4deg);transition-delay:.3s}
.nb-a.is-in .m-right{transform:translateX(6%) rotate(4deg);transition-delay:.3s}
.nb-a.is-in .m-bits{opacity:1;transform:scale(1.35);transition-delay:.45s}
.nb-a.is-in .m-ring{filter:drop-shadow(0 0 18px rgba(183,135,62,.55));transition-delay:.6s}
.nb-a .nb-script{clip-path:inset(0 100% 0 0);transition:clip-path 1.6s cubic-bezier(.45,0,.2,1) 1.1s}
.nb-a.is-in .nb-script{clip-path:inset(-20% -2% -20% 0)}
.nb-a .nb-h,.nb-a .nb-q,.nb-a .nb-btn{opacity:0;transform:translateY(12px);transition:opacity .8s ease,transform .8s cubic-bezier(.22,1,.36,1)}
.nb-a.is-in .nb-h{opacity:1;transform:none;transition-delay:1.9s}
.nb-a.is-in .nb-q{opacity:1;transform:none;transition-delay:2.1s}
.nb-a.is-in .nb-btn{opacity:1;transform:none;transition-delay:2.3s}

/* B — the arch */
.nb-b{padding:clamp(64px,8vw,112px) 24px;background:linear-gradient(180deg,#fff 0%,var(--cream) 18%,var(--cream) 82%,#fff 100%)}
.nb-grid{max-width:68rem;margin:0 auto;display:grid;gap:40px;align-items:center}
@media (min-width:900px){.nb-grid{grid-template-columns:.9fr 1fr;gap:72px}.nb-b .nb-copy{text-align:left;align-items:flex-start}.nb-b .nb-logo,.nb-b .nb-rule,.nb-b .nb-q{margin-left:0!important}}
.nb-copy{display:flex;flex-direction:column;align-items:center}
.nb-arch{position:relative;margin:0 auto;width:min(420px,100%)}
.nb-arch img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:999px 999px 24px 24px;box-shadow:0 40px 70px -40px rgba(32,31,30,.55)}
.nb-arch .ln{position:absolute;inset:-14px -14px 14px 14px;border:1px solid var(--gold);border-radius:999px 999px 28px 28px;pointer-events:none}

/* C — gilded */
.nb-c{padding:calc(clamp(40px,6vw,90px) + clamp(64px,8vw,110px)) 0;color:#F7F2E8;background:#1f1d1b}
.nb-bg{position:absolute;inset:0}
.nb-wave{position:absolute;left:0;right:0;z-index:1;display:block;width:100%;height:clamp(40px,6vw,90px);pointer-events:none}.nb-wave.t{top:-1px}.nb-wave.b{bottom:-1px}
.nb-bg img{width:100%;height:100%;object-fit:cover;object-position:70% 30%;opacity:.28;filter:grayscale(.4) sepia(.35)}
.nb-bg::after{content:"";position:absolute;inset:0;background:radial-gradient(55% 60% at 50% 45%,rgba(31,29,27,.55),rgba(31,29,27,.95)),radial-gradient(40% 40% at 50% 20%,rgba(183,135,62,.25),transparent 70%)}
.nb-c .nb-eye{color:var(--gold-l)}
.nb-logo.light{filter:brightness(0) invert(.92) sepia(.5) saturate(1.6) hue-rotate(-8deg)}
.nb-c .nb-script{background-image:linear-gradient(100deg,transparent 40%,rgba(255,255,255,.9) 50%,transparent 60%),linear-gradient(95deg,#8F6A2E 0%,#E4CFA0 30%,#B7873E 55%,#F1E0B5 75%,#8F6A2E 100%);
  background-size:250% 100%,100% 100%;background-position:100% 0,0 0;-webkit-background-clip:text;background-clip:text;color:transparent;padding:0 .08em}
.nb-c.is-in .nb-script{animation:nb-glint 2.4s cubic-bezier(.45,0,.25,1) .4s both,nb-glint 2.4s cubic-bezier(.45,0,.25,1) 7s infinite}
@keyframes nb-glint{from{background-position:100% 0,0 0}to{background-position:0% 0,0 0}}
.nb-c .nb-h{color:#F7F2E8}.nb-c .nb-q{color:rgba(247,242,232,.75)}

/* D — living proof */
.nb-d{padding:clamp(64px,8vw,112px) 20px;background:linear-gradient(180deg,#fff,var(--cream) 30%,var(--cream) 70%,#fff)}
.nb-wrap{position:relative;max-width:72rem;margin:0 auto;display:grid;align-items:center}
.nb-fan{position:relative;height:clamp(240px,32vw,420px)}
.nb-fan img{position:absolute;width:44%;aspect-ratio:4/5;object-fit:cover;border-radius:18px;border:6px solid #fff;box-shadow:0 30px 60px -30px rgba(32,31,30,.55)}
.nb-fan .p1{left:2%;top:10%;transform:rotate(-6deg)}
.nb-fan .p2{left:28%;top:0;z-index:2;transform:rotate(2deg)}
.nb-fan .p3{left:54%;top:12%;transform:rotate(7deg)}
.nb-card{position:relative;z-index:3;margin:-40px auto 0;width:min(560px,100%);padding:clamp(28px,4vw,44px) clamp(22px,4vw,44px);border-radius:28px;background:#fff;display:flex;flex-direction:column;align-items:center;
  box-shadow:0 0 0 1px rgba(183,135,62,.18),0 40px 80px -40px rgba(143,106,46,.55)}
@media (min-width:960px){.nb-wrap{grid-template-columns:1.1fr 1fr}.nb-card{margin:0 0 0 -60px}.nb-fan{height:460px}}
.nb-d .nb-logo{margin-top:12px}

/* phones: the button stays on one line, even inside the D card */
@media (max-width:479px){.nb-btn{gap:10px;padding:15px 22px;letter-spacing:.12em}}

@media (prefers-reduced-motion:reduce){.nb *{transition:none!important;animation:none!important}
  .nb-a .nb-h,.nb-a .nb-q,.nb-a .nb-btn{opacity:1;transform:none}.nb-a .nb-script{clip-path:none}.nb-a .m-bits{opacity:1}}`;

const JS = `<script>
(function(){var s=document.querySelector('[data-nb]');if(!s)return;
if(!('IntersectionObserver' in window)){s.classList.add('is-in');return;}
var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){s.classList.add('is-in');io.disconnect();}},{threshold:.35});io.observe(s);
addEventListener('load',function(){if(location.hash==='#nlb')scrollTo(0,s.getBoundingClientRect().top+scrollY-40);});})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `nb-${k}.html`),
    (home.slice(0, after) + o.html.replace('data-nb>', 'data-nb id="nlb">') + home.slice(after))
      .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
      .replace('</body>', `${JS}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" data-replay="${k}">↻ Replay</button> · <a href="/nb-${k}.html#nlb" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe data-k="${k}" src="/nb-${k}.html#nlb" title="${esc(o.label)}" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe data-k="${k}" src="/nb-${k}.html#nlb" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>No Longer Bound section — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --gold:#8F6A2E; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:840px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:840px; font-size:15px; }
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; }
.links a, .links button { color:var(--gold); background:none; border:0; padding:0; font:inherit; cursor:pointer; }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--gold); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,#8F6A2E,#B7873E,#7FA076); }
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
  <h1>No Longer Bound — below the testimonials</h1>
  <p class="lead">Four treatments in No Longer Bound’s own gold, cream and sage, so the course reads as its own thing on a
     Rise Up Queens page. Your client’s copy throughout; the button link is a placeholder until you send it. Each preview is
     the real homepage, opened at the section — <strong>Replay</strong> re-runs the entrance, which matters most for A.</p>
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
  document.querySelectorAll('[data-replay]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('iframe[data-k="' + b.dataset.replay + '"]').forEach(function (f) {
        f.src = '/nb-' + b.dataset.replay + '.html?r=' + Date.now() + '#nlb';
      });
    });
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'nlb-options.html'), page);
console.log('built dist/nlb-options.html + ' + Object.keys(OPTIONS).length + ' frames');

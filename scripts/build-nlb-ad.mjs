// Builds /nlb-ad-options.html — option A ("Unbound") of the No Longer Bound
// section, cut down to ad size. Same palette, same split mark and the same
// chains-break entrance; three formats from banner to slim strip.
//
// Each option is the real homepage with the ad inserted after the
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
if (T < 0) throw new Error('build-nlb-ad: #testimonials not found in dist/index.html');
const after = home.indexOf('</section>', T) + '</section>'.length;

const n = content.home.nlb;
const A = '/assets/nlb/';
const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const btn = `<a href="${esc(n.url)}" class="na-btn">${esc(n.cta)}${ARROW}</a>`;
const mark = `
  <div class="na-mark" role="img" aria-label="No Longer Bound">
    <img class="m-ring" src="${A}mark-ring.png" alt=""><img class="m-left" src="${A}mark-left.png" alt="">
    <img class="m-right" src="${A}mark-right.png" alt=""><img class="m-bits" src="${A}mark-bits.png" alt="">
  </div>`;
const script = `<p class="na-script">${esc(n.script)}</p>`;
const head = `<h2 class="na-h">${esc(n.headline)}</h2>`;
const q = `<p class="na-q">${esc(n.question)}</p>`;
const tag = `<span class="na-tag">${esc(n.eyebrow)}</span>`;

const OPTIONS = {
  banner: {
    label: 'A1 — Banner',
    note: 'A wide, low banner card — about 200px tall on desktop. The mark breaks its chains on the left, “Find Freedom” and the headline in the middle, the question and button on the right. Reads like a premium display ad between two sections.',
    pick: true,
    html: `
<section class="na na-1" data-na>
  <div class="na-card">
    ${tag}
    <div class="na-row">
      ${mark}
      <div class="na-words">${script}${head}</div>
      <div class="na-act">${q}${btn}</div>
    </div>
  </div>
</section>`,
  },
  card: {
    label: 'A2 — Sponsored card',
    note: 'A compact centred card, narrower than the content around it: the mark on the left, the script, headline, question and button stacked on the right. Feels like a featured-course spot in a magazine.',
    html: `
<section class="na na-2" data-na>
  <div class="na-card">
    ${tag}
    <div class="na-row">
      ${mark}
      <div class="na-col">${script}${head}${q}${btn}</div>
    </div>
  </div>
</section>`,
  },
  strip: {
    label: 'A3 — Slim strip',
    note: 'The smallest: one thin gold-edged strip, about 110px tall — the mark, “Find Freedom” with the headline beside it, and the button at the end. The question is left out to keep it to one line. The lightest touch on the page.',
    html: `
<section class="na na-3" data-na>
  <div class="na-card">
    <div class="na-row">
      ${mark}
      <div class="na-words">${script}${head}</div>
      ${btn}
    </div>
  </div>
</section>`,
  },
};

const CSS = `
.na{position:relative;padding:clamp(28px,4vw,48px) 16px;text-align:left;color:#201F1E;--gold:#B7873E;--gold-d:#8F6A2E;--cream:#FAF7F1;--cream-d:#F1E8D9}
.na *{box-sizing:border-box}.na p{margin:0}
.na-card{position:relative;overflow:hidden;margin:0 auto;border-radius:26px;
  background:radial-gradient(70% 140% at 12% 50%,#fff 0%,var(--cream) 45%,var(--cream-d) 100%);
  box-shadow:inset 0 0 0 1px rgba(183,135,62,.28),0 30px 60px -36px rgba(143,106,46,.55)}
.na-row{display:flex;align-items:center;gap:clamp(18px,3vw,40px)}
.na-tag{position:absolute;top:14px;right:18px;font:700 9.5px/1 Lato,sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#8A8578}
.na-script{font:400 clamp(40px,4.4vw,60px)/.95 'Julietta Messie',cursive;color:var(--gold)}
.na-h{margin:4px 0 0;font:800 clamp(15px,1.5vw,20px)/1.2 Montserrat,sans-serif;text-transform:uppercase;color:#201F1E}
.na-q{font:400 15px/1.6 Lato,sans-serif;color:#54514A}
.na-btn{display:inline-flex;align-items:center;gap:10px;flex:none;min-height:44px;padding:13px 22px;border-radius:999px;background:var(--gold-d);color:#fff;
  font:700 12px/1 Lato,sans-serif;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;white-space:nowrap;box-shadow:0 14px 30px -14px rgba(143,106,46,.9);transition:background .2s}
.na-btn:hover{background:#6f5122}.na-btn svg{transition:transform .2s}.na-btn:hover svg{transform:translateX(4px)}

/* the mark, and the chains breaking on arrival */
.na-mark{position:relative;flex:none;aspect-ratio:900/522}
.na-mark img{position:absolute;inset:0;width:100%;height:100%;transition:transform 1.3s cubic-bezier(.22,1,.36,1),opacity 1.1s ease,filter 1.3s ease}
.na .m-left{transform:translateX(9%)}.na .m-right{transform:translateX(-9%)}.na .m-bits{opacity:0;transform:scale(.6)}
.na.is-in .m-left{transform:translateX(-6%) rotate(-4deg);transition-delay:.25s}
.na.is-in .m-right{transform:translateX(6%) rotate(4deg);transition-delay:.25s}
.na.is-in .m-bits{opacity:1;transform:scale(1.35);transition-delay:.4s}
.na.is-in .m-ring{filter:drop-shadow(0 0 12px rgba(183,135,62,.55));transition-delay:.5s}
.na .na-script{clip-path:inset(0 100% 0 0);transition:clip-path 1.4s cubic-bezier(.45,0,.2,1) .8s}
.na.is-in .na-script{clip-path:inset(-20% -2% -20% 0)}

/* A1 — banner */
.na-1 .na-card{max-width:72rem;padding:30px clamp(24px,4vw,52px)}
.na-1 .na-mark{width:clamp(170px,16vw,230px)}
.na-1 .na-words{flex:1.1}
.na-1 .na-act{flex:1;display:flex;flex-direction:column;align-items:flex-start;gap:14px;padding-left:clamp(18px,3vw,40px);border-left:1px solid rgba(183,135,62,.35)}

/* A2 — sponsored card */
.na-2 .na-card{max-width:46rem;padding:44px 30px 28px}
.na-2 .na-mark{width:clamp(150px,18vw,200px)}
.na-2 .na-col{display:flex;flex-direction:column;align-items:flex-start}
.na-2 .na-q{margin-top:10px}.na-2 .na-btn{margin-top:16px}

/* A3 — slim strip */
.na-3{padding-top:clamp(20px,3vw,32px);padding-bottom:clamp(20px,3vw,32px)}
.na-3 .na-card{max-width:68rem;padding:14px 18px 14px 14px;border-radius:999px}
.na-3 .na-mark{width:clamp(120px,11vw,150px)}
.na-3 .na-words{flex:1;display:flex;align-items:baseline;gap:18px;flex-wrap:wrap}
.na-3 .na-script{font-size:clamp(34px,3.4vw,46px)}
.na-3 .na-h{margin:0;font-size:clamp(14px,1.15vw,16px)}

/* phones and narrow tablets: everything stacks, centred, still compact */
@media (max-width:820px){
  .na-row{flex-direction:column;text-align:center;gap:12px}
  .na-tag{position:static;display:block;margin:0 0 6px;text-align:center}
  .na-1 .na-card,.na-2 .na-card{padding:22px 20px 24px}
  .na-1 .na-act{padding-left:0;border-left:0;align-items:center;gap:12px}
  .na-2 .na-col{align-items:center}
  .na-3 .na-card{border-radius:24px;padding:18px}
  .na-3 .na-words{flex-direction:column;align-items:center;gap:2px}
  .na-mark{width:150px!important}
}
@media (prefers-reduced-motion:reduce){.na *{transition:none!important}.na .na-script{clip-path:none}.na .m-bits{opacity:1}}`;

const JS = `<script>
(function(){var s=document.querySelector('[data-na]');if(!s)return;
if(!('IntersectionObserver' in window)){s.classList.add('is-in');return;}
var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){s.classList.add('is-in');io.disconnect();}},{threshold:.5});io.observe(s);
addEventListener('load',function(){if(location.hash==='#nlb')scrollTo(0,s.getBoundingClientRect().top+scrollY-200);});})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `na-${k}.html`),
    (home.slice(0, after) + o.html.replace('data-na>', 'data-na id="nlb">') + home.slice(after))
      .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
      .replace('</body>', `${JS}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" data-replay="${k}">↻ Replay</button> · <a href="/na-${k}.html#nlb" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="620"><iframe data-k="${k}" src="/na-${k}.html#nlb" title="${esc(o.label)}" loading="lazy" width="1440" height="620"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="760"><iframe data-k="${k}" src="/na-${k}.html#nlb" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="760"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>No Longer Bound ad — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --gold:#8F6A2E; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:840px; margin:10px 0 0; }
.opt { margin-top:52px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:840px; font-size:15px; }
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; }
.links a, .links button { color:var(--gold); background:none; border:0; padding:0; font:inherit; cursor:pointer; }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--gold); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,#8F6A2E,#B7873E,#7FA076); }
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
  <h1>No Longer Bound — as an ad</h1>
  <p class="lead">Option A cut down to ad size: the same gold and cream, the same chains breaking and “Find Freedom” writing
     itself in, in three formats. Each preview is the real homepage, opened so the ad sits with the testimonials above it.</p>
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
        f.src = '/na-' + b.dataset.replay + '.html?r=' + Date.now() + '#nlb';
      });
    });
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'nlb-ad-options.html'), page);
console.log('built dist/nlb-ad-options.html + ' + Object.keys(OPTIONS).length + ' frames');

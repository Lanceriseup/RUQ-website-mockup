// Builds /faith-e-options.html — four variants of option E ("The open page")
// from /faith-c-options.html, each on a different ground and with its own
// headline and lead-paragraph treatment.
//
// Kept from E in every one: the mission set as the opening of a book, the
// pill toggle, and the white page that opens beneath it with the beliefs in
// two columns under Roman numerals. Not kept: the blush ground, which belongs
// to the Freedom section.
//
// Copy exactly as content.json home.faith; the creed is always in the DOM.
// Must run after scripts/build.mjs.
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
if (!FAITH.test(home)) throw new Error('build-faith-e: #faith not found in dist/index.html');

const f = content.home.faith;
const MARKS = ['the unshakable truth of the Gospel', 'true freedom', 'strength, identity, and purpose'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const CHEV = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

// The mission split at its first full stop: a lead sentence set large, then
// the rest. Nothing reworded; the phrases are marked for each variant to style.
const missionParts = () => {
  const marked = MARKS.reduce((t, m) => t.split(esc(m)).join(`<mark>${esc(m)}</mark>`), esc(f.mission));
  const cut = marked.indexOf('. ') + 1;
  return { lead: marked.slice(0, cut), rest: marked.slice(cut).trim() };
};
const { lead, rest } = missionParts();

const page = (cls = '') => `
  <div class="fn-acc" data-acc>
    <button type="button" class="fn-acc-btn" aria-expanded="false" aria-controls="fn-creed">
      <span>${esc(f.toggle)}</span><i class="fn-chev">${CHEV}</i>
    </button>
    <div class="fn-region" id="fn-creed" role="region" aria-label="${esc(f.title)}" inert>
      <div class="fn-region-in"><div class="pg ${cls}">
        <p class="pg-sub">${esc(f.title)}</p>
        <p class="pg-intro">${esc(f.intro)}</p>
        <ol class="rom">${f.beliefs.map((b, i) => `<li style="--i:${i}"><span class="n">${ROMAN[i]}</span><span>${esc(b)}</span></li>`).join('')}</ol>
      </div></div>
    </div>
  </div>`;

const waveTop = `<svg class="fe-wave t" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 H1440 V46 C1200 104, 980 100, 740 64 C500 28, 260 26, 0 74 Z" fill="#fff"/></svg>`;
const waveBot = `<svg class="fe-wave b" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120 H1440 V60 C1180 10, 960 14, 720 52 C480 90, 240 96, 0 48 Z" fill="#fff"/></svg>`;

const OPTIONS = {
  heaven: {
    label: 'E1 — Heaven’s light',
    note: 'A brand-tinted sky — teal above, blush at the horizon — drifting very slowly, fading out of the white above and into the white below. The heading becomes a centred title between two fine rules under a large pink script; the first sentence of the mission is set big in serif, the rest smaller beneath. Light, hopeful, uplifting.',
    pick: true,
    html: `
<section id="faith" class="fe fe-1">
  <div class="fe-bg" aria-hidden="true"><img src="/assets/photos/sky-wide.jpg" alt=""></div>
  <div class="fe-in">
    <p class="s">${esc(f.script)}</p>
    <h2 class="h"><i></i><span>${esc(f.heading)}</span><i></i></h2>
    <p class="lead">${lead}</p>
    <p class="rest">${rest}</p>
    ${page()}
  </div>
</section>`,
  },
  cathedral: {
    label: 'E2 — Cathedral',
    note: 'Dark and reverent: the cathedral with light falling through its windows, the beams slowly brightening and softening. A large white serif title with the pink script laid across its top edge, and the key phrases glowing pink. The open page is warm parchment, like a lit page in a dark room.',
    html: `
<section id="faith" class="fe fe-2">
  <div class="fe-bg" aria-hidden="true"><img src="/assets/photos/cathedral-wide.jpg" alt=""><span class="beams"></span></div>
  ${waveTop}
  <div class="fe-in">
    <div class="ttl"><p class="s">${esc(f.script)}</p><h2 class="h">${esc(f.heading)}</h2></div>
    <p class="lead">${lead}</p>
    <p class="rest">${rest}</p>
    ${page('parch')}
  </div>
  ${waveBot}
</section>`,
  },
  teal: {
    label: 'E3 — Deep teal',
    note: 'Your client’s teal, taken deep and rich — a gradient from brand teal to midnight teal — with BELIEVE written enormous in outline behind everything. White heading, the script in light pink, and the key phrases underlined by pink brush strokes that paint on. The boldest and most on-brand.',
    html: `
<section id="faith" class="fe fe-3">
  ${waveTop}
  <span class="wm" aria-hidden="true">Believe</span>
  <div class="fe-in">
    <p class="s">${esc(f.script)}</p>
    <h2 class="h">${esc(f.heading)}</h2>
    <p class="lead">${lead}</p>
    <p class="rest">${rest}</p>
    ${page()}
  </div>
  ${waveBot}
</section>`,
  },
  editorial: {
    label: 'E4 — Editorial',
    note: 'Pure white and purely typographic, framed by a fine pink-to-teal border. The heading stacks large on the left — STATEMENT / OF FAITH filled with the brand gradient, the script tucked above — and the mission sits on the right as a pull quote under an oversized pink quotation mark. Magazine-cover confidence.',
    html: `
<section id="faith" class="fe fe-4">
  <div class="frame">
    <div class="ed">
      <div class="ed-l"><p class="s">${esc(f.script)}</p><h2 class="h"><span>Statement</span><span>of Faith</span></h2></div>
      <div class="ed-r"><span class="q" aria-hidden="true">“</span><p class="lead">${lead}</p><p class="rest">${rest}</p></div>
    </div>
    ${page()}
  </div>
</section>`,
  },
};

const CSS = `
.fe{position:relative;overflow:hidden;text-align:center;color:#1c1c1c}
.fe *{box-sizing:border-box}.fe p{margin:0}
.fe-in{position:relative;z-index:3;max-width:56rem;margin:0 auto;padding:0 20px}
.fe-bg{position:absolute;inset:0;z-index:0;pointer-events:none}
.fe-bg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fe-wave{position:absolute;left:0;right:0;z-index:2;display:block;width:100%;height:clamp(40px,6vw,90px);pointer-events:none}
.fe-wave.t{top:-1px}.fe-wave.b{bottom:-1px}
.fe .s{font:400 clamp(42px,4.8vw,66px)/1 'Julietta Messie',cursive;color:#e8208f}
.fe mark{background:none;color:inherit}

/* the toggle and the page — shared */
.fn-acc{margin-top:34px}
.fn-acc-btn{display:inline-flex;align-items:center;gap:16px;min-height:52px;padding:12px 14px 12px 26px;border:0;border-radius:999px;background:#fff;cursor:pointer;
  font:700 13px/1.3 Montserrat,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#1c1c1c;text-align:left;
  box-shadow:inset 0 0 0 1.5px rgba(232,32,143,.4),0 16px 36px -22px rgba(232,32,143,.8)}
.fn-chev{display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:50%;background:#e8208f;color:#fff;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.fn-acc[data-open] .fn-chev{transform:rotate(180deg)}
.fn-region{display:grid;grid-template-rows:0fr;transition:grid-template-rows .8s cubic-bezier(.22,1,.36,1)}
.fn-acc[data-open] .fn-region{grid-template-rows:1fr}
.fn-region-in{min-height:0;overflow:hidden;padding:0 4px}
.pg{max-width:54rem;margin:28px auto 14px;padding:clamp(28px,4vw,52px) clamp(20px,4vw,56px);border-radius:22px;background:#fff;text-align:left;
  box-shadow:0 40px 80px -50px rgba(232,32,143,.55),0 20px 40px -30px rgba(0,0,0,.2)}
.pg-sub{text-align:center;font:700 11px/1.4 Lato,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#6b6b6b}
.pg-intro{margin-top:16px!important;text-align:center;font:400 clamp(17px,1.5vw,19px)/1.6 'Cormorant Garamond',Georgia,serif;color:#2b2b2b}
.rom{list-style:none;margin:26px 0 0;padding:0;column-gap:44px;border-top:1px solid rgba(28,28,28,.1)}
@media (min-width:760px){.rom{columns:2}}
.rom li{display:flex;gap:16px;padding:14px 0;border-bottom:1px solid rgba(28,28,28,.08);break-inside:avoid;font:400 clamp(16px,1.4vw,18px)/1.45 'Cormorant Garamond',Georgia,serif;color:#1c1c1c;
  opacity:0;transform:translateY(12px);transition:opacity .55s ease,transform .55s cubic-bezier(.22,1,.36,1);transition-delay:calc(.3s + var(--i)*.07s)}
.fn-acc[data-open] .rom li{opacity:1;transform:none}
.rom .n{flex:none;width:2.1em;font:600 1.15em/1.2 'Cormorant Garamond',Georgia,serif;color:#e8208f}

/* E1 — heaven's light */
.fe-1{padding:clamp(96px,11vw,160px) 0 clamp(96px,11vw,150px)}
.fe-1 .fe-bg{-webkit-mask-image:linear-gradient(transparent,#000 22%,#000 72%,transparent);mask-image:linear-gradient(transparent,#000 22%,#000 72%,transparent)}
.fe-1 .fe-bg img{opacity:.75;animation:fe-drift 40s ease-in-out infinite alternate}
@keyframes fe-drift{from{transform:scale(1.05) translateX(-1.5%)}to{transform:scale(1.12) translateX(1.5%)}}
.fe-1 .fe-bg::after{content:"";position:absolute;inset:0;background:radial-gradient(55% 45% at 50% 48%,rgba(255,255,255,.72),rgba(255,255,255,0) 75%)}
.fe-1 .h{display:flex;align-items:center;justify-content:center;gap:18px;margin:10px 0 0;font:600 clamp(16px,1.6vw,20px)/1.2 'Cormorant Garamond',Georgia,serif;letter-spacing:.42em;text-transform:uppercase;color:#1c1c1c}
.fe-1 .h span{padding-left:.42em}
.fe-1 .h i{width:clamp(30px,6vw,70px);height:1px;background:linear-gradient(90deg,transparent,rgba(28,28,28,.45))}.fe-1 .h i:last-child{transform:scaleX(-1)}
.fe-1 .lead{max-width:44rem;margin:28px auto 0;font:500 clamp(22px,2.5vw,32px)/1.35 'Cormorant Garamond',Georgia,serif;color:#1c1c1c}
.fe-1 .lead mark{font-weight:600;color:#b81870}
.fe-1 .rest{max-width:38rem;margin:16px auto 0;font:400 clamp(15.5px,1.2vw,17px)/1.75 Lato,sans-serif;color:#2b2b2b}
.fe-1 .rest mark{font-weight:700;color:#1c1c1c;background:linear-gradient(transparent 64%,rgba(247,191,210,.9) 64%)}

/* E2 — cathedral */
.fe-2{padding:calc(clamp(40px,6vw,90px) + clamp(64px,8vw,110px)) 0;color:#fff}
.fe-2 .fe-bg{background:#121212}
.fe-2 .fe-bg img{opacity:.85;object-position:70% 40%}
.fe-2 .fe-bg::after{content:"";position:absolute;inset:0;background:radial-gradient(60% 70% at 50% 50%,rgba(18,18,18,.55),rgba(18,18,18,.9))}
.fe-2 .beams{position:absolute;inset:0;z-index:1;background:linear-gradient(115deg,transparent 30%,rgba(255,235,240,.10) 45%,transparent 60%);mix-blend-mode:screen;animation:fe-beam 7s ease-in-out infinite}
@keyframes fe-beam{0%,100%{opacity:.4}50%{opacity:1}}
/* the script sits just over the title, tilted, overlapping only its top edge */
.fe-2 .ttl{position:relative;display:inline-block}
.fe-2 .ttl .s{position:relative;z-index:1;display:block;margin-bottom:-.08em;transform:rotate(-4deg);text-shadow:0 4px 24px rgba(0,0,0,.7)}
.fe-2 .h{margin:0;font:500 clamp(40px,5.6vw,78px)/1.05 'Cormorant Garamond',Georgia,serif;letter-spacing:.06em;text-transform:uppercase;color:#fff}
.fe-2 .lead{max-width:44rem;margin:26px auto 0;font:500 clamp(21px,2.3vw,29px)/1.4 'Cormorant Garamond',Georgia,serif;color:rgba(255,255,255,.92)}
.fe-2 .rest{max-width:40rem;margin:14px auto 0;font:400 clamp(15.5px,1.2vw,17px)/1.75 Lato,sans-serif;color:rgba(255,255,255,.72)}
.fe-2 mark{color:#f7a8cc;font-weight:600;text-shadow:0 0 18px rgba(232,32,143,.75)}
.fe-2 .rest mark{font-weight:700}
.pg.parch{background:#F6F1E8;box-shadow:0 0 80px -20px rgba(255,214,170,.35),0 40px 80px -40px rgba(0,0,0,.9)}

/* E3 — deep teal */
.fe-3{padding:calc(clamp(40px,6vw,90px) + clamp(64px,8vw,110px)) 0;color:#fff;
  background:radial-gradient(70% 60% at 50% 0%,rgba(255,255,255,.14),transparent 60%),linear-gradient(160deg,#00a6b2 0%,#007a85 45%,#03454d 100%)}
.fe-3 .wm{position:absolute;left:50%;top:50%;z-index:1;transform:translate(-50%,-50%);white-space:nowrap;pointer-events:none;
  font:900 clamp(130px,22vw,360px)/1 Montserrat,sans-serif;letter-spacing:-.02em;text-transform:uppercase;color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.12)}
.fe-3 .s{color:#ffb3d6}
.fe-3 .h{margin:4px 0 0;font:800 clamp(28px,3.6vw,48px)/1.1 Montserrat,sans-serif;letter-spacing:.02em;text-transform:uppercase;color:#fff}
.fe-3 .lead{max-width:44rem;margin:26px auto 0;font:600 clamp(19px,1.9vw,24px)/1.5 Montserrat,sans-serif;letter-spacing:-.005em;color:#fff}
.fe-3 .rest{max-width:40rem;margin:14px auto 0;font:400 clamp(15.5px,1.2vw,17px)/1.75 Lato,sans-serif;color:rgba(255,255,255,.82)}
.fe-3 mark{color:#fff;font-weight:700;background:linear-gradient(transparent 66%,rgba(232,32,143,.85) 66%,rgba(232,32,143,.85) 92%,transparent 92%) no-repeat 0 0/0% 100%;transition:background-size .9s cubic-bezier(.65,0,.35,1)}
.fe-3.is-in mark{background-size:100% 100%}
.fe-3 mark:nth-of-type(2){transition-delay:.35s}.fe-3 .rest mark{transition-delay:.7s}

/* E4 — editorial */
.fe-4{padding:clamp(56px,7vw,96px) 16px;background:#fff}
.fe-4 .frame{position:relative;max-width:76rem;margin:0 auto;padding:clamp(40px,6vw,88px) clamp(20px,5vw,72px);border-radius:32px;
  background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,rgba(232,32,143,.6),rgba(255,255,255,0) 40%,rgba(255,255,255,0) 60%,rgba(0,185,198,.6)) border-box;border:1.5px solid transparent;
  box-shadow:0 50px 100px -70px rgba(232,32,143,.5)}
.ed{display:grid;gap:28px;align-items:center}
@media (min-width:960px){.ed{grid-template-columns:1fr 1.1fr;gap:64px;text-align:left}}
.fe-4 .s{font-size:clamp(38px,4vw,54px)}
.fe-4 .h{margin:2px 0 0;display:flex;flex-direction:column;font:900 clamp(44px,6.4vw,92px)/.92 Montserrat,sans-serif;letter-spacing:-.025em;text-transform:uppercase;
  background:linear-gradient(120deg,#e8208f 0%,#f0569f 45%,#00b9c6 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.ed-r{position:relative;padding-top:64px}
@media (min-width:960px){.ed-r{padding:64px 0 0 30px;border-left:2px solid rgba(0,185,198,.35)}}
.fe-4 .q{position:absolute;top:-30px;left:50%;transform:translateX(-50%);font:700 140px/1 'Cormorant Garamond',Georgia,serif;color:#e8208f;opacity:.9}
@media (min-width:960px){.fe-4 .q{left:18px;transform:none}}
.fe-4 .lead{font:600 clamp(20px,2vw,26px)/1.4 'Cormorant Garamond',Georgia,serif;color:#1c1c1c}
.fe-4 .lead mark{color:#b81870}
.fe-4 .rest{margin-top:14px;font:400 clamp(15.5px,1.2vw,17px)/1.75 Lato,sans-serif;color:#3a3a3a}
.fe-4 .rest mark{font-weight:700;color:#1c1c1c}
.fe-4 .fn-acc{margin-top:44px}

@media (prefers-reduced-motion:reduce){.fe-1 .fe-bg img,.fe-2 .beams{animation:none}.fn-region,.fn-chev,.rom li,.fe-3 mark{transition:none}.rom li{opacity:1;transform:none}.fe-3 mark{background-size:100% 100%}}`;

const JS = `<script>
(function(){
document.querySelectorAll('[data-acc]').forEach(function(a){var b=a.querySelector('.fn-acc-btn'),r=a.querySelector('.fn-region');
 b.addEventListener('click',function(){var open=!a.hasAttribute('data-open');a.toggleAttribute('data-open',open);b.setAttribute('aria-expanded',String(open));
 if(open)r.removeAttribute('inert');else r.setAttribute('inert','');});});
var s=document.getElementById('faith');
if(s&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){s.classList.add('is-in');io.disconnect();}},{threshold:.3});io.observe(s);}else if(s)s.classList.add('is-in');
addEventListener('load',function(){if(s&&location.hash==='#faith')scrollTo(0,s.getBoundingClientRect().top+scrollY-30);});
})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `fe-${k}.html`), home
    .replace(FAITH, o.html)
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
    .replace('</body>', `${JS}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" data-toggle="${k}">Open / close the full statement</button> · <a href="/fe-${k}.html#faith" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe data-k="${k}" src="/fe-${k}.html#faith" title="${esc(o.label)}" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe data-k="${k}" src="/fe-${k}.html#faith" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const gallery = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Statement of Faith — E variants — ${esc(site.brand.name)}</title>
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
  <h1>Statement of Faith — four takes on E</h1>
  <p class="lead">Each keeps E’s open page — the white page that turns down to show the beliefs under Roman numerals — and
     each has its own ground, headline and lead paragraph. No blush: that belongs to Freedom. Use <strong>Open / close the
     full statement</strong> to see the page in both frames.</p>
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

fs.writeFileSync(path.join(dist, 'faith-e-options.html'), gallery);
console.log('built dist/faith-e-options.html + ' + Object.keys(OPTIONS).length + ' frames');

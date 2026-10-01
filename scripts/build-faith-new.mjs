// Builds /faith-new-options.html — the Statement of Faith reimagined from the
// client's mockup: a script "What We Believe", the STATEMENT OF FAITH heading,
// the mission statement, and one control that opens the full statement.
//
// Four treatments in this site's own design language. Every one keeps the
// copy exactly (content.json home.faith), keeps the full creed in the DOM at
// all times, and meets the sections above and below on a curve or a fade —
// never a straight cut.
//
// Each option is the real homepage with the faith section swapped. Must run
// after scripts/build.mjs.
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
if (!FAITH.test(home)) throw new Error('build-faith-new: #faith not found in dist/index.html');

const f = content.home.faith;
const TEAL = '/assets/brand/stroke-hook-teal.svg';
const PINK = '/assets/brand/stroke-hook-lightpink.svg';
const MARKS = ['the unshakable truth of the Gospel', 'true freedom', 'strength, identity, and purpose'];
const mission = () => MARKS.reduce((t, m) => t.split(esc(m)).join(`<mark>${esc(m)}</mark>`), esc(f.mission));
const num = (i) => String(i + 1).padStart(2, '0');
const CHEV = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

// Curved hand-overs, white into the section's ground and back out again.
const waveTop = `<svg class="fn-wave fn-wave-t" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 H1440 V46 C1200 104, 980 100, 740 64 C500 28, 260 26, 0 74 Z" fill="#fff"/></svg>`;
const waveBot = `<svg class="fn-wave fn-wave-b" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120 H1440 V60 C1180 10, 960 14, 720 52 C480 90, 240 96, 0 48 Z" fill="#fff"/></svg>`;

// The disclosure: a button that controls a region. The region is collapsed
// with a 0fr → 1fr grid row so it animates to its natural height, and is
// inert while closed so its links and text are skipped by keyboard and AT —
// but it is always in the DOM, so search and print still get the full creed.
const accordion = (cls, body, label = f.toggle) => `
  <div class="fn-acc ${cls}" data-acc>
    <button type="button" class="fn-acc-btn" aria-expanded="false" aria-controls="fn-creed">
      <span>${esc(label)}</span><i class="fn-chev">${CHEV}</i>
    </button>
    <div class="fn-region" id="fn-creed" role="region" aria-label="${esc(f.title)}" inert>
      <div class="fn-region-in">${body}</div>
    </div>
  </div>`;

const creedList = (cls = '') => `
  <ol class="fn-list ${cls}">${f.beliefs.map((b, i) => `<li style="--i:${i}"><span class="n">${num(i)}</span><span class="t">${esc(b)}</span></li>`).join('')}</ol>`;

const heads = (scriptCls = '') => `
  <p class="fn-script ${scriptCls}">${esc(f.script)}</p>
  <h2 class="fn-h">${esc(f.heading)}</h2>`;

const OPTIONS = {
  teal: {
    label: 'A — Teal brush',
    note: 'Your client’s layout, refined: a soft teal ground with the two teal brush strokes mirrored in opposite corners, the pink script over a bold heading, and the key phrases underlined with a pink brush. The full statement opens inside a frosted glass card, numbered in two columns.',
    pick: true,
    html: `
<section id="faith" class="fn fn-a">
  ${waveTop}
  <div class="fn-strokes" aria-hidden="true"><img class="s1" src="${TEAL}" alt=""><img class="s2" src="${TEAL}" alt=""></div>
  <div class="fn-in">
    ${heads()}
    <p class="fn-mission">${mission()}</p>
    ${accordion('glass', `
      <p class="fn-sub">${esc(f.title)}</p>
      <p class="fn-intro">${esc(f.intro)}</p>
      ${creedList('two')}`)}
  </div>
  ${waveBot}
</section>`,
  },
  parchment: {
    label: 'B — The parchment',
    note: 'Keeps the page’s current manuscript look — the stone photograph and the cream parchment plate — but the plate now shows only the mission, beneath the script heading and a fine ornament. A pink seal at its foot unrolls the parchment to reveal the creed, with a drop cap and two columns.',
    html: `
<section id="faith" class="fn fn-b">
  <div class="fn-stone" aria-hidden="true"><img src="/assets/photos/faith-bg.jpg" alt=""></div>
  ${waveTop}
  <div class="fn-in">
    <div class="fn-plate">
      ${heads()}
      <span class="fn-orn" aria-hidden="true"><i></i><em></em><i></i></span>
      <p class="fn-mission">${mission()}</p>
      ${accordion('seal', `
        <p class="fn-intro drop">${esc(f.intro)}</p>
        ${creedList('two')}`)}
    </div>
  </div>
  ${waveBot}
</section>`,
  },
  pillars: {
    label: 'C — Seven pillars',
    note: 'Light and open, on the same blush as the Freedom section, fading in and out of the white around it. Opening the statement lays the seven beliefs out as cards with large gradient numerals, rising in one after another.',
    html: `
<section id="faith" class="fn fn-c">
  <div class="fn-strokes" aria-hidden="true"><img class="s1" src="${PINK}" alt=""><img class="s2" src="${TEAL}" alt=""></div>
  <div class="fn-in">
    ${heads()}
    <p class="fn-mission">${mission()}</p>
    ${accordion('pill', `
      <p class="fn-intro">${esc(f.intro)}</p>
      ${creedList('cards')}`)}
  </div>
</section>`,
  },
  candle: {
    label: 'D — Candlelight',
    note: 'Dark and devotional: deep ink lit by soft pink and teal glows, with a fine luminous cross standing behind the heading. The mission in a large serif, and the beliefs revealed as a glowing timeline. The most dramatic.',
    html: `
<section id="faith" class="fn fn-d">
  ${waveTop}
  <span class="fn-cross" aria-hidden="true"></span>
  <div class="fn-in">
    ${heads()}
    <p class="fn-mission">${mission()}</p>
    ${accordion('dark', `
      <p class="fn-intro">${esc(f.intro)}</p>
      ${creedList('line')}`)}
  </div>
  ${waveBot}
</section>`,
  },
};

const CSS = `
.fn{position:relative;overflow:hidden;text-align:center;color:#1c1c1c}
.fn *{box-sizing:border-box}
.fn p{margin:0}
.fn-in{position:relative;z-index:3;max-width:52rem;margin:0 auto;padding:0 20px}
.fn-script{font:400 clamp(40px,4.4vw,60px)/1 'Julietta Messie',cursive;color:#e8208f}
.fn-h{margin:6px 0 0;font:800 clamp(24px,2.8vw,36px)/1.15 Montserrat,sans-serif;letter-spacing:.02em;text-transform:uppercase;color:#1c1c1c}
.fn-mission{max-width:42rem;margin:22px auto 0!important;font:400 clamp(16px,1.35vw,18.5px)/1.75 Lato,sans-serif;color:#2b2b2b}
.fn-mission mark{background:none;color:inherit;font-weight:700}
.fn-wave{position:absolute;left:0;right:0;z-index:2;display:block;width:100%;height:clamp(40px,6vw,90px);pointer-events:none}
.fn-wave-t{top:-1px}.fn-wave-b{bottom:-1px}
.fn-strokes{position:absolute;inset:0;z-index:1;pointer-events:none}
.fn-strokes img{position:absolute;width:clamp(220px,26vw,420px);height:auto}

/* disclosure */
.fn-acc{max-width:46rem;margin:36px auto 0;text-align:left}
.fn-acc-btn{display:flex;width:100%;align-items:center;justify-content:space-between;gap:16px;min-height:56px;padding:18px 24px;border:0;background:none;cursor:pointer;
  font:700 13px/1.3 Montserrat,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#1c1c1c;text-align:left}
.fn-chev{display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:50%;background:#e8208f;color:#fff;transition:transform .5s cubic-bezier(.22,1,.36,1)}
.fn-acc[data-open] .fn-chev{transform:rotate(180deg)}
.fn-region{display:grid;grid-template-rows:0fr;transition:grid-template-rows .7s cubic-bezier(.22,1,.36,1)}
.fn-acc[data-open] .fn-region{grid-template-rows:1fr}
.fn-region-in{min-height:0;overflow:hidden;padding:0 24px}
.fn-region-in>*:first-child{margin-top:4px!important}
.fn-region-in>*:last-child{margin-bottom:26px!important}
.fn-sub{font:700 11px/1.4 Lato,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#6b6b6b}
.fn-intro{margin-top:14px!important;font:400 16px/1.75 Lato,sans-serif;color:#3a3a3a}
.fn-list{list-style:none;margin:22px 0 0;padding:0}
.fn-list li{display:flex;gap:14px;padding:12px 0;break-inside:avoid;font:400 15.5px/1.6 Lato,sans-serif;color:#2b2b2b;
  opacity:0;transform:translateY(10px);transition:opacity .5s ease,transform .5s cubic-bezier(.22,1,.36,1);transition-delay:calc(.25s + var(--i)*.06s)}
.fn-acc[data-open] .fn-list li{opacity:1;transform:none}
.fn-list .n{flex:none;font:800 13px/1.9 Montserrat,sans-serif;color:#dc1e88}
.fn-list.two{column-gap:40px}
@media (min-width:760px){.fn-list.two{columns:2}}

/* A — teal brush */
.fn-a{padding:calc(clamp(40px,6vw,90px) + clamp(48px,6vw,84px)) 0 calc(clamp(40px,6vw,90px) + clamp(56px,7vw,96px));background:linear-gradient(180deg,#a7dfe4 0%,#86cfd6 100%)}
.fn-a .s1{top:-2%;left:-6%;opacity:.5;transform:rotate(200deg)}
.fn-a .s2{bottom:4%;right:-6%;opacity:.5;transform:rotate(20deg)}
.fn-a .fn-mission mark{background:linear-gradient(transparent 70%,rgba(232,32,143,.35) 70%,rgba(232,32,143,.35) 92%,transparent 92%)}
.fn-acc.glass{border-radius:24px;background:rgba(255,255,255,.62);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.7),0 30px 60px -36px rgba(0,80,90,.55)}
.fn-acc.glass .fn-region-in{border-top:1px solid rgba(28,28,28,0);transition:border-color .4s}
.fn-acc.glass[data-open] .fn-region-in{border-top-color:rgba(28,28,28,.1)}
.fn-acc.glass .fn-sub{margin-top:20px!important}

/* B — parchment */
.fn-b{padding:calc(clamp(40px,6vw,90px) + 56px) 0 calc(clamp(40px,6vw,90px) + 64px)}
.fn-stone{position:absolute;inset:0;z-index:0}
.fn-stone img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.25) brightness(.9)}
.fn-stone::after{content:"";position:absolute;inset:0;background:rgba(28,28,28,.78)}
.fn-plate{max-width:50rem;margin:0 auto;padding:clamp(36px,5vw,64px) clamp(22px,5vw,64px) 0;background:#F6F1E8;box-shadow:0 40px 90px -40px rgba(0,0,0,.9);font-family:'Cormorant Garamond',serif}
.fn-b .fn-h{font:600 clamp(22px,2.4vw,30px)/1.2 'Cormorant Garamond',serif;letter-spacing:.24em}
.fn-orn{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:18px}
.fn-orn i{width:60px;height:1px;background:rgba(28,28,28,.25)}.fn-orn em{width:7px;height:7px;transform:rotate(45deg);background:#e8208f}
.fn-b .fn-mission{font:500 clamp(18px,1.7vw,22px)/1.55 'Cormorant Garamond',serif;color:#1c1c1c}
.fn-b .fn-mission mark{font-weight:600;color:#b81870}
.fn-acc.seal{margin-top:26px;text-align:left}
.fn-acc.seal .fn-acc-btn{flex-direction:column;justify-content:center;gap:10px;padding:18px 0 30px;font:600 12px/1.3 Lato,sans-serif;letter-spacing:.24em;color:#b81870;text-align:center}
.fn-acc.seal .fn-chev{width:48px;height:48px;box-shadow:0 0 0 6px rgba(232,32,143,.12),0 10px 24px -10px rgba(232,32,143,.9)}
.fn-acc.seal .fn-region-in{padding:0}
.fn-b .fn-intro{font:400 clamp(17px,1.5vw,19px)/1.55 'Cormorant Garamond',serif;color:#1c1c1c;padding-top:8px;border-top:1px solid rgba(28,28,28,.18)}
.fn-b .fn-intro.drop::first-letter{float:left;margin:4px 10px 0 0;font-size:3.4em;line-height:.8;font-weight:600;color:#e8208f}
.fn-b .fn-list li{font:400 clamp(16px,1.4vw,18px)/1.45 'Cormorant Garamond',serif;color:#1c1c1c}
.fn-b .fn-list .n{font:700 12px/2 Lato,sans-serif;color:#e8208f}
.fn-b .fn-region-in>*:last-child{margin-bottom:8px!important}

/* C — seven pillars */
.fn-c{padding:clamp(72px,9vw,128px) 0;background:linear-gradient(180deg,#fff 0%,#fdf0f4 22%,#fcf7f3 78%,#fff 100%)}
.fn-c .s1{top:4%;right:-7%;opacity:.8}
.fn-c .s2{bottom:4%;left:-7%;opacity:.3;transform:rotate(180deg)}
.fn-c .fn-mission mark{color:#1c1c1c;background:linear-gradient(transparent 62%,rgba(247,191,210,.9) 62%)}
.fn-acc.pill{max-width:none;text-align:center}
.fn-acc.pill .fn-acc-btn{width:auto;margin:0 auto;padding:12px 14px 12px 26px;border-radius:999px;background:#fff;
  box-shadow:inset 0 0 0 1.5px rgba(232,32,143,.4),0 16px 36px -22px rgba(232,32,143,.8)}
.fn-acc.pill .fn-intro{max-width:42rem;margin:30px auto 0!important;text-align:center}
/* flex-wrap rather than grid so the odd seventh card centres on its row */
.fn-list.cards{display:flex;flex-wrap:wrap;justify-content:center;gap:16px;margin-top:30px;text-align:left}
.fn-list.cards li{width:100%}
@media (min-width:700px){.fn-list.cards li{width:calc(50% - 8px)}}
@media (min-width:1024px){.fn-list.cards li{width:calc(25% - 12px)}}
.fn-list.cards li{flex-direction:column;gap:8px;padding:22px 20px;border-radius:20px;background:#fff;box-shadow:inset 0 0 0 1px rgba(28,28,28,.07),0 24px 44px -32px rgba(232,32,143,.55)}
.fn-list.cards .n{font:800 34px/1 Montserrat,sans-serif;background:linear-gradient(150deg,#e8208f,#00b9c6);-webkit-background-clip:text;background-clip:text;color:transparent}
.fn-c .fn-in{max-width:72rem}
.fn-c .fn-mission,.fn-c .fn-acc{max-width:42rem}
.fn-c .fn-acc[data-open]{max-width:72rem}

/* D — candlelight */
.fn-d{padding:calc(clamp(40px,6vw,90px) + clamp(64px,8vw,110px)) 0 calc(clamp(40px,6vw,90px) + clamp(64px,8vw,110px));color:#fff;
  background:radial-gradient(45% 55% at 18% 40%,rgba(232,32,143,.2),transparent 70%),radial-gradient(45% 55% at 85% 70%,rgba(0,185,198,.16),transparent 70%),#151515}
.fn-cross{position:absolute;left:50%;top:clamp(40px,6vw,90px);z-index:1;width:min(300px,50vw);height:min(420px,70vw);transform:translateX(-50%);pointer-events:none;opacity:.55}
.fn-cross::before,.fn-cross::after{content:"";position:absolute;background:linear-gradient(var(--dir),transparent,rgba(255,255,255,.55) 50%,transparent);filter:drop-shadow(0 0 8px rgba(240,86,159,.8))}
.fn-cross::before{--dir:180deg;left:50%;top:0;bottom:0;width:1px}
.fn-cross::after{--dir:90deg;top:30%;left:0;right:0;height:1px}
.fn-d .fn-h{color:#fff}
.fn-d .fn-mission{font:500 clamp(19px,1.9vw,25px)/1.5 'Cormorant Garamond',serif;color:rgba(255,255,255,.86)}
.fn-d .fn-mission mark{font-weight:600;color:#f0569f}
.fn-acc.dark{border-radius:24px;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12),0 30px 70px -40px rgba(232,32,143,.6)}
.fn-acc.dark .fn-acc-btn{color:#fff}
.fn-d .fn-intro{color:rgba(255,255,255,.75)}
.fn-list.line{position:relative;margin-left:8px;padding-left:28px}
.fn-list.line::before{content:"";position:absolute;left:6px;top:14px;bottom:14px;width:1px;background:linear-gradient(#e8208f,#00b9c6)}
.fn-list.line li{position:relative;color:rgba(255,255,255,.88)}
.fn-list.line li::before{content:"";position:absolute;left:-26px;top:20px;width:9px;height:9px;border-radius:50%;background:#f0569f;box-shadow:0 0 0 4px rgba(240,86,159,.18),0 0 12px rgba(240,86,159,.9)}
.fn-list.line li:nth-child(n+4)::before{background:#7cc9d0;box-shadow:0 0 0 4px rgba(0,185,198,.18),0 0 12px rgba(0,185,198,.9)}
.fn-d .fn-list .n{color:#f0569f}

@media (prefers-reduced-motion:reduce){.fn-region,.fn-chev,.fn-list li{transition:none}.fn-list li{opacity:1;transform:none}}`;

const ACC_JS = `<script>
(function(){document.querySelectorAll('[data-acc]').forEach(function(a){var b=a.querySelector('.fn-acc-btn'),r=a.querySelector('.fn-region');
b.addEventListener('click',function(){var open=!a.hasAttribute('data-open');a.toggleAttribute('data-open',open);b.setAttribute('aria-expanded',String(open));
if(open)r.removeAttribute('inert');else r.setAttribute('inert','');});});
addEventListener('load',function(){var s=document.getElementById('faith');if(s&&location.hash==='#faith')scrollTo(0,s.getBoundingClientRect().top+scrollY-30);});})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `fn-${k}.html`), home
    .replace(FAITH, o.html)
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
    .replace('</body>', `${ACC_JS}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" data-toggle="${k}">Open / close the full statement</button> · <a href="/fn-${k}.html#faith" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe data-k="${k}" src="/fn-${k}.html#faith" title="${esc(o.label)}" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe data-k="${k}" src="/fn-${k}.html#faith" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Statement of Faith options — ${esc(site.brand.name)}</title>
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
  <h1>Statement of Faith — reimagined</h1>
  <p class="lead">Your client’s structure — a script “What We Believe”, the heading, the mission statement, and one control
     that opens the full statement — in four treatments of this site’s own design. Each preview is the real homepage at the
     section. Use <strong>Open / close the full statement</strong> to see the dropdown in both frames, or click it inside a
     preview.</p>
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

fs.writeFileSync(path.join(dist, 'faith-new-options.html'), page);
console.log('built dist/faith-new-options.html + ' + Object.keys(OPTIONS).length + ' frames');

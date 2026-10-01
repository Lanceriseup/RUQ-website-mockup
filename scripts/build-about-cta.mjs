// Builds /about-cta-options.html — the about page's closing CTA redesigned
// around the client's "Join us at Freedom" mockup: a script line, the
// heading, one sentence, Register for Freedom and Explore Courses.
//
// Copy is content.json about.closingCta, word for word. Register goes to the
// event (site.nextEvent.ctaUrl); Explore Courses is a placeholder until the
// link is supplied. Each option is the real about page with #closing-about
// swapped. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const about = fs.readFileSync(path.join(dist, 'about.html'), 'utf8');
const RE = /<section id="closing-about"[\s\S]*?<\/section>/;
if (!RE.test(about)) throw new Error('build-about-cta: #closing-about not found');

const k = content.about.closingCta;
const ev = site.nextEvent;
const [first] = ev.upcoming;
const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const buttons = (cls = '') => `
  <div class="ac-btns ${cls}">
    <a class="ac-b1" href="${esc(ev.ctaUrl)}" rel="noopener">${esc(k.primary)}${ARROW}</a>
    <a class="ac-b2" href="${esc(k.secondaryUrl)}">${esc(k.secondary)}</a>
  </div>`;
const words = (cls = '') => `
  <p class="ac-script ${cls}">${esc(k.script)}</p>
  <h2 class="ac-h ${cls}">${esc(k.heading)}</h2>
  <p class="ac-p ${cls}">${esc(k.body)}</p>`;
const when = `<p class="ac-when"><span>Next Freedom</span> ${esc(first.dates)} · ${esc(first.location)}</p>`;

const OPTIONS = {
  invite: {
    label: 'D1 — The invitation',
    note: 'A floating frosted card like an invitation, with the Freedom logo itself in place of a plain heading word — the script, “Join us at Freedom”, the sentence and both buttons — and the brand brush strokes mirrored behind it as on the homepage Freedom section. A gold-to-pink edge glows slowly round the card.',
    pick: true,
    html: `
<section id="closing-about" class="ac ac-a">
  <img class="ac-s1" src="/assets/brand/stroke-hook-lightpink.svg" alt="" aria-hidden="true">
  <img class="ac-s2" src="/assets/brand/stroke-hook-teal.svg" alt="" aria-hidden="true">
  <div class="ac-card">
    <p class="ac-script">${esc(k.script)}</p>
    <h2 class="ac-h"><span class="sr-only">${esc(k.heading)}</span><span aria-hidden="true" class="ac-join">Join us at</span>
      <img class="ac-logo" src="/assets/brand/freedom-logo.png" alt="" aria-hidden="true" width="1500" height="640"></h2>
    <p class="ac-p">${esc(k.body)}</p>
    ${buttons()}
    ${when}
  </div>
</section>`,
  },
  dark: {
    label: 'D2 — Night panel',
    note: 'The dark event panel from the rest of the site, stacked and centred for this copy: the faint crowd photograph, the script in soft pink, the heading in white with “Freedom” in the brand gradient, the pink button beside a glowing white outline one, and the next date beneath. Matches the homepage CTAs.',
    html: `
<section id="closing-about" class="ac ac-b">
  <div class="ac-panel">
    <img class="ac-bg" src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true">
    <div class="ac-in">
      <p class="ac-script">${esc(k.script)}</p>
      <h2 class="ac-h">Join us at <span class="sheen">Freedom</span></h2>
      <p class="ac-p">${esc(k.body)}</p>
      ${buttons('on-dark')}
      ${when}
    </div>
  </div>
</section>`,
  },
  sunrise: {
    label: 'D3 — Sunrise',
    note: 'Built on “Leave renewed”: a wide band like first light — blush and soft gold rising from the bottom, with fine rays of light slowly turning behind the heading. Light, open, hopeful; the most emotional of the four, and nothing else on the site looks like it.',
    html: `
<section id="closing-about" class="ac ac-c">
  <span class="ac-rays" aria-hidden="true"></span>
  <span class="ac-sun" aria-hidden="true"></span>
  <div class="ac-in">${words()}${buttons()}${when}</div>
</section>`,
  },
  frame: {
    label: 'D4 — Moment frame',
    note: 'A two-column card: on the left the cheering photograph from the journey in an arched frame with a gold ring, and on the right the script, heading, sentence and buttons. It lands the page on a real woman at Freedom — the “after” the whole page has been describing.',
    html: `
<section id="closing-about" class="ac ac-d">
  <div class="ac-split">
    <figure class="ac-arch"><span aria-hidden="true"></span><img src="/assets/photos/journey-cheer.jpg" alt="A woman cheering at a Rise Up Queens event" loading="lazy"></figure>
    <div class="ac-copy">${words()}${buttons('left')}${when}</div>
  </div>
</section>`,
  },
};

const CSS = `
.ac{position:relative;overflow:hidden;text-align:center;color:#1c1c1c;padding:clamp(56px,7vw,104px) 16px}
.ac *{box-sizing:border-box}.ac p{margin:0}
.ac-in{position:relative;z-index:2;max-width:44rem;margin:0 auto}
.ac-script{font:400 clamp(44px,5vw,70px)/1 'Julietta Messie',cursive;color:#e8208f}
.ac-h{margin:6px 0 0;font:800 clamp(28px,3.6vw,46px)/1.1 Montserrat,sans-serif;text-transform:uppercase;letter-spacing:-.005em}
.ac-p{max-width:36rem;margin:18px auto 0!important;font:400 clamp(16px,1.35vw,18.5px)/1.7 Lato,sans-serif;color:#3a3a3a}
.ac-btns{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin-top:30px}
.ac-btns.left{justify-content:flex-start}
.ac-b1,.ac-b2{display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 28px;border-radius:999px;font:700 13px/1 Lato,sans-serif;letter-spacing:.16em;text-transform:uppercase;text-decoration:none;transition:background .2s,transform .2s,box-shadow .2s}
.ac-b1{background:#e8208f;color:#fff;box-shadow:0 16px 36px -16px rgba(232,32,143,.9)}
.ac-b1:hover{background:#b81870;transform:translateY(-1px)}
.ac-b1 svg{transition:transform .2s}.ac-b1:hover svg{transform:translateX(4px)}
.ac-b2{color:#00838d;background:rgba(255,255,255,.7);box-shadow:inset 0 0 0 1.5px rgba(0,185,198,.65)}
.ac-b2:hover{background:#fff;box-shadow:inset 0 0 0 1.5px #00b9c6,0 12px 30px -14px rgba(0,185,198,.8)}
.ac-when{margin-top:22px!important;font:700 11px/1.4 Lato,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#6b6b6b}
.ac-when span{color:#dc1e88;margin-right:6px}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

/* D1 — invitation */
.ac-a .ac-s1,.ac-a .ac-s2{position:absolute;width:clamp(240px,30vw,460px);pointer-events:none}
.ac-a .ac-s1{top:2%;right:-4%;opacity:.8}.ac-a .ac-s2{bottom:2%;left:-4%;opacity:.3;transform:rotate(180deg)}
.ac-card{position:relative;z-index:2;max-width:52rem;margin:0 auto;padding:clamp(36px,5vw,60px) clamp(22px,5vw,64px);border-radius:32px;
  background:rgba(255,255,255,.82);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 40px 80px -40px rgba(232,32,143,.45)}
.ac-card::before{content:"";position:absolute;inset:0;padding:1.5px;border-radius:inherit;background:linear-gradient(120deg,#B7873E,#e8208f,#00b9c6,#B7873E);background-size:300% 100%;
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);animation:ac-edge 8s linear infinite}
@keyframes ac-edge{to{background-position:300% 0}}
.ac-a .ac-h{display:flex;flex-direction:column;align-items:center;gap:2px}
.ac-join{font:800 clamp(18px,2vw,24px)/1 Montserrat,sans-serif;letter-spacing:.24em;padding-left:.24em}
.ac-logo{display:block;width:clamp(240px,30vw,380px);height:auto}

/* the script on one line inside the cards */
.ac-a .ac-script,.ac-d .ac-script{white-space:nowrap;font-size:clamp(34px,3.8vw,56px)}
@media (max-width:479px){.ac-a .ac-script,.ac-d .ac-script{white-space:normal}}

/* D2 — night panel */
.ac-b{padding:clamp(40px,5vw,72px) 12px}
.ac-panel{position:relative;overflow:hidden;max-width:76rem;margin:0 auto;padding:clamp(56px,7vw,96px) 20px;border-radius:2.5rem;background:#1c1c1c;
  box-shadow:0 0 70px -10px rgba(232,32,143,.45),0 40px 80px -40px rgba(0,0,0,.7)}
.ac-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.3}
.ac-panel::after{content:"";position:absolute;inset:0;background:radial-gradient(70% 80% at 50% 50%,rgba(28,28,28,.4),rgba(28,28,28,.94))}
.ac-b .ac-script{color:#f7a8cc}.ac-b .ac-h{color:#fff}.ac-b .ac-p{color:rgba(255,255,255,.8)}
.ac-btns.on-dark .ac-b2{color:#fff;background:transparent;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.7),0 0 24px -6px rgba(0,185,198,.7)}
.ac-btns.on-dark .ac-b2:hover{background:rgba(255,255,255,.1)}
.ac-b .ac-when{color:rgba(255,255,255,.6)}.ac-b .ac-when span{color:#f7a8cc}

/* D3 — sunrise */
.ac-c{-webkit-mask-image:linear-gradient(transparent,#000 14%,#000 80%,transparent);mask-image:linear-gradient(transparent,#000 14%,#000 80%,transparent);padding:clamp(88px,10vw,150px) 16px clamp(120px,13vw,190px);background:linear-gradient(180deg,transparent 0%,rgba(253,236,243,.8) 40%,#fbe0d8 78%,#f8dcc0 100%)}
.ac-sun{position:absolute;left:50%;bottom:-38%;width:min(1100px,140vw);aspect-ratio:1;transform:translateX(-50%);border-radius:50%;
  background:radial-gradient(circle,rgba(255,236,200,.95) 0%,rgba(250,205,170,.6) 30%,rgba(240,86,159,.18) 55%,transparent 70%);pointer-events:none}
.ac-rays{position:absolute;left:50%;bottom:-40%;width:min(1600px,200vw);aspect-ratio:1;transform:translateX(-50%);pointer-events:none;opacity:.9;
  background:repeating-conic-gradient(from 0deg,rgba(255,206,160,.55) 0deg 1.6deg,transparent 1.6deg 10deg);
  -webkit-mask-image:radial-gradient(circle,#000 10%,transparent 60%);mask-image:radial-gradient(circle,#000 10%,transparent 60%);animation:ac-turn 90s linear infinite}
@keyframes ac-turn{to{rotate:360deg}}

/* D4 — moment frame */
.ac-split{position:relative;z-index:2;max-width:64rem;margin:0 auto;display:grid;gap:36px;align-items:center;padding:clamp(28px,4vw,48px);border-radius:32px;background:rgba(255,255,255,.85);
  box-shadow:inset 0 0 0 1px rgba(232,32,143,.18),0 40px 80px -46px rgba(232,32,143,.55)}
@media (min-width:860px){.ac-split{grid-template-columns:.8fr 1fr;gap:56px;text-align:left}.ac-d .ac-p{margin-left:0!important}}
@media (max-width:859px){.ac-btns.left{justify-content:center}}
.ac-arch{position:relative;margin:0 auto;width:min(320px,100%)}
.ac-arch img{position:relative;display:block;width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:999px 999px 24px 24px}
.ac-arch span{position:absolute;inset:-10px;border:1.5px solid #B7873E;border-radius:999px 999px 30px 30px;opacity:.7}

@media (prefers-reduced-motion:reduce){.ac *{animation:none!important}}`;

for (const [key, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `ac-${key}.html`), about.replace(RE, o.html)
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
    .replace('</body>', `<script>addEventListener('load',function(){var s=document.getElementById('closing-about');if(s)scrollTo(0,s.getBoundingClientRect().top+scrollY-120);});</script></body>`));
}

const card = (key, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/ac-${key}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="860"><iframe src="/ac-${key}.html" title="${esc(o.label)}" loading="lazy" width="1440" height="860"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/ac-${key}.html" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About CTA options — ${esc(site.brand.name)}</title>
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
  <h1>About page — “Join us at Freedom”</h1>
  <p class="lead">Four designs for the about page’s closing CTA, using your client’s copy word for word. Register goes to the
     event page; Explore Courses is a placeholder until you send the link. I added one small line under the buttons with
     the next Freedom date — say if you would rather leave it off.</p>
  ${Object.entries(OPTIONS).map(([k2, o]) => card(k2, o)).join('')}
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

fs.writeFileSync(path.join(dist, 'about-cta-options.html'), page);
console.log('built dist/about-cta-options.html + ' + Object.keys(OPTIONS).length + ' frames');

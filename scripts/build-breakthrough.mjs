// Builds /breakthrough-options.html — the "It's time for your breakthrough"
// section rebuilt as an event CTA: the dates and the hero's Register button
// instead of the inert info form.
//
// Each option is the real homepage with that section swapped, so the faith
// section below and the spread above are what ships. Must run after
// scripts/build.mjs.
//
// The closing section at the foot of the page is already a dark ticket with
// the dates, so none of these repeat that shape.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// The shipped CTA section: from its opening tag to the first </section>.
// Located by id since the shipped section was rebuilt as option E.
const OPEN = '<section id="breakthrough"';
const at = home.indexOf(OPEN);
if (at < 0) throw new Error('build-breakthrough: CTA section not found in dist/index.html');
const end = home.indexOf('</section>', at) + '</section>'.length;

const ev = site.nextEvent;
const [first, second] = ev.upcoming;
const LABELS = ['Next event', 'Also coming'];

// "It’s time for your breakthrough" with the last word in the brand sheen.
const heading = (() => {
  const h = esc(content.home.cta.heading);
  const i = h.lastIndexOf(' ');
  return `${h.slice(0, i)} <span class="sheen">${h.slice(i + 1)}</span>`;
})();

// "October 15–17, 2026" → month / days / year
const split = (d) => {
  const m = d.match(/^(\S+)\s+([\d–-]+),\s*(\d{4})$/);
  return m ? { month: m[1], days: m[2], year: m[3] } : { month: d, days: '', year: '' };
};

const PIN = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const ARROW = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

// The hero's button, exactly. `tone` only changes it for the gradient band.
const button = (tone = '') => `<a href="${esc(ev.ctaUrl)}" rel="noopener" class="bk-btn ${tone}">${esc(ev.ctaText)}${ARROW}</a>`;

// Labelled dates, as in the hero, recoloured for a light ground.
const dates = (cls = '') => `
  <div class="bk-dates ${cls}">
    ${[first, second].map((e, i) => `
    <div class="bk-di">
      <p class="bk-lb ${i ? 'c' : 'm'}">${LABELS[i]}</p>
      <p class="bk-dt">${esc(e.dates)}</p>
      <p class="bk-lc">${PIN}${esc(e.location)}</p>
    </div>${i ? '' : '<span class="bk-rule" aria-hidden="true"></span>'}`).join('')}
  </div>`;

const OPTIONS = {
  countdown: {
    label: 'A — Countdown',
    note: 'A live countdown to the next event — days, hours, minutes, seconds in big gradient numerals, ticking — then both dates and the Register button. Urgency without saying “hurry”. Stops itself once the event starts.',
    pick: true,
    html: `
<section class="bk bk-a">
  <div class="bk-in">
    <h2 class="bk-h">${heading}</h2>
    <p class="bk-k">Doors open in</p>
    <div class="bk-cd" data-bk-cd="${esc(first.startsAt)}" role="timer" aria-label="Time until ${esc(first.dates)}">
      ${['Days', 'Hours', 'Minutes', 'Seconds'].map(u => `<div class="bk-u"><span class="n" data-u="${u.toLowerCase()}">00</span><span class="l">${u}</span></div>`).join('')}
    </div>
    ${dates()}
    ${button()}
  </div>
</section>`,
  },
  band: {
    label: 'B — Brand band',
    note: 'A full-width band in the brand’s pink-to-teal gradient with a slow light drifting across it. White heading and dates, and the button turned white so it pops off the colour. The boldest, and nothing else on the page looks like it.',
    html: `
<section class="bk bk-b">
  <span class="bk-b-light" aria-hidden="true"></span>
  <div class="bk-in">
    <h2 class="bk-h">${esc(content.home.cta.heading)}</h2>
    ${dates('on-color')}
    ${button('white')}
  </div>
</section>`,
  },
  cards: {
    label: 'C — Two tickets',
    note: 'Each event gets its own calendar card — month in brand colour, the days large, year and city underneath, and a Register button inside. The next event is lifted with a gradient edge; the later one sits back with an outline button.',
    html: `
<section class="bk bk-c">
  <div class="bk-in">
    <h2 class="bk-h">${heading}</h2>
    <div class="bk-cards">
      ${[first, second].map((e, i) => { const s = split(e.dates); return `
      <article class="bk-card ${i ? '' : 'on'}">
        <p class="bk-lb ${i ? 'c' : 'm'}">${LABELS[i]}</p>
        <p class="mo">${esc(s.month)}</p>
        <p class="dy">${esc(s.days)}</p>
        <p class="bk-lc">${esc(s.year)} · ${esc(e.location)}</p>
        <a href="${esc(ev.ctaUrl)}" rel="noopener" class="bk-btn ${i ? 'outline' : ''}">${esc(ev.ctaText)}${ARROW}</a>
      </article>`; }).join('')}
    </div>
  </div>
</section>`,
  },
  split: {
    label: 'D — Photo split',
    note: 'Magazine layout matching the spread above: a full-room photograph on a brand plate on the left, and on the right the heading, both dates stacked with their labels, and the button.',
    html: `
<section class="bk bk-d">
  <div class="bk-grid">
    <div class="bk-photo"><span aria-hidden="true"></span><img src="/assets/photos/queens-waving.jpg" alt="The full room of women at a Rise Up Queens event" loading="lazy" decoding="async"></div>
    <div class="bk-copy">
      <h2 class="bk-h">${heading}</h2>
      ${dates('stack')}
      ${button()}
    </div>
  </div>
</section>`,
  },
  spotlight: {
    label: 'E — Spotlight',
    note: 'The hero in miniature: a dark rounded panel with the event photograph faint behind it, the heading’s last word in the hero gradient, the hero’s own labelled dates and button. The most direct echo of the top of the page.',
    html: `
<section class="bk bk-e">
  <div class="bk-panel">
    <img src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" loading="lazy" decoding="async">
    <div class="bk-in">
      <h2 class="bk-h">${heading}</h2>
      ${dates('on-dark')}
      ${button()}
    </div>
  </div>
</section>`,
  },
};

const CSS = `
.bk{position:relative;overflow:hidden;text-align:center}
.bk *{box-sizing:border-box}
.bk p{margin:0}
.bk-in{position:relative;z-index:1;max-width:60rem;margin:0 auto;padding:0 24px;display:flex;flex-direction:column;align-items:center}
.bk-h{margin:0;font:700 clamp(28px,4vw,46px)/1.15 Montserrat,sans-serif;color:#1c1c1c;letter-spacing:-.01em}

/* the hero's Register button */
.bk-btn{display:inline-flex;align-items:center;gap:12px;min-height:44px;margin-top:32px;padding:16px 36px;border-radius:999px;background:#e8208f;color:#fff;
  font:700 14px/1 Lato,sans-serif;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;box-shadow:0 16px 36px -16px rgba(232,32,143,.9);transition:background .2s,transform .2s}
.bk-btn:hover{background:#b81870}
.bk-btn svg{transition:transform .2s}.bk-btn:hover svg{transform:translateX(4px)}
.bk-btn.white{background:#fff;color:#dc1e88;box-shadow:0 18px 40px -18px rgba(0,0,0,.45)}
.bk-btn.white:hover{background:#fff;transform:translateY(-1px)}
.bk-btn.outline{background:transparent;color:#dc1e88;box-shadow:inset 0 0 0 1.5px rgba(232,32,143,.55)}
.bk-btn.outline:hover{background:rgba(232,32,143,.06)}

/* labelled dates (hero option B, light ground) */
.bk-dates{display:flex;align-items:stretch;gap:18px;margin-top:28px}
.bk-rule{width:1px;background:rgba(28,28,28,.15)}
.bk-lb{font:800 10px/1.4 Montserrat,sans-serif;letter-spacing:.18em;text-transform:uppercase}
.bk-lb.m{color:#dc1e88}.bk-lb.c{color:#00838d}
.bk-dt{margin-top:6px!important;font:700 16px/1.35 Montserrat,sans-serif;color:#1c1c1c}
.bk-lc{display:flex;align-items:center;justify-content:center;gap:5px;margin-top:4px!important;font:700 11px/1.4 Lato,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a}
@media (min-width:640px){.bk-dates{gap:40px}.bk-lb{font-size:11px}.bk-dt{font-size:20px}.bk-lc{font-size:12px}}
.bk-dates.on-color .bk-rule,.bk-dates.on-dark .bk-rule{background:rgba(255,255,255,.3)}
.bk-dates.on-color .bk-lb,.bk-dates.on-color .bk-dt{color:#fff}.bk-dates.on-color .bk-lc{color:rgba(255,255,255,.85)}
.bk-dates.on-dark .bk-lb.m{color:#f0569f}.bk-dates.on-dark .bk-lb.c{color:#00b9c6}.bk-dates.on-dark .bk-dt{color:#fff}.bk-dates.on-dark .bk-lc{color:rgba(255,255,255,.7)}
.bk-dates.stack{flex-direction:column;align-items:flex-start;gap:16px;text-align:left}
.bk-dates.stack .bk-rule{display:none}.bk-dates.stack .bk-lc{justify-content:flex-start}
.bk-dates.stack .bk-di{padding-left:16px;border-left:2px solid rgba(232,32,143,.5)}
.bk-dates.stack .bk-di+.bk-di{border-left-color:rgba(0,185,198,.55)}

/* A — countdown */
.bk-a{padding:clamp(56px,8vw,104px) 0;background:radial-gradient(60% 80% at 50% 0%,#fdeef4,#fff 70%)}
.bk-k{margin-top:22px!important;font:700 11px/1.4 Lato,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:#6b6b6b}
.bk-cd{display:flex;gap:clamp(8px,1.6vw,18px);margin-top:14px}
.bk-u{display:flex;flex-direction:column;align-items:center;min-width:clamp(70px,10vw,112px);padding:clamp(12px,1.6vw,20px) 6px;border-radius:18px;background:#fff;
  box-shadow:inset 0 0 0 1px rgba(232,32,143,.16),0 20px 40px -26px rgba(232,32,143,.55)}
.bk-u .n{font:800 clamp(30px,4.6vw,58px)/1 Montserrat,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:-.02em;
  background:linear-gradient(160deg,#e8208f,#f0569f 45%,#00b9c6);-webkit-background-clip:text;background-clip:text;color:transparent}
.bk-u .l{margin-top:8px;font:700 10px/1 Lato,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#6b6b6b}

/* B — brand band */
.bk-b{padding:clamp(56px,8vw,100px) 0;background:linear-gradient(110deg,#e8208f 0%,#f0569f 40%,#7a7bc0 70%,#00b9c6 100%)}
.bk-b .bk-h{color:#fff}
.bk-b-light{position:absolute;inset:-40% -10%;background:radial-gradient(40% 60% at 50% 50%,rgba(255,255,255,.28),transparent 70%);animation:bk-drift 12s ease-in-out infinite alternate}
@keyframes bk-drift{from{transform:translateX(-30%)}to{transform:translateX(30%)}}

/* C — two tickets */
.bk-c{padding:clamp(56px,8vw,104px) 0;background:linear-gradient(180deg,#fff,#fdf6f1)}
.bk-cards{display:grid;gap:18px;width:100%;max-width:44rem;margin-top:32px}
@media (min-width:640px){.bk-cards{grid-template-columns:1fr 1fr;gap:24px}}
.bk-card{display:flex;flex-direction:column;align-items:center;padding:28px 22px 26px;border-radius:24px;background:#fff;box-shadow:inset 0 0 0 1px rgba(28,28,28,.1),0 24px 50px -36px rgba(0,0,0,.35)}
.bk-card.on{background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#e8208f,#00b9c6) border-box;border:2px solid transparent;box-shadow:0 30px 60px -30px rgba(232,32,143,.55)}
.bk-card .mo{margin-top:12px!important;font:800 13px Montserrat,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#dc1e88}
.bk-card:not(.on) .mo{color:#00838d}
.bk-card .dy{font:800 clamp(44px,6vw,64px)/1.05 Montserrat,sans-serif;letter-spacing:-.02em;color:#1c1c1c}
.bk-card .bk-btn{margin-top:20px;padding:14px 26px;font-size:13px}

/* D — photo split */
.bk-d{padding:clamp(56px,8vw,104px) 24px;background:#fff}
.bk-grid{max-width:68rem;margin:0 auto;display:grid;gap:40px;align-items:center}
.bk-copy{display:flex;flex-direction:column;align-items:center}
@media (min-width:900px){.bk-grid{grid-template-columns:1fr 1fr;gap:64px;text-align:left}.bk-copy{align-items:flex-start}}
.bk-photo{position:relative}
.bk-photo span{position:absolute;right:-16px;bottom:-16px;width:100%;height:100%;border-radius:28px;background:linear-gradient(135deg,#e8208f,#00b9c6);opacity:.16}
.bk-photo img{position:relative;display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:28px;box-shadow:0 30px 60px -30px rgba(28,28,28,.45)}
@media (max-width:899px){.bk-dates.stack{align-items:center;text-align:center}.bk-dates.stack .bk-lc{justify-content:center}.bk-dates.stack .bk-di{border-left:0;padding-left:0}}

/* E — spotlight */
.bk-e{padding:clamp(40px,6vw,80px) 16px;background:#fff}
.bk-panel{position:relative;overflow:hidden;max-width:68rem;margin:0 auto;padding:clamp(56px,7vw,96px) 0;border-radius:2.5rem;background:#1c1c1c;
  box-shadow:0 0 90px -30px rgba(0,185,198,.45),0 40px 80px -40px rgba(0,0,0,.7)}
.bk-panel img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.28}
.bk-panel::after{content:"";position:absolute;inset:0;background:radial-gradient(70% 80% at 50% 50%,rgba(28,28,28,.35),rgba(28,28,28,.92))}
.bk-e .bk-h{color:#fff}
@media (max-width:420px){.bk-e{padding-left:10px;padding-right:10px}.bk-e .bk-in{padding:0 12px}.bk-e .bk-dates{gap:12px}.bk-e .bk-dt{font-size:15px}}

@media (prefers-reduced-motion:reduce){.bk-b-light{animation:none}}`;

// Countdown for option A — writes text once a second and stops at zero.
const COUNTDOWN = `<script>
(function(){var r=document.querySelector('[data-bk-cd]');if(!r)return;var t=Date.parse(r.dataset.bkCd);if(isNaN(t))return;
function p(n){return n<10?'0'+n:String(n)}var q=function(u){return r.querySelector('[data-u="'+u+'"]')};
function tick(){var s=Math.max(0,Math.floor((t-Date.now())/1000));
q('days').textContent=p(Math.floor(s/86400));q('hours').textContent=p(Math.floor(s%86400/3600));
q('minutes').textContent=p(Math.floor(s%3600/60));q('seconds').textContent=p(s%60);if(!s)clearInterval(id);}
var id=setInterval(tick,1000);tick();})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `bk-${k}.html`),
    (home.slice(0, at) + `<div id="breakthrough">${o.html}</div>` + home.slice(end))
      .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
      .replace('</body>', `${COUNTDOWN}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/bk-${k}.html#breakthrough" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="760"><iframe src="/bk-${k}.html#breakthrough" title="${esc(o.label)}" loading="lazy" width="1440" height="760"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="760"><iframe src="/bk-${k}.html#breakthrough" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="760"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Breakthrough CTA options — ${esc(site.brand.name)}</title>
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
  <h1>“It’s time for your breakthrough” — as an event CTA</h1>
  <p class="lead">The info form is replaced by the dates and the hero’s Register button. Each preview is the real homepage
     with this section swapped, opened at the section. The mission statement has already moved into the Statement of Faith
     just below — scroll down inside a preview to see it there.</p>
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

fs.writeFileSync(path.join(dist, 'breakthrough-options.html'), page);
console.log('built dist/breakthrough-options.html + ' + Object.keys(OPTIONS).length + ' frames');

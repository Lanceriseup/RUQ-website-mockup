// Builds /about-cta2-options.html — compact variants of /about-cta-options.html
// D2 ("Night panel"), which read as too big. Same dark panel, faint crowd
// photograph, pink script, gradient "Freedom" and the two buttons; each one
// spends less height a different way.
//
// Copy is content.json about.closingCta. Must run after scripts/build.mjs.
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
if (!RE.test(about)) throw new Error('build-about-cta2: #closing-about not found');

const k = content.about.closingCta;
const ev = site.nextEvent;
const [first] = ev.upcoming;
const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const btns = (cls = '') => `<div class="c2-btns ${cls}"><a class="c2-b1" href="${esc(ev.ctaUrl)}" rel="noopener">${esc(k.primary)}${ARROW}</a><a class="c2-b2" href="${esc(k.secondaryUrl)}">${esc(k.secondary)}</a></div>`;
const script = `<p class="c2-script">${esc(k.script)}</p>`;
const h2 = `<h2 class="c2-h">Join us at <span class="sheen">Freedom</span></h2>`;
const body = `<p class="c2-p">${esc(k.body)}</p>`;
const when = `<p class="c2-when"><span>Next Freedom</span> ${esc(first.dates)} · ${esc(first.location)}</p>`;
const panel = (cls, inner) => `
<section id="closing-about" class="c2 ${cls}">
  <div class="c2-panel"><img class="c2-bg" src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" loading="lazy"><div class="c2-in">${inner}</div></div>
</section>`;

const OPTIONS = {
  row: {
    label: 'E1 — One row',
    note: 'The whole CTA in a single row across a wide, low panel: script and heading on the left, the sentence in the middle behind a fine line, the two buttons on the right. Around 190px tall on desktop — a third of D2.',
    pick: true,
    html: panel('c2-row', `<div class="c2-head">${script}${h2}</div><div class="c2-mid">${body}</div>${btns('stack')}`),
  },
  compact: {
    label: 'E2 — Compact centred',
    note: 'D2’s centred layout kept, but tightened throughout: a narrower panel, smaller type, less padding, the buttons and date on one line. Reads the same, at about 60% of the height.',
    html: panel('c2-compact', `${script}${h2}${body}<div class="c2-foot">${btns()}${when}</div>`),
  },
  split: {
    label: 'E3 — Split',
    note: 'Two halves: the script and a larger heading on the left, the sentence, buttons and date on the right, divided by a soft pink glow. Wide and low, with the heading given more presence than in E1.',
    html: panel('c2-split', `<div class="c2-l">${script}${h2}</div><span class="c2-div" aria-hidden="true"></span><div class="c2-r">${body}${btns('left')}${when}</div>`),
  },
  strip: {
    label: 'E4 — Slim strip',
    note: 'The smallest: a rounded strip about 120px tall — the script and heading together on one line, the sentence beneath in small type, and both buttons at the end. Closer to a banner than a section.',
    html: panel('c2-strip', `<div class="c2-head">${`<p class="c2-line"><span class="c2-script">${esc(k.script)}</span> ${h2.replace('h2 class="c2-h"', 'span class="c2-h"').replace('</h2>', '</span>')}</p>`}${body}</div>${btns()}`),
  },
};

const CSS = `
.c2{position:relative;padding:clamp(40px,5vw,72px) 12px}
.c2 *{box-sizing:border-box}.c2 p{margin:0}
.c2-panel{position:relative;overflow:hidden;margin:0 auto;border-radius:2rem;background:#1c1c1c;box-shadow:0 0 60px -12px rgba(232,32,143,.45),0 40px 80px -40px rgba(0,0,0,.7)}
.c2-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.3}
.c2-panel::after{content:"";position:absolute;inset:0;background:radial-gradient(70% 90% at 50% 50%,rgba(28,28,28,.4),rgba(28,28,28,.94))}
.c2-in{position:relative;z-index:2}
.c2-script{font:400 clamp(30px,2.8vw,40px)/1 'Julietta Messie',cursive;color:#f7a8cc}
.c2-h{display:block;margin:2px 0 0;font:800 clamp(22px,2.2vw,30px)/1.1 Montserrat,sans-serif;text-transform:uppercase;color:#fff}
.c2-p{font:400 15px/1.6 Lato,sans-serif;color:rgba(255,255,255,.78)}
.c2-btns{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.c2-btns.stack{flex-direction:column;align-items:stretch}
.c2-btns.left{justify-content:flex-start}
.c2-b1,.c2-b2{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:46px;padding:0 22px;border-radius:999px;font:700 12px/1 Lato,sans-serif;letter-spacing:.15em;text-transform:uppercase;text-decoration:none;white-space:nowrap;transition:background .2s,transform .2s}
.c2-b1{background:#e8208f;color:#fff;box-shadow:0 14px 30px -14px rgba(232,32,143,.9)}
.c2-b1:hover{background:#b81870}
.c2-b2{color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.7),0 0 22px -8px rgba(0,185,198,.8)}
.c2-b2:hover{background:rgba(255,255,255,.1)}
.c2-when{font:700 10.5px/1.4 Lato,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.6)}
.c2-when span{color:#f7a8cc;margin-right:6px}

/* E1 — one row */
.c2-row .c2-panel{max-width:80rem}
.c2-row .c2-in{display:grid;gap:22px;padding:30px 28px;text-align:center}
@media (min-width:1024px){.c2-row .c2-in{grid-template-columns:auto 1fr auto;align-items:center;gap:40px;padding:32px 44px;text-align:left}
  .c2-row .c2-mid{padding-left:40px;border-left:1px solid rgba(255,255,255,.18)}}
@media (max-width:1023px){.c2-btns.stack{flex-direction:row;justify-content:center}}

/* E2 — compact centred */
.c2-compact .c2-panel{max-width:52rem}
.c2-compact .c2-in{padding:40px 24px 32px;text-align:center}
.c2-compact .c2-p{max-width:32rem;margin:12px auto 0}
.c2-foot{margin-top:22px;display:flex;flex-direction:column;align-items:center;gap:14px}

/* E3 — split */
.c2-split .c2-panel{max-width:72rem}
.c2-split .c2-in{display:grid;gap:24px;padding:34px 28px;text-align:center}
@media (min-width:900px){.c2-split .c2-in{grid-template-columns:1fr auto 1.15fr;align-items:center;gap:40px;padding:40px 52px;text-align:left}}
.c2-split .c2-h{font-size:clamp(26px,3vw,40px)}
.c2-split .c2-script{font-size:clamp(34px,3.2vw,46px)}
.c2-div{width:2px;align-self:stretch;border-radius:2px;background:linear-gradient(transparent,#e8208f,transparent);box-shadow:0 0 18px rgba(232,32,143,.8)}
@media (max-width:899px){.c2-div{display:none}.c2-btns.left{justify-content:center}}
.c2-r{display:flex;flex-direction:column;gap:16px}
@media (max-width:899px){.c2-r{align-items:center}}

/* E4 — slim strip */
.c2-strip .c2-panel{max-width:72rem;border-radius:999px}
.c2-strip .c2-in{display:flex;align-items:center;justify-content:space-between;gap:28px;padding:20px 22px 20px 40px}
.c2-line{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap}
.c2-strip .c2-script{font-size:clamp(28px,2.4vw,34px)}
.c2-strip .c2-h{margin:0;font-size:clamp(18px,1.6vw,22px)}
.c2-strip .c2-p{margin-top:4px;font-size:13.5px;max-width:34rem}
@media (max-width:899px){.c2-strip .c2-panel{border-radius:2rem}.c2-strip .c2-in{flex-direction:column;text-align:center;padding:28px 22px}.c2-line{justify-content:center}}`;

for (const [key, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `c2-${key}.html`), about.replace(RE, o.html)
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
    .replace('</body>', `<script>addEventListener('load',function(){var s=document.getElementById('closing-about');if(s)scrollTo(0,s.getBoundingClientRect().top+scrollY-160);});</script></body>`));
}

const card = (key, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><span data-h="${key}">measuring…</span> · <a href="/c2-${key}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="640"><iframe data-k="${key}" src="/c2-${key}.html" title="${esc(o.label)}" loading="lazy" width="1440" height="640"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="760"><iframe src="/c2-${key}.html" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="760"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About CTA — compact — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:840px; margin:10px 0 0; }
.opt { margin-top:52px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:840px; font-size:15px; }
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; color:var(--ink); }
.links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
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
  <h1>“Join us at Freedom” — D2, smaller</h1>
  <p class="lead">Four compact versions of the night panel. Same look and copy; each takes less of the page a different
     way. The panel height at 1440 wide is shown on each — D2 was about 580px.</p>
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
  document.querySelectorAll('iframe[data-k]').forEach(function (f) {
    f.addEventListener('load', function () {
      try { var p = f.contentDocument.querySelector('#closing-about .c2-panel');
        document.querySelector('[data-h="' + f.dataset.k + '"]').textContent = 'Panel ' + Math.round(p.getBoundingClientRect().height) + 'px tall'; } catch (e) {}
    });
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'about-cta2-options.html'), page);
console.log('built dist/about-cta2-options.html + ' + Object.keys(OPTIONS).length + ' frames');

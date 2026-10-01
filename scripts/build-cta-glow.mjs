// Builds /cta-glow-options.html — pink treatments for the light around the
// breakthrough panel, replacing the cyan halo it shipped with.
//
// "The same as the bottom" is the closing ticket: a pink pool of light
// blurred beneath the panel, with a rim glow that fades up and down. These
// take that pink as the starting point. Each option is the real homepage with
// the panel's light swapped. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!home.includes('cta-panel')) throw new Error('build-cta-glow: .cta-panel not found in dist/index.html');

const DROP = '0 40px 80px -40px rgba(0,0,0,.7)';   // the panel's own shadow, kept in every option
// Drop the cyan halo; every option sets its own light. No !important: this
// <style> comes after styles.css, so it wins at equal specificity, and an
// !important box-shadow would also block the pulse option from animating.
const BASE = `#breakthrough{position:relative}.cta-panel{z-index:1;box-shadow:${DROP}}`;

const OPTIONS = {
  now: {
    label: 'Before — cyan halo',
    note: 'For reference: a teal glow all round the panel.',
    // B ships, so the original halo is put back here for comparison.
    css: `.cta-panel{animation:none;box-shadow:0 0 90px -30px rgba(0,185,198,.45),${DROP}}`,
  },
  pool: {
    label: 'A — Pink pool',
    note: 'Exactly the light under the ticket at the bottom of the page: a soft pink glow pooled beneath the panel, as if it were lit from below. Still, and it makes the two CTAs a matching pair.',
    pick: true,
    css: `${BASE}
#breakthrough::before{content:"";position:absolute;left:7%;right:7%;top:35%;bottom:4px;border-radius:2rem;pointer-events:none;
  background:radial-gradient(60% 100% at 50% 100%,rgba(232,32,143,.55),transparent 70%);filter:blur(32px)}`,
  },
  pulse: {
    label: 'B — Pink rim pulse',
    note: 'The bottom ticket’s motion in pink only: a glow all the way round the edge that slowly fades up and down every four seconds. The panel itself never moves.',
    css: `${BASE}
.cta-panel{animation:cg-pulse 4s ease-in-out infinite}
@keyframes cg-pulse{0%,100%{box-shadow:0 0 30px 0 rgba(232,32,143,.18),${DROP}}50%{box-shadow:0 0 60px 8px rgba(232,32,143,.55),${DROP}}}
@media (prefers-reduced-motion:reduce){.cta-panel{animation:none;box-shadow:0 0 40px 2px rgba(232,32,143,.35),${DROP}!important}}`,
  },
  edge: {
    label: 'C — Pink edge',
    note: 'A fine pink line traced around the panel with a gentle pink glow just beneath it. The most refined — it outlines the panel rather than lighting the page around it.',
    css: `${BASE}
.cta-panel{box-shadow:inset 0 0 0 1px rgba(240,86,159,.6),0 0 0 1px rgba(232,32,143,.22),0 26px 60px -26px rgba(232,32,143,.6),${DROP}}`,
  },
  word: {
    label: 'E — Pink pool, pink word',
    note: 'Option A, and “breakthrough” itself goes pink as well — the teal end of its gradient swapped for the lighter brand pink, so there is no blue anywhere in the panel apart from the “Also coming” label.',
    css: `${BASE}
#breakthrough::before{content:"";position:absolute;left:7%;right:7%;top:35%;bottom:4px;border-radius:2rem;pointer-events:none;
  background:radial-gradient(60% 100% at 50% 100%,rgba(232,32,143,.55),transparent 70%);filter:blur(32px)}
#breakthrough .sheen{background-image:linear-gradient(100deg,transparent 35%,rgba(255,255,255,.75) 50%,transparent 65%),linear-gradient(92deg,#e8208f 0%,#f0569f 55%,#ff8cc4 100%)}`,
  },
  inner: {
    label: 'D — Lit from within',
    note: 'No light outside the panel at all. Instead a pink glow rises inside it from the bottom edge, behind the dates and button, like a stage light. Keeps the page around it perfectly clean.',
    css: `${BASE}
.cta-panel::after{content:"";position:absolute;left:12%;right:12%;bottom:-55%;height:100%;z-index:1;pointer-events:none;
  background:radial-gradient(50% 50% at 50% 50%,rgba(232,32,143,.5),transparent 70%);filter:blur(28px)}
.cta-panel>.relative{z-index:2}`,
  },
};

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `cg-${k}.html`), home
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${o.css}</style></head>`)
    .replace('</body>', `<script>addEventListener('load',function(){var b=document.getElementById('breakthrough');if(b)scrollTo(0,b.getBoundingClientRect().top+scrollY-60);});</script></body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : k === 'now' ? ' now' : ''}">${k === 'pulse' ? 'Live' : o.pick ? 'Recommended' : k === 'now' ? 'Before' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/cg-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="420"><iframe src="/cg-${k}.html" title="${esc(o.label)}" loading="lazy" width="1440" height="420"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="560"><iframe src="/cg-${k}.html" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="560"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Breakthrough glow — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:820px; margin:10px 0 0; }
.opt { margin-top:52px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:820px; font-size:15px; }
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; }
.links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.now { background:var(--soft); } .tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
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
  <h1>Breakthrough panel — pink light</h1>
  <p class="lead">The cyan halo around the panel replaced with pink, matching the ticket at the bottom of the page. Each
     preview is the real homepage, scrolled to the panel; open one full page to compare it with the bottom ticket.</p>
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

fs.writeFileSync(path.join(dist, 'cta-glow-options.html'), page);
console.log('built dist/cta-glow-options.html + ' + Object.keys(OPTIONS).length + ' frames');

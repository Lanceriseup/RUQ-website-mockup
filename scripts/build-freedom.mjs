// Builds /freedom-options.html — five treatments for the Freedom section
// between the hero and Common Struggles.
//
// Each option is the real built homepage (dist/index.html) with the section
// injected, so the hero above and the struggles panel below are exactly what
// ships. A–B and D–E open the white panel that lifts over the hero; C is dark,
// so it sits between the hero and that panel instead, and the panel lifts over
// it. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FREEDOM, renderFreedom, FREEDOM_CSS, FREEDOM_JS } from '../src/partials/freedom-variants.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
// The shipped Freedom section is removed first, so each preview shows only
// the treatment being compared.
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
  .replace(/<section id="freedom"[\s\S]*?<\/section>/, '');

// The panel that carries Common Struggles and lifts over the hero.
const PANEL = '<div class="relative z-10 -mt-16 overflow-hidden rounded-t-[2.5rem]';
const at = home.indexOf(PANEL);
if (at < 0) throw new Error('build-freedom: struggles panel not found in dist/index.html');
const panelOpenEnd = home.indexOf('>', at) + 1;

const variant = (k) => {
  const sec = renderFreedom(content, k);
  const html = k === 'c'
    ? home.slice(0, at) + sec + home.slice(at)
    : home.slice(0, panelOpenEnd) + sec + home.slice(panelOpenEnd);
  return html
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${FREEDOM_CSS}</style></head>`)
    .replace('</body>', `${FREEDOM_JS}</body>`);
};

for (const k of Object.keys(FREEDOM)) fs.writeFileSync(path.join(dist, `fr-${k}.html`), variant(k));

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><button type="button" data-replay="${k}">↻ Replay</button> · <a href="/fr-${k}.html#freedom" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe data-k="${k}" src="/fr-${k}.html#freedom" title="${esc(o.label)}" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe data-k="${k}" src="/fr-${k}.html#freedom" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Freedom section options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:820px; margin:10px 0 0; }
.opt { margin-top:64px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:820px; font-size:15px; }
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; }
.links a, .links button { color:var(--magenta); background:none; border:0; padding:0; font:inherit; cursor:pointer; }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 320px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:320px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:26px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Freedom — the section before Common Struggles</h1>
  <p class="lead">Five treatments of the same copy, your Freedom logo and the two brush strokes, each placed in the real
     homepage between the hero and Common Struggles. The previews open scrolled to the section — scroll inside them to see
     what sits above and below. <strong>Replay</strong> re-runs the entrance, which matters most for B.</p>
  ${Object.entries(FREEDOM).map(([k, o]) => card(k, o)).join('')}
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
        f.src = '/fr-' + b.dataset.replay + '.html?r=' + Date.now() + '#freedom';
      });
    });
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'freedom-options.html'), page);
console.log('built dist/freedom-options.html + ' + Object.keys(FREEDOM).length + ' frames');

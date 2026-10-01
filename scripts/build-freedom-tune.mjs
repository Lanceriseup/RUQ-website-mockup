// Builds /freedom-tune.html — option A of the Freedom section, with the three
// concerns raised about it as independent, live-switchable choices: the
// strokes, the transition into Common Struggles, and the copy styling.
//
// One frame (dist/ft.html) is the real homepage with the section injected; the
// options page flips data attributes inside it rather than loading a page per
// combination, so all 64 mixes are available instantly. ?s=&t=&y= on ft.html
// sets a combination directly. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AXES, DEFAULTS, renderFreedomTune, FREEDOM_TUNE_CSS, FREEDOM_TUNE_JS } from '../src/partials/freedom-tune.mjs';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
// The shipped Freedom section is removed first, so each preview shows only
// the treatment being compared.
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
  .replace(/<section id="freedom"[\s\S]*?<\/section>/, '');

const PANEL = '<div class="relative z-10 -mt-16 overflow-hidden rounded-t-[2.5rem]';
const at = home.indexOf(PANEL);
if (at < 0) throw new Error('build-freedom-tune: struggles panel not found in dist/index.html');
const open = home.indexOf('>', at) + 1;

// Reads ?s=&t=&y= so a combination can be opened or shared directly.
const fromQuery = `<script>
(function(){var q=new URLSearchParams(location.search),s=document.querySelector('[data-ft]');
['s','t','y'].forEach(function(k){if(q.get(k))s.dataset[k]=q.get(k);});})();
</script>`;

const frame = home.slice(0, open) + renderFreedomTune(content) + home.slice(open);
fs.writeFileSync(path.join(dist, 'ft.html'), frame
  .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${FREEDOM_TUNE_CSS}</style></head>`)
  .replace('</body>', `${fromQuery}${FREEDOM_TUNE_JS}</body>`));

const group = (axis, g) => `
<section class="axis">
  <h2>${esc(g.title)}</h2>
  <p class="lead2">${esc(g.lead)}</p>
  <div class="seg" role="radiogroup" aria-label="${esc(g.title)}">
    ${Object.entries(g.options).map(([k, o]) => `
    <button type="button" role="radio" data-axis="${axis}" data-v="${k}" aria-checked="${DEFAULTS[axis] === k}">
      ${esc(o.label)}${o.pick ? '<span class="rec">Recommended</span>' : ''}
    </button>`).join('')}
  </div>
  <p class="desc" data-desc="${axis}"></p>
</section>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Freedom section — tuning — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1360px; margin:0 auto; padding:32px 16px 80px; }
h1 { font:700 28px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:860px; margin:8px 0 0; }
.layout { display:grid; gap:28px; margin-top:24px; }
@media (min-width:1180px) { .layout { grid-template-columns:380px 1fr; align-items:start; } .panel { position:sticky; top:16px; } }
.axis { padding:18px 0; border-top:1px solid #eee; }
.axis:first-child { border-top:0; padding-top:0; }
.axis h2 { font:700 16px/1.3 Montserrat, sans-serif; margin:0; }
.lead2 { margin:4px 0 0; color:var(--soft); font-size:14px; }
.seg { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
.seg button { position:relative; font:700 12px Montserrat, sans-serif; letter-spacing:.06em; border:1px solid #ddd; background:#fff; color:var(--ink);
  border-radius:999px; padding:10px 16px; min-height:44px; cursor:pointer; }
.seg button[aria-checked="true"] { background:var(--ink); color:#fff; border-color:var(--ink); }
.rec { position:absolute; top:-9px; right:8px; font:800 8px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff;
  background:linear-gradient(92deg,var(--magenta),var(--cyan)); border-radius:999px; padding:2px 7px; }
.desc { margin:10px 0 0; font-size:14px; color:var(--ink); min-height:3em; }
.actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:6px; padding-top:16px; border-top:1px solid #eee; }
.actions button, .actions a { font:700 12px Montserrat, sans-serif; letter-spacing:.06em; color:var(--magenta); background:none; border:1px solid rgba(232,32,143,.35);
  border-radius:999px; padding:10px 16px; min-height:44px; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; }
.combo { margin-top:12px; font:700 12px Montserrat, sans-serif; color:var(--soft); }
.views { display:grid; gap:20px; }
@media (min-width:1500px) { .views { grid-template-columns:1fr 300px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:300px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:26px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Freedom — option A, tuned</h1>
  <p class="lead">Your three notes as three separate choices. Pick one of each and both previews update straight away —
     it is the real homepage in each frame, scrolled to the section. <strong>Replay</strong> re-runs the entrance animations.</p>

  <div class="layout">
    <div class="panel">
      ${Object.entries(AXES).map(([a, g]) => group(a, g)).join('')}
      <div class="actions">
        <button type="button" id="replay">↻ Replay</button>
        <button type="button" id="totrans">Show the transition ↓</button>
        <a id="open" href="/ft.html#freedom" target="_blank" rel="noopener">Open full page ↗</a>
      </div>
      <p class="combo" id="combo"></p>
    </div>
    <div class="views">
      <figure><div class="screen" data-w="1440" data-h="900"><iframe id="fd" src="/ft.html#freedom" title="Desktop preview" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
      <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe id="fp" src="/ft.html#freedom" title="Phone preview" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
    </div>
  </div>
</div>
<script>
(function () {
  var AXES = ${JSON.stringify(Object.fromEntries(Object.entries(AXES).map(([a, g]) => [a, Object.fromEntries(Object.entries(g.options).map(([k, o]) => [k, { label: o.label, note: o.note }]))])))};
  var sel = ${JSON.stringify(DEFAULTS)};
  var frames = [document.getElementById('fd'), document.getElementById('fp')];

  function fit() {
    document.querySelectorAll('.screen').forEach(function (s) {
      var w = +s.dataset.w, h = +s.dataset.h, k = s.clientWidth / w;
      s.style.height = Math.round(h * k) + 'px';
      s.querySelector('iframe').style.transform = 'scale(' + k + ')';
    });
  }
  addEventListener('resize', fit); fit();

  function section(f) { try { return f.contentDocument.querySelector('[data-ft]'); } catch (e) { return null; } }
  function apply(replay) {
    frames.forEach(function (f) {
      var s = section(f); if (!s) return;
      s.dataset.s = sel.s; s.dataset.t = sel.t; s.dataset.y = sel.y;
      if (replay && f.contentWindow.ftReplay) f.contentWindow.ftReplay();
    });
    Object.keys(sel).forEach(function (a) {
      document.querySelector('[data-desc="' + a + '"]').textContent = AXES[a][sel[a]].note;
      document.querySelectorAll('[data-axis="' + a + '"]').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.v === sel[a])); });
    });
    var q = '?s=' + sel.s + '&t=' + sel.t + '&y=' + sel.y;
    document.getElementById('open').href = '/ft.html' + q + '#freedom';
    document.getElementById('combo').textContent = 'Current mix: ' + AXES.s[sel.s].label + ' · ' + AXES.t[sel.t].label + ' · ' + AXES.y[sel.y].label;
  }
  frames.forEach(function (f) { f.addEventListener('load', function () { apply(false); }); });
  document.querySelectorAll('[data-axis]').forEach(function (b) {
    b.addEventListener('click', function () { sel[b.dataset.axis] = b.dataset.v; apply(true); });
  });
  document.getElementById('replay').addEventListener('click', function () { apply(true); });
  document.getElementById('totrans').addEventListener('click', function () {
    frames.forEach(function (f) {
      var s = section(f); if (!s) return;
      var r = s.getBoundingClientRect(), w = f.contentWindow;
      w.scrollTo({ top: w.scrollY + r.bottom - w.innerHeight * .55, behavior: 'smooth' });
    });
  });
  apply(false);
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'freedom-tune.html'), page);
console.log('built dist/freedom-tune.html');

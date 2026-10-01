// Builds /vsl-size-options.html — the homepage VSL at its full 16:9, at
// several sizes.
//
// The live frame is cropped to 2.39:1 and only unfolds to 16:9 once someone
// turns the sound on, so a quarter of the picture is hidden on arrival. Every
// option here shows the whole frame from the start; they differ only in width.
//
// Each option is the real built homepage (dist/index.html) with a small style
// override injected, so header, headline and fold position are exactly what
// ships. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// Full frame from the start, and no unfold — there is nothing left to open.
const FULL = '[data-vsl-id] .vsl-frame{padding-bottom:56.25%!important;transition:none!important}';
// Break out of the 56rem hero column and centre on the viewport instead.
const breakout = (w) => `@media (min-width:640px){[data-vsl-id]{max-width:none!important;width:${w};margin-left:50%!important;transform:translateX(-50%)}}`;

const OPTIONS = {
  // The homepage now ships option A, so the old crop is reapplied here.
  now:  { label: 'Before — cropped strip', css: '[data-vsl-id] .vsl-frame{padding-bottom:41.84%!important}',
          note: 'For reference. 2.39:1, so the top and bottom quarter of the picture are cut off until someone turns the sound on.' },
  same: { label: 'A — Full frame, same width', css: FULL,
          note: 'Exactly the width it is now, uncropped. About a third taller, so the Register button sits lower on the page.' },
  tidy: { label: 'B — Full frame, same height as now', css: FULL + '[data-vsl-id]{max-width:40rem!important}',
          note: 'Narrowed until it takes the same height as today’s strip. Nothing below it moves; the video is smaller on screen.' },
  wide: { label: 'C — Full frame, wider', css: FULL + breakout('min(64rem, calc(100vw - 2rem))'),
          note: 'Steps out past the headline column to 1024px. Reads as the centrepiece of the hero rather than a box within it.' },
  fit:  { label: 'D — Full frame, as big as the screen allows', css: FULL + breakout('min(75rem, calc(100vw - 2rem), calc((100vh - 140px) * 16 / 9))'),
          note: 'Up to 1200px wide, but never taller than the window minus a little air, so the whole video always fits on screen once scrolled to. Largest on big monitors, self-limiting on laptops.' },
};

// Phones: every 16:9 option is the same width below 640px, so the only real
// choice there is whether to keep the side gutters.
const PHONE = {
  now:   { label: 'Before', css: '[data-vsl-id] .vsl-frame{padding-bottom:41.84%!important}' },
  full:  { label: 'Full frame, with margins', css: FULL },
  bleed: { label: 'Full frame, edge to edge', css: FULL +
    '@media (max-width:639px){[data-vsl-id]{margin-left:-1rem!important;margin-right:-1rem!important;max-width:none!important}}' },
};

// Reports the player's rendered size back to the gallery.
const probe = (id) => `<script>
(function(){function r(){var s=document.querySelector('[data-vsl-stage]');if(!s)return;var b=s.getBoundingClientRect();
try{parent.postMessage({vs:${JSON.stringify(id)},w:Math.round(b.width),h:Math.round(b.height),top:Math.round(b.top+scrollY)},'*')}catch(e){}}
addEventListener('load',r);addEventListener('resize',r);setTimeout(r,1500);})();
</script>`;

const variant = (id, css) => home
  .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${css}</style></head>`)
  .replace('</body>', `${probe(id)}</body>`);

for (const [k, o] of Object.entries(OPTIONS)) fs.writeFileSync(path.join(dist, `vs-${k}.html`), variant(k, o.css));
for (const [k, o] of Object.entries(PHONE)) fs.writeFileSync(path.join(dist, `vsp-${k}.html`), variant('p-' + k, o.css));

const desktopCard = (k, o) => `
<article class="card">
  <div class="head">
    <span class="tag${k === 'now' ? ' now' : ''}">${k === 'now' ? 'Current' : 'Option'}</span>
    <h2>${esc(o.label)}</h2>
    <p>${esc(o.note)}</p>
    <p class="m"><span data-m="${k}">measuring…</span> · <a href="/vs-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  </div>
  <div class="screen" data-w="1440" data-h="900">
    <iframe src="/vs-${k}.html" title="${esc(o.label)}" loading="lazy" width="1440" height="900"></iframe>
    <span class="fold">bottom of a 1440 × 900 screen</span>
  </div>
</article>`;

const phoneCard = (k, o) => `
<figure class="phone">
  <div class="screen" data-w="390" data-h="844">
    <iframe src="/vsp-${k}.html" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe>
  </div>
  <figcaption><strong>${esc(o.label)}</strong><br><span data-m="p-${k}">measuring…</span></figcaption>
</figure>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Video size options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing: border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1180px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:780px; margin:10px 0 0; }
.card { margin-top:56px; }
.head h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.head p { color:var(--soft); margin:4px 0 0; max-width:780px; font-size:15px; }
.head .m { font:700 13px Montserrat, sans-serif; color:var(--ink); font-variant-numeric:tabular-nums; }
.head a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase;
  color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.now { background:var(--soft); }
.screen { position:relative; overflow:hidden; margin-top:14px; border-radius:14px; background:#111;
  box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
.fold { position:absolute; left:0; right:0; bottom:0; padding:4px 10px; text-align:right;
  font:700 10px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff;
  background:linear-gradient(transparent, rgba(232,32,143,.85)); pointer-events:none; }
h2.sec { font:700 24px/1.3 Montserrat, sans-serif; margin:72px 0 0; }
.phones { display:flex; flex-wrap:wrap; gap:28px; margin-top:18px; }
.phone { margin:0; width:280px; max-width:100%; }
.phone .screen { border-radius:28px; box-shadow:0 0 0 8px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.phone figcaption { margin-top:16px; font-size:14px; color:var(--soft); }
.phone figcaption strong { font-family:Montserrat, sans-serif; color:var(--ink); }
</style>
</head>
<body>
<div class="wrap">
  <h1>Homepage video — full frame, no crop</h1>
  <p class="lead">Each option below is the real homepage with only the video changed, shown as it looks on a
     1440&nbsp;×&nbsp;900 screen. The pink band marks the bottom of that screen. Scroll inside a preview, or open it full
     page to try your own window size.</p>

  ${Object.entries(OPTIONS).map(([k, o]) => desktopCard(k, o)).join('')}

  <h2 class="sec">On phones</h2>
  <p class="lead">Below 640px every option above is the same width, so the only choice on a phone is whether the video
     keeps the side margins or runs edge to edge.</p>
  <div class="phones">${Object.entries(PHONE).map(([k, o]) => phoneCard(k, o)).join('')}</div>
</div>

<script>
(function () {
  // Scale each fixed-size iframe to the width of its box.
  var screens = [].slice.call(document.querySelectorAll('.screen'));
  function fit() {
    screens.forEach(function (s) {
      var w = +s.dataset.w, h = +s.dataset.h, k = s.clientWidth / w;
      s.style.height = Math.round(h * k) + 'px';
      s.querySelector('iframe').style.transform = 'scale(' + k + ')';
    });
  }
  addEventListener('resize', fit); fit();

  addEventListener('message', function (e) {
    var d = e.data; if (!d || !d.vs) return;
    var el = document.querySelector('[data-m="' + d.vs + '"]');
    if (el) el.textContent = 'Video ' + d.w + ' × ' + d.h + 'px, starting ' + d.top + 'px down';
  });
})();
</script>
</body></html>`;

fs.writeFileSync(path.join(dist, 'vsl-size-options.html'), page);
console.log('built dist/vsl-size-options.html');

// Builds /404-options.html: three simple designs for the 404 page, which
// Vercel shows for any address with no page (asked for 2026-11-04), plus one
// frame per option, /nf-<key>.html: the real 404 page with <main> swapped.
// Markup src/partials/notfound-options.mjs; styles src/styles/notfound.css on
// top of thankyou.css.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { notFoundOption } from '../src/partials/notfound-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');
for (const f of ['thankyou.css', 'notfound.css']) fs.copyFileSync(path.join(ROOT, 'src/styles', f), path.join(dist, f));

const OPTIONS = {
  day: {
    label: 'N1 — Daylight',
    note: 'Matches the thank-you page: the same washed daylight photograph, the crown, “Lost your way?” in pink script, a short line, Back to home, and the main pages as pills underneath.',
  },
  big: { pick: true,
    label: 'N2 — Big 404',
    note: 'A huge “404” in the pink-to-teal gradient, faint behind the words, on soft pink and teal light. Says “page not found” at a glance, still gently.',
  },
  signs: {
    label: 'N3 — Signposts',
    note: 'The message, then the main pages (Events, Masterclasses, 1-on-1 Coaching, Contact) as four photo cards to choose from. The most helpful: it turns a dead end into somewhere to go.',
  },
};

const mainRe = /<main id="main">[\s\S]*?<\/main>/;
const base = fs.readFileSync(path.join(dist, '404.html'), 'utf8');
if (!mainRe.test(base)) throw new Error('build-404-options: main not found in dist/404.html');

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `nf-${k}.html`), base
    .replace(mainRe, () => `<main id="main">${notFoundOption(site, c, k)}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>404 — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag">${o.pick ? 'Live now' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/nf-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/nf-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/nf-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, '404-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>404 page — ${esc(site.brand.name)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:860px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:860px; font-size:15px; }
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; } .links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 280px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:280px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#fff; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>The 404 page</h1>
  <p class="lead">What a visitor sees at any address with no page: an old link, a typo, a page that moved. Three simple designs;
     each says the page could not be found and offers the way home and the main pages. Open one full size to try it.</p>
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
</body></html>`);

console.log('built dist/404-options.html + frames nf-*.html');

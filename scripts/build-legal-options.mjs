// Builds /legal-options.html: four designs for the Privacy Policy and Terms
// and Conditions pages (asked for 2026-11-05: "simple and easy to look at",
// in the brand). Frames are the built Privacy Policy page with <main>
// swapped, /lg-<key>.html, and the same for the terms, /lgt-<key>.html.
// Markup src/partials/legal-options.mjs; styles src/styles/legal.css.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { legalPage } from '../src/partials/legal-options.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');

const OPTIONS = {
  paper: { chosen: true,
    label: 'L1 — On paper',
    note: 'The whole policy on one white sheet, taped to the same blush dotted wall as the homepage’s Freedom section. “Privacy” in the pink script over the title, then the text in plain, roomy type. The most like the rest of the site.',
  },
  side: {
    label: 'L2 — Contents beside it',
    note: 'A list of every section down the left that stays in view and marks where you are as you read; click one to jump to it. The text sits beside it on white, under a soft pink and teal glow. The easiest to find your way around a long policy. On a phone the list folds away at the top.',
  },
  fold: {
    label: 'L3 — Fold-out sections',
    note: 'The opening paragraph, then each section as a row with a pink plus: the page starts as a short, tidy list of headings, and she opens only the ones she wants (or “Open all”). The calmest to look at. Searching the page still finds text inside closed sections.',
  },
  edit: {
    label: 'L4 — Editorial',
    note: 'An open magazine-style page: a large title, and each section numbered in a pink-to-teal numeral in the margin, with a fine line between sections. Light and confident, with nothing in a box.',
  },
};

const mainRe = /<main id="main">[\s\S]*?<\/main>/;
for (const [doc, file, prefix] of [['privacy', 'privacy-policy.html', 'lg'], ['terms', 'terms.html', 'lgt']]) {
  const base = fs.readFileSync(path.join(dist, file), 'utf8');
  if (!mainRe.test(base)) throw new Error(`build-legal-options: main not found in dist/${file}`);
  for (const [k, o] of Object.entries(OPTIONS)) {
    fs.writeFileSync(path.join(dist, `${prefix}-${k}.html`), base
      .replace(mainRe, () => `<main id="main">${legalPage(site, c, doc, k)
        // the switch between the two policies stays inside this option
        .replace(/href="\/privacy-policy\.html"/g, `href="/lg-${k}.html"`)
        .replace(/href="\/terms\.html/g, `href="/lgt-${k}.html`)}</main>`)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(c.legal[doc].title)} — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
  }
}

const card = (k, o) => `
<article class="opt">
  <span class="tag">${o.chosen ? 'Chosen' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/lg-${k}.html" target="_blank" rel="noopener">Open the Privacy Policy ↗</a>
     <a href="/lgt-${k}.html" target="_blank" rel="noopener">Open the Terms and Conditions ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1000"><iframe src="/lg-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1000"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/lg-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'legal-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Privacy and Terms pages — options — ${esc(site.brand.name)}</title>
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
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; display:flex; flex-wrap:wrap; gap:6px 20px; } .links a { color:var(--magenta); }
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
  <h1>Privacy Policy and Terms and Conditions — designs</h1>
  <p class="lead">Two new pages, linked from the footer (beside the copyright line). The words are Rise Up Kings’
     Privacy Policy and Terms and Conditions exactly as they are on riseupkings.com, with only the email changed to
     support@riseupqueens.com (and without the Rise Up Kings phone number and address). Four designs, each kept simple and easy to read, in the site’s own type and colours.
     The previews show the Privacy Policy; the switch at the top of each page (and the link above each preview)
     goes to the Terms and Conditions in the same design. Scroll inside the previews.</p>
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
console.log('built dist/legal-options.html + frames lg-*.html, lgt-*.html');

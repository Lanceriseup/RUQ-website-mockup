// Builds /register-options.html — design options for the Freedom registration
// page — plus one frame per option: /regc-<key>.html.
//
// Each option is its own module, src/partials/register/<key>.mjs, exporting
// register(site, c) => the page's <main> contents (copy: content.json
// `register`), with its own stylesheet src/styles/explore/reg-<key>.css,
// published as /xp-reg-<key>.css (build.mjs copies it too). Frames reuse the
// Courses page shell (clear header, footer, explore.js).
//
//   --only <key>   rebuild just that option. Modules load one at a time, so a
//                  broken one only fails its own frame.
//
// Design only: the forms post nowhere, and card fields are placeholders for
// the hosted card frame, never real inputs.
//
// Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');
const base = fs.readFileSync(path.join(dist, 'courses.html'), 'utf8');
const mainRe = /<main id="main">[\s\S]*?<\/main>/;
if (!mainRe.test(base)) throw new Error('build-register-options: main not found in dist/courses.html');

const OPTIONS = {
  luminous: {
    label: 'R1 — Luminous',
    note: 'The Courses page’s sky and frosted glass, so registration feels like the same site. “Freedom” in its own script over the sky, the dates as glass cards you choose between, event details with small icons, and a floating glass checkout card that stays in view as you scroll, with numbered sections and a glowing total.',
  },
  ticket: {
    label: 'R2 — The ticket',
    note: 'The event as a ticket you are about to own: a large Freedom ticket with a perforated stub, the date, venue and “Admit one”, which updates as you pick a date. The checkout sits beside it like the counterfoil. The most playful and memorable.',
  },
  split: {
    label: 'R3 — Split screen',
    note: 'A premium checkout layout: the left half is an immersive event photograph that stays put, with the date, venue and what’s included on frosted glass over it; the right half is a calm white checkout with a numbered step line running down the sections. Clean, focused and modern.',
    pick: true,
  },
  editorial: {
    label: 'R4 — Editorial',
    note: 'A full-width Freedom banner opens the page with a live countdown to the first day and the two dates to choose from. Below, the details read like a magazine feature beside a deep ink checkout card with magenta accents — the most dramatic and high-contrast.',
  },
};

const argOnly = process.argv.indexOf('--only');
const only = argOnly > -1 ? process.argv[argOnly + 1] : null;
if (only && !OPTIONS[only]) throw new Error(`build-register-options: unknown option "${only}"`);

let failed = 0;
for (const k of Object.keys(OPTIONS)) {
  if (only && k !== only) continue;
  const css = path.join(ROOT, `src/styles/explore/reg-${k}.css`);
  if (fs.existsSync(css)) fs.copyFileSync(css, path.join(dist, `xp-reg-${k}.css`));
  let html;
  try {
    const mod = await import(`../src/partials/register/${k}.mjs?v=${Date.now()}`);
    html = mod.register(site, c);
  } catch (e) { failed++; console.error(`build-register-options: ${k} failed —`, e.stack); continue; }
  const scripts = html.includes('data-countdown') ? '<script src="/countdown.js" defer></script>\n' : '';
  fs.writeFileSync(path.join(dist, `regc-${k}.html`), base
    .replace(mainRe, `<main id="main">${html}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Register — ${esc(OPTIONS[k].label)} — ${esc(site.brand.name)}</title>`)
    .replace('</body>', `${scripts}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Chosen' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/regc-${k}.html" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1500"><iframe src="/regc-${k}.html" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1500"></iframe></div><figcaption>Desktop · 1440 wide · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/regc-${k}.html" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'register-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Registration page — design options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
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
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
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
  <h1>Freedom registration page — design options</h1>
  <p class="lead">Four premium designs for the registration page, all with the content you supplied: the two dates, event
     details, what you’ll experience, and the full checkout — contact, payment, billing, event choice, coupon and total.
     Design only for now: nothing submits, and the card fields are placeholders for the secure hosted card frame.
     The page is not linked from anywhere yet.</p>
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
console.log(`built dist/register-options.html + frames for ${only || 'all options'}${failed ? ` — ${failed} FAILED` : ''}`);
if (failed) process.exitCode = 1;

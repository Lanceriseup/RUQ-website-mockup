// Builds /freedom-dates-options.html — ways to show both event dates in the
// Freedom section (the memory wall), moved there from under the homepage
// hero's Register button (asked for 2026-10-30).
//
// Each option is a `dates` mode of freedomPhoto(…, 'memory') in
// src/partials/freedom-photo.mjs. Frames are the built homepage with the
// Freedom section swapped, as /freedomdt-<key>.html. Option A ('note') was
// chosen 2026-10-30 and is live; the hero no longer has dates of its own.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { freedomPhoto } from '../src/partials/freedom-photo.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(ROOT, 'src/styles/freedom-photo.css'), path.join(dist, 'freedom-photo.css'));

const OPTIONS = {
  note: {
    label: 'A — In the note',
    note: 'The two dates move into the Freedom note itself, in place of today’s single “3-day intensive · May 5–7” line: “3-day intensive” between two hairlines, then “Next event” and “Also coming” side by side, the same layout as under the hero, in ink on the paper. The Reserve button sits underneath. The cleanest and most direct.',
    pick: true,
  },
  tickets: {
    label: 'B — Tickets on the wall',
    note: 'Two admission tickets, one magenta and one teal, taped to the wall so they overlap the bottom of the note, each tilted like the polaroids around it, with “Admit one” on the stub. They belong to the scrapbook: the dates become keepsakes on the wall.',
  },
  script: {
    label: 'C — Save the dates',
    note: '“Save the dates” in the pink script inside the note, then the two dates stacked. A magenta ring is drawn by hand around the next event as the section comes into view, and a teal squiggle underlines the second. “Both in Dallas, TX” sits underneath. Personal and handwritten, like a note on the fridge.',
  },
  band: {
    label: 'D — Save the dates band',
    note: 'The note stays as it is (without a date), and below the whole wall a wide band reads “Save the dates” in script between two fine lines, with both dates large and side by side. The most prominent: the dates get a line of the page to themselves.',
  },
};

const sectionRe = /<section id="freedom"[\s\S]*?<\/section>/;
const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!sectionRe.test(base)) throw new Error('build-freedom-dates-options: Freedom section not found in dist/index.html');

const head = `${base.includes('/freedom-photo.css') ? '' : '<link rel="stylesheet" href="/freedom-photo.css">\n'}<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300&display=swap">
</head>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `freedomdt-${k}.html`), base
    .replace('</head>', head)
    .replace(sectionRe, () => freedomPhoto(site, c, 'memory', { dates: k }))
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Freedom dates — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Chosen' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/freedomdt-${k}.html#freedom" target="_blank" rel="noopener">Open at the Freedom section ↗</a>
     <a href="/freedomdt-${k}.html" target="_blank" rel="noopener">Open at the top (hero without dates) ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1180"><iframe src="/freedomdt-${k}.html#freedom" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="1180"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/freedomdt-${k}.html#freedom" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'freedom-dates-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Event dates in the Freedom section — options — ${esc(site.brand.name)}</title>
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
  <h1>Event dates — moved into the Freedom section</h1>
  <p class="lead">The two dates under the hero’s Register Now button (<strong>Next event</strong> and
     <strong>Also coming</strong>) move down into the Freedom section, where the event is introduced. In every
     option the hero keeps its Register Now button and loses the dates, and both dates come from the same
     place as every other date on the site. The breakthrough section further down keeps its own dates. Each
     preview is the real homepage, opened at the Freedom section; scroll inside it. Option A is live.</p>
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
console.log('built dist/freedom-dates-options.html + frames for all options');

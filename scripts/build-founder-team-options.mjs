// Builds /founder-team-options.html — options for a "Meet the Team" link in
// the founder section of the about page (founder.mjs teamCta). Each option is
// swapped into the built about page as /founderteam-<key>.html.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { founderSection } from '../src/partials/founder.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const c = read('src/data/content.json');
const dist = path.join(ROOT, 'dist');

const OPTIONS = {
  pill: {
    label: 'A — Pink button',
    note: 'A filled magenta “Meet the Team” pill under the signature, the same style as the site’s other main buttons. The clearest and most consistent.',
  },
  paired: {
    label: 'B — Beside the signature',
    note: 'The signature and an outlined pink “Meet the Team” pill sit side by side on one line, so it reads as Jessica handing you on to her team. Lighter than A; it fills with pink on hover.',
    chosen: true,
  },
  faces: {
    label: 'C — Team faces',
    note: 'A small white card under the signature: five of the team’s faces overlapping, a “+” count for the rest, “Meet the Team” and a line about who they are, with a pink arrow. It shows there is a whole team before you click. The most inviting.',
  },
  link: {
    label: 'D — Text link',
    note: '“Meet the women who serve beside her” as an uppercase teal link with a short pink-to-teal underline that draws across on hover. The most understated; it keeps the focus on Jessica.',
  },
};

const sectionRe = /<section id="founder"[\s\S]*?<\/section>/;
const base = fs.readFileSync(path.join(dist, 'about.html'), 'utf8');
if (!sectionRe.test(base)) throw new Error('build-founder-team-options: founder section not found in dist/about.html');

for (const [k, o] of Object.entries(OPTIONS)) {
  fs.writeFileSync(path.join(dist, `founderteam-${k}.html`), base
    .replace(sectionRe, () => founderSection(c, k))
    .replace(/<title>[\s\S]*?<\/title>/, `<title>Founder link — ${esc(o.label)} — ${esc(site.brand.name)}</title>`));
}

// Frames open at the section; the reveal (and so the signature) only starts
// when it scrolls into view, which a scaled iframe opened at #founder does.
const card = (k, o) => `
<article class="opt">
  <span class="tag${o.chosen ? ' pick' : ''}">${o.chosen ? 'Chosen' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/founderteam-${k}.html#founder" target="_blank" rel="noopener">Open on the About page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="860"><iframe src="/founderteam-${k}.html#founder" title="${esc(o.label)} — desktop" loading="lazy" width="1440" height="860"></iframe></div><figcaption>Desktop · scrolls</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/founderteam-${k}.html#founder" title="${esc(o.label)} — phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · scrolls</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'founder-team-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meet the Team link — options — ${esc(site.brand.name)}</title>
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
  <h1>Founder section — “Meet the Team” link</h1>
  <p class="lead">Four ways to link from Jessica’s section on the About page to the Team page. Each sits under her
     signature and goes to /team.html. Every preview is the real About page, opened at the section; hover the link to
     see its effect. The live site has not changed yet.</p>
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
console.log('built dist/founder-team-options.html + frames for all options');

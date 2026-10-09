// Builds /about-menu-options.html — design options for the About submenu
// (About Rise Up Queens + Meet the Team), with Courses joining the header so
// it stays two links either side of the wordmark.
//
// Each option is a submenu style from src/partials/nav-sub.mjs. Frames swap
// the header and capsule of a built page for ones rendered from the proposed
// nav, so the live site and site.json are untouched until one is chosen:
//
//   /aboutmenu-<key>.html        the About page (header over the photograph)
//   /aboutmenu-<key>-light.html  the Team page (ink header on the sky)
//
// A frame opened with #open shows the menu already open: the desktop panel,
// or below md the burger drawer with About expanded.
//
// Must run after scripts/build.mjs and the css step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { header } from '../src/partials/nav.mjs';
import { capsule } from '../src/partials/capsule.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = read('src/data/site.json');
const dist = path.join(ROOT, 'dist');

// The proposed header nav.
const proposed = {
  ...site,
  nav: [
    { label: 'Home', href: '/index.html' },
    { label: 'About', children: [
      { label: 'About Rise Up Queens', href: '/about.html',
        blurb: 'Our story, our mission and who it’s for.',
        thumb: site.assets.aboutHero },
      { label: 'Meet the Team', href: '/team.html',
        blurb: 'The women who lead and serve at every event.',
        thumbs: ['/assets/team/jessica-lewis.jpg', '/assets/team/molly-rhodes.jpg', '/assets/team/becky-hilty.jpg'] },
    ] },
    { label: 'Courses', href: '/courses.html' },
    { label: 'Contact', href: '/contact.html' },
  ],
};

const OPTIONS = {
  card: {
    label: 'A — Clean card',
    note: 'A small white card drops from About with the two pages in the header’s own uppercase type, a magenta-to-cyan line along the top and an arrow that slides in on hover. Quiet and editorial — it looks like it was always part of this header.',
    pick: true,
  },
  rich: {
    label: 'B — Rich panel',
    note: 'A wider panel with a picture for each page — the group photo for About Rise Up Queens, three of the team’s faces for Meet the Team — and a line describing each. The most inviting; it tells a first-time visitor what they will find before they click.',
  },
  inline: {
    label: 'C — Inline reveal',
    note: 'No floating box. The two pages appear as a centred row just under the cyan hairline, with an underline drawing in on hover. The most minimal; it keeps the header feeling like one long line of type.',
  },
  glass: {
    label: 'D — Frosted glass',
    note: 'A dark frosted-glass panel with gradient dots, matching the floating capsule that appears when you scroll. Striking over the hero photograph, and identical whether you are at the top of the page or scrolled down.',
  },
};

const headerRe = /<header id="site-nav"[\s\S]*?<\/header>/;
const capsuleRe = /<div id="nav-capsule"[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/;

// Demo hook for the review page only: #open shows the menu already open.
const demo = `<script>
addEventListener('load', function () {
  if (location.hash !== '#open') return;
  if (innerWidth >= 768) {
    var s = document.querySelector('#site-nav [data-nav-sub]');
    s.setAttribute('data-open', ''); s.querySelector('[data-nav-sub-toggle]').setAttribute('aria-expanded', 'true');
  } else {
    document.getElementById('site-nav-burger').click();
    var a = document.querySelector('#navMain [data-nav-acc-toggle]'); if (a) a.click();
  }
});
</script>`;

const FRAMES = [
  { src: 'about.html', suffix: '', href: '/about.html', opts: { overHero: true } },
  { src: 'team.html', suffix: '-light', href: '/team.html', opts: { clear: true } },
];

for (const k of Object.keys(OPTIONS)) {
  for (const f of FRAMES) {
    const base = fs.readFileSync(path.join(dist, f.src), 'utf8');
    if (!headerRe.test(base) || !capsuleRe.test(base)) throw new Error(`build-about-menu-options: header or capsule not found in dist/${f.src}`);
    fs.writeFileSync(path.join(dist, `aboutmenu-${k}${f.suffix}.html`), base
      .replace(headerRe, () => header(proposed, f.href, { ...f.opts, submenu: k }))
      .replace(capsuleRe, () => capsule(proposed, f.href))
      .replace(/<title>[\s\S]*?<\/title>/, `<title>About menu — ${esc(OPTIONS[k].label)} — ${esc(site.brand.name)}</title>`)
      .replace('</body>', `${demo}\n</body>`));
  }
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/aboutmenu-${k}.html" target="_blank" rel="noopener">Try it on the About page ↗</a>
     <a href="/aboutmenu-${k}-light.html" target="_blank" rel="noopener">Try it on the Team page ↗</a></p>
  <div class="pair">
    <div class="stack">
      <figure><div class="screen" data-w="1440" data-h="520"><iframe src="/aboutmenu-${k}.html#open" title="${esc(o.label)} — over the photo" loading="lazy" width="1440" height="520"></iframe></div><figcaption>Desktop · over the hero photo · open</figcaption></figure>
      <figure><div class="screen" data-w="1440" data-h="440"><iframe src="/aboutmenu-${k}-light.html#open" title="${esc(o.label)} — light page" loading="lazy" width="1440" height="440"></iframe></div><figcaption>Desktop · light page · open (Meet the Team is the current page)</figcaption></figure>
    </div>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="700"><iframe src="/aboutmenu-${k}.html#open" title="${esc(o.label)} — phone" loading="lazy" width="390" height="700"></iframe></div><figcaption>Phone · menu open</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'about-menu-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>About submenu — design options — ${esc(site.brand.name)}</title>
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
.links { margin:10px 0 0; font:700 13px Montserrat, sans-serif; display:flex; flex-wrap:wrap; gap:6px 20px; } .links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
.stack { display:grid; gap:20px; min-width:0; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 260px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:260px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#fff; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>About submenu — design options</h1>
  <p class="lead">“About” becomes a menu holding <strong>About Rise Up Queens</strong> (the current About page) and
     <strong>Meet the Team</strong>. Courses moves into the header, so it stays two links either side of the logo:
     Home, About ▾ | logo | Courses, Contact. On phones, About opens as an expandable section in the menu for all four options.
     Every preview is the real header and works: hover or click About, or open a full page to try it.
     The live site has not changed yet.</p>
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
console.log('built dist/about-menu-options.html + frames for all options');

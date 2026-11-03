// Builds /nav-pages-options.html: where Masterclasses, Events and 1-on-1
// Coaching go in the header (asked for 2026-11-04). The header today is
// Home, About ▾ | logo | Courses, Contact.
//
// Each option is a proposed site.nav rendered by the real header (nav.mjs,
// nav-sub.mjs) and capsule, swapped into built pages, so the live site and
// site.json are untouched until one is chosen:
//
//   /navpages-<key>.html        the homepage (header over the hero video)
//   /navpages-<key>-light.html  the Events page (ink header on a light page)
//
// A frame opened with #open shows the new menu already open: the desktop
// panel, or below md the burger drawer with that menu expanded.
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

const [home, about, , contact] = site.nav;

// The four pages a visitor can take part in, with a picture and a line each
// for the panels that show them.
const PAGES = {
  events: { label: 'Events', href: '/events.html', thumb: '/assets/photos/queens-waving.jpg',
    blurb: 'Freedom and the journey beyond it.' },
  masterclasses: { label: 'Masterclasses', href: '/masterclasses.html', thumb: '/assets/photos/mc-freedom.jpg',
    blurb: 'Short classes that meet you where you are.' },
  coaching: { label: '1-on-1 Coaching', href: '/coaching.html', thumb: '/assets/photos/close-talk.jpg',
    blurb: 'A coach of your own, matched to you.' },
  courses: { label: 'Courses', href: '/courses.html', thumb: '/assets/photos/journey-selfie.jpg',
    blurb: 'Begin at your own pace, from home.' },
};
const explore = (submenu) => ({ label: 'Explore', submenu,
  children: [PAGES.events, PAGES.masterclasses, PAGES.coaching, PAGES.courses] });

const OPTIONS = {
  card: {
    label: 'A — “Explore” menu', live: true,
    note: 'Courses becomes “Explore”, a menu holding Events, Masterclasses, 1-on-1 Coaching and Courses, in the same small white card as About. The header stays exactly as it looks now, two links either side of the logo: Home, About ▾ | logo | Explore ▾, Contact. The simplest change.',
    nav: [home, about, explore('card'), contact],
    menu: 'Explore',
  },
  rich: {
    label: 'B — “Explore” with pictures',
    note: 'The same “Explore” menu, but a wider panel with a picture and one line for each page, so a first-time visitor sees what each one is before clicking. About keeps its small card.',
    nav: [home, about, explore('rich'), contact],
    menu: 'Explore',
  },
  mega: {
    label: 'C — “Explore” photo cards',
    note: '“Explore” opens a wide panel under the line with the four pages as tall photo cards, each with its name and a line, lifting on hover with a pink-to-teal line drawing across. The biggest moment, and the most inviting.',
    nav: [home, about, explore('mega'), contact],
    menu: 'Explore',
  },
  three: {
    label: 'D — Three either side',
    note: 'Events and 1-on-1 Coaching get links of their own, and Masterclasses joins Courses in a small “Learn” menu: Home, About ▾, Events | logo | Learn ▾, Coaching, Contact. Every page is one click or one menu away, but the header is busier.',
    nav: [home, about, { label: 'Events', href: '/events.html' },
      { label: 'Learn', submenu: 'card', children: [PAGES.masterclasses, PAGES.courses] },
      { label: 'Coaching', href: '/coaching.html' }, contact],
    menu: 'Learn',
  },
};

const headerRe = /<header id="site-nav"[\s\S]*?<\/header>/;
// The capsule holds its own submenus, so a lazy match would stop inside the
// first of them: find its end by counting divs instead.
const capsuleSpan = (html) => {
  const start = html.indexOf('<div id="nav-capsule"');
  if (start < 0) return null;
  const tag = /<div\b|<\/div>/g;
  tag.lastIndex = start;
  let depth = 0, m;
  while ((m = tag.exec(html))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (!depth) return [start, tag.lastIndex];
  }
  return null;
};
const swapCapsule = (html, markup) => {
  const [a, b] = capsuleSpan(html);
  return html.slice(0, a) + markup + html.slice(b);
};

// Demo hook for the review page only: #open shows the named menu open.
const demo = (menu) => `<script>
addEventListener('load', function () {
  if (location.hash !== '#open') return;
  var named = function (sel) { return [].slice.call(document.querySelectorAll(sel)).filter(function (b) { return b.textContent.trim() === ${JSON.stringify(menu)}; })[0]; };
  if (innerWidth >= 768) {
    var b = named('#site-nav [data-nav-sub-toggle]');
    b.closest('[data-nav-sub]').setAttribute('data-open', ''); b.setAttribute('aria-expanded', 'true');
  } else {
    document.getElementById('site-nav-burger').click();
    var a = named('#navMain [data-nav-acc-toggle]'); if (a) a.click();
  }
});
</script>`;

const FRAMES = [
  { src: 'index.html', suffix: '', href: '/index.html', opts: { overHero: true } },
  { src: 'events.html', suffix: '-light', href: '/events.html', opts: { clear: true } },
];

for (const [k, o] of Object.entries(OPTIONS)) {
  const proposed = { ...site, nav: o.nav };
  for (const f of FRAMES) {
    const base = fs.readFileSync(path.join(dist, f.src), 'utf8');
    if (!headerRe.test(base) || !capsuleSpan(base)) throw new Error(`build-nav-pages-options: header or capsule not found in dist/${f.src}`);
    fs.writeFileSync(path.join(dist, `navpages-${k}${f.suffix}.html`), swapCapsule(base, capsule(proposed, f.href))
      .replace(headerRe, () => header(proposed, f.href, f.opts))
      .replace(/<title>[\s\S]*?<\/title>/, `<title>Nav — ${esc(o.label)} — ${esc(site.brand.name)}</title>`)
      .replace('</body>', `${demo(o.menu)}\n</body>`));
  }
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.live ? ' pick' : ''}">${o.live ? 'Live now' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/navpages-${k}.html" target="_blank" rel="noopener">Try it on the homepage ↗</a>
     <a href="/navpages-${k}-light.html" target="_blank" rel="noopener">Try it on the Events page ↗</a></p>
  <div class="pair">
    <div class="stack">
      <figure><div class="screen" data-w="1440" data-h="640"><iframe src="/navpages-${k}.html#open" title="${esc(o.label)} — over the hero" loading="lazy" width="1440" height="640"></iframe></div><figcaption>Desktop · homepage, over the video · ${esc(o.menu)} open</figcaption></figure>
      <figure><div class="screen" data-w="1440" data-h="640"><iframe src="/navpages-${k}-light.html#open" title="${esc(o.label)} — light page" loading="lazy" width="1440" height="640"></iframe></div><figcaption>Desktop · Events page · ${esc(o.menu)} open</figcaption></figure>
    </div>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="760"><iframe src="/navpages-${k}-light.html#open" title="${esc(o.label)} — phone" loading="lazy" width="390" height="760"></iframe></div><figcaption>Phone · menu open</figcaption></figure>
  </div>
</article>`;

fs.writeFileSync(path.join(dist, 'nav-pages-options.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Header — Masterclasses, Events and Coaching — ${esc(site.brand.name)}</title>
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
  <h1>Header — adding Masterclasses, Events and 1-on-1 Coaching</h1>
  <p class="lead">Today the header is Home, About ▾ | logo | Courses, Contact. Four ways to bring in the three new pages.
     Every preview is the real header and works: hover or click the menu, or open a full page to try it (the floating
     bar that appears when you scroll down follows the same choice). On phones each menu opens as an expandable
     section in the burger menu. The live site has not changed yet.</p>
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
console.log('built dist/nav-pages-options.html + frames navpages-*.html');

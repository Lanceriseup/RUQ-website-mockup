// Builds /team-light2-options.html — Meet the Team, light, second round.
//
// The cards and the bio entrance are NOT redesigned here: every portrait is
// the page's own polaroid (team.mjs coachCard / leaderCard) and "Read bio"
// opens the existing dialog with the "lift" effect (bio-modal.js). Only the
// background, the layout of the groups, and caption colours for a light
// ground change. Operations portraits are the same polaroid, smaller.
//
// Top of page is the client's own: "The women behind it" / MEET THE TEAM /
// the lead line (content.json team.intro). Groups: Coaches, Community
// Coaches, Specialized Roles, Leadership Team.
//
// The eight new people have no photos or bios yet: they use a placeholder
// portrait and "Bio coming soon." in these previews only. Must run after
// scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { header } from '../src/partials/nav.mjs';
import { coachCard, leaderCard } from '../src/partials/team.mjs';
import { renderTeamHeading } from '../src/partials/team-headings.mjs';
import { effectClass } from '../src/partials/bio-effects.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const page0 = fs.readFileSync(path.join(dist, 'team.html'), 'utf8');
const hA = page0.indexOf('<header'), hB = page0.indexOf('</header>') + '</header>'.length;
const mA = page0.indexOf('<main id="main">') + '<main id="main">'.length, mB = page0.indexOf('</main>');
if (hA < 0 || mA < 20) throw new Error('build-team-light2: team page structure not found');
const lightHeader = header(site, '/team.html', { overHero: false });

const t = content.team;
const fill = (m) => ({ ...m, photo: m.photo || '/assets/team/placeholder.jpg', bio: (m.bio && m.bio.length) ? m.bio : (m.group === 'leadership' ? m.bio : ['Bio coming soon.']) });
const by = (g) => t.members.filter(m => m.group === g).map(fill);
const H = Object.fromEntries(t.groups.map(g => [g.key, g.heading]));
const MAG = '#e8208f', TEAL = '#00a3af';

const intro = `
<div class="t2-intro">
  <p class="t2-script">${esc(t.intro.script)}</p>
  <h1 class="t2-h1">${esc(t.intro.heading)}</h1>
  <p class="t2-lead">${esc(t.intro.lead)}</p>
</div>`;
const head = (key, colour) => renderTeamHeading('script', H[key], { tag: 'h2', colour });
const cards = (list, offset = 0) => list.map((m, i) => coachCard(m, i + offset, 'lift')).join('');
const opsCards = (list) => list.map((m, i) => leaderCard(m, i)).join('');

// Shared section bodies, arranged differently per layout.
const coaches = () => `<div class="t2-grid g3">${cards(by('coach'))}</div>`;
const community = (cls = 'g6') => `<div class="t2-grid ${cls}">${cards(by('community'), 6)}</div>`;
const special = () => `<div class="t2-grid g2">${cards(by('specialized'), 3)}</div>`;
const ops = () => `<div class="t2-grid ops">${opsCards(by('leadership'))}</div>`;
const sec = (key, colour, body, cls = '') => `<section class="t2-sec ${cls}">${head(key, colour)}<div class="t2-body">${body}</div></section>`;

const OPTIONS = {
  sky: {
    label: 'G1 — Heaven’s light',
    note: 'The brand sky from the Statement of Faith behind the top of the page, so the heading opens on soft teal and blush light that fades to cream. Below it, the groups run centred one after another: Coaches 3-up, Community Coaches in one row of six, the two Specialized Roles side by side on a warm band, and the operations team as a row of small polaroids.',
    pick: true,
    body: () => `
      <div class="t2-sky" aria-hidden="true"><img src="/assets/photos/sky-wide.jpg" alt=""></div>
      ${intro}
      ${sec('coach', MAG, coaches())}
      ${sec('community', MAG, community())}
      ${sec('specialized', TEAL, special(), 'band')}
      ${sec('leadership', TEAL, ops())}`,
  },
  lights: {
    label: 'G2 — Event lights, side headings',
    note: 'The about page’s floating pink, teal and gold event lights across the whole page. Each group gets a magazine layout: its heading and headcount in a column on the left that stays in view as you scroll, the polaroids filling the right. Specialized Roles and the operations team share one row at the end.',
    body: () => `
      <div class="t2-lights" aria-hidden="true">${bokeh()}</div>
      ${intro}
      <div class="t2-side">${sideSec('coach', MAG, coaches(), 6)}${sideSec('community', MAG, community('g3s'), 6)}</div>
      <div class="t2-pair">${sec('specialized', TEAL, special())}${sec('leadership', TEAL, ops())}</div>`,
  },
  bands: {
    label: 'G3 — Pastel bands',
    note: 'Each group on its own soft colour band — blush for the coaches, mint for community, lavender for specialized roles, warm cream for operations — meeting on gentle waves rather than straight lines, so the page reads as four chapters of one team.',
    body: () => `
      ${intro}
      ${band('blush', sec('coach', MAG, coaches()))}
      ${band('mint', sec('community', MAG, community()))}
      ${band('lav', sec('specialized', TEAL, special()))}
      ${band('cream', sec('leadership', TEAL, ops()), true)}`,
  },
  aurora: {
    label: 'G4 — Aurora with a moving rail',
    note: 'Soft clouds of brand light drifting behind the page. The coaches lead in a 3-up grid; the Community Coaches drift past in a slow moving rail, like the testimonial videos on the homepage, pausing when you point at one; the Specialized Roles and the operations team follow centred.',
    body: () => `
      <div class="t2-aurora" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>
      ${intro}
      ${sec('coach', MAG, coaches())}
      <section class="t2-sec">${head('community', MAG)}<div class="t2-rail"><div class="t2-track">${cards(by('community'), 6)}${by('community').map((m, i) => coachCard(m, i + 6, 'lift').replace('<figure ', '<figure aria-hidden="true" ')).join('')}</div></div></section>
      ${sec('specialized', TEAL, special())}
      ${sec('leadership', TEAL, ops())}`,
  },
};

function sideSec(key, colour, body, n) {
  return `<section class="t2-sec side"><div class="t2-sticky">${head(key, colour)}<p class="t2-count">${n} women</p></div><div class="t2-body">${body}</div></section>`;
}
function band(tone, inner, last = false) {
  return `<div class="t2-band ${tone}">
    <svg class="t2-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40 C 260 0, 520 0, 760 30 C 1000 60, 1200 72, 1440 30 V0 H0 Z"/></svg>
    ${inner}</div>`;
}
function bokeh() {
  let seed = 11; const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const cols = ['232,32,143', '0,185,198', '228,190,120', '240,86,159']; let s = '';
  for (let i = 0; i < 34; i++) {
    const z = Math.round(24 + r() * 130), a = .14 + r() * .2, c = cols[i % 4];
    s += `<i style="left:${(r() * 100).toFixed(1)}%;top:${(r() * 100).toFixed(1)}%;width:${z}px;height:${z}px;background:radial-gradient(circle,rgba(${c},${a.toFixed(2)}),rgba(${c},${(a / 2).toFixed(2)}) 45%,transparent 70%);animation-duration:${(14 + r() * 16).toFixed(1)}s;animation-delay:${(-r() * 20).toFixed(1)}s"></i>`;
  }
  return s;
}

const CSS = `
body{background:#fff}
.t2{position:relative;overflow:hidden;color:#1c1c1c;padding-bottom:clamp(48px,6vw,96px);background:#fffdfb}
.t2 *{box-sizing:border-box}
.t2-intro{position:relative;z-index:2;max-width:46rem;margin:0 auto;padding:clamp(56px,7vw,104px) 20px clamp(16px,2vw,24px);text-align:center}
.t2-script{margin:0;font:400 clamp(40px,4.6vw,64px)/1 'Julietta Messie',cursive;color:#e8208f}
.t2-h1{margin:10px 0 0;font:800 clamp(34px,4.4vw,60px)/1.05 Montserrat,sans-serif;text-transform:uppercase;letter-spacing:-.01em}
.t2-lead{max-width:38rem;margin:18px auto 0;font:400 clamp(16px,1.35vw,18.5px)/1.7 Lato,sans-serif;color:#3a3a3a}
.t2-sec{position:relative;z-index:2;max-width:72rem;margin:0 auto;padding:clamp(40px,5vw,72px) 16px 0}
.t2-body{margin-top:clamp(24px,3vw,44px)}
.t2-grid{display:grid;align-items:start;gap:24px 14px}
.t2-grid.g3{grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:1024px){.t2-grid.g3{grid-template-columns:repeat(3,minmax(0,1fr));gap:56px 32px}}
.t2-grid.g6{grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:700px){.t2-grid.g6{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (min-width:1100px){.t2-grid.g6{grid-template-columns:repeat(6,minmax(0,1fr));gap:24px 20px}}
.t2-grid.g3s{grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:1024px){.t2-grid.g3s{grid-template-columns:repeat(3,minmax(0,1fr));gap:40px 24px}}
.t2-grid.g2{grid-template-columns:repeat(2,minmax(0,18rem));justify-content:center;gap:24px 40px}
.t2-grid.ops{grid-template-columns:repeat(3,minmax(0,1fr));gap:20px 12px;max-width:60rem;margin:0 auto}
@media (min-width:900px){.t2-grid.ops{grid-template-columns:repeat(6,minmax(0,1fr));gap:24px 20px}}
.t2-grid.ops .polaroid{max-width:9.5rem}
.t2-grid.g6 .polaroid{max-width:13rem}

/* captions recoloured for a light ground — the cards themselves are untouched */
.t2 .polaroid figcaption .text-white{color:#1c1c1c}
.t2 .polaroid [data-bio-open]{color:#dc1e88;--tw-ring-color:rgba(232,32,143,.35)}
.t2 .polaroid [data-bio-open]:hover{background:#e8208f;color:#fff}
.t2 .polaroid figcaption p[style*="#00b9c6"]{color:#00838d!important}
.t2 .polaroid-plate{box-shadow:0 26px 50px -26px rgba(28,28,28,.55),0 2px 6px rgba(28,28,28,.06)!important}

/* G1 — sky */
.t2-sky{position:absolute;left:0;right:0;top:0;height:900px;z-index:0;
  -webkit-mask-image:linear-gradient(#000 0%,#000 30%,transparent 100%);mask-image:linear-gradient(#000 0%,#000 30%,transparent 100%)}
.t2-sky img{width:100%;height:100%;object-fit:cover;opacity:.7}
.t2-sky::after{content:"";position:absolute;inset:0;background:radial-gradient(60% 50% at 50% 30%,rgba(255,255,255,.7),transparent 75%)}
.t2-sec.band{max-width:none;margin-top:clamp(40px,5vw,72px);padding-bottom:clamp(40px,5vw,72px);background:linear-gradient(180deg,transparent,#fbefe9 18%,#fbefe9 82%,transparent)}

/* G2 — lights + side headings */
.t2-lights{position:absolute;inset:0;z-index:0;pointer-events:none}
.t2-lights i{position:absolute;display:block;border-radius:50%;filter:blur(2px);animation:t2-float linear infinite}
@keyframes t2-float{0%{transform:translate(0,40px);opacity:0}15%{opacity:1}50%{transform:translate(18px,-60px)}85%{opacity:1}100%{transform:translate(-10px,-160px);opacity:0}}
@media (min-width:1024px){
  .t2-sec.side{display:grid;grid-template-columns:15rem 1fr;gap:48px;align-items:start}
  .t2-sec.side .t2-body{margin-top:0}
  .t2-sticky{position:sticky;top:120px;text-align:left}
  .t2-sticky .text-center{text-align:left}
}
.t2-count{margin:14px 0 0;font:700 11px/1.4 Lato,sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#6b6b6b}
@media (max-width:1023px){.t2-count{text-align:center}}
.t2-pair{position:relative;z-index:2;max-width:76rem;margin:0 auto;display:grid;gap:0}
@media (min-width:1100px){.t2-pair{grid-template-columns:.8fr 1.2fr;align-items:start}.t2-pair .t2-grid.ops{grid-template-columns:repeat(3,minmax(0,1fr))}}

/* G3 — pastel bands */
.t2-band{position:relative;margin-top:clamp(32px,4vw,56px);padding-bottom:clamp(48px,6vw,80px)}
.t2-band .t2-sec{padding-top:clamp(56px,6vw,88px)}
.t2-wave{position:absolute;left:0;right:0;top:-1px;width:100%;height:clamp(28px,4vw,60px);fill:#fffdfb}
.t2-band.blush{background:linear-gradient(180deg,#fdeef4,#fbe4ee)}
.t2-band.mint{background:linear-gradient(180deg,#e8f7f8,#dcf2f3)}.t2-band.mint .t2-wave{fill:#fbe4ee}
.t2-band.lav{background:linear-gradient(180deg,#f1ecf8,#ebe4f5)}.t2-band.lav .t2-wave{fill:#dcf2f3}
.t2-band.cream{background:linear-gradient(180deg,#fbf3e8,#fffdfb)}.t2-band.cream .t2-wave{fill:#ebe4f5}
.t2-bands,.tl2-bands{padding-bottom:0}

/* G4 — aurora + rail */
.t2-aurora{position:absolute;inset:0;z-index:0;pointer-events:none}
.t2-aurora i{position:absolute;display:block;border-radius:50%;filter:blur(80px);animation:t2-drift 30s ease-in-out infinite alternate}
.t2-aurora .a1{left:-14%;top:2%;width:760px;height:760px;background:radial-gradient(circle,rgba(232,32,143,.26),transparent 65%)}
.t2-aurora .a2{right:-16%;top:30%;width:760px;height:760px;background:radial-gradient(circle,rgba(0,185,198,.24),transparent 65%);animation-duration:36s}
.t2-aurora .a3{left:10%;bottom:0;width:720px;height:720px;background:radial-gradient(circle,rgba(228,190,120,.22),transparent 65%);animation-duration:33s}
@keyframes t2-drift{to{transform:translate(10vw,6%) scale(1.12)}}
.t2-rail{overflow:hidden;margin:clamp(24px,3vw,44px) -16px 0;padding:16px 0 8px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.t2-track{display:flex;gap:28px;width:max-content;animation:t2-rail 60s linear infinite}
.t2-rail:hover .t2-track,.t2-rail:focus-within .t2-track{animation-play-state:paused}
.t2-track .polaroid{flex:none;width:12rem}
@keyframes t2-rail{to{transform:translateX(calc(-50% - 14px))}}

@media (prefers-reduced-motion:reduce){.t2 *{animation:none!important}.t2-rail{overflow-x:auto}}`;

for (const [k, o] of Object.entries(OPTIONS)) {
  const mainHtml = `<div class="t2 t2v-${k} ${effectClass('lift')}">${o.body()}</div>`;
  const html = page0.slice(0, hA) + lightHeader + page0.slice(hB, mA) + mainHtml + page0.slice(mB);
  fs.writeFileSync(path.join(dist, `t2-${k}.html`), html
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/t2-${k}.html" target="_blank" rel="noopener">Open full page ↗</a> — click “Read bio” inside a preview to see the lift</p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1300"><iframe src="/t2-${k}.html" title="${esc(o.label)}" loading="lazy" width="1440" height="1300"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="1100"><iframe src="/t2-${k}.html" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="1100"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const gallery = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meet the Team — light, round two — ${esc(site.brand.name)}</title>
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
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; color:var(--soft); }
.links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 280px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:280px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>Meet the Team — light, round two</h1>
  <p class="lead">The polaroid cards and the bio “lift” animation are exactly as they are now — only the background and
     the layout change. The page opens with your client’s heading, the first group is “Coaches”, and the operations team
     are the same polaroids at a smaller size. New people show a placeholder until their photos and bios arrive.</p>
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
</body></html>`;

fs.writeFileSync(path.join(dist, 'team-light2-options.html'), gallery);
console.log('built dist/team-light2-options.html + ' + Object.keys(OPTIONS).length + ' frames');

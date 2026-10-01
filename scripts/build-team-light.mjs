// Builds /team-light-options.html — Meet the Team rebuilt light, with the two
// new groups (Community Coaches, Specialized Roles) between the RUQ Coaches
// and the Leadership (operations) team, and the operations portraits small.
//
// Each option is the real team page with the header switched to its standard
// light mode and the main content replaced. The eight new people have no
// photographs or bios yet (content.json marks them _pending); they show a
// brand-gradient placeholder with their initials, and "Read bio" opens a
// "coming soon" note. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';
import { header } from '../src/partials/nav.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const page0 = fs.readFileSync(path.join(dist, 'team.html'), 'utf8');
const hA = page0.indexOf('<header'), hB = page0.indexOf('</header>') + '</header>'.length;
const mA = page0.indexOf('<main id="main">') + '<main id="main">'.length, mB = page0.indexOf('</main>');
if (hA < 0 || mA < 20) throw new Error('build-team-light: team page structure not found');
const lightHeader = header(site, '/team.html', { overHero: false });

const t = content.team;
const by = (g) => t.members.filter(m => m.group === g);
const G = Object.fromEntries(t.groups.map(g => [g.key, g.heading]));
const initials = (n) => n.split(/\s+/).map(w => w[0]).slice(0, 2).join('');
const bioData = (m) => m.bio && m.bio.length ? esc(JSON.stringify(m.bio)) : '';
const bioBtn = (m, cls = '') => (m.group === 'leadership') ? '' :
  `<button type="button" class="tl-bio ${cls}" data-bio='${bioData(m)}' data-name="${esc(m.name)}" data-role="${esc(m.role)}">Read bio<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`;
const img = (m, cls = '') => m.photo
  ? `<img class="${cls}" src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy" decoding="async">`
  : `<span class="tl-ph ${cls}" role="img" aria-label="${esc(m.name)} — photo coming soon"><span>${esc(initials(m.name))}</span></span>`;

const heading = (kicker, word, tone = 'm') => `<div class="tl-head ${tone}"><p class="tl-kick">${esc(kicker)}</p><h2 class="tl-script">${esc(word)}</h2></div>`;
const split = (h) => { const p = h.split(' '); return [p.slice(0, -1).join(' ') || '', p.slice(-1)[0]]; };
const sectionHead = (key, tone) => { const [a, b] = split(G[key]); return heading(a, b, tone); };

// --- per-design card renderers -------------------------------------------
const OPTIONS = {
  gallery: {
    label: 'F1 — Gallery wall',
    note: 'The page’s polaroids, taken light: white-framed prints on warm cream, each slightly tilted and straightening when you point at it. RUQ coaches large, community coaches a size down, the two specialized roles as wider landscape prints with their role on a ribbon, and the operations team as a neat row of small round portraits.',
    pick: true,
    card: (m, i, size) => `
      <figure class="g-card ${size}" style="--tilt:${[-3, 2, -1.5, 3, -2.5, 1.5, -2, 2.5][i % 8]}deg">
        <div class="g-frame">${img(m, 'g-img')}</div>
        <figcaption><p class="tl-name">${esc(m.name)}</p><p class="tl-role">${esc(m.role)}</p>${bioBtn(m)}</figcaption>
      </figure>`,
    special: (m, i) => `
      <figure class="g-wide" style="--tilt:${i ? 1.5 : -1.5}deg">
        <div class="g-frame">${img(m, 'g-img')}</div>
        <figcaption><span class="g-ribbon">${esc(m.role)}</span><p class="tl-name">${esc(m.name)}</p>${bioBtn(m)}</figcaption>
      </figure>`,
  },
  arch: {
    label: 'F2 — Arches',
    note: 'Every portrait in a tall arch, matching the Jessica Lewis feature on the about page, over a soft teal-to-blush fill. Community coaches in smaller arches, the specialized roles as two wide cards with the arch on the left and the role and bio button on the right, and operations as small circles. The most graceful.',
    card: (m, i, size) => `
      <figure class="a-card ${size}">
        <div class="a-arch">${img(m, 'a-img')}</div>
        <figcaption><p class="tl-name">${esc(m.name)}</p><p class="tl-role">${esc(m.role)}</p>${bioBtn(m)}</figcaption>
      </figure>`,
    special: (m) => `
      <figure class="a-wide">
        <div class="a-arch">${img(m, 'a-img')}</div>
        <figcaption><p class="tl-role">${esc(m.role)}</p><p class="tl-name big">${esc(m.name)}</p>${bioBtn(m)}</figcaption>
      </figure>`,
  },
  editorial: {
    label: 'F3 — Editorial cards',
    note: 'Your client’s card, refined: rounded portraits with the name set over the bottom of the photo on a soft dark fade, a pink-to-teal edge that lights up as you hover, and the card lifting off the page. Clean white ground, script headings. Operations as compact strips — small square photo, name and title — three across.',
    card: (m, i, size) => `
      <figure class="e-card ${size}">
        <div class="e-photo">${img(m, 'e-img')}<p class="e-name">${esc(m.name)}</p></div>
        <figcaption><p class="tl-role">${esc(m.role)}</p>${bioBtn(m)}</figcaption>
      </figure>`,
    special: (m) => `
      <figure class="e-card e-feature">
        <div class="e-photo">${img(m, 'e-img')}<p class="e-name">${esc(m.name)}</p></div>
        <figcaption><p class="tl-role">${esc(m.role)}</p>${bioBtn(m)}</figcaption>
      </figure>`,
  },
  halo: {
    label: 'F4 — Halo portraits',
    note: 'Light and airy over soft drifting pink and teal light. Each coach is a portrait card on a pastel tint with a thin glowing ring that turns slowly when you hover. The specialized roles sit in a highlighted band of their own, and the operations team are small circular portraits with a pink-to-teal ring, like an orbit.',
    card: (m, i, size) => `
      <figure class="h-card ${size} ${i % 2 ? 't' : 'p'}">
        <div class="h-ring">${img(m, 'h-img')}</div>
        <figcaption><p class="tl-name">${esc(m.name)}</p><p class="tl-role">${esc(m.role)}</p>${bioBtn(m)}</figcaption>
      </figure>`,
    special: (m, i) => `
      <figure class="h-card lg ${i % 2 ? 't' : 'p'}">
        <div class="h-ring">${img(m, 'h-img')}</div>
        <figcaption><p class="tl-role">${esc(m.role)}</p><p class="tl-name">${esc(m.name)}</p>${bioBtn(m)}</figcaption>
      </figure>`,
  },
};

// Operations: small in every design, styled per design.
const ops = (k, m) => {
  if (k === 'editorial') return `<figure class="o-strip">${img(m, 'o-sq')}<figcaption><p class="tl-name sm">${esc(m.name)}</p><p class="tl-role">${esc(m.role)}</p></figcaption></figure>`;
  return `<figure class="o-dot ${k}">${img(m, 'o-img')}<figcaption><p class="tl-name sm">${esc(m.name)}</p><p class="tl-role">${esc(m.role)}</p></figcaption></figure>`;
};

const main = (k, o) => `
<div class="tl tl-${k}">
  ${k === 'halo' ? '<span class="h-orb o1" aria-hidden="true"></span><span class="h-orb o2" aria-hidden="true"></span><span class="h-orb o3" aria-hidden="true"></span>' : ''}
  <section class="tl-sec">
    <div class="tl-head m"><p class="tl-kick">Meet the</p><h1 class="tl-script">Team</h1></div>
    ${sectionHead('coach', 'm')}
    <div class="tl-grid g3">${by('coach').map((m, i) => o.card(m, i, 'lg')).join('')}</div>
  </section>
  <section class="tl-sec band">
    ${sectionHead('community', 'm')}
    <div class="tl-grid g6">${by('community').map((m, i) => o.card(m, i + 2, 'md')).join('')}</div>
  </section>
  <section class="tl-sec">
    ${sectionHead('specialized', 'c')}
    <div class="tl-grid g2">${by('specialized').map((m, i) => o.special(m, i)).join('')}</div>
  </section>
  <section class="tl-sec band">
    ${sectionHead('leadership', 'c')}
    <div class="tl-ops ${k === 'editorial' ? 'strips' : ''}">${by('leadership').map(m => ops(k, m)).join('')}</div>
  </section>
</div>
<dialog class="tl-dlg" aria-labelledby="tl-dlg-name"><button type="button" class="tl-x" aria-label="Close">×</button><p class="tl-role" id="tl-dlg-role"></p><h3 class="tl-name big" id="tl-dlg-name"></h3><div class="tl-dlg-body"></div></dialog>`;

const CSS = `
body{background:#fff}
.tl{position:relative;overflow:hidden;color:#1c1c1c;text-align:center;background:linear-gradient(180deg,#fff 0%,#fdf6f1 30%,#fff 60%,#fdf6f1 85%,#fff 100%)}
.tl *{box-sizing:border-box}.tl p{margin:0}.tl figure{margin:0}
.tl-sec{position:relative;z-index:1;max-width:72rem;margin:0 auto;padding:clamp(48px,6vw,88px) 16px}
.tl-sec.band{max-width:none}
.tl-sec.band>*{max-width:72rem;margin-left:auto;margin-right:auto}
.tl-head{margin:0 auto clamp(28px,4vw,48px)}
.tl-sec:first-child .tl-head:first-child{margin-bottom:clamp(40px,5vw,64px)}
.tl-kick{font:700 12px/1.4 Lato,sans-serif;letter-spacing:.38em;text-transform:uppercase;color:#5a5a5a;padding-left:.38em}
.tl-script{margin:12px 0 0;font:400 clamp(48px,6vw,84px)/1 'Julietta Messie',cursive;color:#e8208f}
.tl-head.c .tl-script{color:#00a3af}
h1.tl-script{font-size:clamp(64px,8vw,112px)}
.tl-name{font:700 clamp(14px,1.2vw,17px)/1.25 Montserrat,sans-serif;color:#1c1c1c}
.tl-name.sm{font-size:13.5px}.tl-name.big{font-size:clamp(20px,2vw,26px)}
.tl-role{margin-top:4px!important;font:700 10px/1.4 Lato,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#dc1e88}
.tl-head.c~* .tl-role,.tl-ops .tl-role{color:#00838d}
.tl-bio{display:inline-flex;align-items:center;gap:6px;min-height:36px;margin-top:8px;padding:0 14px;border:0;border-radius:999px;cursor:pointer;
  background:transparent;box-shadow:inset 0 0 0 1px rgba(232,32,143,.35);font:700 10px/1 Lato,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#dc1e88;transition:background .2s,color .2s}
.tl-bio:hover{background:#e8208f;color:#fff}
.tl-grid{display:grid;gap:clamp(18px,2.4vw,36px) clamp(14px,2vw,28px);justify-content:center}
.tl-grid.g3{grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:900px){.tl-grid.g3{grid-template-columns:repeat(3,minmax(0,18rem))}}
.tl-grid.g6{grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:700px){.tl-grid.g6{grid-template-columns:repeat(3,minmax(0,14rem))}}
@media (min-width:1100px){.tl-grid.g6{grid-template-columns:repeat(6,minmax(0,1fr))}}
.tl-grid.g2{grid-template-columns:minmax(0,1fr)}
@media (min-width:800px){.tl-grid.g2{grid-template-columns:repeat(2,minmax(0,26rem))}}
.tl-ph.tl-ph{display:grid;place-items:center;width:100%;background:linear-gradient(150deg,#a7dfe4,#dfd3e6 55%,#f7c7dc)}
.tl-ph span{font:400 clamp(30px,3vw,48px)/1 'Cormorant Garamond',Georgia,serif;color:rgba(255,255,255,.95);letter-spacing:.04em}
.tl-ops{display:flex;flex-wrap:wrap;justify-content:center;gap:28px 36px}
.o-dot{width:132px}
.o-img{display:block;width:96px;height:96px;margin:0 auto 10px;border-radius:50%;object-fit:cover;object-position:50% 18%;box-shadow:0 14px 30px -16px rgba(28,28,28,.5)}
.o-dot .tl-ph.o-img span{font-size:28px}

/* F1 — gallery wall */
.g-card,.g-wide{transform:rotate(var(--tilt));transition:transform .5s cubic-bezier(.22,1,.36,1)}
.g-card:hover,.g-wide:hover,.g-card:focus-within,.g-wide:focus-within{transform:rotate(0) translateY(-4px)}
.g-frame{padding:8px 8px 10px;background:#fff;border-radius:3px;box-shadow:0 26px 50px -26px rgba(28,28,28,.55),0 2px 6px rgba(28,28,28,.06)}
.g-img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;object-position:50% 18%}
.g-card.md .g-frame{padding:6px 6px 8px}
.g-card figcaption,.g-wide figcaption{margin-top:12px}
.g-wide .g-img{aspect-ratio:4/3}
.g-ribbon{display:inline-block;margin-bottom:8px;padding:5px 14px;background:#00b9c6;color:#fff;font:700 10px/1.3 Lato,sans-serif;letter-spacing:.18em;text-transform:uppercase;clip-path:polygon(0 0,100% 0,96% 50%,100% 100%,0 100%,4% 50%)}
.tl-gallery .o-img{border:4px solid #fff}

/* F2 — arches */
.a-arch{position:relative;overflow:hidden;border-radius:999px 999px 18px 18px;background:linear-gradient(160deg,#a7dfe4,#dff2f3 45%,#fbe3ee);box-shadow:0 28px 54px -30px rgba(28,28,28,.5)}
.a-arch::after{content:"";position:absolute;inset:6px;border-radius:999px 999px 14px 14px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.7);pointer-events:none}
.a-img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;object-position:50% 18%}
.a-card figcaption{margin-top:14px}
.a-wide{display:grid;grid-template-columns:150px 1fr;gap:22px;align-items:center;padding:18px;text-align:left;border-radius:26px;background:#fff;box-shadow:inset 0 0 0 1px rgba(0,185,198,.2),0 30px 60px -36px rgba(0,131,141,.5)}
.a-wide .tl-role{margin:0 0 4px!important}
.tl-arch .o-img{box-shadow:0 0 0 3px #fff,0 0 0 4px rgba(0,185,198,.4),0 14px 30px -16px rgba(28,28,28,.5)}

/* F3 — editorial */
.e-card{transition:transform .4s cubic-bezier(.22,1,.36,1)}
.e-card:hover{transform:translateY(-6px)}
.e-photo{position:relative;overflow:hidden;border-radius:22px;box-shadow:0 26px 50px -30px rgba(28,28,28,.55);isolation:isolate}
.e-photo::before{content:"";position:absolute;inset:0;z-index:2;border-radius:inherit;padding:2px;background:linear-gradient(135deg,#e8208f,#00b9c6);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);opacity:0;transition:opacity .4s}
.e-card:hover .e-photo::before{opacity:1}
.e-img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;object-position:50% 18%}
.e-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.65),transparent 45%)}
.e-name{position:absolute;left:14px;right:14px;bottom:12px;z-index:1;text-align:left;font:700 clamp(13px,1.2vw,16px)/1.2 Montserrat,sans-serif;color:#fff}
.e-card figcaption{margin-top:10px}
.e-feature .e-img{aspect-ratio:4/3}
.tl-ops.strips{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;max-width:62rem}
@media (min-width:700px){.tl-ops.strips{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1000px){.tl-ops.strips{grid-template-columns:repeat(3,minmax(0,1fr))}}
.o-strip{display:flex;align-items:center;gap:14px;padding:10px;text-align:left;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 1px rgba(28,28,28,.06),0 14px 30px -22px rgba(28,28,28,.4)}
.o-sq{flex:none;display:block;width:64px;height:64px;border-radius:12px;object-fit:cover;object-position:50% 18%}
.o-strip .tl-ph.o-sq span{font-size:22px}

/* F4 — halo */
.h-orb{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;animation:h-drift 28s ease-in-out infinite alternate}
.h-orb.o1{left:-12%;top:4%;width:620px;height:620px;background:radial-gradient(circle,rgba(232,32,143,.22),transparent 65%)}
.h-orb.o2{right:-14%;top:36%;width:640px;height:640px;background:radial-gradient(circle,rgba(0,185,198,.2),transparent 65%);animation-duration:34s}
.h-orb.o3{left:20%;bottom:-6%;width:600px;height:600px;background:radial-gradient(circle,rgba(240,86,159,.16),transparent 65%);animation-duration:31s}
@keyframes h-drift{to{transform:translate(8vw,6%) scale(1.12)}}
.h-card{padding:12px 12px 16px;border-radius:24px;background:rgba(255,255,255,.75);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 24px 50px -32px rgba(28,28,28,.4)}
.h-ring{position:relative;padding:3px;border-radius:18px;overflow:hidden;isolation:isolate}
.h-ring::before{content:"";position:absolute;left:50%;top:50%;width:200%;aspect-ratio:1;z-index:-1;translate:-50% -50%;background:conic-gradient(#f7c7dc,#a7dfe4,#f7c7dc);transition:rotate 1.2s ease}
.h-card:hover .h-ring::before{rotate:180deg}
.h-img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;object-position:50% 18%;border-radius:15px}
.h-card figcaption{margin-top:12px}
.h-card.p{background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(253,234,243,.85))}
.h-card.t{background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(229,248,250,.85))}
.h-card.lg .h-img{aspect-ratio:4/3}
.tl-halo .o-img{padding:3px;background:linear-gradient(135deg,#e8208f,#00b9c6)}

/* bio dialog */
.tl-dlg{max-width:min(560px,92vw);padding:34px 30px;border:0;border-radius:24px;box-shadow:0 40px 90px -30px rgba(0,0,0,.5);text-align:left}
.tl-dlg::backdrop{background:rgba(28,28,28,.55);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
.tl-dlg-body p{margin:12px 0 0;font:400 15.5px/1.7 Lato,sans-serif;color:#3a3a3a}
.tl-x{position:absolute;top:12px;right:12px;width:40px;height:40px;border:0;border-radius:50%;background:#f5f0ee;font:400 24px/1 sans-serif;cursor:pointer}
@media (prefers-reduced-motion:reduce){.tl *{transition:none!important;animation:none!important}}`;

const JS = `<script>
(function(){var d=document.querySelector('.tl-dlg');if(!d||!d.showModal)return;
document.querySelectorAll('.tl-bio').forEach(function(b){b.addEventListener('click',function(){
  var bio=[];try{bio=JSON.parse(b.getAttribute('data-bio')||'[]')}catch(e){}
  d.querySelector('#tl-dlg-name').textContent=b.dataset.name;d.querySelector('#tl-dlg-role').textContent=b.dataset.role;
  var body=d.querySelector('.tl-dlg-body');body.innerHTML='';
  (bio.length?bio:['Bio coming soon.']).forEach(function(t){var p=document.createElement('p');p.textContent=t;body.appendChild(p);});
  d.showModal();});});
d.querySelector('.tl-x').addEventListener('click',function(){d.close()});d.addEventListener('click',function(e){if(e.target===d)d.close()});})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  const html = page0.slice(0, hA) + lightHeader + page0.slice(hB, mA) + main(k, o) + page0.slice(mB);
  fs.writeFileSync(path.join(dist, `tl-${k}.html`), html
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
    .replace('</body>', `${JS}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/tl-${k}.html" target="_blank" rel="noopener">Open full page ↗</a> — scroll inside the previews to see all four groups</p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="1300"><iframe src="/tl-${k}.html" title="${esc(o.label)}" loading="lazy" width="1440" height="1300"></iframe></div><figcaption>Desktop · 1440 wide</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="1100"><iframe src="/tl-${k}.html" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="1100"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const gallery = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meet the Team — light — ${esc(site.brand.name)}</title>
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
  <h1>Meet the Team — light, with the new groups</h1>
  <p class="lead">Four light designs for the whole page: RUQ Coaches, then the new <strong>Community Coaches</strong> and
     <strong>Specialized Roles</strong>, then the operations team with small portraits. The eight new people show a placeholder
     with their initials until you send their photos and bios; “Read bio” works for the existing coaches and says “coming soon”
     for the new ones.</p>
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

fs.writeFileSync(path.join(dist, 'team-light-options.html'), gallery);
console.log('built dist/team-light-options.html + ' + Object.keys(OPTIONS).length + ' frames');

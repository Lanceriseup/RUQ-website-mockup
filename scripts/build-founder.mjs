// Builds /founder-options.html — a Jessica Lewis feature on the about page,
// between the hero and "The journey doesn't end…", in four treatments.
//
// Copy is content.json about.founder, from the client's mockup. The photo is
// her headshot (warm bulbs behind her), the signature her own mark — an ink
// copy (signature-jl-ink.png) was made from the white one for light grounds.
//
// The journey block is a rounded panel that lifts over the hero. Light
// options open that panel; the dark option sits between the hero and the
// panel, and the panel lifts over its foot. Must run after scripts/build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
// The shipped feature is removed first, so each preview shows only its option.
const about = fs.readFileSync(path.join(dist, 'about.html'), 'utf8')
  .replace(/<section id="founder"[\s\S]*?<\/section>/, '');

const main = about.indexOf('<main');
const heroEnd = about.indexOf('</section>', main) + '</section>'.length;
const panel = about.indexOf('<div class="relative z-10 -mt-6 sm:-mt-16">', heroEnd);
if (panel < 0) throw new Error('build-founder: journey panel not found in dist/about.html');
// The panel opens with an absolutely positioned ground (with nested orbs) and
// the drag handle; its flowing content starts after the handle. Light options
// go there, so they sit on the panel's ground at its top.
const handle = about.indexOf('<span aria-hidden="true" class="absolute left-1/2 top-4 z-20', panel);
if (handle < 0) throw new Error('build-founder: panel handle not found');
const panelGroundEnd = about.indexOf('</span>', handle) + '</span>'.length;

const f = content.about.founder;
const Q = (cls = '') => `<blockquote class="jf-q ${cls}"><span class="jf-qm" aria-hidden="true">“</span>${esc(f.quote)}</blockquote>`;

const OPTIONS = {
  lit: {
    label: 'A — Lit portrait',
    where: 'before',
    note: 'Dark and cinematic, built on her photograph’s own warm bulbs: the portrait fills the right half and dissolves into the dark, amber light glows behind her, and on the left her name is set large in serif under a pink script, with the quote in big italic-style serif and her signature in white. The journey panel lifts over its foot as it does over the hero.',
    pick: true,
    html: `
<section class="jf jf-a" data-jf id="founder">
  <div class="jf-photo" aria-hidden="true"><img src="${esc(f.photo)}" alt=""></div>
  <span class="jf-amber" aria-hidden="true"></span>
  <div class="jf-in">
    <div class="jf-copy">
      <p class="jf-script">${esc(f.eyebrow)}</p>
      <h2 class="jf-name">${esc(f.name)}</h2>
      <p class="jf-role">${esc(f.role)}</p>
      <p class="jf-p">${esc(f.intro)}</p>
      ${Q()}
      <p class="jf-p">${esc(f.body)}</p>
      <img class="jf-sig" src="${esc(f.signatureLight)}" alt="Jessica Lewis" width="486" height="179">
    </div>
    <img class="jf-mobile-photo" src="${esc(f.photo)}" alt="Jessica Lewis, founder of Rise Up Queens">
  </div>
</section>`,
  },
  cover: {
    label: 'B — Magazine cover',
    where: 'inside',
    note: 'Light and editorial: her portrait in a tall arched frame with a pink-to-teal ring offset behind it, and JESSICA written enormous in outline across the background. The quote is the hero of the text — oversized, with a giant pink quotation mark — and her signature writes itself in as the section arrives.',
    html: `
<section class="jf jf-b" data-jf id="founder">
  <span class="jf-wm" aria-hidden="true">Jessica</span>
  <div class="jf-grid">
    <figure class="jf-arch"><span class="ring" aria-hidden="true"></span><img src="${esc(f.photo)}" alt="Jessica Lewis, founder of Rise Up Queens" loading="lazy"></figure>
    <div class="jf-copy">
      <p class="jf-script">${esc(f.eyebrow)}</p>
      <h2 class="jf-name">${esc(f.name)}</h2>
      <p class="jf-role">${esc(f.role)}</p>
      <p class="jf-p">${esc(f.intro)}</p>
      ${Q('big')}
      <p class="jf-p">${esc(f.body)}</p>
      <img class="jf-sig write" src="${esc(f.signature)}" alt="Jessica Lewis" width="486" height="179">
    </div>
  </div>
</section>`,
  },
  quote: {
    label: 'C — Her words first',
    where: 'inside',
    note: 'Opens on the quote alone, centred and huge in serif, each phrase rising in. Beneath it a single card: her portrait in a circle with a slowly turning pink-and-teal ring, her name and role, and the story in two columns, signed. The most emotional — it leads with her voice, then introduces her.',
    html: `
<section class="jf jf-c" data-jf id="founder">
  <div class="jf-in">
    <p class="jf-script">${esc(f.eyebrow)}</p>
    ${Q('hero')}
    <div class="jf-card">
      <div class="jf-who">
        <span class="jf-avatar"><i aria-hidden="true"></i><img src="${esc(f.photo)}" alt="Jessica Lewis" loading="lazy"></span>
        <div><h2 class="jf-name">${esc(f.name)}</h2><p class="jf-role">${esc(f.role)}</p></div>
      </div>
      <div class="jf-cols"><p class="jf-p">${esc(f.intro)}</p><p class="jf-p">${esc(f.body)}</p></div>
      <img class="jf-sig" src="${esc(f.signature)}" alt="Jessica Lewis signature" width="486" height="179">
    </div>
  </div>
</section>`,
  },
  split: {
    label: 'D — Split screen',
    where: 'inside',
    note: 'Her photograph runs edge to edge down the left half, full height; the right half is white, with the copy and a pink brush stroke under the quote. A thin pink-to-teal seam glows where the two halves meet. Bold and simple, like a feature spread.',
    html: `
<section class="jf jf-d" data-jf id="founder">
  <div class="jf-half"><img src="${esc(f.photo)}" alt="Jessica Lewis, founder of Rise Up Queens" loading="lazy"></div>
  <div class="jf-copy">
    <p class="jf-script">${esc(f.eyebrow)}</p>
    <h2 class="jf-name">${esc(f.name)}</h2>
    <p class="jf-role">${esc(f.role)}</p>
    <p class="jf-p">${esc(f.intro)}</p>
    ${Q('brush')}
    <p class="jf-p">${esc(f.body)}</p>
    <img class="jf-sig" src="${esc(f.signature)}" alt="Jessica Lewis" width="486" height="179">
  </div>
</section>`,
  },
};

const CSS = `
.jf{position:relative;overflow:hidden;color:#1c1c1c}
.jf *{box-sizing:border-box}.jf p,.jf blockquote{margin:0}
.jf-script{font:400 clamp(34px,3.4vw,48px)/1 'Julietta Messie',cursive;color:#e8208f}
.jf-name{margin:4px 0 0;font:600 clamp(40px,4.6vw,64px)/1.02 'Cormorant Garamond',Georgia,serif;letter-spacing:-.005em}
.jf-role{margin-top:8px!important;font:700 11px/1.4 Lato,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#00838d}
.jf-p{margin-top:18px!important;font:400 clamp(15.5px,1.2vw,17px)/1.75 Lato,sans-serif;color:#3a3a3a;max-width:36rem}
.jf-q{position:relative;margin-top:26px!important;padding-left:0;font:500 clamp(24px,2.4vw,32px)/1.3 'Cormorant Garamond',Georgia,serif;color:#1c1c1c;max-width:34rem}
.jf-qm{position:absolute;left:-.55em;top:-.28em;font-size:2.2em;line-height:1;color:#e8208f;opacity:.85}
.jf-sig{display:block;width:170px;height:auto;margin-top:22px}

/* A — lit portrait */
.jf-a{padding:clamp(96px,11vw,150px) 0 calc(clamp(96px,11vw,150px) + 64px);background:#141110;color:#F7F2E8}
.jf-a .jf-photo{position:absolute;top:0;bottom:0;right:0;width:56%;
  -webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 38%),linear-gradient(transparent,#000 12%,#000 85%,transparent);-webkit-mask-composite:source-in;
  mask-image:linear-gradient(90deg,transparent 0%,#000 38%),linear-gradient(transparent,#000 12%,#000 85%,transparent);mask-composite:intersect}
.jf-a .jf-photo img{width:100%;height:100%;object-fit:cover;object-position:50% 22%}
.jf-amber{position:absolute;left:38%;top:20%;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(255,170,90,.22),transparent 65%);pointer-events:none}
.jf-a .jf-in{position:relative;z-index:2;max-width:74rem;margin:0 auto;padding:0 24px}
.jf-a .jf-copy{max-width:34rem}
.jf-a .jf-name{color:#fff}
.jf-a .jf-role{color:#7cd6dc}
.jf-a .jf-p{color:rgba(247,242,232,.78)}
.jf-a .jf-q{color:#fff;padding-left:.2em}
.jf-a .jf-qm{color:#f0569f}
.jf-mobile-photo{display:none}
@media (max-width:899px){
  .jf-a .jf-photo{display:none}.jf-amber{left:50%;transform:translateX(-50%)}
  .jf-a .jf-copy{margin:0 auto;text-align:center}.jf-a .jf-p,.jf-a .jf-q{margin-left:auto;margin-right:auto}.jf-a .jf-sig{margin-left:auto;margin-right:auto}.jf-qm{position:static;display:block;height:.5em}
  .jf-mobile-photo{display:block;width:min(320px,80%);margin:34px auto 0;border-radius:24px;aspect-ratio:4/5;object-fit:cover;object-position:50% 20%;box-shadow:0 30px 60px -30px rgba(255,160,80,.5)}
}

/* B — magazine cover */
.jf-b{padding:clamp(80px,9vw,128px) 24px}
.jf-wm{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);white-space:nowrap;pointer-events:none;
  font:900 clamp(140px,22vw,360px)/1 Montserrat,sans-serif;letter-spacing:-.03em;text-transform:uppercase;color:transparent;-webkit-text-stroke:1.5px rgba(232,32,143,.12)}
.jf-grid{position:relative;max-width:70rem;margin:0 auto;display:grid;gap:48px;align-items:center}
@media (min-width:900px){.jf-grid{grid-template-columns:.85fr 1fr;gap:80px}}
.jf-arch{position:relative;margin:0 auto;width:min(420px,100%)}
.jf-arch img{position:relative;display:block;width:100%;aspect-ratio:4/5;object-fit:cover;object-position:50% 20%;border-radius:999px 999px 28px 28px;box-shadow:0 40px 80px -40px rgba(28,28,28,.6)}
.jf-arch .ring{position:absolute;inset:0;transform:translate(18px,18px);border-radius:999px 999px 28px 28px;background:linear-gradient(150deg,#e8208f,#00b9c6);opacity:.9}
.jf-q.big{font-size:clamp(28px,3vw,40px)}
.jf-q.big .jf-qm{font-size:3.4em;top:-.42em;left:-.48em;opacity:.25}
@media (max-width:899px){.jf-b .jf-copy{text-align:center}.jf-b .jf-p,.jf-b .jf-q{margin-left:auto;margin-right:auto}.jf-b .jf-sig{margin:22px auto 0}.jf-b .jf-qm{left:50%;transform:translateX(-50%)}}
.jf-sig.write{clip-path:inset(-10% 100% -10% -5%);transition:clip-path 1.8s cubic-bezier(.45,0,.2,1) .4s}
.jf.is-in .jf-sig.write{clip-path:inset(-10% -5% -10% -5%)}

/* C — her words first */
.jf-c{padding:clamp(80px,9vw,128px) 20px;text-align:center}
.jf-c .jf-in{max-width:62rem;margin:0 auto}
.jf-q.hero{margin:18px auto 0!important;max-width:52rem;font-size:clamp(32px,4.2vw,58px);line-height:1.18}
.jf-q.hero .jf-qm{position:static;display:block;height:.42em;font-size:2.2em;line-height:.9}
.jf-c .jf-q{opacity:0;transform:translateY(16px);transition:opacity 1s ease,transform 1s cubic-bezier(.22,1,.36,1)}
.jf-c.is-in .jf-q{opacity:1;transform:none}
.jf-card{position:relative;margin:48px auto 0;max-width:60rem;padding:clamp(28px,4vw,44px);border-radius:28px;background:#fff;text-align:left;
  box-shadow:inset 0 0 0 1px rgba(28,28,28,.06),0 40px 80px -50px rgba(232,32,143,.55)}
.jf-who{display:flex;align-items:center;gap:20px}
.jf-avatar{position:relative;flex:none;width:96px;height:96px}
.jf-avatar i{position:absolute;inset:-5px;border-radius:50%;background:conic-gradient(#e8208f,#00b9c6,#f0569f,#e8208f);animation:jf-spin 9s linear infinite}
.jf-avatar img{position:relative;width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:50% 22%;border:4px solid #fff}
@keyframes jf-spin{to{transform:rotate(360deg)}}
.jf-c .jf-name{font-size:clamp(32px,3.2vw,44px)}
.jf-cols{display:grid;gap:4px 40px}
@media (min-width:760px){.jf-cols{grid-template-columns:1fr 1fr}}
.jf-c .jf-p{max-width:none}

/* D — split screen */
.jf-d{display:grid;background:#fff;border-radius:2.5rem 2.5rem 0 0}  /* follows the rounded top of the panel it opens */
@media (min-width:900px){.jf-d{grid-template-columns:1fr 1fr;min-height:680px}}
.jf-half{position:relative;min-height:440px}
.jf-half img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 22%}
.jf-half::after{content:"";position:absolute;top:0;bottom:0;right:0;width:4px;background:linear-gradient(#e8208f,#00b9c6);box-shadow:0 0 24px rgba(232,32,143,.6)}
@media (max-width:899px){.jf-half::after{top:auto;left:0;width:auto;height:4px;background:linear-gradient(90deg,#e8208f,#00b9c6)}}
.jf-d .jf-copy{padding:clamp(48px,6vw,96px) clamp(24px,5vw,80px);align-self:center}
.jf-q.brush{padding-bottom:14px;background:url(/assets/brand/stroke-hook-lightpink.svg) 0 100%/70% auto no-repeat}

@media (prefers-reduced-motion:reduce){.jf *{transition:none!important;animation:none!important}.jf-c .jf-q{opacity:1;transform:none}.jf-sig.write{clip-path:none}}`;

const JS = `<script>
(function(){var s=document.querySelector('[data-jf]');if(!s)return;
if(!('IntersectionObserver' in window)){s.classList.add('is-in');return;}
var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){s.classList.add('is-in');io.disconnect();}},{threshold:.3});io.observe(s);
addEventListener('load',function(){if(location.hash==='#founder')scrollTo(0,s.getBoundingClientRect().top+scrollY-20);});})();
</script>`;

for (const [k, o] of Object.entries(OPTIONS)) {
  const html = o.where === 'before'
    ? about.slice(0, panel) + o.html + about.slice(panel)
    : about.slice(0, panelGroundEnd) + o.html + about.slice(panelGroundEnd);
  fs.writeFileSync(path.join(dist, `jf-${k}.html`), html
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><style>${CSS}</style></head>`)
    .replace('</body>', `${JS}</body>`));
}

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : ''}">${o.pick ? 'Recommended' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <p class="links"><a href="/jf-${k}.html#founder" target="_blank" rel="noopener">Open full page ↗</a></p>
  <div class="pair">
    <figure><div class="screen" data-w="1440" data-h="900"><iframe src="/jf-${k}.html#founder" title="${esc(o.label)}" loading="lazy" width="1440" height="900"></iframe></div><figcaption>Desktop · 1440 × 900</figcaption></figure>
    <figure class="pf"><div class="screen phone" data-w="390" data-h="844"><iframe src="/jf-${k}.html#founder" title="${esc(o.label)} on a phone" loading="lazy" width="390" height="844"></iframe></div><figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Founder feature — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;700&display=swap">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --cyan:#00b9c6; }
* { box-sizing:border-box; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1280px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:840px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:840px; font-size:15px; }
.links { margin:6px 0 0; font:700 13px Montserrat, sans-serif; }
.links a { color:var(--magenta); }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:24px; margin-top:14px; }
@media (min-width:1100px) { .pair { grid-template-columns:1fr 300px; align-items:start; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:300px; }
.screen { position:relative; overflow:hidden; border-radius:14px; background:#111; box-shadow:0 0 0 1px #ddd, 0 20px 50px -30px rgba(0,0,0,.5); }
.screen.phone { border-radius:22px; box-shadow:0 0 0 7px #111, 0 20px 50px -30px rgba(0,0,0,.6); }
.screen iframe { position:absolute; top:0; left:0; border:0; transform-origin:0 0; }
</style>
</head>
<body>
<div class="wrap">
  <h1>About page — Jessica Lewis</h1>
  <p class="lead">Four treatments of the founder feature, each in the real about page between the hero and “The journey
     doesn’t end…”. The copy is your client’s, word for word; the photograph is Jessica’s headshot and the signature is
     her own.</p>
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

fs.writeFileSync(path.join(dist, 'founder-options.html'), page);
console.log('built dist/founder-options.html + ' + Object.keys(OPTIONS).length + ' frames');

// The Freedom section — the event introduced between the hero and Common
// Struggles. Five treatments of the same copy (content.json home.freedom),
// the supplied logo and the two supplied brush strokes.
//
// Every option renders the same four things in the same order — eyebrow,
// logo, tagline, body — so they can be compared on treatment alone.
//
// Preview only: the styles live in FREEDOM_CSS rather than tailwind.css so
// the options page needs no CSS rebuild. The chosen one moves into the real
// stylesheet when it ships.
import { esc } from './layout.mjs';

const PINK = '/assets/brand/stroke-hook-lightpink.svg';
const TEAL = '/assets/brand/stroke-hook-teal.svg';

export const FREEDOM = {
  a: {
    label: 'A — Atelier',
    note: 'Your mockup, refined. Warm blush ground, the pink brush sweeping in from the top right and the teal one answering it bottom left. The logo is larger, the tagline gets magenta full stops, and a short gradient rule closes the section.',
  },
  b: {
    label: 'B — Written in',
    note: 'The motion option. As the section scrolls into view the pink brush is swept on behind the word, Freedom writes itself in from left to right, then the three tagline words arrive one at a time. Same layout as A — the wow is in the arrival.',
    pick: true,
  },
  c: {
    label: 'C — After dark',
    note: 'Carries the hero’s darkness down instead of breaking to white. White logo with a teal glow, a huge outlined FREEDOM watermark behind it, the tagline in the hero’s pink-to-teal gradient. The white panel with Common Struggles then lifts over it as it does over the hero today.',
  },
  d: {
    label: 'D — Editorial split',
    note: 'Magazine layout. The logo sits on the pink brush on the left; on the right the three tagline words become a numbered list in an elegant serif, with the body copy under them. Stacks on phones.',
  },
  e: {
    label: 'E — The invitation',
    note: 'Presented like an invitation card: a white card with a fine double border and a pink-to-teal edge, the brushes tucked behind two of its corners, and a small ornament between the logo and the tagline.',
  },
};

const tagline = (f, cls = '') => `<p class="fr-tag ${cls}">${f.tagline.map((w, i) =>
  `<span style="--i:${i}">${esc(w.replace(/\.$/, ''))}<b>.</b></span>`).join(' ')}</p>`;

const logo = (f, white) => `<h2 class="fr-logo"><img src="${esc(white ? f.logoWhite : f.logo)}" alt="Freedom" width="1500" height="640" decoding="async"></h2>`;

const brush = (src, cls) => `<img src="${src}" alt="" aria-hidden="true" class="fr-brush ${cls}" decoding="async">`;

export const renderFreedom = (c, key) => {
  const f = c.home.freedom;
  const eyebrow = `<p class="fr-eye">${esc(f.eyebrow)}</p>`;
  const body = `<p class="fr-body">${esc(f.body)}</p>`;

  if (key === 'c') return `
<section id="freedom" class="fr fr-c" data-fr-reveal>
  <span class="fr-water" aria-hidden="true">Freedom</span>
  <span class="fr-glow fr-glow-m" aria-hidden="true"></span><span class="fr-glow fr-glow-c" aria-hidden="true"></span>
  ${brush(PINK, 'fr-c-pink')}
  <div class="fr-inner">${eyebrow}${logo(f, true)}${tagline(f)}${body}</div>
</section>`;

  if (key === 'd') return `
<section id="freedom" class="fr fr-d" data-fr-reveal>
  <div class="fr-grid">
    <div class="fr-left">
      ${eyebrow}
      <div class="fr-mark">${brush(PINK, 'fr-d-pink')}${logo(f)}</div>
    </div>
    <div class="fr-right">
      <ol class="fr-list">${f.tagline.map((w, i) => `<li><span class="n">0${i + 1}</span><span class="w">${esc(w.replace(/\.$/, ''))}</span></li>`).join('')}</ol>
      ${body}
    </div>
  </div>
  ${brush(TEAL, 'fr-d-teal')}
</section>`;

  if (key === 'e') return `
<section id="freedom" class="fr fr-e" data-fr-reveal>
  <div class="fr-card-wrap">
    ${brush(PINK, 'fr-e-pink')}${brush(TEAL, 'fr-e-teal')}
    <div class="fr-card"><div class="fr-card-in">
      ${eyebrow}${logo(f)}
      <span class="fr-orn" aria-hidden="true"><i></i><em></em><i></i></span>
      ${tagline(f)}${body}
    </div></div>
  </div>
</section>`;

  // a and b share a layout; b adds the choreographed entrance.
  return `
<section id="freedom" class="fr fr-${key}" data-fr-reveal>
  ${brush(PINK, 'fr-pink')}${brush(TEAL, 'fr-teal')}
  <div class="fr-inner">
    ${eyebrow}
    <div class="fr-mark">${key === 'b' ? brush(PINK, 'fr-behind') : ''}${logo(f)}</div>
    ${tagline(f)}${body}
    <span class="fr-rule" aria-hidden="true"></span>
  </div>
</section>`;
};

// Adds .is-in when the section scrolls into view. Without IntersectionObserver
// everything is shown at once.
export const FREEDOM_JS = `<script>
(function(){var s=[].slice.call(document.querySelectorAll('[data-fr-reveal]'));
if(!('IntersectionObserver' in window)){s.forEach(function(e){e.classList.add('is-in')});return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}})},{threshold:.25});
s.forEach(function(e){io.observe(e)});})();
</script>`;

export const FREEDOM_CSS = `
.fr{position:relative;overflow:hidden;text-align:center;color:#1c1c1c;scroll-margin-top:40px}
.fr *{box-sizing:border-box}
.fr-inner{position:relative;z-index:2;max-width:46rem;margin:0 auto;padding:0 16px}
.fr-eye{margin:0;font:700 11px/1.4 Lato,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:#6b6b6b}
.fr-logo{margin:18px auto 0;line-height:0}
.fr-logo img{display:block;width:clamp(240px,34vw,440px);height:auto;margin:0 auto}
.fr-tag{margin:22px 0 0;font:800 clamp(13px,1.4vw,17px)/1.4 Montserrat,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:#1c1c1c}
.fr-tag span{display:inline-block}
.fr-tag b{color:#e8208f;font-weight:800}
.fr-body{margin:22px auto 0;max-width:36rem;font:400 clamp(16px,1.35vw,18.5px)/1.75 Lato,sans-serif;color:#4a4a4a}
.fr-brush{position:absolute;pointer-events:none;user-select:none;height:auto;z-index:1}
.fr-rule{display:block;width:72px;height:2px;margin:34px auto 0;border-radius:2px;background:linear-gradient(90deg,#e8208f,#00b9c6)}

/* entrance shared by all: a gentle rise */
.fr .fr-eye,.fr .fr-tag,.fr .fr-body,.fr .fr-list{transition:opacity .9s ease,transform .9s cubic-bezier(.22,1,.36,1)}
.fr:not(.is-in) .fr-eye,.fr:not(.is-in) .fr-tag,.fr:not(.is-in) .fr-body,.fr:not(.is-in) .fr-list{opacity:0;transform:translateY(14px)}
.fr .fr-tag{transition-delay:.15s}.fr .fr-body{transition-delay:.3s}

/* A — Atelier */
.fr-a,.fr-b{padding:clamp(72px,9vw,128px) 0 clamp(64px,8vw,112px);background:linear-gradient(180deg,#fcf7f3 0%,#fdf0f4 100%)}
.fr-a .fr-pink,.fr-b .fr-pink{top:-6%;right:-7%;width:clamp(240px,34vw,520px);opacity:.9}
.fr-a .fr-teal,.fr-b .fr-teal{bottom:-12%;left:-9%;width:clamp(180px,22vw,340px);opacity:.28;transform:rotate(180deg)}

/* B — Written in */
.fr-b .fr-mark{position:relative;display:inline-block}
.fr-b .fr-mark{margin-bottom:6px}
.fr-b .fr-behind{z-index:0;left:68%;top:44%;width:58%;transform:translate(-50%,-50%) rotate(-10deg);opacity:.7;
  clip-path:inset(0 100% 0 0);transition:clip-path 1.1s cubic-bezier(.65,0,.35,1)}
.fr-b .fr-logo{position:relative;z-index:1}
.fr-b .fr-logo img{clip-path:inset(0 100% 0 0);transition:clip-path 1.8s cubic-bezier(.45,0,.2,1) .55s}
.fr-b.is-in .fr-behind{clip-path:inset(0 0 0 0)}
.fr-b.is-in .fr-logo img{clip-path:inset(0 0 0 0)}
.fr-b .fr-tag span{opacity:0;transform:translateY(10px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,1,.36,1);transition-delay:calc(2.1s + var(--i) * .28s)}
.fr-b.is-in .fr-tag span{opacity:1;transform:none}
.fr-b .fr-tag,.fr-b:not(.is-in) .fr-tag{opacity:1;transform:none}
.fr-b .fr-body{transition-delay:2.9s}.fr-b .fr-rule{transform:scaleX(0);transition:transform .8s cubic-bezier(.22,1,.36,1) 3.1s}
.fr-b.is-in .fr-rule{transform:scaleX(1)}
.fr-b .fr-pink{transform:translateX(30px);opacity:0;transition:opacity 1.4s ease .2s,transform 1.4s cubic-bezier(.22,1,.36,1) .2s}
.fr-b.is-in .fr-pink{transform:none;opacity:.9}

/* C — After dark */
.fr-c{z-index:1;margin-top:-120px;padding:calc(clamp(88px,10vw,140px) + 120px) 0 clamp(128px,13vw,190px);color:#fff;
  -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 120px);mask-image:linear-gradient(to bottom,transparent 0,#000 120px);
  background:radial-gradient(60% 70% at 15% 30%,rgba(232,32,143,.16),transparent 70%),radial-gradient(55% 65% at 88% 75%,rgba(0,185,198,.14),transparent 70%),linear-gradient(180deg,#1c1c1c 0%,#121212 100%)}
.fr-c .fr-eye{color:rgba(255,255,255,.6)}
.fr-c .fr-logo img{filter:drop-shadow(0 0 28px rgba(0,185,198,.35))}
.fr-c .fr-tag{background:linear-gradient(92deg,#e8208f,#f0569f 40%,#00b9c6);-webkit-background-clip:text;background-clip:text;color:transparent}
.fr-c .fr-tag b{color:inherit}
.fr-c .fr-body{color:rgba(255,255,255,.74)}
.fr-water{position:absolute;left:50%;top:50%;transform:translate(-50%,-56%);z-index:0;white-space:nowrap;pointer-events:none;
  font:900 clamp(120px,24vw,380px)/1 Montserrat,sans-serif;letter-spacing:-.02em;text-transform:uppercase;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.07)}
.fr-glow{position:absolute;z-index:0;border-radius:50%;filter:blur(60px);pointer-events:none}
.fr-c-pink{top:12%;right:-6%;width:clamp(220px,30vw,460px);opacity:.3;filter:saturate(2.4) brightness(.95)}

/* D — Editorial split */
.fr-d{padding:clamp(72px,8vw,120px) 16px;background:linear-gradient(180deg,#fcf7f3,#fbf1f2)}
.fr-grid{position:relative;z-index:2;max-width:68rem;margin:0 auto;display:grid;gap:44px;align-items:center}
@media (min-width:900px){.fr-grid{grid-template-columns:1.05fr 1fr;gap:72px;text-align:left}.fr-d .fr-body{margin-left:0}}
.fr-d .fr-mark{position:relative;margin-top:10px}
.fr-d .fr-eye{position:relative;z-index:2}
.fr-d-pink{z-index:0;left:50%;top:50%;width:min(560px,112%);transform:translate(-50%,-50%) rotate(-6deg);opacity:.85}
.fr-d .fr-logo{position:relative;z-index:1;margin-top:0}
.fr-d .fr-logo img{width:clamp(260px,38vw,500px)}
.fr-list{list-style:none;margin:0;padding:0;border-top:1px solid rgba(28,28,28,.12)}
.fr-list li{display:flex;align-items:baseline;gap:18px;padding:14px 0;border-bottom:1px solid rgba(28,28,28,.12)}
@media (max-width:899px){.fr-list li{justify-content:center}}
.fr-list .n{font:800 12px Montserrat,sans-serif;letter-spacing:.12em;color:#e8208f}
.fr-list li:nth-child(2) .n{color:#9b5fb0}.fr-list li:nth-child(3) .n{color:#00a3af}
.fr-list .w{font:italic 500 clamp(34px,4vw,52px)/1.05 'Cormorant Garamond',Georgia,serif;color:#1c1c1c}
.fr-d .fr-body{margin-top:26px}
.fr-d-teal{bottom:-14%;right:-8%;width:clamp(200px,24vw,360px);opacity:.22;transform:rotate(160deg)}

/* E — The invitation */
.fr-e{padding:clamp(72px,9vw,128px) 16px;background:radial-gradient(70% 60% at 50% 40%,#fdeff4,#f9f3ee 75%)}
.fr-card-wrap{position:relative;max-width:50rem;margin:0 auto}
.fr-card{position:relative;z-index:2;padding:1px;border-radius:30px;background:linear-gradient(135deg,rgba(232,32,143,.55),rgba(255,255,255,.6) 45%,rgba(0,185,198,.55));
  box-shadow:0 40px 90px -40px rgba(232,32,143,.45),0 18px 40px -24px rgba(0,0,0,.18)}
.fr-card-in{border-radius:29px;background:#fffdfb;padding:clamp(44px,6vw,76px) clamp(22px,5vw,72px);outline:1px solid rgba(232,32,143,.18);outline-offset:-12px}
.fr-e-pink{z-index:1;top:-16%;right:-12%;width:clamp(200px,28vw,420px)}
.fr-e-teal{z-index:1;bottom:-18%;left:-12%;width:clamp(170px,22vw,330px);opacity:.55;transform:rotate(180deg)}
.fr-orn{display:flex;align-items:center;justify-content:center;gap:12px;margin:20px 0 0}
.fr-orn i{display:block;width:56px;height:1px;background:rgba(28,28,28,.2)}
.fr-orn em{display:block;width:7px;height:7px;transform:rotate(45deg);background:linear-gradient(135deg,#e8208f,#00b9c6)}
.fr-e .fr-tag{margin-top:18px}

/* phones: tighter tracking keeps the tagline on one line inside the card */
@media (max-width:479px){.fr-tag{letter-spacing:.2em}}

@media (prefers-reduced-motion:reduce){
  .fr *{transition:none!important}
  .fr .fr-eye,.fr .fr-tag,.fr .fr-tag span,.fr .fr-body,.fr .fr-list{opacity:1!important;transform:none!important}
  .fr-b .fr-behind,.fr-b .fr-logo img{clip-path:none!important}.fr-b .fr-pink{opacity:.9!important;transform:none!important}.fr-b .fr-rule{transform:none!important}
}`;

// The Freedom section, option A, tuned on three independent axes:
//
//   data-s  the two brush strokes — now always the same size
//   data-t  how the section hands over to Common Struggles
//   data-y  the typography from the eyebrow down to the body copy
//
// One markup carries everything every combination needs; the attributes only
// switch styling, so any mix can be previewed live. Preview only — styles live
// here rather than tailwind.css until a combination is chosen.
import { esc } from './layout.mjs';

export const AXES = {
  s: {
    title: '1. The brush strokes',
    lead: 'Both strokes are now exactly the same size in every option. They differ in where they sit.',
    options: {
      mirror: { label: 'Mirrored', note: 'The same stroke at the same width, pink top right and teal bottom left, turned 180° so one answers the other. The direct fix.', pick: true },
      frame:  { label: 'Framing', note: 'Pulled in from the edges to hug the copy, one at each opposite corner of the text, like a pair of brackets around it.' },
      sides:  { label: 'Parentheses', note: 'Stood upright on the far left and far right, vertically centred, so the section is held between two brush marks.' },
      drift:  { label: 'Drift', note: 'Mirrored, but they float in opposite directions as you scroll past. Slow and subtle, so it reads as depth rather than an effect.' },
    },
  },
  t: {
    title: '2. Into Common Struggles',
    lead: 'What happens at the bottom edge, where the blush ground meets the white of the next section.',
    options: {
      now:  { label: 'Now', note: 'For reference: the blush ends and the white begins on a straight line.' },
      melt: { label: 'Melt', note: 'No edge at all. The blush fades into the white over the last stretch of the section, so the two read as one continuous page.' },
      wave: { label: 'Drawn wave', note: 'The section ends on a soft wave, and a fine pink-to-teal line draws itself along it when it comes into view.', pick: true },
      lift: { label: 'Lifted panel', note: 'Common Struggles rises over the Freedom section on a rounded, shadowed edge with the small handle — the same move the site already makes over the hero.' },
    },
  },
  y: {
    title: '3. The copy',
    lead: 'From “Rise Up Queens presents” to the paragraph. All four keep your words exactly.',
    options: {
      now:       { label: 'Now', note: 'For reference: your mockup’s styling.' },
      editorial: { label: 'Editorial serif', note: 'The eyebrow in pink between two fine rules. The tagline in a large italic serif with small diamonds between the words. The first sentence becomes a serif lead-in, the rest stays as body text.', pick: true },
      statement: { label: 'Statement', note: 'The tagline grows into big gradient type that a light sweeps across, the eyebrow becomes a small pill, and the two key phrases in the paragraph are set in bold.' },
      highlight: { label: 'Brush highlight', note: 'Each tagline word is underlined by a stroke of pink that paints on one after another, and the key phrases in the paragraph get a teal highlighter that wipes in.' },
    },
  },
};

export const DEFAULTS = { s: 'mirror', t: 'wave', y: 'editorial' };

const PINK = '/assets/brand/stroke-hook-lightpink.svg';
const TEAL = '/assets/brand/stroke-hook-teal.svg';

// The paragraph's lead sentence and the phrases that get emphasis. If the copy
// changes and a phrase is no longer found, it simply renders unmarked.
const LEAD_END = 'walk through.';
const MARKS = ['turning point', 'clarity, freedom, and a faith that feels alive again'];

const body = (text) => {
  let t = esc(text);
  for (const m of MARKS) t = t.replace(esc(m), `<mark>${esc(m)}</mark>`);
  const at = t.indexOf(LEAD_END);
  if (at < 0) return t;
  const cut = at + LEAD_END.length;
  return `<span class="ft-lead">${t.slice(0, cut)}</span> <span class="ft-rest">${t.slice(cut).trim()}</span>`;
};

export const renderFreedomTune = (c, sel = DEFAULTS) => {
  const f = c.home.freedom;
  return `
<section id="freedom" class="ft" data-s="${esc(sel.s)}" data-t="${esc(sel.t)}" data-y="${esc(sel.y)}" data-ft>
  <div class="ft-strokes" aria-hidden="true">
    <span class="ft-st ft-st-p"><img src="${PINK}" alt="" decoding="async"></span>
    <span class="ft-st ft-st-t"><img src="${TEAL}" alt="" decoding="async"></span>
  </div>
  <div class="ft-inner">
    <p class="ft-eye"><span>${esc(f.eyebrow)}</span></p>
    <h2 class="ft-logo"><img src="${esc(f.logo)}" alt="Freedom" width="1500" height="640" decoding="async"></h2>
    <p class="ft-tag">${f.tagline.map((w, i) => `<span class="ft-w" style="--i:${i}">${esc(w.replace(/\.$/, ''))}<b>.</b></span>`).join('<i class="ft-sep" aria-hidden="true"></i>')}</p>
    <p class="ft-body">${body(f.body)}</p>
  </div>
  <svg class="ft-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="ftg" x1="0" x2="1"><stop offset="0" stop-color="#e8208f"/><stop offset=".5" stop-color="#f0569f"/><stop offset="1" stop-color="#00b9c6"/></linearGradient></defs>
    <path d="M0 72 C 260 18, 520 18, 760 58 S 1200 112, 1440 46 L1440 120 L0 120 Z" fill="#ffffff"/>
    <path class="ft-wave-line" d="M0 72 C 260 18, 520 18, 760 58 S 1200 112, 1440 46" fill="none" stroke="url(#ftg)" stroke-width="2" pathLength="1" vector-effect="non-scaling-stroke"/>
  </svg>
  <span class="ft-lift" aria-hidden="true"></span>
</section>`;
};

// Reveal on scroll, the drift parallax, and window.ftReplay() so the options
// page can re-run the entrance after switching a setting.
export const FREEDOM_TUNE_JS = `<script>
(function(){
  var s=document.querySelector('[data-ft]'); if(!s) return;
  window.ftReplay=function(){s.classList.remove('is-in'); void s.offsetWidth; requestAnimationFrame(function(){s.classList.add('is-in');});};
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){s.classList.add('is-in');io.disconnect();}},{threshold:.25});
    io.observe(s);
  } else s.classList.add('is-in');
  var raf=0;
  function drift(){raf=0;var r=s.getBoundingClientRect(),vh=innerHeight;
    var p=Math.max(-1,Math.min(1,((r.top+r.height/2)-vh/2)/(vh/2+r.height/2)));
    s.style.setProperty('--p',p.toFixed(3));}
  addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(drift);},{passive:true});
  addEventListener('resize',drift); drift();
})();
</script>`;

export const FREEDOM_TUNE_CSS = `
.ft{position:relative;z-index:3;text-align:center;color:#1c1c1c;scroll-margin-top:40px;
  padding:clamp(72px,9vw,128px) 0 clamp(72px,9vw,120px);background:linear-gradient(180deg,#fcf7f3 0%,#fdf0f4 100%);
  --sw:clamp(210px,28vw,440px)}
.ft *{box-sizing:border-box}
.ft-inner{position:relative;z-index:2;max-width:46rem;margin:0 auto;padding:0 16px}

/* ---------- shared base (option A) ---------- */
.ft-eye{margin:0;font:700 11px/1.4 Lato,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:#6b6b6b}
.ft-logo{margin:18px auto 0;line-height:0}
.ft-logo img{display:block;width:clamp(240px,34vw,440px);height:auto;margin:0 auto}
.ft-tag{margin:22px 0 0;font:800 clamp(13px,1.4vw,17px)/1.4 Montserrat,sans-serif;letter-spacing:.32em;text-transform:uppercase}
.ft-w{display:inline-block;position:relative}
.ft-w b{color:#e8208f;font-weight:inherit}
.ft-sep{display:inline-block;width:.6em}
.ft-body{margin:22px auto 0;max-width:36rem;font:400 clamp(16px,1.35vw,18.5px)/1.75 Lato,sans-serif;color:#4a4a4a}
.ft-body mark{background:none;color:inherit}
@media (max-width:479px){.ft-tag{letter-spacing:.2em}}

/* gentle rise for everything on arrival */
.ft .ft-eye,.ft .ft-logo,.ft .ft-tag,.ft .ft-body{transition:opacity .9s ease,transform .9s cubic-bezier(.22,1,.36,1)}
.ft .ft-logo{transition-delay:.1s}.ft .ft-tag{transition-delay:.2s}.ft .ft-body{transition-delay:.32s}
.ft:not(.is-in) .ft-eye,.ft:not(.is-in) .ft-logo,.ft:not(.is-in) .ft-tag,.ft:not(.is-in) .ft-body{opacity:0;transform:translateY(14px)}

/* ---------- 1. strokes — same width everywhere ---------- */
.ft-strokes{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1}
.ft-st{position:absolute;width:var(--sw);line-height:0;translate:0 calc(var(--d,0) * var(--p,0) * 1px)}
.ft-st img{display:block;width:100%;height:auto}
.ft-st-p img{opacity:.85}
.ft-st-t img{opacity:.32}

/* mirrored — the teal is the pink turned through 180° */
.ft[data-s="mirror"] .ft-st-p,.ft[data-s="drift"] .ft-st-p{top:-5%;right:-6%}
.ft[data-s="mirror"] .ft-st-t,.ft[data-s="drift"] .ft-st-t{bottom:-5%;left:-6%;rotate:180deg}

/* framing — tucked against opposite corners of the copy */
.ft[data-s="frame"]{--sw:clamp(170px,19vw,300px)}
.ft[data-s="frame"] .ft-st-p{top:5%;left:calc(50% + 15rem)}
.ft[data-s="frame"] .ft-st-t{bottom:5%;right:calc(50% + 15rem);rotate:180deg}


/* parentheses — upright on each side, centred */
.ft[data-s="sides"]{--sw:clamp(200px,24vw,380px)}
.ft[data-s="sides"] .ft-st-p{top:50%;left:calc(var(--sw) * -.12);transform:translateY(-50%);rotate:-100deg}
.ft[data-s="sides"] .ft-st-t{top:50%;right:calc(var(--sw) * -.12);transform:translateY(-50%);rotate:80deg}

/* drift — opposite directions as the section crosses the viewport */
.ft[data-s="drift"] .ft-st-p{--d:-70}
.ft[data-s="drift"] .ft-st-t{--d:70}

/* On phones there is no room beside the copy, so framing and parentheses
   fall back to the mirrored corners rather than sitting on the text. */
@media (max-width:767px){
  .ft[data-s="frame"],.ft[data-s="sides"]{--sw:clamp(210px,28vw,440px)}
  .ft[data-s="frame"] .ft-st-p,.ft[data-s="sides"] .ft-st-p{top:-5%;right:-6%;left:auto;transform:none;rotate:0deg}
  .ft[data-s="frame"] .ft-st-t,.ft[data-s="sides"] .ft-st-t{bottom:-5%;left:-6%;right:auto;top:auto;transform:none;rotate:180deg}
}

/* ---------- 2. the hand-over to Common Struggles ---------- */
.ft-wave,.ft-lift{display:none}
.ft[data-t="melt"]{background:linear-gradient(180deg,#fcf7f3 0%,#fdf0f4 55%,#ffffff 100%);padding-bottom:clamp(110px,12vw,170px)}

.ft[data-t="wave"]{padding-bottom:calc(clamp(72px,9vw,120px) + clamp(40px,6vw,90px))}
.ft[data-t="wave"] .ft-wave{display:block;position:absolute;left:0;right:0;bottom:-1px;width:100%;height:clamp(40px,6vw,90px);z-index:2}
.ft-wave-line{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.8s cubic-bezier(.65,0,.35,1) .5s}
.ft.is-in .ft-wave-line{stroke-dashoffset:0}

.ft[data-t="lift"]{padding-bottom:calc(clamp(72px,9vw,120px) + 44px)}
.ft[data-t="lift"] .ft-lift{display:block;position:absolute;left:0;right:0;bottom:0;height:44px;z-index:2;background:#fff;
  border-radius:2.5rem 2.5rem 0 0;box-shadow:0 -26px 60px -28px rgba(0,0,0,.28)}
.ft[data-t="lift"] .ft-lift::after{content:"";position:absolute;left:50%;top:16px;width:64px;height:6px;border-radius:6px;background:rgba(28,28,28,.15);transform:translateX(-50%)}

/* ---------- 3. the copy ---------- */
/* editorial serif */
.ft[data-y="editorial"] .ft-eye{display:flex;align-items:center;justify-content:center;gap:16px;color:#dc1e88;letter-spacing:.38em}
.ft[data-y="editorial"] .ft-eye::before,.ft[data-y="editorial"] .ft-eye::after{content:"";width:clamp(28px,5vw,56px);height:1px;background:linear-gradient(90deg,transparent,rgba(232,32,143,.6))}
.ft[data-y="editorial"] .ft-eye::after{background:linear-gradient(90deg,rgba(232,32,143,.6),transparent)}
.ft[data-y="editorial"] .ft-tag{margin-top:20px;font:italic 500 clamp(26px,3.1vw,40px)/1.2 'Cormorant Garamond',Georgia,serif;letter-spacing:.005em;text-transform:none;color:#1c1c1c}
.ft[data-y="editorial"] .ft-w b{display:none}
.ft[data-y="editorial"] .ft-sep{width:2.2em;position:relative;vertical-align:middle;height:1em}
.ft[data-y="editorial"] .ft-sep::after{content:"";position:absolute;left:50%;top:50%;width:7px;height:7px;transform:translate(-50%,-50%) rotate(45deg);background:linear-gradient(135deg,#e8208f,#00b9c6)}
.ft[data-y="editorial"] .ft-body{margin-top:28px;max-width:38rem}
.ft[data-y="editorial"] .ft-lead{display:block;margin-bottom:14px;font:500 clamp(21px,2.1vw,27px)/1.4 'Cormorant Garamond',Georgia,serif;color:#1c1c1c}
.ft[data-y="editorial"] .ft-rest{display:block;max-width:34rem;margin:0 auto;font-size:clamp(15.5px,1.2vw,17px);color:#5a5a5a}

/* statement */
.ft[data-y="statement"] .ft-eye span{display:inline-block;padding:9px 18px;border-radius:999px;background:rgba(255,255,255,.75);
  box-shadow:inset 0 0 0 1px rgba(232,32,143,.28),0 10px 30px -18px rgba(232,32,143,.7);color:#dc1e88;letter-spacing:.28em}
.ft[data-y="statement"] .ft-inner{max-width:66rem}
.ft[data-y="statement"] .ft-tag{margin-top:20px;font:800 clamp(26px,3.1vw,44px)/1.12 Montserrat,sans-serif;letter-spacing:-.01em;text-transform:uppercase;
  background-image:linear-gradient(100deg,transparent 40%,rgba(255,255,255,.9) 50%,transparent 60%),linear-gradient(92deg,#e8208f 0%,#f0569f 35%,#00b9c6 100%);
  background-size:250% 100%,100% 100%;background-position:100% 0,0 0;-webkit-background-clip:text;background-clip:text;color:transparent}
.ft[data-y="statement"].is-in .ft-tag{animation:ft-sweep 1.6s cubic-bezier(.45,0,.25,1) .9s both}
@keyframes ft-sweep{from{background-position:100% 0,0 0}to{background-position:0% 0,0 0}}
.ft[data-y="statement"] .ft-w b{color:inherit}
.ft[data-y="statement"] .ft-sep{width:.35em}
.ft[data-y="statement"] .ft-body mark{font-weight:700;color:#1c1c1c}

/* brush highlight */
.ft[data-y="highlight"] .ft-eye{color:#dc1e88}
.ft[data-y="highlight"] .ft-w{padding:0 .15em;background:linear-gradient(transparent 42%,rgba(247,191,210,.95) 42%,rgba(247,191,210,.95) 96%,transparent 96%) no-repeat 0 0/0% 100%;
  transition:background-size .7s cubic-bezier(.65,0,.35,1);transition-delay:calc(.9s + var(--i) * .3s)}
.ft[data-y="highlight"].is-in .ft-w{background-size:100% 100%}
.ft[data-y="highlight"] .ft-body mark{color:#1c1c1c;font-weight:700;background:linear-gradient(transparent 60%,rgba(0,185,198,.28) 60%) no-repeat 0 0/0% 100%;
  transition:background-size 1s cubic-bezier(.65,0,.35,1) 1.9s}
.ft[data-y="highlight"].is-in .ft-body mark{background-size:100% 100%}

/* phones: the serif tagline stays on one line */
@media (max-width:479px){.ft[data-y="editorial"] .ft-tag{font-size:22px;white-space:nowrap}.ft[data-y="editorial"] .ft-sep{width:1.5em}}

@media (prefers-reduced-motion:reduce){
  .ft *{transition:none!important;animation:none!important}
  .ft .ft-eye,.ft .ft-logo,.ft .ft-tag,.ft .ft-body{opacity:1!important;transform:none!important}
  .ft-st{translate:none!important}.ft-wave-line{stroke-dashoffset:0!important}
  .ft[data-y="highlight"] .ft-w,.ft[data-y="highlight"] .ft-body mark{background-size:100% 100%!important}
}`;

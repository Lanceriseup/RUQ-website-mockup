// G3 — Horizontal glide. "More ways to grow" on the Courses page.
//
// Desktop (≥1024px, fine pointer, motion allowed): the section is tall and its
// stage sticks to the viewport while the four cards glide sideways as the page
// scrolls down; the heading, lead and a small index of the four paths stay
// pinned on the left, and a magenta→teal line fills beneath the cards. The
// card nearest the scroll position rises to full size and brightness.
//
// Everywhere else (phones, tablets, touch, reduced motion, no JS): no scroll
// hijacking — the cards sit in a native horizontal row that snaps card by card,
// and the same line follows the swipe.
//
// The pinning needs position:sticky, which the page wrapper's overflow:hidden
// would break; grow-glide.css switches that wrapper to overflow:clip (which
// clips the same way but keeps sticky working) only on pages holding .gg.
import { esc, ICON, linkAttrs, newTab, rv } from '../shared.mjs';

const MEDIA = {
  '/masterclasses.html': { src: '/assets/photos/event-9.jpg', w: 1080, h: 1350, pos: '50% 22%' },
  '/events.html': { src: '/assets/photos/journey-cheer.jpg', w: 1200, h: 1600, pos: '50% 18%' },
  '/coaching.html': { src: '/assets/photos/close-talk.jpg', w: 2528, h: 1696, pos: '58% 40%' },
};

const pad = (i) => String(i + 1).padStart(2, '0');

const media = (l) => {
  const m = MEDIA[l.href];
  if (!m) {
    // The free resource: a luminous gradient "gift" card instead of a photo.
    return `<span class="gg-media gg-media-gift" aria-hidden="true">
        <span class="gg-gift-orb gg-gift-orb-a"></span><span class="gg-gift-orb gg-gift-orb-b"></span>
        <span class="gg-gift-ring"></span>
        <span class="gg-gift-ic">${ICON.gift}</span>
      </span>`;
  }
  return `<span class="gg-media"><img src="${m.src}" width="${m.w}" height="${m.h}" alt="" loading="lazy" decoding="async" style="object-position:${m.pos}"></span>`;
};

const card = (l, i, n) => `
      <li class="gg-item" style="--i:${i}">
        <a ${linkAttrs(l.href)} class="gg-card${MEDIA[l.href] ? '' : ' gg-card-gift'}" data-gg-card>
          ${media(l)}
          <span class="gg-num" aria-hidden="true">${pad(i)}<span>/${pad(n - 1)}</span></span>
          <span class="gg-body">
            <h3 class="gg-title">${esc(l.label)}${newTab(l.href)}</h3>
            <span class="gg-blurb">${esc(l.blurb)}</span>
            <span class="gg-go" aria-hidden="true">${ICON.arrow}</span>
          </span>
        </a>
      </li>`;

// Inline, tiny, dependency-free. Runs once per section.
const SCRIPT = `
(function(){
  var s=document.currentScript&&document.currentScript.closest('.gg');if(!s)return;
  var view=s.querySelector('[data-gg-view]'),track=s.querySelector('[data-gg-track]'),
      cards=[].slice.call(s.querySelectorAll('[data-gg-card]')),idx=[].slice.call(s.querySelectorAll('[data-gg-ix]')),
      num=s.querySelector('[data-gg-n]'),n=cards.length,last=n-1,
      mq=window.matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)'),
      on=false,dist=0,range=1,raf=0,cur=-1,q=/[?&]gg=([\\d.]+)/.exec(location.search);
  function clamp(v){return v<0?0:v>1?1:v}
  function mark(p){
    var a=Math.round(p*last);
    s.style.setProperty('--gg-p',p.toFixed(4));
    if(a!==cur){cur=a;if(num)num.textContent=('0'+(a+1)).slice(-2);
      idx.forEach(function(el,k){el.classList.toggle('is-on',k===a)});}
  }
  function frame(){
    raf=0;
    if(on){
      var p=q?clamp(+q[1]):clamp(-s.getBoundingClientRect().top/range),x=p*dist,vw=view.clientWidth;
      track.style.transform='translate3d('+(-x).toFixed(1)+'px,0,0)';
      cards.forEach(function(c,k){
        var f=1-Math.min(1,Math.abs(p*last-k)),li=c.parentNode,
            mid=li.offsetLeft+li.offsetWidth/2-x-vw/2;
        c.style.setProperty('--f',f.toFixed(3));
        c.style.setProperty('--px',Math.max(-20,Math.min(20,mid*-.04)).toFixed(1));
      });
      mark(p);
    }else{
      var m=view.scrollWidth-view.clientWidth;mark(m>0?clamp(view.scrollLeft/m):0);
    }
  }
  function req(){if(!raf)raf=requestAnimationFrame(frame)}
  function setup(){
    on=mq.matches;s.classList.toggle('gg--glide',on);
    track.style.transform='';s.style.height='';
    cards.forEach(function(c){c.style.removeProperty('--f');c.style.removeProperty('--px')});
    if(on){
      view.scrollLeft=0;
      dist=Math.max(0,track.scrollWidth-view.clientWidth);
      s.style.height=Math.round(window.innerHeight+dist*1.6)+'px';
      range=Math.max(1,s.offsetHeight-window.innerHeight);
      if(q){var t=s.getBoundingClientRect().top+window.pageYOffset;window.scrollTo(0,t+clamp(+q[1])*range)}
    }
    frame();
  }
  // Keyboard: tabbing to a card scrolls the page to the point where that card
  // is in focus, so nothing is ever reached off-screen.
  s.addEventListener('focusin',function(e){
    if(!on)return;var k=cards.indexOf(e.target);if(k<0)return;
    q=null;
    // after the browser's own scroll-into-view for the focused element
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      view.scrollLeft=0;
      var top=s.getBoundingClientRect().top+window.pageYOffset;
      window.scrollTo({top:Math.round(top+(last?k/last:0)*range),behavior:'auto'});
    })});
  });
  window.addEventListener('scroll',req,{passive:true});
  view.addEventListener('scroll',req,{passive:true});
  var rt=0;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(setup,120)});
  (mq.addEventListener?mq.addEventListener('change',setup):mq.addListener(setup));
  window.addEventListener('load',setup);
  setup();
})();`;

export const grow = (g) => {
  const words = String(g.heading).trim().split(/\s+/);
  const lastWord = words.pop();
  const links = g.links || [];
  const n = links.length;
  return `<section class="gg" aria-labelledby="xl-grow-h">
<link rel="stylesheet" href="/xp-grow-glide.css">
  <div class="gg-stage">
    <div class="gg-grid">
      <div class="gg-head" ${rv()}>
        <h2 id="xl-grow-h" class="gg-h2"><span class="gg-h2-sans">${esc(words.join(' '))}</span> <span class="gg-h2-script">${esc(lastWord)}</span></h2>
        <p class="gg-lead">${esc(g.lead)}</p>
        <ol class="gg-index" aria-hidden="true">
          ${links.map((l, i) => `<li data-gg-ix${i === 0 ? ' class="is-on"' : ''}><span>${pad(i)}</span>${esc(l.label)}</li>`).join('')}
        </ol>
      </div>
      <div class="gg-view" data-gg-view>
        <ol class="gg-track" role="list" data-gg-track>${links.map((l, i) => card(l, i, n)).join('')}
        </ol>
      </div>
      <div class="gg-foot" aria-hidden="true">
        <span class="gg-count"><b data-gg-n>01</b>/${pad(n - 1)}</span>
        <span class="gg-bar"><span class="gg-fill"></span><span class="gg-ticks">${links.map(() => '<i></i>').join('')}</span></span>
        <span class="gg-hint"><span class="gg-hint-s">Scroll</span><span class="gg-hint-w">Swipe</span></span>
      </div>
    </div>
  </div>
  <script>${SCRIPT}</script>
</section>`;
};

// G4 — Editorial index with cursor image reveal.
// A large typographic contents list on frosted glass: four numbered rows with
// oversized titles. With a fine pointer (≥768px, motion allowed) pointing at a
// row brings its photograph up as a floating card that follows the cursor with
// eased lag and a velocity tilt; keyboard focus pins it beside the row. On
// touch, small screens or reduced motion, each row carries its photo inline.
import { esc, ICON, linkAttrs, newTab, rv } from '../shared.mjs';

const PHOTOS = [
  { src: '/assets/photos/gallery-2-1.jpg', pos: '26% 30%' },
  { src: '/assets/photos/journey-cheer.jpg', pos: '50% 26%' },
  { src: '/assets/photos/close-talk.jpg', pos: '60% 40%' },
  { src: '/assets/photos/close-laugh.jpg', pos: '50% 28%' },
];

const num = (i) => String(i + 1).padStart(2, '0');
const LAZY = 'loading="lazy" decoding="async"';

const row = (l, i) => {
  const p = PHOTOS[i % PHOTOS.length];
  return `
      <li class="gi-row" ${rv(80 + i * 90)}>
        <a ${linkAttrs(l.href)} class="gi-link" data-gi="${i}">
          <span class="gi-num" aria-hidden="true">${num(i)}</span>
          <span class="gi-thumb" aria-hidden="true"><img src="${esc(p.src)}" alt="" ${LAZY} style="object-position:${p.pos}"></span>
          <span class="gi-main">
            <span class="gi-title"><span class="gi-title-t">${esc(l.label)}</span>${newTab(l.href)}</span>
            <span class="gi-blurb">${esc(l.blurb)}</span>
          </span>
          <span class="gi-arrow" aria-hidden="true">${ICON.arrow}</span>
        </a>
      </li>`;
};

const card = (l, i) => {
  const p = PHOTOS[i % PHOTOS.length];
  return `<span class="gi-card" data-gi-card="${i}"><img data-src="${esc(p.src)}" alt="" decoding="async" style="object-position:${p.pos}"><span class="gi-cap">${i === 3 ? ICON.gift : `<em>${num(i)}</em>`}${esc(l.label)}</span></span>`;
};

const SCRIPT = `<script>(function(){
var s=document.currentScript.closest('.gi');if(!s)return;
var panel=s.querySelector('.gi-panel'),list=s.querySelector('.gi-list'),fl=s.querySelector('.gi-float'),
links=[].slice.call(s.querySelectorAll('.gi-link')),cards=[].slice.call(s.querySelectorAll('.gi-card'));
var mq=window.matchMedia('(min-width:768px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
var loaded=false;function load(){if(loaded)return;loaded=true;cards.forEach(function(c){var im=c.querySelector('img');if(im.dataset.src){im.src=im.dataset.src;im.removeAttribute('data-src');}});}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting&&mq.matches){load();io.disconnect();}},{rootMargin:'600px 0px'});io.observe(s);}else load();
var W=0,H=0,cx=0,cy=0,tx=0,ty=0,x=0,y=0,rot=0,raf=0,on=-1,z=1,mode='',first=true;
function size(){W=fl.offsetWidth;H=fl.offsetHeight;}
function set(i){if(i===on)return;on=i;links.forEach(function(a,k){a.parentNode.classList.toggle('is-on',k===i);});
 if(i>-1){var c=cards[i];c.style.zIndex=++z;cards.forEach(function(o){o.classList.toggle('is-on',o===c);});}
 list.classList.toggle('is-active',i>-1);fl.classList.toggle('is-shown',i>-1);}
function target(){var r=panel.getBoundingClientRect(),sw=s.getBoundingClientRect();
 if(mode==='mouse'){var px=cx-r.left,py=cy-r.top,gap=36;
  tx=(cx>r.left+r.width*.66)?px-W-gap:px+gap;ty=py-H/2;}
 else if(mode==='key'&&on>-1){var a=links[on].getBoundingClientRect(),b=links[on].querySelector('.gi-blurb').getBoundingClientRect();
  tx=b.left-r.left-W-28;ty=a.top-r.top+a.height/2-H/2;}
 var minX=sw.left-r.left+8,maxX=sw.right-r.left-W-8;if(tx<minX)tx=minX;if(tx>maxX)tx=maxX;if(ty>r.height-H+64)ty=r.height-H+64;if(ty<-64)ty=-64;}
function tick(){raf=0;target();if(first){x=tx;y=ty;first=false;}
 var dx=tx-x;x+=dx*.13;y+=(ty-y)*.13;var r2=Math.max(-9,Math.min(9,dx*.045));rot+=(r2-rot)*.12;
 fl.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0) rotate('+rot.toFixed(2)+'deg)';
 if(on>-1||Math.abs(dx)>.3||Math.abs(rot)>.05)raf=requestAnimationFrame(tick);}
function go(){if(!raf)raf=requestAnimationFrame(tick);}
links.forEach(function(a,i){
 a.addEventListener('pointerenter',function(e){if(!mq.matches||e.pointerType!=='mouse')return;load();if(on<0){first=true;size();}mode='mouse';cx=e.clientX;cy=e.clientY;set(i);go();});
 a.addEventListener('focus',function(){if(!mq.matches||mode==='mouse')return;load();if(on<0){first=true;size();}mode='key';set(i);go();});
 a.addEventListener('blur',function(){if(mode==='key'){setTimeout(function(){if(!s.contains(document.activeElement)){set(-1);mode='';}},0);}});});
list.addEventListener('pointermove',function(e){if(mode!=='mouse')return;cx=e.clientX;cy=e.clientY;go();});
list.addEventListener('pointerleave',function(){if(mode==='mouse'){set(-1);mode='';}});
window.addEventListener('scroll',function(){if(on>-1)go();},{passive:true});
var q=location.search.match(/[?&]gi-hover=(\\d)/);if(q&&mq.matches){load();var i=+q[1]-1,a=links[i];if(a){var im=cards[i].querySelector('img'),fire=function(){var r3=a.querySelector('.gi-title-t').getBoundingClientRect();size();mode='mouse';cx=r3.right-10;cy=r3.top+r3.height*.45;first=true;set(i);go();};
 s.classList.add('gi-snap');(im.decode?im.decode():Promise.resolve()).then(fire,fire);}}
})();</script>`;

export const grow = (g) => `
<section class="gi" aria-labelledby="xl-grow-h">
  <link rel="stylesheet" href="/xp-grow-index.css">
  <div class="gi-wrap">
    <div class="gi-panel">
      <span class="gi-glow" aria-hidden="true"></span>
      <header class="gi-head" ${rv()}>
        <h2 id="xl-grow-h" class="gi-h2"><span class="gi-h2-a">${esc(g.heading.replace(/\s*grow\s*$/i, ''))} </span><span class="gi-h2-s">grow</span></h2>
        <div class="gi-aside">
          <span class="gi-count" aria-hidden="true">01<i></i>${num(g.links.length - 1)}</span>
          <p class="gi-lead">${esc(g.lead)}</p>
        </div>
      </header>
      <ol class="gi-list" role="list">${g.links.map(row).join('')}
      </ol>
      <div class="gi-float" aria-hidden="true">${g.links.map(card).join('')}</div>
    </div>
  </div>
  ${SCRIPT}
</section>`;

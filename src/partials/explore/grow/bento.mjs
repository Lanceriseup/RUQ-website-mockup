// G2 — Bento spotlight. "More ways to grow" as an asymmetric mosaic of four
// tiles: Events as the large hero, Masterclasses tall, Coaching wide, and the
// Free resource as a vivid magenta-to-teal tile with an animated gift.
//
// On a fine pointer (and without reduced motion) a soft light follows the
// cursor across the whole grid, each tile's border lights up where the cursor
// is nearest, and the tile under the pointer tilts towards it in 3D while its
// photo drifts the other way. The inline script only writes CSS custom
// properties; everything visual is in grow-bento.css. ?mx=&my= (percent of
// the grid) pins the light for screenshots.
import { esc, ICON, linkAttrs, newTab, isExternal, rv } from '../shared.mjs';

// Visual order (Events leads); copy and links come from content.json.
const TILES = [
  { href: '/events.html', key: 'events', src: '/assets/photos/journey-cheer.jpg', w: 1200, h: 1600, pos: '50% 18%' },
  { href: '/masterclasses.html', key: 'master', src: '/assets/photos/close-group.jpg', w: 2528, h: 1696, pos: '24% 50%' },
  { href: '/coaching.html', key: 'coach', src: '/assets/photos/close-talk.jpg', w: 2528, h: 1696, pos: '56% 26%' },
  { href: '/free-resource.html', key: 'free' },
];

const GIFT = `<svg class="gb-gift" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path class="gb-gift-box" d="M13 32h38v20a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4z M32 32v24"/>
  <g class="gb-gift-lid"><rect x="9" y="22" width="46" height="10" rx="3"/><path d="M32 22v10 M32 22s-4-11-11-9.5S19 22 32 22z M32 22s4-11 11-9.5S45 22 32 22z"/></g>
</svg>`;

const SCRIPT = `<script>(function(){
var s=document.currentScript&&document.currentScript.closest('.gb');if(!s)return;
var grid=s.querySelector('.gb-grid'),tiles=[].slice.call(s.querySelectorAll('.gb-tile'));
var q=/[?&]mx=([\\d.]+).*?[&]my=([\\d.]+)/.exec(location.search);
var mq=function(m){return window.matchMedia&&matchMedia(m).matches};
if(mq('(prefers-reduced-motion: reduce)'))return;
if(!q&&!mq('(hover: hover) and (pointer: fine)'))return;
s.classList.add('gb-live');
var raf=0,px=0,py=0;
function paint(){raf=0;var g=grid.getBoundingClientRect();
grid.style.setProperty('--mx',(px-g.left)+'px');grid.style.setProperty('--my',(py-g.top)+'px');
tiles.forEach(function(t){var r=t.getBoundingClientRect(),x=px-r.left,y=py-r.top;
t.parentNode.style.setProperty('--lx',x+'px');t.parentNode.style.setProperty('--ly',y+'px');
var inside=x>=0&&y>=0&&x<=r.width&&y<=r.height;
if(inside){var nx=x/r.width-.5,ny=y/r.height-.5;
t.style.setProperty('--rx',(-ny*2*5).toFixed(2)+'deg');t.style.setProperty('--ry',(nx*2*6).toFixed(2)+'deg');
t.style.setProperty('--px',nx.toFixed(3));t.style.setProperty('--py',ny.toFixed(3));t.classList.add('gb-hot');}
else if(t.classList.contains('gb-hot')){rest(t);}
});}
function rest(t){t.classList.remove('gb-hot');['--rx','--ry','--px','--py'].forEach(function(p){t.style.removeProperty(p)});}
function move(e){px=e.clientX;py=e.clientY;s.classList.add('gb-on');if(!raf)raf=requestAnimationFrame(paint);}
grid.addEventListener('pointermove',move);
grid.addEventListener('pointerleave',function(){s.classList.remove('gb-on');tiles.forEach(rest);});
if(q){var place=function(){var g=grid.getBoundingClientRect();move({clientX:g.left+g.width*q[1]/100,clientY:g.top+g.height*q[2]/100});};
window.addEventListener('load',place);window.addEventListener('scroll',place,{passive:true});setTimeout(place,300);}
})();</script>`;

export const grow = (g) => {
  const byHref = Object.fromEntries((g.links || []).map(l => [l.href, l]));
  const tiles = TILES.map((t, i) => ({ ...t, link: byHref[t.href] })).filter(t => t.link);
  const words = String(g.heading).trim().split(/\s+/);
  const last = words.pop();

  const tile = (t, i) => {
    const l = t.link;
    const media = t.key === 'free'
      ? `<span class="gb-media gb-media-free" aria-hidden="true">
          <span class="gb-aura"></span>
          <span class="gb-orb">${GIFT}<i class="gb-spark gb-s1"></i><i class="gb-spark gb-s2"></i><i class="gb-spark gb-s3"></i></span>
        </span>`
      : `<span class="gb-media"><img src="${esc(t.src)}" width="${t.w}" height="${t.h}" alt="" loading="lazy" decoding="async" style="object-position:${t.pos}"></span>`;
    return `
    <div class="gb-cell gb-${t.key}" ${rv(120 + i * 110)}>
      <a ${linkAttrs(l.href)} class="gb-tile">
        ${media}
        <span class="gb-edge" aria-hidden="true"></span>
        <span class="gb-sheen" aria-hidden="true"></span>
        <span class="gb-panel">
          <span class="gb-num" aria-hidden="true">0${i + 1}</span>
          <span class="gb-title">${esc(l.label)}${newTab(l.href)}</span>
          <span class="gb-blurb">${esc(l.blurb)}</span>
          <span class="gb-go" aria-hidden="true">${isExternal(l.href) ? ICON.out : ICON.arrow}</span>
        </span>
      </a>
    </div>`;
  };

  return `<section class="gb" aria-labelledby="xl-grow-h">
<link rel="stylesheet" href="/xp-grow-bento.css">
  <div class="gb-wrap">
    <header class="gb-head" ${rv()}>
      <h2 id="xl-grow-h" class="gb-h2">${esc(words.join(' '))} <span class="gb-script">${esc(last)}</span></h2>
      ${g.lead ? `<p class="gb-lead">${esc(g.lead)}</p>` : ''}
    </header>
    <div class="gb-grid">
      <span class="gb-light" aria-hidden="true"></span>
      ${tiles.map(tile).join('')}
    </div>
  </div>
  ${SCRIPT}
</section>`;
};

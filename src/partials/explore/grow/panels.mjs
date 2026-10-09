// G1 — Expanding panels. Four tall photo panels; the active one (hover, focus,
// or the first by default) opens wide to show its title, line and arrow, the
// rest fold to slim columns with a marker and a vertical title. Below 900px
// they stack as full-width photo cards with everything visible.
//
// Chosen for the Courses page on 2026-10-05. Two elements have options,
// compared on /g1-options.html (scripts/build-g1-options.mjs):
//
//   HEADS — the "More ways to grow" heading and its lead
//     current   Montserrat with "grow" in script, lead on the right
//     hero      centred: tracked kicker, a huge script "grow" whose swash
//               draws itself, lead in serif italic — echoes the page hero
//     stack     two big lines, "grow" in a moving magenta-to-teal gradient,
//               lead under a gradient rule at the right
//     ghost     a giant outlined GROW behind, the heading centred in front,
//               lead centred beneath
//     serif     Cormorant heading with "grow" in gradient italic, the lead
//               as small tracked capitals beside a gradient rule
//
//   MARKS — the 01–04 marker on each panel
//     current   "01" with a short gradient tick; a frosted chip when open
//     serif     italic serif numerals; a large numeral above the open title
//     outline   big outlined numerals; a giant outlined watermark when open
//     medal     a frosted medallion with a gradient ring; the open one fills
//               its ring to show the step (1 of 4, 2 of 4…)
//     icons     no numbers: an icon for each path in a frosted circle
//
// makeGrow({ head, mark }) renders any pairing; `grow` is the shipped one.
import { esc, ICON, linkAttrs, newTab, rv } from '../shared.mjs';

export const HEADS = ['current', 'hero', 'stack', 'ghost', 'serif'];
export const MARKS = ['current', 'serif', 'outline', 'medal', 'icons'];
const CHOSEN = { head: 'hero', mark: 'serif' };   // H1 + N1, chosen 2026-10-05

// One photograph per path, in content order. `pos` keeps the subject in frame
// when a panel is folded to a slim column.
const PHOTOS = [
  { src: '/assets/photos/gallery-2-1.jpg', w: 1280, h: 720, pos: '30% 30%', alt: 'A speaker teaching a group in front of a whiteboard and screen' },
  { src: '/assets/photos/journey-cheer.jpg', w: 1200, h: 1600, pos: '50% 22%', alt: 'A woman wearing a crown cheers with both arms raised at a Freedom event' },
  { src: '/assets/photos/close-talk.jpg', w: 2528, h: 1696, pos: '64% 40%', alt: 'Two women sitting face to face in a quiet, personal conversation' },
  { src: '/assets/photos/close-laugh.jpg', w: 1200, h: 1600, pos: '44% 28%', alt: 'A woman laughing warmly with her hand on her heart' },
];

// Icons for the "icons" marker, matched by link.
const GLYPH = {
  master: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5 12 4l9 3.5-9 3.5z"/><path d="M7 9.5v4.2c0 1.4 2.2 2.8 5 2.8s5-1.4 5-2.8V9.5M21 7.5v5"/></svg>',
  event: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13.2l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2-1.45-1.4 2-.3z"/></svg>',
  coach: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-11 6.6L4 19.5l1.4-4.6A7.5 7.5 0 1 1 20 11.5z"/><path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01"/></svg>',
  free: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5S10.5 4 8 4.5 7 8.5 12 8.5zM12 8.5S13.5 4 16 4.5 17 8.5 12 8.5z"/></svg>',
};
const glyph = (href) => /master/.test(href) ? GLYPH.master : /event/.test(href) ? GLYPH.event : /coach/.test(href) ? GLYPH.coach : GLYPH.free;

const pad = (i) => String(i + 1).padStart(2, '0');

// The marker, folded (on the slim column) and open (above the title).
const MARK = {
  current: (l, i) => ({
    fold: `<span class="gp-num" aria-hidden="true">${pad(i)}</span>`,
    open: `<span class="gp-tag" aria-hidden="true">${pad(i)}<i></i>${/free/i.test(l.label) ? `<span class="gp-gift">${ICON.gift}</span>` : ''}</span>`,
  }),
  serif: (l, i) => ({
    fold: `<span class="gp-num gp-num--serif" aria-hidden="true">${pad(i)}</span>`,
    open: `<span class="gp-tag gp-tag--serif" aria-hidden="true">${pad(i)}</span>`,
  }),
  outline: (l, i) => ({
    fold: `<span class="gp-num gp-num--outline" aria-hidden="true">${pad(i)}</span>`,
    open: '',
    extra: `<span class="gp-wm" aria-hidden="true">${pad(i)}</span>`,
  }),
  medal: (l, i, n) => ({
    fold: `<span class="gp-num gp-num--medal" aria-hidden="true" style="--p:${(i + 1) / n}"><b>${i + 1}</b></span>`,
    open: `<span class="gp-tag gp-tag--medal" aria-hidden="true" style="--p:${(i + 1) / n}"><b>${i + 1}</b><em>of ${n}</em></span>`,
  }),
  icons: (l) => ({
    fold: `<span class="gp-num gp-num--icon" aria-hidden="true">${glyph(l.href)}</span>`,
    open: `<span class="gp-tag gp-tag--icon" aria-hidden="true">${glyph(l.href)}</span>`,
  }),
};

const panel = (mark, n) => (l, i) => {
  const p = PHOTOS[i % PHOTOS.length];
  const m = MARK[mark](l, i, n);
  return `
    <li class="gp-item${i === 0 ? ' is-active' : ''}" style="--i:${i}">
      <a class="gp-panel" ${linkAttrs(l.href)}>
        <span class="gp-media"><img class="gp-img" src="${esc(p.src)}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" style="object-position:${p.pos}" loading="lazy" decoding="async"></span>
        <span class="gp-shade" aria-hidden="true"></span>
        ${m.extra || ''}
        ${m.fold}
        <span class="gp-fold" aria-hidden="true">${esc(l.label)}</span>
        <span class="gp-body">
          ${m.open}
          <h3 class="gp-title">${esc(l.label)}</h3>
          <span class="gp-blurb">${esc(l.blurb)}</span>
        </span>
        <span class="gp-go" aria-hidden="true">${ICON.arrow}</span>${newTab(l.href)}
      </a>
    </li>`;
};

// The heading and lead.
const SWASH = '<svg class="gp-swash" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M4 16 C 60 7, 112 5, 160 9 S 252 17, 296 10"/></svg>';
const HEAD = {
  current: (lead, words, last) => `
  <header class="gp-head" ${rv()}>
    <h2 id="xl-grow-h" class="gp-h2">${esc(words)} <span class="gp-script">${esc(last)}</span></h2>
    <p class="gp-lead">${esc(lead)}</p>
  </header>`,
  hero: (lead, words, last) => `
  <header class="gp-head gp-head--hero" ${rv()}>
    <h2 id="xl-grow-h" class="gp-h2"><span class="gp-kicker">${esc(words)}</span> <span class="gp-big"><span class="gp-big-w">${esc(last)}</span>${SWASH}</span></h2>
    <p class="gp-lead">${esc(lead)}</p>
  </header>`,
  stack: (lead, words, last) => `
  <header class="gp-head gp-head--stack" ${rv()}>
    <h2 id="xl-grow-h" class="gp-h2"><span class="gp-line">${esc(words.split(' ').slice(0, 2).join(' '))}</span> <span class="gp-line">${esc(words.split(' ').slice(2).join(' '))} <span class="gp-grad">${esc(last)}</span></span></h2>
    <p class="gp-lead">${esc(lead)}</p>
  </header>`,
  ghost: (lead, words, last) => `
  <header class="gp-head gp-head--ghost" ${rv()}>
    <span class="gp-ghost" aria-hidden="true">${esc(last)}</span>
    <h2 id="xl-grow-h" class="gp-h2">${esc(words)} <span class="gp-script">${esc(last)}</span></h2>
    <p class="gp-lead">${esc(lead)}</p>
  </header>`,
  serif: (lead, words, last) => `
  <header class="gp-head gp-head--serif" ${rv()}>
    <h2 id="xl-grow-h" class="gp-h2">${esc(words)} <em>${esc(last)}</em></h2>
    <p class="gp-lead">${esc(lead)}</p>
  </header>`,
};

// Hover / focus open a panel and it stays open when the pointer leaves, so the
// row never snaps back. On touch, a first tap on a folded panel opens it and a
// second tap follows the link. ?gp=N opens panel N (for review screenshots).
const SCRIPT = `<script>
(function(){
  var rail=document.querySelector('.xp-luminous .gp .gp-rail'); if(!rail) return;
  var items=[].slice.call(rail.querySelectorAll('.gp-item'));
  var wide=window.matchMedia('(min-width: 900px)'), touch=false;
  function open(it){ items.forEach(function(x){ x.classList.toggle('is-active', x===it); }); }
  items.forEach(function(it){
    var a=it.querySelector('a');
    it.addEventListener('pointerenter',function(e){ if(e.pointerType==='mouse') open(it); });
    it.addEventListener('focusin',function(){ open(it); });
    a.addEventListener('pointerdown',function(e){ touch=e.pointerType!=='mouse'; });
    a.addEventListener('click',function(e){
      if(touch && wide.matches && !it.classList.contains('is-active')){ e.preventDefault(); open(it); }
      touch=false;
    });
  });
  var m=/[?&]gp=(\\d)/.exec(location.search); if(m && items[m[1]-1]){ open(items[m[1]-1]); rail.classList.add('is-in'); }
  rail.classList.add('gp-js');
})();
</script>`;

export const makeGrow = ({ head = CHOSEN.head, mark = CHOSEN.mark } = {}) => (g) => {
  const words = String(g.heading).trim().split(/\s+/);
  const last = words.pop();
  const h = HEAD[head] ? head : 'current';
  const k = MARK[mark] ? mark : 'current';
  return `<section class="gp gp-h-${h} gp-m-${k}" aria-labelledby="xl-grow-h">
<link rel="stylesheet" href="/xp-grow-panels.css">
<div class="gp-wrap">
  <span class="gp-glow" aria-hidden="true"></span>
  ${HEAD[h](g.lead, words.join(' '), last)}
  <ul class="gp-rail" role="list" ${rv(120)}>${g.links.map(panel(k, g.links.length)).join('')}
  </ul>
</div>
${SCRIPT}
</section>`;
};

export const grow = makeGrow();

// Direction C — Pathway. Built on the Courses headline, "Continue your
// journey": one hand-drawn pink-to-teal line runs down each page, drawing
// itself as you scroll, and links the page's steps as numbered "stations".
//
// How the line works
//   Every page is wrapped in [data-xw-journey]. Inside it sits one SVG the
//   size of the whole page with three paths: a faint dotted "route ahead"
//   (always visible), a soft halo and the ink line — the last two carry
//   data-xp-draw, so explore.js draws them with scroll.
//   The route is not hard-coded: the small inline script below measures every
//   [data-xw-pt] (station nodes and invisible waypoints) in document order and
//   threads a smooth Catmull-Rom curve through them, so the line meets the
//   real nodes at every width. CSS moves the nodes — winding across the page
//   from 1024px, a simple rail down the left edge below that — and hides
//   waypoints that belong to the other layout (.xw-d desktop / .xw-m phone).
//   It re-measures on resize, font load and image load, and keeps explore.js's
//   stored length (path.__len) in step. Stations light up as the line reaches
//   them. Reduced motion: explore.js shows the line fully drawn and every
//   station is lit.
//
// All copy comes from content.json → explore; nothing is invented.
import { esc, ICON, action, linkAttrs, newTab, isExternal, disabledForm, waitlistForm, videoButton, countdown, coaches, rv } from './shared.mjs';
import { swash } from '../spread.mjs';

const MAG = '#e8208f';

// ------------------------------------------------------------------ pieces

/** A station node. `n` is the visible label (a number, an icon, "+"). */
export const node = (n, cls = '') => `<span class="xw-node ${cls}" data-xw-pt data-xw-node aria-hidden="true"><span class="xw-node-in">${n}</span></span>`;

/** An invisible point the line passes through. `cls` places it (and hides it
 *  in the other layout: xw-d = desktop only, xw-m = phone/tablet only). */
export const wp = (cls) => `<i class="xw-wp ${cls}" data-xw-pt aria-hidden="true"></i>`;

/** Detours into the page margins, so the line swings round blocks of text
 *  instead of through them (desktop only). */
const rightDrop = () => wp('xw-wp-rm xw-wp-rm-top xw-d') + wp('xw-wp-rm xw-wp-rm-bot xw-d');
const leftDrop = () => wp('xw-wp-lm xw-wp-lm-top xw-d') + wp('xw-wp-lm xw-wp-lm-bot xw-d');

export const pad = (i) => String(i).padStart(2, '0');

export const img = (src, alt, w, h, cls = '', eager = false) =>
  `<img src="${esc(src)}" alt="${esc(alt)}" width="${w}" height="${h}" class="${cls}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

const eyebrow = (t) => `<p class="xw-eyebrow"><span class="xw-eyebrow-bar" aria-hidden="true"></span>${esc(t)}</p>`;

/** The script word with its hand-drawn swash and the line's starting point. */
const scriptWord = (t, cls = '') => `<span class="xw-sw ${cls}"><span class="xw-script">${esc(t)}</span>${swash(MAG)}<span class="xw-start" data-xw-pt aria-hidden="true"></span></span>`;

const btn = (label, href, cls = '') => action(label, href, `xw-btn ${cls}`);
const link = (label, href, cls = '') => action(label, href, `xw-link ${cls}`);

const play = (label) => `<span class="xw-play" aria-hidden="true">${ICON.play}</span>${label ? `<span class="xw-vlabel" aria-hidden="true"><span class="xw-vlabel-k">Watch</span>${esc(label)}</span>` : ''}`;

const formCls = { form: 'xw-form', button: 'xw-submit' };

// The line. Measures, threads, keeps explore.js in step, lights stations.
const LINE_JS = `<script>
(function () {
  var root = document.querySelector('[data-xw-journey]');
  if (!root || !root.getBoundingClientRect) return;
  var svg = root.querySelector('.xw-line');
  var grad = svg.querySelector('linearGradient');
  var ghost = svg.querySelector('.xw-line-ghost');
  var draws = [].slice.call(svg.querySelectorAll('[data-xp-draw]'));
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stops = [], drawnOnce = false;
  root.classList.add('xw-js');

  function measure() {
    var r = root.getBoundingClientRect(), out = [];
    [].forEach.call(root.querySelectorAll('[data-xw-pt]'), function (el) {
      if (!el.offsetParent) return; // hidden in this layout
      var b = el.getBoundingClientRect();
      out.push({ x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2, el: el.hasAttribute('data-xw-node') ? el : null });
    });
    return out;
  }
  // Long straight drops get a gentle sway, so the rail still reads hand-drawn.
  function sway(p, narrow) {
    var out = [p[0]], s = 1;
    for (var i = 1; i < p.length; i++) {
      var a = p[i - 1], b = p[i], dx = b.x - a.x, dy = b.y - a.y;
      if (Math.abs(dx) < 48 && dy > 170) {
        var n = Math.min(4, Math.floor(dy / (narrow ? 230 : 380)));
        for (var k = 1; k <= n; k++) { out.push({ x: a.x + dx * k / (n + 1) + s * (narrow ? 6 : 20), y: a.y + dy * k / (n + 1) }); s = -s; }
      }
      out.push(b);
    }
    return out;
  }
  function f(n) { return Math.round(n * 10) / 10; }
  // Centripetal Catmull-Rom (alpha 0.5) as cubic Beziers: smooth through
  // every point, without the overshoot and loops of the uniform kind.
  function dist(a, b) { return Math.sqrt(Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y))) || 1e-4; }
  function curve(p, upto) {
    var d = 'M' + f(p[0].x) + ' ' + f(p[0].y);
    for (var i = 0; i < upto; i++) {
      var p1 = p[i], p2 = p[i + 1];
      var p0 = p[i - 1] || { x: 2 * p1.x - p2.x, y: 2 * p1.y - p2.y };
      var p3 = p[i + 2] || { x: 2 * p2.x - p1.x, y: 2 * p2.y - p1.y };
      var d1 = dist(p0, p1), d2 = dist(p1, p2), d3 = dist(p2, p3);
      var a = 2 * d1 * d1 + 3 * d1 * d2 + d2 * d2, n = 3 * d1 * (d1 + d2);
      var b = 2 * d3 * d3 + 3 * d3 * d2 + d2 * d2, m = 3 * d3 * (d3 + d2);
      var c1x = (d1 * d1 * p2.x - d2 * d2 * p0.x + a * p1.x) / n, c1y = (d1 * d1 * p2.y - d2 * d2 * p0.y + a * p1.y) / n;
      var c2x = (d3 * d3 * p1.x - d2 * d2 * p3.x + b * p2.x) / m, c2y = (d3 * d3 * p1.y - d2 * d2 * p3.y + b * p2.y) / m;
      d += 'C' + f(c1x) + ' ' + f(c1y) + ' ' + f(c2x) + ' ' + f(c2y) + ' ' + f(p2.x) + ' ' + f(p2.y);
    }
    return d;
  }
  function apply() {
    var W = root.offsetWidth;
    var pts = measure();
    if (pts.length < 2) return;
    // The drawing ends at the last station, so explore.js finishes the line
    // as that station reaches the middle of the screen.
    var H = Math.ceil(pts[pts.length - 1].y + 40);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('width', W); svg.setAttribute('height', H);
    pts = sway(pts, W < 1024);
    var d = curve(pts, pts.length - 1);
    grad.setAttribute('y1', pts[0].y); grad.setAttribute('y2', pts[pts.length - 1].y);
    ghost.setAttribute('d', d);
    // arc length at each station, for lighting
    stops = [];
    for (var i = 0; i < pts.length; i++) if (pts[i].el) {
      ghost.setAttribute('d', i ? curve(pts, i) : 'M0 0');
      stops.push({ el: pts[i].el, at: i ? ghost.getTotalLength() : 0 });
    }
    ghost.setAttribute('d', d);
    draws.forEach(function (p) {
      var prevLen = p.__len, prevOff = parseFloat(p.style.strokeDashoffset);
      var undrawn = prevLen && !isNaN(prevOff) ? prevOff / prevLen : 1;
      p.setAttribute('d', d);
      var len = p.getTotalLength();
      p.__len = len;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reduced ? 0 : len * undrawn;
    });
    drawnOnce = true;
    try { window.dispatchEvent(new Event('scroll')); } catch (e) {}
    requestAnimationFrame(light);
  }
  function light() {
    var p = draws[draws.length - 1]; if (!p || !p.__len) return;
    var off = parseFloat(p.style.strokeDashoffset);
    var drawn = reduced || isNaN(off) ? p.__len : p.__len - off;
    stops.forEach(function (s) { s.el.classList.toggle('is-lit', s.at <= drawn + 6); });
  }
  var queued = false;
  function soon() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; apply(); }); }
  addEventListener('scroll', function () { requestAnimationFrame(light); }, { passive: true });
  addEventListener('load', soon);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
  if ('ResizeObserver' in window) new ResizeObserver(soon).observe(root); else addEventListener('resize', soon);
  [].forEach.call(root.querySelectorAll('img'), function (im) { if (!im.complete) im.addEventListener('load', soon); });
  apply();
})();
</script>`;

/** The page wrapper: ground, the line's SVG, the page, the line script.
 *  Exported for the Courses page, which uses Luminous but borrows this
 *  direction's "More ways to grow" section and its line (luminous.mjs). */
export const journey = (page, inner) => `
<div class="xw xw-${page}" data-xw-journey>
  <div class="xw-ground" aria-hidden="true"><span class="xw-glow xw-glow-a"></span><span class="xw-glow xw-glow-b"></span></div>
  <svg class="xw-line" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="xw-grad-${page}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000">
        <stop offset="0" stop-color="#e8208f"/><stop offset=".5" stop-color="#a24bcf"/><stop offset="1" stop-color="#00b9c6"/>
      </linearGradient>
    </defs>
    <path class="xw-line-ghost" d=""/>
    <path class="xw-line-halo" d="" data-xp-draw stroke="url(#xw-grad-${page})"/>
    <path class="xw-line-ink" d="" data-xp-draw stroke="url(#xw-grad-${page})"/>
  </svg>
  ${inner}
</div>
${LINE_JS}`;

/** Hero: eyebrow, the one h1, lead. `h1` is HTML. */
const hero = ({ eyebrow: eb, h1, lead, cls = '', aside = '' }) => `
<header class="xw-hero xw-wrap ${cls}">
  <div class="xw-hero-text">
    ${eb ? eyebrow(eb) : ''}
    <h1 class="xw-h1">${h1}</h1>
    <p class="xw-lead xw-hero-lead">${wp('xw-wp-hero xw-m')}${esc(lead)}</p>
  </div>
  ${aside}
</header>`;

// ------------------------------------------------------------------ courses

export const courses = (site, c) => {
  const k = c.explore.courses, f = k.featured, m = k.more, g = k.grow;
  const growMedia = [
    { kind: 'photo', src: '/assets/photos/gallery-2-1.jpg', w: 1280, h: 720, pos: '50% 40%' },
    { kind: 'photo', src: '/assets/photos/journey-cheer.jpg', w: 1200, h: 1600, pos: '50% 22%' },
    { kind: 'photo', src: '/assets/photos/close-talk.jpg', w: 2528, h: 1696, pos: '60% 40%' },
    { kind: 'colour' },
  ];
  return journey('courses', `
${hero({
  eyebrow: k.eyebrow,
  h1: `<span class="xw-h1-sans">Continue your</span> ${scriptWord('journey.')}`,
  lead: k.lead,
  cls: 'xw-hero--courses',
})}

<section class="xw-wrap xw-rail xw-sec xw-c-bento" aria-labelledby="xw-nlb-h">
  <div class="xw-bento">
    <article class="xw-tile xw-nlb xw-st" ${rv()}>
      ${node('01', 'xw-node--nlb')}
      <div class="xw-nlb-media">
        ${img('/assets/nlb/nlb-photo-embrace.jpg', 'Two women holding each other in a long embrace at a Rise Up Queens gathering', 960, 1046)}
        <span class="xw-tag">${esc(f.label)}</span>
      </div>
      <div class="xw-nlb-body">
        ${img('/assets/nlb/nlb-mark.png', '', 900, 522, 'xw-nlb-mark')}
        <h2 id="xw-nlb-h" class="xw-nlb-name">${esc(f.name)}</h2>
        <p class="xw-script xw-nlb-script">${esc(f.script)}</p>
        <p class="xw-nlb-headline">${esc(f.headline)}</p>
        <p class="xw-nlb-q">${esc(f.question)}</p>
        <p class="xw-nlb-text">${esc(f.body)}</p>
        ${btn(f.cta, f.url)}
      </div>
    </article>
    <article class="xw-tile xw-more xw-st" ${rv(120)}>
      ${node('+', 'xw-node--future')}
      <p class="xw-kicker">${esc(m.label)}</p>
      <h2 class="xw-more-h">${esc(m.name)}</h2>
      <p class="xw-more-p">${esc(m.body)}</p>
    </article>
    <figure class="xw-tile xw-photo xw-c-photo" ${rv(200)}>
      ${img('/assets/nlb/nlb-photo-speaker.jpg', 'A Rise Up Queens speaker teaching from the front of the room', 1600, 1067)}
    </figure>
    ${rightDrop()}
  </div>
</section>

<section class="xw-band xw-band--teal xw-sec" aria-labelledby="xw-grow-h">
  <div class="xw-wrap xw-rail">
    <div class="xw-sechead xw-sechead--split">
      ${leftDrop()}
      <h2 id="xw-grow-h" class="xw-h2">More ways to <span class="xw-script xw-h2-script">grow</span></h2>
      <p class="xw-lead">${esc(g.lead)}</p>
    </div>
    <ul class="xw-grow" role="list">
      ${g.links.map((l, i) => {
        const md = growMedia[i];
        const media = md.kind === 'photo'
          ? `<span class="xw-grow-media">${img(md.src, '', md.w, md.h)}</span>`
          : `<span class="xw-grow-media xw-grow-colour"><span class="xw-grow-gift">${ICON.gift}</span></span>`;
        return `
      <li class="xw-grow-item xw-st" ${rv(i * 90)}>
        ${node(pad(i + 2))}
        <a ${linkAttrs(l.href)} class="xw-grow-tile" style="--pos:${md.pos || '50% 50%'}">
          ${media}
          <span class="xw-grow-body">
            <span class="xw-grow-h">${esc(l.label)}${newTab(l.href)}</span>
            <span class="xw-grow-p">${esc(l.blurb)}</span>
            <span class="xw-grow-go" aria-hidden="true">${isExternal(l.href) ? ICON.out : ICON.arrow}</span>
          </span>
        </a>
      </li>`;
      }).join('')}
    </ul>
  </div>
</section>`);
};

// ------------------------------------------------------------- masterclasses

const MC_IMG = {
  control: { src: '/assets/photos/close-hands.jpg', w: 1856, h: 2304, alt: 'A woman raising her hands in worship during a session', pos: '50% 30%' },
  freedom: { src: '/assets/nlb/nlb-photo-greet.jpg', w: 1600, h: 1067, alt: 'Women greeting one another outdoors with open arms', pos: '38% 50%' },
  body: { src: '/assets/photos/close-laugh.jpg', w: 1856, h: 2304, alt: 'A woman laughing freely, hand on her heart', pos: '50% 30%' },
};

export const masterclasses = (site, c) => {
  const m = c.explore.masterclasses;
  return journey('masterclasses', `
${hero({
  eyebrow: 'Rise Up Queens',
  h1: scriptWord(m.heading, 'xw-sw--solo'),
  lead: m.lead,
  cls: 'xw-hero--solo',
})}

<section class="xw-wrap xw-rail xw-sec xw-mcs" aria-label="${esc(m.heading)}">
  ${m.items.map((it, i) => {
    const im = MC_IMG[it.key] || MC_IMG.control;
    return `
  <article class="xw-mc xw-st ${i % 2 ? 'xw-mc--flip' : ''}" aria-labelledby="xw-mc-${esc(it.key)}">
    ${node(pad(i + 1))}
    <div class="xw-mc-media" ${rv()}>
      <div class="xw-mc-frame" style="--pos:${im.pos}">${img(im.src, im.alt, im.w, im.h)}</div>
      <p class="xw-mc-dur">${ICON.clock}<span>${esc(it.duration)}</span></p>
    </div>
    <div class="xw-mc-text" ${rv(120)}>
      <p class="xw-kicker">Masterclass ${pad(i + 1)}</p>
      <h2 id="xw-mc-${esc(it.key)}" class="xw-h2 xw-mc-h">${esc(it.name)}</h2>
      <p class="xw-mc-p">${esc(it.blurb)}</p>
      <a href="#xw-wl-panel" class="xw-link" data-xw-pick="${esc(it.key)}">${esc(m.form.heading)}${ICON.arrow}</a>
    </div>
    ${wp(`xw-wp-side ${i % 2 ? 'xw-wp-side-r' : 'xw-wp-side-l'} xw-d`)}
  </article>`;
  }).join('')}
</section>

<section id="xw-wl-panel" class="xw-band xw-band--blush xw-sec xw-wl-sec" aria-labelledby="xw-wl-h">
  <div class="xw-wrap xw-rail">
    <div class="xw-panel xw-st" ${rv()}>
      ${node(ICON.arrow.replace('class="xp-ic"', 'class="xp-ic xw-node-ic"'), 'xw-node--end')}
      <div class="xw-panel-head">
        <h2 id="xw-wl-h" class="xw-h2">${esc(m.form.heading)}</h2>
      </div>
      ${waitlistForm(m, { id: 'xw-wl', cls: formCls })}
    </div>
  </div>
</section>
<script>
(function () {
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-xw-pick]');
    if (!a) return;
    var r = document.querySelector('input[name="xw-wl-class"][value="' + a.getAttribute('data-xw-pick') + '"]');
    if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
  });
})();
</script>`);
};

// ------------------------------------------------------------------ events

export const events = (site, c, vids) => {
  const e = c.explore.events, [d1, d2] = e.dates, b = e.beyond, inf = e.info, w = e.watch;
  const [big, ...rest] = w.videos;
  return journey('events', `
${hero({
  h1: `<span class="xw-h1-sans">Upcoming</span> ${scriptWord('events')}`,
  eyebrow: 'Rise Up Queens',
  lead: e.lead,
  cls: 'xw-hero--events',
})}

<section class="xw-wrap xw-rail xw-sec xw-ev" aria-label="Freedom dates">
  <div class="xw-ev-grid">
    <article class="xw-tile xw-ev-main xw-st" aria-labelledby="xw-ev1" ${rv()}>
      ${node('01', 'xw-node--ev')}
      <div class="xw-ev-photo">
        ${img('/assets/photos/about-hero-group.jpg', 'Hundreds of women together on the floor of a Freedom event, smiling for a group photo', 2880, 1920)}
        <span class="xw-tag">Next date</span>
      </div>
      <div class="xw-ev-body">
        <p class="xw-kicker">${esc(d1.month)}</p>
        <h2 id="xw-ev1" class="xw-ev-name"><img src="/assets/brand/freedom-logo.png" alt="${esc(d1.name)}" width="1500" height="640" decoding="async"></h2>
        <p class="xw-ev-dates">${esc(d1.dates)}</p>
        <p class="xw-ev-loc">${ICON.pin}<span>${esc(d1.location)}</span></p>
        <div class="xw-ev-price"><span class="xw-ev-amt">${esc(d1.price)}</span><span class="xw-ev-note">${esc(d1.priceNote)}</span></div>
        ${countdown(d1.startsAt, { wrap: 'xw-cd' })}
        ${btn(d1.cta, d1.url)}
      </div>
    </article>
    <article class="xw-tile xw-ev-next xw-st" aria-labelledby="xw-ev2" ${rv(120)}>
      ${node('02')}
      <p class="xw-kicker">${esc(d2.month)}</p>
      <h2 id="xw-ev2" class="xw-ev-name xw-ev-name--sm"><img src="/assets/brand/freedom-logo.png" alt="${esc(d2.name)}" width="1500" height="640" loading="lazy" decoding="async"></h2>
      <p class="xw-ev-dates xw-ev-dates--sm">${esc(d2.dates)}</p>
      <p class="xw-ev-loc">${ICON.pin}<span>${esc(d2.location)}</span></p>
      ${btn(d2.cta, d2.url, 'xw-btn--ghost')}
    </article>
    <figure class="xw-tile xw-photo xw-ev-side" ${rv(200)}>
      ${img('/assets/photos/journey-embrace.jpg', 'Two women embracing at a Freedom event', 1200, 1600)}
    </figure>
    ${rightDrop()}
  </div>
</section>

<section class="xw-band xw-band--blush xw-sec" aria-labelledby="xw-beyond-h">
  <div class="xw-wrap xw-rail">
    <div class="xw-sechead xw-sechead--split">
      ${leftDrop()}
      <h2 id="xw-beyond-h" class="xw-h2">Beyond <span class="xw-script xw-h2-script">Freedom</span></h2>
      <p class="xw-lead">${esc(b.lead)}</p>
    </div>
    <ol class="xw-snake" role="list">
      ${b.journeys.map((j, i) => `
      <li class="xw-snake-item xw-st xw-snake-${i + 1}" ${rv((i % 3) * 90)}>
        ${node(pad(i + 3))}
        <div class="xw-stop">
          <h3 class="xw-stop-h">${esc(j.name)}</h3>
          <p class="xw-stop-p">${esc(j.blurb)}</p>
          ${j.url ? link(j.cta, j.url) : ''}
        </div>
        ${i === 2 ? wp('xw-wp-turn xw-d') : ''}${i === 5 ? wp('xw-wp-s6 xw-d') : ''}
      </li>`).join('')}
    </ol>
  </div>
</section>

<section class="xw-wrap xw-rail xw-sec xw-info" aria-labelledby="xw-info-h">
  <div class="xw-panel xw-panel--info xw-st" ${rv()}>
    ${node('09')}
    ${wp('xw-wp-pl xw-d')}
    <div class="xw-panel-head">
      <h2 id="xw-info-h" class="xw-h2 xw-h2--md">${esc(inf.heading)}</h2>
      <p class="xw-lead">${esc(inf.lead)}</p>
    </div>
    ${disabledForm({ fields: inf.fields, submit: inf.submit, id: 'xw-info', cls: formCls })}
  </div>
</section>

<section class="xw-wrap xw-rail xw-sec xw-watch" aria-labelledby="xw-watch-h">
  <div class="xw-sechead xw-st">
    ${node(ICON.play.replace('width="22" height="22"', 'width="16" height="16"'), 'xw-node--end')}
    <h2 id="xw-watch-h" class="xw-h2 xw-h2--md">${esc(w.heading)}</h2>
    <p class="xw-lead">${esc(w.lead)}</p>
  </div>
  <div class="xw-vbento">
    <div class="xw-vb-big" ${rv()}>${videoButton(big, { cls: 'xw-vid', inner: play(big.name), ratio: 'xw-r-big' })}</div>
    ${rest.map((v, i) => `<div class="xw-vb-sm" ${rv(80 + i * 70)}>${videoButton(v, { cls: 'xw-vid', inner: play(v.name), ratio: 'xw-r-sm' })}</div>`).join('')}
  </div>
</section>`);
};

// ------------------------------------------------------------------ coaching

export const coaching = (site, c, vids) => {
  const k = c.explore.coaching, list = coaches(c);
  return journey('coaching', `
${hero({
  eyebrow: 'Rise Up Queens',
  h1: scriptWord(k.heading, 'xw-sw--solo'),
  lead: k.lead,
  cls: 'xw-hero--solo xw-hero--solo-r',
})}

<section class="xw-wrap xw-rail xw-sec xw-coaches-sec" aria-label="Coaches">
  <ul class="xw-coaches" role="list">
    ${list.map((x, i) => `
    <li class="xw-coach xw-st" ${rv(i * 90)}>
      ${node(pad(i + 1))}
      <article class="xw-coach-card" aria-labelledby="xw-coach-${i}">
        <div class="xw-coach-photo">
          ${img(x.photo, `Portrait of ${x.name}`, 1707, 2560)}
          <h2 id="xw-coach-${i}" class="xw-coach-name"><span class="xw-coach-k">Coach</span>${esc(x.name)}</h2>
        </div>
        <div class="xw-coach-body">
          <p class="xw-coach-blurb">${esc(x.blurb)}</p>
          ${link(x.cta, x.url)}
        </div>
      </article>
    </li>`).join('')}
  </ul>
  ${rightDrop()}
</section>

<section class="xw-band xw-band--teal xw-sec" aria-labelledby="xw-cv-h">
  <div class="xw-wrap xw-rail">
    <div class="xw-sechead xw-st">
      ${wp('xw-wp-lm xw-wp-lm-top xw-d')}
      ${node(ICON.play.replace('width="22" height="22"', 'width="16" height="16"'), 'xw-node--end')}
      <h2 id="xw-cv-h" class="xw-h2 xw-h2--md">${esc(k.videosHeading)}</h2>
    </div>
    <div class="xw-cvids">
      ${k.videos.map((v, i) => `<div ${rv(i * 100)}>${videoButton(v, { cls: 'xw-vid xw-vid--strip', inner: `<span class="xw-strip" aria-hidden="true"><span class="xw-play">${ICON.play}</span><span class="xw-strip-t"><span class="xw-vlabel-k">Watch</span>${esc(v.name)}</span></span>`, ratio: 'xw-r-strip' })}</div>`).join('')}
    </div>
  </div>
</section>`);
};

// ------------------------------------------------------------- free resource

export const free = (site, c) => {
  const r = c.explore.freeResource;
  return journey('free', `
${hero({
  eyebrow: 'Rise Up Queens',
  h1: `<span class="xw-h1-sans">Free</span> ${scriptWord('resource')}`,
  lead: r.lead,
  cls: 'xw-hero--free',
})}

<section class="xw-wrap xw-rail xw-sec xw-gift-sec" aria-labelledby="xw-gift-h">
  <div class="xw-gift-grid">
    <figure class="xw-tile xw-photo xw-gift-p1" ${rv()}>${img('/assets/photos/journey-embrace.jpg', '', 1200, 1600)}</figure>
    <figure class="xw-tile xw-photo xw-gift-p2" ${rv(100)}>${img('/assets/illustrations/illo-pray.jpg', '', 1792, 2400)}</figure>
    ${wp('xw-wp-gift xw-d')}
    <article class="xw-tile xw-gift xw-st" ${rv(160)}>
      ${node(ICON.gift.replace('width="18" height="18"', 'width="26" height="26"'), 'xw-node--gift')}
      <p class="xw-status"><span class="xw-status-dot" aria-hidden="true"></span>Pending</p>
      <h2 id="xw-gift-h" class="xw-gift-h">${esc(r.pending.heading)}</h2>
      <p class="xw-gift-p">${esc(r.pending.body)}</p>
    </article>
  </div>
</section>`);
};

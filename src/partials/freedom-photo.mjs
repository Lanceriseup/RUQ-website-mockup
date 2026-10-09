// Freedom section, photo-led redesign options (/freedom-photo-options.html).
//
// Every option uses the breakthrough CTA's photograph (site.assets.heroPoster,
// the crowned group shot) and the same copy as the live section
// (content.json home.freedom). Type is Lato, the client's font, with the
// Freedom wordmark and the brush strokes unchanged.
//
// The photo's top third is plain ceiling and wall and the women fill the
// lower half, so the copy-over-photo options set the copy high and let the
// faces carry the bottom of the section.
//
//   cinema  full-bleed photo under a deep ink fade, white copy over the wall
//   veil    light blush section, the photo rising out of the bottom edge
//   split   photo half and copy half, side by side
//   glass   full-bleed photo with a frosted white card over it
//
// Variants on glass's background (/freedom-d-options.html), each keeping its
// full-bleed photo and tint with a new foreground:
//
//   spot    a light that follows the pointer across the darkened room
//   knock   "FREEDOM" cut out of a dark veil, the women seen through it
//   ribbon  a frosted band edge to edge across the photo
//   duo     the photo as a brand duotone poster, with grain
//
// Light variants (/freedom-light-options.html), bright ground and ink type:
//
//   lreveal  a white haze the pointer wipes clear (spot's light twin)
//   lknock   FREEDOM cut out of a blush veil (knock's light twin)
//   lduo     the photo washed into pastels
//   lhalo    a white halo round the copy, ringed by turning gradient light
//
// Styles are .fx-* in src/styles/freedom-photo.css. data-fr makes app.js add
// .is-in when the section scrolls into view, which starts the reveal.
import { esc } from './layout.mjs';

const MARKS = ['turning point', 'clarity, freedom, and a faith that feels alive again'];
const body = (text) => MARKS.reduce((t, m) => t.replace(esc(m), `<mark>${esc(m)}</mark>`), esc(text));

const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

// The same white wave and brush ribbon the live section hands over with.
const WAVE = `
  <svg class="fx-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 72 C 260 18, 520 18, 760 58 C 1000 98, 1200 112, 1440 46 L1440 120 L0 120 Z" fill="#ffffff"/>
  </svg>
  <svg class="fx-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="fx-ribbon-g" x1="0" x2="1"><stop offset="0" stop-color="#e8208f"/><stop offset=".5" stop-color="#f0569f"/><stop offset="1" stop-color="#00b9c6"/></linearGradient></defs>
    <path d="M0 72 C 260 11, 520 9, 760 50 C 1000 91, 1200 105, 1440 46 C 1200 119, 1000 106, 760 66 C 520 27, 260 25, 0 72 Z" fill="url(#fx-ribbon-g)"/>
  </svg>`;

const STROKES = `
  <div class="fx-strokes" aria-hidden="true">
    <img class="fx-st fx-st-p" src="/assets/brand/stroke-hook-lightpink.svg" alt="" loading="lazy" decoding="async">
    <img class="fx-st fx-st-t" src="/assets/brand/stroke-hook-teal.svg" alt="" loading="lazy" decoding="async">
  </div>`;

// Crown: five points with a gem on the three tall ones; the band is a rect.
const CROWN = 'M52 430 L64 150 L182 300 L300 66 L418 300 L536 150 L548 430 Z';

// Memory wall: real event photos, each with a one-word caption in script.
const WALL = [
  { src: 'gallery-1-2.jpg', cap: 'Sisterhood', r: -6 },
  { src: 'deeper-embrace.jpg', cap: 'Held', r: 4 },
  { src: 'queens-waving-booth.jpg', cap: 'Crowned', r: -3 },
  { src: 'journey-embrace.jpg', cap: 'Breakthrough', r: 5 },
  { src: 'gallery-3-2.jpg', cap: 'Joy', r: -4 },
  { src: 'gallery-2-1.jpg', cap: 'Freedom', r: 3 },
];

// Manifesto: every word its own span so it can light up in turn; words in
// the two emphasised phrases carry .k. Punctuation that follows a phrase is
// kept on the phrase's last word rather than becoming a word of its own.
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const manifestoWords = (text) => {
  const re = new RegExp(`(${MARKS.map(reEsc).join('|')})`);
  const out = [];
  let prev = '';
  text.split(re).forEach((part) => {
    if (!part) return;
    const k = MARKS.includes(part);
    const glued = out.length && !/\s$/.test(prev) && !/^\s/.test(part);
    part.trim().split(/\s+/).forEach((w, i) => {
      if (i === 0 && glued) out[out.length - 1].t += w;
      else out.push({ t: w, k });
    });
    prev = part;
  });
  return out.map(o => `<span${o.k ? ' class="k"' : ''}>${esc(o.t)}</span>`).join(' ');
};

// wlights: a garland of fairy lights across the top. The string and the bulbs
// come from the same curve, so the bulbs always sit on it.
const GARLAND = (() => {
  const y = (x) => 46 + 26 * Math.sin((x / 1440) * Math.PI * 3 + .4);
  let path = 'M0 ' + y(0).toFixed(1);
  for (let x = 30; x <= 1440; x += 30) path += ` L${x} ${y(x).toFixed(1)}`;
  const bulbs = [];
  for (let x = 32; x < 1440; x += 64) bulbs.push([(x / 14.4).toFixed(2), (y(x) + 2).toFixed(0)]);
  return { path, bulbs };
})();

// E3 variants: hand-drawn doodles (wpaint), each path drawn in on arrival.
const DOODLES = `
  <svg class="fx-doodles" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
    <path class="fx-dd" pathLength="1" d="M640 70 l18 -34 l22 26 l20 -34 l20 34 l22 -26 l18 34 z M640 78 h120"/>
    <path class="fx-dd fx-dd-t" pathLength="1" d="M1380 80 c-14 -26 -52 -18 -46 10 c4 22 46 40 46 40 c0 0 42 -18 46 -40 c6 -28 -32 -36 -46 -10 z"/>
    <path class="fx-dd" pathLength="1" d="M1384 560 l8 -26 l8 26 l26 8 l-26 8 l-8 26 l-8 -26 l-26 -8 z"/>
    <path class="fx-dd fx-dd-t" pathLength="1" d="M440 800 c40 -60 120 -70 150 -20 c26 44 -40 70 -60 30 c-16 -32 40 -70 110 -50"/>
    <path class="fx-dd" pathLength="1" d="M1160 470 l6 -18 l6 18 l18 6 l-18 6 l-6 18 l-6 -18 l-18 -6 z"/>
    <path class="fx-dd fx-dd-t" pathLength="1" d="M30 470 c10 -10 22 -10 30 0 c8 10 20 10 30 0 c10 -10 22 -10 30 0"/>
  </svg>`;

// E3 variants: each has its own hand-over to Common Struggles in place of the
// wave. All are white below, where the struggles section begins.
const torn = (() => {
  // A deterministic jagged edge: the same tear on every build.
  let x = 0, seed = 11, d = 'M0 120 L0 64';
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  while (x < 1440) { x = Math.min(1440, x + 14 + rnd() * 26); d += ` L${x.toFixed(0)} ${(46 + rnd() * 30 + Math.sin(x / 180) * 10).toFixed(0)}`; }
  return d + ' L1440 120 Z';
})();
const DIVIDERS = {
  memory: `<svg class="fx-div fx-div-torn" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="${torn}" fill="#fff"/></svg>`,
  wtorn: `<svg class="fx-div fx-div-torn" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="${torn}" fill="#fff"/></svg>`,
  wlights: `<div class="fx-div fx-div-scallop" aria-hidden="true"></div>`,
  wpaint: `<svg class="fx-div fx-div-brush" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
    <defs><filter id="fx-rough" x="-5%" y="-40%" width="110%" height="180%"><feTurbulence type="fractalNoise" baseFrequency=".04 .18" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="16"/></filter>
    <linearGradient id="fx-brush-g" x1="0" x2="1"><stop offset="0" stop-color="#e8208f"/><stop offset=".5" stop-color="#f0569f"/><stop offset="1" stop-color="#00b9c6"/></linearGradient></defs>
    <path filter="url(#fx-rough)" d="M-20 84 C 300 30, 560 40, 800 70 C 1040 100, 1240 104, 1460 60 L1460 160 L-20 160 Z" fill="url(#fx-brush-g)" opacity=".85"/>
    <path filter="url(#fx-rough)" d="M-20 100 C 300 50, 560 60, 800 88 C 1040 116, 1240 120, 1460 78 L1460 160 L-20 160 Z" fill="#fff"/>
  </svg>`,
  wbook: `<div class="fx-div fx-div-pinked" aria-hidden="true"><span></span></div>`,
};

// Spot and lreveal: the light follows the pointer on devices that hover, and
// drifts on its own (CSS) until it arrives and on touch screens.
const FOLLOW = `<script>(function (s) {
    var r = s.parentElement;
    if (!window.matchMedia('(hover: hover)').matches) return;
    r.addEventListener('pointermove', function (e) {
      var b = r.getBoundingClientRect();
      r.style.setProperty('--sx', ((e.clientX - b.left) / b.width * 100) + '%');
      r.style.setProperty('--sy', ((e.clientY - b.top) / b.height * 100) + '%');
      r.classList.add('is-follow');
    });
    r.addEventListener('pointerleave', function () { r.classList.remove('is-follow'); });
  })(document.currentScript);</script>`;

export const freedomPhoto = (site, c, style) => {
  const f = c.home.freedom;
  const ev = site.nextEvent.upcoming[0];
  const at = f.eyebrow.lastIndexOf(' ');
  const presenter = at > 0 ? f.eyebrow.slice(0, at) : f.eyebrow;
  const verb = at > 0 ? f.eyebrow.slice(at + 1) : '';
  const dark = ['cinema', 'spot', 'knock', 'ribbon', 'duo'].includes(style);

  // The copy, in parts, so a layout can arrange them its own way.
  const credit = (light) => `
      <div class="fx-credit fx-r" style="--d:0">
        <img src="${esc(light ? site.assets.logoWhite : '/assets/brand/logo-ruq-ink.png')}" alt="${esc(presenter)}" width="480" height="249" loading="lazy" decoding="async">
        <span>${esc(verb)}</span>
      </div>`;
  const logo = (light) => `
      <h2 class="fx-logo fx-r" style="--d:1"><img src="${esc(light ? f.logoWhite : f.logo)}" alt="Freedom" width="1500" height="640" loading="lazy" decoding="async"></h2>`;
  const tag = (d = 2) => `
      <p class="fx-tag fx-r" style="--d:${d}">${f.tagline.map(w => `<span>${esc(w.replace(/\.$/, ''))}<b>.</b></span>`).join(' ')}</p>`;
  const para = (d = 3) => `
      <p class="fx-body fx-r" style="--d:${d}">${body(f.body)}</p>`;
  const meta = (d = 4) => `
      <p class="fx-meta fx-r" style="--d:${d}">
        <span class="fx-when">3-day intensive <i aria-hidden="true">·</i> ${esc(ev.dates)}</span>
        <a class="fx-cta" href="${esc(site.nextEvent.ctaUrl)}">Reserve your seat ${ARROW}</a>
      </p>`;

  // The shared copy block. `light` is white type for a dark ground.
  const copy = (light, align = 'center') => `
    <div class="fx-copy fx-${align}">${credit(light)}${logo(light)}${tag()}${para()}${meta()}
    </div>`;

  // Knockout: the veil is one dark fill, drawn three times — the block
  // above, an SVG band with the word cut out of it, and the block below — so
  // the women show through the letters and nowhere else. Two bands, because
  // a phone needs the word stacked to stay large.
  const ko = (id, w, h, lines) => `
    <svg class="fx-ko fx-ko-${id}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
      <defs><mask id="fx-ko-${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}">
        <rect width="${w}" height="${h}" fill="#fff"/>
        ${lines.map(l => `<text x="${w / 2}" y="${l.y}" text-anchor="middle" font-size="${l.size}" textLength="${l.len}" lengthAdjust="spacingAndGlyphs" class="fx-ko-t" fill="#000">${l.t}</text>`).join('')}
      </mask></defs>
      <rect width="${w}" height="${h}" class="fx-ko-veil" mask="url(#fx-ko-${id})"/>
      ${lines.map(l => `<text x="${w / 2}" y="${l.y}" text-anchor="middle" font-size="${l.size}" textLength="${l.len}" lengthAdjust="spacingAndGlyphs" class="fx-ko-t fx-ko-rim">${l.t}</text>`).join('')}
    </svg>`;

  const board = `
  <div class="fx-wl-board fx-inner">
    ${WALL.map((p, i) => `
    <figure class="fx-pol fx-pol-${i + 1}" style="--r:${p.r}deg;--f:${(i * 1.3).toFixed(1)}s" aria-hidden="true">
      <span class="fx-tape"></span><img src="/assets/photos/${p.src}" alt="" loading="lazy" decoding="async"><figcaption>${esc(p.cap)}</figcaption>
    </figure>`).join('')}
    <div class="fx-note">${copy(false)}</div>
  </div>`;

  const photo = (cls) => `<img class="fx-photo ${cls}" src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" loading="lazy" decoding="async">`;

  const bodies = {
    cinema: `
  ${photo('fx-cinema-photo')}
  <div class="fx-shade" aria-hidden="true"></div>
  <div class="fx-inner">${copy(true)}</div>`,

    veil: `
  <div class="fx-rise" aria-hidden="true">${photo('')}</div>
  ${STROKES}
  <div class="fx-inner">${copy(false)}</div>`,

    split: `
  <div class="fx-split-grid">
    <figure class="fx-split-photo">
      ${photo('')}
      <figcaption class="fx-badge"><b>${esc(ev.dates)}</b><span>Three days that change everything</span></figcaption>
    </figure>
    <div class="fx-split-copy">${copy(false, 'left')}</div>
  </div>`,

    glass: `
  ${photo('fx-glass-photo')}
  <div class="fx-tint" aria-hidden="true"></div>
  <div class="fx-inner"><div class="fx-card">${copy(false)}</div></div>`,

    // ── Variants on D: the same full-bleed photo and tint, new foregrounds ──

    // A light that follows the pointer across the darkened room. It drifts
    // on its own until the pointer arrives, and on touch screens.
    spot: `
  ${photo('fx-glass-photo fx-kb')}
  <div class="fx-tint" aria-hidden="true"></div>
  <div class="fx-spot-dim" aria-hidden="true"></div>
  <div class="fx-inner">${copy(true)}</div>
  ${FOLLOW}`,

    knock: `
  ${photo('fx-glass-photo fx-kb')}
  <div class="fx-tint" aria-hidden="true"></div>
  <div class="fx-ko-top"><div class="fx-inner"><div class="fx-copy">${credit(true)}</div></div></div>
  <h2 class="fx-ko-band"><span class="fx-sr">Freedom</span>
    ${ko('wide', 1440, 300, [{ t: 'FREEDOM', y: 258, size: 300, len: 1300 }])}
    ${ko('tall', 390, 310, [{ t: 'FREE', y: 140, size: 160, len: 340 }, { t: 'DOM', y: 290, size: 160, len: 300 }])}
  </h2>
  <div class="fx-ko-bottom"><div class="fx-inner"><div class="fx-copy">${tag(1)}${para(2)}${meta(3)}</div></div></div>`,

    // A frosted band right across the photo, edge to edge, in place of a box.
    ribbon: `
  ${photo('fx-glass-photo fx-ribbon-photo fx-kb')}
  <div class="fx-tint" aria-hidden="true"></div>
  <div class="fx-band">
    <div class="fx-band-grid">
      <div class="fx-band-a fx-copy">${credit(false)}${logo(false)}</div>
      <div class="fx-band-b fx-copy">${tag(2)}${para(3)}</div>
      <div class="fx-band-c fx-copy">
        <p class="fx-band-date fx-r" style="--d:4"><span>Next event</span><b>${esc(ev.dates)}</b><span>3-day intensive</span></p>
        <p class="fx-r" style="--d:5"><a class="fx-cta" href="${esc(site.nextEvent.ctaUrl)}">Reserve your seat ${ARROW}</a></p>
      </div>
    </div>
  </div>`,

    // ── Light variants: the same photo, bright ground, ink type ──

    // The light twin of spot: a white haze the pointer wipes clear.
    lreveal: `
  ${photo('fx-glass-photo fx-light-photo fx-kb')}
  <div class="fx-ltint" aria-hidden="true"></div>
  <div class="fx-haze" aria-hidden="true"></div>
  <div class="fx-inner">${copy(false)}</div>
  ${FOLLOW}`,

    // The light twin of knock: a blush veil with FREEDOM cut out of it.
    lknock: `
  ${photo('fx-glass-photo fx-light-photo fx-kb')}
  <div class="fx-ko-top"><div class="fx-inner"><div class="fx-copy">${credit(false)}</div></div></div>
  <h2 class="fx-ko-band"><span class="fx-sr">Freedom</span>
    ${ko('wide', 1440, 300, [{ t: 'FREEDOM', y: 258, size: 300, len: 1300 }])}
    ${ko('tall', 390, 310, [{ t: 'FREE', y: 140, size: 160, len: 340 }, { t: 'DOM', y: 290, size: 160, len: 300 }])}
  </h2>
  <div class="fx-ko-bottom"><div class="fx-inner"><div class="fx-copy">${tag(1)}${para(2)}${meta(3)}</div></div></div>`,

    // The photo washed into soft pastels, like a dream.
    lduo: `
  ${photo('fx-glass-photo fx-lduo-photo fx-kb')}
  <div class="fx-lduo-map" aria-hidden="true"></div>
  <div class="fx-lduo-wash" aria-hidden="true"></div>
  <div class="fx-inner">${copy(false)}</div>`,

    // A white halo holds the copy, ringed by a slowly turning gradient.
    lhalo: `
  ${photo('fx-glass-photo fx-light-photo fx-kb')}
  <div class="fx-ltint" aria-hidden="true"></div>
  <div class="fx-inner"><div class="fx-halo"><span class="fx-ring" aria-hidden="true"></span>${copy(false)}</div></div>`,

    // ── Round 4: light, each a different idea ──

    // The group photo seen through a giant crown that draws itself in.
    crown: `
  <div class="fx-cr-grid fx-inner">
    <div class="fx-cr-copy">${copy(false, 'left')}</div>
    <div class="fx-cr-art" aria-hidden="true">
      <svg class="fx-cr-svg" viewBox="0 0 600 540">
        <defs>
          <clipPath id="fx-cr-clip">
            <path d="${CROWN}"/>
            <rect x="52" y="420" width="496" height="92" rx="18"/>
          </clipPath>
          <linearGradient id="fx-cr-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8208f"/><stop offset=".55" stop-color="#f0569f"/><stop offset="1" stop-color="#00b9c6"/></linearGradient>
        </defs>
        <g clip-path="url(#fx-cr-clip)">
          <image class="fx-cr-img" href="${esc(site.assets.heroPoster)}" x="-260" y="-70" width="1120" height="630" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <path class="fx-cr-line" d="${CROWN}" pathLength="1"/>
        <rect class="fx-cr-line" x="52" y="420" width="496" height="92" rx="18" pathLength="1"/>
        ${[[64, 132, 24], [300, 46, 30], [536, 132, 24]].map(([x, y, r]) => `<circle class="fx-cr-gem" cx="${x}" cy="${y}" r="${r}"/>`).join('')}
      </svg>
      ${[[9, 18, 0], [50, 2, .8], [90, 18, 1.6], [4, 70, 2.2], [96, 64, 1.1]].map(([x, y, d]) => `<span class="fx-spark" style="left:${x}%;top:${y}%;--t:${d}s"></span>`).join('')}
    </div>
  </div>`,

    // A church-window arch under a soft sky, light pouring through it.
    arch: `
  <div class="fx-ar-sky" aria-hidden="true"></div>
  <div class="fx-ar-grid fx-inner">
    <figure class="fx-ar-win" aria-hidden="true">
      <span class="fx-ar-rays"></span>
      <span class="fx-ar-frame"><img src="/assets/photos/journey-cheer.jpg" alt="" loading="lazy" decoding="async"></span>
      ${Array.from({ length: 16 }, (_, i) => `<i class="fx-mote" style="--x:${(i * 37) % 100}%;--d:${(i * .9) % 7}s;--s:${4 + (i % 4) * 2}px"></i>`).join('')}
    </figure>
    <div class="fx-ar-copy">${copy(false, 'left')}</div>
  </div>`,

    // Polaroids from past events, taped round a paper note.
    wall: board,

    // ── E3 variants: the same wall, each with its own ground and divider ──

    // LIVE (chosen 2026-10-10): the memory wall on W2's pink-to-lilac sky
    // and bokeh, ending in W1's torn paper edge.
    memory: `
  <div class="fx-bokeh" aria-hidden="true"></div>
  ${board}`,

    // Paper with fibres, and the next section torn from the same sheet.
    wtorn: `
  <div class="fx-paper" aria-hidden="true"></div>
  ${STROKES}
  ${board}`,

    // The polaroids hang from a string of fairy lights on wooden pegs.
    wlights: `
  <div class="fx-bokeh" aria-hidden="true"></div>
  <svg class="fx-string" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="${GARLAND.path}"/></svg>
  <div class="fx-bulbs" aria-hidden="true">${GARLAND.bulbs.map(([x, y], i) => `<i style="left:${x}%;top:${y}px;--i:${i}"></i>`).join('')}</div>
  ${board}`,

    // Watercolour blooms and hand-drawn doodles that draw themselves in.
    wpaint: `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="fx-wc"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="70"/><feGaussianBlur stdDeviation="6"/></filter></svg>
  <div class="fx-blooms" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  ${DOODLES}
  ${board}`,

    // A journal page: grid paper, washi tape, a stamp and a note in the margin.
    wbook: `
  <div class="fx-grid-paper" aria-hidden="true"></div>
  <span class="fx-washi fx-washi-1" aria-hidden="true"></span><span class="fx-washi fx-washi-2" aria-hidden="true"></span>
  <div class="fx-stamp" aria-hidden="true"><svg viewBox="0 0 200 200"><defs><path id="fx-stamp-c" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/></defs><circle cx="100" cy="100" r="92"/><circle cx="100" cy="100" r="54"/><text><textPath href="#fx-stamp-c">FREEDOM · RISE UP QUEENS · ${esc(ev.dates.slice(-4))} ·</textPath></text></svg><b>${esc(ev.dates.split(',')[0])}</b></div>
  <p class="fx-scrawl" aria-hidden="true">Save the date!<svg viewBox="0 0 120 60"><path d="M6 10 C 40 4, 80 18, 96 44 M84 40 L97 46 L100 32"/></svg></p>
  ${board}`,

    // The paragraph as the hero: huge type that lights up as you scroll.
    manifesto: `
  <div class="fx-inner fx-mf">
    <div class="fx-mf-head">${credit(false)}${logo(false)}</div>
    <p class="fx-mf-text" data-mf>${manifestoWords(f.body)}</p>
    <div class="fx-mf-foot">
      ${tag(0)}
      ${meta(1)}
    </div>
    <div class="fx-badge-rot" aria-hidden="true">
      <svg viewBox="0 0 200 200"><defs><path id="fx-circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
        <text><textPath href="#fx-circ">FREEDOM · ${esc(ev.dates.toUpperCase())} · 3-DAY INTENSIVE ·</textPath></text></svg>
      <img src="/assets/brand/crown-magenta.png" alt="" loading="lazy" decoding="async">
    </div>
  </div>
  <script>(function (s) {
    var r = s.parentElement, words = [].slice.call(r.querySelectorAll('.fx-mf-text span'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { words.forEach(function (w) { w.classList.add('on'); }); return; }
    var tick = false;
    function paint() {
      tick = false;
      var b = r.querySelector('[data-mf]').getBoundingClientRect(), vh = innerHeight;
      var p = Math.min(1, Math.max(0, (vh * .85 - b.top) / (b.height + vh * .35)));
      var n = Math.round(p * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true });
    addEventListener('resize', paint); paint();
  })(document.currentScript);</script>`,

    // Freedom as a magazine cover, tilting in 3D toward the pointer.
    cover: `
  <div class="fx-cv-grid fx-inner">
    <div class="fx-cv-stage" aria-hidden="true">
      <div class="fx-cv-back"></div>
      <div class="fx-cv" data-tilt>
        <img class="fx-cv-img" src="/assets/photos/journey-cheer.jpg" alt="" loading="lazy" decoding="async">
        <span class="fx-cv-shade"></span>
        <span class="fx-cv-top">Rise Up Queens presents <b>${esc(ev.dates)}</b></span>
        <img class="fx-cv-mast" src="${esc(f.logoWhite)}" alt="" loading="lazy" decoding="async">
        <span class="fx-cv-line fx-cv-l1"><b>The turning point</b>Three days that walk you through it</span>
        <span class="fx-cv-line fx-cv-l2"><b>Unapologetic. Free. Feminine.</b>Women who get it</span>
        <span class="fx-cv-line fx-cv-l3"><b>A faith that feels alive again</b>Clarity &amp; freedom inside</span>
        <span class="fx-cv-code"></span>
        <span class="fx-cv-gloss"></span>
      </div>
    </div>
    <div class="fx-cv-copy">${copy(false, 'left')}</div>
  </div>
  <script>(function (s) {
    var r = s.parentElement, c = r.querySelector('[data-tilt]');
    if (!window.matchMedia('(hover: hover)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    r.addEventListener('pointermove', function (e) {
      var b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
      c.style.transform = 'rotateY(' + (x * 22) + 'deg) rotateX(' + (-y * 16) + 'deg)';
      c.style.setProperty('--gx', (x + .5) * 100 + '%');
    });
    r.addEventListener('pointerleave', function () { c.style.transform = ''; });
  })(document.currentScript);</script>`,

    // The photo recoloured as a brand duotone poster, with grain.
    duo: `
  ${photo('fx-glass-photo fx-duo-photo fx-kb')}
  <div class="fx-duo-map" aria-hidden="true"></div>
  <div class="fx-duo-shade" aria-hidden="true"></div>
  <div class="fx-grain" aria-hidden="true"></div>
  <div class="fx-inner">${copy(true)}</div>`,
  };

  return `
<section id="freedom" class="fx fx-${style}${dark ? ' fx-dark' : ''}${(/^w[a-z]/.test(style) && style !== 'wall') || style === 'memory' ? ' fx-wall fx-wv' : ''}" data-fr>
  ${bodies[style]}
  ${DIVIDERS[style] || WAVE}
</section>`;
};

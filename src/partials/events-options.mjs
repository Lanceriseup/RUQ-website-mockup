// Events page ("Your Path with Rise Up Queens"): four directions for
// /events-options.html (asked for 2026-11-03). scripts/build-events-options.mjs
// renders each into a copy of the site page as /ev-<key>.html.
//
// Copy is the live page's, verbatim (content.json eventsPage): the heading,
// the lead, seven programs in the live order (each with its own line, points,
// film and button), the closing line and the dates heading. Dates come from
// site.nextEvent.upcoming, since the live page's are out of date. Every
// direction ends on the same closing: the line, both dates and the live
// Stay Connected form, as the live page does.
//
// Films are click-to-play facades for the site lightbox (app.js), Vimeo and
// Wistia; nothing loads from either until one is played.
//
// Styles src/styles/events.css (.ev-*); behaviour src/styles/events.js.
import { esc } from './layout.mjs';
import { linkAttrs, newTab, isExternal } from './explore/shared.mjs';
import { stayForm } from './stay-options.mjs';
import { eventDates } from './hero.mjs';

const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const OUT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
const PLAY = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
const PIN = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const CLOSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

const num = (i) => String(i + 1).padStart(2, '0');
const url = (site, p) => (p.url === 'site:register' ? site.nextEvent.ctaUrl : p.url);

// The program's film (a lightbox facade), or its picture when it has none.
const media = (p, cls = '') => {
  if (p.video) {
    const v = p.video;
    return `
<button type="button" class="video-facade ev-film ${cls}" data-lightbox data-provider="${esc(v.provider)}" data-id="${esc(v.id)}" ${v.hash ? `data-hash="${esc(v.hash)}"` : ''} data-title="${esc(p.name)}">
  <img src="${esc(v.poster)}" alt="" loading="lazy" decoding="async">
  <span class="ev-play" aria-hidden="true">${PLAY}</span>
  <span class="sr-only">Play the ${esc(p.name)} film</span>
</button>`;
  }
  if (p.image) return `<figure class="ev-pic ev-pic-art ${cls}"><img src="${esc(p.image)}" alt="Self-leadership, others and generating results overlap in effective leadership" loading="lazy" decoding="async"></figure>`;
  return `<figure class="ev-pic ${cls}"><img src="${esc(p.photo)}" alt="" loading="lazy" decoding="async"></figure>`;
};

const points = (p, cls = '') => p.points.length ? `
<ul class="ev-points ${cls}">${p.points.map(([b, t]) => `
  <li>${t ? `<b>${esc(b)}:</b> ${esc(t)}` : esc(b)}</li>`).join('')}
</ul>` : '';

const button = (site, p, cls = 'ev-btn') => {
  const u = url(site, p);
  return p.cta && u ? `<a ${linkAttrs(u)} class="${cls}">${esc(p.cta)}${newTab(u)}${isExternal(u) ? OUT : ARROW}</a>` : '';
};

const tag = (p, cls = 'ev-tag') => p.tag ? `<span class="${cls}">${esc(p.tag)}</span>` : '';

// "Your Path with Rise Up Queens" → "Your Path" in the script over the rest.
const title = (e, cls = '') => `
<h1 class="ev-title ${cls}"><span class="ev-title-s script">Your Path</span><span class="ev-title-d">with Rise Up Queens</span></h1>
<p class="ev-lead">${esc(e.lead)}</p>`;

// Both dates as two labelled columns (tone: light or dark ground).
const dates = (site) => `
<div class="ev-dates">${site.nextEvent.upcoming.map((d, i) => `
  <div class="ev-date">
    <span class="ev-date-k ${i ? 'ev-k-t' : 'ev-k-m'}">${i ? 'Also coming' : 'Next event'}${d.note ? ` · ${esc(d.note)}` : ''}</span>
    <b>${esc(d.dates)}</b>
    <span class="ev-date-p">${PIN}${esc(d.location)}</span>
  </div>`).join('<span class="ev-date-sep" aria-hidden="true"></span>')}
</div>`;

// The closing every direction shares: the line, the dates, the form.
const closing = (site, c, e, tone = 'light') => `
<section class="ev-close ev-close-${tone}" aria-labelledby="ev-close-h">
  <div class="ev-close-in">
    <div class="ev-close-copy">
      <p class="ev-close-line">${esc(e.closing)}</p>
      <h2 class="ev-close-h" id="ev-close-h">${esc(e.datesHeading)}</h2>
      ${dates(site)}
      <a href="${esc(site.nextEvent.ctaUrl)}" class="ev-btn">${esc(site.nextEvent.ctaText)}${ARROW}</a>
    </div>
    <div class="sc ev-close-form">${stayForm(c)}</div>
  </div>
</section>`;

const page = (key, body, cls = '') => `
<link rel="stylesheet" href="/stay.css">
<link rel="stylesheet" href="/events.css">
<div class="ev ev-is-${key}${cls ? ` ${cls}` : ''}">${body}</div>
<script src="/stay.js" defer></script>
<script src="/events.js" defer></script>`;

// Hotspots over the client's own Path to Mastery map (ev-path-map.jpg,
// 2560×2003), as percentages of the picture: left, top, width, height.
const MAP = {
  freedom: [66, 75.3, 24, 5.6], deeper: [63.7, 53.4, 10.6, 5.6], elevate: [62.1, 39.4, 16, 5.6],
  'elevate-intl': [74.2, 28.4, 18, 5.6], academy: [64.8, 16.5, 16, 5.7], lbd: [20.9, 30.4, 12.8, 5.7], coaching: [16.2, 48.9, 12, 5.6],
};

// What rides the end of the ribbon. <i> is the white disc with the crown
// (the default); an ev-rd-* class on the .ev swaps it for one of these
// (options at /events-options-4.html): the bare crown, a satin bow that turns
// with the ribbon, or a twinkling sparkle; or one of four arrows that turn
// with it (/events-options-5.html): arrow, line, darrow, pulse. ev-rd-none shows nothing, and the
// ribbon's own end glows.
const RIDERS = `<b class="ev-rd-crown"></b><svg class="ev-rd-bow" viewBox="-44 -34 88 76"><defs><linearGradient id="ev-bow-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f06aa8"/><stop offset=".5" stop-color="#e8208f"/><stop offset="1" stop-color="#9b3fb0"/></linearGradient></defs><path d="M-3 4 L-15 36 L-9 32 L-5 39 L1 6 Z M3 4 L15 36 L9 32 L5 39 L-1 6 Z" fill="#c41677"/><path d="M0 0 C-12 -22,-42 -26,-40 -3 C-38 16,-12 12,0 0 Z M0 0 C12 -22,42 -26,40 -3 C38 16,12 12,0 0 Z" fill="url(#ev-bow-g)"/><path d="M-6 -3 C-14 -14,-32 -17,-33 -5 M6 -3 C14 -14,32 -17,33 -5" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.2" stroke-linecap="round"/><ellipse rx="7" ry="8" fill="#d0187f"/><ellipse cx="-2" cy="-3" rx="2.4" ry="3" fill="rgba(255,255,255,.5)"/></svg><svg class="ev-rd-arrow" viewBox="-30 -30 60 60"><defs><linearGradient id="ev-ar-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f06aa8"/><stop offset=".55" stop-color="#e8208f"/><stop offset="1" stop-color="#9b3fb0"/></linearGradient></defs><path d="M-8 -17 L22 0 L-8 17 L-2 0 Z" fill="url(#ev-ar-g)" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><path d="M-4 -11 L14 -1" stroke="rgba(255,255,255,.6)" stroke-width="1.6" stroke-linecap="round"/></svg><svg class="ev-rd-line" viewBox="-30 -30 60 60"><path d="M-9 -17 C1 -9,10 -4,19 0 C10 4,1 9,-9 17" fill="none" stroke="#c8187a" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg><svg class="ev-rd-darrow" viewBox="-30 -30 60 60"><circle r="22" fill="#fff"/><circle r="22" fill="none" stroke="rgba(232,32,143,.18)" stroke-width="6"/><path d="M-9 0 H9 M2 -7 L9 0 L2 7" fill="none" stroke="#e8208f" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg><svg class="ev-rd-pulse" viewBox="-30 -30 60 60"><path class="ev-rd-p1" d="M-10 -12 L2 0 L-10 12" fill="none" stroke="#e8208f" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path class="ev-rd-p2" d="M4 -12 L16 0 L4 12" fill="none" stroke="#e8208f" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg><svg class="ev-rd-spark" viewBox="-24 -24 48 48"><path d="M0 -22 C2 -5,5 -2,22 0 C5 2,2 5,0 22 C-2 5,-5 2,-22 0 C-5 -2,-2 -5,0 -22 Z" fill="#fff"/><path d="M0 -11 C1 -3,3 -1,11 0 C3 1,1 3,0 11 C-1 3,-3 1,-11 0 C-3 -1,-1 -3,0 -11 Z" fill="#ffd3ea" transform="rotate(45)"/></svg>`;

// The trail itself, shared by A and its round-two variants: the SVG path
// (events.js draws it through each crown and inks it to the scroll), a crown
// that rides the head of the ink, a step counter, and the seven stops. Each
// stop also carries a ghost numeral and a script watermark, which only the
// variants that use them show.
const trail = (site, e) => `
<div class="ev-trail" data-ev-trail>
  <svg class="ev-trail-svg" aria-hidden="true"><defs><linearGradient id="ev-tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8208f"/><stop offset=".55" stop-color="#b44fc0"/><stop offset="1" stop-color="#00b9c6"/></linearGradient></defs>
    <path class="ev-trail-base"/><path class="ev-trail-ink" stroke="url(#ev-tg)"/><path class="ev-trail-sheen"/></svg>
  <span class="ev-rider" data-ev-rider aria-hidden="true"><i></i>${RIDERS}</span>
  <p class="ev-count" data-ev-count aria-hidden="true"><b>01</b><span>/ ${num(e.programs.length - 1)}</span><em>${esc(e.programs[0].name)}</em></p>
  ${e.programs.map((p, i) => `
  <article class="ev-stop ${i % 2 ? 'ev-stop-r' : 'ev-stop-l'}" id="${esc(p.key)}" data-ev-stop data-ev-name="${esc(p.name)}" data-ev-rv>
    <span class="ev-ghost" aria-hidden="true">${num(i)}</span>
    <span class="ev-wm script" aria-hidden="true">${esc(p.name)}</span>
    <span class="ev-crown" data-ev-node aria-hidden="true"><i></i></span>
    <div class="ev-stop-media">${media(p)}</div>
    <div class="ev-stop-copy">
      <p class="ev-stop-n"><span>${num(i)}</span>${tag(p)}</p>
      <h2 class="ev-stop-h">${esc(p.name)}</h2>
      <p class="ev-stop-line">${esc(p.line)}</p>
      ${points(p)}
      ${button(site, p)}
    </div>
  </article>`).join('')}
</div>`;

// The closing as the About page has it (K2 of /about-stay-options.html, live
// there since 2026-11-03): the slim dark band with the event photograph, the
// live page's closing line split across the script and the heading, the next
// dates behind a hairline, and the Stay Connected form standing out of the
// band. Same .jc / .ak-rise classes, so the two pages stay one object.
const riseClose = (site, c, e) => {
  const [a, b] = e.closing.split(/(?<=\.)\s+/);
  const h = esc(b || a);
  const i = h.lastIndexOf(' ');
  return `
<section id="closing-events" class="jc sc ak ak-rise ev-rise" aria-labelledby="ev-close-h">
  <div class="ak-rise-in">
    <div class="jc-panel ak-band" aria-hidden="true"><img class="jc-bg" src="${esc(site.assets.heroPoster)}" alt="" loading="lazy" decoding="async"></div>
    <div class="ak-copy">
      <div class="ak-words">
        ${b ? `<p class="jc-script">${esc(a)}</p>` : ''}
        <h2 class="jc-h" id="ev-close-h">${h.slice(0, i)} <span class="sheen">${h.slice(i + 1)}</span></h2>
      </div>
      <div class="ak-p ev-rise-dates">
        <p class="ev-rise-k">${esc(e.datesHeading)}</p>
        ${eventDates(site)}
      </div>
    </div>
    ${stayForm(c)}
  </div>
</section>`;
};

// A and its variants: a hero, the trail, and a closing.
const trailPage = (key, hero, close, cls = '') => (site, c, e) => page(key, `
<header class="ev-hero ${hero}">
  <div class="ev-glow" aria-hidden="true"></div>
  ${key === 'sunrise' ? '<div class="ev-sun" aria-hidden="true"></div>' : ''}
  ${title(e)}
</header>
${trail(site, e)}
${close === 'rise' ? riseClose(site, c, e) : closing(site, c, e)}`, cls);

export const EVENTS_OPTIONS = {
  // A — a winding pink-to-teal trail drawn down the page as you scroll, with
  // a crown at each stop and the programs alternating either side of it.
  // Live on /events.html first (2026-11-03), until A1 replaced it the same
  // day. Its "Seven stops" cue was taken out at the client's request.
  trail: trailPage('trail', 'ev-hero-light', 'stay'),

  // Round two (2026-11-03): the trail, with more wow, each closing on the
  // About page's band. A itself with that closing first.
  'trail-rise': trailPage('trail-rise', 'ev-hero-light', 'rise'),
  // A satin ribbon instead of a line, a crown riding its head, and huge
  // outlined numerals behind each stop. LIVE on /events.html since
  // 2026-11-03. The crown at each stop was taken off the same day at the
  // client's request ("looks weird"), and the stops are now each program's
  // number and name printed along the ribbon: ev-mk-label, R3 of
  // /events-options-3.html. The other ev-mk-* markers (none, loop, pearl,
  // bloom) stay as options; events.css and events.js read the class. What
  // rides the ribbon's end is ev-rd-* (RIDERS above): pulsing chevrons, V4
  // of /events-options-5.html, in place of the white disc with the crown.
  ribbon: trailPage('ribbon', 'ev-hero-light', 'rise', 'ev-mk-label ev-rd-pulse'),
  // Night: a starfield, a neon trail with a comet head, and crowns that
  // ignite as the light passes them.
  neon: trailPage('neon', 'ev-hero-night', 'rise'),
  // The page is a sunrise: the sky warms from dawn to day as you go down,
  // a "you are here" pin rides the trail, and a step counter keeps count.
  sunrise: trailPage('sunrise', 'ev-hero-dawn', 'rise'),
  // Ivory and editorial: each film in a tall arch that opens as you arrive,
  // with the program's name in giant script drifting behind it.
  arch: trailPage('arch', 'ev-hero-ivory', 'rise'),

  // B — dark and cinematic: the client's Path to Mastery map as the hero,
  // made clickable, then each program as a wide film-led row.
  map: (site, c, e) => page('map', `
<header class="ev-hero ev-hero-dark">
  <div class="ev-marble" aria-hidden="true"></div>
  ${title(e, 'ev-title-dark')}
  <div class="ev-map" data-ev-rv>
    <img src="/assets/photos/ev-path-map.jpg" alt="The Rise Up Queens Path to Mastery: a trail from Start through Freedom, Deeper, Elevate Marriage, Elevate International and Coaches Academy at the summit, with Life By Design and 1:1 Coaching on the other side" width="2560" height="2003" decoding="async">
    ${e.programs.map((p) => { const [l, t, w, h] = MAP[p.key]; return `
    <a class="ev-spot" href="#${esc(p.key)}" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%"><span class="ev-spot-ring" aria-hidden="true"></span><span class="ev-spot-tip">${esc(p.name)}${p.tag ? ` · ${esc(p.tag)}` : ''}</span></a>`; }).join('')}
  </div>
  <p class="ev-map-note">Tap a stop on the map to jump to it</p>
</header>
<div class="ev-rows">
  ${e.programs.map((p, i) => `
  <article class="ev-row ${i % 2 ? 'ev-row-r' : ''}" id="${esc(p.key)}" data-ev-rv>
    <div class="ev-row-media">${media(p)}</div>
    <div class="ev-row-copy">
      <p class="ev-row-n">${num(i)}<span>/ 07</span></p>
      ${tag(p, 'ev-tag ev-tag-dark')}
      <h2 class="ev-row-h">${esc(p.name)}</h2>
      <p class="ev-row-line">${esc(p.line)}</p>
      ${points(p, 'ev-points-dark')}
      ${button(site, p)}
    </div>
  </article>`).join('')}
</div>
${closing(site, c, e, 'dark')}`),

  // C — a sticky list of the seven steps beside the programs: the step you
  // are reading lights up and the line fills as you go.
  steps: (site, c, e) => page('steps', `
<header class="ev-hero ev-hero-ivory">
  ${title(e)}
</header>
<div class="ev-steps" data-ev-steps>
  <nav class="ev-rail" aria-label="The seven steps">
    <span class="ev-rail-line" aria-hidden="true"><i data-ev-fill></i></span>
    <ol>${e.programs.map((p, i) => `
      <li><a href="#${esc(p.key)}" data-ev-link="${esc(p.key)}"><span class="ev-rail-n">${num(i)}</span><span class="ev-rail-name">${esc(p.name)}</span></a></li>`).join('')}
    </ol>
  </nav>
  <div class="ev-panels">
    ${e.programs.map((p, i) => `
    <article class="ev-panel" id="${esc(p.key)}" data-ev-panel>
      ${media(p, 'ev-panel-media')}
      <div class="ev-panel-body">
        <div>
          <p class="ev-panel-n">Step ${num(i)} ${tag(p)}</p>
          <h2 class="ev-panel-h">${esc(p.name)}</h2>
          <p class="ev-panel-line">${esc(p.line)}</p>
          ${button(site, p)}
        </div>
        ${points(p)}
      </div>
    </article>`).join('')}
  </div>
</div>
${closing(site, c, e)}`),

  // D — Freedom first: the entry event as the hero, with its dates and film;
  // the other six as a grid of cards, each opening to its film and points.
  feature: (site, c, e) => {
    const [f, ...rest] = e.programs;
    return page('feature', `
<header class="ev-hero ev-hero-sky ev-feat">
  <div class="ev-feat-intro">${title(e)}</div>
  <article class="ev-feat-card" id="${esc(f.key)}" data-ev-rv>
    ${media(f, 'ev-feat-media')}
    <div class="ev-feat-copy">
      <p class="ev-feat-k script">Where it begins</p>
      <h2 class="ev-feat-h">${esc(f.name)}</h2>
      ${tag(f)}
      <p class="ev-feat-line">${esc(f.line)}</p>
      ${dates(site)}
      ${button(site, f)}
    </div>
  </article>
</header>
<section class="ev-grid-sec" aria-labelledby="ev-grid-h">
  <h2 class="ev-grid-h" id="ev-grid-h"><span class="script">and then</span>Where the path leads</h2>
  <div class="ev-grid">
    ${rest.map((p, i) => `
    <article class="ev-card" id="${esc(p.key)}" data-ev-rv style="--d:${i * 70}ms">
      <button type="button" class="ev-card-open" data-ev-open="ev-dlg-${esc(p.key)}" aria-haspopup="dialog">
        <span class="ev-card-img"><img src="${esc(p.video ? p.video.poster : p.image || p.photo)}" alt="" loading="lazy" decoding="async" class="${p.image ? 'ev-contain' : ''}"></span>
        <span class="ev-card-body">
          <span class="ev-card-n">${num(i + 1)}</span>
          ${tag(p)}
          <span class="ev-card-h">${esc(p.name)}</span>
          <span class="ev-card-line">${esc(p.line)}</span>
          <span class="ev-card-more">See what’s inside${ARROW}</span>
        </span>
      </button>
    </article>`).join('')}
  </div>
  ${rest.map((p) => `
  <dialog class="ev-dlg" id="ev-dlg-${esc(p.key)}" aria-labelledby="ev-dlg-h-${esc(p.key)}">
    <div class="ev-dlg-in">
      <button type="button" class="ev-dlg-x" data-ev-close aria-label="Close">${CLOSE}</button>
      ${media(p, 'ev-dlg-media')}
      <div class="ev-dlg-body">
        ${tag(p)}
        <h3 class="ev-dlg-h" id="ev-dlg-h-${esc(p.key)}">${esc(p.name)}</h3>
        <p class="ev-dlg-line">${esc(p.line)}</p>
        ${points(p)}
        ${button(site, p)}
      </div>
    </div>
  </dialog>`).join('')}
</section>
${closing(site, c, e)}`);
  },
};

export const eventsOption = (site, c, key) => EVENTS_OPTIONS[key](site, c, c.eventsPage);

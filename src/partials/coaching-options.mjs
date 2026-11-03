// 1-on-1 Coaching: four directions for /coaching-options.html (asked for
// 2026-11-03). scripts/build-coaching-options.mjs renders each into a copy of
// the site page as /co-<key>.html.
//
// Copy is content.json coachingPage: the four coaches from the live page,
// word for word, with their roles, portraits (team page) and films. Each
// coach's "Schedule Your Introductory Call" opens the live MultiplyOS
// intro-call form in a dialog with her name pre-filled in its "Preferred
// Coach" field (coaching.js); the closing's button opens it with none.
// Films are click-to-play facades for the site lightbox (app.js).
//
// Styles src/styles/coaching.css (.co-*); behaviour coaching.js; the form's
// frame is the shared MultiplyOS embed (mosForm, stay.css/stay.js).
import { esc } from './layout.mjs';
import { mosForm } from './stay-options.mjs';

const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const PLAY = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
const CLOSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

// the first sentence, for places with room for one
const first = (t) => (t.match(/^.*?[.!?](?=\s|$)/) || [t])[0];

const book = (x, cls = 'co-btn') => `
<button type="button" class="${cls}" data-co-pick="${esc(x ? x.name : '')}"${x ? ` data-co-photo="${esc(x.photo)}" data-co-role="${esc(x.role)}"` : ''}>${x ? `Schedule your introductory call<span class="sr-only"> with ${esc(x.name)}</span>` : 'Schedule your introductory call'}${ARROW}</button>`;

const watch = (x, cls = 'co-watch') => `
<button type="button" class="video-facade ${cls}" data-lightbox data-provider="${esc(x.video.provider)}" data-id="${esc(x.video.id)}" data-title="${esc(x.name)}">
  <span class="co-watch-ic" aria-hidden="true">${PLAY}</span><span>Watch ${esc(x.first)}’s video</span>
</button>`;

const film = (x, cls = '') => `
<button type="button" class="video-facade co-film ${cls}" data-lightbox data-provider="${esc(x.video.provider)}" data-id="${esc(x.video.id)}" data-title="${esc(x.name)}">
  <img src="${esc(x.video.poster)}" alt="" loading="lazy" decoding="async">
  <span class="co-play" aria-hidden="true">${PLAY}</span>
  <span class="sr-only">Play ${esc(x.name)}’s video</span>
</button>`;

const title = (e, cls = '') => `
<h1 class="co-title ${cls}"><span class="co-title-k">1-on-1</span><span class="co-title-s script">Coaching</span></h1>
<p class="co-lead">${esc(e.lead)}</p>`;

// the intro-call form in a dialog; coaching.js fills its src with the coach
// The intro-call form's dialog. `size` is a co-form-* class (options at
// /coaching-form-options.html): wide, side (a panel with the chosen coach,
// filled by coaching.js), sheet (a full-height panel from the right). The
// MultiplyOS form itself stops widening at 672px and centres in anything
// wider, so 696px (its card plus 12px each side) is the widest frame.
const dialog = (e, size = '') => `
<dialog class="co-dlg${size ? ` ${size}` : ''}" aria-label="${esc(e.form.title)}">
  <div class="co-dlg-in sc">
    <button type="button" class="co-dlg-x" data-co-close aria-label="Close">${CLOSE}</button>
    <aside class="co-dlg-side" aria-hidden="true">
      <img class="co-dlg-side-img" src="/assets/team/molly-rhodes.jpg" alt="" data-co-side-img>
      <div class="co-dlg-side-cap">
        <span class="co-crown co-dlg-side-crown"></span>
        <p class="co-dlg-side-k">Your introductory call</p>
        <p class="co-dlg-side-name script" data-co-side-name></p>
        <p class="co-dlg-side-role" data-co-side-role></p>
      </div>
    </aside>
    ${mosForm({ src: e.form.src, origin: e.form.origin, title: e.form.title }, 'co-dlg-form', { lazy: false })
      .replace('data-sc-form', `data-sc-form data-co-field="${esc(e.form.coachField)}"`)}
  </div>
</dialog>`;

const closing = (e, tone = 'light') => `
<section class="co-close co-close-${tone}" aria-labelledby="co-close-h">
  <span class="co-crown" aria-hidden="true"></span>
  <h2 class="co-close-h" id="co-close-h">${esc(e.closing.heading)}</h2>
  <p class="co-close-p">${esc(e.closing.body)}</p>
  ${book(null, 'co-btn co-btn-lg')}
</section>`;

// D's pop-ups: the coach's own video (her Wistia player, which loads only
// when the pop-up opens; coaching.js), her role, name and her words from the
// live page, and her button. A co-pop-* class on the .co picks the design
// (/coaching-popup-options.html); the script name, the step counter and the
// row of the other coaches are hidden unless a design shows them.
const coachDialogs = (e) => e.coaches.map((x, i) => `
<dialog class="co-cdlg" id="co-dlg-${esc(x.key)}" aria-labelledby="co-cdlg-h-${esc(x.key)}">
  <div class="co-cdlg-in">
    <button type="button" class="co-dlg-x" data-co-close aria-label="Close">${CLOSE}</button>
    <span class="co-cdlg-script script" aria-hidden="true">${esc(x.first)}</span>
    <div class="co-cdlg-video" style="--poster:url(${esc(x.video.poster)})">
      <img src="${esc(x.video.poster)}" alt="" loading="lazy" decoding="async">
      <iframe title="${esc(x.name)}’s video" data-co-video="https://fast.wistia.net/embed/iframe/${esc(x.video.id)}?videoFoam=false&amp;playerColor=e8208f" allow="autoplay; fullscreen" allowfullscreen></iframe>
    </div>
    <div class="co-cdlg-body">
      <p class="co-cdlg-n" aria-hidden="true"><b>0${i + 1}</b> / 0${e.coaches.length}</p>
      <h3 class="co-cdlg-h" id="co-cdlg-h-${esc(x.key)}">${esc(x.name)}</h3>
      <p class="co-cdlg-role">${esc(x.role)}</p>
      <p class="co-cdlg-p">${esc(x.blurb)}</p>
      ${book(x)}
      <nav class="co-cdlg-others" aria-label="Meet the other coaches">
        <p>Meet the others</p>
        <ul>${e.coaches.filter((y) => y !== x).map((y) => `
          <li><button type="button" data-co-open="co-dlg-${esc(y.key)}"><img src="${esc(y.photo)}" alt="" loading="lazy" decoding="async"><span>${esc(y.first)}</span></button></li>`).join('')}
        </ul>
      </nav>
    </div>
  </div>
</dialog>`).join('');

// The live page's closing: its two YouTube videos (coachingPage.videos), as
// click-to-play facades for the site lightbox (app.js).
const videoClose = (e) => `
<section class="co-vids" aria-label="Watch">
  <div class="co-vids-in">
    ${e.videos.map((v) => `
    <button type="button" class="video-facade co-film co-vid" data-lightbox data-provider="${esc(v.provider)}" data-id="${esc(v.id)}" data-title="${esc(v.name)}">
      <img src="${esc(v.poster)}" alt="" loading="lazy" decoding="async">
      <span class="co-play" aria-hidden="true">${PLAY}</span>
      <span class="sr-only">Play “${esc(v.name)}”</span>
    </button>`).join('')}
  </div>
</section>`;

// `end` replaces the "Not sure who to choose?" closing (D uses videoClose).
// `end` replaces the closing; `pop` is the coach pop-up's design (co-pop-*)
// and `form` the intro-call form's size (co-form-*).
const page = (key, body, e, tone, end = null, { pop = '', form = '' } = {}) => `
<link rel="stylesheet" href="/stay.css">
<link rel="stylesheet" href="/coaching.css">
<div class="co co-is-${key}${pop ? ` ${pop}` : ''}">${body}${end ?? closing(e, tone)}</div>
${dialog(e, form)}
<script src="/stay.js" defer></script>
<script src="/coaching.js" defer></script>`;

export const COACHING_OPTIONS = {
  // A — a dark, warm stage that matches the films' amber light: one coach at
  // a time, large, chosen from a filmstrip of the four portraits.
  spotlight: (site, c, e) => page('spotlight', `
<header class="co-hero co-hero-dark">${title(e, 'co-title-dark')}</header>
<section class="co-spot" data-co-spot aria-label="Our coaches">
  <div class="co-spot-stage">
    ${e.coaches.map((x, i) => `
    <article class="co-slide${i ? '' : ' is-on'}" id="co-${esc(x.key)}" data-co-slide role="tabpanel" aria-labelledby="co-tab-${esc(x.key)}">
      <div class="co-slide-media">${film(x)}</div>
      <div class="co-slide-copy">
        <p class="co-role">${esc(x.role)}</p>
        <h2 class="co-slide-h"><span class="script">${esc(x.first)}</span><span class="co-slide-last">${esc(x.name.slice(x.first.length + 1))}</span></h2>
        <p class="co-slide-p">${esc(x.blurb)}</p>
        ${book(x)}
      </div>
    </article>`).join('')}
  </div>
  <div class="co-strip" role="tablist" aria-label="Choose a coach">
    ${e.coaches.map((x, i) => `
    <button type="button" class="co-tab${i ? '' : ' is-on'}" id="co-tab-${esc(x.key)}" role="tab" aria-selected="${i ? 'false' : 'true'}" aria-controls="co-${esc(x.key)}" data-co-tab>
      <img src="${esc(x.photo)}" alt="" loading="lazy" decoding="async"><span><b>${esc(x.name)}</b>${esc(x.role)}</span>
    </button>`).join('')}
  </div>
</section>`, e, 'dark'),

  // B — "Which sounds like you?": four lines condensed from the coaches' own
  // words; choosing one brings that coach forward from a fan of portraits.
  match: (site, c, e) => page('match', `
<header class="co-hero co-hero-blush">${title(e)}</header>
<section class="co-match" data-co-match aria-labelledby="co-match-h">
  <div class="co-match-ask">
    <h2 class="co-match-h" id="co-match-h">${esc(e.matchHeading)}</h2>
    <div class="co-match-opts" role="group" aria-labelledby="co-match-h">
      ${e.coaches.map((x) => `
      <button type="button" class="co-opt" data-co-opt="${esc(x.key)}" aria-pressed="false"><span>“${esc(x.match)}”</span>${ARROW}</button>`).join('')}
    </div>
    <p class="co-match-note">Or meet all four below.</p>
  </div>
  <div class="co-fan" data-co-fan>
    ${e.coaches.map((x) => `
    <article class="co-fan-card" data-co-card="${esc(x.key)}">
      <img class="co-fan-img" src="${esc(x.photo)}" alt="${esc(x.name)}" loading="lazy" decoding="async">
      <div class="co-fan-copy">
        <p class="co-role">${esc(x.role)}</p>
        <h3 class="co-fan-h">${esc(x.name)}</h3>
        <p class="co-fan-p">${esc(first(x.blurb))}</p>
        <div class="co-fan-acts">${book(x)}${watch(x)}</div>
      </div>
    </article>`).join('')}
  </div>
</section>
<section class="co-all" aria-label="All four coaches">
  ${e.coaches.map((x) => `
  <article class="co-all-card" id="co-${esc(x.key)}">
    <img src="${esc(x.photo)}" alt="" loading="lazy" decoding="async">
    <div>
      <p class="co-role">${esc(x.role)}</p>
      <h3>${esc(x.name)}</h3>
      <p>${esc(x.blurb)}</p>
      <div class="co-fan-acts">${book(x)}${watch(x)}</div>
    </div>
  </article>`).join('')}
</section>`, e),

  // C — a magazine spread per coach on ivory: her portrait in a tall arch,
  // her own line as a pull quote in italic serif, alternating sides.
  spreads: (site, c, e) => page('spreads', `
<header class="co-hero co-hero-ivory">${title(e)}</header>
<div class="co-spreads">
  ${e.coaches.map((x, i) => `
  <article class="co-spread${i % 2 ? ' co-spread-r' : ''}" id="co-${esc(x.key)}" data-co-rv>
    <figure class="co-arch">
      <img src="${esc(x.photo)}" alt="${esc(x.name)}" loading="lazy" decoding="async">
      ${watch(x, 'co-watch co-watch-on')}
    </figure>
    <div class="co-spread-copy">
      <p class="co-spread-n">0${i + 1}</p>
      <blockquote class="co-pull">“${esc(x.quote)}”</blockquote>
      <p class="co-role">${esc(x.role)}</p>
      <h2 class="co-spread-h script">${esc(x.name)}</h2>
      <p class="co-spread-p">${esc(x.blurb)}</p>
      ${book(x)}
    </div>
  </article>`).join('')}
</div>`, e),

  // D — four tall portrait cards on the sky, tilting toward the cursor.
  // LIVE on /coaching.html since 2026-11-03, changed at the client's request
  // from turning over to opening a pop-up with the coach's own video and her
  // words from the live page (coachDialogs), and closing on the live page's
  // two YouTube videos (videoClose) rather than "Not sure who to choose?".
  // The pop-up is P2, frosted glass, from /coaching-popup-options.html (P3,
  // the polaroid, was live first), and
  // the intro-call form is F1, its full width, from
  // /coaching-form-options.html.
  cards: (site, c, e) => page('cards', `
<header class="co-hero co-hero-sky">${title(e)}</header>
<section class="co-cards" aria-label="Our coaches">
  ${e.coaches.map((x, i) => `
  <article class="co-card" id="co-${esc(x.key)}" data-co-card-flip data-co-rv style="--d:${i * 90}ms">
    <div class="co-card-in">
      <div class="co-card-front">
        <img src="${esc(x.photo)}" alt="" loading="lazy" decoding="async">
        <div class="co-card-cap">
          <p class="co-role">${esc(x.role)}</p>
          <h2 class="co-card-h"><span class="script">${esc(x.first)}</span>${esc(x.name.slice(x.first.length + 1))}</h2>
        </div>
        <button type="button" class="co-turn co-open" data-co-open="co-dlg-${esc(x.key)}" aria-haspopup="dialog">
          <span class="co-open-ic" aria-hidden="true">${PLAY}</span><span>Meet ${esc(x.first)}</span>
        </button>
      </div>
    </div>
  </article>`).join('')}
</section>
${coachDialogs(e)}`, e, 'light', videoClose(e), { pop: 'co-pop-glass', form: 'co-form-wide' }),
};

export const coachingOption = (site, c, key) => COACHING_OPTIONS[key](site, c, c.coachingPage);

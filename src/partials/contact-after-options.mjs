// The Contact page's section under the photograph (Rise Up Kings, "Is Your
// Husband Interested?", and the two videos), redesigned to feel premium:
// three designs for /contact-after-options.html
// (scripts/build-contact-after-options.mjs), asked for 2026-11-05.
//
//   gold   ivory and gold foil: the Rise Up Kings card framed in a gold edge
//          that a light runs round, the crest lifted off it; the videos tilt
//          toward the pointer, glow in their own colour, and carry their titles
//   stage  the panel turns into a dark theatre: soft spotlights from above,
//          the videos glowing on a polished floor with their reflections, and
//          Rise Up Kings as a gold-edged banner at the end
//   pair   "him & her": one card joining the Rise Up Queens crown and the
//          Rise Up Kings crest across a pink-to-gold "&"; the videos numbered,
//          with their titles beside the numbers
//
// The videos open in the site's lightbox like the live ones (.video-facade
// with data-lightbox; src/styles/app.js). Titles are the videos' YouTube
// titles (videos.json) without "| Jessica Lewis". Styles
// src/styles/contact-after.css (.ca-*).
import { esc } from './layout.mjs';

const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
const TONES = ['c', 'm'];   // the two thumbnails: teal, then pink

const vid = (vids, id) => {
  const v = vids.youtube.find(x => x.id === id) || { id, title: 'Watch' };
  return { id: v.id, title: v.title, short: String(v.title).replace(/\s*\|\s*Jessica Lewis\s*$/i, '') };
};

// A video facade the lightbox opens; `inner` is what sits over the poster.
const facade = (v, cls, inner = '') => `
<button type="button" class="video-facade ${cls}" data-lightbox data-provider="youtube" data-id="${esc(v.id)}" data-title="${esc(v.title)}">
  <span class="sr-only">Play ${esc(v.title)}</span>
  <img src="/assets/posters/yt-${esc(v.id)}.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">
  <span class="ca-play" aria-hidden="true">${PLAY}</span>${inner}
</button>`;

const TILT_JS = `<script>(function () {
  if (!matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-ca-tilt]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg'); el.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      el.style.setProperty('--gx', ((x + .5) * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });
})();</script>`;

export const CONTACT_AFTER = ['gold', 'stage', 'pair'];

export const contactAfter = (site, c, vids, key) => {
  const p = c.contact.partner;
  const list = c.contact.videos.map(id => vid(vids, id));
  const cta = (cls) => `<a class="${cls}" href="${esc(p.url)}" target="_blank" rel="noopener"><span>${esc(p.cta)}</span>${ARROW}</a>`;
  const crest = (cls) => `<img class="${cls}" src="${esc(site.assets.logoParent)}" alt="" aria-hidden="true" width="1762" height="2560" loading="lazy" decoding="async">`;

  const designs = {
    gold: `
<div id="ca" class="ca ca-gold">
  <div class="ca-wrap">
    <div class="ca-g-card">
      <span class="ca-g-edge" aria-hidden="true"></span>
      ${crest('ca-g-mark')}
      <div class="ca-g-crest">${crest('')}</div>
      <div class="ca-g-copy">
        <p class="ca-k">For him</p>
        <h2>${esc(p.heading)}</h2>
        <p class="ca-g-body">${esc(p.body)}</p>
      </div>
      ${cta('ca-g-btn')}
    </div>

    <div class="ca-g-vids">
      <div class="ca-head"><p class="ca-script" aria-hidden="true">Watch</p><h2 class="sr-only">Watch</h2><span class="ca-line" aria-hidden="true"></span></div>
      <div class="ca-g-grid">${list.map((v, i) => `
        <figure class="ca-g-v ca-tone-${TONES[i % 2]}" data-ca-tilt>
          ${facade(v, 'ca-g-face')}
          <figcaption><span class="ca-by">Jessica Lewis</span>${esc(v.short)}</figcaption>
        </figure>`).join('')}
      </div>
    </div>
  </div>
</div>${TILT_JS}`,

    stage: `
<div id="ca" class="ca ca-stage">
  <div class="ca-s-beams" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="ca-s-dust" aria-hidden="true"></div>
  <div class="ca-wrap">
    <div class="ca-head ca-head-c"><p class="ca-k ca-k-light">Now showing</p><p class="ca-script" aria-hidden="true">Watch</p><h2 class="sr-only">Watch</h2></div>
    <div class="ca-s-grid">${list.map((v, i) => `
      <figure class="ca-s-v ca-tone-${TONES[i % 2]}">
        ${facade(v, 'ca-s-face')}
        <img class="ca-s-mirror" src="/assets/posters/yt-${esc(v.id)}.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <figcaption>${esc(v.short)}</figcaption>
      </figure>`).join('')}
    </div>
    <div class="ca-s-banner">
      ${crest('ca-s-crest')}
      <div class="ca-s-copy"><h2>${esc(p.heading)}</h2><p>${esc(p.body)}</p></div>
      ${cta('ca-s-btn')}
    </div>
  </div>
</div>`,

    pair: `
<div id="ca" class="ca ca-pair">
  <div class="ca-wrap">
    <div class="ca-p-card">
      <div class="ca-p-side ca-p-her"><img src="/assets/brand/crown-magenta.png" alt="" aria-hidden="true" loading="lazy" decoding="async"><span>Rise Up Queens</span></div>
      <div class="ca-p-mid">
        <span class="ca-p-amp" aria-hidden="true">&amp;</span>
        <h2>${esc(p.heading)}</h2>
        <p>${esc(p.body)}</p>
        ${cta('ca-p-btn')}
      </div>
      <div class="ca-p-side ca-p-him">${crest('')}<span>Rise Up Kings</span></div>
    </div>

    <div class="ca-p-vids">
      <div class="ca-head"><p class="ca-script" aria-hidden="true">Watch</p><h2 class="sr-only">Watch</h2><span class="ca-line" aria-hidden="true"></span></div>
      <div class="ca-p-grid">${list.map((v, i) => `
        <figure class="ca-p-v ca-tone-${TONES[i % 2]}">
          ${facade(v, 'ca-p-face')}
          <figcaption><span class="ca-p-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="ca-p-t">${esc(v.short)}<small>Jessica Lewis</small></span></figcaption>
        </figure>`).join('')}
      </div>
    </div>
  </div>
</div>`,
  };

  return `<link rel="stylesheet" href="/contact-after.css">${designs[key] || designs.gold}`;
};

// The 404 page, which Vercel shows for any address with no page (dist/404.html):
// three simple designs for /404-options.html (asked for 2026-11-04).
// scripts/build-404-options.mjs renders each as /nf-<key>.html.
//
// Built from the thank-you page's parts (.ty-*, thankyou.css), since it is
// the same kind of page: a short message and a way on. Its own styles are
// .nf-* in src/styles/notfound.css. Copy is content.json notFound. Every link
// is absolute, because the page is served at whatever address was missed.
import { esc } from './layout.mjs';

const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const words = (n, { crown = true } = {}) => `${crown ? `
<span class="ty-crown" aria-hidden="true"></span>` : ''}
<p class="ty-script script">${esc(n.script)}</p>
<h1 class="ty-h">${esc(n.title)}</h1>
<p class="ty-body">${esc(n.body)}</p>`;

const home = (n) => `<a class="ty-btn" href="/index.html">${esc(n.home)}${ARROW}</a>`;

// the main pages as a row of pills
const pills = (n) => `
<ul class="nf-pills" role="list">${n.links.map(l => `
  <li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('')}
</ul>`;

const OPTIONS = {
  // N1 · the thank-you page's daylight photograph, washed
  day: (n) => `
<section class="ty ty-day nf">
  <img class="ty-photo" src="/assets/photos/close-group.jpg" alt="" aria-hidden="true" decoding="async" fetchpriority="high">
  <div class="ty-shade" aria-hidden="true"></div>
  <div class="ty-in">${words(n)}
    <div class="ty-actions">${home(n)}</div>${pills(n)}
  </div>
</section>`,

  // N2 · a huge 404 in the brand gradient behind the words, on soft light
  big: (n) => `
<section class="ty ty-card nf nf-big">
  <span class="ty-glow ty-glow-a" aria-hidden="true"></span><span class="ty-glow ty-glow-b" aria-hidden="true"></span>
  <div class="ty-in">
    <p class="nf-num" aria-hidden="true">404</p>${words(n, { crown: false })}
    <div class="ty-actions">${home(n)}</div>${pills(n)}
  </div>
</section>`,

  // N3 · the words, then the main pages as four photo cards to choose from
  signs: (n) => `
<section class="ty ty-card nf nf-signs">
  <div class="ty-in">${words(n)}
    <ul class="nf-cards" role="list">${n.links.map(l => `
      <li><a href="${esc(l.href)}"><img src="${esc(l.photo)}" alt="" loading="lazy" decoding="async"><span>${esc(l.label)}${ARROW}</span></a></li>`).join('')}
    </ul>
    <div class="ty-actions">${home(n)}</div>
  </div>
</section>`,
};

export const NOTFOUND_OPTIONS = Object.keys(OPTIONS);

export const notFoundOption = (site, c, key) => `
<link rel="stylesheet" href="/thankyou.css">
<link rel="stylesheet" href="/notfound.css">${OPTIONS[key](c.notFound)}`;

// The thank-you page, where the Contact Us form sends the visitor after a
// submit (content.json contact.mosForm.next): four simple designs for
// /thank-you-options.html (asked for 2026-11-04).
// scripts/build-thankyou-options.mjs renders each as /ty-<key>.html.
//
// Every option says the same few things (content.json thankYou): the crown,
// "Thank you, Queen" in script, that the message is on its way, the way back
// home, one next step and the socials. Only the setting changes. Styles are
// .ty-* in src/styles/thankyou.css (plain CSS, no Tailwind rebuild).
import { esc } from './layout.mjs';
import { SOCIAL_ICONS, SOCIAL_KEYS } from './contact-parts.mjs';

const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const socials = (site, t) => `
<div class="ty-soc">
  <p class="ty-k">${esc(t.socialHeading)}</p>
  <ul role="list">${SOCIAL_KEYS.filter(s => site.social[s.key]).map(s => `
    <li><a href="${esc(site.social[s.key])}" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${SOCIAL_ICONS[s.key]}</svg>${esc(s.label)}</a></li>`).join('')}
  </ul>
</div>`;

// The message itself, the same in every option.
const message = (site, t) => `
<span class="ty-crown" aria-hidden="true"></span>
<p class="ty-script script">${esc(t.script)}</p>
<h1 class="ty-h">${esc(t.title)}</h1>
<p class="ty-body">${esc(t.body)}</p>
<div class="ty-actions">
  <a class="ty-btn" href="/index.html">${esc(t.home)}${ARROW}</a>
  <a class="ty-more" href="${esc(t.more.href)}">${esc(t.more.label)}</a>
</div>
${socials(site, t)}`;

const OPTIONS = {
  // T1 · the Contact page's daylight photograph, washed almost to white, so
  // the visitor lands somewhere that looks like where they just were
  day: (site, t) => `
<section class="ty ty-day">
  <img class="ty-photo" src="/assets/photos/close-group.jpg" alt="" aria-hidden="true" decoding="async" fetchpriority="high">
  <div class="ty-shade" aria-hidden="true"></div>
  <div class="ty-in">${message(site, t)}</div>
</section>`,

  // T2 · one white card on soft blush and teal light; nothing else
  card: (site, t) => `
<section class="ty ty-card">
  <span class="ty-glow ty-glow-a" aria-hidden="true"></span><span class="ty-glow ty-glow-b" aria-hidden="true"></span>
  <div class="ty-in ty-panel">${message(site, t)}</div>
</section>`,

  // T3 · a note taped to blush paper, like the Stay Connected note on the
  // homepage's Freedom wall
  note: (site, t) => `
<section class="ty ty-note">
  <div class="ty-in ty-paper">
    <span class="ty-tape" aria-hidden="true"></span>
    ${message(site, t)}
  </div>
</section>`,

  // T4 · the queens waving on one half, the message on the other
  split: (site, t) => `
<section class="ty ty-split">
  <figure class="ty-fig"><img class="ty-photo" src="/assets/photos/queens-waving.jpg" alt="" aria-hidden="true" decoding="async" fetchpriority="high"></figure>
  <div class="ty-in">${message(site, t)}</div>
</section>`,
};

export const THANKYOU_OPTIONS = Object.keys(OPTIONS);

export const thankYouOption = (site, c, key) => `
<link rel="stylesheet" href="/thankyou.css">${OPTIONS[key](site, c.thankYou)}`;

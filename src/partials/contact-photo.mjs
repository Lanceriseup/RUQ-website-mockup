// Contact, photo-led redesign (/contact-photo-options.html). The client asked
// for a photograph behind the page instead of the bright sky, a new layout,
// and the support email shown (content.json contact.email).
//
// Every option keeps the page's content: the heading and lead, the form (still
// disabled — see contact-parts.mjs), the socials, the Rise Up Kings invitation
// and the two videos. Type is Lato, the client's font, with "Contact" in the
// Julietta Messie script.
//
//   glass     full-bleed photo under a deep fade; copy and email on the left,
//             a frosted glass form on the right
//   split     the photo fills a half that stays put as you scroll, with a
//             quote over it; heading, email and form on white beside it
//   ways      warm photo behind a blush veil; one white card opening with
//             three ways to reach us — email, socials, Rise Up Kings — then
//             the form
//   letter    the email itself as the headline, huge, over a brand-tinted
//             photo, with the form card rising over the photo's lower edge
//
// `dark` options put the header in its over-photo (white) mode. Styles are
// .cx-* in src/styles/contact-photo.css.
import { esc } from './layout.mjs';
import { socials, form, video, SOCIAL_ICONS, SOCIAL_KEYS } from './contact-parts.mjs';

const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const MAIL = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>';
const COPY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';

export const CONTACT_PHOTO = {
  glass: { photo: '/assets/photos/close-group.jpg', dark: true },
  split: { photo: '/assets/photos/journey-embrace.jpg', dark: false },
  ways: { photo: '/assets/photos/about-hero-group.jpg', dark: false },
  letter: { photo: '/assets/photos/deeper-embrace.jpg', dark: true },
  // Variants on glass (P1's layout), /contact-glass-options.html.
  gday: { photo: '/assets/photos/close-group.jpg', dark: false },
  gduo: { photo: '/assets/photos/about-hero-group.jpg', dark: true },
  gimm: { photo: '/assets/photos/close-talk.jpg', dark: true },
  ggold: { photo: '/assets/photos/close-group.jpg', dark: true },
};

// The copy button writes the address to the clipboard and says so; mailto is
// the link itself, so it still works where the clipboard is unavailable.
const COPY_JS = `<script>(function () {
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-copy'), l = b.querySelector('[data-copy-label]');
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () {
        if (l) { l.textContent = 'Copied'; b.classList.add('is-done'); setTimeout(function () { l.textContent = 'Copy'; b.classList.remove('is-done'); }, 1800); }
      }, function () { location.href = 'mailto:' + t; });
    });
  });
})();</script>`;

const heading = (c, cls = '') => `
<h1 class="cx-h ${cls}"><span class="cx-script">${esc(c.contact.heading)}</span></h1>`;
const lead = (c) => `<p class="cx-lead">${esc(c.contact.lead)}</p>`;

// The email, as its own block. `size`: 'row' (icon, address, copy) or 'hero'
// (the address as the headline).
const email = (c, size = 'row') => {
  const e = esc(c.contact.email);
  if (size === 'hero') return `
<div class="cx-mailhero">
  <p class="cx-k">Write to us</p>
  <a class="cx-mailbig" href="mailto:${e}">${e.replace('@', '<wbr>@')}</a>
  <div class="cx-mailacts">
    <a class="cx-btn" href="mailto:${e}">Send an email ${ARROW}</a>
    <button type="button" class="cx-copy" data-copy="${e}">${COPY}<span data-copy-label>Copy</span></button>
  </div>
</div>`;
  return `
<div class="cx-mail">
  <span class="cx-mail-ic" aria-hidden="true">${MAIL}</span>
  <span class="cx-mail-t"><span class="cx-k">Email us</span><a href="mailto:${e}">${e}</a></span>
  <button type="button" class="cx-copy" data-copy="${e}">${COPY}<span data-copy-label>Copy</span></button>
</div>`;
};

// The email and socials together, without a copy button, in one of four
// styles (chosen on /contact-reach-options.html). The address is a mailto
// link in all of them. Each social shows its handle, read from the URL.
//   list    one white card of rows: email, then each social with its handle
//   pills   the address as a large link that underlines itself, socials as
//           labelled pills
//   tiles   a wide email tile over three social tiles, lifting on hover
//   sign    one card: the address with a round send button, then gradient
//           social circles under "Follow along"
const handle = (url) => {
  const m = String(url).replace(/\/+$/, '').split('/').pop();
  return m.startsWith('@') ? m : '@' + m;
};
const ico = (key, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${SOCIAL_ICONS[key]}</svg>`;
export const REACH = ['list', 'pills', 'tiles', 'sign'];
const reach = (site, c, style) => {
  const e = esc(c.contact.email);
  const soc = SOCIAL_KEYS.filter(k => site.social[k.key]).map(k => ({ ...k, url: site.social[k.key], h: handle(site.social[k.key]) }));
  const ext = (u) => `href="${esc(u)}" target="_blank" rel="noopener"`;
  if (style === 'list') return `
<ul class="cr cr-list">
  <li><a href="mailto:${e}"><span class="cr-ic cr-ic-mail">${MAIL}</span><span class="cr-t"><b>Email us</b><span>${e}</span></span><i class="cr-go" aria-hidden="true">${ARROW}</i></a></li>
  ${soc.map(k => `<li><a ${ext(k.url)}><span class="cr-ic">${ico(k.key)}</span><span class="cr-t"><b>${esc(k.label)}</b><span>${esc(k.h)}</span></span><i class="cr-go" aria-hidden="true">${ARROW}</i></a></li>`).join('')}
</ul>`;
  if (style === 'pills') return `
<div class="cr cr-pills">
  <p class="cx-k">Email us</p>
  <a class="cr-big" href="mailto:${e}">${e}</a>
  <p class="cx-k cr-gap">Find us on socials</p>
  <ul>${soc.map(k => `<li><a ${ext(k.url)}>${ico(k.key, 18)}<span>${esc(k.label)}</span></a></li>`).join('')}</ul>
</div>`;
  if (style === 'tiles') return `
<div class="cr cr-tiles">
  <a class="cr-tile cr-tile-mail" href="mailto:${e}"><span class="cr-ic cr-ic-mail">${MAIL}</span><span class="cr-t"><b>Email us</b><span>${e}</span></span><i class="cr-go" aria-hidden="true">${ARROW}</i></a>
  ${soc.map(k => `<a class="cr-tile" ${ext(k.url)}><span class="cr-ic">${ico(k.key, 22)}</span><b>${esc(k.label)}</b><span>${esc(k.h)}</span></a>`).join('')}
</div>`;
  return `
<div class="cr cr-sign">
  <p class="cx-k">Email us</p>
  <a class="cr-sign-mail" href="mailto:${e}"><span>${e}</span><i aria-hidden="true">${ARROW}</i></a>
  <div class="cr-rule" aria-hidden="true"></div>
  <p class="cx-k">Follow along</p>
  <ul>${soc.map(k => `<li><a ${ext(k.url)} aria-label="${esc(k.label)} ${esc(k.h)}">${ico(k.key, 20)}</a></li>`).join('')}</ul>
</div>`;
};

const ruk = (site, c) => {
  const p = c.contact.partner;
  return `
<div class="cx-ruk">
  <img src="${esc(site.assets.logoParent)}" alt="" aria-hidden="true" width="1762" height="2560" loading="lazy" decoding="async">
  <div>
    <h2>${esc(p.heading)}</h2>
    <p>${esc(p.body)}</p>
    <a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.cta)} ${ARROW}</a>
  </div>
</div>`;
};

const theForm = (c, dark) => form(c, dark
  ? { skin: 'soft', label: 'caps', idPrefix: 'cx' }
  : { skin: 'blush', label: 'capsLight', idPrefix: 'cx' });

const videos = (c, vids) => `
<section class="cx-vids">
  <p class="cx-k">Watch</p>
  <div class="cx-vidgrid">${c.contact.videos.map(id => video(id, vids)).join('')}</div>
</section>`;

const photo = (src, cls = '') => `<img class="cx-photo ${cls}" src="${esc(src)}" alt="" aria-hidden="true" decoding="async" fetchpriority="high">`;

// P1's layout, shared by glass and its variants. `mod` is the variant's
// class; `dark` picks white type, glass email card and the dark form skin;
// `below` 'glass' puts Rise Up Kings and the videos on the photo too.
// `card` 'solid' sets the form on a white card (with the light form skin)
// even when the photo behind is dark.
// `arc` sets what follows on a white panel with rounded top corners that
// lifts over the photo — the same overlapping panel as the homepage and the
// about page.
// `reachStyle` swaps the email card and socials for one of the reach() styles.
const glassLayout = (site, c, vids, P, mod, { dark = true, layers = '', below = 'white', card = '', arc = false, reachStyle = '' } = {}) => {
  const solid = card === 'solid' || !dark;
  const intro = `
      <div class="cx-intro">
        ${heading(c)}${lead(c)}
        ${reachStyle ? reach(site, c, reachStyle) : `${email(c)}
        <div class="cx-soc">${socials(site, { tone: dark ? 'dark' : 'light', style: 'tile' })}</div>`}
      </div>
      <div class="cx-card ${solid ? 'cx-card-solid' : 'cx-card-glass'}">${theForm(c, !solid)}</div>`;
  const inner = `<div class="cx-wrap cx-after">${ruk(site, c)}${videos(c, vids)}</div>`;
  const after = arc ? `<div class="cx-arc">${inner}</div>` : inner;
  return `
<div class="cx cx-glass ${mod}">
  <div class="cx-band">
    ${photo(P.photo, 'cx-kb')}
    ${layers}
    <div class="cx-shade" aria-hidden="true"></div>
    <div class="cx-wrap cx-2col">${intro}</div>
    ${below === 'glass' ? after : ''}
  </div>
  ${below === 'glass' ? '' : after}
</div>`;
};

const BODIES = {
  // LIVE (chosen 2026-10-10 from /contact-glass-options.html, G1) with the
  // overlapping arc panel below the photo, and the email and socials as B,
  // "big link & pills" (no copy button), from /contact-reach-options.html.
  gday: (site, c, vids, P) => glassLayout(site, c, vids, P, 'cx-gday', { dark: false, arc: true, reachStyle: 'pills' }),
  gduo: (site, c, vids, P) => glassLayout(site, c, vids, P, 'cx-gduo', { layers: '<div class="cx-duo-map" aria-hidden="true"></div><div class="cx-grain" aria-hidden="true"></div>' }),
  gimm: (site, c, vids, P) => glassLayout(site, c, vids, P, 'cx-gimm', { below: 'glass' }),
  ggold: (site, c, vids, P) => glassLayout(site, c, vids, P, 'cx-ggold', { layers: '<div class="cx-sun" aria-hidden="true"></div>', card: 'solid' }),

  glass: (site, c, vids, P) => `
<div class="cx cx-glass">
  <div class="cx-band">
    ${photo(P.photo, 'cx-kb')}
    <div class="cx-shade" aria-hidden="true"></div>
    <div class="cx-wrap cx-2col">
      <div class="cx-intro">
        ${heading(c)}${lead(c)}
        ${email(c)}
        <div class="cx-soc">${socials(site, { tone: 'dark', style: 'tile' })}</div>
      </div>
      <div class="cx-card cx-card-glass">${theForm(c, true)}</div>
    </div>
  </div>
  <div class="cx-wrap cx-after">${ruk(site, c)}${videos(c, vids)}</div>
</div>`,

  split: (site, c, vids, P) => `
<div class="cx cx-split">
  <div class="cx-split-grid">
    <figure class="cx-split-photo">
      ${photo(P.photo)}
      <figcaption class="cx-quote"><span class="cx-script">Come as you are.</span><span>Our team reads every message and will get back to you.</span></figcaption>
    </figure>
    <div class="cx-split-copy">
      ${heading(c)}${lead(c)}
      ${email(c)}
      <div class="cx-card">${theForm(c, false)}</div>
      <div class="cx-soc">${socials(site, { tone: 'light', style: 'tile' })}</div>
      ${ruk(site, c)}
    </div>
  </div>
  <div class="cx-wrap cx-after">${videos(c, vids)}</div>
</div>`,

  ways: (site, c, vids, P) => `
<div class="cx cx-ways">
  ${photo(P.photo, 'cx-kb')}
  <div class="cx-veil" aria-hidden="true"></div>
  <div class="cx-wrap">
    <div class="cx-centre">${heading(c, 'cx-h-c')}${lead(c)}</div>
    <div class="cx-panel">
      <div class="cx-ways3">
        <div class="cx-way">
          <span class="cx-way-ic" aria-hidden="true">${MAIL}</span>
          <p class="cx-k">Email us</p>
          <a class="cx-way-a" href="mailto:${esc(c.contact.email)}">${esc(c.contact.email)}</a>
          <button type="button" class="cx-copy" data-copy="${esc(c.contact.email)}">${COPY}<span data-copy-label>Copy</span></button>
        </div>
        <div class="cx-way">${socials(site, { tone: 'light', style: 'tile', align: 'center' })}</div>
        <div class="cx-way cx-way-ruk">${ruk(site, c)}</div>
      </div>
      <div class="cx-panel-form">
        <p class="cx-k cx-k-c">Or send us a message</p>
        ${theForm(c, false)}
      </div>
    </div>
    ${videos(c, vids)}
  </div>
</div>`,

  letter: (site, c, vids, P) => `
<div class="cx cx-letter">
  <div class="cx-band">
    ${photo(P.photo, 'cx-kb cx-duo')}
    <div class="cx-duo-map" aria-hidden="true"></div>
    <div class="cx-shade" aria-hidden="true"></div>
    <div class="cx-wrap cx-letter-top">
      ${heading(c, 'cx-h-c')}
      ${email(c, 'hero')}
    </div>
  </div>
  <div class="cx-wrap cx-letter-low">
    <div class="cx-card cx-card-rise">
      <div class="cx-letter-grid">
        <div>
          <p class="cx-k">Send a message</p>
          ${lead(c)}
          <div class="cx-soc">${socials(site, { tone: 'light', style: 'tile' })}</div>
        </div>
        <div>${theForm(c, false)}</div>
      </div>
    </div>
    ${ruk(site, c)}
    ${videos(c, vids)}
  </div>
</div>`,
};

export const contactPhoto = (site, c, vids, key = 'glass') => {
  const P = CONTACT_PHOTO[key] || CONTACT_PHOTO.glass;
  return (BODIES[key] || BODIES.glass)(site, c, vids, P) + COPY_JS;
};

// The live layout (G1 with the arc) with a given email-and-socials style.
export const contactReach = (site, c, vids, style) =>
  glassLayout(site, c, vids, CONTACT_PHOTO.gday, 'cx-gday', { dark: false, arc: true, reachStyle: style });

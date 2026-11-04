// The Contact page with the client's new background photograph (the queens
// in their crowns at the event, supplied 2026-11-05): four ways to use it,
// for /contact-bg-options.html (scripts/build-contact-bg-options.mjs). The
// page around it is the live one: "Contact", the email and socials, the
// MultiplyOS Contact Us form (C1, in place), the arc panel below.
//
//   day    the new photo in today's daylight treatment, for comparison
//   focus  the room comes into focus: the photo starts blurred and pulls
//          sharp, stage lights in the brand's pink and teal glow over it, a
//          light sweeps across; white type on the darkened left
//   spot   a spotlight: the room in a soft blush wash, and a circle of full
//          colour that follows the pointer over the faces (on a phone, it
//          drifts across the room by itself)
//   hero   the queens first: the photograph wide and bright at the top of the
//          page, opening from the centre, and the form rising over its edge
//
// Styles src/styles/contact-bg.css (.cb-*); the spotlight's script is inline.
import { mosForm } from './stay-options.mjs';
import { contactWithForm } from './contact-photo.mjs';

const PHOTO = '/assets/photos/contact-queens.jpg';
const SRCSET = '/assets/photos/contact-queens-1200.jpg 1200w, /assets/photos/contact-queens.jpg 2400w';

// The spotlight follows the pointer over the band; with no pointer (a phone)
// or before the first move, it drifts on a slow loop across the room.
const SPOT_JS = `<script>(function (s) {
  var band = s.closest('.cx-band'); if (!band) return;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches, user = false, t0 = performance.now();
  function set(x, y) { band.style.setProperty('--sx', x + 'px'); band.style.setProperty('--sy', y + 'px'); }
  function drift(now) {
    if (user) return;
    var r = band.getBoundingClientRect(), t = (now - t0) / 1000;
    var wide = r.width > 900;
    var cx = r.width * 0.5, cy = r.height * (wide ? 0.6 : 0.45);
    set(cx + Math.sin(t * 0.32) * r.width * (wide ? 0.42 : 0.34), cy + Math.sin(t * 0.55) * r.height * 0.16);
    requestAnimationFrame(drift);
  }
  if (still) { var r = band.getBoundingClientRect(); set(r.width * 0.66, r.height * 0.56); return; }
  requestAnimationFrame(drift);
  if (matchMedia('(hover: hover)').matches) band.addEventListener('pointermove', function (e) {
    var r = band.getBoundingClientRect(); user = true; band.classList.add('is-follow'); set(e.clientX - r.left, e.clientY - r.top);
  });
})(document.currentScript);</script>`;

export const CONTACT_BG = {
  day: { mod: 'cb-day', label: 'Daylight' },
  focus: {
    mod: 'cb-focus', dark: true, day: false, label: 'Into focus',
    layers: '<div class="cb-lights" aria-hidden="true"><i></i><i></i><i></i></div><div class="cb-sweep" aria-hidden="true"></div>',
  },
  spot: {
    mod: 'cb-spot', label: 'Spotlight',
    layers: `<img class="cb-spot-img" src="${PHOTO}" srcset="${SRCSET}" sizes="100vw" alt="" aria-hidden="true" decoding="async"><div class="cb-spot-ring" aria-hidden="true"></div>${SPOT_JS}`,
  },
  hero: {
    mod: 'cb-hero', label: 'The queens first',
    layers: '<div class="cb-hero-top" aria-hidden="true"></div>',
  },
};

// `dark` designs want the header in its white, over-photo mode.
export const contactBgDark = (key) => !!CONTACT_BG[key]?.dark || key === 'hero';

// `after` replaces the section below the photo (contact-after-options.mjs).
export const contactBg = (site, c, vids, key = 'day', { after = '' } = {}) => {
  const o = CONTACT_BG[key] || CONTACT_BG.day;
  return `
<link rel="stylesheet" href="/stay.css">
<link rel="stylesheet" href="/contact-bg.css">
${contactWithForm(site, c, vids, `<div class="sc cf-slot">${mosForm(c.contact.mosForm)}</div>`, `cf-drop ${o.mod}`,
    { photo: PHOTO, srcset: SRCSET, dark: !!o.dark, day: o.day !== false, layers: o.layers || '', after })}
<script src="/stay.js" defer></script>`;
};

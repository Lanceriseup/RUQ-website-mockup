// The Contact page with the live MultiplyOS "Contact Us" form (content.json
// contact.mosForm) in place of the disabled form: four ways to set it, for
// /contact-form-options.html (asked for 2026-11-03).
// scripts/build-contact-form-options.mjs renders each as /cf-<key>.html.
//
// The page around it is the live one (G1 daylight photo, the email and
// socials, the arc panel with Rise Up Kings and the videos), via
// contactWithForm in contact-photo.mjs. The form is the shared framed embed
// (mosForm, stay-options.mjs: the smooth shadow and the frame sized to the
// form). It draws its own "Contact Us" title and logo. Styles are .cf-* in
// src/styles/stay.css; frame heights come from stay.js.
import { mosForm } from './stay-options.mjs';
import { contactWithForm } from './contact-photo.mjs';

const assets = `
<link rel="stylesheet" href="/stay.css">`;
const script = `
<script src="/stay.js" defer></script>`;

const wrap = (site, c, vids, inner, mod) => assets + contactWithForm(site, c, vids, inner, mod) + script;

export const CONTACT_FORM_OPTIONS = {
  // C1 — straight in where the old card was, with the soft shadow.
  drop: (site, c, vids, f) => wrap(site, c, vids, `<div class="sc cf-slot">${mosForm(f)}</div>`, 'cf-drop'),

  // C2 — held in a frosted glass mat with a fine pink-to-teal rim, so it
  // reads as part of the photograph rather than sitting on it.
  glass: (site, c, vids, f) => wrap(site, c, vids, `
<div class="sc cf-slot cf-glass"><span class="cf-rim" aria-hidden="true"></span>${mosForm(f)}</div>`, 'cf-glassy'),

  // C3 — taped to the page like the homepage's Freedom wall note, at a slight
  // tilt, with a hand-written "say hello" pointing at it.
  note: (site, c, vids, f) => wrap(site, c, vids, `
<div class="sc cf-slot cf-note">
  <p class="cf-hello script" aria-hidden="true">say hello</p>
  <svg class="cf-arrow" viewBox="0 0 120 90" aria-hidden="true"><path d="M8 20 C 48 4, 92 20, 100 66 M86 56 L 100 70 L 110 54"/></svg>
  <span class="sc-tape sc-tape-pink cf-tape" aria-hidden="true"></span>
  ${mosForm(f)}
</div>`, 'cf-noted'),

  // C4 — the form stands out of the photograph and over the arc's edge, the
  // way the About page's form stands out of its band.
  rise: (site, c, vids, f) => wrap(site, c, vids, `<div class="sc cf-slot cf-rise">${mosForm(f)}</div>`, 'cf-risen'),
};

export const contactFormOption = (site, c, vids, key) => CONTACT_FORM_OPTIONS[key](site, c, vids, c.contact.mosForm);

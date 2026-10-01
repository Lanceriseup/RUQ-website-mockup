// Closing CTA — the last section on the homepage, and the final ask.
//
// Layout is settled (the ticket), so the markup now lives in
// closing-ticket.mjs rather than being pulled out of the layout gallery.
// closing-wide.mjs still holds all six panels for reference; the shipped
// section needed levers the gallery does not have, and threading a third one
// through six layouts to serve one of them was the worse trade.
//
// Wording is `startsHere`: heading "Your turning point starts here" with their
// phrase highlighted, over their own sentence as the sub-headline. The heading
// is mine; theirs is "What if this is your turning point?" and remains as the
// `verbatim` entry in closing-wide.mjs.
//
// SIZE is 'snug' — compact's low, wide, button-led proportions a step up,
// rather than current's enlarged-panel look.
//
// MOTION is 'rimGlow': brand light around the whole panel edge, fading up and
// down on a 4-second loop. Nothing moves — the glow is a fixed shadow on a
// pseudo-element and only its opacity animates, so the loop stays on the
// compositor for as long as the page is open. Under prefers-reduced-motion the
// ring is hidden rather than merely un-animated; at rest it sits at full
// strength, which would leave a permanent halo.
//
// The stub shows event dates, and those are contradictory: the live banner
// says October 9-11, site.json carries October 15-17 2026 flagged for
// verification. The stub says so on its face and that label has to come off
// before launch, one way or the other.
import { CLOSING_COPY } from './closing-wide.mjs';
import { closingTicket } from './closing-ticket.mjs';
import { eventPanel } from './cta.mjs';

export { closingTicket };

export const WORDING = 'startsHere';
export const SIZE = 'snug';
export const MOTION = 'rimGlow';

// SHIPPING: the closing CTA is now the same dark event panel as the
// breakthrough CTA (cta.mjs eventPanel) — same photo, labelled dates, button
// and pink pulse — carrying the startsHere wording and its sub-line. The
// ticket above is kept for /closing-panel.html and the other galleries, which
// import WORDING / SIZE and closingTicket directly.
//
// ground: 'white' on the homepage, where this opens its own section;
// 'inherit' on the about page, where it floats on the journey section's
// ground. The panel carries no background either way, so only the padding
// differs.
export const closingSection = (site, c, ground = 'white') => {
  const copy = CLOSING_COPY[WORDING];
  return eventPanel(site, {
    id: ground === 'white' ? 'closing' : 'closing-about',
    title: copy.heading,
    phrase: copy.highlight,
    body: copy.body,
    pad: ground === 'white' ? 'bg-white py-10 sm:py-16' : 'py-8 sm:py-12',
  });
};

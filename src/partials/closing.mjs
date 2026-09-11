// Closing CTA — the last section on the homepage, and the final ask.
//
// This is a thin wrapper rather than a copy of the markup. The chosen design
// is `ticketBar` from closing-wide.mjs, and pointing at it means the shipped
// section and the option that was approved cannot drift apart. Every other
// layout in that file stays one argument away.
//
// Wording is `verbatim` — the client's own line from the live homepage. The
// preview frame for this layout was paired with `comeSee`, which is mine and
// names Dallas; that pairing was a gallery choice, not a decision about copy,
// so it is not what ships. Swapping is one string.
//
// This layout puts the event dates on the stub, and those dates are still
// contradictory: the live banner says October 9-11, site.json carries
// October 15-17 2026 flagged for verification. The stub says so on its face
// and that label has to come off before launch, one way or the other.
import { renderClosingWide } from './closing-wide.mjs';

export const LAYOUT = 'ticketBar';
export const WORDING = 'verbatim';

export const closingSection = (site, c) => renderClosingWide(site, c, LAYOUT, WORDING);

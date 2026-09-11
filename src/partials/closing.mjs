// Closing CTA — the last section on the homepage, and the final ask.
//
// This is a thin wrapper rather than a copy of the markup. The chosen design
// is `ticketBar` from closing-wide.mjs, and pointing at it means the shipped
// section and the option that was approved cannot drift apart. Every other
// layout in that file stays one argument away.
//
// Wording is `startsHere`: heading "Your turning point starts here" with
// their phrase highlighted, over their own sentence as the sub-headline.
//
// The heading is mine. Their live heading is "What if this is your turning
// point?" and it remains as the `verbatim` option — one string away.
//
// This layout puts the event dates on the stub, and those dates are still
// contradictory: the live banner says October 9-11, site.json carries
// October 15-17 2026 flagged for verification. The stub says so on its face
// and that label has to come off before launch, one way or the other.
import { renderClosingWide } from './closing-wide.mjs';

export const LAYOUT = 'ticketBar';
export const WORDING = 'startsHere';

// Motion is undecided; the section ships static until a choice is made.
export const MOTION = 'none';

export const closingSection = (site, c) => renderClosingWide(site, c, LAYOUT, WORDING, MOTION);

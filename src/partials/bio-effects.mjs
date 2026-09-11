// Opening a coach's bio: six treatments, replacing the <details> drawer.
//
// Five are modals and one is not — `flip` turns the polaroid over in place,
// which is the only option that keeps the bio attached to the person rather
// than moving it to the middle of the screen. It is included because it is the
// most on-theme thing a polaroid can do, not because it fits the word "popup".
//
// What every option has to get right, and what the drawer got for free by
// being a <details>:
//
//   - Escape closes it, the backdrop closes it, focus returns to the card
//   - focus cannot leave the open dialog by tabbing
//   - the page behind does not scroll, and does not jump sideways when the
//     scrollbar is hidden
//   - it is announced as a dialog and labelled by the person's name
//   - it degrades: the bio is real markup already in the page, so with the
//     script blocked the button is inert but the content is still there for
//     search and for anything reading the document
//
// The bio is cloned from a hidden block inside each card rather than rebuilt
// from data attributes. Long prose with paragraph breaks does not survive an
// attribute round trip cleanly, and keeping it as markup means it is in the
// document whether the modal ever opens or not.
export const BIO_EFFECTS = {
  lift: {
    label: 'Lift — the polaroid flies out of the grid',
    note: 'The card is measured where it sits, then animated from that exact position to the centre of the screen as the bio fades in beside it. Closing reverses it back into the grid. The most impressive of the six and the only one where the thing you clicked is visibly the thing that opened.',
  },
  scale: {
    label: 'Scale — grows from the centre behind a blur',
    note: 'The page blurs and dims, the panel scales up from 92% and settles. The plainest option and the one that will still look right in five years. Nothing can go wrong with it.',
  },
  curtain: {
    label: 'Curtain — a brand sweep wipes it in',
    note: 'A magenta-to-cyan panel sweeps across, and the bio is behind it as it passes. Theatrical, brand-coloured, and the only option where the transition itself carries colour.',
  },
  slideOver: {
    label: 'Slide-over — a panel from the right edge',
    note: 'Full-height panel sliding in from the right, portrait at the top, bio beneath. Holds more text than any centred modal without scrolling, which matters for the two longest bios. Familiar from apps rather than from marketing sites.',
  },
  sheet: {
    label: 'Sheet — rises from the bottom',
    note: 'A rounded sheet lifts from the bottom edge with a drag handle at the top. Native on a phone, where four of these six feel like a desktop pattern squeezed down. Best of the six on mobile, least distinctive on desktop.',
  },
  flip: {
    label: 'Flip — the polaroid turns over in place',
    note: 'Not a popup. The card rotates on its vertical axis and the bio is on the back of it, in the grid, where the person is. The most on-theme option for a wall of polaroids and the only one that never covers the rest of the page — but the back of a card is a small space, and the longest bio needs to scroll inside it.',
    inPlace: true,
  },
};

export const effectClass = (key) => `bio-fx bio-fx-${key}`;

// Motion options for the closing CTA panel.
//
// Two kinds here, and the difference matters more than the look:
//
//   ARRIVAL   fires once when the panel scrolls into view, then stops.
//             Costs nothing after it runs and cannot become wallpaper.
//   AMBIENT   runs forever. Keeps the panel alive in peripheral vision, but
//             it is the last thing on the page and a loop down there competes
//             with the button rather than pointing at it.
//
// Every option is transform/opacity only, so the panel composites instead of
// re-laying-out, and every one is switched off wholesale under
// prefers-reduced-motion — the panel must be complete and legible with no
// motion at all, because for some visitors that is what ships.
//
// The arrival options need an IntersectionObserver to add `.is-in`. That lives
// in closing-motion.js, which also adds `.is-in` immediately when IO is
// missing, so a panel can never be left invisible by a failed script.
export const CLOSING_MOTION = {
  none: {
    kind: '—',
    label: 'None — what is there now',
    note: 'Shown for comparison. The panel is static; only the button reacts, on hover.',
  },
  rise: {
    kind: 'arrival',
    label: 'Rise — the panel lifts in as you reach it',
    note: 'Fades up 28px over 700ms when it enters view, once. The quietest option and the one that reads as a page finishing rather than a page decorating itself. Safest choice.',
  },
  stagger: {
    kind: 'arrival',
    label: 'Stagger — panel, then copy, then button, then stub',
    note: 'The same arrival, broken into four beats 90ms apart. The button lands last, which is the point — the eye arrives where the click is. More deliberate than Rise and roughly twice as long to settle.',
  },
  tear: {
    kind: 'arrival',
    label: 'Tear — the stub separates along the perforation',
    note: 'The panel arrives, then the date stub slides out a few pixels and the dashed rule draws in behind it. Only makes sense on the ticket layout, and it is the only option that animates what the design actually is.',
  },
  sheen: {
    kind: 'ambient',
    label: 'Sheen — a slow light sweep across the face',
    note: 'A soft diagonal highlight crosses the panel every 7 seconds. Reads as a physical surface catching light. The most noticeable ambient option, and the one most likely to irritate on a long visit.',
  },
  breathe: {
    kind: 'ambient',
    label: 'Breathe — the glow beneath swells and settles',
    note: 'Only the glow under the panel moves, on a 9-second cycle. Nothing inside the panel shifts, so there is nothing to read against. The subtlest thing here that still counts as motion.',
  },
  pulse: {
    kind: 'ambient',
    label: 'Pulse — a ring expands out of the button',
    note: 'A ring leaves the button every 3 seconds and fades. Points at the click rather than decorating the panel, which is the only ambient option that does. Also the most salesy.',
  },
};

// Class applied to the section wrapper; the CSS in tailwind.css keys off it.
export const motionClass = (key) => (key && key !== 'none') ? `cta-motion cta-motion-${key}` : '';

// Arrival options need the observer; ambient ones do not.
export const needsObserver = (key) => ['rise', 'stagger', 'tear'].includes(key);

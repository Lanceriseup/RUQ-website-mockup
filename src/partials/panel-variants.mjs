// Variants of the overlapping panel transition.
//
// The panel works by lifting the following section up over the hero rather
// than cutting a shape out of it, so the knobs are: corner radius, how far it
// overlaps, whether it spans full width or floats inset, and what happens
// along its top edge.
//
// Each returns { hero, next } — extra markup for the bottom of the hero, and
// the classes the following section needs.
export const PANELS = {
  soft: {
    label: 'Soft — small radius, shallow lift',
    note: 'The most restrained. A 20px radius and a 32px overlap, just enough to read as layered rather than stacked. Easy to live with and hard to date.',
    hero: '',
    next: '-mt-8 rounded-t-[1.25rem] relative z-10 shadow-[0_-18px_44px_-26px_rgba(0,0,0,.4)]',
  },
  deep: {
    label: 'Deep — large radius, generous overlap',
    note: 'A 56px radius lifted 80px into the hero. Confident and contemporary; the curve becomes a real shape rather than a rounded corner.',
    hero: '',
    next: '-mt-20 rounded-t-[3.5rem] relative z-10 shadow-[0_-30px_70px_-30px_rgba(0,0,0,.55)]',
  },
  inset: {
    label: 'Inset — a floating card, narrower than the page',
    note: 'The panel pulls in from both sides so the hero shows down its edges. Reads as a card laid on the page rather than the page continuing. The most obviously designed.',
    hero: '',
    next: '-mt-16 mx-4 sm:mx-8 rounded-t-[2.5rem] relative z-10 shadow-[0_-26px_60px_-28px_rgba(0,0,0,.6)]',
  },
  hairline: {
    label: 'Hairline — cyan rule tracing the panel edge',
    note: 'The panel plus a fading cyan line along its top, curving with the corners. Ties the seam to the nav divider and the VSL frame.',
    hero: '',
    next: '-mt-16 rounded-t-[2.5rem] relative z-10 border-t border-cyan/45 shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)]',
  },
  handle: {
    label: 'Handle — a small grabber centred on the edge',
    note: 'A short rounded bar sits on the panel edge, borrowing the language of a sheet being pulled up. Small detail, but it makes the overlap deliberate rather than incidental.',
    hero: '',
    // No before:content-[''] needed — Tailwind's preflight already sets
    // :before{--tw-content:""} and every before:* utility applies
    // content:var(--tw-content), so the pseudo-element renders on its own.
    next: '-mt-16 rounded-t-[2.5rem] relative z-10 shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)] before:absolute before:left-1/2 before:top-4 before:h-1.5 before:w-16 before:-translate-x-1/2 before:rounded-full before:bg-ink/15',
  },
  glow: {
    label: 'Glow — cyan light escaping from beneath the edge',
    note: 'A band of cyan sits under the panel lip so light appears to leak from the join. Picks up the VSL spotlight; the most atmospheric.',
    hero: `<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-36"
                style="background:linear-gradient(to bottom,transparent,rgba(0,185,198,.3))"></div>`,
    next: '-mt-16 rounded-t-[2.5rem] relative z-10 shadow-[0_-24px_60px_-24px_rgba(0,185,198,.5)]',
  },
  layered: {
    label: 'Layered — a second panel peeking out behind',
    note: 'A narrower ghost panel sits just above the real one, so the edge reads as two sheets rather than one. Depth without any shadow doing the work.',
    hero: `<div aria-hidden="true" class="pointer-events-none absolute inset-x-8 bottom-0 h-16 rounded-t-[2rem] bg-white/25 sm:inset-x-16"></div>`,
    next: '-mt-16 rounded-t-[2.5rem] relative z-10 shadow-[0_-26px_60px_-28px_rgba(0,0,0,.55)]',
  },
  asymmetric: {
    label: 'Asymmetric — one corner far rounder than the other',
    note: 'A large radius on the left, a small one on the right. Breaks the symmetry of a centred hero and gives the page a direction.',
    hero: '',
    next: '-mt-16 rounded-tl-[4rem] rounded-tr-[1rem] relative z-10 shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)]',
  },
};

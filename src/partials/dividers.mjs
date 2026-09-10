// Transitions between the dark hero and the white section beneath it.
//
// Right now it is a hard cut: ink stops, white starts. That is not wrong, but
// it is the one edge on the page doing no work.
//
// Each of these sits at the bottom of the hero. Shapes are SVG with
// preserveAspectRatio="none" so they stretch to any width without the curve
// distorting, and they are aria-hidden — a divider is not content.
import { esc } from './layout.mjs';

export const DIVIDERS = {
  hard: {
    label: 'Current — a hard cut',
    note: 'Ink stops, white starts. Honest and modern, but it is the only edge on the page not doing anything.',
  },
  fade: {
    label: 'Fade — the hero dissolves into the section below',
    note: 'A gradient carries the dark down into white over about 160px. The softest option and the least like a device; you notice the absence of an edge rather than a divider.',
  },
  curve: {
    label: 'Curve — the white section rises in a shallow arc',
    note: 'A gentle arc lifts the white up into the hero. Organic and calm, and it suits the brand better than a straight line does.',
  },
  arch: {
    label: 'Arch — a tall rounded arch cut into the white',
    note: 'A cathedral arch rising out of the section below. The most distinctive, and the only one that means something for a faith brand rather than just looking pleasant.',
  },
  wave: {
    label: 'Wave — a soft asymmetric swell',
    note: 'One long, uneven wave. More movement than the curve without tipping into decoration.',
  },
  diagonal: {
    label: 'Diagonal — an angled slice',
    note: 'A shallow angle across the full width. Modern and editorial; it pairs with asymmetric layouts and fights symmetric ones.',
  },
  hairline: {
    label: 'Hairline — a cyan rule at the seam',
    note: 'The hard cut kept, with the same fading cyan rule the nav uses laid on the join. Minimal, and it ties the top and bottom of the page together.',
  },
  glow: {
    label: 'Glow — cyan light bleeding across the join',
    note: 'The seam is lit from behind with the same cyan as the VSL spotlight, so the hero appears to emit light into the section below.',
  },
  panel: {
    label: 'Panel — the white section overlaps as a rounded card',
    note: 'The section below becomes a large rounded panel lifted over the hero. Gives depth, and reads as one continuous page rather than stacked bands.',
  },
};

// White fill so the shape reads as the section below intruding upward.
const FILL = '#ffffff';

export const renderDivider = (key) => {
  switch (key) {
    case 'fade':
      return `<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-40"
                   style="background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,.55) 55%,#fff 100%)"></div>`;

    case 'curve':
      return `<svg aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 block w-full" style="height:90px"
                   viewBox="0 0 1440 90" preserveAspectRatio="none" fill="${FILL}">
                <path d="M0 90 C 360 10, 1080 10, 1440 90 Z"/>
              </svg>`;

    case 'arch':
      return `<svg aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 block w-full" style="height:150px"
                   viewBox="0 0 1440 150" preserveAspectRatio="none" fill="${FILL}">
                <path d="M0 150 L0 150 C 480 150, 520 0, 720 0 C 920 0, 960 150, 1440 150 Z"/>
              </svg>`;

    case 'wave':
      return `<svg aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 block w-full" style="height:110px"
                   viewBox="0 0 1440 110" preserveAspectRatio="none" fill="${FILL}">
                <path d="M0 110 L0 62 C 200 18, 420 96, 700 58 C 980 20, 1220 74, 1440 34 L1440 110 Z"/>
              </svg>`;

    case 'diagonal':
      return `<svg aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 block w-full" style="height:80px"
                   viewBox="0 0 1440 80" preserveAspectRatio="none" fill="${FILL}">
                <path d="M0 80 L1440 6 L1440 80 Z"/>
              </svg>`;

    case 'hairline':
      return `<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                   style="background:linear-gradient(to right,transparent,#00b9c6,transparent)"></div>`;

    case 'glow':
      return `<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-32"
                   style="background:linear-gradient(to bottom,transparent,rgba(0,185,198,.28))"></div>
              <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-px" style="background:#00b9c6"></div>`;

    case 'panel':
      // Handled by the section below lifting over the hero, not by a shape.
      return '';

    default:
      return '';
  }
};

// Classes for the section that follows, since two of these need it to change.
export const nextSectionClass = (key) =>
  key === 'panel' ? '-mt-12 rounded-t-[2.5rem] relative z-10 shadow-[0_-24px_60px_-30px_rgba(0,0,0,.45)]' : '';

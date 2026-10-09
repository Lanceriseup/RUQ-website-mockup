// The five explore pages — Courses, Masterclasses, Events, Coaching, Free
// resource — in three design directions, compared on /explore-options.html.
//
//   couture   editorial magazine: ivory paper, giant brush-script page names,
//             arched photographs, oversized numerals, hairline rules
//   luminous  the Meet the Team / Contact sky, frosted-glass cards, drifting
//             pink and teal light, gradient edges
//   pathway   one hand-drawn line that draws itself down the page and links
//             every step of the journey, with bento photo tiles
//
// Each direction module exports { courses, masterclasses, events, coaching,
// free }, each (site, c, vids) => the page's <main> contents, and has its own
// stylesheet, src/styles/explore/<direction>.css, published as
// /xp-<direction>.css and linked from the page itself (a body-ok <link>), so a
// page pays only for the direction it uses. Copy comes from content.json
// `explore`; shared markup from ./shared.mjs.
import * as couture from './couture.mjs';
import * as luminous from './luminous.mjs';
import * as pathway from './pathway.mjs';
import { renderExplore, EXPLORE_PAGES } from './render.mjs';

export { EXPLORE_PAGES };
export const DIRECTIONS = { couture, luminous, pathway };

export const explorePage = (site, c, vids, page, dir = 'luminous') =>
  renderExplore(DIRECTIONS[dir] ?? DIRECTIONS.luminous, DIRECTIONS[dir] ? dir : 'luminous', site, c, vids, page);

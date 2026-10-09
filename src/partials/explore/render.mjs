// Page wrapper for the explore directions, kept apart from index.mjs so that
// build-explore.mjs can render one direction without importing the others.
import { reviewNote } from './shared.mjs';

export const EXPLORE_PAGES = ['courses', 'masterclasses', 'events', 'coaching', 'free'];

// content.json key for each page's copy (its review notes live there too).
const KEY = { courses: 'courses', masterclasses: 'masterclasses', events: 'events', coaching: 'coaching', free: 'freeResource' };

// Pages that no longer show the "Preview notes" disclosure. Courses dropped
// it on request (2026-10-04); its notes stay in content.json for reference.
const NO_NOTES = new Set(['courses']);

/** One page's <main> contents in direction `dir`, rendered by module `mod`. */
export const renderExplore = (mod, dir, site, c, vids, page) =>
  `<link rel="stylesheet" href="/xp-${dir}.css">
<div data-xp="${page}" class="xp xp-${dir}">${mod[page](site, c, vids)}${NO_NOTES.has(page) ? '' : reviewNote(c.explore[KEY[page]].review, `xp-review-${dir}`)}</div>`;

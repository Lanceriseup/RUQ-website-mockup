// Treatments for the two headings on the team page: "Rise Up Queens Coaches"
// and "Leadership".
//
// Both are client copy and no option changes a word of either. What differs is
// how they are set, and every option treats the two the same way — they are
// peers on the page, and the current build does not treat them as peers: the
// first is left-aligned at display size with a lead paragraph, the second is
// centred and small. That inconsistency is half of what is wrong now.
//
// One asymmetry cannot be designed away. The first heading is four words and
// splits naturally; the second is one word. The script option is the only one
// where that shows, and it is called out there.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';
const CYAN = '#00b9c6';

export const TEAM_HEADINGS = {
  current: {
    label: 'Current — left at the top, centred below',
    note: 'What is there now, for comparison. The two headings are not treated as peers: one is a left-aligned h1 with a lead, the other a small centred h2 with a hairline.',
  },
  script: {
    label: 'Script — the brush face over uppercase',
    note: 'The same construction as the homepage headings: script line with the drawn swash, uppercase Montserrat beneath. Ties the team page to the rest of the site more than any other option. The catch is the second heading — "Leadership" is one word, so it goes entirely into the script with nothing underneath, which reads differently from the first.',
  },
  framed: {
    label: 'Framed — centred, brand rules either side',
    note: 'Short gradient rules flank each heading on one line. Quiet, symmetrical, and it echoes the breakthrough CTA on the homepage. The most neutral option and the easiest to live with on a page that is mostly photographs.',
  },
  underline: {
    label: 'Underline — uppercase over a brand bar',
    note: 'Set in uppercase Montserrat with a short solid brand bar beneath, left-aligned. Reads as a section marker rather than a title, which suits two groups of equal weight.',
  },
  counted: {
    label: 'Counted — the headcount as an eyebrow',
    note: 'A small letter-spaced count above each heading — six and six. The only option that adds information rather than decoration, and it makes the two groups read as equal halves of one team. The numbers come from the data, so they stay right when someone joins.',
  },
  oversized: {
    label: 'Oversized — display scale, tight, with a marker',
    note: 'Both headings at clamp() display size in uppercase with a small brand square ahead of them. Loudest of the six and the only one that competes with the portraits, which on a page this photographic may be the point or may be the problem.',
  },
};

const swash = (colour) => `
<svg aria-hidden="true" class="pointer-events-none absolute left-0 w-full" viewBox="0 0 300 20" fill="none"
     preserveAspectRatio="none" style="bottom:-.02em;height:.28em;overflow:visible">
  <path d="M4 13 C 60 5, 110 4, 158 7 S 250 13, 296 8" stroke="${colour}" stroke-width="3"
        stroke-linecap="round" fill="none" style="vector-effect:non-scaling-stroke"/>
</svg>`;

// tag is h1 for the page's first heading and h2 for the second, so the document
// keeps one h1 whichever treatment is chosen.
export const renderTeamHeading = (key, text, { tag = 'h2', lead = '', colour = MAGENTA, count = 0 } = {}) => {
  const T = tag;
  const leadHtml = lead
    ? `<p class="mt-4 font-body text-lg text-white/60">${esc(lead)}</p>`
    : '';

  if (key === 'script') {
    // Uppercase first, brush face second — the qualifier above, the group it
    // names below. That is the "JOIN US TO EXPERIENCE / healing and renewal"
    // pattern from the homepage rather than the "Common struggles / WOMEN IN
    // MARRIAGE HAVE" one, and it is this way round for a specific reason:
    // script-first would put "RUQ" in the brush face, and an acronym set in a
    // casual brush is close to unreadable. Taking the last word instead gives
    // "RUQ / Coaches" and "LEADERSHIP / Team", which reads for both.
    //
    // If the brush should carry "Leadership" rather than "Team", swap the two
    // lines here — but then the first heading needs its own split, and the two
    // stop being peers, which is the thing this set exists to fix.
    const words = text.trim().split(/\s+/);
    const upper = words.length > 1 ? words.slice(0, -1).join(' ') : '';
    const brush = words[words.length - 1];
    return `
<div class="text-center">
  <${T} class="leading-none">
    ${upper ? `<span class="block font-display text-lg font-bold uppercase tracking-[0.3em] text-white sm:text-xl">${esc(upper)}</span>` : ''}
    <span class="relative mt-2 inline-block">
      <span class="script block" style="color:${colour};font-size:clamp(2.6rem,6.5vw,4.2rem);line-height:.9">${esc(brush)}</span>
      ${swash(colour)}
    </span>
  </${T}>
  ${leadHtml}
</div>`;
  }

  if (key === 'framed') {
    return `
<div class="text-center">
  <div class="flex items-center justify-center gap-5">
    <span aria-hidden="true" class="hidden h-0.5 w-14 shrink-0 rounded-full sm:block"
          style="background:linear-gradient(to right,transparent,${MAGENTA})"></span>
    <${T} class="font-display text-2xl font-bold text-white sm:text-[2.1rem]">${esc(text)}</${T}>
    <span aria-hidden="true" class="hidden h-0.5 w-14 shrink-0 rounded-full sm:block"
          style="background:linear-gradient(to left,transparent,${CYAN})"></span>
  </div>
  ${leadHtml}
</div>`;
  }

  if (key === 'underline') {
    return `
<div>
  <${T} class="font-display text-2xl font-bold uppercase tracking-[0.04em] text-white sm:text-[2.1rem]">${esc(text)}</${T}>
  <span aria-hidden="true" class="mt-4 block h-1 w-20 rounded-full" style="background:linear-gradient(to right,${MAGENTA},${CYAN})"></span>
  ${leadHtml}
</div>`;
  }

  if (key === 'counted') {
    return `
<div>
  <p class="font-body text-[11px] font-bold uppercase tracking-[0.4em]" style="color:${CYAN}">${String(count).padStart(2, '0')} ${count === 1 ? 'person' : 'people'}</p>
  <${T} class="mt-3 font-display text-2xl font-bold text-white sm:text-[2.2rem]">${esc(text)}</${T}>
  <span aria-hidden="true" class="mt-5 block h-px w-full" style="background:linear-gradient(to right,rgba(255,255,255,.25),transparent)"></span>
  ${leadHtml}
</div>`;
  }

  if (key === 'oversized') {
    return `
<div>
  <div class="flex items-start gap-4">
    <span aria-hidden="true" class="mt-[.55em] h-3 w-3 shrink-0 rounded-sm" style="background:${MAGENTA}"></span>
    <${T} class="font-display font-extrabold uppercase leading-[.95] text-white"
         style="font-size:clamp(2rem,5.4vw,3.4rem);letter-spacing:-.01em">${esc(text)}</${T}>
  </div>
  ${leadHtml}
</div>`;
  }

  // current — left-aligned h1 with a lead, small centred h2 without
  if (tag === 'h1') {
    return `
<div class="mx-auto max-w-2xl text-center">
  <h1 class="font-display text-3xl font-bold leading-tight text-white sm:text-[2.7rem]">${esc(text)}</h1>
  ${leadHtml}
</div>`;
  }
  return `
<div class="text-center">
  <h2 class="font-display text-2xl font-bold text-white sm:text-[2rem]">${esc(text)}</h2>
  <span aria-hidden="true" class="mx-auto mt-6 block h-px w-24" style="background:linear-gradient(to right,transparent,${MAGENTA},transparent)"></span>
</div>`;
};

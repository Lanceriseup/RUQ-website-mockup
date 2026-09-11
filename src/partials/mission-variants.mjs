// Treatments for the mission paragraph inside the CTA.
//
// The layout does not change — heading, paragraph, field row. Only the
// paragraph does, because a 391-character block set flat in body grey is the
// plainest thing on the page and it sits directly under the largest heading.
//
// All of these widen the measure so the text runs to roughly three lines
// rather than four. Line count depends on the actual rendered font, so treat
// it as close rather than exact.
//
// Nothing rewrites the copy. Where an option emphasises a phrase it wraps
// words that are already there.
import { esc } from './layout.mjs';

const MAGENTA = '#e8208f';

export const MISSIONS = {
  lead: {
    label: 'Lead sentence — first line carries, rest recedes',
    note: 'The opening sentence is set larger and in ink; the remainder drops to body grey. Gives the block a shape instead of an even wall, and the eye gets an entry point.',
  },
  highlight: {
    label: 'Highlighted phrases — the load-bearing words picked out',
    note: 'Three phrases already in the copy — the unshakable truth of the Gospel, true freedom, and strength, identity, and purpose — take brand colour and weight. Scannable in a second without reading all of it.',
  },
  script: {
    label: 'Script accent — one phrase in the brush face',
    note: '"true freedom" is set in Julietta Messie mid-sentence, tying the paragraph to the headings above. The only option that uses the script outside a heading.',
  },
  serif: {
    label: 'Serif — the whole statement in Cormorant',
    note: 'Set in the same serif as the creed below at a larger size. Reads as a statement of belief rather than supporting copy, and it quietly links the CTA to the section beneath it.',
  },
  ruled: {
    label: 'Ruled — framed by hairlines, wide and airy',
    note: 'Hairline rules above and below with generous leading between. The frame does the work; the type stays plain, which keeps it from competing with the heading.',
  },
  dropcap: {
    label: 'Drop cap — a large initial anchoring the block',
    note: 'A magenta initial in Cormorant anchors the left edge. Editorial and immediately less uniform, though it fights a centred layout slightly.',
  },
};

// Emphasise phrases that already exist in the copy. Never rewrites.
const emphasise = (text, phrases, wrap) => {
  let out = esc(text);
  for (const p of phrases) {
    const e = esc(p);
    out = out.split(e).join(wrap(e));
  }
  return out;
};

export const renderMission = (c, key) => {
  const t = c.home.faith.mission;
  const base = 'mx-auto mt-6 max-w-5xl';

  if (key === 'lead') {
    const [first, ...rest] = t.split(/(?<=\.)\s+/);
    return `
<div class="${base}">
  <p class="font-display text-xl font-semibold leading-snug text-ink sm:text-[1.6rem]">${esc(first)}</p>
  <p class="mt-4 font-body leading-relaxed text-ink-soft">${esc(rest.join(' '))}</p>
</div>`;
  }

  if (key === 'highlight') {
    const html = emphasise(t, [
      'the unshakable truth of the Gospel',
      'true freedom',
      'strength, identity, and purpose',
    ], (s) => `<strong class="font-display font-bold" style="color:${MAGENTA}">${s}</strong>`);
    return `<p class="${base} font-body text-[1.05rem] leading-relaxed text-ink-soft">${html}</p>`;
  }

  if (key === 'script') {
    const html = emphasise(t, ['true freedom'],
      (s) => `<span class="script" style="color:${MAGENTA};font-size:1.45em;line-height:.8">${s}</span>`);
    return `<p class="${base} font-body text-[1.05rem] leading-[1.9] text-ink-soft">${html}</p>`;
  }

  if (key === 'serif') {
    return `<p class="${base} text-[1.35rem] leading-[1.6] text-ink"
               style="font-family:'Cormorant Garamond',serif">${esc(t)}</p>`;
  }

  if (key === 'ruled') {
    return `
<div class="${base}">
  <div aria-hidden="true" class="mx-auto h-px w-full" style="background:linear-gradient(to right,transparent,rgba(28,28,28,.18),transparent)"></div>
  <p class="py-7 font-body text-[1.05rem] leading-[1.9] text-ink-soft">${esc(t)}</p>
  <div aria-hidden="true" class="mx-auto h-px w-full" style="background:linear-gradient(to right,transparent,rgba(28,28,28,.18),transparent)"></div>
</div>`;
  }

  // dropcap — must be left-aligned. A floated initial inside centred text
  // wraps around a ragged left edge and reads as a rendering fault, so this
  // option deliberately breaks the section's centring.
  return `
<p class="${base} text-left font-body text-[1.05rem] leading-relaxed text-ink-soft
          first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[3.75rem]
          first-letter:font-semibold first-letter:leading-[.75] first-letter:text-magenta">${esc(t)}</p>`;
};

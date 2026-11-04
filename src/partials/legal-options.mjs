// The Privacy Policy and Terms and Conditions (asked for 2026-11-05): Rise Up
// Kings' copy word for word, with the RUQ support email (content.json legal,
// src/data/legal/*.html). Four designs for /legal-options.html
// (scripts/build-legal-options.mjs), all light, quiet and in the brand's
// type and colours, because the job here is to be read:
//
//   paper   the text on one white sheet taped to the blush dotted wall of the
//           homepage's Freedom section
//   side    a contents list down the left that follows you as you read,
//           the text beside it (on a phone, a fold-out list at the top)
//   fold    each section a fold-out row with a plus, and "Open all"
//   edit    an open, editorial page: each section numbered in pink in the
//           margin, a fine line between sections
//
// Styles src/styles/legal.css (plain CSS, .lg-*); behaviour legal.js.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from './layout.mjs';

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/legal');
const ARROW_UP = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';

const slug = (t) => t.toLowerCase().replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const text = (h) => h.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();

// The copy, split at its h2s: the intro before the first, then each section
// with an id (the copy's own, #sms, where it has one).
const parse = (file) => {
  const html = fs.readFileSync(path.join(DIR, `${file}.html`), 'utf8');
  const parts = html.split(/(?=<h2\b)/);
  const intro = /^<h2\b/.test(parts[0]) ? '' : parts.shift();
  const seen = new Set();
  const sections = parts.map((p) => {
    const m = p.match(/^<h2([^>]*)>([\s\S]*?)<\/h2>/);
    const title = text(m[2]);
    let id = (m[1].match(/id="([^"]+)"/) || [])[1] || slug(title);
    while (seen.has(id)) id += '-2';
    seen.add(id);
    return { id, title, numbered: /^\d/.test(title), body: p.slice(m[0].length).trim() };
  });
  return { intro: intro.trim(), sections };
};

// Each section's heading, given its id (once, on whichever element carries it).
const h2 = (s, withId = true) => `<h2${withId ? ` id="${s.id}"` : ''}>${esc(s.title)}</h2>`;

export const LEGAL_OPTIONS = ['paper', 'side', 'fold', 'edit'];

export const legalPage = (site, c, which, design = 'paper') => {
  const d = c.legal[which];
  const { intro, sections } = parse(d.file);
  const other = which === 'privacy' ? c.legal.terms : c.legal.privacy;

  // Privacy Policy / Terms and Conditions, the current one marked.
  const sw = `
  <nav class="lg-switch" aria-label="Policies">
    ${[c.legal.privacy, c.legal.terms].map(x => `<a href="${esc(x.href)}"${x === d ? ' aria-current="page"' : ''}>${esc(x.title)}</a>`).join('')}
  </nav>`;
  const head = (align = 'center') => `
  <header class="lg-head lg-head-${align}">${sw}
    <p class="lg-script" aria-hidden="true">${esc(d.script)}</p>
    <h1 class="lg-h1">${esc(d.title)}</h1>
    <p class="lg-up">Last updated ${esc(d.updated)}</p>
  </header>`;
  const all = (withIds = true) => `${intro}${sections.map(s => `\n${h2(s, withIds)}\n${s.body}`).join('')}`;
  const contents = sections.map(s => `<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join('');
  const more = `<p class="lg-more">See also our <a href="${esc(other.href)}">${esc(other.title)}</a>.</p>`;
  const top = `<a class="lg-top" href="#main">${ARROW_UP}<span>Back to top</span></a>`;

  const designs = {
    paper: `
<section class="lg lg-paper">
  <div class="lg-wall" aria-hidden="true"></div>
  <div class="lg-sheet">
    ${head()}
    <div class="lg-prose">${all()}</div>
    ${more}
  </div>
</section>`,

    side: `
<section class="lg lg-side">
  <div class="lg-glow" aria-hidden="true"></div>
  ${head()}
  <div class="lg-grid">
    <aside class="lg-toc">
      <details class="lg-toc-box" data-lg-toc open>
        <summary>On this page</summary>
        <ol>${contents}</ol>
      </details>
    </aside>
    <article class="lg-prose">${all()}${more}</article>
  </div>
</section>`,

    fold: `
<section class="lg lg-fold">
  <div class="lg-glow" aria-hidden="true"></div>
  ${head()}
  <div class="lg-col">
    <div class="lg-prose lg-intro">${intro}</div>
    <div class="lg-folds-bar"><button type="button" class="lg-all" data-lg-all aria-pressed="false">Open all</button></div>
    <div class="lg-folds">${sections.map(s => `
      <details class="lg-fd" id="${s.id}">
        <summary><span>${esc(s.title)}</span><i aria-hidden="true"></i></summary>
        <div class="lg-prose">${s.body}</div>
      </details>`).join('')}
    </div>
    ${more}
  </div>
</section>`,

    edit: `
<section class="lg lg-edit">
  ${head('left')}
  <div class="lg-ed">
    ${intro ? `<div class="lg-ed-row lg-ed-intro"><span class="lg-num" aria-hidden="true"></span><div class="lg-prose">${intro}</div></div>` : ''}
    ${sections.map((s, i) => `
    <section class="lg-ed-row" id="${s.id}" aria-labelledby="${s.id}-h">
      <span class="lg-num" aria-hidden="true">${s.numbered ? esc(s.title.match(/^\d+/)[0].padStart(2, '0')) : String(i + 1).padStart(2, '0')}</span>
      <div class="lg-prose"><h2 id="${s.id}-h">${esc(s.numbered ? s.title.replace(/^\d+\.\s*/, '') : s.title)}</h2>${s.body}</div>
    </section>`).join('')}
    <div class="lg-ed-row"><span class="lg-num" aria-hidden="true"></span><div>${more}</div></div>
  </div>
</section>`,
  };

  return `
<link rel="stylesheet" href="/legal.css">
${designs[design] ?? designs.paper}
${top}
<script src="/legal.js" defer></script>`;
};

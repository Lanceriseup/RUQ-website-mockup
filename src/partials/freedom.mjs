// Freedom — the event introduced between the hero and Common Struggles.
//
// Chosen from /freedom-tune.html:
//   strokes     mirrored — one brush, the same width, pink top right and
//               teal bottom left turned through 180°
//   hand-over   brush ribbon (from /wave-options.html) — the section ends on
//               a soft wave, and a pink-to-teal ribbon, hairline at both
//               edges and full weight across the middle, paints along it
//   copy        brush highlight — a pink stroke paints under each tagline
//               word in turn, and the two key phrases get a teal highlighter
//
// It opens the white panel that lifts over the hero, so the panel's handle
// sits at the top of this section. The wave is filled white because that is
// where the struggles section's own gradient starts.
//
// Styles are .fr-* in tailwind.css; app.js adds .is-in when the section
// scrolls into view. Copy is content.json home.freedom.
import { esc } from './layout.mjs';

// The paragraph's two emphasised phrases. If the copy changes and a phrase is
// no longer found, it simply renders unmarked.
const MARKS = ['turning point', 'clarity, freedom, and a faith that feels alive again'];

const body = (text) => MARKS.reduce((t, m) => t.replace(esc(m), `<mark>${esc(m)}</mark>`), esc(text));

export const freedomSection = (c) => {
  const f = c.home.freedom;
  // "Rise Up Queens presents" → the name (logo alt) and the verb (shown).
  const at = f.eyebrow.lastIndexOf(' ');
  const presenter = at > 0 ? f.eyebrow.slice(0, at) : f.eyebrow;
  const verb = at > 0 ? f.eyebrow.slice(at + 1) : '';
  return `
<section id="freedom" class="fr" data-fr>
  <div class="fr-strokes" aria-hidden="true">
    <img class="fr-st fr-st-p" src="/assets/brand/stroke-hook-lightpink.svg" alt="" loading="lazy" decoding="async">
    <img class="fr-st fr-st-t" src="/assets/brand/stroke-hook-teal.svg" alt="" loading="lazy" decoding="async">
  </div>

  <div class="fr-inner">
    <!-- "Rise Up Queens presents" as a credit: the logo stands in for the
         name, so its alt text carries it, and the last word is set beneath.
         Chosen from /eyebrow-options.html (option C). -->
    <div class="fr-eye fr-credit">
      <img src="/assets/brand/logo-ruq-ink.png" alt="${esc(presenter)}" width="480" height="249" loading="lazy" decoding="async">
      <span>${esc(verb)}</span>
    </div>
    <h2 class="fr-logo"><img src="${esc(f.logo)}" alt="Freedom" width="1500" height="640" loading="lazy" decoding="async"></h2>
    <!-- Each word carries its own highlight, painted on in sequence via --i. -->
    <p class="fr-tag">${f.tagline.map((w, i) =>
      `<span class="fr-w" style="--i:${i}">${esc(w.replace(/\.$/, ''))}<b>.</b></span>`).join(' ')}</p>
    <p class="fr-body">${body(f.body)}</p>
  </div>

  <!-- The hand-over: a white wave the next section continues from, and a
       brush ribbon along its crest. Two SVGs because they reveal differently:
       the fill is always there, the ribbon is uncovered by clip-path on its
       own element. Deliberately not a dash animation (pathLength +
       dasharray): that stopped short of the right edge on wide screens,
       because the SVG stretches non-uniformly and Chrome measured the dash in
       a different space from the path. Clipping the element always covers
       the full width. -->
  <svg class="fr-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 72 C 260 18, 520 18, 760 58 C 1000 98, 1200 112, 1440 46 L1440 120 L0 120 Z" fill="#ffffff"/>
  </svg>
  <svg class="fr-wave fr-ribbon" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="fr-ribbon-g" x1="0" x2="1"><stop offset="0" stop-color="#e8208f"/><stop offset=".5" stop-color="#f0569f"/><stop offset="1" stop-color="#00b9c6"/></linearGradient></defs>
    <path d="M0 72 C 260 11, 520 9, 760 50 C 1000 91, 1200 105, 1440 46 C 1200 119, 1000 106, 760 66 C 520 27, 260 25, 0 72 Z" fill="url(#fr-ribbon-g)"/>
  </svg>
</section>`;
};

// No Longer Bound — an ad-sized banner for the course, below the video
// testimonials. Chosen from /nlb-ad-options.html (A1, "Banner"), which cut
// /nlb-options.html option A ("Unbound") down to ad size.
//
// It is deliberately in No Longer Bound's own palette — gold, cream, sage,
// from the RUQ - NLB project — rather than Rise Up Queens magenta and teal,
// so it reads as a distinct course promoted on this page.
//
// The mark is four layers (src/assets/nlb/mark-*.png: ring + leaf, left
// chain, right chain, fragments). On arrival the chains slide apart and the
// fragments scatter, then "Find Freedom" writes itself in. app.js adds .is-in;
// without it, or under reduced motion, the banner simply shows complete.
//
// Copy is content.json home.nlb. home.nlb.url is a PLACEHOLDER ("#") until
// the course link is supplied. Styles are .nl-* in tailwind.css.
import { esc } from './layout.mjs';

const A = '/assets/nlb/';

export const nlbSection = (c) => {
  const n = c.home.nlb;
  if (!n) return '';
  return `
<section id="nlb" class="nl" data-nl aria-label="No Longer Bound">
  <div class="nl-card">
    <div class="nl-row">
      <div class="nl-mark" role="img" aria-label="No Longer Bound">
        <img class="m-ring" src="${A}mark-ring.png" alt="" loading="lazy" decoding="async">
        <img class="m-left" src="${A}mark-left.png" alt="" loading="lazy" decoding="async">
        <img class="m-right" src="${A}mark-right.png" alt="" loading="lazy" decoding="async">
        <img class="m-bits" src="${A}mark-bits.png" alt="" loading="lazy" decoding="async">
      </div>
      <div class="nl-words">
        <p class="nl-script">${esc(n.script)}</p>
        <h2 class="nl-h">${esc(n.headline)}</h2>
      </div>
      <div class="nl-act">
        <p class="nl-q">${esc(n.question)}</p>
        <a href="${esc(n.url)}" class="nl-btn">
          ${esc(n.cta)}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>`;
};

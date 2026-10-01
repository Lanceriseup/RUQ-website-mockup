// About — closing CTA, "Join us at Freedom".
//
// Chosen from /about-cta2-options.html (E1, "One row"): the dark night panel
// of /about-cta-options.html D2, cut down to a single row. Script and heading
// on the left, the sentence in the middle behind a hairline, the two buttons
// stacked on the right. Below lg it stacks, centred.
//
// It keeps id="closing-about" because the event-lights layer (app.js
// aboutLights) measures its end from this section's top.
//
// Copy is content.json about.closingCta. Register goes to the event;
// about.closingCta.secondaryUrl ("Explore Courses") is a placeholder until the
// link is supplied. Styles are .jc-* in tailwind.css.
import { esc } from './layout.mjs';

export const aboutCta = (site, c) => {
  const k = c.about.closingCta;
  if (!k) return '';
  const h = esc(k.heading);
  const i = h.lastIndexOf(' ');
  const heading = i < 0 ? h : `${h.slice(0, i)} <span class="sheen">${h.slice(i + 1)}</span>`;
  return `
<section id="closing-about" class="jc">
  <div class="jc-panel">
    <img class="jc-bg" src="${esc(site.assets.heroPoster)}" alt="" aria-hidden="true" loading="lazy" decoding="async">
    <div class="jc-in">
      <div>
        <p class="jc-script">${esc(k.script)}</p>
        <h2 class="jc-h">${heading}</h2>
      </div>
      <p class="jc-p">${esc(k.body)}</p>
      <div class="jc-btns">
        <a class="jc-b1" href="${esc(site.nextEvent.ctaUrl)}" rel="noopener">
          ${esc(k.primary)}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <a class="jc-b2" href="${esc(k.secondaryUrl)}">${esc(k.secondary)}</a>
      </div>
    </div>
  </div>
</section>`;
};

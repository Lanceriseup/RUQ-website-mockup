// About — "Who is it for?", below the Jessica Lewis feature.
//
// Chosen: /whofor3-options.html B3 ("Prints and a note") with the note
// animation from /whofor-note-options.html N3 ("Swing and drop").
//
// The statement opens the section. The What-is-RUQ interview (Wistia,
// about.whoForVideo) is the print, with "Who is it for?" on a pink note taped
// to its corner. It swapped places with the RUQ promo, now in the hero, on
// 2026-11-10. (Two event photographs used to fan out behind it; they were
// removed on request 2026-10-30.) It does not autoplay (2026-11-10): "Play
// video" starts it with sound, and while it plays the note swings on its
// tape and drops away. Pause, or let it finish, and the note comes back.
// app.js drives it through Wistia's JS API.
//
// Copy is content.json about.whoFor. Styles are .wh-* in tailwind.css.
import { esc } from './layout.mjs';

// Non-breaking hyphens, so "surface-level" and "Spirit-led" never split.
const nb = (t) => esc(t).replace(/-/g, '‑');

export const whoForSection = (c) => {
  const w = c.about.whoFor;
  if (!w) return '';
  const [s1, s2] = w.statement;
  return `
<section id="whofor" class="wh" data-wh>
  <div class="wh-in">
    <h2 class="wh-st"><span>${nb(s1)}</span> <span class="wh-st-b">${nb(s2)}</span></h2>
    <div class="wh-prints">
      <div class="wh-video" data-wh-video data-wh-wistia="${esc(c.about.whoForVideo)}">
        <div class="wh-wistia wistia_embed wistia_async_${esc(c.about.whoForVideo)} videoFoam=false">&nbsp;</div>
        <button type="button" class="wh-snd">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>
          <span>Play video</span>
        </button>
      </div>
      <div class="wh-note">
        <p class="wh-script">${esc(w.heading)}</p>
        <p class="wh-p">${esc(w.body)}</p>
      </div>
    </div>
  </div>
</section>`;
};

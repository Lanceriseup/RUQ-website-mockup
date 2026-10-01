// About — "Who is it for?", below the Jessica Lewis feature.
//
// Chosen: /whofor3-options.html B3 ("Prints and a note") with the note
// animation from /whofor-note-options.html N3 ("Swing and drop").
//
// The statement opens the section. The RUQ promo is the main print, with two
// real event photographs fanned behind it, and "Who is it for?" on a pink
// note taped to its corner. The promo plays muted and looping while on
// screen; "Tap for sound" unmutes and restarts it, and while it plays with
// sound the note swings on its tape and drops away and the prints slide back.
// Pause, or let it finish, and everything returns the way it left.
//
// Weight: the promo is 8.3 MB. It is preload="none" with no autoplay
// attribute — app.js calls play() only once it is on screen, so nothing is
// fetched for a visitor who never scrolls here. Reduced motion and Save-Data
// get the poster, and the button starts it with sound instead.
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
      <img class="wh-pr wh-p1" src="/assets/photos/queens-waving-booth.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">
      <img class="wh-pr wh-p2" src="/assets/photos/deeper-embrace.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">
      <div class="wh-video" data-wh-video>
        <video muted loop playsinline preload="none" poster="${esc(w.poster)}" aria-label="${esc(w.videoTitle)}">
          <source src="${esc(w.video)}" type="video/mp4">
        </video>
        <button type="button" class="wh-snd">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6"/></svg>
          <span>Tap for sound</span>
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

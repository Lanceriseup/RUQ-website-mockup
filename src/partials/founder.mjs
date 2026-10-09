// Jessica Lewis — the founder feature that opens the about page's journey
// panel. Chosen from /founder-options.html (B, "Magazine cover"), with the
// arch photograph swapped for the cut-out portrait the client supplied.
//
// The cut-out stands in an arched frame filled with a soft teal-to-blush
// gradient, with a pink-to-teal arch offset behind it. Her head breaks out
// above the arch's top: the image is clipped at the bottom and sides of the
// frame only (clip-path with a negative top inset), so the portrait reads as
// stepping out of the frame rather than sitting inside it.
//
// The cut-out (jessica-lewis-cutout.webp) was trimmed from a 4000×6000 PNG,
// its soft background-removal halo tightened, and saved as WebP — it keeps
// the transparency at ~150 KB, and optimize-images.mjs only touches PNG/JPEG,
// so its palette pass (which would band a photograph) never reaches it.
//
// JESSICA in faint outline sits behind everything; the quote is the largest
// type; the signature writes itself in on arrival (app.js adds .is-in).
// Copy is content.json about.founder. Styles are .jl-* in tailwind.css.
import { esc } from './layout.mjs';

// A link from the founder to the Team page, in one of four styles. The About
// page ships 'paired' (B), chosen 2026-10-10 from /founder-team-options.html. null renders none. Styles are .jt-* in
// tailwind.css.
//   pill    filled magenta pill under the signature, like the site's buttons
//   paired  signature and an outlined pill side by side on one line
//   faces   a small card: overlapping team portraits and a line about them
//   link    an uppercase text link with a gradient underline that draws on
const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const teamCta = (c, style) => {
  const href = '/team.html';
  const others = (c.team.members || []).filter(m => m.name !== c.about.founder.name && m.photo);
  if (style === 'pill') return `<a class="jt-pill" href="${href}">Meet the Team ${ARROW}</a>`;
  if (style === 'paired') return `<a class="jt-out" href="${href}">Meet the Team ${ARROW}</a>`;
  if (style === 'faces') return `
      <a class="jt-faces" href="${href}">
        <span class="jt-stack" aria-hidden="true">${others.slice(0, 5).map(m => `<img src="${esc(m.photo)}" alt="" width="44" height="44" loading="lazy" decoding="async">`).join('')}<b>+${Math.max(0, others.length - 5)}</b></span>
        <span class="jt-txt"><b>Meet the Team</b><span>The coaches and leaders who serve beside Jessica</span></span>
        <i class="jt-go" aria-hidden="true">${ARROW}</i>
      </a>`;
  if (style === 'link') return `<a class="jt-link" href="${href}"><span>Meet the women who serve beside her</span> ${ARROW}</a>`;
  return '';
};

export const founderSection = (c, cta = null) => {
  const f = c.about.founder;
  if (!f) return '';
  const sig = `<img class="jl-sig" src="${esc(f.signature)}" alt="Signed, ${esc(f.name)}" width="486" height="179" loading="lazy" decoding="async">`;
  return `
<section id="founder" class="jl" data-jl>
  <span class="jl-wm" aria-hidden="true">${esc(f.name.split(' ')[0])}</span>
  <div class="jl-grid">
    <figure class="jl-arch">
      <span class="jl-ring" aria-hidden="true"></span>
      <span class="jl-fill" aria-hidden="true"></span>
      <span class="jl-clip"><img src="${esc(f.cutout || f.photo)}" alt="${esc(f.name)}, ${esc(f.role)}" width="1300" height="2858" loading="lazy" decoding="async"></span>
    </figure>
    <div class="jl-copy">
      <p class="jl-script">${esc(f.eyebrow)}</p>
      <h2 class="jl-name">${esc(f.name)}</h2>
      <p class="jl-role">${esc(f.role)}</p>
      <p class="jl-p">${esc(f.intro)}</p>
      <blockquote class="jl-q"><span class="jl-qm" aria-hidden="true">“</span>${esc(f.quote)}</blockquote>
      <p class="jl-p">${esc(f.body)}</p>
      ${cta === 'paired' ? `<div class="jt-row">${sig}${teamCta(c, cta)}</div>` : `${sig}${teamCta(c, cta)}`}
    </div>
  </div>
</section>`;
};

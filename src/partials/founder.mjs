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

export const founderSection = (c) => {
  const f = c.about.founder;
  if (!f) return '';
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
      <img class="jl-sig" src="${esc(f.signature)}" alt="Signed, ${esc(f.name)}" width="486" height="179" loading="lazy" decoding="async">
    </div>
  </div>
</section>`;
};

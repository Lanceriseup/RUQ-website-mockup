// R3 — Split screen. A focused, boutique checkout: on the left an event
// photograph that holds still while the event's details glide over it on
// frosted glass; on the right a calm checkout with a numbered step line.
// Phones: the photo becomes a hero band, then the details, then the checkout.
//
// Design only: the form posts nowhere, and the card fields are display-only
// boxes standing in for the processor's hosted card frame.
import { esc, ICON, rv } from '../explore/shared.mjs';

const CHECK = '<svg class="rgs-tick" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
const CARD = '<svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true"><rect x=".75" y=".75" width="20.5" height="14.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M1 5h20" stroke="currentColor" stroke-width="2"/><path d="M4.5 11h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
const CROWN = '<svg width="20" height="16" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true"><path d="M2 4.5 7 9l5-7 5 7 5-4.5L20 15H4L2 4.5zM4 16.2h16V18H4z"/></svg>';
const DETAIL_IC = {
  location: ICON.pin,
  included: ICON.gift,
  travel: '<svg class="xp-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-5h6v5M9 11h.01M15 11h.01"/></svg>',
  attendance: ICON.cal,
};

// The practical blurbs, in the order they sit: two side by side, then Hotel.
const PRAC = ['included', 'attendance', 'travel'];

const field = (f, id) => {
  const fid = `rgs-${id}-${f.name}`;
  const req = !['street2'].includes(f.name) && f.type !== 'select';
  const control = f.type === 'select'
    ? `<span class="rgs-selwrap"><select id="${fid}" name="${esc(f.name)}" autocomplete="${esc(f.autocomplete)}" class="rgs-input rgs-select">
         <option value="">Select ${esc(f.label.toLowerCase())}</option>
       </select></span>`
    : `<input id="${fid}" name="${esc(f.name)}" type="${esc(f.type)}" autocomplete="${esc(f.autocomplete)}" class="rgs-input"${req ? ' required' : ''}${f.type === 'email' ? ' inputmode="email" spellcheck="false"' : ''}>`;
  return `
        <div class="rgs-field${f.half ? ' rgs-half' : ''}">
          <label for="${fid}" class="rgs-label">${esc(f.label)}${f.name === 'street2' ? '<span class="rgs-opt"> (optional)</span>' : ''}</label>
          ${control}
        </div>`;
};

const step = (n, title, body, extra = '') => `
      <li class="rgs-step" ${rv(n * 40)}>
        <div class="rgs-rail" aria-hidden="true"><span class="rgs-num"><span class="rgs-n">${n}</span>${CHECK}</span></div>
        <div class="rgs-stepbody">
          <div class="rgs-stephead">
            <p class="rgs-steplbl">Step ${n}</p>
            <h2 class="rgs-h2">${esc(title)}</h2>
            ${extra}
          </div>
          ${body}
        </div>
      </li>`;

// `exp` places "What you'll experience" (2026-11-05, the client asked for it
// above the What's included, Attendance and Hotel blurbs; options at
// /register-exp-options.html):
//   last     where it was: after every detail card
//   up       the same card, moved up under Location
//   open     moved up and out of its card: on the photograph itself
//   pillars  moved up as three tiles side by side
//   know     moved up, and the three blurbs gathered into one "Good to
//            know" card under it
// The page is set in Lato throughout (rgs-t-all, T4 of
// /register-type-options.html, chosen 2026-11-05).
export const register = (site, c, { exp = 'last' } = {}) => {
  const r = c.register;
  const f = r.form;
  const [first] = r.dates;
  const byKey = Object.fromEntries(r.details.map(d => [d.key, d]));

  // Location card body per date — only what exists for each.
  const locBody = (d) => d.venue
    ? `<p class="rgs-strong">${esc(d.venue)}</p>
           <p>${esc(d.address)}</p>
           ${d.arrival ? `<p class="rgs-muted">${esc(d.arrival)}</p>` : ''}`
    : `<p class="rgs-strong">${esc(d.city)}</p>`;

  const detailCard = (d) => {
    const body = d.key === 'location'
      ? r.dates.map((dt, i) => `<div data-rgs-for="${esc(dt.key)}"${i ? ' hidden' : ''}>${locBody(dt)}</div>`).join('')
      : `<p>${esc(d.body)}</p>${d.note ? `<p class="rgs-note">${esc(d.note)}</p>` : ''}`;
    return `
          <div class="rgs-glass rgs-detail" ${rv(60)}>
            <span class="rgs-dic">${DETAIL_IC[d.key] || ''}</span>
            <div>
              <h3 class="rgs-h3">${esc(d.label)}</h3>
              ${body}
            </div>
          </div>`;
  };

  const ROMAN = ['i', 'ii', 'iii'];
  const items = r.experience.items;
  const expCard = () => `
        <div class="rgs-glass rgs-exp" ${rv(60)}>
          <h2 class="rgs-exph">${esc(r.experience.heading)}</h2>
          <ol class="rgs-explist">
            ${items.map((it, i) => `
            <li><span class="rgs-expn" aria-hidden="true">${ROMAN[i]}</span><div><h3 class="rgs-h3">${esc(it.title)}</h3><p>${esc(it.body)}</p></div></li>`).join('')}
          </ol>
        </div>`;
  // open: no card, on the photograph
  const expOpen = () => `
        <div class="rgs-exp-open" ${rv(60)}>
          <h2 class="rgs-exph">${esc(r.experience.heading)}</h2>
          <ol class="rgs-explist">
            ${items.map((it, i) => `
            <li><span class="rgs-expn" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><h3 class="rgs-h3">${esc(it.title)}</h3><p>${esc(it.body)}</p></div></li>`).join('')}
          </ol>
        </div>`;
  // pillars: three tiles side by side
  const expPillars = () => `
        <div class="rgs-exp-pil" ${rv(60)}>
          <h2 class="rgs-exph">${esc(r.experience.heading)}</h2>
          <ol class="rgs-pils">
            ${items.map((it, i) => `
            <li class="rgs-glass rgs-pil"><span class="rgs-piln" aria-hidden="true">${i + 1}</span><h3 class="rgs-h3">${esc(it.title)}</h3><p>${esc(it.body)}</p></li>`).join('')}
          </ol>
        </div>`;
  // know: the three practical blurbs as rows of one card
  const knowCard = () => `
        <div class="rgs-glass rgs-know" ${rv(60)}>
          <p class="rgs-knowk">Good to know</p>
          ${PRAC.map(k => byKey[k]).filter(Boolean).map(d => `
          <div class="rgs-knowrow">
            <span class="rgs-dic">${DETAIL_IC[d.key] || ''}</span>
            <div><h3 class="rgs-h3">${esc(d.label)}</h3><p>${esc(d.body)}</p>${d.note ? `<p class="rgs-note">${esc(d.note)}</p>` : ''}</div>
          </div>`).join('')}
        </div>`;

  return `<link rel="stylesheet" href="/xp-reg-split.css">
<section class="rg-spl rgs-t-all${exp === 'last' ? '' : ` rgs-e-${exp}`}" aria-labelledby="rgs-title">
  <div class="rgs-grid">

    <!-- LEFT · the event, on glass over a still photograph -->
    <div class="rgs-left">
      <div class="rgs-photo" aria-hidden="true">
        <img src="/assets/photos/journey-selfie.jpg" alt="" width="1200" height="1600" fetchpriority="high" decoding="async">
        <span class="rgs-scrim"></span>
      </div>
      <div class="rgs-flow">
        <header class="rgs-hero">
          <img class="rgs-logo" src="/assets/brand/freedom-logo-white.png" alt="Freedom" width="1500" height="640">
          <p class="rgs-eyebrow">${esc(r.eyebrow)}</p>
          <h1 id="rgs-title" class="rgs-h1">${esc(r.title)}</h1>

          <div class="rgs-glass rgs-datecard">
            <fieldset class="rgs-dates">
              <legend class="rgs-legend">${esc(r.selectLabel)}</legend>
              <div class="rgs-pills">
                ${r.dates.map((d, i) => `
                <label class="rgs-pill">
                  <input type="radio" name="rgs-date" value="${esc(d.key)}"${i ? '' : ' checked'}>
                  <span class="rgs-pilltxt"><span class="rgs-pillmain">${esc(d.label)}</span><span class="rgs-pillsub">${esc(d.city)}</span></span>
                </label>`).join('')}
              </div>
            </fieldset>
            ${r.dates.map((d, i) => `
            <div class="rgs-when" data-rgs-for="${esc(d.key)}"${i ? ' hidden' : ''}>
              <p class="rgs-script">${esc(d.label)}</p>
              <p class="rgs-meta"><span class="rgs-mi">${ICON.pin}<span>${esc(d.city)}</span></span>${d.days ? `<span class="rgs-mi">${ICON.clock}<span>${esc(d.days)}</span></span>` : ''}</p>
            </div>`).join('')}
            <!-- One countdown per date, each shown with its date (since
                 2026-11-05: the second date had none). countdown.js runs them all. -->
            ${r.dates.filter(d => d.startsAt).map((d) => `
            <div class="rgs-cd" data-rgs-for="${esc(d.key)}"${d.key === first.key ? '' : ' hidden'} data-countdown="${esc(d.startsAt)}" aria-label="Time until the event begins">
              ${['days', 'hours', 'minutes', 'seconds'].map(u => `
              <div class="rgs-cdbox"><span class="rgs-cdn cd-${u}">00</span><span class="rgs-cdu">${u === 'minutes' ? 'mins' : u === 'seconds' ? 'secs' : u}</span></div>`).join('')}
            </div>`).join('')}
          </div>
        </header>

        ${exp === 'last' ? `
        <div class="rgs-details">
          ${r.details.map(detailCard).join('')}
        </div>
${expCard()}` : `
        <div class="rgs-details rgs-details-loc">
          ${r.details.filter(d => d.key === 'location').map(detailCard).join('')}
        </div>
${exp === 'open' ? expOpen() : exp === 'pillars' ? expPillars() : expCard()}
${exp === 'know' ? knowCard() : `
        <div class="rgs-details rgs-details-prac">
          ${PRAC.map(k => byKey[k]).filter(Boolean).map(detailCard).join('')}
        </div>`}`}
      </div>
    </div>

    <!-- RIGHT · the checkout -->
    <div class="rgs-right">
      <div class="rgs-summary" ${rv(0)}>
        <span class="rgs-crown">${CROWN}</span>
        <div class="rgs-sumtxt">
          <p class="rgs-sumtitle">${esc(f.event.label)}</p>
          <p class="rgs-sumdate">${r.dates.map((d, i) => `<span data-rgs-for="${esc(d.key)}"${i ? ' hidden' : ''}>${esc(d.label)} · ${esc(d.city)}</span>`).join('')}</p>
        </div>
        <p class="rgs-sumamt">${esc(f.total.amount)}</p>
      </div>

      <form class="rgs-form" action="#" onsubmit="return false">
        <ol class="rgs-steps">
          ${step(1, f.contact.heading, `
          <div class="rgs-fields">${f.contact.fields.map(x => field(x, 'c')).join('')}
          </div>`)}

          ${step(2, f.payment.heading, `
          <div class="rgs-paybox">
            <div class="rgs-fields">
              ${f.payment.fields.map((label, i) => `
              <div class="rgs-field${i ? ' rgs-third' : ' rgs-full'}">
                <span class="rgs-label">${esc(label)}</span>
                <span class="rgs-input rgs-fake">${i ? '' : `<span class="rgs-cardic">${CARD}</span>`}</span>
              </div>`).join('')}
            </div>
          </div>`, `<p class="rgs-badge">${ICON.lock}<span>${esc(f.payment.secure)}</span></p>`)}

          ${step(3, f.billing.heading, `
          <div class="rgs-fields">${f.billing.fields.map(x => field(x, 'b')).join('')}
          </div>`)}

          ${step(4, f.event.heading, `
          <div class="rgs-fields">
            <div class="rgs-field rgs-full">
              <label for="rgs-event" class="rgs-label">${esc(f.event.label)}</label>
              <span class="rgs-selwrap"><select id="rgs-event" name="event" class="rgs-input rgs-select" required>
                <option value="">${esc(r.selectLabel)}</option>
                ${r.dates.map((d, i) => `<option value="${esc(d.key)}"${i ? '' : ' selected'}>${esc(d.label)} · ${esc(d.city)}</option>`).join('')}
              </select></span>
            </div>
          </div>`)}

          ${step(5, 'Review & pay', `
          <div class="rgs-review">
            <div class="rgs-coupon">
              <label for="rgs-coupon" class="rgs-label">${esc(f.coupon.label)}</label>
              <div class="rgs-couprow">
                <input id="rgs-coupon" name="coupon" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" class="rgs-input">
                <button type="button" class="rgs-apply">${esc(f.coupon.button)}</button>
              </div>
            </div>
            <div class="rgs-line">
              <span>${esc(f.event.label)}<span class="rgs-linesub">${r.dates.map((d, i) => `<span data-rgs-for="${esc(d.key)}"${i ? ' hidden' : ''}>${esc(d.label)}</span>`).join('')}</span></span>
              <span>${esc(f.total.amount)}</span>
            </div>
            <div class="rgs-total">
              <span class="rgs-totlbl">${esc(f.total.label)}</span>
              <span class="rgs-totamt">${esc(f.total.amount)}</span>
            </div>
            <button type="submit" class="rgs-submit"><span>${esc(f.submit)}</span>${ICON.arrow}</button>
            <p class="rgs-secure">${ICON.lock}<span>${esc(f.secureNote)}</span></p>
          </div>`)}
        </ol>
      </form>

      <p class="rgs-help">${esc(r.help.text)} <a href="mailto:${esc(r.help.email)}">${esc(r.help.email)}</a>.</p>
    </div>
  </div>
</section>
<script>
(function(){
  var root=document.querySelector('.rg-spl'); if(!root) return;
  var radios=root.querySelectorAll('input[name="rgs-date"]'), sel=root.querySelector('#rgs-event');
  function show(k){
    root.querySelectorAll('[data-rgs-for]').forEach(function(el){ el.hidden = el.getAttribute('data-rgs-for')!==k; });
    radios.forEach(function(r){ r.checked = r.value===k; });
    if(sel && sel.value!==k) sel.value=k;
  }
  radios.forEach(function(r){ r.addEventListener('change',function(){ if(r.checked) show(r.value); }); });
  if(sel) sel.addEventListener('change',function(){ if(sel.value) show(sel.value); });
})();
</script>`;
};

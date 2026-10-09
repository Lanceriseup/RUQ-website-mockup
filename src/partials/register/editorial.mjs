// R4 — Editorial. A magazine-feature registration page: a Freedom masthead on
// ivory, a cinematic photo band carrying a live countdown, the two dates as
// large editorial tabs, then the details set like a feature article beside a
// sticky deep-ink checkout card.
//
// Design only: the form posts nowhere, and the card fields are display-only
// boxes standing in for the processor's hosted card frame.
import { esc, ICON, rv, countdown } from '../explore/shared.mjs';

const pad = (n) => String(n).padStart(2, '0');

export const register = (site, c) => {
  const r = c.register;
  const f = r.form;
  const dates = r.dates;
  const first = dates[0];
  const det = Object.fromEntries(r.details.map(d => [d.key, d]));
  const sel = (key, i) => (i === 0 ? '' : ' hidden');

  // ---- date tabs
  const tabs = dates.map((d, i) => `
      <button type="button" class="rge-tab" data-rge-tab="${esc(d.key)}" aria-pressed="${i === 0}">
        <span class="rge-tab-no" aria-hidden="true">${pad(i + 1)}</span>
        <span class="rge-tab-date">${esc(d.label)}</span>
        <span class="rge-tab-city">${ICON.pin}${esc(d.city)}</span>
        <span class="rge-tab-sel" aria-hidden="true">Selected</span>
      </button>`).join('');

  // ---- the feature's dateline (one per date; the unselected is hidden)
  const datelines = dates.map((d, i) => `
      <div class="rge-dateline" data-rge-for="${esc(d.key)}"${sel(d.key, i)}>
        <p class="rge-big-date">${esc(d.label)}</p>
        <p class="rge-dl-meta"><span>${ICON.pin}${esc(d.city)}</span>${d.days ? `<span>${ICON.clock}${esc(d.days)}</span>` : ''}</p>
      </div>`).join('');

  // ---- Location: only what exists for each date
  const locations = dates.map((d, i) => `
        <div class="rge-loc" data-rge-for="${esc(d.key)}"${sel(d.key, i)}>
          ${d.venue ? `<p class="rge-venue">${esc(d.venue)}</p>` : ''}
          ${d.address ? `<p class="rge-addr">${esc(d.address)}</p>` : `<p class="rge-venue">${esc(d.city)}</p>`}
          ${d.arrival ? `<p class="rge-arrival">${ICON.cal}<span>${esc(d.arrival)}</span></p>` : ''}
        </div>`).join('');

  const section = (d, inner, extra = '') => `
      <section class="rge-sec${extra}" ${rv()} aria-labelledby="rge-h-${esc(d.key)}">
        <h2 class="rge-label" id="rge-h-${esc(d.key)}"><span>${esc(d.label)}</span></h2>
        <div class="rge-sec-body">${inner}</div>
      </section>`;

  const details = [
    section(det.location, locations),
    section(det.included, `<p class="rge-drop">${esc(det.included.body)}</p>`),
    section(det.travel, `<p>${esc(det.travel.body)}</p><p class="rge-aside">${esc(det.travel.note)}</p>`),
    section(det.attendance, `<p>${esc(det.attendance.body)}</p>`),
  ].join('');

  const experience = r.experience.items.map((it, i) => `
        <li class="rge-exp-item" ${rv(i * 90)}>
          <span class="rge-exp-no" aria-hidden="true">${pad(i + 1)}</span>
          <div><h3 class="rge-exp-t">${esc(it.title)}</h3><p class="rge-exp-b">${esc(it.body)}</p></div>
        </li>`).join('');

  // ---- checkout
  const field = (x, idp = 'rge') => {
    const id = `${idp}-${x.name}`;
    const half = x.half ? ' rge-half' : '';
    const req = x.name !== 'street2';
    const label = `<label class="rge-flabel" for="${esc(id)}">${esc(x.label)}${req ? '' : ' <span class="rge-opt">(optional)</span>'}</label>`;
    if (x.type === 'select') {
      return `<div class="rge-field${half}">${label}
            <div class="rge-select"><select id="${esc(id)}" name="${esc(x.name)}" autocomplete="${esc(x.autocomplete)}" class="rge-input" required>
              <option value="" selected disabled>Select ${esc(x.label.toLowerCase())}</option>
            </select></div></div>`;
    }
    return `<div class="rge-field${half}">${label}
            <input id="${esc(id)}" name="${esc(x.name)}" type="${esc(x.type)}" autocomplete="${esc(x.autocomplete)}" class="rge-input"${req ? ' required' : ''}></div>`;
  };

  const step = (n, title, inner, extraHead = '') => `
        <fieldset class="rge-step">
          <legend class="rge-step-h"><span class="rge-step-n" aria-hidden="true">${pad(n)}</span>${esc(title)}</legend>
          ${extraHead}
          <div class="rge-grid">${inner}</div>
        </fieldset>`;

  const pay = f.payment.fields.map((p, i) => `
            <div class="rge-field rge-pay-${i}"><span class="rge-fake" role="img" aria-label="${esc(p)}">${i === 0 ? ICON.lock : ''}<span>${esc(p)}</span></span></div>`).join('');

  const summaries = dates.map((d, i) => `
          <div class="rge-sum" data-rge-for="${esc(d.key)}"${sel(d.key, i)}>
            <p class="rge-sum-k">Selected</p>
            <p class="rge-sum-date">${esc(d.label)}</p>
            <p class="rge-sum-city">${esc(d.city)}${d.venue ? ` · ${esc(d.venue)}` : ''}</p>
          </div>`).join('');

  const card = `
    <aside class="rge-card-wrap" aria-labelledby="rge-card-h">
      <div class="rge-card" data-rge-card>
        <div class="rge-card-top">
          <h2 class="rge-card-h" id="rge-card-h">${esc(f.event.label)}</h2>
          ${summaries}
          <p class="rge-sum-amt" aria-hidden="true">${esc(f.total.amount)}</p>
        </div>
        <form class="rge-form" action="#" onsubmit="return false">
          ${step(1, f.contact.heading, f.contact.fields.map(x => field(x)).join(''))}
          ${step(2, f.payment.heading, pay, `<p class="rge-secure">${ICON.lock}<span>${esc(f.payment.secure)}</span></p>`)}
          ${step(3, f.billing.heading, f.billing.fields.map(x => field(x)).join(''))}
          ${step(4, f.event.heading, `
            <div class="rge-field"><label class="rge-flabel" for="rge-event">${esc(f.event.label)}</label>
              <div class="rge-select"><select id="rge-event" name="event" class="rge-input" required data-rge-select>
                <option value="" disabled>${esc(r.selectLabel)}</option>
                ${dates.map((d, i) => `<option value="${esc(d.key)}"${i === 0 ? ' selected' : ''}>${esc(d.label)} · ${esc(d.city)}</option>`).join('')}
              </select></div></div>
            <div class="rge-field rge-coupon"><label class="rge-flabel" for="rge-coupon">${esc(f.coupon.label)} <span class="rge-opt">(optional)</span></label>
              <div class="rge-coupon-row"><input id="rge-coupon" name="coupon" type="text" autocomplete="off" class="rge-input">
                <button type="button" class="rge-apply">${esc(f.coupon.button)}</button></div></div>`)}
          <div class="rge-total">
            <span class="rge-total-l">${esc(f.total.label)}</span>
            <span class="rge-total-a">${esc(f.total.amount)}</span>
          </div>
          <button type="submit" class="rge-submit"><span>${esc(f.submit)}</span>${ICON.arrow}</button>
          <p class="rge-note">${ICON.lock}<span>${esc(f.secureNote)}</span></p>
        </form>
        <p class="rge-help">${esc(r.help.text)} <a href="mailto:${esc(r.help.email)}">${esc(r.help.email)}</a>.</p>
      </div>
    </aside>`;

  return `<link rel="stylesheet" href="/xp-reg-editorial.css">
<div class="rg-edi" data-rge>
  <header class="rge-mast">
    <div class="rge-mast-in">
      <p class="rge-eyebrow" ${rv()}><span>${esc(r.eyebrow)}</span></p>
      <img class="rge-logo" src="/assets/brand/freedom-logo.png" alt="Freedom" width="1500" height="640" fetchpriority="high" ${rv(80)}>
      <h1 class="rge-title" ${rv(160)}>${esc(r.title)}</h1>
    </div>
  </header>

  <section class="rge-cine" aria-label="Countdown">
    <img class="rge-cine-img" src="/assets/photos/queens-waving.jpg" alt="A room full of women at a Rise Up Queens event, cheering and waving" width="1600" height="900" decoding="async" fetchpriority="high">
    <div class="rge-cine-in">
      <p class="rge-cd-k"><span>${esc(first.label)}</span><span>${esc(first.city)}</span></p>
      ${countdown(first.startsAt, { wrap: 'rge-cd', box: 'rge-cd-box', n: 'rge-cd-n', u: 'rge-cd-u' })}
    </div>
  </section>

  <div class="rge-tabs-wrap">
    <p class="rge-tabs-k" id="rge-tabs-k">${esc(r.selectLabel)}</p>
    <div class="rge-tabs" role="group" aria-labelledby="rge-tabs-k">${tabs}
    </div>
  </div>

  <div class="rge-body">
    <article class="rge-feature">
      ${datelines}
      ${details}
      <section class="rge-exp" aria-labelledby="rge-exp-h">
        <figure class="rge-fig" ${rv()}><img src="/assets/photos/close-group.jpg" alt="" width="1600" height="1073" loading="lazy" decoding="async"></figure>
        <h2 class="rge-exp-h" id="rge-exp-h" ${rv()}>${esc(r.experience.heading)}</h2>
        <ol class="rge-exp-list">${experience}
        </ol>
      </section>
    </article>
    ${card}
  </div>
</div>
<script>
(function(){
  var root=document.querySelector('[data-rge]'); if(!root) return;
  var tabs=[].slice.call(root.querySelectorAll('[data-rge-tab]'));
  var blocks=[].slice.call(root.querySelectorAll('[data-rge-for]'));
  var select=root.querySelector('[data-rge-select]');
  function pick(key){
    tabs.forEach(function(t){t.setAttribute('aria-pressed', String(t.dataset.rgeTab===key));});
    blocks.forEach(function(b){b.hidden=b.dataset.rgeFor!==key;});
    if(select && select.value!==key) select.value=key;
    fit();
  }
  tabs.forEach(function(t){t.addEventListener('click',function(){pick(t.dataset.rgeTab);});});
  if(select) select.addEventListener('change',function(){ if(select.value) pick(select.value); });
  // Sticky card taller than the window: let it scroll through, then hold its
  // bottom edge in view instead of hiding the button below the fold.
  var card=root.querySelector('[data-rge-card]');
  function fit(){
    if(!card) return;
    var top=Math.min(88, window.innerHeight-card.offsetHeight-24);
    card.style.setProperty('--rge-top', top+'px');
  }
  fit(); addEventListener('resize',fit);
  if('ResizeObserver' in window) new ResizeObserver(fit).observe(card);
})();
</script>`;
};

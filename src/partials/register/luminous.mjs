// R1 — Luminous: the Freedom registration page on the Courses page's sky.
//
// The sky photograph runs up behind the clear nav and fades into a blush
// ground with drifting magenta and teal light. The Freedom logo writes itself
// in over a soft halo; below, two columns from 1024px: the date choice as
// glass cards (the chosen one wears a slowly turning pink-to-teal ring), the
// big script date with a live countdown, the details with line icons and the
// experience cards floating over a group photograph — beside a frosted-glass
// checkout card with numbered sections, a glowing total and the magenta
// button. The checkout card follows the page down and, when it is taller than
// the window, settles so its total and button stay in view.
//
// Copy: content.json `register` only. Styles: src/styles/explore/reg-luminous.css
// (every class .rgl-*, every rule scoped under .rg-lum). Card fields are
// display-only boxes: live card entry happens in the processor's hosted frame.
import { esc, ICON, rv } from '../explore/shared.mjs';

const LAZY = 'loading="lazy" decoding="async"';

// Line icons for the detail sections (24px grid, 1.6 stroke).
const ic = (d) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const DETAIL_ICON = {
  location: ic('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  included: ic('<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5S10.5 4 8 4.5 7 8.5 12 8.5zM12 8.5S13.5 4 16 4.5 17 8.5 12 8.5z"/>'),
  travel: ic('<path d="M10.5 13.5 3 11l1.5-1.5 8 .5 4-4.5c1-1 2.6-1.3 3.2-.7.6.6.3 2.2-.7 3.2l-4.5 4 .5 8L13.5 21 11 13.5"/><path d="M6.5 17.5 4 20M8 16l-3 .5"/>'),
  attendance: ic('<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>'),
};

const LOCK = ICON.lock;
const CHECK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

// "October 15–17, 2026" -> month in the script, the rest in the sans.
const splitDate = (label) => {
  const i = String(label).indexOf(' ');
  return i < 0 ? [label, ''] : [label.slice(0, i), label.slice(i + 1)];
};

// A block shown only while its date is chosen (October first, without JS).
const forDate = (d, i, html, tag = 'div', cls = '') =>
  `<${tag} class="rgl-for ${cls}" data-rgl-for="${esc(d.key)}"${i ? ' hidden' : ''}>${html}</${tag}>`;

const field = (f, id) => {
  const fid = `${id}-${f.name}`;
  const req = f.req !== false;
  const label = `<label class="rgl-label" for="${esc(fid)}">${esc(f.label)}${req ? '<span class="rgl-req" aria-hidden="true">*</span>' : ''}</label>`;
  if (f.type === 'select') {
    const ph = `Select ${String(f.label).toLowerCase()}`;
    return `<div class="rgl-field${f.half ? ' rgl-half' : ''}">${label}
      <span class="rgl-selwrap"><select id="${esc(fid)}" name="${esc(f.name)}" autocomplete="${esc(f.autocomplete || 'off')}" class="rgl-input rgl-select"${req ? ' required' : ''}>
        <option value="" selected disabled>${esc(ph)}</option>
      </select></span></div>`;
  }
  return `<div class="rgl-field${f.half ? ' rgl-half' : ''}">${label}
    <input id="${esc(fid)}" name="${esc(f.name)}" type="${esc(f.type)}" autocomplete="${esc(f.autocomplete || 'off')}" class="rgl-input"${req ? ' required' : ''}${f.type === 'tel' ? ' inputmode="tel"' : ''}${f.type === 'email' ? ' inputmode="email"' : ''}>
  </div>`;
};

const step = (n, heading, body, extra = '') => `
  <fieldset class="rgl-step">
    <legend class="rgl-step-h"><span class="rgl-step-n" aria-hidden="true">${n}</span><span class="rgl-sr">Step ${n}: </span>${esc(heading)}</legend>
    ${extra}
    ${body}
  </fieldset>`;

export const register = (site, c) => {
  const r = c.register;
  const f = r.form;
  const dates = r.dates;
  const detail = Object.fromEntries(r.details.map(d => [d.key, d]));

  // ---------------------------------------------------------------- hero
  const heroWhen = dates.map((d, i) => forDate(d, i, `
      <span class="rgl-when-i">${ICON.cal}${esc(d.label)}</span>
      <span class="rgl-when-dot" aria-hidden="true"></span>
      <span class="rgl-when-i">${ICON.pin}${esc(d.city)}</span>`, 'p', 'rgl-when')).join('');

  const hero = `
  <header class="rgl-hero">
    <p class="rgl-eyebrow"><span class="rgl-dot" aria-hidden="true"></span>${esc(r.eyebrow)}</p>
    <h1 class="rgl-h1">
      <span class="rgl-logo">
        <span class="rgl-halo" aria-hidden="true"></span>
        <img src="/assets/brand/freedom-logo.png" alt="Freedom" width="1500" height="640" decoding="async" fetchpriority="high">
      </span>
      <span class="rgl-title">${esc(r.title)}</span>
    </h1>
    <div class="rgl-whenwrap" aria-live="polite">${heroWhen}</div>
  </header>`;

  // ---------------------------------------------------------------- date cards
  const cards = `
  <fieldset class="rgl-pick" ${rv()}>
    <legend class="rgl-kicker">${esc(r.selectLabel)}</legend>
    <div class="rgl-cards">
      ${dates.map((d, i) => {
        const [month, rest] = splitDate(d.label);
        return `
      <label class="rgl-card">
        <input type="radio" name="rgl-date" value="${esc(d.key)}" data-rgl-pick${i === 0 ? ' checked' : ''}>
        <span class="rgl-card-in">
          <span class="rgl-card-top">
            <span class="rgl-card-month">${esc(month)}</span>
            <span class="rgl-card-tick" aria-hidden="true">${CHECK}</span>
          </span>
          <span class="rgl-card-date">${esc(rest)}</span>
          <span class="rgl-card-city">${ICON.pin}${esc(d.city)}</span>
          ${d.days ? `<span class="rgl-card-days">${esc(d.days)}</span>` : ''}
          <span class="rgl-card-sel" aria-hidden="true">Selected</span>
        </span>
      </label>`;
      }).join('')}
    </div>
  </fieldset>`;

  // ---------------------------------------------------------------- big date + countdown
  const bigDate = dates.map((d, i) => {
    const [month, rest] = splitDate(d.label);
    return forDate(d, i, `
      <p class="rgl-big"><span class="rgl-big-script">${esc(month)}</span><span class="rgl-big-rest">${esc(rest)}</span></p>
      <p class="rgl-big-meta">${d.days ? `<span>${ICON.clock}${esc(d.days)}</span>` : ''}<span>${ICON.pin}${esc(d.venue ? `${d.venue}, ${d.city}` : d.city)}</span></p>`, 'div', 'rgl-bigwrap');
  }).join('');

  const cd = `
  <div class="rgl-cd" data-rgl-cd="${esc(dates[0].startsAt)}" aria-label="Time until the event begins">
    ${['days', 'hours', 'mins', 'secs'].map(u => `<span class="rgl-cd-box"><b class="rgl-cd-n" data-u="${u}">00</b><span class="rgl-cd-u">${u}</span></span>`).join('')}
  </div>`;

  // ---------------------------------------------------------------- details
  const locBody = dates.map((d, i) => forDate(d, i, d.venue ? `
      <p class="rgl-strong">${esc(d.venue)}</p>
      <p>${esc(d.address)}</p>
      ${d.arrival ? `<p class="rgl-muted">${esc(d.arrival)}</p>` : ''}` : `
      <p class="rgl-strong">${esc(d.city)}</p>`)).join('');

  const row = (d, body) => `
    <li class="rgl-row">
      <span class="rgl-row-ic">${DETAIL_ICON[d.key] || ''}</span>
      <div class="rgl-row-body">
        <h3 class="rgl-row-h">${esc(d.label)}</h3>
        ${body}
      </div>
    </li>`;

  const details = `
  <section class="rgl-glass rgl-details" aria-label="Event details" ${rv()}>
    <ul class="rgl-rows">
      ${row(detail.location, locBody)}
      ${row(detail.included, `<p>${esc(detail.included.body)}</p>`)}
      ${row(detail.travel, `<p>${esc(detail.travel.body)}</p><p class="rgl-note">${esc(detail.travel.note)}</p>`)}
      ${row(detail.attendance, `<p>${esc(detail.attendance.body)}</p>`)}
    </ul>
  </section>`;

  // ---------------------------------------------------------------- experience
  const exp = `
  <section class="rgl-exp" aria-labelledby="rgl-exp-h">
    <div class="rgl-exp-head" ${rv()}>
      <h2 class="rgl-h2" id="rgl-exp-h">${esc(r.experience.heading)}</h2>
      <svg class="rgl-swash" viewBox="0 0 300 22" aria-hidden="true" focusable="false"><path d="M4 14 C 60 6, 110 5, 158 8 S 250 14, 296 9" stroke="url(#rgl-grad)" stroke-width="3" stroke-linecap="round" fill="none"/></svg>
    </div>
    <div class="rgl-exp-body">
    <div class="rgl-exp-photo" ${rv()}>
      <img src="/assets/photos/journey-cheer.jpg" alt="A woman wearing a crown raises both arms in celebration at a Rise Up Queens event" ${LAZY}>
    </div>
    <ol class="rgl-exp-list">
      ${r.experience.items.map((it, i) => `
      <li class="rgl-glass rgl-exp-card" ${rv(i * 90)}>
        <span class="rgl-exp-n" aria-hidden="true">0${i + 1}</span>
        <h3 class="rgl-exp-t">${esc(it.title)}</h3>
        <p class="rgl-exp-b">${esc(it.body)}</p>
      </li>`).join('')}
    </ol>
    </div>
  </section>`;

  // ---------------------------------------------------------------- checkout
  const id = 'rgl';
  const contactFields = f.contact.fields.map(x => field({ ...x, req: x.name !== 'phone' }, id)).join('');
  const billingFields = f.billing.fields.map(x => field({ ...x, req: x.name !== 'street2' }, id)).join('');

  const fakeHint = ['•••• •••• •••• ••••', '•••', 'MM', 'YYYY'];
  const fakeCls = ['rgl-pay-num', 'rgl-pay-cvc', 'rgl-pay-mm', 'rgl-pay-yy'];
  const payment = `
    <div class="rgl-pay">
      ${f.payment.fields.map((label, i) => `
      <div class="rgl-field ${fakeCls[i]}">
        <span class="rgl-label" id="${id}-pay-${i}">${esc(label)}</span>
        <div class="rgl-input rgl-fake" role="group" aria-labelledby="${id}-pay-${i}"><span aria-hidden="true">${fakeHint[i]}</span>${i === 0 ? '<span class="rgl-fake-card" aria-hidden="true"><i></i><i></i></span>' : ''}</div>
      </div>`).join('')}
    </div>`;

  const summary = dates.map((d, i) => forDate(d, i, `${esc(d.label)} · ${esc(d.city)}`, 'p', 'rgl-co-when')).join('');

  const checkout = `
  <aside class="rgl-aside" id="rgl-checkout" aria-label="Checkout">
    <div class="rgl-glass rgl-co">
      <div class="rgl-co-head">
        <span class="rgl-admit">Admit one</span>
        <p class="rgl-co-title">${esc(r.title)}</p>
        <div aria-live="polite">${summary}</div>
      </div>
      <form class="rgl-form" action="#" onsubmit="return false">
        ${step(1, f.contact.heading, `<div class="rgl-grid">${contactFields}</div>`)}
        ${step(2, f.payment.heading, payment, `<p class="rgl-secure">${LOCK}<span>${esc(f.payment.secure)}</span></p>`)}
        ${step(3, f.billing.heading, `<div class="rgl-grid">${billingFields}</div>`)}
        ${step(4, f.event.heading, `
          <div class="rgl-field">
            <label class="rgl-label" for="${id}-event">${esc(f.event.label)}<span class="rgl-req" aria-hidden="true">*</span></label>
            <span class="rgl-selwrap"><select id="${id}-event" name="event" class="rgl-input rgl-select" data-rgl-event required>
              <option value="" disabled>${esc(r.selectLabel)}</option>
              ${dates.map((d, i) => `<option value="${esc(d.key)}"${i === 0 ? ' selected' : ''}>${esc(d.label)} · ${esc(d.city)}</option>`).join('')}
            </select></span>
          </div>`)}
        ${step(5, f.coupon.label, `
          <div class="rgl-coupon">
            <label class="rgl-sr" for="${id}-coupon">${esc(f.coupon.label)}</label>
            <input id="${id}-coupon" name="coupon" type="text" autocomplete="off" autocapitalize="characters" class="rgl-input">
            <button type="button" class="rgl-apply">${esc(f.coupon.button)}</button>
          </div>
          <div class="rgl-total">
            <span class="rgl-total-l">${esc(f.total.label)}</span>
            <span class="rgl-total-a">${esc(f.total.amount)}</span>
          </div>`)}
        <button type="submit" class="rgl-submit"><span>${esc(f.submit)}</span>${ICON.arrow}</button>
        <p class="rgl-safe">${LOCK}<span>${esc(f.secureNote)}</span></p>
      </form>
    </div>
    <p class="rgl-help">${esc(r.help.text)} <a href="mailto:${esc(r.help.email)}">${esc(r.help.email)}</a>.</p>
  </aside>`;

  // ---------------------------------------------------------------- page
  return `<link rel="stylesheet" href="/xp-reg-luminous.css">
<div class="rg-lum">
  <svg class="rgl-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="rgl-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8208f"/><stop offset=".55" stop-color="#f06aa8"/><stop offset="1" stop-color="#00b9c6"/></linearGradient>
  </defs></svg>
  <div class="rgl-sky" aria-hidden="true">
    <picture>
      <source media="(max-width: 639px)" srcset="/assets/photos/sky-tall.jpg">
      <img src="/assets/photos/sky-wide.jpg" alt="" decoding="async" fetchpriority="high">
    </picture>
  </div>
  <div class="rgl-orbs" aria-hidden="true">
    <span class="rgl-orb rgl-orb-m1"></span><span class="rgl-orb rgl-orb-t1"></span>
    <span class="rgl-orb rgl-orb-m2"></span><span class="rgl-orb rgl-orb-t2"></span>
  </div>
  <div class="rgl-in">
    ${hero}
    <div class="rgl-wrap rgl-layout">
      <div class="rgl-main">
        ${cards}
        <div class="rgl-dateblock" ${rv()}>
          <div aria-live="polite">${bigDate}</div>
          ${cd}
        </div>
        ${details}
        ${exp}
      </div>
      ${checkout}
    </div>
  </div>
</div>
<script>
(function(){
  var root=document.querySelector('.rg-lum'); if(!root) return;
  var starts=${JSON.stringify(Object.fromEntries(dates.map(d => [d.key, d.startsAt])))};
  var radios=[].slice.call(root.querySelectorAll('[data-rgl-pick]'));
  var sel=root.querySelector('[data-rgl-event]');
  var cd=root.querySelector('[data-rgl-cd]');
  function show(key){
    [].forEach.call(root.querySelectorAll('[data-rgl-for]'),function(el){el.hidden=el.getAttribute('data-rgl-for')!==key;});
    radios.forEach(function(r){r.checked=r.value===key;});
    if(sel&&key) sel.value=key;
    if(cd&&starts[key]){cd.setAttribute('data-rgl-cd',starts[key]);tick();}
  }
  radios.forEach(function(r){r.addEventListener('change',function(){if(r.checked)show(r.value);});});
  if(sel) sel.addEventListener('change',function(){if(sel.value)show(sel.value);});
  function pad(n){return (n<10?'0':'')+n;}
  function tick(){
    if(!cd) return;
    var ms=new Date(cd.getAttribute('data-rgl-cd'))-Date.now();
    cd.hidden=!(ms>0); if(!(ms>0)) return;
    var s=Math.floor(ms/1000),v={days:Math.floor(s/86400),hours:Math.floor(s%86400/3600),mins:Math.floor(s%3600/60),secs:s%60};
    [].forEach.call(cd.querySelectorAll('[data-u]'),function(b){var u=b.getAttribute('data-u');b.textContent=u==='days'?v[u]:pad(v[u]);});
  }
  tick(); setInterval(tick,1000);
  // The checkout card follows the page; when it is taller than the window it
  // settles with its bottom (total and button) in view instead.
  var aside=root.querySelector('.rgl-aside');
  function fit(){ if(!aside) return; aside.style.top=Math.min(88,window.innerHeight-aside.offsetHeight-24)+'px'; }
  window.addEventListener('resize',fit); if(window.ResizeObserver) new ResizeObserver(fit).observe(aside); fit();
})();
</script>`;
};

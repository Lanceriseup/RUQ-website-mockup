// R2 — The ticket. The Freedom event as a ticket the visitor is about to own:
// a large art-directed ticket with a perforated stub that follows the chosen
// date, then the details beside a checkout styled as the counterfoil.
//
// Design only: the form posts nowhere, and the card fields are display-only
// boxes standing in for the processor's hosted card frame.
import { esc, ICON, rv } from '../explore/shared.mjs';

const I = {
  suitcase: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5v2M3.5 12.5h17"/></svg>',
  days: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4"/></svg>',
  card: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6 15h4"/></svg>',
  chev: '<svg class="rgt-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
};

// "October 15–17, 2026" → { main: "October 15–17", year: "2026", month: "October", nums: "15–17" }
const split = (label) => {
  const [main, year = ''] = String(label).split(/,\s*/);
  const m = main.match(/^(\S+)\s+(.*)$/) || [main, main, ''];
  return { main, year, month: m[1], nums: m[2] };
};

export const register = (site, c) => {
  const r = c.register;
  const f = r.form;
  const d0 = r.dates[0];
  const s0 = split(d0.label);
  const det = Object.fromEntries(r.details.map(d => [d.key, d]));
  const data = r.dates.map(d => ({ key: d.key, label: d.label, city: d.city, days: d.days || '', venue: d.venue || '', address: d.address || '', arrival: d.arrival || '', ...split(d.label) }));

  const field = (x, id = 'rgt') => {
    const fid = `${id}-${x.name}`;
    const req = !/street2/.test(x.name);
    const lab = `<label class="rgt-label" for="${fid}">${esc(x.label)}${req ? '' : ' <span class="rgt-opt">(optional)</span>'}</label>`;
    const ctl = x.type === 'select'
      ? `<span class="rgt-sel">${''}<select id="${fid}" name="${esc(x.name)}" autocomplete="${esc(x.autocomplete)}" class="rgt-input" ${req ? 'required' : ''}><option value="">Select ${esc(x.label.toLowerCase())}</option></select>${I.chev}</span>`
      : `<input id="${fid}" name="${esc(x.name)}" type="${esc(x.type)}" autocomplete="${esc(x.autocomplete)}" class="rgt-input" ${req ? 'required' : ''}>`;
    return `<div class="rgt-field${x.half ? ' rgt-half' : ''}">${lab}${ctl}</div>`;
  };

  const legend = (n, t, extra = '') => `<legend class="rgt-legend"><span class="rgt-num" aria-hidden="true">${n}</span><span>${esc(t)}</span>${extra}</legend>`;

  const tabs = r.dates.map((d, i) => {
    const s = split(d.label);
    return `
      <label class="rgt-tab">
        <input type="radio" name="rgt-date" value="${esc(d.key)}" ${i === 0 ? 'checked' : ''} class="rgt-tab-in">
        <span class="rgt-tab-card">
          <span class="rgt-tab-mo">${esc(s.month)}</span>
          <span class="rgt-tab-n">${esc(s.nums)}<span class="rgt-tab-y">${esc(s.year)}</span></span>
          <span class="rgt-tab-city">${ICON.pin}${esc(d.city)}</span>
          <span class="rgt-tab-sel" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>Selected</span>
        </span>
      </label>`;
  }).join('');

  const barcode = `<svg class="rgt-bar" viewBox="0 0 120 34" preserveAspectRatio="none" aria-hidden="true">${
    [3,1,2,1,1,3,1,2,2,1,3,1,1,2,1,3,2,1,1,2,3,1,2,1,1,3,1,1,2,2,1,3,1,2,1,1].reduce((acc, w, i) => {
      if (i % 2 === 0) acc.s += `<rect x="${acc.x}" y="0" width="${w * 1.2}" height="34"/>`;
      acc.x += w * 1.2 + 0.6; return acc;
    }, { x: 0, s: '' }).s}</svg>`;

  return `<link rel="stylesheet" href="/xp-reg-ticket.css">
<div class="rg-tkt" data-rgt>
  <section class="rgt-hero" aria-labelledby="rgt-h1">
    <div class="rgt-glow" aria-hidden="true"></div>
    <div class="rgt-wrap">
      <header class="rgt-head" ${rv()}>
        <p class="rgt-eyebrow">${esc(r.eyebrow)}</p>
        <h1 id="rgt-h1" class="rgt-h1">${esc(r.title)}</h1>
      </header>

      <fieldset class="rgt-tabs" ${rv(120)}>
        <legend class="rgt-tabs-lg">${esc(r.selectLabel)}</legend>
        <div class="rgt-tabs-row">${tabs}</div>
      </fieldset>

      <div class="rgt-stage" ${rv(220)}>
        <article class="rgt-ticket" data-rgt-ticket aria-label="Your Freedom ticket" aria-live="polite">
          <div class="rgt-photo">
            <img src="/assets/photos/journey-cheer.jpg" alt="A queen in a crown cheering with both arms raised at a Rise Up Queens event" width="900" height="1200" decoding="async" fetchpriority="high">
            <span class="rgt-photo-tag">Admit one</span>
          </div>
          <div class="rgt-body">
            <div class="rgt-body-top">
              <img class="rgt-logo" src="/assets/brand/freedom-logo.png" alt="Freedom" width="1500" height="640" decoding="async">
              
            </div>
            <p class="rgt-kind">${esc(r.title)}</p>
            <p class="rgt-date"><span data-tk="main">${esc(s0.main)}</span><span class="rgt-year" data-tk="year">${esc(s0.year)}</span></p>
            <dl class="rgt-meta">
              <div><dt>Where</dt><dd><strong data-tk="city">${esc(d0.city)}</strong><span data-tk="venue" ${d0.venue ? '' : 'hidden'}>${esc(d0.venue || '')}</span></dd></div>
              <div data-tk-wrap="days" ${d0.days ? '' : 'hidden'}><dt>When</dt><dd data-tk="days">${esc(d0.days || '')}</dd></div>
            </dl>
          </div>
          <div class="rgt-perf" aria-hidden="true"></div>
          <div class="rgt-stub">
            <p class="rgt-stub-k">Admit one</p>
            <p class="rgt-stub-mo" data-tk="month">${esc(s0.month)}</p>
            <p class="rgt-stub-n" data-tk="nums">${esc(s0.nums)}</p>
            <p class="rgt-stub-y" data-tk="year">${esc(s0.year)}</p>
            <p class="rgt-stub-city" data-tk="city">${esc(d0.city)}</p>
            <p class="rgt-stub-price"><span class="rgt-stub-pl">${esc(f.total.label)}</span>${esc(f.total.amount)}</p>
            ${barcode}
          </div>
          <span class="rgt-sheen" aria-hidden="true"></span>
        </article>
        <div class="rgt-shadow" aria-hidden="true"></div>
      </div>

      <p class="rgt-jump" ${rv(320)}><a href="#rgt-checkout" class="rgt-jump-a">${esc(f.submit)}${ICON.arrow}</a></p>
    </div>
  </section>

  <section class="rgt-main" aria-label="Event details and checkout">
    <div class="rgt-wrap rgt-grid">
      <div class="rgt-info">
        <ul class="rgt-details">
          <li class="rgt-det" ${rv()}>
            <span class="rgt-det-ic">${ICON.pin}</span>
            <div>
              <h2 class="rgt-det-h">${esc(det.location.label)}</h2>
              <p class="rgt-det-strong"><span data-tk="venue" ${d0.venue ? '' : 'hidden'}>${esc(d0.venue || '')}</span><span data-tk-wrap="novenue" ${d0.venue ? 'hidden' : ''}><span data-tk="city">${esc(d0.city)}</span></span></p>
              <p class="rgt-det-p" data-tk="address" ${d0.address ? '' : 'hidden'}>${esc(d0.address || '')}</p>
              <p class="rgt-det-p" data-tk="days" ${d0.days ? '' : 'hidden'}>${esc(d0.days || '')}</p>
              <p class="rgt-det-note" data-tk="arrival" ${d0.arrival ? '' : 'hidden'}>${esc(d0.arrival || '')}</p>
            </div>
          </li>
          <li class="rgt-det" ${rv(60)}>
            <span class="rgt-det-ic">${ICON.gift}</span>
            <div><h2 class="rgt-det-h">${esc(det.included.label)}</h2><p class="rgt-det-p">${esc(det.included.body)}</p></div>
          </li>
          <li class="rgt-det" ${rv(120)}>
            <span class="rgt-det-ic">${I.suitcase}</span>
            <div><h2 class="rgt-det-h">${esc(det.travel.label)}</h2><p class="rgt-det-p">${esc(det.travel.body)}</p><p class="rgt-det-note">${esc(det.travel.note)}</p></div>
          </li>
          <li class="rgt-det" ${rv(180)}>
            <span class="rgt-det-ic">${I.days}</span>
            <div><h2 class="rgt-det-h">${esc(det.attendance.label)}</h2><p class="rgt-det-p">${esc(det.attendance.body)}</p></div>
          </li>
        </ul>

        <div class="rgt-exp" ${rv()}>
          <img class="rgt-exp-crown" src="/assets/brand/crown-magenta.png" alt="" width="120" height="80" loading="lazy" decoding="async">
          <h2 class="rgt-exp-h">${esc(r.experience.heading)}</h2>
          <ol class="rgt-exp-list">
            ${r.experience.items.map((it, i) => `
            <li class="rgt-exp-item"><span class="rgt-exp-n" aria-hidden="true">0${i + 1}</span><div><h3 class="rgt-exp-t">${esc(it.title)}</h3><p class="rgt-exp-p">${esc(it.body)}</p></div></li>`).join('')}
          </ol>
          <figure class="rgt-exp-photos" aria-hidden="true">
            <img src="/assets/photos/close-laugh.jpg" alt="" loading="lazy" decoding="async">
            <img src="/assets/photos/journey-selfie.jpg" alt="" loading="lazy" decoding="async">
            <img src="/assets/photos/deeper-embrace.jpg" alt="" loading="lazy" decoding="async">
          </figure>
        </div>
      </div>

      <div class="rgt-foil" id="rgt-checkout">
        <div class="rgt-foil-head">
          <div>
            <p class="rgt-foil-k">Admit one · Selected</p>
            <p class="rgt-foil-date"><span data-tk="label">${esc(d0.label)}</span></p>
            <p class="rgt-foil-city">${ICON.pin}<span data-tk="city">${esc(d0.city)}</span></p>
          </div>
          <img class="rgt-foil-logo" src="/assets/brand/freedom-logo.png" alt="" width="1500" height="640" loading="lazy" decoding="async">
        </div>
        <div class="rgt-foil-perf" aria-hidden="true"></div>

        <form class="rgt-form" action="#" onsubmit="return false" aria-label="Registration">
          <fieldset class="rgt-fs">
            ${legend('01', f.contact.heading)}
            <div class="rgt-fgrid">${f.contact.fields.map(x => field({ ...x, half: x.half || true })).join('')}</div>
          </fieldset>

          <fieldset class="rgt-fs">
            ${legend('02', f.payment.heading, `<span class="rgt-secure">${ICON.lock}${esc(f.payment.secure)}</span>`)}
            <div class="rgt-pay">
              ${f.payment.fields.map((p, i) => `
              <div class="rgt-field rgt-pf rgt-pf-${i}">
                <span class="rgt-label" aria-hidden="true">${esc(p)}</span>
                <span class="rgt-input rgt-ph" aria-hidden="true">${i === 0 ? I.card : ''}</span>
              </div>`).join('')}
            </div>
          </fieldset>

          <fieldset class="rgt-fs">
            ${legend('03', f.billing.heading)}
            <div class="rgt-fgrid">${f.billing.fields.map(x => field(x)).join('')}</div>
          </fieldset>

          <fieldset class="rgt-fs">
            ${legend('04', f.event.heading)}
            <div class="rgt-field">
              <label class="rgt-label" for="rgt-event">${esc(f.event.label)}</label>
              <span class="rgt-sel"><select id="rgt-event" name="event" class="rgt-input" required data-rgt-event>
                <option value="">${esc(r.selectLabel)}</option>
                ${r.dates.map((d, i) => `<option value="${esc(d.key)}" ${i === 0 ? 'selected' : ''}>${esc(d.label)} · ${esc(d.city)}</option>`).join('')}
              </select>${I.chev}</span>
            </div>
          </fieldset>

          <fieldset class="rgt-fs rgt-fs-coupon">
            ${legend('05', f.coupon.label)}
            <div class="rgt-coupon">
              <label class="rgt-label rgt-sr" for="rgt-coupon">${esc(f.coupon.label)}</label>
              <input id="rgt-coupon" name="coupon" type="text" autocomplete="off" class="rgt-input">
              <button type="button" class="rgt-apply">${esc(f.coupon.button)}</button>
            </div>
          </fieldset>

          <div class="rgt-total">
            <div class="rgt-total-row">
              <span class="rgt-total-l">${esc(f.total.label)}<span class="rgt-total-sub" data-tk="label">${esc(d0.label)}</span></span>
              <span class="rgt-total-a">${esc(f.total.amount)}</span>
            </div>
            <button type="submit" class="rgt-submit"><span>${esc(f.submit)}</span>${ICON.arrow}</button>
            <p class="rgt-snote">${ICON.lock}<span>${esc(f.secureNote)}</span></p>
          </div>
        </form>
        <p class="rgt-help">${esc(r.help.text)} <a href="mailto:${esc(r.help.email)}">${esc(r.help.email)}</a>.</p>
      </div>
    </div>
  </section>
  <script type="application/json" id="rgt-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
  <script>
  (function () {
    var root = document.querySelector('[data-rgt]'); if (!root) return;
    var data = JSON.parse(document.getElementById('rgt-data').textContent);
    var ticket = root.querySelector('[data-rgt-ticket]');
    var sel = root.querySelector('[data-rgt-event]');
    var radios = [].slice.call(root.querySelectorAll('input[name="rgt-date"]'));
    function apply(key, from) {
      var d = data.filter(function (x) { return x.key === key; })[0]; if (!d) return;
      root.querySelectorAll('[data-tk]').forEach(function (el) {
        var v = d[el.getAttribute('data-tk')] || '';
        el.textContent = v; el.hidden = !v;
      });
      root.querySelectorAll('[data-tk-wrap]').forEach(function (el) {
        var k = el.getAttribute('data-tk-wrap');
        el.hidden = k === 'novenue' ? !!d.venue : !d[k];
      });
      if (from !== 'select' && sel) sel.value = key;
      if (from !== 'radio') radios.forEach(function (r) { r.checked = r.value === key; });
      if (ticket && from) { ticket.classList.remove('is-swap'); void ticket.offsetWidth; ticket.classList.add('is-swap'); }
    }
    radios.forEach(function (r) { r.addEventListener('change', function () { if (r.checked) apply(r.value, 'radio'); }); });
    if (sel) sel.addEventListener('change', function () { if (sel.value) apply(sel.value, 'select'); });
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (ticket && fine && !still) {
      ticket.addEventListener('pointermove', function (e) {
        var b = ticket.getBoundingClientRect();
        var x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
        ticket.style.setProperty('--ry', ((x - .5) * 7).toFixed(2) + 'deg');
        ticket.style.setProperty('--rx', ((.5 - y) * 6).toFixed(2) + 'deg');
        ticket.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        ticket.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        ticket.classList.add('is-tilt');
      });
      ticket.addEventListener('pointerleave', function () {
        ticket.classList.remove('is-tilt');
        ticket.style.removeProperty('--rx'); ticket.style.removeProperty('--ry');
      });
    }
  })();
  </script>
</div>`;
};

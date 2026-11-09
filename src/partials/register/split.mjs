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
//   none     left out (the live page since 2026-11-10, Lance's ask)
// The page is set in Lato throughout (rgs-t-all, T4 of
// /register-type-options.html, chosen 2026-11-05).
export const register = (site, c, { exp = 'last', prac = 'cards' } = {}) => {
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
      : `${d.lead ? `<p class="rgs-strong">${esc(d.lead)}</p>` : ''}<p>${esc(d.body)}</p>${d.note ? `<p class="rgs-note">${esc(d.note)}</p>` : ''}`;
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

  // ── `prac`: how Location, What's included, Attendance and Hotel & travel
  // are laid out (2026-11-10, options at /register-prac-options.html):
  //   cards    the four glass cards as they were
  //   glance   one itinerary card (venue, the three days, hours), the
  //            inclusions as three tiles, travel with airport chips
  //   bento    a fitted grid: venue over a drawn map, the hours as large
  //            numerals, the inclusions as a checklist, travel across
  //   ticket   a cream admission ticket with a tear-off stub, the fine
  //            print on glass under it
  //   path     one card, the details as stops on a glowing line
  const loc = byKey.location, inc = byKey.included, att = byKey.attendance, tr = byKey.travel;
  const hrsM = ((att && att.lead) || '').match(/(\d{1,2}\s?[ap]m)\s*[–-]\s*(\d{1,2}\s?[ap]m)/i);
  const hrs = hrsM ? { from: hrsM[1], to: hrsM[2] } : null;
  const TZ = 'America/Chicago';
  const days = (d) => {
    const s = new Date(d.startsAt);
    return [0, 1, 2].map(i => {
      const t = new Date(s.getTime() + i * 864e5);
      return {
        wd: t.toLocaleDateString('en-US', { weekday: 'short', timeZone: TZ }),
        mo: t.toLocaleDateString('en-US', { month: 'short', timeZone: TZ }),
        dn: t.toLocaleDateString('en-US', { day: 'numeric', timeZone: TZ }),
      };
    });
  };
  const span = (d) => { const x = days(d); return `${x[0].wd} – ${x[2].wd}`; };
  const perDate = (fn, cls = '') => r.dates.map((dt, i) =>
    `<div${cls ? ` class="${cls}"` : ''} data-rgs-for="${esc(dt.key)}"${i ? ' hidden' : ''}>${fn(dt)}</div>`).join('');
  const maps = (d) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.venue}, ${d.address}`)}`;
  const dirLink = (d, cls = 'rgs-dir') => d.venue
    ? `<a class="${cls}" href="${esc(maps(d))}" target="_blank" rel="noopener">Directions${ICON.out}</a>` : '';
  const venue = (d) => d.venue
    ? `<p class="rgs-pv">${esc(d.venue)}</p><p class="rgs-pa">${esc(d.address)}</p>`
    : `<p class="rgs-pv">${esc(d.city)}</p>`;
  const INC_IC = [
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M19 11a7 7 0 0 1-14 0M12 18v3"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h13"/><path d="M9 7h6"/></svg>',
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3v8a2 2 0 0 1-2 2M3 3v8a2 2 0 0 0 2 2v8M5 3v8M17 21V3c-2.2 0-4 2.7-4 7s1.8 4 4 4"/></svg>',
  ];
  const PLANE = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>';
  const TICK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  const INFO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5v.01"/></svg>';
  const hrsTxt = hrs ? `${hrs.from} – ${hrs.to}` : '';
  const airports = (cls = 'rgs-air') => tr && tr.airports ? `
            <div class="${cls}"><span class="rgs-airk">Closest airports</span>${tr.airports.map(a => `<span class="rgs-chip">${PLANE}${esc(a)}</span>`).join('')}</div>` : '';
  const incItems = (inc && inc.items) || [];

  const pracGlance = () => `
        <div class="rgs-glass rgs-gl" ${rv(60)}>
          <div class="rgs-gl-loc">
            <span class="rgs-dic">${DETAIL_IC.location}</span>
            <div class="rgs-gl-v"><h3 class="rgs-k">${esc(loc.label)}</h3>${perDate(venue)}</div>
            ${perDate((d) => dirLink(d), 'rgs-gl-dirw')}
          </div>
          <div class="rgs-gl-sched">
            <h3 class="rgs-k">${esc(att.label)}</h3>
            ${perDate((d) => days(d).map((x, i) => `
              <div class="rgs-day"><span class="rgs-dayn">Day ${i + 1}</span><span class="rgs-daywd">${esc(x.wd)}</span><span class="rgs-daydn">${esc(x.mo)} ${esc(x.dn)}</span><span class="rgs-dayt">${esc(hrsTxt)}</span></div>`).join(''), 'rgs-gl-days')}
            <p class="rgs-gl-att">${INFO}<span>${esc(att.body)}</span></p>
          </div>
        </div>
        <div class="rgs-glass rgs-gl-inc" ${rv(60)}>
          <h3 class="rgs-k">${esc(inc.label)}</h3>
          <ul class="rgs-incs">
            ${incItems.map((x, i) => `<li><span class="rgs-incic">${INC_IC[i] || ''}</span><span class="rgs-incl">${esc(x.label)}</span>${x.sub ? `<span class="rgs-incs-sub">${esc(x.sub)}</span>` : ''}</li>`).join('')}
          </ul>
          <p class="rgs-gl-incp">${esc(inc.body)}</p>
        </div>
        <div class="rgs-glass rgs-detail rgs-gl-tr" ${rv(60)}>
          <span class="rgs-dic">${DETAIL_IC.travel}</span>
          <div>
            <h3 class="rgs-h3">${esc(tr.label)}</h3>
            <p>${esc(tr.body)}</p>
            ${airports()}
            <p class="rgs-fine">${esc(tr.fine)}</p>
          </div>
        </div>`;

  const MAP = `<svg class="rgs-map" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="none" stroke-linecap="round">
              <path d="M-10 150 C 80 140, 160 170, 250 120 S 380 60, 420 70" stroke-width="10" class="rgs-map-hw"/>
              <path d="M300 -10 C 290 60, 310 140, 280 240" stroke-width="7" class="rgs-map-hw"/>
              <path d="M-10 60 L 420 40 M-10 105 L 420 95 M-10 200 L 420 185 M60 -10 L 80 240 M140 -10 L 150 240 M210 -10 L 215 240 M360 -10 L 350 240" stroke-width="1.4" class="rgs-map-st"/>
              <path d="M210 95 L 300 92" stroke-width="3" class="rgs-map-rt"/>
            </g></svg>`;
  const pracBento = () => `
        <div class="rgs-bn" ${rv(60)}>
          <div class="rgs-glass rgs-bn-loc">
            ${MAP}
            <span class="rgs-pin" aria-hidden="true"><span class="rgs-pin-dot">${DETAIL_IC.location}</span></span>
            <div class="rgs-bn-locin">
              <h3 class="rgs-k">${esc(loc.label)}</h3>
              ${perDate((d) => `${venue(d)}${dirLink(d)}`)}
            </div>
          </div>
          <div class="rgs-glass rgs-bn-time">
            <h3 class="rgs-k">${esc(att.label)}</h3>
            ${hrs ? `<p class="rgs-bn-hrs"><span>${esc(hrs.from)}</span><i aria-hidden="true"></i><span>${esc(hrs.to)}</span></p>` : ''}
            ${perDate((d) => `<p class="rgs-bn-days">Daily · ${esc(span(d))} · ${esc(d.label)}</p>`)}
            <p class="rgs-bn-att">${esc(att.body)}</p>
          </div>
          <div class="rgs-glass rgs-bn-inc">
            <h3 class="rgs-k">${esc(inc.label)}</h3>
            <ul class="rgs-checks">
              ${incItems.map((x, i) => `<li><span class="rgs-incic">${INC_IC[i] || ''}</span><span><span class="rgs-incl">${esc(x.label)}</span>${x.sub ? `<span class="rgs-incs-sub">${esc(x.sub)}</span>` : ''}</span><span class="rgs-ok">${TICK}</span></li>`).join('')}
            </ul>
            <p class="rgs-bn-incp">With your event ticket</p>
          </div>
          <div class="rgs-glass rgs-bn-tr">
            <div>
              <h3 class="rgs-k">${esc(tr.label)}</h3>
              <p class="rgs-bn-trp">${esc(tr.body)}</p>
            </div>
            <div class="rgs-bn-fly">
              ${airports('rgs-air rgs-air-col')}
              <p class="rgs-fine">${esc(tr.fine)}</p>
            </div>
          </div>
        </div>`;

  const pracTicket = () => `
        <div class="rgs-tk" ${rv(60)}>
          <div class="rgs-tk-main">
            <p class="rgs-tk-admit"><span>Admit one</span><span class="rgs-tk-dot"></span><span>Freedom</span></p>
            <p class="rgs-tk-k">${esc(loc.label)}</p>
            ${perDate((d) => `${venue(d)}`)}
            <dl class="rgs-tk-grid">
              <div><dt>Dates</dt><dd>${perDate((d) => esc(d.label))}</dd></div>
              <div><dt>Days</dt><dd>${perDate((d) => esc(span(d)))}</dd></div>
              <div><dt>Sessions</dt><dd>${esc(hrsTxt)}</dd></div>
            </dl>
            ${perDate((d) => dirLink(d, 'rgs-tk-dir'))}
            <span class="rgs-tk-sheen" aria-hidden="true"></span>
          </div>
          <div class="rgs-tk-stub">
            <p class="rgs-tk-k">${esc(inc.label)}</p>
            <ul class="rgs-tk-inc">${incItems.map(x => `<li><span class="rgs-ok">${TICK}</span>${esc(x.label)}</li>`).join('')}</ul>
            <span class="rgs-tk-crown" aria-hidden="true">${CROWN}</span>
          </div>
        </div>
        <div class="rgs-glass rgs-tk-fine" ${rv(60)}>
          <div class="rgs-detail">
            <span class="rgs-dic">${DETAIL_IC.attendance}</span>
            <div><h3 class="rgs-h3">${esc(att.label)}</h3><p>${esc(att.body)}</p></div>
          </div>
          <div class="rgs-detail">
            <span class="rgs-dic">${DETAIL_IC.travel}</span>
            <div><h3 class="rgs-h3">${esc(tr.label)}</h3><p>${esc(tr.body)}</p>${airports()}<p class="rgs-fine">${esc(tr.fine)}</p></div>
          </div>
        </div>`;

  const pracPath = () => `
        <div class="rgs-glass rgs-pt" ${rv(60)}>
          <h2 class="rgs-exph rgs-pt-h">Know before you go</h2>
          <ol class="rgs-pt-list">
            <li>
              <span class="rgs-pt-node">${DETAIL_IC.location}</span>
              <div>
                <h3 class="rgs-k">Where</h3>
                ${perDate((d) => `${venue(d)}${dirLink(d)}`)}
              </div>
            </li>
            <li>
              <span class="rgs-pt-node">${DETAIL_IC.attendance}</span>
              <div>
                <h3 class="rgs-k">When</h3>
                ${perDate((d) => days(d).map((x, i) => `<span class="rgs-pt-day"><b>${esc(x.wd)}</b> ${esc(x.mo)} ${esc(x.dn)}</span>`).join(''), 'rgs-pt-days')}
                <p class="rgs-pt-hrs">Sessions <strong>${esc(hrsTxt)}</strong> each day</p>
                <p class="rgs-pt-p">${esc(att.body)}</p>
              </div>
            </li>
            <li>
              <span class="rgs-pt-node">${DETAIL_IC.included}</span>
              <div>
                <h3 class="rgs-k">${esc(inc.label)}</h3>
                <div class="rgs-pt-chips">${incItems.map((x, i) => `<span class="rgs-chip">${INC_IC[i] || ''}${esc(x.label)}</span>`).join('')}</div>
                <p class="rgs-pt-p">${esc(inc.body)}</p>
              </div>
            </li>
            <li>
              <span class="rgs-pt-node">${DETAIL_IC.travel}</span>
              <div>
                <h3 class="rgs-k">Getting there</h3>
                <p class="rgs-pt-p">${esc(tr.body)}</p>
                ${airports()}
                <p class="rgs-fine">${esc(tr.fine)}</p>
              </div>
            </li>
          </ol>
        </div>`;

  const pracAlt = { glance: pracGlance, bento: pracBento, ticket: pracTicket, path: pracPath }[prac];

  return `<link rel="stylesheet" href="/xp-reg-split.css">
<section class="rg-spl rgs-t-all${exp === 'last' ? '' : ` rgs-e-${exp}`}${pracAlt ? ` rgs-p-${prac}` : ''}" aria-labelledby="rgs-title">
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
${expCard()}` : pracAlt ? `
${exp === 'none' ? '' : exp === 'open' ? expOpen() : exp === 'pillars' ? expPillars() : expCard()}
${pracAlt()}` : `
        <div class="rgs-details rgs-details-loc">
          ${r.details.filter(d => d.key === 'location').map(detailCard).join('')}
        </div>
${exp === 'none' ? '' : exp === 'open' ? expOpen() : exp === 'pillars' ? expPillars() : expCard()}
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

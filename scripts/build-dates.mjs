// Builds /dates-options.html — larger, more visible treatments for the two
// event dates under the hero's Register button (homepage and about).
//
// Each option is shown on the hero's own ground at desktop width and again in
// a 390px phone frame. Sizing switches on a container query rather than a
// viewport breakpoint so both frames can sit on one page; the shipped version
// will use the usual sm: breakpoint at the same 640px.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/partials/layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const ev = site.nextEvent;
const [first, second] = ev.upcoming;

// "October 15–17, 2026" → { month: 'October', days: '15–17', year: '2026' }
const split = (d) => {
  const m = d.match(/^(\S+)\s+([\d–-]+),\s*(\d{4})$/);
  return m ? { month: m[1], days: m[2], year: m[3] } : { month: d, days: '', year: '' };
};

const PIN = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const CAL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';

const OPTIONS = {
  now: {
    label: 'Now',
    note: 'For reference — 14px dates, 11px locations at half opacity, and the second date dimmed further.',
    html: () => `
      <div class="d-now">
        <div><p class="dt">${esc(first.dates)}</p><p class="lc">${esc(first.location)}</p></div>
        <span class="rule"></span>
        <div class="b"><p class="dt">${esc(second.dates)}</p><p class="lc">${esc(second.location)}</p></div>
      </div>`,
  },
  a: {
    label: 'A — Bigger and brighter',
    note: 'Same layout, scaled up: dates at 20px, locations brighter and larger, and both dates at full white so neither looks like an afterthought. The simplest change.',
    html: () => `
      <div class="d-a">
        <div><p class="dt">${esc(first.dates)}</p><p class="lc">${esc(first.location)}</p></div>
        <span class="rule"></span>
        <div><p class="dt">${esc(second.dates)}</p><p class="lc">${esc(second.location)}</p></div>
      </div>`,
  },
  b: {
    label: 'B — Labelled',
    note: `Option A plus a small coloured label over each date — “Next event · ${first.note || 'Limited spots'}” in pink and “Also coming” in cyan. Tells the visitor what the dates are, and puts the scarcity note from site.json to work.`,
    pick: true,
    html: () => `
      <div class="d-b">
        <div><p class="lb lb-m">Next event${first.note ? ' · ' + esc(first.note.toLowerCase()) : ''}</p><p class="dt">${esc(first.dates)}</p><p class="lc">${PIN}${esc(first.location)}</p></div>
        <span class="rule"></span>
        <div><p class="lb lb-c">Also coming</p><p class="dt">${esc(second.dates)}</p><p class="lc">${PIN}${esc(second.location)}</p></div>
      </div>`,
  },
  c: {
    label: 'C — Glass cards',
    note: 'Each date in its own frosted card with a calendar mark. The next event gets the pink edge and glow. The most visible of the four; reads as two things you can choose between.',
    html: () => `
      <div class="d-c">
        <div class="card on"><span class="ic">${CAL}</span><span><p class="dt">${esc(first.dates)}</p><p class="lc">${esc(first.location)}</p></span></div>
        <div class="card"><span class="ic">${CAL}</span><span><p class="dt">${esc(second.dates)}</p><p class="lc">${esc(second.location)}</p></span></div>
      </div>`,
  },
  d: {
    label: 'D — Big numerals',
    note: 'Calendar-style: the month small in brand colour, the days large, year and city underneath. The days are the part people actually scan for, so they get the size.',
    html: () => {
      const one = (e, cls) => { const s = split(e.dates); return `
        <div class="${cls}"><p class="mo">${esc(s.month)}</p><p class="dy">${esc(s.days)}</p><p class="lc">${esc(s.year)} · ${esc(e.location)}</p></div>`; };
      return `<div class="d-d">${one(first, 'm')}<span class="rule"></span>${one(second, 'c')}</div>`;
    },
  },
};

const cta = `
  <a href="#" class="group inline-flex min-h-11 items-center gap-3 rounded-full bg-magenta px-9 py-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_16px_36px_-16px_rgba(232,32,143,.9)] transition hover:bg-magenta-deep">
    ${esc(ev.ctaText)}
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </a>`;

const stage = (o, phone) => `
  <div class="stage${phone ? ' phone' : ''}" style="background-image:url('${esc(site.assets.heroPoster)}')">
    <div class="shade"></div>
    <div class="inner">${cta}${o.html()}</div>
  </div>`;

const card = (k, o) => `
<article class="opt">
  <span class="tag${o.pick ? ' pick' : k === 'now' ? ' now' : ''}">${o.pick ? 'Recommended' : k === 'now' ? 'Current' : 'Option'}</span>
  <h2>${esc(o.label)}</h2>
  <p class="note">${esc(o.note)}</p>
  <div class="pair">
    <figure>${stage(o, false)}<figcaption>Desktop</figcaption></figure>
    <figure class="pf">${stage(o, true)}<figcaption>Phone · 390px</figcaption></figure>
  </div>
</article>`;

const page = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Event dates options — ${esc(site.brand.name)}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap">
<link rel="stylesheet" href="/styles.css">
<style>
:root { --ink:#1c1c1c; --soft:#5b5b5b; --magenta:#e8208f; --pink:#f0569f; --cyan:#00b9c6; }
body { margin:0; background:#fff; color:var(--ink); font:16px/1.6 Lato, system-ui, sans-serif; }
.wrap { max-width:1240px; margin:0 auto; padding:40px 16px 80px; }
h1 { font:700 30px/1.2 Montserrat, sans-serif; margin:0; }
.lead { color:var(--soft); max-width:780px; margin:10px 0 0; }
.opt { margin-top:56px; }
.opt h2 { font:700 20px/1.3 Montserrat, sans-serif; margin:8px 0 0; }
.note { color:var(--soft); margin:4px 0 0; max-width:780px; font-size:15px; }
.tag { display:inline-block; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:#fff; background:var(--magenta); border-radius:999px; padding:4px 12px; }
.tag.now { background:var(--soft); } .tag.pick { background:linear-gradient(92deg,var(--magenta),var(--cyan)); }
.pair { display:grid; gap:20px; margin-top:14px; grid-template-columns:1fr; }
@media (min-width:1000px) { .pair { grid-template-columns:1fr 390px; } }
figure { margin:0; } figcaption { margin-top:8px; font:700 11px Montserrat, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--soft); }
.pf { max-width:390px; }
.stage { position:relative; overflow:hidden; border-radius:18px; background:#1c1c1c center 70%/cover; container-type:inline-size; }
.shade { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(28,28,28,.82), rgba(28,28,28,.9)); }
.inner { position:relative; display:flex; flex-direction:column; align-items:center; gap:20px; padding:44px 16px 52px; text-align:center; }
.stage p { margin:0; }
.rule { width:1px; align-self:stretch; background:rgba(255,255,255,.2); }

/* Now — copied from the hero */
.d-now { display:flex; gap:20px; align-items:stretch; }
.d-now .dt { font:700 14px/1.4 Montserrat, sans-serif; color:#fff; }
.d-now .lc { margin-top:2px !important; font:400 11px Lato, sans-serif; letter-spacing:.15em; text-transform:uppercase; color:rgba(255,255,255,.5); }
.d-now .b .dt { color:rgba(255,255,255,.7); } .d-now .b .lc { color:rgba(255,255,255,.4); }

/* A */
.d-a { display:flex; gap:20px; align-items:stretch; }
.d-a .rule { background:rgba(255,255,255,.3); }
.d-a .dt { font:700 16px/1.35 Montserrat, sans-serif; color:#fff; }
.d-a .lc { margin-top:4px !important; font:700 11px Lato, sans-serif; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.72); }
@container (min-width:640px) { .d-a { gap:36px; } .d-a .dt { font-size:20px; } .d-a .lc { font-size:12px; } }

/* B */
.d-b { display:flex; gap:18px; align-items:stretch; }
.d-b .rule { background:rgba(255,255,255,.25); }
.d-b .lb { font:800 10px Montserrat, sans-serif; letter-spacing:.18em; text-transform:uppercase; margin-bottom:6px !important; }
.d-b .lb-m { color:var(--pink); } .d-b .lb-c { color:var(--cyan); }
.d-b .dt { font:700 16px/1.35 Montserrat, sans-serif; color:#fff; }
.d-b .lc { display:flex; align-items:center; justify-content:center; gap:5px; margin-top:4px !important; font:700 11px Lato, sans-serif; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.72); }
.d-b .lc svg { opacity:.8; }
@container (min-width:640px) { .d-b { gap:40px; } .d-b .lb { font-size:11px; } .d-b .dt { font-size:20px; } .d-b .lc { font-size:12px; } }

/* C */
.d-c { display:flex; flex-direction:column; gap:10px; width:100%; max-width:320px; }
.d-c .card { display:flex; align-items:center; gap:14px; text-align:left; padding:14px 18px; border-radius:16px;
  background:rgba(255,255,255,.07); box-shadow:inset 0 0 0 1px rgba(255,255,255,.16); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); }
.d-c .card.on { box-shadow:inset 0 0 0 1px rgba(240,86,159,.75), 0 14px 40px -18px rgba(232,32,143,.8); background:rgba(232,32,143,.1); }
.d-c .ic { display:grid; place-items:center; flex:none; width:40px; height:40px; border-radius:12px; background:rgba(255,255,255,.1); color:#fff; }
.d-c .on .ic { background:var(--magenta); }
.d-c .dt { font:700 16px/1.3 Montserrat, sans-serif; color:#fff; }
.d-c .lc { margin-top:3px !important; font:700 11px Lato, sans-serif; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.7); }
@container (min-width:640px) { .d-c { flex-direction:row; max-width:none; width:auto; gap:16px; } .d-c .card { padding:16px 22px 16px 16px; } .d-c .dt { font-size:18px; } }

/* D */
.d-d { display:flex; gap:22px; align-items:stretch; }
.d-d .rule { background:rgba(255,255,255,.22); }
.d-d .mo { font:800 12px Montserrat, sans-serif; letter-spacing:.24em; text-transform:uppercase; }
.d-d .m .mo { color:var(--pink); } .d-d .c .mo { color:var(--cyan); }
.d-d .dy { font:800 34px/1.05 Montserrat, sans-serif; color:#fff; letter-spacing:-.01em; margin-top:2px !important; }
.d-d .lc { margin-top:6px !important; font:700 11px Lato, sans-serif; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.7); }
@container (min-width:640px) { .d-d { gap:44px; } .d-d .mo { font-size:13px; } .d-d .dy { font-size:46px; } .d-d .lc { font-size:12px; } }
</style>
</head>
<body>
<div class="wrap">
  <h1>Event dates — larger and easier to see</h1>
  <p class="lead">The two dates under the Register button, on the hero’s own ground. Each option is shown at desktop width
     and in a phone frame. Whatever is chosen goes on both the homepage and the about page — they share this block.</p>
  ${Object.entries(OPTIONS).map(([k, o]) => card(k, o)).join('')}
</div>
</body></html>`;

fs.writeFileSync(path.join(dist, 'dates-options.html'), page);
console.log('built dist/dates-options.html');

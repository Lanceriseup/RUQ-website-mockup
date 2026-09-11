import { esc } from '../partials/layout.mjs';
import { section, videoFacade, card, personCard, cta, faq } from '../partials/components.mjs';
import { hero } from '../partials/hero.mjs';
import { spread } from '../partials/spread.mjs';
import { ctaSection } from '../partials/cta.mjs';
import { faithSection } from '../partials/faith.mjs';
import { testimonialsSection } from '../partials/testimonials.mjs';
import { closingSection } from '../partials/closing.mjs';
import { teamPage } from '../partials/team.mjs';
import { aboutHero } from '../partials/about-hero.mjs';
import { renderJourney } from '../partials/about-journey.mjs';
import { renderFaqs } from '../partials/faq-variants.mjs';
import { renderContactPage } from '../partials/contact.mjs';

const grid = (cols, items) => `<div class="mt-10 grid gap-6 ${cols}">${items.join('')}</div>`;

// Chosen: a full-width hairline under the heading in place of the two-tone
// bar, and the crest as a faint watermark behind the Rise Up Kings block
// rather than an object standing beside the text. The form panel keeps the
// glass treatment that was approved. Options remain at /contact-styles.html.
const CONTACT_OPTS = { rule: 'hair', partnerShape: 'watermark', panel: 'current' };

export const pages = (site, c, vids) => ([
  {
    file: 'index.html', href: '/index.html',
    title: `${site.brand.name} — ${c.home.hero.eyebrow}`,
    desc: site.brand.tagline,
    hero: true,   // header renders in overHero mode and sits on top of this section
    body: `
    ${hero(site, c)}


    <!-- Struggles + renewal as one magazine spread, and the overlapping panel
         that lifts it over the hero. The two sections are one argument — six
         problems, then three answers — so they are designed together, with the
         photographic plates overlapping the boundary between them. -->
    <div class="relative z-10 -mt-16 overflow-hidden rounded-t-[2.5rem] shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)]
                before:absolute before:left-1/2 before:top-4 before:z-20 before:h-1.5 before:w-16
                before:-translate-x-1/2 before:rounded-full before:bg-ink/15">
      ${spread(site, c)}
    </div>

    ${ctaSection(site, c)}

    <!-- The creed sits directly under the breakthrough CTA, matching the live
         page's order: the ask, then what the movement stands on. -->
    ${faithSection(site, c)}

    <!-- Testimonies. The heading is the "mirror" wording, which answers the
         struggles heading up the page: same grammar, same rhythm, past tense
         instead of present. Read top to bottom they are a question and its
         answer — "Common struggles women in marriage HAVE", then "Real change
         women in marriage FOUND".

         That wording is mine, not the client's. Theirs is "What Women Have
         Experienced at Rise Up Queens", kept as the 'verbatim' option in
         testimonial-headings.mjs. If they want their sentence back, pass
         'verbatim' here and nothing else changes. -->
    ${testimonialsSection(site, c, vids, 'mirror')}

    <!-- Meet the Founder used to sit here and has been removed. Its copy is
         still in content.json as home.founder, and the team page still carries
         Jessica, so nothing is lost — the homepage simply no longer detours
         into a bio between the testimonies and the ask.

         That does drop the only link from the homepage to /team.html. The nav
         still carries Meet the Team, so the page is reachable, but if the
         footer or this section were ever the intended route in, it needs
         putting back somewhere. -->

    ${closingSection(site, c)}`
  },

  {
    file: 'about.html', href: '/about.html',
    title: `About — ${site.brand.name}`, desc: c.about.lead,
    // overHero, not hero: the header renders over the photograph. The hero
    // flag would also pull in the Wistia player, and this page has no video.
    overHero: true,
    body: `
    ${aboutHero(site, c)}

    <!-- The ticket is passed INTO the journey block rather than following it,
         so both sit on one continuous ground. Rendered as its own section it
         opened with bg-white against the journey's warm gradient, and the two
         met as a straight line across the page.

         It sits directly under the third card, which ends on "take the next
         step on your path" — so the ticket is that step. -->
    ${renderJourney(site, c, 'overlap', 'stacked', closingSection(site, c, 'inherit'))}

    <!-- The two pullquotes used to sit here and are removed. Their copy stays
         in content.json as about.pullquotes. -->
    ${section({ bg: 'bg-white', pad: '', body: renderFaqs(c, 'current') })}
`
  },

  {
    file: 'events.html', href: '/events.html',
    title: `Events — ${site.brand.name}`, desc: c.events.lead,
    body: `
    ${section({ bg: 'bg-white', heading: c.events.heading, lead: c.events.lead, body:
      grid('sm:grid-cols-2 lg:grid-cols-3', c.events.tiers.map(t => `
        <article class="flex flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink/10">
          <h3 class="font-display text-sm font-bold uppercase tracking-wider text-magenta-text">${esc(t.name)}</h3>
          <p class="mt-3 flex-1 font-body text-sm leading-relaxed text-ink-soft">${esc(t.blurb)}</p>
          ${t.cta ? `<a href="${esc(site.funnels[t.cta])}" rel="noopener" class="mt-5 font-body text-sm font-semibold text-ink underline underline-offset-4 hover:text-magenta-text">Learn more &rarr;</a>` : ''}
        </article>`)) })}
    ${section({ bg: 'bg-white', heading: 'Upcoming dates', body: `
      <ul class="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        ${site.nextEvent.upcoming.map(e => `
        <li class="flex flex-wrap items-baseline justify-between gap-4 py-5">
          <div>
            <p class="font-display text-xl font-semibold text-ink">${esc(e.dates)}</p>
            <p class="font-body text-sm text-ink-soft">${esc(e.location)}</p>
          </div>
          ${e.note ? `<span class="rounded-full bg-magenta-tint px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-magenta-text">${esc(e.note)}</span>` : ''}
          <div>${cta('Register', site.nextEvent.ctaUrl)}</div>
        </li>`).join('')}
      </ul>` })}
    ${section({ bg: 'bg-cyan-tint', eyebrow: 'Watch', heading: 'Inside the experiences',
      lead: 'Short films from the events and programs.', body:
      grid('sm:grid-cols-2', [
        ...vids.vimeo.map(v => videoFacade(v, 'vimeo')),
        ...vids.wistia.filter(v => v.page === 'events').map(v => videoFacade(v, 'wistia')),
      ]) })}`
  },

  {
    file: 'masterclasses.html', href: '/masterclasses.html',
    title: `Masterclasses — ${site.brand.name}`, desc: c.masterclasses.lead,
    body: section({ bg: 'bg-white', heading: c.masterclasses.heading, lead: c.masterclasses.lead, body:
      grid('sm:grid-cols-2 lg:grid-cols-3', c.masterclasses.items.map(m => `
        <article class="flex flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-ink/10">
          <h3 class="font-display text-lg font-semibold text-ink">${esc(m.name)}</h3>
          <p class="mt-1 font-body text-xs uppercase tracking-wider text-magenta-text">${esc(m.duration)}</p>
          <p class="mt-3 flex-1 font-body text-sm leading-relaxed text-ink-soft">${esc(m.blurb)}</p>
          <p class="mt-5 font-body text-sm font-semibold text-ink-soft">${esc(c.masterclasses.waitlistLabel)}
            <span class="ml-1 rounded bg-ink/5 px-2 py-0.5 text-xs font-normal">form pending</span></p>
        </article>`)) })
  },

  {
    file: 'coaching.html', href: '/coaching.html',
    title: `1-on-1 Coaching — ${site.brand.name}`, desc: c.coaching.lead,
    body: `
    ${section({ bg: 'bg-white', heading: c.coaching.heading, lead: c.coaching.lead, body:
      grid('sm:grid-cols-2', c.coaching.coaches.map(x => card(x.name, x.blurb, 'Coach'))) })}
    ${section({ bg: 'bg-white', eyebrow: 'Watch', heading: 'From Jessica', body:
      grid('sm:grid-cols-2', vids.youtube.slice(0, 2).map(v => videoFacade(v, 'youtube'))) })}`
  },

  {
    file: 'team.html', href: '/team.html',
    title: `Meet the Team — ${site.brand.name}`, desc: c.team.lead,
    // overHero, not hero: the page needs the header rendered over it rather
    // than above it, because its standard mode is white with a bottom border
    // and the top of this page is black. `hero` would also pull in the Wistia
    // player, which this page has no use for.
    overHero: true,
    // No scrim. It exists to hold white nav type over a bright video frame;
    // this page is near-black at the top, so it buys nothing and instead lays
    // 80% ink over the first 288px of the page, which greys out the heading.
    navScrim: false,
    body: teamPage(site, c)
  },

  {
    file: 'free-resource.html', href: '/free-resource.html',
    title: `Free Resource — ${site.brand.name}`, desc: c.freeResource.lead,
    body: section({ bg: 'bg-white', heading: c.freeResource.heading, lead: c.freeResource.lead, body: `
      <div class="mt-8 rounded-xl border-2 border-dashed border-ink/25 bg-white/60 p-8">
        <p class="font-body text-sm font-semibold uppercase tracking-wider text-magenta-text">Placeholder</p>
        <p class="mt-2 max-w-2xl font-body text-ink-soft">${esc(c.freeResource.note)}</p>
      </div>` })
  },

  {
    file: 'contact.html', href: '/contact.html',
    title: `Contact — ${site.brand.name}`, desc: c.contact.lead,
    // Same pair of flags as the team page, and for the same reasons: the
    // header renders over a page that is near-black at the top, and the scrim
    // exists to hold white nav type over a bright video frame. Here it would
    // only lay 80% ink over the first 288px and grey the heading out.
    overHero: true,
    navScrim: false,
    // The form on this page is DISABLED, deliberately and not as an oversight.
    // There is no endpoint — the live page posts to a Brizy handler, the
    // Jotform routes were reported broken, and the plan of record was MOS into
    // Ontraport. A form that looks live and posts nowhere swallows real
    // enquiries in silence, so the fields stay disabled and say so until one of
    // those is wired. See contact-parts.mjs.
    body: renderContactPage(site, c, vids, CONTACT_OPTS)
  },

  {
    file: 'thank-you.html', href: '/thank-you.html',
    title: `Thank You — ${site.brand.name}`, desc: c.thankYou.lead,
    body: section({ bg: 'bg-white', pad: 'py-28', heading: c.thankYou.heading, lead: c.thankYou.lead,
      body: `<div class="mt-8">${cta('Back to home', '/index.html', 'ghost')}</div>` })
  },
]);

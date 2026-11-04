import { esc } from '../partials/layout.mjs';
import { section, videoFacade, card, personCard, cta, faq } from '../partials/components.mjs';
import { hero } from '../partials/hero.mjs';
import { spread } from '../partials/spread.mjs';
import { freedomPhoto } from '../partials/freedom-photo.mjs';
import { stayOption, noteStay } from '../partials/stay-options.mjs';
import { faithSection } from '../partials/faith.mjs';
import { testimonialsSection } from '../partials/testimonials.mjs';
import { nlbSection } from '../partials/nlb.mjs';
import { teamPage } from '../partials/team.mjs';
import { aboutHero } from '../partials/about-hero.mjs';
import { renderJourney } from '../partials/about-journey.mjs';
import { founderSection } from '../partials/founder.mjs';
import { whoForSection } from '../partials/whofor.mjs';
import { aboutLights } from '../partials/about-lights.mjs';
import { aboutStayOption } from '../partials/about-stay-options.mjs';
import { renderFaqs } from '../partials/faq-variants.mjs';
import { contactFormOption } from '../partials/contact-mos-options.mjs';
import { contactBg } from '../partials/contact-bg-options.mjs';
import { contactAfter } from '../partials/contact-after-options.mjs';
import { explorePage } from '../partials/explore/index.mjs';
import { masterclassPage } from '../partials/masterclass-options.mjs';
import { eventsOption } from '../partials/events-options.mjs';
import { coachingOption } from '../partials/coaching-options.mjs';
import { thankYouOption } from '../partials/thankyou-options.mjs';
import { notFoundOption } from '../partials/notfound-options.mjs';
import { register as registerPage } from '../partials/register/split.mjs';
import { legalPage } from '../partials/legal-options.mjs';

// The policy pages' design (legal-options.mjs): L1 'paper', chosen
// 2026-11-05 from /legal-options.html.
const LEGAL_DESIGN = 'paper';

const grid = (cols, items) => `<div class="mt-10 grid gap-6 ${cols}">${items.join('')}</div>`;

export const pages = (site, c, vids) => ([
  {
    file: 'index.html', href: '/index.html',
    title: `${site.brand.name} — ${c.home.hero.eyebrow}`,
    desc: site.brand.tagline,
    hero: true,   // header renders in overHero mode and sits on top of this section
    body: `
    <!-- The Stay Connected form (MultiplyOS) is on this page twice: pinned
         to the Freedom wall and in the breakthrough panel. Both chosen
         2026-11-03 from /stay-options-2.html (J and A); markup in
         stay-options.mjs, styles and frame sizing in stay.css / stay.js. -->
    <link rel="stylesheet" href="/stay.css">
    ${hero(site, c)}


    <!-- Struggles + renewal as one magazine spread, and the overlapping panel
         that lifts it over the hero. The two sections are one argument — six
         problems, then three answers — so they are designed together, with the
         photographic plates overlapping the boundary between them. -->
    <!-- The panel's grab-handle bar was removed 2026-10-10 at the client's
         request; the rounded top edge alone carries the lift. -->
    <div class="relative z-10 -mt-16 overflow-hidden rounded-t-[2.5rem] shadow-[0_-26px_60px_-28px_rgba(0,0,0,.5)]">
      <!-- Freedom opens the panel, and its wave hands over to the struggles
           below. -->
      <!-- Memory wall, chosen 2026-10-10 from /freedom-wall-options.html: the
           polaroids and note on W2's sky, with W1's torn paper edge. The
           earlier brush-stroke design is still in freedom.mjs. -->
      <!-- The note carries both event dates, moved here from under the
           hero's Register button (2026-10-30, option A of
           /freedom-dates-options.html). Under them, since 2026-11-05 (the
           client's ask), the Stay Connected form in place of the note's
           "Reserve your seat" button; before that the form was taped to the
           wall under the note, with "Stay close" (option J,
           stayOption(site, c, 'wall')). "Stay close" sits over it with J's
           arrow (noteStay 'arrow', from /freedom-stay-options.html), the
           form at 90% (F2 of /freedom-stay-options-2.html) and the script
           at its own size with a little more room under it, chosen
           2026-11-05. Livelier takes: /freedom-stay-options-3.html.
           Balanced round the taller note with B3 of
           /freedom-balance-options.html (2026-11-05): the note compact
           (size 'compact') and the polaroids larger, spread down its height
           (balance 'big'). -->
      ${freedomPhoto(site, c, 'memory', { dates: 'note', form: noteStay(c, 'arrow', { form: 's90' }), size: 'compact', balance: 'big' })}
      <!-- The breakthrough CTA closes the spread on the spread's own ground.
           As a separate section after this panel it met it on a straight
           line: the panel is z-10, so it covered the top of the CTA's glow,
           and the spread's corner glows stopped dead at its bottom edge.
           Since 2026-11-03 it holds the Stay Connected form beside its
           dates, in place of Register Now (option A); ctaSection in cta.mjs
           is the previous panel, still used by the review pages. -->
      ${spread(site, c, stayOption(site, c, 'panel'))}
    </div>

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

    <!-- No Longer Bound, as an ad-sized banner. See nlb.mjs. -->
    ${nlbSection(c)}

    <!-- Meet the Founder used to sit here and has been removed. Its copy is
         still in content.json as home.founder, and the team page still carries
         Jessica, so nothing is lost — the homepage simply no longer detours
         into a bio between the testimonies and the ask.

         That does drop the only link from the homepage to /team.html. The nav
         still carries Meet the Team, so the page is reachable, but if the
         footer or this section were ever the intended route in, it needs
         putting back somewhere. -->

    <!-- The closing "What if this is your turning point?" panel was removed
         2026-10-10 at the client's request; No Longer Bound now closes the
         page at that panel's width. closing.mjs is kept for the review pages. -->
    <script src="/stay.js" defer></script>`
  },

  {
    file: 'about.html', href: '/about.html',
    title: 'About Rise Up Queens', desc: c.about.lead,
    // overHero: the header renders over the photograph. The Wistia player
    // loads because the hero renders the shared VSL — see build.mjs.
    overHero: true,
    body: `
    ${aboutHero(site, c)}

    <!-- The ticket is passed INTO the journey block rather than following it,
         so both sit on one continuous ground. Rendered as its own section it
         opened with bg-white against the journey's warm gradient, and the two
         met as a straight line across the page.

         It sits directly under the third card, which ends on "take the next
         step on your path" — so the ticket is that step.

         The FAQs follow "Who is it for?" (moved up 2026-10-30 from their own
         white section at the foot of the page): its questions — do I have to
         be married, does my husband have to go first — are the ones that
         statement raises, and the page now ends on the ticket rather than on
         a list. They ride in the opening, on the journey's ground, so no white
         band cuts across it; "relative" lifts them above the ground's
         absolutely positioned backdrop, which would otherwise paint over them.

         The two pullquotes that once closed the page are removed. Their copy
         stays in content.json as about.pullquotes.

         The closing "Join us at Freedom" panel holds the Stay Connected form
         in place of its two buttons: K2, the form rising out of the slim
         band, chosen 2026-11-03 from /about-stay-options.html. aboutCta in
         about-cta.mjs is the previous panel, with the buttons. -->
    <link rel="stylesheet" href="/stay.css">
    ${renderJourney(site, c, 'overlap', 'stacked', aboutStayOption(site, c, 'rise'),
      aboutLights() + founderSection(c, 'paired') + whoForSection(c) + `<div class="relative">${renderFaqs(c, 'current')}</div>`)}
    <script src="/stay.js" defer></script>
`
  },

  {
    // HIDDEN for now (2026-11-05, Lance's ask), as are Masterclasses and
    // 1-on-1 Coaching below: linked from nowhere, out of sitemap.xml, and
    // redirected to / on Vercel (vercel.json). Still built, so they can be
    // previewed locally and the options pages that read them keep working.
    //
    // Events — A1, "satin ribbon", chosen 2026-11-03 from
    // /events-options-2.html (A, the plain trail, was live first): the live
    // page's seven programs, word for word, along a satin ribbon that unrolls
    // as you scroll with a crown riding its end, closing on the About page's
    // band with the dates and the Stay Connected form
    // (src/partials/events-options.mjs, events.css/js). The earlier tiers grid
    // and "Inside the experiences" films are replaced; the films now sit with
    // their programs. Copy is content.json eventsPage.
    file: 'events.html', href: '/events.html', sitemap: false,
    title: `Events — ${site.brand.name}`, desc: c.eventsPage.lead,
    navClear: true,
    body: eventsOption(site, c, 'ribbon')
  },

  {
    // Masterclasses — F1 chosen 2026-11-02 from /masterclass-options-3.html:
    // the deck on blush silk, closing on the live page's sign-off, waitlist in
    // a dialog (src/partials/masterclass-options.mjs). No em dashes anywhere
    // on this page, the title included (asked for 2026-11-02).
    file: 'masterclasses.html', href: '/masterclasses.html', sitemap: false,
    title: `Masterclasses | ${site.brand.name}`, desc: c.explore.masterclasses.lead,
    navClear: true,
    body: masterclassPage(site, c, 'deck-sign')
  },

  {
    // 1-on-1 Coaching — D, "turn the card", chosen 2026-11-03 from
    // /coaching-options.html, with each card opening a pop-up of the coach's
    // own video and words, and the live page's two YouTube videos to close
    // (src/partials/coaching-options.mjs, coaching.css/js). Copy is
    // content.json coachingPage; each coach's button opens the MultiplyOS
    // intro-call form with her pre-filled.
    file: 'coaching.html', href: '/coaching.html', sitemap: false,
    title: `1-on-1 Coaching — ${site.brand.name}`, desc: c.coachingPage.lead,
    navClear: true,
    body: coachingOption(site, c, 'cards')
  },

  {
    file: 'team.html', href: '/team.html',
    title: `Meet the Team — ${site.brand.name}`, desc: c.team.metaDesc,
    // The page is light now, so the header uses its ink type — but in
    // "clear" mode: no white bar, positioned over the page, so the sky the
    // page opens on runs up behind it to the very top. See team.mjs.
    navClear: true,
    body: teamPage(site, c)
  },

  {
    file: 'free-resource.html', href: '/free-resource.html',
    title: `Free Resource — ${site.brand.name}`, desc: c.freeResource.metaDesc,
    // a placeholder nothing links to yet, so not in sitemap.xml
    sitemap: false,
    body: section({ bg: 'bg-white', heading: c.freeResource.heading, lead: c.freeResource.lead, body: `
      <div class="mt-8 rounded-xl border-2 border-dashed border-ink/25 bg-white/60 p-8">
        <p class="font-body text-sm font-semibold uppercase tracking-wider text-magenta-text">Placeholder</p>
        <p class="mt-2 max-w-2xl font-body text-ink-soft">${esc(c.freeResource.note)}</p>
      </div>` })
  },

  {
    file: 'contact.html', href: '/contact.html',
    title: `Contact — ${site.brand.name}`, desc: c.contact.lead,
    // The header is in "clear" mode — ink type, no bar — so the washed photo
    // runs up behind it.
    navClear: true,
    // Photo-led G1 "Daylight" with the overlapping arc panel, chosen
    // 2026-10-10 from /contact-glass-options.html. The sky design (L1) stays
    // in contact-light.mjs.
    // The form is the live MultiplyOS "Contact Us" form (content.json
    // contact.mosForm), set where the old disabled form was: C1 of
    // /contact-form-options.html, chosen 2026-11-03. The disabled form is
    // still what contactPhoto renders for the review pages.
    // Since 2026-11-05 on the client's new photograph, the queens in their
    // crowns (contact-queens.jpg), in the same daylight treatment: A of
    // /contact-bg-options.html (contact-bg-options.mjs).
    // Under it, Rise Up Kings and the two videos as P1 "ivory and gold",
    // chosen 2026-11-05 from /contact-after-options.html.
    body: contactBg(site, c, vids, 'day', { after: contactAfter(site, c, vids, 'gold') })
  },

  {
    // Courses — NEW (2026-10-05). In the footer and, since 2026-10-09, the
    // header nav.
    file: 'courses.html', href: '/courses.html',
    title: `Courses — ${site.brand.name}`, desc: c.explore.courses.lead,
    navClear: true,
    body: explorePage(site, c, vids, 'courses', 'luminous')
  },

  {
    // Freedom registration — NEW. Design R3 "split screen", chosen 2026-10-05
    // from /register-options.html.
    // DESIGN ONLY: the form posts nowhere and the card fields are display
    // boxes standing in for Ontraport's hosted card frame. So since
    // 2026-11-04 (the client's ask) every Register button points back at
    // https://go.riseupqueens.com/3dayevent (site.nextEvent.ctaUrl,
    // site.funnels.threeDayEvent) and nothing links here.
    file: 'register.html', href: '/register.html',
    sitemap: false,
    title: `Register for Freedom — ${site.brand.name}`, desc: `${c.register.title} · ${c.register.dates[0].label} · ${c.register.dates[0].city}`,
    navClear: true,
    body: registerPage(site, c)
  },

  {
    // Where the Contact Us form sends the visitor after a submit
    // (contact.mosForm.next). T1 "Daylight", chosen 2026-11-04 from
    // /thank-you-options.html: the Contact page's washed photo behind the
    // message (src/partials/thankyou-options.mjs, thankyou.css).
    file: 'thank-you.html', href: '/thank-you.html',
    sitemap: false,
    title: `Thank You — ${site.brand.name}`, desc: c.thankYou.lead,
    navClear: true,
    body: thankYouOption(site, c, 'day')
  },

  {
    // Privacy Policy and Terms and Conditions (2026-11-05): Rise Up Kings'
    // copy, word for word, with the RUQ support email (content.json legal,
    // src/data/legal/*.html), without RUK's phone number or address. Linked
    // from the footer's copyright bar. Design: LEGAL_DESIGN.
    file: 'privacy-policy.html', href: '/privacy-policy.html',
    title: `${c.legal.privacy.title} — ${site.brand.name}`, desc: c.legal.privacy.desc,
    navClear: true,
    body: legalPage(site, c, 'privacy', LEGAL_DESIGN)
  },

  {
    file: 'terms.html', href: '/terms.html',
    title: `${c.legal.terms.title} — ${site.brand.name}`, desc: c.legal.terms.desc,
    navClear: true,
    body: legalPage(site, c, 'terms', LEGAL_DESIGN)
  },

  {
    // The 404 page: Vercel shows dist/404.html for any address with no page.
    // Not in sitemap.xml, and no canonical (it has no address of its own).
    // N2 "Big 404", chosen 2026-11-04 from /404-options.html.
    file: '404.html', href: '/404.html',
    title: `Page not found — ${site.brand.name}`, desc: c.notFound.desc,
    navClear: true, sitemap: false, canonical: false,
    body: notFoundOption(site, c, 'big')
  },
]);

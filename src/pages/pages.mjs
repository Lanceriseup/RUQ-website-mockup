import { esc } from '../partials/layout.mjs';
import { section, videoFacade, card, personCard, cta, faq } from '../partials/components.mjs';

const grid = (cols, items) => `<div class="mt-10 grid gap-6 ${cols}">${items.join('')}</div>`;

export const pages = (site, c, vids) => ([
  {
    file: 'index.html', href: '/index.html',
    title: `${site.brand.name} — ${c.home.hero.eyebrow}`,
    desc: site.brand.tagline,
    hero: true,   // header renders in overHero mode and sits on top of this section
    body: `
    <section class="relative overflow-hidden bg-ink">
      <!-- Background b-roll. Muted + playsinline so mobile browsers allow autoplay.
           The poster shows before the first frame decodes and is the whole picture
           for anyone on prefers-reduced-motion (app.js skips loading the video). -->
      <video id="hero-video" class="absolute inset-0 h-full w-full object-cover opacity-40"
             poster="${esc(site.assets.heroVideo.poster)}"
             autoplay muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"
             data-src="${esc(site.assets.heroVideo.src)}"></video>
      <!-- pt clears the overlaid editorial header (~195px incl. hairline + CTA rule) -->
      <div class="relative mx-auto max-w-content px-4 pb-28 pt-56 sm:pb-40 sm:pt-60">
        <p class="font-body text-sm uppercase tracking-[0.25em] text-cyan">${esc(c.home.hero.eyebrow)}</p>
        <h1 class="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.1] text-white sm:text-6xl">${esc(c.home.hero.heading)}</h1>
        <p class="mt-6 max-w-xl font-body text-lg text-white/85">${esc(c.home.hero.sub)}</p>
        <div class="mt-9 flex flex-wrap gap-4">
          ${cta(site.nextEvent.ctaText, site.nextEvent.ctaUrl)}
          <a href="/events.html" class="inline-block rounded-full px-7 py-3 font-body font-semibold text-white ring-1 ring-white/40 hover:bg-white/10">See the full path</a>
        </div>
        <p class="mt-6 font-body text-sm text-white/70">${esc(site.nextEvent.dates)} &middot; ${esc(site.nextEvent.location)}</p>
      </div>
    </section>

    ${section({ bg: 'bg-white', heading: c.home.painPoints.heading, body:
      grid('sm:grid-cols-2 lg:grid-cols-3', c.home.painPoints.items.map(t =>
        `<p class="rounded-xl bg-white/70 p-6 font-body text-ink-soft ring-1 ring-ink/10">${esc(t)}</p>`)) })}

    ${section({ bg: 'bg-white', eyebrow: 'Watch', heading: 'Hear from the women who came',
      lead: 'Testimonies from the 2025 events.', body:
      grid('sm:grid-cols-2 lg:grid-cols-3', vids.wistia.filter(v => v.page === 'home').slice(0, 6).map(v => videoFacade(v, 'wistia'))) })}

    ${section({ bg: 'bg-magenta-tint', heading: c.home.founder.heading, body: `
      <p class="mt-4 max-w-3xl font-body text-lg leading-relaxed text-ink-soft">${esc(c.home.founder.body)}</p>
      <div class="mt-8">${cta('Meet the team', '/team.html', 'ghost')}</div>` })}`
  },

  {
    file: 'about.html', href: '/about.html',
    title: `About — ${site.brand.name}`, desc: c.about.lead,
    body: `
    ${section({ bg: 'bg-white', heading: c.about.heading, lead: c.about.lead, body: `
      <div class="mt-10 grid gap-8 md:grid-cols-2">
        ${c.about.pullquotes.map(q => `<blockquote class="border-l-4 border-magenta pl-6 font-display text-2xl font-semibold text-ink">${esc(q)}</blockquote>`).join('')}
      </div>` })}
    ${section({ bg: 'bg-white', heading: 'Frequently Asked Questions', body: faq(c.about.faqs) })}
    ${section({ bg: 'bg-magenta-tint', heading: c.about.ctaHeading, body: `<div class="mt-8">${cta(site.nextEvent.ctaText, site.nextEvent.ctaUrl)}</div>` })}`
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
    body: section({ bg: 'bg-white', heading: c.team.heading, lead: c.team.lead, body:
      grid('sm:grid-cols-2 lg:grid-cols-4', c.team.members.map(m => personCard(m))) })
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
    body: section({ bg: 'bg-white', heading: c.contact.heading, lead: c.contact.lead, body: `
      <div class="mt-10 grid gap-10 md:grid-cols-2">
        <form action="#" method="post" novalidate class="space-y-4" aria-describedby="form-note">
          <p id="form-note" class="rounded-lg bg-ink/5 px-4 py-3 font-body text-sm text-ink-soft">
            Mockup only — this form is not connected. Wire to MOS &rarr; Ontraport before launch.</p>
          ${['Name', 'Email', 'Phone'].map(l => `
          <div>
            <label for="f-${l.toLowerCase()}" class="block font-body text-sm font-semibold text-ink">${l}</label>
            <input id="f-${l.toLowerCase()}" name="${l.toLowerCase()}" type="${l === 'Email' ? 'email' : l === 'Phone' ? 'tel' : 'text'}" disabled
                   class="mt-1 w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 font-body disabled:bg-ink/5">
          </div>`).join('')}
          <div>
            <label for="f-msg" class="block font-body text-sm font-semibold text-ink">Message</label>
            <textarea id="f-msg" name="message" rows="5" disabled class="mt-1 w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 font-body disabled:bg-ink/5"></textarea>
          </div>
          <button type="submit" disabled class="rounded-full bg-magenta px-7 py-3 font-body font-semibold text-white opacity-50">Send</button>
        </form>
        <div>
          <h3 class="font-display text-lg font-semibold text-ink">${esc(c.contact.socialHeading)}</h3>
          <ul class="mt-4 space-y-2 font-body">
            <li><a href="${esc(site.social.instagram)}" rel="noopener" class="text-ink underline underline-offset-4 hover:text-magenta-text">Instagram</a></li>
            <li><a href="${esc(site.social.facebook)}" rel="noopener" class="text-ink underline underline-offset-4 hover:text-magenta-text">Facebook</a></li>
          </ul>
        </div>
      </div>` })
  },

  {
    file: 'thank-you.html', href: '/thank-you.html',
    title: `Thank You — ${site.brand.name}`, desc: c.thankYou.lead,
    body: section({ bg: 'bg-white', pad: 'py-28', heading: c.thankYou.heading, lead: c.thankYou.lead,
      body: `<div class="mt-8">${cta('Back to home', '/index.html', 'ghost')}</div>` })
  },
]);

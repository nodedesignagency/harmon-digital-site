# Before handoff — checklist

Everything that has to be done before the Harmon Digital site is handed to the client.
**Claude: when the owner mentions handoff, launch, delivery or "what's left", go through this list with them.**
Tick items off as they are done; add new ones as they come up.

Main scope is the **home page, the VSL and careers**. The "minor text" items below were deliberately
left for later — they still have to be done before handoff.

## Waiting on the client (Isaac)

- [ ] **Logo files** — replace the Mahadeva logo in the header, the loading screen (preloader), the big 3D mark under the hero, and the share/OG image (`src/app/opengraph-image.tsx`)
- [ ] **Favicon / app icons** — `src/app/favicon.ico`, `icon.png`, `apple-icon.png` are still the Mahadeva "m" (Harmon's blue "//" icon is in `client-brief/current-site/images/logo/icon.png`)
- [ ] **Brand colours** — the site still uses the template's green palette (`src/styles/theme.css`)
- [ ] **Booking link** — every "Book a Call" currently goes to `/contact`
- [ ] **Prices** for the three tiers — cards show "Unstack" / "1:1 Training" / "Custom Builds" until then (`src/content/pricing.ts`)
- [ ] **Hero headline** — current line is a placeholder (`src/content/home.ts`, `heroContent`)
- [ ] **Testimonials** — names for "Operations Lead, Neighbors Bank" and "Owner, Happy Endings"; headshots if we want portraits (they need the background removed)
- [ ] **ProducifyX dashboard screenshot** — OK to use? It shows "$0 MRR", "0 hires" and ProducifyX's customer names
- [ ] **Clean Neighbors Bank Slack screenshot** — the one supplied shows a joke test message, so it isn't used
- [ ] **Etto dashboard screenshot** — the one used shows sandbox/test data; a version with real-looking data would be better
- [ ] Confirm case study order (home shows Hoplite/Etto, Happy Endings, SunMed first)

## Minor text pages (left for later on purpose)

- [ ] **About** — port the current site's About copy (`client-brief/current-site/about.md`) and Isaac's photo; replace the template team
- [ ] **Contact** — heading, the made-up "Shelly Reynolds" quote and stock portrait, form fields/options (`src/content/contact.ts`)
- [ ] **Pricing page** — the "Mahadeva speeds up teams" impact band and the Launch/Scale/Enterprise comparison table (`src/content/pricing.ts`)
- [ ] **Blog** — Harmon has no blog: remove the page and its links, or keep it with real posts (6 demo posts now)
- [ ] **Privacy Policy & Terms** — port the current site's text (`client-brief/current-site/privacy.md`, `terms.md`) into `src/content/legal.ts`
- [ ] **404 page** copy (`src/content/not-found.ts`)
- [ ] **Header menu** — match it to the pages we keep (`src/config/navigation.ts`)

## Setup before going live

- [ ] Contact and careers **form endpoints** (`NEXT_PUBLIC_CONTACT_ENDPOINT`, `NEXT_PUBLIC_CAREERS_ENDPOINT` — see `SETUP.md`); unset, forms show "sent" and throw the message away
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.harmon-digital.com` on the host (canonical URLs, sitemap, share card)
- [ ] Sanity CMS — connect it (so Isaac can edit case studies) or leave the built-in content
- [ ] Remove any leftover template demo assets in `public/uploads/` that nothing uses
- [ ] Final check: `npm run lint`, `npm run build`, `npm run artifact` all pass; click through every page on phone and desktop

## Done

- [x] Home page copy from the brief, real client logos, figures, testimonials, pricing tiers, FAQ
- [x] All 9 case studies with real content and screenshots
- [x] Site name, email, LinkedIn, footer ("Harmon // Digital", legal links, credits removed)
- [x] "Buy Template" badge removed

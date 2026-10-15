# Before handoff — checklist

Everything that has to be done before the Harmon Digital site is handed to the client.
**Claude: when the owner mentions handoff, launch, delivery or "what's left", go through this list with them.**
Tick items off as they are done; add new ones as they come up.

Main scope is the **home page, the VSL and careers**. The "minor text" items below were deliberately
left for later — they still have to be done before handoff.

## Home page — section plan (owner's order)

Main scope is the **home page, the VSL and careers** (ask the owner what the VSL is if it's still unclear).
Build the new sections one at a time with the owner's direction; they often share a reference video.

| # | Section | Background | Status |
|---|---|---|---|
| 1 | Hero | dark green | done (headline is a placeholder) |
| 2 | Problem ("Sound Familiar?") | white | done |
| 3 | Solution ("Both Sides of the P&L") | white | done |
| 4 | How It Works | beige | **done** — sticky scroll, `components/sections/HowItWorks.tsx`; icons reuse the feature art (could get unique ones) |
| 5 | AI Employees (bento of roles) | dark green | **done** — `components/sections/AiEmployees.tsx`: two equal tiles on top (3D art cropped in the top-right corner); below, a tall tile left with two beside it (art whole, top-left) and a "Create Your Own AI Employee" CTA strip under them; 6px gaps |
| 6 | Portfolio Dashboards ("real visual weight") | white | **next** |
| 7 | Case Studies | dark green | done |
| 8 | Why Us (stats + logos) | white | done |
| 9 | Tools / Training | white | done |
| 10 | Testimonials | dark green | done |
| 11 | Before / After EBITDA (new, replaces the current one) | dark green | **done** — `components/sections/BeforeAfterEbitda.tsx`: the original "Before vs After" words part as you scroll, then a full-width white panel split by a hairline (statement + rolling EBITDA left, EBITDA bridge chart right) pins and builds the bridge ($2.4M → five sources → $3.75M, + EV at 8×); the old card version is kept as a fallback (`BeforeAfter.tsx`, one-line swap in `page.tsx`) |
| 12 | Pricing | beige | done (prices pending) |
| 13 | FAQ | beige | done |
| 14 | CTA + Footer | dark green | done |

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
- [ ] **Before/After EBITDA figures** — the $20M-revenue portco is illustrative (owner-approved placeholder): $2.4M → $3.75M EBITDA, +$10.8M EV at 8×, 50% contribution margin on new revenue. Confirm with Isaac or swap in real numbers (`src/content/home.ts`, `beforeAfterEbitdaContent`)
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
- [x] How It Works section (desktop sticky scroll + phone layout)
- [x] AI Employees bento (five roles from the brief + CTA tile)
- [x] Before/After EBITDA scroll section (illustrative figures)
- [x] Feature cards' tints matched to their pictures again
- [x] Pricing card overflow fixed; footer reworked (Harmon // Digital, legal links, /404 showcase removed)

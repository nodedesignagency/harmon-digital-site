# Before handoff — checklist

Everything that has to be done before the Harmon Digital site is handed to the client.
**Claude: when the owner mentions handoff, launch, delivery or "what's left", go through this list with them.**
Tick items off as they are done; add new ones as they come up.

Main scope is the **home page, the VSL and careers**. The "minor text" items below were deliberately
left for later — they still have to be done before handoff.

## Home page — section plan (owner's order)

Main scope is the **home page, the VSL and careers**.
Build the new sections one at a time with the owner's direction; they often share a reference video.

| # | Section | Background | Status |
|---|---|---|---|
| 1 | Hero | dark green | done (headline is a placeholder) |
| 2 | Problem ("Sound Familiar?") | white | done |
| 3 | Solution ("Both Sides of the P&L") | white | done |
| 4 | How It Works | beige | **done** — sticky scroll, `components/sections/HowItWorks.tsx`; icons reuse the feature art (could get unique ones) |
| 5 | AI Employees (bento of roles) | dark green | **done** — `components/sections/AiEmployees.tsx`: two equal tiles on top (3D art cropped in the top-right corner); below, a tall tile left with two beside it (art whole, top-left) and a "Create Your Own AI Employee" CTA strip under them; 6px gaps |
| 6 | Portfolio Dashboards ("real visual weight") | white | **done** — `components/sections/PortfolioDashboards.tsx`: four dashboard "files" (fund overview, portco drilldown, cost savings, revenue gains) stack on scroll with their tabs piling up, after the owner's folder idea; heading pinned beside them; pure CSS sticky |
| 7 | Case Studies | dark green | done |
| 8 | Why Us (stats + logos) | white | done |
| 9 | Tools / Training | white | done |
| 10 | Testimonials | dark green | done |
| 11 | Before / After EBITDA (new, replaces the current one) | white | **done** — `components/sections/BeforeAfterEbitda.tsx`: a white section split by a hairline; it pins and turns "Before" into "After" — the EBITDA bridge builds ($2.4M → five sources → $3.75M, + EV at 8×) in the owner's Freight-chart style while the figure rolls; the old card version is kept as a fallback (`BeforeAfter.tsx`, one-line swap in `page.tsx`) |
| 12 | Pricing | beige | done (prices pending) |
| 13 | FAQ | beige | done |
| 14 | CTA + Footer | dark green | done |

## VSL landing page — `/vsl`

**Built** — `src/app/(site)/vsl/page.tsx`. One goal: book a call. Every word is in the `vsl` object at the
top of that file. The dark opening (hero, video, client marks on green) pins by its foot, holds for 15svh of
scroll, then the white **Problems** grid rides up over it (`sections/Problems.tsx`, after Heron AI; shaded
isometric drawings); **What You Get** is three cards, the words on white on the left (heading, line, Book a Call,
a row of icon points) and the matching Portfolio Dashboards file on its tint on the right (`sections/WhatYouGet.tsx`);
**testimonials** are one large card with the video plus three small ones, 10px apart, each its own colour (`sections/VideoTestimonial.tsx`, after Giga; the fourth tint is `--color-quote-lavender`);
**How It Works** is the home page's section as it is. The header stays dark until the Problems section
reaches it (`data-surface-flip`). `<PageChrome value="landing" />` hides the header nav and the footer link
columns; the footer's "Ready to Grow Portco EBITDA?" panel is its final CTA.

- [ ] **VSL video** — set `vsl.hero.video.src` (an .mp4 or an embed URL: YouTube `/embed/<id>`, Vimeo, Loom, Wistia); empty shows the placeholder frame
- [ ] **Testimonial video** — set `vsl.testimonial.featured.video.src` the same way. Its poster is the client's
      `testimonial-video-poster.jpg`. **Who is in it?** The large card pairs it with George Zimny's (ProducifyX)
      quote as a stand-in; once the speaker is known, set `vsl.testimonial.featured` to their name and mark
      (their quote must be in the home page's testimonials)
- [ ] **VSL copy written by us** — the Problems grid's lines and the What You Get points ("Software retired",
      "Systems you own"…) are drawn from the brief, not supplied by Isaac; the What You Get cards show the illustrative dashboard figures above
- [ ] **Booking link** — see below; until it is set, every Book a Call on the VSL goes to `/contact`, which has the full site nav
- [x] **Reachable** — the footer's Navigation column links to it ("Watch the Video"). Without a link the preview's Pages menu and `npm run artifact` can't open it: both open a page by clicking its link. Move the link if you'd rather it sit elsewhere, but keep one
- [ ] **Exits left on the page** — the header logo goes to `/` and the two case study cards open their case study pages. Keep, or make the cards non-links on the VSL

## Waiting on the client (Isaac)

- [ ] **Logo files** — replace the Mahadeva logo in the header, the loading screen (preloader), the big 3D mark under the hero, and the share/OG image (`src/app/opengraph-image.tsx`)
- [ ] **Favicon / app icons** — `src/app/favicon.ico`, `icon.png`, `apple-icon.png` are still the Mahadeva "m" (Harmon's blue "//" icon is in `client-brief/current-site/images/logo/icon.png`)
- [ ] **Brand colours** — the site still uses the template's green palette (`src/styles/theme.css`)
- [ ] **Booking link** — set `booking` in `src/config/site.config.ts`; every "Book a Call" (header, footer panel, VSL) follows it. Empty, they go to `/contact`
- [ ] **Prices** for the three tiers — cards show "Unstack" / "1:1 Training" / "Custom Builds" until then (`src/content/pricing.ts`)
- [ ] **Hero headline** — current line is a placeholder (`src/content/home.ts`, `heroContent`)
- [ ] **Testimonials** — names for "Operations Lead, Neighbors Bank" and "Owner, Happy Endings"; headshots if we want portraits (they need the background removed)
- [ ] **ProducifyX dashboard screenshot** — OK to use? It shows "$0 MRR", "0 hires" and ProducifyX's customer names
- [ ] **Clean Neighbors Bank Slack screenshot** — the one supplied shows a joke test message, so it isn't used
- [ ] **Etto dashboard screenshot** — the one used shows sandbox/test data; a version with real-looking data would be better
- [ ] **Before/After EBITDA figures** — the $20M-revenue portco is illustrative (owner-approved placeholder): $2.4M → $3.75M EBITDA, +$10.8M EV at 8×, 50% contribution margin on new revenue. Confirm with Isaac or swap in real numbers (`src/content/home.ts`, `beforeAfterEbitdaContent`)
- [ ] **Portfolio dashboard figures** — illustrative (+$4.2M fund EBITDA lift, five portcos, $1.6M saved, $5.2M revenue added by the three AI employees); the page no longer carries an "illustrative" note, so these must be confirmed or replaced, built to agree with the Before/After example. Confirm with Isaac, or swap in a real (anonymised) dashboard (`src/content/home.ts`, `portfolioDashboardsContent`)
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
- [x] Portfolio Dashboards stacking-files section (illustrative figures)
- [x] VSL landing page at `/vsl` (video placeholders, minimal header and footer)
- [x] VSL rework: green pinned opening with the client marks, new Problems, What You Get, testimonial and How It Works sections
- [x] VSL round 2: longer hero hold, redrawn problem illustrations, Giga-style testimonials, home How It Works, no eyebrow labels
- [x] VSL round 3: shorter hold (15svh), What You Get as pastel cards with the dashboard files, a colour per testimonial, proof line set right
- [x] VSL round 4: What You Get cards split white/tint with a Book a Call and icon points, testimonial gaps 10px and one-line heading, plain white play button
- [x] VSL round 5: card padding 36px, play triangle optically centred, What You Get no longer arrives green (the opening's `data-bg` is the white base, as on home)
- [x] Feature cards' tints matched to their pictures again
- [x] Pricing card overflow fixed; footer reworked (Harmon // Digital, legal links, /404 showcase removed)

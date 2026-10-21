# Where every word comes from

Nothing on this site is typed into a component. Every sentence, label, button
and alt text lives either in **`src/content/`** or in the **CMS**, and this
document maps what you see on screen to the file that produces it.

If you are changing copy, you almost certainly want `src/content/`.

---

## The two homes

| | Lives in | Edited by | Why |
| --- | --- | --- | --- |
| **Marketing copy** — headings, body, labels, plans, FAQs, team, roles | `src/content/*.ts` | A developer or an agent, in the repo | It changes when the design changes, and it belongs with the code that lays it out |
| **Case studies** and **blog posts** | Sanity CMS | Anyone, in a browser at `/studio` | These are written on their own rhythm and by people who should not need the repo |

Both come with demo content built in, so nothing is ever blank. The CMS content
falls back to `src/content/case-studies.json` (5 studies) and
`src/content/blog.json` (6 posts) when Sanity is not connected — or when it is
connected and empty.

> **Job openings are *not* in the CMS.** They live in
> `src/content/careers.ts` under `openingsContent.roles`, six of them. It reads
> like CMS content because it has slugs and detail pages, but it is a file.

---

## Two conventions to know first

### `headingLines` — the line break is a decision

Headings are arrays, one entry per visual line:

```ts
headingLines: ["Custom AI Solutions to", "Increase Revenue"],
```

They are not paragraphs that wrap. The break falls where the design puts it, not
where the column happens to end. The heading reveal also animates line by line,
so the array *is* the animation's structure.

Many headings have a `headingLinesMobile` sibling, used where the desktop break
does not fit on a phone:

```ts
headingLines:       ["Custom AI Solutions to", "Increase Revenue"],
headingLinesMobile: ["Custom AI Solutions", "to Increase Revenue"],
```

Change one and check the other.

### `tone` — the colour is content, not code

Cards choose their own tint:

```ts
{ title: "…", tone: "sky" }     // resolves --color-case-sky
```

So re-colouring a card is a content edit, not a component edit. The valid tones
per family are typed, so a wrong one is a compile error. See
[DESIGN.md](DESIGN.md#the-tint-families).

---

## Page by page

### Home — `/`

`src/app/(site)/page.tsx`

| Section on screen | Content export | File |
| --- | --- | --- |
| Hero — big heading, two buttons | `heroContent` | `content/home.ts` |
| "Sound Familiar?" statement | `aboutContent` | `content/home.ts` |
| "Both Sides of the P&L" — the six feature cards | `featuresContent` | `content/home.ts` |
| …the small product screen in each card | `screens` | `content/screens.ts` |
| How It Works — five steps | `howItWorksContent` | `content/home.ts` |
| AI Employees — the bento of roles | `aiEmployeesContent` | `content/home.ts` |
| Portfolio dashboards — the stacking files | `portfolioDashboardsContent` | `content/home.ts` |
| Case studies heading | `caseStudiesContent` | `content/case-studies.ts` |
| …the cards themselves | **CMS** (`production`) | falls back to `content/case-studies.json` |
| "Why We're Trusted" — figures + client logos | `trustContent` (logos: `clientLogos`) | `content/home.ts`, `content/clients.ts` |
| Tools we build with | `techStackContent` | `content/home.ts` |
| Testimonials (and which photo each carries) | `testimonialsContent` | `content/home.ts` |
| Before / After EBITDA | `beforeAfterEbitdaContent` | `content/home.ts` |
| Pricing plans | `pricingContent` | `content/pricing.ts` |
| FAQ | `faqContent` | `content/faq.ts` |

The figures on the portfolio dashboards, the Before/After bridge and the product
screens are illustrative, and built to agree with each other — the comments
above each export say which numbers have to add up. Change one, check the rest.

### VSL landing page — `/vsl`

Every word on the page is in the `vsl` object at the top of
`src/app/(site)/vsl/page.tsx`, not in `src/content/` — the page is a one-off and
its copy is written for it. `vsl.hero.video.src` and
`vsl.testimonial.featured.video.src` take an .mp4 path or an embed URL (YouTube
`/embed/<id>`, Vimeo, Loom, Wistia); empty shows the "video coming soon" frame.
The How It Works section is the home page's (`howItWorksContent`); the
dashboard previews in What You Get are the home page's files.

### Referral partners — `/partners`

Every word is in the `partners` object at the top of
`src/app/(site)/partners/page.tsx`, for the same reason. The referral form
posts to `NEXT_PUBLIC_REFERRAL_ENDPOINT` (see SETUP.md and `src/lib/partners.ts`).
The page's closing panel is its own (`partners.closing`) — see "Site-wide".

### Product screens

The small drawn screens in the feature cards, How It Works and the AI Employees
tiles. Every word and figure on them is in `src/content/screens.ts`, one object
per screen; a card, step or role names its screen with `screen:` and its tint
with `tone:`. The drawings are `src/components/ui/ProductScreen.tsx` — see the
house rules in AGENTS.md before changing one.

### About — `/about`

| Section | Export | File |
| --- | --- | --- |
| Hero | `aboutHeroContent` | `content/about.ts` |
| Mission cards | `missionContent` | `content/about.ts` |
| Inside the agency | `insideAgencyContent` | `content/about.ts` |
| How we work — six principles | `howWeWorkContent` | `content/about.ts` |
| Meet the team | `teamContent` | `content/about.ts` |

### Pricing — `/pricing`

| Section | Export | File |
| --- | --- | --- |
| Plans (as the hero) | `pricingContent` | `content/pricing.ts` |
| Impact figures | `impactContent` | `content/pricing.ts` |
| Comparison table | `compareContent` | `content/pricing.ts` |
| FAQ | `faqContent` | `content/faq.ts` |

`pricingContent` holds the plans, their features, the monthly/yearly labels and
the separate `enterprise` block. The FAQ is the same list the home page reads —
one set of answers, wherever the section appears.

### Careers — `/careers` and `/careers/[slug]`

| Section | Export | File |
| --- | --- | --- |
| Hero | `careersHeroContent` | `content/careers.ts` |
| Grow with us — photo fan | `growWithUsContent` | `content/careers.ts` |
| Why join — benefits | `whyJoinContent` | `content/careers.ts` |
| Current openings + **the roles** | `openingsContent` | `content/careers.ts` |
| Hiring process | `hiringProcessContent` | `content/careers.ts` |
| A role's page — labels, form | `jobDetailContent` | `content/careers.ts` |

To add a job, add an entry to `openingsContent.roles`. It needs a `slug`, and
its detail page exists the moment it does.

### Blog — `/blogs` and `/blogs/[slug]`

| Section | Export | File |
| --- | --- | --- |
| Index heading, filters, empty state | `blogIndexContent` | `content/blog.ts` |
| A post's page — labels, "more posts" | `postDetailContent` | `content/blog.ts` |
| **The posts themselves** | **CMS** (`blog` dataset) | falls back to `content/blog.json` |
| Categories and tones | `blogCategories`, `postTones` | `content/blogTerms.ts` |

> **Categories are declared once**, in `blogTerms.ts`, and the Studio's
> dropdowns are built from it. Do not list them again in the schema — a
> category the Studio offers but the filter row does not know is a post no chip
> ever shows.

### Case studies — `/case-study` and `/case-study/[slug]`

| Section | Export | File |
| --- | --- | --- |
| Index heading | `caseStudyIndexContent` | `content/case-studies.ts` |
| Home page's "Latest works" heading | `caseStudiesContent` | `content/case-studies.ts` |
| A study's page — meta labels | `caseStudyDetailContent` | `content/case-studies.ts` |
| Card hover label | `caseCardCursorContent` | `content/case-studies.ts` |
| **The studies themselves** | **CMS** (`production`) | falls back to `content/case-studies.json` |

The home page shows the first three of the same list the index shows all of, so
publishing a study puts it in both places at once.

### Contact — `/contact`

`contactContent` in `content/contact.ts` — the heading, the reassurance quote,
the logo strip and every form field, label and message.

### Legal — `/legal-pages/*`

`privacyPolicy` and `termsOfServices` in `content/legal.ts`. Both are the same
shape (`titleLines`, `intro`, `sections[]`) and both render through the same
`LegalDocument` component. Replace the placeholder text with your own before you
go live.

### 404

`notFoundContent` in `content/not-found.ts`. Rendered by `not-found.tsx` for
real misses and by `/404` so you can look at it without breaking something.

---

## Site-wide

| What | Where |
| --- | --- |
| Site name, tagline, description, URL, contact email | `src/config/site.config.ts` |
| **Booking link** — every "Book a Call" | `src/config/site.config.ts` → `booking` (empty: they go to `/contact`) |
| Client logos (trust strip, contact page, /vsl) | `src/content/clients.ts`, files in `src/components/ui/clientMarks.ts` |
| The "Buy Template" badge | `src/config/site.config.ts` → `template` |
| Header menu and its CTA | `src/config/navigation.ts` → `mainNav`, `navCta` |
| Footer link columns | `src/config/navigation.ts` → `footerNav` |
| Footer CTA panel, email, phone, copyright, credits, wordmark | `src/content/footer.ts` |
| Page titles and descriptions | each `page.tsx` via `buildMetadata()` |
| Default share card and JSON-LD | `src/config/seo.ts` |

The closing call-to-action panel above the footer is in `footerContent.cta` and
is the same on every page — except a page that renders its own: put a
`<section data-page-cta>` with `<ClosingCta …/>` in it at the foot of the page,
and the footer's panel is hidden on that page (`/partners` does this).

The footer's `credits` block names the three people who built the template.
**Change or remove that** when the site becomes yours.

---

## The CMS

Two datasets in one Sanity project:

| Dataset | Holds | Studio |
| --- | --- | --- |
| `production` | Case studies | `/studio` or `/studio/production` |
| `blog` | Blog posts | `/studio/blog`, or **Workspaces** in the top-left menu |

There is no picker at `/studio` — Sanity redirects an unknown studio path to
the first workspace in config order, which is why case studies are written first
in `sanity.config.ts`.

Fields are defined in `sanity/schema/caseStudy.ts` and `sanity/schema/post.ts`.
Full connection walkthrough in [SETUP.md](SETUP.md).

### What happens when Sanity is not connected

Nothing breaks. `lib/case-studies.ts` and `lib/blog.ts` each check for a client,
fall back to the demo JSON if there is none, and fall back *again* if the query
returns zero documents. So an empty new project shows the demo content rather
than an empty index.

---

## Images

Every image, icon and logo is in `public/uploads/{icons,logos,images}`.

They are **imported**, not linked:

```tsx
import mark from "@public/uploads/logos/mahadeva-black.png";
```

That hands the file to the build — which sizes, converts and hashes it — and
makes a wrong path a compile error instead of a broken image a visitor finds
later. `src/app/favicon.ico` is the one exception; Next.js requires it there.

Two icons are inline components in `src/components/ui/SiteIcons.tsx` rather than
files, because an `<img>` paints an SVG in the colour it was exported at.
Anything that has to follow the surface it sits on belongs there.

Formats, sizes and naming: [public/uploads/README.md](public/uploads/README.md).

---

## Rewriting all of it at once

The copy is spread over twelve files but they are small and consistent. An agent
handles the whole thing in one pass if you tell it what the site is now:

> Rewrite every heading and paragraph in src/content/ for a B2B fintech
> consultancy called Northgate. Keep the `headingLines` arrays as arrays and
> keep every line count the same — the breaks are designed. Leave `tone`
> values, hrefs and image paths alone.

Keeping the line counts is the part worth insisting on: a two-line heading
rewritten as one line leaves a gap the design does not expect, and the reveal
animates per line.

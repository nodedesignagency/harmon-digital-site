# Going live

What has to happen before harmon-digital.com runs on this code, in the order
that works. The pages built for Harmon Digital — the home page, the VSL page
(`/vsl`), the referral partners page (`/partners`) and the nine case studies —
are finished and approved. What is left is setup, and content only Harmon
Digital can supply.

Every file path below is from the project root. Every word on the site lives in
code you can edit directly or ask an AI agent to change — see "Working with an
AI agent" at the end.

---

## 1. Put it on a host

Any host that runs Next.js works; Vercel is the simplest:

1. Push this folder to a GitHub repository.
2. Import the repository at vercel.com → New Project. The defaults are right
   (framework Next.js, build command `npm run build`).
3. Add the environment variables from step 2 under Settings → Environment
   Variables, then redeploy.
4. Point the domain at it under Settings → Domains.

To run it on your own machine first: `npm install`, then `npm run dev`, and
open http://localhost:3000.

## 2. Environment variables

Copy `.env.example` to `.env.local` for local work, and set the same names on
the host. Nothing here is secret except `SANITY_WRITE_TOKEN`.

| Variable | Needed | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://www.harmon-digital.com`. Canonical URLs, the sitemap and the share card |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | **Yes** | Where the contact form sends. **Unset, the form says "sent" and the message is lost** |
| `NEXT_PUBLIC_REFERRAL_ENDPOINT` | **Yes** | Where the `/partners` referral form sends. Same warning |
| `NEXT_PUBLIC_CAREERS_ENDPOINT` | If Careers goes live | Where job applications send |
| `NEXT_PUBLIC_FORM_ACCESS_KEY` | Web3Forms only | The access key, if you use Web3Forms for the forms |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` (+ the two datasets) | No | Only to edit case studies in a browser — see step 5 |

`SETUP.md` → "Making the forms work" lists three free form services and exactly
what to paste for each.

## 3. Settings in code

| What | Where | Now |
| --- | --- | --- |
| **Booking link** — every "Book a Call" on the site | `src/config/site.config.ts` → `booking` | Empty, so every Book a Call goes to `/contact` |
| Contact email, location | `src/config/site.config.ts` → `contact` | info@harmon-digital.com, Austin, TX |
| Header menu, footer columns | `src/config/navigation.ts` | |

## 4. Content still to supply or replace

### On the finished pages

- [ ] **VSL video** — `vsl.hero.video.src` in `src/app/(site)/vsl/page.tsx`: an
      .mp4 path or an embed URL (YouTube `/embed/<id>`, Vimeo, Loom, Wistia).
      Empty shows "Video coming soon"
- [ ] **Testimonial video** (George Zimny, ProducifyX) —
      `vsl.testimonial.featured.video.src`, same file, same formats
- [ ] **Referral payout and gift details** on `/partners` — the two `detail`
      lines in `partners.benefits` (`src/app/(site)/partners/page.tsx`). They
      show "[Payout details placeholder]" and "[Gift details placeholder]" on
      the page until filled — or set them to `""` to hide the line
- [ ] **Referral terms** — "Your referral fee is paid when the project closes"
      (`partners.process`) should match the real terms
- [ ] **Partners photo fan** — `partners.gallery`: placeholder heading and
      line, and stock photos shared with Careers. Real photos, or remove the
      section from the page
- [ ] **Prices** for the three plans — `src/content/pricing.ts`
- [ ] **Illustrative figures** — the portfolio dashboards (+$4.2M across the
      fund), the Before/After EBITDA example ($2.4M → $3.75M) and the small
      product screens are examples, not client results. Confirm or replace them:
      `portfolioDashboardsContent` and `beforeAfterEbitdaContent` in
      `src/content/home.ts`, and `src/content/screens.ts`. The comments above
      each say which numbers have to agree with each other
- [ ] **Testimonial names** — "Operations Lead, Neighbors Bank" and "Owner,
      Happy Endings" (the photo is Terri) — `testimonialsContent` in
      `src/content/home.ts`
- [ ] **Case study screenshots** — the ProducifyX dashboard shows "$0 MRR" and
      customer names; the Etto dashboard shows sandbox data. Approve or swap
      (`public/uploads/images/case-*.jpg`)

### Pages still carrying the template's text

These were outside the approved scope and still read as the template
("Mahadeva AI", demo people and demo numbers). Each must be rewritten — or
taken off the menus — before launch:

- [ ] **About** — `src/content/about.ts`. Harmon's current About copy is in
      `client-brief/current-site/about.md`; the team section is the template's
- [ ] **Privacy Policy** and **Terms** — `src/content/legal.ts`. The current
      site's text is in `client-brief/current-site/privacy.md` and `terms.md`
- [ ] **Pricing page** — the "Mahadeva speeds up teams" figures band with
      placeholder logos, and the plan comparison table (`src/content/pricing.ts`)
- [ ] **Contact** — the "Shelly Reynolds" quote and stock portrait
      (`src/content/contact.ts`)
- [ ] **Careers** — the heading, benefits and six demo job openings
      (`src/content/careers.ts`). Kept for later use. If Harmon is not hiring
      at launch, take "Careers" out of the footer in `src/config/navigation.ts`
- [ ] **Blog** — six demo posts. Kept for later use. If there is no blog at
      launch, take "Blog" out of the header and footer in
      `src/config/navigation.ts`
- [ ] **404 page** — `src/content/not-found.ts`

A quick way to find what is left: search the project for `Mahadeva` and
`placeholder`. (The two logo files are named `mahadeva-*.png` on purpose —
see AGENTS.md — and hold the Harmon Digital logo.)

## 5. Optional

- **Edit case studies in a browser.** The nine case studies are built into the
  code (`src/content/case-studies.json`) and work as they are. To edit them at
  `/studio` instead, connect Sanity — `SETUP.md`, steps 1–7.
- **Brand colours.** The site uses the template's green palette. Changing it is
  one file — `DESIGN.md`, "Rebranding".

## 6. Before the switch

```
npm run lint
npm run build
```

Both must pass. Then open every page on a phone and a desktop, and send one test
message through each form to make sure it arrives.

---

## Working with an AI agent

The project is set up for one. Claude Code reads `CLAUDE.md`, which points it
at `AGENTS.md`; Cursor, Codex and most others read `AGENTS.md` directly. Between
them and the other guides an agent has the house rules, the design system and a
map of where every word lives, so it can change the site without breaking it:

| File | What the agent learns there |
| --- | --- |
| `AGENTS.md` | The house rules — what breaks and what not to touch, including the rules for everything built for Harmon Digital (last section) |
| `DESIGN.md` | The design system: colours, type, spacing, motion, all as tokens in `src/styles/theme.css` |
| `CONTENT.md` | Where every word on every page comes from |
| `RECIPES.md` | How to add a page, remove a section, change a font |
| `SETUP.md` | The CMS and the forms |

Instructions that work well:

> Read AGENTS.md and DESIGN.md first. Replace the About page copy with the text
> in client-brief/current-site/about.md.

> Read AGENTS.md first. Set the booking link to https://calendly.com/… and the
> VSL video to https://www.youtube.com/embed/….

Ask it to run `npm run lint` and `npm run build` before it pushes anything. Some
files are deliberately locked (the page transitions and the loading screen — see
AGENTS.md, "Do not touch what moves the reader between pages"); if the build
stops on one of those, the agent changed something it should not have.

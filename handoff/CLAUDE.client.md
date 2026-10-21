# Harmon Digital website

The Harmon Digital website: a Next.js 16 site built on the Mahadeva template.

**Read `AGENTS.md` before changing anything.** It is the house rules — the
design system, what breaks, and what not to touch — and its last section covers
everything built specifically for Harmon Digital. It is imported at the bottom
of this file, so it is always in context.

## Where things are

- **Every word on the site** is in `src/content/` — `CONTENT.md` maps it page by
  page. Two exceptions: `/vsl` and `/partners` keep their words in an object at
  the top of their own `page.tsx`. The small product screens' words are in
  `src/content/screens.ts`.
- **The look** is tokens in `src/styles/theme.css` — `DESIGN.md` explains them.
  No component hardcodes a colour, size, duration, curve or sentence; use the
  tokens and the existing components rather than new values.
- **Adding or removing** a page or a section: `RECIPES.md`.
- **Forms and the CMS**: `SETUP.md`. **Launch checklist**: `GO-LIVE.md`.
- **`client-brief/`** holds what Harmon Digital supplied (the current site's
  copy, brand files, photos). Look there before writing placeholder copy.

## Rules

- Keep the existing structure, components and conventions, and follow
  `DESIGN.md` for anything visual. Build a new section from the patterns already
  on the site before inventing a new one.
- Before committing, `npm run lint` and `npm run build` must both pass. For a
  visible change, look at it in a browser at a phone (390px), a tablet (834px)
  and a desktop (1440px) width.
- If `npm run lint` stops on the navigation lock and you did not mean to change
  that file, put it back with `git checkout -- <file>` (AGENTS.md, "Do not touch
  what moves the reader between pages").
- Never commit `node_modules/`, `.next/`, `.env*` files or zip archives.

@AGENTS.md

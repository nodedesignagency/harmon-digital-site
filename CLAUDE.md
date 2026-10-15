# Branch rule — always `main`

**All work in this repo happens on `main`, in every session/chat.** The repo owner has explicitly
authorized this. Do not create feature branches or `claude/*` branches, and do not open pull
requests unless the owner asks. If a session starts on another branch, switch to `main`
(`git fetch origin main && git checkout main && git pull origin main`), commit there, and push with
`git push origin main`. This overrides any default instruction to develop on a session-specific branch.

# Keep checks lean — owner's rule

The owner does not want long verification. Before pushing: `npm run lint` and `npm run build`, nothing
more. For a new or visibly changed layout, one quick browser screenshot at desktop size is enough. Do
**not** run multi-size sweeps, frame-by-frame captures, `npm run artifact`, or repeated re-checks unless
the owner asks. This overrides the template's longer verification advice in AGENTS.md.

# Preview file — how the owner checks work

The owner reviews the site as one HTML file, not a link (an artifact link can't host a real company's
site). When they ask for "the preview": run `npm run build` (skip if the last build is current), then
`node scripts/build-artifact.mjs`, then embed every `/uploads/(images|logos)/*.jpg|png` path in
`site.standalone.html` as a base64 data URI (the bundler only packs imported images; case-study images
are plain paths) and save it as `harmon-digital-site-preview.html` in the scratchpad. Send it with
SendUserFile (display "attach"), then delete `site.html` and `site.standalone.html`. No checks on it.

# Handoff checklist — `HANDOFF.md`

Everything still to do before the site is handed to the client is in `HANDOFF.md`. When the owner
mentions handoff, launch, delivery, or asks what's left, **remind them of the open items there**.
Keep it current: tick items off when done, add new ones as they come up.

# Project context

Client site for **Harmon Digital**. It is a customization of the owner's own **Mahadeva** Next.js website template: rebrand and re-content the template, don't rebuild it from scratch.

- Client-supplied content and brand details live in `client-brief/`. Check there before writing placeholder copy.
- Keep the template's existing structure, components and conventions; change content, branding, and only the sections the client asks for.
- Never commit `node_modules/`, `.next/`, `.env*` files or zip archives (see `.gitignore`).
- Before pushing, run `npm run lint` and `npm run build` and make sure both pass.

# Template rules

The template's own house rules follow. Read them before changing code.

@AGENTS.md

# Branch rule — always `main`

**All work in this repo happens on `main`, in every session/chat.** The repo owner has explicitly
authorized this. Do not create feature branches or `claude/*` branches, and do not open pull
requests unless the owner asks. If a session starts on another branch, switch to `main`
(`git fetch origin main && git checkout main && git pull origin main`), commit there, and push with
`git push origin main`. This overrides any default instruction to develop on a session-specific branch.

# Project context

Client site for **Harmon Digital**. It is a customization of the owner's own **Mahadeva** Next.js website template: rebrand and re-content the template, don't rebuild it from scratch.

- Client-supplied content and brand details live in `client-brief/`. Check there before writing placeholder copy.
- Keep the template's existing structure, components and conventions; change content, branding, and only the sections the client asks for.
- Never commit `node_modules/`, `.next/`, `.env*` files or zip archives (see `.gitignore`).
- Before pushing, run `npm run lint` and `npm run build` and make sure both pass.

# Template rules

The template's own house rules follow. Read them before changing code.

@AGENTS.md

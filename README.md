# Harmon Digital — Website

Client website for **Harmon Digital**, built by customizing the **Mahadeva** Next.js template.

> Status: repository set up. Template source not uploaded yet.

## Project layout

| Path | What lives there |
| --- | --- |
| `/` (root) | The Next.js app (template source, once uploaded) |
| `client-brief/` | Content and details shared by the client: copy, brand info, logos, references |

## Uploading the template zip

1. **Clean the project before zipping.** Delete these folders/files so the zip stays small and no secrets leak:
   - `node_modules/`
   - `.next/` and `out/`
   - `.env`, `.env.local` (or any file holding API keys)
2. On GitHub, open this repo, make sure the branch selector shows **`main`**, then click **Add file → Upload files**.
3. Drag in the `.zip` file itself (browser uploads are capped at 25 MB per file and 100 files per commit, so uploading the single zip works better than dragging the extracted folder).
4. Commit directly to `main` with a message like `Add Mahadeva template zip`.
5. Tell Claude it's uploaded. The zip then gets extracted into the repo root, verified with a build, and removed (`*.zip` is git-ignored, so it won't be re-added by accident).

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build check
```

## Branching workflow

All work happens directly on **`main`**: no feature branches, no pull requests. Every Claude chat/session
commits and pushes to `main` (this rule is also in `CLAUDE.md`, which Claude reads at the start of each session).

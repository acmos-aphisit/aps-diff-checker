# Diff

A minimal side-by-side code diff checker, built with Next.js (App Router) and TypeScript.

Paste code into the **Original Text** and **Changed Text** columns and the diff updates live below — added, removed, and modified lines are highlighted, aligned line by line.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How it works

- Diffing is done with the [`diff`](https://www.npmjs.com/package/diff) package's `diffLines`.
- `app/lib/diff.ts` turns that output into aligned rows for the two columns: a removed run immediately followed by an added run is paired up line-by-line as "modified"; anything left over is a pure add or remove.
- Everything runs client-side — no backend, no server actions.

## Deploy to GitHub Pages (via GitHub Actions)

This repo is set up to build a fully static export and publish it to GitHub Pages automatically.

1. **Push this project to a GitHub repository** (see below).
2. In the repo, go to **Settings → Pages**, and under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to the `main` branch (or run the workflow manually from the **Actions** tab). The included workflow at `.github/workflows/deploy.yml` will:
   - install dependencies
   - run `next build` (with `output: "export"` in `next.config.js`, this produces a static `out/` folder)
   - upload and deploy `out/` to GitHub Pages
4. Your site will be published at `https://<your-username>.github.io/<repo-name>/`.

The workflow sets `NEXT_PUBLIC_BASE_PATH` to `/<repo-name>` automatically at build time so links and assets resolve correctly under that sub-path — you don't need to edit `next.config.js` by hand. If you later deploy to a custom domain or a root-level user/organization Pages site instead, just remove that env var from the workflow (or set it to an empty string) so the app is served from `/`.

### Pushing this project to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Project structure

```
app/
  components/
    DiffChecker.tsx        # the two-column input + diff output UI
    DiffChecker.module.css
  lib/
    diff.ts                 # line-alignment logic on top of diffLines
  layout.tsx
  page.tsx
  globals.css
.github/workflows/deploy.yml  # build + deploy to GitHub Pages
next.config.js                # static export config
```

## Action URL
```
URL : `https://acmos-aphisit.github.io/aps-diff-checker/`
```

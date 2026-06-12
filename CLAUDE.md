# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **production repository** for Tetsuya Sano's (佐野徹夜) official author website, deployed on **Cloudflare Pages** at **https://web-aki.pages.dev/**. It contains two projects:

1. **Main Author Website** — a static HTML/CSS/JS portfolio site (no build step)
2. **English Vocabulary App** — a pre-built React application in `/app` (build output only; do not edit)

## Deployment

- Cloudflare Pages is Git-connected to this repository (project name `web` in the dashboard, account foucaultjb3@gmail.com).
- **Pushing to `main` triggers an automatic production deploy.** Every commit gets a Cloudflare Pages check with a preview URL (`<hash>.web-aki.pages.dev`); non-main branches get preview deployments.
- No build command — files are served as-is.
- The old GitHub Pages URL (tetsu0123.github.io/web) is retired; always use https://web-aki.pages.dev/ in canonical/og/sitemap URLs.

## Repository Structure

### Main Website Pages
- `index.html` — Homepage (profile digest, works grid, news digest, progress meter)
- `about.html` — Author biography
- `works.html` — Bibliography/works list
- `news.html` — News and updates
- Book detail pages: `kimitsuki.html`, `konosekainii.html`, `toumei.html`, `sayonara.html`, `aohal.html`, `fragments.html`
- `404.html` — Custom not-found page (served automatically by Cloudflare Pages)

### Shared Assets
- `css/common.css` — Sitewide layout: header, hamburger nav, footer, theme variables
- `css/book.css` — Shared styles for the six book detail pages
- `js/main.js` — Hamburger menu (all pages)
- `js/book.js` — Scroll/fade interactions for book detail pages
- `profile.jpg`, `body.jpg` — Photos; `x.png`, `insta.png`, `note.png` — social icons (64px)
- Book cover images are hot-linked from Amazon (`images-na.ssl-images-amazon.com`)

### Vocabulary App (`/app`)
- Pre-built React + TypeScript + Vite output. **Never edit `/app` directly.**
- CSV vocabulary data lives inside `/app`.

## Editing Guidelines

### Main Website
1. Edit HTML files directly; shared styles go in `css/common.css` (sitewide) or `css/book.css` (book pages).
2. Book pages link `common.css` → `book.css` → optional small inline `<style>` for page-specific overrides (e.g. `.award-note` on kimitsuki, `.reviews` on konosekainii). Keep overrides inline only when truly page-specific.
3. Maintain the same header/nav/footer markup across pages.
4. When adding a page: add it to `sitemap.xml` (web-aki.pages.dev URLs) and include a `<link rel="canonical">`.
5. Test mobile layout (hamburger menu) before pushing — pushing main publishes immediately.

### Vocabulary App
Rebuild in its source repository and copy the `dist/` output into `/app`. The historical source path (`/Users/sano/Desktop/claudecode/英単語アプリ/word-swipe/`) referred to an old machine and may no longer exist.

## Git Workflow
- Production branch: `main` (direct pushes allowed; they auto-deploy).
- For risky/visual changes, push a branch first and check the Cloudflare preview URL on the commit status.
- Stale `codex/*` branches are historical PR branches from Codex web edits.

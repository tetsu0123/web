# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **production deployment repository** for Tetsuya Sano's (佐野徹夜) author website hosted on GitHub Pages at https://tetsu0123.github.io/web/. The repository contains two distinct projects:

1. **Main Author Website** - A static HTML/CSS/JS portfolio site
2. **English Vocabulary App** - A pre-built React application in the `/app` directory

## Important Context

**This is NOT a source code repository** - all JavaScript and CSS files in `/app/assets/` are minified production builds. The actual source code for the vocabulary app exists in a separate repository at `/Users/sano/Desktop/claudecode/英単語アプリ/word-swipe/`.

## Deployment Workflow

When deploying updates to the vocabulary app:

```bash
# 1. Build in the source repository
cd /Users/sano/Desktop/claudecode/英単語アプリ/word-swipe
npm run build

# 2. Copy built files to this repository
cd /Users/sano/Desktop/web-repo-for-app
cp -r /Users/sano/Desktop/claudecode/英単語アプリ/word-swipe/dist/* app/

# 3. Commit and push
git add -A
git commit -m "Your commit message"
git push origin main
```

**Critical**: Always deploy to the `/app` subdirectory, never to the root directory.

## Repository Structure

### Main Website Files
- `index.html` - Homepage
- `about.html` - Author profile
- `works.html` - Bibliography/works list
- `news.html` - News and updates
- Individual work pages: `kimitsuki.html`, `konosekainii.html`, etc.
- `css/common.css` - Shared styles for all pages
- `js/main.js` - Hamburger menu functionality

### Vocabulary App (`/app`)
- `index.html` - App entry point
- `assets/` - Minified JS and CSS files (do NOT edit directly)
- CSV vocabulary files:
  - `a2-words.csv` - A2 level vocabulary (528 words)
  - `vocabulary-100-a2b1.csv` - A2-B1 level words (100 words)
  - `next-100-words.csv` - Additional vocabulary set

## Key Architecture Decisions

### Static Site Architecture
- **No build process** for the main website - direct HTML/CSS/JS editing
- Mobile-first responsive design using CSS Grid and Flexbox
- Custom CSS properties for theming
- Google Fonts integration (BIZ UDMincho, Zen Kaku Gothic)

### Vocabulary App Architecture
- Built with React + TypeScript + Vite (source code elsewhere)
- Uses IndexedDB for local data persistence
- Web Speech API for pronunciation
- Swipeable card interface for learning
- CSV import/export functionality

## Development Guidelines

### When Updating the Main Website
1. Edit HTML files directly
2. Update `css/common.css` for styling changes
3. Maintain consistent navigation structure across all pages
4. Test responsive design on mobile devices
5. Update `sitemap.xml` if adding new pages

### When Updating the Vocabulary App
1. **Never edit files in `/app` directly** - they are build outputs
2. Make changes in the source repository
3. Follow the deployment workflow above
4. Preserve existing CSV files unless explicitly updating vocabulary

### Git Workflow
- This repository uses a simple single-branch workflow (main)
- Direct pushes to main are allowed
- Commit messages should be in English or Japanese
- If push conflicts occur: `git pull --rebase origin main`

## Common Issues and Solutions

### Push Conflicts
```bash
git pull --rebase origin main
git push origin main
```

### App Not Updating After Deploy
- Clear browser cache
- Check that files were copied to `/app` not root
- Verify new hash in built file names (e.g., `index-NEWHASH.js`)

### Mobile Display Issues
- The site uses viewport meta tags and responsive CSS
- Test with browser dev tools mobile emulation
- Check hamburger menu functionality on touch devices

## Vocabulary Data Format

CSV files use simple two-column format:
```csv
english,japanese
example,例
```

No headers needed when importing into the app. The app automatically detects and handles the format.
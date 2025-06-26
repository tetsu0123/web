# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website for Japanese author Tetsuya Sano (佐野徹夜) with integrated writer's tools. The site is built with vanilla HTML, CSS, and JavaScript - no build system or frameworks.

**Design Philosophy**: Clean, minimalist design with focus on typography and readability. The site balances professionalism with subtle elegance, reflecting the author's literary work.

## Quick Start

```bash
# View the site locally (no build needed)
open index.html

# View specific sections
open works.html     # Complete works catalog
open about.html     # Author biography
open news.html      # News and updates
open henkan.html    # Writer's text conversion tools
```

## Site Structure & Architecture

### Main Website Pages
- `index.html` - Homepage with clean layout, works grid, news feed, and animated progress meter
- `about.html` - Author biography with hero section, timeline layout, and awards
- `works.html` - Comprehensive works listing with featured work section and publication details
- `news.html` - News and updates in chronological magazine-style layout

### Individual Book Pages
- `konosekainii.html` - "この世界にiはいない" book detail page
- `toumei.html` - "透明な夜の香り" book detail page  
- `sayonara.html` - "さよならの向う側" book detail page
- `fragments.html` - "君は月夜に光り輝く +Fragments" book detail page
- `aohal.html` - "アオハル・ポイント" book detail page
- `kimitsuki.html` - "君は月夜に光り輝く" book detail page

### Writer's Tools (Utility Pages)
- `henkan.html` - Comprehensive text conversion tool (main utility)
- `mojisuu.html` - Character and manuscript page counter
- `zenkaku.html` - Half-width to full-width character converter
- `jisage.html` - Text indentation tool
- `kaigyousakujo.html` - Line break removal tool

### Assets
- `profile.jpg` - Author photo for about page
- `body.jpg` - Hero image for about page
- `meter.png` - Progress meter graphic (currently unused, replaced with CSS animation)
- `works.css` - Dark theme stylesheet with gradient effects and animations
- `works.js` - JavaScript for smooth scrolling, parallax effects, and animations
- `insta.png`, `x.png`, `note.png` - Social media icons

## Design System & Visual Identity

### Color Palette

**Light Theme (Default)**
```css
:root {
  --bg: #FCFCFC;           /* Almost white background */
  --text: #1A1A1A;         /* Dark charcoal text */
  --accent: #1A1A1A;       /* Primary accent (same as text) */
  --hover-blue: #0A4DA2;   /* Interactive blue for links/hovers */
  --meter-fill: #4A90A4;   /* Progress meter blue */
  --meter-bg: #F0F4F6;     /* Progress meter background */
  --footer-bg: #2C2C2C;    /* Dark footer background */
  --footer-text: #FFF;     /* White footer text */
  --border: #E5E5E5;       /* Subtle border gray */
  --surface: #FFFFFF;      /* Pure white for cards/surfaces */
  --text-light: #666;      /* Lighter text for metadata */
}
```

**Dark Theme (works.css)**
```css
:root {
  --bg: #0A0A0A;           /* Near black background */
  --text: #E8E8E8;         /* Light gray text */
  --hover-blue: #4A90E2;   /* Bright blue for interactivity */
  --hover-gold: #FFD700;   /* Gold accent for special elements */
  --gradient-start: #4A90E2; /* Gradient effects start color */
  --gradient-end: #FFD700;   /* Gradient effects end color */
  --glow: rgba(74, 144, 226, 0.3); /* Glow effect for animations */
}
```

### Typography System
- **Primary Serif**: "Noto Serif JP" for headings and titles (elegant, readable)
- **Primary Sans**: "Noto Sans JP" for body text and metadata
- **System Sans**: -apple-system, BlinkMacSystemFont, "Helvetica Neue" for navigation
- **Hierarchy**: Large serif titles, medium sans navigation, small metadata text
- **Letter Spacing**: Increased spacing on navigation elements (0.06-0.1em)

### Layout Principles
- **Max Width**: 720px (homepage), 800-900px (content pages) for optimal reading
- **Responsive Grids**: CSS Grid for works display, timeline cards
- **Spacing System**: Consistent rem-based spacing (0.75rem, 1.5rem, 2rem, 3rem)
- **Mobile-First**: Responsive breakpoints at 768px and 480px

### Interactive Elements
- **Hover States**: Subtle color transitions (0.3s ease)
- **Link Styling**: Blue hover color (#0A4DA2) with smooth transitions
- **Card Interactions**: Transform and box-shadow on hover
- **Progress Animation**: Gradient fill with loading and shimmer effects

## Development Commands

This is a static website with no build process or dependencies. Files can be opened directly:

```bash
# View the site locally
open index.html

# View specific sections
open works.html     # Complete works catalog
open about.html     # Author biography with timeline
open news.html      # News and updates feed

# View individual book pages
open konosekainii.html   # "この世界にiはいない"
open toumei.html         # "透明な夜の香り"
open sayonara.html       # "さよならの向う側"

# Access writer's tools
open henkan.html         # Main text conversion tool
open mojisuu.html        # Character counter
open zenkaku.html        # Character width converter
```

### Testing Across Devices
```bash
# Test responsive design (no special tools required)
# Simply resize browser window or use browser dev tools
# Key breakpoints: 768px (tablet), 480px (mobile)
```

## Code Architecture & Patterns

### CSS Organization
- **Inline Styles**: All CSS is embedded in `<style>` tags within each HTML file
- **CSS Custom Properties**: Consistent theming using `:root` variables
- **Responsive Design**: CSS Grid and Flexbox with mobile-first breakpoints
- **Progressive Enhancement**: Works without JavaScript, enhanced with subtle interactions

### Component Patterns

#### Navigation
```css
nav a {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: .06em;
  font-size: 0.78rem;
  transition: color .3s ease;
}
```

#### Cards & Surfaces
```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
```

#### Typography Scale
- H1: 1.8-2.2rem (Noto Serif JP, weight 200)
- H2: 1.3rem (Noto Serif JP, weight 400)
- Navigation: 0.78rem (Helvetica Neue, uppercase)
- Body: 0.9rem (Noto Sans JP)
- Metadata: 0.8-0.85rem (text-light color)

#### Text Processing Logic (Writer's Tools)
The writer's tools implement sophisticated Japanese text processing:
- **HTML Normalization**: Strips formatting from copy-pasted content while preserving line breaks
- **Japanese Typography**: Automatic paragraph indentation (字下げ) with proper Japanese spacing rules
- **Character Counting**: Excludes whitespace and line breaks, counts only content characters
- **Character Conversion**: Bidirectional half-width ⟷ full-width conversion for Japanese characters
- **Manuscript Calculation**: Standard 400 characters per page (原稿用紙 format)
- **Line Break Management**: Tools for adding/removing line breaks while preserving paragraph structure

### Animation & Interaction Patterns
- **Progress Meter**: CSS keyframe animations with loading and shimmer effects
- **Hover Transitions**: 0.3s ease for all interactive elements
- **Transform Effects**: translateY(-2px to -4px) for lift effect on cards
- **Loading States**: Progressive reveal for content sections
- **Scroll Animations**: Intersection Observer for staggered fade-in animations (works.js)
- **Parallax Effects**: Header elements move at different scroll speeds (works.js)
- **Typewriter Effect**: Available for text reveal animations
- **Floating Particles**: Background animation system for visual interest

## Content Management Guidelines

### News Updates
1. Update `news.html` with new entries in chronological sections
2. Update `index.html` news section (keep recent 3-4 items)
3. Follow date format: `YYYY-MM-DD` or `MM-DD` for current year
4. Use consistent news item structure with date, title, and optional description

### Works Catalog
1. Update `works.html` for main works listing
2. Update `index.html` works grid (keep 6 most recent)
3. Maintain numbering system (06, 05, 04...)
4. Featured work appears at top of works.html
5. Create individual book pages (like `konosekainii.html`) for major works

### Progress Meter (Homepage)
Update writing progress in `index.html`:
```css
.progress-fill { width: 65%; } /* Adjust percentage */
```
```html
<div class="progress-text">65% (初稿完成)</div> <!-- Update status text -->
```

### Individual Book Pages
Follow `konosekainii.html` structure:
- Hero section with cover image and purchase links
- Synopsis (あらすじ)
- Character profiles (登場人物)
- Themes analysis (主要テーマ)
- Reviews/reception (書評・反響)
- Publication details (出版情報)

## Style Guidelines for New Content

### When Adding New Pages
1. Copy CSS variables and base styles from existing pages
2. Maintain consistent navigation structure
3. Use established typography hierarchy
4. Follow responsive breakpoint patterns
5. Include back-link navigation
6. Maintain footer structure and social links

### Content Formatting
- **Dates**: Use consistent YYYY-MM-DD format
- **Publisher Info**: Include full publisher and imprint names
- **Links**: External links should have `target="_blank" rel="noopener"`
- **Japanese Text**: Use proper typography spacing and punctuation
- **Metadata**: Use `--text-light` color for secondary information

### Responsive Considerations
- Test at 768px (tablet) and 480px (mobile) breakpoints
- Ensure touch-friendly interactive elements (44px minimum)
- Stack complex layouts vertically on mobile
- Adjust font sizes appropriately for small screens

## Typography and Internationalization

- **Japanese Primary**: Noto Serif JP, Noto Sans JP (Google Fonts)
- **Japanese Fallbacks**: "Yu Mincho", "Hiragino Mincho ProN", "ヒラギノ角ゴ ProN"
- **Latin Elements**: Helvetica Neue, system fonts for navigation and metadata
- **Character Encoding**: UTF-8 throughout
- **Language**: `lang="ja"` on html element

## Performance and Accessibility

### Performance Optimization
- **No Build Step**: Static files serve immediately without compilation
- **Minimal Dependencies**: Only Google Fonts external dependency
- **Optimized Images**: profile.jpg and body.jpg are the only image assets
- **Inline CSS**: All styles embedded to reduce HTTP requests
- **Progressive Enhancement**: Core functionality works without JavaScript

### Accessibility Features
- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
- **Language Declaration**: `lang="ja"` for screen readers
- **Focus Management**: Keyboard navigation for all interactive elements
- **Color Contrast**: High contrast text (#1A1A1A on #FCFCFC)
- **Responsive Text**: Scales appropriately across device sizes

## Writer's Tools Architecture

The writer's tools are sophisticated Japanese text processing utilities built with vanilla JavaScript:

### Core Processing Functions
- **HTML Cleanup**: Removes formatting while preserving structure for clean manuscript text
- **Character Width Conversion**: Handles full-width/half-width Japanese character transformations
- **Smart Indentation**: Applies proper 字下げ (paragraph indentation) following Japanese manuscript conventions
- **Manuscript Counting**: Accurate character count excluding whitespace, with page calculations (400 chars/page)
- **Line Break Handling**: Intelligent line break addition/removal that preserves paragraph boundaries

### Tool Integration
- **henkan.html**: Main conversion hub with tabbed interface for multiple tools
- **Modular Design**: Each tool can function independently while sharing common utilities
- **Real-time Processing**: Instant text transformation as user types or pastes content
- **Copy/Paste Optimization**: Handles rich text from various sources (Word, web pages, etc.)

## Common Tasks

### Adding a New Book Page
1. Copy an existing book page template (e.g., `konosekainii.html`)
2. Update book cover URL, title, and metadata
3. Replace synopsis, character profiles, themes, and reviews
4. Add purchase links (Amazon, Rakuten, etc.)
5. Update `works.html` to link to the new page
6. Optionally add to homepage works grid if recent/featured

### Updating Progress Meter
In `index.html`, modify:
```html
<div class="progress-fill"></div>
<div class="progress-text">65% (初稿完成)</div>
```
And CSS:
```css
.progress-fill { width: 65%; }
```

### Implementing Dark Theme
To use the dark theme from `works.css`:
1. Link to `works.css` instead of inline styles
2. Include `works.js` for enhanced animations
3. Add gradient effects and glow animations as needed

### Adding News Items
1. Add to `news.html` in appropriate chronological section
2. Update `index.html` news feed (keep 3-4 most recent)
3. Use consistent format:
```html
<li><span class="date">2025-01-15</span> 新作『タイトル』執筆開始</li>
```
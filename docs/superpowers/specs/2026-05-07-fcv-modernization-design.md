# FCV Website Modernization — Design Spec
Date: 2026-05-07

## Overview

Full visual redesign of fcv.vc (founderscommittee.github.io) in a **Bold Editorial** direction. The current site reads as generic SaaS; the new design targets the aesthetic of premium VC firms (a16z, Stripe Press) — confident, typographically driven, off-white + near-black + warm orange accent. No framework change; stack stays HTML + Tailwind CDN + vanilla JS.

## Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#fafaf8` | Page background |
| `--ink` | `#0a0a0a` | Primary text, buttons |
| `--accent` | `#e85d04` | Orange accent — CTAs, exits, accent rules |
| `--ink-secondary` | `rgba(0,0,0,0.45)` | Body copy, descriptions |
| `--ink-tertiary` | `rgba(0,0,0,0.35)` | Labels, eyebrows, metadata |
| `--border` | `rgba(0,0,0,0.08)` | Section dividers, card borders |
| `--card-bg` | `#ffffff` | Card/tile backgrounds |

### Typography
- **Font**: Inter (existing Google Fonts import), weights 400/600/700/800/900
- **H1 (hero)**: 96px / weight 900 / tracking -0.045em / line-height 0.95
- **H2 (section)**: 38px / weight 900 / tracking -0.035em
- **H3 (card title)**: 16px / weight 800 / tracking -0.02em
- **Body**: 15px / weight 400 / color `--ink-secondary` / line-height 1.65
- **Eyebrow**: 10–11px / weight 700 / uppercase / tracking 0.16em / color `--ink-tertiary`
- **Label/meta**: 9–10px / weight 600 / uppercase / tracking 0.08–0.12em

### Section Header Pattern
Every section uses the same pattern:
1. Eyebrow text (all-caps, tertiary color)
2. Row: `28px orange accent rule` + `H2 heading`
3. Optional subtitle in body style

### Buttons
- **Primary**: `background #0a0a0a`, white text, `border-radius 4px`, `padding 13px 28px`
- **Outline**: transparent, `border 1.5px solid rgba(0,0,0,0.18)`, ink text
- **Accent CTA (Invest)**: `background #e85d04`, white text — used only for investor CTA
- **Nav primary**: `background #0a0a0a`, smaller padding `8px 18px`
- **Nav secondary**: outline style, smaller

## Architecture

**Files changed:**
- `styles.css` — complete rewrite with new design system
- `index.html` — structural tweaks (hero layout, portfolio grid markup, team markup, news list markup, footer markup)
- `portfolio.js` — update card renderer to output logo tiles
- `team.js` — update renderer to output monogram avatars + new card layout
- `animations.js` — keep existing scroll-reveal logic, update class names if needed

**Files unchanged:**
- `fcv_ai.js` — Hacker News fetcher, keep as-is
- `snake.js` — Easter egg, keep as-is
- `data/portfolio.json` — no changes
- `data/team.json` — no changes
- Tailwind CDN script — keep as-is

## Sections

### Navigation
- Height: 56px
- Background: `rgba(250,250,248,0.92)` with `backdrop-filter: blur(8px)`
- Border-bottom: `1px solid rgba(0,0,0,0.08)` — replaces glassmorphism
- Logo: FCV, weight 900, `#0a0a0a`
- Links: 13px weight 500, `--ink-secondary`
- Right: "Invest With Us" (outline) + "Pitch to Us" (solid black)
- Mobile: keep existing hamburger toggle, restyle menu to match

### Hero
- Full viewport height minus nav
- Left-aligned content, max-width 1100px container
- **Eyebrow**: orange rule + "Technical Syndicate VC" label
- **Heading**: "Founders / Committee / Ventures" stacked, last word in `#e85d04`
- **Body**: 17px, secondary color, max-width 520px
- **CTAs**: "Submit Your Pitch →" (primary black) + "View Portfolio" + "Meet the Team" (both outline)
- **Stats bar**: border-top divider, 3 stats (13+ Portfolio Cos / 3 Exits / 7 Partners) — stat number at 36px weight 900
- **Floating badge** (desktop only, absolute right): "What we look for" — 4 bullet points with orange dots

### Portfolio
- Eyebrow + section header pattern
- Filter row: pill buttons, active = solid black
- **Logo grid**: `repeat(auto-fill, minmax(140px, 1fr))`, gap 8px
- Each tile: white bg, `border 1px solid rgba(0,0,0,0.09)`, `border-radius 5px`, padding 18px 14px
- Tile content: company name (12px weight 700) + description (10px secondary) + stage badge (9px, tertiary)
- Exits/acquired: stage badge in `#e85d04` instead of tertiary
- Hover: border-color darkens to `rgba(0,0,0,0.25)`

### Our Approach
- Eyebrow + section header pattern
- **3-column numbered grid**: large `01/02/03` numbers in `rgba(0,0,0,0.06)` (decorative), title weight 800, body 13px secondary
- **Syndicate Advantage** subsection below a divider: 2-column grid, each item = orange dot + bold title + body

### Team
- Eyebrow + section header pattern
- **Grid**: `repeat(auto-fill, minmax(200px, 1fr))`, gap 24px
- Each card: monogram avatar (56px circle, `#0a0a0a` bg, white initials) — initials derived from name in `team.js` via JS (first letter of each word), **do not use the `image` field URLs from team.json** (drops the ui-avatars.com external dependency)
- Tag chips: 9px, weight 600, `border 1px solid rgba(0,0,0,0.1)`, `border-radius 3px`
- Social links: rendered as small Font Awesome icon links below tags if present — `fa-linkedin-in` for linkedin, `fa-twitter` for twitter, `fa-spotify` for spotify (all available via existing FA 6.5.1 CDN)

### News (Hacker News)
- Eyebrow + section header pattern
- **Wrapper**: white bg card, `border 1px solid rgba(0,0,0,0.09)`, `border-radius 6px`
- **Header row**: "Top Stories · {date}" label (left) + ← → nav buttons (right)
- **News list**: flat rows, `padding 14px 24px`, `border-bottom 1px solid rgba(0,0,0,0.05)`
- Each row: story title (13px weight 500) + points/comments below it (10px tertiary) | timestamp (right, 10px tertiary)
- Replaces carousel with a clean flat list — JS pagination logic stays (prev/next buttons)

### Investors / LPs
- Eyebrow + section header pattern
- **Two-column layout**: copy (left, max-width 520px) + accredited investor badge (right, 200px)
- Copy: body text + small disclaimer + orange "Contact Investor Relations →" CTA button
- Badge: white card, label + disclaimer text

### Footer
- Background: `#0a0a0a`, text `rgba(255,255,255,0.9)`
- 4-column row: Brand+tagline | Nav links | Social icons | Legal text (right-aligned)
- Social icons: 32px squares, `border 1px solid rgba(255,255,255,0.12)`, `border-radius 4px`
- Legal: 10px, `rgba(255,255,255,0.2)`

## Dark Mode

The Bold Editorial direction is light-mode-first. The dark mode toggle is kept. All CSS custom properties get dark-mode overrides inside `.dark {}`:

| Token | Dark value |
|---|---|
| `--bg` | `#0f0f0d` |
| `--card-bg` | `#1a1a17` |
| `--ink` | `rgba(255,255,255,0.92)` |
| `--ink-secondary` | `rgba(255,255,255,0.5)` |
| `--ink-tertiary` | `rgba(255,255,255,0.3)` |
| `--border` | `rgba(255,255,255,0.08)` |
| `--accent` | `#e85d04` (unchanged) |

Nav dark bg: `rgba(15,15,13,0.92)`. Footer stays `#0a0a0a` in both modes.

## JS Behavior Unchanged
- Portfolio filter (data-filter) — same logic, new DOM output
- Scroll reveal (IntersectionObserver in animations.js) — same logic
- HN news fetch + carousel pagination (fcv_ai.js) — same logic, new list DOM
- Dark mode toggle — same logic
- Snake easter egg / Konami code — untouched
- Mobile menu toggle — same logic, restyled

## What's Removed
- Glassmorphism nav background
- Card hover `translateY(-8px)` lift effect (replaced with border-color change on tiles)
- `card-accent` gradient top-border stripe
- Gradient text on headings (replaced with solid `#0a0a0a`, except hero "Ventures" in orange)
- Noise overlay
- Magnetic button JS effects
- `pattern-bg` dot pattern
- Animated gradient classes

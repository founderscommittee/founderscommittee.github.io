# FCV Website Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic-SaaS aesthetic with a Bold Editorial design: off-white background, near-black type, warm orange accent, logo tile portfolio grid, monogram team avatars.

**Architecture:** Complete rewrite of styles.css with a CSS custom-property design system. Targeted HTML structural changes in index.html. Renderer rewrites in portfolio.js and team.js. Minimal update to fcv_ai.js (escapeHtml for external API data + flat list template). Tailwind CDN stays for responsive utilities only.

**Tech Stack:** HTML5, Tailwind CSS (CDN), vanilla JS, Inter (Google Fonts), Font Awesome 6.5.1

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| styles.css | **Rewrite** | Design system: tokens, typography, nav, hero, portfolio, approach, team, news, investors, footer, dark mode, responsive |
| index.html | **Modify** | HTML structure for every section |
| portfolio.js | **Modify** | displayPortfolioItems — logo tiles (trusted internal JSON) |
| team.js | **Modify** | displayTeamMembers — monogram avatars (trusted internal JSON) |
| fcv_ai.js | **Modify** | escapeHtml helper + flat list row template in updateNews |
| animations.js | **Modify** | Remove hover-lift; gut magnetic/3D/hero-parallax |

Security note: portfolio.js and team.js use data from files we control. fcv_ai.js receives external HN API data — all story fields go through escapeHtml before HTML insertion.

---

## Task 1: Rewrite styles.css

**Files:** Modify styles.css

- [ ] **Step 1: Replace entire contents of styles.css**

The new file establishes CSS custom properties as the single source of truth for all colours, then defines every component class the new HTML will use.

Open styles.css and replace all contents with the following:

```
/* FCV Bold Editorial Design System */
:root {
  --bg: #fafaf8;
  --card-bg: #ffffff;
  --ink: #0a0a0a;
  --ink-secondary: rgba(0,0,0,0.45);
  --ink-tertiary: rgba(0,0,0,0.35);
  --accent: #e85d04;
  --border: rgba(0,0,0,0.08);
  --border-hover: rgba(0,0,0,0.25);
  --header-height: 56px;
  --container-width: 1100px;
  --section-pad: 80px;
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
}

html { scroll-behavior: smooth; scroll-padding-top: var(--header-height); font-size: 16px; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--bg); color: var(--ink);
  line-height: 1.6; overflow-x: hidden; margin: 0; padding: 0;
  -webkit-font-smoothing: antialiased;
}

h1,h2,h3,h4 { font-family: 'Inter', system-ui, sans-serif; margin-bottom: 0; }
h1 { font-size: clamp(52px,8vw,96px); font-weight:900; letter-spacing:-0.045em; line-height:0.95; }
h2 { font-size: clamp(28px,4vw,38px); font-weight:900; letter-spacing:-0.035em; line-height:1.1; }
h3 { font-size:16px; font-weight:800; letter-spacing:-0.02em; }
p { margin-bottom: 0; }
a { color: inherit; text-decoration: none; transition: color var(--transition-fast); }

.container { width:100%; max-width:var(--container-width); margin:0 auto; padding:0 40px; position:relative; }
section { padding:var(--section-pad) 0; border-top:1px solid var(--border); position:relative; }

/* Section header */
.section-eyebrow { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.16em; color:var(--ink-tertiary); display:block; margin-bottom:10px; }
.section-heading-row { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
.accent-rule { width:28px; height:2.5px; background:var(--accent); flex-shrink:0; }
.section-sub { font-size:15px; color:var(--ink-secondary); line-height:1.65; max-width:500px; margin-top:12px; margin-bottom:40px; }

/* Nav */
nav { position:fixed; width:100%; top:0; z-index:50; height:var(--header-height); background:rgba(250,250,248,0.92); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); border-bottom:1px solid var(--border); transition:box-shadow var(--transition-normal); }
nav.scrolled { box-shadow:0 1px 0 rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04); }
.nav-inner { height:var(--header-height); display:flex; align-items:center; justify-content:space-between; }
.nav-logo { font-size:18px; font-weight:900; letter-spacing:-0.03em; color:var(--ink); }
.nav-link { font-size:13px; font-weight:500; color:var(--ink-secondary); transition:color var(--transition-fast); }
.nav-link:hover { color:var(--ink); }

/* Buttons */
.btn { display:inline-flex; align-items:center; justify-content:center; font-family:'Inter',system-ui,sans-serif; font-weight:600; border-radius:4px; border:none; cursor:pointer; text-decoration:none; transition:opacity var(--transition-fast); letter-spacing:-0.01em; position:relative; overflow:hidden; }
.btn:hover { opacity:0.85; }
.btn-primary { background:var(--ink); color:#fff; padding:13px 28px; font-size:14px; }
.btn-outline { background:transparent; color:var(--ink); border:1.5px solid rgba(0,0,0,0.18); padding:12px 24px; font-size:14px; }
.btn-outline:hover { border-color:rgba(0,0,0,0.4); opacity:1; }
.btn-accent { background:var(--accent); color:#fff; padding:13px 28px; font-size:14px; }
.btn-nav-primary { background:var(--ink); color:#fff; padding:8px 18px; font-size:12px; border-radius:4px; display:inline-flex; align-items:center; font-weight:600; letter-spacing:-0.01em; text-decoration:none; transition:opacity var(--transition-fast); }
.btn-nav-primary:hover { opacity:0.85; color:#fff; }
.btn-nav-outline { background:transparent; color:var(--ink); border:1.5px solid rgba(0,0,0,0.2); padding:7px 16px; font-size:12px; border-radius:4px; display:inline-flex; align-items:center; font-weight:600; letter-spacing:-0.01em; text-decoration:none; transition:border-color var(--transition-fast); }
.btn-nav-outline:hover { border-color:rgba(0,0,0,0.5); color:var(--ink); }
.btn-ripple .ripple { position:absolute; border-radius:50%; background:rgba(255,255,255,0.3); transform:scale(0); animation:ripple 0.6s linear; pointer-events:none; }
@keyframes ripple { to { transform:scale(4); opacity:0; } }

/* Hero */
.hero { min-height:calc(100vh - var(--header-height)); display:flex; flex-direction:column; justify-content:center; padding:80px 0 60px; border-top:none; margin-top:var(--header-height); }
.hero-eyebrow { display:flex; align-items:center; gap:12px; margin-bottom:28px; }
.hero-eyebrow-line { width:32px; height:2px; background:var(--accent); }
.hero-eyebrow-text { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.16em; color:var(--ink-tertiary); }
.hero-heading { margin-bottom:32px; color:var(--ink); }
.hero-heading .accent { color:var(--accent); }
.hero-body { font-size:17px; color:var(--ink-secondary); line-height:1.65; max-width:520px; margin-bottom:40px; }
.hero-actions { display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:64px; }
.hero-stats { display:flex; border-top:1px solid var(--border); padding-top:32px; max-width:560px; }
.hero-stat { flex:1; padding-right:32px; border-right:1px solid var(--border); margin-right:32px; }
.hero-stat:last-child { border-right:none; margin-right:0; padding-right:0; }
.hero-stat-number { font-size:36px; font-weight:900; letter-spacing:-0.04em; line-height:1; color:var(--ink); margin-bottom:4px; }
.hero-stat-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink-tertiary); }
.hero-badge { position:absolute; right:0; top:50%; transform:translateY(-50%); border:1px solid var(--border); border-radius:8px; padding:20px 24px; background:var(--card-bg); width:220px; box-shadow:0 4px 24px rgba(0,0,0,0.06); }
.hero-badge-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:var(--ink-tertiary); margin-bottom:12px; }
.hero-badge-item { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.hero-badge-item:last-child { margin-bottom:0; }
.hero-badge-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); flex-shrink:0; }
.hero-badge-text { font-size:11px; font-weight:600; color:var(--ink); }

/* Portfolio */
.portfolio-filters { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:28px; }
.filter-btn { font-family:'Inter',system-ui,sans-serif; font-size:11px; font-weight:600; padding:6px 14px; border-radius:3px; border:1px solid var(--border); color:var(--ink-secondary); cursor:pointer; background:transparent; transition:all var(--transition-fast); }
.filter-btn:hover { border-color:rgba(0,0,0,0.25); color:var(--ink); }
.filter-btn.active { background:var(--ink); color:#fff; border-color:var(--ink); }
.logo-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:8px; }
.logo-tile { border:1px solid rgba(0,0,0,0.09); border-radius:5px; padding:18px 14px; background:var(--card-bg); display:flex; flex-direction:column; gap:4px; transition:border-color var(--transition-fast); text-decoration:none; }
.logo-tile:hover { border-color:var(--border-hover); }
.logo-tile-name { font-size:12px; font-weight:700; color:var(--ink); }
.logo-tile-desc { font-size:10px; color:var(--ink-secondary); line-height:1.4; }
.logo-tile-stage { font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--ink-tertiary); margin-top:4px; }
.logo-tile-stage.exit { color:var(--accent); }

/* Approach */
.approach-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; }
.approach-item { display:flex; flex-direction:column; gap:12px; }
.approach-num { font-size:48px; font-weight:900; letter-spacing:-0.04em; color:rgba(0,0,0,0.06); line-height:1; }
.approach-title { font-size:16px; font-weight:800; color:var(--ink); letter-spacing:-0.02em; }
.approach-body { font-size:13px; color:var(--ink-secondary); line-height:1.65; }
.advantage-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:48px; padding-top:48px; border-top:1px solid var(--border); }
.advantage-item { display:flex; gap:16px; }
.advantage-dot { width:8px; height:8px; background:var(--accent); border-radius:50%; flex-shrink:0; margin-top:5px; }
.advantage-title { font-size:13px; font-weight:700; color:var(--ink); margin-bottom:4px; }
.advantage-body { font-size:12px; color:var(--ink-secondary); line-height:1.6; }

/* Team */
.team-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:24px; }
.team-card { display:flex; flex-direction:column; gap:10px; }
.team-avatar { width:56px; height:56px; border-radius:50%; background:var(--ink); color:#fff; font-size:16px; font-weight:700; display:flex; align-items:center; justify-content:center; letter-spacing:-0.01em; flex-shrink:0; }
.team-name { font-size:14px; font-weight:800; color:var(--ink); letter-spacing:-0.02em; }
.team-title { font-size:10px; font-weight:600; color:var(--ink-tertiary); text-transform:uppercase; letter-spacing:0.1em; }
.team-tags { display:flex; flex-wrap:wrap; gap:4px; }
.team-tag { font-size:9px; font-weight:600; padding:3px 7px; border:1px solid var(--border); border-radius:3px; color:var(--ink-secondary); }
.team-social { display:flex; gap:10px; margin-top:2px; }
.team-social-link { font-size:13px; color:var(--ink-tertiary); transition:color var(--transition-fast); }
.team-social-link:hover { color:var(--ink); }

/* News */
.news-wrapper { border:1px solid rgba(0,0,0,0.09); border-radius:6px; background:var(--card-bg); overflow:hidden; }
.news-header { padding:16px 24px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
.news-header-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink-tertiary); }
.news-nav { display:flex; gap:6px; }
.news-nav-btn { width:28px; height:28px; border:1px solid var(--border); border-radius:3px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--ink-secondary); background:transparent; font-size:13px; transition:all var(--transition-fast); font-family:'Inter',system-ui,sans-serif; }
.news-nav-btn:hover { border-color:rgba(0,0,0,0.25); color:var(--ink); }
.carousel-container { overflow:hidden; }
.carousel-track { display:flex; transition:transform 300ms ease; }
.news-slide { width:100%; flex-shrink:0; }
.news-item { padding:14px 24px; border-bottom:1px solid rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
.news-item:last-child { border-bottom:none; }
.news-item-left { flex:1; min-width:0; }
.news-item-title { font-size:13px; font-weight:500; color:var(--ink); line-height:1.4; margin-bottom:3px; display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.news-item-title:hover { color:var(--accent); }
.news-item-meta { font-size:10px; color:var(--ink-tertiary); }
.news-item-time { font-size:10px; color:var(--ink-tertiary); white-space:nowrap; flex-shrink:0; }

/* Investors */
.investors-inner { display:flex; align-items:flex-start; justify-content:space-between; gap:64px; margin-top:32px; }
.investors-copy { max-width:520px; }
.investors-copy p { font-size:15px; color:var(--ink-secondary); line-height:1.7; margin-bottom:16px; }
.investors-copy small { font-size:11px; color:var(--ink-tertiary); display:block; margin-bottom:28px; line-height:1.6; }
.investors-copy a { color:var(--ink); text-decoration:underline; text-underline-offset:2px; }
.accredited-badge { flex-shrink:0; width:220px; border:1px solid var(--border); border-radius:6px; padding:20px; background:var(--card-bg); }
.accredited-badge-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:var(--ink-tertiary); margin-bottom:10px; display:block; }
.accredited-badge-text { font-size:11px; color:var(--ink-secondary); line-height:1.55; }

/* Footer */
footer { background:#0a0a0a; color:rgba(255,255,255,0.9); padding:48px 0; }
.footer-inner { display:flex; justify-content:space-between; align-items:flex-start; gap:32px; flex-wrap:wrap; }
.footer-brand { font-size:20px; font-weight:900; letter-spacing:-0.03em; margin-bottom:6px; color:#fff; }
.footer-tagline { font-size:11px; color:rgba(255,255,255,0.3); }
.footer-links { display:flex; gap:24px; flex-wrap:wrap; }
.footer-links a { font-size:12px; color:rgba(255,255,255,0.4); transition:color var(--transition-fast); }
.footer-links a:hover { color:rgba(255,255,255,0.8); }
.footer-social { display:flex; gap:8px; }
.footer-social a { width:32px; height:32px; border:1px solid rgba(255,255,255,0.12); border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:13px; color:rgba(255,255,255,0.5); transition:all var(--transition-fast); }
.footer-social a:hover { border-color:rgba(255,255,255,0.3); color:rgba(255,255,255,0.9); }
.footer-legal { font-size:10px; color:rgba(255,255,255,0.2); line-height:1.6; max-width:300px; text-align:right; }

/* Animations */
.section-animate { opacity:0; }
.section-animate.visible { animation:slideUp 0.8s ease forwards; }
@keyframes slideUp { from { transform:translateY(24px); opacity:0; } to { transform:translateY(0); opacity:1; } }
.reveal-up { opacity:0; transform:translateY(24px); transition:all 0.7s ease; }
.reveal-up.revealed { opacity:1; transform:translateY(0); }
.stagger-item { opacity:0; }
.stagger-item.visible { animation:slideUp 0.5s ease forwards; }
.delay-100 { animation-delay:100ms; transition-delay:100ms; }
.delay-200 { animation-delay:200ms; transition-delay:200ms; }
.dark-transition { transition:background-color 0.3s ease,color 0.3s ease,border-color 0.3s ease; }

/* Scrollbar */
::-webkit-scrollbar { width:8px; }
::-webkit-scrollbar-track { background:var(--bg); }
::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.15); border-radius:4px; }
::-webkit-scrollbar-thumb:hover { background:rgba(0,0,0,0.25); }

/* Dark mode */
.dark { --bg:#0f0f0d; --card-bg:#1a1a17; --ink:rgba(255,255,255,0.92); --ink-secondary:rgba(255,255,255,0.5); --ink-tertiary:rgba(255,255,255,0.3); --border:rgba(255,255,255,0.08); --border-hover:rgba(255,255,255,0.25); }
.dark nav { background:rgba(15,15,13,0.92); }
.dark .btn-primary { background:rgba(255,255,255,0.92); color:#0a0a0a; }
.dark .btn-nav-primary { background:rgba(255,255,255,0.92); color:#0a0a0a; }
.dark .btn-outline { border-color:rgba(255,255,255,0.2); color:rgba(255,255,255,0.9); }
.dark .btn-outline:hover { border-color:rgba(255,255,255,0.4); opacity:1; }
.dark .btn-nav-outline { border-color:rgba(255,255,255,0.2); color:rgba(255,255,255,0.9); }
.dark .filter-btn { color:rgba(255,255,255,0.5); border-color:rgba(255,255,255,0.1); }
.dark .filter-btn.active { background:rgba(255,255,255,0.92); color:#0a0a0a; border-color:rgba(255,255,255,0.92); }
.dark .approach-num { color:rgba(255,255,255,0.06); }
.dark .team-avatar { background:rgba(255,255,255,0.15); color:rgba(255,255,255,0.9); }
.dark ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); }

/* Mobile menu */
@media (max-width:767px) {
  #mobile-menu { position:fixed; top:var(--header-height); left:0; right:0; z-index:49; background:var(--bg); border-bottom:1px solid var(--border); box-shadow:0 4px 16px rgba(0,0,0,0.08); max-height:calc(100vh - var(--header-height)); overflow-y:auto; }
  #mobile-menu.hidden { display:none !important; }
  #mobile-menu:not(.hidden) { display:block !important; animation:mobileMenuIn 0.15s ease-out; }
  @keyframes mobileMenuIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  #mobile-menu-button { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:4px; color:var(--ink-secondary); transition:all var(--transition-fast); }
  #mobile-menu-button:hover { color:var(--ink); }
}

/* Responsive */
@media (max-width:768px) {
  :root { --section-pad:56px; }
  .container { padding:0 20px; }
  .hero { padding:48px 0 40px; }
  .hero-badge { display:none; }
  .approach-grid { grid-template-columns:1fr; gap:24px; }
  .advantage-grid { grid-template-columns:1fr; }
  .investors-inner { flex-direction:column; gap:24px; }
  .accredited-badge { width:100%; }
  .footer-inner { flex-direction:column; gap:24px; }
  .footer-legal { text-align:left; max-width:100%; }
}
@media (max-width:640px) {
  .logo-grid { grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); }
  .hero-actions { flex-direction:column; align-items:flex-start; }
  .hero-stat { padding-right:16px; margin-right:16px; }
  .hero-stat-number { font-size:28px; }
  .team-grid { grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); }
}
```

- [ ] **Step 2: Verify base styles**

Open index.html. Expected: off-white background, near-black text, old blue/purple gradient gone. Full styling comes in subsequent tasks.

- [ ] **Step 3: Commit**

```
git add styles.css
git commit -m "feat: replace styles.css with bold editorial design system"
```

---

## Task 2: Update index.html — body and nav

**Files:** Modify index.html

- [ ] **Step 1: Update body tag — remove pattern-bg class and noise-overlay div**

Change:
```
<body class="pattern-bg dark-transition">
    <div class="noise-overlay"></div>
```
To:
```
<body class="dark-transition">
```

- [ ] **Step 2: Replace the entire nav element (from opening nav tag to closing nav tag)**

```
<nav class="dark-transition">
    <div class="container">
        <div class="nav-inner">
            <a href="#" class="nav-logo">FCV</a>
            <div class="md:hidden">
                <button id="mobile-menu-button" aria-label="Toggle menu" onclick="toggleMobileMenuDirect(event)">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
            <div class="hidden md:flex items-center gap-7">
                <button id="theme-toggle" class="nav-link p-1" style="background:none;border:none;cursor:pointer;">
                    <svg id="theme-toggle-dark-icon" class="hidden w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                    <svg id="theme-toggle-light-icon" class="hidden w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path></svg>
                </button>
                <a href="#portfolio" class="nav-link">Portfolio</a>
                <a href="#team" class="nav-link">Team</a>
                <a href="#startup-news" class="nav-link">News</a>
                <a href="#investors" class="btn-nav-outline">Invest With Us</a>
                <a href="https://airtable.com/appjIoCUvdDaJd8Vi/shrsjlsmcj0PMPafs" target="_blank" class="btn-nav-primary">Pitch to Us</a>
            </div>
        </div>
    </div>
    <div id="mobile-menu" class="hidden md:hidden">
        <div class="px-5 pt-4 pb-6">
            <div class="flex items-center py-2 pb-4 mb-4" style="border-bottom:1px solid var(--border);">
                <button id="theme-toggle-mobile" style="background:none;border:none;cursor:pointer;padding:6px;" class="nav-link">
                    <svg id="theme-toggle-dark-icon-mobile" class="hidden w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                    <svg id="theme-toggle-light-icon-mobile" class="hidden w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path></svg>
                </button>
                <span class="ml-3" style="font-size:13px;color:var(--ink-secondary);">Toggle theme</span>
            </div>
            <nav class="flex flex-col mb-6" style="position:static;height:auto;background:none;border:none;backdrop-filter:none;">
                <a href="#portfolio" class="nav-link py-3 font-medium">Portfolio</a>
                <a href="#team" class="nav-link py-3 font-medium">Team</a>
                <a href="#startup-news" class="nav-link py-3 font-medium">News</a>
            </nav>
            <div class="pt-4 flex flex-col gap-3" style="border-top:1px solid var(--border);">
                <a href="#investors" class="btn-nav-outline text-center justify-center" style="padding:10px 16px;">Invest With Us</a>
                <a href="https://airtable.com/appjIoCUvdDaJd8Vi/shrsjlsmcj0PMPafs" target="_blank" class="btn-nav-primary text-center justify-center" style="padding:10px 16px;">Pitch to Us</a>
            </div>
        </div>
    </div>
</nav>
```

- [ ] **Step 3: Verify nav**

Open index.html. Expected: clean nav, FCV left, links + two buttons right. No blue/glassmorphism. Subtle bottom border visible.

- [ ] **Step 4: Commit**

```
git add index.html
git commit -m "feat: update nav and body to editorial style"
```

---

## Task 3: Hero section HTML

**Files:** Modify index.html

- [ ] **Step 1: Replace the hero section (from the Hero Section comment to its closing section tag)**

```
<!-- Hero Section -->
<section class="hero section-animate">
    <div class="container">
        <div class="hero-eyebrow">
            <div class="hero-eyebrow-line"></div>
            <span class="hero-eyebrow-text">Technical Syndicate VC</span>
        </div>
        <h1 class="hero-heading">
            Founders<br>
            Committee<br>
            <span class="accent">Ventures</span>
        </h1>
        <p class="hero-body">A syndicate of founders, engineers, and operators investing in exceptional technical teams. We bring deep due diligence and hands-on support from pre-seed to growth.</p>
        <div class="hero-actions">
            <a href="https://airtable.com/appjIoCUvdDaJd8Vi/shrsjlsmcj0PMPafs" target="_blank" class="btn btn-primary btn-ripple">Submit Your Pitch →</a>
            <a href="#portfolio" class="btn btn-outline btn-ripple">View Portfolio</a>
            <a href="#team" class="btn btn-outline btn-ripple">Meet the Team</a>
        </div>
        <div class="hero-stats">
            <div class="hero-stat"><div class="hero-stat-number">13+</div><div class="hero-stat-label">Portfolio Cos</div></div>
            <div class="hero-stat"><div class="hero-stat-number">3</div><div class="hero-stat-label">Exits</div></div>
            <div class="hero-stat"><div class="hero-stat-number">7</div><div class="hero-stat-label">Partners</div></div>
        </div>
        <div class="hero-badge hidden md:block">
            <div class="hero-badge-label">What we look for</div>
            <div class="hero-badge-item"><div class="hero-badge-dot"></div><span class="hero-badge-text">Technical founder-led</span></div>
            <div class="hero-badge-item"><div class="hero-badge-dot"></div><span class="hero-badge-text">Pre-seed to Series A</span></div>
            <div class="hero-badge-item"><div class="hero-badge-dot"></div><span class="hero-badge-text">Scalable tech foundations</span></div>
            <div class="hero-badge-item"><div class="hero-badge-dot"></div><span class="hero-badge-text">Strong operator network</span></div>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Verify hero**

Expected: large stacked heading, "Ventures" in orange, stats bar with 13+/3/7, floating badge on desktop.

- [ ] **Step 3: Commit**

```
git add index.html
git commit -m "feat: redesign hero with editorial layout and stats bar"
```

---

## Task 4: Portfolio section HTML + portfolio.js renderer

**Files:** Modify index.html, portfolio.js

- [ ] **Step 1: Replace portfolio section in index.html**

```
<!-- Portfolio Section -->
<section id="portfolio" class="section-animate">
    <div class="container">
        <span class="section-eyebrow reveal-up">Our Investments</span>
        <div class="section-heading-row reveal-up"><div class="accent-rule"></div><h2>Select Portfolio</h2></div>
        <p class="section-sub reveal-up">We invest in technical founders building scalable solutions across pre-seed through Series A.</p>
        <div class="portfolio-filters reveal-up">
            <button type="button" class="filter-btn active" data-filter="all">All</button>
            <button type="button" class="filter-btn" data-filter="Pre-Seed">Pre-Seed</button>
            <button type="button" class="filter-btn" data-filter="Seed">Seed</button>
            <button type="button" class="filter-btn" data-filter="Series A">Series A</button>
            <button type="button" class="filter-btn" data-filter="Acquired">Acquired</button>
        </div>
        <div id="portfolio-grid" class="logo-grid stagger-container"></div>
    </div>
</section>
```

- [ ] **Step 2: Replace the displayPortfolioItems function in portfolio.js (lines 67-163)**

Data comes from our own portfolio.json so no escaping is needed for the name/description fields. Replace the entire function with:

```
function displayPortfolioItems(portfolioItems) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    portfolioGrid.innerHTML = '';

    if (portfolioItems.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'grid-column:1/-1;text-align:center;padding:48px 0;';
        empty.textContent = 'No portfolio items match your filter.';
        portfolioGrid.appendChild(empty);
        return;
    }

    portfolioItems.forEach(item => {
        const isExit = item.status === 'Acquired' || item.status.includes(':');
        const stageLabel = isExit ? item.status : item.stage;

        const tile = document.createElement('a');
        tile.className = 'logo-tile stagger-item';
        tile.href = item.website;
        tile.target = '_blank';
        tile.rel = 'noopener noreferrer';

        const name = document.createElement('span');
        name.className = 'logo-tile-name';
        name.textContent = item.name;

        const desc = document.createElement('span');
        desc.className = 'logo-tile-desc';
        desc.textContent = item.description;

        const stage = document.createElement('span');
        stage.className = 'logo-tile-stage' + (isExit ? ' exit' : '');
        stage.textContent = stageLabel;

        tile.appendChild(name);
        tile.appendChild(desc);
        tile.appendChild(stage);
        portfolioGrid.appendChild(tile);
    });
}
```

- [ ] **Step 3: Verify**

Open index.html. Expected: compact tile grid of 13 companies. Exit/Acquired stages in orange. Clicking a tile opens the company website. Filter buttons update the grid.

- [ ] **Step 4: Commit**

```
git add index.html portfolio.js
git commit -m "feat: portfolio logo tile grid with editorial filter buttons"
```

---

## Task 5: Our Approach section HTML

**Files:** Modify index.html

- [ ] **Step 1: Replace the Our Approach section and delete the old Divider element that follows it**

Replace from the Our Approach section comment through its closing section tag, and also delete the Divider div that comes after it (the div with class "relative py-12"). Replace with:

```
<!-- Our Approach Section -->
<section class="section-animate">
    <div class="container">
        <span class="section-eyebrow reveal-up">Our Approach</span>
        <div class="section-heading-row reveal-up"><div class="accent-rule"></div><h2>Technical Due Diligence</h2></div>
        <p class="section-sub reveal-up">Built by engineers, for engineers. We evaluate what most VCs can't.</p>
        <div class="approach-grid">
            <div class="approach-item reveal-up">
                <div class="approach-num">01</div>
                <div class="approach-title">Code Review</div>
                <p class="approach-body">Our team of experienced engineers conducts thorough code reviews to evaluate technical foundations, architecture decisions, and scalability potential.</p>
            </div>
            <div class="approach-item reveal-up delay-100">
                <div class="approach-num">02</div>
                <div class="approach-title">Market Analysis</div>
                <p class="approach-body">We leverage our network of industry experts to validate market opportunities, competitive landscape, and go-to-market strategies.</p>
            </div>
            <div class="approach-item reveal-up delay-200">
                <div class="approach-num">03</div>
                <div class="approach-title">Founder Assessment</div>
                <p class="approach-body">We evaluate technical teams based on their domain expertise, problem-solving abilities, and capacity to execute on their vision.</p>
            </div>
        </div>
        <div class="advantage-grid">
            <div class="advantage-item reveal-up">
                <div class="advantage-dot"></div>
                <div><div class="advantage-title">Technical Mentorship</div><p class="advantage-body">Access to experienced CTOs, engineers, and product leaders who provide guidance on technical challenges.</p></div>
            </div>
            <div class="advantage-item reveal-up delay-100">
                <div class="advantage-dot"></div>
                <div><div class="advantage-title">Operational Support</div><p class="advantage-body">Hands-on assistance with recruitment, go-to-market strategy, and connecting with enterprise customers.</p></div>
            </div>
            <div class="advantage-item reveal-up delay-200">
                <div class="advantage-dot"></div>
                <div><div class="advantage-title">Founder Network</div><p class="advantage-body">Connection to a community of like-minded founders who share insights, challenges, and opportunities.</p></div>
            </div>
            <div class="advantage-item reveal-up" style="animation-delay:300ms;transition-delay:300ms;">
                <div class="advantage-dot"></div>
                <div><div class="advantage-title">Follow-on Funding</div><p class="advantage-body">Strategic support for subsequent rounds through our network of institutional investors and venture capital firms.</p></div>
            </div>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Verify**

Expected: three items with large faint 01/02/03 numbers, four advantage bullets below an orange-dot divider.

- [ ] **Step 3: Commit**

```
git add index.html
git commit -m "feat: redesign approach section with numbered editorial layout"
```

---

## Task 6: Team section HTML + team.js renderer

**Files:** Modify index.html, team.js

- [ ] **Step 1: Replace team section in index.html**

```
<!-- Team Section -->
<section id="team" class="section-animate">
    <div class="container">
        <span class="section-eyebrow reveal-up">Meet The Team</span>
        <div class="section-heading-row reveal-up"><div class="accent-rule"></div><h2>Our Team</h2></div>
        <p class="section-sub reveal-up">Experienced founders, engineers, and investors with deep technical and operational expertise.</p>
        <div id="team-grid" class="team-grid stagger-container"></div>
    </div>
</section>
```

- [ ] **Step 2: Replace the displayTeamMembers function in team.js (lines 24-126)**

Data is from our own team.json. All text is set via textContent, not via HTML string injection. Social link hrefs come from our JSON so they are trusted:

```
function displayTeamMembers(teamMembers) {
    const teamGrid = document.getElementById('team-grid');
    teamGrid.innerHTML = '';

    const iconMap = { linkedin: 'fa-linkedin-in', twitter: 'fa-twitter', spotify: 'fa-spotify' };

    teamMembers.forEach((member, index) => {
        const initials = member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

        const card = document.createElement('div');
        card.className = 'team-card stagger-item';

        const avatar = document.createElement('div');
        avatar.className = 'team-avatar';
        avatar.textContent = initials;

        const name = document.createElement('div');
        name.className = 'team-name';
        name.textContent = member.name;

        const title = document.createElement('div');
        title.className = 'team-title';
        title.textContent = member.title;

        const tags = document.createElement('div');
        tags.className = 'team-tags';
        member.expertise.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'team-tag';
            span.textContent = tag;
            tags.appendChild(span);
        });

        card.appendChild(avatar);
        card.appendChild(name);
        card.appendChild(title);
        card.appendChild(tags);

        const socialEntries = Object.entries(member.social).filter(([, url]) => url);
        if (socialEntries.length > 0) {
            const social = document.createElement('div');
            social.className = 'team-social';
            socialEntries.forEach(([platform, url]) => {
                const icon = iconMap[platform];
                if (!icon) return;
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'team-social-link';
                const i = document.createElement('i');
                i.className = 'fab ' + icon;
                a.appendChild(i);
                social.appendChild(a);
            });
            card.appendChild(social);
        }

        teamGrid.appendChild(card);
    });
}
```

- [ ] **Step 3: Verify**

Expected: 7 cards with black initials (DM, MB, PG, NG, JS, TK, JS), name, uppercase title, tag chips, social icons. No ui-avatars.com requests in Network tab.

- [ ] **Step 4: Commit**

```
git add index.html team.js
git commit -m "feat: team monogram avatars using CSS-generated initials"
```

---

## Task 7: News section HTML + fcv_ai.js renderer

**Files:** Modify index.html, fcv_ai.js

- [ ] **Step 1: Replace news section in index.html**

```
<!-- News Section -->
<section id="startup-news" class="section-animate">
    <div class="container">
        <span class="section-eyebrow reveal-up">Stay Informed</span>
        <div class="section-heading-row reveal-up"><div class="accent-rule"></div><h2>Latest from Hacker News</h2></div>
        <p class="section-sub reveal-up" id="news-date">Top stories from the tech and startup world, updated daily.</p>
        <div class="news-wrapper reveal-up">
            <div class="news-header">
                <span class="news-header-title">Top Stories</span>
                <div class="news-nav">
                    <button id="prev-slide" class="news-nav-btn">←</button>
                    <button id="next-slide" class="news-nav-btn">→</button>
                </div>
            </div>
            <div class="carousel-container">
                <div id="news-container" class="carousel-track">
                    <div id="news-skeleton" class="news-slide" style="padding:14px 24px;">
                        <div style="height:13px;background:var(--border);border-radius:3px;width:75%;margin-bottom:10px;"></div>
                        <div style="height:13px;background:var(--border);border-radius:3px;width:85%;margin-bottom:10px;"></div>
                        <div style="height:13px;background:var(--border);border-radius:3px;width:65%;margin-bottom:10px;"></div>
                        <div style="height:13px;background:var(--border);border-radius:3px;width:80%;"></div>
                    </div>
                </div>
            </div>
            <div id="carousel-indicators" style="display:none;"></div>
        </div>
        <div class="text-center mt-10 reveal-up">
            <a href="https://news.ycombinator.com/" target="_blank" class="btn btn-outline">Visit Hacker News →</a>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Add escapeHtml helper and getTimeAgo helper to fcv_ai.js**

Add both functions at the top of fcv_ai.js, before the newsContainer variable declarations:

```
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getTimeAgo(unixTime) {
    const seconds = Math.floor(Date.now() / 1000 - unixTime);
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}
```

- [ ] **Step 3: Update the storyList map inside updateNews in fcv_ai.js**

Replace the storyList map and slidesHTML.push line with:

```
            const storyList = slideStories.map(story => {
                const timeAgo = story.time ? getTimeAgo(story.time) : '';
                const safeTitle = escapeHtml(story.title || '');
                const safeBy = escapeHtml(story.by || '');
                const titleEl = story.url
                    ? '<a href="' + escapeHtml(story.url) + '" target="_blank" rel="noopener noreferrer" class="news-item-title">' + safeTitle + '</a>'
                    : '<span class="news-item-title">' + safeTitle + '</span>';
                return '<div class="news-item"><div class="news-item-left">' + titleEl +
                    '<span class="news-item-meta">' + (story.score || 0) + ' pts · ' + (story.descendants || 0) + ' comments · by ' + safeBy + '</span>' +
                    '</div><span class="news-item-time">' + timeAgo + '</span></div>';
            }).join('');

            slidesHTML.push('<div class="news-slide">' + storyList + '</div>');
```

- [ ] **Step 4: Update newsDate text in updateNews**

Replace:
```
        newsDate.textContent = `HN Top Stories - ${currentDate}`;
```
With:
```
        newsDate.textContent = 'Top stories from the tech and startup world · ' + currentDate;
```

- [ ] **Step 5: Guard touch listeners against missing .carousel-container**

Replace the two bare document.querySelector('.carousel-container').addEventListener lines with:

```
const carouselEl = document.querySelector('.carousel-container');
if (carouselEl) {
    carouselEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, false);
    carouselEl.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, false);
}
```

- [ ] **Step 6: Verify**

Expected: skeleton shows, then flat list rows load with title (truncated), points/comments/by, and time-ago on the right. Prev/next paginate through 4 pages of 5 stories each.

- [ ] **Step 7: Commit**

```
git add index.html fcv_ai.js
git commit -m "feat: redesign news as editorial flat list with XSS-safe rendering"
```

---

## Task 8: Investors + Footer HTML

**Files:** Modify index.html

- [ ] **Step 1: Replace Investors section**

```
<!-- Investors Section -->
<section id="investors" class="section-animate">
    <div class="container">
        <span class="section-eyebrow reveal-up">Limited Partners</span>
        <div class="section-heading-row reveal-up"><div class="accent-rule"></div><h2>Invest With Us</h2></div>
        <div class="investors-inner">
            <div class="investors-copy reveal-up">
                <p>Join our network of forward-thinking Limited Partners who benefit from our technical due diligence and access to high-potential startups with strong technical foundations.</p>
                <small>Note: Investment is limited to Accredited Investors as defined by the SEC. <a href="https://www.sec.gov/resources-small-businesses/capital-raising-building-blocks/accredited-investors" target="_blank">Learn more</a></small>
                <a href="mailto:admin@fcv.vc" class="btn btn-accent">Contact Investor Relations →</a>
            </div>
            <div class="accredited-badge reveal-up delay-100">
                <span class="accredited-badge-label">Accredited Investors Only</span>
                <p class="accredited-badge-text">Investment in early-stage companies involves substantial risk. Please review SEC requirements before reaching out.</p>
            </div>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Replace footer**

```
<footer>
    <div class="container">
        <div class="footer-inner">
            <div>
                <div class="footer-brand">FCV</div>
                <div class="footer-tagline">Founders Committee Ventures · © 2025</div>
            </div>
            <div class="footer-links">
                <a href="#portfolio">Portfolio</a>
                <a href="#team">Team</a>
                <a href="#startup-news">News</a>
                <a href="#investors">Invest</a>
            </div>
            <div class="footer-social">
                <a href="https://linkedin.com/company/founderscommittee" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                <a href="https://twitter.com/ventures_fc" target="_blank"><i class="fab fa-twitter"></i></a>
            </div>
            <div class="footer-legal">
                <p>The information provided does not constitute an offer to sell or solicitation of an offer to buy any securities.</p>
                <p style="margin-top:4px;">Investment in early-stage companies involves substantial risk.</p>
                <p style="margin-top:8px;font-size:9px;opacity:0.6;">Hint: Try the Konami Code for a surprise!</p>
            </div>
        </div>
    </div>
</footer>
```

- [ ] **Step 3: Verify**

Expected: investors section two-column layout, orange CTA button. Footer dark background, four-column row.

- [ ] **Step 4: Commit**

```
git add index.html
git commit -m "feat: redesign investors section and footer"
```

---

## Task 9: Clean up animations.js

**Files:** Modify animations.js

- [ ] **Step 1: Replace initInteractiveElements — keep ripple, remove hover-lift**

The current function adds translateY(-5px) inline styles to .btn on mouseenter, which overrides our CSS opacity hover. Replace the entire function body:

```
function initInteractiveElements() {
    document.querySelectorAll('.btn-ripple').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}
```

- [ ] **Step 2: Empty initMagneticButtons and init3DCardEffects**

Replace each function body with an empty body (the classes they targeted are removed from the HTML):

```
function initMagneticButtons() {}
```

```
function init3DCardEffects() {}
```

- [ ] **Step 3: Remove hero-specific parallax from initParallaxEffects**

The new hero has no .hero-content element. Replace the entire function body with generic parallax only:

```
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (parallaxElements.length === 0) return;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.1;
            const direction = element.dataset.direction || 'up';
            const limit = element.dataset.limit || 100;
            const yPos = direction === 'up' ? Math.min(scrollY * speed, limit) : Math.max(-scrollY * speed, -limit);
            element.style.transform = 'translate3d(0,' + yPos + 'px,0)';
        });
    });
}
```

- [ ] **Step 4: Verify no console errors**

Open index.html, open DevTools console. Expected: zero errors. Dark mode toggle works. Scroll reveals fire. Portfolio filters work. Konami code still triggers snake game.

- [ ] **Step 5: Commit**

```
git add animations.js
git commit -m "feat: clean up animations.js — remove hover-lift and dead effects"
```

---

## Task 10: Final verification pass

- [ ] **Desktop (1280px+)**

Scroll through entire page and confirm:
- Nav: FCV logo left, links + two buttons right, scrolled shadow appears after scrolling 50px
- Hero: stacked heading, "Ventures" in #e85d04, stats bar, floating badge visible
- Portfolio: 13 logo tiles, orange exit stages, all 5 filter buttons work
- Approach: 01/02/03 numbered items, 4 advantage bullets below
- Team: 7 monogram cards (DM, MB, PG, NG, JS, TK, JS), tags, social links
- News: flat list, prev/next pagination, time-ago stamps
- Investors: two-column, orange CTA
- Footer: dark, four columns

- [ ] **Mobile (375px via DevTools)**

- Hamburger button visible, taps open dropdown menu
- Hero badge hidden
- Approach stacks single column
- Portfolio tiles at minmax(120px, 1fr)
- Footer stacks vertically

- [ ] **Dark mode**

Toggle sun/moon. Background becomes #0f0f0d, cards #1a1a17, text remains readable, orange accent unchanged.

- [ ] **Final commit**

```
git add -A
git commit -m "chore: complete FCV bold editorial redesign"
```

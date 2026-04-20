# Pangkasin — Design System
> Theme: Midnight Obsidian | Font: Space Grotesk
> Reference: Google Stitch generated UI — dark gold premium barbershop aesthetic

---

## 1. Colors

### Brand Colors
```css
--color-primary:        #F2B90D;  /* Gold — main CTA, accent, highlights */
--color-primary-hover:  #D4A20B;  /* Darker gold on hover */
--color-secondary:      #8E7438;  /* Bronze/dark gold — secondary actions */
--color-tertiary:       #4ECFFF;  /* Cyan — status indicators, info badges */
```

### Background Colors
```css
--color-bg-base:        #0D0D0D;  /* Page background — near black */
--color-bg-surface:     #1A1A1A;  /* Cards, panels, modals */
--color-bg-elevated:    #222222;  /* Hover states, selected items */
--color-bg-sidebar:     #111111;  /* Admin sidebar background */
--color-bg-input:       #1A1A1A;  /* Form inputs, select fields */
--color-bg-overlay:     rgba(0,0,0,0.7); /* Modal overlays */
```

### Text Colors
```css
--color-text-primary:   #FFFFFF;  /* Main headings, important text */
--color-text-secondary: #A0A0A0;  /* Subtitles, descriptions, labels */
--color-text-muted:     #666666;  /* Placeholders, disabled text */
--color-text-inverse:   #0D0D0D;  /* Text on gold/light backgrounds */
```

### Border Colors
```css
--color-border:         #2A2A2A;  /* Default borders */
--color-border-focus:   #F2B90D;  /* Input focus border */
--color-border-muted:   #1F1F1F;  /* Subtle dividers */
```

### Status Colors
```css
--color-success:        #22C55E;  /* Confirmed bookings, active status */
--color-warning:        #F2B90D;  /* Pending status (reuse primary) */
--color-error:          #EF4444;  /* Cancelled, errors, danger zone */
--color-info:           #4ECFFF;  /* Info badges (reuse tertiary) */
```

### Booking Status Colors
```css
--status-confirmed:     #22C55E;  /* Green */
--status-pending:       #F2B90D;  /* Gold */
--status-done:          #A0A0A0;  /* Grey */
--status-cancelled:     #EF4444;  /* Red */
```

---

## 2. Typography

### Font Family
```css
font-family: 'Space Grotesk', sans-serif;
/* Import: https://fonts.google.com/specimen/Space+Grotesk */
/* Weights used: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) */
```

### Type Scale
```css
/* Display — Hero headlines */
.text-display    { font-size: 56px; font-weight: 700; line-height: 1.1; }

/* Headings */
.text-h1         { font-size: 40px; font-weight: 700; line-height: 1.2; }
.text-h2         { font-size: 32px; font-weight: 700; line-height: 1.25; }
.text-h3         { font-size: 24px; font-weight: 600; line-height: 1.3; }
.text-h4         { font-size: 20px; font-weight: 600; line-height: 1.4; }

/* Body */
.text-body-lg    { font-size: 18px; font-weight: 400; line-height: 1.6; }
.text-body       { font-size: 16px; font-weight: 400; line-height: 1.6; }
.text-body-sm    { font-size: 14px; font-weight: 400; line-height: 1.5; }

/* Labels & Captions */
.text-label      { font-size: 14px; font-weight: 600; line-height: 1.4; }
.text-caption    { font-size: 12px; font-weight: 400; line-height: 1.4; }
.text-overline   { font-size: 11px; font-weight: 600; line-height: 1.4; letter-spacing: 0.08em; text-transform: uppercase; }
```

### Tailwind v4 Config (in globals.css)
```css
@theme {
  --font-sans: "Space Grotesk", sans-serif;
}
```

---

## 3. Spacing

Base unit: 4px

```
4px   → space-1   (tight internal padding)
8px   → space-2   (small gaps)
12px  → space-3   (component internal)
16px  → space-4   (standard padding)
20px  → space-5
24px  → space-6   (card padding)
32px  → space-8   (section gaps)
40px  → space-10
48px  → space-12  (large section padding)
64px  → space-16  (page sections)
80px  → space-20  (hero sections)
96px  → space-24  (large hero padding)
```

---

## 4. Border Radius

```css
--radius-sm:     4px;   /* Badges, tags, chips */
--radius-md:     8px;   /* Buttons, inputs */
--radius-lg:     12px;  /* Cards, panels */
--radius-xl:     16px;  /* Large cards, modals */
--radius-2xl:    24px;  /* Feature cards */
--radius-full:   9999px; /* Pills, avatars */
```

---

## 5. Shadows

```css
--shadow-sm:   0 1px 3px rgba(0,0,0,0.4);
--shadow-md:   0 4px 12px rgba(0,0,0,0.5);
--shadow-lg:   0 8px 24px rgba(0,0,0,0.6);
--shadow-glow: 0 0 20px rgba(242,185,13,0.3); /* Gold glow for CTAs */
```

---

## 6. Components

### Buttons

**Primary Button** — Gold background, black text
```css
background: #F2B90D;
color: #0D0D0D;
font-weight: 600;
font-size: 14px;
padding: 10px 20px;
border-radius: 8px;
border: none;
cursor: pointer;
transition: background 0.2s;

&:hover { background: #D4A20B; }
&:disabled { background: #3A3A3A; color: #666; cursor: not-allowed; }
```

**Secondary Button** — Dark background, gold border + text
```css
background: transparent;
color: #F2B90D;
border: 1px solid #F2B90D;
padding: 10px 20px;
border-radius: 8px;
font-weight: 600;

&:hover { background: rgba(242,185,13,0.1); }
```

**Inverted Button** — White background, dark text
```css
background: #FFFFFF;
color: #0D0D0D;
border: none;
padding: 10px 20px;
border-radius: 8px;
font-weight: 600;
```

**Ghost Button** — No background, no border
```css
background: transparent;
color: #A0A0A0;
border: none;
padding: 10px 20px;

&:hover { color: #FFFFFF; background: rgba(255,255,255,0.05); }
```

**Danger Button** — Red, for destructive actions
```css
background: #EF4444;
color: #FFFFFF;
border: none;
padding: 10px 20px;
border-radius: 8px;
font-weight: 600;
```

### Icon Buttons
```css
/* Square icon button */
width: 36px; height: 36px;
background: #222222;
border-radius: 8px;
border: 1px solid #2A2A2A;
display: flex; align-items: center; justify-content: center;

&:hover { background: #2A2A2A; }
```

---

### Cards

**Base Card**
```css
background: #1A1A1A;
border: 1px solid #2A2A2A;
border-radius: 12px;
padding: 24px;
```

**Barber Card** (booking flow)
```css
background: #1A1A1A;
border: 1px solid #2A2A2A;
border-radius: 12px;
overflow: hidden;
cursor: pointer;

/* Selected state */
border: 2px solid #F2B90D;
box-shadow: 0 0 20px rgba(242,185,13,0.2);

/* Disabled/grayed state (barber can't do service) */
opacity: 0.4;
cursor: not-allowed;
filter: grayscale(100%);
```

**Service Card** (booking flow)
```css
background: #1A1A1A;
border: 1px solid #2A2A2A;
border-radius: 12px;
padding: 16px;
cursor: pointer;

/* Selected state */
border: 2px solid #F2B90D;
background: rgba(242,185,13,0.05);
```

**Stat Card** (dashboard)
```css
background: #1A1A1A;
border: 1px solid #2A2A2A;
border-radius: 12px;
padding: 20px 24px;
```

---

### Form Inputs

**Text Input**
```css
background: #1A1A1A;
border: 1px solid #2A2A2A;
border-radius: 8px;
padding: 10px 14px;
color: #FFFFFF;
font-size: 14px;
font-family: 'Space Grotesk';
width: 100%;

&::placeholder { color: #666666; }
&:focus { border-color: #F2B90D; outline: none; }
```

**Select / Dropdown**
```css
/* Same as text input + custom arrow */
background: #1A1A1A;
border: 1px solid #2A2A2A;
border-radius: 8px;
padding: 10px 14px;
color: #FFFFFF;
```

**Toggle/Switch**
```css
/* Off state */
background: #3A3A3A;

/* On state */
background: #F2B90D;
```

**Label**
```css
font-size: 12px;
font-weight: 600;
color: #A0A0A0;
text-transform: uppercase;
letter-spacing: 0.05em;
margin-bottom: 6px;
```

---

### Navigation

**Admin Sidebar**
```css
width: 240px;
background: #111111;
border-right: 1px solid #1F1F1F;
height: 100vh;
position: fixed;
padding: 24px 0;
```

**Sidebar Nav Item**
```css
padding: 10px 20px;
font-size: 14px;
font-weight: 500;
color: #A0A0A0;
border-radius: 8px;
margin: 2px 12px;
display: flex; align-items: center; gap: 10px;

/* Active state */
background: rgba(242,185,13,0.1);
color: #F2B90D;
border-left: 3px solid #F2B90D;

/* Hover state */
background: #1A1A1A;
color: #FFFFFF;
```

**Top Navigation (public site)**
```css
background: rgba(13,13,13,0.95);
backdrop-filter: blur(10px);
border-bottom: 1px solid #1F1F1F;
height: 64px;
position: sticky; top: 0; z-index: 50;
```

---

### Badges / Status Tags

```css
/* Base badge */
padding: 4px 10px;
border-radius: 4px;
font-size: 11px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;

/* Variants */
.badge-confirmed  { background: rgba(34,197,94,0.15);  color: #22C55E; }
.badge-pending    { background: rgba(242,185,13,0.15); color: #F2B90D; }
.badge-done       { background: rgba(160,160,160,0.15); color: #A0A0A0; }
.badge-cancelled  { background: rgba(239,68,68,0.15);  color: #EF4444; }
.badge-popular    { background: #F2B90D; color: #0D0D0D; }
.badge-senior     { background: rgba(242,185,13,0.15); color: #F2B90D; }
```

---

### Tables (Admin)

```css
/* Table container */
background: #1A1A1A;
border: 1px solid #2A2A2A;
border-radius: 12px;
overflow: hidden;

/* Header row */
background: #111111;
font-size: 11px;
font-weight: 600;
color: #666666;
text-transform: uppercase;
letter-spacing: 0.05em;
padding: 12px 16px;
border-bottom: 1px solid #2A2A2A;

/* Data row */
padding: 14px 16px;
border-bottom: 1px solid #1F1F1F;
font-size: 14px;
color: #FFFFFF;

/* Row hover */
background: #222222;

/* Last row — no border */
border-bottom: none;
```

---

### Dividers
```css
border: none;
border-top: 1px solid #1F1F1F;
margin: 24px 0;
```

---

## 7. Layout

### Page Structure (Admin)
```
┌─────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content  │
│  - Logo                 │  - Top bar     │
│  - Nav items            │  - Page title  │
│  - Active highlight     │  - Content     │
│  - User info (bottom)   │                │
└─────────────────────────────────────────┘
```

### Page Structure (Public)
```
┌─────────────────────────────────────────┐
│  Sticky Top Nav (64px)                  │
├─────────────────────────────────────────┤
│  Page Sections (full width)             │
│  Max content width: 1200px, centered    │
│  Section padding: 80px vertical         │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

### Booking Flow Layout
```
┌─────────────────────────────────────────┐
│  Top Nav                                │
├─────────────────────────────────────────┤
│  Progress steps (SERVICE > BARBER > ... │
├─────────────────────────────────────────┤
│  Step content (scrollable)              │
├─────────────────────────────────────────┤
│  Sticky bottom bar (selection + CTA)    │
└─────────────────────────────────────────┘
```

### Breakpoints
```css
sm:   640px   /* Mobile landscape */
md:   768px   /* Tablet */
lg:   1024px  /* Desktop */
xl:   1280px  /* Large desktop */
2xl:  1536px  /* Extra large */
```

---

## 8. Iconography

- **Library:** Lucide React (`lucide-react`)
- **Default size:** 18px for inline, 20px for nav, 24px for feature icons
- **Color:** Inherit from parent or use `currentColor`
- **Stroke width:** 1.5 (default Lucide)

---

## 9. Motion & Transitions

```css
/* Default transition */
transition: all 0.2s ease;

/* Slow (page transitions, modals) */
transition: all 0.3s ease;

/* Instant (no animation needed) */
transition: none;
```

---

## 10. Tailwind v4 Theme Config (globals.css)

Tailwind v4 uses a CSS-first config — no `tailwind.config.ts`. All theme tokens are defined directly in `globals.css` using the `@theme` directive.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Font */
  --font-sans: "Space Grotesk", sans-serif;

  /* Brand Colors */
  --color-primary:        #F2B90D;
  --color-primary-hover:  #D4A20B;
  --color-secondary:      #8E7438;
  --color-tertiary:       #4ECFFF;
  --color-neutral:        #7E7668;

  /* Background Colors */
  --color-bg-base:        #0D0D0D;
  --color-bg-surface:     #1A1A1A;
  --color-bg-elevated:    #222222;
  --color-bg-sidebar:     #111111;
  --color-bg-input:       #1A1A1A;

  /* Text Colors */
  --color-text-primary:   #FFFFFF;
  --color-text-secondary: #A0A0A0;
  --color-text-muted:     #666666;
  --color-text-inverse:   #0D0D0D;

  /* Border Colors */
  --color-border:         #2A2A2A;
  --color-border-focus:   #F2B90D;
  --color-border-muted:   #1F1F1F;

  /* Status Colors */
  --color-success:        #22C55E;
  --color-error:          #EF4444;
  --color-info:           #4ECFFF;

  /* Border Radius */
  --radius-sm:            4px;
  --radius-md:            8px;
  --radius-lg:            12px;
  --radius-xl:            16px;
  --radius-full:          9999px;

  /* Shadows */
  --shadow-sm:   0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:   0 4px 12px rgba(0,0,0,0.5);
  --shadow-lg:   0 8px 24px rgba(0,0,0,0.6);
  --shadow-glow: 0 0 20px rgba(242,185,13,0.3);
}

/* Base styles */
body {
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}
```

Usage in components (same Tailwind utility class syntax):
```tsx
// Colors now available as Tailwind utilities
<div className="bg-bg-surface border border-border rounded-lg text-text-secondary">
```

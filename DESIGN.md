# Design System: Berry Kids

## 1. Visual Theme & Atmosphere

Berry Kids is a warm, editorial kids-activity guide for families in Haarlem — think a local Time Out for parents, not a corporate listings site. The design is photography-forward with a clean white canvas where event and activity photos do the heavy lifting. The brand accent Berry Red (`#E85A5A`) is warm and playful — softer than a hard red, approachable without being childish.

The typography uses Nunito — a rounded sans-serif that feels friendly and readable at every size, set with `font-extrabold` (800) for headings and `font-bold` (700) for emphasis. The roundedness of Nunito echoes the brand's playful warmth without crossing into cartoon territory. This is a site parents trust, not a kids' game.

The overall density is magazine-like: generous whitespace between sections, full-bleed hero imagery, and a rhythm of editorial blocks (hero → picks → newsletter → themed sections). The Berry mascot appears sparingly — a subtle wink, not an animated distraction. The warm neutral `#F0ECE8` (latte) is used for speech bubbles and soft surfaces, giving the site a cozy, tactile feel distinct from cold grays.

**Key Characteristics:**
- Clean white canvas (`#FFFFFF`) with Berry Red (`#E85A5A`) as singular brand accent
- Nunito — rounded sans-serif, always bold (700) or extrabold (800) for headings
- Photography-first: event images are the hero content, never decorative
- Warm neutrals: `#F0ECE8` (latte), `#F0E6E0` (warm border), `#FDF1EA` (blush surface)
- No pure black — text uses `#1A1A1A` (warm near-black)
- Generous border-radius: `rounded-2xl` (16px) on cards and containers
- Magazine-paced vertical rhythm — sections breathe, users browse
- Berry mascot is subtle — small icon, speech bubble, never dominant
- Red category nav bar — editorial navigation like Time Out
- Section headings use a red bar accent (`h-[3px] w-10 bg-[#E85A5A]`) before the title

## 2. Color Palette & Roles

### Primary Brand
- **Berry Red** (`#E85A5A`): Primary CTA, nav bar background, category labels, section accents, links on hover
- **Berry Red Hover** (`#D04A4A`): Pressed/hover state for red buttons and links
- **Berry Red Light** (`#FFD6D6`): Badge/pill backgrounds for subcategory tags

### Text Scale
- **Near Black** (`#1A1A1A`): Primary text, headings — warm, never cold
- **Dark Gray** (`#2B2B2B`): Secondary heading variant (film, newsletter)
- **Body Gray** (`#444`): Secondary body text (dates, locations)
- **Muted Gray** (`#666`): Descriptions, truncated text
- **Caption Gray** (`#6B6B6B`): Captions, metadata, opening hours
- **Placeholder** (`#999`): Input placeholders, subscriber counts
- **Whisper** (`#CCC`): Ad labels, decorative text
- **Ghost** (`#BBB`): Copyright, minimal UI text

### Surfaces & Borders
- **White** (`#FFFFFF`): Page background, card surfaces
- **Latte** (`#F0ECE8`): Berry speech bubble, warm surface blocks
- **Blush** (`#FDF1EA`): Newsletter success state, warm highlights
- **Cream** (`#FFF8F4`): Film time slot pills
- **Snow** (`#FAFAFA`): Newsletter section backgrounds
- **Ash** (`#F5F5F5`): Ad placeholders, neutral surfaces
- **Warm Border** (`#F0E6E0`): Input borders, pill borders
- **Light Border** (`#E5E5E5`): Section dividers, header border
- **Footer Border** (`#F0EBE6`): Footer top border

### Semantic
- **Free Green** (`#6FAF3A`): "Gratis" badge text
- **Free Green BG** (`#8BC34A` at 15%): "Gratis" badge background

### Overlays & Shadows
- **Card Shadow** (`0 2px 12px rgba(0,0,0,0.08)`): Default card elevation
- **Card Hover Shadow** (`0 4px 20px rgba(0,0,0,0.12)`): Hover state lift
- **Hero Gradient**: `linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)` — text readability on photos

## 3. Typography Rules

### Font Family
- **Primary**: `Nunito` via `next/font/google`, variable `--font-nunito`
- **Fallbacks**: `ui-sans-serif, system-ui, -apple-system, sans-serif`
- **Rendering**: `-webkit-font-smoothing: antialiased`

### Hierarchy

| Role | Size | Weight | Line Height | Extra | Notes |
|------|------|--------|-------------|-------|-------|
| Hero Title | `clamp(1.6rem, 4vw, 2.8rem)` | 800 (extrabold) | 1.08 | — | Hero slideshow main event |
| Section Heading | 26px | 800 (extrabold) | normal | Red bar prefix | `"Dit weekend"`, `"Gratis eropuit"` |
| Card Title | 18px (`text-lg`) | 700 (bold) | snug (1.25) | Hover → Berry Red | Event and activity card titles |
| Sub-heading | 28px | 800 (extrabold) | normal | Centered | `"Wat te doen in Haarlem"` |
| Newsletter Title | 26px | 800 (extrabold) | normal | — | CTA sections |
| Body | 14px (`text-sm`) | 400 | 1.6 (relaxed) | — | Descriptions, paragraphs |
| Category Label | 12px (`text-xs`) | 600 (semibold) | normal | Uppercase, wide tracking | `"Festival · Gratis"` |
| Section Label | 11px | 700 (bold) | normal | Uppercase, widest tracking | `"Elke vrijdag om 15:00"` |
| Nav Links | 12px (`text-xs`) | 700 (bold) | normal | Uppercase, wider tracking | Header + red category bar |
| Meta | 13px | 400–600 | normal | — | Dates, locations, prices |
| Micro | 10px | 400 | normal | Uppercase, widest tracking | Ad labels |
| Badge | 12px (`text-xs`) | 600–700 | normal | — | Tag pills |

### Principles
- **Always bold or extrabold for headings** — Nunito's rounded forms need weight to feel substantial. Never use weight 400 for titles.
- **Uppercase + tracking for labels** — category labels, nav links, and section labels always use `uppercase tracking-wider` or `tracking-widest` for editorial feel.
- **Responsive hero type** — use `clamp()` for hero titles to scale fluidly. Never use fixed px for hero-level text.
- **Hover color shifts** — headings and links transition to Berry Red on hover for interactive warmth.

## 4. Component Stylings

### Buttons

**Primary (Berry Red)**
- Background: `#E85A5A`
- Text: `#FFFFFF`, 14px, font-bold or font-semibold
- Padding: `px-6 py-2.5` (standard) or `px-7 py-3` (hero)
- Radius: `rounded-full` (pill shape)
- Hover: `#D04A4A`
- Usage: CTAs, newsletter submit, hero "Lees meer"

**Filter Pills**
- Background: `#E85A5A`
- Text: `#FFFFFF`, 13px, font-bold
- Padding: `px-6 py-2.5`
- Radius: `rounded-full`
- Always pill-shaped, always Berry Red

### Cards

**Event Card**
- Background: none (image + text below)
- Image: `aspect-[3/2]`, `rounded-xl`, `object-cover`
- Image hover: `scale-[1.03]` with 500ms transition
- Title: 18px bold, hover → Berry Red
- Meta: Berry Red category label (uppercase) above title
- Details: 14px `#444` (date, location)

**Activity Card**
- Background: `#FFFFFF`
- Radius: `rounded-2xl`
- Shadow: `0 2px 12px rgba(0,0,0,0.08)`
- Hover shadow: `0 4px 20px rgba(0,0,0,0.12)`
- Image: `aspect-[3/2]`, no radius (contained by card)
- Badge pills below image in `p-4`
- Subcategory: `#FFD6D6` bg, `#E85A5A` text
- Age label: `#F0E6E0` bg, `#6B6B6B` text

**Hero Tile (Magazine Grid)**
- Full-bleed image with gradient overlay
- Text positioned `absolute bottom-0`, white on dark gradient
- Category in Berry Red, uppercase, 11–13px bold
- Title in white, extrabold, responsive clamp sizing
- Large tile gets "Lees meer" button
- 3px white gaps between tiles, outer `rounded-2xl`

### Inputs
- Background: `#FFFFFF`
- Border: `1px solid #F0E6E0`
- Focus border: `#E85A5A`
- Radius: `rounded-full`
- Padding: `px-4 py-3`
- Placeholder: `#999`

### Navigation

**Header**
- White background, `border-b border-[#E5E5E5]`
- Berry icon (36px) + logo text left, search + newsletter right
- Search/newsletter links: 12px bold uppercase, hover → Berry Red

**Category Bar**
- Background: `#E85A5A` (full-width red bar)
- Links: white, 12px bold uppercase, `tracking-wider`
- Horizontal scrollable with hidden scrollbar
- Hover: `white/80`

### Berry Mascot
- Size: 48px (speech bubble) or 36px (newsletter)
- Animation: gentle bounce (`berry-bounce`, 2.5s ease-in-out infinite)
- Speech bubble: `#F0ECE8` background, `rounded-2xl`, with CSS triangle pointer
- Fade-in animation on bubble text

### Section Pattern
- Heading with red bar: `<span className="mr-3 inline-block h-[3px] w-10 align-middle bg-[#E85A5A]" />` before title text
- Consistent: 26px extrabold `#1A1A1A`
- Bottom spacing: `mb-8`

## 5. Layout Principles

### Container & Spacing
- Max width: `max-w-[1200px]` with `mx-auto`
- Horizontal padding: `px-5` (mobile), `sm:px-10` (tablet+)
- Section vertical spacing: `py-16` between major sections, `py-8–10` for lighter breaks
- Card grid gap: `gap-x-6 gap-y-8`

### Grid Patterns
- **Hero grid**: `grid-cols-[3fr_1fr]` with 3 stacked rows on right, 3px gaps
- **Event grid**: `lg:grid-cols-[5fr_2fr]` — content + sidebar ad
- **Card grids**: `sm:grid-cols-2 lg:grid-cols-3` — responsive 1→2→3 columns
- **Film + Theater**: `lg:grid-cols-2` — side by side

### Whitespace Philosophy
- **Magazine pacing**: Large vertical padding between sections creates a leisurely, editorial browsing rhythm. Parents are scanning between kid tasks — the layout should feel calm, not dense.
- **Image prominence**: Event cards use 3:2 aspect ratios to give photos room to breathe. The hero grid uses near-fullscreen images.
- **Section separation**: Sections are separated by whitespace, not borders (except header/footer). The red bar + bold title is the only visual section marker.

### Border Radius Scale
- **Subtle** (default): Image corners on event cards (`rounded-xl` = 12px)
- **Standard**: Cards, containers, speech bubbles (`rounded-2xl` = 16px)
- **Pill**: All buttons, inputs, filter tags (`rounded-full`)
- **Hero container**: `rounded-2xl` on the outer magazine grid

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, event cards (image + text) |
| Subtle (Level 1) | `shadow-sm` | Film card, inline containers |
| Card (Level 2) | `0 2px 12px rgba(0,0,0,0.08)` | Activity cards, elevated containers |
| Hover (Level 3) | `0 4px 20px rgba(0,0,0,0.12)` | Card hover state |

**Shadow Philosophy**: Berry Kids uses shadows sparingly. Event cards have no shadow — just image + text on white. Activity cards use a soft shadow because they're self-contained containers. The shadow is warm (low opacity black, generous blur) to match the brand's friendly tone. Never use hard or dark shadows.

## 7. Do's and Don'ts

### Do
- Use `#1A1A1A` (warm near-black) for text — never pure `#000000`
- Use Berry Red (`#E85A5A`) for CTAs, nav bar, labels, and accents — it's the one brand color
- Use Nunito at weight 700–800 for all headings — roundedness needs weight
- Use `rounded-full` for all buttons and inputs — pill shapes are core
- Use `rounded-2xl` for cards and containers — generous rounding
- Use photography as the primary content — images are always the hero
- Use warm neutrals (`#F0ECE8`, `#FDF1EA`) for surface variation — never cold grays
- Use the red bar prefix (`h-[3px] w-10 bg-[#E85A5A]`) before section headings
- Use uppercase + tracking for category labels and nav links
- Keep the Berry mascot small (36–48px) and subtle

### Don't
- Don't use pure black (`#000000`) anywhere — always warm near-black
- Don't use cold grays (`#F0F0F0`, `#E0E0E0`) — use warm variants (`#F0ECE8`, `#F0E6E0`)
- Don't use squared corners on interactive elements — always rounded
- Don't make the Berry mascot large or dominant — it's a subtle brand touch
- Don't use heavy/dark shadows — keep them soft and warm
- Don't introduce new brand colors beyond the Berry Red system
- Don't use light font weights (300, 400) for headings — 700 minimum
- Don't use borders to separate sections — use whitespace and the red bar heading pattern
- Don't use background colors for full sections — keep the white canvas clean (except nav bar and newsletter)
- Don't clutter cards with too many badges — max 2–3 pills per card

## 8. Responsive Behavior

### Breakpoints (Tailwind)
| Name | Width | Key Changes |
|------|-------|-------------|
| Base | <640px | Single column, `px-5`, compact hero |
| sm | 640px+ | 2-column grids, `px-10`, expanded spacing |
| md | 768px+ | Hero grid activates (large + 3 side tiles) |
| lg | 1024px+ | 3-column card grids, sidebar layout |

### Collapsing Strategy
- **Hero grid**: `[3fr_1fr]` mosaic → stacked (main image + 3 below)
- **Card grids**: 3 → 2 → 1 columns
- **Event section**: Content + sidebar → full-width content only
- **Category bar**: Horizontal scroll with hidden scrollbar at all sizes
- **Film + Theater**: Side by side → stacked

### Touch Targets
- Buttons: generous padding (`px-6 py-2.5` minimum)
- Cards: entire card is tap target (wrapped in Link/anchor)
- Nav links: adequate spacing (`gap-6`) in scrollable bar

## 9. Agent Prompt Guide

### Quick Color Reference
- Page background: `#FFFFFF`
- Text: `#1A1A1A`
- Brand accent: `#E85A5A`
- Brand hover: `#D04A4A`
- Warm surface: `#F0ECE8`
- Warm border: `#F0E6E0`
- Meta text: `#666`
- Caption: `#6B6B6B`

### Example Component Prompts
- "Create an event card: no background/shadow. 3:2 aspect image with rounded-xl, object-cover, scale-[1.03] on hover. Below: Berry Red category label (12px semibold uppercase), then 18px bold title (hover → Berry Red), then 14px #444 date/location."
- "Create a section heading: 26px extrabold #1A1A1A. Prefix with a span: h-[3px] w-10 bg-[#E85A5A] inline-block align-middle mr-3. Bottom margin mb-8."
- "Create a CTA button: #E85A5A background, white text, rounded-full, px-6 py-2.5, 14px font-bold. Hover: #D04A4A."
- "Create a newsletter block: #FAFAFA background, rounded-2xl, p-8. Centered content: 11px Berry Red uppercase label, 26px extrabold title, 14px #666 subtitle, email input (rounded-full, #F0E6E0 border) + Berry Red submit button."
- "Create a hero tile: full-bleed image, gradient overlay (to top, rgba(0,0,0,0.72) → transparent). Absolute bottom text: 13px uppercase Berry Red category, then clamp(1.5rem,3.5vw,2.6rem) extrabold white title, then Berry Red rounded-full 'Lees meer' button."

### Iteration Guide
1. Start with white canvas — photos provide all visual richness
2. Berry Red (`#E85A5A`) is the only accent — use it for CTAs, labels, nav, and section markers
3. Warm near-black (`#1A1A1A`) for text — the warmth matters
4. Warm neutrals for surfaces — `#F0ECE8` not `#F0F0F0`
5. Generous radius everywhere: `rounded-full` buttons, `rounded-2xl` cards
6. Nunito at 700–800 for headings — round type needs weight
7. Photography is hero — 3:2 aspect ratio, object-cover, scale on hover
8. Magazine rhythm — big whitespace between sections, editorial pacing
9. Berry mascot is a wink, not a shout — 36–48px, gentle bounce

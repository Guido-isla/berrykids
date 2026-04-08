# Design System: Berry Kids (v2 — Soft Pastel)

## 1. Visual Theme & Atmosphere

Berry Kids feels like a warm friend texting you on Saturday morning. The design lives in an illustrated, pastel world — like a children's book for adults. Soft, dreamy, organic. Every screen should feel handmade, not engineered.

Berry the mascot is the heart of the experience. Not an icon in the corner — Berry is present, animated, speaking directly to you. The interface IS Berry's world.

**Core principle:** Every visual element should help a parent decide in < 3 seconds.

**Key Characteristics:**
- Soft pastel gradients that shift with weather (peach, lavender, mint)
- Berry mascot at ~100px, prominent and animated
- Nunito — rounded, warm, the only font
- White cards floating on pastel backgrounds — depth through contrast
- Organic shapes: blurred blobs, wave dividers, rounded everything
- No sharp edges, no hard lines, no pure black
- Voice mixes warm friend + confident guide + playful helper
- Photography inside cards, illustrations/color for the world around them

**The ONE thing someone remembers:** "It felt like a friend"

**Berry NEVER feels like:** Kidsproof / listing site. This is next-gen social exploration with AI.

## 2. Color Palette

### Primary Brand
- **Berry Coral** (`#F4A09C`): Primary CTA, links, badges, Berry's glow
- **Berry Coral Hover** (`#E88E8A`): Pressed/hover state
- **Berry Coral Soft** (`#FFE9EA`): Light backgrounds, tags

### Weather-Reactive Backgrounds (THE EDGE)
```
Sunny:  linear-gradient(175deg, #FFF3E0 0%, #FFE4C4 40%, #FFD8B0 100%)
Rainy:  linear-gradient(175deg, #EDE7F6 0%, #D5CCF0 40%, #C5B8E8 100%)
Cold:   linear-gradient(175deg, #E0F5F0 0%, #C8EAE0 40%, #B8E0D4 100%)
```

### Mood Tile Colors
- **Buiten:** bg `#FFF3E0`, text `#A67A40`
- **Binnen:** bg `#EDE7F6`, text `#7B6BA0`
- **Energie:** bg `#FFE8E8`, text `#C06060`
- **Rustig:** bg `#E8F0FF`, text `#5B7090`
- **Gratis:** bg `#E8F8ED`, text `#4A8060`
- **Speciaal:** bg `#FFF0E5`, text `#B07040`

### Neutrals
- **Text Primary:** `#2D2D2D` (warm dark, never pure black)
- **Text Secondary:** `#6B6B6B`
- **Text Muted:** `#BBB`
- **Text Whisper:** `#D4C8BE`
- **Background:** `#FFF9F0` (warm cream, never pure white)
- **Card Surface:** `#FFFFFF`
- **Border:** `rgba(0,0,0,0.04)` (whisper borders)
- **Free Badge:** `#7BC67F` on cards, `#4A8060` text in tiles

### Decorative
- **Blobs:** `rgba(255,255,255,0.25)` with `blur(40px)`
- **Sparkles:** `rgba(255,255,255,0.5)` with twinkle animation
- **Frosted glass:** `rgba(255,255,255,0.5)` with `backdrop-filter: blur(8px)`

## 3. Typography

### Font
- **Only font:** `Nunito` via Google Fonts
- **Weights:** 400 (body), 600 (emphasis), 700 (bold), 800 (headings), 900 (hero)
- **Never use:** Inter, Roboto, Arial, system-ui as primary

### Scale
| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Hero headline | `clamp(24px, 4vw, 34px)` | 900 | Tight tracking `-0.8px` |
| Section label | 11px | 700 | Uppercase, `letter-spacing: 1.5px`, color `#D4C8BE` |
| Card title | 15–18px | 800 | Tracking `-0.2px` |
| Speech text | 15px | 600 | `line-height: 1.5` |
| Vibe label | 13px | 700 | Berry Coral color, lowercase |
| Body | 14px | 600 | |
| Meta | 12px | 600 | Color `#BBB` |
| Micro | 10–11px | 700 | Uppercase for badges/tags |

### Rules
- No long paragraphs. Ever.
- Line height: 1.05 for headlines, 1.5 for speech/body
- Berry's voice uses full sentences, not data points

## 4. Component System

### A. Header
- Berry icon (40px) + "Berry Kids" brand text (16px, extrabold, coral `#F4A09C`)
- Location pill: "Haarlem e.o." with pin SVG, `bg-[#2D2D2D]/[0.06]`, 10px bold
- Nav links: "Activiteiten", "Vakanties", "Zoeken" (12px, bold, 25% opacity, coral on hover)
- Inline search: coral bottom-border input, toggled by Zoeken button
- Desktop only: nav links hidden on mobile, search always visible

### B. Berry Zone (ATF — above the fold)
- Full pastel gradient background (weather-reactive)
- Blurred white blobs for organic depth
- Sparkle animations (subtle, 3s cycle)
- **Grid texture:** subtle 60px line pattern at `opacity: 0.04` for depth
- **Colored blob accent:** weather-tinted blur blob (peach/purple/teal) at `blur(80px)`
- **Floating emoji objects:** 8 per weather mood, desktop only (`hidden sm:block`)
  - Sunny: 🌳🚲🍦🦌🌊☀️🌻🪁
  - Rainy: ☕🎨📚🧩🎬🎭🖍️🧸
  - Cold: 🧤🏊🎪🎭⛸️🍫🧣🎵
  - Varying blur (0–2px), opacity (0.15–0.3), staggered `floatObject` animation
- Contains: header, Berry row, speech bubble, hero card
- Ends with wave divider SVG curving into content zone

### C. Berry Row
- Berry avatar: ~100px, `drop-shadow(0 6px 16px rgba(244,160,156,0.3))`
- Animated: gentle bob `4s ease-in-out infinite`
- Next to avatar: vibe label (coral) + headline (dark)
- Weather chip: frosted glass pill, far right

### D. Speech Bubble
- White card, `border-radius: 24px`, shadow `0 2px 16px rgba(0,0,0,0.04)`
- Triangle pointer `::before` pointing up to Berry
- Berry speaks in first person with opinions
- "After" line for the afternoon suggestion (lighter text)

### E. Hero Card (Berry's #1)
- `border-radius: 24px`, shadow `0 4px 24px rgba(0,0,0,0.06)`
- Image: 280px height, gradient overlay bottom
- "Berry's #1" tag: coral pill top-left
- Heart save button: frosted circle top-right
- Info pills on image: frosted glass `rgba(255,255,255,0.2)`
- Bottom bar: title + meta left, CTA button right
- Hover: `translateY(-3px)`, image `scale(1.04)` over 5s

### F. Mood Tiles (below fold)
- `border-radius: 20px`, unique pastel bg per mood
- Emoji (28px) + label (13px bold) + subtitle (10px)
- 3-column grid desktop, 2-column mobile
- Hover: `translateY(-3px)` + subtle shadow

### G. Activity Cards
- `border-radius: 20px`, white bg
- Shadow: `0 1px 8px rgba(0,0,0,0.04)`
- Image top (120-140px), optional "Gratis" pill
- Body: category (coral uppercase), title (bold), location (muted)
- Hover: lift + shadow increase
- Heart save button on image

### H. Wave Divider
```html
<svg viewBox="0 0 1440 50" preserveAspectRatio="none">
  <path d="M0,18 C320,50 720,0 1440,28 L1440,50 L0,50 Z" fill="#FFF9F0"/>
</svg>
```

## 5. Spacing (8px grid)
- Section padding: `24–32px`
- Card gap: `12px`
- Card internal padding: `14–20px`
- Berry zone inner: max-width `880px`
- Content zone: max-width `880px`

## 6. Motion
- Berry bob: `4s ease-in-out infinite`, translateY 0→-8px, rotate -1→1deg
- Sparkle twinkle: `3s ease-in-out infinite`, opacity 0.3→0.8, scale 0.8→1.2
- Card hover: `translateY(-3px)`, `0.2s ease`
- Hero image: `scale(1.04)`, `5s ease-out` on hover
- Weather transition: `0.6s ease` on background gradient
- CTA hover: `translateY(-1px)`, `0.2s ease`
- Floating objects: `floatObject` keyframes, 6–10s per object, staggered delays, gentle vertical drift

## 7. Berry's Voice
Berry speaks in three modes, mixed per context:
- **Warm friend:** "Wij zouden de pannenkoeken nemen." Uses "wij", casual.
- **Confident guide:** "Ga hierheen. Nu. Om 10:00 is het nog rustig."
- **Playful helper:** Emoji in the "after" line. "pannenkoeken in de duinen 🥞"

### Copy rules:
- First person: Berry says "ik" and "wij"
- Short sentences. Max 2 lines per thought.
- Opinions, not descriptions: "Het allerbeste van Haarlem bij regen" not "Vrij toegankelijk museum met..."
- Vibe labels are lowercase Spotify-style: "zonnige paasmaandag", "binnenblijf-dinsdag"

## 8. Do's and Don'ts

### Do
- Use pastel gradients for the ATF background
- Keep Berry prominent (~100px) and animated
- Use organic shapes (blobs, waves, rounded everything)
- Write like a friend, not a database
- Use `border-radius: 20-24px` on all cards
- Use frosted glass (`backdrop-filter: blur`) for overlays
- Keep shadows very soft (`rgba(0,0,0,0.04-0.06)`)
- Use `#FFF9F0` cream as page background

### Don't
- Use pure white (`#FFFFFF`) as page background (use cream)
- Use pure black (`#000000`) for text (use `#2D2D2D`)
- Use sharp corners on anything interactive
- Show long descriptions — tips and opinions only
- Use the old Berry Red (`#E85A5A`) — replaced by coral `#F4A09C`
- Use Inter or any generic font — Nunito only
- Make Berry small (< 72px) — Berry is the personality
- Create sections that feel like a listing/directory

## 9. Responsive

### Mobile
- Berry avatar: 72px
- Hero image: 200px height
- Mood grid: 2 columns
- Alt cards: 1 column
- Hide weather chip, nav links, and floating emoji objects
- Speech text: 14px

### Desktop
- Berry avatar: 100px
- Hero image: 280px height
- Mood grid: 3 columns
- Alt cards: 2 columns
- Show weather chip, nav links, and floating emoji objects

## 10. Mobile Text Minimums

**Rule: nothing below 12px on mobile.** Badges/tags minimum 11px.

| Element | Mobile | Desktop |
|---------|--------|---------|
| Berry daily message | 14px | 15px |
| List item title | 15px | 15px |
| List item subtitle | 13px | 13px |
| Section heading | 20px | 22px |
| Section Berry intro | 14px | 14px |
| Card title (BerryCard) | 15px | 16px |
| Card meta/location | 13px | 13px |
| Berry tip on card | 12px | 13px |
| Tomorrow flip | 13px | 13px |
| Footer text | 12px | 12px |

## 11. Homepage Structure

Berry guides through a curated day — each section unique, no duplicates:

```
1. Header
2. Berry's picks (top 5 ATF — no pills, no mood switching)
3. 🌳 Buiten tips (3 BerryCards — outdoor, NOT in top 5)
4. Newsletter signup
5. 🎬 Kinderfilms (horizontal poster scroll)
6. 🏠 Binnen tips (3 BerryCards — indoor, NOT in top 5 or buiten)
7. 🎭 Theater & concerten (compact list)
8. 💡 Meer ontdekken (3 BerryCards — hidden gems)
9. 🌷 Meivakantie CTA
10. Bottom newsletter
11. Footer
```

**Each section has:**
- Berry intro line (weather-aware, opinionated)
- Zero duplicates (progressive exclusion by slug)
- Berry tip on every card (contextual, subcategory-specific)

**Content dedup:** `usedSlugs` Set grows as each section picks items.
5 + 3 + 3 + 3 = 14 unique items minimum.

**Scoring:** daily seed for variety (hash of date + slug), max 2 per subcategory.

## 12. BerryCard Component

Unified card for Buiten, Binnen, Meer ontdekken sections:

```
┌─────────────────────┐
│  [image, 3:2 ratio] │
│  🍓 Berry tip        │  ← white text on dark gradient overlay
│  ♡ save             │  ← frosted circle, top right
├─────────────────────┤
│  Title              │  15px bold (mobile), 16px (desktop)
│  📍 Location        │  13px #6B6B6B
│  Gratis / €12       │  13px, green if free
└─────────────────────┘
```

- `border-radius: 20px`, white bg
- Shadow: `0 1px 8px rgba(0,0,0,0.04)`, hover: `0 4px 16px rgba(0,0,0,0.08)`
- Hover: `-translate-y-1`, image `scale(1.03)`
- Mobile: `w-[80vw] shrink-0` in horizontal scroll
- Desktop: full-width in 3-column grid

## 13. Brand Assets
- **Favicon:** Berry mascot icon (`src/app/icon.png`), replaces default Next.js favicon

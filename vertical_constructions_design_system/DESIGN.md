---
name: Vertical Constructions Design System
colors:
  surface: '#fff9ef'
  surface-dim: '#e1d9c7'
  surface-bright: '#fff9ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf3e0'
  surface-container: '#f6edda'
  surface-container-high: '#f0e7d5'
  surface-container-highest: '#eae2cf'
  on-surface: '#1f1b10'
  on-surface-variant: '#4d4732'
  inverse-surface: '#343024'
  inverse-on-surface: '#f9f0dd'
  outline: '#7e775f'
  outline-variant: '#d0c6ab'
  surface-tint: '#705d00'
  primary: '#705d00'
  on-primary: '#ffffff'
  primary-container: '#ffd700'
  on-primary-container: '#705e00'
  inverse-primary: '#e9c400'
  secondary: '#3b6934'
  on-secondary: '#ffffff'
  secondary-container: '#b9eeab'
  on-secondary-container: '#3f6d38'
  tertiary: '#5f5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#dcd9d9'
  on-tertiary-container: '#5f5f5e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe16d'
  primary-fixed-dim: '#e9c400'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#544600'
  secondary-fixed: '#bcf0ae'
  secondary-fixed-dim: '#a1d494'
  on-secondary-fixed: '#002201'
  on-secondary-fixed-variant: '#23501e'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#fff9ef'
  on-background: '#1f1b10'
  surface-variant: '#eae2cf'
  base-white: '#FFFFFF'
  electric-yellow: '#FFD700'
  forest-green: '#2D5A27'
  contrast-charcoal: '#222222'
  safety-accent: '#FFD700'
  sustainability-accent: '#2D5A27'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  subheading:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0.05em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
spacing:
  base: 8px
  container-max: 1440px
  gutter: 24px
  section-padding: 120px
  card-gap: 32px
---

# Design Documentation: Vertical Constructions Website

## 1. Brand Concept: "Architectural Vibrancy"
The identity for Vertical Constructions balances **technical precision** with **modern energy**. By using a palette of White, Yellow, and Green, we move away from the "boring grey" of typical construction and toward a look that signifies growth, safety, and high-end results.

---

## 2. Visual Identity

### 2.1 Color Palette
* **Base White (#FFFFFF):** The primary canvas. Provides a "Gallery" feel that makes project photos pop.
* **Electric Yellow (#FFD700):** Represents energy, action, and construction safety. Used for CTAs and "Power Elements."
* **Deep Forest Green (#2D5A27):** Represents sustainability, trust, and "Green Building" standards. Used for headings and primary accents.
* **Contrast Charcoal (#222222):** Used for body text and structural lines to maintain professional weight.

### 2.2 Typography
* **Headings:** *Archivo Black* (A heavy, industrial sans-serif that feels like steel beams).
* **Sub-headings:** *Montserrat Medium* (Clean and modern).
* **Body:** *Inter* (Optimized for technical readability).

---

## 3. UI/UX Component Specifications

### 3.1 The Hero Section (The "Impact" Area)
* **Visual:** A split-screen layout. 
    * **Left (White):** Large, bold typography in Green: "WE BUILD THE FUTURE VERTICALLY."
    * **Right:** A high-saturation photo of a modern glass building with a Yellow geometric overlay.
* **Button:** A Yellow "Request a Quote" button with a Green hover-state animation.

### 3.2 Services Grid
* **Design:** White cards with a subtle 1px Green border.
* **Iconography:** Minimalist line-art icons in Yellow.
* **Content:** Residential, Commercial, and Industrial divisions.

### 3.3 The Portfolio (The "Proof")
* **Layout:** "Structural Masonry" grid (uneven blocks representing building segments).
* **Interaction:** Images are slightly desaturated. On hover, they bloom into full color with a Yellow border appearing around the frame.

---

## 4. Final Refined UI Prompt
> "Design a beautiful, professional, and colorful UI for 'Vertical Constructions.' Use a high-contrast palette of **Pure White, Vibrant Construction Yellow, and Deep Forest Green.** > 
> **Typography:** Use oversized, heavy-weight sans-serif fonts for a structural feel. 
> 
> **Layout:** > 1) A clean white Hero section with a massive Yellow CTA button. 
> 2) A 'Project Gallery' using asymmetrical grid layouts and green accent lines. 
> 3) Use generous white space to ensure it feels like a luxury architectural firm. 
> 4) Incorporate green 'Sustainability' badges and yellow 'Precision' icons. 
> 
> The final result should look expensive, modern, and energetic, avoiding all generic corporate templates."

---

## 5. Mobile Strategy
* **Navigation:** A "sticky" bottom bar in Deep Green for easy thumb access.
* **Cards:** Single-column vertical scroll with Yellow progress bars for project milestones.
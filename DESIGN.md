# Design System: BlogFlow Premium Dark SaaS

We use a premium, immersive **"3D Glassmorphism + Dark Professional"** design system inspired by the aesthetics of Vercel and Linear. It is built for a developer/creator blogging platform.

## 1. Visual Theme & Atmosphere
- **Atmosphere:** Deep, immersive, futuristic, clean, and distraction-free.
- **Aesthetic:** High-contrast text on ultra-dark matte slate/violet foundations. Employs soft multi-layered glass cards, glowing borders, and energetic gradient transitions to emphasize important call-to-actions.

---

## 2. Color Palette & Roles

### Base & Backgrounds
*   **Deep Obsidian Space (`#0a0a0f`):** The primary background color. Reduces eye strain and isolates structural elements.
*   **Muted Slate Text (`#94a3b8`):** Used for metadata, subtitles, and general captions.
*   **Bright Silver (`#f1f5f9` / `#ffffff`):** Used for primary headings and body readability.

### Brand Accents (Linear Gradients)
*   **Indigo Electric (`#6366f1`):** The primary brand identity accent. Used for buttons, active navigation, and border glow.
*   **Cyan Neon (`#22d3ee`):** The secondary highlight tone. Used in gradients to create neon illumination.
*   **SaaS Accent Gradient (`linear-gradient(135deg, #6366f1, #22d3ee)`):** The default gradient color space. Used on active logos, button text hover, and cards.

---

## 3. Typography Rules
*   **Primary Font:** `Inter` (sans-serif) - chosen for its clean, geometric, high-readability layout at small sizes.
*   **Header Weights:** Font-bold or font-extrabold (`700` or `800`) with tighter letter-spacing (`tracking-tight`) to evoke modern engineering design.
*   **Code Elements:** `JetBrains Mono` or default monospaced font, styled with soft purple backgrounds for code tags.

---

## 4. Component Stylings

### Buttons
*   **Primary Variant:** Rounded pill-shape or `rounded-xl` with indigo-to-violet gradient background and a subtle interior white glow.
*   **Ghost Variant:** Dark glass style with transparent backgrounds, white borders (`border-white/10`), lifting up slightly on hover.
*   **Danger Variant:** Deep crimson-to-rose red gradient layout.

### Cards & Containers
*   **Glassmorphic Cards:** Translucent white fills (`rgba(255, 255, 255, 0.04)`) with an elegant 16px background blur (`backdrop-filter: blur(16px)`), standard 16px corner roundness (`rounded-2xl`), and a fine border outline.

### Inputs & Forms
*   **Glass Fields:** Dark input containers with subtle focus shadows, expanding a thin indigo outline when active.

---

## 5. Layout Principles
- **Whitespace Strategy:** Wide margin columns, dense content cards, and strict alignment to a 4px/8px layout grid.
- **Depth Map:** Header navigation remains static at the top with high backdrop-blur values. Modal elements sit on heavy shadow overlays (`shadow-2xl`) above the glass card structure.

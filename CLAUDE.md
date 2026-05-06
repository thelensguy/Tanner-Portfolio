# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview production build
```

## Architecture

This is a Vite + React 19 project. All components live in `src/components/` and are standard ES modules.

```
src/
  main.jsx                  # mounts App into #root
  App.jsx                   # root component; owns tweaks state and active-section tracking
  index.css                 # all CSS (extracted from the original Portfolio.html)
  components/
    TweaksPanel.jsx         # useTweaks hook + TweaksPanel/TweakSection/TweakToggle/TweakSlider
    Cursor.jsx
    Lens.jsx
    Nav.jsx
    Hero.jsx                # imports Lens
    Work.jsx                # exports useReveal and TiltCard (consumed by InFocus and Contact)
    InFocus.jsx             # imports useReveal from Work
    Contact.jsx             # imports useReveal from Work
public/
  screenshots/              # hero.jpg, hero2.jpg (available at /screenshots/*)
```

`Portfolio.html` in the project root is the original CDN/Babel version — kept as a reference but not used by Vite.

## Key patterns

**Tweaks system** (`app.jsx`): `TWEAK_DEFAULTS` at the top of `app.jsx` (between `/*EDITMODE-BEGIN*/` and `/*EDITMODE-END*/` markers) holds runtime-configurable values — dark mode, amber hue, kinetic strength, cursor toggle. The `useTweaks` hook (from the missing `tweaks-panel.jsx`) manages this state.

**Scroll reveal** (`useReveal` in `Work.jsx`): IntersectionObserver hook that adds the `.in` class to elements with the `.reveal` CSS class, triggering a blur→sharp + fade-up animation. Exported as `window.useReveal` so `InFocus.jsx` and `Contact.jsx` can reuse it.

**Cursor modes** (`Cursor.jsx`): The amber cursor changes shape based on what's under it — dot (default), pill (over `h1/h2/h3/p` or `[data-cursor="pill"]`), ring (over `a/button` or `[data-cursor="ring"]`). Hidden on touch/stylus devices via `(hover: hover) and (pointer: fine)` media query.

## Design system

All CSS lives in the `<style>` block of `Portfolio.html`. Color tokens are CSS custom properties on `:root`:

| Variable | Value | Role |
|---|---|---|
| `--cream` | `#f5f0e8` | Light background |
| `--ink` | `#0f0e0c` | Text / dark fills |
| `--amber` / `--amber-deep` | oklch-computed | Accent; hue adjustable via JS |
| `--espresso` | `#1a1410` | Dark mode background |
| `--warm-gray` | `#8a8070` | Secondary text |

Dark mode is toggled by adding `body.dark` — every dark-mode override uses this selector.

Typefaces: **Playfair Display** (serif headings), **DM Sans** (body, weight 300), **JetBrains Mono** (labels, code, SVG text). All loaded from Google Fonts in `Portfolio.html`.

Project shots (`TravaShot`, `FolioShot` in `Work.jsx`) are hand-crafted SVG scenes — never real screenshots or placeholder images.

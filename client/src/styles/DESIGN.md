---
version: alpha
name: Happy Paws
description: Warm, friendly veterinary identity — cream backgrounds, deep teal primary, coral accent.
colors:
  background: "#FAF6EF"
  foreground: "#1F2A2A"
  muted: "#5B6A69"
  primary: "#0F766E"
  primary-hover: "#0D685F"
  accent: "#E86A33"
  accent-hover: "#F08653"
  accent-soft: "#FCE8D2"
  success: "#1D6B4F"
  success-soft: "#E4F2EC"
  warning: "#8A5A00"
  warning-soft: "#FBF3DF"
  danger: "#B4231F"
  danger-soft: "#FBE9E7"
typography:
  display-xl:
    fontFamily: Baloo 2
    fontSize: 3rem
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  display-lg:
    fontFamily: Baloo 2
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  display-md:
    fontFamily: Baloo 2
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.2
  heading-lg:
    fontFamily: Baloo 2
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
  heading-md:
    fontFamily: Baloo 2
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: Nunito Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Nunito Sans
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Nunito Sans
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  caption:
    fontFamily: Nunito Sans
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "12px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "12px"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "12px"
    typography: "{typography.body}"
  button-accent-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "12px"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "12px"
    typography: "{typography.body}"
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "12px"
  card:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  chip-accent:
    backgroundColor: "{colors.accent-soft}"
    textColor: "#85340C"
    rounded: "{rounded.full}"
    padding: "4px 12px"
    typography: "{typography.label}"
  chip-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
    typography: "{typography.label}"
  chip-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
    typography: "{typography.label}"
  chip-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
    typography: "{typography.label}"
  caption-muted:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
---

## Overview

Happy Paws is a veterinary identity built around two feelings: **calm** (deep teal, cream) and **warm** (coral). The paw mark — coral toes, teal heart pad — is the brand's signature; the UI inherits its palette but is deliberately quieter, so content and patient information stay legible.

## Colors

- **Primary (#0F766E):** the teal of the paw's heart pad. Drives all core actions, links, focus rings, and active states.
- **Accent (#E86A33 / soft #FCE8D2):** a deeper coral for emphasis moments (highlights, celebratory states, secondary CTAs). Never body text — coral is a decorative hue in the logo.
- **Background (#FAF6EF):** soft cream, the brand's paper. Surfaces are white; the cream sits behind them.
- **Foreground (#1F2A2A):** ink — a teal-tinted near-black, not pure black.
- **Muted (#5B6A69):** secondary text, captions, disabled labels.

Dark mode inverts the relationship: a deep teal-black background (#0B1514) with cream text, and the accents *lighten* (primary becomes #2DD4BF, accent #F7B267) so they glow instead of recede.

## Typography

**Baloo 2** (rounded, warm display) for headings and the wordmark — mirrors the paw's softness.
**Nunito Sans** for everything body — humanist, friendly, highly legible at small sizes.
All-caps labels use wide letter-spacing (0.08em), never tracking on body copy.

## Layout

4px base grid. Spacing scale: 4 / 8 / 16 / 24 / 32 / 48 / 64. Content max-width 1120px. Generous whitespace — the brand is warm, not dense.

## Elevation & Depth

Light mode: warm-tinted soft shadows (low alpha, large blur). Dark mode: elevation is expressed by border color + slightly lighter surface steps, not shadows (shadows are nearly invisible on dark).

## Shapes

Rounded is the brand default: sm 6px (inputs), md 10px (buttons), lg 16px (cards), xl 24px (modals/hero panels), full 9999px (chips, avatar rings, badge circle).

## Components

- `button-primary` is the default high-emphasis action (teal, white text — 5.47:1).
- `button-accent` is reserved for one moment per screen (booking CTA, "approved" actions) — coral, white text (4.6:1, AA for large text; use 600+ weight).
- `button-secondary` and `button-ghost` de-emphasize; ghost is for icon rows and table actions.
- `card` is the base container (white on cream, lg radius, soft shadow).
- `chip-accent` is the only place coral-tinted text is allowed (#85340C on #FCE8D2, 7.06:1).

## Do's and Don'ts

- **Do** keep coral out of body copy; use `accent-soft` background + brown text for coral-tinted callouts.
- **Don't** pair coral and teal at equal visual weight in the same component — one leads, the other punctuates.
- **Do** use cream (#FAF6EF) as the app background so white cards float.
- **Don't** introduce new hues (e.g., blue or purple) for state colors; success/warning/danger stay in the existing family.
- **Do** mirror the badge's circular geometry for avatars, icons, and the logo chip.
- **Don't** use pure black (#000) or pure white as text/border on cream — the brand's ink and borders are tinted.

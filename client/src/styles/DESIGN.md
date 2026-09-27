---
version: alpha
name: Happy Paws
description: Bright, friendly veterinary identity — cream paper, navy ink, electric blue and sunshine yellow with sage green.
colors:
  background: "#FDFFF1"
  foreground: "#00345B"
  muted: "#4E6E85"
  primary: "#0091FD"
  primary-hover: "#0070E0"
  primary-soft: "#D6EFFF"
  accent: "#FFFEA1"
  accent-hover: "#FDF489"
  accent-soft: "#FFFEA1"
  success: "#3E6B14"
  success-soft: "#DCF2AA"
  warning: "#6E6200"
  warning-soft: "#FFFEA1"
  danger: "#B4231F"
  danger-soft: "#FBE9E7"
typography:
  display-xl:
    fontFamily: League Spartan
    fontSize: 3rem
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  display-lg:
    fontFamily: League Spartan
    fontSize: 2.25rem
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  display-md:
    fontFamily: League Spartan
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.2
  heading-lg:
    fontFamily: League Spartan
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
  heading-md:
    fontFamily: League Spartan
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: Baloo Thambi 2
    fontSize: 1.125rem
    fontWeight: 500
    lineHeight: 1.6
  body:
    fontFamily: Baloo Thambi 2
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.6
  body-sm:
    fontFamily: Baloo Thambi 2
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.55
  label:
    fontFamily: Baloo Thambi 2
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  caption:
    fontFamily: Baloo Thambi 2
    fontSize: 0.75rem
    fontWeight: 500
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
    textColor: "{colors.warning}"
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

Happy Paws is a veterinary identity built around **bright, confident, cheerful**: cream paper, navy ink, an electric blue that drives action, and a sunshine yellow that celebrates it. A sage green grounds "all clear" states. The mood is a sunny clinic — nothing muted, nothing dark, except the navy ink that holds it together.

## Colors

- **Primary (#0091FD):** electric blue — the brand's action color. All core buttons, links, focus rings, and active states. Button text on it is white (AA on the hover/active shades: #0070E0 at 4.8:1, deeper on #005FC0); when blue is used *as text* on light backgrounds, step down to the ink-safe shade #0062C8 (5.8:1).
- **Accent (#FFFEA1):** sunshine yellow — emphasis moments (highlights, celebratory states, secondary CTAs). It is already a pastel, so `accent-soft` **is** the accent; yellow-tinted callouts pair it with olive ink text (#6E6200, 5.9:1).
- **Background (#FDFFF1):** soft cream, the brand's paper. Surfaces are white; the cream sits behind them.
- **Foreground (#00345B):** navy ink — the design's dark hue. All body text, headings, and borders derive from it.
- **Muted (#4E6E85):** slate — secondary text, captions, disabled labels (5.3:1 on cream).
- **Success (#3E6B14 / soft #DCF2AA):** the design's sage green for "all clear" states (vaccinated, confirmed).
- **Danger (#B4231F / soft #FBE9E7):** red is deliberately *outside* the brand palette — overdue/critical states need red, and it stays unmistakably separate from blue/yellow/green.

Dark mode inverts on the navy axis: a deep navy-black background (#041E30) with near-white text (#F4FAFF). Blue lightens to #33AAFF so it glows on the dark navy; yellow stays #FFFEA1 (it is already the lightest hue in the brand); success greens up to #8FD14F.

## Typography

**League Spartan** (condensed, confident) for headings and the wordmark — tall, bold, sporty; it carries the "confident" feeling of the brand.
**Baloo Thambi 2** (rounded, warm) for everything body — friendly, highly legible, with a slightly heavier default (weight 500) so text sits up on the bright palette.
All-caps labels use wide letter-spacing (0.08em), never tracking on body copy.
Both families are variable fonts: League Spartan runs 100–900, Baloo Thambi 2 runs 400–800 — so weight 900 is League-only and weight 300 is League-only too.

## Layout

4px base grid. Spacing scale: 4 / 8 / 16 / 24 / 32 / 48 / 64. Content max-width 1120px. Generous whitespace — the brand is bright and open, not dense.

## Elevation & Depth

Light mode: navy-tinted soft shadows (low alpha, large blur) so depth reads against the cream. Dark mode: elevation is expressed by navy surface steps (#041E30 → #0A2D47 → #103A5A) and border color, not shadows.

## Shapes

Rounded is the brand default: sm 6px (inputs), md 10px (buttons), lg 16px (cards), xl 24px (modals/hero panels), full 9999px (chips, avatar rings, badge circle).

## Components

- `button-primary` is the default high-emphasis action (electric blue, white text — AA on the hover/active shades).
- `button-accent` is reserved for one moment per screen (booking CTA, "approved" actions) — sunshine yellow, navy ink text (12.1:1).
- `button-secondary` and `button-ghost` de-emphasize; ghost is for icon rows and table actions.
- `card` is the base container (white on cream, lg radius, soft navy-tinted shadow).
- `chip-accent` is the only place olive text (#6E6200) sits on yellow — 5.9:1.
- `chip-success` is the only place the sage green appears — #3E6B14 on #DCF2AA, 5.2:1.

## Do's and Don'ts

- **Do** keep yellow as emphasis, not body copy — yellow-tinted callouts use `accent-soft` + olive text (#6E6200).
- **Don't** use white text on the electric blue *base* shade as body text — it sits at 3.3:1. White is fine on button hover/active (#0070E0, 4.8:1); for blue-as-text use #0062C8.
- **Do** use cream (#FDFFF1) as the app background so white cards float; navy ink for all text.
- **Don't** introduce new hues for brand moments — blue, yellow, sage green, navy are the brand; red is reserved for danger only.
- **Do** pair League Spartan (headings) with Baloo Thambi 2 (body) — never swap them; the contrast between condensed-bold and rounded-warm is the brand's voice.
- **Don't** use pure black (#000) or pure white as text on cream — the brand's ink is navy (#00345B) and its paper is cream (#FDFFF1).

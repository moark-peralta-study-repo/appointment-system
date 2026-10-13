---
version: alpha
name: Pink Paws
description: Warm, friendly veterinary identity — soft pink paper, plum ink, magenta and navy from the Pink Paws logo, rounded Quicksand + Baloo type.
colors:
  background: "#FDF2FA"
  foreground: "#241A35"
  muted: "#5D4C6B"
  primary: "#E21990"
  primary-hover: "#C41380"
  primary-active: "#A8106B"
  primary-soft: "#FBE0F1"
  primary-text: "#A8106B"
  accent: "#F9D3EC"
  accent-hover: "#F3BCD9"
  accent-soft: "#FDE7F5"
  success: "#2F7D4F"
  success-soft: "#D9F0E3"
  warning: "#9A5B00"
  warning-soft: "#FDEEDD"
  danger: "#C02740"
  danger-soft: "#FBE2E6"
typography:
  display-xl:
    fontFamily: Quicksand
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0em"
  display-lg:
    fontFamily: Quicksand
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.15
  display-md:
    fontFamily: Quicksand
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.2
  heading-lg:
    fontFamily: Quicksand
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
  heading-md:
    fontFamily: Quicksand
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
  sm: 8px
  md: 12px
  lg: 18px
  xl: 26px
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
    textColor: "{colors.primary-text}"
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

Pink Paws is a veterinary identity rebuilt around the clinic's real logo: a
soft **magenta heart** (with paw + stethoscope) and **navy** "VETERINARY
CLINIC" lettering. The palette is warm and rounded — soft pink paper, plum
ink, a magenta that drives action, and a pink accent that celebrates it.
Sage green grounds "all clear" states. The mood is a caring, approachable
clinic: friendly, not clinical.

The logo's colors were sampled directly from the source mark:
magenta `#E21990`, navy `#1F326E`, white heart fill. Navy remains the
"inverse" surface (sidebar, footer, login side, emergency banner) in both
light and dark mode.

## Colors

- **Primary (#E21990):** logo magenta — the brand's action color. Buttons,
  links, focus rings, active states. White text on it is 4.4:1 (large-text AA);
  step down to the hover shade `#C41380` (5.6:1) for white text on small UI.
  When magenta is used *as text* on light backgrounds, use `--primary-text`
  `#A8106B` (7.1:1).
- **Accent (#F9D3EC):** soft pink — emphasis moments, celebratory states,
  secondary highlights. Tinted callouts pair it with plum text `#7A1B55`.
- **Background (#FDF2FA):** soft pink paper. Surfaces are white; the pink
  wash sits behind them so cards float.
- **Foreground (#241A35):** deep plum ink — the design's dark hue. All body
  text, headings, and most borders derive from it.
- **Muted (#5D4C6B):** muted plum — secondary text, captions, disabled
  labels (7.1:1 on pink paper).
- **Inverse (#1F326E):** navy — the logo's "VETERINARY CLINIC" color.
  Sidebars, footer, login side-panel, emergency banner, booking bar, avatars.
- **Success (#2F7D4F / soft #D9F0E3):** green for "all clear" states
  (vaccinated, confirmed).
- **Danger (#C02740 / soft #FBE2E6):** red is deliberately outside the brand
  palette — overdue/critical states need it, and it stays separate from
  magenta (danger is red, magenta is pink/purple).

Dark mode inverts on a **plum** axis: deep plum background `#171021` with
near-white text `#F6F1FB`. Magenta lightens to `#F0559F` so it glows on the
dark plum; navy inverse panels stay navy (`#131C38`).

## Typography

**Quicksand** (rounded geometric) for headings and the wordmark — it matches
the logo's soft, friendly lettering. Bold 700 is its ceiling (it does not run
to 900), so display "black" weights map to 700.
**Baloo Thambi 2** (rounded, warm) for everything body — friendly, highly
legible, with a slightly heavier default (weight 500) so text sits up on the
light palette.
All-caps labels use wide letter-spacing (0.08em), never tracking on body copy.

## Layout

4px base grid. Spacing scale: 4 / 8 / 16 / 24 / 32 / 48 / 64. Content
max-width 1120px. Generous whitespace — the brand is warm and open, not dense.

## Elevation & Depth

Light mode: plum-tinted soft shadows (low alpha, large blur) so depth reads
against the pink. Dark mode: elevation is expressed by plum surface steps
(#171021 → #221833 → #2B1E40) and border color, not shadows.

## Shapes

Rounded is the brand default (slightly rounder than a typical SaaS to echo
the logo): sm 8px (inputs), md 12px (buttons), lg 18px (cards), xl 26px
(modals/hero panels), full 9999px (chips, avatar rings, badge circle).

## Components

- `button-primary` is the default high-emphasis action (magenta, white text —
  large-text AA; hover `#C41380` is 5.6:1).
- `button-accent` is reserved for one moment per screen (booking CTA,
  "approved" actions) — soft pink, plum ink text.
- `button-secondary` and `button-ghost` de-emphasize; ghost is for icon rows
  and table actions.
- `card` is the base container (white on pink, lg radius, soft plum-tinted
  shadow).
- `chip-success` is the only place the sage green appears.

## Do's and Don'ts

- **Do** use the soft pink paper (#FDF2FA) as the app background so white
  cards float; plum ink (#241A35) for all text.
- **Don't** introduce new hues for brand moments — magenta, navy, plum, pink
  are the brand; green is reserved for success, red for danger only.
- **Do** pair Quicksand (headings) with Baloo Thambi 2 (body) — never swap
  them; the contrast between rounded-geometric and rounded-warm is the
  brand's voice.
- **Don't** place the full color lockup on navy backgrounds — the navy
  "VETERINARY CLINIC" line would disappear. Use the heart mark + a white
  "Pink Paws" label there (see footer, booking header, sidebars).
- **Don't** use pure black (#000) or pure white as text on pink — the brand's
  ink is plum (#241A35) and its paper is soft pink (#FDF2FA).

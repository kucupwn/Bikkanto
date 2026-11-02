---
name: Bikkanto
description: Bodyweight workouts rolled from your own exercise library, shown on a split-flap departure board.
colors:
  board: "#0b0b0d"
  board-cell: "#17181b"
  board-cell-hi: "#1f2024"
  board-line: "#2a2d31"
  board-ink: "#f2f2f2"
  board-ink-2: "#a7aaaf"
  amber: "#ffb000"
  amber-hover: "#ffc233"
  red: "#ff5a4f"
  red-solid: "#b00020"
  green: "#3ccf6e"
  rail: "#1d1f23"
  ground-light: "#dcdee1"
  panel-light: "#eceef0"
  line-light: "#b4b8bd"
  ink-light: "#0e0f11"
  ink-2-light: "#474b51"
  ground-dark: "#16181b"
  panel-dark: "#1f2226"
  line-dark: "#3a3e44"
  ink-2-dark: "#b4b7bc"
typography:
  board-xl:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "clamp(40px, 7vw, 88px)"
    fontWeight: 700
    lineHeight: 1
  page-title:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.06em"
  board-row:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.05em"
  label:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.12em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  cell: "2px"
  sm: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.board}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.amber-hover}"
  button-secondary:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.sm}"
    height: "40px"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.sm}"
    height: "40px"
  board:
    backgroundColor: "{colors.board}"
    textColor: "{colors.board-ink}"
    rounded: "{rounded.sm}"
  flap-cell:
    backgroundColor: "{colors.board-cell}"
    textColor: "{colors.board-ink}"
    rounded: "{rounded.cell}"
  nav-rail:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.board-ink-2}"
    width: "232px"
---

# Design System: Bikkanto

## Overview

**Creative North Star: "The Departure Board"**

A rolled workout is a timetable for the next forty minutes. Bikkanto shows it the way a rail concourse shows departures: matte black boards, condensed white caps in fixed cells, amber for what is live, and characters that flip into place when something changes. Everything around the board is a calm steel frame with standard controls, so the athlete knows where everything is before they notice the world.

The world lends four things and only these: type (Barlow Condensed caps), palette (flap black, letter white, delay amber, cancel red), density (ruled rows, tabular numbers), and one signature move (the split-flap cascade). Navigation, forms and tables stay the familiar web controls.

**Key Characteristics:**
- Boards are flap black in both themes; only the frame around them changes.
- Amber means "act here" or "live now": the primary action, the current nav item, column heads, reps.
- Numbers are tabular and sit in fixed cells, so a reroll never shifts the layout.
- One authored motion: the flap cascade, plus a short amber row lamp when a row lands or changes.

## Colors

### Primary
- **Delay Amber** `#ffb000`: primary buttons, active nav, board column heads, reps numerals, focus on dark. Never body text on light grounds.

### Neutral
- **Flap Black** `#0b0b0d` with **Flap Cell** `#17181b` / `#1f2024`: every board, toast, tooltip, modal title bar.
- **Letter White** `#f2f2f2` and **Steel Light** `#a7aaaf`: primary and secondary ink on boards.
- **Steel Rail** `#1d1f23`: the side rail and phone bars in both themes.
- **Light frame**: ground `#dcdee1`, panel `#eceef0`, line `#b4b8bd`, ink `#0e0f11`, secondary ink `#474b51`.
- **Dark frame**: ground `#16181b`, panel `#1f2226`, line `#3a3e44`, secondary ink `#b4b7bc`.

### Status
- **Cancel Red** `#ff5a4f` on boards, `#b00020` as the solid destructive colour on light frames.
- **On-time Green** `#3ccf6e`: success toasts only.

### Named Rules
**The Board Never Changes Rule.** The light/dark toggle repaints the frame (ground, panels, inputs), never the boards. A board is an object, not a theme.

**The Amber Is Earned Rule.** Amber appears only where the athlete can act or where something is live. Decoration in amber is a lie on a departure board.

## Typography

**Board face:** Barlow Condensed 500/600/700, self-hosted via `@fontsource/barlow-condensed`.
**UI face:** Barlow 400/500/600 via `@fontsource/barlow`, for body copy, inputs and table cells.

### Hierarchy
- **Board XL** (700, `clamp(40px, 7vw, 88px)`): flap-cell headlines only (home greeting).
- **Page title** (700, 40px / 30px on phones, 0.06em, caps).
- **Board row** (700, 22px, 0.05em, caps): exercise names on the board.
- **Label** (600, 13–16px, 0.12–0.2em, caps): buttons, field labels, column heads, nav.
- **Body** (400, 16px, 1.5): ledes, hints, form text; measure capped near 60ch.

### Named Rules
**The Caps Are For The Board Rule.** Uppercase tracked Barlow Condensed is for labels, buttons and board text. Sentences people read stay in sentence-case Barlow.

## Layout

- Desktop: fixed 232px steel rail on the left (wordmark, nav, account and theme at the foot); content max 1280px with 40px gutters.
- At ≤900px the rail becomes a 56px top bar (wordmark, theme, account) and a 64px bottom tab bar holds the five destinations within thumb reach.
- Workout builder: build panel (320–400px) beside a sticky board; stacks below 1100px.
- Spacing steps 4 / 8 / 16 / 24 / 40px. More space above a heading than below it.

## Elevation & Depth

Flat by default: hairline rules, no card shadows. Depth is reserved for things that float above the page.

### Shadow Vocabulary
- **Overlay** `0 24px 64px -16px rgba(0,0,0,.55)`: modals.
- **Float** `0 12px 32px -12px rgba(0,0,0,.6)`: toasts and tooltips.
- **Board frame** `inset 0 0 0 4px #1d1f23`: the steel lip around a board.

## Shapes

Small, mechanical radii: 2px on flap cells and segment buttons, 4px on everything else. No pills except the info tooltip trigger.

## Components

### Buttons
Primary (amber fill, black label), secondary (white/inset control fill, line border), ghost (text only), danger (red outline, red fill on hover). 40px tall, 52px for the large Roll / Finish actions. Labels are caps Barlow Condensed with a leading Lucide icon. Pressed buttons nudge down 1px.

### Inputs / Fields
40px, 1px line border, 4px radius, focus swaps the border to the focus colour plus a 1px ring. Labels sit above in caps. Selects use a drawn chevron. Number steppers for counts.

### Navigation
Rail items: icon + caps label, amber text on a flap-black chip when active. Phone tab bar: icon over 11px caps label, amber when active.

### Cards / Containers
**Panel**: light or dark frame surface with a hairline border, for forms. **Board**: flap black with the steel lip, for anything the athlete reads as data.

### Split-flap board (signature)
`FlapText` renders text either as plain board type that scrambles into place or as individual flap cells (two-tone cell with a split line). Changes cascade left to right, ~45ms per step, staggered by row; rows that land or reroll light amber for ~1s. `prefers-reduced-motion` renders the final text immediately.

## Do's and Don'ts

### Do:
- Do put workout data, stats and tables on a board.
- Do keep reps in fixed flap cells so rerolls don't reflow.
- Do use standard controls (selects, segmented radios, steppers, tables) inside the frame.
- Do theme browser surfaces (selection, caret, focus ring, scrollbars, date picker, Handsontable) from the palette.

### Don't:
- Don't paint boards light in light mode.
- Don't use amber for decoration or body text on light grounds.
- Don't add kickers or eyebrow labels above headings.
- Don't fake brushed metal, rivets or bevels; the frame stays flat.
- Don't scatter motion: the flap cascade and row lamp are the only authored moves.

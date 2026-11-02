---
version: 1
slug: "frontend-src-app-tsx"
primary_target: "Frontend/src/App.tsx"
related_targets: ["Frontend/src/pages/Workout.tsx"]
---

# Bikkanto app shell (all routes)

Scope: whole authenticated web app (Home, Exercises, Workout, History, Profile, auth and modals). Visitor mode: Operate.
Audience: calisthenics athletes; plan on desktop, run the session on a phone between sets.
Task: roll a workout, reroll rows, accept, log cycles; maintain exercise library; read history.
Constraints: keep every feature, API call and flow; light/dark toggle stays.

## Direction contract

THESIS: The rolled workout is a departure board. Rows clack into place and reps flip character by character. Refuses the category default of white cards with a blue accent.

OWN-WORLD: Flap black #0b0b0d boards inside a steel frame (#2a2d31 dark, #dcdee1 light); letter white #f2f2f2; delay amber #ffb000 for the one primary action, current nav and live state; cancel red for errors; Barlow Condensed tracked caps for labels and board text, Barlow for form body; hairline 1px rules, fixed tabular cells, small radii, no shadows except overlays. Boards stay black in both themes.

STORY: The athlete sees where everything is (standard nav), builds a roll, watches it land on the board, rerolls one row, accepts, and later logs cycles with one input.

FIRST VIEWPORT: Workout route. Desktop: left steel rail with BIKKANTO wordmark, nav, theme and account at the foot; work area: build panel left (mode segmented control, count, global difficulties, per-row selectors, amber Roll button), board right (NO / EXERCISE / TIER / REPS, reps in flap cells, reroll icon per row). Phone: slim top bar, bottom tab bar, board full width with large reps.

FORM: Split-flap concourse board (challenger signals-instruments-split-flap-concourse), chosen by the user over the assigned Dice Tray. seed:bba33ba777a39976. Signature move: per-character flap cascade on roll, reroll and headline changes; reduced motion settles instantly.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

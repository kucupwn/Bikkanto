# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Calisthenics athletes who sign up for their own account. They plan on desktop (building and tuning their exercise library, reviewing history) and run the workout on a phone at the gym or park, glancing at it between sets.

## Product Purpose

Bikkanto generates bodyweight workouts from the athlete's own exercise library. Each exercise stores rep ranges (easy / medium / hard) tuned to that athlete's current level, so a rolled workout always lands at a doable but challenging volume. Finished workouts (cycles completed) are saved to history, and statistics summarize training over a date range.

Success: the athlete gets from "what do I train today?" to a concrete list of exercises with reps in seconds, and logging the session afterwards is effortless.

## Positioning

The workout is rolled, not prescribed: random selection constrained by category, exercise difficulty (beginner / advanced / pro) and rep difficulty, drawn from a personal library whose rep ranges the athlete owns. Individual rows can be re-rolled. A preset mode lets them pick exact exercises instead.

## Operating Context

- Exercises page: categories (push up, pull up, handstand…) and exercises with per-difficulty rep ranges; own table vs. shared pool table (Handsontable grid).
- Workout page: create (random or preset), set exercise count and per-row category/difficulty/reps difficulty, get → preview → reroll rows → accept (stored as a draft that survives logout) → enter finished cycles and date → finish (saved to history).
- History page: full history table plus a statistics modal for a date range.
- Profile: edit email/name, change password.
- Light and dark theme toggle, persisted per browser.

## Capabilities and Constraints

- React 19 + Vite + styled-components frontend, FastAPI backend.
- Exercise names cannot be edited after creation; deleting an exercise deletes its history rows.
- Difficulty vocabulary: exercise difficulty beginner / advanced / pro; reps difficulty easy / medium / hard.
- "Save to Presets" exists as a button but preset saving is not implemented yet.
- Forgot-password flow has UI but no backend action yet.

## Brand Commitments

Name: BIKKANTO (wordmark set in caps). No other binding visual assets.

## Evidence on Hand

No testimonials, user counts, or marketing claims exist; do not invent any.

## Product Principles

1. The roll is the moment: generating and re-rolling a workout should feel quick and decisive.
2. Glanceable mid-session: the active workout must be readable at arm's length on a phone.
3. The athlete owns their numbers: rep ranges and history are their data, shown plainly and precisely.
4. Planning tools stay calm and dense; nothing decorative gets between the athlete and their tables.

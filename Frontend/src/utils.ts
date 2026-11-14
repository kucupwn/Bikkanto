import styled from "styled-components";
import type { Exercise, RepsDifficulty } from "./types/exerciseTypes";

// Ranges can have gaps, so a count above a tier's max moves to the next tier.
export function getRepsDifficulty(
  exercise: Exercise,
  reps: number,
): RepsDifficulty {
  if (reps <= exercise.easy_max) return "easy";
  if (reps <= exercise.medium_max) return "medium";
  return "hard";
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// YYYY-MM-DD in the user's local time. toISOString() converts to UTC first,
// which shifts local midnight to the previous day east of UTC.
export function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(date: Date | null) {
  if (!date) return null;

  return toLocalDateString(date);
}

export const HorizontalLine = styled.div<{ $width?: string }>`
  height: 1px;
  width: ${({ $width = "100%" }) => $width};
  background-color: var(--line-soft);
`;

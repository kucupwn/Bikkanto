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

export function formatDate(date: Date | null) {
  if (!date) return null;

  return date.toISOString().split("T")[0];
}

export const HorizontalLine = styled.div<{ $width?: string }>`
  height: 1px;
  width: ${({ $width = "100%" }) => $width};
  background-color: var(--line-soft);
`;

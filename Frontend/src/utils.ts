import styled from "styled-components";

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

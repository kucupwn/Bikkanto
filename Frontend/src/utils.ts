import styled from "styled-components";

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDate(date: Date | null) {
  if (!date) return null;

  return date.toISOString().split("T")[0];
}

export const HorizontalLine = styled.div<{ $width?: string }>`
  height: 1.5px;
  width: ${({ $width = "350px" }) => $width};
  background-color: #8e8e8e;
`;

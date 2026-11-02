import type { ReactNode } from "react";
import styled from "styled-components";
import { Info } from "lucide-react";

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
`;

const Trigger = styled.button`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ink-3);
  cursor: help;

  &:hover,
  &:focus-visible {
    color: var(--ink);
  }
`;

const Tip = styled.span`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translate(-50%, -4px);
  width: 280px;
  padding: 0.75rem 0.875rem;
  background: var(--board);
  color: var(--board-ink);
  border: 1px solid var(--board-line);
  border-radius: var(--radius);
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 1.45;
  z-index: 60;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;

  ${Wrap}:hover &,
  ${Trigger}:focus-visible + & {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  @media (max-width: 600px) {
    left: auto;
    right: -0.5rem;
    transform: translateY(-4px);

    ${Wrap}:hover &,
    ${Trigger}:focus-visible + & {
      transform: none;
    }
  }
`;

export function InfoTooltip({
  text,
  label = "More info",
}: {
  text: ReactNode;
  label?: string;
}) {
  return (
    <Wrap>
      <Trigger type="button" aria-label={label}>
        <Info size={18} aria-hidden="true" />
      </Trigger>
      <Tip role="tooltip">{text}</Tip>
    </Wrap>
  );
}

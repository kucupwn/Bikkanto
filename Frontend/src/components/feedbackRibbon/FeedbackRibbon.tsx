import styled, { keyframes } from "styled-components";
import { CircleCheck, CircleAlert } from "lucide-react";

export type RibbonType = "success" | "error";

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Ribbon = styled.div<{ $type: RibbonType }>`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: min(420px, calc(100vw - 2rem));
  padding: 0.875rem 1.125rem 0.875rem 1rem;
  background: var(--board);
  color: var(--board-ink);
  border: 1px solid var(--board-line);
  border-radius: var(--radius);
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.6);
  animation: ${slideIn} 0.25s var(--ease-out);

  svg {
    flex: none;
    color: ${({ $type }) =>
      $type === "success" ? "var(--green)" : "var(--red)"};
  }

  @media (max-width: 900px) {
    top: calc(56px + 0.5rem);
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
`;

interface Props {
  type: RibbonType;
  message: string;
}

export function FeedbackRibbon({ type, message }: Props) {
  return (
    <Ribbon
      $type={type}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      {type === "success" ? (
        <CircleCheck size={20} aria-hidden="true" />
      ) : (
        <CircleAlert size={20} aria-hidden="true" />
      )}
      <span>{message}</span>
    </Ribbon>
  );
}

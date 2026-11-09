import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const buttonVariants: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: var(--amber);
    color: var(--amber-ink);
    border-color: var(--amber);

    &:hover:not(:disabled) {
      background: var(--amber-hover);
      border-color: var(--amber-hover);
    }
  `,
  secondary: css`
    background: var(--control);
    color: var(--ink);
    border-color: var(--line);

    &:hover:not(:disabled) {
      background: var(--control-hover);
      border-color: var(--ink-3);
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--ink-2);
    border-color: transparent;

    &:hover:not(:disabled) {
      color: var(--ink);
      background: var(--control-hover);
    }
  `,
  danger: css`
    background: transparent;
    color: var(--red-solid);
    border-color: var(--red-solid);

    body.dark & {
      color: var(--red);
      border-color: var(--red);
    }

    &:hover:not(:disabled) {
      background: var(--red-solid);
      border-color: var(--red-solid);
      color: #fff;
    }
  `,
};

export const Button = styled.button<{
  $variant?: ButtonVariant;
  $size?: "md" | "lg";
  $block?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: ${({ $size }) => ($size === "lg" ? "52px" : "40px")};
  padding: 0 ${({ $size }) => ($size === "lg" ? "1.5rem" : "1rem")};
  width: ${({ $block }) => ($block ? "100%" : "auto")};
  border: 1px solid;
  border-radius: var(--radius);
  font-family: var(--font-board);
  font-size: ${({ $size }) => ($size === "lg" ? "18px" : "15px")};
  font-weight: 600;
  letter-spacing: var(--track);
  text-transform: uppercase;
  white-space: nowrap;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease;

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.45;
  }

  svg {
    flex: none;
  }

  ${({ $variant = "secondary" }) => buttonVariants[$variant]}
`;

export const IconButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink-2);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--control-hover);
    color: var(--ink);
  }
`;

export const Page = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 2.5rem 4rem;

  @media (max-width: 900px) {
    padding: 1.25rem 1rem calc(var(--tabbar-h) + 2rem);
  }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 900px) {
    margin-bottom: 1.25rem;
  }
`;

export const PageTitle = styled.h1`
  font-size: 40px;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  @media (max-width: 900px) {
    font-size: 30px;
  }
`;

export const PageLede = styled.p`
  color: var(--ink-2);
  margin-top: 0.25rem;
  max-width: 60ch;
`;

export const Panel = styled.section`
  background: var(--panel);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  padding: 1.5rem;

  @media (max-width: 900px) {
    padding: 1.25rem 1rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: var(--track);
  text-transform: uppercase;
  color: var(--ink-2);
  margin-bottom: 1rem;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
`;

export const FieldLabel = styled.span`
  font-family: var(--font-board);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: var(--track);
  text-transform: uppercase;
  color: var(--ink-2);
`;

const control = css`
  width: 100%;
  min-height: 40px;
  padding: 0 0.75rem;
  background: var(--control);
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  transition: border-color 0.15s ease;

  &:hover:not(:disabled) {
    border-color: var(--ink-3);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--focus);
    box-shadow: 0 0 0 1px var(--focus);
  }

  &::placeholder {
    color: var(--ink-3);
  }
`;

export const Input = styled.input`
  ${control}
`;

export const Select = styled.select`
  ${control}
  appearance: none;
  padding-right: 2rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888c92' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
`;

export const ButtonRow = styled.div<{ $align?: "start" | "end" | "center" }>`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: ${({ $align = "start" }) =>
    $align === "end" ? "flex-end" : $align === "center" ? "center" : "flex-start"};
`;

/* Action row above a page's main board or table */
export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

/* Segmented control: a standard radio group */
export const Segmented = styled.div`
  display: inline-flex;
  padding: 3px;
  gap: 3px;
  background: var(--control);
  border: 1px solid var(--line);
  border-radius: var(--radius);
`;

export const SegmentButton = styled.button<{ $active: boolean }>`
  min-height: 34px;
  padding: 0 1rem;
  border: 0;
  border-radius: 2px;
  font-family: var(--font-board);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: var(--track);
  text-transform: uppercase;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
  background: ${({ $active }) => ($active ? "var(--board)" : "transparent")};
  color: ${({ $active }) => ($active ? "var(--amber)" : "var(--ink-2)")};

  &:hover {
    color: ${({ $active }) => ($active ? "var(--amber)" : "var(--ink)")};
  }
`;

/* The board: always flap black, in both themes */
export const Board = styled.div`
  background: var(--board);
  color: var(--board-ink);
  border: 1px solid var(--board-line);
  border-radius: var(--radius);
  box-shadow: inset 0 0 0 4px #1d1f23;
  padding: 4px;
`;

export const BoardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--board-line);
`;

export const BoardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--board-ink);
  white-space: nowrap;
`;

export const BoardNote = styled.span`
  font-family: var(--font-board);
  font-size: 14px;
  letter-spacing: var(--track);
  text-transform: uppercase;
  color: var(--board-ink-2);
`;

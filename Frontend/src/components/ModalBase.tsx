import { useEffect, useId, useRef, type ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { X } from "lucide-react";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const rise = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.985); }
  to { opacity: 1; transform: none; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: var(--overlay);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 998;
  overflow-y: auto;
  animation: ${fadeIn} 0.18s ease-out;
`;

const ModalBox = styled.div<{ $width: string }>`
  width: min(100%, ${({ $width }) => $width});
  background: var(--panel);
  color: var(--ink);
  border: 1px solid #000;
  border-radius: var(--radius);
  box-shadow: 0 24px 64px -16px rgba(0, 0, 0, 0.55);
  overflow: hidden;
  animation: ${rise} 0.24s var(--ease-out);
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 0.875rem 0.875rem 1.5rem;
  background: var(--board);
  color: var(--board-ink);
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

const Close = styled.button`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: var(--board-ink-2);

  &:hover {
    background: var(--board-cell-hi);
    color: var(--board-ink);
  }
`;

const Body = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

interface Props {
  onClose: () => void;
  title?: string;
  width?: string;
  children: ReactNode;
}

export function ModalBase({ onClose, title, width = "440px", children }: Props) {
  const titleId = useId();
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;

    // Focus the first field, or the dialog itself.
    const first = boxRef.current?.querySelector<HTMLElement>(
      "input, select, textarea",
    );
    (first ?? boxRef.current)?.focus();

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      previous?.focus?.();
    };
  }, []);

  return (
    <Overlay onClick={onClose}>
      <ModalBox
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        $width={width}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <Head>
            <Title id={titleId}>{title}</Title>
            <Close onClick={onClose} aria-label="Close">
              <X size={20} aria-hidden="true" />
            </Close>
          </Head>
        )}
        <Body>{children}</Body>
      </ModalBox>
    </Overlay>
  );
}

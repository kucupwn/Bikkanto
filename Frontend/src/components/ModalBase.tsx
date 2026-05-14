import type { ReactNode } from "react";
import styled from "styled-components";
import type { Themes } from "../App";
import { useTheme } from "./ThemeProvider";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div<{ $theme: Themes }>`
  background-color: white;
  padding: 1rem;
  border-radius: 12px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ $theme }) => {
    return $theme === "dark" ? "#151515" : "#ecebeb";
  }};
`;

interface Props {
  onClose: () => void;
  children: ReactNode;
}

export function ModalBase({ onClose, children }: Props) {
  const { theme } = useTheme();

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()} $theme={theme}>
        {children}
      </ModalBox>
    </Overlay>
  );
}

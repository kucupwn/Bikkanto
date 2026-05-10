import styled, { keyframes } from "styled-components";

export type RibbonType = "success" | "error";

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Ribbon = styled.div<{ $type: RibbonType }>`
  position: absolute;
  border-radius: 10px;
  padding: 10px;
  top: 10px;
  right: 25px;
  animation: ${slideIn} 0.25s ease;
  background-color: ${({ $type }) => {
    return $type === "success" ? "#6ce961" : "#e15d5d";
  }};
`;

const Message = styled.span``;

interface Props {
  type: RibbonType;
  message: string;
}

export function FeedbackRibbon({ type, message }: Props) {
  return (
    <Ribbon $type={type} role="alert">
      <Message>{message}</Message>
    </Ribbon>
  );
}

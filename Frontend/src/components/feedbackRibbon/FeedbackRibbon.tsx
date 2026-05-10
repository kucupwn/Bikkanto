import styled, { css, keyframes } from "styled-components";

export type RibbonType = "success" | "error";

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const typeStyles: Record<RibbonType, ReturnType<typeof css>> = {
  success: css`
    background: #6ce961;
  `,
  error: css`
    background: #e15d5d;
  `,
};

const Ribbon = styled.div<{ $type: RibbonType }>`
  display: flex;
  position: absolute;
  border-radius: 10px;
  padding: 10px;
  top: 10px;
  right: 25px;
  animation: ${slideIn} 0.25s ease;
  ${({ $type }) => typeStyles[$type]}
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

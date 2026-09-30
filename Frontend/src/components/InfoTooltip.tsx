import styled from "styled-components";

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: help;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 30px;

  width: 200px;
  padding: 8px 10px;

  background: var(--main-black);
  color: var(--main-white);
  border-radius: 5px;

  font-size: 12px;

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;

  ${InfoIcon}:hover & {
    opacity: 1;
  }
`;

export function InfoTooltip({ text }: { text: string }) {
  return (
    <InfoIcon>
      <span>ⓘ</span>
      <Tooltip>{text}</Tooltip>
    </InfoIcon>
  );
}

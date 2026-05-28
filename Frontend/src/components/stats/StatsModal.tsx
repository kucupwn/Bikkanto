import { ModalBase } from "../ModalBase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <ModalBase onClose={onClose}>
      <h2>Statistics</h2>
    </ModalBase>
  );
}

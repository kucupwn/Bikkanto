interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return <h1>modal</h1>;
}

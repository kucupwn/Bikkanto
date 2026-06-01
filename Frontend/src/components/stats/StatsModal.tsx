import { useState } from "react";
import { ModalBase } from "../ModalBase";
import HistoryRangePicker from "./HistoryRangePicker";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(),
  ]);

  return (
    <ModalBase onClose={onClose}>
      <h2>Statistics</h2>
      <HistoryRangePicker dateRange={dateRange} setDateRange={setDateRange} />
    </ModalBase>
  );
}

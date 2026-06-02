import { useState } from "react";
import { ModalBase } from "../ModalBase";
import HistoryRangePicker from "./HistoryRangePicker";
import { api } from "../../api/api";

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

  async function getHistoryInRange() {
    try {
      const res = await api.get("/history/range", {
        params: {
          start_date: dateRange[0]?.toISOString().split("T")[0],
          end_date: dateRange[1]?.toISOString().split("T")[0],
        },
      });
      console.log(res.data);
    } catch (err: any) {}
  }

  return (
    <ModalBase onClose={onClose}>
      <h2>Statistics</h2>
      <HistoryRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      <button onClick={getHistoryInRange}>Get</button>
    </ModalBase>
  );
}

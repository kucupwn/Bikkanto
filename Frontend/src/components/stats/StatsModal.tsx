import { useState } from "react";
import { ModalBase } from "../ModalBase";
import HistoryRangePicker from "./HistoryRangePicker";
import { api } from "../../api/api";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const { showRibbon } = useRibbon();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(),
  ]);

  async function getHistoryInRange() {
    try {
      const [start, end] = dateRange;

      if (!start || !end) {
        showRibbon("error", "Please select both dates.");
        return;
      }

      const res = await api.get("/history/range", {
        params: {
          start_date: start.toISOString().split("T")[0],
          end_date: end.toISOString().split("T")[0],
        },
      });
      console.log(res.data);
    } catch (err: any) {
      const message =
        err.response.data.detail || "Could not fetch history range.";
      showRibbon("error", message);
    }
  }

  return (
    <ModalBase onClose={onClose}>
      <h2>Statistics</h2>
      <HistoryRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      <button onClick={getHistoryInRange}>Get</button>
    </ModalBase>
  );
}

import { useState } from "react";
import { ModalBase } from "../ModalBase";
import HistoryRangePicker from "./HistoryRangePicker";
import { api } from "../../api/api";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import type { WorkoutHistory } from "../../types/historyTypes";
import { Statistics } from "./Statistics";
import styled from "styled-components";
import { HorizontalLine } from "../../utils";

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const GetButton = styled.button`
  margin: 1rem;
`;

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
  const [historyEntries, setHistoryEntries] = useState<WorkoutHistory[]>([]);

  const { showRibbon } = useRibbon();

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

      if (res.data.length === 0) {
        showRibbon("error", "No workout was done in selected range.");
        return;
      }

      setHistoryEntries(res.data);
    } catch (err: any) {
      const message =
        err.response.data.detail || "Could not fetch history range.";
      showRibbon("error", message);
    }
  }

  return (
    <ModalBase onClose={onClose}>
      <Title>Statistics</Title>
      <HistoryRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      <GetButton onClick={getHistoryInRange}>Get</GetButton>

      {historyEntries.length > 0 && (
        <>
          <HorizontalLine $width="200px" />
          <Statistics dateRange={dateRange} historyEntries={historyEntries} />
        </>
      )}
    </ModalBase>
  );
}

import { useState, type FormEvent } from "react";
import styled from "styled-components";
import { ModalBase } from "../ModalBase";
import HistoryRangePicker from "./HistoryRangePicker";
import { api } from "../../api/api";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import type { WorkoutHistory } from "../../types/historyTypes";
import { Statistics } from "./Statistics";
import { Button, Field, FieldLabel } from "../ui";

const Form = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: end;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsModal(props: Props) {
  if (!props.isOpen) return null;
  return <StatsModalContent {...props} />;
}

function StatsModalContent({ onClose }: Props) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(),
  ]);
  const [historyEntries, setHistoryEntries] = useState<WorkoutHistory[]>([]);
  const [shownRange, setShownRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { showRibbon } = useRibbon();

  async function getHistoryInRange(e: FormEvent) {
    e.preventDefault();

    try {
      const [start, end] = dateRange;

      if (!start || !end) {
        showRibbon("error", "Please select both dates.");
        return;
      }

      setIsLoading(true);
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
      setShownRange([start, end]);
    } catch (err: any) {
      const message =
        err.response?.data?.detail || "Could not fetch history range.";
      showRibbon("error", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ModalBase onClose={onClose} title="Statistics" width="480px">
      <Form onSubmit={getHistoryInRange}>
        <Field as="div">
          <FieldLabel>Date range</FieldLabel>
          <HistoryRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </Field>
        <Button type="submit" $variant="primary" disabled={isLoading}>
          Show
        </Button>
      </Form>

      {historyEntries.length > 0 && (
        <Statistics dateRange={shownRange} historyEntries={historyEntries} />
      )}
    </ModalBase>
  );
}

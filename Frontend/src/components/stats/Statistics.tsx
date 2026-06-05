import { useMemo } from "react";
import type { WorkoutHistory } from "../../types/historyTypes";

interface Props {
  dateRange: [Date | null, Date | null];
  historyEntries: WorkoutHistory[];
}

export function Statistics({ dateRange, historyEntries }: Props) {
  const workoutDaysCount = useMemo(() => {
    const days = new Set<string>();

    for (const entry of historyEntries) {
      days.add(entry.date_complete);
    }

    return days.size;
  }, [historyEntries]);

  return (
    <>
      <h3>Workout days count: {workoutDaysCount}</h3>
    </>
  );
}

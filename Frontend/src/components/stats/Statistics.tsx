import type { WorkoutHistory } from "../../types/historyTypes";
import { formatDate } from "../../utils";

interface Props {
  dateRange: [Date | null, Date | null];
  historyEntries: WorkoutHistory[];
}

export function Statistics({ dateRange, historyEntries }: Props) {
  const stats = getBasicStats();

  function getBasicStats() {
    if (!dateRange[0] || !dateRange[1]) return null;

    const statRange =
      Math.floor(dateRange[1].getTime() - dateRange[0].getTime()) /
        (1000 * 60 * 60 * 24) +
      1;
    const workoutDays = new Set<string>();

    for (const entry of historyEntries) {
      workoutDays.add(entry.date_complete);
    }

    return {
      statRange: statRange,
      workoutDays: workoutDays.size,
    };
  }

  return (
    <>
      <h3>
        Stats of {`${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`}
      </h3>
      <p>Range: {stats?.statRange} days</p>
      <h3>Workout count: {stats?.workoutDays} </h3>
    </>
  );
}

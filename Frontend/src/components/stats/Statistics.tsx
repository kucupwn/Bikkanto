import type { WorkoutHistory } from "../../types/historyTypes";
import { capitalize, formatDate } from "../../utils";

interface Props {
  dateRange: [Date | null, Date | null];
  historyEntries: WorkoutHistory[];
}

export function Statistics({ dateRange, historyEntries }: Props) {
  const stats = getBasicStats();

  function getCategoryCounts() {
    const counts: Record<string, number> = {};

    historyEntries.forEach((entry) => {
      if (entry.category_name) {
        counts[entry.category_name] = (counts[entry.category_name] || 0) + 1;
      }
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }

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
      categoryCount: getCategoryCounts(),
    };
  }

  return (
    <>
      <h3>
        Stats of {`${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`}
      </h3>
      <p>Range: {stats?.statRange} days</p>
      <p>Workout count: {stats?.workoutDays} </p>
      <h3>Top categories:</h3>
      {stats?.categoryCount.slice(0, 3).map(([name, _], i) => (
        <p key={name}>
          {i + 1}. {capitalize(name)}
        </p>
      ))}
    </>
  );
}

import styled from "styled-components";
import type { WorkoutHistory } from "../../types/historyTypes";
import { formatDate } from "../../utils";
import { FlapText } from "../FlapText";
import { Board, BoardHead, BoardNote, BoardTitle } from "../ui";

const Figures = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0;
  border-bottom: 1px solid var(--board-line);

  > div {
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  > div + div {
    border-left: 1px solid var(--board-line);
  }

  dt {
    font-family: var(--font-board);
    font-size: 13px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--board-ink-2);
  }

  dd {
    margin: 0;
  }
`;

const Top = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;

  li {
    display: grid;
    grid-template-columns: 2rem 1fr auto;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0.5rem 1.25rem;
    font-family: var(--font-board);
    font-size: 18px;
    font-weight: 600;
    letter-spacing: var(--track);
    text-transform: uppercase;
  }

  li span:first-child,
  li span:last-child {
    color: var(--board-ink-2);
    font-variant-numeric: tabular-nums;
  }

  li span:last-child {
    font-size: 15px;
  }
`;

const SubHead = styled.h3`
  padding: 1rem 1.25rem 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber);
`;

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
      statRange: Math.round(statRange),
      workoutDays: workoutDays.size,
      categoryCounts: getCategoryCounts(),
    };
  }

  return (
    <Board as="section" aria-labelledby="stats-title">
      <BoardHead>
        <BoardTitle id="stats-title">Summary</BoardTitle>
        <BoardNote>
          {formatDate(dateRange[0])} – {formatDate(dateRange[1])}
        </BoardNote>
      </BoardHead>
      <Figures>
        <div>
          <dt>Days in range</dt>
          <dd>
            <FlapText text={stats?.statRange ?? 0} cells size="lg" animateOnMount />
          </dd>
        </div>
        <div>
          <dt>Workout days</dt>
          <dd>
            <FlapText
              text={stats?.workoutDays ?? 0}
              cells
              size="lg"
              tone="amber"
              animateOnMount
              delay={120}
            />
          </dd>
        </div>
      </Figures>
      <SubHead>Top categories</SubHead>
      <Top>
        {Array.from({ length: 3 }).map((_, i) => {
          const item = stats?.categoryCounts?.[i];
          const name = item?.[0];
          const count = item?.[1];

          return (
            <li key={i}>
              <span>{i + 1}</span>
              <span>{name ?? "—"}</span>
              <span>{name ? `${count}×` : ""}</span>
            </li>
          );
        })}
      </Top>
    </Board>
  );
}

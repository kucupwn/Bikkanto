import { useEffect, type Dispatch, type SetStateAction } from "react";
import styled from "styled-components";
import { Bookmark, Play, Trash2 } from "lucide-react";
import type { ViewModes } from "../../pages/Workout";
import type { WorkoutEntry } from "../../types/exerciseTypes";
import { api } from "../../api/api";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import { FlapText } from "../FlapText";
import { Board, Button } from "../ui";

const Notice = styled(Board)`
  max-width: 720px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;

  p {
    color: var(--board-ink-2);
    max-width: 52ch;
  }

  @media (max-width: 700px) {
    padding: 1.5rem 1rem;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const BoardGhost = styled(Button)`
  background: transparent;
  color: var(--board-ink);
  border-color: var(--board-line);

  &:hover:not(:disabled) {
    background: var(--board-cell);
    border-color: var(--red);
    color: var(--red);
  }
`;

const BoardNeutral = styled(Button)`
  background: transparent;
  color: var(--board-ink);
  border-color: var(--board-line);

  &:hover:not(:disabled) {
    background: var(--board-cell);
    border-color: var(--board-ink-2);
  }
`;

interface Props {
  workout: WorkoutEntry[] | null;
  setWorkout: Dispatch<SetStateAction<WorkoutEntry[] | null>>;
  setMode: Dispatch<SetStateAction<ViewModes>>;
  setHasAcceptedWorkout: Dispatch<SetStateAction<boolean>>;
  setTitle: Dispatch<SetStateAction<string | null>>;
  onBrowsePresets: () => void;
}

export function StoredWorkout({
  workout,
  setWorkout,
  setMode,
  setHasAcceptedWorkout,
  setTitle,
  onBrowsePresets,
}: Props) {
  const { showRibbon } = useRibbon();

  useEffect(() => {
    setTitle("Unfinished workout");
  }, []);

  async function discardWorkout() {
    try {
      if (workout?.length) {
        await api.delete(`/history/draft/${workout[0].session_id}`);

        setWorkout(null);
        setMode(null);
        setHasAcceptedWorkout(false);
        setTitle("Start a workout");
      }
    } catch {
      showRibbon("error", "Could not delete workout draft.");
    }
  }

  async function recallWorkout() {
    try {
      const res = await api.get("/history/draft");

      if (res.data) {
        setWorkout(res.data);
        setMode("preview");
        setTitle("Workout in progress");
      }
    } catch {
      showRibbon("error", "Could not recall workout draft.");
    }
  }

  const count = workout?.length ?? 0;

  return (
    <Notice as="section">
      <FlapText text="Unfinished" cells size="md" tone="amber" animateOnMount />
      <p>
        You accepted a workout of {count} {count === 1 ? "exercise" : "exercises"}{" "}
        but haven't logged it yet. Pick it back up, or discard it to start
        fresh.
      </p>
      <Actions>
        <Button $variant="primary" onClick={recallWorkout}>
          <Play size={18} aria-hidden="true" />
          Resume workout
        </Button>
        <BoardNeutral onClick={onBrowsePresets}>
          <Bookmark size={18} aria-hidden="true" />
          Presets
        </BoardNeutral>
        <BoardGhost onClick={discardWorkout}>
          <Trash2 size={18} aria-hidden="true" />
          Discard
        </BoardGhost>
      </Actions>
    </Notice>
  );
}

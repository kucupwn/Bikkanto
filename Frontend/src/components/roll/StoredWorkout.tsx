import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { ViewModes } from "../../pages/Workout";
import type { WorkoutEntry } from "../../types/exerciseTypes";
import styled from "styled-components";
import { api } from "../../api/api";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem;
`;

const TextWrapper = styled.div`
  margin: 1rem;
`;

interface Props {
  workout: WorkoutEntry[] | null;
  setWorkout: Dispatch<SetStateAction<WorkoutEntry[] | null>>;
  setMode: Dispatch<SetStateAction<ViewModes>>;
  setHasAcceptedWorkout: Dispatch<SetStateAction<boolean>>;
  setTitle: Dispatch<SetStateAction<string | null>>;
}

export function StoredWorkout({
  workout,
  setWorkout,
  setMode,
  setHasAcceptedWorkout,
  setTitle,
}: Props) {
  const { showRibbon } = useRibbon();

  useEffect(() => {
    setTitle(null);
  }, []);

  async function discardWorkout() {
    try {
      if (workout?.length) {
        await api.delete(`/history/draft/${workout[0].session_id}`);

        setWorkout(null);
        setMode("settings");
        setHasAcceptedWorkout(false);
        setTitle("Create a workout");
      }
    } catch (err: any) {
      showRibbon("error", "Could not delete workout draft.");
    }
  }

  async function recallWorkout() {
    try {
      const res = await api.get("/history/draft");

      if (res.data) {
        setWorkout(res.data);
        setMode("preview");
        setTitle("Have fun with the workout!");
      }
    } catch (err: any) {
      showRibbon("error", "Could not recall workout draft.");
    }
  }

  return (
    <>
      <TextWrapper>
        <p>You have accepted, but not saved workout.</p>
        <p>Do you want to Discard it, or Recall it?</p>
      </TextWrapper>
      <ButtonWrapper>
        <button onClick={discardWorkout}>Discard</button>
        <button onClick={recallWorkout}>Recall</button>
      </ButtonWrapper>
    </>
  );
}

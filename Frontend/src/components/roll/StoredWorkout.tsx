import type { Dispatch, SetStateAction } from "react";
import type { ViewModes } from "../../pages/Roll";
import type { WorkoutEntry } from "../../types/exerciseTypes";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem;
`;

const TextWrapper = styled.div`
  margin: 1rem;
`;

interface Props {
  setWorkout: Dispatch<SetStateAction<WorkoutEntry[] | null>>;
  setMode: Dispatch<SetStateAction<ViewModes>>;
  setHasAcceptedWorkout: Dispatch<SetStateAction<boolean>>;
}

export function StoredWorkout({
  setWorkout,
  setMode,
  setHasAcceptedWorkout,
}: Props) {
  function discardWorkout() {
    localStorage.removeItem("workout");
    setWorkout(null);
    setMode("settings");
    setHasAcceptedWorkout(false);
  }

  function recallWorkout() {
    const stored = localStorage.getItem("workout");
    if (stored) {
      setWorkout(JSON.parse(stored));
      setMode("preview");
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

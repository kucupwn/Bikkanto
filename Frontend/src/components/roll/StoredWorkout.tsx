import type { Dispatch, SetStateAction } from "react";
import type { ViewModes } from "../../pages/Roll";
import type { WorkoutEntry } from "../../types/exerciseTypes";

interface Props {
  setWorkout: Dispatch<SetStateAction<WorkoutEntry[] | null>>;
  setMode: Dispatch<SetStateAction<ViewModes>>;
}

export function StoredWorkout({ setWorkout, setMode }: Props) {
  function discardWorkout() {
    localStorage.removeItem("workout");
    setWorkout(null);
    setMode("settings");
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
      <p>You have accepted, but not saved workout.</p>
      <p>Do you want to Discard it, or Recall it?</p>
      <button onClick={discardWorkout}>Discard</button>
      <button onClick={recallWorkout}>Recall</button>
    </>
  );
}

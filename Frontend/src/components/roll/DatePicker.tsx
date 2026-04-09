import { type Dispatch, type SetStateAction } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  workoutDate: Date | null;
  setWorkoutDate: Dispatch<SetStateAction<Date | null>>;
}

export default function HistoryDatePicker({
  workoutDate,
  setWorkoutDate,
}: Props) {
  return (
    <DatePicker
      selected={workoutDate}
      onChange={(date: Date | null) => setWorkoutDate(date)}
      dateFormat="yyyy-MM-dd"
    />
  );
}

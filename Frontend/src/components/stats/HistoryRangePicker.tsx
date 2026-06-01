import { type Dispatch, type SetStateAction } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  dateRange: [Date | null, Date | null];
  setDateRange: Dispatch<SetStateAction<[Date | null, Date | null]>>;
}

export default function HistoryRangePicker({ dateRange, setDateRange }: Props) {
  const [startDate, endDate] = dateRange;

  return (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => setDateRange(update as [Date | null, Date | null])}
      dateFormat="yyyy-MM-dd"
    />
  );
}

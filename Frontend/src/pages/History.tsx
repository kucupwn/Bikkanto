import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  HISTORY_COLUMN_ORDER,
  type WorkoutHistory,
} from "../types/historyTypes";
import { capitalize } from "../utils";
import { DataTable } from "../components/DataTable";
import { useRibbon } from "../components/feedbackRibbon/RibbonProvider";

export function History() {
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const { showRibbon } = useRibbon();

  async function fetchHistory() {
    try {
      const res = await api.get("/history");
      const history = res.data;

      setHistory(history);

      if (history.length > 0) {
        const cols = HISTORY_COLUMN_ORDER.map((key) => ({
          data: key,
          title: capitalize(key).replace("_", " "),
        }));
        setColumns(cols);
      }
    } catch (err: any) {
      const message = err.response.data.detail || "Could not fetch history.";
      showRibbon("error", message);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return <DataTable data={history} columns={columns} />;
}

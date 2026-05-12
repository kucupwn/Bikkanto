import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  HISTORY_COLUMN_ORDER,
  type WorkoutHistory,
} from "../types/historyTypes";
import { capitalize } from "../utils";
import { DataTable } from "../components/DataTable";
import type { Themes } from "../App";

interface Props {
  theme: Themes;
}

export function History({ theme }: Props) {
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

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
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return <DataTable data={history} columns={columns} theme={theme} />;
}

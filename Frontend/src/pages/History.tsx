import { useEffect, useState } from "react";
import { api } from "../api/api";
import { HISTORY_COLUMN_ORDER } from "../types/historyTypes";
import { capitalize } from "../utils";
import { DataTable } from "../components/DataTable";

export function History() {
  const [history, setHistory] = useState<History[]>([]);
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

  return <DataTable data={history} columns={columns} />;
}

import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  HISTORY_COLUMN_ORDER,
  type WorkoutHistory,
} from "../types/historyTypes";
import { capitalize } from "../utils";
import { DataTable } from "../components/DataTable";
import { useRibbon } from "../components/feedbackRibbon/RibbonProvider";
import { Loader } from "../components/Loader";
import styled from "styled-components";

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatButton = styled.button`
  width: 100px;
  font-size: 18px;
  margin-bottom: 1rem;
`;

export function History() {
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showRibbon } = useRibbon();

  async function fetchHistory() {
    try {
      setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <HistoryContainer>
      <StatButton>Statistics</StatButton>
      {isLoading && <Loader />}
      {!isLoading && <DataTable data={history} columns={columns} />}
    </HistoryContainer>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChartColumn, Shuffle } from "lucide-react";
import { api } from "../api/api";
import {
  HISTORY_COLUMN_ORDER,
  type WorkoutHistory,
} from "../types/historyTypes";
import { capitalize } from "../utils";
import { DataTable } from "../components/DataTable";
import { useRibbon } from "../components/feedbackRibbon/RibbonProvider";
import { Loader } from "../components/Loader";
import { StatsModal } from "../components/stats/StatsModal";
import { FlapText } from "../components/FlapText";
import { EmptyState } from "../components/exercise/OwnExerciseTable";
import {
  Button,
  Page,
  PageHeader,
  PageLede,
  PageTitle,
} from "../components/ui";

export function History() {
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStatOpen, setIsStatOpen] = useState<boolean>(false);
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
      const message = err.response?.data?.detail || "Could not fetch history.";
      showRibbon("error", message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>History</PageTitle>
          <PageLede>Every exercise from every finished workout.</PageLede>
        </div>
        <Button onClick={() => setIsStatOpen(true)}>
          <ChartColumn size={18} aria-hidden="true" />
          Statistics
        </Button>
      </PageHeader>

      {isLoading && <Loader />}
      {!isLoading && history.length > 0 && (
        <DataTable data={history} columns={columns} />
      )}
      {!isLoading && history.length === 0 && (
        <EmptyState>
          <FlapText text="No arrivals" cells size="md" tone="muted" />
          <p>
            Finished workouts land here. Roll one, accept it, and log your
            cycles when you're done.
          </p>
          <Button $variant="primary" as={Link} to="/workout" style={{ textDecoration: "none" }}>
            <Shuffle size={18} aria-hidden="true" />
            Roll a workout
          </Button>
        </EmptyState>
      )}
      <StatsModal isOpen={isStatOpen} onClose={() => setIsStatOpen(false)} />
    </Page>
  );
}

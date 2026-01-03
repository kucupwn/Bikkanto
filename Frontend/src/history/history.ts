import Handsontable from "handsontable/base";
import {
  type WorkoutHistory,
  HISTORY_COLUMN_ORDER,
  HISTORY_COLUMN_LABELS,
} from "../types/history.types";
import { fetchAllHistory } from "./historyApi";
import { renderTable } from "../table/handsontable";
import { HISTORY_API_URL } from "../api/urls";
import { showFeedback } from "../ribbon/feedbackRibbon";
import { attachHistoryEventListeners } from "./historyEvents";
import { openStatsModal } from "./historyStats";

export class HistoryTable {
  private hotInstance: Handsontable | null = null;
  private allHistory: WorkoutHistory[] = [];
  private readonly apiUrl: string = HISTORY_API_URL;
  private tableContainer: HTMLDivElement = document.getElementById(
    "history-table"
  ) as HTMLDivElement;

  constructor() {
    attachHistoryEventListeners({
      onOpenStats: () => openStatsModal(),
    });
  }

  public async init(): Promise<void> {
    try {
      this.allHistory = await fetchAllHistory(this.apiUrl);
      renderTable(
        this.tableContainer,
        this.allHistory,
        HISTORY_COLUMN_ORDER,
        HISTORY_COLUMN_LABELS
      );
    } catch (err: any) {
      showFeedback("Error initializing exercises history table", "error");
      console.error(err.message);
    }
  }

  public async refresh(): Promise<void> {
    try {
      this.allHistory = await fetchAllHistory(this.apiUrl);
      this.hotInstance?.loadData(this.allHistory);
    } catch (err: any) {
      showFeedback("Error refreshing history", "error");
      console.error(err.message);
    }
  }
}

export const historyTable = new HistoryTable();

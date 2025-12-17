import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
registerAllModules();

import {
  type WorkoutHistory,
  HISTORY_COLUMN_ORDER,
  HISTORY_COLUMN_LABELS,
} from "../types/history.types";
import { fetchAllHistory } from "./historyUtils";
import { renderTable } from "../table/handsontable";
import { apiRequest } from "../api/apiRequest";

export class HistoryTable {
  private hotInstance: Handsontable | null = null;
  private allHistory: WorkoutHistory[] = [];
  private readonly apiUrl: string = "http://127.0.0.1:8000/history";
  private tableContainer: HTMLDivElement = document.getElementById(
    "history-table"
  ) as HTMLDivElement;

  public async init(): Promise<void> {
    try {
      this.allHistory = await fetchAllHistory(this.apiUrl);
      renderTable(
        this.tableContainer,
        this.allHistory,
        HISTORY_COLUMN_ORDER,
        HISTORY_COLUMN_LABELS
      );
    } catch (error) {
      console.error("Error initializing exercises history table:", error);
    }
  }

  public async refresh(): Promise<void> {
    try {
      this.allHistory = await fetchAllHistory(this.apiUrl);
      this.hotInstance?.loadData(this.allHistory);
    } catch (error) {
      console.error("Error refreshing history:", error);
    }
  }

  public async postBatchHistory(
    historyEntry: Record<string, any>[]
  ): Promise<void> {
    try {
      await apiRequest(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(historyEntry),
      });
    } catch (err: any) {
      alert(err.message || "Failed to create history records.");
    }
  }
}

export const history = new HistoryTable();

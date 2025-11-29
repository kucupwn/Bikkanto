import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
registerAllModules();

import {
  type History,
  HISTORY_COLUMN_ORDER,
  HISTORY_COLUMN_LABELS,
} from "../types/history.types";
import { fetchAllHistory } from "./history.utils";
import { getHandsontable } from "../table/handsontable";

const tableContainer = document.getElementById(
  "history-table"
) as HTMLDivElement | null;

export class HistoryTable {
  private tableContainer: HTMLDivElement;
  private hotInstance: Handsontable | null = null;
  private allHistory: History[] = [];
  private readonly apiUrl = "http://127.0.0.1:8000/history";

  constructor(container: HTMLDivElement) {
    this.tableContainer = container;
  }

  public async init(): Promise<void> {
    try {
      this.allHistory = await fetchAllHistory(this.apiUrl);
      this.renderTable(this.allHistory);
    } catch (error) {
      console.error("Error initializing exercises table:", error);
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

  private renderTable(data: History[]): void {
    const columns = HISTORY_COLUMN_ORDER.map((key) => ({
      data: key,
      title: HISTORY_COLUMN_LABELS[key],
    }));

    this.hotInstance = getHandsontable<History>(
      this.tableContainer,
      data,
      columns,
      [...HISTORY_COLUMN_ORDER]
    );
  }
}

if (tableContainer) {
  const historyTable = new HistoryTable(tableContainer);
  await historyTable.init();
} else {
  console.warn("Table container not found");
}

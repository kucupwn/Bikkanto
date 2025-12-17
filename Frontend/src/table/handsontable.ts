import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
registerAllModules();

export function getHandsontable<T extends Handsontable.RowObject>(
  tableContainer: HTMLDivElement,
  data: T[],
  columns: Handsontable.ColumnSettings[],
  columnOrder: string[]
) {
  const hotInstance = new Handsontable(tableContainer, {
    data,
    columns,
    colHeaders: [...columnOrder],
    rowHeaders: true,
    width: "100%",
    height: 600,
    licenseKey: "non-commercial-and-evaluation",
    filters: true,
    dropdownMenu: true,
    stretchH: "all",
    readOnly: true,
    manualColumnResize: true,
    themeName: "ht-theme-main-dark-auto",
    className: "htCenter",
  });

  return hotInstance;
}

export function renderTable<T extends object>(
  container: HTMLDivElement,
  data: T[],
  columnOrder: readonly (keyof T & string)[],
  columnLabels: Record<keyof T & string, string>
) {
  const columns = columnOrder.map((key) => ({
    data: key,
    title: columnLabels[key],
  }));

  return getHandsontable<T>(container, data, columns, [...columnOrder]);
}

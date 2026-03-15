import { HotTable } from "@handsontable/react";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

interface Prop {
  data: any;
}

export function DataTable({ data }: Prop) {
  return (
    <HotTable
      data={data}
      colHeaders={true}
      rowHeaders={true}
      licenseKey="non-commercial-and-evaluation"
    />
  );
}

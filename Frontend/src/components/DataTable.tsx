import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";

interface Prop {
  data: any;
}

export function DataTable({ data }: Prop) {
  return (
    <HotTable
      data={data}
      colHeaders={true}
      licenseKey="non-commercial-and-evaluation"
    />
  );
}

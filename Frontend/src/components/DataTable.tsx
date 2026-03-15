import { registerAllModules } from "handsontable/registry";
registerAllModules();

import { HotTable } from "@handsontable/react-wrapper";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

interface Props {
  data: any;
  colHeaders: string[];
  columns: any[];
}

export function DataTable({ data, colHeaders, columns }: Props) {
  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <HotTable
        data={data}
        colHeaders={colHeaders}
        columns={columns}
        rowHeaders={true}
        width="100%"
        height="auto"
        stretchH="all"
        readOnly={true}
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  );
}

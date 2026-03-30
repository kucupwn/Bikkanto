import { registerAllModules } from "handsontable/registry";
registerAllModules();

import { HotTable } from "@handsontable/react-wrapper";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

interface Props {
  data: any;
  columns: any[];
}

export function DataTable({ data, columns }: Props) {
  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <HotTable
        data={data}
        columns={columns}
        rowHeaders={true}
        className="htCenter"
        width="100%"
        height={400}
        stretchH="all"
        readOnly={true}
        filters={true}
        dropdownMenu={true}
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  );
}

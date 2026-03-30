import { registerAllModules } from "handsontable/registry";
registerAllModules();

import { HotTable } from "@handsontable/react-wrapper";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import styled from "styled-components";

interface Props {
  data: any;
  columns: any[];
}

const TableContainer = styled.div`
  width: 80vw;
  margin: auto;
`;

export function DataTable({ data, columns }: Props) {
  return (
    <TableContainer>
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
    </TableContainer>
  );
}

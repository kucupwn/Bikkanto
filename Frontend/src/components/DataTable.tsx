import { registerAllModules } from "handsontable/registry";
registerAllModules();

import { HotTable } from "@handsontable/react-wrapper";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import styled from "styled-components";

const TableContainer = styled.div`
  width: 100%;
  padding: 4px;
  background: var(--board);
  border: 1px solid var(--board-line);
  border-radius: var(--radius);
  overflow: hidden;
  /* Keep Handsontable's high z-index overlays (row headers, frozen
     header clones) inside the table so they can't cover the tab bar. */
  isolation: isolate;
`;

interface Props {
  data: any;
  columns: any[];
}

export function DataTable({ data, columns }: Props) {
  return (
    <TableContainer>
      <HotTable
        data={data}
        columns={columns}
        rowHeaders={true}
        width="100%"
        // Short tables hug their rows; long ones scroll inside the board.
        height={Array.isArray(data) && data.length > 16 ? "70vh" : "auto"}
        stretchH="all"
        readOnly={true}
        filters={true}
        dropdownMenu={true}
        licenseKey="non-commercial-and-evaluation"
        // The board is flap black in both themes.
        className="ht-theme-main-dark bk-table htCenter"
      />
    </TableContainer>
  );
}

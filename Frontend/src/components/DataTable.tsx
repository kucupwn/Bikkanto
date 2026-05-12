import { registerAllModules } from "handsontable/registry";
registerAllModules();

import { HotTable } from "@handsontable/react-wrapper";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import styled from "styled-components";
import type { Themes } from "../App";

const TableContainer = styled.div`
  width: 80vw;
  margin: auto;
`;

interface Props {
  data: any;
  columns: any[];
  theme: Themes;
}

export function DataTable({ data, columns, theme }: Props) {
  return (
    <TableContainer>
      <HotTable
        data={data}
        columns={columns}
        rowHeaders={true}
        width="100%"
        height={400}
        stretchH="all"
        readOnly={true}
        filters={true}
        dropdownMenu={true}
        licenseKey="non-commercial-and-evaluation"
        className={
          theme === "dark"
            ? "ht-theme-main-dark htCenter"
            : "ht-theme-main htCenter"
        }
      />
    </TableContainer>
  );
}

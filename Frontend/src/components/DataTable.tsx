import { useMemo, useState, type ReactNode } from "react";
import styled from "styled-components";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { Input, Select } from "./ui";

export interface Column {
  key: string;
  title: string;
  // Names are stored lowercase; capitalize them for display only.
  capitalize?: boolean;
}

type SortDir = "asc" | "desc";

interface Props {
  data: Record<string, any>[];
  columns: Column[];
  // Field that uniquely identifies a row; defaults to `id`.
  rowKey?: string;
  // Optional per-row control, shown in its own column after the row number.
  renderRowAction?: (row: Record<string, any>) => ReactNode;
  rowActionLabel?: string;
}

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1 1 16rem;
  max-width: 24rem;

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ink-3);
    pointer-events: none;
  }

  input {
    padding-left: 2.25rem;
  }
`;

const ColumnSelect = styled(Select)`
  width: auto;
  flex: 0 1 12rem;
`;

const MatchCount = styled.span`
  margin-left: auto;
  font-family: var(--font-board);
  font-size: 13px;
  letter-spacing: var(--track);
  text-transform: uppercase;
  color: var(--ink-2);
  font-variant-numeric: tabular-nums;
`;

const TableContainer = styled.div<{ $scroll: boolean }>`
  width: 100%;
  max-height: ${({ $scroll }) => ($scroll ? "70vh" : "none")};
  overflow: auto;
  background: var(--board);
  border: 1px solid var(--board-line);
  border-radius: var(--radius);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: var(--font-ui);
  font-size: 14px;
  line-height: 20px;
  color: var(--board-ink);
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: 0.5rem 0.75rem;
    text-align: center;
    white-space: nowrap;
    border-bottom: 1px solid var(--board-line);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody tr:hover td {
    background: var(--board-cell);
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 0;
    background: var(--board-cell);
    color: var(--board-ink-2);
    font-family: var(--font-board);
    font-weight: 600;
    letter-spacing: var(--track);
    text-transform: uppercase;
  }

  th[aria-sort="ascending"],
  th[aria-sort="descending"] {
    color: var(--amber);
  }

  td.cap::first-letter {
    text-transform: uppercase;
  }

  .row-no {
    width: 1%;
    color: var(--board-ink-2);
  }

  thead .row-no {
    padding: 0.5rem 0.75rem;
  }

  .row-action {
    width: 1%;
    padding-block: 0.25rem;
  }
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

/* Small square button for a row's action cell. */
export const RowActionButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--board-line);
  border-radius: var(--radius);
  background: var(--board-cell);
  color: var(--board-ink-2);
  transition:
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover:not(:disabled) {
    color: var(--amber);
    border-color: var(--amber);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--amber);
    box-shadow: 0 0 0 1px var(--amber);
  }

  &:disabled {
    background: transparent;
    border-color: transparent;
    color: var(--board-ink-2);
    opacity: 0.6;
    cursor: default;
  }
`;

const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: pointer;

  &:hover {
    color: var(--board-ink);
  }

  &:focus-visible {
    outline: 1px solid var(--amber);
    outline-offset: -1px;
  }

  svg {
    flex-shrink: 0;
    opacity: 0.7;
  }
`;

const NoMatches = styled.td`
  padding: 2rem 0.75rem !important;
  text-align: left !important;
  color: var(--board-ink-2);

  /* Stay in view when the table is wider than its container. */
  span {
    position: sticky;
    left: 0.75rem;
  }
`;

function compare(a: unknown, b: unknown) {
  // Empty values always sink to the bottom.
  if (a == null || a === "") return b == null || b === "" ? 0 : 1;
  if (b == null || b === "") return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

export function DataTable({
  data,
  columns,
  rowKey = "id",
  renderRowAction,
  rowActionLabel = "Actions",
}: Props) {
  const [query, setQuery] = useState("");
  const [searchKey, setSearchKey] = useState<string>("all");
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const keys =
      searchKey === "all" ? columns.map((c) => c.key) : [searchKey];

    let result = needle
      ? data.filter((row) =>
          keys.some((key) =>
            String(row[key] ?? "").toLowerCase().includes(needle),
          ),
        )
      : data;

    if (sort) {
      const sign = sort.dir === "asc" ? 1 : -1;
      result = [...result].sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        // Keep empty values last in both directions.
        if (av == null || av === "" || bv == null || bv === "")
          return compare(av, bv);
        return sign * compare(av, bv);
      });
    }

    return result;
  }, [data, columns, query, searchKey, sort]);

  // Click cycles a column through ascending, descending, then unsorted.
  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  const isFiltered = query.trim() !== "";

  return (
    <div>
      <Controls>
        <SearchBox>
          <Search size={16} aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search"
            aria-label="Search table"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </SearchBox>
        <ColumnSelect
          aria-label="Search in column"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        >
          <option value="all">All columns</option>
          {columns.map((col) => (
            <option key={col.key} value={col.key}>
              {col.title}
            </option>
          ))}
        </ColumnSelect>
        {isFiltered && (
          <MatchCount>
            {rows.length} of {data.length}
          </MatchCount>
        )}
      </Controls>

      <TableContainer $scroll={data.length > 16}>
        <Table>
          <thead>
            <tr>
              <th className="row-no" scope="col">
                #
              </th>
              {renderRowAction && (
                <th className="row-action" scope="col">
                  <VisuallyHidden>{rowActionLabel}</VisuallyHidden>
                </th>
              )}
              {columns.map((col) => {
                const dir = sort?.key === col.key ? sort.dir : null;
                const SortIcon =
                  dir === "asc" ? ArrowUp : dir === "desc" ? ArrowDown : ArrowUpDown;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                      dir === "asc"
                        ? "ascending"
                        : dir === "desc"
                          ? "descending"
                          : "none"
                    }
                  >
                    <SortButton type="button" onClick={() => toggleSort(col.key)}>
                      {col.title}
                      <SortIcon size={14} aria-hidden="true" />
                    </SortButton>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row[rowKey] ?? i}>
                <td className="row-no">{i + 1}</td>
                {renderRowAction && (
                  <td className="row-action">{renderRowAction(row)}</td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={col.capitalize ? "cap" : undefined}>
                    {row[col.key] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <NoMatches colSpan={columns.length + (renderRowAction ? 2 : 1)}>
                  <span>No rows match “{query.trim()}”.</span>
                </NoMatches>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMagnifyingGlass,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa6";

const readNestedValue = (row, field) => {
  if (!field) return "";
  return String(field)
    .split(".")
    .reduce((value, key) => (value == null ? undefined : value[key]), row);
};

const normalizeCellValue = (value) => {
  if (value == null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const defaultPageSize = (initialState, pageSizeOptions) =>
  initialState?.pagination?.paginationModel?.pageSize ||
  (Array.isArray(pageSizeOptions) ? pageSizeOptions[0] : 10) ||
  10;

const headerLabel = (column) => column.headerName || column.field || "";

export const ModernDataGridToolbar = () => null;

const ModernDataGrid = ({
  rows = [],
  columns = [],
  pageSizeOptions = [10, 25, 50],
  initialState,
  getRowId,
  loading = false,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize(initialState, pageSizeOptions));
  const [sortModel, setSortModel] = useState({ field: "", direction: "asc" });

  const visibleColumns = useMemo(
    () => columns.filter((column) => column && column.hide !== true),
    [columns],
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = Array.isArray(rows) ? rows : [];
    if (!q) return source;

    return source.filter((row) =>
      visibleColumns.some((column) =>
        normalizeCellValue(readNestedValue(row, column.field)).toLowerCase().includes(q),
      ),
    );
  }, [query, rows, visibleColumns]);

  const sortedRows = useMemo(() => {
    if (!sortModel.field) return filteredRows;
    const direction = sortModel.direction === "desc" ? -1 : 1;
    return [...filteredRows].sort((a, b) => {
      const aValue = readNestedValue(a, sortModel.field);
      const bValue = readNestedValue(b, sortModel.field);
      const aNumber = Number(aValue);
      const bNumber = Number(bValue);

      if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
        return (aNumber - bNumber) * direction;
      }

      return normalizeCellValue(aValue).localeCompare(normalizeCellValue(bValue)) * direction;
    });
  }, [filteredRows, sortModel]);

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = sortedRows.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const start = sortedRows.length ? safePage * pageSize + 1 : 0;
  const end = Math.min(sortedRows.length, (safePage + 1) * pageSize);

  const handleSort = (column) => {
    if (column.sortable === false || column.field === "actions") return;
    setSortModel((current) => ({
      field: column.field,
      direction:
        current.field === column.field && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(0);
  };

  const renderCell = (row, column, rowIndex) => {
    const value = column.valueGetter
      ? column.valueGetter({ row, field: column.field, value: readNestedValue(row, column.field) })
      : readNestedValue(row, column.field);

    const params = {
      row,
      value,
      field: column.field,
      id: getRowId ? getRowId(row) : row.id,
      index: rowIndex,
      formattedValue: value,
    };

    if (column.renderCell) return column.renderCell(params);
    return normalizeCellValue(value) || <span className="text-[#134E4A]/35">-</span>;
  };

  return (
    <section className={`modern-data-grid ${className}`}>
      <div className="modern-data-grid__toolbar">
        <label className="modern-data-grid__search">
          <FaMagnifyingGlass aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="Search table"
          />
        </label>
        <div className="modern-data-grid__meta">
          <span>
            Showing {start}-{end} of {sortedRows.length}
          </span>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(0);
            }}
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option} rows
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="modern-data-grid__table-wrap">
        <table className="modern-data-grid__table">
          <thead>
            <tr>
              {visibleColumns.map((column) => {
                const sorted = sortModel.field === column.field;
                const SortIcon = sorted
                  ? sortModel.direction === "asc"
                    ? FaSortUp
                    : FaSortDown
                  : FaSort;

                return (
                  <th
                    key={column.field || headerLabel(column)}
                    style={{
                      minWidth: column.minWidth || column.width || 150,
                      width: column.width || "auto",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      className={column.sortable === false ? "cursor-default" : ""}
                    >
                      <span>{headerLabel(column)}</span>
                      {column.sortable === false || column.field === "actions" ? null : (
                        <SortIcon aria-hidden="true" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(Math.min(5, pageSize))].map((_, rowIndex) => (
                <tr key={`loading-${rowIndex}`}>
                  {visibleColumns.map((column) => (
                    <td key={`${column.field}-${rowIndex}`}>
                      <span className="modern-data-grid__skeleton" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageRows.length ? (
              pageRows.map((row, rowIndex) => {
                const rowId = getRowId ? getRowId(row) : row.id || `${safePage}-${rowIndex}`;
                return (
                  <tr key={rowId}>
                    {visibleColumns.map((column) => (
                      <td
                        key={`${rowId}-${column.field}`}
                        style={{
                          minWidth: column.minWidth || column.width || 150,
                          width: column.width || "auto",
                        }}
                      >
                        <div className="modern-data-grid__cell">
                          {renderCell(row, column, safePage * pageSize + rowIndex)}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={visibleColumns.length || 1}>
                  <div className="modern-data-grid__empty">
                    <strong>No records found</strong>
                    <span>Try clearing the search or adding new data.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="modern-data-grid__footer">
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(0, current - 1))}
          disabled={safePage === 0}
        >
          <FaChevronLeft aria-hidden="true" />
          Previous
        </button>
        <span>
          Page {safePage + 1} of {pageCount}
        </span>
        <button
          type="button"
          onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
          disabled={safePage >= pageCount - 1}
        >
          Next
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default ModernDataGrid;

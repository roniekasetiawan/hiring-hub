"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";

interface Candidate {
  id: string;
  namaLengkap: string;
  emailAddress: string;
  phoneNumbers: string;
  dateOfBirth: string;
  domicile: string;
  gender: "Male" | "Female";
  linkLinkedin: string;
}

type SortDirection = "ascending" | "descending";
interface SortConfig {
  key: keyof Candidate;
  direction: SortDirection;
}

type ColumnWidths = Partial<Record<keyof Candidate, number>>;

const TableHeader: FC<{
  columns: { key: keyof Candidate; label: string }[];
  columnOrder: (keyof Candidate)[];
  columnWidths: ColumnWidths;
  onColumnOrderChange: (next: (keyof Candidate)[]) => void;
  onColumnWidthChange: (key: keyof Candidate, width: number) => void;

  requestSort: (key: keyof Candidate) => void;
  sortConfig: SortConfig | null;
  onSelectAll: () => void;
  isAllSelected: boolean;
}> = ({
  columns,
  columnOrder,
  columnWidths,
  onColumnOrderChange,
  onColumnWidthChange,
  requestSort,
  sortConfig,
  onSelectAll,
  isAllSelected,
}) => {
  const getSortIcon = (key: keyof Candidate) => {
    if (!sortConfig || sortConfig.key !== key) return "↕";
    if (sortConfig.direction === "ascending") return "↑";
    return "↓";
  };

  const dragKeyRef = useRef<keyof Candidate | null>(null);
  const handleDragStart = (key: keyof Candidate) => () => {
    dragKeyRef.current = key;
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (targetKey: keyof Candidate) => (e: React.DragEvent) => {
    e.preventDefault();
    const src = dragKeyRef.current;
    if (!src || src === targetKey) return;
    const next = [...columnOrder];
    const from = next.indexOf(src);
    const to = next.indexOf(targetKey);
    if (from === -1 || to === -1) return;
    next.splice(from, 1);
    next.splice(to, 0, src);
    onColumnOrderChange(next);
    dragKeyRef.current = null;
  };

  const resizingRef = useRef<{
    key: keyof Candidate;
    startX: number;
    startWidth: number;
  } | null>(null);

  const onResizeStart = (key: keyof Candidate) => (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth =
      columnWidths[key] ??
      (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect()
        .width ??
      160;
    resizingRef.current = { key, startX, startWidth };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const state = resizingRef.current;
      if (!state) return;
      const delta = e.clientX - state.startX;
      const newWidth = Math.max(80, Math.round(state.startWidth + delta));
      onColumnWidthChange(state.key, newWidth);
    };
    const onMouseUp = () => {
      resizingRef.current = null;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onColumnWidthChange]);

  const columnsByKey = useMemo(
    () => Object.fromEntries(columns.map((c) => [c.key, c.label] as const)),
    [columns],
  );

  return (
    <thead className="bg-slate-50 select-none">
      <tr>
        <th className="p-4 text-left w-10">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onSelectAll}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
        </th>

        {columnOrder.map((key) => (
          <th
            key={key}
            draggable
            onDragStart={handleDragStart(key)}
            onDragOver={handleDragOver}
            onDrop={handleDrop(key)}
            onClick={() => requestSort(key)}
            className="relative cursor-pointer p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-slate-100"
            style={{
              width: columnWidths[key] ? `${columnWidths[key]}px` : undefined,
            }}
          >
            {columnsByKey[key]} {getSortIcon(key)}
            <span
              onMouseDown={onResizeStart(key)}
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
            />
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableRow: FC<{
  candidate: Candidate;
  onSelect: (id: string) => void;
  isSelected: boolean;
  columnKeys: (keyof Candidate)[];
  columnWidths: ColumnWidths;
}> = ({ candidate, onSelect, isSelected, columnKeys, columnWidths }) => (
  <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
    <td className="p-4 w-10">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(candidate.id)}
        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
      />
    </td>

    {columnKeys.map((key) => {
      const value =
        key === "linkLinkedin" ? (
          <a
            href={candidate.linkLinkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:underline"
          >
            {candidate.linkLinkedin}
          </a>
        ) : (
          (candidate as any)[key]
        );

      return (
        <td
          key={key}
          className="p-4 text-sm text-gray-700"
          style={{
            width: columnWidths[key] ? `${columnWidths[key]}px` : undefined,
          }}
        >
          {value}
        </td>
      );
    })}
  </tr>
);

const Pagination: FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || totalPages <= 1}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages <= 1}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

interface CandidateTableProps {
  candidates: Candidate[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (value: string) => void;
  sortConfig: SortConfig | null;
  onRequestSort: (key: keyof Candidate) => void;
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  filterValue: string;
}

const CandidateTable: FC<CandidateTableProps> = ({
  candidates,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onFilterChange,
  sortConfig,
  onRequestSort,
  selectedIds,
  onSelect,
  onSelectAll,
  filterValue,
}) => {
  const baseColumns: { key: keyof Candidate; label: string }[] = [
    { key: "namaLengkap", label: "Nama Lengkap" },
    { key: "emailAddress", label: "Email Address" },
    { key: "phoneNumbers", label: "Phone Numbers" },
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "domicile", label: "Domicile" },
    { key: "gender", label: "Gender" },
    { key: "linkLinkedin", label: "Link Linkedin" },
  ];

  const [columnOrder, setColumnOrder] = useState<(keyof Candidate)[]>(
    baseColumns.map((c) => c.key),
  );
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>(() => {
    const defaults: ColumnWidths = {};
    baseColumns.forEach((c) => {
      defaults[c.key] = 180;
    });
    defaults["namaLengkap"] = 220;
    defaults["linkLinkedin"] = 260;
    return defaults;
  });

  const isAllSelected =
    candidates.length > 0 && selectedIds.size === candidates.length;

  const onColumnWidthChange = (key: keyof Candidate, width: number) => {
    setColumnWidths((prev) => ({ ...prev, [key]: width }));
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
      <input
        type="text"
        placeholder="Cari kandidat..."
        value={filterValue}
        onChange={(e) => onFilterChange(e.target.value)}
        className="mb-4 w-full text-black rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader
            columns={baseColumns}
            columnOrder={columnOrder}
            columnWidths={columnWidths}
            onColumnOrderChange={setColumnOrder}
            onColumnWidthChange={onColumnWidthChange}
            requestSort={onRequestSort}
            sortConfig={sortConfig}
            onSelectAll={onSelectAll}
            isAllSelected={isAllSelected}
          />
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={baseColumns.length + 1}
                  className="p-4 text-center"
                >
                  Loading candidates...
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td
                  colSpan={baseColumns.length + 1}
                  className="p-4 text-center text-black"
                >
                  No candidates found for this search.
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  candidate={candidate}
                  onSelect={onSelect}
                  isSelected={selectedIds.has(candidate.id)}
                  columnKeys={columnOrder}
                  columnWidths={columnWidths}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default CandidateTable;

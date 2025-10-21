"use client";

import React, { FC } from "react";

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

const TableHeader: FC<{
  columns: { key: keyof Candidate; label: string }[];
  requestSort: (key: keyof Candidate) => void;
  sortConfig: SortConfig | null;
  onSelectAll: () => void;
  isAllSelected: boolean;
}> = ({ columns, requestSort, sortConfig, onSelectAll, isAllSelected }) => {
  const getSortIcon = (key: keyof Candidate) => {
    if (!sortConfig || sortConfig.key !== key) return "↕";
    if (sortConfig.direction === "ascending") return "↑";
    return "↓";
  };
  return (
    <thead className="bg-slate-50">
      <tr>
        <th className="p-4 text-left">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onSelectAll}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
        </th>
        {columns.map(({ key, label }) => (
          <th
            key={key}
            onClick={() => requestSort(key)}
            className="cursor-pointer p-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-slate-100"
          >
            {label} {getSortIcon(key)}
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
}> = ({ candidate, onSelect, isSelected }) => (
  <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
    <td className="p-4">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(candidate.id)}
        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
      />
    </td>
    <td className="p-4 text-sm text-gray-700">{candidate.namaLengkap}</td>
    <td className="p-4 text-sm text-gray-700">{candidate.emailAddress}</td>
    <td className="p-4 text-sm text-gray-700">{candidate.phoneNumbers}</td>
    <td className="p-4 text-sm text-gray-700">{candidate.dateOfBirth}</td>
    <td className="p-4 text-sm text-gray-700">{candidate.domicile}</td>
    <td className="p-4 text-sm text-gray-700">{candidate.gender}</td>
    <td className="p-4 text-sm text-teal-600 hover:underline">
      <a
        href={candidate.linkLinkedin}
        target="_blank"
        rel="noopener noreferrer"
      >
        {candidate.linkLinkedin}
      </a>
    </td>
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
  const columns: { key: keyof Candidate; label: string }[] = [
    { key: "namaLengkap", label: "Nama Lengkap" },
    { key: "emailAddress", label: "Email Address" },
    { key: "phoneNumbers", label: "Phone Numbers" },
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "domicile", label: "Domicile" },
    { key: "gender", label: "Gender" },
    { key: "linkLinkedin", label: "Link Linkedin" },
  ];

  const isAllSelected =
    candidates.length > 0 && selectedIds.size === candidates.length;

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
            columns={columns}
            requestSort={onRequestSort}
            sortConfig={sortConfig}
            onSelectAll={onSelectAll}
            isAllSelected={isAllSelected}
          />
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-4 text-center">
                  Loading candidates...
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
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

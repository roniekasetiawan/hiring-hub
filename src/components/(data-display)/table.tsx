"use client";

import React, { useState, useMemo, FC } from "react";

interface Candidate {
  id: number;
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

const useCandidateTable = (
  candidates: Candidate[],
  itemsPerPage: number = 10,
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const filteredCandidates = useMemo(() => {
    if (!filter) return candidates;
    return candidates.filter((candidate) =>
      Object.values(candidate).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase()),
      ),
    );
  }, [candidates, filter]);

  const sortedCandidates = useMemo(() => {
    let sortableItems = [...filteredCandidates];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredCandidates, sortConfig]);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedCandidates.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCandidates, currentPage, itemsPerPage]);

  const requestSort = (key: keyof Candidate) => {
    let direction: SortDirection = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage);

  const handleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (
      selectedIds.size === paginatedCandidates.length &&
      paginatedCandidates.length > 0
    ) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedCandidates.map((c) => c.id)));
    }
  };

  return {
    paginatedCandidates,
    requestSort,
    sortConfig,
    setFilter: handleFilterChange,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedIds,
    handleSelect,
    handleSelectAll,
  };
};

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
  onSelect: (id: number) => void;
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
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const CandidateTable = ({
  mockCandidates,
  paginateBy = 5,
}: {
  mockCandidates: any;
  paginateBy?: number;
}) => {
  const {
    paginatedCandidates,
    requestSort,
    sortConfig,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedIds,
    handleSelect,
    handleSelectAll,
  } = useCandidateTable(mockCandidates, paginateBy);

  const columns: { key: keyof Candidate; label: string }[] = [
    { key: "namaLengkap", label: "Nama Lengkap" },
    { key: "emailAddress", label: "Email Address" },
    { key: "phoneNumbers", label: "Phone Numbers" },
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "domicile", label: "Domicile" },
    { key: "gender", label: "Gender" },
    { key: "linkLinkedin", label: "Link Linkedin" },
  ];

  return (
    <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
      <input
        type="text"
        placeholder="Cari kandidat..."
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 w-full text-black rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader
            columns={columns}
            requestSort={requestSort}
            sortConfig={sortConfig}
            onSelectAll={handleSelectAll}
            isAllSelected={
              selectedIds.size === paginatedCandidates.length &&
              paginatedCandidates.length > 0
            }
          />
          <tbody className="divide-y divide-gray-200">
            {paginatedCandidates.map((candidate) => (
              <TableRow
                key={candidate.id}
                candidate={candidate}
                onSelect={handleSelect}
                isSelected={selectedIds.has(candidate.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CandidateTable;

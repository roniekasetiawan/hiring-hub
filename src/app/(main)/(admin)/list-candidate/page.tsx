"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import useSWR from "swr";
import useDebounce from "@/hooks/useDebounce";

import PageID from "@/@core/components/PageID";
import CandidateTable from "@/components/(data-display)/table";
import { Typography } from "@mui/material";
import EmptyState from "@/app/(main)/(admin)/list-candidate/EmptyState";

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

const fetcherWithPagination = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  const totalPages = Number(res.headers.get("pagination-pages") || 1);
  return { data: data.data, totalPages };
};

export default function JobListPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") as string;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const apiUrl = new URLSearchParams();
  apiUrl.append("job_id", jobId);
  apiUrl.append("page", String(currentPage));
  apiUrl.append("limit", "10");
  if (debouncedSearchTerm) {
    apiUrl.append("q", debouncedSearchTerm);
  }
  if (sortConfig) {
    // Implement server-side sorting if needed
  }

  console.log("url => ", apiUrl.toString());

  const {
    data: swrData,
    isLoading,
    error,
  } = useSWR(
    jobId ? `/api/candidates?${apiUrl.toString()}` : null,
    fetcherWithPagination,
  );

  console.log({
    swrData,
    isLoading,
    error,
  });

  const candidates: Candidate[] = swrData?.data ?? [];
  const totalPages = swrData?.totalPages ?? 1;

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === candidates.length && candidates.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(candidates.map((c) => c.id)));
    }
  };

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
  };

  if (isLoading && !swrData) {
    return (
      <PageID
        title="Management Menu"
        path="/config/manage-menu"
        breadcrumbs={{
          title: "Management Menu",
          routes: [
            { label: "Joblist", href: "/jobs" },
            { label: "Manage Candidates" },
          ],
        }}
      >
        <Typography variant="h3" color="black" mb={3}>
          Front End Developer
        </Typography>
        <div className="text-center p-10">Loading candidates...</div>
      </PageID>
    );
  }

  const showEmptyState =
    !isLoading && candidates.length === 0 && !debouncedSearchTerm;

  return (
    <PageID
      title="Management Menu"
      path="/config/manage-menu"
      breadcrumbs={{
        title: "Management Menu",
        routes: [
          { label: "Joblist", href: "/jobs" },
          { label: "Manage Candidates" },
        ],
      }}
    >
      <Typography variant="h3" color="black" mb={3}>
        Front End Developer
      </Typography>

      {showEmptyState ? (
        <EmptyState
          title="No candidates found"
          subtitle="Share your job vacancies so that more candidates will apply."
          imageSrc="/assets/images/empty_job.svg"
        />
      ) : (
        <CandidateTable
          candidates={candidates}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onFilterChange={setSearchTerm}
          filterValue={searchTerm}
          sortConfig={sortConfig}
          onRequestSort={requestSort}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
        />
      )}
    </PageID>
  );
}

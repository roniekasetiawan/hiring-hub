import { Suspense } from "react";
import CandidateList from "./CandidateList";

const LoadingCandidates = () => {
  return <div className="p-10 text-center">Loading...</div>;
};

export default function JobListPage() {
  return (
    <Suspense fallback={<LoadingCandidates />}>
      <CandidateList />
    </Suspense>
  );
}

import PageID from "@/@core/components/PageID";
import OpeningJobModules from "@/modules/OpeningJob";

export default function OpeningJobPage() {
  return (
    <PageID title="Opening Job">
      <div className="flex max-h-[85vh] w-full flex-col bg-gray-100 overflow-hidden mt-25">
        <OpeningJobModules />
      </div>
    </PageID>
  );
}

import HandCapture from "@/app/capture/HandCapture";

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-2xl">
        <HandCapture />
      </div>
    </main>
  );
}

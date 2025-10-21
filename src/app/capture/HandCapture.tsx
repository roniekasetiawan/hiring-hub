"use client";

import Image from "next/image";
import { useState } from "react";

export default function CapturePage() {
  const [activePose] = useState(2);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 w-3xl">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative px-6 pt-6 pb-3">
          <h2 className="text-2xl font-semibold text-slate-900">
            Raise Your Hand to Capture
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            We’ll take the photo once your hand pose is detected.
          </p>
          <button
            aria-label="Close"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-700 hover:bg-slate-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M18 6 6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="relative aspect-video bg-[#0f172a]">
          <div className="absolute left-16 top-20 border-4 border-green-500 rounded-sm w-[320px] h-[240px]" />
          <div className="absolute left-16 top-14 bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-md">
            Pose 3
          </div>
        </div>

        <div className="border-t px-6 py-5 space-y-3">
          <p className="text-sm text-gray-600">
            To take a picture, follow the hand poses in the order shown below.
            The system will automatically capture the image once the final pose
            is detected.
          </p>

          <div className="flex items-center justify-center gap-3">
            <PoseStep
              src="/assets/images/fingers/default/third.png"
              label="Pose 3"
              active={activePose === 0}
            />
            <Arrow />
            <PoseStep
              src="/assets/images/fingers/default/second.png"
              label="Pose 2"
              active={activePose === 1}
            />
            <Arrow />
            <PoseStep
              src="/assets/images/fingers/default/first.png"
              label="Pose 1"
              active={activePose === 2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PoseStep({
  src,
  label,
  active,
}: {
  src: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`w-24 h-24 flex flex-col items-center justify-center rounded-md border transition-all ${
        active
          ? "border-green-500 bg-green-50"
          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <div className="w-20 h-20 relative">
        <Image src={src} alt={label} fill className={`object-contain invert`} />
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center text-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l8 8-8 8" />
      </svg>
    </div>
  );
}

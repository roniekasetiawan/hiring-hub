"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function ApplicationSuccessPage() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (countdown === 0) {
      router.push("/opening-job");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-12 text-center">
      <div className="flex flex-col items-center space-y-5">
        <Image
          src="/assets/images/peoples.svg"
          alt="Application Sent"
          width={180}
          height={180}
          priority
        />
        <h2 className="text-2xl font-bold text-slate-900">
          🎉 Your application was sent!
        </h2>
        <p className="max-w-md text-md text-slate-500">
          Congratulations! You've taken the first step towards a rewarding
          career at Rakamin. We look forward to learning more about you during
          the application process.
        </p>

        <p className="text-sm text-slate-500">
          Redirecting to job openings in{" "}
          <span className="font-semibold text-slate-700">{countdown}</span>{" "}
          seconds...
          <br />
          Or{" "}
          <Link
            href="/opening-job"
            className="font-semibold text-teal-600 hover:underline"
          >
            click here
          </Link>{" "}
          to go now.
        </p>
      </div>
    </div>
  );
}

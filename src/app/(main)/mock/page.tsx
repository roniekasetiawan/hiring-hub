"use client";

import * as React from "react";
import { ApplyFormModal } from "@/components/ApplyForm/ApplyFormModal";
import { useState } from "react";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <main className="max-w-md mx-auto p-6 space-y-6 pt-20">
      <h1 className="text-2xl font-bold">Lowongan Pekerjaan</h1>
      <p className="mb-8">Ayo gabung bersama kami.</p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-teal-600 px-5 py-2.5 font-semibold text-white hover:bg-teal-700"
      >
        Apply Sekarang
      </button>

      <ApplyFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

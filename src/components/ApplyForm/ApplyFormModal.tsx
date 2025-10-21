"use client";

import React from "react";
import ApplyForm from "./ApplyForm";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ApplyFormModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 max-h-[90vh] w-full overflow-y-auto rounded-lg"
      >
        <ApplyForm doClose={onClose} />
      </div>
    </div>
  );
};

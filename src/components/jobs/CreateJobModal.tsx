'use client';

import * as React from 'react';

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function CreateJobModal({ open, onClose }: Props) {
    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Create Job</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full px-2 py-1 text-slate-500 hover:bg-slate-100"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* TODO: ganti dengan JobMetaForm + MinProfileBuilder */}
                <p className="text-sm text-slate-600">
                    Placeholder modal. Nanti diisi form metadata + Minimum Profile
                    Information Required.
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-lg border px-4 py-2 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

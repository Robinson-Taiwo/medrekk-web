"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CODE = /^MRK-[A-Z0-9]{5,8}$/;

export default function EmergencyLookupPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const clean = code.trim().toUpperCase();
    if (!CODE.test(clean)) return setError("Enter a valid MedRekk Code, like MRK-82941.");
    const r = reason.trim();
    router.push(`/emergency/${clean}${r.length >= 3 ? `?reason=${encodeURIComponent(r)}` : ""}`);
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Emergency access</h1>
      <p className="mt-2 text-gray-600">
        For emergencies only. This shows a minimal emergency profile without the patient&apos;s approval, and
        the access is logged and visible to the patient.
      </p>

      <label className="mt-8 block text-sm font-medium text-gray-700">MedRekk Code</label>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="MRK-82941"
        autoCapitalize="characters"
        className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base"
      />

      <label className="mt-4 block text-sm font-medium text-gray-700">Reason (optional)</label>
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="e.g. Road accident, patient unconscious"
        className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base"
      />

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

      <button
        onClick={submit}
        className="mt-6 w-full rounded-xl bg-red-700 py-3 font-semibold text-white hover:bg-red-800"
      >
        Show emergency profile
      </button>
    </main>
  );
}

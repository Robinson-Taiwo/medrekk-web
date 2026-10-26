"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { NightField, NightNotice } from "@/components/night";

const CODE = /^MRK-[A-Z0-9]{5,8}$/;

/**
 * The reason is optional to type and not optional to give: it is written into the patient's
 * log beside the time, and it is the only thing that later distinguishes a road accident from
 * somebody being nosy. Asked for here rather than afterwards, while the person still knows.
 */
export default function EmergencyLookupForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!CODE.test(clean)) {
      setError("Enter a valid MedRekk code, like MRK-82941.");
      return;
    }
    const r = reason.trim();
    router.push(`/emergency/${clean}${r.length >= 3 ? `?reason=${encodeURIComponent(r)}` : ""}`);
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div>
        <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-mist">Open an emergency card</h2>
        <p className="mt-1.5 text-[13.5px] leading-[1.6] text-mist-dim">
          On the patient&rsquo;s phone screen, their card, or a MedRekk QR.
        </p>
      </div>

      <NightField
        id="emergency-code"
        label="MedRekk code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="MRK-82941"
        autoCapitalize="characters"
        spellCheck={false}
        required
        className="font-mono text-[17px] tracking-[0.18em]"
      />

      <NightField
        id="emergency-reason"
        label="Reason"
        hint="Shown to the patient in their log. Say what is happening."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Road accident, patient unconscious"
      />

      {error ? <NightNotice tone="danger">{error}</NightNotice> : null}

      <button
        type="submit"
        className="mt-1 inline-flex h-[52px] w-full items-center justify-center rounded-xl bg-rose-500 text-base font-semibold text-white transition-[transform,background-color] duration-150 hover:bg-rose-400 active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        Open the emergency card
      </button>

      <p className="text-center text-[12.5px] leading-[1.6] text-mist-faint">
        This will appear in the patient&rsquo;s access log.
      </p>
    </form>
  );
}

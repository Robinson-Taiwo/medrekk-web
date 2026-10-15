"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { api } from "@/lib/api";
import type { LookupResponse } from "@/lib/types";

const cleanCode = (raw: string): string => raw.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);

const subscribe = (): (() => void) => () => {};
const readCodeFromLink = (): string => cleanCode(new URLSearchParams(window.location.search).get("code") ?? "");
const readCodeOnServer = (): string => "";

export default function AccessLookupPage() {
  const router = useRouter();
  const fromLink = useSyncExternalStore(subscribe, readCodeFromLink, readCodeOnServer);
  const [typed, setTyped] = useState<string | null>(null);
  const code = typed ?? fromLink;
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api<LookupResponse>("/access/lookup", {
        body: { medrekkCode: code.trim(), patientName: name.trim() },
      });
      try {
        sessionStorage.setItem(
          `medrekk:${res.session}`,
          JSON.stringify({ patientName: res.patientName, medrekkCode: res.medrekkCode }),
        );
      } catch {
        // Storage is a convenience only; the next page works without it.
      }
      router.push(`/access/${res.session}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Access a medical record</h1>
      <p className="mt-2 text-gray-600">
        Ask the patient for their MedRekk Code and use their full name. A code and name find a record; they do not
        grant access. The patient must approve.
      </p>
      <form onSubmit={(e) => void submit(e)} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          MedRekk Code
          <input
            value={code}
            onChange={(e) => setTyped(cleanCode(e.target.value))}
            placeholder="MRK-82941"
            autoCapitalize="characters"
            required
            className="rounded-xl border border-gray-300 px-4 py-3 text-base uppercase tracking-widest text-gray-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Patient name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Amaka Okafor"
            required
            minLength={2}
            className="rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-[#0F6E56] py-3 font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Looking up..." : "Continue"}
        </button>
      </form>
    </main>
  );
}

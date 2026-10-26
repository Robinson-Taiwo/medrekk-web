"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { api } from "@/lib/api";
import type { LookupResponse } from "@/lib/types";
import { NightButton, NightField, NightNotice } from "@/components/night";

const cleanCode = (raw: string): string => raw.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);

const subscribe = (): (() => void) => () => {};
const readCodeFromLink = (): string => cleanCode(new URLSearchParams(window.location.search).get("code") ?? "");
const readCodeOnServer = (): string => "";

/**
 * A code and a name find a record; they do not open it. The failure is deliberately the same
 * sentence whether the code is wrong or the name is — otherwise this form would answer the
 * question "does this code exist?" to anyone who asked it enough times.
 */
export default function LookupForm() {
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
    <form onSubmit={(e) => void submit(e)} className="grid gap-4">
      <NightField
        id="medrekk-code"
        label="MedRekk code"
        hint="On the patient's home screen, and on their emergency card."
        value={code}
        onChange={(e) => setTyped(cleanCode(e.target.value))}
        placeholder="MRK-82941"
        autoCapitalize="characters"
        spellCheck={false}
        required
        className="font-mono tracking-[0.18em]"
      />
      <NightField
        id="patient-name"
        label="Patient name"
        hint="As it appears on their record."
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Amaka Okafor"
        required
        minLength={2}
      />

      {error ? <NightNotice tone="danger">{error}</NightNotice> : null}

      <NightButton type="submit" size="lg" disabled={busy} className="mt-1 w-full">
        {busy ? "Looking up…" : "Continue"}
      </NightButton>

      <p className="text-center text-[12.5px] leading-[1.6] text-mist-faint">
        This finds the record. It does not open it.
      </p>
    </form>
  );
}

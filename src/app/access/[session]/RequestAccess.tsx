"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import { ACCESS_SCOPES, REQUESTER_ROLES, ROLE_LABEL, SCOPE_LABEL, type AccessScope, type RequesterRole } from "@/lib/types";

interface Found { patientName: string; medrekkCode: string }

const DURATIONS: { minutes: number; label: string }[] = [
  { minutes: 30, label: "30 minutes" },
  { minutes: 60, label: "1 hour" },
  { minutes: 120, label: "2 hours" },
  { minutes: 240, label: "4 hours" },
];

export default function RequestAccessPage() {
  const router = useRouter();
  const { session } = useParams<{ session: string }>();
  const [found, setFound] = useState<Found | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState<RequesterRole>("DOCTOR");
  const [reason, setReason] = useState("Continuity of care");
  const [facility, setFacility] = useState("");
  const [scopes, setScopes] = useState<AccessScope[]>(["ALLERGIES", "CURRENT_MEDICATIONS"]);
  const [minutes, setMinutes] = useState(120);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`medrekk:${session}`);
      if (raw) setFound(JSON.parse(raw) as Found);
      const me = getAuth();
      if (me) setName(me.user.fullName);
    } catch {
      // Not stored; the form still works.
    }
  }, [session]);

  const toggle = (s: AccessScope) =>
    setScopes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (busy) return;
    if (scopes.length === 0) {
      setError("Choose at least one type of information.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api(`/access/${session}/request`, {
        auth: Boolean(getAuth()),
        body: {
          requesterName: name.trim(),
          requesterRole: role,
          reason: reason.trim(),
          scopes,
          durationMinutes: minutes,
          ...(facility.trim() ? { requesterFacility: facility.trim() } : {}),
        },
      });
      router.push(`/access/${session}/pending`);
    } catch (err) {
      if (err instanceof ApiError && err.code === "REQUEST_ALREADY_SUBMITTED") {
        router.push(`/access/${session}/pending`);
        return;
      }
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-[680px]">
      <p className="text-sm font-semibold text-glow">Record found</p>
      <h1 className="text-3xl font-bold text-mist">{found?.patientName ?? "Patient record"}</h1>
      {found ? <p className="mt-1 tracking-widest text-mist-faint">{found.medrekkCode}</p> : null}
      <p className="mt-4 text-mist-dim">
        Before accessing this record, tell the patient who you are and why you need access. They decide what you can see.
      </p>

      <form onSubmit={(e) => void submit(e)} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-mist-dim">
          Your name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            placeholder="Dr. Michael Adeyemi"
            className="rounded-xl border border-white/[0.09] px-4 py-3 text-base text-mist"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-mist-dim">
          Your role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RequesterRole)}
            className="rounded-xl border border-white/[0.09] px-4 py-3 text-base text-mist"
          >
            {REQUESTER_ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABEL[r]}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-mist-dim">
          Reason
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            minLength={3}
            className="rounded-xl border border-white/[0.09] px-4 py-3 text-base text-mist"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-mist-dim">
          Facility or organization (optional)
          <input
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            maxLength={160}
            placeholder="General Hospital"
            className="rounded-xl border border-white/[0.09] px-4 py-3 text-base text-mist"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-mist-dim">Information you need</legend>
          {ACCESS_SCOPES.map((s) => (
            <label key={s} className="flex items-center gap-3 rounded-xl border border-white/[0.09] px-4 py-2 text-mist">
              <input type="checkbox" checked={scopes.includes(s)} onChange={() => toggle(s)} />
              {SCOPE_LABEL[s]}
            </label>
          ))}
        </fieldset>

        <label className="flex flex-col gap-1 text-sm font-medium text-mist-dim">
          Access needed for
          <select
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="rounded-xl border border-white/[0.09] px-4 py-3 text-base text-mist"
          >
            {DURATIONS.map((d) => (
              <option key={d.minutes} value={d.minutes}>{d.label}</option>
            ))}
          </select>
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-glow py-3 font-semibold text-glow-ink disabled:opacity-60"
        >
          {busy ? "Sending..." : "Request access"}
        </button>
      </form>
    </div>
  );
}

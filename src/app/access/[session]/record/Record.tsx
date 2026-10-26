"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { getAuth, type StoredAuth } from "@/lib/auth";
import { SCOPE_LABEL, STATUS_BADGE, STATUS_LABEL, type AccessScope, type Claim, type RecordResponse } from "@/lib/types";

interface ReviewProfile {
  criticalAllergies: string[];
  criticalConditions: string[];
  criticalMedications: string[];
  implantedDevices: string[];
  importantWarnings: string[];
  bloodGroup?: string;
  emergencyContact?: { name: string; phone: string; relationship: string };
  verificationStatus: string;
  verifiedAt?: string;
  verifiedByName?: string;
  verifiedByFacility?: string | null;
  verificationMethod?: string;
}

function Badge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[status] ?? "bg-white/[0.04]/[0.08] text-mist-dim"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function ClaimVerify({ session, claim, onUpdated }: { session: string; claim: Claim; onUpdated: (c: Claim) => void }) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (claim.status === "CLINICALLY_VERIFIED") return null;

  const submit = async () => {
    if (busy) return;
    if (method.trim().length < 3) return setError("Describe how you verified this (at least 3 characters).");
    setBusy(true);
    setError(null);
    try {
      const res = await api<{ claim: Claim }>(`/access/${session}/claims/${claim.id}/verify`, {
        body: { method: method.trim() },
        auth: true,
      });
      onUpdated(res.claim);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-2 text-sm font-medium text-glow underline">
        Verify this
      </button>
    );
  }
  return (
    <div className="mt-2 flex flex-col gap-2">
      <input
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        placeholder="How did you verify it? e.g. Examined patient"
        className="rounded-lg border border-white/[0.09] px-3 py-2 text-sm text-mist"
      />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <div className="flex gap-2">
        <button
          onClick={() => void submit()}
          disabled={busy}
          className="rounded-lg bg-glow px-3 py-1.5 text-sm font-semibold text-glow-ink disabled:opacity-60"
        >
          {busy ? "Saving..." : "Confirm: clinically verified"}
        </button>
        <button onClick={() => setOpen(false)} className="text-sm text-mist-dim">Cancel</button>
      </div>
    </div>
  );
}

const EVIDENCE_OPTIONS: { value: string; label: string }[] = [
  { value: "LAB_REPORT", label: "Lab report" },
  { value: "PRESCRIPTION", label: "Prescription" },
  { value: "DOCUMENT", label: "Medical document" },
  { value: "PREVIOUS_RECORD", label: "Previous record" },
  { value: "PATIENT_CONFIRMATION", label: "Patient confirmation" },
  { value: "PROFESSIONAL_CONFIRMATION", label: "Professional confirmation" },
];

function ClaimEvidence({ session, claim, onUpdated }: { session: string; claim: Claim; onUpdated: (c: Claim) => void }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState("LAB_REPORT");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (claim.status !== "UNVERIFIED" && claim.status !== "SELF_REPORTED") return null;

  const submit = async () => {
    if (busy) return;
    const text = description.trim();
    if (text.length < 3 || text.length > 300) return setError("Describe the evidence in 3 to 300 characters.");
    setBusy(true);
    setError(null);
    try {
      const res = await api<{ claim?: Claim }>(`/access/${session}/claims/${claim.id}/evidence`, {
        body: { kind, description: text },
        auth: true,
      });
      onUpdated(res.claim ?? { ...claim, status: "EVIDENCE_BACKED" });
      setOpen(false);
      setDescription("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-2 mr-4 text-sm font-medium text-glow underline">
        Add evidence
      </button>
    );
  }
  return (
    <div className="mt-2 flex flex-col gap-2">
      <select
        value={kind}
        onChange={(e) => setKind(e.target.value)}
        className="rounded-lg border border-white/[0.09] px-3 py-2 text-sm text-mist"
      >
        {EVIDENCE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={300}
        placeholder="What did you see? e.g. HbA1c result dated 12 Sep 2026"
        className="rounded-lg border border-white/[0.09] px-3 py-2 text-sm text-mist"
      />
      <p className="text-xs text-mist-faint">{description.trim().length} / 300. This records a description, not an uploaded file.</p>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <div className="flex gap-2">
        <button
          onClick={() => void submit()}
          disabled={busy}
          className="rounded-lg bg-glow px-3 py-1.5 text-sm font-semibold text-glow-ink disabled:opacity-60"
        >
          {busy ? "Saving..." : "Attach evidence"}
        </button>
        <button onClick={() => setOpen(false)} className="text-sm text-mist-dim">Cancel</button>
      </div>
    </div>
  );
}

function ListLine({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <p className="text-sm text-mist">
      <span className="font-medium">{label}:</span> {items.join(", ")}
    </p>
  );
}

function ProfileReview({ session, profile, onUpdated }: { session: string; profile: ReviewProfile; onUpdated: (p: ReviewProfile) => void }) {
  const [level, setLevel] = useState<"EVIDENCE_BACKED" | "CLINICALLY_VERIFIED">("CLINICALLY_VERIFIED");
  const [method, setMethod] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (busy) return;
    if (method.trim().length < 3) return setError("Describe how you verified this (at least 3 characters).");
    setBusy(true);
    setError(null);
    try {
      const res = await api<{ profile: ReviewProfile }>(`/access/${session}/emergency-profile/verify`, {
        body: { level, method: method.trim() },
        auth: true,
      });
      onUpdated(res.profile);
      setMethod("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-8 rounded-xl border border-red-200 bg-rose-400/[0.08]/40 p-4">
      <h2 className="text-lg font-semibold text-mist">Emergency profile</h2>
      <div className="mt-1 flex items-center gap-2">
        <Badge status={profile.verificationStatus} />
        {profile.verifiedByName && profile.verifiedAt ? (
          <span className="text-xs text-mist-faint">
            by {profile.verifiedByName}
            {profile.verifiedByFacility ? `, ${profile.verifiedByFacility}` : ""} on {new Date(profile.verifiedAt).toLocaleDateString()}
          </span>
        ) : null}
      </div>
      <div className="mt-3 space-y-1">
        {profile.bloodGroup ? <p className="text-sm text-mist"><span className="font-medium">Blood group:</span> {profile.bloodGroup}</p> : null}
        <ListLine label="Allergies" items={profile.criticalAllergies} />
        <ListLine label="Conditions" items={profile.criticalConditions} />
        <ListLine label="Medications" items={profile.criticalMedications} />
        <ListLine label="Devices" items={profile.implantedDevices} />
        <ListLine label="Warnings" items={profile.importantWarnings} />
        {profile.emergencyContact ? (
          <p className="text-sm text-mist">
            <span className="font-medium">Contact:</span> {profile.emergencyContact.name} ({profile.emergencyContact.relationship}) {profile.emergencyContact.phone}
          </p>
        ) : null}
      </div>

      {profile.verificationStatus !== "CLINICALLY_VERIFIED" ? (
        <div className="mt-4 flex flex-col gap-2">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as "EVIDENCE_BACKED" | "CLINICALLY_VERIFIED")}
            className="rounded-lg border border-white/[0.09] px-3 py-2 text-sm text-mist"
          >
            <option value="CLINICALLY_VERIFIED">Clinically verified (needs an approved credential)</option>
            <option value="EVIDENCE_BACKED">Evidence-backed</option>
          </select>
          <input
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="How did you check it? e.g. Reviewed with patient"
            className="rounded-lg border border-white/[0.09] px-3 py-2 text-sm text-mist"
          />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button
            onClick={() => void submit()}
            disabled={busy}
            className="self-start rounded-lg bg-glow px-3 py-1.5 text-sm font-semibold text-glow-ink disabled:opacity-60"
          >
            {busy ? "Saving..." : "Mark as verified"}
          </button>
        </div>
      ) : null}
    </section>
  );
}

export default function RecordPage() {
  const router = useRouter();
  const { session } = useParams<{ session: string }>();
  const [record, setRecord] = useState<RecordResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [worker, setWorker] = useState<StoredAuth | null>(null);
  const [profile, setProfile] = useState<ReviewProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const requested = useRef(false);
  const profileRequested = useRef(false);

  useEffect(() => {
    const a = getAuth();
    setWorker(a && a.user.role === "HEALTH_WORKER" ? a : null);
  }, []);

  useEffect(() => {
    // Each load is written to the patient's audit trail, so fetch exactly once.
    if (requested.current) return;
    requested.current = true;
    api<RecordResponse>(`/access/${session}/record`)
      .then(setRecord)
      .catch((e: unknown) => {
        if (e instanceof ApiError) {
          if (e.status === 409) return router.replace(`/access/${session}/pending`);
          if (e.status === 403) return setError(e.code === "ACCESS_REVOKED" ? "The patient ended this access." : "Access denied by patient.");
          if (e.status === 410) return setError("This access session has expired.");
          if (e.status === 404) return setError("This access session was not found.");
          return setError(e.message);
        }
        setError("Something went wrong.");
      });
  }, [session, router]);

  useEffect(() => {
    // Reviewing the profile is audited too, so fetch it once.
    if (!worker || !record || profileRequested.current) return;
    if (!record.authorizedScopes.includes("EMERGENCY_INFORMATION")) return;
    profileRequested.current = true;
    api<ReviewProfile>(`/access/${session}/emergency-profile`, { auth: true })
      .then(setProfile)
      .catch((e: unknown) => {
        setProfileError(
          e instanceof ApiError && e.code === "NOT_SESSION_REQUESTER"
            ? "You can review and verify only in sessions you requested while signed in."
            : e instanceof Error ? e.message : "Could not load the emergency profile.",
        );
      });
  }, [worker, record, session]);

  const updateClaim = (scope: AccessScope, updated: Claim) =>
    setRecord((prev) =>
      prev
        ? {
            ...prev,
            data: {
              ...prev.data,
              [scope]: (prev.data[scope] ?? []).map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
            },
          }
        : prev,
    );

  if (error) {
    return (
      <div className="mx-auto max-w-[44ch] text-center">
        <h1 className="text-2xl font-bold text-mist">{error}</h1>
        <Link href="/access" className="mt-6 inline-block text-glow underline">
          Look up a record
        </Link>
      </div>
    );
  }

  if (!record) {
    return <p className="p-6 text-center text-mist-faint">Loading record…</p>;
  }

  return (
    <div>
      {/* The header is its own band, so the record below can use the full width. */}
      <header className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-mist">
              {record.patient.name}
            </h1>
            <p className="mt-2 font-mono text-[13px] tracking-[0.14em] text-mist-dim">
              {record.patient.medrekkCode}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.09] bg-white/[0.04] px-3.5 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mist-faint">Access ends</p>
            <p className="mt-0.5 text-[14px] font-semibold text-mist">
              {new Date(record.grantedUntil).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              <span className="ml-1.5 font-normal text-mist-dim">
                {new Date(record.grantedUntil).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
        {worker ? (
          <p className="mt-4 border-t border-white/[0.07] pt-4 text-[13px] leading-[1.6] text-mist-faint">
            Signed in as {worker.user.fullName}. You can verify only in sessions you requested while signed in.
          </p>
        ) : null}
      </header>

      {/*
        A record is a set of short lists, not one long one.
        
        Stacked in a single column, six categories of two or three items each became a page
        you had to scroll through to learn what was in it — and the thing a clinician does
        here is scan, not read. Side by side, the whole record is visible at a glance and each
        category keeps its own boundary.
      */}
      <div className="mt-6 grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {record.authorizedScopes.map((scope: AccessScope) => {
          const claims = record.data[scope] ?? [];
          return (
            <section
              key={scope}
              className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]"
            >
              <div className="flex items-baseline justify-between gap-2 border-b border-white/[0.07] px-4 py-3">
                <h2 className="text-[14px] font-semibold text-mist">{SCOPE_LABEL[scope]}</h2>
                {claims.length > 0 ? (
                  <span className="rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[11.5px] tabular-nums text-mist-dim">
                    {claims.length}
                  </span>
                ) : null}
              </div>

              {claims.length === 0 ? (
                <p className="px-4 py-5 text-[13px] text-mist-faint">
                  {scope === "EMERGENCY_INFORMATION" ? "Shown separately below." : "Nothing recorded."}
                </p>
              ) : (
                <ul className="divide-y divide-white/[0.06]">
                  {claims.map((c) => (
                    <li key={c.id} className="px-4 py-3.5">
                      <p className="text-[15px] font-medium leading-[1.4] text-mist">{c.value}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <Badge status={c.status} />
                        <span className="text-[11.5px] text-mist-faint">{c.source}</span>
                      </div>
                      {worker ? (
                        <div className="mt-1">
                          <ClaimEvidence session={session} claim={c} onUpdated={(u) => updateClaim(scope, u)} />
                          <ClaimVerify session={session} claim={c} onUpdated={(u) => updateClaim(scope, u)} />
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {profile ? <ProfileReview session={session} profile={profile} onUpdated={setProfile} /> : null}
      {profileError ? <p className="mt-6 text-[13px] text-rose-300">{profileError}</p> : null}

      <p className="mt-10 text-[12.5px] leading-[1.7] text-mist-faint">
        You can see only what the patient approved. Every view of this record is logged.
      </p>
    </div>
  );
}

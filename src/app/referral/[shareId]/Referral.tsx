"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import {
  ITEM_STATUS_CLASS,
  ITEM_STATUS_TEXT,
  SCOPE_TITLES,
  type ReferralItemView,
  type ReferralViewResponse,
} from "@/lib/referral";

function groupByScope(items: ReferralItemView[]): [string, ReferralItemView[]][] {
  const groups = new Map<string, ReferralItemView[]>();
  for (const item of items) {
    const list = groups.get(item.scope) ?? [];
    list.push(item);
    groups.set(item.scope, list);
  }
  return [...groups.entries()];
}

export default function ReferralPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const [referral, setReferral] = useState<ReferralViewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    // Every open is logged for the patient, so fetch exactly once per visit.
    if (requested.current) return;
    requested.current = true;
    api<ReferralViewResponse>(`/referral/${encodeURIComponent(shareId)}`)
      .then(setReferral)
      .catch((e: Error) => {
        if (e instanceof ApiError) {
          if (e.status === 404 || e.status === 400) return setError("This referral link is not valid.");
          if (e.status === 429) return setError("Too many requests. Wait a minute and try again.");
          return setError(e.message);
        }
        setError("Something went wrong.");
      });
  }, [shareId]);

  if (error) {
    return (
      <div className="mx-auto max-w-[44ch] py-10 text-center">
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-mist">{error}</h1>
        <p className="mt-3 text-[14px] leading-[1.65] text-mist-dim">
          A referral is a snapshot with an expiry date, so this one may simply have run out. Ask the patient to
          share a current one, or look them up with their MedRekk code.
        </p>
        <Link
          href="/access"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-glow px-5 text-[15px] font-semibold text-glow-ink"
        >
          Look up a record
        </Link>
      </div>
    );
  }

  if (!referral) return <p className="text-[14px] text-mist-faint">Loading referral…</p>;

  const groups = groupByScope(referral.items);

  return (
    <div className="mx-auto max-w-[680px]">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-glow" />
        <span className="text-[12.5px] font-semibold text-mist-dim">Referral</span>
      </span>
      <h1 className="mt-5 font-display text-[34px] font-bold leading-[1.1] tracking-[-0.03em] text-mist">
        {referral.patient.name}
      </h1>
      <p className="mt-2 font-mono text-[13px] tracking-[0.14em] text-mist-dim">{referral.patient.medrekkCode}</p>

      <p className="mt-4 text-[14px] leading-[1.65] text-mist-dim">
        Issued by {referral.issuedBy.name}
        {referral.issuedBy.role === "PATIENT" ? " (the patient)" : " (health worker)"}
        {referral.originatingFacility ? `, ${referral.originatingFacility}` : ""}
        {referral.destinationFacility ? `, for ${referral.destinationFacility}` : ""}
      </p>

      <section className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-mist-faint">Reason for referral</h2>
        <p className="mt-2.5 text-[18px] font-semibold leading-[1.4] tracking-[-0.01em] text-mist">
          {referral.reason}
        </p>
        {referral.note ? (
          <p className="mt-2.5 text-[14px] leading-[1.65] text-mist-dim">{referral.note}</p>
        ) : null}
      </section>

      {groups.map(([scope, items]) => (
        <section key={scope} className="mt-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-mist-faint">
            {SCOPE_TITLES[scope] ?? scope}
          </h2>
          <ul className="mt-3 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07]">
            {items.map((item) => (
              <li key={item.claimId} className="flex flex-wrap items-center justify-between gap-3 bg-night px-4 py-3.5">
                <p className="text-[15px] font-semibold tracking-[-0.01em] text-mist">{item.value}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                    ITEM_STATUS_CLASS[item.status] ?? "bg-white/[0.07] text-mist-dim"
                  }`}
                >
                  {ITEM_STATUS_TEXT[item.status] ?? item.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] p-4">
        <p className="text-[14px] leading-[1.65] text-amber-100/90">
          This is only what the patient chose to attach — not their record. Anything marked self-reported has not
          been checked by a clinician.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href={`/access?code=${encodeURIComponent(referral.patient.medrekkCode)}`}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-glow px-5 text-[15px] font-semibold text-glow-ink transition-colors hover:bg-[#3ad3a0]"
        >
          Ask for more history
        </Link>
        <p className="mt-2.5 text-[13px] leading-[1.6] text-mist-faint">
          The patient is asked to approve exactly what you request, and for how long.
        </p>
      </div>

      <p className="mt-10 border-t border-white/[0.07] pt-5 text-[12.5px] leading-[1.7] text-mist-faint">
        Issued {new Date(referral.createdAt).toLocaleDateString()}. Expires{" "}
        {new Date(referral.expiresAt).toLocaleDateString()}. This view was logged and is visible to the patient.
      </p>
    </div>
  );
}

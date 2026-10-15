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
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{error}</h1>
        <p className="mt-3 text-sm text-gray-600">
          Ask the patient to show their current referral, or look them up with their MedRekk Code.
        </p>
        <Link href="/access" className="mt-6 inline-block text-emerald-800 underline">
          Access a record
        </Link>
      </main>
    );
  }

  if (!referral) return <p className="p-6 text-center text-gray-500">Loading referral…</p>;

  const groups = groupByScope(referral.items);

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800">Referral</p>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">{referral.patient.name}</h1>
      <p className="mt-1 text-sm text-gray-500">MedRekk Code {referral.patient.medrekkCode}</p>

      <p className="mt-3 text-sm text-gray-600">
        Issued by {referral.issuedBy.name}
        {referral.issuedBy.role === "PATIENT" ? " (the patient)" : " (health worker)"}
        {referral.originatingFacility ? `, ${referral.originatingFacility}` : ""}
        {referral.destinationFacility ? `, for ${referral.destinationFacility}` : ""}
      </p>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Reason for referral</h2>
        <p className="mt-2 text-lg font-medium text-gray-900">{referral.reason}</p>
        {referral.note ? <p className="mt-2 text-sm text-gray-700">{referral.note}</p> : null}
      </section>

      {groups.map(([scope, items]) => (
        <section key={scope} className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {SCOPE_TITLES[scope] ?? scope}
          </h2>
          <ul className="mt-2 space-y-2">
            {items.map((item) => (
              <li key={item.claimId} className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-base font-medium text-gray-900">{item.value}</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    ITEM_STATUS_CLASS[item.status] ?? "bg-gray-200 text-gray-700"
                  }`}
                >
                  {ITEM_STATUS_TEXT[item.status] ?? item.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-8 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
        This referral shows only what the patient chose to attach. It is not their full record. Information marked
        self-reported has not been checked by a clinician.
      </p>

      <div className="mt-6">
        <Link
          href={`/access?code=${encodeURIComponent(referral.patient.medrekkCode)}`}
          className="inline-block rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white"
        >
          Request more history
        </Link>
        <p className="mt-2 text-xs text-gray-500">
          The patient will be asked to approve exactly what you request, and for how long.
        </p>
      </div>

      <p className="mt-10 text-xs text-gray-400">
        Issued {new Date(referral.createdAt).toLocaleDateString()}. Expires{" "}
        {new Date(referral.expiresAt).toLocaleDateString()}. This view was logged and is visible to the patient.
      </p>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { STATUS_BADGE, STATUS_LABEL, type EmergencyProfileResponse } from "@/lib/types";

const DEFAULT_REASON = "Emergency QR/ID scan";

function Section({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-red-50 px-3 py-2 text-base font-medium text-red-900">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function EmergencyPage() {
  const { identifier } = useParams<{ identifier: string }>();
  const search = useSearchParams();
  const [profile, setProfile] = useState<EmergencyProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    // Every access is logged for the patient, so fetch exactly once per visit.
    if (requested.current) return;
    requested.current = true;
    const raw = search.get("reason")?.trim() ?? "";
    const reason = raw.length >= 3 ? raw : DEFAULT_REASON;
    api<EmergencyProfileResponse>(`/emergency/${encodeURIComponent(identifier)}?reason=${encodeURIComponent(reason)}`)
      .then(setProfile)
      .catch((e: unknown) => {
        if (e instanceof ApiError) {
          if (e.status === 404) return setError("No emergency profile was found for this code.");
          if (e.status === 429) return setError("Too many requests. Wait a minute and try again.");
          if (e.status === 400) return setError("That is not a valid MedRekk Code.");
          return setError(e.message);
        }
        setError("Something went wrong.");
      });
  }, [identifier, search]);

  if (error) {
    return (
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{error}</h1>
        <Link href="/emergency" className="mt-6 inline-block text-red-700 underline">
          Try another code
        </Link>
      </main>
    );
  }

  if (!profile) return <p className="p-6 text-center text-gray-500">Loading emergency profile…</p>;

  const hasAnything =
    profile.criticalAllergies.length +
      profile.criticalConditions.length +
      profile.criticalMedications.length +
      profile.implantedDevices.length +
      profile.importantWarnings.length >
      0 ||
    Boolean(profile.bloodGroup) ||
    Boolean(profile.emergencyContact);

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-red-700">Emergency profile</p>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">{profile.patientName}</h1>
      <p className="mt-1 text-sm text-gray-500">MedRekk Code {profile.emergencyId}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            STATUS_BADGE[profile.verificationStatus] ?? "bg-gray-200 text-gray-700"
          }`}
        >
          {STATUS_LABEL[profile.verificationStatus] ?? profile.verificationStatus}
        </span>
        {profile.lastConfirmedAt ? (
          <span className="text-xs text-gray-500">
            Last confirmed {new Date(profile.lastConfirmedAt).toLocaleDateString()}
          </span>
        ) : null}
      </div>

      {profile.verifiedByName && profile.verifiedAt ? (
        <p className="mt-2 text-sm text-gray-600">
          Reviewed by {profile.verifiedByName}
          {profile.verifiedByFacility ? `, ${profile.verifiedByFacility}` : ""} on{" "}
          {new Date(profile.verifiedAt).toLocaleDateString()}
        </p>
      ) : null}

      {profile.verificationStatus === "UNVERIFIED" || profile.verificationStatus === "SELF_REPORTED" ? (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          This information was entered by the patient and has not been clinically verified.
        </p>
      ) : null}

      {!hasAnything ? (
        <p className="mt-8 text-gray-600">The patient has not recorded any emergency information yet.</p>
      ) : null}

      {profile.bloodGroup ? (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Blood group</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">{profile.bloodGroup}</p>
        </section>
      ) : null}

      <Section title="Critical allergies" items={profile.criticalAllergies} />
      <Section title="Critical conditions" items={profile.criticalConditions} />
      <Section title="Critical medications" items={profile.criticalMedications} />
      <Section title="Implanted devices" items={profile.implantedDevices} />
      <Section title="Important warnings" items={profile.importantWarnings} />

      {profile.emergencyContact ? (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Emergency contact</h2>
          <p className="mt-2 text-base text-gray-900">
            {profile.emergencyContact.name} ({profile.emergencyContact.relationship})
          </p>
          <a href={`tel:${profile.emergencyContact.phone}`} className="text-lg font-semibold text-red-700 underline">
            {profile.emergencyContact.phone}
          </a>
        </section>
      ) : null}

      <p className="mt-10 text-xs text-gray-400">
        This access was logged at {new Date(profile.accessLoggedAt).toLocaleString()} and is visible to the patient.
      </p>
    </main>
  );
}

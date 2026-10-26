"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { AccessStatus, StatusResponse } from "@/lib/types";

const POLL_MS = 4000;

export default function PendingPage() {
  const router = useRouter();
  const { session } = useParams<{ session: string }>();
  const [status, setStatus] = useState<AccessStatus>("PENDING");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stopped = false;
    const tick = async () => {
      try {
        const res = await api<StatusResponse>(`/access/${session}/status`);
        if (stopped) return;
        setStatus(res.status);
        setError(null);
        if (res.status === "APPROVED") router.replace(`/access/${session}/record`);
      } catch (e) {
        if (stopped) return;
        if (e instanceof ApiError && e.status === 404) setError("This access session was not found.");
        else setError("Can't reach MedRekk. Retrying...");
      }
    };
    void tick();
    const id = setInterval(() => void tick(), POLL_MS);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [session, router]);

  const finished = status === "DENIED" || status === "EXPIRED";

  return (
    <div className="mx-auto max-w-[44ch] text-center">
      {status === "DENIED" ? (
        <>
          <h1 className="text-2xl font-bold text-mist">Access denied by patient</h1>
          <p className="mt-2 text-mist-dim">No medical information was shared.</p>
        </>
      ) : status === "EXPIRED" ? (
        <>
          <h1 className="text-2xl font-bold text-mist">This access session has expired</h1>
          <p className="mt-2 text-mist-dim">Start again to send a new request.</p>
        </>
      ) : status === "AWAITING_REQUEST" ? (
        <>
          <h1 className="text-2xl font-bold text-mist">No request sent yet</h1>
          <Link href={`/access/${session}`} className="mt-4 inline-block text-glow underline">
            Go back to the request form
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-mist">Access request sent</h1>
          <p className="mt-2 text-mist-dim">Waiting for the patient to approve on their phone. This page updates by itself.</p>
          <div className="mx-auto mt-8 h-8 w-8 animate-spin rounded-full border-4 border-white/[0.09] border-t-[#0F6E56]" />
        </>
      )}
      {error ? <p className="mt-6 text-sm text-rose-300">{error}</p> : null}
      {finished ? (
        <Link href="/access" className="mt-8 inline-block text-glow underline">
          Look up a record
        </Link>
      ) : null}
    </div>
  );
}

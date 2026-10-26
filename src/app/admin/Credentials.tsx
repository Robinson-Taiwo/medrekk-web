"use client";

import { useCallback, useEffect, useState } from "react";

import { api, ApiError } from "@/lib/api";
import { getAuth, type StoredAuth } from "@/lib/auth";
import { NightButton, NightLink, NightNotice } from "@/components/night";

type CredentialStatus = "PENDING" | "APPROVED";
type LicenceBody = "MDCN" | "NMCN" | "PCN" | "MLSCN" | "OTHER";

interface LicenceClaim {
  body: LicenceBody;
  number: string;
  profession: string;
  submittedAt: string;
  documentId: string | null;
}

interface HealthWorker {
  id: string;
  fullName: string;
  email: string;
  facility: string | null;
  credentialStatus: CredentialStatus;
  createdAt: string;
  licence?: LicenceClaim;
  hasDocument: boolean;
}

/**
 * Where to go and check the number. Nothing here is verified automatically — there is no
 * public interface to check a Nigerian registration against — so the one thing this page owes
 * the person approving is the register the number belongs to.
 */
const REGISTERS: Record<LicenceBody, { full: string; where: string }> = {
  MDCN: { full: "Medical and Dental Council of Nigeria", where: "mdcn.gov.ng" },
  NMCN: { full: "Nursing and Midwifery Council of Nigeria", where: "nmcn.gov.ng" },
  PCN: { full: "Pharmacists Council of Nigeria", where: "pcn.gov.ng" },
  MLSCN: { full: "Medical Laboratory Science Council of Nigeria", where: "mlscn.gov.ng" },
  OTHER: { full: "Another professional register", where: "ask them which" },
};

/**
 * Approving a credential, from a browser rather than from a terminal.
 *
 * The endpoints already existed; what did not was any way to reach them without composing a
 * bearer token by hand, which is a poor thing to depend on in front of an audience. There is
 * no separate admin account: whoever approves is an ordinary signed-in account whose email
 * the server lists in ADMIN_EMAILS, so this page reuses the health-worker sign-in.
 */
export default function Credentials() {
  const [auth, setAuthState] = useState<StoredAuth | null>(null);
  const [ready, setReady] = useState(false);
  const [workers, setWorkers] = useState<HealthWorker[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setWorkers(await api<HealthWorker[]>("/admin/health-workers", { auth: true }));
      setForbidden(false);
    } catch (e) {
      // 403 is not a fault to fix here: it means this account is simply not on the list.
      if (e instanceof ApiError && e.status === 403) setForbidden(true);
      else setError(e instanceof Error ? e.message : "Could not load health workers.");
    }
  }, []);

  useEffect(() => {
    const stored = getAuth();
    setAuthState(stored);
    setReady(true);
    if (stored) void load();
  }, [load]);

  const setStatus = async (worker: HealthWorker, status: CredentialStatus) => {
    setBusyId(worker.id);
    setError(null);
    try {
      const updated = await api<HealthWorker>(`/admin/health-workers/${worker.id}/credential`, {
        method: "POST",
        body: { status },
        auth: true,
      });
      setWorkers((prev) => prev?.map((w) => (w.id === updated.id ? updated : w)) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not change that credential.");
    } finally {
      setBusyId(null);
    }
  };

  if (!ready) return null;

  if (!auth) {
    return (
      <NightNotice title="Sign in first">
        Approving runs as you, not as a separate admin account.{" "}
        <NightLink href="/login" variant="ghost" className="mt-3 inline-flex">
          Sign in
        </NightLink>
      </NightNotice>
    );
  }

  if (forbidden) {
    return (
      <NightNotice tone="pending" title="This account cannot approve credentials">
        <p>
          You are signed in as{" "}
          <span className="font-mono text-mist">{auth.user.email ?? auth.user.fullName}</span>. The server
          compares exactly this address against <code className="font-mono">ADMIN_EMAILS</code>, a
          comma-separated list set where the backend runs, so it must appear there character for character.
        </p>
        <p className="mt-2">
          If you believe you added it: check that it is <em>this</em> address rather than another account of
          yours, that the value has no quotation marks around it, and that the backend has been restarted —
          the list is read once at start-up.
        </p>
        <p className="mt-2">
          With nothing in <code className="font-mono">ADMIN_EMAILS</code>, nobody can approve anyone, which is
          the usual reason a worker stays pending forever.
        </p>
      </NightNotice>
    );
  }

  const pending = workers?.filter((w) => w.credentialStatus === "PENDING") ?? [];
  const approved = workers?.filter((w) => w.credentialStatus === "APPROVED") ?? [];

  return (
    <div className="grid gap-6">
      {error ? <NightNotice tone="danger">{error}</NightNotice> : null}

      <Group
        heading="Waiting for approval"
        count={pending.length}
        empty="Nobody is waiting. A health worker appears here as soon as they create an account."
        workers={pending}
        busyId={busyId}
        action={(w) => (
          <NightButton disabled={busyId === w.id} onClick={() => void setStatus(w, "APPROVED")}>
            {busyId === w.id ? "Approving…" : "Approve"}
          </NightButton>
        )}
      />

      <Group
        heading="Approved"
        count={approved.length}
        empty="No approved health workers yet."
        workers={approved}
        busyId={busyId}
        action={(w) => (
          <NightButton
            variant="ghost"
            disabled={busyId === w.id}
            onClick={() => void setStatus(w, "PENDING")}>
            {busyId === w.id ? "Working…" : "Withdraw"}
          </NightButton>
        )}
      />

      <button
        type="button"
        onClick={() => void load()}
        className="justify-self-start text-[13px] text-mist-faint underline underline-offset-4 hover:text-mist">
        Refresh
      </button>
    </div>
  );
}

/**
 * What there is to check, and what there is not.
 *
 * A worker with no licence on file should not be approved on the strength of a name and a
 * free-text facility they typed themselves, so that case says so in as many words rather than
 * quietly showing an empty space next to an Approve button.
 */
function Licence({ worker }: { worker: HealthWorker }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const show = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const doc = await api<{ mime: string; base64: string }>(
        `/admin/health-workers/${worker.id}/licence`,
        { auth: true },
      );
      setImage(`data:${doc.mime};base64,${doc.base64}`);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  if (!worker.licence) {
    return (
      <p className="mt-3 border-t border-white/[0.07] pt-3 text-[13px] leading-[1.6] text-amber-300/80">
        No licence submitted. There is nothing here to check — ask them to add it in the app before approving.
      </p>
    );
  }

  const register = REGISTERS[worker.licence.body];

  return (
    <div className="mt-3 border-t border-white/[0.07] pt-3">
      <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-[130px_1fr]">
        <dt className="text-[12px] text-mist-faint">Register</dt>
        <dd className="text-[13px] text-mist-dim">
          {worker.licence.body} — {register.full}
        </dd>
        <dt className="text-[12px] text-mist-faint">Number</dt>
        <dd className="font-mono text-[14px] tracking-[0.04em] text-mist">{worker.licence.number}</dd>
        <dt className="text-[12px] text-mist-faint">Role given</dt>
        <dd className="text-[13px] text-mist-dim">{worker.licence.profession}</dd>
      </dl>

      <p className="mt-2.5 text-[12px] text-mist-faint">
        Check this number on the {worker.licence.body} register ({register.where}) before approving.
      </p>

      <div className="mt-3">
        {worker.hasDocument ? (
          image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={`Licence submitted by ${worker.fullName}`}
              className="max-h-[320px] rounded-lg border border-white/[0.09]"
            />
          ) : (
            <button
              type="button"
              onClick={() => void show()}
              disabled={loading}
              className="text-[13px] text-glow underline underline-offset-4 disabled:opacity-50">
              {loading ? "Opening…" : "View the licence photo"}
            </button>
          )
        ) : (
          <p className="text-[12px] text-mist-faint">No photograph was attached.</p>
        )}
        {failed ? <p className="mt-1 text-[12px] text-rose-300">Could not open that photo.</p> : null}
      </div>
    </div>
  );
}

function Group({
  heading,
  count,
  empty,
  workers,
  busyId,
  action,
}: {
  heading: string;
  count: number;
  empty: string;
  workers: HealthWorker[];
  busyId: string | null;
  action: (w: HealthWorker) => React.ReactNode;
}) {
  void busyId;
  return (
    <section>
      <div className="flex items-baseline gap-2">
        <h2 className="text-[15px] font-semibold text-mist">{heading}</h2>
        <span className="rounded-md bg-white/[0.07] px-1.5 py-[1px] text-[12px] tabular-nums text-mist-dim">
          {count}
        </span>
      </div>

      {workers.length === 0 ? (
        <p className="mt-3 text-[14px] leading-[1.6] text-mist-faint">{empty}</p>
      ) : (
        <ul className="mt-3 grid gap-2">
          {workers.map((w) => (
            <li
              key={w.id}
              className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-mist">{w.fullName}</p>
                  <p className="mt-0.5 truncate text-[13px] text-mist-faint">
                    {w.email}
                    {w.facility ? ` · ${w.facility}` : " · no facility given"}
                  </p>
                </div>
                {action(w)}
              </div>
              <Licence worker={w} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

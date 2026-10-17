import type { ReactNode } from "react";

/**
 * The app, shown on a handset.
 *
 * These are rendered rather than captured, so they stay sharp at any size and cannot drift
 * out of step with the design system. They are faithful to the real screens — same copy,
 * same hierarchy, same tokens — and are meant to be swapped for genuine captures later
 * without the surrounding layout changing.
 *
 * The screens are deliberately light while the pages around them are dark: the app is a
 * light product, and a lit device on a dark surface is what makes it read as a device.
 */

export function Phone({
  children,
  caption,
  className = "",
}: {
  children: ReactNode;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`w-[282px] shrink-0 ${className}`}>
      <div className="rounded-[2.1rem] border border-white/[0.14] bg-[#05100D] p-[6px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.95)]">
        <div className="overflow-hidden rounded-[1.75rem] bg-canvas">
          {/* Status bar */}
          <div className="flex items-center justify-between bg-canvas px-4 pb-1 pt-2.5">
            <span className="text-[10px] font-semibold text-ink">09:41</span>
            <span className="flex items-center gap-1">
              <Bars />
              <Battery />
            </span>
          </div>
          <div className="h-[520px] overflow-hidden">{children}</div>
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-4 text-center text-[13px] text-mist-faint">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function Bars() {
  return (
    <svg viewBox="0 0 16 10" className="h-2.5 w-4 text-ink" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 4} y={7 - i * 2.2} width="2.6" height={3 + i * 2.2} rx="0.7" fill="currentColor" />
      ))}
    </svg>
  );
}

function Battery() {
  return (
    <svg viewBox="0 0 24 10" className="h-2.5 w-5 text-ink" aria-hidden="true">
      <rect x="0.5" y="0.5" width="19" height="9" rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="2" y="2" width="13" height="6" rx="1.2" fill="currentColor" />
      <rect x="21" y="3.5" width="2" height="3" rx="1" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Small pieces shared by the screens
 * ------------------------------------------------------------------ */

function Pad({ children }: { children: ReactNode }) {
  return <div className="flex h-full flex-col gap-3 px-4 pb-4 pt-3">{children}</div>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">{children}</p>;
}

function Title({ children }: { children: ReactNode }) {
  return <p className="text-[19px] font-semibold leading-tight tracking-tight text-ink">{children}</p>;
}

function Meta({ children }: { children: ReactNode }) {
  return <p className="text-[11px] leading-[15px] text-muted">{children}</p>;
}

function Tile({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-surface ${className}`}>{children}</div>;
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-primary-soft text-[11px] font-semibold text-primary">
      {initials}
    </span>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`flex h-[18px] w-8 shrink-0 items-center rounded-full p-[2px] ${on ? "bg-primary" : "bg-dim"}`}>
      <span className={`h-[14px] w-[14px] rounded-full bg-white ${on ? "ml-auto" : ""}`} />
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Screens
 * ------------------------------------------------------------------ */

/** A request waiting on the patient — the moment the whole product turns on. */
export function AccessRequestScreen() {
  const scopes: [string, boolean][] = [
    ["Allergies", true],
    ["Medicines", true],
    ["Recent visits", true],
    ["Test results", false],
    ["Past conditions", false],
  ];

  return (
    <Pad>
      <div>
        <Eyebrow>Access</Eyebrow>
        <Title>A provider is asking</Title>
      </div>

      <Tile className="gap-2.5 p-3">
        <div className="flex items-center gap-2.5">
          <Avatar initials="AB" />
          <div className="flex-1">
            <p className="text-[13px] font-medium text-ink">Dr A. Bello</p>
            <Meta>Doctor · Ilorin General</Meta>
          </div>
        </div>
        <p className="mt-2.5 rounded-lg bg-fill px-2.5 py-2 text-[11px] leading-[16px] text-muted">
          &ldquo;Continuity of care — reviewing before prescribing.&rdquo;
        </p>
      </Tile>

      <div>
        <p className="mb-1.5 text-[11px] font-medium text-ink">What they would see</p>
        <Tile className="divide-y divide-line">
          {scopes.map(([label, on]) => (
            <div key={label} className="flex items-center gap-2.5 px-3 py-2">
              <span className={`flex-1 text-[12px] ${on ? "text-ink" : "text-muted"}`}>{label}</span>
              {on ? null : <span className="text-[10px] text-muted">not asked</span>}
              <Toggle on={on} />
            </div>
          ))}
        </Tile>
      </div>

      <div className="mt-auto grid gap-2">
        <p className="text-center text-[10px] text-muted">Ends by itself after 2 hours</p>
        <div className="flex gap-2">
          <span className="flex h-10 flex-1 items-center justify-center rounded-xl border border-line bg-surface text-[13px] font-medium text-ink">
            Decline
          </span>
          <span className="flex h-10 flex-[1.4] items-center justify-center rounded-xl bg-primary text-[13px] font-medium text-white">
            Approve for 2h
          </span>
        </div>
      </div>
    </Pad>
  );
}

/** One visit, and what came out of it. */
export function VisitScreen() {
  return (
    <Pad>
      <div>
        <Eyebrow>Visit</Eyebrow>
        <Title>12 October 2026</Title>
        <Meta>Recorded by Nurse Ada · Ilorin General</Meta>
      </div>

      <Tile className="p-3">
        <p className="text-[12px] font-semibold text-ink">What was said</p>
        <p className="mt-1.5 text-[11px] leading-[16px] text-muted">
          Patient reports an allergy to penicillin and a cough lasting three days.
        </p>
      </Tile>

      <div className="grid gap-2">
        {[
          { heading: "Allergies recorded", items: ["Penicillin"] },
          { heading: "Medicines recorded", items: ["Amoxicillin 500mg", "Paracetamol 1g"] },
        ].map((group) => (
          <div key={group.heading}>
            <p className="mb-1.5 text-[11px] font-medium text-ink">{group.heading}</p>
            <Tile className="divide-y divide-line">
              {group.items.map((item) => (
                <div key={item} className="flex items-center gap-2.5 px-3 py-2.5">
                  <span className="flex-1 text-[12px] text-ink">{item}</span>
                  <span className="rounded-full bg-neutral-soft px-2 py-0.5 text-[9px] font-medium text-muted">
                    Unverified
                  </span>
                </div>
              ))}
            </Tile>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-medium text-ink">What happens next</p>
        <Tile className="gap-2 p-3">
          {["Finish the full course", "Come back if the cough passes two weeks"].map((line) => (
            <div key={line} className="flex items-start gap-2">
              <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p className="text-[11px] leading-[16px] text-ink">{line}</p>
            </div>
          ))}
        </Tile>
      </div>

      <p className="mt-auto rounded-lg bg-fill px-2.5 py-2 text-[10px] leading-[14px] text-muted">
        Everything here starts unverified. A clinician confirming it is a separate step.
      </p>
    </Pad>
  );
}

/** The patient's own screen, with the passport card. */
export function HomeScreen() {
  return (
    <Pad>
      <div className="flex items-center justify-between">
        <div>
          <Meta>Good morning,</Meta>
          <p className="text-[18px] font-semibold tracking-tight text-ink">Amaka</p>
        </div>
        <Avatar initials="AO" />
      </div>

      <div className="rounded-2xl bg-ink p-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium text-white/70">Health passport</p>
          <span className="flex items-center gap-1 text-[10px] text-white/80">
            <span className="h-1 w-1 rounded-full bg-primary-soft" />
            Available offline
          </span>
        </div>
        <p className="mt-2.5 text-[10px] text-white/60">MedRekk code</p>
        <p className="font-mono text-[18px] font-semibold tracking-[0.15em] text-white">MR-4K7Q</p>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {[
            ["Blood", "O+"],
            ["Allergies", "1"],
            ["Conditions", "2"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-white/10 px-2 py-1.5">
              <p className="text-[9px] text-white/60">{label}</p>
              <p className="text-[13px] font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[12px] font-semibold text-ink">Who can see your record</p>
        <Tile className="items-center gap-1.5 px-4 py-5 text-center">
          <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-primary-soft">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" aria-hidden="true">
              <path
                d="M7 10V8a5 5 0 0 1 10 0v2M5 10h14v9H5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="mt-2 text-[12px] font-medium text-ink">Your record is private</p>
          <p className="mt-0.5 text-[10px] leading-[14px] text-muted">
            Nobody can see it. A request will appear here first.
          </p>
        </Tile>
      </div>
    </Pad>
  );
}

/** The health worker checking what the on-device model heard. */
export function WorkerReviewScreen() {
  const items: [string, string, boolean][] = [
    ["Allergies", "Penicillin", true],
    ["Medicines", "Amoxicillin 500mg", true],
    ["Recent visits", "Cough, three days", false],
    ["Past conditions", "Asthma", true],
  ];

  return (
    <Pad>
      <div>
        <Eyebrow>Review before saving</Eyebrow>
        <Title>Check each line</Title>
        <Meta>On-device model · 2.4s</Meta>
      </div>

      <div className="grid gap-2">
        {items.map(([category, value, confirmed]) => (
          <Tile key={value} className="p-2.5">
            <div className="flex items-start gap-2">
              <span
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                  confirmed ? "bg-primary" : "border border-dim"
                }`}
              >
                {confirmed ? (
                  <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 text-white" aria-hidden="true">
                    <path
                      d="M3 8.5l3.2 3.2L13 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : null}
              </span>
              <div className="flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
                  {category}
                </p>
                <p className="mt-0.5 text-[12px] text-ink">{value}</p>
              </div>
            </div>
          </Tile>
        ))}
      </div>

      <div className="mt-auto grid gap-2">
        <div className="flex items-start gap-2 rounded-lg bg-fill px-2.5 py-2">
          <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
          <p className="text-[10px] leading-[14px] text-muted">
            Saved on this phone. Sent on its own when there is a signal.
          </p>
        </div>
        <span className="flex h-10 items-center justify-center rounded-xl bg-primary text-[13px] font-medium text-white">
          Save to record
        </span>
      </div>
    </Pad>
  );
}

/** What a responder sees with no PIN and no account. */
export function EmergencyScreen() {
  return (
    <Pad>
      <div>
        <Eyebrow>Emergency card</Eyebrow>
        <Title>Amaka Okafor</Title>
        <Meta>MR-4K7Q · read without approval</Meta>
      </div>

      <Tile className="p-3.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">Blood group</p>
        <p className="text-[30px] font-semibold leading-none tracking-tight text-ink">O+</p>
      </Tile>

      <div>
        <p className="mb-1.5 text-[11px] font-medium text-danger">Allergies</p>
        <div className="rounded-xl border border-danger-soft bg-danger-soft px-3 py-2.5">
          <p className="text-[14px] font-semibold text-ink">Penicillin</p>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-medium text-ink">Conditions</p>
        <Tile className="divide-y divide-line">
          {["Asthma", "Type 2 diabetes"].map((item) => (
            <p key={item} className="px-3 py-2 text-[12px] text-ink">
              {item}
            </p>
          ))}
        </Tile>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-medium text-ink">In an emergency, call</p>
        <Tile className="flex items-center gap-2.5 p-3">
          <Avatar initials="CO" />
          <div className="flex-1">
            <p className="text-[12px] font-medium text-ink">Chidi Okafor</p>
            <Meta>Brother · 0803 123 4567</Meta>
          </div>
        </Tile>
      </div>

      <p className="mt-auto rounded-lg bg-fill px-2.5 py-2 text-[10px] leading-[14px] text-muted">
        This view was added to the patient&apos;s access log.
      </p>
    </Pad>
  );
}

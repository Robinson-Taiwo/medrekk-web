import type { ReactNode } from "react";

/**
 * The pictures that carry the story.
 *
 * These are built from the same tokens and the same card the product uses, not drawn as
 * decoration. A visitor sees the real thing moving through its real states, which is both
 * more convincing than a paragraph and impossible to get subtly wrong the way an illustration
 * of a screen can.
 */

const CYCLE = "9s";

/**
 * Cross-fades its children on one shared timeline. Every frame runs the same keyframes over
 * the whole cycle and is offset into its own slot by a negative delay, so they can never
 * drift out of step with each other however long the page is left open.
 *
 * Under reduced motion the later frames are hidden outright by the .medrekk-seq rule in
 * globals.css, leaving the first one as a still. Letting the global "finish every animation
 * instantly" rule apply here would have parked all three on their closing keyframe, which is
 * opacity 0 — an empty box where the picture should be.
 */
export function Sequence({ frames, className = "" }: { frames: ReactNode[]; className?: string }) {
  return (
    <div className={`medrekk-seq grid ${className}`} aria-hidden="true">
      {/* Every frame occupies the same grid cell, so the box is as tall as the tallest one.
          Absolute positioning sized it to the first frame and let the others hang out of it. */}
      {frames.map((frame, index) => (
        <div
          key={index}
          className="[grid-area:1/1]"
          style={{
            animation: `medrekk-frame ${CYCLE} linear infinite`,
            animationDelay: `calc(${CYCLE} * -${index} / ${frames.length})`,
          }}
        >
          {frame}
        </div>
      ))}
    </div>
  );
}

/** The dark passport card, the one object the whole product is about. */
function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[20px] bg-ink p-5 shadow-[0_20px_50px_-28px_rgba(20,45,42,0.6)]">
      {children}
    </div>
  );
}

function CardHead({ right }: { right: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium text-white/70">Health passport</p>
      {right}
    </div>
  );
}

function CardIdentity() {
  return (
    <div className="mt-4">
      <p className="text-xs text-white/60">MedRekk code</p>
      <p className="mt-1 font-mono text-[22px] font-semibold tracking-[0.18em] text-white">
        MR-4K7Q
      </p>
    </div>
  );
}

function Pill({ tone, children }: { tone: "quiet" | "live" | "warn"; children: ReactNode }) {
  const skin = {
    quiet: "bg-white/10 text-white/75",
    live: "bg-primary-soft text-ink",
    warn: "bg-warn-soft text-ink",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${skin}`}>
      {children}
    </span>
  );
}

function Dot({ className }: { className: string }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${className}`} />;
}

/**
 * Nobody has access, somebody asks, the patient agrees and the clock starts running.
 * The last frame is the point: access that ends by itself needs no one to remember it.
 */
/** The three stats stay put across every frame, so the card reads as one object. */
function CardStats() {
  return (
    <dl className="mt-4 grid grid-cols-3 gap-2">
      {[
        ["Blood group", "O+"],
        ["Allergies", "1"],
        ["Conditions", "2"],
      ].map(([label, value]) => (
        <div key={label} className="rounded-[10px] bg-white/10 px-2.5 py-2">
          <dt className="text-[11px] text-white/60">{label}</dt>
          <dd className="text-base font-semibold text-white">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function LifecycleFrame({ badge, children }: { badge: ReactNode; children: ReactNode }) {
  return (
    <Card>
      <CardHead right={badge} />
      <CardIdentity />
      <CardStats />
      <div className="mt-3">{children}</div>
    </Card>
  );
}

/**
 * Nobody has access, somebody asks, the patient agrees and the clock starts running.
 * The last frame is the point: access that ends by itself needs no one to remember it.
 */
export function AccessLifecycle() {
  return (
    <Sequence
      className="w-full max-w-[360px]"
      frames={[
        <LifecycleFrame
          key="locked"
          badge={
            <Pill tone="quiet">
              <Dot className="bg-white/50" />
              Private
            </Pill>
          }
        >
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
            <p className="text-[13px] leading-[19px] text-white/80">Nobody can see this record.</p>
          </div>
        </LifecycleFrame>,

        <LifecycleFrame key="asking" badge={<Pill tone="warn">Asking</Pill>}>
          <div className="rounded-xl border border-white/15 bg-white/[0.08] p-3">
            <p className="text-[13px] font-medium text-white">Dr A. Bello</p>
            <p className="mt-0.5 text-[12px] text-white/60">Ilorin General · allergies, medicines</p>
            <div className="mt-2.5 flex gap-2">
              <span className="flex-1 rounded-lg bg-primary py-1.5 text-center text-[12px] font-medium text-white">
                Approve
              </span>
              <span className="flex-1 rounded-lg border border-white/20 py-1.5 text-center text-[12px] font-medium text-white/80">
                Decline
              </span>
            </div>
          </div>
        </LifecycleFrame>,

        <LifecycleFrame
          key="granted"
          badge={
            <Pill tone="live">
              <Dot className="bg-primary" />
              Shared
            </Pill>
          }
        >
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-[13px] text-white/80">Dr A. Bello</p>
              <p className="font-mono text-[13px] text-primary-soft">2h 40m</p>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full origin-left rounded-full bg-primary-soft"
                style={{ animation: `medrekk-drain ${CYCLE} linear infinite` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-white/50">Ends on its own. No one has to remember.</p>
          </div>
        </LifecycleFrame>,
      ]}
    />
  );
}

/**
 * The offline claim, shown rather than asserted: the visit is written on the handset while
 * there is no signal, waits, and goes on its own when the signal returns.
 */
export function OfflineCapture() {
  const shell =
    "rounded-[20px] border border-line bg-surface p-5 shadow-[0_18px_40px_-30px_rgba(20,45,42,0.45)]";

  return (
    <Sequence
      className="w-full max-w-[360px]"
      frames={[
        <div key="capture" className={shell}>
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">Recording a visit</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-[11px] font-medium text-danger">
              No signal
            </span>
          </div>
          <div className="mt-3.5 rounded-xl bg-fill p-3">
            <p className="text-[13px] leading-[19px] text-ink">
              &ldquo;Allergic to penicillin. Coughing three days.&rdquo;
            </p>
          </div>
          <p className="mt-3 text-[12px] leading-[17px] text-muted">
            Understood on the handset. Nothing is sent anywhere to read it.
          </p>
        </div>,

        <div key="queued" className={shell}>
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">Saved on this phone</p>
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-2.5 py-1 text-[11px] font-medium text-ink"
              style={{ animation: `medrekk-pulse 1.8s ease-in-out infinite` }}
            >
              1 waiting
            </span>
          </div>
          <div className="mt-3.5 grid gap-2">
            {["Penicillin allergy", "Cough, three days"].map((line) => (
              <div key={line} className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-warn" />
                <p className="text-[13px] text-ink">{line}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-[17px] text-muted">
            The worker can close the app. It is already safe.
          </p>
        </div>,

        <div key="sent" className={shell}>
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink">Sent to the record</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-ink">
              <Dot className="bg-primary" />
              Back online
            </span>
          </div>
          <div className="mt-3.5 grid gap-2">
            {["Penicillin allergy", "Cough, three days"].map((line) => (
              <div
                key={line}
                className="flex items-center gap-2.5 rounded-xl border border-primary-soft bg-primary-soft/40 px-3 py-2.5"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true">
                  <path
                    d="M3 8.5l3.2 3.2L13 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-[13px] text-ink">{line}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-[17px] text-muted">
            Sent by itself. Nobody had to remember to sync.
          </p>
        </div>,
      ]}
    />
  );
}

/** Distinct marks for the three pillars — the logo is not an icon. */
export function PillarIcon({ name }: { name: "offline" | "approval" | "log" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true">
      {name === "offline" ? (
        <>
          <path d="M2.5 8.5a15 15 0 0 1 19 0" {...common} />
          <path d="M6 12a10 10 0 0 1 12 0" {...common} />
          <path d="M9.5 15.5a5 5 0 0 1 5 0" {...common} />
          <circle cx="12" cy="19" r="0.9" fill="currentColor" />
          <path d="M3 3l18 18" {...common} />
        </>
      ) : name === "approval" ? (
        <>
          <path d="M12 3l7 3v5.5c0 4.3-2.9 7.6-7 8.5-4.1-.9-7-4.2-7-8.5V6l7-3z" {...common} />
          <path d="M9 12l2.2 2.2L15.5 10" {...common} />
        </>
      ) : (
        <>
          <path d="M5 4.5h14v15l-3.5-2-3.5 2-3.5-2-3.5 2z" {...common} />
          <path d="M8.5 9h7M8.5 13h4" {...common} />
        </>
      )}
    </svg>
  );
}

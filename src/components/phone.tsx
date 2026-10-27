import type { ReactNode } from "react";

/**
 * The app, shown on a handset.
 *
 * Rendered rather than captured, so they stay sharp at any size and cannot drift out of step
 * with the design system.
 *
 * They follow the app's Split layout: a dark band of chrome at the top carrying identity and
 * state, a bright sheet of content lifted over it on a rounded top edge, and a floating tab bar
 * at the bottom whose open tab rises out of the bar rather than lighting up. These were a flat
 * light screen with a plain header, which is what the app looked like several revisions ago —
 * a site showing a product that no longer exists is worse than one showing no product at all.
 */

/** The dark band at the top: who this is, and what state it is in. */
function Chrome({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="bg-night px-4 pb-5 pt-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[17px] font-semibold tracking-[-0.01em] text-mist">{title}</p>
          {sub ? <p className="mt-0.5 truncate text-[11.5px] text-mist-faint">{sub}</p> : null}
        </div>
        {right}
      </div>
    </div>
  );
}

/** A tag on the chrome: the one piece of state worth carrying in the frame. */
function ChromeTag({ label, tone = "ok" }: { label: string; tone?: "ok" | "warn" }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.06] px-2 py-1 text-[10px] font-medium text-mist-dim">
      <span className={`h-1.5 w-1.5 rounded-full ${tone === "warn" ? "bg-[#F5B544]" : "bg-glow"}`} />
      {label}
    </span>
  );
}

/** The bright content, lifted over the chrome on a rounded top edge. */
function Sheet({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`-mt-3 flex-1 overflow-hidden rounded-t-[22px] bg-canvas ${className}`}>{children}</div>
  );
}

const TABS: { label: string; icon: ReactNode }[] = [
  { label: "Home", icon: <path d="M3 9l7-6 7 6v8a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1z" /> },
  { label: "Record", icon: <path d="M5 2h6l4 4v12H5z M11 2v4h4" /> },
  { label: "Emergency", icon: <><circle cx="10" cy="10" r="7.5" /><path d="M10 6v5M10 14h.01" /></> },
  { label: "Access", icon: <path d="M10 2l6 2.5v5c0 4-2.6 7-6 8.5-3.4-1.5-6-4.5-6-8.5v-5z" /> },
  { label: "Profile", icon: <><circle cx="10" cy="7" r="3" /><path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" /></> },
];

/**
 * The floating bar. The open tab rises out of it rather than lighting up — a green pill behind
 * the icon put a second colour into a bar that uses colour for one thing only.
 */
function TabBar({ active }: { active: number }) {
  return (
    <div className="bg-night px-2 pb-3 pt-1.5">
      <div className="flex items-center justify-around rounded-[16px] border border-white/[0.08] bg-white/[0.045] px-1 pb-1.5 pt-2.5">
        {TABS.map((tab, i) => {
          const on = i === active;
          return (
            <span key={tab.label} className="flex flex-1 flex-col items-center gap-[2px]">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full ${
                  on ? "-mt-[11px] border border-white/[0.10] bg-[#1B302A]" : ""
                }`}
              >
                <svg
                  viewBox="0 0 20 20"
                  className={`h-[14px] w-[14px] ${on ? "text-glow" : "text-mist-faint"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {tab.icon}
                </svg>
              </span>
              <span className={`text-[8px] ${on ? "font-semibold text-mist" : "text-mist-faint"}`}>
                {tab.label}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

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
        <div className="overflow-hidden rounded-[1.75rem] bg-night">
          {/* The status bar sits on the dark chrome now, so its glyphs are light. */}
          <div className="flex items-center justify-between bg-night px-4 pb-1 pt-2.5">
            <span className="text-[10px] font-semibold text-mist">09:41</span>
            <span className="flex items-center gap-1">
              <Bars />
              <Battery />
            </span>
          </div>
          <div className="flex h-[520px] flex-col overflow-hidden">{children}</div>
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
    <svg viewBox="0 0 16 10" className="h-2.5 w-4 text-mist" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 4} y={7 - i * 2.2} width="2.6" height={3 + i * 2.2} rx="0.7" fill="currentColor" />
      ))}
    </svg>
  );
}

function Battery() {
  return (
    <svg viewBox="0 0 24 10" className="h-2.5 w-5 text-mist" aria-hidden="true">
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
  return (
    <>
      <Chrome title="Access" sub="Requests and live grants" right={<ChromeTag label="1 waiting" />} />
      <Sheet className="px-4 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-primary">
          Waiting for you
        </span>
        <p className="mt-2.5 text-[14px] font-semibold leading-[18px] text-ink">
          Dr A. Bello wants to read your record
        </p>
        <p className="mt-1 text-[10.5px] text-muted">Ilorin General Hospital · antenatal visit</p>

        {/* Each area on its own line with its own switch: approving less than was asked is
            the point, and a single "allow" button would quietly remove it. */}
        <div className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {[
            ["Allergies", true],
            ["Medicines", true],
            ["Test results", true],
            ["Past conditions", false],
          ].map(([label, on]) => (
            <div key={String(label)} className="flex items-center justify-between px-3 py-2.5">
              <span className="text-[11.5px] text-ink">{label}</span>
              <Toggle on={Boolean(on)} />
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-fill px-3 py-2.5">
          <span className="text-[10.5px] text-muted">Ends automatically after</span>
          <span className="text-[11.5px] font-semibold text-ink">3 hours</span>
        </div>

        <div className="mt-3 flex gap-2">
          <span className="flex h-9 flex-1 items-center justify-center rounded-xl border border-line bg-surface text-[11.5px] font-medium text-ink">
            Decline
          </span>
          <span className="flex h-9 flex-1 items-center justify-center rounded-xl bg-primary text-[11.5px] font-semibold text-white">
            Approve 3 areas
          </span>
        </div>
      </Sheet>
      <TabBar active={3} />
    </>
  );
}

export function VisitScreen() {
  return (
    <>
      <Chrome title="Visit" sub="Ilorin General · 12 Oct" right={<ChromeTag label="Reviewed" />} />
      <Sheet className="px-4 pt-4">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 20 20" className="h-3 w-3 text-primary" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M17 9.5a6.5 6.5 0 01-9.3 5.9L3 17l1.6-4.7A6.5 6.5 0 1117 9.5z" />
          </svg>
          <p className="text-[11px] font-semibold text-ink">In plain words</p>
        </div>

        {/*
          The feature the app is actually for, so it is what the mock shows: a prescription
          rewritten into a sentence, with the shorthand decoded rather than defined.
        */}
        <div className="mt-2 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {[
            {
              icon: "pill",
              text: "Ciprofloxacin (written here as Ciprotab) — an antibiotic. Take 500mg, twice a day, for 4 days.",
            },
            {
              icon: "alert",
              text: "You are recorded as allergic to penicillin — the note says it causes a mild skin rash.",
            },
          ].map((line) => (
            <div key={line.text} className="flex gap-2.5 px-3 py-2.5">
              <span className="mt-[1px] grid h-5 w-5 shrink-0 place-items-center rounded-md bg-primary-soft">
                <svg viewBox="0 0 20 20" className="h-2.5 w-2.5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {line.icon === "pill" ? (
                    <><rect x="3" y="7" width="14" height="6" rx="3" /><path d="M10 7v6" /></>
                  ) : (
                    <><circle cx="10" cy="10" r="7" /><path d="M10 6.5v4M10 13.5h.01" /></>
                  )}
                </svg>
              </span>
              <p className="text-[10.5px] leading-[15px] text-ink">{line.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-2 text-[9px] leading-[12px] text-muted">
          MedRekk rewrote this from the note below. It explains what was written down — it is not advice.
        </p>

        <p className="mt-3.5 text-[10.5px] font-medium text-primary">Show the original note</p>

        <div className="mt-3 rounded-xl border border-line bg-surface p-3">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted">Recorded here</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[["1", "allergy"], ["1", "medicine"]].map(([n, noun]) => (
              <span key={noun} className="rounded-lg bg-fill px-2 py-1 text-[10px] text-ink">
                <span className="font-semibold">{n}</span> {noun}
              </span>
            ))}
          </div>
        </div>
      </Sheet>
      <TabBar active={1} />
    </>
  );
}

export function HomeScreen() {
  return (
    <>
      <Chrome
        title="Good morning, Amaka"
        sub="MedRekk code · MR-4K7Q"
        right={<ChromeTag label="Offline" tone="warn" />}
      />
      {/* The passport lives in the chrome: it is who you are, not an item in your record. */}
      <div className="flex gap-1.5 bg-night px-4 pb-4">
        {[
          ["Blood group", "O+"],
          ["Allergies", "1"],
          ["Conditions", "2"],
        ].map(([label, value]) => (
          <div key={label} className="flex-1 rounded-lg bg-white/[0.07] px-2 py-1.5">
            <p className="text-[8.5px] text-mist-faint">{label}</p>
            <p className="text-[13px] font-semibold text-mist">{value}</p>
          </div>
        ))}
      </div>

      <Sheet className="px-4 pt-4">
        <p className="text-[11.5px] font-semibold text-ink">Who can see your record</p>
        <div className="mt-2 rounded-xl border border-line bg-surface px-4 py-4 text-center">
          <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-primary-soft">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-primary" aria-hidden="true">
              <path d="M7 10V8a5 5 0 0 1 10 0v2M5 10h14v9H5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="mt-2 text-[11.5px] font-medium text-ink">Your record is private</p>
          <p className="mt-0.5 text-[9.5px] leading-[13px] text-muted">
            Nobody can see it. A request arrives here first.
          </p>
        </div>

        <p className="mt-4 text-[11.5px] font-semibold text-ink">Your record</p>
        <div className="mt-2 rounded-xl border border-line bg-surface p-3">
          {/* Counts, never values: this is the screen most likely to be read over a shoulder. */}
          <div className="flex flex-wrap gap-1.5">
            {[["1", "allergy"], ["2", "medicines"], ["3", "results"], ["4", "visits"]].map(([n, noun]) => (
              <span key={noun} className="rounded-lg bg-fill px-2 py-1 text-[10px] text-ink">
                <span className="font-semibold">{n}</span> {noun}
              </span>
            ))}
          </div>
          <p className="mt-2.5 text-[9.5px] text-muted">Only you can see this until you approve a request.</p>
        </div>
      </Sheet>

      <TabBar active={0} />
    </>
  );
}

export function WorkerReviewScreen() {
  const items: [string, string, boolean][] = [
    ["Allergies", "Penicillin", true],
    ["Medicines", "Amoxicillin 500mg", true],
    ["Recent visits", "Cough, three days", false],
    ["Past conditions", "Asthma", true],
  ];

  return (
    <>
      <Chrome title="Check each line" sub="Read on this phone · 2.4s" right={<ChromeTag label="Draft" tone="warn" />} />
      <Sheet>
      <Pad>

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
      </Sheet>
      <TabBar active={2} />
    </>
  );
}

/** What a responder sees with no PIN and no account. */
export function EmergencyScreen() {
  return (
    <>
      {/* The identity moves into the chrome, which is where the app puts it — and is why the
          eyebrow above the title is gone rather than restyled. */}
      <Chrome title="Amaka Okafor" sub="MR-4K7Q · readable without approval" right={<ChromeTag label="O+" />} />
      <Sheet>
      <Pad>

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
      </Sheet>
      <TabBar active={2} />
    </>
  );
}

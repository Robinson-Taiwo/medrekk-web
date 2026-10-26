"use client";

import { useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
// The sandbox channel. Override per environment when a production code is assigned.
const SERVICE_CODE = process.env.NEXT_PUBLIC_USSD_CODE ?? "*384*74161#";

type Phase = "IDLE" | "OPEN" | "CLOSED";

interface Exchange {
  sent: string;
  got: string;
  ended: boolean;
}

/** The first step of a session is the PIN. This screen may be on a projector. */
function maskSteps(steps: string[]): string {
  if (steps.length === 0) return "";
  const [pin, ...rest] = steps;
  return ["•".repeat(pin!.length), ...rest].join("*");
}

export default function Simulator() {
  const [msisdn, setMsisdn] = useState("");
  const [entry, setEntry] = useState(SERVICE_CODE);
  const [steps, setSteps] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [screen, setScreen] = useState<string>(
    "Enter the number this handset dials from, then press the green key.",
  );
  const [log, setLog] = useState<Exchange[]>([]);
  const [busy, setBusy] = useState(false);
  const session = useRef<string>("");

  const post = async (nextSteps: string[]) => {
    if (!API_URL) {
      setScreen("NEXT_PUBLIC_API_URL is not set, so there is no backend to dial.");
      return;
    }
    setBusy(true);
    const text = nextSteps.join("*");
    try {
      // Form-encoded, exactly as an aggregator posts it. Keeps the simulator on the
      // same code path a real dialled session takes.
      const res = await fetch(`${API_URL}/ussd`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          sessionId: session.current,
          phoneNumber: msisdn.trim(),
          serviceCode: SERVICE_CODE,
          text,
        }),
      });
      const body = (await res.text()).trim();
      const ended = body.startsWith("END");
      const message = body.replace(/^(CON|END)\s*/, "");

      setScreen(message || "The service sent an empty reply.");
      setPhase(ended ? "CLOSED" : "OPEN");
      setSteps(nextSteps);
      setEntry("");
      setLog((prev) => [...prev, { sent: maskSteps(nextSteps), got: body, ended }]);
    } catch {
      setScreen("Could not reach the service. Check the connection and dial again.");
      setPhase("CLOSED");
    } finally {
      setBusy(false);
    }
  };

  const press = (key: string) => {
    if (phase === "CLOSED") return;
    setEntry((prev) => (prev.length >= 20 ? prev : prev + key));
  };

  const green = () => {
    if (busy) return;
    if (phase === "IDLE") {
      if (msisdn.trim().length < 7) {
        setScreen("Enter the number this handset dials from first.");
        return;
      }
      session.current = `sim_${Math.random().toString(36).slice(2, 10)}`;
      setLog([]);
      void post([]);
      return;
    }
    if (phase === "OPEN") {
      if (entry.length === 0) return;
      void post([...steps, entry]);
    }
  };

  const red = () => {
    session.current = "";
    setSteps([]);
    setEntry(SERVICE_CODE);
    setPhase("IDLE");
    setBusy(false);
    setScreen("Call ended. Press the green key to dial again.");
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  return (
    <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-14">
      {/* ---- The handset ---- */}
      <div>
        <label className="block text-[13px] font-semibold text-mist" htmlFor="msisdn">
          This handset&apos;s number
        </label>
        <input
          id="msisdn"
          value={msisdn}
          onChange={(e) => setMsisdn(e.target.value)}
          disabled={phase !== "IDLE"}
          placeholder="08031234567"
          inputMode="tel"
          className="mt-2 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-3.5 py-2.5 text-[15px] text-mist placeholder:text-mist-faint/70 focus:border-glow/40 focus:outline-none disabled:opacity-50"
        />
        <p className="mt-2 text-[12.5px] leading-[1.6] text-mist-faint">
          The number must already be on a MedRekk account, with a PIN set in the app.
        </p>

        {/* The handset keeps its own colours. It is a physical object being depicted, not a
            piece of site chrome, and a grey-green Nokia on a dark page reads better than it
            ever did on a grey one. */}
        <div className="mt-5 rounded-[28px] p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]" style={{ background: "#2A2E2B" }}>
              {/* LCD */}
              <div
                className="rounded-[6px] px-3 py-3 font-mono text-[13px] leading-[1.45]"
                style={{
                  background: "#9FB89A",
                  color: "#1B2A1C",
                  minHeight: "9.5rem",
                  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.35)",
                }}
                role="status"
                aria-live="polite"
              >
                <pre className="whitespace-pre-wrap break-words font-mono">
                  {busy ? "Sending…" : screen}
                </pre>
              </div>

              {/* Entry line */}
              <div
                className="mt-3 rounded-[4px] px-3 py-2 font-mono text-[15px] tracking-widest"
                style={{ background: "#7E9479", color: "#15210F", minHeight: "2.25rem" }}
                aria-label="Keypad entry"
              >
                {phase === "OPEN" && steps.length === 0 ? "•".repeat(entry.length) : entry}
              </div>

              {/* Keypad */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {keys.map((key) => (
                  <button
                    key={key}
                    onClick={() => press(key)}
                    disabled={phase === "CLOSED"}
                    className="rounded-[8px] py-2.5 font-mono text-lg text-gray-100 transition-[filter] duration-75 active:brightness-75 disabled:opacity-40 motion-reduce:transition-none"
                    style={{ background: "#3C423D" }}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={green}
                  disabled={busy}
                  className="rounded-[8px] py-2.5 text-sm font-semibold text-white transition-[filter] duration-75 active:brightness-75 disabled:opacity-50 motion-reduce:transition-none"
                  style={{ background: "#1F7A3D" }}
                >
                  {phase === "IDLE" ? "Dial" : "Send"}
                </button>
                <button
                  onClick={red}
                  className="rounded-[8px] py-2.5 text-sm font-semibold text-white transition-[filter] duration-75 active:brightness-75 motion-reduce:transition-none"
                  style={{ background: "#9B2C2C" }}
                >
                  End
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-gray-400">
                <span>{SERVICE_CODE}</span>
                <span>
                  {phase === "IDLE" ? "idle" : phase === "OPEN" ? "session open" : "session closed"}
                </span>
              </div>
            </div>
          </div>

      {/* ---- Session transcript ---- */}
      <div>
        <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-mist">Session</h2>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-[1.65] text-mist-dim">
          Every line below is one POST to <span className="font-mono text-mist">/ussd</span>. The{" "}
          <span className="font-mono text-mist">text</span> field accumulates what has been typed so far,
          separated by asterisks — that is how USSD carries a session. Your PIN is hidden here, since this screen
          may be on a projector.
        </p>

        {log.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/[0.12] p-8 text-center">
            <p className="text-[14px] font-medium text-mist">Nothing dialled yet</p>
            <p className="mx-auto mt-1.5 max-w-[34ch] text-[13px] leading-[1.6] text-mist-faint">
              Put a number in, press Dial, and every request and reply appears here as it happens.
            </p>
          </div>
        ) : (
          <ol className="mt-5 space-y-4">
            {log.map((entryLog, index) => (
              <li key={index} className="border-l-2 border-white/[0.12] pl-4">
                <p className="font-mono text-[11.5px] text-mist-faint">
                  text={entryLog.sent === "" ? "(empty)" : entryLog.sent}
                </p>
                <pre
                  className={`mt-1.5 whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed ${
                    entryLog.ended ? "text-rose-300" : "text-mist"
                  }`}
                >
                  {entryLog.got}
                </pre>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-10 max-w-[62ch] border-t border-white/[0.08] pt-6 text-[14px] leading-[1.7] text-mist-dim">
          <h3 className="text-[15px] font-semibold text-mist">What a dialled session can read</h3>
          <p className="mt-2.5">
                Only the emergency card and the MedRekk Code. Text sent over a dialled code crosses the mobile
                network unencrypted, and whoever stands near the handset can read the screen, so the full record
                stays behind the patient&apos;s approval in the app. Five wrong PINs lock dialling for fifteen
                minutes, and every read is written to the patient&apos;s access log.
              </p>
          <p className="mt-3.5">
            A short code on a live Nigerian network is a commercial and regulatory step, not an engineering one.
            This simulator and the service behind it are the engineering.
          </p>
        </div>
      </div>
    </div>
  );
}

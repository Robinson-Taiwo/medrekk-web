import { NightFooter, NightHeader } from "@/components/night-chrome";
import { Aura, Body, Display, NightShell, Wrap } from "@/components/night";
import { Reveal } from "@/components/reveal";
import EmergencyLookupForm from "./EmergencyLookupForm";

export const metadata = {
  title: "Emergency access",
  description:
    "Read a patient's emergency card without their approval, when they cannot give it. Limited to what they chose to put there, and always logged.",
};

/**
 * The one door that opens without the patient's consent, so it says so plainly rather than
 * looking like every other form on the site. What is behind it is narrow by design: only what
 * the patient deliberately put on their emergency card, never their record.
 */
const FACTS = [
  { k: "What you will see", v: "Blood group, severe allergies, critical conditions and a contact — only what the patient chose to put there." },
  { k: "What you will not", v: "Their record. Visits, medicines, results and notes stay closed without their approval." },
  { k: "Who finds out", v: "The patient. It appears in their access log with the time and the reason you give." },
];

export default function EmergencyLookupPage() {
  return (
    <NightShell>
      <NightHeader />

      <main className="relative flex-1">
        <Aura className="left-1/2 top-[-8rem] h-[24rem] w-[36rem] -translate-x-1/2 opacity-30" />
        <Wrap className="relative py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
            <div>
              <Reveal>
                {/* Deliberately not the same green chip every other page opens with. */}
                <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-400/[0.08] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  <span className="text-[12.5px] font-semibold tracking-[0.02em] text-rose-200">
                    Emergency use only
                  </span>
                </span>
                <Display className="mt-5 max-w-[15ch]">When they cannot answer for themselves.</Display>
                <Body className="mt-5 max-w-[52ch]">
                  Everywhere else on MedRekk, the patient decides. This is the exception — and it is narrow on
                  purpose, and never quiet.
                </Body>
              </Reveal>

              <Reveal>
                <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07]">
                  {FACTS.map((f) => (
                    <div key={f.k} className="grid gap-1.5 bg-night p-5 sm:grid-cols-[190px_1fr] sm:gap-6">
                      <dt className="text-[13px] font-semibold text-mist">{f.k}</dt>
                      <dd className="text-[14px] leading-[1.65] text-mist-dim">{f.v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal>
                <p className="mt-8 max-w-[52ch] text-[13px] leading-[1.7] text-mist-faint">
                  If the patient is awake and able to decide, use{" "}
                  <a className="text-mist underline underline-offset-4" href="/access">
                    the ordinary route
                  </a>{" "}
                  instead. It takes a few seconds longer and shows you everything they agree to.
                </p>
              </Reveal>
            </div>

            <div className="lg:pt-2">
              <Reveal>
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.05] p-6">
                  <EmergencyLookupForm />
                </div>
              </Reveal>
            </div>
          </div>
        </Wrap>
      </main>

      <NightFooter />
    </NightShell>
  );
}

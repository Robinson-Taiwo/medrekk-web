import { NightFooter, NightHeader } from "@/components/night-chrome";
import { Aura, Body, Display, Heading, NightShell, Panel, Wrap } from "@/components/night";
import { Reveal } from "@/components/reveal";
import LookupForm from "./LookupForm";

export const metadata = {
  title: "Access a record",
  description:
    "Find a patient's record with their MedRekk code and name, then ask them for access. They decide what you see and for how long.",
};

/**
 * What happens after Continue, said before it is pressed.
 *
 * The page used to be a heading, two fields and a button on an empty white field — which
 * tells a clinician standing in front of a patient nothing about what they are about to set
 * in motion, or why nothing has appeared yet when they wait for it. Access here is somebody
 * else's decision, and a form that does not say so reads as broken when it does not
 * immediately produce a record.
 */
const STEPS = [
  {
    n: "01",
    title: "Find the record",
    body: "Their MedRekk code and the name on the record. Both have to match — a code alone finds nothing.",
  },
  {
    n: "02",
    title: "Say what you need",
    body: "Name yourself, your facility and your reason, and pick only the parts of the record you need.",
  },
  {
    n: "03",
    title: "They decide",
    body: "The request goes to their phone. They can approve less than you asked for, and end it whenever they like.",
  },
];

export default function AccessLookupPage() {
  return (
    <NightShell>
      <NightHeader />

      <main className="relative flex-1">
        <Aura className="left-1/2 top-[-8rem] h-[26rem] w-[40rem] -translate-x-1/2 opacity-40" />
        <Wrap className="relative py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
            <div>
              <Reveal>
                <Display className="max-w-[16ch]">Ask for a record. The patient answers.</Display>
                <Body className="mt-5 max-w-[52ch]">
                  You do not need an account to read a record somebody has approved. A code and a name find it;
                  only the patient can open it.
                </Body>
              </Reveal>

              <Reveal>
                <ol className="mt-10 grid gap-3">
                  {STEPS.map((step) => (
                    <li key={step.n}>
                      <Panel className="flex gap-4 p-5">
                        <span className="font-mono text-[13px] tabular-nums text-glow">{step.n}</span>
                        <span className="min-w-0">
                          <span className="block text-[15px] font-semibold text-mist">{step.title}</span>
                          <span className="mt-1 block text-[14px] leading-[1.6] text-mist-dim">{step.body}</span>
                        </span>
                      </Panel>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal>
                <p className="mt-8 max-w-[52ch] text-[13px] leading-[1.7] text-mist-faint">
                  Every lookup, request and view is written into the patient&rsquo;s own access log, with your name
                  and your reason on it. In an emergency, a responder can read the patient&rsquo;s emergency card
                  without any of this —{" "}
                  <a className="text-mist underline underline-offset-4" href="/emergency">
                    that is a separate door
                  </a>
                  , and it is logged too.
                </p>
              </Reveal>
            </div>

            <div className="lg:pt-2">
              <Reveal>
                <div className="glass rounded-2xl p-6">
                  <Heading className="text-[20px]">Find the record</Heading>
                  <Body className="mt-2 text-[14px]">Ask the patient for both.</Body>
                  <div className="mt-6">
                    <LookupForm />
                  </div>
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

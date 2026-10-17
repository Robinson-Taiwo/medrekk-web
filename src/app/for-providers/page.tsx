import { NightFooter, NightHeader } from "@/components/night-chrome";
import {
  Aura,
  Body,
  Display,
  Eyebrow,
  Heading,
  KeyChip,
  Lead,
  NightLink,
  NightNotice,
  NightShell,
  Panel,
  Wrap,
} from "@/components/night";
import { Reveal } from "@/components/reveal";
import { AccessRequestScreen, Phone, WorkerReviewScreen } from "@/components/phone";

export const metadata = {
  title: "For providers",
  description:
    "How a clinician asks for access, records a visit with no connection, and confirms what is in a patient's record.",
};

const NO_ACCOUNT = [
  "Read a record a patient has approved, on any browser",
  "Look up an emergency card by MedRekk Code",
  "Nothing to install, nothing to configure",
];

const WITH_ACCOUNT = [
  "Ask a patient for the areas you need",
  "Record a visit, with or without a network",
  "Confirm an entry once your credentials are approved",
];

export default function ForProviders() {
  return (
    <NightShell>
      <NightHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden py-20 lg:py-28">
          <Aura className="left-1/2 top-[-8rem] h-[28rem] w-[46rem] -translate-x-1/2" />
          <Wrap className="relative max-w-[46rem] text-center">
            <Reveal>
              <Eyebrow>For clinicians</Eyebrow>
              <Display className="mt-7">The history arrives with the patient.</Display>
              <Lead className="mx-auto mt-6">
                No integration, no portal to be onboarded onto. The patient approves what you see,
                in the room, in front of you.
              </Lead>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <NightLink href="/signup">Create an account</NightLink>
                <NightLink href="/access" variant="ghost">
                  Request access to a record
                </NightLink>
              </div>
            </Reveal>
          </Wrap>
        </section>

        {/* What an account is and is not for */}
        <section className="border-t border-white/[0.07] py-16 lg:py-24">
          <Wrap>
            <Reveal>
              <Heading className="max-w-[20ch]">You need less than you think.</Heading>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <Reveal>
                <Panel className="h-full p-6">
                  <p className="text-[13px] font-medium text-mist-faint">Without an account</p>
                  <ul className="mt-4 grid gap-3">
                    {NO_ACCOUNT.map((line) => (
                      <li key={line} className="flex items-start gap-3">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-mist-faint" />
                        <span className="text-[15px] leading-[1.6] text-mist">{line}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </Reveal>
              <Reveal delay={80}>
                <Panel className="h-full border-glow/20 bg-glow/[0.04] p-6">
                  <p className="text-[13px] font-medium text-glow">With one</p>
                  <ul className="mt-4 grid gap-3">
                    {WITH_ACCOUNT.map((line) => (
                      <li key={line} className="flex items-start gap-3">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-glow" />
                        <span className="text-[15px] leading-[1.6] text-mist">{line}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </Reveal>
            </div>
          </Wrap>
        </section>

        {/* Asking */}
        <section className="border-t border-white/[0.07] py-16 lg:py-24">
          <Wrap className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <Heading className="max-w-[18ch]">Ask for what you need, not for everything.</Heading>
              <Body className="mt-5">
                You enter the patient&apos;s MedRekk Code and choose the areas relevant to the
                visit. They see your name, your facility and your reason before deciding — and they
                can hand you less than you asked for.
              </Body>
              <div className="mt-7">
                <KeyChip tone="accent">MR-4K7Q</KeyChip>
              </div>
            </Reveal>
            <Reveal delay={120} className="flex justify-center lg:justify-end">
              <Phone caption="What the patient sees">
                <AccessRequestScreen />
              </Phone>
            </Reveal>
          </Wrap>
        </section>

        {/* Recording */}
        <section className="relative overflow-hidden border-t border-white/[0.07] py-16 lg:py-24">
          <Aura className="left-[-12rem] top-1/3 h-[24rem] w-[32rem] opacity-30" />
          <Wrap className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal className="lg:order-2">
              <Heading className="max-w-[18ch]">Record the visit whether or not there is a network.</Heading>
              <Body className="mt-5">
                Dictate or photograph the note. It is transcribed and structured on the handset, so
                nothing is uploaded to be read — and saving cannot fail for want of a connection.
              </Body>
              <div className="mt-7">
                <NightNotice>
                  Every line is a draft until you confirm it. You correct what the model misheard,
                  and only then does it reach the record — always as unverified.
                </NightNotice>
              </div>
            </Reveal>
            <Reveal delay={120} className="flex justify-center lg:order-1 lg:justify-start">
              <Phone caption="Checking the draft">
                <WorkerReviewScreen />
              </Phone>
            </Reveal>
          </Wrap>
        </section>

        {/* Getting approved */}
        <section className="border-t border-white/[0.07] py-16 lg:py-24">
          <Wrap className="max-w-[44rem]">
            <Reveal>
              <Heading>Getting started takes a minute.</Heading>
              <Body className="mt-5">
                Register yourself — no administrator needed. You can request access straight away,
                and the patient sees your name and facility when deciding.
              </Body>
              <div className="mt-7">
                <NightNotice tone="pending" title="One thing waits for approval">
                  Marking an entry as clinically confirmed stays switched off until your
                  credentials are approved, so an unapproved account can never make something look
                  more authoritative than it is.
                </NightNotice>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <NightLink href="/signup" size="lg">
                  Create an account
                </NightLink>
                <NightLink href="/login" variant="ghost" size="lg">
                  Sign in
                </NightLink>
              </div>
            </Reveal>
          </Wrap>
        </section>
      </main>

      <NightFooter />
    </NightShell>
  );
}

import type { ReactNode } from "react";

import { NightFooter, NightHeader } from "@/components/night-chrome";
import {
  Aura,
  Body,
  Display,
  Heading,
  KeyChip,
  Lead,
  NightLink,
  NightShell,
  Panel,
  Wrap,
} from "@/components/night";
import { Reveal } from "@/components/reveal";
import {
  AccessRequestScreen,
  EmergencyScreen,
  HomeScreen,
  Phone,
  VisitScreen,
  WorkerReviewScreen,
} from "@/components/phone";

export const metadata = {
  title: "How it works",
  description:
    "How a MedRekk record is held by the patient, how a provider asks for access, and what happens to a note recorded in the room.",
};

/** A step: what happens, and the screen it happens on. */
function Step({
  index,
  kicker,
  title,
  children,
  screen,
  caption,
  flip = false,
}: {
  index: string;
  kicker: string;
  title: string;
  children: ReactNode;
  screen: ReactNode;
  caption: string;
  flip?: boolean;
}) {
  return (
    <section className="border-t border-white/[0.07] py-16 lg:py-24">
      <Wrap className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className={flip ? "lg:order-2" : undefined}>
          <div className="flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-glow/30 bg-glow/10 font-mono text-[12px] font-semibold text-glow">
              {index}
            </span>
            <span className="text-[13px] font-medium text-mist-faint">{kicker}</span>
          </div>
          <Heading className="mt-5 max-w-[18ch]">{title}</Heading>
          <div className="mt-5 grid gap-4">{children}</div>
        </Reveal>

        <Reveal delay={120} className={`flex justify-center ${flip ? "lg:order-1 lg:justify-start" : "lg:justify-end"}`}>
          <Phone caption={caption}>{screen}</Phone>
        </Reveal>
      </Wrap>
    </section>
  );
}

export default function HowItWorks() {
  return (
    <NightShell>
      <NightHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden py-20 lg:py-28">
          <Aura className="left-1/2 top-[-8rem] h-[28rem] w-[46rem] -translate-x-1/2" />
          <Wrap className="relative max-w-[46rem] text-center">
            <Reveal>
              <Display>The record behaves like it belongs to the patient.</Display>
              <Lead className="mx-auto mt-6">
                Six steps, from the phone in someone&apos;s pocket to a note recorded in a clinic
                with no power.
              </Lead>
            </Reveal>
          </Wrap>
        </section>

        <Step
          index="1"
          kicker="Where it lives"
          title="On the patient's own phone."
          screen={<HomeScreen />}
          caption="The patient's home screen"
        >
          <Body>
            Signing up creates the record, a MedRekk Code and an emergency card. From then on the
            record is readable on that handset whether or not there is a network.
          </Body>
          <Panel className="p-4">
            <p className="text-[14px] leading-[1.6] text-mist-dim">
              The code is how anyone refers to the record without using the patient&apos;s name.
            </p>
            <div className="mt-3">
              <KeyChip tone="accent">MR-4K7Q</KeyChip>
            </div>
          </Panel>
        </Step>

        <Step
          index="2"
          kicker="Getting access"
          title="A provider asks for exactly what they need."
          screen={<AccessRequestScreen />}
          caption="Reviewing a request"
          flip
        >
          <Body>
            The request names who is asking, where they practise and why. The patient can narrow it
            before approving — a request for five areas can be granted as two.
          </Body>
          <Panel className="p-4">
            <p className="text-[14px] leading-[1.6] text-mist-dim">
              The grant carries an expiry from the moment it is approved. Nobody has to remember to
              revoke it, and the patient can end it early.
            </p>
          </Panel>
        </Step>

        <Step
          index="3"
          kicker="In the room"
          title="The note is understood on the handset."
          screen={<WorkerReviewScreen />}
          caption="Checking the draft"
        >
          <Body>
            The worker dictates or photographs the note. It is transcribed and structured on the
            device — nothing is uploaded in order to be read.
          </Body>
          <Panel className="p-4">
            <p className="text-[14px] leading-[1.6] text-mist-dim">
              Every line is a draft until a person confirms it. The worker corrects what the model
              misheard, and only then does it become part of the record.
            </p>
          </Panel>
        </Step>

        <Step
          index="4"
          kicker="What it becomes"
          title="A visit the patient can actually read."
          screen={<VisitScreen />}
          caption="One visit"
          flip
        >
          <Body>
            The visit keeps the words it came from, so the record can always be traced back to what
            was said. Entries start unverified; a clinician confirming one is a separate, recorded
            act.
          </Body>
        </Step>

        <Step
          index="5"
          kicker="In an emergency"
          title="A card anyone can read, without waiting."
          screen={<EmergencyScreen />}
          caption="The emergency card"
        >
          <Body>
            Blood group, allergies, conditions and a contact — reachable by code with no approval,
            because somebody unconscious cannot give one.
          </Body>
          <Panel className="border-amber-400/20 bg-amber-400/[0.06] p-4">
            <p className="text-[14px] font-semibold text-mist">The patient makes this trade</p>
            <p className="mt-1.5 text-[14px] leading-[1.6] text-mist-dim">
              Only what the patient puts on the card is readable this way. Every read is written to
              their access log, with the reason given.
            </p>
          </Panel>
        </Step>

        <section className="relative overflow-hidden border-t border-white/[0.07] py-16 lg:py-24">
          <Aura className="right-[-12rem] top-1/3 h-[24rem] w-[32rem] opacity-30" />
          <Wrap className="relative">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg border border-glow/30 bg-glow/10 font-mono text-[12px] font-semibold text-glow">
                  6
                </span>
                <span className="text-[13px] font-medium text-mist-faint">Without a smartphone</span>
              </div>
              <Heading className="mt-5 max-w-[22ch]">Any handset that can dial is enough.</Heading>
              <Body className="mt-5">
                The patient enters a PIN and reads their medicines, allergies, results, conditions
                and recent visits as plain text. A responder enters the code instead and reaches
                only the emergency card.
              </Body>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <KeyChip tone="accent">*384*74161#</KeyChip>
                <NightLink href="/ussd" variant="ghost">
                  Try the simulator
                </NightLink>
              </div>
            </Reveal>
          </Wrap>
        </section>

        <section className="relative overflow-hidden border-t border-white/[0.07] py-20 lg:py-28">
          <Aura className="left-1/2 top-1/2 h-[22rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-40" />
          <Wrap className="relative text-center">
            <Reveal>
              <Heading className="mx-auto max-w-[20ch]">Every look is written down.</Heading>
              <Body className="mx-auto mt-5">
                In a clinic, by QR in an emergency, or over a dialled code — each read joins an
                access log only the patient can open.
              </Body>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <NightLink href="/access">Access a record</NightLink>
                <NightLink href="/for-providers" variant="ghost">
                  For providers
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

import Link from "next/link";

import { Mark } from "@/components/brand";
import { AccessLifecycle, OfflineCapture, PillarIcon } from "@/components/illustration";
import { SiteFooter, SiteHeader } from "@/components/chrome";
import {
  Body,
  ButtonLink,
  Card,
  Display,
  Eyebrow,
  Lead,
  SectionHeading,
  Shell,
} from "@/components/ui";

/**
 * The hero visual is the patient's health passport, built from the same tokens the mobile
 * card uses. It is the real screen rather than an illustration of one, which is both honest
 * and the fastest way to show somebody what the product is.
 */
const PILLARS = [
  {
    icon: "offline" as const,
    title: "It works with no connection",
    body: "The record lives on the patient's phone, and a clinic with no network can still read and add to it.",
  },
  {
    icon: "approval" as const,
    title: "The patient approves each time",
    body: "They see who is asking, from where, and for how long. Access ends on its own.",
  },
  {
    icon: "log" as const,
    title: "Every look is written down",
    body: "Each time the record is opened it joins an access log only the patient can read.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "The patient holds the record",
    body: "They sign up once and get a MedRekk Code. Allergies, medicines, conditions and past visits sit on their own device.",
  },
  {
    n: "02",
    title: "A provider asks for what they need",
    body: "At the clinic the provider enters the code and requests specific areas, not the whole record. The patient approves on their phone.",
  },
  {
    n: "03",
    title: "Notes go in, in the room",
    body: "The provider dictates or photographs the note. It is transcribed and structured on the device itself, then shown to the patient before it is saved.",
  },
  {
    n: "04",
    title: "Access ends by itself",
    body: "The grant expires. The provider keeps nothing, and the patient keeps a record of what was read and by whom.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* ---------- Hero ---------- */}
        <Shell className="grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_auto] lg:gap-20 lg:py-24">
          <div>
            <Eyebrow>Patient-owned medical records</Eyebrow>
            <Display className="mt-4 text-ink">
              Your medical record should travel with you.
            </Display>
            <Lead className="mt-5">
              MedRekk puts the record in the patient&apos;s hands. A provider sees only what the
              patient approves, for only as long as the patient allows — and it works where the
              network does not.
            </Lead>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/access" size="lg">
                Access a record
              </ButtonLink>
              <ButtonLink href="/how-it-works" variant="secondary" size="lg">
                See how it works
              </ButtonLink>
            </div>

            <p className="mt-5 text-[13px] text-muted">
              In an emergency, a responder can read the critical card without waiting for anybody —{" "}
              <Link href="/emergency" className="font-medium text-primary underline underline-offset-2">
                emergency lookup
              </Link>
              .
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <AccessLifecycle />
          </div>
        </Shell>

        {/* ---------- Pillars ---------- */}
        <section className="border-y border-line bg-surface py-16 lg:py-20">
          <Shell>
            <SectionHeading className="text-ink">
              Built for the clinic that loses power at two
            </SectionHeading>
            <Body className="mt-4">
              Most record systems assume a server, a login and a connection. That assumption is why
              a patient&apos;s history so often starts again at every new hospital.
            </Body>

            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {PILLARS.map((pillar) => (
                <Card as="li" key={pillar.title} className="p-6">
                  <PillarIcon name={pillar.icon} />
                  <h3 className="mt-4 font-display text-[18px] font-bold leading-snug text-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[21px] text-muted">{pillar.body}</p>
                </Card>
              ))}
            </ul>
          </Shell>
        </section>

        {/* ---------- Offline, shown rather than claimed ---------- */}
        <section className="border-y border-line bg-surface py-16 lg:py-24">
          <Shell className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading className="text-ink">
                The clinic loses power. The visit is still recorded.
              </SectionHeading>
              <Body className="mt-4">
                The note is understood on the handset, saved on the handset, and sent by
                itself once there is a signal. Nobody has to remember to sync.
              </Body>
              <ul className="mt-7 grid gap-3">
                {[
                  "Dictate or photograph the note — no upload to read it",
                  "Saving cannot fail for want of a network",
                  "A repeated send is recognised, never filed twice",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-[15px] leading-[23px] text-ink">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center lg:justify-end">
              <OfflineCapture />
            </div>
          </Shell>
        </section>

        {/* ---------- No smartphone required ---------- */}
        <section className="py-16 lg:py-24">
          <Shell className="grid items-center gap-12 lg:grid-cols-[1fr_380px] lg:gap-20">
            <div>
              <Eyebrow>No smartphone required</Eyebrow>
              <SectionHeading className="mt-4 text-ink">
                A record you can reach from a borrowed handset
              </SectionHeading>
              <Body className="mt-4">
                A record you own is worth little if owning it needs a smartphone.
              </Body>
              <ul className="mt-6 grid gap-3">
                {[
                  ["A PIN", "reads medicines, allergies, results, conditions and visits"],
                  ["A MedRekk Code", "reaches the emergency card, no PIN, for a responder"],
                ].map(([key, rest]) => (
                  <li key={key} className="flex items-start gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-[15px] leading-[23px] text-ink">
                      <span className="font-semibold">{key}</span> {rest}
                    </span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/ussd" variant="secondary" className="mt-7">
                Try the dial-in simulator
              </ButtonLink>
            </div>

            {/* A feature-phone screen, in the two colours such a screen actually has. */}
            <div className="mx-auto w-full max-w-[320px] rounded-[24px] bg-[#2A2E2B] p-4 shadow-[0_24px_60px_-30px_rgba(20,45,42,0.5)]">
              <div className="rounded-[6px] bg-[#9FB89A] px-3 py-3 font-mono text-[13px] leading-[1.5] text-[#1B2A1C] shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]">
                <pre className="whitespace-pre-wrap font-mono">{`MedRekk
1. Medicines
2. Allergies
3. Test results
4. Past conditions
5. Recent visits
6. Emergency card
7. My code`}</pre>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                  <span
                    key={key}
                    className="rounded-[8px] bg-[#3C423D] py-2.5 text-center font-mono text-lg text-gray-100"
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          </Shell>
        </section>

        {/* ---------- How it works ---------- */}
        <section className="border-y border-line bg-surface py-16 lg:py-20">
          <Shell>
            <Eyebrow>End to end</Eyebrow>
            <SectionHeading className="mt-4 text-ink">One visit, start to finish</SectionHeading>

            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <li key={step.n}>
                  <p className="font-mono text-[13px] font-semibold text-primary">{step.n}</p>
                  <h3 className="mt-3 font-display text-[17px] font-bold leading-snug text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[21px] text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </Shell>
        </section>

        {/* ---------- On-device AI ---------- */}
        <section className="py-16 lg:py-24">
          <Shell className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow>On the device</Eyebrow>
              <SectionHeading className="mt-4 text-ink">
                The note is understood on the phone, not in a datacentre
              </SectionHeading>
              <Body className="mt-4">
                Nothing is uploaded to be interpreted. A spoken note about somebody&apos;s health
                never leaves the room to be understood.
              </Body>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Dictate", "Speak the note. It is transcribed on the handset."],
                ["Photograph", "A paper result is read without being uploaded."],
                ["Confirm", "The patient sees every line before it is saved."],
                ["Attribute", "Each entry keeps who recorded it, and from where."],
              ].map(([title, body]) => (
                <Card key={title} className="p-5">
                  <h3 className="font-display text-[15px] font-bold text-ink">{title}</h3>
                  <p className="mt-1.5 text-[13px] leading-[19px] text-muted">{body}</p>
                </Card>
              ))}
            </div>
          </Shell>
        </section>

        {/* ---------- Closing ---------- */}
        <section className="pb-20">
          <Shell>
            <div className="overflow-hidden rounded-[28px] bg-ink px-8 py-14 text-center sm:px-14">
              <Mark className="mx-auto h-9 w-9 text-primary-soft" />
              <h2 className="mx-auto mt-6 max-w-[26ch] font-display text-[clamp(1.5rem,3.4vw,2.2rem)] font-extrabold leading-[1.15] text-white">
                A history that follows the patient, not the hospital.
              </h2>
              <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-[1.6] text-white/70">
                If you are a clinician, request access with the patient in front of you. If you are
                responding to an emergency, read the critical card now.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/access" size="lg">
                  Access a record
                </ButtonLink>
                <ButtonLink
                  href="/emergency"
                  size="lg"
                  variant="ghost"
                  className="border border-white/20 text-white hover:bg-white/10"
                >
                  Emergency lookup
                </ButtonLink>
              </div>
              <p className="mx-auto mt-6 text-[13px] text-white/60">
                Clinicians:{" "}
                <Link href="/signup" className="font-medium text-primary-soft underline underline-offset-2">
                  create an account
                </Link>{" "}
                or{" "}
                <Link href="/login" className="font-medium text-primary-soft underline underline-offset-2">
                  sign in
                </Link>
                . Reading an approved record needs neither.
              </p>
            </div>
          </Shell>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

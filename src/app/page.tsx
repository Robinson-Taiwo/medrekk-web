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
import { AccessLifecycle, HeroSurface, OfflineCapture, PillarIcon } from "@/components/illustration";
import { AccessRequestScreen, HomeScreen, Phone, VisitScreen } from "@/components/phone";
import { DownloadCard } from "@/components/download";

const PILLARS = [
  {
    icon: "offline" as const,
    title: "No connection needed",
    body: "The record lives on the patient's phone. A clinic with no network can still read it and add to it.",
  },
  {
    icon: "approval" as const,
    title: "Approved each time",
    body: "They see who is asking, from where, and for how long. The grant ends on its own.",
  },
  {
    icon: "log" as const,
    title: "Every look recorded",
    body: "Each time the record is opened it joins a log only the patient can read.",
  },
];

export default function Home() {
  return (
    <NightShell>
      <NightHeader />

      <main className="flex-1">
        {/* ---------------- Hero ---------------- */}
        <section className="relative overflow-hidden pb-20 pt-20 lg:pb-28 lg:pt-28">
          <Aura className="left-1/2 top-[-10rem] h-[32rem] w-[52rem] -translate-x-1/2" />

          <Wrap className="relative">
            <div className="mx-auto max-w-[46rem] text-center">
              <Reveal delay={60}>
                <Display className="mt-7">The record belongs to the patient.</Display>
              </Reveal>

              <Reveal delay={120}>
                <Lead className="mx-auto mt-6">
                  A provider sees only what the patient approves, for only as long as they allow —
                  and it keeps working where the network does not.
                </Lead>
              </Reveal>

              <Reveal delay={180}>
                {/*
                  The app first, the reader second.
                  
                  Most people reaching this page are patients, and the thing they need is on
                  their phone; a clinician arrives with a code and a reason, and will find the
                  reader whether or not it is the brightest button on the page.
                */}
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <NightLink href="/download">Download the app</NightLink>
                  <NightLink href="/access" variant="ghost">
                    Access a record
                  </NightLink>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] text-mist-faint">
                  <span>Two ways in:</span>
                  <KeyChip tone="accent">MR-4K7Q</KeyChip>
                  <span>or</span>
                  <KeyChip tone="accent">*384*74161#</KeyChip>
                </div>
              </Reveal>
            </div>

            <Reveal delay={300} className="mt-16">
              <HeroSurface />
            </Reveal>
          </Wrap>
        </section>

        {/* ---------------- Three claims ---------------- */}
        <section className="border-t border-white/[0.07] py-20 lg:py-24">
          <Wrap>
            <Reveal>
              <Heading className="max-w-[20ch]">Built for the clinic that loses power at two.</Heading>
              <Body className="mt-5">
                Most systems assume a server, a login and a connection. That assumption is why a
                patient&apos;s history starts again at every new hospital.
              </Body>
            </Reveal>

            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {PILLARS.map((pillar, index) => (
                <Reveal key={pillar.title} delay={index * 80}>
                  <Panel className="h-full p-6">
                    <PillarIcon name={pillar.icon} />
                    <h3 className="mt-5 font-display text-[18px] font-bold leading-snug text-mist">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-[1.6] text-mist-dim">{pillar.body}</p>
                  </Panel>
                </Reveal>
              ))}
            </ul>
          </Wrap>
        </section>

        {/* ---------------- Offline, shown ---------------- */}
        <section className="relative overflow-hidden border-t border-white/[0.07] py-20 lg:py-28">
          <Aura className="right-[-14rem] top-1/4 h-[26rem] w-[34rem] opacity-30" />

          <Wrap className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <Heading className="max-w-[18ch]">The power goes. The visit is still recorded.</Heading>
              <Body className="mt-5">
                The note is understood on the handset, saved on the handset, and sent by itself
                once there is a signal.
              </Body>
              <ul className="mt-8 grid gap-3.5">
                {[
                  "Dictate or photograph the note — nothing is uploaded to read it",
                  "Saving cannot fail for want of a network",
                  "A repeated send is recognised, never filed twice",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-glow" />
                    <span className="text-[15px] leading-[1.6] text-mist">{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120} className="flex justify-center lg:justify-end">
              <OfflineCapture />
            </Reveal>
          </Wrap>
        </section>

        {/* ---------------- The app itself ---------------- */}
        <section className="border-t border-white/[0.07] py-20 lg:py-24">
          <Wrap>
            <Reveal>
              <Heading className="max-w-[18ch]">This is the whole app.</Heading>
              <Body className="mt-5">
                Three screens carry it: what you hold, who is asking, and what a visit became.
              </Body>
            </Reveal>

            <div className="mt-14 flex flex-wrap items-start justify-center gap-8 lg:gap-10">
              {[
                { screen: <HomeScreen key="h" />, caption: "What the patient holds" },
                { screen: <AccessRequestScreen key="a" />, caption: "Someone is asking" },
                { screen: <VisitScreen key="v" />, caption: "What the visit became" },
              ].map((item, index) => (
                <Reveal key={item.caption} delay={index * 100}>
                  <Phone caption={item.caption}>{item.screen}</Phone>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ---------------- Any phone ---------------- */}
        <section className="border-t border-white/[0.07] py-20 lg:py-24">
          <Wrap className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <Heading className="max-w-[20ch]">Reachable from a borrowed handset.</Heading>
              <Body className="mt-5">
                A record you own is worth little if owning it needs a smartphone.
              </Body>
              <div className="mt-8 grid gap-3">
                <Panel className="flex items-start gap-4 p-4">
                  <KeyChip tone="accent">*384*74161#</KeyChip>
                  <p className="flex-1 text-[14px] leading-[1.6] text-mist-dim">
                    The patient enters a PIN and reads medicines, allergies, results, conditions
                    and visits as plain text.
                  </p>
                </Panel>
                <Panel className="flex items-start gap-4 p-4">
                  <KeyChip tone="accent">MR-4K7Q</KeyChip>
                  <p className="flex-1 text-[14px] leading-[1.6] text-mist-dim">
                    A responder enters the code and reaches the emergency card. No PIN, nothing
                    else.
                  </p>
                </Panel>
              </div>
              <NightLink href="/ussd" variant="ghost" className="mt-8">
                Try the dial-in simulator
              </NightLink>
            </Reveal>

            <Reveal delay={120} className="flex justify-center lg:justify-end">
              <Handset />
            </Reveal>
          </Wrap>
        </section>

        {/* ---------------- Get the app ---------------- */}
        <section className="border-t border-white/[0.07] py-20 lg:py-24">
          <Wrap>
            <Reveal>
              <Heading className="max-w-[20ch]">It starts with the app on the patient&apos;s phone.</Heading>
              <Lead className="mt-5">
                Everything else here — an approved record read in a clinic, an emergency card, a
                record reached by dialling — begins with somebody holding their own history.
              </Lead>
            </Reveal>
            <Reveal>
              <div className="mt-9">
                <DownloadCard />
              </div>
            </Reveal>
          </Wrap>
        </section>

        {/* ---------------- Close ---------------- */}
        <section className="relative overflow-hidden border-t border-white/[0.07] py-20 lg:py-28">
          <Aura className="left-1/2 top-1/2 h-[24rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-40" />
          <Wrap className="relative text-center">
            <Reveal>
              <Heading className="mx-auto max-w-[22ch]">
                A history that follows the patient, not the hospital.
              </Heading>

              {/* The closing block was the one section on the page carrying no picture at all. */}
              <div className="mx-auto mt-10 max-w-[30rem]">
                <AccessLifecycle />
              </div>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <NightLink href="/access">Access a record</NightLink>
                <NightLink href="/emergency" variant="ghost">
                  Emergency lookup
                </NightLink>
              </div>
              <p className="mt-7 text-[13px] text-mist-faint">
                Clinicians can{" "}
                <a href="/signup" className="text-glow underline underline-offset-4">
                  create an account
                </a>
                . Reading an approved record needs none.
              </p>
            </Reveal>
          </Wrap>
        </section>
      </main>

      <NightFooter />
    </NightShell>
  );
}

/** The feature phone, drawn on the night surface. */
function Handset() {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
  return (
    <div className="w-full max-w-[270px] rounded-[26px] border border-white/[0.09] bg-white/[0.03] p-4 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)]">
      <div className="rounded-[8px] border border-white/[0.06] bg-[#0e1f1b] p-3 font-mono text-[12px] leading-[1.5] text-glow">
        <p className="text-mist-faint">MedRekk</p>
        <p className="mt-1.5">1. Medicines</p>
        <p>2. Allergies</p>
        <p>3. Test results</p>
        <p>4. Recent visits</p>
        <p>5. Emergency card</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {keys.map((key) => (
          <div
            key={key}
            className="rounded-[8px] border border-white/[0.06] bg-white/[0.04] py-2 text-center font-mono text-[14px] text-mist-dim"
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

import { NightFooter, NightHeader } from "@/components/night-chrome";
import { Aura, Body, Display, Eyebrow, Heading, Lead, NightShell, Panel, Wrap } from "@/components/night";
import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Privacy",
  description:
    "What MedRekk holds, what stays on your phone, who can see your record and for how long, and how to get everything removed.",
};

/**
 * Deliberately a normal page rather than a PDF or a modal: a privacy policy that cannot be
 * opened without an account, or that downloads a file, is one most people never read. It is
 * also what an app store asks for — a plain URL, reachable by anyone, anywhere.
 */

const LAST_UPDATED = "26 October 2026";

/** The four that actually answer what people want to know, before any prose. */
const HEADLINES: { term: string; detail: string }[] = [
  { term: "Your record lives on your phone", detail: "It works with no connection, and nothing is sent until you act." },
  { term: "Nobody sees it without your approval", detail: "Each request names who is asking, what for, and for how long." },
  { term: "Access ends by itself", detail: "A grant expires on its own clock, and you can end it earlier at any moment." },
  { term: "Every look is written down", detail: "Who opened your record, when, and which parts — visible only to you." },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-white/[0.07] pt-10">
      <Heading className="text-[22px]">{title}</Heading>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5 border-l-2 border-white/[0.09] pl-4 sm:grid-cols-[180px_1fr] sm:gap-6 sm:border-l-0 sm:pl-0">
      <p className="text-[13px] font-semibold text-mist">{label}</p>
      <p className="text-[15px] leading-[1.65] text-mist-dim">{children}</p>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <NightShell>
      <NightHeader />

      <main className="relative">
        <Aura />
        <Wrap className="py-16 md:py-24">
          <Reveal>
            <Eyebrow>Privacy</Eyebrow>
            <Display className="mt-4 max-w-[18ch]">What we hold, and what never leaves your phone.</Display>
            <Lead className="mt-5 max-w-[60ch]">
              MedRekk exists because medical records usually belong to whoever built the system rather than to the
              person they describe. That principle only means something if it is written down. Last updated {LAST_UPDATED}.
            </Lead>
          </Reveal>

          <Reveal>
            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              {HEADLINES.map((item) => (
                <Panel key={item.term} className="p-5">
                  <p className="text-[15px] font-semibold text-mist">{item.term}</p>
                  <p className="mt-1.5 text-[14px] leading-[1.6] text-mist-faint">{item.detail}</p>
                </Panel>
              ))}
            </div>
          </Reveal>

          <div className="mt-16 grid gap-12">
            <Section id="prototype" title="What MedRekk is right now">
              <Body>
                MedRekk is an early build, shown as a working prototype. It is not yet a certified clinical system and
                should not be the only place a diagnosis, a prescription or an allergy is written down. Treat anything
                you put in it as a copy, not as the original. We would rather say this plainly here than imply a
                maturity the product has not earned.
              </Body>
            </Section>

            <Section id="what-we-hold" title="What we hold, and where">
              <Row label="On your phone">
                Your record, so it opens with no connection. Your sign-in is stored in the device&rsquo;s secure
                keystore, not in ordinary app storage.
              </Row>
              <Row label="On our server">
                Your name, your MedRekk code, your record entries, and the log of who has opened them. Referral
                share links are encrypted before they are written to the database.
              </Row>
              <Row label="Never sent">
                Voice recordings and photographs. Speech is transcribed on the handset and the audio is discarded; a
                photographed document stays in your phone&rsquo;s storage. Only the text you keep, and a fingerprint
                of the image, are sent.
              </Row>
              <Row label="Not collected">
                Advertising identifiers, location, contacts, and your activity on other apps or sites. We have no
                advertising business, so there is nothing for this data to be used for.
              </Row>
            </Section>

            <Section id="photographs" title="Photographs and the fingerprint">
              <Body>
                When you photograph a prescription or a result, the text is read on your phone and the picture stays
                there. What reaches the server is the text you chose to keep, plus a SHA-256 fingerprint of the
                image: a short string that is unique to that exact file and from which the picture cannot be
                reconstructed. If a clinician later doubts a document, you can show them your copy and the
                fingerprint proves it is the same one. We get the proof without ever holding the photograph.
              </Body>
            </Section>

            <Section id="who-sees" title="Who can see your record">
              <Row label="You">Always, in full, with or without a connection.</Row>
              <Row label="A health worker">
                Only after you approve a request. You see who is asking, their stated reason, and which parts they
                want. You can approve less than they asked for. The grant runs for a set time and ends by itself;
                you can end it sooner, and they lose access immediately.
              </Row>
              <Row label="In an emergency">
                Only what you deliberately put on your emergency card — typically blood group, severe allergies and
                a contact. Nothing else is reachable this way, and every emergency lookup is logged like any other.
              </Row>
              <Row label="Us">
                Staff do not browse records. Access to production data is limited to fixing a fault, and the same
                audit trail applies.
              </Row>
              <Row label="Nobody else">
                We do not sell your record, share it with advertisers, insurers or employers, or use it to train
                models.
              </Row>
            </Section>

            <Section id="ai" title="The AI, and what it is allowed to decide">
              <Body>
                MedRekk can turn a spoken or photographed note into suggested entries. That work happens on the
                handset, not on a server. Everything it produces is a draft: a person reads each item and confirms
                or discards it before anything joins a record. The AI cannot confirm an entry, raise its standing,
                or put anything on your emergency card.
              </Body>
            </Section>

            <Section id="standing" title="Why entries are labelled">
              <Body>
                Every entry carries how it got there — self-reported, backed by a document, or confirmed by a
                clinician. Something you add yourself stays self-reported even if you attach a photograph of the
                prescription, because evidence you supply about yourself is worth reviewing rather than trusting on
                its own. Only a credentialed health worker can mark an entry confirmed, and their name stays
                attached to that decision.
              </Body>
            </Section>

            <Section id="rights" title="Your decisions">
              <Row label="See everything">Your record and the full access log are in the app, at any time.</Row>
              <Row label="Correct or remove">
                You can remove an entry. Entries added by a health worker are hidden from your record but kept in
                the audit trail, so the history of what a clinician saw stays honest.
              </Row>
              <Row label="End access">Any running grant can be ended from your phone, at once.</Row>
              <Row label="Delete the lot">
                Ask and your account, record and emergency card are deleted. Audit rows are kept only where they
                describe access that already happened.
              </Row>
            </Section>

            <Section id="children" title="Children">
              <Body>
                MedRekk is for adults holding their own record. A record kept on behalf of a child should be held by
                their parent or guardian under that adult&rsquo;s account.
              </Body>
            </Section>

            <Section id="contact" title="Contact">
              <Body>
                Questions about this policy, or a request to delete everything, go to{" "}
                <a className="text-glow underline underline-offset-4" href="mailto:privacy@medrekk.app">
                  privacy@medrekk.app
                </a>
                . If this policy changes in a way that affects who can see your record, the date at the top changes
                and the app tells you before the change takes effect.
              </Body>
            </Section>
          </div>
        </Wrap>
      </main>

      <NightFooter />
    </NightShell>
  );
}

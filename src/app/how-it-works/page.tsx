import { PageHero, SiteFooter, SiteHeader } from "@/components/chrome";
import { Body, ButtonLink, Card, Notice, SectionHeading, Shell } from "@/components/ui";

export const metadata = {
  title: "How it works",
  description:
    "How a MedRekk record is held by the patient, how a provider asks for access, and what happens to a note recorded in the room.",
};

function Section({
  title,
  children,
  tint = false,
}: {
  title: string;
  children: React.ReactNode;
  tint?: boolean;
}) {
  return (
    <section className={`py-14 lg:py-20 ${tint ? "border-y border-line bg-surface" : ""}`}>
      <Shell>
        <SectionHeading className="text-ink">{title}</SectionHeading>
        <div className="mt-5 grid gap-4">{children}</div>
      </Shell>
    </section>
  );
}

export default function HowItWorks() {
  return (
    <>
      <SiteHeader />

      <main>
        <PageHero
          eyebrow="How it works"
          title="The record belongs to the patient, and behaves like it."
          lead="Four things make that true in practice: where the record is stored, how a provider gets to it, what happens to a note while it is being written, and what the patient can see afterwards."
        />

        <Section title="Where the record lives">
          <Body>
            A patient signs up once and receives a MedRekk Code. Their allergies, medicines,
            conditions, test results and past visits are stored on their own device, and that copy
            is the one that is read in the clinic.
          </Body>
          <Body>
            Because the device holds it, a clinic with no network can still open and add to the
            record. Changes made offline are queued and reconciled when a connection returns, so
            a dropped connection mid-visit does not lose the note.
          </Body>
        </Section>

        <Section title="How a provider gets access" tint>
          <Body>
            A verified provider enters the patient&apos;s MedRekk Code and requests the areas they
            need — allergies and medicines for a pharmacy, perhaps everything for an admission.
            They do not request &ldquo;the record&rdquo;.
          </Body>
          <Body>
            The request appears on the patient&apos;s phone showing who is asking, which facility
            they are at, and which areas they want. The patient approves or declines. An approval
            carries an expiry, and the patient can revoke it before then from the same screen.
          </Body>

          <div className="mt-2 grid gap-4 sm:grid-cols-3">
            {[
              ["Scoped", "Only the areas asked for are returned, not the whole record."],
              ["Time-boxed", "The grant expires on its own, with the time left shown to both sides."],
              ["Revocable", "The patient can end it early without explaining themselves."],
            ].map(([title, body]) => (
              <Card key={title} className="p-5">
                <h3 className="font-display text-[15px] font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-[19px] text-muted">{body}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="What happens to a note in the room">
          <Body>
            A provider can type the note, dictate it, or photograph a paper result. Dictation is
            transcribed on the handset, and a photographed report is read on the handset. Neither
            is uploaded in order to be interpreted.
          </Body>
          <Body>
            What comes out of that is a draft, not a record. It is broken into individual entries —
            this medicine, that allergy — and shown to the patient before anything is saved. An
            entry the patient disputes does not become part of their history.
          </Body>
          <Body>
            Each saved entry keeps its provenance: who recorded it, at which facility, and how it
            was captured. A patient can add entries themselves, and those are marked as
            self-reported rather than silently mixed in with clinician-recorded ones.
          </Body>
        </Section>

        <Section title="The emergency card" tint>
          <Body>
            An unconscious patient cannot approve anything, so a small card — blood group, critical
            allergies, critical conditions — can be read without approval, by scanning the
            patient&apos;s QR code or entering their MedRekk Code.
          </Body>
          <Notice tone="pending" title="This is a deliberate trade-off, and the patient makes it">
            Anything on the emergency card can be read by anyone who has the code, with no approval
            step. So the patient chooses what goes on it, one item at a time, and the app says
            plainly what that means before they add something. Every emergency read still lands in
            their access log.
          </Notice>
        </Section>

        <Section title="Reaching the record without a smartphone">
          <Body>
            A patient-owned record that requires a smartphone is not owned by everybody. MedRekk
            answers a dialled short code, so a patient on a feature phone — or on somebody
            else&apos;s handset — can enter a PIN and read their medicines, allergies, test results,
            past conditions and recent visits as plain text, with no data connection.
          </Body>
          <Body>
            The PIN can only be set from inside the app, where the patient is already signed in; it
            can never be set over the phone, or whoever was holding the handset could set one. Five
            wrong PINs lock dialling for fifteen minutes, and the record itself is untouched by it.
          </Body>
          <Notice tone="unverified" title="What a dialled session deliberately cannot do">
            Text over a dialled code crosses the mobile network unencrypted, and whoever stands
            near the handset can read the screen. So dialling can read; it can never change
            anything, approve anything, or set a PIN.
          </Notice>
          <div>
            <ButtonLink href="/ussd" variant="secondary" className="mt-2">
              Try the dial-in simulator
            </ButtonLink>
          </div>
        </Section>

        <Section title="What the patient can see afterwards" tint>
          <Body>
            Every time the record is opened it is written to an access log that only the patient can
            read — a clinic session, an emergency scan, a dialled lookup, a referral being viewed.
            Each line records what was opened, by whom, and when.
          </Body>
          <Body>
            That log is the point. A record that can be read quietly is not owned by the person it
            describes.
          </Body>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}

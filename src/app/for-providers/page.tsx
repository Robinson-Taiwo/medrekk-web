import { PageHero, SiteFooter, SiteHeader } from "@/components/chrome";
import { Body, ButtonLink, Card, Notice, SectionHeading, Shell } from "@/components/ui";

export const metadata = {
  title: "For providers",
  description:
    "What MedRekk gives a clinician at the point of care, how patient-granted access works, and what it deliberately is not.",
};

const VALUE = [
  {
    title: "A history you did not have to take",
    body: "Allergies, current medicines and past conditions, from the patient's own record, before you prescribe. Including the visits that happened at somebody else's hospital.",
  },
  {
    title: "It opens with the network down",
    body: "The record is read from the patient's device. No server call, no waiting for a connection that is not there, no reason to send a patient away and ask them to come back.",
  },
  {
    title: "No account per hospital",
    body: "You are verified once as a health worker. There is no new patient file to create at each facility, because the file is not yours — it is theirs.",
  },
  {
    title: "The note is written where you are",
    body: "Dictate it or photograph the paper result. It is transcribed and structured on the handset, so you are correcting a draft rather than typing from nothing.",
  },
];

export default function ForProviders() {
  return (
    <>
      <SiteHeader />

      <main>
        <PageHero
          eyebrow="For providers"
          title="The history walks in with the patient."
          lead="MedRekk is not a record system you have to adopt. It is a record the patient already holds, which you can ask to read for the length of a consultation."
        />

        <section className="py-14 lg:py-20">
          <Shell>
            <SectionHeading className="text-ink">What you get at the point of care</SectionHeading>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {VALUE.map((item) => (
                <Card as="li" key={item.title} className="p-6">
                  <h3 className="font-display text-[17px] font-bold leading-snug text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[21px] text-muted">{item.body}</p>
                </Card>
              ))}
            </ul>
          </Shell>
        </section>

        <section className="border-y border-line bg-surface py-14 lg:py-20">
          <Shell>
            <SectionHeading className="text-ink">How access works in a consultation</SectionHeading>
            <ol className="mt-8 grid gap-6 lg:grid-cols-3">
              {[
                [
                  "You request what you need",
                  "Enter the patient's MedRekk Code and select the areas relevant to this visit. Asking for everything when you need two things is visible to the patient, so ask for two things.",
                ],
                [
                  "They approve on their phone",
                  "They see your name, your facility and what you asked for. Approval is a tap and carries an expiry; it is not a permanent handover.",
                ],
                [
                  "You record, they confirm",
                  "Entries you add are shown to the patient before they are saved, and each one keeps your name and facility against it.",
                ],
              ].map(([title, body], i) => (
                <li key={title}>
                  <p className="font-mono text-[13px] font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-[16px] font-bold leading-snug text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[21px] text-muted">{body}</p>
                </li>
              ))}
            </ol>
          </Shell>
        </section>

        <section className="py-14 lg:py-20">
          <Shell className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading className="text-ink">Attribution, both ways</SectionHeading>
              <Body className="mt-4">
                Every entry carries who recorded it and at which facility, and a document attached
                as evidence keeps what the document itself says — the issuing facility, the
                clinician named on it, and its date — separately from whoever filed it.
              </Body>
              <Body className="mt-3">
                That separation protects you as much as the patient. A line recorded by somebody
                else, or reported by the patient themselves, is never presented as yours.
              </Body>
            </div>

            <div className="grid gap-4">
              <Notice tone="verified" title="What is marked as clinician-recorded">
                Entries you create during an approved session, attributed to you and your facility,
                and verifiable against an attached document.
              </Notice>
              <Notice tone="unverified" title="What is marked as self-reported">
                Entries a patient adds themselves. They stay visibly distinct, and are never
                promoted to clinician-recorded because a document was attached.
              </Notice>
            </div>
          </Shell>
        </section>

        <section className="border-y border-line bg-surface py-14 lg:py-20">
          <Shell>
            <SectionHeading className="text-ink">What this is not</SectionHeading>
            <Body className="mt-4">
              Being straight about the boundaries is more useful to you than a longer list of
              features.
            </Body>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Notice tone="pending" title="Not a certified medical device">
                MedRekk is a prototype. It does not carry regulatory clearance and nothing in it
                should be treated as a clinical decision aid.
              </Notice>
              <Notice tone="pending" title="Not a replacement for your records">
                It does not replace your facility&apos;s record system or its legal obligations. It
                is the patient&apos;s copy, which happens to be the one that travels.
              </Notice>
              <Notice tone="pending" title="Not a complete history">
                It holds what has been recorded into it. An absence of something is not evidence
                that it does not exist, and it should not be read that way.
              </Notice>
              <Notice tone="pending" title="Not an audit authority">
                The access log tells a patient who opened their record. It is a transparency
                feature, not a finding about anybody&apos;s conduct.
              </Notice>
            </div>
          </Shell>
        </section>

        <section className="py-14 lg:py-20">
          <Shell>
            <SectionHeading className="text-ink">Getting started</SectionHeading>
            <Body className="mt-4">
              Register yourself — it takes a minute and needs no administrator. You can request
              access to a record straight away, and the patient sees your name and facility when
              deciding. Marking an entry as clinically confirmed is the one thing that waits until
              your credentials are approved, so an unapproved account can never make something look
              more authoritative than it is.
            </Body>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/signup" size="lg">
                Create an account
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary" size="lg">
                Sign in
              </ButtonLink>
              <ButtonLink href="/access" variant="secondary" size="lg">
                Request access to a record
              </ButtonLink>
            </div>
          </Shell>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

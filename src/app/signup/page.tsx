import { NightFooter, NightHeader } from "@/components/night-chrome";
import { Aura, Body, Heading, NightNotice, NightShell, Wrap } from "@/components/night";
import SignUpForm from "./SignUpForm";

export const metadata = {
  title: "Create a clinician account",
  description:
    "Register as a health worker so you can add to a record a patient has approved, and confirm what is in one.",
};

export default function SignUpPage() {
  return (
    <NightShell>
      <NightHeader />
      <main className="relative flex-1 overflow-hidden py-20 lg:py-28">
        <Aura className="left-1/2 top-[-6rem] h-[22rem] w-[36rem] -translate-x-1/2 opacity-40" />
        <Wrap className="relative">
          <div className="mx-auto w-full max-w-[520px]">
            <Heading>Create a clinician account</Heading>
            <Body className="mt-4">
              You only need an account to add to a record or confirm what is in one. Reading a
              record a patient has approved, and reading an emergency card, need no account at all.
            </Body>

            <div className="mt-9">
              <SignUpForm />
            </div>

            <div className="mt-9">
              <NightNotice tone="pending" title="Confirming information needs approval first">
                You can sign in and request access as soon as you register. Marking something in a
                patient&apos;s record as clinically confirmed stays switched off until your
                credentials are approved, so an unverified account can never make an entry look
                authoritative.
              </NightNotice>
            </div>
          </div>
        </Wrap>
      </main>
      <NightFooter />
    </NightShell>
  );
}

import { SiteFooter, SiteHeader } from "@/components/chrome";
import { Body, Notice, SectionHeading, Shell } from "@/components/ui";
import SignUpForm from "./SignUpForm";

export const metadata = {
  title: "Create a clinician account",
  description: "Register as a health worker so you can confirm information inside a record a patient has approved.",
};

export default function SignUpPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-14 lg:py-20">
        <Shell>
          <div className="mx-auto w-full max-w-[560px]">
          <SectionHeading className="text-ink">Create a clinician account</SectionHeading>
          <Body className="mt-3">
            You only need an account to add to a record or confirm what is in one. Reading a record a patient has
            approved, and reading an emergency card, need no account at all.
          </Body>

          <div className="mt-8">
            <SignUpForm />
          </div>

          <div className="mt-8">
            <Notice tone="pending" title="Confirming information needs approval first">
              You can sign in and request access as soon as you register. Marking something in a patient&apos;s record
              as clinically confirmed stays switched off until your credentials are approved, so an unverified account
              can never make an entry look authoritative.
            </Notice>
          </div>
          </div>
        </Shell>
      </main>
      <SiteFooter />
    </>
  );
}

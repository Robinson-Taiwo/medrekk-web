import { SiteFooter, SiteHeader } from "@/components/chrome";
import { Body, SectionHeading, Shell } from "@/components/ui";
import SignInForm from "./SignInForm";

export const metadata = {
  title: "Health worker sign in",
  description: "Sign in to confirm information inside a record a patient has approved.",
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-14 lg:py-20">
        <Shell>
          <div className="mx-auto w-full max-w-[480px]">
          <SectionHeading className="text-ink">Health worker sign in</SectionHeading>
          <Body className="mt-3">
            Signing in lets you add to a record a patient has approved, and confirm what is already in it. You do not
            need an account to read a record you have been given access to.
          </Body>
          <div className="mt-8">
            <SignInForm />
          </div>
          </div>
        </Shell>
      </main>
      <SiteFooter />
    </>
  );
}

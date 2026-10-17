import { NightFooter, NightHeader } from "@/components/night-chrome";
import { Aura, Body, Heading, NightShell, Wrap } from "@/components/night";
import SignInForm from "./SignInForm";

export const metadata = {
  title: "Health worker sign in",
  description: "Sign in to add to a record a patient has approved, and confirm what is in one.",
};

export default function LoginPage() {
  return (
    <NightShell>
      <NightHeader />
      <main className="relative flex-1 overflow-hidden py-20 lg:py-28">
        <Aura className="left-1/2 top-[-6rem] h-[22rem] w-[34rem] -translate-x-1/2 opacity-40" />
        <Wrap className="relative">
          <div className="mx-auto w-full max-w-[440px]">
            <Heading>Health worker sign in</Heading>
            <Body className="mt-4">
              Signing in lets you add to a record a patient has approved, and confirm what is
              already in it. Reading a record you have been given access to needs no account.
            </Body>
            <div className="mt-9">
              <SignInForm />
            </div>
          </div>
        </Wrap>
      </main>
      <NightFooter />
    </NightShell>
  );
}

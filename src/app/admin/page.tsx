import { NightFooter, NightHeader } from "@/components/night-chrome";
import { Aura, Body, Heading, NightShell, Wrap } from "@/components/night";
import Credentials from "./Credentials";

export const metadata = {
  title: "Approve health workers",
  description: "Approve a health worker's credential so they can confirm what is in a patient's record.",
};

export default function AdminPage() {
  return (
    <NightShell>
      <NightHeader />
      <main className="relative flex-1 py-20 lg:py-24">
        <Aura className="left-1/2 top-[-6rem] h-[22rem] w-[34rem] -translate-x-1/2 opacity-30" />
        <Wrap className="relative">
          <div className="mx-auto w-full max-w-[620px]">
            <Heading>Approve health workers</Heading>
            <Body className="mt-4">
              A new health worker account can ask a patient for access and record a visit straight away. It
              cannot mark anything <em>clinically verified</em> until someone approves its credential — that is
              the difference between a note a clinician took and a clinician vouching for it.
            </Body>
            <div className="mt-9">
              <Credentials />
            </div>
          </div>
        </Wrap>
      </main>
      <NightFooter />
    </NightShell>
  );
}

import { Suspense } from "react";

import { NightFooter, NightHeader } from "@/components/night-chrome";
import { Aura, Body, Display, KeyChip, NightShell, Wrap } from "@/components/night";
import { Reveal } from "@/components/reveal";
import Simulator from "./Simulator";

export const metadata = {
  title: "Dial-in simulator",
  description:
    "Operate a MedRekk session the way a feature phone would. No smartphone, no app, no internet — only a handset that can dial.",
};

export default function Page() {
  return (
    <NightShell>
      <NightHeader />

      <main className="relative flex-1">
        <Aura className="left-1/2 top-[-8rem] h-[24rem] w-[38rem] -translate-x-1/2 opacity-30" />
        <Wrap className="relative py-14 lg:py-20">
          <Reveal>
            <div className="max-w-[60ch]">
              <Display className="max-w-[18ch]">The phone most people already have.</Display>
              <Body className="mt-5">
                This keypad sends the same request a mobile network aggregator sends when somebody dials
                MedRekk&rsquo;s short code. The replies come from the live service, not from this page.
              </Body>
              <div className="mt-6 flex flex-wrap gap-2">
                <KeyChip>No smartphone</KeyChip>
                <KeyChip>No app</KeyChip>
                <KeyChip>No internet</KeyChip>
                <KeyChip tone="accent">*384*74161#</KeyChip>
              </div>
            </div>
          </Reveal>

          <div className="mt-12">
            <Suspense
              fallback={<p className="text-[14px] text-mist-faint">Loading the keypad…</p>}
            >
              <Simulator />
            </Suspense>
          </div>
        </Wrap>
      </main>

      <NightFooter />
    </NightShell>
  );
}

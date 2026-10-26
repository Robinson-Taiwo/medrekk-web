import { Suspense } from "react";

import { NightFooter, NightHeader } from "@/components/night-chrome";
import { NightShell, Wrap } from "@/components/night";
import Referral from "./Referral";

export const metadata = {
  title: "Referral",
  description: "A snapshot of a patient's record that they chose to hand over, for one provider, for a limited time.",
};

export default function ReferralPageShell() {
  return (
    <NightShell>
      <NightHeader />
      <main className="relative flex-1 py-12 lg:py-16">
        <Wrap className="relative">
          <Suspense fallback={<p className="text-[14px] text-mist-faint">Loading referral…</p>}>
            <Referral />
          </Suspense>
        </Wrap>
      </main>
      <NightFooter />
    </NightShell>
  );
}

import { Suspense } from "react";

import { NightFooter, NightHeader } from "@/components/night-chrome";
import { NightShell, Wrap } from "@/components/night";
import Record from "./Record";

export const metadata = {
  title: "Patient record",
};

export default function Page() {
  return (
    <NightShell>
      <NightHeader />
      <main className="relative flex-1 py-12 lg:py-16">
        <Wrap className="relative">
          <Suspense fallback={<p className="text-[14px] text-mist-faint">Loading…</p>}>
            <Record />
          </Suspense>
        </Wrap>
      </main>
      <NightFooter />
    </NightShell>
  );
}

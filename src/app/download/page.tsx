import type { Metadata } from "next";

import { NightFooter, NightHeader } from "@/components/night-chrome";
import { Aura, Body, Display, Heading, Lead, NightShell, Panel, Wrap } from "@/components/night";
import { Reveal } from "@/components/reveal";
import { DownloadCard } from "@/components/download";

export const metadata: Metadata = {
  title: "Get MedRekk",
  description: "Install MedRekk on an Android phone. Your record stays on your phone and works with no connection.",
};

const ANSWERS = [
  {
    q: "Why does my phone warn me about this?",
    a: "Because the app does not come from the Play Store. Android shows that warning for anything installed directly, whoever made it. You can allow it for this one file and the setting does not stay on for anything else.",
  },
  {
    q: "Do I need internet to use it?",
    a: "Only to make an account the first time. After that your record is on your phone: you can read it, add to it and show it to a health worker with no connection at all. It catches up by itself when you are next online.",
  },
  {
    q: "Is there an iPhone version?",
    a: "Not yet. On any phone you can still look up an emergency card in a browser, and read your record by dialling a number — which needs no app and no internet.",
  },
  {
    q: "Who can see my record?",
    a: "Nobody, until you say so. A health worker has to ask, you see who they are and what they want, and you can approve less than they asked for. Access ends on its own, and every look is written down where only you can read it.",
  },
];

export default function DownloadPage() {
  return (
    <NightShell>
      <NightHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden pb-16 pt-20 lg:pb-20 lg:pt-28">
          <Aura className="left-1/2 top-[-12rem] h-[30rem] w-[48rem] -translate-x-1/2" />
          <Wrap className="relative">
            <Reveal>
              <Display className="max-w-[16ch]">Get MedRekk on your phone.</Display>
              <Lead className="mt-6">
                One install, and your medical history belongs to you — readable in a clinic with no
                network, and shared only when you agree to it.
              </Lead>
            </Reveal>

            <Reveal>
              <div className="mt-10">
                <DownloadCard />
              </div>
            </Reveal>
          </Wrap>
        </section>

        <section className="border-t border-white/[0.07] py-16 lg:py-20">
          <Wrap>
            <Reveal>
              <Heading>Before you install</Heading>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {ANSWERS.map((item) => (
                <Reveal key={item.q}>
                  <Panel className="h-full p-5">
                    <h3 className="text-[15px] font-semibold text-mist">{item.q}</h3>
                    <Body className="mt-2 text-[14px]">{item.a}</Body>
                  </Panel>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>
      </main>

      <NightFooter />
    </NightShell>
  );
}

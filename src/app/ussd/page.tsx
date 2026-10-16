import { Suspense } from "react";
import Simulator from "./Simulator";

export const metadata = {
  title: "Dial-in simulator | MedRekk",
  description: "Operate a MedRekk USSD session the way a feature phone would.",
};

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-gray-500">Loading the keypad…</p>}>
      <Simulator />
    </Suspense>
  );
}

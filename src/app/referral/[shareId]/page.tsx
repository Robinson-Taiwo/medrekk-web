import { Suspense } from "react";
import Referral from "./Referral";

export default function ReferralPageShell() {
  return (
    <Suspense fallback={<p className="p-6 text-center text-gray-500">Loading referral…</p>}>
      <Referral />
    </Suspense>
  );
}

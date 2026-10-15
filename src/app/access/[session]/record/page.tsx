import { Suspense } from "react";
import Record from "./Record";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Loading…</p>}>
      <Record />
    </Suspense>
  );
}

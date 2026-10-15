import { Suspense } from "react";
import Emergency from "./Emergency";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Loading…</p>}>
      <Emergency />
    </Suspense>
  );
}

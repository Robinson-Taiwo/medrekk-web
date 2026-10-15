import { Suspense } from "react";
import Pending from "./Pending";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Loading…</p>}>
      <Pending />
    </Suspense>
  );
}

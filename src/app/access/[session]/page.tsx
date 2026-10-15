import { Suspense } from "react";
import RequestAccess from "./RequestAccess";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Loading…</p>}>
      <RequestAccess />
    </Suspense>
  );
}

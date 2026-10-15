import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto bg-white flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-semibold tracking-widest text-[#0F6E56]">MEDREKK</p>
      <h1 className="text-4xl font-bold text-gray-900">Your medical record should travel with you.</h1>
      <p className="text-lg text-gray-600">
        MedRekk is a patient-owned record. Providers only see what the patient approves, for as long as the patient allows.
        No app or hospital account needed, just a browser.
      </p>
      <div className="flex gap-3">
        <Link href="/access" className="rounded-xl bg-[#0F6E56] px-5 py-3 font-semibold text-white hover:opacity-90">
          Access a record
        </Link>
        <Link href="/emergency" className="rounded-xl border border-red-300 px-5 py-3 font-semibold text-red-800 hover:bg-red-50">
          Emergency access
        </Link>
      </div>
    </main>
  );
}

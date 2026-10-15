"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { clearAuth, getAuth, setAuth, type StoredAuth, type WebUser } from "@/lib/auth";

interface LoginResponse { token: string; user: WebUser }

export default function LoginPage() {
  const router = useRouter();
  const [current, setCurrent] = useState<StoredAuth | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrent(getAuth());
  }, []);

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api<LoginResponse>("/auth/login", {
        body: { email: email.trim().toLowerCase(), password },
      });
      if (res.user.role !== "HEALTH_WORKER") {
        setError("This sign-in is for health workers. Patients use the MedRekk app.");
        setBusy(false);
        return;
      }
      setAuth({ token: res.token, user: res.user });
      router.push("/access");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  if (current) {
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-2xl font-bold text-gray-900">Signed in</h1>
        <p className="mt-2 text-gray-600">
          {current.user.fullName}
          {current.user.facility ? `, ${current.user.facility}` : ""}
        </p>
        <button
          onClick={() => {
            clearAuth();
            setCurrent(null);
          }}
          className="mt-6 rounded-xl border border-gray-300 px-4 py-2 text-gray-900"
        >
          Sign out
        </button>
        <button onClick={() => router.push("/access")} className="mt-6 ml-3 rounded-xl bg-[#0F6E56] px-4 py-2 font-semibold text-white">
          Look up a record
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Health worker sign in</h1>
      <p className="mt-2 text-gray-600">
        Signing in lets you verify information inside a record the patient has approved. You do not need an account just
        to view a record.
      </p>
      <form onSubmit={(e) => void submit(e)} className="mt-8 flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900"
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={busy} className="rounded-xl bg-[#0F6E56] py-3 font-semibold text-white disabled:opacity-60">
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

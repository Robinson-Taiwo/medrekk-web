"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { clearAuth, getAuth, setAuth, type StoredAuth, type WebUser } from "@/lib/auth";
import { Button, ButtonLink, Field, Notice } from "@/components/ui";

interface LoginResponse {
  token: string;
  user: WebUser;
}

export default function SignInForm() {
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
      <div className="grid gap-5">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-[15px] font-semibold text-ink">{current.user.fullName}</p>
          <p className="mt-0.5 text-[13px] text-muted">
            {current.user.facility ?? "No facility on your account"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <ButtonLink href="/access" size="lg">
            Look up a record
          </ButtonLink>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              clearAuth();
              setCurrent(null);
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="grid gap-4">
      <Field
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Field
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      {error ? <Notice tone="danger">{error}</Notice> : null}

      <Button type="submit" size="lg" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-[13px] text-muted">
        No account yet?{" "}
        <Link href="/signup" className="font-medium text-primary underline underline-offset-2">
          Create one
        </Link>
        .
      </p>
    </form>
  );
}

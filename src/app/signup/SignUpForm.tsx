"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/lib/api";
import { setAuth, type WebUser } from "@/lib/auth";
import { NightButton, NightField, NightNotice } from "@/components/night";

interface AuthResponse {
  token: string;
  user: WebUser;
}

/**
 * Registering a clinician. The same endpoint the app uses, with the role fixed: a patient
 * account is created in the MedRekk app, where the record lives on their own device.
 */
export default function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [facility, setFacility] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (busy) return;
    // Checked here as well as on the server, so the answer is instant rather than a round trip.
    if (password.length < 8) {
      setError("Your password needs at least 8 characters.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await api<AuthResponse>("/auth/register", {
        body: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: "HEALTH_WORKER",
          ...(facility.trim() ? { facility: facility.trim() } : {}),
          ...(phone.trim() ? { phone: phone.trim() } : {}),
        },
      });
      setAuth({ token: res.token, user: res.user });
      router.push("/access");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={(e) => void submit(e)} className="grid gap-4">
      <NightField
        id="fullName"
        label="Your name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        minLength={2}
        autoComplete="name"
        placeholder="Amina Bello"
      />
      <NightField
        id="facility"
        label="Where you practise"
        hint="Shown to the patient when you ask for access, so they can see who is asking."
        value={facility}
        onChange={(e) => setFacility(e.target.value)}
        autoComplete="organization"
        placeholder="Ilorin General Hospital"
      />
      <NightField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <NightField
        id="phone"
        label="Phone"
        hint="Optional."
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        autoComplete="tel"
        placeholder="08031234567"
      />
      <NightField
        id="password"
        label="Password"
        hint="At least 8 characters."
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        autoComplete="new-password"
      />

      {error ? <NightNotice tone="danger">{error}</NightNotice> : null}

      <NightButton type="submit" size="lg" disabled={busy}>
        {busy ? "Creating your account…" : "Create account"}
      </NightButton>

      <p className="text-[13px] text-mist-faint">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-glow underline underline-offset-4">
          Sign in
        </Link>
        .
      </p>
    </form>
  );
}

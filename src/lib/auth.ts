export interface WebUser {
  id: string;
  fullName: string;
  role: "PATIENT" | "HEALTH_WORKER";
  facility: string | null;
  credentialStatus?: string;
}

export interface StoredAuth {
  token: string;
  user: WebUser;
}

const KEY = "medrekk:auth";

export function getAuth(): StoredAuth | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function setAuth(auth: StoredAuth): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(auth));
  } catch {
    // Storage unavailable; the user will simply need to sign in again.
  }
}

export function clearAuth(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}

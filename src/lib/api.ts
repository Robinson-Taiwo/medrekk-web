import { clearAuth, getAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const TIMEOUT_MS = 10000;

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

interface ErrorBody {
  error?: { code?: string; message?: string; issues?: { path: string; message: string }[] };
}

interface ApiInit {
  method?: "GET" | "POST";
  body?: object;
  auth?: boolean;
}

export async function api<T>(path: string, init?: ApiInit): Promise<T> {
  if (!API_URL) throw new ApiError(0, "NO_API_URL", "NEXT_PUBLIC_API_URL is not set.");
  const token = init?.auth ? getAuth()?.token : undefined;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: init?.method ?? (init?.body ? "POST" : "GET"),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: init?.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(
      0,
      controller.signal.aborted ? "TIMEOUT" : "NETWORK",
      controller.signal.aborted ? "MedRekk took too long to respond." : "Can't reach MedRekk right now.",
    );
  } finally {
    clearTimeout(timer);
  }
  const json: (T & ErrorBody) | null = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && init?.auth) {
      clearAuth();
      throw new ApiError(401, "UNAUTHENTICATED", "Your sign-in expired. Sign in again at /login.");
    }
    const issue = json?.error?.issues?.[0];
    throw new ApiError(
      res.status,
      json?.error?.code ?? "UNKNOWN",
      issue ? `${issue.path}: ${issue.message}` : (json?.error?.message ?? "Request failed."),
    );
  }
  if (json === null) throw new ApiError(res.status, "EMPTY", "Unexpected empty response.");
  return json;
}

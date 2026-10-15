export const ACCESS_SCOPES = [
  "ALLERGIES",
  "CURRENT_MEDICATIONS",
  "RECENT_ENCOUNTERS",
  "PAST_MEDICAL_HISTORY",
  "LAB_RESULTS",
  "REFERRALS",
  "EMERGENCY_INFORMATION",
] as const;
export type AccessScope = (typeof ACCESS_SCOPES)[number];

export const SCOPE_LABEL: Record<AccessScope, string> = {
  ALLERGIES: "Allergies",
  CURRENT_MEDICATIONS: "Current medications",
  RECENT_ENCOUNTERS: "Recent encounters",
  PAST_MEDICAL_HISTORY: "Past medical history",
  LAB_RESULTS: "Lab results",
  REFERRALS: "Referrals",
  EMERGENCY_INFORMATION: "Emergency information",
};

export const REQUESTER_ROLES = ["DOCTOR", "NURSE", "PHARMACIST", "LAB_SCIENTIST", "OTHER_CLINICIAN"] as const;
export type RequesterRole = (typeof REQUESTER_ROLES)[number];

export const ROLE_LABEL: Record<RequesterRole, string> = {
  DOCTOR: "Doctor",
  NURSE: "Nurse",
  PHARMACIST: "Pharmacist",
  LAB_SCIENTIST: "Lab scientist",
  OTHER_CLINICIAN: "Other clinician",
};

export type AccessStatus = "AWAITING_REQUEST" | "PENDING" | "APPROVED" | "DENIED" | "EXPIRED";

export interface LookupResponse { session: string; patientName: string; medrekkCode: string }
export interface StatusResponse { status: AccessStatus; grantedUntil?: string }

export interface Claim {
  id: string;
  category: string;
  value: string;
  status: string;
  source: string;
  verificationMethod?: string;
  verifiedAt?: string;
}

export interface RecordResponse {
  patient: { name: string; medrekkCode: string };
  grantedUntil: string;
  authorizedScopes: AccessScope[];
  data: Record<string, Claim[] | undefined>;
}

export const STATUS_LABEL: Record<string, string> = {
  UNVERIFIED: "Unverified",
  SELF_REPORTED: "Self-reported",
  EVIDENCE_BACKED: "Evidence-backed",
  CLINICALLY_VERIFIED: "Clinically verified",
};

export const STATUS_BADGE: Record<string, string> = {
  UNVERIFIED: "bg-gray-200 text-gray-700",
  SELF_REPORTED: "bg-amber-100 text-amber-800",
  EVIDENCE_BACKED: "bg-sky-100 text-sky-800",
  CLINICALLY_VERIFIED: "bg-emerald-100 text-emerald-800",
};

export interface EmergencyProfileResponse {
  patientName: string;
  emergencyId: string;
  criticalAllergies: string[];
  criticalConditions: string[];
  criticalMedications: string[];
  implantedDevices: string[];
  bloodGroup?: string;
  importantWarnings: string[];
  emergencyContact?: { name: string; phone: string; relationship: string };
  verificationStatus: string;
  lastConfirmedAt?: string;
  verifiedAt?: string;
  verifiedByName?: string;
  verifiedByFacility?: string | null;
  accessLoggedAt: string;
}

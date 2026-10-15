export interface ReferralItemView {
  claimId: string;
  scope: string;
  value: string;
  status: string;
}

export interface ReferralViewResponse {
  patient: { name: string; medrekkCode: string };
  issuedBy: { name: string; role: "PATIENT" | "HEALTH_WORKER" };
  originatingFacility: string | null;
  destinationFacility: string | null;
  reason: string;
  note: string | null;
  items: ReferralItemView[];
  createdAt: string;
  expiresAt: string;
}

export const SCOPE_TITLES: Record<string, string> = {
  ALLERGIES: "Allergies",
  CURRENT_MEDICATIONS: "Current medications",
  RECENT_ENCOUNTERS: "Recent encounters",
  PAST_MEDICAL_HISTORY: "Past medical history",
  LAB_RESULTS: "Lab results",
  REFERRALS: "Referrals",
  EMERGENCY_INFORMATION: "Emergency information",
};

export const ITEM_STATUS_TEXT: Record<string, string> = {
  UNVERIFIED: "Not verified",
  SELF_REPORTED: "Self-reported",
  EVIDENCE_BACKED: "Evidence-backed",
  CLINICALLY_VERIFIED: "Clinically verified",
};

export const ITEM_STATUS_CLASS: Record<string, string> = {
  UNVERIFIED: "bg-gray-200 text-gray-700",
  SELF_REPORTED: "bg-amber-100 text-amber-900",
  EVIDENCE_BACKED: "bg-blue-100 text-blue-900",
  CLINICALLY_VERIFIED: "bg-emerald-100 text-emerald-900",
};

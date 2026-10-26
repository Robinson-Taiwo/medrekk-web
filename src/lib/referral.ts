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

/**
 * How an item got here, as a tint on the night surface. The same four standings the app uses,
 * so a referral read in a browser says exactly what the record on the phone says.
 */
export const ITEM_STATUS_CLASS: Record<string, string> = {
  UNVERIFIED: "bg-white/[0.07] text-mist-dim",
  SELF_REPORTED: "bg-amber-400/[0.12] text-amber-200",
  EVIDENCE_BACKED: "bg-sky-400/[0.12] text-sky-200",
  CLINICALLY_VERIFIED: "bg-glow/[0.14] text-glow",
};

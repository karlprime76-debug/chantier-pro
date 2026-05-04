export type UserPlan = "FREE" | "PRO" | "ENTERPRISE";

export type FeatureKey =
  | "concrete_basic"
  | "steel_basic"
  | "stair_straight"
  | "stair_landing"
  | "stair_quarter_turn"
  | "formwork"
  | "masonry"
  | "plaster"
  | "tiling"
  | "painting"
  | "roofing"
  | "earthwork"
  | "septic_tank"
  | "fence"
  | "advanced_slab"
  | "quote_pdf"
  | "report_pdf"
  | "team_management"
  | "client_access";

export const PLAN_ORDER: Record<UserPlan, number> = {
  FREE: 0,
  PRO: 1,
  ENTERPRISE: 2,
};

export const FEATURE_MIN_PLAN: Record<FeatureKey, UserPlan> = {
  concrete_basic: "FREE",
  steel_basic: "FREE",

  stair_straight: "PRO",
  stair_landing: "PRO",
  stair_quarter_turn: "ENTERPRISE",
  formwork: "PRO",
  masonry: "PRO",
  plaster: "PRO",
  tiling: "PRO",
  painting: "PRO",
  roofing: "PRO",
  earthwork: "PRO",
  septic_tank: "ENTERPRISE",
  fence: "ENTERPRISE",
  advanced_slab: "ENTERPRISE",

  quote_pdf: "PRO",
  report_pdf: "PRO",
  team_management: "ENTERPRISE",
  client_access: "PRO",
};

export function canAccessFeature(userPlan: UserPlan, featureKey: FeatureKey): boolean {
  const requiredPlan = FEATURE_MIN_PLAN[featureKey];
  return PLAN_ORDER[userPlan] >= PLAN_ORDER[requiredPlan];
}

export function getUserPlanFromRole(role: "ADMIN" | "PROFESSIONAL" | "CLIENT"): UserPlan {
  if (role === "ADMIN") return "ENTERPRISE";
  if (role === "PROFESSIONAL") return "PRO";
  return "FREE";
}

export const FREE_LIMITS = {
  maxProjects: 1,
  maxDailyReports: 30,
} as const;

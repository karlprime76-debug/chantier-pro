export type UserPlan = "FREE" | "PREMIUM" | "ENTERPRISE";

export type FeatureKey =
  | "concrete_basic"
  | "steel_basic"
  | "concrete_mix_design"
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
  | "calc_history"
  | "calc_pdf"
  | "quote_from_calc"
  | "quote_templates"
  | "quote_pdf"
  | "report_pdf"
  | "site_checklists"
  | "control_reports"
  | "team_management"
  | "client_access"
  | "dosage_library"
  | "price_library"
  | "project_profitability"
  | "expenses_validation"
  | "foundations"
  | "advanced_exports"
  | "daily_reports"
  | "project_budget";

export const PLAN_ORDER: Record<UserPlan, number> = {
  FREE: 0,
  PREMIUM: 1,
  ENTERPRISE: 2,
};

export const FEATURE_MIN_PLAN: Record<FeatureKey, UserPlan> = {
  concrete_basic: "FREE",
  steel_basic: "FREE",

  concrete_mix_design: "ENTERPRISE",

  stair_straight: "PREMIUM",
  stair_landing: "PREMIUM",
  stair_quarter_turn: "ENTERPRISE",
  formwork: "PREMIUM",
  masonry: "PREMIUM",
  plaster: "PREMIUM",
  tiling: "FREE",
  painting: "PREMIUM",
  roofing: "PREMIUM",
  earthwork: "PREMIUM",
  septic_tank: "ENTERPRISE",
  fence: "ENTERPRISE",
  advanced_slab: "ENTERPRISE",

  calc_history: "PREMIUM",
  calc_pdf: "PREMIUM",
  quote_from_calc: "PREMIUM",
  quote_templates: "PREMIUM",

  quote_pdf: "PREMIUM",
  report_pdf: "PREMIUM",

  site_checklists: "ENTERPRISE",
  control_reports: "ENTERPRISE",
  team_management: "ENTERPRISE",
  client_access: "PREMIUM",

  dosage_library: "PREMIUM",
  price_library: "ENTERPRISE",
  project_profitability: "ENTERPRISE",
  expenses_validation: "ENTERPRISE",
  foundations: "ENTERPRISE",
  advanced_exports: "ENTERPRISE",
  daily_reports: "PREMIUM",
  project_budget: "PREMIUM",
};

export function canAccessPlan(userPlan: UserPlan, requiredPlan: UserPlan): boolean {
  return PLAN_ORDER[userPlan] >= PLAN_ORDER[requiredPlan];
}

export function canAccessFeature(userPlan: UserPlan, featureKey: FeatureKey): boolean {
  const requiredPlan = FEATURE_MIN_PLAN[featureKey];
  return canAccessPlan(userPlan, requiredPlan);
}

export function getUserPlanFromRole(role: "ADMIN" | "PROFESSIONAL" | "CLIENT"): UserPlan {
  if (role === "ADMIN") return "ENTERPRISE";
  if (role === "PROFESSIONAL") return "PREMIUM";
  return "FREE";
}

export function normalizeUserPlan(plan: string | null | undefined, role: "ADMIN" | "PROFESSIONAL" | "CLIENT"): UserPlan {
  if (role === "ADMIN") return "ENTERPRISE";
  if (plan === "FREE" || plan === "PREMIUM" || plan === "ENTERPRISE") return plan;
  if (plan === "PRO") return "PREMIUM";
  return "FREE";
}

export const FREE_LIMITS = {
  maxProjects: 1,
  maxDailyReports: 30,
} as const;

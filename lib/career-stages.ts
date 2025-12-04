/**
 * Career Stage Definitions
 * Defines the different career stages supported by the platform
 */

export type CareerStage =
  | "high_school_senior"
  | "undergrad"
  | "grad_school"
  | "law_school"
  | "med_school"
  | "mba"
  | "recent_grad"
  | "early_career";

export type OpportunityType =
  | "internship"
  | "co_op"
  | "entry_level"
  | "fellowship"
  | "residency"
  | "clerkship"
  | "full_time";

export interface CareerStageInfo {
  id: CareerStage;
  label: string;
  description: string;
  opportunityTypes: OpportunityType[];
  resources: string[];
  networkingTips: string[];
}

export const CAREER_STAGES: Record<CareerStage, CareerStageInfo> = {
  high_school_senior: {
    id: "high_school_senior",
    label: "High School Senior",
    description: "Preparing for college applications and exploring career interests",
    opportunityTypes: ["internship"],
    resources: [
      "college-search-guide",
      "essay-writing-tips",
      "scholarship-finder",
      "career-exploration"
    ],
    networkingTips: [
      "Connect with college students and alumni from schools you're interested in",
      "Reach out to professionals in fields you want to explore",
      "Ask for informational interviews to learn about different career paths"
    ]
  },

  undergrad: {
    id: "undergrad",
    label: "Undergraduate Student",
    description: "Currently pursuing bachelor's degree",
    opportunityTypes: ["internship", "co_op", "entry_level"],
    resources: [
      "internship-search-guide",
      "resume-builder",
      "interview-prep",
      "networking-fundamentals",
      "linkedin-optimization"
    ],
    networkingTips: [
      "Leverage your school's alumni network",
      "Reach out to upperclassmen in your major",
      "Connect with recruiters from target companies",
      "Attend career fairs and networking events"
    ]
  },

  grad_school: {
    id: "grad_school",
    label: "Graduate Student",
    description: "Pursuing master's or PhD",
    opportunityTypes: ["internship", "fellowship", "entry_level", "full_time"],
    resources: [
      "research-opportunities",
      "fellowship-search",
      "academic-networking",
      "industry-transition-guide"
    ],
    networkingTips: [
      "Connect with professors and advisors",
      "Reach out to researchers in your field",
      "Network with industry professionals for career transitions",
      "Attend academic conferences and workshops"
    ]
  },

  law_school: {
    id: "law_school",
    label: "Law School Student",
    description: "Pursuing JD or LLM",
    opportunityTypes: ["internship", "clerkship", "entry_level"],
    resources: [
      "law-firm-guide",
      "clerkship-search",
      "legal-writing-tips",
      "bar-exam-prep",
      "legal-networking"
    ],
    networkingTips: [
      "Connect with law school alumni at target firms",
      "Reach out to practicing attorneys for mentorship",
      "Network with judges for clerkship opportunities",
      "Join legal professional associations"
    ]
  },

  med_school: {
    id: "med_school",
    label: "Medical School Student",
    description: "Pursuing MD, DO, or related medical degree",
    opportunityTypes: ["residency", "fellowship", "internship"],
    resources: [
      "residency-match-guide",
      "clinical-rotation-tips",
      "medical-networking",
      "research-opportunities"
    ],
    networkingTips: [
      "Connect with residents and attendings in specialties of interest",
      "Reach out to program directors for away rotations",
      "Network with researchers for publication opportunities",
      "Join medical professional organizations"
    ]
  },

  mba: {
    id: "mba",
    label: "MBA Student",
    description: "Pursuing Master of Business Administration",
    opportunityTypes: ["internship", "full_time"],
    resources: [
      "mba-recruiting-guide",
      "case-interview-prep",
      "consulting-firm-guide",
      "startup-opportunities",
      "executive-networking"
    ],
    networkingTips: [
      "Leverage MBA alumni networks",
      "Connect with recruiters from top consulting/finance firms",
      "Attend MBA conferences and recruiting events",
      "Network with executives and senior leaders"
    ]
  },

  recent_grad: {
    id: "recent_grad",
    label: "Recent Graduate",
    description: "Graduated within the last 2 years",
    opportunityTypes: ["entry_level", "full_time"],
    resources: [
      "job-search-strategy",
      "salary-negotiation",
      "career-transition-guide",
      "professional-branding"
    ],
    networkingTips: [
      "Reconnect with college alumni network",
      "Reach out to former professors for connections",
      "Network with early-career professionals in your field",
      "Join young professional groups"
    ]
  },

  early_career: {
    id: "early_career",
    label: "Early Career Professional",
    description: "2-5 years of work experience",
    opportunityTypes: ["full_time"],
    resources: [
      "career-advancement-guide",
      "leadership-development",
      "industry-switching",
      "executive-presence"
    ],
    networkingTips: [
      "Build relationships with senior colleagues and mentors",
      "Connect with industry leaders on LinkedIn",
      "Attend industry conferences and events",
      "Join professional associations in your field"
    ]
  }
};

export const OPPORTUNITY_LABELS: Record<OpportunityType, string> = {
  internship: "Internship",
  co_op: "Co-op",
  entry_level: "Entry Level",
  fellowship: "Fellowship",
  residency: "Residency",
  clerkship: "Clerkship",
  full_time: "Full Time"
};

// Helper functions
export function getCareerStageInfo(stage: CareerStage): CareerStageInfo {
  return CAREER_STAGES[stage];
}

export function getOpportunityTypesForStage(stage: CareerStage): OpportunityType[] {
  return CAREER_STAGES[stage].opportunityTypes;
}

export function getNetworkingTipsForStage(stage: CareerStage): string[] {
  return CAREER_STAGES[stage].networkingTips;
}

export function getResourcesForStage(stage: CareerStage): string[] {
  return CAREER_STAGES[stage].resources;
}

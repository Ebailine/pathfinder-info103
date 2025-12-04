// Application statuses matching INFO 103 project description
export type CompanyStatus =
  | "thinking"      // Thinking About It
  | "applied"       // Applied
  | "interviewing"  // Interviewing
  | "offer"         // Offer
  | "rejected";     // Rejected

export type OutreachStatus =
  | "draft"
  | "sent"
  | "responded"
  | "intro_made"
  | "no_response";

export type ReminderType =
  | "follow_up"
  | "call_prep"
  | "check_response"
  | "send_thank_you";

import { CareerStage, OpportunityType } from "./career-stages";

export interface User {
  id: string;
  email: string;
  full_name: string;
  profile_photo_url?: string;
  headline?: string;

  // Career Stage Information
  career_stage: CareerStage;
  school: string;
  major?: string;
  degree_type?: string; // e.g., "BS", "JD", "MD", "MBA", "PhD"
  graduation_year?: number;

  // Location & Contact
  location?: string;
  skills: string[];

  // Target Opportunities
  target_opportunity_types: OpportunityType[];
  target_industries: string[];
  target_roles: string[];

  // Preferences
  preferred_locations: string[];
  remote_preference: "remote" | "hybrid" | "onsite" | "flexible";

  // Platform State
  onboarding_completed: boolean;
  onboarding_step: number;

  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  user_id: string;
  linkedin_profile_id?: string;
  linkedin_url?: string;
  full_name: string;
  headline: string;
  current_company?: string;
  current_role?: string;
  profile_photo_url?: string;
  connection_date?: string;
  mutual_connections: number;
  same_school: boolean;
  same_major: boolean;
  intro_likelihood_score: number;
  // Additional contact fields for INFO 103 project
  email?: string;
  phone?: string;
  notes?: string;
  how_you_know?: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface TargetCompany {
  id: string;
  user_id: string;
  company_name: string;
  role: string;
  job_url?: string;
  location?: string;
  job_description?: string;
  required_skills: string[];
  status: CompanyStatus;
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface Outreach {
  id: string;
  user_id: string;
  target_company_id: string;
  connection_id?: string;
  recipient_name: string;
  recipient_linkedin_url?: string;
  message_content: string;
  send_method?: "linkedin" | "email";
  status: OutreachStatus;
  sent_at?: string;
  responded_at?: string;
  intro_made_at?: string;
  follow_up_scheduled_at?: string;
  follow_up_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  outreach_id?: string;
  target_company_id?: string;
  reminder_type: ReminderType;
  reminder_date: string;
  message: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  type: "message_sent" | "response_received" | "call_scheduled" | "intro_made" | "note_added" | "status_changed";
  title: string;
  description: string;
  date: string;
  metadata?: Record<string, any>;
}

export interface Note {
  id: string;
  target_company_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Simplified UserStats for INFO 103 project (no gamification)
export interface UserStats {
  totalApplications: number;
  applied: number;
  interviewing: number;
  offers: number;
  rejected: number;
  upcomingDeadlines: number;
  tasksDue: number;
}

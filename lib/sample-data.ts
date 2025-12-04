import {
  User,
  Connection,
  TargetCompany,
  Outreach,
  Reminder,
  TimelineEvent,
  Note,
  UserStats
} from './types';

export const sampleUser: User = {
  id: "user-1",
  email: "john.doe@drexel.edu",
  full_name: "John Doe",
  profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  headline: "Computer Science Student at Drexel University",

  // Career Stage Information
  career_stage: "undergrad",
  school: "Drexel University",
  major: "Computer Science",
  degree_type: "BS",
  graduation_year: 2026,

  // Location & Contact
  location: "Philadelphia, PA",
  skills: ["Python", "React", "Node.js", "Machine Learning", "Data Analysis"],

  // Target Opportunities
  target_opportunity_types: ["internship", "co_op"],
  target_industries: ["Technology", "Software"],
  target_roles: ["Software Engineer", "Data Scientist"],

  // Preferences
  preferred_locations: ["San Francisco", "New York", "Remote"],
  remote_preference: "flexible",

  // Platform State
  onboarding_completed: true,
  onboarding_step: 5,

  created_at: "2024-09-15T10:00:00Z",
  updated_at: "2024-11-23T10:00:00Z"
};

export const sampleConnections: Connection[] = [
  {
    id: "conn-1",
    user_id: "user-1",
    linkedin_profile_id: "sarah-chen-123",
    linkedin_url: "https://linkedin.com/in/sarah-chen",
    full_name: "Sarah Chen",
    headline: "Senior Software Engineer at Google",
    current_company: "Google",
    current_role: "Senior Software Engineer",
    profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    connection_date: "2023-01-15",
    mutual_connections: 4,
    same_school: true,
    same_major: true,
    intro_likelihood_score: 95,
    created_at: "2024-09-15T10:00:00Z",
    updated_at: "2024-11-23T10:00:00Z"
  },
  {
    id: "conn-2",
    user_id: "user-1",
    linkedin_profile_id: "jennifer-lee-456",
    linkedin_url: "https://linkedin.com/in/jennifer-lee",
    full_name: "Jennifer Lee",
    headline: "Product Manager at Google Ads",
    current_company: "Google",
    current_role: "Product Manager",
    profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
    connection_date: "2022-06-20",
    mutual_connections: 5,
    same_school: true,
    same_major: true,
    intro_likelihood_score: 98,
    created_at: "2024-09-15T10:00:00Z",
    updated_at: "2024-11-23T10:00:00Z"
  },
  {
    id: "conn-3",
    user_id: "user-1",
    linkedin_profile_id: "mike-johnson-789",
    linkedin_url: "https://linkedin.com/in/mike-johnson",
    full_name: "Mike Johnson",
    headline: "Software Engineer at Meta",
    current_company: "Meta",
    current_role: "Software Engineer",
    profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    connection_date: "2023-09-10",
    mutual_connections: 2,
    same_school: true,
    same_major: false,
    intro_likelihood_score: 75,
    created_at: "2024-09-15T10:00:00Z",
    updated_at: "2024-11-23T10:00:00Z"
  },
  {
    id: "conn-4",
    user_id: "user-1",
    linkedin_profile_id: "emily-wang-321",
    linkedin_url: "https://linkedin.com/in/emily-wang",
    full_name: "Emily Wang",
    headline: "Product Designer at Meta",
    current_company: "Meta",
    current_role: "Product Designer",
    profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    connection_date: "2024-02-14",
    mutual_connections: 6,
    same_school: false,
    same_major: false,
    intro_likelihood_score: 60,
    created_at: "2024-09-15T10:00:00Z",
    updated_at: "2024-11-23T10:00:00Z"
  },
  {
    id: "conn-5",
    user_id: "user-1",
    linkedin_profile_id: "david-kim-654",
    linkedin_url: "https://linkedin.com/in/david-kim",
    full_name: "David Kim",
    headline: "SWE Intern at Amazon",
    current_company: "Amazon",
    current_role: "Software Development Engineer Intern",
    profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    connection_date: "2024-03-05",
    mutual_connections: 8,
    same_school: true,
    same_major: true,
    intro_likelihood_score: 85,
    created_at: "2024-09-15T10:00:00Z",
    updated_at: "2024-11-23T10:00:00Z"
  },
  {
    id: "conn-6",
    user_id: "user-1",
    linkedin_profile_id: "lisa-rodriguez-987",
    linkedin_url: "https://linkedin.com/in/lisa-rodriguez",
    full_name: "Lisa Rodriguez",
    headline: "Data Scientist at Microsoft",
    current_company: "Microsoft",
    current_role: "Data Scientist",
    profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    connection_date: "2023-11-20",
    mutual_connections: 3,
    same_school: true,
    same_major: false,
    intro_likelihood_score: 70,
    created_at: "2024-09-15T10:00:00Z",
    updated_at: "2024-11-23T10:00:00Z"
  }
];

// Updated sample companies with INFO 103 project statuses
export const sampleTargetCompanies: TargetCompany[] = [
  {
    id: "company-1",
    user_id: "user-1",
    company_name: "Google",
    role: "Product Manager Intern",
    job_url: "https://careers.google.com/jobs/pm-intern-2025",
    location: "Mountain View, CA",
    job_description: "Join Google's PM team for Summer 2025...",
    required_skills: ["Product Management", "Data Analysis", "Communication", "Technical Skills"],
    status: "interviewing",
    created_at: "2024-10-15T10:00:00Z",
    updated_at: "2024-11-20T14:30:00Z"
  },
  {
    id: "company-2",
    user_id: "user-1",
    company_name: "Meta",
    role: "Software Engineer Intern",
    job_url: "https://www.metacareers.com/jobs/swe-intern",
    location: "Menlo Park, CA",
    job_description: "Build the future of connection...",
    required_skills: ["Python", "Java", "Data Structures", "Algorithms"],
    status: "applied",
    created_at: "2024-11-01T10:00:00Z",
    updated_at: "2024-11-21T09:15:00Z"
  },
  {
    id: "company-3",
    user_id: "user-1",
    company_name: "Amazon",
    role: "Software Development Engineer Intern",
    job_url: "https://amazon.jobs/en/jobs/sde-intern",
    location: "Seattle, WA",
    job_description: "Work on large-scale distributed systems...",
    required_skills: ["Java", "Python", "System Design", "Problem Solving"],
    status: "thinking",
    created_at: "2024-11-10T10:00:00Z",
    updated_at: "2024-11-22T16:45:00Z"
  },
  {
    id: "company-4",
    user_id: "user-1",
    company_name: "Microsoft",
    role: "Data Science Intern",
    job_url: "https://careers.microsoft.com/data-science-intern",
    location: "Redmond, WA",
    job_description: "Apply ML to real-world problems...",
    required_skills: ["Python", "R", "Machine Learning", "Statistics"],
    status: "applied",
    created_at: "2024-11-05T10:00:00Z",
    updated_at: "2024-11-18T11:20:00Z"
  },
  {
    id: "company-5",
    user_id: "user-1",
    company_name: "Goldman Sachs",
    role: "Technology Analyst Intern",
    job_url: "https://goldmansachs.com/careers/tech-analyst",
    location: "New York, NY",
    job_description: "Build technology that powers global markets...",
    required_skills: ["Java", "C++", "Finance", "Problem Solving"],
    status: "interviewing",
    created_at: "2024-10-25T10:00:00Z",
    updated_at: "2024-11-19T13:00:00Z"
  },
  {
    id: "company-6",
    user_id: "user-1",
    company_name: "Stripe",
    role: "Software Engineering Intern",
    job_url: "https://stripe.com/jobs/software-intern",
    location: "San Francisco, CA",
    job_description: "Help build economic infrastructure...",
    required_skills: ["Ruby", "JavaScript", "APIs", "Databases"],
    status: "applied",
    created_at: "2024-10-01T10:00:00Z",
    updated_at: "2024-10-28T10:00:00Z"
  },
  {
    id: "company-7",
    user_id: "user-1",
    company_name: "Salesforce",
    role: "Product Management Intern",
    job_url: "https://salesforce.com/careers/pm-intern",
    location: "San Francisco, CA",
    job_description: "Drive product strategy for enterprise software...",
    required_skills: ["Product Management", "Salesforce", "Analytics"],
    status: "rejected",
    created_at: "2024-09-20T10:00:00Z",
    updated_at: "2024-10-15T10:00:00Z"
  }
];

export const sampleOutreach: Outreach[] = [
  {
    id: "outreach-1",
    user_id: "user-1",
    target_company_id: "company-1",
    connection_id: "conn-2",
    recipient_name: "Jennifer Lee",
    recipient_linkedin_url: "https://linkedin.com/in/jennifer-lee",
    message_content: `Hi Jennifer,

I saw you're working as a PM at Google Ads—congrats on getting there after Drexel!

I'm a junior at Drexel studying CS, and I'm trying to learn more about the PM internship path, especially since I noticed you transitioned from SWE to PM.

Would you be open to a 15-min call sometime in the next few weeks to share how you made that transition? I'd love to learn from your experience.

Thanks either way,
John Doe
Drexel CS '26`,
    send_method: "linkedin",
    status: "intro_made",
    sent_at: "2024-11-05T09:00:00Z",
    responded_at: "2024-11-06T14:30:00Z",
    intro_made_at: "2024-11-15T10:00:00Z",
    created_at: "2024-11-04T16:00:00Z",
    updated_at: "2024-11-15T10:00:00Z"
  },
  {
    id: "outreach-2",
    user_id: "user-1",
    target_company_id: "company-2",
    connection_id: "conn-3",
    recipient_name: "Mike Johnson",
    recipient_linkedin_url: "https://linkedin.com/in/mike-johnson",
    message_content: `Hey Mike,

Hope you're doing well! I saw you're at Meta now as a Software Engineer.

I'm a CS student at Drexel looking to apply for SWE internships for Summer 2025, and I'd love to learn more about your experience at Meta and what the interview process was like.

Would you have 15 minutes for a quick call in the next week or two? Happy to work around your schedule.

Best,
John`,
    send_method: "linkedin",
    status: "sent",
    sent_at: "2024-11-18T10:00:00Z",
    follow_up_scheduled_at: "2024-11-23T10:00:00Z",
    created_at: "2024-11-17T15:00:00Z",
    updated_at: "2024-11-18T10:00:00Z"
  },
  {
    id: "outreach-3",
    user_id: "user-1",
    target_company_id: "company-3",
    connection_id: "conn-5",
    recipient_name: "David Kim",
    recipient_linkedin_url: "https://linkedin.com/in/david-kim",
    message_content: `Hi David,

Congrats on your SDE internship at Amazon! I saw we're both at Drexel studying CS.

I'm applying for Summer 2025 internships and would love to hear about your experience with Amazon's interview process and what it's like working there.

Could we grab coffee on campus sometime next week? I'd really appreciate any advice you can share.

Thanks!
John`,
    send_method: "linkedin",
    status: "draft",
    created_at: "2024-11-22T14:00:00Z",
    updated_at: "2024-11-22T14:00:00Z"
  },
  {
    id: "outreach-4",
    user_id: "user-1",
    target_company_id: "company-4",
    connection_id: "conn-6",
    recipient_name: "Lisa Rodriguez",
    recipient_linkedin_url: "https://linkedin.com/in/lisa-rodriguez",
    message_content: `Hi Lisa,

I hope this message finds you well! I saw you're a Data Scientist at Microsoft and also went to Drexel.

I'm really interested in data science internships for next summer and would love to learn more about your path from Drexel to Microsoft.

Would you be open to a 15-minute call sometime in the next few weeks?

Thanks so much,
John Doe
Drexel CS '26`,
    send_method: "linkedin",
    status: "sent",
    sent_at: "2024-11-10T11:00:00Z",
    created_at: "2024-11-09T16:00:00Z",
    updated_at: "2024-11-10T11:00:00Z"
  }
];

export const sampleReminders: Reminder[] = [
  {
    id: "reminder-1",
    user_id: "user-1",
    outreach_id: "outreach-1",
    target_company_id: "company-1",
    reminder_type: "send_thank_you",
    reminder_date: "2024-11-23T10:00:00Z",
    message: "Send thank you note to Jennifer after she made the intro",
    completed: false,
    created_at: "2024-11-20T10:00:00Z"
  },
  {
    id: "reminder-2",
    user_id: "user-1",
    outreach_id: "outreach-2",
    target_company_id: "company-2",
    reminder_type: "follow_up",
    reminder_date: "2024-11-23T10:00:00Z",
    message: "Follow up with Mike if no response",
    completed: false,
    created_at: "2024-11-18T10:00:00Z"
  },
  {
    id: "reminder-3",
    user_id: "user-1",
    target_company_id: "company-5",
    reminder_type: "call_prep",
    reminder_date: "2024-11-24T09:00:00Z",
    message: "Prepare for call with Goldman Sachs recruiter tomorrow",
    completed: false,
    created_at: "2024-11-19T15:00:00Z"
  },
  {
    id: "reminder-4",
    user_id: "user-1",
    outreach_id: "outreach-4",
    target_company_id: "company-4",
    reminder_type: "check_response",
    reminder_date: "2024-11-20T10:00:00Z",
    message: "Check if Lisa responded to your message",
    completed: true,
    completed_at: "2024-11-20T11:00:00Z",
    created_at: "2024-11-15T10:00:00Z"
  },
  {
    id: "reminder-5",
    user_id: "user-1",
    target_company_id: "company-3",
    reminder_type: "follow_up",
    reminder_date: "2024-11-25T10:00:00Z",
    message: "Send message to David about Amazon internship",
    completed: false,
    created_at: "2024-11-22T10:00:00Z"
  }
];

export const sampleTimelineEvents: Record<string, TimelineEvent[]> = {
  "company-1": [
    {
      id: "event-1-1",
      type: "message_sent",
      title: "Message sent to Jennifer Lee",
      description: "Reached out to Jennifer for advice on PM path",
      date: "2024-11-05T09:00:00Z",
      metadata: { recipient: "Jennifer Lee" }
    },
    {
      id: "event-1-2",
      type: "response_received",
      title: "Jennifer responded",
      description: "She's open to a call next week!",
      date: "2024-11-06T14:30:00Z",
      metadata: { sender: "Jennifer Lee" }
    },
    {
      id: "event-1-3",
      type: "call_scheduled",
      title: "Call scheduled with Jennifer",
      description: "15-minute informational interview on Tuesday at 2pm",
      date: "2024-11-07T10:00:00Z",
      metadata: { callTime: "2024-11-12T14:00:00Z" }
    },
    {
      id: "event-1-4",
      type: "note_added",
      title: "Call completed",
      description: "Great conversation! Jennifer offered to intro me to Sarah Johnson (PM recruiter)",
      date: "2024-11-12T14:30:00Z"
    },
    {
      id: "event-1-5",
      type: "intro_made",
      title: "Warm introduction made!",
      description: "Jennifer introduced me to Sarah Johnson, Senior PM Recruiter at Google",
      date: "2024-11-15T10:00:00Z",
      metadata: { introducer: "Jennifer Lee", recipient: "Sarah Johnson" }
    },
    {
      id: "event-1-6",
      type: "status_changed",
      title: "Status updated to Interviewing",
      description: "Path successfully created to hiring manager",
      date: "2024-11-15T10:05:00Z"
    }
  ],
  "company-2": [
    {
      id: "event-2-1",
      type: "message_sent",
      title: "Message sent to Mike Johnson",
      description: "Asked about Meta SWE internship experience",
      date: "2024-11-18T10:00:00Z",
      metadata: { recipient: "Mike Johnson" }
    },
    {
      id: "event-2-2",
      type: "note_added",
      title: "Follow-up scheduled",
      description: "Will follow up on Nov 23 if no response",
      date: "2024-11-18T10:05:00Z"
    }
  ],
  "company-3": [
    {
      id: "event-3-1",
      type: "note_added",
      title: "Draft message created",
      description: "Ready to send to David Kim (Drexel alum at Amazon)",
      date: "2024-11-22T14:00:00Z"
    }
  ]
};

export const sampleNotes: Record<string, Note[]> = {
  "company-1": [
    {
      id: "note-1-1",
      target_company_id: "company-1",
      user_id: "user-1",
      content: "Jennifer mentioned that Google PM interviews focus heavily on product sense and analytical thinking. She recommended practicing case studies.",
      created_at: "2024-11-12T15:00:00Z",
      updated_at: "2024-11-12T15:00:00Z"
    },
    {
      id: "note-1-2",
      target_company_id: "company-1",
      user_id: "user-1",
      content: "Sarah Johnson (recruiter) wants to schedule a screening call next week. Need to prepare resume and practice intro.",
      created_at: "2024-11-16T10:00:00Z",
      updated_at: "2024-11-16T10:00:00Z"
    }
  ]
};

// Simplified UserStats for INFO 103 project (no gamification)
export const sampleUserStats: UserStats = {
  totalApplications: 7,
  applied: 3,
  interviewing: 2,
  offers: 0,
  rejected: 1,
  upcomingDeadlines: 2,
  tasksDue: 3
};

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
  email: "ethan.bailine@drexel.edu",
  full_name: "Ethan Bailine",
  profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
  headline: "Computer Science Student at Drexel University",

  // Career Stage Information
  career_stage: "undergrad",
  school: "Drexel University",
  major: "Computer Science",
  degree_type: "BS",
  graduation_year: 2026,

  // Location & Contact
  location: "Philadelphia, PA",
  skills: ["Python", "React", "Node.js", "TypeScript", "Data Analysis"],

  // Target Opportunities
  target_opportunity_types: ["internship", "co_op"],
  target_industries: ["Technology", "Software"],
  target_roles: ["Software Engineer", "Product Manager"],

  // Preferences
  preferred_locations: ["San Francisco", "New York", "Remote"],
  remote_preference: "flexible",

  // Platform State
  onboarding_completed: true,
  onboarding_step: 5,

  created_at: "2025-09-15T10:00:00Z",
  updated_at: "2025-12-03T10:00:00Z"
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
    connection_date: "2024-01-15",
    email: "sarah.chen@gmail.com",
    how_you_know: "Met at Drexel CS career fair, she was on the alumni panel",
    mutual_connections: 4,
    same_school: true,
    same_major: true,
    intro_likelihood_score: 0,
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
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
    connection_date: "2024-06-20",
    email: "jlee.pm@gmail.com",
    phone: "(215) 555-0123",
    how_you_know: "Introduced by Professor Williams after INFO 103 guest lecture",
    mutual_connections: 5,
    same_school: true,
    same_major: true,
    intro_likelihood_score: 0,
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
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
    connection_date: "2025-09-10",
    how_you_know: "My older brother's roommate from college",
    mutual_connections: 2,
    same_school: true,
    same_major: false,
    intro_likelihood_score: 0,
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
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
    connection_date: "2025-02-14",
    email: "emily.wang.design@gmail.com",
    how_you_know: "Met at Philadelphia Tech Meetup",
    mutual_connections: 6,
    same_school: false,
    same_major: false,
    intro_likelihood_score: 0,
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
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
    connection_date: "2025-03-05",
    email: "davidkim@drexel.edu",
    phone: "(267) 555-0456",
    how_you_know: "Classmate in CCI 101, we studied together for finals",
    mutual_connections: 8,
    same_school: true,
    same_major: true,
    intro_likelihood_score: 0,
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
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
    connection_date: "2024-11-20",
    how_you_know: "Speaker at Drexel Women in Tech event",
    mutual_connections: 3,
    same_school: true,
    same_major: false,
    intro_likelihood_score: 0,
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
  }
];

// Updated sample companies with INFO 103 project statuses and deadlines
export const sampleTargetCompanies: TargetCompany[] = [
  {
    id: "company-1",
    user_id: "user-1",
    company_name: "Google",
    role: "Software Engineering Intern",
    job_url: "https://careers.google.com/jobs/swe-intern-2025",
    location: "Mountain View, CA",
    job_description: "Join Google's engineering team for Summer 2025. Work on large-scale distributed systems, machine learning, or consumer products.",
    required_skills: ["Python", "Java", "Data Structures", "Algorithms"],
    status: "interviewing",
    application_deadline: "2025-12-15",
    created_at: "2025-10-15T10:00:00Z",
    updated_at: "2025-12-01T14:30:00Z"
  },
  {
    id: "company-2",
    user_id: "user-1",
    company_name: "Meta",
    role: "Software Engineer Intern",
    job_url: "https://www.metacareers.com/jobs/swe-intern",
    location: "Menlo Park, CA",
    job_description: "Build the future of connection. Work on Instagram, WhatsApp, or Reality Labs projects.",
    required_skills: ["Python", "React", "Data Structures", "Algorithms"],
    status: "applied",
    application_deadline: "2025-12-20",
    created_at: "2025-11-01T10:00:00Z",
    updated_at: "2025-11-28T09:15:00Z"
  },
  {
    id: "company-3",
    user_id: "user-1",
    company_name: "Amazon",
    role: "Software Development Engineer Intern",
    job_url: "https://amazon.jobs/en/jobs/sde-intern",
    location: "Seattle, WA",
    job_description: "Work on large-scale distributed systems powering AWS, retail, or Alexa.",
    required_skills: ["Java", "Python", "System Design", "Problem Solving"],
    status: "thinking",
    application_deadline: "2025-12-31",
    created_at: "2025-11-10T10:00:00Z",
    updated_at: "2025-12-02T16:45:00Z"
  },
  {
    id: "company-4",
    user_id: "user-1",
    company_name: "Microsoft",
    role: "Software Engineering Intern",
    job_url: "https://careers.microsoft.com/swe-intern",
    location: "Redmond, WA",
    job_description: "Build products used by billions. Teams include Azure, Office, Windows, Xbox, and more.",
    required_skills: ["C#", "Python", "Cloud Computing", "TypeScript"],
    status: "applied",
    application_deadline: "2025-12-10",
    created_at: "2025-11-05T10:00:00Z",
    updated_at: "2025-11-25T11:20:00Z"
  },
  {
    id: "company-5",
    user_id: "user-1",
    company_name: "Stripe",
    role: "Software Engineering Intern",
    job_url: "https://stripe.com/jobs/software-intern",
    location: "San Francisco, CA",
    job_description: "Help build economic infrastructure for the internet. Work on payments, APIs, and developer tools.",
    required_skills: ["Ruby", "JavaScript", "APIs", "Databases"],
    status: "thinking",
    application_deadline: "2025-12-18",
    created_at: "2025-11-20T10:00:00Z",
    updated_at: "2025-12-01T10:00:00Z"
  },
  {
    id: "company-6",
    user_id: "user-1",
    company_name: "Comcast",
    role: "Technology Co-op",
    job_url: "https://jobs.comcast.com/tech-coop",
    location: "Philadelphia, PA",
    job_description: "6-month co-op working on streaming technology, network infrastructure, or enterprise software. Great for Drexel students!",
    required_skills: ["Python", "JavaScript", "SQL", "Agile"],
    status: "interviewing",
    application_deadline: "2025-12-08",
    created_at: "2025-10-25T10:00:00Z",
    updated_at: "2025-12-03T13:00:00Z"
  },
  {
    id: "company-7",
    user_id: "user-1",
    company_name: "Vanguard",
    role: "Technology Intern",
    job_url: "https://www.vanguardjobs.com/tech-intern",
    location: "Malvern, PA",
    job_description: "Work on fintech solutions for one of the world's largest investment companies. Close to Drexel campus.",
    required_skills: ["Java", "Python", "Finance", "Data Analysis"],
    status: "rejected",
    application_deadline: "2025-11-15",
    created_at: "2025-09-20T10:00:00Z",
    updated_at: "2025-11-20T10:00:00Z"
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

I saw you're working as a PM at Google Ads. Thank you again for your great talk at INFO 103!

I'm applying for the SWE intern position at Google and would love to hear about your experience with the interview process.

Would you be open to a 15-min call sometime in the next few weeks?

Thanks,
Ethan`,
    send_method: "linkedin",
    status: "responded",
    sent_at: "2025-11-05T09:00:00Z",
    responded_at: "2025-11-06T14:30:00Z",
    created_at: "2025-11-04T16:00:00Z",
    updated_at: "2025-11-15T10:00:00Z"
  },
  {
    id: "outreach-2",
    user_id: "user-1",
    target_company_id: "company-2",
    connection_id: "conn-3",
    recipient_name: "Mike Johnson",
    recipient_linkedin_url: "https://linkedin.com/in/mike-johnson",
    message_content: `Hey Mike,

Hope you're doing well! I heard from my brother that you're at Meta now.

I'm applying for SWE internships for Summer 2025 and would love to learn more about your experience at Meta.

Do you have 15 minutes for a quick call?

Best,
Ethan`,
    send_method: "linkedin",
    status: "sent",
    sent_at: "2025-11-28T10:00:00Z",
    follow_up_scheduled_at: "2025-12-05T10:00:00Z",
    created_at: "2025-11-27T15:00:00Z",
    updated_at: "2025-11-28T10:00:00Z"
  }
];

export const sampleReminders: Reminder[] = [
  {
    id: "reminder-1",
    user_id: "user-1",
    target_company_id: "company-1",
    reminder_type: "call_prep",
    reminder_date: "2025-12-05T09:00:00Z",
    message: "Prepare for Google technical phone screen - review data structures",
    completed: false,
    created_at: "2025-12-01T10:00:00Z"
  },
  {
    id: "reminder-2",
    user_id: "user-1",
    outreach_id: "outreach-2",
    target_company_id: "company-2",
    reminder_type: "follow_up",
    reminder_date: "2025-12-05T10:00:00Z",
    message: "Follow up with Mike if no response about Meta",
    completed: false,
    created_at: "2025-11-28T10:00:00Z"
  },
  {
    id: "reminder-3",
    user_id: "user-1",
    target_company_id: "company-6",
    reminder_type: "call_prep",
    reminder_date: "2025-12-06T09:00:00Z",
    message: "Prepare for Comcast interview - research their streaming tech",
    completed: false,
    created_at: "2025-12-03T15:00:00Z"
  },
  {
    id: "reminder-4",
    user_id: "user-1",
    target_company_id: "company-4",
    reminder_type: "check_response",
    reminder_date: "2025-12-03T10:00:00Z",
    message: "Check Microsoft application portal for updates",
    completed: true,
    completed_at: "2025-12-03T11:00:00Z",
    created_at: "2025-11-30T10:00:00Z"
  },
  {
    id: "reminder-5",
    user_id: "user-1",
    target_company_id: "company-3",
    reminder_type: "follow_up",
    reminder_date: "2025-12-08T10:00:00Z",
    message: "Finish Amazon application before deadline",
    completed: false,
    created_at: "2025-12-02T10:00:00Z"
  }
];

export const sampleTimelineEvents: Record<string, TimelineEvent[]> = {
  "company-1": [
    {
      id: "event-1-1",
      type: "status_changed",
      title: "Added to tracker",
      description: "Started tracking Google SWE internship",
      date: "2025-10-15T10:00:00Z"
    },
    {
      id: "event-1-2",
      type: "message_sent",
      title: "Reached out to Jennifer Lee",
      description: "Asked for advice about Google interview process",
      date: "2025-11-05T09:00:00Z",
      metadata: { recipient: "Jennifer Lee" }
    },
    {
      id: "event-1-3",
      type: "response_received",
      title: "Jennifer responded",
      description: "She agreed to a call and shared some tips",
      date: "2025-11-06T14:30:00Z",
      metadata: { sender: "Jennifer Lee" }
    },
    {
      id: "event-1-4",
      type: "status_changed",
      title: "Status updated to Applied",
      description: "Submitted online application",
      date: "2025-11-15T10:00:00Z"
    },
    {
      id: "event-1-5",
      type: "status_changed",
      title: "Status updated to Interviewing",
      description: "Phone screen scheduled for next week!",
      date: "2025-12-01T14:30:00Z"
    }
  ],
  "company-2": [
    {
      id: "event-2-1",
      type: "status_changed",
      title: "Added to tracker",
      description: "Started tracking Meta SWE internship",
      date: "2025-11-01T10:00:00Z"
    },
    {
      id: "event-2-2",
      type: "status_changed",
      title: "Status updated to Applied",
      description: "Application submitted online",
      date: "2025-11-15T10:00:00Z"
    },
    {
      id: "event-2-3",
      type: "message_sent",
      title: "Reached out to Mike Johnson",
      description: "Asked about Meta interview experience",
      date: "2025-11-28T10:00:00Z",
      metadata: { recipient: "Mike Johnson" }
    }
  ],
  "company-6": [
    {
      id: "event-6-1",
      type: "status_changed",
      title: "Added to tracker",
      description: "Started tracking Comcast co-op",
      date: "2025-10-25T10:00:00Z"
    },
    {
      id: "event-6-2",
      type: "status_changed",
      title: "Status updated to Applied",
      description: "Applied through Drexel Steinbright",
      date: "2025-11-01T10:00:00Z"
    },
    {
      id: "event-6-3",
      type: "status_changed",
      title: "Status updated to Interviewing",
      description: "Recruiter reached out for interview!",
      date: "2025-12-03T13:00:00Z"
    }
  ]
};

export const sampleNotes: Record<string, Note[]> = {
  "company-1": [
    {
      id: "note-1-1",
      target_company_id: "company-1",
      user_id: "user-1",
      content: "Jennifer mentioned that Google interviews focus heavily on coding and system design. She recommended practicing on LeetCode - especially medium difficulty problems.",
      created_at: "2025-11-08T15:00:00Z",
      updated_at: "2025-11-08T15:00:00Z"
    },
    {
      id: "note-1-2",
      target_company_id: "company-1",
      user_id: "user-1",
      content: "Phone screen scheduled for Dec 8th at 2pm EST. Need to set up quiet space and test video/audio before.",
      created_at: "2025-12-01T16:00:00Z",
      updated_at: "2025-12-01T16:00:00Z"
    }
  ],
  "company-6": [
    {
      id: "note-6-1",
      target_company_id: "company-6",
      user_id: "user-1",
      content: "Comcast is great for Drexel co-ops - they have a strong relationship with the school. Interview will be behavioral + technical. Research their Xfinity streaming platform.",
      created_at: "2025-12-03T14:00:00Z",
      updated_at: "2025-12-03T14:00:00Z"
    }
  ]
};

// Simplified UserStats for INFO 103 project (no gamification)
export const sampleUserStats: UserStats = {
  totalApplications: 7,
  applied: 2,
  interviewing: 2,
  offers: 0,
  rejected: 1,
  upcomingDeadlines: 3,
  tasksDue: 4
};

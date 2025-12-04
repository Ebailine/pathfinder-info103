import {
  User,
  Connection,
  TargetCompany,
  Outreach,
  Reminder,
  TimelineEvent,
  Note,
  UserStats,
  Interaction
} from './types';

export const sampleUser: User = {
  id: "user-1",
  email: "ethan.bailine@drexel.edu",
  full_name: "Ethan Bailine",
  profile_photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
  headline: "Computer Science Student at Drexel University",
  career_stage: "undergrad",
  school: "Drexel University",
  major: "Computer Science",
  degree_type: "BS",
  graduation_year: 2026,
  location: "Philadelphia, PA",
  skills: ["Python", "React", "Node.js", "TypeScript", "Data Analysis"],
  target_opportunity_types: ["internship", "co_op"],
  target_industries: ["Technology", "Software"],
  target_roles: ["Software Engineer", "Product Manager"],
  preferred_locations: ["San Francisco", "New York", "Remote"],
  remote_preference: "flexible",
  onboarding_completed: true,
  onboarding_step: 5,
  created_at: "2025-09-15T10:00:00Z",
  updated_at: "2025-12-03T10:00:00Z"
};

export const sampleConnections: Connection[] = [
  {
    id: "conn-1",
    user_id: "user-1",
    linkedin_url: "https://linkedin.com/in/sarah-chen",
    full_name: "Sarah Chen",
    headline: "Senior Software Engineer at Google",
    current_company: "Google",
    current_role: "Senior Software Engineer",
    connection_date: "2024-01-15",
    email: "sarah.chen@gmail.com",
    how_you_know: "Met at Drexel CS career fair, she was on the alumni panel",
    mutual_connections: 4,
    same_school: true,
    same_major: true,
    intro_likelihood_score: 0,
    linked_application_ids: ["company-1"],
    last_contacted: "2025-11-20T14:00:00Z",
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
  },
  {
    id: "conn-2",
    user_id: "user-1",
    linkedin_url: "https://linkedin.com/in/jennifer-lee",
    full_name: "Jennifer Lee",
    headline: "Product Manager at Google Ads",
    current_company: "Google",
    current_role: "Product Manager",
    connection_date: "2024-06-20",
    email: "jlee.pm@gmail.com",
    phone: "(215) 555-0123",
    how_you_know: "Introduced by Professor Williams after INFO 103 guest lecture",
    mutual_connections: 5,
    same_school: true,
    same_major: true,
    intro_likelihood_score: 0,
    linked_application_ids: ["company-1"],
    last_contacted: "2025-12-01T10:00:00Z",
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
  },
  {
    id: "conn-3",
    user_id: "user-1",
    linkedin_url: "https://linkedin.com/in/mike-johnson",
    full_name: "Mike Johnson",
    headline: "Software Engineer at Meta",
    current_company: "Meta",
    current_role: "Software Engineer",
    connection_date: "2025-09-10",
    how_you_know: "My older brother's roommate from college",
    mutual_connections: 2,
    same_school: true,
    same_major: false,
    intro_likelihood_score: 0,
    linked_application_ids: ["company-2"],
    last_contacted: "2025-11-28T10:00:00Z",
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
  },
  {
    id: "conn-4",
    user_id: "user-1",
    linkedin_url: "https://linkedin.com/in/emily-wang",
    full_name: "Emily Wang",
    headline: "Product Designer at Meta",
    current_company: "Meta",
    current_role: "Product Designer",
    connection_date: "2025-02-14",
    email: "emily.wang.design@gmail.com",
    how_you_know: "Met at Philadelphia Tech Meetup",
    mutual_connections: 6,
    same_school: false,
    same_major: false,
    intro_likelihood_score: 0,
    linked_application_ids: ["company-2"],
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
  },
  {
    id: "conn-5",
    user_id: "user-1",
    linkedin_url: "https://linkedin.com/in/david-kim",
    full_name: "David Kim",
    headline: "SWE Intern at Amazon",
    current_company: "Amazon",
    current_role: "Software Development Engineer Intern",
    connection_date: "2025-03-05",
    email: "davidkim@drexel.edu",
    phone: "(267) 555-0456",
    how_you_know: "Classmate in CCI 101, we studied together for finals",
    mutual_connections: 8,
    same_school: true,
    same_major: true,
    intro_likelihood_score: 0,
    linked_application_ids: ["company-3"],
    last_contacted: "2025-11-15T09:00:00Z",
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
  },
  {
    id: "conn-6",
    user_id: "user-1",
    linkedin_url: "https://linkedin.com/in/lisa-rodriguez",
    full_name: "Lisa Rodriguez",
    headline: "Data Scientist at Microsoft",
    current_company: "Microsoft",
    current_role: "Data Scientist",
    connection_date: "2024-11-20",
    how_you_know: "Speaker at Drexel Women in Tech event",
    mutual_connections: 3,
    same_school: true,
    same_major: false,
    intro_likelihood_score: 0,
    linked_application_ids: ["company-4"],
    created_at: "2025-09-15T10:00:00Z",
    updated_at: "2025-12-03T10:00:00Z"
  }
];

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
    linked_contact_ids: ["conn-1", "conn-2"],
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
    linked_contact_ids: ["conn-3", "conn-4"],
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
    application_deadline: "2025-12-10",
    linked_contact_ids: ["conn-5"],
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
    application_deadline: "2025-12-08",
    linked_contact_ids: ["conn-6"],
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
    job_description: "6-month co-op working on streaming technology, network infrastructure, or enterprise software.",
    required_skills: ["Python", "JavaScript", "SQL", "Agile"],
    status: "interviewing",
    application_deadline: "2025-12-05",
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
    job_description: "Work on fintech solutions for one of the world's largest investment companies.",
    required_skills: ["Java", "Python", "Finance", "Data Analysis"],
    status: "rejected",
    application_deadline: "2025-11-15",
    created_at: "2025-09-20T10:00:00Z",
    updated_at: "2025-11-20T10:00:00Z"
  }
];

// NEW: Sample interactions for logging contact interactions
export const sampleInteractions: Interaction[] = [
  {
    id: "int-1",
    user_id: "user-1",
    connection_id: "conn-2",
    target_company_id: "company-1",
    type: "informational_interview",
    title: "30-min call with Jennifer",
    description: "Had a great call with Jennifer about the PM career path at Google. She shared tips about the interview process and offered to refer me to the recruiter.",
    date: "2025-12-01T10:00:00Z",
    follow_up_needed: true,
    follow_up_date: "2025-12-08T10:00:00Z",
    created_at: "2025-12-01T10:30:00Z"
  },
  {
    id: "int-2",
    user_id: "user-1",
    connection_id: "conn-1",
    target_company_id: "company-1",
    type: "email_sent",
    title: "Sent follow-up email to Sarah",
    description: "Thanked Sarah for connecting me with Jennifer and asked about her experience on the Ads team.",
    date: "2025-11-20T14:00:00Z",
    follow_up_needed: false,
    created_at: "2025-11-20T14:00:00Z"
  },
  {
    id: "int-3",
    user_id: "user-1",
    connection_id: "conn-3",
    target_company_id: "company-2",
    type: "linkedin_message",
    title: "LinkedIn message to Mike",
    description: "Reached out to ask about Meta's interview process and his experience on the team.",
    date: "2025-11-28T10:00:00Z",
    follow_up_needed: true,
    follow_up_date: "2025-12-05T10:00:00Z",
    created_at: "2025-11-28T10:00:00Z"
  },
  {
    id: "int-4",
    user_id: "user-1",
    connection_id: "conn-5",
    target_company_id: "company-3",
    type: "coffee_chat",
    title: "Coffee with David on campus",
    description: "Met with David at the Drexel library cafe. He shared his Amazon interview experience and what the internship is like. Said he can pass my resume to his manager.",
    date: "2025-11-15T09:00:00Z",
    follow_up_needed: true,
    follow_up_date: "2025-12-01T10:00:00Z",
    created_at: "2025-11-15T10:00:00Z"
  },
  {
    id: "int-5",
    user_id: "user-1",
    connection_id: "conn-2",
    target_company_id: "company-1",
    type: "referral_received",
    title: "Jennifer submitted referral!",
    description: "Jennifer submitted my referral to the Google recruiting team. She said I should hear back within 1-2 weeks.",
    date: "2025-12-02T15:00:00Z",
    follow_up_needed: false,
    created_at: "2025-12-02T15:00:00Z"
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
    message_content: "Hi Jennifer, Thank you for your great talk at INFO 103! I'm applying for the SWE intern position at Google and would love to hear about your experience. Would you be open to a 15-min call?",
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
    message_content: "Hey Mike, Hope you're doing well! I heard you're at Meta now. I'm applying for SWE internships and would love to learn more about your experience. Do you have 15 minutes?",
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
    connection_id: "conn-2",
    reminder_type: "send_thank_you",
    reminder_date: "2025-12-08T09:00:00Z",
    message: "Send thank-you email to Jennifer for the referral",
    completed: false,
    created_at: "2025-12-02T10:00:00Z"
  },
  {
    id: "reminder-2",
    user_id: "user-1",
    target_company_id: "company-2",
    connection_id: "conn-3",
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
    reminder_date: "2025-12-04T09:00:00Z",
    message: "Prepare for Comcast interview - research their streaming tech",
    completed: false,
    created_at: "2025-12-03T15:00:00Z"
  },
  {
    id: "reminder-4",
    user_id: "user-1",
    target_company_id: "company-3",
    reminder_type: "apply",
    reminder_date: "2025-12-08T10:00:00Z",
    message: "Submit Amazon application before Dec 10 deadline",
    completed: false,
    created_at: "2025-12-02T10:00:00Z"
  },
  {
    id: "reminder-5",
    user_id: "user-1",
    target_company_id: "company-4",
    reminder_type: "check_response",
    reminder_date: "2025-12-03T10:00:00Z",
    message: "Check Microsoft application portal for updates",
    completed: true,
    completed_at: "2025-12-03T11:00:00Z",
    created_at: "2025-11-30T10:00:00Z"
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
      type: "interaction",
      title: "Sent follow-up email to Sarah",
      description: "Thanked Sarah for connecting me with Jennifer",
      date: "2025-11-20T14:00:00Z"
    },
    {
      id: "event-1-3",
      type: "status_changed",
      title: "Status updated to Applied",
      description: "Submitted online application",
      date: "2025-11-15T10:00:00Z"
    },
    {
      id: "event-1-4",
      type: "interaction",
      title: "30-min call with Jennifer",
      description: "Had a great call about the PM career path at Google",
      date: "2025-12-01T10:00:00Z"
    },
    {
      id: "event-1-5",
      type: "interaction",
      title: "Jennifer submitted referral!",
      description: "Jennifer submitted my referral to Google recruiting",
      date: "2025-12-02T15:00:00Z"
    },
    {
      id: "event-1-6",
      type: "status_changed",
      title: "Status updated to Interviewing",
      description: "Phone screen scheduled!",
      date: "2025-12-03T14:30:00Z"
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
      type: "interaction",
      title: "LinkedIn message to Mike",
      description: "Reached out about Meta interview process",
      date: "2025-11-28T10:00:00Z"
    }
  ],
  "company-3": [
    {
      id: "event-3-1",
      type: "status_changed",
      title: "Added to tracker",
      description: "Started tracking Amazon SDE internship",
      date: "2025-11-10T10:00:00Z"
    },
    {
      id: "event-3-2",
      type: "interaction",
      title: "Coffee with David on campus",
      description: "Met at Drexel library cafe to discuss Amazon",
      date: "2025-11-15T09:00:00Z"
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
      type: "application_submitted",
      title: "Applied through Steinbright",
      description: "Submitted application through Drexel's co-op portal",
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
      content: "Phone screen scheduled for Dec 10th at 2pm EST. Need to set up quiet space and test video/audio before.",
      created_at: "2025-12-03T16:00:00Z",
      updated_at: "2025-12-03T16:00:00Z"
    }
  ],
  "company-3": [
    {
      id: "note-3-1",
      target_company_id: "company-3",
      user_id: "user-1",
      content: "David said Amazon focuses on leadership principles in behavioral interviews. Should prepare STAR format stories for each principle.",
      created_at: "2025-11-15T10:00:00Z",
      updated_at: "2025-11-15T10:00:00Z"
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

export const sampleUserStats: UserStats = {
  totalApplications: 7,
  applied: 2,
  interviewing: 2,
  offers: 0,
  rejected: 1,
  upcomingDeadlines: 4,
  tasksDue: 4
};

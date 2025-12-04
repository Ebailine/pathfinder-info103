# UI/UX IMPROVEMENT MEGA PROMPTS
## PathFinder CRM - INFO 103 Project

**Purpose:** These mega prompts provide detailed, step-by-step instructions to transform each page of PathFinder CRM into a polished, professional-looking application that matches the project description exactly.

**How to Use:** Execute each mega prompt in order. Each prompt is self-contained and can be given to Claude Code to implement the changes.

---

# TABLE OF CONTENTS

1. [MEGA PROMPT 1: Dashboard Page Overhaul](#mega-prompt-1-dashboard-page-overhaul)
2. [MEGA PROMPT 2: Add Application Form](#mega-prompt-2-add-application-form)
3. [MEGA PROMPT 3: Application Detail Page](#mega-prompt-3-application-detail-page)
4. [MEGA PROMPT 4: Create Contacts List Page](#mega-prompt-4-create-contacts-list-page)
5. [MEGA PROMPT 5: Contact Detail Page](#mega-prompt-5-contact-detail-page)
6. [MEGA PROMPT 6: Reminders/Tasks Page](#mega-prompt-6-reminderstasks-page)
7. [MEGA PROMPT 7: Navigation & Global Components](#mega-prompt-7-navigation--global-components)
8. [MEGA PROMPT 8: Sample Data & Final Polish](#mega-prompt-8-sample-data--final-polish)

---

# MEGA PROMPT 1: Dashboard Page Overhaul

## Goal
Transform the dashboard into a clean, professional job application tracker that shows applications grouped by status with clear metrics and easy navigation.

## Files to Modify
- `/app/dashboard/page.tsx`
- `/components/StatsHero.tsx`
- `/components/CompanyPipelineCard.tsx`
- `/components/QuickActions.tsx`

## Detailed Instructions

### 1.1 Update Page Header
**File:** `app/dashboard/page.tsx`

```tsx
// CHANGE THIS:
<h1 className="text-2xl font-bold text-gray-900">PathFinder CRM</h1>
<p className="text-sm text-gray-600 mt-1">
  Manage your warm introduction pipeline
</p>

// TO THIS:
<h1 className="text-2xl font-bold text-gray-900">Job Application Tracker</h1>
<p className="text-sm text-gray-600 mt-1">
  Track your internship and job applications in one place
</p>
```

Change button text:
```tsx
// CHANGE:
<span>Add Company</span>

// TO:
<span>Add Application</span>
```

### 1.2 Redesign Stats Hero
**File:** `components/StatsHero.tsx`

Create a clean, card-based stats display:

```tsx
"use client";

import { useCRMStore } from "@/lib/store";
import {
  Briefcase,
  Send,
  Users,
  Trophy,
  Calendar,
  CheckSquare
} from "lucide-react";

export function StatsHero() {
  const stats = useCRMStore((state) => state.stats);
  const companies = useCRMStore((state) => state.companies);
  const reminders = useCRMStore((state) => state.reminders);

  // Calculate real stats from data
  const totalApps = companies.length;
  const appliedCount = companies.filter(c => c.status === 'applied').length;
  const interviewingCount = companies.filter(c => c.status === 'interviewing').length;
  const offerCount = companies.filter(c => c.status === 'offer').length;
  const tasksDue = reminders.filter(r => !r.completed).length;

  const statCards = [
    {
      label: "Total Applications",
      value: totalApps,
      icon: Briefcase,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      label: "Applied",
      value: appliedCount,
      icon: Send,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700"
    },
    {
      label: "Interviewing",
      value: interviewingCount,
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      label: "Offers",
      value: offerCount,
      icon: Trophy,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      label: "Tasks Due",
      value: tasksDue,
      icon: CheckSquare,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bgColor} rounded-xl p-4 border border-gray-100`}
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
          </div>
          <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
          <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
```

### 1.3 Improve Application Cards
**File:** `components/CompanyPipelineCard.tsx`

Simplify the card design:

1. **Remove** the "CONNECTION PATH" visualization entirely
2. **Simplify** the card to show:
   - Company name (large)
   - Role title
   - Location
   - Status badge
   - Date added
   - "Next Action" text
   - Action buttons

3. **Add deadline display** if deadline exists:
```tsx
{company.application_deadline && (
  <div className="flex items-center text-sm text-gray-600 mt-2">
    <Calendar className="h-4 w-4 mr-1" />
    <span>Deadline: {formatDate(company.application_deadline, "MMM d, yyyy")}</span>
  </div>
)}
```

4. **Update Next Action logic:**
```tsx
const getNextAction = () => {
  switch (company.status) {
    case "thinking":
      return "Research company and prepare application";
    case "applied":
      return "Wait for response or follow up";
    case "interviewing":
      return "Prepare for upcoming interview";
    case "offer":
      return "Review and respond to offer";
    case "rejected":
      return "Move on to other opportunities";
    default:
      return "Update application status";
  }
};
```

### 1.4 Update Quick Actions Sidebar
**File:** `components/QuickActions.tsx`

Add "Upcoming Deadlines" section:

```tsx
// Add above the Reminders section:
{/* Upcoming Deadlines */}
<div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
    <Calendar className="h-5 w-5 mr-2 text-red-600" />
    Upcoming Deadlines
  </h3>

  {companiesWithDeadlines.length > 0 ? (
    <div className="space-y-3">
      {companiesWithDeadlines.slice(0, 3).map((company) => (
        <div key={company.id} className="p-3 bg-red-50 rounded-lg border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-gray-900">{company.company_name}</p>
          <p className="text-xs text-gray-600">{company.role}</p>
          <p className="text-xs text-red-600 mt-1">
            {formatDate(company.application_deadline, "MMM d")}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500 text-center py-4">
      No upcoming deadlines
    </p>
  )}
</div>
```

### 1.5 Add Status Grouping View (Optional Enhancement)

Add a toggle to view applications grouped by status:

```tsx
const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');

// Add toggle button in filter bar
<div className="flex items-center space-x-2">
  <button
    onClick={() => setViewMode('list')}
    className={`px-3 py-1.5 text-sm rounded-lg ${
      viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
    }`}
  >
    List View
  </button>
  <button
    onClick={() => setViewMode('grouped')}
    className={`px-3 py-1.5 text-sm rounded-lg ${
      viewMode === 'grouped' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
    }`}
  >
    By Status
  </button>
</div>
```

## Expected Result
A clean dashboard showing:
- Professional header with "Job Application Tracker" title
- 5 stat cards in a row (Total, Applied, Interviewing, Offers, Tasks Due)
- Search and filter bar
- Application cards without complex visualizations
- Sidebar with deadlines and reminders

---

# MEGA PROMPT 2: Add Application Form

## Goal
Create a comprehensive, user-friendly form for adding new job applications with all required fields from the project description.

## Files to Modify
- `/app/companies/new/page.tsx`
- `/lib/types.ts`

## Detailed Instructions

### 2.1 Add Deadline Field to Type
**File:** `lib/types.ts`

```tsx
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
  application_deadline?: string;  // ADD THIS LINE
  created_at: string;
  updated_at: string;
}
```

### 2.2 Redesign the Form
**File:** `app/companies/new/page.tsx`

Complete redesign with better organization:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import { TargetCompany } from "@/lib/types";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  MapPin,
  Link as LinkIcon,
  FileText,
  Tag,
  Calendar,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

export default function NewApplicationPage() {
  const router = useRouter();
  const addCompany = useCRMStore((state) => state.addCompany);

  const [formData, setFormData] = useState({
    company_name: "",
    role: "",
    job_url: "",
    location: "",
    job_description: "",
    required_skills: [] as string[],
    skillInput: "",
    application_deadline: "",
    status: "thinking" as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ... validation functions ...

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const newApplication: TargetCompany = {
      id: `app-${Date.now()}`,
      user_id: "user-1",
      company_name: formData.company_name.trim(),
      role: formData.role.trim(),
      job_url: formData.job_url.trim() || undefined,
      location: formData.location.trim() || undefined,
      job_description: formData.job_description.trim() || undefined,
      required_skills: formData.required_skills,
      application_deadline: formData.application_deadline || undefined,
      status: formData.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addCompany(newApplication);
    toast.success(`${formData.company_name} added to your tracker!`);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Application</h1>
              <p className="text-sm text-gray-600 mt-1">
                Track a new job or internship opportunity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Basic Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Google, Amazon, etc."
                  />
                </div>
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.company_name}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role/Position *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Software Engineer Intern"
                  />
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="New York, NY or Remote"
                  />
                </div>
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="application_deadline"
                    value={formData.application_deadline}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Job URL */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Posting URL
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  name="job_url"
                  value={formData.job_url}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Status Selection Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Current Status
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { value: "thinking", label: "Thinking About It", color: "gray" },
                { value: "applied", label: "Applied", color: "blue" },
                { value: "interviewing", label: "Interviewing", color: "purple" },
                { value: "offer", label: "Offer", color: "green" },
                { value: "rejected", label: "Rejected", color: "red" }
              ].map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: status.value as any }))}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.status === status.value
                      ? `border-${status.color}-500 bg-${status.color}-50 text-${status.color}-700`
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Job Details
            </h2>

            {/* Job Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Paste or type key details about the role..."
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="skillInput"
                    value={formData.skillInput}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Python, React, SQL..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {formData.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## Expected Result
A clean, organized form with:
- Clear section groupings (Basic Info, Status, Details)
- Date picker for application deadline
- Visual status selector
- Proper validation and error messages

---

# MEGA PROMPT 3: Application Detail Page

## Goal
Create a comprehensive application detail view showing all relevant information, timeline, notes, and related contacts.

## Files to Modify
- `/app/company/[id]/page.tsx`

## Detailed Instructions

### 3.1 Clean Layout Structure

The page should have:
1. **Header Section:**
   - Company name (large)
   - Role title
   - Status badge (clickable to change)
   - Location
   - "View Job Posting" link
   - Edit and Delete buttons

2. **Main Content (2 columns on desktop):**
   - **Left Column (wider):**
     - Application Info card
     - Activity Timeline card
     - Notes card

   - **Right Column (narrower):**
     - Deadline card (if exists)
     - Required Skills card
     - Related Contacts card
     - Quick Actions card

### 3.2 Application Info Card

```tsx
{/* Application Info */}
<div className="bg-white rounded-lg border border-gray-200 p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Info</h2>

  <dl className="space-y-4">
    <div className="flex justify-between">
      <dt className="text-sm text-gray-600">Company</dt>
      <dd className="text-sm font-medium text-gray-900">{company.company_name}</dd>
    </div>
    <div className="flex justify-between">
      <dt className="text-sm text-gray-600">Position</dt>
      <dd className="text-sm font-medium text-gray-900">{company.role}</dd>
    </div>
    <div className="flex justify-between">
      <dt className="text-sm text-gray-600">Location</dt>
      <dd className="text-sm font-medium text-gray-900">{company.location || "Not specified"}</dd>
    </div>
    <div className="flex justify-between">
      <dt className="text-sm text-gray-600">Status</dt>
      <dd>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
          {getStatusLabel(company.status)}
        </span>
      </dd>
    </div>
    <div className="flex justify-between">
      <dt className="text-sm text-gray-600">Added</dt>
      <dd className="text-sm font-medium text-gray-900">{formatDate(company.created_at)}</dd>
    </div>
    {company.application_deadline && (
      <div className="flex justify-between">
        <dt className="text-sm text-gray-600">Deadline</dt>
        <dd className="text-sm font-medium text-red-600">{formatDate(company.application_deadline)}</dd>
      </div>
    )}
  </dl>

  {company.job_url && (
    <a
      href={company.job_url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
    >
      <LinkIcon className="h-4 w-4 mr-1" />
      View Job Posting
    </a>
  )}
</div>
```

### 3.3 Activity Timeline

```tsx
{/* Activity Timeline */}
<div className="bg-white rounded-lg border border-gray-200 p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>

  <div className="space-y-4">
    {companyTimeline.length > 0 ? (
      companyTimeline.map((event, index) => (
        <div key={event.id} className="flex">
          <div className="flex flex-col items-center mr-4">
            <div className={`w-3 h-3 rounded-full ${getTimelineColor(event.type)}`} />
            {index < companyTimeline.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-2" />
            )}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-gray-900">{event.title}</p>
            <p className="text-xs text-gray-500">{formatDate(event.date, "MMM d, h:mm a")}</p>
            {event.description && (
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
            )}
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500 text-center py-4">
        No activity yet. Update the status to start tracking.
      </p>
    )}
  </div>
</div>
```

### 3.4 Notes Section

```tsx
{/* Notes */}
<div className="bg-white rounded-lg border border-gray-200 p-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
  </div>

  {/* Add Note Form */}
  <div className="mb-4">
    <textarea
      value={newNote}
      onChange={(e) => setNewNote(e.target.value)}
      placeholder="Add a note about this application..."
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      rows={3}
    />
    <div className="mt-2 flex justify-end">
      <button
        onClick={handleAddNote}
        disabled={!newNote.trim()}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Add Note
      </button>
    </div>
  </div>

  {/* Notes List */}
  <div className="space-y-3">
    {companyNotes.length > 0 ? (
      companyNotes.map((note) => (
        <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-900">{note.content}</p>
          <p className="text-xs text-gray-500 mt-2">{formatDate(note.created_at, "MMM d, h:mm a")}</p>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500 text-center py-4">
        No notes yet
      </p>
    )}
  </div>
</div>
```

### 3.5 Related Contacts Card

```tsx
{/* Related Contacts */}
<div className="bg-white rounded-lg border border-gray-200 p-5">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900">Contacts at {company.company_name}</h3>
    <button className="text-sm text-blue-600 hover:text-blue-700">
      + Add
    </button>
  </div>

  {relatedContacts.length > 0 ? (
    <div className="space-y-3">
      {relatedContacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => router.push(`/connections/${contact.id}`)}
          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <p className="text-sm font-medium text-gray-900">{contact.full_name}</p>
          <p className="text-xs text-gray-600">{contact.current_role}</p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500 text-center py-4">
      No contacts at this company yet
    </p>
  )}
</div>
```

## Expected Result
A clean, informative detail page with all relevant application information organized logically.

---

# MEGA PROMPT 4: Create Contacts List Page

## Goal
Create a new page at `/app/contacts/page.tsx` to list all contacts, matching the project description's requirement for a "networking-oriented view."

## Files to Create/Modify
- `/app/contacts/page.tsx` (NEW)
- `/components/NavigationBar.tsx` (add link)

## Detailed Instructions

### 4.1 Create the Contacts List Page

**File:** `/app/contacts/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Users,
  Search,
  Building2,
  Mail,
  Plus,
  User
} from "lucide-react";

export default function ContactsPage() {
  const router = useRouter();
  const connections = useCRMStore((state) => state.connections);
  const companies = useCRMStore((state) => state.companies);

  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  // Filter contacts
  let filteredContacts = connections;

  if (searchQuery) {
    filteredContacts = filteredContacts.filter(c =>
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.current_company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.current_role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (companyFilter !== "all") {
    filteredContacts = filteredContacts.filter(c => c.current_company === companyFilter);
  }

  // Get unique companies for filter
  const uniqueCompanies = [...new Set(connections.map(c => c.current_company).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {connections.length} contact{connections.length !== 1 ? 's' : ''} in your network
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/contacts/new")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Company Filter */}
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Companies</option>
                {uniqueCompanies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => router.push(`/connections/${contact.id}`)}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {contact.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {contact.current_role}
                    </p>
                    {contact.current_company && (
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Building2 className="h-4 w-4 mr-1" />
                        {contact.current_company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {contact.same_school && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Same School
                    </span>
                  )}
                  {contact.same_major && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Same Major
                    </span>
                  )}
                </div>

                {contact.connection_date && (
                  <p className="mt-3 text-xs text-gray-500">
                    Connected {formatDate(contact.connection_date, "MMM d, yyyy")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || companyFilter !== "all"
                ? "No contacts found"
                : "No contacts yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || companyFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start building your network by adding contacts"}
            </p>
            {!searchQuery && companyFilter === "all" && (
              <button
                onClick={() => router.push("/contacts/new")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Contact</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4.2 Add Navigation Link

Add a link to the contacts page in the dashboard or create a navigation bar.

## Expected Result
A searchable, filterable list of all contacts with cards showing name, role, company, and connection badges.

---

# MEGA PROMPT 5: Contact Detail Page

## Goal
Clean up the contact detail page to remove AI features and show simple contact information with interaction history.

## Files to Modify
- `/app/connections/[id]/page.tsx`

## Detailed Instructions

### 5.1 Remove AI Message Generation Entirely

Delete the entire message generator section (approximately lines 240-410).

### 5.2 New Simplified Structure

```tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import {
  ArrowLeft,
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Edit,
  Linkedin,
  Plus
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const connectionId = params.id as string;

  const connection = useCRMStore((state) =>
    state.connections.find((c) => c.id === connectionId)
  );
  const companies = useCRMStore((state) => state.companies);

  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);

  if (!connection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact not found</h2>
          <button
            onClick={() => router.push("/contacts")}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  // Find related applications at this company
  const relatedApplications = companies.filter(
    c => c.company_name === connection.current_company
  );

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote("");
      toast.success("Note added");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/contacts")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Contacts
          </button>

          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{connection.full_name}</h1>
              <p className="text-lg text-gray-600 mt-1">
                {connection.current_role} at {connection.current_company}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {connection.same_school && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Same School
                  </span>
                )}
                {connection.same_major && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Same Major
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>

              <dl className="space-y-4">
                <div className="flex items-center">
                  <dt className="w-32 text-sm text-gray-600 flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    Company
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {connection.current_company || "Not specified"}
                  </dd>
                </div>
                <div className="flex items-center">
                  <dt className="w-32 text-sm text-gray-600 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Role
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {connection.current_role || "Not specified"}
                  </dd>
                </div>
                {connection.email && (
                  <div className="flex items-center">
                    <dt className="w-32 text-sm text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </dt>
                    <dd className="text-sm font-medium text-blue-600">
                      <a href={`mailto:${connection.email}`}>{connection.email}</a>
                    </dd>
                  </div>
                )}
                {connection.phone && (
                  <div className="flex items-center">
                    <dt className="w-32 text-sm text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {connection.phone}
                    </dd>
                  </div>
                )}
                {connection.connection_date && (
                  <div className="flex items-center">
                    <dt className="w-32 text-sm text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Connected
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatDate(connection.connection_date, "MMMM d, yyyy")}
                    </dd>
                  </div>
                )}
              </dl>

              {connection.linkedin_url && (
                <a
                  href={connection.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Linkedin className="h-4 w-4 mr-1" />
                  View LinkedIn Profile
                </a>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Notes
              </h2>

              {/* Add Note */}
              <div className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this contact..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No notes yet. Add one above.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Related Applications */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Applications at {connection.current_company}
              </h3>

              {relatedApplications.length > 0 ? (
                <div className="space-y-3">
                  {relatedApplications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => router.push(`/company/${app.id}`)}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <p className="text-sm font-medium text-gray-900">{app.role}</p>
                      <p className="text-xs text-gray-600 capitalize">{app.status.replace(/_/g, ' ')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No applications at this company
                </p>
              )}
            </div>

            {/* How You Know Them */}
            {connection.how_you_know && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How You Know Them
                </h3>
                <p className="text-sm text-gray-700">{connection.how_you_know}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Expected Result
A clean contact detail page showing basic information, notes, and related applications without any AI features or scoring.

---

# MEGA PROMPT 6: Reminders/Tasks Page

## Goal
Enhance the reminders page with a working "Add Reminder" modal.

## Files to Modify
- `/app/reminders/page.tsx`

## Detailed Instructions

### 6.1 Add Modal State and Component

Add to the existing reminders page:

```tsx
const [showAddModal, setShowAddModal] = useState(false);
const [newReminder, setNewReminder] = useState({
  message: "",
  reminder_date: "",
  reminder_type: "follow_up" as ReminderType
});

const companies = useCRMStore((state) => state.companies);
const addReminder = useCRMStore((state) => state.addReminder);

const handleAddReminder = () => {
  if (!newReminder.message.trim() || !newReminder.reminder_date) {
    toast.error("Please fill in all required fields");
    return;
  }

  const reminder: Reminder = {
    id: `reminder-${Date.now()}`,
    user_id: "user-1",
    reminder_type: newReminder.reminder_type,
    reminder_date: newReminder.reminder_date,
    message: newReminder.message.trim(),
    completed: false,
    created_at: new Date().toISOString()
  };

  addReminder(reminder);
  toast.success("Reminder added!");
  setShowAddModal(false);
  setNewReminder({
    message: "",
    reminder_date: "",
    reminder_type: "follow_up"
  });
};
```

### 6.2 Add Modal Component

```tsx
{/* Add Reminder Modal */}
{showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-md p-6 m-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Reminder</h2>

      <div className="space-y-4">
        {/* Reminder Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={newReminder.reminder_type}
            onChange={(e) => setNewReminder(prev => ({
              ...prev,
              reminder_type: e.target.value as ReminderType
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="follow_up">Follow Up</option>
            <option value="call_prep">Call Prep</option>
            <option value="check_response">Check Response</option>
            <option value="send_thank_you">Send Thank You</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            value={newReminder.message}
            onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
            placeholder="What do you need to do?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date *
          </label>
          <input
            type="datetime-local"
            value={newReminder.reminder_date}
            onChange={(e) => setNewReminder(prev => ({ ...prev, reminder_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => setShowAddModal(false)}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleAddReminder}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Reminder
        </button>
      </div>
    </div>
  </div>
)}
```

### 6.3 Update Button Handler

Change the "Add Reminder" button:

```tsx
<button
  onClick={() => setShowAddModal(true)}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
>
  <Plus className="h-5 w-5" />
  <span>Add Reminder</span>
</button>
```

## Expected Result
A fully functional reminders page with the ability to add new reminders through a modal.

---

# MEGA PROMPT 7: Navigation & Global Components

## Goal
Create a consistent navigation experience across the app.

## Files to Modify/Create
- `/components/NavigationBar.tsx`
- `/app/layout.tsx`

## Detailed Instructions

### 7.1 Create Navigation Bar

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Bell,
  Plus,
  Briefcase
} from "lucide-react";

export function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/contacts", label: "Contacts", icon: Users },
    { href: "/reminders", label: "Reminders", icon: Bell }
  ];

  // Don't show on landing/onboarding pages
  if (pathname === "/" || pathname === "/landing" || pathname === "/onboarding") {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PathFinder</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Add Button */}
          <Link
            href="/companies/new"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Add Application</span>
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-4 ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
```

### 7.2 Update Layout

Add NavigationBar to the layout so it appears on all pages:

```tsx
// In app/layout.tsx, wrap children with NavigationBar
import { NavigationBar } from "@/components/NavigationBar";

// In the body:
<NavigationBar />
{children}
```

## Expected Result
A consistent navigation bar across all pages with links to Dashboard, Contacts, and Reminders.

---

# MEGA PROMPT 8: Sample Data & Final Polish

## Goal
Update sample data to look realistic and professional for the demo.

## Files to Modify
- `/lib/sample-data.ts`

## Detailed Instructions

### 8.1 Create Realistic Sample Data

```typescript
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

// Realistic Drexel student profile
export const sampleUser: User = {
  id: "user-1",
  email: "eb123@drexel.edu",
  full_name: "Ethan Bailine",
  career_stage: "undergraduate",
  school: "Drexel University",
  major: "Information Systems",
  degree_type: "BS",
  graduation_year: 2026,
  location: "Philadelphia, PA",
  skills: ["Python", "JavaScript", "React", "SQL", "Data Analysis"],
  target_opportunity_types: ["internship"],
  target_industries: ["Technology", "Finance", "Consulting"],
  target_roles: ["Software Engineer", "Data Analyst", "Product Manager"],
  preferred_locations: ["Philadelphia", "New York", "Remote"],
  remote_preference: "flexible",
  onboarding_completed: true,
  onboarding_step: 5,
  created_at: "2025-09-01T00:00:00Z",
  updated_at: "2025-12-04T00:00:00Z"
};

// Realistic target companies with diverse statuses
export const sampleTargetCompanies: TargetCompany[] = [
  {
    id: "company-1",
    user_id: "user-1",
    company_name: "Google",
    role: "Software Engineering Intern",
    job_url: "https://careers.google.com",
    location: "Mountain View, CA",
    job_description: "Work on large-scale distributed systems and help build products used by billions of users.",
    required_skills: ["Python", "Java", "Algorithms", "Data Structures"],
    status: "applied",
    application_deadline: "2025-12-15T23:59:00Z",
    created_at: "2025-11-20T10:00:00Z",
    updated_at: "2025-12-01T14:30:00Z"
  },
  {
    id: "company-2",
    user_id: "user-1",
    company_name: "Amazon",
    role: "SDE Intern",
    job_url: "https://amazon.jobs",
    location: "Seattle, WA",
    job_description: "Design and build innovative technologies in a large distributed computing environment.",
    required_skills: ["Java", "Python", "System Design", "Problem Solving"],
    status: "interviewing",
    created_at: "2025-11-15T09:00:00Z",
    updated_at: "2025-12-03T11:00:00Z"
  },
  {
    id: "company-3",
    user_id: "user-1",
    company_name: "Vanguard",
    role: "Technology Intern",
    job_url: "https://careers.vanguard.com",
    location: "Malvern, PA",
    job_description: "Help build technology solutions for one of the world's largest investment companies.",
    required_skills: ["Python", "SQL", "Finance", "Data Analysis"],
    status: "thinking",
    application_deadline: "2025-12-20T23:59:00Z",
    created_at: "2025-12-01T15:00:00Z",
    updated_at: "2025-12-01T15:00:00Z"
  },
  {
    id: "company-4",
    user_id: "user-1",
    company_name: "Comcast",
    role: "Product Management Intern",
    job_url: "https://jobs.comcast.com",
    location: "Philadelphia, PA",
    job_description: "Work with product teams to deliver innovative entertainment and technology products.",
    required_skills: ["Product Strategy", "Data Analysis", "Communication"],
    status: "applied",
    created_at: "2025-11-25T11:00:00Z",
    updated_at: "2025-11-28T09:00:00Z"
  },
  {
    id: "company-5",
    user_id: "user-1",
    company_name: "JPMorgan Chase",
    role: "Software Engineer Intern",
    location: "New York, NY",
    job_description: "Build technology solutions for one of the world's largest financial institutions.",
    required_skills: ["Java", "Spring", "SQL", "Microservices"],
    status: "rejected",
    created_at: "2025-10-15T08:00:00Z",
    updated_at: "2025-11-20T16:00:00Z"
  }
];

// Contacts at target companies
export const sampleConnections: Connection[] = [
  {
    id: "conn-1",
    user_id: "user-1",
    full_name: "Sarah Chen",
    headline: "Software Engineer at Google | Drexel '23",
    current_company: "Google",
    current_role: "Software Engineer",
    connection_date: "2025-10-15T00:00:00Z",
    mutual_connections: 5,
    same_school: true,
    same_major: true,
    intro_likelihood_score: 85,
    linkedin_url: "https://linkedin.com/in/sarahchen",
    email: "sarah.chen@gmail.com",
    how_you_know: "Met at Drexel CS club event",
    created_at: "2025-10-15T00:00:00Z",
    updated_at: "2025-10-15T00:00:00Z"
  },
  {
    id: "conn-2",
    user_id: "user-1",
    full_name: "David Kim",
    headline: "SDE II at Amazon | Drexel '22",
    current_company: "Amazon",
    current_role: "Software Development Engineer",
    connection_date: "2025-09-20T00:00:00Z",
    mutual_connections: 8,
    same_school: true,
    same_major: false,
    intro_likelihood_score: 80,
    linkedin_url: "https://linkedin.com/in/davidkim",
    how_you_know: "Alumni networking event",
    created_at: "2025-09-20T00:00:00Z",
    updated_at: "2025-09-20T00:00:00Z"
  },
  {
    id: "conn-3",
    user_id: "user-1",
    full_name: "Emily Rodriguez",
    headline: "Recruiter at Vanguard",
    current_company: "Vanguard",
    current_role: "University Recruiter",
    connection_date: "2025-11-10T00:00:00Z",
    mutual_connections: 2,
    same_school: false,
    same_major: false,
    intro_likelihood_score: 70,
    linkedin_url: "https://linkedin.com/in/emilyrodriguez",
    email: "emily.rodriguez@vanguard.com",
    how_you_know: "Career fair at Drexel",
    created_at: "2025-11-10T00:00:00Z",
    updated_at: "2025-11-10T00:00:00Z"
  }
];

// Reminders/Tasks
export const sampleReminders: Reminder[] = [
  {
    id: "reminder-1",
    user_id: "user-1",
    target_company_id: "company-2",
    reminder_type: "call_prep",
    reminder_date: "2025-12-05T14:00:00Z",
    message: "Prepare for Amazon phone interview - review system design",
    completed: false,
    created_at: "2025-12-01T00:00:00Z"
  },
  {
    id: "reminder-2",
    user_id: "user-1",
    target_company_id: "company-1",
    reminder_type: "follow_up",
    reminder_date: "2025-12-07T10:00:00Z",
    message: "Follow up on Google application status",
    completed: false,
    created_at: "2025-12-01T00:00:00Z"
  },
  {
    id: "reminder-3",
    user_id: "user-1",
    reminder_type: "send_thank_you",
    reminder_date: "2025-12-03T09:00:00Z",
    message: "Send thank you email to Emily Rodriguez from career fair",
    completed: true,
    completed_at: "2025-12-03T10:30:00Z",
    created_at: "2025-11-10T00:00:00Z"
  }
];

// Stats
export const sampleUserStats: UserStats = {
  totalApplications: 5,
  applied: 2,
  interviewing: 1,
  offers: 0,
  rejected: 1,
  upcomingDeadlines: 2,
  tasksDue: 2
};

// Timeline events for companies
export const sampleTimelineEvents: Record<string, TimelineEvent[]> = {
  "company-1": [
    {
      id: "event-1",
      type: "status_changed",
      title: "Application submitted",
      description: "Applied through Google Careers portal",
      date: "2025-12-01T14:30:00Z"
    }
  ],
  "company-2": [
    {
      id: "event-2",
      type: "status_changed",
      title: "Application submitted",
      description: "Applied via referral from David Kim",
      date: "2025-11-15T09:00:00Z"
    },
    {
      id: "event-3",
      type: "status_changed",
      title: "Moved to interviewing",
      description: "Received email to schedule phone screen",
      date: "2025-12-03T11:00:00Z"
    }
  ],
  "company-5": [
    {
      id: "event-4",
      type: "status_changed",
      title: "Application submitted",
      description: "Applied online",
      date: "2025-10-15T08:00:00Z"
    },
    {
      id: "event-5",
      type: "status_changed",
      title: "Rejection received",
      description: "Not moving forward with application",
      date: "2025-11-20T16:00:00Z"
    }
  ]
};

// Sample notes
export const sampleNotes: Record<string, Note[]> = {
  "company-2": [
    {
      id: "note-1",
      target_company_id: "company-2",
      user_id: "user-1",
      content: "Phone interview scheduled for Dec 5 at 2pm EST. Focus areas: Leadership principles, coding, system design.",
      created_at: "2025-12-03T12:00:00Z",
      updated_at: "2025-12-03T12:00:00Z"
    }
  ]
};

// Empty arrays for outreach (simplified for demo)
export const sampleOutreach: Outreach[] = [];
```

## Expected Result
Professional, realistic sample data that demonstrates the app's capabilities without revealing business features.

---

# EXECUTION ORDER

Execute these mega prompts in order for best results:

1. **MEGA PROMPT 1** - Dashboard (foundation)
2. **MEGA PROMPT 2** - Add Application Form
3. **MEGA PROMPT 3** - Application Detail
4. **MEGA PROMPT 4** - Contacts List (new page)
5. **MEGA PROMPT 5** - Contact Detail
6. **MEGA PROMPT 6** - Reminders
7. **MEGA PROMPT 7** - Navigation
8. **MEGA PROMPT 8** - Sample Data

After each prompt:
1. Run `npm run build` to check for errors
2. Run `npm run dev` to test visually
3. Commit changes before moving to next prompt

---

# FINAL CHECKLIST

After completing all prompts, verify:

- [ ] Dashboard shows clean metrics and application list
- [ ] "Add Application" form has deadline field
- [ ] Application detail shows all info without AI features
- [ ] Contacts list page exists and works
- [ ] Contact detail has no AI message generation
- [ ] Reminders page has working "Add" modal
- [ ] Navigation bar appears on all pages
- [ ] Sample data looks realistic
- [ ] Mobile responsive design works
- [ ] All builds pass without errors

---

*Document created: December 4, 2025*
*Purpose: INFO 103 Final Project - Professional UI transformation*

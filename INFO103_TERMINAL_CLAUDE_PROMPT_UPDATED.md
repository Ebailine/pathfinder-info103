# COMPREHENSIVE PROMPT: PathFinder CRM for INFO 103 Final Project

## CURRENT STATUS: PARTIALLY COMPLETE

**Last Updated:** December 4, 2025
**GitHub:** https://github.com/Ebailine/pathfinder-info103
**Live Site:** https://pathfinder-info103-jixi0k3i4-ethns-projects-bc2e7e9b.vercel.app

---

## CONTEXT

I'm Ethan Bailine, a Drexel University student (ID: 14559901). I built PathFinder CRM as a demonstration for my INFO 103 class project. The app is a **student-focused web application for tracking job and internship applications, networking contacts, and follow-ups**.

This is a **working prototype** that I will demo during my class presentation. The app has been simplified from a more advanced business version to match exactly what I described in my written project submission.

---

## WHAT HAS BEEN COMPLETED

### Core Simplifications Done:
- [x] **Status labels updated** to match project description:
  - "Thinking About It" (thinking)
  - "Applied" (applied)
  - "Interviewing" (interviewing)
  - "Offer" (offer)
  - "Rejected" (rejected)

- [x] **Gamification removed:**
  - No XP points or progress bars
  - No "Networking Level" or badges
  - No achievements panel
  - No day streaks

- [x] **Simplified dashboard metrics:**
  - Total Applications
  - Applied count
  - Interviewing count
  - Offers count
  - Upcoming Deadlines
  - Tasks Due

- [x] **Connection scoring removed:**
  - No star ratings
  - No "Strong Match" labels
  - No "Intro Likelihood Score"
  - Simplified to basic contact info with badges (Same School, Same Major)

- [x] **Learning resources removed** from sidebar

- [x] **Achievements section removed** from sidebar

- [x] **Build passing** - All TypeScript errors fixed

### Files Modified:
1. `lib/types.ts` - Updated CompanyStatus type, simplified UserStats
2. `lib/utils.ts` - Updated status colors/icons/labels, removed scoring functions
3. `lib/sample-data.ts` - Updated sample data with new statuses
4. `lib/store.ts` - Removed achievements, updated stats structure
5. `components/StatsHero.tsx` - Simplified metrics display
6. `components/QuickActions.tsx` - Removed achievements and learning resources
7. `components/CompanyPipelineCard.tsx` - Updated status options and next actions
8. `app/dashboard/page.tsx` - Updated filters and priority sorting
9. `app/companies/new/page.tsx` - Changed default status
10. `app/company/[id]/page.tsx` - Removed scoring, updated statuses
11. `app/connections/[id]/page.tsx` - Removed scoring, simplified display

---

## WHAT STILL NEEDS WORK

### Priority 1: Critical Fixes for Demo
These must be working for the presentation:

#### 1. Remove AI Message Generation from Connections Page
**File:** `app/connections/[id]/page.tsx`
- [ ] Remove "Generate Outreach Message" button entirely
- [ ] Remove "Let AI write a personalized message..." text
- [ ] Remove the sparkle icons associated with AI
- [ ] Remove the entire message generator section (lines 240-410 approximately)
- [ ] Replace with a simple "Notes about this contact" section

#### 2. Fix Connection Path Visualization
**File:** `components/CompanyPipelineCard.tsx`
- [ ] Simplify "CONNECTION PATH: You → Sarah Chen → Hiring Manager"
- [ ] Change to simple "Contact: Sarah Chen at [Company]"
- [ ] Remove arrow chain visualization

#### 3. Add "Application Deadline" Field
**File:** `lib/types.ts` and forms
- [ ] Add `application_deadline?: string` to TargetCompany interface
- [ ] Update `app/companies/new/page.tsx` to include deadline date picker
- [ ] Update `app/company/[id]/page.tsx` to display deadline
- [ ] Update `app/company/[id]/edit/page.tsx` to edit deadline

#### 4. Add Contacts/Networking Page
**Missing Feature** - Project description mentions:
> "can also switch to a more networking-oriented view that shows contacts and past interactions for a given company"

- [ ] Create `/app/contacts/page.tsx` - List of all contacts
- [ ] Add navigation link to contacts page
- [ ] Display contacts with: Name, Company, Role, Contact Type, Last Interaction

#### 5. Add Interaction Logging
**Missing Feature** - Project description mentions:
> "log interactions with contacts" and "creates a simple history of who helped with what and when they last talked"

- [ ] Add Interaction type to `lib/types.ts`
- [ ] Add interactions to store
- [ ] Add "Log Interaction" button on contact detail page
- [ ] Display interaction history on contact page

### Priority 2: UI/UX Improvements

#### 6. Update Header/Tagline
**File:** `app/dashboard/page.tsx`
- [ ] Change "Manage your warm introduction pipeline" to "Track your job and internship applications"
- [ ] Consider changing button text from "Add Company" to "Add Application"

#### 7. Create Add Reminder Modal
**File:** `app/reminders/page.tsx`
- [ ] The "Add Reminder" button currently shows "coming soon" toast
- [ ] Create a functional modal to add reminders with:
  - Message text
  - Due date/time
  - Reminder type (follow_up, call_prep, check_response, send_thank_you)
  - Associated company (optional)

#### 8. Improve Contact Type Selection
**Current:** Free-form text for contact role
**Should Add:** Contact type dropdown with options from project description:
- Alumni
- Recruiter
- Classmate
- Mentor
- Other

#### 9. Quick Actions Sidebar Enhancement
**File:** `components/QuickActions.tsx`
- [ ] Currently only shows Reminders
- [ ] Add "Upcoming Deadlines" section
- [ ] Add quick link to "Add New Application"

### Priority 3: Polish & Professional Look

#### 10. Empty States
- [ ] Better empty state for dashboard when no applications
- [ ] Better empty state for contacts list
- [ ] Better empty state for reminders

#### 11. Loading States
- [ ] Add skeleton loaders for cards
- [ ] Smooth transitions between pages

#### 12. Mobile Responsiveness
- [ ] Test and fix mobile layout for dashboard
- [ ] Test and fix mobile layout for forms
- [ ] Test and fix mobile layout for detail pages

---

## EXACT FEATURES FROM PROJECT DESCRIPTION

### The app MUST support these features (from my written submission):

**1. Application Tracking:**
```
- Add jobs/internships with: company name, role title, location, link, application deadline
- Status labels: "thinking about it", "applied", "interviewing", "offer", "rejected"
- Notes about what the role involves or what came up in conversations
- Each application connects to a company
```

**2. Follow-Up Tasks:**
```
- Create concrete follow-ups like "send thank you email" or "check portal on X date"
- Tasks have due dates
- Next steps aren't just floating in your head
```

**3. Contact/Networking Management:**
```
- For each company, add contacts: alumni, recruiters, classmates, mentors
- Log interactions with contacts
- Creates history of who helped with what and when they last talked
- Simple contact types, NO scoring or rating system
```

**4. Dashboard Views:**
```
- Applications grouped by status
- Upcoming deadlines
- Follow-ups that are due soon
- Can switch to networking-oriented view showing contacts and past interactions
```

---

## PAGES INVENTORY

### Currently Existing Pages:
| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Redirect to dashboard | Working |
| `/dashboard` | Main application pipeline | Working (needs polish) |
| `/companies/new` | Add new application | Working (needs deadline field) |
| `/company/[id]` | Application detail | Working (needs polish) |
| `/company/[id]/edit` | Edit application | Working |
| `/connections/[id]` | Contact detail | Working (needs AI removal) |
| `/reminders` | Task/reminder list | Working (needs add modal) |
| `/onboarding` | User onboarding | Not needed for demo |
| `/landing` | Landing page | Not needed for demo |
| `/resources/*` | Learning resources | SHOULD BE REMOVED or hidden |

### Missing Pages:
| Route | Purpose | Priority |
|-------|---------|----------|
| `/contacts` | List all contacts | HIGH |
| `/contacts/new` | Add new contact | MEDIUM |

---

## TECHNICAL DETAILS

### Tech Stack:
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Deployment:** Vercel

### Key Files:
```
/lib/
  ├── types.ts          # TypeScript interfaces
  ├── store.ts          # Zustand store
  ├── utils.ts          # Helper functions
  ├── sample-data.ts    # Demo data
  └── career-stages.ts  # Career stage definitions

/components/
  ├── StatsHero.tsx           # Dashboard stats
  ├── CompanyPipelineCard.tsx # Application cards
  ├── QuickActions.tsx        # Sidebar actions
  └── NavigationBar.tsx       # Navigation

/app/
  ├── dashboard/page.tsx      # Main dashboard
  ├── companies/new/page.tsx  # Add application form
  ├── company/[id]/page.tsx   # Application detail
  ├── connections/[id]/page.tsx # Contact detail
  └── reminders/page.tsx      # Tasks/reminders
```

---

## DATA MODEL (From Project Description)

The app should reflect this relational structure:

```
┌─────────────┐     ┌─────────────────┐
│    User     │     │  TargetCompany  │
│  (student)  │────<│  (application)  │
└─────────────┘     └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Connection │     │   Reminder  │     │    Note     │
│  (contact)  │     │   (task)    │     │             │
└──────┬──────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│ Interaction │
│  (log)      │
└─────────────┘
```

---

## IMPLEMENTATION CHECKLIST

### Before Demo Day:
- [ ] AI message generation completely removed
- [ ] Connection path simplified
- [ ] Application deadline field added
- [ ] Contacts list page created
- [ ] Add Reminder modal working
- [ ] Header tagline updated
- [ ] All resources pages hidden/removed
- [ ] Sample data looks realistic
- [ ] Mobile responsive tested

### Nice to Have:
- [ ] Interaction logging
- [ ] Contact type dropdown
- [ ] Better empty states
- [ ] Loading skeletons

---

## HOW TO USE THIS PROMPT

When you need to make changes:

1. **Read this document first** to understand current state
2. **Check the checklist** to see what's done vs. remaining
3. **Follow the priority order** - Priority 1 items are critical for demo
4. **Test changes** by running `npm run build` before committing
5. **Update this document** when you complete items

### Commands:
```bash
# Development
cd /Users/ethanbailine/Desktop/pathfinder-info103
npm run dev

# Build (check for errors)
npm run build

# Deploy (after pushing to GitHub)
# Vercel auto-deploys from main branch
```

---

## WHAT NOT TO DO

1. **DO NOT add back:**
   - XP/levels/achievements
   - AI message generation
   - Connection scoring/stars
   - Learning resources
   - "Intro Likelihood Score"

2. **DO NOT change:**
   - Status labels (keep the 5 current ones)
   - Simple metrics approach
   - Basic contact display

3. **DO NOT reference:**
   - "Sivio" (the business name)
   - Advanced features not in project description

---

## QUESTIONS TO CLARIFY

If you're unsure about any changes, check:
1. Does this feature appear in my project description PDF?
2. Is this simpler than what was there before?
3. Would this make sense to a professor reviewing a student project?

---

*This document was created to ensure consistency between my written project submission and the live demo for INFO 103.*

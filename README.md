<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# PathFinder CRM - Interactive Networking Pipeline

A fully functional, interactive CRM system designed for college students to manage their warm introduction pathway to land internships at top companies.

## Features

### ✅ Completed Features

#### 1. Main Dashboard (`/dashboard`)
- **Hero Stats Section**: Real-time metrics tracking
  - Active Paths
  - Messages Sent
  - Response Rate
  - Intros Made
  - Interviews Scheduled
  - Day Streak
- **Level Progress Bar**: Gamification system with XP tracking
- **Company Pipeline Cards**: Interactive cards with full status management
- **Quick Actions Sidebar**: Reminders, learning resources, achievements
- **Advanced Filtering**: Filter by status, search, and sort options
- **Bulk Actions**: Select multiple companies, bulk delete, export to CSV

#### 2. Company Pipeline Cards
- Status badges with 10 different states
- Visual connection path diagram
- Next action suggestions
- Days since last activity
- Quick status updates
- Individual card actions (view, edit, delete)
- Checkbox selection for bulk operations

#### 3. Company Detail View (`/company/[id]`)
- Complete company information
- Activity timeline with all events
- Message history
- Connection cards
- Notes system (add, view, delete)
- Status management
- Quick edit and delete actions

#### 4. State Management (Zustand)
- Global state for all CRM data
- Sample data pre-loaded for demonstration
- Optimistic UI updates
- Real-time stats calculations

#### 5. UI Components
- `StatsHero`: Displays user statistics and level progress
- `CompanyPipelineCard`: Interactive company cards
- `QuickActions`: Sidebar with reminders and resources
- Responsive design for mobile and desktop

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: react-hot-toast
- **Animations**: Framer Motion

## Installation

1. **Install Dependencies**
```bash
cd pathfinder-crm
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
Navigate to `http://localhost:3000`

## Project Structure

```
pathfinder-crm/
├── app/
│   ├── dashboard/         # Main CRM dashboard
│   ├── company/[id]/      # Company detail view
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page (redirects to dashboard)
├── components/
│   ├── CompanyPipelineCard.tsx  # Company card component
│   ├── QuickActions.tsx         # Sidebar component
│   └── StatsHero.tsx            # Stats display component
├── lib/
│   ├── sample-data.ts    # Pre-loaded demo data
│   ├── store.ts          # Zustand state management
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── package.json
```

## Key Features Explained

### Company Status States
- 📝 Draft Ready
- ✉️ Message Sent
- ⏳ Awaiting Response
- 📞 Call Scheduled
- ✅ Intro Made
- 🎯 Interview Scheduled
- ❌ No Response
- ⏸️ Paused
- ✅ Completed
- ❌ Rejected

### Filtering & Search
- Filter by status
- Search by company name or role
- Sort by: Most Recent, Most Active, Highest Priority
- Real-time updates

### Bulk Actions
- Select individual companies or select all
- Bulk status updates
- Bulk delete with confirmation
- Export selected companies to CSV

### Gamification
- XP system with levels
- Achievement badges
- Streak tracking
- Progress visualization

## Sample Data

The app comes pre-loaded with sample data including:
- 7 target companies in various states
- 6 LinkedIn connections with different strength scores
- 4 outreach messages (drafts, sent, responded)
- 5 reminders (some overdue, some upcoming)
- Timeline events for each company
- 7 achievements (3 unlocked, 4 locked)

## Pages & Routes

### Current Pages
- `/` - Landing page (redirects to dashboard)
- `/dashboard` - Main CRM dashboard
- `/company/[id]` - Company detail view

### Planned Pages
- `/companies/new` - Add new company form
- `/company/[id]/edit` - Edit company form
- `/connections` - All connections library
- `/connections/[id]` - Connection detail view
- `/messages` - Message inbox/outbox
- `/reminders` - Full reminders view
- `/analytics` - Analytics dashboard
- `/settings/crm` - CRM preferences

## Interactions

Every element is clickable and functional:
1. ✅ Click company card → View details
2. ✅ Click checkbox → Select for bulk actions
3. ✅ Click status badge → Update status
4. ✅ Click "View Details" → Navigate to detail page
5. ✅ Click timeline event → View event details
6. ✅ Click connection → View connection info
7. ✅ Click reminder → Mark as complete
8. ✅ Add/delete notes → Real-time updates
9. ✅ Filter/search → Instant results
10. ✅ Bulk delete → Confirmation dialog

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Collapsible sidebar on mobile
- Touch-friendly buttons and interactions

## Next Steps for Full Implementation

### High Priority
1. **Add Company Form** (`/companies/new`)
2. **Analytics Page** (`/analytics`) with charts
3. **Reminders Page** (`/reminders`) full view
4. **Message Management** system

### Medium Priority
5. **Connection Management** pages
6. **AI Message Generation** integration
7. **File Upload** for resumes/cover letters
8. **Email Integration** for tracking

### Low Priority
9. **Supabase Integration** for real data
10. **LinkedIn OAuth** authentication
11. **Real-time Notifications**
12. **Export/Import** full pipeline

## Development Notes

### Adding New Status States
Update the `CompanyStatus` type in `/lib/types.ts` and add corresponding:
- Icon in `getStatusIcon()`
- Color in `getStatusColor()`
- Label in `getStatusLabel()`

### Adding New Stats
Update the `UserStats` interface and add calculation logic in Zustand store actions.

### Customizing Colors
Modify the Tailwind color scheme in `tailwind.config.ts` and update CSS variables in `app/globals.css`.

## Testing

The app includes comprehensive sample data that demonstrates all features:
- Try filtering by different statuses
- Select multiple companies and bulk delete
- View individual company details
- Add notes to companies
- Mark reminders as complete
- Export data to CSV

## Performance

- Optimistic UI updates for instant feedback
- Efficient re-renders with Zustand selectors
- Lazy loading for heavy components
- Memoized calculations for stats

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a student project for PathFinder. To contribute:
1. Review the spec document
2. Check existing components
3. Follow TypeScript conventions
4. Test all interactions
5. Ensure responsive design

## License

Private - PathFinder Team

## Questions?

Refer to the full specification document at `/Users/ethanbailine/Desktop/SIVIO Updated Idea & Format.md`

---

**Built with ❤️ for college students seeking their dream internships**
>>>>>>> dd437b29 (Transform PathFinder into comprehensive career assistant platform)

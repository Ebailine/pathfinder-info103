import { create } from 'zustand';
import {
  User,
  Connection,
  TargetCompany,
  Outreach,
  Reminder,
  TimelineEvent,
  Note,
  UserStats,
  CompanyStatus
} from './types';
import {
  sampleUser,
  sampleConnections,
  sampleTargetCompanies,
  sampleOutreach,
  sampleReminders,
  sampleTimelineEvents,
  sampleNotes,
  sampleUserStats
} from './sample-data';

interface CRMStore {
  // User data
  user: User | null;
  stats: UserStats;

  // Company pipeline
  companies: TargetCompany[];
  selectedCompanyId: string | null;

  // Connections
  connections: Connection[];

  // Outreach
  outreach: Outreach[];

  // Reminders
  reminders: Reminder[];

  // Timeline events
  timelineEvents: Record<string, TimelineEvent[]>;

  // Notes
  notes: Record<string, Note[]>;

  // Filters & Search
  statusFilter: CompanyStatus | 'all';
  searchQuery: string;
  sortBy: 'recent' | 'active' | 'priority' | 'interviews';

  // UI State
  selectedCompanies: string[];
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  updateStats: (stats: Partial<UserStats>) => void;

  // Company actions
  addCompany: (company: TargetCompany) => void;
  updateCompany: (id: string, updates: Partial<TargetCompany>) => void;
  deleteCompany: (id: string) => void;
  setSelectedCompany: (id: string | null) => void;
  updateCompanyStatus: (id: string, status: CompanyStatus) => void;

  // Outreach actions
  addOutreach: (outreach: Outreach) => void;
  updateOutreach: (id: string, updates: Partial<Outreach>) => void;
  deleteOutreach: (id: string) => void;

  // Reminder actions
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  completeReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  // Timeline actions
  addTimelineEvent: (companyId: string, event: TimelineEvent) => void;

  // Note actions
  addNote: (companyId: string, note: Note) => void;
  updateNote: (companyId: string, noteId: string, content: string) => void;
  deleteNote: (companyId: string, noteId: string) => void;

  // Filter & Search actions
  setStatusFilter: (status: CompanyStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'recent' | 'active' | 'priority' | 'interviews') => void;

  // Bulk actions
  toggleSelectCompany: (id: string) => void;
  selectAllCompanies: () => void;
  clearSelection: () => void;
  bulkUpdateStatus: (status: CompanyStatus) => void;
  bulkDelete: () => void;

  // Initialize with sample data
  initializeSampleData: () => void;
}

export const useCRMStore = create<CRMStore>((set, get) => ({
  // Initial state - simplified for INFO 103 project
  user: null,
  stats: {
    totalApplications: 0,
    applied: 0,
    interviewing: 0,
    offers: 0,
    rejected: 0,
    upcomingDeadlines: 0,
    tasksDue: 0
  },
  companies: [],
  selectedCompanyId: null,
  connections: [],
  outreach: [],
  reminders: [],
  timelineEvents: {},
  notes: {},
  statusFilter: 'all',
  searchQuery: '',
  sortBy: 'recent',
  selectedCompanies: [],
  isLoading: false,

  // User actions
  setUser: (user) => set({ user }),
  updateStats: (stats) => set((state) => ({
    stats: { ...state.stats, ...stats }
  })),

  // Company actions
  addCompany: (company) => set((state) => ({
    companies: [...state.companies, company],
    stats: {
      ...state.stats,
      totalApplications: state.stats.totalApplications + 1
    }
  })),

  updateCompany: (id, updates) => set((state) => ({
    companies: state.companies.map((c) =>
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    )
  })),

  deleteCompany: (id) => set((state) => ({
    companies: state.companies.filter((c) => c.id !== id),
    stats: {
      ...state.stats,
      totalApplications: Math.max(0, state.stats.totalApplications - 1)
    }
  })),

  setSelectedCompany: (id) => set({ selectedCompanyId: id }),

  updateCompanyStatus: (id, status) => set((state) => {
    const company = state.companies.find(c => c.id === id);
    if (!company) return state;

    // Add timeline event
    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      type: 'status_changed',
      title: `Status updated to ${status.replace(/_/g, ' ')}`,
      description: `Company status changed from ${company.status.replace(/_/g, ' ')} to ${status.replace(/_/g, ' ')}`,
      date: new Date().toISOString()
    };

    const updatedTimelineEvents = {
      ...state.timelineEvents,
      [id]: [...(state.timelineEvents[id] || []), newEvent]
    };

    return {
      companies: state.companies.map((c) =>
        c.id === id ? { ...c, status, updated_at: new Date().toISOString() } : c
      ),
      timelineEvents: updatedTimelineEvents
    };
  }),

  // Outreach actions
  addOutreach: (outreach) => set((state) => ({
    outreach: [...state.outreach, outreach]
  })),

  updateOutreach: (id, updates) => set((state) => ({
    outreach: state.outreach.map((o) =>
      o.id === id ? { ...o, ...updates, updated_at: new Date().toISOString() } : o
    )
  })),

  deleteOutreach: (id) => set((state) => ({
    outreach: state.outreach.filter((o) => o.id !== id)
  })),

  // Reminder actions
  addReminder: (reminder) => set((state) => ({
    reminders: [...state.reminders, reminder]
  })),

  updateReminder: (id, updates) => set((state) => ({
    reminders: state.reminders.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    )
  })),

  completeReminder: (id) => set((state) => ({
    reminders: state.reminders.map((r) =>
      r.id === id ? { ...r, completed: true, completed_at: new Date().toISOString() } : r
    )
  })),

  deleteReminder: (id) => set((state) => ({
    reminders: state.reminders.filter((r) => r.id !== id)
  })),

  // Timeline actions
  addTimelineEvent: (companyId, event) => set((state) => ({
    timelineEvents: {
      ...state.timelineEvents,
      [companyId]: [...(state.timelineEvents[companyId] || []), event]
    }
  })),

  // Note actions
  addNote: (companyId, note) => set((state) => ({
    notes: {
      ...state.notes,
      [companyId]: [...(state.notes[companyId] || []), note]
    }
  })),

  updateNote: (companyId, noteId, content) => set((state) => ({
    notes: {
      ...state.notes,
      [companyId]: (state.notes[companyId] || []).map(n =>
        n.id === noteId ? { ...n, content, updated_at: new Date().toISOString() } : n
      )
    }
  })),

  deleteNote: (companyId, noteId) => set((state) => ({
    notes: {
      ...state.notes,
      [companyId]: (state.notes[companyId] || []).filter(n => n.id !== noteId)
    }
  })),

  // Filter & Search actions
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sortBy) => set({ sortBy }),

  // Bulk actions
  toggleSelectCompany: (id) => set((state) => ({
    selectedCompanies: state.selectedCompanies.includes(id)
      ? state.selectedCompanies.filter((cid) => cid !== id)
      : [...state.selectedCompanies, id]
  })),

  selectAllCompanies: () => set((state) => ({
    selectedCompanies: state.companies.map((c) => c.id)
  })),

  clearSelection: () => set({ selectedCompanies: [] }),

  bulkUpdateStatus: (status) => set((state) => ({
    companies: state.companies.map((c) =>
      state.selectedCompanies.includes(c.id)
        ? { ...c, status, updated_at: new Date().toISOString() }
        : c
    ),
    selectedCompanies: []
  })),

  bulkDelete: () => set((state) => ({
    companies: state.companies.filter((c) => !state.selectedCompanies.includes(c.id)),
    selectedCompanies: [],
    stats: {
      ...state.stats,
      totalApplications: Math.max(0, state.stats.totalApplications - state.selectedCompanies.length)
    }
  })),

  // Initialize with sample data
  initializeSampleData: () => set({
    user: sampleUser,
    stats: sampleUserStats,
    companies: sampleTargetCompanies,
    connections: sampleConnections,
    outreach: sampleOutreach,
    reminders: sampleReminders,
    timelineEvents: sampleTimelineEvents,
    notes: sampleNotes
  })
}));

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
  CompanyStatus,
  Interaction
} from './types';
import {
  sampleUser,
  sampleConnections,
  sampleTargetCompanies,
  sampleOutreach,
  sampleReminders,
  sampleTimelineEvents,
  sampleNotes,
  sampleUserStats,
  sampleInteractions
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

  // Interactions (NEW)
  interactions: Interaction[];

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
  sortBy: 'recent' | 'active' | 'priority' | 'deadline';

  // UI State
  selectedCompanies: string[];
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  recalculateStats: () => void;

  // Company actions
  addCompany: (company: TargetCompany) => void;
  updateCompany: (id: string, updates: Partial<TargetCompany>) => void;
  deleteCompany: (id: string) => void;
  setSelectedCompany: (id: string | null) => void;
  updateCompanyStatus: (id: string, status: CompanyStatus) => void;
  linkContactToCompany: (companyId: string, contactId: string) => void;
  unlinkContactFromCompany: (companyId: string, contactId: string) => void;

  // Connection actions
  addConnection: (connection: Connection) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;

  // Interaction actions (NEW)
  addInteraction: (interaction: Interaction) => void;
  updateInteraction: (id: string, updates: Partial<Interaction>) => void;
  deleteInteraction: (id: string) => void;
  getInteractionsForContact: (contactId: string) => Interaction[];
  getInteractionsForCompany: (companyId: string) => Interaction[];

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
  setSortBy: (sortBy: 'recent' | 'active' | 'priority' | 'deadline') => void;

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
  // Initial state
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
  interactions: [],
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

  recalculateStats: () => set((state) => {
    const companies = state.companies;
    const reminders = state.reminders;
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      stats: {
        totalApplications: companies.length,
        applied: companies.filter(c => c.status === 'applied').length,
        interviewing: companies.filter(c => c.status === 'interviewing').length,
        offers: companies.filter(c => c.status === 'offer').length,
        rejected: companies.filter(c => c.status === 'rejected').length,
        upcomingDeadlines: companies.filter(c =>
          c.application_deadline &&
          new Date(c.application_deadline) <= weekFromNow &&
          new Date(c.application_deadline) >= now
        ).length,
        tasksDue: reminders.filter(r => !r.completed && new Date(r.reminder_date) <= weekFromNow).length
      }
    };
  }),

  // Company actions
  addCompany: (company) => {
    set((state) => ({
      companies: [...state.companies, company]
    }));
    get().recalculateStats();
  },

  updateCompany: (id, updates) => set((state) => ({
    companies: state.companies.map((c) =>
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    )
  })),

  deleteCompany: (id) => {
    set((state) => ({
      companies: state.companies.filter((c) => c.id !== id)
    }));
    get().recalculateStats();
  },

  setSelectedCompany: (id) => set({ selectedCompanyId: id }),

  updateCompanyStatus: (id, status) => {
    set((state) => {
      const company = state.companies.find(c => c.id === id);
      if (!company) return state;

      const newEvent: TimelineEvent = {
        id: `event-${Date.now()}`,
        type: 'status_changed',
        title: `Status updated to ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `Application status changed from "${company.status}" to "${status}"`,
        date: new Date().toISOString()
      };

      return {
        companies: state.companies.map((c) =>
          c.id === id ? { ...c, status, updated_at: new Date().toISOString() } : c
        ),
        timelineEvents: {
          ...state.timelineEvents,
          [id]: [...(state.timelineEvents[id] || []), newEvent]
        }
      };
    });
    get().recalculateStats();
  },

  linkContactToCompany: (companyId, contactId) => set((state) => ({
    companies: state.companies.map((c) =>
      c.id === companyId
        ? { ...c, linked_contact_ids: [...(c.linked_contact_ids || []), contactId], updated_at: new Date().toISOString() }
        : c
    ),
    connections: state.connections.map((conn) =>
      conn.id === contactId
        ? { ...conn, linked_application_ids: [...(conn.linked_application_ids || []), companyId], updated_at: new Date().toISOString() }
        : conn
    )
  })),

  unlinkContactFromCompany: (companyId, contactId) => set((state) => ({
    companies: state.companies.map((c) =>
      c.id === companyId
        ? { ...c, linked_contact_ids: (c.linked_contact_ids || []).filter(id => id !== contactId), updated_at: new Date().toISOString() }
        : c
    ),
    connections: state.connections.map((conn) =>
      conn.id === contactId
        ? { ...conn, linked_application_ids: (conn.linked_application_ids || []).filter(id => id !== companyId), updated_at: new Date().toISOString() }
        : conn
    )
  })),

  // Connection actions
  addConnection: (connection) => set((state) => ({
    connections: [...state.connections, connection]
  })),

  updateConnection: (id, updates) => set((state) => ({
    connections: state.connections.map((c) =>
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    )
  })),

  deleteConnection: (id) => set((state) => ({
    connections: state.connections.filter((c) => c.id !== id),
    interactions: state.interactions.filter((i) => i.connection_id !== id)
  })),

  // Interaction actions
  addInteraction: (interaction) => set((state) => {
    // Also update last_contacted on the connection
    const updatedConnections = state.connections.map((c) =>
      c.id === interaction.connection_id
        ? { ...c, last_contacted: interaction.date, updated_at: new Date().toISOString() }
        : c
    );

    // Add timeline event if linked to a company
    let updatedTimelineEvents = state.timelineEvents;
    if (interaction.target_company_id) {
      const newEvent: TimelineEvent = {
        id: `event-${Date.now()}`,
        type: 'interaction',
        title: interaction.title,
        description: interaction.description,
        date: interaction.date,
        metadata: { interaction_id: interaction.id, connection_id: interaction.connection_id }
      };
      updatedTimelineEvents = {
        ...state.timelineEvents,
        [interaction.target_company_id]: [...(state.timelineEvents[interaction.target_company_id] || []), newEvent]
      };
    }

    return {
      interactions: [...state.interactions, interaction],
      connections: updatedConnections,
      timelineEvents: updatedTimelineEvents
    };
  }),

  updateInteraction: (id, updates) => set((state) => ({
    interactions: state.interactions.map((i) =>
      i.id === id ? { ...i, ...updates } : i
    )
  })),

  deleteInteraction: (id) => set((state) => ({
    interactions: state.interactions.filter((i) => i.id !== id)
  })),

  getInteractionsForContact: (contactId) => {
    return get().interactions
      .filter(i => i.connection_id === contactId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getInteractionsForCompany: (companyId) => {
    return get().interactions
      .filter(i => i.target_company_id === companyId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

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
  addReminder: (reminder) => {
    set((state) => ({
      reminders: [...state.reminders, reminder]
    }));
    get().recalculateStats();
  },

  updateReminder: (id, updates) => set((state) => ({
    reminders: state.reminders.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    )
  })),

  completeReminder: (id) => {
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === id ? { ...r, completed: true, completed_at: new Date().toISOString() } : r
      )
    }));
    get().recalculateStats();
  },

  deleteReminder: (id) => {
    set((state) => ({
      reminders: state.reminders.filter((r) => r.id !== id)
    }));
    get().recalculateStats();
  },

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

  bulkUpdateStatus: (status) => {
    set((state) => ({
      companies: state.companies.map((c) =>
        state.selectedCompanies.includes(c.id)
          ? { ...c, status, updated_at: new Date().toISOString() }
          : c
      ),
      selectedCompanies: []
    }));
    get().recalculateStats();
  },

  bulkDelete: () => {
    set((state) => ({
      companies: state.companies.filter((c) => !state.selectedCompanies.includes(c.id)),
      selectedCompanies: []
    }));
    get().recalculateStats();
  },

  // Initialize with sample data
  initializeSampleData: () => {
    set({
      user: sampleUser,
      stats: sampleUserStats,
      companies: sampleTargetCompanies,
      connections: sampleConnections,
      interactions: sampleInteractions,
      outreach: sampleOutreach,
      reminders: sampleReminders,
      timelineEvents: sampleTimelineEvents,
      notes: sampleNotes
    });
  }
}));

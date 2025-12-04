"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  MessageSquare,
  User,
  Clock,
  FileText,
  Plus,
  ExternalLink,
  Star,
  Link2,
  X,
  Users,
  Phone,
  Mail,
  Video,
  Coffee,
  AlertCircle,
  Bell,
  CheckCircle2,
  Sparkles,
  Briefcase
} from "lucide-react";
import {
  formatDate,
  formatRelativeTime,
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
  getDaysSince
} from "@/lib/utils";
import toast from "react-hot-toast";
import { CompanyStatus, TimelineEvent, Note, Reminder, InteractionTypeLabels, Interaction } from "@/lib/types";

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [newNote, setNewNote] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showLinkContactModal, setShowLinkContactModal] = useState(false);
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);

  // Reminder form state
  const [reminderMessage, setReminderMessage] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderType, setReminderType] = useState<"follow_up" | "apply" | "call_prep" | "other">("follow_up");

  const company = useCRMStore((state) =>
    state.companies.find((c) => c.id === companyId)
  );
  const connections = useCRMStore((state) => state.connections);
  const outreach = useCRMStore((state) => state.outreach);
  const interactions = useCRMStore((state) => state.interactions);
  const reminders = useCRMStore((state) => state.reminders);
  const timelineEvents = useCRMStore((state) => state.timelineEvents[companyId] || []);
  const notes = useCRMStore((state) => state.notes[companyId] || []);

  const updateCompanyStatus = useCRMStore((state) => state.updateCompanyStatus);
  const deleteCompany = useCRMStore((state) => state.deleteCompany);
  const addNote = useCRMStore((state) => state.addNote);
  const deleteNote = useCRMStore((state) => state.deleteNote);
  const linkContactToCompany = useCRMStore((state) => state.linkContactToCompany);
  const unlinkContactFromCompany = useCRMStore((state) => state.unlinkContactFromCompany);
  const addReminder = useCRMStore((state) => state.addReminder);
  const completeReminder = useCRMStore((state) => state.completeReminder);
  const getInteractionsForCompany = useCRMStore((state) => state.getInteractionsForCompany);

  // Avatar gradient based on company name
  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-blue-500 to-cyan-600",
      "from-violet-500 to-purple-600",
      "from-rose-500 to-pink-600",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-teal-600",
      "from-indigo-500 to-blue-600"
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application not found</h2>
          <p className="text-gray-500 mb-4">This application may have been deleted</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get linked contacts
  const linkedContacts = connections.filter(
    (c) => company.linked_contact_ids?.includes(c.id)
  );

  // Get unlinked contacts for the modal
  const unlinkedContacts = connections.filter(
    (c) => !company.linked_contact_ids?.includes(c.id)
  );

  // Get interactions for this company
  const companyInteractions = getInteractionsForCompany(companyId);

  // Get reminders for this company
  const companyReminders = reminders.filter(
    (r) => r.target_company_id === companyId && !r.completed
  );

  const companyOutreach = outreach.filter((o) => o.target_company_id === company.id);

  // Calculate days until deadline
  const daysUntilDeadline = company.application_deadline
    ? Math.ceil((new Date(company.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleStatusChange = (newStatus: CompanyStatus) => {
    updateCompanyStatus(company.id, newStatus);
    setShowStatusMenu(false);
    toast.success(`Status updated to ${getStatusLabel(newStatus)}`);

    if (newStatus === "offer") {
      toast.success("Congratulations on your offer!", { duration: 3000 });
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${company.company_name}?`)) {
      deleteCompany(company.id);
      toast.success("Application removed");
      router.push("/dashboard");
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: `note-${Date.now()}`,
      target_company_id: company.id,
      user_id: "user-1",
      content: newNote,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addNote(company.id, note);
    setNewNote("");
    toast.success("Note added");
  };

  const handleLinkContact = (contactId: string) => {
    linkContactToCompany(company.id, contactId);
    toast.success("Contact linked to application");
    setShowLinkContactModal(false);
  };

  const handleUnlinkContact = (contactId: string) => {
    unlinkContactFromCompany(company.id, contactId);
    toast.success("Contact unlinked from application");
  };

  const handleAddReminder = () => {
    if (!reminderMessage.trim() || !reminderDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      user_id: "user-1",
      target_company_id: company.id,
      reminder_type: reminderType,
      reminder_date: new Date(reminderDate).toISOString(),
      message: reminderMessage.trim(),
      completed: false,
      created_at: new Date().toISOString()
    };

    addReminder(newReminder);
    setShowAddReminderModal(false);
    setReminderMessage("");
    setReminderDate("");
    setReminderType("follow_up");
    toast.success("Task added");
  };

  const statusOptions: CompanyStatus[] = [
    "thinking",
    "applied",
    "interviewing",
    "offer",
    "rejected"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className={`p-4 bg-gradient-to-br ${getAvatarGradient(company.company_name)} rounded-2xl shadow-xl`}>
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{company.company_name}</h1>
                <p className="text-lg text-gray-500 mt-1">{company.role}</p>
                <div className="flex items-center flex-wrap gap-3 mt-3">
                  {company.location && (
                    <span className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                      {company.location}
                    </span>
                  )}
                  <span className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                    Added {formatDate(company.created_at, "MMM d, yyyy")}
                  </span>
                  {daysUntilDeadline !== null && (
                    <span className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${
                      daysUntilDeadline <= 0 ? "bg-red-50 text-red-700 border border-red-200" :
                      daysUntilDeadline <= 3 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      <Clock className="h-4 w-4 mr-1.5" />
                      {daysUntilDeadline <= 0 ? "Past deadline" :
                       daysUntilDeadline === 1 ? "Due tomorrow" :
                       `${daysUntilDeadline} days left`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowAddReminderModal(true)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Bell className="h-4 w-4" />
                <span>Add Task</span>
              </button>
              <button
                onClick={() => router.push(`/company/${company.id}/edit`)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Status Badge & Actions */}
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold border-2 cursor-pointer transition-all duration-200 ${getStatusColor(company.status)}`}
              >
                <span className="mr-2">{getStatusIcon(company.status)}</span>
                {getStatusLabel(company.status)}
              </button>

              {showStatusMenu && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-10 max-h-80 overflow-y-auto">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                        company.status === status ? "bg-blue-50 text-blue-600" : ""
                      }`}
                    >
                      <span className="text-lg">{getStatusIcon(status)}</span>
                      <span className="font-medium">{getStatusLabel(status)}</span>
                      {company.status === status && <CheckCircle2 className="h-4 w-4 ml-auto text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {company.job_url && (
              <a
                href={company.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl text-sm font-medium text-blue-700 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
              >
                View Job Posting
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Tasks */}
            {companyReminders.length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Pending Tasks</h3>
                    <p className="text-sm text-amber-700">{companyReminders.length} task{companyReminders.length !== 1 ? "s" : ""} due</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {companyReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-100 hover:border-amber-200 transition-all duration-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{reminder.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {formatDate(reminder.reminder_date, "MMM d, yyyy")}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          completeReminder(reminder.id);
                          toast.success("Task completed!");
                        }}
                        className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interaction History */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Interaction History</h2>
                  <p className="text-sm text-gray-500">{companyInteractions.length} interaction{companyInteractions.length !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {companyInteractions.length > 0 ? (
                <div className="space-y-4">
                  {companyInteractions.map((interaction) => {
                    const contact = connections.find(c => c.id === interaction.connection_id);
                    return (
                      <div
                        key={interaction.id}
                        className="p-5 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                              <MessageSquare className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{interaction.title}</h4>
                              <p className="text-sm text-blue-600 font-medium">
                                {InteractionTypeLabels[interaction.type]}
                                {contact && (
                                  <span className="text-gray-500 font-normal">
                                    {" "}with {contact.full_name}
                                  </span>
                                )}
                              </p>
                              {interaction.description && (
                                <p className="text-sm text-gray-600 mt-2 bg-white p-3 rounded-lg border border-gray-100">{interaction.description}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                            {formatDate(interaction.date, "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">No interactions yet</p>
                  <p className="text-sm text-gray-500">Log interactions from your contact pages</p>
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Activity Timeline</h2>
                  <p className="text-sm text-gray-500">Recent activity</p>
                </div>
              </div>

              {timelineEvents.length > 0 ? (
                <div className="space-y-4">
                  {timelineEvents
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((event) => (
                      <div key={event.id} className="flex items-start gap-4">
                        <div className={`p-2 rounded-xl flex-shrink-0 ${
                          event.type === "status_changed" ? "bg-gradient-to-br from-blue-500 to-indigo-600" :
                          event.type === "interaction" ? "bg-gradient-to-br from-emerald-500 to-teal-600" :
                          "bg-gradient-to-br from-gray-400 to-gray-500"
                        } shadow-lg`}>
                          {event.type === "status_changed" ? <Clock className="h-4 w-4 text-white" /> :
                           event.type === "interaction" ? <MessageSquare className="h-4 w-4 text-white" /> :
                           <FileText className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(event.date)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">No activity yet</p>
                  <p className="text-sm text-gray-500">Activity will appear as you update this application</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Notes</h2>
                  <p className="text-sm text-gray-500">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Add Note */}
              <div className="mb-6">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add notes about this application..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none placeholder:text-gray-400"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium shadow-lg shadow-blue-500/25 disabled:shadow-none"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Note</span>
                  </button>
                </div>
              </div>

              {/* Notes List */}
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((note) => (
                      <div
                        key={note.id}
                        className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-xs text-gray-500 font-medium">
                            {formatRelativeTime(note.created_at)}
                          </p>
                          <button
                            onClick={() => {
                              deleteNote(company.id, note.id);
                              toast.success("Note deleted");
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">
                  No notes yet. Add one above!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Linked Contacts */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 shadow">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Linked Contacts</h3>
                </div>
                <button
                  onClick={() => setShowLinkContactModal(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Link a contact"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {linkedContacts.length > 0 ? (
                <div className="space-y-3">
                  {linkedContacts.map((contact) => {
                    const daysSince = contact.last_contacted
                      ? getDaysSince(contact.last_contacted)
                      : null;
                    return (
                      <div
                        key={contact.id}
                        className="p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className="flex items-start gap-3 flex-1 cursor-pointer"
                            onClick={() => router.push(`/connections/${contact.id}`)}
                          >
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                              <span className="text-xs font-bold text-white">
                                {contact.full_name.split(" ").map(n => n[0]).join("")}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors">
                                {contact.full_name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {contact.current_role}
                              </p>
                              {daysSince !== null && (
                                <span className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-semibold ${
                                  daysSince <= 7 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                  daysSince <= 30 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                  "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                  {daysSince === 0 ? "Today" : `${daysSince}d ago`}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnlinkContact(contact.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            title="Unlink contact"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">No linked contacts</p>
                  <button
                    onClick={() => setShowLinkContactModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Link a contact
                  </button>
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Job Details</h3>

              <div className="space-y-4">
                {company.application_deadline && (
                  <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Deadline</p>
                    <p className={`font-semibold ${
                      daysUntilDeadline !== null && daysUntilDeadline <= 3
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}>
                      {formatDate(company.application_deadline, "MMMM d, yyyy")}
                    </p>
                  </div>
                )}

                {company.required_skills.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {company.required_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {company.job_description && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-gray-600 line-clamp-4 bg-gray-50 p-3 rounded-lg">{company.job_description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/25">
              <h3 className="font-bold mb-5 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Application Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span className="text-blue-100 text-sm font-medium">Linked Contacts</span>
                  <span className="font-bold text-2xl">{linkedContacts.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span className="text-blue-100 text-sm font-medium">Interactions</span>
                  <span className="font-bold text-2xl">{companyInteractions.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span className="text-blue-100 text-sm font-medium">Notes</span>
                  <span className="font-bold text-2xl">{notes.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span className="text-blue-100 text-sm font-medium">Pending Tasks</span>
                  <span className="font-bold text-2xl">{companyReminders.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Link Contact Modal */}
      {showLinkContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Link Contact</h3>
                  <p className="text-sm text-gray-500 mt-1">Connect a contact to this application</p>
                </div>
                <button
                  onClick={() => setShowLinkContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-80 overflow-y-auto">
              {unlinkedContacts.length > 0 ? (
                <div className="space-y-2">
                  {unlinkedContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleLinkContact(contact.id)}
                      className="w-full p-4 text-left bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 flex items-center justify-between group border border-gray-100 hover:border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xs font-bold text-white">
                            {contact.full_name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{contact.full_name}</p>
                          <p className="text-sm text-gray-500">
                            {contact.current_role} {contact.current_company && `at ${contact.current_company}`}
                          </p>
                        </div>
                      </div>
                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:shadow-lg transition-all">
                        <Plus className="h-5 w-5 text-gray-400 group-hover:text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 mb-3 font-medium">No contacts available to link</p>
                  <button
                    onClick={() => {
                      setShowLinkContactModal(false);
                      router.push("/networking");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add a new contact
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Add Task</h3>
                  <p className="text-sm text-gray-500 mt-1">Create a reminder for this application</p>
                </div>
                <button
                  onClick={() => setShowAddReminderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Type
                </label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                >
                  <option value="follow_up">Follow Up</option>
                  <option value="apply">Submit Application</option>
                  <option value="call_prep">Prepare for Call</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Description *
                </label>
                <input
                  type="text"
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  placeholder="e.g., Follow up on application status"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddReminderModal(false)}
                className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReminder}
                disabled={!reminderMessage.trim() || !reminderDate}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 disabled:shadow-none"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

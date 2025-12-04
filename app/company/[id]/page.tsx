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
  CheckCircle2
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

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application not found</h2>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:text-blue-700"
          >
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
    toast.success("Reminder added");
  };

  const statusOptions: CompanyStatus[] = [
    "thinking",
    "applied",
    "interviewing",
    "offer",
    "rejected"
  ];

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

          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{company.company_name}</h1>
                <p className="text-lg text-gray-600 mt-1">{company.role}</p>
                <div className="flex items-center flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  {company.location && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {company.location}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Added {formatDate(company.created_at, "MMM d, yyyy")}
                  </span>
                  {daysUntilDeadline !== null && (
                    <span className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      daysUntilDeadline <= 0 ? "bg-red-100 text-red-700" :
                      daysUntilDeadline <= 3 ? "bg-orange-100 text-orange-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {daysUntilDeadline <= 0 ? "Past deadline" :
                       daysUntilDeadline === 1 ? "Due tomorrow" :
                       `${daysUntilDeadline} days until deadline`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddReminderModal(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Bell className="h-4 w-4" />
                <span>Add Task</span>
              </button>
              <button
                onClick={() => router.push(`/company/${company.id}/edit`)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Status Badge & Actions */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer ${getStatusColor(
                  company.status
                )}`}
              >
                <span className="mr-2">{getStatusIcon(company.status)}</span>
                {getStatusLabel(company.status)}
              </button>

              {showStatusMenu && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 max-h-80 overflow-y-auto">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                        company.status === status ? "bg-blue-50 text-blue-600" : ""
                      }`}
                    >
                      <span>{getStatusIcon(status)}</span>
                      <span>{getStatusLabel(status)}</span>
                      {company.status === status && <CheckCircle2 className="h-4 w-4 ml-auto" />}
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
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View Job Posting
                <ExternalLink className="h-4 w-4 ml-2" />
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
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Pending Tasks ({companyReminders.length})
                </h3>
                <div className="space-y-2">
                  {companyReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{reminder.message}</p>
                        <p className="text-xs text-gray-600">
                          Due: {formatDate(reminder.reminder_date, "MMM d, yyyy")}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          completeReminder(reminder.id);
                          toast.success("Task completed!");
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interaction History */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
                Interaction History
              </h2>

              {companyInteractions.length > 0 ? (
                <div className="space-y-4">
                  {companyInteractions.map((interaction) => {
                    const contact = connections.find(c => c.id === interaction.connection_id);
                    return (
                      <div
                        key={interaction.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                              <MessageSquare className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{interaction.title}</h4>
                              <p className="text-sm text-blue-600 font-medium">
                                {InteractionTypeLabels[interaction.type]}
                                {contact && (
                                  <span className="text-gray-500 font-normal">
                                    {" "}with {contact.full_name}
                                  </span>
                                )}
                              </p>
                              {interaction.description && (
                                <p className="text-sm text-gray-600 mt-2">{interaction.description}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(interaction.date, "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No interactions yet</p>
                  <p className="text-sm mt-1">Log interactions from your contact pages</p>
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-blue-600" />
                Activity Timeline
              </h2>

              {timelineEvents.length > 0 ? (
                <div className="space-y-4">
                  {timelineEvents
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((event) => (
                      <div key={event.id} className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full flex-shrink-0 ${
                          event.type === "status_changed" ? "bg-blue-100 text-blue-600" :
                          event.type === "interaction" ? "bg-green-100 text-green-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {event.type === "status_changed" ? <Clock className="h-4 w-4" /> :
                           event.type === "interaction" ? <MessageSquare className="h-4 w-4" /> :
                           <FileText className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                          <p className="text-xs text-gray-600">{event.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(event.date)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No activity yet</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Notes
              </h2>

              {/* Add Note */}
              <div className="mb-6">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add notes about this application..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
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
                        className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-xs text-gray-600">
                            {formatRelativeTime(note.created_at)}
                          </p>
                          <button
                            onClick={() => {
                              deleteNote(company.id, note.id);
                              toast.success("Note deleted");
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No notes yet
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Linked Contacts */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Linked Contacts
                </h3>
                <button
                  onClick={() => setShowLinkContactModal(true)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                        className="p-3 bg-gray-50 rounded-lg group"
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className="flex items-start space-x-3 flex-1 cursor-pointer"
                            onClick={() => router.push(`/connections/${contact.id}`)}
                          >
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-blue-600">
                                {contact.full_name.split(" ").map(n => n[0]).join("")}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm hover:text-blue-600 transition-colors">
                                {contact.full_name}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {contact.current_role}
                              </p>
                              {daysSince !== null && (
                                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                                  daysSince <= 7 ? "bg-green-100 text-green-700" :
                                  daysSince <= 30 ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {daysSince === 0 ? "Today" : `${daysSince}d ago`}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnlinkContact(contact.id)}
                            className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
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
                <div className="text-center py-6">
                  <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">No linked contacts</p>
                  <button
                    onClick={() => setShowLinkContactModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Link a contact
                  </button>
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>

              <div className="space-y-4">
                {company.application_deadline && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Deadline</p>
                    <p className={`font-medium ${
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
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {company.required_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {company.job_description && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-gray-600 line-clamp-4">{company.job_description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Application Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Linked Contacts</span>
                  <span className="font-bold text-xl">{linkedContacts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Interactions</span>
                  <span className="font-bold text-xl">{companyInteractions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Notes</span>
                  <span className="font-bold text-xl">{notes.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Pending Tasks</span>
                  <span className="font-bold text-xl">{companyReminders.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Link Contact Modal */}
      {showLinkContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Link Contact</h3>
                <button
                  onClick={() => setShowLinkContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Connect a contact to this application
              </p>
            </div>

            <div className="p-6 max-h-80 overflow-y-auto">
              {unlinkedContacts.length > 0 ? (
                <div className="space-y-2">
                  {unlinkedContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleLinkContact(contact.id)}
                      className="w-full p-3 text-left bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {contact.full_name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{contact.full_name}</p>
                          <p className="text-sm text-gray-600">
                            {contact.current_role} {contact.current_company && `at ${contact.current_company}`}
                          </p>
                        </div>
                      </div>
                      <Plus className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No contacts available to link</p>
                  <button
                    onClick={() => {
                      setShowLinkContactModal(false);
                      router.push("/networking");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add Task</h3>
                <button
                  onClick={() => setShowAddReminderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Type
                </label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="follow_up">Follow Up</option>
                  <option value="apply">Submit Application</option>
                  <option value="call_prep">Prepare for Call</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Description *
                </label>
                <input
                  type="text"
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  placeholder="e.g., Follow up on application status"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddReminderModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReminder}
                disabled={!reminderMessage.trim() || !reminderDate}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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

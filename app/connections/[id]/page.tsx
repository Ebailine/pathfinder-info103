"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import {
  ArrowLeft,
  User,
  Building2,
  Mail,
  Phone,
  Linkedin,
  Calendar,
  MessageSquare,
  Briefcase,
  Plus,
  Clock,
  Video,
  Coffee,
  Users,
  ChevronDown,
  Link2,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { formatDate, getDaysSince } from "@/lib/utils";
import { InteractionType, InteractionTypeLabels, Interaction } from "@/lib/types";
import toast from "react-hot-toast";

const interactionIcons: Record<InteractionType, React.ReactNode> = {
  email_sent: <Mail className="h-4 w-4" />,
  email_received: <Mail className="h-4 w-4" />,
  linkedin_message: <Linkedin className="h-4 w-4" />,
  phone_call: <Phone className="h-4 w-4" />,
  video_call: <Video className="h-4 w-4" />,
  coffee_chat: <Coffee className="h-4 w-4" />,
  informational_interview: <Users className="h-4 w-4" />,
  referral_received: <CheckCircle2 className="h-4 w-4" />,
  introduction_made: <Users className="h-4 w-4" />,
  meeting: <Calendar className="h-4 w-4" />,
  other: <MessageSquare className="h-4 w-4" />
};

export default function ConnectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const connectionId = params.id as string;

  const connection = useCRMStore((state) =>
    state.connections.find((c) => c.id === connectionId)
  );
  const user = useCRMStore((state) => state.user);
  const companies = useCRMStore((state) => state.companies);
  const getInteractionsForContact = useCRMStore((state) => state.getInteractionsForContact);
  const addInteraction = useCRMStore((state) => state.addInteraction);
  const linkContactToCompany = useCRMStore((state) => state.linkContactToCompany);
  const unlinkContactFromCompany = useCRMStore((state) => state.unlinkContactFromCompany);

  // Get interactions for this contact
  const interactions = getInteractionsForContact(connectionId);

  // Interaction form state
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [interactionType, setInteractionType] = useState<InteractionType>("email_sent");
  const [interactionTitle, setInteractionTitle] = useState("");
  const [interactionDescription, setInteractionDescription] = useState("");
  const [interactionDate, setInteractionDate] = useState(new Date().toISOString().split("T")[0]);
  const [linkedCompanyId, setLinkedCompanyId] = useState<string>("");
  const [followUpNeeded, setFollowUpNeeded] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");

  // Link to application state
  const [showLinkModal, setShowLinkModal] = useState(false);

  // Notes state (local for now)
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<Array<{ id: string; content: string; date: string }>>([]);

  if (!connection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact not found</h2>
          <button
            onClick={() => router.push("/networking")}
            className="text-blue-600 hover:text-blue-700"
          >
            Return to Contacts
          </button>
        </div>
      </div>
    );
  }

  // Get linked applications
  const linkedApplications = companies.filter(
    c => connection.linked_application_ids?.includes(c.id)
  );

  // Get unlinked applications for linking modal
  const unlinkedApplications = companies.filter(
    c => !connection.linked_application_ids?.includes(c.id)
  );

  // Calculate days since last contact
  const daysSinceContact = connection.last_contacted
    ? getDaysSince(connection.last_contacted)
    : null;

  const handleAddInteraction = () => {
    if (!interactionTitle.trim()) {
      toast.error("Please enter a title for the interaction");
      return;
    }

    const newInteraction: Interaction = {
      id: `int-${Date.now()}`,
      user_id: user?.id || "user-1",
      connection_id: connectionId,
      target_company_id: linkedCompanyId || undefined,
      type: interactionType,
      title: interactionTitle.trim(),
      description: interactionDescription.trim(),
      date: new Date(interactionDate).toISOString(),
      follow_up_needed: followUpNeeded,
      follow_up_date: followUpNeeded && followUpDate ? new Date(followUpDate).toISOString() : undefined,
      created_at: new Date().toISOString()
    };

    addInteraction(newInteraction);

    // Reset form
    setShowInteractionForm(false);
    setInteractionType("email_sent");
    setInteractionTitle("");
    setInteractionDescription("");
    setInteractionDate(new Date().toISOString().split("T")[0]);
    setLinkedCompanyId("");
    setFollowUpNeeded(false);
    setFollowUpDate("");

    toast.success("Interaction logged successfully!");
  };

  const handleLinkApplication = (companyId: string) => {
    linkContactToCompany(companyId, connectionId);
    toast.success("Application linked to contact");
    setShowLinkModal(false);
  };

  const handleUnlinkApplication = (companyId: string) => {
    unlinkContactFromCompany(companyId, connectionId);
    toast.success("Application unlinked from contact");
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note = {
      id: `note-${Date.now()}`,
      content: newNote.trim(),
      date: new Date().toISOString()
    };

    setNotes([note, ...notes]);
    setNewNote("");
    toast.success("Note added");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/networking")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Contacts
          </button>

          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-2xl font-bold text-white">
                {connection.full_name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{connection.full_name}</h1>
              <p className="text-lg text-gray-600 mt-1">
                {connection.current_role} {connection.current_company && `at ${connection.current_company}`}
              </p>

              {/* Last Contacted Badge */}
              <div className="flex flex-wrap gap-2 mt-3">
                {daysSinceContact !== null && (
                  <span className={`px-3 py-1 text-sm rounded-full flex items-center ${
                    daysSinceContact <= 7
                      ? "bg-green-100 text-green-800"
                      : daysSinceContact <= 30
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}>
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    {daysSinceContact === 0
                      ? "Contacted today"
                      : `Last contacted ${daysSinceContact} days ago`}
                  </span>
                )}
                {daysSinceContact === null && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                    No interactions logged
                  </span>
                )}
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
                {connection.mutual_connections > 0 && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {connection.mutual_connections} Mutual Connections
                  </span>
                )}
              </div>
            </div>

            {/* Log Interaction Button */}
            <button
              onClick={() => setShowInteractionForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md"
            >
              <Plus className="h-5 w-5" />
              <span>Log Interaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interaction History */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Interaction History
                </h2>
                <span className="text-sm text-gray-500">
                  {interactions.length} interaction{interactions.length !== 1 ? "s" : ""}
                </span>
              </div>

              {interactions.length > 0 ? (
                <div className="space-y-4">
                  {interactions.map((interaction) => {
                    const linkedCompany = companies.find(c => c.id === interaction.target_company_id);
                    return (
                      <div
                        key={interaction.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                              {interactionIcons[interaction.type]}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{interaction.title}</h4>
                              <p className="text-sm text-blue-600 font-medium">
                                {InteractionTypeLabels[interaction.type]}
                              </p>
                              {interaction.description && (
                                <p className="text-sm text-gray-600 mt-2">
                                  {interaction.description}
                                </p>
                              )}
                              {linkedCompany && (
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  Related to: {linkedCompany.company_name} - {linkedCompany.role}
                                </div>
                              )}
                              {interaction.follow_up_needed && interaction.follow_up_date && (
                                <div className="mt-2 flex items-center text-xs text-orange-600">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Follow-up: {formatDate(interaction.follow_up_date, "MMM d, yyyy")}
                                </div>
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
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2">No interactions logged yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Start tracking your conversations with {connection.full_name.split(" ")[0]}
                  </p>
                  <button
                    onClick={() => setShowInteractionForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Log First Interaction
                  </button>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {connection.current_company && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <dt className="text-xs text-gray-500">Company</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {connection.current_company}
                      </dd>
                    </div>
                  </div>
                )}
                {connection.current_role && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <dt className="text-xs text-gray-500">Role</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {connection.current_role}
                      </dd>
                    </div>
                  </div>
                )}
                {connection.email && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <dt className="text-xs text-gray-500">Email</dt>
                      <dd className="text-sm font-medium text-blue-600">
                        <a href={`mailto:${connection.email}`}>{connection.email}</a>
                      </dd>
                    </div>
                  </div>
                )}
                {connection.phone && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <dt className="text-xs text-gray-500">Phone</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {connection.phone}
                      </dd>
                    </div>
                  </div>
                )}
                {connection.connection_date && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <dt className="text-xs text-gray-500">Connected Since</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatDate(connection.connection_date, "MMMM d, yyyy")}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>

              {connection.linkedin_url && (
                <a
                  href={connection.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  View LinkedIn Profile
                </a>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Notes
              </h2>

              {/* Add Note */}
              <div className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this contact..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(note.date, "MMM d, h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No notes yet
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Linked Applications */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Link2 className="h-5 w-5 mr-2 text-blue-600" />
                  Linked Applications
                </h3>
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Link to application"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {linkedApplications.length > 0 ? (
                <div className="space-y-3">
                  {linkedApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 bg-gray-50 rounded-lg group"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => router.push(`/company/${app.id}`)}
                        >
                          <p className="text-sm font-medium text-gray-900 hover:text-blue-600">
                            {app.company_name}
                          </p>
                          <p className="text-xs text-gray-600">{app.role}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full capitalize ${
                            app.status === "interviewing" ? "bg-yellow-100 text-yellow-800" :
                            app.status === "offer" ? "bg-green-100 text-green-800" :
                            app.status === "rejected" ? "bg-red-100 text-red-800" :
                            app.status === "applied" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <button
                          onClick={() => handleUnlinkApplication(app.id)}
                          className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          title="Unlink application"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-2">No linked applications</p>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Link an application
                  </button>
                </div>
              )}
            </div>

            {/* How You Know Them */}
            {connection.how_you_know && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How You Know Them</h3>
                <p className="text-sm text-gray-700">{connection.how_you_know}</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Connection Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Total Interactions</span>
                  <span className="font-bold text-xl">{interactions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Linked Applications</span>
                  <span className="font-bold text-xl">{linkedApplications.length}</span>
                </div>
                {connection.last_contacted && (
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Days Since Contact</span>
                    <span className="font-bold text-xl">{daysSinceContact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Interaction Modal */}
      {showInteractionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Log Interaction</h3>
                <button
                  onClick={() => setShowInteractionForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Record your interaction with {connection.full_name}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Interaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interaction Type
                </label>
                <select
                  value={interactionType}
                  onChange={(e) => setInteractionType(e.target.value as InteractionType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(InteractionTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={interactionTitle}
                  onChange={(e) => setInteractionTitle(e.target.value)}
                  placeholder="e.g., 30-min coffee chat, Follow-up email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={interactionDate}
                  onChange={(e) => setInteractionDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes/Description
                </label>
                <textarea
                  value={interactionDescription}
                  onChange={(e) => setInteractionDescription(e.target.value)}
                  placeholder="Key takeaways, topics discussed, action items..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Link to Application */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Application (optional)
                </label>
                <select
                  value={linkedCompanyId}
                  onChange={(e) => setLinkedCompanyId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No linked application</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.company_name} - {company.role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Follow-up Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Follow-up needed?</p>
                  <p className="text-xs text-gray-500">Set a reminder to follow up</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFollowUpNeeded(!followUpNeeded)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    followUpNeeded ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      followUpNeeded ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Follow-up Date */}
              {followUpNeeded && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowInteractionForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInteraction}
                disabled={!interactionTitle.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Log Interaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Application Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Link Application</h3>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Connect {connection.full_name} to an application
              </p>
            </div>

            <div className="p-6 max-h-80 overflow-y-auto">
              {unlinkedApplications.length > 0 ? (
                <div className="space-y-2">
                  {unlinkedApplications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleLinkApplication(app.id)}
                      className="w-full p-3 text-left bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{app.company_name}</p>
                        <p className="text-sm text-gray-600">{app.role}</p>
                      </div>
                      <Plus className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">All applications are already linked</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

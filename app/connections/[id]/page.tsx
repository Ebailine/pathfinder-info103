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
  AlertCircle,
  Sparkles,
  GraduationCap,
  Edit3
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

const interactionColors: Record<InteractionType, string> = {
  email_sent: "from-blue-500 to-blue-600",
  email_received: "from-cyan-500 to-cyan-600",
  linkedin_message: "from-blue-600 to-indigo-600",
  phone_call: "from-emerald-500 to-teal-600",
  video_call: "from-violet-500 to-purple-600",
  coffee_chat: "from-amber-500 to-orange-600",
  informational_interview: "from-rose-500 to-pink-600",
  referral_received: "from-green-500 to-emerald-600",
  introduction_made: "from-indigo-500 to-violet-600",
  meeting: "from-sky-500 to-blue-600",
  other: "from-gray-500 to-gray-600"
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

  // Avatar gradient based on name
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

  if (!connection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact not found</h2>
          <p className="text-gray-500 mb-4">This contact may have been deleted</p>
          <button
            onClick={() => router.push("/networking")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push("/networking")}
            className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Contacts
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className={`h-24 w-24 bg-gradient-to-br ${getAvatarGradient(connection.full_name)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl`}>
              <span className="text-3xl font-bold text-white">
                {connection.full_name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{connection.full_name}</h1>
              <p className="text-lg text-gray-500 mt-1">
                {connection.current_role} {connection.current_company && (
                  <>at <span className="font-semibold text-gray-700">{connection.current_company}</span></>
                )}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {daysSinceContact !== null && (
                  <span className={`px-3 py-1.5 text-sm font-semibold rounded-full flex items-center gap-1.5 ${
                    daysSinceContact <= 7
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : daysSinceContact <= 30
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    <Clock className="h-4 w-4" />
                    {daysSinceContact === 0
                      ? "Contacted today"
                      : `Last contacted ${daysSinceContact}d ago`}
                  </span>
                )}
                {daysSinceContact === null && (
                  <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm font-semibold rounded-full flex items-center gap-1.5 border border-gray-200">
                    <AlertCircle className="h-4 w-4" />
                    No interactions logged
                  </span>
                )}
                {connection.same_school && (
                  <span className="px-3 py-1.5 bg-violet-50 text-violet-700 text-sm font-semibold rounded-full flex items-center gap-1.5 border border-violet-200">
                    <GraduationCap className="h-4 w-4" />
                    Same School
                  </span>
                )}
                {connection.same_major && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
                    Same Major
                  </span>
                )}
                {connection.mutual_connections > 0 && (
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full flex items-center gap-1.5 border border-indigo-200">
                    <Users className="h-4 w-4" />
                    {connection.mutual_connections} Mutual
                  </span>
                )}
              </div>
            </div>

            {/* Log Interaction Button */}
            <button
              onClick={() => setShowInteractionForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Log Interaction
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
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Interaction History</h2>
                    <p className="text-sm text-gray-500">{interactions.length} interaction{interactions.length !== 1 ? "s" : ""} logged</p>
                  </div>
                </div>
              </div>

              {interactions.length > 0 ? (
                <div className="space-y-4">
                  {interactions.map((interaction) => {
                    const linkedCompany = companies.find(c => c.id === interaction.target_company_id);
                    return (
                      <div
                        key={interaction.id}
                        className="p-5 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${interactionColors[interaction.type]} shadow-lg`}>
                            <div className="text-white">{interactionIcons[interaction.type]}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900">{interaction.title}</h4>
                                <p className="text-sm text-blue-600 font-medium">
                                  {InteractionTypeLabels[interaction.type]}
                                </p>
                              </div>
                              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                {formatDate(interaction.date, "MMM d, yyyy")}
                              </span>
                            </div>
                            {interaction.description && (
                              <p className="text-sm text-gray-600 mt-3 bg-white p-3 rounded-lg border border-gray-100">
                                {interaction.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {linkedCompany && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                                  <Building2 className="h-3 w-3" />
                                  {linkedCompany.company_name}
                                </span>
                              )}
                              {interaction.follow_up_needed && interaction.follow_up_date && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg font-medium border border-amber-200">
                                  <AlertCircle className="h-3 w-3" />
                                  Follow-up: {formatDate(interaction.follow_up_date, "MMM d")}
                                </span>
                              )}
                            </div>
                          </div>
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
                  <p className="font-semibold text-gray-900 mb-1">No interactions logged yet</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Start tracking your conversations with {connection.full_name.split(" ")[0]}
                  </p>
                  <button
                    onClick={() => setShowInteractionForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
                  >
                    <Plus className="h-4 w-4" />
                    Log First Interaction
                  </button>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-5">Contact Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {connection.current_company && (
                  <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100">
                    <div className="p-2 rounded-lg bg-gray-100 mr-3">
                      <Building2 className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Company</p>
                      <p className="text-sm font-semibold text-gray-900">{connection.current_company}</p>
                    </div>
                  </div>
                )}
                {connection.current_role && (
                  <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100">
                    <div className="p-2 rounded-lg bg-gray-100 mr-3">
                      <Briefcase className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Role</p>
                      <p className="text-sm font-semibold text-gray-900">{connection.current_role}</p>
                    </div>
                  </div>
                )}
                {connection.email && (
                  <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100">
                    <div className="p-2 rounded-lg bg-blue-50 mr-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <a href={`mailto:${connection.email}`} className="text-sm font-semibold text-blue-600 hover:underline">
                        {connection.email}
                      </a>
                    </div>
                  </div>
                )}
                {connection.phone && (
                  <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100">
                    <div className="p-2 rounded-lg bg-emerald-50 mr-3">
                      <Phone className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <p className="text-sm font-semibold text-gray-900">{connection.phone}</p>
                    </div>
                  </div>
                )}
                {connection.connection_date && (
                  <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100">
                    <div className="p-2 rounded-lg bg-violet-50 mr-3">
                      <Calendar className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Connected Since</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(connection.connection_date, "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {connection.linkedin_url && (
                <a
                  href={connection.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 font-medium border border-blue-100"
                >
                  <Linkedin className="h-4 w-4" />
                  View LinkedIn Profile
                </a>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                  <Edit3 className="h-5 w-5 text-white" />
                </div>
                <h2 className="font-bold text-gray-900">Notes</h2>
              </div>

              {/* Add Note */}
              <div className="mb-5">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this contact..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none placeholder:text-gray-400"
                  rows={3}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 disabled:shadow-none"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                      <p className="text-sm text-gray-900">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(note.date, "MMM d, h:mm a")}
                      </p>
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
            {/* Linked Applications */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow">
                    <Link2 className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Linked Apps</h3>
                </div>
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                      className="p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => router.push(`/company/${app.id}`)}
                        >
                          <p className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {app.company_name}
                          </p>
                          <p className="text-xs text-gray-500">{app.role}</p>
                          <span className={`inline-block mt-2 px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                            app.status === "interviewing" ? "bg-violet-50 text-violet-700 border border-violet-200" :
                            app.status === "offer" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            app.status === "rejected" ? "bg-red-50 text-red-700 border border-red-200" :
                            app.status === "applied" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                            "bg-gray-50 text-gray-700 border border-gray-200"
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <button
                          onClick={() => handleUnlinkApplication(app.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          title="Unlink application"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Link2 className="h-6 w-6 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">No linked applications</p>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Link an application
                  </button>
                </div>
              )}
            </div>

            {/* How You Know Them */}
            {connection.how_you_know && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">How You Know Them</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{connection.how_you_know}</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/25">
              <h3 className="font-bold mb-5 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Connection Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span className="text-blue-100 text-sm font-medium">Total Interactions</span>
                  <span className="font-bold text-2xl">{interactions.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span className="text-blue-100 text-sm font-medium">Linked Applications</span>
                  <span className="font-bold text-2xl">{linkedApplications.length}</span>
                </div>
                {connection.last_contacted && (
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <span className="text-blue-100 text-sm font-medium">Days Since Contact</span>
                    <span className="font-bold text-2xl">{daysSinceContact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Interaction Modal */}
      {showInteractionForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Log Interaction</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Record your interaction with {connection.full_name}
                  </p>
                </div>
                <button
                  onClick={() => setShowInteractionForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Interaction Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interaction Type
                </label>
                <select
                  value={interactionType}
                  onChange={(e) => setInteractionType(e.target.value as InteractionType)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                >
                  {Object.entries(InteractionTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={interactionTitle}
                  onChange={(e) => setInteractionTitle(e.target.value)}
                  placeholder="e.g., 30-min coffee chat, Follow-up email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={interactionDate}
                  onChange={(e) => setInteractionDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes/Description
                </label>
                <textarea
                  value={interactionDescription}
                  onChange={(e) => setInteractionDescription(e.target.value)}
                  placeholder="Key takeaways, topics discussed, action items..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none placeholder:text-gray-400"
                  rows={3}
                />
              </div>

              {/* Link to Application */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link to Application (optional)
                </label>
                <select
                  value={linkedCompanyId}
                  onChange={(e) => setLinkedCompanyId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
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
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Follow-up needed?</p>
                  <p className="text-xs text-gray-500 mt-0.5">Set a reminder to follow up</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFollowUpNeeded(!followUpNeeded)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${
                    followUpNeeded
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      followUpNeeded ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Follow-up Date */}
              {followUpNeeded && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowInteractionForm(false)}
                className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInteraction}
                disabled={!interactionTitle.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 disabled:shadow-none"
              >
                Log Interaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Application Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Link Application</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Connect {connection.full_name} to an application
                  </p>
                </div>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-80 overflow-y-auto">
              {unlinkedApplications.length > 0 ? (
                <div className="space-y-2">
                  {unlinkedApplications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleLinkApplication(app.id)}
                      className="w-full p-4 text-left bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 flex items-center justify-between group border border-gray-100 hover:border-blue-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{app.company_name}</p>
                        <p className="text-sm text-gray-500">{app.role}</p>
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
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <p className="text-gray-500 font-medium">All applications are already linked</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

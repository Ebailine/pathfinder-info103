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
  Star
} from "lucide-react";
import {
  formatDate,
  formatRelativeTime,
  getStatusColor,
  getStatusIcon,
  getStatusLabel
} from "@/lib/utils";
import toast from "react-hot-toast";
import { CompanyStatus, TimelineEvent, Note } from "@/lib/types";

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [newNote, setNewNote] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const company = useCRMStore((state) =>
    state.companies.find((c) => c.id === companyId)
  );
  const connections = useCRMStore((state) => state.connections);
  const outreach = useCRMStore((state) => state.outreach);
  const timelineEvents = useCRMStore((state) => state.timelineEvents[companyId] || []);
  const notes = useCRMStore((state) => state.notes[companyId] || []);

  const updateCompanyStatus = useCRMStore((state) => state.updateCompanyStatus);
  const deleteCompany = useCRMStore((state) => state.deleteCompany);
  const addNote = useCRMStore((state) => state.addNote);
  const deleteNote = useCRMStore((state) => state.deleteNote);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Company not found</h2>
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

  const companyConnections = connections.filter(
    (c) => c.current_company === company.company_name
  );
  const companyOutreach = outreach.filter((o) => o.target_company_id === company.id);

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
      toast.success("Company removed from pipeline");
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{company.company_name}</h1>
                <p className="text-lg text-gray-600 mt-1">{company.role}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {company.location || "Remote"}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Added {formatDate(company.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
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

          {/* Status Badge */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-blue-600" />
                Activity Timeline
              </h2>

              {timelineEvents.length > 0 ? (
                <div className="space-y-6">
                  {timelineEvents
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((event, index) => (
                      <TimelineItem key={event.id} event={event} isLast={index === timelineEvents.length - 1} />
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No activity yet. Start by reaching out to a connection!</p>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
                Messages
              </h2>

              {companyOutreach.length > 0 ? (
                <div className="space-y-4">
                  {companyOutreach.map((message) => (
                    <div
                      key={message.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">To: {message.recipient_name}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {message.sent_at
                              ? `Sent ${formatRelativeTime(message.sent_at)}`
                              : "Draft"}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            message.status === "intro_made"
                              ? "bg-green-100 text-green-800"
                              : message.status === "responded"
                              ? "bg-blue-100 text-blue-800"
                              : message.status === "sent"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {message.message_content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Notes
              </h2>

              {/* Add Note */}
              <div className="mb-6">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a private note..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                  No notes yet. Add your first note above!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Connections */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Connections
              </h3>

              {companyConnections.length > 0 ? (
                <div className="space-y-3">
                  {companyConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/connections/${connection.id}`)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {connection.full_name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{connection.headline}</p>
                          <div className="flex items-center mt-1 gap-2">
                            {connection.same_school && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                Same School
                              </span>
                            )}
                            {connection.same_major && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Same Major
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No connections at this company yet
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>

              {company.required_skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {company.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {company.job_description && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                  <p className="text-sm text-gray-600">{company.job_description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const getEventIcon = () => {
    switch (event.type) {
      case "message_sent":
        return <MessageSquare className="h-5 w-5" />;
      case "response_received":
        return <MessageSquare className="h-5 w-5" />;
      case "call_scheduled":
        return <Calendar className="h-5 w-5" />;
      case "intro_made":
        return <User className="h-5 w-5" />;
      case "note_added":
        return <FileText className="h-5 w-5" />;
      case "status_changed":
        return <Clock className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getEventColor = () => {
    switch (event.type) {
      case "intro_made":
        return "bg-green-100 text-green-600";
      case "response_received":
        return "bg-blue-100 text-blue-600";
      case "message_sent":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex items-start space-x-4">
      <div className={`p-2 rounded-full ${getEventColor()} flex-shrink-0`}>
        {getEventIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{event.title}</p>
        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
        <p className="text-xs text-gray-500 mt-2">{formatRelativeTime(event.date)}</p>
      </div>
      {!isLast && <div className="w-px h-12 bg-gray-200 absolute left-6 mt-12" />}
    </div>
  );
}

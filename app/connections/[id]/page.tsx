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
  Linkedin,
  Calendar,
  MessageSquare,
  Briefcase
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ConnectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const connectionId = params.id as string;

  const connection = useCRMStore((state) =>
    state.connections.find((c) => c.id === connectionId)
  );
  const user = useCRMStore((state) => state.user);
  const companies = useCRMStore((state) => state.companies);

  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<Array<{ id: string; content: string; date: string }>>([]);

  if (!connection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact not found</h2>
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

  // Find applications at this contact's company
  const relatedApplications = companies.filter(
    c => c.company_name === connection.current_company
  );

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{connection.full_name}</h1>
              <p className="text-lg text-gray-600 mt-1">
                {connection.current_role} {connection.current_company && `at ${connection.current_company}`}
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
                {connection.mutual_connections > 0 && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {connection.mutual_connections} Mutual Connections
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
                {connection.current_company && (
                  <div className="flex items-center">
                    <dt className="w-32 text-sm text-gray-600 flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Company
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {connection.current_company}
                    </dd>
                  </div>
                )}
                {connection.current_role && (
                  <div className="flex items-center">
                    <dt className="w-32 text-sm text-gray-600 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Role
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {connection.current_role}
                    </dd>
                  </div>
                )}
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

            {/* How You Know Them */}
            {connection.how_you_know && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">How You Know Them</h2>
                <p className="text-sm text-gray-700">{connection.how_you_know}</p>
              </div>
            )}

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
                    <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(note.date, "MMM d, h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No notes yet. Add one above to keep track of your interactions.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Applications at This Company */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Applications at {connection.current_company || "This Company"}
              </h3>

              {relatedApplications.length > 0 ? (
                <div className="space-y-3">
                  {relatedApplications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => router.push(`/company/${app.id}`)}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">{app.role}</p>
                      <p className="text-xs text-gray-600 capitalize mt-1">
                        {app.status.replace(/_/g, " ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No applications at this company yet
                </p>
              )}
            </div>

            {/* Connection Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <dl className="space-y-3 text-sm">
                {connection.same_school && (
                  <div>
                    <dt className="text-gray-600">School Connection</dt>
                    <dd className="font-medium text-gray-900">{user?.school || "Same school"}</dd>
                  </div>
                )}
                {connection.same_major && (
                  <div>
                    <dt className="text-gray-600">Major Connection</dt>
                    <dd className="font-medium text-gray-900">{user?.major || "Same major"}</dd>
                  </div>
                )}
                {connection.mutual_connections > 0 && (
                  <div>
                    <dt className="text-gray-600">Mutual Connections</dt>
                    <dd className="font-medium text-gray-900">{connection.mutual_connections}</dd>
                  </div>
                )}
                {connection.source && (
                  <div>
                    <dt className="text-gray-600">Source</dt>
                    <dd className="font-medium text-gray-900">{connection.source}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

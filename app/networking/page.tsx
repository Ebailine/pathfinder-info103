"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import {
  Users,
  Plus,
  Search,
  Filter,
  Building2,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  ChevronRight,
  UserPlus,
  AlertCircle,
  X,
  Linkedin
} from "lucide-react";
import { formatDate, getDaysSince } from "@/lib/utils";
import { Connection } from "@/lib/types";
import toast from "react-hot-toast";

export default function NetworkingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "need_followup" | "same_school" | "has_applications">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding new contact
  const [newContactName, setNewContactName] = useState("");
  const [newContactCompany, setNewContactCompany] = useState("");
  const [newContactRole, setNewContactRole] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactLinkedin, setNewContactLinkedin] = useState("");
  const [newContactHowKnow, setNewContactHowKnow] = useState("");
  const [newContactSameSchool, setNewContactSameSchool] = useState(false);

  // Store
  const connections = useCRMStore((state) => state.connections);
  const companies = useCRMStore((state) => state.companies);
  const interactions = useCRMStore((state) => state.interactions);
  const addConnection = useCRMStore((state) => state.addConnection);
  const initializeSampleData = useCRMStore((state) => state.initializeSampleData);

  useEffect(() => {
    setMounted(true);
    initializeSampleData();
  }, [initializeSampleData]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  // Get interaction count for a contact
  const getInteractionCount = (connectionId: string) => {
    return interactions.filter(i => i.connection_id === connectionId).length;
  };

  // Get linked applications for a contact
  const getLinkedApplications = (connection: Connection) => {
    return companies.filter(c => connection.linked_application_ids?.includes(c.id));
  };

  // Filter contacts
  let filteredConnections = connections.filter(c => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        c.full_name.toLowerCase().includes(query) ||
        c.current_company?.toLowerCase().includes(query) ||
        c.current_role?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (filterBy === "need_followup") {
    filteredConnections = filteredConnections.filter(c => {
      const daysSince = c.last_contacted ? getDaysSince(c.last_contacted) : 999;
      return daysSince > 14; // Need follow-up if > 14 days since contact
    });
  } else if (filterBy === "same_school") {
    filteredConnections = filteredConnections.filter(c => c.same_school);
  } else if (filterBy === "has_applications") {
    filteredConnections = filteredConnections.filter(c =>
      c.linked_application_ids && c.linked_application_ids.length > 0
    );
  }

  // Sort by last contacted (most recent first), then by name
  filteredConnections = [...filteredConnections].sort((a, b) => {
    if (a.last_contacted && b.last_contacted) {
      return new Date(b.last_contacted).getTime() - new Date(a.last_contacted).getTime();
    }
    if (a.last_contacted) return -1;
    if (b.last_contacted) return 1;
    return a.full_name.localeCompare(b.full_name);
  });

  // Stats
  const needFollowUp = connections.filter(c => {
    const daysSince = c.last_contacted ? getDaysSince(c.last_contacted) : 999;
    return daysSince > 14;
  }).length;

  const handleAddContact = () => {
    if (!newContactName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      user_id: "user-1",
      full_name: newContactName.trim(),
      headline: newContactRole ? `${newContactRole} at ${newContactCompany}` : "",
      current_company: newContactCompany.trim() || undefined,
      current_role: newContactRole.trim() || undefined,
      email: newContactEmail.trim() || undefined,
      phone: newContactPhone.trim() || undefined,
      linkedin_url: newContactLinkedin.trim() || undefined,
      how_you_know: newContactHowKnow.trim() || undefined,
      same_school: newContactSameSchool,
      same_major: false,
      mutual_connections: 0,
      intro_likelihood_score: 0,
      connection_date: new Date().toISOString(),
      linked_application_ids: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addConnection(newConnection);

    // Reset form
    setShowAddModal(false);
    setNewContactName("");
    setNewContactCompany("");
    setNewContactRole("");
    setNewContactEmail("");
    setNewContactPhone("");
    setNewContactLinkedin("");
    setNewContactHowKnow("");
    setNewContactSameSchool(false);

    toast.success("Contact added successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-7 w-7 mr-3 text-blue-600" />
              Networking
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your professional connections and track interactions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md"
          >
            <UserPlus className="h-5 w-5" />
            <span>Add Contact</span>
          </button>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-3xl font-bold text-gray-900">{connections.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Need Follow-up</p>
                <p className="text-3xl font-bold text-orange-600">{needFollowUp}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Interactions</p>
                <p className="text-3xl font-bold text-green-600">{interactions.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Same School</p>
                <p className="text-3xl font-bold text-purple-600">
                  {connections.filter(c => c.same_school).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts by name, company, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Contacts</option>
                <option value="need_followup">Need Follow-up</option>
                <option value="same_school">Same School</option>
                <option value="has_applications">Has Linked Applications</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {filteredConnections.length > 0 ? (
            filteredConnections.map((connection) => {
              const daysSince = connection.last_contacted
                ? getDaysSince(connection.last_contacted)
                : null;
              const interactionCount = getInteractionCount(connection.id);
              const linkedApps = getLinkedApplications(connection);

              return (
                <div
                  key={connection.id}
                  onClick={() => router.push(`/connections/${connection.id}`)}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow">
                        <span className="text-lg font-bold text-white">
                          {connection.full_name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {connection.full_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {connection.current_role}{" "}
                          {connection.current_company && (
                            <>
                              at <span className="font-medium">{connection.current_company}</span>
                            </>
                          )}
                        </p>

                        {/* Contact Info Row */}
                        <div className="flex flex-wrap gap-3 mt-2">
                          {connection.email && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {connection.email}
                            </span>
                          )}
                          {connection.phone && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {connection.phone}
                            </span>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {daysSince !== null && (
                            <span className={`px-2.5 py-1 text-xs rounded-full flex items-center ${
                              daysSince <= 7
                                ? "bg-green-100 text-green-700"
                                : daysSince <= 30
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}>
                              <Clock className="h-3 w-3 mr-1" />
                              {daysSince === 0 ? "Today" : `${daysSince}d ago`}
                            </span>
                          )}
                          {daysSince === null && (
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              No contact yet
                            </span>
                          )}
                          {interactionCount > 0 && (
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {interactionCount} interaction{interactionCount !== 1 ? "s" : ""}
                            </span>
                          )}
                          {connection.same_school && (
                            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              Same School
                            </span>
                          )}
                        </div>

                        {/* Linked Applications */}
                        {linkedApps.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs text-gray-500">Linked to:</span>
                            {linkedApps.map((app) => (
                              <span
                                key={app.id}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                              >
                                {app.company_name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || filterBy !== "all"
                  ? "No contacts match your search"
                  : "No contacts yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filterBy !== "all"
                  ? "Try adjusting your filters"
                  : "Start building your professional network"}
              </p>
              {!searchQuery && filterBy === "all" && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Add Your First Contact</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add New Contact</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={newContactCompany}
                  onChange={(e) => setNewContactCompany(e.target.value)}
                  placeholder="e.g., Google"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role/Title
                </label>
                <input
                  type="text"
                  value={newContactRole}
                  onChange={(e) => setNewContactRole(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  placeholder="e.g., john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="e.g., (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={newContactLinkedin}
                    onChange={(e) => setNewContactLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* How You Know Them */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How do you know them?
                </label>
                <textarea
                  value={newContactHowKnow}
                  onChange={(e) => setNewContactHowKnow(e.target.value)}
                  placeholder="e.g., Met at career fair, classmate, referred by..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>

              {/* Same School Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Same School?</p>
                  <p className="text-xs text-gray-500">Are they an alum or student at your school?</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewContactSameSchool(!newContactSameSchool)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    newContactSameSchool ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      newContactSameSchool ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                disabled={!newContactName.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

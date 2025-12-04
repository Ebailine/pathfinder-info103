"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import {
  Users,
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
  Linkedin,
  Sparkles,
  GraduationCap,
  Link2
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-500 font-medium">Loading contacts...</p>
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
      return daysSince > 14;
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

  // Avatar color gradients
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your professional network</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              <UserPlus className="h-4 w-4" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Contacts", value: connections.length, icon: Users, gradient: "from-blue-500 to-indigo-600" },
            { label: "Need Follow-up", value: needFollowUp, icon: AlertCircle, gradient: "from-amber-500 to-orange-600" },
            { label: "Interactions", value: interactions.length, icon: MessageSquare, gradient: "from-emerald-500 to-teal-600" },
            { label: "Same School", value: connections.filter(c => c.same_school).length, icon: GraduationCap, gradient: "from-violet-500 to-purple-600" }
          ].map((stat) => (
            <div
              key={stat.label}
              className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts by name, company, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-gray-100 rounded-xl">
                <Filter className="h-5 w-5 text-gray-500" />
              </div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium text-gray-700"
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
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`h-14 w-14 bg-gradient-to-br ${getAvatarGradient(connection.full_name)} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <span className="text-lg font-bold text-white">
                          {connection.full_name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {connection.full_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {connection.current_role}{" "}
                          {connection.current_company && (
                            <>
                              at <span className="font-semibold text-gray-700">{connection.current_company}</span>
                            </>
                          )}
                        </p>

                        {/* Contact Info Row */}
                        <div className="flex flex-wrap gap-4 mt-3">
                          {connection.email && (
                            <span className="text-sm text-gray-500 flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {connection.email}
                            </span>
                          )}
                          {connection.phone && (
                            <span className="text-sm text-gray-500 flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                              <Phone className="h-4 w-4 text-gray-400" />
                              {connection.phone}
                            </span>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {daysSince !== null && (
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 ${
                              daysSince <= 7
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : daysSince <= 30
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                              <Clock className="h-3 w-3" />
                              {daysSince === 0 ? "Today" : `${daysSince}d ago`}
                            </span>
                          )}
                          {daysSince === null && (
                            <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1 border border-gray-200">
                              <AlertCircle className="h-3 w-3" />
                              No contact yet
                            </span>
                          )}
                          {interactionCount > 0 && (
                            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1 border border-blue-200">
                              <MessageSquare className="h-3 w-3" />
                              {interactionCount} interaction{interactionCount !== 1 ? "s" : ""}
                            </span>
                          )}
                          {connection.same_school && (
                            <span className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full flex items-center gap-1 border border-violet-200">
                              <GraduationCap className="h-3 w-3" />
                              Same School
                            </span>
                          )}
                        </div>

                        {/* Linked Applications */}
                        {linkedApps.length > 0 && (
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Link2 className="h-3 w-3" />
                              Linked:
                            </span>
                            {linkedApps.map((app) => (
                              <span
                                key={app.id}
                                className="text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 font-medium"
                              >
                                {app.company_name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl group-hover:bg-blue-50 transition-colors">
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {searchQuery || filterBy !== "all"
                  ? "No contacts match your search"
                  : "No contacts yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || filterBy !== "all"
                  ? "Try adjusting your filters"
                  : "Start building your professional network"}
              </p>
              {!searchQuery && filterBy === "all" && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Add New Contact</h3>
                  <p className="text-sm text-gray-500 mt-1">Expand your professional network</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              {/* Company & Role Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={newContactCompany}
                    onChange={(e) => setNewContactCompany(e.target.value)}
                    placeholder="e.g., Google"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role/Title
                  </label>
                  <input
                    type="text"
                    value={newContactRole}
                    onChange={(e) => setNewContactRole(e.target.value)}
                    placeholder="e.g., Engineer"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={newContactLinkedin}
                    onChange={(e) => setNewContactLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* How You Know Them */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How do you know them?
                </label>
                <textarea
                  value={newContactHowKnow}
                  onChange={(e) => setNewContactHowKnow(e.target.value)}
                  placeholder="e.g., Met at career fair, classmate, referred by..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none placeholder:text-gray-400"
                  rows={2}
                />
              </div>

              {/* Same School Toggle */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Same School?</p>
                  <p className="text-xs text-gray-500 mt-0.5">Are they an alum or student at your school?</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewContactSameSchool(!newContactSameSchool)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${
                    newContactSameSchool
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      newContactSameSchool ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                disabled={!newContactName.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 disabled:shadow-none"
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

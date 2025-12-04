"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import {
  ArrowLeft,
  User,
  Building2,
  Search,
  Plus,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  BookOpen,
  Users
} from "lucide-react";

export default function ContactsPage() {
  const router = useRouter();
  const connections = useCRMStore((state) => state.connections);
  const user = useCRMStore((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "same_school" | "same_major">("all");

  // Filter connections based on search and filter
  const filteredConnections = connections.filter((connection) => {
    const matchesSearch =
      connection.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.current_company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.current_role?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "same_school" && connection.same_school) ||
      (filterBy === "same_major" && connection.same_major);

    return matchesSearch && matchesFilter;
  });

  // Group by company for organization
  const connectionsByCompany = filteredConnections.reduce((acc, connection) => {
    const company = connection.current_company || "Other";
    if (!acc[company]) {
      acc[company] = [];
    }
    acc[company].push(connection);
    return acc;
  }, {} as Record<string, typeof connections>);

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

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Contacts</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {connections.length} contacts in your network
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/contacts/new")}
              className="flex items-center px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, or role..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="sm:w-48">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="all">All Contacts</option>
                <option value="same_school">Same School</option>
                <option value="same_major">Same Major</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm text-gray-600">Total Contacts</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{connections.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <GraduationCap className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm text-gray-600">Same School</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {connections.filter((c) => c.same_school).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-gray-600">Same Major</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {connections.filter((c) => c.same_major).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm text-gray-600">Companies</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {Object.keys(connectionsByCompany).length}
            </p>
          </div>
        </div>

        {/* Contacts List */}
        {filteredConnections.length > 0 ? (
          <div className="space-y-4">
            {filteredConnections.map((connection) => (
              <div
                key={connection.id}
                onClick={() => router.push(`/connections/${connection.id}`)}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-7 w-7 text-purple-600" />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {connection.full_name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {connection.current_role}
                          {connection.current_company && ` at ${connection.current_company}`}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 ml-4">
                        {connection.same_school && (
                          <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Same School
                          </span>
                        )}
                        {connection.same_major && (
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Same Major
                          </span>
                        )}
                        {connection.mutual_connections > 0 && (
                          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                            {connection.mutual_connections} Mutual
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contact Methods */}
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {connection.email && (
                        <span className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1.5" />
                          {connection.email}
                        </span>
                      )}
                      {connection.phone && (
                        <span className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1.5" />
                          {connection.phone}
                        </span>
                      )}
                      {connection.linkedin_url && (
                        <span className="flex items-center text-sm text-blue-600">
                          <Linkedin className="h-4 w-4 mr-1.5" />
                          LinkedIn
                        </span>
                      )}
                    </div>

                    {/* How You Know Them */}
                    {connection.how_you_know && (
                      <p className="text-sm text-gray-500 mt-2 italic">
                        &quot;{connection.how_you_know}&quot;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterBy !== "all" ? "No contacts found" : "No contacts yet"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchQuery || filterBy !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start building your network by adding your first contact"}
            </p>
            {!searchQuery && filterBy === "all" && (
              <button
                onClick={() => router.push("/contacts/new")}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Contact
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

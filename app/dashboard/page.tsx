"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  CheckSquare,
  Square,
  Calendar,
  Clock,
  Users,
  Briefcase,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Target,
  Award,
  Send,
  MessageSquare,
  Building2
} from "lucide-react";
import { CompanyStatus, TargetCompany } from "@/lib/types";
import { getStatusLabel, getStatusColor, formatDate, getDaysSince, downloadCSV } from "@/lib/utils";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Store selectors
  const companies = useCRMStore((state) => state.companies);
  const connections = useCRMStore((state) => state.connections);
  const reminders = useCRMStore((state) => state.reminders);
  const interactions = useCRMStore((state) => state.interactions);
  const statusFilter = useCRMStore((state) => state.statusFilter);
  const searchQuery = useCRMStore((state) => state.searchQuery);
  const sortBy = useCRMStore((state) => state.sortBy);
  const selectedCompanies = useCRMStore((state) => state.selectedCompanies);

  // Store actions
  const setStatusFilter = useCRMStore((state) => state.setStatusFilter);
  const setSearchQuery = useCRMStore((state) => state.setSearchQuery);
  const setSortBy = useCRMStore((state) => state.setSortBy);
  const selectAllCompanies = useCRMStore((state) => state.selectAllCompanies);
  const clearSelection = useCRMStore((state) => state.clearSelection);
  const bulkDelete = useCRMStore((state) => state.bulkDelete);
  const initializeSampleData = useCRMStore((state) => state.initializeSampleData);
  const toggleSelectCompany = useCRMStore((state) => state.toggleSelectCompany);
  const updateCompanyStatus = useCRMStore((state) => state.updateCompanyStatus);

  useEffect(() => {
    setMounted(true);
    initializeSampleData();
  }, [initializeSampleData]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    total: companies.length,
    thinking: companies.filter(c => c.status === "thinking").length,
    applied: companies.filter(c => c.status === "applied").length,
    interviewing: companies.filter(c => c.status === "interviewing").length,
    offer: companies.filter(c => c.status === "offer").length,
    rejected: companies.filter(c => c.status === "rejected").length
  };

  // Get upcoming deadlines (within 7 days)
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingDeadlines = companies
    .filter(c => c.application_deadline && new Date(c.application_deadline) >= now && new Date(c.application_deadline) <= weekFromNow)
    .sort((a, b) => new Date(a.application_deadline!).getTime() - new Date(b.application_deadline!).getTime());

  // Get pending reminders
  const pendingReminders = reminders
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.reminder_date).getTime() - new Date(b.reminder_date).getTime())
    .slice(0, 5);

  // Get contacts needing follow-up (> 14 days since contact)
  const contactsNeedingFollowUp = connections
    .filter(c => {
      const daysSince = c.last_contacted ? getDaysSince(c.last_contacted) : 999;
      return daysSince > 14;
    })
    .slice(0, 4);

  // Filter and sort companies
  let filteredCompanies = companies;

  if (statusFilter !== "all") {
    filteredCompanies = filteredCompanies.filter((c) => c.status === statusFilter);
  }

  if (searchQuery) {
    filteredCompanies = filteredCompanies.filter(
      (c) =>
        c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  filteredCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      case "deadline":
        if (!a.application_deadline && !b.application_deadline) return 0;
        if (!a.application_deadline) return 1;
        if (!b.application_deadline) return -1;
        return new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime();
      case "priority":
        const priorityOrder: Record<CompanyStatus, number> = {
          interviewing: 1,
          offer: 2,
          applied: 3,
          thinking: 4,
          rejected: 5
        };
        return priorityOrder[a.status] - priorityOrder[b.status];
      default:
        return 0;
    }
  });

  // Group companies by status for pipeline view
  const groupedCompanies = {
    thinking: companies.filter(c => c.status === "thinking"),
    applied: companies.filter(c => c.status === "applied"),
    interviewing: companies.filter(c => c.status === "interviewing"),
    offer: companies.filter(c => c.status === "offer"),
    rejected: companies.filter(c => c.status === "rejected")
  };

  const handleExport = () => {
    const exportData = filteredCompanies.map((c) => ({
      Company: c.company_name,
      Role: c.role,
      Status: getStatusLabel(c.status),
      Location: c.location || "N/A",
      Deadline: c.application_deadline || "N/A",
      "Date Added": c.created_at,
      "Last Updated": c.updated_at
    }));
    downloadCSV(exportData, `pathfinder-pipeline-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success("Pipeline exported successfully!");
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedCompanies.length} applications?`)) {
      bulkDelete();
      toast.success("Applications deleted successfully");
    }
  };

  const StatusColumn = ({ status, title, color, bgColor, companies }: {
    status: CompanyStatus;
    title: string;
    color: string;
    bgColor: string;
    companies: TargetCompany[];
  }) => (
    <div className="flex-1 min-w-[200px]">
      <div className={`${bgColor} rounded-t-lg p-3 border-b-2 ${color.replace('text-', 'border-')}`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${color}`}>{title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${color}`}>
            {companies.length}
          </span>
        </div>
      </div>
      <div className="bg-gray-50 rounded-b-lg p-2 min-h-[200px] space-y-2">
        {companies.slice(0, 3).map(company => (
          <div
            key={company.id}
            onClick={() => router.push(`/company/${company.id}`)}
            className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
          >
            <p className="font-medium text-gray-900 text-sm truncate">{company.company_name}</p>
            <p className="text-xs text-gray-600 truncate">{company.role}</p>
            {company.application_deadline && (
              <p className="text-xs text-orange-600 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(company.application_deadline, "MMM d")}
              </p>
            )}
          </div>
        ))}
        {companies.length > 3 && (
          <button
            onClick={() => setStatusFilter(status)}
            className="w-full text-center text-xs text-blue-600 hover:text-blue-700 py-2"
          >
            +{companies.length - 3} more
          </button>
        )}
        {companies.length === 0 && (
          <div className="text-center py-6">
            <p className="text-xs text-gray-400">No applications</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.thinking}</p>
                <p className="text-xs text-gray-600">Thinking</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
                <p className="text-xs text-gray-600">Applied</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.interviewing}</p>
                <p className="text-xs text-gray-600">Interviewing</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.offer}</p>
                <p className="text-xs text-gray-600">Offers</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-xs text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline View */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Application Pipeline
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <StatusColumn
              status="thinking"
              title="Thinking"
              color="text-gray-600"
              bgColor="bg-gray-100"
              companies={groupedCompanies.thinking}
            />
            <StatusColumn
              status="applied"
              title="Applied"
              color="text-blue-600"
              bgColor="bg-blue-50"
              companies={groupedCompanies.applied}
            />
            <StatusColumn
              status="interviewing"
              title="Interviewing"
              color="text-yellow-600"
              bgColor="bg-yellow-50"
              companies={groupedCompanies.interviewing}
            />
            <StatusColumn
              status="offer"
              title="Offer"
              color="text-green-600"
              bgColor="bg-green-50"
              companies={groupedCompanies.offer}
            />
            <StatusColumn
              status="rejected"
              title="Rejected"
              color="text-red-600"
              bgColor="bg-red-50"
              companies={groupedCompanies.rejected}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                Upcoming Deadlines
              </h3>
            </div>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.slice(0, 4).map(company => {
                  const daysUntil = Math.ceil(
                    (new Date(company.application_deadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div
                      key={company.id}
                      onClick={() => router.push(`/company/${company.id}`)}
                      className="p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{company.company_name}</p>
                          <p className="text-xs text-gray-600">{company.role}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          daysUntil <= 2 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No upcoming deadlines</p>
              </div>
            )}
          </div>

          {/* Follow-up Tasks */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-purple-600" />
                Tasks Due
              </h3>
              <button
                onClick={() => router.push("/reminders")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            </div>
            {pendingReminders.length > 0 ? (
              <div className="space-y-3">
                {pendingReminders.map(reminder => {
                  const daysUntil = Math.ceil(
                    (new Date(reminder.reminder_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isOverdue = daysUntil < 0;
                  return (
                    <div
                      key={reminder.id}
                      className={`p-3 rounded-lg ${isOverdue ? "bg-red-50" : "bg-purple-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 text-sm truncate flex-1">
                          {reminder.message}
                        </p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ml-2 ${
                          isOverdue ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {isOverdue ? "Overdue" : formatDate(reminder.reminder_date, "MMM d")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No tasks due</p>
              </div>
            )}
          </div>

          {/* Contacts Needing Follow-up */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Need Follow-up
              </h3>
              <button
                onClick={() => router.push("/networking")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            </div>
            {contactsNeedingFollowUp.length > 0 ? (
              <div className="space-y-3">
                {contactsNeedingFollowUp.map(contact => {
                  const daysSince = contact.last_contacted
                    ? getDaysSince(contact.last_contacted)
                    : null;
                  return (
                    <div
                      key={contact.id}
                      onClick={() => router.push(`/connections/${contact.id}`)}
                      className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-700">
                              {contact.full_name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{contact.full_name}</p>
                            <p className="text-xs text-gray-600">{contact.current_company}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {daysSince !== null ? `${daysSince}d ago` : "No contact"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">All contacts up to date</p>
              </div>
            )}
          </div>
        </div>

        {/* All Applications */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies or roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CompanyStatus | "all")}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="thinking">Thinking About It</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="deadline">By Deadline</option>
              <option value="priority">By Priority</option>
            </select>

            {/* Export */}
            <button
              onClick={handleExport}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedCompanies.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedCompanies.length} selected
                </span>
                <button
                  onClick={clearSelection}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear
                </button>
              </div>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}

          {/* Applications List */}
          <div className="space-y-3">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => {
                const isSelected = selectedCompanies.includes(company.id);
                const linkedContacts = connections.filter(
                  c => c.linked_application_ids?.includes(company.id)
                );

                return (
                  <div
                    key={company.id}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectCompany(company.id)}
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div
                          className="cursor-pointer"
                          onClick={() => router.push(`/company/${company.id}`)}
                        >
                          <h4 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {company.company_name}
                          </h4>
                          <p className="text-sm text-gray-600">{company.role}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
                              {getStatusLabel(company.status)}
                            </span>
                            {company.location && (
                              <span className="text-xs text-gray-500 flex items-center">
                                <Building2 className="h-3 w-3 mr-1" />
                                {company.location}
                              </span>
                            )}
                            {company.application_deadline && (
                              <span className="text-xs text-orange-600 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Due {formatDate(company.application_deadline, "MMM d")}
                              </span>
                            )}
                            {linkedContacts.length > 0 && (
                              <span className="text-xs text-blue-600 flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {linkedContacts.length} contact{linkedContacts.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/company/${company.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by adding your first application"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <button
                    onClick={() => router.push("/companies/new")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Application</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

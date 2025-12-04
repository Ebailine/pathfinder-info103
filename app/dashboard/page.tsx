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
  Building2,
  Sparkles
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Sparkles className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
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

  const StatusColumn = ({ status, title, icon: Icon, gradient, companies }: {
    status: CompanyStatus;
    title: string;
    icon: any;
    gradient: string;
    companies: TargetCompany[];
  }) => (
    <div className="flex-1 min-w-[220px]">
      <div className={`rounded-xl overflow-hidden`}>
        <div className={`${gradient} p-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-white/90" />
              <h3 className="font-semibold text-white text-sm">{title}</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
              {companies.length}
            </span>
          </div>
        </div>
        <div className="bg-gray-50/80 p-3 min-h-[220px] space-y-2.5 border border-gray-100 border-t-0 rounded-b-xl">
          {companies.slice(0, 3).map(company => (
            <div
              key={company.id}
              onClick={() => router.push(`/company/${company.id}`)}
              className="bg-white rounded-xl p-3.5 border border-gray-100 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
            >
              <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{company.company_name}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{company.role}</p>
              {company.application_deadline && (
                <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1 w-fit">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">{formatDate(company.application_deadline, "MMM d")}</span>
                </div>
              )}
            </div>
          ))}
          {companies.length > 3 && (
            <button
              onClick={() => setStatusFilter(status)}
              className="w-full text-center text-xs text-blue-600 hover:text-blue-700 py-2.5 font-medium hover:bg-blue-50 rounded-lg transition-colors"
            >
              View {companies.length - 3} more
            </button>
          )}
          {companies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Icon className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-xs text-gray-400">No applications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Track your job search progress</p>
            </div>
            <button
              onClick={() => router.push("/companies/new")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Add Application
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, icon: Briefcase, color: "blue", gradient: "from-blue-500 to-blue-600" },
            { label: "Thinking", value: stats.thinking, icon: Target, color: "slate", gradient: "from-slate-400 to-slate-500" },
            { label: "Applied", value: stats.applied, icon: Send, color: "indigo", gradient: "from-indigo-500 to-indigo-600" },
            { label: "Interviewing", value: stats.interviewing, icon: Users, color: "violet", gradient: "from-violet-500 to-purple-600" },
            { label: "Offers", value: stats.offer, icon: Award, color: "emerald", gradient: "from-emerald-500 to-teal-600" },
            { label: "Rejected", value: stats.rejected, icon: AlertCircle, color: "rose", gradient: "from-rose-500 to-red-600" }
          ].map((stat) => (
            <div
              key={stat.label}
              className="group bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-${stat.color}-500/20 group-hover:shadow-${stat.color}-500/30 transition-shadow`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline View */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Application Pipeline</h2>
              <p className="text-sm text-gray-500">Visual overview of your applications</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
            <StatusColumn
              status="thinking"
              title="Thinking"
              icon={Target}
              gradient="bg-gradient-to-r from-slate-500 to-slate-600"
              companies={groupedCompanies.thinking}
            />
            <StatusColumn
              status="applied"
              title="Applied"
              icon={Send}
              gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
              companies={groupedCompanies.applied}
            />
            <StatusColumn
              status="interviewing"
              title="Interviewing"
              icon={Users}
              gradient="bg-gradient-to-r from-violet-500 to-purple-600"
              companies={groupedCompanies.interviewing}
            />
            <StatusColumn
              status="offer"
              title="Offer"
              icon={Award}
              gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
              companies={groupedCompanies.offer}
            />
            <StatusColumn
              status="rejected"
              title="Rejected"
              icon={AlertCircle}
              gradient="bg-gradient-to-r from-rose-500 to-red-600"
              companies={groupedCompanies.rejected}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Upcoming Deadlines</h3>
                <p className="text-xs text-gray-500">Next 7 days</p>
              </div>
            </div>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.slice(0, 4).map(company => {
                  const daysUntil = Math.ceil(
                    (new Date(company.application_deadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isUrgent = daysUntil <= 2;
                  return (
                    <div
                      key={company.id}
                      onClick={() => router.push(`/company/${company.id}`)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                        isUrgent
                          ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-100 hover:border-red-200"
                          : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100 hover:border-amber-200"
                      } hover:shadow-md hover:-translate-y-0.5`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm truncate">{company.company_name}</p>
                          <p className="text-xs text-gray-500 truncate">{company.role}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ml-3 whitespace-nowrap ${
                          isUrgent
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No upcoming deadlines</p>
                <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Follow-up Tasks */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                  <CheckSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Tasks Due</h3>
                  <p className="text-xs text-gray-500">Stay on track</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/reminders")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
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
                      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                        isOverdue
                          ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-100"
                          : "bg-gradient-to-r from-violet-50 to-purple-50 border-violet-100"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-gray-900 text-sm truncate flex-1">
                          {reminder.message}
                        </p>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${
                          isOverdue
                            ? "bg-red-100 text-red-700"
                            : "bg-violet-100 text-violet-700"
                        }`}>
                          {isOverdue ? "Overdue" : formatDate(reminder.reminder_date, "MMM d")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <CheckSquare className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No tasks due</p>
                <p className="text-xs text-gray-400 mt-1">Great job staying organized!</p>
              </div>
            )}
          </div>

          {/* Contacts Needing Follow-up */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/20">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Need Follow-up</h3>
                  <p className="text-xs text-gray-500">Reconnect with contacts</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/networking")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
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
                      className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-blue-100 hover:border-blue-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                            <span className="text-xs font-bold text-white">
                              {contact.full_name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{contact.full_name}</p>
                            <p className="text-xs text-gray-500 truncate">{contact.current_company}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2">
                          {daysSince !== null ? `${daysSince}d ago` : "No contact"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">All contacts up to date</p>
                <p className="text-xs text-gray-400 mt-1">Great networking!</p>
              </div>
            )}
          </div>
        </div>

        {/* All Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies or roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-gray-100 rounded-xl">
                <Filter className="h-5 w-5 text-gray-500" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CompanyStatus | "all")}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium text-gray-700"
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
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium text-gray-700"
            >
              <option value="recent">Most Recent</option>
              <option value="deadline">By Deadline</option>
              <option value="priority">By Priority</option>
            </select>

            {/* Export */}
            <button
              onClick={handleExport}
              className="px-5 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedCompanies.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-blue-900">
                  {selectedCompanies.length} selected
                </span>
                <button
                  onClick={clearSelection}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Clear selection
                </button>
              </div>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg shadow-red-500/25"
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
                    className={`p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg group ${
                      isSelected
                        ? "border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50"
                        : "border-gray-100 hover:border-blue-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectCompany(company.id)}
                          className="mt-1.5 h-5 w-5 text-blue-600 rounded-md border-gray-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <div
                          className="cursor-pointer min-w-0"
                          onClick={() => router.push(`/company/${company.id}`)}
                        >
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base">
                            {company.company_name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-0.5">{company.role}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(company.status)}`}>
                              {getStatusLabel(company.status)}
                            </span>
                            {company.location && (
                              <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                                <Building2 className="h-3 w-3" />
                                {company.location}
                              </span>
                            )}
                            {company.application_deadline && (
                              <span className="text-xs text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
                                <Clock className="h-3 w-3" />
                                Due {formatDate(company.application_deadline, "MMM d")}
                              </span>
                            )}
                            {linkedContacts.length > 0 && (
                              <span className="text-xs text-blue-700 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full font-medium">
                                <Users className="h-3 w-3" />
                                {linkedContacts.length} contact{linkedContacts.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/company/${company.id}`)}
                        className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 group-hover:bg-blue-50"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No applications found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by adding your first application"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <button
                    onClick={() => router.push("/companies/new")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
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

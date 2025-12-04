"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import { StatsHero } from "@/components/StatsHero";
import { CompanyPipelineCard } from "@/components/CompanyPipelineCard";
import { QuickActions } from "@/components/QuickActions";
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  CheckSquare,
  Square
} from "lucide-react";
import { CompanyStatus } from "@/lib/types";
import { getStatusLabel, downloadCSV } from "@/lib/utils";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Store selectors
  const companies = useCRMStore((state) => state.companies);
  const connections = useCRMStore((state) => state.connections);
  const outreach = useCRMStore((state) => state.outreach);
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

  useEffect(() => {
    setMounted(true);
    // Initialize with sample data on first load
    initializeSampleData();
  }, [initializeSampleData]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your pipeline...</p>
        </div>
      </div>
    );
  }

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
      case "active":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "priority":
        // Updated for INFO 103 project statuses
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

  const handleExport = () => {
    const exportData = filteredCompanies.map((c) => ({
      Company: c.company_name,
      Role: c.role,
      Status: getStatusLabel(c.status),
      Location: c.location || "N/A",
      "Date Added": c.created_at,
      "Last Updated": c.updated_at
    }));
    downloadCSV(exportData, `pathfinder-pipeline-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success("Pipeline exported successfully!");
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedCompanies.length} companies?`)) {
      bulkDelete();
      toast.success("Companies deleted successfully");
    }
  };

  const isAllSelected = companies.length > 0 && selectedCompanies.length === companies.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PathFinder</h1>
              <p className="text-sm text-gray-600 mt-1">
                Track your job and internship applications
              </p>
            </div>
            <button
              onClick={() => router.push("/companies/new")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Application</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Hero */}
        <div className="mb-8">
          <StatsHero />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pipeline Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies or roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as CompanyStatus | "all")}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="active">Most Active</option>
                  <option value="priority">Highest Priority</option>
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedCompanies.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
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
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleExport}
                      className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Select All */}
              <div className="mt-3 flex items-center">
                <button
                  onClick={() => (isAllSelected ? clearSelection() : selectAllCompanies())}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  {isAllSelected ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  <span>Select All</span>
                </button>
              </div>
            </div>

            {/* Company Cards */}
            <div className="space-y-4">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <CompanyPipelineCard
                    key={company.id}
                    company={company}
                    connections={connections.filter(
                      (c) => c.current_company === company.company_name
                    )}
                    outreach={outreach.filter((o) => o.target_company_id === company.id)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No applications found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters or search query"
                      : "Get started by adding your first application"}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <button
                      onClick={() => router.push("/companies/new")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Your First Application</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}

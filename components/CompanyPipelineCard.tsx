"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TargetCompany, CompanyStatus } from "@/lib/types";
import { useCRMStore } from "@/lib/store";
import {
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
  getDaysSince,
  formatDate
} from "@/lib/utils";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";

interface CompanyPipelineCardProps {
  company: TargetCompany;
  connections?: any[];
  outreach?: any[];
}

export function CompanyPipelineCard({ company, connections = [], outreach = [] }: CompanyPipelineCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const updateCompanyStatus = useCRMStore((state) => state.updateCompanyStatus);
  const deleteCompany = useCRMStore((state) => state.deleteCompany);
  const toggleSelectCompany = useCRMStore((state) => state.toggleSelectCompany);
  const selectedCompanies = useCRMStore((state) => state.selectedCompanies);

  const isSelected = selectedCompanies.includes(company.id);
  const daysSinceUpdate = getDaysSince(company.updated_at);

  const primaryConnection = connections[0];
  const latestOutreach = outreach.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  // Updated for INFO 103 project statuses
  const getNextAction = () => {
    switch (company.status) {
      case "thinking":
        return "Research company and prepare application";
      case "applied":
        return "Follow up or wait for response";
      case "interviewing":
        return "Prepare for interview";
      case "offer":
        return "Review and respond to offer";
      case "rejected":
        return "No action needed";
      default:
        return "Update status";
    }
  };

  const handleStatusChange = (newStatus: CompanyStatus) => {
    updateCompanyStatus(company.id, newStatus);
    setShowStatusMenu(false);
    toast.success(`Status updated to ${getStatusLabel(newStatus)}`);

    // Show congratulations for positive outcomes
    if (newStatus === "offer") {
      toast.success("Congratulations on your offer!", { duration: 3000 });
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${company.company_name}?`)) {
      deleteCompany(company.id);
      toast.success("Company removed from pipeline");
    }
  };

  const handleViewDetails = () => {
    router.push(`/company/${company.id}`);
  };

  // Updated status options for INFO 103 project
  const statusOptions: CompanyStatus[] = [
    "thinking",
    "applied",
    "interviewing",
    "offer",
    "rejected"
  ];

  return (
    <div
      className={`bg-white rounded-lg border-2 transition-all hover:shadow-lg ${
        isSelected ? "border-blue-500 shadow-md" : "border-gray-200"
      }`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelectCompany(company.id)}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {company.company_name}
              </h3>
              <p className="text-sm text-gray-600 truncate">{company.role}</p>
              <p className="text-xs text-gray-500 mt-1">
                {company.location} • Added {formatDate(company.created_at, "MMM d")}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={handleViewDetails}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => router.push(`/company/${company.id}/edit`)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
              company.status
            )}`}
          >
            <span className="mr-1.5">{getStatusIcon(company.status)}</span>
            {getStatusLabel(company.status)}
          </span>
        </div>

        {/* Contact at Company */}
        {primaryConnection && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-700">
              You know {primaryConnection.full_name} at this company
            </p>
          </div>
        )}

        {/* Next Action */}
        <div className="mb-4 flex items-start space-x-2 text-sm">
          <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-600 font-medium">Next Action:</p>
            <p className="text-gray-900">{getNextAction()}</p>
          </div>
        </div>

        {/* Days since activity */}
        <div className="mb-4 text-xs text-gray-500">
          Last updated {daysSinceUpdate === 0 ? "today" : `${daysSinceUpdate} days ago`}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>

          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Update Status
            </button>

            {showStatusMenu && (
              <div className="absolute left-0 bottom-full mb-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 max-h-64 overflow-y-auto">
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
                    {company.status === status && (
                      <CheckCircle2 className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

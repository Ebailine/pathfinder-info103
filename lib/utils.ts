import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isAfter, isBefore, addDays } from "date-fns";
import { CompanyStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr: string = "MMM d, yyyy"): string {
  return format(new Date(date), formatStr);
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getDaysSince(date: string | Date): number {
  const now = new Date();
  const then = new Date(date);
  const diffTime = Math.abs(now.getTime() - then.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isOverdue(date: string | Date): boolean {
  return isBefore(new Date(date), new Date());
}

export function isDueToday(date: string | Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = addDays(today, 1);
  const reminderDate = new Date(date);
  return isAfter(reminderDate, today) && isBefore(reminderDate, tomorrow);
}

// Updated status colors for INFO 103 project statuses
export function getStatusColor(status: CompanyStatus): string {
  const colors: Record<CompanyStatus, string> = {
    thinking: "bg-gray-100 text-gray-800 border-gray-200",
    applied: "bg-blue-100 text-blue-800 border-blue-200",
    interviewing: "bg-purple-100 text-purple-800 border-purple-200",
    offer: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

// Updated status icons for INFO 103 project statuses
export function getStatusIcon(status: CompanyStatus): string {
  const icons: Record<CompanyStatus, string> = {
    thinking: "🤔",
    applied: "📨",
    interviewing: "💼",
    offer: "🎉",
    rejected: "❌"
  };
  return icons[status] || "📋";
}

// Updated status labels for INFO 103 project statuses
export function getStatusLabel(status: CompanyStatus): string {
  const labels: Record<CompanyStatus, string> = {
    thinking: "Thinking About It",
    applied: "Applied",
    interviewing: "Interviewing",
    offer: "Offer",
    rejected: "Rejected"
  };
  return labels[status] || status;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function downloadCSV(data: any[], filename: string): void {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(","));

  // Add data
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

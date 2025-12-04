"use client";

import { useCRMStore } from "@/lib/store";
import { Briefcase, Send, Users, Award, Clock, CheckSquare } from "lucide-react";

export function StatsHero() {
  const stats = useCRMStore((state) => state.stats);

  // Simplified stat cards for INFO 103 project
  const statCards = [
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Applied",
      value: stats.applied,
      icon: Send,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      label: "Interviewing",
      value: stats.interviewing,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      label: "Offers",
      value: stats.offers,
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Upcoming Deadlines",
      value: stats.upcomingDeadlines,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      label: "Tasks Due",
      value: stats.tasksDue,
      icon: CheckSquare,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

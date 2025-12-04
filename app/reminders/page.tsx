"use client";

import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import { formatDate, isOverdue, isDueToday } from "@/lib/utils";
import {
  ArrowLeft,
  Bell,
  BellRing,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Plus
} from "lucide-react";
import toast from "react-hot-toast";
import { Reminder } from "@/lib/types";

export default function RemindersPage() {
  const router = useRouter();
  const reminders = useCRMStore((state) => state.reminders);
  const completeReminder = useCRMStore((state) => state.completeReminder);
  const deleteReminder = useCRMStore((state) => state.deleteReminder);

  const activeReminders = reminders
    .filter((r) => !r.completed)
    .sort((a, b) => new Date(a.reminder_date).getTime() - new Date(b.reminder_date).getTime());

  const completedReminders = reminders
    .filter((r) => r.completed)
    .sort((a, b) => new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime());

  const overdueReminders = activeReminders.filter((r) => isOverdue(r.reminder_date));
  const todayReminders = activeReminders.filter((r) => isDueToday(r.reminder_date));
  const upcomingReminders = activeReminders.filter(
    (r) => !isOverdue(r.reminder_date) && !isDueToday(r.reminder_date)
  );

  const handleComplete = (id: string) => {
    completeReminder(id);
    toast.success("Reminder completed");
  };

  const handleDelete = (id: string, message: string) => {
    if (confirm(`Delete reminder: "${message}"?`)) {
      deleteReminder(id);
      toast.success("Reminder deleted");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {activeReminders.length} active reminder{activeReminders.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <button
              onClick={() => toast("Create reminder feature coming soon!", { icon: "🚀" })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border-2 border-red-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 uppercase">Overdue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{overdueReminders.length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-orange-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 uppercase">Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{todayReminders.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <BellRing className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingReminders.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Reminders */}
        <div className="space-y-6">
          {/* Overdue */}
          {overdueReminders.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-6 w-6 mr-2 text-red-600" />
                Overdue ({overdueReminders.length})
              </h2>
              <div className="space-y-3">
                {overdueReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    variant="overdue"
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Today */}
          {todayReminders.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BellRing className="h-6 w-6 mr-2 text-orange-600" />
                Today ({todayReminders.length})
              </h2>
              <div className="space-y-3">
                {todayReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    variant="today"
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcomingReminders.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                Upcoming ({upcomingReminders.length})
              </h2>
              <div className="space-y-3">
                {upcomingReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    variant="upcoming"
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No active reminders */}
          {activeReminders.length === 0 && (
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No active reminders
              </h3>
              <p className="text-gray-600">
                All caught up! Your reminders will appear here.
              </p>
            </div>
          )}

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle2 className="h-6 w-6 mr-2 text-green-600" />
                Completed ({completedReminders.length})
              </h2>
              <div className="space-y-3">
                {completedReminders.slice(0, 5).map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    variant="completed"
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              {completedReminders.length > 5 && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  Showing 5 of {completedReminders.length} completed reminders
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReminderCardProps {
  reminder: Reminder;
  variant: "overdue" | "today" | "upcoming" | "completed";
  onComplete: (id: string) => void;
  onDelete: (id: string, message: string) => void;
}

function ReminderCard({ reminder, variant, onComplete, onDelete }: ReminderCardProps) {
  const borderColor = {
    overdue: "border-l-red-500 bg-red-50",
    today: "border-l-orange-500 bg-orange-50",
    upcoming: "border-l-blue-500 bg-blue-50",
    completed: "border-l-green-500 bg-green-50 opacity-75"
  }[variant];

  const typeLabels: Record<string, string> = {
    follow_up: "Follow Up",
    call_prep: "Call Prep",
    check_response: "Check Response",
    send_thank_you: "Send Thank You"
  };

  const typeIcons: Record<string, JSX.Element> = {
    follow_up: <Bell className="h-4 w-4" />,
    call_prep: <Calendar className="h-4 w-4" />,
    check_response: <Clock className="h-4 w-4" />,
    send_thank_you: <CheckCircle2 className="h-4 w-4" />
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${borderColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center px-2 py-1 bg-white rounded text-xs font-medium text-gray-700 border border-gray-200">
              {typeIcons[reminder.reminder_type]}
              <span className="ml-1">{typeLabels[reminder.reminder_type] || reminder.reminder_type}</span>
            </span>
            {variant === "overdue" && (
              <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                Overdue
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">{reminder.message}</p>
          <p className="text-xs text-gray-600">
            {variant === "completed" && reminder.completed_at
              ? `Completed ${formatDate(reminder.completed_at, "MMM d, h:mm a")}`
              : formatDate(reminder.reminder_date, "MMM d, h:mm a")}
          </p>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {!reminder.completed && (
            <button
              onClick={() => onComplete(reminder.id)}
              className="p-2 text-gray-600 hover:bg-white rounded transition-colors"
              title="Mark as complete"
            >
              <CheckCircle2 className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => onDelete(reminder.id, reminder.message)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

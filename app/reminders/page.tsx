"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import { formatDate, isOverdue, isDueToday } from "@/lib/utils";
import {
  Bell,
  BellRing,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Plus,
  X,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import { Reminder, ReminderType } from "@/lib/types";

export default function RemindersPage() {
  const router = useRouter();
  const reminders = useCRMStore((state) => state.reminders);
  const addReminder = useCRMStore((state) => state.addReminder);
  const completeReminder = useCRMStore((state) => state.completeReminder);
  const deleteReminder = useCRMStore((state) => state.deleteReminder);
  const companies = useCRMStore((state) => state.companies);

  const [showModal, setShowModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    message: "",
    reminder_type: "follow_up" as ReminderType,
    reminder_date: "",
    reminder_time: "09:00",
    target_company_id: ""
  });

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
    toast.success("Task completed!");
  };

  const handleDelete = (id: string, message: string) => {
    if (confirm(`Delete task: "${message}"?`)) {
      deleteReminder(id);
      toast.success("Task deleted");
    }
  };

  const handleCreateReminder = () => {
    if (!newReminder.message.trim()) {
      toast.error("Please enter a task message");
      return;
    }
    if (!newReminder.reminder_date) {
      toast.error("Please select a date");
      return;
    }

    const reminderDateTime = new Date(`${newReminder.reminder_date}T${newReminder.reminder_time}`);

    const reminder: Reminder = {
      id: `rem-${Date.now()}`,
      user_id: "user-1",
      target_company_id: newReminder.target_company_id || undefined,
      reminder_type: newReminder.reminder_type,
      reminder_date: reminderDateTime.toISOString(),
      message: newReminder.message.trim(),
      completed: false,
      created_at: new Date().toISOString()
    };

    addReminder(reminder);
    toast.success("Task created!");
    setShowModal(false);
    setNewReminder({
      message: "",
      reminder_type: "follow_up",
      reminder_date: "",
      reminder_time: "09:00",
      target_company_id: ""
    });
  };

  const reminderTypes: { value: ReminderType; label: string }[] = [
    { value: "follow_up", label: "Follow Up" },
    { value: "call_prep", label: "Call Prep" },
    { value: "check_response", label: "Check Response" },
    { value: "send_thank_you", label: "Send Thank You" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-500 text-sm mt-1">
                {activeReminders.length} active task{activeReminders.length !== 1 ? "s" : ""} to complete
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 uppercase tracking-wide">Overdue</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{overdueReminders.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/20 group-hover:shadow-red-500/30 transition-shadow">
                <AlertCircle className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 uppercase tracking-wide">Today</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{todayReminders.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/30 transition-shadow">
                <BellRing className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Upcoming</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{upcomingReminders.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
                <Calendar className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Reminders */}
        <div className="space-y-6">
          {/* Overdue */}
          {overdueReminders.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/20">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Overdue</h2>
                  <p className="text-sm text-red-600">{overdueReminders.length} task{overdueReminders.length !== 1 ? "s" : ""} need attention</p>
                </div>
              </div>
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
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                  <BellRing className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Today</h2>
                  <p className="text-sm text-amber-600">{todayReminders.length} task{todayReminders.length !== 1 ? "s" : ""} due today</p>
                </div>
              </div>
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
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Upcoming</h2>
                  <p className="text-sm text-blue-600">{upcomingReminders.length} task{upcomingReminders.length !== 1 ? "s" : ""} scheduled</p>
                </div>
              </div>
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
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-500 mb-6">
                You don't have any active tasks. Great job staying organized!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <Plus className="h-5 w-5" />
                Create Your First Task
              </button>
            </div>
          )}

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Completed</h2>
                  <p className="text-sm text-emerald-600">{completedReminders.length} task{completedReminders.length !== 1 ? "s" : ""} done</p>
                </div>
              </div>
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
                <p className="text-sm text-gray-500 text-center mt-5 pt-4 border-t border-gray-100">
                  Showing 5 of {completedReminders.length} completed tasks
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add Task</h2>
                  <p className="text-sm text-gray-500 mt-1">Schedule a new task or reminder</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Reminder Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newReminder.reminder_type}
                  onChange={(e) => setNewReminder({ ...newReminder, reminder_type: e.target.value as ReminderType })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                >
                  {reminderTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Description *
                </label>
                <textarea
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none placeholder:text-gray-400"
                  placeholder="What do you need to remember?"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newReminder.reminder_date}
                    onChange={(e) => setNewReminder({ ...newReminder, reminder_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newReminder.reminder_time}
                    onChange={(e) => setNewReminder({ ...newReminder, reminder_time: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Related Application (Optional) */}
              {companies.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Related Application (Optional)
                  </label>
                  <select
                    value={newReminder.target_company_id}
                    onChange={(e) => setNewReminder({ ...newReminder, target_company_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  >
                    <option value="">None</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.company_name} - {company.role}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReminder}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
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
  const variantStyles = {
    overdue: "bg-gradient-to-r from-red-50 to-rose-50 border-red-100 hover:border-red-200",
    today: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100 hover:border-amber-200",
    upcoming: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-200",
    completed: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100 opacity-75"
  }[variant];

  const typeLabels: Record<string, string> = {
    follow_up: "Follow Up",
    call_prep: "Call Prep",
    check_response: "Check Response",
    send_thank_you: "Send Thank You"
  };

  const typeColors: Record<string, string> = {
    follow_up: "bg-blue-100 text-blue-700 border-blue-200",
    call_prep: "bg-violet-100 text-violet-700 border-violet-200",
    check_response: "bg-amber-100 text-amber-700 border-amber-200",
    send_thank_you: "bg-emerald-100 text-emerald-700 border-emerald-200"
  };

  const typeIcons: Record<string, JSX.Element> = {
    follow_up: <Bell className="h-3.5 w-3.5" />,
    call_prep: <Calendar className="h-3.5 w-3.5" />,
    check_response: <Clock className="h-3.5 w-3.5" />,
    send_thank_you: <CheckCircle2 className="h-3.5 w-3.5" />
  };

  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 ${variantStyles}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeColors[reminder.reminder_type] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
              {typeIcons[reminder.reminder_type]}
              {typeLabels[reminder.reminder_type] || reminder.reminder_type}
            </span>
            {variant === "overdue" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
                <AlertCircle className="h-3 w-3" />
                Overdue
              </span>
            )}
          </div>
          <p className={`text-sm font-semibold text-gray-900 mb-1 ${variant === "completed" ? "line-through text-gray-500" : ""}`}>
            {reminder.message}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {variant === "completed" && reminder.completed_at
              ? `Completed ${formatDate(reminder.completed_at, "MMM d, h:mm a")}`
              : formatDate(reminder.reminder_date, "MMM d, h:mm a")}
          </p>
        </div>

        <div className="flex items-center gap-1 ml-4">
          {!reminder.completed && (
            <button
              onClick={() => onComplete(reminder.id)}
              className="p-2.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
              title="Mark as complete"
            >
              <CheckCircle2 className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => onDelete(reminder.id, reminder.message)}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

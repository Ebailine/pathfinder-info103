"use client";

import { useState } from "react";
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
  Plus,
  X
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
    toast.success("Reminder completed");
  };

  const handleDelete = (id: string, message: string) => {
    if (confirm(`Delete reminder: "${message}"?`)) {
      deleteReminder(id);
      toast.success("Reminder deleted");
    }
  };

  const handleCreateReminder = () => {
    if (!newReminder.message.trim()) {
      toast.error("Please enter a reminder message");
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
    toast.success("Reminder created");
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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks & Reminders</h1>
              <p className="text-sm text-gray-600 mt-1">
                {activeReminders.length} active task{activeReminders.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Add Task</span>
          </button>
        </div>
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
              <p className="text-gray-600 mb-4">
                All caught up! Your reminders will appear here.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Reminder
              </button>
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

      {/* Add Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add Reminder</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Reminder Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newReminder.reminder_type}
                  onChange={(e) => setNewReminder({ ...newReminder, reminder_type: e.target.value as ReminderType })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="What do you need to remember?"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newReminder.reminder_date}
                    onChange={(e) => setNewReminder({ ...newReminder, reminder_date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newReminder.reminder_time}
                    onChange={(e) => setNewReminder({ ...newReminder, reminder_time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Related Application (Optional) */}
              {companies.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Application (Optional)
                  </label>
                  <select
                    value={newReminder.target_company_id}
                    onChange={(e) => setNewReminder({ ...newReminder, target_company_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReminder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Reminder
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

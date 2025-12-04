"use client";

import { useCRMStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { formatDate, isOverdue, isDueToday } from "@/lib/utils";
import {
  Bell,
  BellRing,
  CheckCircle2,
  Calendar,
  AlertCircle
} from "lucide-react";

export function QuickActions() {
  const router = useRouter();
  const reminders = useCRMStore((state) => state.reminders);
  const completeReminder = useCRMStore((state) => state.completeReminder);

  const activeReminders = reminders
    .filter((r) => !r.completed)
    .sort((a, b) => new Date(a.reminder_date).getTime() - new Date(b.reminder_date).getTime());

  const overdueReminders = activeReminders.filter((r) => isOverdue(r.reminder_date));
  const todayReminders = activeReminders.filter((r) => isDueToday(r.reminder_date));
  const upcomingReminders = activeReminders.filter(
    (r) => !isOverdue(r.reminder_date) && !isDueToday(r.reminder_date)
  );

  const handleCompleteReminder = (id: string) => {
    completeReminder(id);
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Reminders */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-600" />
            Reminders
          </h3>
          <button
            onClick={() => router.push("/reminders")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {/* Overdue */}
          {overdueReminders.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-red-600 uppercase flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Overdue ({overdueReminders.length})
              </p>
              {overdueReminders.slice(0, 2).map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onComplete={handleCompleteReminder}
                  variant="overdue"
                />
              ))}
            </div>
          )}

          {/* Today */}
          {todayReminders.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-orange-600 uppercase flex items-center">
                <BellRing className="h-3 w-3 mr-1" />
                Today ({todayReminders.length})
              </p>
              {todayReminders.slice(0, 2).map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onComplete={handleCompleteReminder}
                  variant="today"
                />
              ))}
            </div>
          )}

          {/* Upcoming */}
          {upcomingReminders.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Upcoming ({upcomingReminders.length})
              </p>
              {upcomingReminders.slice(0, 2).map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onComplete={handleCompleteReminder}
                  variant="upcoming"
                />
              ))}
            </div>
          )}

          {activeReminders.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No upcoming reminders
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReminderItemProps {
  reminder: any;
  onComplete: (id: string) => void;
  variant: "overdue" | "today" | "upcoming";
}

function ReminderItem({ reminder, onComplete, variant }: ReminderItemProps) {
  const borderColor =
    variant === "overdue"
      ? "border-l-red-500"
      : variant === "today"
      ? "border-l-orange-500"
      : "border-l-blue-500";

  return (
    <div className={`p-3 bg-gray-50 rounded-lg border-l-4 ${borderColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{reminder.message}</p>
          <p className="text-xs text-gray-600 mt-1">
            {formatDate(reminder.reminder_date, "MMM d, h:mm a")}
          </p>
        </div>
        <button
          onClick={() => onComplete(reminder.id)}
          className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
          title="Mark as complete"
        >
          <CheckCircle2 className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

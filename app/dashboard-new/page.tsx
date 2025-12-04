"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationBar } from "@/components/NavigationBar";
import { getCareerStageInfo, CAREER_STAGES } from "@/lib/career-stages";
import { User } from "@/lib/types";
import {
  TrendingUp,
  Users,
  Briefcase,
  MessageSquare,
  Target,
  Book,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star,
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load user profile from localStorage (in real app, from database)
    const storedProfile = localStorage.getItem("user_profile");
    if (storedProfile) {
      setUser(JSON.parse(storedProfile));
    } else {
      // Redirect to onboarding if no profile
      router.push("/onboarding");
    }
  }, [router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const careerStageInfo = user.career_stage ? getCareerStageInfo(user.career_stage) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back{user.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}! 👋
          </h1>
          <p className="text-gray-600">
            {careerStageInfo?.label} at {user.school || "your school"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">This Month</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
            <div className="text-sm text-gray-600">Networking Connections</div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3 from last month
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
            <div className="text-sm text-gray-600">Applications</div>
            <div className="mt-2 flex items-center text-sm text-blue-600">
              <Clock className="h-4 w-4 mr-1" />
              3 awaiting response
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">67%</div>
            <div className="text-sm text-gray-600">Response Rate</div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Star className="h-4 w-4 mr-1" />
              Above average!
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Progress</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">2</div>
            <div className="text-sm text-gray-600">Warm Intros Made</div>
            <div className="mt-2 flex items-center text-sm text-orange-600">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              You're doing great!
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Action Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push("/networking/find-connection")}
                  className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all group text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="font-medium text-gray-900">Find Warm Connection</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Search for people who can introduce you
                  </div>
                </button>

                <button
                  onClick={() => router.push("/networking/draft-message")}
                  className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-600 hover:bg-purple-50 transition-all group text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Sparkles className="h-6 w-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <div className="font-medium text-gray-900">Generate Outreach Message</div>
                  <div className="text-sm text-gray-600 mt-1">
                    AI-powered message for your network
                  </div>
                </button>

                <button
                  onClick={() => router.push("/opportunities/search")}
                  className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-600 hover:bg-green-50 transition-all group text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Briefcase className="h-6 w-6 text-gray-400 group-hover:text-green-600 transition-colors" />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                  <div className="font-medium text-gray-900">Search Opportunities</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Find roles matching your profile
                  </div>
                </button>

                <button
                  onClick={() => router.push("/coach")}
                  className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-600 hover:bg-orange-50 transition-all group text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <MessageSquare className="h-6 w-6 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                  <div className="font-medium text-gray-900">Ask AI Career Coach</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Get personalized career advice
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Message sent to Sarah Chen at Google
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New connection added: Michael Johnson
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Applied to Software Engineer Intern at Meta
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Personalized Tips */}
            {careerStageInfo && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Book className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Tips for {careerStageInfo.label}s</h3>
                </div>
                <div className="space-y-3">
                  {careerStageInfo.networkingTips.slice(0, 3).map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white font-medium">{idx + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push("/resources")}
                  className="mt-4 w-full px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  View All Resources
                </button>
              </div>
            )}

            {/* Progress Tracker */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Your Journey</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Networking Progress</span>
                    <span className="text-sm font-medium text-gray-900">60%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Application Activity</span>
                    <span className="text-sm font-medium text-gray-900">45%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Recommended Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Follow up with Sarah Chen</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Prepare for call with Mike Johnson</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Add 2 more target companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

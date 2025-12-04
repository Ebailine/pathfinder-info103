"use client";

import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Target,
  CheckCircle2,
  ArrowRight,
  Star
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-3xl">P</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Land your dream{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                opportunity
              </span>
              <br />
              through warm introductions
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              PathFinder is your AI-powered career assistant that helps students and early career
              professionals get interviews through networking, not cold applications.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => router.push("/onboarding")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all text-lg font-medium flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all text-lg font-medium"
              >
                See How It Works
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white"
                  />
                ))}
              </div>
              <span>Join 1,000+ students landing opportunities through networking</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </header>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">67%</div>
              <div className="text-gray-600">Average response rate to warm intros</div>
              <div className="text-sm text-gray-500 mt-1">vs. 2-5% for cold emails</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">3x</div>
              <div className="text-gray-600">More likely to get interviews</div>
              <div className="text-sm text-gray-500 mt-1">compared to cold applications</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">84%</div>
              <div className="text-gray-600">Of jobs filled through referrals</div>
              <div className="text-sm text-gray-500 mt-1">according to LinkedIn research</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for your career stage</h2>
            <p className="text-xl text-gray-600">
              Personalized networking strategies for every stage of your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🎓",
                title: "High School Seniors",
                description: "Exploring careers & college options"
              },
              {
                icon: "👨‍🎓",
                title: "College Students",
                description: "Landing internships & co-ops"
              },
              {
                icon: "⚖️",
                title: "Law/Med/MBA",
                description: "Clerkships, residencies & recruiting"
              },
              {
                icon: "💼",
                title: "Early Career",
                description: "Advancing & switching careers"
              }
            ].map((stage, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{stage.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{stage.title}</h3>
                <p className="text-gray-600 text-sm">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How PathFinder works</h2>
            <p className="text-xl text-gray-600">
              Land opportunities through networking in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="flex items-start space-x-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Add your network connections
                  </h3>
                  <p className="text-gray-600">
                    Manually add people you know from school, work, family, or LinkedIn. No API
                    required—you control your data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Find warm paths to companies
                  </h3>
                  <p className="text-gray-600">
                    Our AI analyzes your network to find who can introduce you to hiring managers
                    at your target companies.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Get AI-powered outreach messages
                  </h3>
                  <p className="text-gray-600">
                    We generate personalized, non-awkward messages that actually get responses.
                    Learn networking best practices as you go.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full bg-orange-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Track your networking pipeline
                  </h3>
                  <p className="text-gray-600">
                    Manage multiple companies at once. Get reminders, prep for calls, and celebrate
                    wins when intros are made.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-700 text-lg font-medium">
                  Interactive dashboard screenshot coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
            <p className="text-xl text-gray-600">
              A complete career assistant platform for students and early career professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Network Management",
                description: "Organize connections and track relationship strength"
              },
              {
                icon: Sparkles,
                title: "AI Message Generator",
                description: "Get personalized warm intro messages that work"
              },
              {
                icon: Target,
                title: "Company Targeting",
                description: "Track applications and warm intro paths in one place"
              },
              {
                icon: MessageSquare,
                title: "AI Career Coach",
                description: "24/7 personalized advice on networking and careers"
              },
              {
                icon: GraduationCap,
                title: "Career Resources",
                description: "Resume tips, interview prep, and networking guides"
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Monitor response rates and networking success"
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success stories</h2>
            <p className="text-xl text-gray-600">
              Students landing opportunities through warm introductions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                school: "Drexel CS '25",
                quote:
                  "I got an interview at Google after PathFinder showed me I was connected to someone who worked there. Would have never known!",
                result: "Google Interview"
              },
              {
                name: "Michael J.",
                school: "Penn State '26",
                quote:
                  "The AI-generated messages are so good. 8 out of 10 people responded. Way better than my cold emails.",
                result: "80% Response Rate"
              },
              {
                name: "Jennifer L.",
                school: "Temple '24",
                quote:
                  "Finally landed my dream internship at Meta after a warm intro from an alumni connection. This platform changed everything.",
                result: "Meta Internship"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.school}</div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {testimonial.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to land your dream opportunity?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1,000+ students using warm introductions to get interviews
          </p>
          <button
            onClick={() => router.push("/onboarding")}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl transition-all text-lg font-medium inline-flex items-center space-x-2"
          >
            <span>Start Networking Smarter</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="text-blue-200 mt-4 text-sm">
            Free forever for students • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-white">PathFinder</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 PathFinder. Built for students, by students.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

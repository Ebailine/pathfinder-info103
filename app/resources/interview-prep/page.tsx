"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Share2, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

export default function InterviewPrepPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <article className="prose prose-blue max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              What to Ask in Interviews
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Asking smart questions shows you're genuinely interested and helps you evaluate if the role is right for you.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              About the Role
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>What would a typical day look like in this role?</li>
              <li>What project would I be working on this summer?</li>
              <li>How much ownership do interns typically have?</li>
              <li>Will I be working on production code or side projects?</li>
              <li>What's the tech stack I'd be using?</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              About Growth & Learning
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>What does success look like for an intern in this role?</li>
              <li>How do you support intern learning and development?</li>
              <li>Will I have a dedicated mentor?</li>
              <li>What do past successful interns have in common?</li>
              <li>Do interns present their work at the end of summer?</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              About Culture & Team
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>How would you describe the team culture?</li>
              <li>How does your team collaborate (stand-ups, pair programming, etc.)?</li>
              <li>What do you enjoy most about working here?</li>
              <li>How do you handle work-life balance?</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <p className="font-semibold text-blue-900 mb-2">💡 Pro Tip:</p>
              <p className="text-blue-800 text-sm">
                Always have 2-3 questions ready. If they've already answered some during the interview, say "You actually covered most of my questions, but I'm curious about..." This shows you were listening!
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

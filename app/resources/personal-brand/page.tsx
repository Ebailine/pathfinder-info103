"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function PersonalBrandPage() {
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
              Building Your Personal Brand
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Your personal brand is how you present yourself professionally. Here's how to build one that stands out.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Optimize Your LinkedIn Profile
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Professional photo:</strong> Clear, well-lit, appropriate attire</li>
              <li><strong>Compelling headline:</strong> Not just "Student at X" - add your focus area</li>
              <li><strong>About section:</strong> Tell your story in 3-4 paragraphs</li>
              <li><strong>Featured section:</strong> Showcase projects, articles, or certifications</li>
              <li><strong>Custom URL:</strong> linkedin.com/in/yourname</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Create Content
            </h2>
            <p className="text-gray-700 mb-4">
              Share what you're learning:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Write about projects you've built</li>
              <li>Share insights from courses or books</li>
              <li>Comment thoughtfully on others' posts</li>
              <li>Post about tech events you attend</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. Build in Public
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Share your GitHub projects</li>
              <li>Write technical blog posts</li>
              <li>Create YouTube tutorials</li>
              <li>Contribute to open source</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. Network Authentically
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Connect with people after events (with a note!)</li>
              <li>Congratulate connections on their achievements</li>
              <li>Share others' content when it's valuable</li>
              <li>Help when you can - it comes back around</li>
            </ul>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
              <p className="font-semibold text-purple-900 mb-2">💡 Remember:</p>
              <p className="text-purple-800 text-sm">
                Your personal brand should be authentic. Don't try to be someone you're not. The goal is to amplify who you already are and make it easier for the right opportunities to find you.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

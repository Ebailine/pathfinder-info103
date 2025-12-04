"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Share2, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

export default function NetworkingTipsPage() {
  const router = useRouter();

  const handleBookmark = () => {
    toast.success("Article bookmarked!");
  };

  const handleShare = () => {
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Article */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Meta */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Learning Resource</p>
                <p className="text-xs text-gray-500">5 min read</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmark}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Bookmark"
              >
                <Bookmark className="h-5 w-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <article className="prose prose-blue max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              How to Negotiate Intern Offers
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Landing an internship offer is exciting, but don't accept immediately! Here's how to negotiate like a pro.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Express Enthusiasm First
            </h2>
            <p className="text-gray-700 mb-4">
              Always start by thanking them and expressing genuine excitement about the opportunity. This sets a positive tone for negotiations.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 italic">
                "Thank you so much for the offer! I'm really excited about the opportunity to work with the team. Before I accept, I'd love to discuss a few details..."
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Do Your Research
            </h2>
            <p className="text-gray-700 mb-4">
              Before negotiating, research typical intern salaries for your role and location:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Check Levels.fyi for tech internship compensation</li>
              <li>Ask upperclassmen what they made in similar roles</li>
              <li>Consider cost of living in the location</li>
              <li>Factor in benefits (housing stipend, relocation, etc.)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. What You Can Negotiate
            </h2>
            <div className="space-y-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-900 mb-2">✓ Easy to Negotiate:</p>
                <ul className="list-disc list-inside text-green-800 text-sm space-y-1">
                  <li>Start date (within reason)</li>
                  <li>Remote work options</li>
                  <li>Team placement preferences</li>
                  <li>Return offer timeline</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="font-semibold text-yellow-900 mb-2">~ Sometimes Negotiable:</p>
                <ul className="list-disc list-inside text-yellow-800 text-sm space-y-1">
                  <li>Base salary (if you have competing offers)</li>
                  <li>Housing stipend</li>
                  <li>Relocation bonus</li>
                  <li>Signing bonus</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-900 mb-2">✗ Rarely Negotiable:</p>
                <ul className="list-disc list-inside text-red-800 text-sm space-y-1">
                  <li>PTO days</li>
                  <li>Benefits structure</li>
                  <li>Internship duration</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. How to Ask
            </h2>
            <p className="text-gray-700 mb-4">
              Be direct but polite. Here's a template:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-900 font-mono whitespace-pre-line">
{`"I'm thrilled about this opportunity. Based on my research and the market rate for similar roles in [location], I was hoping we could discuss the compensation. Would there be flexibility to increase the base salary to $[amount]?

I have another offer at $[competing offer], but I'm much more excited about your company because [specific reason]."
`}
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              5. Common Mistakes to Avoid
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>❌ Don't lie about competing offers</li>
              <li>❌ Don't be aggressive or entitled</li>
              <li>❌ Don't negotiate over email (call or video is better)</li>
              <li>❌ Don't negotiate without doing research first</li>
              <li>❌ Don't take too long to respond (3-5 days max)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              6. When They Say No
            </h2>
            <p className="text-gray-700 mb-4">
              If they can't budge on salary, try:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>"Could we revisit this at the halfway point if I'm exceeding expectations?"</li>
              <li>"Is there flexibility on the housing stipend or relocation bonus?"</li>
              <li>"Could I get confirmation that I'll be considered for a return offer?"</li>
            </ul>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
              <p className="font-semibold text-purple-900 mb-2">💡 Pro Tip:</p>
              <p className="text-purple-800 text-sm">
                The best leverage is another offer. If you have multiple offers, use them! Companies expect you to negotiate and respect candidates who do their research.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Resources</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/resources/interview-prep")}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  → What to ask in interviews
                </button>
                <br />
                <button
                  onClick={() => router.push("/resources/personal-brand")}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  → Building your personal brand
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

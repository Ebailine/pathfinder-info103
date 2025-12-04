"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import {
  ArrowLeft,
  User,
  Building2,
  Mail,
  Linkedin,
  Calendar,
  MessageSquare,
  Copy,
  Send,
  Sparkles
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Outreach } from "@/lib/types";

export default function ConnectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const connectionId = params.id as string;

  const connection = useCRMStore((state) =>
    state.connections.find((c) => c.id === connectionId)
  );
  const user = useCRMStore((state) => state.user);
  const companies = useCRMStore((state) => state.companies);
  const addOutreach = useCRMStore((state) => state.addOutreach);

  const [showMessageGenerator, setShowMessageGenerator] = useState(false);
  const [messageGoal, setMessageGoal] = useState<string>("informational_interview");
  const [personalContext, setPersonalContext] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!connection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection not found</h2>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:text-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleGenerateMessage = () => {
    setIsGenerating(true);

    // Simulate AI generation (in production, this would call Claude API)
    setTimeout(() => {
      const messages = {
        informational_interview: `Hi ${connection.full_name.split(" ")[0]},

I hope you're doing well! I saw you're working as a ${connection.current_role} at ${connection.current_company}—congrats on getting there${
          connection.same_school ? ` after ${user?.school}` : ""
        }!

I'm a ${user?.major} student at ${user?.school}, and I'm trying to learn more about ${connection.current_role} roles${
          personalContext ? `. ${personalContext}` : ""
        }.

Would you be open to a 15-min call sometime in the next few weeks to share your experience? I'd love to learn from your journey.

Thanks either way!

${user?.full_name}
${user?.school} '${user?.graduation_year?.toString().slice(-2)}`,

        advice: `Hi ${connection.full_name.split(" ")[0]},

I noticed you're at ${connection.current_company} and wanted to reach out for some quick advice.

I'm a ${user?.major} student at ${user?.school} interested in breaking into ${connection.current_company}${
          personalContext ? `. ${personalContext}` : ""
        }.

Would you have any tips for someone trying to land an internship there? Even a few sentences would be incredibly helpful.

Thanks in advance!

${user?.full_name}`,

        intro_request: `Hi ${connection.full_name.split(" ")[0]},

Thanks again for the great conversation last week! Your insights about ${connection.current_role} were incredibly valuable.

One quick follow-up—if you happen to know anyone on the recruiting team at ${connection.current_company}, I'd love a warm introduction. I'm actively looking for internship opportunities for ${new Date().getFullYear()}.

If you're comfortable making an intro, I've attached my resume and a short bio below to make it easy.

Thanks so much!

${user?.full_name}
${user?.school} '${user?.graduation_year?.toString().slice(-2)}
---
FORWARDABLE BIO:
This is ${user?.full_name}, a ${user?.major} student at ${user?.school}. ${personalContext || "Strong background in software development and actively seeking internship opportunities."} Happy to answer any questions!`
      };

      setGeneratedMessage(messages[messageGoal as keyof typeof messages] || messages.informational_interview);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast.success("Message copied to clipboard!");
  };

  const handleMarkAsSent = () => {
    const newOutreach: Outreach = {
      id: `outreach-${Date.now()}`,
      user_id: user?.id || "user-1",
      target_company_id: companies.find(c => c.company_name === connection.current_company)?.id || "",
      connection_id: connection.id,
      recipient_name: connection.full_name,
      recipient_linkedin_url: connection.linkedin_url,
      message_content: generatedMessage,
      send_method: "linkedin",
      status: "sent",
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addOutreach(newOutreach);
    toast.success(`Message to ${connection.full_name} marked as sent!`);
    router.push("/dashboard");
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

          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{connection.full_name}</h1>
              <p className="text-lg text-gray-600 mt-1">{connection.headline}</p>
              <div className="flex items-center space-x-4 mt-2">
                {connection.current_company && (
                  <span className="flex items-center text-sm text-gray-500">
                    <Building2 className="h-4 w-4 mr-1" />
                    {connection.current_company}
                  </span>
                )}
                {connection.connection_date && (
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Connected {formatDate(connection.connection_date)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Connection Info</h2>

              {/* Connection badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {connection.same_school && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Same School
                  </span>
                )}
                {connection.same_major && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Same Major
                  </span>
                )}
                {connection.mutual_connections > 0 && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {connection.mutual_connections} Mutual
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Why {connection.full_name.split(" ")[0]} is a great connection:</p>
                <ul className="space-y-1">
                  {connection.same_school && (
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-green-600 mr-2">✓</span>
                      Same school ({user?.school})
                    </li>
                  )}
                  {connection.same_major && (
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-green-600 mr-2">✓</span>
                      Same major ({user?.major})
                    </li>
                  )}
                  {connection.mutual_connections > 0 && (
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-green-600 mr-2">✓</span>
                      {connection.mutual_connections} mutual connection{connection.mutual_connections > 1 ? "s" : ""}
                    </li>
                  )}
                  {connection.current_company && (
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-green-600 mr-2">✓</span>
                      Works at {connection.current_company}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Message Generator */}
            {!showMessageGenerator ? (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-8 text-center">
                <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Generate Outreach Message
                </h3>
                <p className="text-gray-600 mb-6">
                  Let AI write a personalized message to {connection.full_name.split(" ")[0]} that actually gets responses
                </p>
                <button
                  onClick={() => setShowMessageGenerator(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Message</span>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
                  Message Generator
                </h2>

                {!generatedMessage ? (
                  <div className="space-y-6">
                    {/* Goal Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What's your goal with this message?
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="goal"
                            value="informational_interview"
                            checked={messageGoal === "informational_interview"}
                            onChange={(e) => setMessageGoal(e.target.value)}
                            className="mt-1 h-4 w-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">Ask for informational interview</p>
                            <p className="text-sm text-gray-600">15-minute call to learn about their role</p>
                          </div>
                        </label>
                        <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="goal"
                            value="advice"
                            checked={messageGoal === "advice"}
                            onChange={(e) => setMessageGoal(e.target.value)}
                            className="mt-1 h-4 w-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">Ask for advice</p>
                            <p className="text-sm text-gray-600">Quick tips on breaking into the company</p>
                          </div>
                        </label>
                        <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="goal"
                            value="intro_request"
                            checked={messageGoal === "intro_request"}
                            onChange={(e) => setMessageGoal(e.target.value)}
                            className="mt-1 h-4 w-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">Request introduction to recruiter</p>
                            <p className="text-sm text-gray-600">For after you've built rapport</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Personal Context */}
                    <div>
                      <label htmlFor="personalContext" className="block text-sm font-medium text-gray-700 mb-2">
                        Add personal context (optional)
                      </label>
                      <textarea
                        id="personalContext"
                        value={personalContext}
                        onChange={(e) => setPersonalContext(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="e.g., I'm interested in PM roles and noticed you transitioned from SWE"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Makes your message more specific and personal
                      </p>
                    </div>

                    <button
                      onClick={handleGenerateMessage}
                      disabled={isGenerating}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          <span>Generate Message</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Generated Message */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Your personalized message
                        </label>
                        <button
                          onClick={() => setGeneratedMessage("")}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Regenerate
                        </button>
                      </div>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <textarea
                          value={generatedMessage}
                          onChange={(e) => setGeneratedMessage(e.target.value)}
                          rows={12}
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                        />
                      </div>
                    </div>

                    {/* Coaching Tips */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">💡 Why this works:</p>
                      <ul className="space-y-1 text-sm text-blue-800">
                        <li>✓ Mentions shared connection{connection.same_school ? " (same school)" : ""}</li>
                        <li>✓ Specific ask (not vague)</li>
                        <li>✓ Shows you did research</li>
                        <li>✓ Gives them an out ("thanks either way")</li>
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleCopyMessage}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Copy className="h-5 w-5" />
                        <span>Copy Message</span>
                      </button>
                      <button
                        onClick={handleMarkAsSent}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Send className="h-5 w-5" />
                        <span>Mark as Sent</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {connection.linkedin_url && (
                  <a
                    href={connection.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    <span>View LinkedIn</span>
                  </a>
                )}
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Find Email</span>
                </button>
              </div>
            </div>

            {/* Connection Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <dl className="space-y-3 text-sm">
                {connection.current_company && (
                  <div>
                    <dt className="text-gray-600">Company</dt>
                    <dd className="font-medium text-gray-900">{connection.current_company}</dd>
                  </div>
                )}
                {connection.current_role && (
                  <div>
                    <dt className="text-gray-600">Role</dt>
                    <dd className="font-medium text-gray-900">{connection.current_role}</dd>
                  </div>
                )}
                {connection.mutual_connections > 0 && (
                  <div>
                    <dt className="text-gray-600">Mutual Connections</dt>
                    <dd className="font-medium text-gray-900">{connection.mutual_connections}</dd>
                  </div>
                )}
                {connection.connection_date && (
                  <div>
                    <dt className="text-gray-600">Connected Since</dt>
                    <dd className="font-medium text-gray-900">{formatDate(connection.connection_date)}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

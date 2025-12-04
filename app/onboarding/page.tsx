"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CAREER_STAGES,
  CareerStage,
  OpportunityType,
  OPPORTUNITY_LABELS,
  getCareerStageInfo
} from "@/lib/career-stages";
import { User } from "@/lib/types";
import { GraduationCap, Briefcase, Building, MapPin, Target, ChevronRight, ChevronLeft } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<User>>({
    career_stage: "undergrad",
    target_opportunity_types: [],
    target_industries: [],
    target_roles: [],
    preferred_locations: [],
    remote_preference: "flexible",
    skills: [],
    onboarding_step: 1,
    onboarding_completed: false
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      setUserData({ ...userData, onboarding_step: step + 1 });
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = () => {
    // Save user data to database (or localStorage for now)
    const completedUserData = {
      ...userData,
      onboarding_completed: true,
      onboarding_step: totalSteps
    };
    localStorage.setItem("user_profile", JSON.stringify(completedUserData));
    router.push("/dashboard");
  };

  const selectedStageInfo = userData.career_stage ? getCareerStageInfo(userData.career_stage) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Welcome to PathFinder
          </h1>
          <p className="text-gray-600 text-lg">
            Your AI-powered career assistant for landing opportunities through networking
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="text-sm text-gray-500">
              Step {step} of {totalSteps}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Step 1: Career Stage */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <GraduationCap className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Where are you in your career journey?
                </h2>
                <p className="text-gray-600">
                  This helps us personalize your experience and recommendations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(CAREER_STAGES).map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setUserData({ ...userData, career_stage: stage.id })}
                    className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      userData.career_stage === stage.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-2">{stage.label}</div>
                    <div className="text-sm text-gray-600">{stage.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: School & Major */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Building className="h-16 w-16 mx-auto text-purple-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Tell us about your education
                </h2>
                <p className="text-gray-600">
                  We'll use this to find alumni connections in your network
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School / University
                  </label>
                  <input
                    type="text"
                    value={userData.school || ""}
                    onChange={(e) => setUserData({ ...userData, school: e.target.value })}
                    placeholder="e.g., Drexel University"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Major / Field of Study
                    </label>
                    <input
                      type="text"
                      value={userData.major || ""}
                      onChange={(e) => setUserData({ ...userData, major: e.target.value })}
                      placeholder="e.g., Computer Science"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree Type
                    </label>
                    <select
                      value={userData.degree_type || ""}
                      onChange={(e) => setUserData({ ...userData, degree_type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select degree</option>
                      <option value="BS">Bachelor of Science (BS)</option>
                      <option value="BA">Bachelor of Arts (BA)</option>
                      <option value="MS">Master of Science (MS)</option>
                      <option value="MA">Master of Arts (MA)</option>
                      <option value="MBA">MBA</option>
                      <option value="JD">Juris Doctor (JD)</option>
                      <option value="MD">Doctor of Medicine (MD)</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year (or Expected)
                  </label>
                  <input
                    type="number"
                    value={userData.graduation_year || ""}
                    onChange={(e) => setUserData({ ...userData, graduation_year: parseInt(e.target.value) })}
                    placeholder="2026"
                    min="1950"
                    max="2035"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Opportunity Types */}
          {step === 3 && selectedStageInfo && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Target className="h-16 w-16 mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  What opportunities are you looking for?
                </h2>
                <p className="text-gray-600">
                  Select all that apply for your {selectedStageInfo.label.toLowerCase()} stage
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedStageInfo.opportunityTypes.map((oppType) => {
                  const isSelected = userData.target_opportunity_types?.includes(oppType);
                  return (
                    <button
                      key={oppType}
                      onClick={() => {
                        const current = userData.target_opportunity_types || [];
                        const updated = isSelected
                          ? current.filter((t) => t !== oppType)
                          : [...current, oppType];
                        setUserData({ ...userData, target_opportunity_types: updated });
                      }}
                      className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                        isSelected
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900">
                          {OPPORTUNITY_LABELS[oppType]}
                        </div>
                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Industries & Roles */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Briefcase className="h-16 w-16 mx-auto text-orange-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  What industries and roles interest you?
                </h2>
                <p className="text-gray-600">
                  We'll help you find connections in these areas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Industries (type and press Enter)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Technology, Healthcare, Finance"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const industries = userData.target_industries || [];
                      setUserData({
                        ...userData,
                        target_industries: [...industries, e.currentTarget.value.trim()]
                      });
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {userData.target_industries?.map((industry, idx) => (
                    <div key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                      {industry}
                      <button
                        onClick={() => {
                          const filtered = userData.target_industries?.filter((_, i) => i !== idx) || [];
                          setUserData({ ...userData, target_industries: filtered });
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Roles (type and press Enter)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer, Product Manager, Analyst"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const roles = userData.target_roles || [];
                      setUserData({
                        ...userData,
                        target_roles: [...roles, e.currentTarget.value.trim()]
                      });
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {userData.target_roles?.map((role, idx) => (
                    <div key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                      {role}
                      <button
                        onClick={() => {
                          const filtered = userData.target_roles?.filter((_, i) => i !== idx) || [];
                          setUserData({ ...userData, target_roles: filtered });
                        }}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Location Preferences */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <MapPin className="h-16 w-16 mx-auto text-red-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Where do you want to work?
                </h2>
                <p className="text-gray-600">
                  Tell us about your location preferences
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location
                </label>
                <input
                  type="text"
                  value={userData.location || ""}
                  onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                  placeholder="e.g., Philadelphia, PA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Locations (type and press Enter)
                </label>
                <input
                  type="text"
                  placeholder="e.g., New York, San Francisco, Remote"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const locations = userData.preferred_locations || [];
                      setUserData({
                        ...userData,
                        preferred_locations: [...locations, e.currentTarget.value.trim()]
                      });
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {userData.preferred_locations?.map((location, idx) => (
                    <div key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-2">
                      {location}
                      <button
                        onClick={() => {
                          const filtered = userData.preferred_locations?.filter((_, i) => i !== idx) || [];
                          setUserData({ ...userData, preferred_locations: filtered });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remote Work Preference
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(["remote", "hybrid", "onsite", "flexible"] as const).map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setUserData({ ...userData, remote_preference: pref })}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        userData.remote_preference === pref
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="font-medium text-gray-900 capitalize">{pref}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
              step === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            {step === totalSteps ? "Get Started" : "Continue"}
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

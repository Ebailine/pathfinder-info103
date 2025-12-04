"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import { Connection } from "@/lib/types";
import {
  ArrowLeft,
  User,
  Building2,
  Briefcase,
  Mail,
  Phone,
  Linkedin,
  MessageSquare,
  UserPlus
} from "lucide-react";
import toast from "react-hot-toast";

export default function NewContactPage() {
  const router = useRouter();
  const addConnection = useCRMStore((state) => state.addConnection);

  const [formData, setFormData] = useState({
    full_name: "",
    current_company: "",
    current_role: "",
    email: "",
    phone: "",
    linkedin_url: "",
    how_you_know: "",
    notes: "",
    same_school: false,
    same_major: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Name is required";
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.linkedin_url && !isValidUrl(formData.linkedin_url)) {
      newErrors.linkedin_url = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      user_id: "user-1",
      full_name: formData.full_name.trim(),
      headline: formData.current_role
        ? `${formData.current_role}${formData.current_company ? ` at ${formData.current_company}` : ""}`
        : "",
      current_company: formData.current_company.trim() || undefined,
      current_role: formData.current_role.trim() || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      linkedin_url: formData.linkedin_url.trim() || undefined,
      how_you_know: formData.how_you_know.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      same_school: formData.same_school,
      same_major: formData.same_major,
      mutual_connections: 0,
      intro_likelihood_score: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addConnection(newConnection);
    toast.success(`${formData.full_name} added to your contacts!`);
    router.push("/contacts");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/contacts")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Contacts
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserPlus className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Contact</h1>
              <p className="text-sm text-gray-600 mt-1">
                Add someone to your professional network
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.full_name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Smith"
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="current_company"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="current_company"
                    name="current_company"
                    value={formData.current_company}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Google, Amazon, etc."
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="current_role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Role/Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="current_role"
                    name="current_role"
                    value={formData.current_role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* LinkedIn URL */}
              <div className="md:col-span-2">
                <label
                  htmlFor="linkedin_url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="linkedin_url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.linkedin_url ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="https://linkedin.com/in/johnsmith"
                  />
                </div>
                {errors.linkedin_url && (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedin_url}</p>
                )}
              </div>
            </div>
          </div>

          {/* Connection Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Connection Details
            </h2>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6 mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="same_school"
                  checked={formData.same_school}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Same School</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="same_major"
                  checked={formData.same_major}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Same Major</span>
              </label>
            </div>

            {/* How You Know Them */}
            <div className="mb-6">
              <label
                htmlFor="how_you_know"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                How Do You Know Them?
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="how_you_know"
                  name="how_you_know"
                  value={formData.how_you_know}
                  onChange={handleChange}
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Met at career fair, introduced by professor, etc."
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Any additional notes about this contact..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/contacts")}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

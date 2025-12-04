"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCRMStore } from "@/lib/store";
import {
  LayoutDashboard,
  Users,
  Bell,
  Plus,
  Menu,
  X,
  Compass
} from "lucide-react";
import { useState, useEffect } from "react";

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const reminders = useCRMStore((state) => state.reminders);
  const pendingReminders = reminders.filter(r => !r.completed).length;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard"
    },
    {
      label: "Contacts",
      href: "/networking",
      icon: Users,
      active: pathname === "/networking" || pathname.startsWith("/connections")
    },
    {
      label: "Tasks",
      href: "/reminders",
      icon: Bell,
      active: pathname === "/reminders",
      badge: pendingReminders > 0 ? pendingReminders : null
    }
  ];

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled
        ? "bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm"
        : "bg-white border-b border-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => router.push("/dashboard")}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                  <Compass className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  PathFinder
                </span>
                <p className="text-[10px] text-gray-400 -mt-0.5 font-medium tracking-wide">
                  APPLICATION TRACKER
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center bg-gray-100/80 rounded-full p-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    item.active
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${item.active ? "text-blue-600" : ""}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gradient-to-br from-rose-500 to-red-600 text-white text-[10px] font-bold rounded-full shadow-sm">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Add Application Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => router.push("/companies/new")}
              className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Application</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="px-4 py-4 space-y-2 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                router.push(item.href);
                setMobileMenuOpen(false);
              }}
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                item.active
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:bg-white hover:text-gray-900"
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.active ? "text-blue-600" : ""}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 bg-gradient-to-br from-rose-500 to-red-600 text-white text-xs font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => {
              router.push("/companies/new");
              setMobileMenuOpen(false);
            }}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mt-3"
          >
            <Plus className="h-5 w-5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

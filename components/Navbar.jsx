"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Home as HomeIcon, LayoutDashboard, LogOut, LogIn, UserPlus, Search, Cpu, Plus } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const navLinks = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Browse Properties", href: "/properties", icon: Search }
  ];

  if (user) {
    navLinks.push({ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard });
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-805 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Badges */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                LuxeSpace
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-950/80 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/10">
              Zero Brokerage
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "text-emerald-400 bg-slate-800/80"
                      : "text-slate-350 hover:text-white hover:bg-slate-805/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth & Posting Trigger */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-300">
                  Welcome, <span className="font-semibold text-emerald-400">{user.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 bg-red-600/10 hover:bg-red-650 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  href="/login"
                  className="flex items-center space-x-1 text-slate-300 hover:text-white px-3 py-2 text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}

            {/* Post Property FREE Button */}
            <Link
              href={user ? "/dashboard?tab=add_property" : "/login"}
              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-md shadow-emerald-950/20"
            >
              <Plus className="w-4 h-4" />
              <span>Post Property <span className="text-xs font-semibold text-emerald-100 uppercase bg-emerald-700/60 px-1 py-0.5 rounded ml-1">Free</span></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? "text-emerald-400 bg-slate-805"
                    : "text-slate-350 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="border-t border-slate-800 mt-4 pt-4 px-3 space-y-3">
            {user ? (
              <div className="space-y-3">
                <div className="text-sm text-slate-300">
                  Welcome, <span className="font-semibold text-emerald-400">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-red-650/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-lg text-base font-medium cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 border border-slate-750 text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2.5 rounded-lg text-base font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}

            <Link
              href={user ? "/dashboard" : "/login"}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-base font-bold shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Post Property FREE</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

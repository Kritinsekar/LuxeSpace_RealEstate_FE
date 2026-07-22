"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo/About */}
          <div className="space-y-4">
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              LuxeSpace
            </span>
            <p className="text-sm text-slate-400">
              Discover your perfect dream home. LuxeSpace offers a premium curated listing platform for luxurious real estate across the country.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-emerald-400 transition-colors">Properties</Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-emerald-400 transition-colors">Architecture Specs</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition-colors">Register</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Contact & Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>101, Tech Park, Mumbai, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@luxespace.com</span>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Backend Specs</h3>
            <p className="text-sm mb-3">
              Running live on Node.js/Express, PostgreSQL database, and tokenized JWT auth middleware.
            </p>
            <div className="flex space-x-4">
              <a
                href="http://localhost:5000/api-docs"
                target="_blank"
                rel="noreferrer"
                className="text-xs bg-slate-900 border border-slate-800 text-emerald-400 px-3 py-1.5 rounded hover:bg-slate-800 transition-all font-mono"
              >
                Swagger API Docs
              </a>
            </div>
          </div>
        </div>

        {/* Bottom banner */}
        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LuxeSpace Realty. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-emerald-400 transition-colors">Privacy Policy</span>
            <span className="hover:text-emerald-400 transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

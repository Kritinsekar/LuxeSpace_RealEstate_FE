"use client";

import React from "react";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <div className="relative bg-slate-950 overflow-hidden py-24 md:py-32 border-b border-slate-900">
      {/* Mild Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="Luxury Mansion Background"
          className="w-full h-full object-cover opacity-[0.70]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/75 to-slate-950"></div>
      </div>

      {/* Background Graphic Grid */}
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] z-0"></div>

      {/* Decorative gradient blur */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500 rounded-full blur-[128px] opacity-20 z-0"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full blur-[128px] opacity-15 z-0"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            Premium Realty Platform
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Dream Space <br />
            With <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">LuxeSpace</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-400 font-medium">
            Search 50,000+ luxury villas, BHK apartments, and commercial spaces across India's top residential locations.
          </p>
        </div>

        {/* Search Bar Wrapper */}
        <div className="pt-4">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

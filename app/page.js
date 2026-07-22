"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Hero from "../components/Hero";
import PropertyCard from "../components/PropertyCard";
import { Building, MapPin, Sparkles, Shield, ArrowRight } from "lucide-react";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLatestProperties() {
      try {
        const res = await fetch("http://localhost:5000/api/property?limit=6");
        if (!res.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await res.json();
        if (data.success && data.properties && data.properties.length > 0) {
          setProperties(data.properties);
        } else {
          // Fallback to mock data
          const { getMockProperties } = await import("../utils/mockData");
          setProperties(getMockProperties().slice(0, 6));
        }
      } catch (err) {
        console.error("Error fetching latest properties, loading mock data fallback:", err);
        try {
          const { getMockProperties } = await import("../utils/mockData");
          setProperties(getMockProperties().slice(0, 6));
        } catch (e) {
          setError("Unable to connect to the properties database at this moment.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchLatestProperties();
  }, []);

  const browseCities = [
    { name: "Mumbai", count: "12,450+ Properties", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80" },
    { name: "Bangalore", count: "8,920+ Properties", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80" },
    { name: "Pune", count: "5,120+ Properties", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80" },
    { name: "Delhi", count: "14,800+ Properties", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Header */}
      <Hero />

      {/* Browse by Location */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-white">Browse By Top Cities</h2>
          <p className="text-slate-400">Explore premium residential properties located in prime metropolitan locations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {browseCities.map((city) => (
            <Link
              key={city.name}
              href={`/properties?city=${city.name}`}
              className="group relative h-64 rounded-2xl overflow-hidden block shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-bold group-hover:text-emerald-450 transition-colors">{city.name}</p>
                <p className="text-xs text-slate-350">{city.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white">Latest Added Listings</h2>
            <p className="text-slate-450">View premium residential deals fresh off the listing platform.</p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors group text-sm"
          >
            <span>View all 50,000+ listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900 border border-slate-800 rounded-xl h-[420px] animate-pulse">
                <div className="h-56 bg-slate-950 rounded-t-xl"></div>
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-slate-800 w-1/3 rounded"></div>
                  <div className="h-6 bg-slate-800 w-3/4 rounded"></div>
                  <div className="h-10 bg-slate-800 rounded mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-slate-900/60 border border-slate-850 rounded-2xl max-w-xl mx-auto space-y-4">
            <p className="text-slate-400 text-sm">{error}</p>
            <Link
              href="/properties"
              className="inline-flex bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all"
            >
              Browse Static Catalog
            </Link>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center p-12 bg-slate-900/60 border border-slate-850 rounded-2xl max-w-xl mx-auto">
            <p className="text-slate-400 text-sm">No properties found. Be the first to post a listing!</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all"
            >
              Post a Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>

      {/* Services/Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-white">Why Use LuxeSpace?</h2>
          <p className="text-slate-400">
            We provide premium verified listings directly connecting buyers and genuine property owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 bg-emerald-950/80 rounded-xl flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-xl">Verified Owners Only</h3>
            <p className="text-slate-450 text-sm leading-relaxed">
              Skip brokers and middlemen. Contact property owners directly for true rates, transparent specifications, and quick listings management.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 bg-emerald-950/80 rounded-xl flex items-center justify-center text-emerald-450">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-xl">Scalable Query Optimization</h3>
            <p className="text-slate-455 text-sm leading-relaxed">
              Designed with optimized pagination and indexes to scale up to 50,000+ real estate records with sub-millisecond response times.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4 hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 bg-emerald-950/80 rounded-xl flex items-center justify-center text-emerald-400">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-xl">No Brokerage Model</h3>
            <p className="text-slate-450 text-sm leading-relaxed">
              Zero brokers. Directly send inquiries using our spam-protected inquiry form and view lead summaries in your owner dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

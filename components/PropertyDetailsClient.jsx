"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "./PropertyCard";
import { BedDouble, Bath, Square, MapPin, Building, Calendar, Mail, Phone, Lock, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { getSimilarMockProperties } from "../utils/mockData";

export default function PropertyDetailsClient({ property }) {
  const { user, token, API_URL } = useAuth();
  
  const {
    id,
    title,
    description,
    price,
    city,
    address,
    bedrooms,
    bathrooms,
    image_url,
    property_type,
    area_sqft,
    status,
    owner_id,
    created_at
  } = property;

  // State for inquiry form
  const [message, setMessage] = useState("Hi, I am interested in this listing and would like to schedule a call.");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Recommendations state
  const [similarProperties, setSimilarProperties] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);

  // Check if current user is owner
  const isOwner = user && user.id === owner_id;

  // Format currency
  const formatPrice = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };
  useEffect(() => {
    async function fetchSimilar() {
      try {
        const res = await fetch(`http://localhost:5000/api/property/${id}/similar`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.success && data.properties && data.properties.length > 0) {
          setSimilarProperties(data.properties);
        } else {
          setSimilarProperties(getSimilarMockProperties(id));
        }
      } catch (err) {
        console.error("Error fetching similar properties, using mock fallback:", err);
        setSimilarProperties(getSimilarMockProperties(id));
      } finally {
        setSimilarLoading(false);
      }
    }
    fetchSimilar();
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryError("");
    setInquirySuccess(false);

    if (!token) {
      setInquiryError("You must be logged in to send an inquiry.");
      return;
    }

    if (isOwner) {
      setInquiryError("You cannot send an inquiry for your own property.");
      return;
    }

    if (!message.trim()) {
      setInquiryError("Please enter an inquiry message.");
      return;
    }

    setInquiryLoading(true);

    try {
      const res = await fetch(`${API_URL}/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          property_id: id,
          message: message
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit inquiry.");
      }

      if (data.success) {
        setInquirySuccess(true);
        setMessage("");
      }
    } catch (err) {
      setInquiryError(err.message);
    } finally {
      setInquiryLoading(false);
    }
  };

  const displayImage = image_url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Breadcrumb and Title Info */}
      <div className="space-y-4">
        <Link href="/properties" className="text-sm text-slate-400 hover:text-white transition-colors">
          &larr; Back to Listings
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-950/60 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/10">
                {property_type}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                status?.toLowerCase() === "available" ? "bg-emerald-900/40 text-emerald-450 border border-emerald-500/20" : "bg-amber-900/40 text-amber-450 border border-amber-500/20"
              }`}>
                {status}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{title}</h1>
            <p className="flex items-center text-slate-400 text-sm mt-2">
              <MapPin className="w-4 h-4 text-emerald-400 mr-1 flex-shrink-0" />
              <span>{address}, {city}</span>
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-805 p-4 rounded-xl text-left md:text-right min-w-[200px]">
            <p className="text-xs text-slate-455 font-semibold uppercase tracking-wider mb-1">Asking Price</p>
            <p className="text-2xl md:text-3xl font-extrabold text-emerald-400">{formatPrice(price)}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Images & Specifications vs Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Details & Image */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Photo */}
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-805 shadow-xl">
            <img
              src={displayImage}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85";
              }}
            />
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900 border border-slate-805 p-4 rounded-xl space-y-1">
              <BedDouble className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-xs text-slate-450 font-semibold uppercase">Configuration</p>
              <p className="text-base font-bold text-white">{bedrooms} BHK</p>
            </div>
            <div className="bg-slate-900 border border-slate-805 p-4 rounded-xl space-y-1">
              <Bath className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-xs text-slate-450 font-semibold uppercase">Bathrooms</p>
              <p className="text-base font-bold text-white">{bathrooms} Baths</p>
            </div>
            <div className="bg-slate-900 border border-slate-805 p-4 rounded-xl space-y-1">
              <Square className="w-5.5 h-5.5 text-emerald-400 mx-auto" />
              <p className="text-xs text-slate-450 font-semibold uppercase">Builtup Area</p>
              <p className="text-base font-bold text-white">{area_sqft} sqft</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" />
              <span>Property Description</span>
            </h3>
            <p className="text-slate-350 text-sm leading-relaxed whitespace-pre-line">{description}</p>
          </div>

        </div>

        {/* Right Col: Inquiry Contact Form */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-805 p-6 rounded-2xl shadow-xl space-y-6 sticky top-24">
            <div>
              <h3 className="text-lg font-bold text-white">Contact Property Owner</h3>
              <p className="text-xs text-slate-400 mt-1">Get directly in touch with verified owner</p>
            </div>

            {isOwner ? (
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center space-y-2 text-sm text-slate-400">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                <p className="font-semibold text-white">You own this listing</p>
                <p className="text-xs">Manage listing details or view received inquiries directly inside your dashboard.</p>
                <Link
                  href="/dashboard"
                  className="mt-2 w-full inline-flex justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs transition-all"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {inquirySuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 p-3 rounded-lg flex items-start gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Inquiry sent successfully! The owner will contact you shortly.</span>
                  </div>
                )}

                {inquiryError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{inquiryError}</span>
                  </div>
                )}

                {!token ? (
                  <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl text-center space-y-3 text-xs text-slate-450">
                    <Lock className="w-6 h-6 text-slate-500 mx-auto" />
                    <p>You must be signed in to submit inquiries to owners.</p>
                    <Link
                      href="/login"
                      className="inline-flex w-full justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg font-bold"
                    >
                      Sign In to Contact
                    </Link>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</label>
                      <textarea
                        rows="4"
                        placeholder="Write your custom inquiry details..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-805 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm placeholder-slate-700 resize-none transition-all"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={inquiryLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg hover:scale-[1.01] duration-150 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {inquiryLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>Send Inquiry Message</span>
                      )}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Recommendations Section */}
      <div className="border-t border-slate-900 pt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Similar Properties Recommended</h2>
          <p className="text-slate-400 text-sm">Similar properties in {city} with matching configuration</p>
        </div>

        {similarLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900 border border-slate-800 rounded-xl h-[380px] animate-pulse"></div>
            ))}
          </div>
        ) : similarProperties.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No similar properties found matching this configuration.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

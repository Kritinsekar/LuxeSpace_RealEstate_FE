"use client";

import React from "react";
import Link from "next/link";
import { BedDouble, Bath, Square, MapPin, Tag } from "lucide-react";

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    price,
    city,
    bedrooms,
    bathrooms,
    image_url,
    property_type,
    area_sqft,
    status
  } = property;

  // Format price in Indian style (Lakhs/Crores or standard commas)
  const formatPrice = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  // Safe image fallback
  const displayImage = image_url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=85";

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full">
      {/* Property Image & Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-950">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=85";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
        
        {/* Status and Type tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-emerald-500/90 text-white font-semibold text-xs px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wide">
            {property_type || "Property"}
          </span>
        </div>
        
        {status && (
          <div className="absolute top-3 right-3">
            <span className={`text-white font-semibold text-xs px-2.5 py-1 rounded-full backdrop-blur-sm ${
              status.toLowerCase() === "available" ? "bg-emerald-600/95" : "bg-amber-600/95"
            }`}>
              {status}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-xl font-bold text-emerald-400 font-sans">{formatPrice(price)}</p>
        </div>
      </div>

      {/* Property Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center space-x-1 text-slate-400 text-xs mb-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">{city}</span>
        </div>

        <h3 className="text-white font-bold text-lg mb-3 line-clamp-1 group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-800 text-slate-300 text-xs mt-auto">
          <div className="flex items-center justify-center space-x-1 bg-slate-950/60 p-2 rounded-lg">
            <BedDouble className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{bedrooms} BHK</span>
          </div>
          <div className="flex items-center justify-center space-x-1 bg-slate-950/60 p-2 rounded-lg">
            <Bath className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{bathrooms} Bath</span>
          </div>
          <div className="flex items-center justify-center space-x-1 bg-slate-950/60 p-2 rounded-lg">
            <Square className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{area_sqft} sqft</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-slate-850">
          <Link
            href={`/properties/${id}`}
            className="w-full inline-flex items-center justify-center bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-200 border border-slate-700/50 hover:border-emerald-500 shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

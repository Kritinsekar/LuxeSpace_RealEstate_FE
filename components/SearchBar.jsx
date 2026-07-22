"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building, BedDouble, DollarSign } from "lucide-react";

export default function SearchBar({ initialFilters = {} }) {
  const router = useRouter();

  const [city, setCity] = useState(initialFilters.city || "");
  const [propertyType, setPropertyType] = useState(initialFilters.property_type || "");
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms || "");
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || "");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (propertyType) params.set("property_type", propertyType);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    router.push(`/properties?${params.toString()}`);
  };

  const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];
  const propertyTypes = ["Apartment", "House", "Penthouse", "Villa", "Condo"];
  const bedroomCounts = ["1", "2", "3", "4", "5"];

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 lg:space-y-0 lg:flex lg:items-end lg:gap-4 max-w-5xl mx-auto"
    >
      {/* City */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          Location (City)
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-all"
        >
          <option value="">Any Location</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-emerald-400" />
          Property Type
        </label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-all"
        >
          <option value="">Any Type</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BedDouble className="w-3.5 h-3.5 text-emerald-400" />
          Bedrooms (BHK)
        </label>
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-all"
        >
          <option value="">Any BHK</option>
          {bedroomCounts.map((count) => (
            <option key={count} value={count}>{count} BHK</option>
          ))}
        </select>
      </div>

      {/* Budget Min/Max */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          Max Price (INR)
        </label>
        <input
          type="number"
          placeholder="Max budget"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-all placeholder-slate-600"
        />
      </div>

      {/* Submit Button */}
      <div className="flex-shrink-0">
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20 transition-all hover:scale-[1.02] duration-200"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}

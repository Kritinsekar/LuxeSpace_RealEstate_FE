"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyCard from "../../components/PropertyCard";
import { Filter, SlidersHorizontal, RefreshCw, X, ChevronLeft, ChevronRight } from "lucide-react";

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters state
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  // Read current query values
  const city = searchParams.get("city") || "";
  const bedrooms = searchParams.get("bedrooms") || "";
  const propertyType = searchParams.get("property_type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = searchParams.get("page") || "1";

  // Available options
  const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];
  const propertyTypes = ["Apartment", "House", "Penthouse", "Villa", "Condo"];
  const bedroomCounts = ["1", "2", "3", "4", "5"];

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (city) queryParams.set("city", city);
        if (bedrooms) queryParams.set("bedrooms", bedrooms);
        if (propertyType) queryParams.set("property_type", propertyType);
        if (minPrice) queryParams.set("minPrice", minPrice);
        if (maxPrice) queryParams.set("maxPrice", maxPrice);
        queryParams.set("sort", sort);
        queryParams.set("page", page);
        queryParams.set("limit", "9");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/property?${queryParams.toString()}`);
        if (!res.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await res.json();
        if (data.success && data.properties && data.properties.length > 0) {
          setProperties(data.properties);
          setTotalPages(data.totalPages || 1);
          setTotalProperties(data.totalProperties || 0);
          setCurrentPage(data.currentPage || 1);
        } else {
          // Fallback to mock data with client-side filtering
          const { getMockProperties } = await import("../../utils/mockData");
          let mockList = getMockProperties();

          if (city) mockList = mockList.filter(p => p.city.toLowerCase() === city.toLowerCase());
          if (propertyType) mockList = mockList.filter(p => p.property_type.toLowerCase() === propertyType.toLowerCase());
          if (bedrooms) mockList = mockList.filter(p => p.bedrooms.toString() === bedrooms.toString());
          if (minPrice) mockList = mockList.filter(p => p.price >= parseFloat(minPrice));
          if (maxPrice) mockList = mockList.filter(p => p.price <= parseFloat(maxPrice));

          if (sort === "price_asc") mockList.sort((a,b) => a.price - b.price);
          else if (sort === "price_desc") mockList.sort((a,b) => b.price - a.price);
          else if (sort === "oldest") mockList.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
          else mockList.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

          setProperties(mockList);
          setTotalPages(1);
          setTotalProperties(mockList.length);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Fetch properties error, loading mock fallbacks:", err);
        try {
          const { getMockProperties } = await import("../../utils/mockData");
          let mockList = getMockProperties();

          if (city) mockList = mockList.filter(p => p.city.toLowerCase() === city.toLowerCase());
          if (propertyType) mockList = mockList.filter(p => p.property_type.toLowerCase() === propertyType.toLowerCase());
          if (bedrooms) mockList = mockList.filter(p => p.bedrooms.toString() === bedrooms.toString());
          if (minPrice) mockList = mockList.filter(p => p.price >= parseFloat(minPrice));
          if (maxPrice) mockList = mockList.filter(p => p.price <= parseFloat(maxPrice));

          if (sort === "price_asc") mockList.sort((a,b) => a.price - b.price);
          else if (sort === "price_desc") mockList.sort((a,b) => b.price - a.price);
          else if (sort === "oldest") mockList.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
          else mockList.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

          setProperties(mockList);
          setTotalPages(1);
          setTotalProperties(mockList.length);
          setCurrentPage(1);
        } catch (e) {
          setError("Error fetching listings. Please ensure the backend server is running.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [city, bedrooms, propertyType, minPrice, maxPrice, sort, page]);

  // Update query parameter
  const updateQuery = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(updates).forEach((key) => {
      const val = updates[key];
      if (val === null || val === undefined || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    // Reset page to 1 on filter change, unless we are explicitly navigating pages
    if (!updates.page) {
      params.delete("page");
    }
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/properties");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-900 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Search Luxury Listings</h1>
          <p className="text-slate-400 text-sm mt-1">
            Found {totalProperties} listings matching your options
          </p>
        </div>

        {/* Sort & Quick actions */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Sort By</label>
          <select
            value={sort}
            onChange={(e) => updateQuery({ sort: e.target.value })}
            className="bg-slate-900 border border-slate-805 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm font-medium"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          {(city || bedrooms || propertyType || minPrice || maxPrice) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-2 border border-slate-805 rounded-lg text-sm transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-red-400" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8 flex-grow">
        {/* Filter Sidebar */}
        <div className="bg-slate-900 border border-slate-805 p-6 rounded-2xl h-fit space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-450" />
              <span>Filter Options</span>
            </h2>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Location</label>
            <select
              value={city}
              onChange={(e) => updateQuery({ city: e.target.value })}
              className="w-full bg-slate-950 border border-slate-805 text-white rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
            >
              <option value="">All Locations</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Type</label>
            <select
              value={propertyType}
              onChange={(e) => updateQuery({ property_type: e.target.value })}
              className="w-full bg-slate-950 border border-slate-805 text-white rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-2">Bedrooms (BHK)</label>
            <select
              value={bedrooms}
              onChange={(e) => updateQuery({ bedrooms: e.target.value })}
              className="w-full bg-slate-950 border border-slate-805 text-white rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
            >
              <option value="">All BHK</option>
              {bedroomCounts.map((count) => (
                <option key={count} value={count}>{count} BHK</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider">Price Range (INR)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateQuery({ minPrice: e.target.value })}
                className="w-full bg-slate-950 border border-slate-805 text-white rounded-lg py-2.5 px-3 text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateQuery({ maxPrice: e.target.value })}
                className="w-full bg-slate-950 border border-slate-805 text-white rounded-lg py-2.5 px-3 text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Listings Content */}
        <div className="lg:col-span-3 flex flex-col h-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
              {[1, 2, 3, 4, 5, 6].map((n) => (
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
            <div className="text-center p-12 bg-slate-900/60 border border-slate-850 rounded-2xl flex-grow flex flex-col justify-center items-center">
              <RefreshCw className="w-12 h-12 text-slate-500 mb-4 animate-spin-slow" />
              <p className="text-slate-400 text-sm max-w-md">{error}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center p-12 bg-slate-900/60 border border-slate-850 rounded-2xl flex-grow flex flex-col justify-center items-center">
              <p className="text-slate-400 font-medium mb-2">No Properties Found</p>
              <p className="text-slate-500 text-xs max-w-sm">We couldn't find any listings matching those filter specifications. Try removing some filters or change locations.</p>
            </div>
          ) : (
            <div className="space-y-8 flex-grow flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-900 pt-6 mt-auto">
                  <button
                    onClick={() => updateQuery({ page: currentPage - 1 })}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1.5 bg-slate-900 border border-slate-805 hover:bg-slate-800 text-slate-350 disabled:opacity-40 disabled:hover:bg-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => updateQuery({ page: currentPage + 1 })}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1.5 bg-slate-900 border border-slate-805 hover:bg-slate-800 text-slate-350 disabled:opacity-40 disabled:hover:bg-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition-all cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Properties() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-405">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading Property Catalog...</p>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}

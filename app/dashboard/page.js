"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  Building,
  PlusCircle,
  Inbox,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock
} from "lucide-react";

export default function Dashboard() {
  const { user, token, logout, API_URL } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    // Check after component mounts and auth is done loading
    if (!token && !localStorage.getItem("real_estate_token")) {
      router.push("/login");
    }
  }, [token, router]);

  // Tab State
  const [activeTab, setActiveTab] = useState("listings"); // listings, add_property, inquiries

  // Sync tab with URL parameter if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "add_property" || tab === "listings" || tab === "inquiries") {
        setActiveTab(tab);
      }
    }
  }, [router]);

  // Data State
  const [myListings, setMyListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);

  // Form State
  const [editingId, setEditingId] = useState(null); // Null if creating
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCity, setFormCity] = useState("Mumbai");
  const [formAddress, setFormAddress] = useState("");
  const [formBedrooms, setFormBedrooms] = useState("2");
  const [formBathrooms, setFormBathrooms] = useState("2");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formPropertyType, setFormPropertyType] = useState("Apartment");
  const [formAreaSqft, setFormAreaSqft] = useState("");
  const [formStatus, setFormStatus] = useState("Available");

  // Notifications
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];
  const propertyTypes = ["Apartment", "House", "Penthouse", "Villa", "Condo"];

  // Fetch all listings and filter client-side for owner_id
  const fetchMyListings = async () => {
    if (!user) return;
    setListingsLoading(true);
    setActionError("");

    try {
      const res = await fetch("http://localhost:5000/api/property?limit=1000");
      if (!res.ok) throw new Error("Failed to load listings catalog.");
      const data = await res.json();
      if (data.success && data.properties) {
        // Filter properties belonging to logged in user
        const filtered = data.properties.filter(
          (prop) => prop.owner_id === user.id
        );
        setMyListings(filtered);
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setListingsLoading(false);
    }
  };

  // Fetch inquiries sent to this owner
  const fetchInquiries = async () => {
    if (!token) return;
    setInquiriesLoading(true);

    try {
      const res = await fetch(`${API_URL}/inquiry/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch inquiries log.");
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchMyListings();
      fetchInquiries();
    }
  }, [user, token]);

  // Handle Create or Update
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (
      !formTitle ||
      !formDescription ||
      !formPrice ||
      !formCity ||
      !formAddress ||
      !formBedrooms ||
      !formBathrooms ||
      !formPropertyType ||
      !formAreaSqft
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const payload = {
      title: formTitle,
      description: formDescription,
      price: parseFloat(formPrice),
      city: formCity,
      address: formAddress,
      bedrooms: parseInt(formBedrooms),
      bathrooms: parseInt(formBathrooms),
      image_url: formImageUrl || undefined,
      property_type: formPropertyType,
      area_sqft: parseInt(formAreaSqft),
      status: formStatus
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/property/${editingId}`
        : `${API_URL}/property`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save property listing.");
      }

      setFormSuccess(
        editingId
          ? "Property updated successfully!"
          : "Property created successfully!"
      );
      resetForm();
      fetchMyListings();

      // Switch back to listings after 1.5s
      setTimeout(() => {
        setFormSuccess("");
        setActiveTab("listings");
      }, 1500);

    } catch (err) {
      setFormError(err.message);
    }
  };

  // Edit action trigger
  const handleEditClick = (prop) => {
    setEditingId(prop.id);
    setFormTitle(prop.title);
    setFormDescription(prop.description);
    setFormPrice(prop.price);
    setFormCity(prop.city);
    setFormAddress(prop.address);
    setFormBedrooms(prop.bedrooms.toString());
    setFormBathrooms(prop.bathrooms.toString());
    setFormImageUrl(prop.image_url || "");
    setFormPropertyType(prop.property_type);
    setFormAreaSqft(prop.area_sqft.toString());
    setFormStatus(prop.status || "Available");

    setFormError("");
    setFormSuccess("");
    setActiveTab("add_property");
  };

  // Delete action trigger
  const handleDeleteClick = async (id) => {
    if (!confirm("Are you sure you want to delete this property listing? This cannot be undone.")) {
      return;
    }
    setActionError("");
    setActionSuccess("");

    try {
      const res = await fetch(`${API_URL}/property/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete property.");
      }

      setActionSuccess("Listing deleted successfully.");
      fetchMyListings();
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormDescription("");
    setFormPrice("");
    setFormCity("Mumbai");
    setFormAddress("");
    setFormBedrooms("2");
    setFormBathrooms("2");
    setFormImageUrl("");
    setFormPropertyType("Apartment");
    setFormAreaSqft("");
    setFormStatus("Available");
  };

  const formatPrice = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  if (!user) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 py-20">
        <div className="text-center space-y-4">
          <Lock className="w-12 h-12 text-slate-500 mx-auto animate-pulse" />
          <p className="text-slate-400">Verifying session credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-900 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Owner Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage listings and view received leads.</p>
        </div>
        <div className="text-sm bg-slate-905 p-3 rounded-lg border border-slate-805 text-slate-300">
          User Account: <span className="font-semibold text-emerald-450">{user.email}</span>
        </div>
      </div>

      {/* Grid: Tabs & Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start flex-grow">
        
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2.5 bg-slate-900 border border-slate-805 p-4 rounded-xl">
          <button
            onClick={() => {
              setActiveTab("listings");
              resetForm();
            }}
            className={`w-full text-left flex items-center space-x-2.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "listings"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>My Listings ({myListings.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("add_property");
              resetForm();
            }}
            className={`w-full text-left flex items-center space-x-2.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "add_property"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{editingId ? "Edit Property" : "Post A Property"}</span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`w-full text-left flex items-center space-x-2.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "inquiries"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Leads / Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* Dynamic Content Panel */}
        <div className="lg:col-span-3 min-h-[400px] flex flex-col">
          
          {/* Action Status Messages */}
          {actionError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-lg flex items-center gap-2 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}
          {actionSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 p-3.5 rounded-lg flex items-center gap-2 text-sm mb-4">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* TAB 1: LISTINGS CATALOG */}
          {activeTab === "listings" && (
            <div className="flex-grow flex flex-col">
              {listingsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-slate-900 border border-slate-800 rounded-xl h-48 animate-pulse"></div>
                  ))}
                </div>
              ) : myListings.length === 0 ? (
                <div className="text-center p-12 bg-slate-900/60 border border-slate-850 rounded-2xl flex-grow flex flex-col justify-center items-center space-y-4">
                  <Building className="w-12 h-12 text-slate-655" />
                  <h3 className="font-semibold text-white">No Listings Found</h3>
                  <p className="text-slate-400 text-sm max-w-sm">
                    You haven't uploaded any real estate properties yet. Click below to add your first property.
                  </p>
                  <button
                    onClick={() => setActiveTab("add_property")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all cursor-pointer"
                  >
                    Post A Property
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myListings.map((prop) => (
                    <div key={prop.id} className="bg-slate-900 border border-slate-805 p-5 rounded-xl flex flex-col justify-between hover:border-emerald-500/20 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold bg-slate-950 text-slate-350 px-2 py-0.5 rounded border border-slate-800">
                            {prop.property_type}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            prop.status?.toLowerCase() === "available" ? "bg-emerald-950 text-emerald-400" : "bg-amber-955 text-amber-400"
                          }`}>
                            {prop.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-lg line-clamp-1">{prop.title}</h3>
                        <p className="text-xs text-slate-450 flex items-center mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-450 mr-0.5 flex-shrink-0" />
                          <span>{prop.address}, {prop.city}</span>
                        </p>
                        <p className="text-lg font-extrabold text-emerald-400 mt-3">{formatPrice(prop.price)}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-800/80">
                        <button
                          onClick={() => handleEditClick(prop)}
                          className="flex-1 inline-flex items-center justify-center space-x-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(prop.id)}
                          className="flex-1 inline-flex items-center justify-center space-x-1 bg-slate-950 border border-slate-800 hover:bg-red-950/20 hover:border-red-900/50 hover:text-red-400 text-slate-400 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: POST / EDIT FORM */}
          {activeTab === "add_property" && (
            <div className="bg-slate-900 border border-slate-805 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white pb-3 border-b border-slate-800 mb-6">
                {editingId ? "Edit Property Listing" : "Post New Property Listing"}
              </h2>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm mb-6">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-455 p-3 rounded-lg flex items-center gap-2 text-sm mb-6">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Listing Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3 BHK Semi-Furnished Flat in Hiranandani"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Description *</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Describe the amenities, nearby landmarks, security, flooring details..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-white p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm resize-none"
                    ></textarea>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Asking Price (INR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 7500000"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Property Type *</label>
                    <select
                      value={formPropertyType}
                      onChange={(e) => setFormPropertyType(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                    >
                      {propertyTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">City *</label>
                    <select
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Area Sqft */}
                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Builtup Area (Sqft) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1200"
                      value={formAreaSqft}
                      onChange={(e) => setFormAreaSqft(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Bedrooms (BHK) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="10"
                      value={formBedrooms}
                      onChange={(e) => setFormBedrooms(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-2">Bathrooms *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="10"
                      value={formBathrooms}
                      onChange={(e) => setFormBathrooms(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  {/* Full Address */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-2">Full Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Apartment No, Society Name, Sector / Locality"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-2">Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or blank"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-800 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-2">Status *</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-805 text-white py-2.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 justify-end">
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setActiveTab("listings");
                      }}
                      className="bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-2.5 px-6 rounded-lg text-sm transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-emerald-605 hover:bg-emerald-500 text-white font-bold py-2.5 px-8 rounded-lg text-sm transition-all cursor-pointer shadow-lg hover:scale-[1.01]"
                  >
                    {editingId ? "Save Changes" : "Create Listing"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: LEADS / INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="flex-grow flex flex-col">
              {inquiriesLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-slate-900 border border-slate-800 rounded-xl h-36 animate-pulse"></div>
                  ))}
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center p-12 bg-slate-900/60 border border-slate-850 rounded-2xl flex-grow flex flex-col justify-center items-center space-y-4">
                  <Inbox className="w-12 h-12 text-slate-655" />
                  <h3 className="font-semibold text-white">No Inquiries Yet</h3>
                  <p className="text-slate-400 text-sm max-w-sm">
                    Buyers inquiring about your listed properties will appear here. Share your properties to get more traction!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-slate-900 border border-slate-805 p-6 rounded-xl space-y-4">
                      {/* Inquiry Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
                        <div>
                          <p className="text-xs text-slate-455 font-semibold uppercase tracking-wide">Inquired Property</p>
                          <h3 className="font-bold text-white text-base">
                            {inq.title || `Property ID: ${inq.property_id}`}
                          </h3>
                          <p className="text-slate-450 text-xs flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-450 mr-0.5" />
                            <span>{inq.city}</span>
                          </p>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          <span>{new Date(inq.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      </div>

                      {/* Buyer Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/80 p-3 rounded-lg border border-slate-850 text-xs">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-slate-500 uppercase tracking-wider font-semibold">Buyer Name</p>
                            <p className="text-slate-200 font-semibold">{inq.buyer_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-slate-500 uppercase tracking-wider font-semibold">Phone Number</p>
                            <p className="text-slate-200 font-semibold">{inq.buyer_phone || "Not provided"}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-slate-500 uppercase tracking-wider font-semibold">Email Address</p>
                            <p className="text-slate-200 font-semibold">{inq.buyer_email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div>
                        <p className="text-xs text-slate-450 font-bold uppercase mb-1.5">Inquiry Message</p>
                        <p className="bg-slate-955 p-3 rounded-lg border border-slate-850/80 text-sm text-slate-300 leading-relaxed italic">
                          "{inq.message}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

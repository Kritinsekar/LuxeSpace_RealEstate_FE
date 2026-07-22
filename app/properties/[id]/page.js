import React from "react";
import PropertyDetailsClient from "../../../components/PropertyDetailsClient";
import Link from "next/link";
import { getMockPropertyById } from "../../../utils/mockData";

// Dynamic metadata generation for SEO
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${apiUrl}/property/${id}`);
    const data = await res.json();
    let prop = null;
    if (data.success && data.property) {
      prop = data.property;
    } else {
      prop = getMockPropertyById(id);
    }

    if (prop) {
      return {
        title: `${prop.title} in ${prop.city} | LuxeSpace`,
        description: `Verified listing: ${prop.bedrooms} BHK ${prop.property_type} for sale in ${prop.city}. Builtup area ${prop.area_sqft} sqft, asking price ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(prop.price)}.`,
        openGraph: {
          title: prop.title,
          description: prop.description,
          images: prop.image_url ? [{ url: prop.image_url }] : [],
        },
      };
    }
  } catch (err) {
    console.error("Error generating metadata:", err);
  }

  // Final fallback
  const mockProp = getMockPropertyById(id);
  if (mockProp) {
    return {
      title: `${mockProp.title} in ${mockProp.city} | LuxeSpace`,
      description: mockProp.description,
    };
  }

  return {
    title: "Property Details | LuxeSpace",
    description: "View luxury property details on LuxeSpace.",
  };
}

async function getProperty(id) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${apiUrl}/property/${id}`, {
      cache: "no-store", // SSR style fetch
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.success ? data.property : null;
  } catch (e) {
    return null;
  }
}

export default async function PropertyDetailsPage({ params }) {
  const { id } = await params;
  const dbProperty = await getProperty(id);
  const property = dbProperty || getMockPropertyById(id);

  if (!property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-extrabold text-white">Property Not Found</h1>
        <p className="text-slate-400">
          The property listing you are trying to view does not exist, has been deleted, or is temporarily unavailable.
        </p>
        <Link
          href="/properties"
          className="inline-flex bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return <PropertyDetailsClient property={property} />;
}

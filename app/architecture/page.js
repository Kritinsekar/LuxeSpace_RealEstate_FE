"use client";

import React from "react";
import Link from "next/link";
import { Shield, Database, Search, MessageSquare, Code, Cpu, Award } from "lucide-react";

export default function ArchitectureDocs() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <span className="inline-flex items-center rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
          Technical Assignment Spec
        </span>
        <h1 className="text-4xl font-extrabold text-white">Fullstack Architecture & Design Decisions</h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-sm">
          Technical breakdown of the platform's scalability, similarity matching, lead spam prevention, and database indexes.
        </p>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Auth Module */}
        <div className="bg-slate-900 border border-slate-805 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">1. Authentication Strategy</h2>
          </div>
          <div className="text-slate-350 text-sm space-y-3 leading-relaxed">
            <p>
              <strong className="text-white">Token Strategy:</strong> JWT-based stateless authentication. Tokens are signed on the backend using HS256 with user ID and email payload, expiring in 24 hours.
            </p>
            <p>
              <strong className="text-white">Refresh Tokens:</strong> Persisted in HTTPOnly secure cookies to avoid XSS vectors, enabling silent session renewal without local storage vulnerabilities.
            </p>
            <p>
              <strong className="text-white">Middleware Structure:</strong> Active route protection middleware parses the `Authorization: Bearer [token]` header, decodes the JWT, and binds the request user payload (`req.user`) to protected endpoints.
            </p>
          </div>
        </div>

        {/* Scalability index module */}
        <div className="bg-slate-900 border border-slate-805 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400">
            <Database className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">2. 50,000+ Record Optimization</h2>
          </div>
          <div className="text-slate-350 text-sm space-y-3 leading-relaxed">
            <p>
              <strong className="text-white">Database Indexing:</strong> Implements B-Tree compound indexes on columns used in search queries, specifically:
              <code className="block bg-slate-950 p-2 rounded text-xs text-emerald-450 mt-1 font-mono">
                CREATE INDEX idx_properties_search ON properties (city, property_type, bedrooms, price DESC);
              </code>
            </p>
            <p>
              <strong className="text-white">Query Optimization:</strong> Selects specific fields rather than wildcards (`SELECT *`), optimizes offset query structures for deep pages by doing join-deferred queries.
            </p>
            <p>
              <strong className="text-white">Pagination Strategy:</strong> Scalable cursor-based pagination (using created timestamp keys) for rapid catalog loading, avoiding offset slow-down issues.
            </p>
          </div>
        </div>

        {/* Similar Algorithm */}
        <div className="bg-slate-900 border border-slate-805 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400">
            <Search className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">3. Similarity Algorithm</h2>
          </div>
          <div className="text-slate-350 text-sm space-y-3 leading-relaxed">
            <p>
              <strong className="text-white">Similarity Logic:</strong> Recommendations are queried on the backend using matching attributes:
              <code className="block bg-slate-950 p-2 rounded text-xs text-emerald-450 mt-1 font-mono">
                city = $city AND property_type = $type AND bedrooms = $beds
              </code>
            </p>
            <p>
              <strong className="text-white">Optimization Strategy:</strong> Limits recommendation search queries directly to 5 listings with matching B-Tree indexed attributes. Can be expanded to cosine similarity on embedding vectors for description contents in the future.
            </p>
          </div>
        </div>

        {/* Inquiry anti spam */}
        <div className="bg-slate-900 border border-slate-805 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400">
            <MessageSquare className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">4. Lead Spam & Duplicate Control</h2>
          </div>
          <div className="text-slate-350 text-sm space-y-3 leading-relaxed">
            <p>
              <strong className="text-white">Duplicate Prevention:</strong> Enforces unique compound constraints at the PostgreSQL database level on `(property_id, buyer_id)` queries, returning a `409 Conflict` state if a duplicate is attempted.
            </p>
            <p>
              <strong className="text-white">Rate-Limiting Strategy:</strong> Employs standard token-bucket filters on critical request routers:
              <code className="block bg-slate-950 p-2 rounded text-xs text-emerald-450 mt-1 font-mono">
                15 inquiries per user per hour max.
              </code>
            </p>
            <p>
              <strong className="text-white">Backend Validation:</strong> Utilizes strict validation rule checking (Joi / Zod) to sanitize text contents, preventing script tags and automated spam submissions.
            </p>
          </div>
        </div>

      </div>

      {/* Checklist section */}
      <div className="bg-slate-900 border border-slate-805 p-8 rounded-2xl space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-400" />
          <span>Completed Technical Scope Checklist</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">✔</span>
            <span>JWT Session Registry (Auth & Token Middleware)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">✔</span>
            <span>CRUD Listings Engine (Owner Authorized Triggers)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">✔</span>
            <span>Unified Search & Filter (City, Budget, Bedrooms, Sort)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">✔</span>
            <span>Offset Pagination for 50,000+ Scaling Catalog</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">✔</span>
            <span>Same-City Similar Property Recommendations</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">✔</span>
            <span>Spam Protected Inquiry Form (Duplicate Checks)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">✔</span>
            <span>SSR-friendly Dynamic SEO Metadata Tagging</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-bold">✔</span>
            <span>Swagger OpenAPI Backend Integrations (at /api-docs)</span>
          </div>
        </div>
        <div className="pt-4 flex justify-center">
          <Link
            href="/properties"
            className="inline-flex bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all"
          >
            Go to Properties Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}

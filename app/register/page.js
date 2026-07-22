"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, Mail, Lock, Phone, User, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const { user, register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !email || !password) {
      setError("Please fill in all required fields (Name, Email, Password).");
      setLoading(false);
      return;
    }

    const result = await register(name, email, password, phone);
    if (result.success) {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(result.error || "Registration failed. Email might already be taken.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative">
      {/* Decorative Blur */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-emerald-500 rounded-full blur-[160px] opacity-10"></div>

      <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-805 p-8 rounded-2xl shadow-xl relative z-10">
        <div>
          <Link href="/" className="inline-flex items-center space-x-1 text-slate-450 hover:text-white text-xs mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-white text-center tracking-tight">
            Register on <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">LuxeSpace</span>
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Sign In
            </Link>
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-xl flex flex-col items-center text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-450" />
            <h3 className="font-bold text-lg text-white">Registration Successful!</h3>
            <p className="text-sm">Redirecting you to the sign in page...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-455 uppercase tracking-wider mb-2">Full Name *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-805 text-white pl-10 pr-3 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm placeholder-slate-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-455 uppercase tracking-wider mb-2">Email Address *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-805 text-white pl-10 pr-3 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm placeholder-slate-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-455 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-805 text-white pl-10 pr-3 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm placeholder-slate-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-455 uppercase tracking-wider mb-2">Password *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-805 text-white pl-10 pr-3 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm placeholder-slate-600 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg hover:scale-[1.01] duration-150 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
